const db = require('@/config/database');

class PracticeConfigModel {
    async findBySubCategory(subCategoryId) {
        const query = `
            SELECT * FROM practice_mode_config 
            WHERE sub_category_id = $1 AND status = 'ACTIVE'
            ORDER BY created_at DESC LIMIT 1
        `;
        const result = await db.query(query, [subCategoryId]);
        return result.rows[0];
    }

    async create(configData) {
        const query = `
            INSERT INTO practice_mode_config (
                sub_category_id, entry_coins, timer_enabled, timer_duration,
                timer_type, refund_rules, terms_content, terms_version
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [
            configData.sub_category_id,
            configData.entry_coins,
            configData.timer_enabled,
            configData.timer_duration,
            configData.timer_type,
            JSON.stringify(configData.refund_rules),
            configData.terms_content,
            configData.terms_version
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = new PracticeConfigModel();
