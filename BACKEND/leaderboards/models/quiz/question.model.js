const db = require('@/config/database');

class QuestionModel {
    async findById(id) {
        const query = 'SELECT * FROM quiz_questions WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async findBySubCategory(subCategoryId, difficulty = null, limit = null) {
        let query = `
            SELECT * FROM quiz_questions 
            WHERE sub_category_id = $1 AND status = 'ACTIVE'
        `;
        const params = [subCategoryId];

        if (difficulty) {
            query += ' AND difficulty = $2';
            params.push(difficulty);
        }

        if (limit) {
            query += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
            params.push(limit);
        }

        const result = await db.query(query, params);
        return result.rows;
    }

    async getRandomQuestions(subCategoryId, distribution) {
        const questions = [];

        for (const [difficulty, count] of Object.entries(distribution)) {
            const difficultyQuestions = await this.findBySubCategory(
                subCategoryId,
                difficulty,
                count
            );
            questions.push(...difficultyQuestions);
        }

        return questions;
    }

    async create(questionData) {
        const query = `
            INSERT INTO quiz_questions (
                sub_category_id, question_text, option_a, option_b, option_c, option_d,
                correct_option, difficulty, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [
            questionData.sub_category_id,
            questionData.question_text,
            questionData.option_a,
            questionData.option_b,
            questionData.option_c,
            questionData.option_d,
            questionData.correct_option,
            questionData.difficulty,
            questionData.created_by
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async update(id, questionData) {
        const query = `
            UPDATE quiz_questions 
            SET question_text = $1, option_a = $2, option_b = $3, option_c = $4,
                option_d = $5, correct_option = $6, difficulty = $7, updated_at = NOW()
            WHERE id = $8
            RETURNING *
        `;
        const values = [
            questionData.question_text,
            questionData.option_a,
            questionData.option_b,
            questionData.option_c,
            questionData.option_d,
            questionData.correct_option,
            questionData.difficulty,
            id
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async updateStatus(id, status) {
        const query = 'UPDATE quiz_questions SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
        const result = await db.query(query, [status, id]);
        return result.rows[0];
    }
}

module.exports = new QuestionModel();