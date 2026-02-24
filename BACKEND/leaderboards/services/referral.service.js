const referralModel = require('@/models/referral/referral.model');
const walletModel = require('@/models/wallet/wallet.model');
const userModel = require('@/models/user/user.model');
const db = require('@/config/database');
const logger = require('@/utils/logger');

class ReferralService {
    /**
     * Generate unique referral code
     */
    generateReferralCode(userId) {
        const prefix = 'REF';
        const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
        const userPart = userId.substring(0, 4).toUpperCase();
        return `${prefix}${randomPart}${userPart}`;
    }

    /**
     * Create referral code for user (called during registration)
     */
    async createReferralCodeForUser(userId) {
        try {
            const user = await userModel.findById(userId);

            if (user.referral_code) {
                return user.referral_code;
            }

            const referralCode = this.generateReferralCode(userId);

            const query = `
        UPDATE users
        SET referral_code = $1, referral_code_generated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING referral_code
      `;

            const result = await db.query(query, [referralCode, userId]);
            logger.info(`Referral code created for user ${userId}: ${referralCode}`);

            return result.rows[0].referral_code;
        } catch (error) {
            logger.error('Create referral code error:', error);
            throw error;
        }
    }

    /**
     * Validate referral code
     */
    async validateReferralCode(referralCode) {
        try {
            const query = 'SELECT id, referral_code, status FROM users WHERE referral_code = $1';
            const result = await db.query(query, [referralCode.toUpperCase()]);

            if (result.rows.length === 0) {
                return { valid: false, error: 'INVALID_CODE' };
            }

            const referrer = result.rows[0];

            if (referrer.status === 'BLOCKED') {
                return { valid: false, error: 'REFERRER_BLOCKED' };
            }

            return {
                valid: true,
                referrer_user_id: referrer.id,
            };
        } catch (error) {
            logger.error('Validate referral code error:', error);
            throw error;
        }
    }

    /**
     * Apply referral code (during new user registration)
     */
    async applyReferralCode(referralCode, newUserId, ipAddress, deviceFingerprint) {
        try {
            // Validate referral code
            const validation = await this.validateReferralCode(referralCode);

            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            const referrerId = validation.referrer_user_id;

            // Prevent self-referral
            if (referrerId === newUserId) {
                return { success: false, error: 'SELF_REFERRAL_NOT_ALLOWED' };
            }

            // Check for duplicate referral
            const existing = await referralModel.checkDuplicateReferral(referrerId, newUserId);
            if (existing) {
                return { success: false, error: 'REFERRAL_ALREADY_APPLIED' };
            }

            // Create referral record
            const referral = await referralModel.create({
                referrer_user_id: referrerId,
                referred_user_id: newUserId,
                referral_code: referralCode.toUpperCase(),
                status: 'APPLIED',
                ip_address: ipAddress,
                device_fingerprint: deviceFingerprint,
            });

            // Update user's referred_by field
            await db.query('UPDATE users SET referred_by = $1 WHERE id = $2', [referrerId, newUserId]);

            logger.info(`Referral applied: ${newUserId} referred by ${referrerId}`);

            return {
                success: true,
                referred_user_id: newUserId,
                referral_id: referral.id,
                status: 'applied',
                reward_pending: true,
            };
        } catch (error) {
            logger.error('Apply referral code error:', error);
            throw error;
        }
    }

    /**
     * Check and process referral eligibility
     * Called when user completes qualifying action
     */
    async processReferralEligibility(userId, action) {
        try {
            // Find referral for this user
            const referral = await referralModel.findByReferredUser(userId);

            if (!referral) {
                logger.debug(`No referral found for user ${userId}`);
                return null;
            }

            if (referral.status !== 'APPLIED' && referral.status !== 'PENDING') {
                logger.debug(`Referral already processed: ${referral.status}`);
                return null;
            }

            // Get current config
            const config = await this.getReferralConfig();

            // Check if action matches eligibility criteria
            if (config.eligibility_action !== action) {
                logger.debug(`Action ${action} does not match eligibility: ${config.eligibility_action}`);
                return null;
            }

            // Credit rewards (atomic transaction)
            await this.creditReferralRewards(referral, config);

            logger.info(`Referral completed for user ${userId}, action: ${action}`);

            return {
                success: true,
                coins_awarded: config.coins_per_referral,
            };
        } catch (error) {
            logger.error('Process referral eligibility error:', error);
            throw error;
        }
    }

    /**
     * Credit referral rewards (atomic transaction)
     */
    async creditReferralRewards(referral, config) {
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            // Credit referrer
            await walletModel.addCoins(
                referral.referrer_user_id,
                config.coins_per_referral,
                'REFERRAL_REWARD',
                referral.id,
                `Referral reward for inviting user`
            );

            // Credit referee (if configured)
            if (config.referee_bonus_coins > 0) {
                await walletModel.addCoins(
                    referral.referred_user_id,
                    config.referee_bonus_coins,
                    'REFERRAL_BONUS',
                    referral.id,
                    `Signup bonus for using referral code`
                );
            }

            // Update referral status
            await referralModel.updateStatus(referral.id, 'COMPLETED', config.coins_per_referral);

            const notificationService = require('@/services/notification.service');
            await notificationService.sendSystemNotification(
                referral.referrer_user_id,
                'REFERRAL_COMPLETED',
                { coins: config.coins_per_referral }
            );

            await client.query('COMMIT');

            logger.info(`Referral rewards credited: ${config.coins_per_referral} coins to user ${referral.referrer_user_id}`);
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Credit referral rewards error:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get referral summary for user
     */
    async getReferralSummary(userId) {
        try {
            const user = await userModel.findById(userId);
            const stats = await referralModel.getReferralStats(userId);
            const config = await this.getReferralConfig();
            const wallet = await walletModel.findByUserId(userId);

            return {
                referral_code: user.referral_code,
                reward_per_referral: config.coins_per_referral,
                total_referrals: parseInt(stats.total_referrals) || 0,
                completed_referrals: parseInt(stats.completed_referrals) || 0,
                pending_referrals: parseInt(stats.pending_referrals) || 0,
                total_earned_coins: parseInt(stats.total_earned_coins) || 0,
                current_coin_balance: wallet ? wallet.coin_balance : 0,
                terms_url: process.env.REFERRAL_TERMS_URL || 'https://jeetx.com/terms',
            };
        } catch (error) {
            logger.error('Get referral summary error:', error);
            throw error;
        }
    }

    /**
     * Get referral configuration
     */
    async getReferralConfig() {
        const query = 'SELECT * FROM referral_config WHERE is_active = true ORDER BY created_at DESC LIMIT 1';
        const result = await db.query(query);

        if (result.rows.length === 0) {
            // Return default config
            return {
                coins_per_referral: 50,
                referee_bonus_coins: 0,
                eligibility_action: 'FIRST_WALLET_ADD',
                max_referrals_per_user: null,
                referral_expiry_days: null,
            };
        }

        return result.rows[0];
    }

    /**
     * Get referral history
     */
    async getReferralHistory(userId, limit = 50) {
        const query = `
      SELECT 
        r.id,
        r.referral_code,
        r.status,
        r.coins_awarded,
        r.created_at,
        r.completed_at,
        u.full_name as referred_user_name,
        u.email as referred_user_email
      FROM referrals r
      JOIN users u ON r.referred_user_id = u.id
      WHERE r.referrer_user_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2
    `;

        const result = await db.query(query, [userId, limit]);
        return result.rows;
    }
}

module.exports = new ReferralService();