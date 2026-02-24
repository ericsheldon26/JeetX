const db = require('@/config/database');

class LeaderboardRankingsModel {
    /**
     * Cache rankings
     */
    async cacheRankings(periodType, periodStart, periodEnd, categoryId = null) {
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            // Delete old cache
            let deleteQuery = `
                DELETE FROM leaderboard_rankings
                WHERE period_type = $1
                AND period_start = $2
                AND period_end = $3
            `;
            const deleteParams = [periodType, periodStart, periodEnd];

            if (categoryId) {
                deleteQuery += ' AND game_id = $4';
                deleteParams.push(categoryId);
            } else {
                deleteQuery += ' AND game_id IS NULL';
            }

            await client.query(deleteQuery, deleteParams);

            // Insert new rankings
            let insertQuery = `
                INSERT INTO leaderboard_rankings (
                    user_id, game_id, period_type, rank, points, wins,
                    total_prize_won, period_start, period_end
                )
                SELECT 
                    lp.user_id,
                    lp.game_id,
                    lp.period_type,
                    ROW_NUMBER() OVER (
                        ORDER BY lp.points DESC, lp.wins DESC, lp.last_updated ASC
                    ) as rank,
                    lp.points,
                    lp.wins,
                    COALESCE(
                        (SELECT SUM(coins_won) 
                         FROM match_results 
                         WHERE user_id = lp.user_id AND is_winner = true),
                        0
                    ) as total_prize_won,
                    lp.period_start,
                    lp.period_end
                FROM leaderboard_points lp
                WHERE lp.period_type = $1
                AND lp.period_start = $2
                AND lp.period_end = $3
            `;
            const insertParams = [periodType, periodStart, periodEnd];

            if (categoryId) {
                insertQuery += ' AND lp.game_id = $4';
                insertParams.push(categoryId);
            } else {
                insertQuery += ' AND lp.game_id IS NULL';
            }

            await client.query(insertQuery, insertParams);

            await client.query('COMMIT');

            return { success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get cached rankings
     */
    async getRankings(periodType, periodStart, periodEnd, categoryId = null, limit = 100) {
        let query = `
            SELECT 
                lr.*,
                u.full_name,
                u.email
            FROM leaderboard_rankings lr
            JOIN users u ON lr.user_id = u.id
            WHERE lr.period_type = $1
            AND lr.period_start = $2
            AND lr.period_end = $3
        `;
        const params = [periodType, periodStart, periodEnd];

        if (categoryId) {
            query += ' AND lr.game_id = $4';
            params.push(categoryId);
        } else {
            query += ' AND lr.game_id IS NULL';
        }

        query += ` ORDER BY lr.rank ASC LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get user ranking
     */
    async getUserRanking(userId, periodType, periodStart, periodEnd, categoryId = null) {
        let query = `
            SELECT 
                lr.*,
                u.full_name,
                u.email
            FROM leaderboard_rankings lr
            JOIN users u ON lr.user_id = u.id
            WHERE lr.user_id = $1
            AND lr.period_type = $2
            AND lr.period_start = $3
            AND lr.period_end = $4
        `;
        const params = [userId, periodType, periodStart, periodEnd];

        if (categoryId) {
            query += ' AND lr.game_id = $5';
            params.push(categoryId);
        } else {
            query += ' AND lr.game_id IS NULL';
        }

        const result = await db.query(query, params);
        return result.rows[0];
    }
}

module.exports = new LeaderboardRankingsModel();