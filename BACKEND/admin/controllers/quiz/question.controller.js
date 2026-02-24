// controllers/admin/quiz/question.controller.js
const questionModel = require('@/models/quiz/question.model');
const logger = require('@/utils/logger');
const db = require('@/config/database');
const { GetUnSignedUrl } = require("@/services/storage/storage.services");

class AdminQuestionController {
    /**
     * Create new question
     */
    async createQuestion(req, res) {
        try {
            const adminId = req.user.id;
            const questionData = {
                ...req.body,
                created_by: adminId
            };
            const question = await questionModel.create(questionData);

            res.status(201).json({
                success: true,
                message: 'Question created successfully',
                data: question
            });
        } catch (error) {
            logger.error('Create question error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all questions with filters
     */
    async getQuestions(req, res) {
        try {
            const { sub_category_id, difficulty, status, limit = 1000, offset = 0 } = req.query;
            let query = 'SELECT * FROM quiz_questions WHERE 1=1';
            const params = [];
            let paramCount = 1;

            if (sub_category_id) {
                query += ` AND sub_category_id = $${paramCount}`;
                params.push(sub_category_id);
                paramCount++;
            }

            if (difficulty) {
                query += ` AND difficulty = $${paramCount}`;
                params.push(difficulty);
                paramCount++;
            }

            if (status) {
                query += ` AND status = $${paramCount}`;
                params.push(status);
                paramCount++;
            }

            query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
            params.push(limit, offset);

            let result = await db.query(query, params);


            // Get total count
            let countQuery = 'SELECT COUNT(*) FROM quiz_questions WHERE 1=1';
            const countParams = [];
            let countParamCount = 1;

            if (sub_category_id) {
                countQuery += ` AND sub_category_id = $${countParamCount}`;
                countParams.push(sub_category_id);
                countParamCount++;
            }

            if (difficulty) {
                countQuery += ` AND difficulty = $${countParamCount}`;
                countParams.push(difficulty);
                countParamCount++;
            }

            if (status) {
                countQuery += ` AND status = $${countParamCount}`;
                countParams.push(status);
            }

            const countResult = await db.query(countQuery, countParams);
            await Promise.all(result.rows.map(async (res) => {

                if (res?.icon_url) {
                    const { success, url } = await GetUnSignedUrl(res?.icon_url);
                    res.image_path = success ? url : ""
                }
            })
            )

            res.json({
                success: true,
                data: result.rows,
                pagination: {
                    total: parseInt(countResult.rows[0].count),
                    limit: parseInt(limit),
                    offset: parseInt(offset)
                }
            });
        } catch (error) {
            logger.error('Get questions error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get single question by ID
     */
    async getQuestion(req, res) {
        try {
            const { id } = req.params;
            const question = await questionModel.findById(id);

            if (!question) {
                return res.status(404).json({
                    success: false,
                    message: 'Question not found'
                });
            }

            res.json({
                success: true,
                data: question
            });
        } catch (error) {
            logger.error('Get question error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update question
     */
    async updateQuestion(req, res) {
        try {
            const { id } = req.params;
            const question = await questionModel.update(id, req.body);

            if (!question) {
                return res.status(404).json({
                    success: false,
                    message: 'Question not found'
                });
            }

            res.json({
                success: true,
                message: 'Question updated successfully',
                data: question
            });
        } catch (error) {
            logger.error('Update question error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Activate/Deactivate question
     */
    async toggleQuestionStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const question = await questionModel.updateStatus(id, status);

            if (!question) {
                return res.status(404).json({
                    success: false,
                    message: 'Question not found'
                });
            }

            res.json({
                success: true,
                message: `Question status changed to ${status.toLowerCase()} successfully`,
                data: question
            });
        } catch (error) {
            logger.error('Toggle question status error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Bulk import questions
     */
    async bulkImport(req, res) {
        try {

            const fs = require("fs");
            const csv = require("csv-parser");

            const questions = [];

            fs.createReadStream("continent.csv")
                .pipe(csv())
                .on("data", (data) => questions.push(data))
                .on("end", () => {
                    console.log(questions); // Array of JSON objects
                });
            // const { questions } = req.body;
            // const adminId = req.user.id;
            // const results = {
            //     total: questions.length,
            //     success: 0,
            //     failed: 0,
            //     errors: []
            // };

            // for (const questionData of questions) {
            //     try {
            //         await questionModel.create({
            //             ...questionData,
            //             created_by: adminId
            //         });
            //         results.success++;
            //     } catch (error) {
            //         results.failed++;
            //         results.errors.push({
            //             question: questionData.question_text,
            //             error: error.message
            //         });
            //     }
            // }

            res.json({
                success: true,
                message: 'Bulk import completed',
                // data: results
            });
        } catch (error) {
            logger.error('Bulk import error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get question statistics
     */
    async getStatistics(req, res) {
        try {
            const { sub_category_id } = req.query;

            let query = `
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active,
                    COUNT(*) FILTER (WHERE status = 'INACTIVE') as inactive,
                    COUNT(*) FILTER (WHERE difficulty = 'EASY') as easy,
                    COUNT(*) FILTER (WHERE difficulty = 'MEDIUM') as medium,
                    COUNT(*) FILTER (WHERE difficulty = 'HARD') as hard
                FROM quiz_questions
            `;

            const params = [];
            if (sub_category_id) {
                query += ' WHERE sub_category_id = $1';
                params.push(sub_category_id);
            }

            const result = await db.query(query, params);

            res.json({
                success: true,
                data: result.rows[0]
            });
        } catch (error) {
            logger.error('Get statistics error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AdminQuestionController();