const walletModel = require('@/models/wallet/wallet.model');
const transactionModel = require('@/models/wallet/transaction.model');
const logger = require('@/utils/logger');
const db = require('@/config/database');

class WalletService {
    /**
     * Get or create user wallet
     */
    async getOrCreateWallet(userId) {
        try {
            return await walletModel.getOrCreate(userId);
        } catch (error) {
            logger.error('Get or create wallet error:', error);
            throw error;
        }
    }

    /**
     * Get wallet balance
     */
    async getBalance(userId) {
        try {
            const wallet = await walletModel.findByUserId(userId);
            if (!wallet) {
                // Create wallet if doesn't exist
                const newWallet = await walletModel.create(userId);
                return newWallet;
            }
            return wallet;
        } catch (error) {
            logger.error('Get balance error:', error);
            throw error;
        }
    }

    /**
     * Credit coins to wallet
     */
    async creditCoins(userId, amount, transactionType, metadata = {}) {
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            // Get or create wallet
            let wallet = await walletModel.findByUserId(userId);
            if (!wallet) {
                wallet = await walletModel.create(userId);
            }

            if (wallet.status !== 'ACTIVE') {
                throw new Error('Wallet is not active');
            }

            const balanceBefore = wallet.coin_balance;
            const balanceAfter = balanceBefore + amount;

            // Update wallet balance
            const updatedWallet = await walletModel.updateBalance(wallet.id, amount, 'CREDIT');

            // Create transaction record
            const transaction = await transactionModel.create({
                user_id: userId,
                wallet_id: wallet.id,
                transaction_type: transactionType,
                amount: amount,
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                description: this.getTransactionDescription(transactionType, amount, metadata),
                reference_type: metadata.reference_type || null,
                reference_id: metadata.reference_id || metadata.slot_id || metadata.session_id || null,
                metadata: metadata,
                status: 'COMPLETED'
            });

            await client.query('COMMIT');

            logger.info(`Credited ${amount} coins to user ${userId}. New balance: ${balanceAfter}`);

            return {
                wallet: updatedWallet,
                transaction,
                balance: balanceAfter
            };
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Credit coins error:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Deduct coins from wallet
     */
    async deductCoins(userId, amount, transactionType, metadata = {}) {
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            // Get wallet
            const wallet = await walletModel.findByUserId(userId);
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            if (wallet.status !== 'ACTIVE') {
                throw new Error('Wallet is not active');
            }

            // Check sufficient balance
            if (wallet.coin_balance < amount) {
                throw new Error('Insufficient balance');
            }

            const balanceBefore = wallet.coin_balance;
            const balanceAfter = balanceBefore - amount;

            // Update wallet balance (negative amount for deduction)
            const updatedWallet = await walletModel.updateBalance(wallet.id, -amount, 'DEBIT');

            // Create transaction record
            const transaction = await transactionModel.create({
                user_id: userId,
                wallet_id: wallet.id,
                transaction_type: transactionType,
                amount: -amount, // Negative for debit
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                description: this.getTransactionDescription(transactionType, amount, metadata),
                reference_type: metadata.reference_type || null,
                reference_id: metadata.reference_id || metadata.slot_id || metadata.session_id || metadata.sub_category_id || null,
                metadata: metadata,
                status: 'COMPLETED'
            });

            await client.query('COMMIT');

            logger.info(`Deducted ${amount} coins from user ${userId}. New balance: ${balanceAfter}`);

            return {
                wallet: updatedWallet,
                transaction,
                balance: balanceAfter
            };
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Deduct coins error:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get transaction history
     */
    async getTransactionHistory(userId, options = {}) {
        try {
            const { limit = 50, offset = 0, type = null } = options;

            let transactions;
            if (type) {
                transactions = await transactionModel.findByType(userId, type, limit, offset);
            } else {
                transactions = await transactionModel.findByUserId(userId, limit, offset);
            }

            const totalCount = await transactionModel.getCount(userId, type);

            return {
                transactions,
                pagination: {
                    total: totalCount,
                    limit,
                    offset,
                    hasMore: offset + limit < totalCount
                }
            };
        } catch (error) {
            logger.error('Get transaction history error:', error);
            throw error;
        }
    }

    /**
     * Get wallet summary
     */
    async getWalletSummary(userId) {
        try {
            const wallet = await this.getBalance(userId);
            const totalEarned = await transactionModel.getTotalEarned(userId);
            const totalSpent = await transactionModel.getTotalSpent(userId);

            return {
                current_balance: wallet.coin_balance,
                total_earned: totalEarned,
                total_spent: totalSpent,
                wallet_status: wallet.status,
                created_at: wallet.created_at
            };
        } catch (error) {
            logger.error('Get wallet summary error:', error);
            throw error;
        }
    }

    /**
     * Check if user has sufficient balance
     */
    async hasSufficientBalance(userId, amount) {
        try {
            const wallet = await walletModel.findByUserId(userId);
            return wallet && wallet.coin_balance >= amount;
        } catch (error) {
            logger.error('Check balance error:', error);
            throw error;
        }
    }

    /**
     * Get transaction description
     */
    getTransactionDescription(type, amount, metadata) {
        const descriptions = {
            REFERRAL_BONUS: `Referral bonus earned`,
            PRACTICE_ENTRY: `Practice mode entry fee`,
            PRACTICE_REFUND: `Practice mode refund (${metadata.score_percentage}% score)`,
            TOURNAMENT_ENTRY: `Tournament entry fee`,
            TOURNAMENT_REWARD: `Tournament reward - Rank #${metadata.rank}`,
            TOURNAMENT_CANCELLED_REFUND: `Tournament cancelled - Refund`,
            ADMIN_CREDIT: metadata.reason || 'Admin credit',
            ADMIN_DEBIT: metadata.reason || 'Admin debit',
            PURCHASE: metadata.item || 'Purchase',
            REWARD: metadata.reason || 'Reward',
            CREDIT: 'Coins credited',
            DEBIT: 'Coins debited'
        };

        return descriptions[type] || `${type} - ${amount} coins`;
    }

    /**
     * Reverse transaction (Admin only)
     */
    async reverseTransaction(transactionId, adminId, reason) {
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            const transaction = await transactionModel.findById(transactionId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }

            if (transaction.status === 'REVERSED') {
                throw new Error('Transaction already reversed');
            }

            // Reverse the amount
            const reverseAmount = -transaction.amount;

            if (reverseAmount > 0) {
                await this.creditCoins(transaction.user_id, reverseAmount, 'ADMIN_CREDIT', {
                    reason: `Reversal: ${reason}`,
                    original_transaction_id: transactionId,
                    reversed_by: adminId
                });
            } else {
                await this.deductCoins(transaction.user_id, Math.abs(reverseAmount), 'ADMIN_DEBIT', {
                    reason: `Reversal: ${reason}`,
                    original_transaction_id: transactionId,
                    reversed_by: adminId
                });
            }

            // Mark original transaction as reversed
            await client.query(
                'UPDATE wallet_transactions SET status = $1 WHERE id = $2',
                ['REVERSED', transactionId]
            );

            await client.query('COMMIT');

            logger.info(`Transaction ${transactionId} reversed by admin ${adminId}`);

            return { success: true, message: 'Transaction reversed successfully' };
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Reverse transaction error:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new WalletService();