const questionSetModel = require('@/models/quiz/questionSet.model');
const logger = require('@/utils/logger');
const db = require("@/config/database")
class AdminQuestionSetController {
    /**
     * Create question set
     */
    async createSet(req, res) {
        try {
            const setData = req.body;

            // Validate difficulty distribution
            const distribution = setData.difficulty_distribution;
            const totalQuestions = setData.total_questions;
            const distributionTotal = Object.values(distribution).reduce((sum, count) => sum + count, 0);

            if (distributionTotal !== totalQuestions) {
                return res.status(400).json({
                    success: false,
                    message: 'Difficulty distribution must sum up to total questions'
                });
            }

            const questionSet = await questionSetModel.create(setData);

            res.status(201).json({
                success: true,
                message: 'Question set created successfully',
                data: questionSet
            });
        } catch (error) {
            logger.error('Create question set error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all question sets
     */
    async getSets(req, res) {
        try {
            const { sub_category_id, mode, limit = 50, offset = 0 } = req.query;
            let query = `
                SELECT qs.*, qsc.name as sub_category_name
                FROM question_sets qs
                JOIN quiz_sub_categories qsc ON qs.sub_category_id = qsc.id
                WHERE 1=1
            `;
            const params = [];
            let paramCount = 1;

            if (sub_category_id) {
                query += ` AND qs.sub_category_id = $${paramCount}`;
                params.push(sub_category_id);
                paramCount++;
            }

            if (mode) {
                query += ` AND qs.mode = $${paramCount}`;
                params.push(mode);
                paramCount++;
            }

            query += ` ORDER BY qs.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
            params.push(limit, offset);

            const result = await db.query(query, params);
            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            logger.error('Get question sets error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get question set by ID
     */
    async getSet(req, res) {
        try {
            const { id } = req.params;
            const questionSet = await questionSetModel.findById(id);

            if (!questionSet) {
                return res.status(404).json({
                    success: false,
                    message: 'Question set not found'
                });
            }

            res.json({
                success: true,
                data: questionSet
            });
        } catch (error) {
            logger.error('Get question set error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update question set
     */
    async updateSet(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const query = `
                UPDATE question_sets
                SET name = $1, total_questions = $2, difficulty_distribution = $3,
                    is_randomized = $4, fixed_question_ids = $5, updated_at = NOW()
                WHERE id = $6
                RETURNING *
            `;

            const values = [
                updateData.name,
                updateData.total_questions,
                JSON.stringify(updateData.difficulty_distribution),
                updateData.is_randomized,
                updateData.fixed_question_ids,
                id
            ];

            const result = await db.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Question set not found'
                });
            }

            res.json({
                success: true,
                message: 'Question set updated successfully',
                data: result.rows[0]
            });
        } catch (error) {
            logger.error('Update question set error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete question set
     */
    async deleteSet(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Check if set is being used in any active tournament
            const checkQuery = `
                SELECT COUNT(*) FROM tournament_slots 
                WHERE question_set_id = $1 AND status IN ('SCHEDULED', 'ACTIVE')
            `;
            const checkResult = await db.query(checkQuery, [id]);

            if (parseInt(checkResult.rows[0].count) > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete question set being used in active tournaments'
                });
            }
            const query = 'UPDATE  question_sets SET status = $1,updated_at = NOW() WHERE id = $2 RETURNING *';
            const result = await db.query(query, [status, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Question set not found'
                });
            }

            res.json({
                success: true,
                message: 'Question set deleted successfully'
            });
        } catch (error) {
            logger.error('Delete question set error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AdminQuestionSetController();
