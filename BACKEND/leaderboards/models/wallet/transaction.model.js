const db = require('@/config/database');

class WalletTransactionModel {
    /**
     * Create transaction
     */
    async create(transactionData) {
        const query = `
            INSERT INTO wallet_transactions (
                user_id, wallet_id, transaction_type, amount,
                balance_before, balance_after, description,
                reference_type, reference_id, metadata, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        const values = [
            transactionData.user_id,
            transactionData.wallet_id,
            transactionData.transaction_type,
            transactionData.amount,
            transactionData.balance_before,
            transactionData.balance_after,
            transactionData.description,
            transactionData.reference_type,
            transactionData.reference_id,
            JSON.stringify(transactionData.metadata || {}),
            transactionData.status || 'COMPLETED'
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Get user transactions
     */
    async findByUserId(userId, limit = 50, offset = 0) {
        const query = `
            SELECT * FROM wallet_transactions
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `;
        const result = await db.query(query, [userId, limit, offset]);
        return result.rows;
    }

    /**
     * Get transaction by ID
     */
    async findById(id) {
        const query = 'SELECT * FROM wallet_transactions WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Get transactions by type
     */
    async findByType(userId, transactionType, limit = 50, offset = 0) {
        const query = `
            SELECT * FROM wallet_transactions
            WHERE user_id = $1 AND transaction_type = $2
            ORDER BY created_at DESC
            LIMIT $3 OFFSET $4
        `;
        const result = await db.query(query, [userId, transactionType, limit, offset]);
        return result.rows;
    }

    /**
     * Get transaction count
     */
    async getCount(userId, transactionType = null) {
        let query = 'SELECT COUNT(*) FROM wallet_transactions WHERE user_id = $1';
        const params = [userId];

        if (transactionType) {
            query += ' AND transaction_type = $2';
            params.push(transactionType);
        }

        const result = await db.query(query, params);
        return parseInt(result.rows[0].count);
    }

    /**
     * Get total earned
     */
    async getTotalEarned(userId) {
        const query = `
            SELECT COALESCE(SUM(amount), 0) as total
            FROM wallet_transactions
            WHERE user_id = $1 AND amount > 0 AND status = 'COMPLETED'
        `;
        const result = await db.query(query, [userId]);
        return parseInt(result.rows[0].total);
    }

    /**
     * Get total spent
     */
    async getTotalSpent(userId) {
        const query = `
            SELECT COALESCE(SUM(ABS(amount)), 0) as total
            FROM wallet_transactions
            WHERE user_id = $1 AND amount < 0 AND status = 'COMPLETED'
        `;
        const result = await db.query(query, [userId]);
        return parseInt(result.rows[0].total);
    }
}

module.exports = new WalletTransactionModel();