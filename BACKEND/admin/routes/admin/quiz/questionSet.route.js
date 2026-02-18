
const express = require('express');
const { body, query, param } = require('express-validator');
const { authenticateToken, isAdmin } = require('@/middleware/auth.middleware');
const { validate } = require('@/utils/validators');
const adminQuestionSetController = require('@/controllers/quiz/questionSet.controller');
const setRouter = express.Router();
setRouter.use(authenticateToken);
setRouter.use(isAdmin);




/**
 * @route   POST /admin/api/v1/quiz/question-sets
 * @desc    Create question set
 * @access  Admin
 */
setRouter.post(
    '/',
    [
        body('sub_category_id').isUUID(),
        body('mode').isIn(['PRACTICE', 'TOURNAMENT']),
        body('name').notEmpty().trim(),
        body('total_questions').isInt({ min: 1 }),
        body('difficulty_distribution').isObject(),
        body('is_randomized').isBoolean(),
        body('fixed_question_ids').optional().isArray(),
    ],
    validate,
    adminQuestionSetController.createSet
);

/**
 * @route   GET /admin/api/v1/quiz/question-sets
 * @desc    Get all question sets
 * @access  Admin
 */
setRouter.get(
    '/',
    [
        query('sub_category_id').optional().isUUID(),
        query('mode').optional().isIn(['PRACTICE', 'TOURNAMENT']),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('offset').optional().isInt({ min: 0 }),
    ],
    validate,
    adminQuestionSetController.getSets
);

/**
 * @route   GET /admin/api/v1/quiz/question-sets/:id
 * @desc    Get question set by ID
 * @access  Admin
 */
setRouter.get(
    '/:id',
    [
        param('id').isUUID(),
    ],
    validate,
    adminQuestionSetController.getSet
);

/**
 * @route   PUT /admin/api/v1/quiz/question-sets/:id
 * @desc    Update question set
 * @access  Admin
 */
setRouter.put(
    '/:id',
    [
        param('id').isUUID(),
        body('name').notEmpty().trim(),
        body('total_questions').isInt({ min: 1 }),
        body('difficulty_distribution').isObject(),
        body('is_randomized').isBoolean(),
        body('fixed_question_ids').optional().isArray(),
    ],
    validate,
    adminQuestionSetController.updateSet
);

/**
 * @route   PUT /admin/api/v1/quiz/question-sets/:id/status
 * @desc    UPDATE question set status
 * @access  Admin
 */
setRouter.put(
    '/:id',
    [
        param('id').isUUID(),
        body('status').isIn(['ACTIVE', 'INACTIVE']),
    ],
    validate,
    adminQuestionSetController.deleteSet
);

module.exports = setRouter;

