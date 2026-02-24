// routes/leaderboard.routes.js
const express = require('express');
const { query } = require('express-validator');
const leaderboardController = require('@/controllers/leaderboard/leaderboard.controller');
const { authenticateToken } = require('@/middleware/auth.middleware');
const { validate } = require('@/utils/validators');
const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/leaderboard/test
 * @desc    Test endpoint
 * @access  Protected
 */
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Leaderboard routes are working',
        timestamp: new Date().toISOString(),
        available_endpoints: {
            GET: [
                {
                    leaderboard: '/api/v1/leaderboard',
                    description: 'Get leaderboard rankings',
                    token: 'required',
                    query: {
                        type: 'enum: DAILY|WEEKLY|MONTHLY|ALL_TIME, default WEEKLY',
                        category_id: 'UUID, optional',
                        limit: 'integer, optional, default 100'
                    },
                    response_example: {
                        period_type: 'WEEKLY',
                        top_3: [
                            { rank: 1, user_id: 'uuid', full_name: 'John', points: 11000, wins: 5, total_prize_won: 5000 }
                        ],
                        rankings: [],
                        user_ranking: { rank: 15, points: 5000, wins: 2, total_prize_won: 1000 }
                    }
                },
                {
                    user_stats: '/api/v1/leaderboard/stats',
                    description: 'Get user statistics',
                    token: 'required',
                    query: {
                        type: 'enum: DAILY|WEEKLY|MONTHLY|ALL_TIME, default ALL_TIME',
                        category_id: 'UUID, optional'
                    }
                }
            ]
        }
    });
});

/**
 * @route   GET /api/v1/leaderboard
 * @desc    Get leaderboard
 * @access  Protected
 */
router.get(
    '/',
    [
        query('type').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME']),
        query('category_id').optional().isUUID(),
        query('limit').optional().isInt({ min: 1, max: 500 }),
    ],
    validate,
    leaderboardController.getLeaderboard
);

/**
 * @route   GET /api/v1/leaderboard/stats
 * @desc    Get user stats
 * @access  Protected
 */
router.get(
    '/stats',
    [
        query('type').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME']),
        query('category_id').optional().isUUID(),
    ],
    validate,
    leaderboardController.getUserStats
);

module.exports = router;