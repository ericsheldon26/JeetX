const db = require('@/config/database');

class QuestionSetModel {
    async findById(id) {
        const query = 'SELECT * FROM question_sets WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async findBySubCategoryAndMode(subCategoryId, mode) {
        const query = `
            SELECT * FROM question_sets 
            WHERE sub_category_id = $1 AND mode = $2 AND status = 'ACTIVE'
        `;
        const result = await db.query(query, [subCategoryId, mode]);
        return result.rows;
    }

    async create(setData) {
        const query = `
            INSERT INTO question_sets (
                sub_category_id, mode, name, total_questions, 
                difficulty_distribution, is_randomized, fixed_question_ids
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [
            setData.sub_category_id,
            setData.mode,
            setData.name,
            setData.total_questions,
            JSON.stringify(setData.difficulty_distribution),
            setData.is_randomized,
            setData.fixed_question_ids
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = new QuestionSetModel();