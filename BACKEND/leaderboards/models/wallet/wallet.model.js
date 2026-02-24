const db = require('@/config/database');

class WalletModel {
    async create(userId, coin_balance = 0) {
        const query = `
            INSERT INTO wallets (user_id, coin_balance, total_earned, total_spent)
            VALUES ($1, $2, 0, 0)
            RETURNING *
        `;
        const result = await db.query(query, [userId, coin_balance]);
        return result.rows[0];
    }

    async findByUserId(userId) {
        const query = 'SELECT * FROM wallets WHERE user_id = $1';
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    async getOrCreate(userId) {
        let wallet = await this.findByUserId(userId);
        if (!wallet) {
            wallet = await this.create(userId);
        }
        return wallet;
    }


    /**
     * Update balance
     */
    async updateBalance(walletId, amount, type) {
        const query = `
            UPDATE wallets
            SET coin_balance = coin_balance + $1,
                total_earned = total_earned + CASE WHEN $1 > 0 THEN $1 ELSE 0 END,
                total_spent = total_spent + CASE WHEN $1 < 0 THEN ABS($1) ELSE 0 END,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        const result = await db.query(query, [amount, walletId]);
        return result.rows[0];
    }


    /**
    * Freeze wallet
    */
    async freezeWallet(userId) {
        const query = `
            UPDATE wallets SET status = 'FROZEN', updated_at = NOW()
            WHERE user_id = $1
            RETURNING *
        `;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    /**
    * Unfreeze wallet
    */
    async unfreezeWallet(userId) {
        const query = `
            UPDATE wallets SET status = 'ACTIVE', updated_at = NOW()
            WHERE user_id = $1
            RETURNING *
        `;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    async getBalance(userId) {
        const wallet = await this.findByUserId(userId);
        return wallet ? wallet.coin_balance : 0;
    }

    async addCoins(userId, coins, source, referenceId, description) {
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            // Get or create wallet
            let wallet = await this.findByUserId(userId);
            if (!wallet) {
                wallet = await this.create(userId);
            }

            const balanceBefore = wallet.coin_balance;
            const balanceAfter = balanceBefore + coins;

            // Update wallet balance
            const updateQuery = `
        UPDATE wallets
        SET coin_balance = coin_balance + $1
        WHERE user_id = $2
        RETURNING *
      `;
            const updateResult = await client.query(updateQuery, [coins, userId]);

            // Create transaction record
            const txQuery = `
        INSERT INTO wallet_transactions (
          user_id, wallet_id, coins, transaction_type,
          source, reference_id, description,
          balance_before, balance_after
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

            await client.query(txQuery, [
                userId,
                wallet.id,
                coins,
                'CREDIT',
                source,
                referenceId,
                description,
                balanceBefore,
                balanceAfter,
            ]);

            await client.query('COMMIT');
            return updateResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getTransactions(userId, limit = 50) {
        const query = `
      SELECT * FROM wallet_transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
        const result = await db.query(query, [userId, limit]);
        return result.rows;
    }
}

module.exports = new WalletModel();
