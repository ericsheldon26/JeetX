const db = require('@/config/database');

class MatchResultModel {
    /**
     * Record match result
     */
    async create(resultData) {
        const query = `
            INSERT INTO match_results (
                user_id, game_id, match_type, match_id,
                points_earned, coins_won, is_winner, rank
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [
            resultData.user_id,
            resultData.category_id,
            resultData.match_type,
            resultData.match_id,
            resultData.points_earned,
            resultData.coins_won || 0,
            resultData.is_winner || false,
            resultData.rank || null
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Get user matches in period
     */
    async getUserMatchesInPeriod(userId, periodStart, periodEnd, categoryId = null) {
        let query = `
            SELECT * FROM match_results
            WHERE user_id = $1
            AND played_at >= $2
            AND played_at <= $3
        `;
        const params = [userId, periodStart, periodEnd];

        if (categoryId) {
            query += ' AND game_id = $4';
            params.push(categoryId);
        }

        query += ' ORDER BY played_at DESC';

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get aggregate stats for user in period
     */
    async getAggregateStats(userId, periodStart, periodEnd, categoryId = null) {
        let query = `
            SELECT 
                COALESCE(SUM(points_earned), 0) as total_points,
                COALESCE(SUM(coins_won), 0) as total_coins_won,
                COUNT(*) as matches_played,
                COUNT(*) FILTER (WHERE is_winner = true) as wins
            FROM match_results
            WHERE user_id = $1
            AND played_at >= $2
            AND played_at <= $3
        `;
        const params = [userId, periodStart, periodEnd];

        if (categoryId) {
            query += ' AND game_id = $4';
            params.push(categoryId);
        }

        const result = await db.query(query, params);
        return result.rows[0];
    }
}

module.exports = new MatchResultModel();
