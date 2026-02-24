const admin = require('@/config/firebase');
const notificationModel = require('@/models/notifications/notifications.model');
const fcmTokenModel = require('@/models/fcmToken/fcmToken.model');
const campaignModel = require('@/models/campaign/campaign.model');
const logger = require('@/utils/logger');
const db = require('@/config/database');

/**
 * Log notification delivery
 */
async function logDelivery(notificationId, userId, deliveryType, status, errorMessage = null) {
    const query = `
      INSERT INTO notification_delivery_log (
        notification_id, user_id, delivery_type, status, error_message
        )
      VALUES ($1, $2, $3, $4, $5)
    `;

    await db.query(query, [notificationId, userId, deliveryType, status, errorMessage]);
}


/**
 * Send push notification via FCM
 */
async function sendPushNotification(userId, notification) {
    try {
        const tokens = await fcmTokenModel.getActiveTokens(userId);

        if (tokens.length === 0) {
            logger.debug(`No FCM tokens found for user ${userId}`);
            return { success: false, reason: 'NO_TOKENS' };
        }

        const notificationData = {};
        if (notification.data) {
            Object.keys(notification.data).forEach(key => {
                notificationData[key] = String(notification.data[key]);
            });
        }

        const message = {
            notification: {
                title: notification.title,
                body: notification.message,
            },
            data: {
                notification_id: notification.id,
                category: notification.category,
                screen_redirect: notification.screen_redirect || '',
                ...notificationData,
            },
            tokens: tokens,
        };

        const response = await admin.admin.messaging().sendEachForMulticast(message);

        // Handle invalid tokens
        if (response.failureCount > 0) {
            const invalidationPromises = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success && resp.error) {
                    const errorCode = resp.error.code;
                    if (errorCode === 'messaging/invalid-registration-token' ||
                        errorCode === 'messaging/registration-token-not-registered') {
                        invalidationPromises.push(fcmTokenModel.deactivateToken(tokens[idx]));
                    }
                }
            });
            await Promise.all(invalidationPromises);
        }

        // Log delivery
        await logDelivery(notification.id, userId, 'PUSH',
            response.successCount > 0 ? 'SUCCESS' : 'FAILED',
            response.successCount > 0 ? null : 'All tokens failed'
        );

        logger.info(`Push sent to user ${userId}: ${response.successCount}/${tokens.length} successful`);

        return {
            success: response.successCount > 0,
            successCount: response.successCount,
            failureCount: response.failureCount,
        };
    } catch (error) {
        logger.error('Send push notification error:', error);
        await logDelivery(notification.id, userId, 'PUSH', 'FAILED', error.message);
        return { success: false, error: error.message };
    }
}

/**
     * Send notification to a single user
     */
async function sendToUser(userId, notificationData) {
    try {
        // Create notification in database

        const notification = await notificationModel.create({
            user_id: userId,
            ...notificationData,
        });


        // Send push notification if enabled
        if (notificationData.delivery_mode === 'PUSH' || notificationData.delivery_mode === 'BOTH') {
            await sendPushNotification(userId, notification);
        }

        logger.info(`Notification sent to user ${userId}: ${notification.title}`);
        return notification;
    } catch (error) {
        logger.error('Send notification error:', error);
        throw error;
    }
}

/**
    * Send bulk notifications (for campaigns)
    */
async function sendBulkNotifications(userIds, notificationData) {
    const results = {
        total: userIds.length,
        success: 0,
        failed: 0,
        errors: [],
    };

    const batchSize = 100;
    for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (userId) => {

            try {
                await sendToUser(userId, notificationData);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({ userId, error: error.message });
            }
        });
        await Promise.all(batchPromises);
    }

    return results;
}


/**
 * Get all active users
 */
async function getAllActiveUsers() {
    const query = `
      SELECT id FROM users
      WHERE status = 'ACTIVE'
    `;
    const result = await db.query(query);
    return result.rows.map(row => row.id);
}

/**
 * Get users by segment
 */
async function getUsersBySegment(segment) {
    // Implement segment logic based on your requirements
    // Examples: ACTIVE_USERS, GAME_PLAYERS, WALLET_USERS, etc.

    let query = 'SELECT id FROM users WHERE status = \'ACTIVE\'';

    if (segment === 'GAME_PLAYERS') {
        query += ' AND id IN (SELECT DISTINCT user_id FROM game_history)';
    } else if (segment === 'WALLET_USERS') {
        query += ' AND id IN (SELECT DISTINCT user_id FROM wallets WHERE coin_balance > 0)';
    }
    else if (segment === 'QUIZ_PLAYERS') {
        query += ' AND id IN (SELECT DISTINCT user_id FROM quiz_sessions)';
    } else if (segment === 'TOURNAMENT_PLAYERS') {
        query += ' AND id IN (SELECT DISTINCT user_id FROM quiz_sessions WHERE slot_id IS NOT NULL)';
    }

    const result = await db.query(query);
    return result.rows.map(row => row.id);
}


class NotificationService {


    /**
     * Process notification campaign
     */
    async processCampaign(campaignId) {
        try {
            const campaign = await campaignModel.findById(campaignId);

            if (!campaign) {
                throw new Error('Campaign not found');
            }

            if (campaign.status !== 'SCHEDULED' && campaign.status !== 'CREATED') {
                throw new Error(`Campaign cannot be processed in status: ${campaign.status}`);
            }

            // Update status to processing
            await campaignModel.updateStatus(campaignId, 'PROCESSING');

            // Get target users
            let userIds = [];

            if (campaign.target_type === 'ALL') {
                userIds = await getAllActiveUsers();
            } else if (campaign.target_type === 'SEGMENT') {
                userIds = await getUsersBySegment(campaign.target_segment);
            } else if (campaign.target_type === 'CUSTOM') {
                userIds = await campaignModel.getTargetUsers(campaignId);
            }

            // Update total users count
            await campaignModel.updateStatus(campaignId, 'PROCESSING', {
                total_users: userIds.length
            });

            // Send notifications
            const notificationData = {
                title: campaign.title,
                message: campaign.message,
                category: campaign.category,
                screen_redirect: campaign.screen_redirect,
                data: campaign.data,
                campaign_id: campaignId,
            };

            const results = await sendBulkNotifications(userIds, notificationData);

            // Update campaign status
            await campaignModel.updateStatus(campaignId, 'SENT', {
                sent_count: results.success,
                failed_count: results.failed,
            });

            logger.info(`Campaign ${campaignId} completed: ${results.success}/${results.total} sent`);

            return results;
        } catch (error) {
            logger.error('Process campaign error:', error);
            await campaignModel.updateStatus(campaignId, 'FAILED');
            throw error;
        }
    }



    /**
     * System-triggered notifications
     */
    async sendSystemNotification(userId, type, data = {}) {
        const notifications = {
            REFERRAL_COMPLETED: {
                title: '🎉 Referral Reward Earned!',
                message: `You earned ${data.coins} coins! Your friend joined using your referral code.`,
                category: 'SYSTEM',
                screen_redirect: 'ReferralScreen',
            },
            TOURNAMENT_ENDING: {
                title: '⏰ Tournament Ending Soon!',
                message: `${data.tournamentName} ends in ${data.minutesLeft} minutes. Join now!`,
                category: 'GAME',
                screen_redirect: 'TournamentScreen',
            },
            WALLET_CREDITED: {
                title: '💰 Wallet Updated',
                message: `${data.amount} coins added to your wallet`,
                category: 'SYSTEM',
                screen_redirect: 'WalletScreen',
            },
            WALLET_DEBITED: {
                title: '💸 Coins Deducted',
                message: `${data.amount} coins deducted from your wallet for ${data.reason}`,
                category: 'SYSTEM',
                screen_redirect: 'WalletScreen',
                delivery_mode: 'BOTH',
            },
            // Quiz Practice Mode notifications
            PRACTICE_REFUND: {
                title: '🎯 Practice Refund',
                message: `Great job! You scored ${data.scorePercentage}%. ${data.refundCoins} coins refunded to your wallet.`,
                category: 'GAME',
                screen_redirect: 'WalletScreen',
                delivery_mode: 'BOTH',
            },
            PRACTICE_NO_REFUND: {
                title: '📚 Keep Practicing',
                message: `You scored ${data.scorePercentage}%. Score 60% or more to earn refund coins!`,
                category: 'GAME',
                screen_redirect: 'HomeScreen',
                delivery_mode: 'BOTH',
            },
            // Tournament Result notifications
            TOURNAMENT_RESULT_PERSONAL: {
                title: '🏆 Tournament Result',
                message: data.rank <= 3
                    ? `Congratulations! You ranked #${data.rank} and won ${data.coinsWon} coins!`
                    : `You ranked #${data.rank} in the tournament. Keep improving!`,
                category: 'GAME',
                screen_redirect: 'TournamentResultScreen',
                delivery_mode: 'BOTH',
            },
            TOURNAMENT_RESULT_FULL: {
                title: '📊 Tournament Leaderboard',
                message: `View complete results for ${data.tournamentName}`,
                category: 'INFO',
                screen_redirect: 'TournamentResultScreen',
                delivery_mode: 'IN_APP',
            },

            GAME_RESULT: {
                title: '🎮 Game Results',
                message: data.message,
                category: 'GAME',
                screen_redirect: 'ResultsScreen',
                delivery_mode: 'BOTH',

            },
            WEEKLY_RESULTS: {
                title: '🎮 Game Results',
                message: data.message,
                category: 'GAME',
                screen_redirect: 'ResultsScreen',
                delivery_mode: 'BOTH',

            },
            LOGIN_SUCCESS: {
                title: '🎮 Login Successful',
                message: data.message,
                category: 'SYSTEM',
                screen_redirect: null,
                delivery_mode: 'PUSH',
            },
        };

        const notification = notifications[type];
        if (!notification) {
            throw new Error(`Unknown notification type: ${type}`);
        }

        return await sendToUser(userId, {
            ...notification,
            data,
        });
    }


    /**
     * Send practice mode result notification
     */
    async sendPracticeResult(userId, sessionData) {
        try {
            const { score, totalQuestions, refundCoins } = sessionData;
            const scorePercentage = Math.round((score / totalQuestions) * 100);

            if (refundCoins > 0) {
                await this.sendSystemNotification(userId, 'PRACTICE_REFUND', {
                    scorePercentage,
                    refundCoins,
                    score,
                    totalQuestions,
                });
            } else {
                await this.sendSystemNotification(userId, 'PRACTICE_NO_REFUND', {
                    scorePercentage,
                    score,
                    totalQuestions,
                });
            }
        } catch (error) {
            logger.error('Send practice result error:', error);
            // Don't throw - notification failure shouldn't break practice completion
        }
    }


}

module.exports = new NotificationService();