const questionModel = require('@/models/quiz/question.model');
const questionSetModel = require('@/models/quiz/questionSet.model');
const tournamentSlotModel = require('@/models/quiz/tournamentSlot.model');
const quizSessionModel = require('@/models/quiz/session.model');
const practiceConfigModel = require('@/models/quiz/practiceConfig.model');
const walletService = require('@/services/wallet.service');
const notificationService = require('@/services/notification.service');
const leaderboardService = require('@/services/leaderboard.service');

const logger = require('@/utils/logger');
const db = require('@/config/database');

class QuizService {
    /**
     * Get quiz entry options for sub-category
     */
    async getEntryOptions(userId, subCategoryId) {
        const wallet = await walletService.getBalance(userId);
        const practiceConfig = await practiceConfigModel.findBySubCategory(subCategoryId);
        const tournamentSlots = await tournamentSlotModel.findActiveSlots(subCategoryId);

        return {
            wallet_balance: wallet.coin_balance,
            practice_mode: practiceConfig ? {
                available: true,
                entry_coins: practiceConfig.entry_coins,
                timer_enabled: practiceConfig.timer_enabled,
                timer_duration: practiceConfig.timer_duration,
                refund_rules: practiceConfig.refund_rules,
                terms: {
                    content: practiceConfig.terms_content,
                    version: practiceConfig.terms_version
                }
            } : { available: false },
            tournament_mode: {
                available: tournamentSlots.length > 0,
                slots: tournamentSlots
            }
        };
    }

    /**
     * Start Practice Mode
     */
    async startPractice(userId, subCategoryId, termsAccepted) {
        try {
            // Check for active session
            const activeSession = await quizSessionModel.findActiveSession(userId, 'PRACTICE');
            if (activeSession) {
                throw new Error('You already have an active practice session');
            }

            // Get practice config
            const config = await practiceConfigModel.findBySubCategory(subCategoryId);
            if (!config) {
                throw new Error('Practice mode not available for this category');
            }

            // Deduct entry coins
            await walletService.deductCoins(userId, config.entry_coins, 'PRACTICE_ENTRY', {
                sub_category_id: subCategoryId
            });

            // Get question set
            const questionSets = await questionSetModel.findBySubCategoryAndMode(subCategoryId, 'PRACTICE');
            if (questionSets.length === 0) {
                throw new Error('No question sets available');
            }

            const questionSet = questionSets[0];
            let questions;

            if (questionSet.is_randomized) {
                questions = await questionModel.getRandomQuestions(
                    subCategoryId,
                    questionSet.difficulty_distribution
                );
            } else {
                // Get fixed questions
                questions = await Promise.all(
                    questionSet.fixed_question_ids.map(id => questionModel.findById(id))
                );
            }

            // Remove correct answers from questions sent to frontend
            const questionsForUser = questions.map(q => ({
                id: q.id,
                question_text: q.question_text,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d,
                difficulty: q.difficulty
            }));

            // Store questions with correct answers in session
            const questionsWithAnswers = questions.map(q => ({
                id: q.id,
                correct_option: q.correct_option
            }));

            // Create session
            const session = await quizSessionModel.create({
                user_id: userId,
                sub_category_id: subCategoryId,
                question_set_id: questionSet.id,
                mode: 'PRACTICE',
                entry_coins: config.entry_coins,
                questions: questionsWithAnswers,
                total_questions: questions.length
            });

            // Log terms acceptance
            await this.logTermsAcceptance(userId, 'PRACTICE', session.id, config.terms_version);

            return {
                session_id: session.id,
                questions: questionsForUser,
                timer_enabled: config.timer_enabled,
                timer_duration: config.timer_duration,
                entry_coins: config.entry_coins,
                refund_rules: config.refund_rules
            };
        } catch (error) {
            logger.error('Start practice error:', error);
            throw error;
        }
    }

    /**
     * Submit Practice Quiz
     */
    async submitPractice(userId, sessionId, answers, completionTime) {
        try {
            const session = await quizSessionModel.findById(sessionId);

            if (!session) {
                throw new Error('Session not found');
            }

            if (session.user_id !== userId) {
                throw new Error('Unauthorized');
            }

            if (session.status !== 'IN_PROGRESS') {
                throw new Error('Session already completed');
            }

            // Submit answers
            await quizSessionModel.submitAnswers(sessionId, answers, completionTime);

            // Calculate score
            const scoreData = this.calculatePracticeScore(session.questions, answers);
            await quizSessionModel.updateScore(sessionId, scoreData);

            // Calculate refund
            const config = await practiceConfigModel.findBySubCategory(session.sub_category_id);
            const scorePercentage = (scoreData.correct_answers / session.total_questions) * 100;
            const refundCoins = this.calculateRefund(scorePercentage, session.entry_coins, config.refund_rules);

            if (refundCoins > 0) {
                await walletService.creditCoins(userId, refundCoins, 'PRACTICE_REFUND', {
                    session_id: sessionId,
                    score_percentage: scorePercentage
                });
                await quizSessionModel.updateRefund(sessionId, refundCoins);
            }

            // Send notification
            await notificationService.sendPracticeResult(userId, {
                score: scoreData.correct_answers,
                totalQuestions: session.total_questions,
                refundCoins,
                entryCoins: session.entry_coins
            });

            return {
                score: scoreData.correct_answers,
                total_questions: session.total_questions,
                score_percentage: Math.round(scorePercentage),
                refund_coins: refundCoins,
                completion_time: completionTime
            };
        } catch (error) {
            logger.error('Submit practice error:', error);
            throw error;
        }
    }

    /**
     * Join Tournament Slot
     */
    async joinTournament(userId, slotId, termsAccepted) {
        try {
            const slot = await tournamentSlotModel.findById(slotId);

            if (!slot) {
                throw new Error('Tournament slot not found');
            }

            if (slot.status !== 'SCHEDULED') {
                throw new Error('Tournament is not available for joining');
            }

            if (slot.current_players >= slot.max_players) {
                throw new Error('Tournament is full');
            }

            if (new Date() >= new Date(slot.start_time)) {
                throw new Error('Tournament has already started');
            }

            // Check if user already joined
            const existingSession = await quizSessionModel.checkUserInSlot(userId, slotId);
            if (existingSession) {
                throw new Error('You have already joined this tournament');
            }

            // Deduct entry coins
            await walletService.deductCoins(userId, slot.entry_coins, 'TOURNAMENT_ENTRY', {
                slot_id: slotId
            });

            // Get questions from question set
            const questionSet = await questionSetModel.findById(slot.question_set_id);
            let questions;

            if (questionSet.is_randomized) {
                questions = await questionModel.getRandomQuestions(
                    slot.sub_category_id,
                    questionSet.difficulty_distribution
                );
            } else {
                questions = await Promise.all(
                    questionSet.fixed_question_ids.map(id => questionModel.findById(id))
                );
            }

            // Store questions with correct answers
            const questionsWithAnswers = questions.map(q => ({
                id: q.id,
                correct_option: q.correct_option
            }));

            // Create session
            const session = await quizSessionModel.create({
                user_id: userId,
                sub_category_id: slot.sub_category_id,
                question_set_id: questionSet.id,
                slot_id: slotId,
                mode: 'TOURNAMENT',
                entry_coins: slot.entry_coins,
                questions: questionsWithAnswers,
                total_questions: questions.length
            });

            // Increment player count
            await tournamentSlotModel.incrementPlayerCount(slotId);

            // Log terms acceptance
            await this.logTermsAcceptance(userId, 'TOURNAMENT', session.id, 'v1.0');

            return {
                session_id: session.id,
                message: 'Successfully joined tournament',
                slot_details: {
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    timer_duration: slot.timer_duration
                }
            };
        } catch (error) {
            logger.error('Join tournament error:', error);
            throw error;
        }
    }

    /**
     * Start Tournament Quiz (when tournament starts)
     */
    async startTournamentQuiz(userId, sessionId) {
        try {
            const session = await quizSessionModel.findById(sessionId);

            if (!session || session.user_id !== userId) {
                throw new Error('Unauthorized');
            }

            const slot = await tournamentSlotModel.findById(session.slot_id);
            if (new Date() < new Date(slot.start_time)) {
                throw new Error('Tournament has not started yet');
            }

            if (new Date() > new Date(slot.end_time)) {
                throw new Error('Tournament has ended');
            }

            // Get questions without answers
            const questions = await Promise.all(
                session.questions.map(async (q) => {
                    const fullQuestion = await questionModel.findById(q.id);
                    return {
                        id: fullQuestion.id,
                        question_text: fullQuestion.question_text,
                        option_a: fullQuestion.option_a,
                        option_b: fullQuestion.option_b,
                        option_c: fullQuestion.option_c,
                        option_d: fullQuestion.option_d,
                        difficulty: fullQuestion.difficulty
                    };
                })
            );

            return {
                session_id: session.id,
                questions,
                timer_duration: slot.timer_duration,
                end_time: slot.end_time
            };
        } catch (error) {
            logger.error('Start tournament quiz error:', error);
            throw error;
        }
    }

    /**
     * Submit Tournament Quiz
     */
    async submitTournament(userId, sessionId, answers, completionTime) {
        try {
            const session = await quizSessionModel.findById(sessionId);

            if (!session || session.user_id !== userId) {
                throw new Error('Unauthorized');
            }

            if (session.status !== 'IN_PROGRESS') {
                throw new Error('Session already completed');
            }
            // services/quiz/quiz.service.js (continued)

            const slot = await tournamentSlotModel.findById(session.slot_id);

            if (new Date() > new Date(slot.end_time)) {
                throw new Error('Tournament has ended');
            }

            // Submit answers
            await quizSessionModel.submitAnswers(sessionId, answers, completionTime);

            // Calculate score with bonuses
            const scoreData = this.calculateTournamentScore(
                session.questions,
                answers,
                completionTime,
                slot.timer_duration,
                session.total_questions
            );

            await quizSessionModel.updateScore(sessionId, scoreData);

            return {
                message: 'Quiz submitted successfully',
                note: 'Results will be declared after tournament ends'
            };
        } catch (error) {
            logger.error('Submit tournament error:', error);
            throw error;
        }
    }

    /**
     * Finalize Tournament (Called by scheduler after end_time)
     */
    async finalizeTournament(slotId) {
        try {
            const gameResult = await db.query(
                `SELECT id FROM games WHERE name = $1 LIMIT 1`,
                ['Quiz']
            );

            if (gameResult.rows.length === 0) {
                throw new Error("Game 'Quiz' not found");
            }

            const quiz_id = gameResult.rows[0].id;
            const slot = await tournamentSlotModel.findById(slotId);

            if (slot.status !== 'SCHEDULED' && slot.status !== 'ACTIVE') {
                throw new Error('Tournament cannot be finalized');
            }

            // Get all completed sessions
            const sessions = await quizSessionModel.getSlotSessions(slotId);

            if (sessions.length === 0) {
                await tournamentSlotModel.updateStatus(slotId, 'COMPLETED');
                return { message: 'No participants' };
            }

            // Calculate rewards
            const rewardDistribution = slot.reward_distribution;
            const distributablePool = slot.distributable_pool;
            const results = [];

            for (let i = 0; i < sessions.length; i++) {
                const session = sessions[i];
                const rank = i + 1;
                const rewardPercentage = rewardDistribution[rank.toString()] || 0;
                const coinsWon = Math.floor((distributablePool * rewardPercentage) / 100);

                // Update session with rank and reward
                await quizSessionModel.updateRankAndReward(session.id, rank, coinsWon);
                await leaderboardService.recordMatchResult({
                    user_id: session.user_id,
                    category_id: quiz_id,
                    match_type: "TOURNAMENT",
                    match_id: session.id,
                    points_earned: session?.final_score,
                    rank,
                    coins_won: coinsWon,
                    is_winner: rank == 1 ? true : false,
                })
                // Credit coins to winner
                if (coinsWon > 0) {
                    await walletService.creditCoins(
                        session.user_id,
                        coinsWon,
                        'TOURNAMENT_REWARD',
                        { slot_id: slotId, rank }
                    );
                }

                results.push({
                    user_id: session.user_id,
                    full_name: session.full_name,
                    rank,
                    score: session.final_score,
                    coins_won: coinsWon,
                    tournament_name: slot.slot_name
                });
            }

            // Update slot status
            await tournamentSlotModel.updateStatus(slotId, 'COMPLETED');

            // Send notifications to all participants
            await notificationService.sendTournamentResults(slotId, results);

            logger.info(`Tournament ${slotId} finalized with ${results.length} participants`);

            return {
                slot_id: slotId,
                total_participants: results.length,
                total_pool: slot.total_pool,
                distributed_amount: distributablePool,
                results
            };
        } catch (error) {
            logger.error('Finalize tournament error:', error);
            throw error;
        }
    }

    /**
     * Calculate Practice Score (Simple)
     */
    calculatePracticeScore(questions, userAnswers) {
        let correctAnswers = 0;

        questions.forEach((q, index) => {
            if (userAnswers[index] && userAnswers[index] === q.correct_option) {
                correctAnswers++;
            }
        });

        return {
            score: correctAnswers * 100,
            correct_answers: correctAnswers,
            speed_bonus: 0,
            accuracy_bonus: 0,
            final_score: correctAnswers * 100
        };
    }

    /**
     * Calculate Tournament Score (with bonuses)
     */
    calculateTournamentScore(questions, userAnswers, completionTime, maxTime, totalQuestions) {
        let correctAnswers = 0;

        questions.forEach((q, index) => {
            if (userAnswers[index] && userAnswers[index] === q.correct_option) {
                correctAnswers++;
            }
        });

        const baseScore = correctAnswers * 100;
        const speedBonus = Math.max(0, (maxTime - completionTime) * 2);
        const accuracyBonus = (correctAnswers / totalQuestions) * 50;
        const finalScore = baseScore + speedBonus + accuracyBonus;

        return {
            score: baseScore,
            correct_answers: correctAnswers,
            speed_bonus: speedBonus,
            accuracy_bonus: accuracyBonus,
            final_score: finalScore
        };
    }

    /**
     * Calculate Refund based on score percentage
     */
    calculateRefund(scorePercentage, entryCoins, refundRules) {
        // refundRules format: {"80": 100, "60": 50, "0": 0}
        const sortedThresholds = Object.keys(refundRules)
            .map(Number)
            .sort((a, b) => b - a);

        for (const threshold of sortedThresholds) {
            if (scorePercentage >= threshold) {
                const refundPercentage = refundRules[threshold.toString()];
                return Math.floor((entryCoins * refundPercentage) / 100);
            }
        }

        return 0;
    }

    /**
     * Log Terms Acceptance
     */
    async logTermsAcceptance(userId, context, referenceId, termsVersion) {
        const query = `
            INSERT INTO terms_acceptance_logs (
                user_id, context, reference_id, terms_version
            ) VALUES ($1, $2, $3, $4)
        `;
        await db.query(query, [userId, context, referenceId, termsVersion]);
    }

    /**
     * Get user's quiz history
     */
    async getUserHistory(userId, mode = null, limit = 20, offset = 0) {
        let query = `
            SELECT qs.*, qsc.name as sub_category_name,
                   ts.slot_name as tournament_name
            FROM quiz_sessions qs
            JOIN quiz_sub_categories qsc ON qs.sub_category_id = qsc.id
            LEFT JOIN tournament_slots ts ON qs.slot_id = ts.id
            WHERE qs.user_id = $1 AND qs.status = 'COMPLETED'
        `;
        const params = [userId];

        if (mode) {
            query += ' AND qs.mode = $2';
            params.push(mode);
        }

        query += ' ORDER BY qs.completed_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }
}

module.exports = new QuizService();