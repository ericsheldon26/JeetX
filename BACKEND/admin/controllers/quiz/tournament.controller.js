const tournamentSlotModel = require('@/models/quiz/tournamentSlot.model');
const logger = require('@/utils/logger');
const db = require("@/config/database")

class AdminTournamentController {
    /**
     * Create tournament slot
     */
    async createSlot(req, res) {
        try {
            const slotData = req.body;

            // Validate times
            const startTime = new Date(slotData.start_time);
            const endTime = new Date(slotData.end_time);

            if (startTime <= new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Start time must be in the future'
                });
            }

            if (endTime <= startTime) {
                return res.status(400).json({
                    success: false,
                    message: 'End time must be after start time'
                });
            }


            // Validate reward distribution
            const totalPercentage = Object.values(slotData.reward_distribution)
                .reduce((sum, pct) => sum + pct, 0);

            if (totalPercentage > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Reward distribution cannot exceed 100%'
                });
            }

            const slot = await tournamentSlotModel.create(slotData);

            res.status(201).json({
                success: true,
                message: 'Tournament slot created successfully',
                data: slot
            });
        } catch (error) {
            logger.error('Create tournament slot error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all tournament slots
     */
    async getSlots(req, res) {
        try {
            const { sub_category_id, status, limit = 50, offset = 0 } = req.query;

            let query = `
                SELECT ts.*, qsc.name as sub_category_name,
                       (ts.max_players - ts.current_players) as available_spots
                FROM tournament_slots ts
                JOIN quiz_sub_categories qsc ON ts.sub_category_id = qsc.id
                WHERE 1=1
            `;
            const params = [];
            let paramCount = 1;

            if (sub_category_id) {
                query += ` AND ts.sub_category_id = $${paramCount}`;
                params.push(sub_category_id);
                paramCount++;
            }

            if (status) {
                query += ` AND ts.status = $${paramCount}`;
                params.push(status);
                paramCount++;
            }

            query += ` ORDER BY ts.start_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
            params.push(limit, offset);

            const result = await db.query(query, params);

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            logger.error('Get tournament slots error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get tournament slot by ID
     */
    async getSlot(req, res) {
        try {
            const { id } = req.params;
            const slot = await tournamentSlotModel.findById(id);

            if (!slot) {
                return res.status(404).json({
                    success: false,
                    message: 'Tournament slot not found'
                });
            }

            // Get participants count
            const participantsQuery = `
                SELECT COUNT(*) as participants
                FROM quiz_sessions
                WHERE slot_id = $1
            `;
            const participantsResult = await db.query(participantsQuery, [id]);

            res.json({
                success: true,
                data: {
                    ...slot,
                    participants: parseInt(participantsResult.rows[0].participants)
                }
            });
        } catch (error) {
            logger.error('Get tournament slot error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update tournament slot
     */
    async updateSlot(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Check if tournament has started
            const slot = await tournamentSlotModel.findById(id);
            if (!slot) {
                return res.status(404).json({
                    success: false,
                    message: 'Tournament slot not found'
                });
            }

            if (slot.status === 'ACTIVE' || slot.status === 'COMPLETED') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot update active or completed tournament'
                });
            }

            const query = `
                UPDATE tournament_slots
                SET slot_name = $1, entry_coins = $2, start_time = $3, end_time = $4,
                    max_players = $5, timer_duration = $6, reward_distribution = $7,
                    updated_at = NOW()
                WHERE id = $8
                RETURNING *
            `;

            const values = [
                updateData.slot_name,
                updateData.entry_coins,
                updateData.start_time,
                updateData.end_time,
                updateData.max_players,
                updateData.timer_duration,
                JSON.stringify(updateData.reward_distribution),
                id
            ];

            const result = await db.query(query, values);

            res.json({
                success: true,
                message: 'Tournament slot updated successfully',
                data: result.rows[0]
            });
        } catch (error) {
            logger.error('Update tournament slot error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Cancel tournament slot
     */
    async cancelSlot(req, res) {
        try {
            const { id } = req.params;

            const slot = await tournamentSlotModel.findById(id);
            if (!slot) {
                return res.status(404).json({
                    success: false,
                    message: 'Tournament slot not found'
                });
            }

            if (slot.status === 'COMPLETED' || slot.status === 'CANCELLED') {
                return res.status(400).json({
                    success: false,
                    message: 'Tournament is already completed or cancelled'
                });
            }

            // Refund all participants
            const sessionsQuery = 'SELECT user_id, entry_coins FROM quiz_sessions WHERE slot_id = $1';
            const sessionsResult = await db.query(sessionsQuery, [id]);

            const walletService = require('@/services/wallet.service');

            for (const session of sessionsResult.rows) {
                await walletService.creditCoins(
                    session.user_id,
                    session.entry_coins,
                    'TOURNAMENT_CANCELLED_REFUND',
                    { slot_id: id }
                );
            }

            // Update slot status
            await tournamentSlotModel.updateStatus(id, 'CANCELLED');

            res.json({
                success: true,
                message: 'Tournament cancelled and all participants refunded',
                refunded_users: sessionsResult.rows.length
            });
        } catch (error) {
            logger.error('Cancel tournament slot error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get tournament results
     */
    async getResults(req, res) {
        try {
            const { id } = req.params;

            const slot = await tournamentSlotModel.findById(id);
            if (!slot) {
                return res.status(404).json({
                    success: false,
                    message: 'Tournament slot not found'
                });
            }

            if (slot.status !== 'COMPLETED') {
                return res.status(400).json({
                    success: false,
                    message: 'Tournament results not available yet'
                });
            }

            const query = `
                SELECT qs.*, u.full_name, u.email
                FROM quiz_sessions qs
                JOIN users u ON qs.user_id = u.id
                WHERE qs.slot_id = $1 AND qs.status = 'COMPLETED'
                ORDER BY qs.rank ASC
            `;

            const result = await db.query(query, [id]);

            res.json({
                success: true,
                data: {
                    slot_info: slot,
                    results: result.rows
                }
            });
        } catch (error) {
            logger.error('Get tournament results error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Manually finalize tournament
     */
    async finalizeSlot(req, res) {
        try {
            const { id } = req.params;
            const quizService = require('@/services/quiz.service');

            const result = await quizService.finalizeTournament(id);

            res.json({
                success: true,
                message: 'Tournament finalized successfully',
                data: result
            });
        } catch (error) {
            logger.error('Finalize tournament error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get tournament statistics
     */
    async getStatistics(req, res) {
        try {
            const query = `
                SELECT 
                    COUNT(*) FILTER (WHERE status = 'SCHEDULED') as scheduled,
                    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active,
                    COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
                    COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled,
                    SUM(total_pool) FILTER (WHERE status = 'COMPLETED') as total_revenue,
                    SUM(current_players) FILTER (WHERE status = 'COMPLETED') as total_players
                FROM tournament_slots
            `;

            const result = await db.query(query);

            res.json({
                success: true,
                data: result.rows[0]
            });
        } catch (error) {
            logger.error('Get tournament statistics error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AdminTournamentController();