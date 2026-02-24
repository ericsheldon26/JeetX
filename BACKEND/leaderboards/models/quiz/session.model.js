const db = require('@/config/database');

class QuizSessionModel {
    async create(sessionData) {
        const query = `
            INSERT INTO quiz_sessions (
                user_id, sub_category_id, question_set_id, slot_id, mode,
                entry_coins, questions, total_questions, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'IN_PROGRESS')
            RETURNING *
        `;
        const values = [
            sessionData.user_id,
            sessionData.sub_category_id,
            sessionData.question_set_id,
            sessionData.slot_id || null,
            sessionData.mode,
            sessionData.entry_coins,
            JSON.stringify(sessionData.questions),
            sessionData.total_questions
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findById(id) {
        const query = 'SELECT * FROM quiz_sessions WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async findActiveSession(userId, mode) {
        const query = `
            SELECT * FROM quiz_sessions 
            WHERE user_id = $1 AND mode = $2 AND status = 'IN_PROGRESS'
            ORDER BY created_at DESC LIMIT 1
        `;
        const result = await db.query(query, [userId, mode]);
        return result.rows[0];
    }

    async submitAnswers(sessionId, answers, completionTime) {
        const query = `
            UPDATE quiz_sessions 
            SET user_answers = $1, completion_time = $2, completed_at = NOW()
            WHERE id = $3
            RETURNING *
        `;
        const result = await db.query(query, [JSON.stringify(answers), completionTime, sessionId]);
        return result.rows[0];
    }

    async updateScore(sessionId, scoreData) {
        const query = `
            UPDATE quiz_sessions 
            SET score = $1, correct_answers = $2, speed_bonus = $3, 
                accuracy_bonus = $4, final_score = $5, status = 'COMPLETED'
            WHERE id = $6
            RETURNING *
        `;
        const values = [
            scoreData.score,
            scoreData.correct_answers,
            scoreData.speed_bonus,
            scoreData.accuracy_bonus,
            scoreData.final_score,
            sessionId
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async updateRefund(sessionId, refundCoins) {
        const query = 'UPDATE quiz_sessions SET refund_coins = $1 WHERE id = $2 RETURNING *';
        const result = await db.query(query, [refundCoins, sessionId]);
        return result.rows[0];
    }

    async updateRankAndReward(sessionId, rank, coinsWon) {
        const query = 'UPDATE quiz_sessions SET rank = $1, coins_won = $2 WHERE id = $3 RETURNING *';
        const result = await db.query(query, [rank, coinsWon, sessionId]);
        return result.rows[0];
    }

    async getSlotSessions(slotId) {
        const query = `
            SELECT qs.*, u.full_name, u.email
            FROM quiz_sessions qs
            JOIN users u ON qs.user_id = u.id
            WHERE qs.slot_id = $1 AND qs.status = 'COMPLETED'
            ORDER BY qs.final_score DESC, qs.completion_time ASC
        `;
        const result = await db.query(query, [slotId]);
        return result.rows;
    }

    async checkUserInSlot(userId, slotId) {
        const query = 'SELECT * FROM quiz_sessions WHERE user_id = $1 AND slot_id = $2';
        const result = await db.query(query, [userId, slotId]);
        return result.rows[0];
    }
}

module.exports = new QuizSessionModel();