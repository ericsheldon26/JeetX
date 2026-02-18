// routes/admin/quiz/question.routes.js
const express = require('express');
const { body, query, param } = require('express-validator');
const adminQuestionController = require('@/controllers/quiz/question.controller');
const { authenticateToken, isAdmin } = require('@/middleware/auth.middleware');
const { validate } = require('@/utils/validators');
const UploadStorage = require("@/services/storage/upload.storage");

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(isAdmin);

/**
 * @route   GET /admin/api/v1/quiz/questions/test
 * @desc    Test endpoint
 * @access  Admin
 */
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Admin quiz question routes are working',
        timestamp: new Date().toISOString(),
        available_endpoints: {
            POST: [
                {
                    create: '/admin/api/v1/quiz/questions',
                    description: 'Create new question',
                    body: {
                        sub_category_id: 'UUID, required',
                        question_text: 'string, required',
                        option_a: 'string, required',
                        option_b: 'string, required',
                        option_c: 'string, required',
                        option_d: 'string, required',
                        correct_option: 'enum: A|B|C|D, required',
                        difficulty: 'enum: EASY|MEDIUM|HARD, required'
                    }
                },
                {
                    bulk_import: '/admin/api/v1/quiz/questions/bulk',
                    description: 'Bulk import questions',
                    body: {
                        questions: 'array of question objects, required'
                    }
                }
            ],
            GET: [
                {
                    list: '/admin/api/v1/quiz/questions',
                    description: 'Get all questions with filters',
                    query: {
                        sub_category_id: 'UUID, optional',
                        difficulty: 'enum: EASY|MEDIUM|HARD, optional',
                        status: 'enum: ACTIVE|INACTIVE, optional',
                        limit: 'integer, optional, default 50',
                        offset: 'integer, optional, default 0'
                    }
                },
                {
                    detail: '/admin/api/v1/quiz/questions/:id',
                    description: 'Get single question',
                    params: { id: 'UUID, required' }
                },
                {
                    statistics: '/admin/api/v1/quiz/questions/stats',
                    description: 'Get question statistics',
                    query: { sub_category_id: 'UUID, optional' }
                }
            ],
            PUT: [
                {
                    update: '/admin/api/v1/quiz/questions/:id',
                    description: 'Update question',
                    params: { id: 'UUID, required' }
                },
                {
                    toggle_status: '/admin/api/v1/quiz/questions/:id/status',
                    description: 'Activate/Deactivate question',
                    params: { id: 'UUID, required' },
                    body: { status: 'enum: ACTIVE|INACTIVE, required' }
                }
            ]
        }
    });
});

/**
 * @route   POST /admin/api/v1/quiz/questions
 * @desc    Create new question
 * @access  Admin
 */
router.post(
    '/',
    (request, response, next) => UploadStorage(request, response, next, ["image", "application"], false),

    [
        body('sub_category_id').isUUID(),
        body('question_text').notEmpty().trim(),
        // body('icon_url'),
        body('option_a').notEmpty().trim(),
        body('option_b').notEmpty().trim(),
        body('option_c').notEmpty().trim(),
        body('option_d').notEmpty().trim(),
        body('correct_option').isIn(['A', 'B', 'C', 'D']),
        body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD']),
    ],
    validate,
    adminQuestionController.createQuestion
);

/**
 * @route   GET /admin/api/v1/quiz/questions
 * @desc    Get all questions
 * @access  Admin
 */
router.get(
    '/',
    [
        query('sub_category_id').optional().isUUID(),
        query('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
        query('status').optional().isIn(['ACTIVE', 'INACTIVE']),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('offset').optional().isInt({ min: 0 }),
    ],
    validate,
    adminQuestionController.getQuestions
);

/**
 * @route   GET /admin/api/v1/quiz/questions/stats
 * @desc    Get question statistics
 * @access  Admin
 */
router.get(
    '/stats',
    [
        query('sub_category_id').optional().isUUID(),
    ],
    validate,
    adminQuestionController.getStatistics
);

/**
 * @route   GET /admin/api/v1/quiz/questions/:id
 * @desc    Get question by ID
 * @access  Admin
 */
router.get(
    '/:id',
    [
        param('id').isUUID(),
    ],
    validate,
    adminQuestionController.getQuestion
);

/**
 * @route   PUT /admin/api/v1/quiz/questions/:id
 * @desc    Update question
 * @access  Admin
 */
router.put(
    '/:id',
    (request, response, next) => UploadStorage(request, response, next, ["image", "application"], false),
    [
        param('id').isUUID(),
        body('question_text').notEmpty().trim(),
        body('option_a').notEmpty().trim(),
        body('option_b').notEmpty().trim(),
        body('option_c').notEmpty().trim(),
        body('option_d').notEmpty().trim(),
        body('correct_option').isIn(['A', 'B', 'C', 'D']),
        body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD']),
    ],
    validate,
    adminQuestionController.updateQuestion
);

/**
 * @route   PUT /admin/api/v1/quiz/questions/:id/status
 * @desc    Toggle question status
 * @access  Admin
 */
router.put(
    '/:id/status',
    [
        param('id').isUUID(),
        body('status').isIn(['ACTIVE', 'INACTIVE']),
    ],
    validate,
    adminQuestionController.toggleQuestionStatus
);

/**
 * @route   POST /admin/api/v1/quiz/questions/bulk
 * @desc    Bulk import questions
 * @access  Admin
 */
router.post(
    '/bulk',
    [
        body('questions').isArray({ min: 1 }),
    ],
    validate,
    adminQuestionController.bulkImport
);

module.exports = router;
