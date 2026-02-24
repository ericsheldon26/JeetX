/* eslint-disable no-case-declarations */
const leaderboardPointsModel = require('@/models/leaderboard/leaderboardPoints.model');
const leaderboardRankingsModel = require('@/models/leaderboard/leaderboardRankings.model');
const matchResultModel = require('@/models/leaderboard/matchResult.model');
const logger = require('@/utils/logger');

class LeaderboardService {
    /**
     * Get period dates
     */
    getPeriodDates(periodType) {
        const now = new Date();
        let periodStart, periodEnd;

        switch (periodType) {
            case 'DAILY':
                periodStart = new Date(now.setHours(0, 0, 0, 0));
                periodEnd = new Date(now.setHours(23, 59, 59, 999));
                break;

            case 'WEEKLY':
                const dayOfWeek = now.getDay();
                const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
                periodStart = new Date(now);
                periodStart.setDate(now.getDate() - diff);
                periodStart.setHours(0, 0, 0, 0);

                periodEnd = new Date(periodStart);
                periodEnd.setDate(periodStart.getDate() + 6);
                periodEnd.setHours(23, 59, 59, 999);
                break;

            case 'MONTHLY':
                periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
                periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                break;

            case 'ALL_TIME':
                periodStart = new Date('2020-01-01');
                periodEnd = new Date('2099-12-31');
                break;

            default:
                throw new Error('Invalid period type');
        }

        return {
            periodStart: periodStart.toISOString().split('T')[0],
            periodEnd: periodEnd.toISOString().split('T')[0]
        };
    }

    /**
     * Record match result and update leaderboard
     */
    async recordMatchResult(resultData) {
        try {
            // Create match result record
            const matchResult = await matchResultModel.create(resultData);

            // Update leaderboard points for all period types
            const periodTypes = ['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME'];

            for (const periodType of periodTypes) {
                const { periodStart, periodEnd } = this.getPeriodDates(periodType);

                // Update overall leaderboard
                await leaderboardPointsModel.upsert({
                    user_id: resultData.user_id,
                    category_id: null,
                    period_type: periodType,
                    points: resultData.points_earned,
                    wins: resultData.is_winner ? 1 : 0,
                    matches_played: 1,
                    period_start: periodStart,
                    period_end: periodEnd
                });

                // Update category-specific leaderboard if applicable
                if (resultData.category_id) {
                    await leaderboardPointsModel.upsert({
                        user_id: resultData.user_id,
                        category_id: resultData.category_id,
                        period_type: periodType,
                        points: resultData.points_earned,
                        wins: resultData.is_winner ? 1 : 0,
                        matches_played: 1,
                        period_start: periodStart,
                        period_end: periodEnd
                    });
                }
            }

            logger.info(`Match result recorded for user ${resultData.user_id}: ${resultData.points_earned} points`);

            return matchResult;
        } catch (error) {
            logger.error('Record match result error:', error);
            throw error;
        }
    }

    /**
     * Get leaderboard
     */
    async getLeaderboard(userId, periodType, categoryId = null, limit = 100) {
        try {
            console.log(userId, periodType, categoryId, limit)
            const { periodStart, periodEnd } = this.getPeriodDates(periodType);

            // Try to get cached rankings first
            let rankings = await leaderboardRankingsModel.getRankings(
                periodType,
                periodStart,
                periodEnd,
                categoryId,
                limit
            );

            // If cache is empty or stale, rebuild it
            if (rankings.length === 0) {
                await leaderboardRankingsModel.cacheRankings(
                    periodType,
                    periodStart,
                    periodEnd,
                    categoryId
                );

                rankings = await leaderboardRankingsModel.getRankings(
                    periodType,
                    periodStart,
                    periodEnd,
                    categoryId,
                    limit
                );
            }

            // Get user's rank separately
            let userRanking = await leaderboardRankingsModel.getUserRanking(
                userId,
                periodType,
                periodStart,
                periodEnd,
                categoryId
            );

            // If user not in cache, calculate from points
            if (!userRanking) {
                userRanking = await leaderboardPointsModel.getUserRank(
                    userId,
                    periodType,
                    periodStart,
                    periodEnd,
                    categoryId
                );
            }

            // Format response
            const top3 = rankings.slice(0, 3).map(r => ({
                rank: r.rank,
                user_id: r.user_id,
                full_name: r.full_name,
                points: r.points,
                wins: r.wins,
                total_prize_won: parseFloat(r.total_prize_won || 0)
            }));

            const allRankings = rankings.map(r => ({
                rank: r.rank,
                user_id: r.user_id,
                full_name: r.full_name,
                points: r.points,
                wins: r.wins,
                total_prize_won: parseFloat(r.total_prize_won || 0)
            }));

            // return {
            //     period_type: periodType,
            //     period_start: periodStart,
            //     period_end: periodEnd,
            //     category_id: categoryId,
            //     top_3: top3,
            //     rankings: allRankings,
            //     user_ranking: userRanking ? {
            //         rank: userRanking.rank,
            //         points: userRanking.points,
            //         wins: userRanking.wins || 0,
            //         total_prize_won: parseFloat(userRanking.total_prize_won || 0)
            //     } : null,
            //     total_users: rankings.length
            // };

            return {
                success: true,
                data: {
                    period_type: periodType,
                    period_start: periodStart,
                    period_end: periodEnd,
                    category_id: categoryId,
                    top_3: [
                        {
                            rank: 1,
                            user_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
                            full_name: "Rajesh Kumar",
                            points: 45300,
                            wins: 35,
                            total_prize_won: 25000.00
                        },
                        {
                            rank: 2,
                            user_id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
                            full_name: "Priya Sharma",
                            points: 42800,
                            wins: 32,
                            total_prize_won: 22000.00
                        },
                        {
                            rank: 3,
                            user_id: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
                            full_name: "Amit Patel",
                            points: 40500,
                            wins: 30,
                            total_prize_won: 20000.00
                        }
                    ],
                    rankings: [
                        {
                            rank: 1,
                            user_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
                            full_name: "Rajesh Kumar",
                            points: 45300,
                            wins: 35,
                            total_prize_won: 25000.00
                        },
                        {
                            rank: 2,
                            user_id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
                            full_name: "Priya Sharma",
                            points: 42800,
                            wins: 32,
                            total_prize_won: 22000.00
                        },
                        {
                            rank: 3,
                            user_id: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
                            full_name: "Amit Patel",
                            points: 40500,
                            wins: 30,
                            total_prize_won: 20000.00
                        },
                        {
                            rank: 4,
                            user_id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
                            full_name: "Priya Sharma",
                            points: 42800,
                            wins: 32,
                            total_prize_won: 22000.00
                        },
                        {
                            rank: 5,
                            user_id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
                            full_name: "Priya Sharma",
                            points: 42800,
                            wins: 32,
                            total_prize_won: 22000.00
                        },
                        {
                            rank: 6,
                            user_id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
                            full_name: "Priya Sharma",
                            points: 42800,
                            wins: 32,
                            total_prize_won: 22000.00
                        },
                        {
                            rank: 7,
                            user_id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
                            full_name: "Priya Sharma",
                            points: 42800,
                            wins: 32,
                            total_prize_won: 22000.00
                        }
                    ],
                    user_ranking: {
                        rank: 247,
                        points: 2800,
                        wins: 2,
                        total_prize_won: 450.00
                    },
                    total_users: 100
                }
            }
        } catch (error) {
            logger.error('Get leaderboard error:', error);
            throw error;
        }
    }

    /**
     * Rebuild leaderboard cache (scheduled job)
     */
    async rebuildCache(periodType = null, categoryId = null) {
        try {
            const periodTypes = periodType ? [periodType] : ['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME'];

            for (const type of periodTypes) {
                const { periodStart, periodEnd } = this.getPeriodDates(type);

                await leaderboardRankingsModel.cacheRankings(
                    type,
                    periodStart,
                    periodEnd,
                    categoryId
                );

                logger.info(`Rebuilt ${type} leaderboard cache`);
            }

            return { success: true, message: 'Cache rebuilt successfully' };
        } catch (error) {
            logger.error('Rebuild cache error:', error);
            throw error;
        }
    }
}

module.exports = new LeaderboardService();