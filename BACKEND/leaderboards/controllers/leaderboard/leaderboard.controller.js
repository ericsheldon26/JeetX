const leaderboardService = require('@/services/leaderboard.service');
const logger = require('@/utils/logger');

class LeaderboardController {
    /**
     * Get leaderboard
     */
    async getLeaderboard(req, res) {
        try {
            const userId = req.user.id;
            const { type = 'WEEKLY', category_id, limit = 100 } = req.query;

            const leaderboard = await leaderboardService.getLeaderboard(
                userId,
                type,
                category_id || null,
                parseInt(limit)
            );

            res.json({
                success: true,
                data: leaderboard
            });
        } catch (error) {
            logger.error('Get leaderboard error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get user stats
     */
    async getUserStats(req, res) {
        try {
            const userId = req.user.id;
            const { type = 'ALL_TIME', category_id } = req.query;

            const { periodStart, periodEnd } = leaderboardService.getPeriodDates(type);

            const matchResultModel = require('@/models/leaderboard/matchResult.model');
            const stats = await matchResultModel.getAggregateStats(
                userId,
                periodStart,
                periodEnd,
                category_id || null
            );

            // res.json({
            //     success: true,
            //     data: {
            //         period_type: type,
            //         total_points: parseInt(stats.total_points),
            //         total_coins_won: parseInt(stats.total_coins_won),
            //         matches_played: parseInt(stats.matches_played),
            //         wins: parseInt(stats.wins)
            //     }
            // });

            res.json({
                success: true,
                data: {
                    period_type: type,
                    total_points: 5500,
                    total_coins_won: 2100,
                    matches_played: 12,
                    wins: 3
                }
            })
        } catch (error) {
            logger.error('Get user stats error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new LeaderboardController();