const db = require('@/config/database');

class LeaderboardPointsModel {
    /**
     * Upsert leaderboard points
     */
    async upsert(pointsData) {
        const query = `
            INSERT INTO leaderboard_points (
                user_id, game_id, period_type, points, wins,
                matches_played, period_start, period_end
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (user_id, game_id, period_type, period_start)
            DO UPDATE SET
                points = leaderboard_points.points + EXCLUDED.points,
                wins = leaderboard_points.wins + EXCLUDED.wins,
                matches_played = leaderboard_points.matches_played + EXCLUDED.matches_played,
                last_updated = NOW()
            RETURNING *
        `;
        const values = [
            pointsData.user_id,
            pointsData.category_id || null,
            pointsData.period_type,
            pointsData.points,
            pointsData.wins || 0,
            pointsData.matches_played || 1,
            pointsData.period_start,
            pointsData.period_end
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Get top users for period
     */
    async getTopUsers(periodType, periodStart, periodEnd, categoryId = null, limit = 100) {
        let query = `
            SELECT 
                lp.*,
                u.full_name,
                u.email,
                COALESCE(
                    (SELECT SUM(coins_won) 
                     FROM match_results 
                     WHERE user_id = lp.user_id AND is_winner = true),
                    0
                ) as total_prize_won
            FROM leaderboard_points lp
            JOIN users u ON lp.user_id = u.id
            WHERE lp.period_type = $1
            AND lp.period_start = $2
            AND lp.period_end = $3
        `;
        const params = [periodType, periodStart, periodEnd];

        if (categoryId) {
            query += ' AND lp.game_id = $4';
            params.push(categoryId);
        } else {
            query += ' AND lp.game_id IS NULL';
        }

        query += ' ORDER BY lp.points DESC, lp.wins DESC, lp.last_updated ASC';
        query += ` LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get user rank
     */
    async getUserRank(userId, periodType, periodStart, periodEnd, categoryId = null) {
        let query = `
            WITH ranked_users AS (
                SELECT 
                    user_id,
                    points,
                    wins,
                    ROW_NUMBER() OVER (
                        ORDER BY points DESC, wins DESC, last_updated ASC
                    ) as rank
                FROM leaderboard_points
                WHERE period_type = $1
                AND period_start = $2
                AND period_end = $3
        `;
        const params = [periodType, periodStart, periodEnd];

        if (categoryId) {
            query += ' AND game_id = $4';
            params.push(categoryId);
        } else {
            query += ' AND game_id IS NULL';
        }

        query += `
            )
            SELECT * FROM ranked_users WHERE user_id = $${params.length + 1}
        `;
        params.push(userId);

        const result = await db.query(query, params);
        return result.rows[0];
    }
}

module.exports = new LeaderboardPointsModel();