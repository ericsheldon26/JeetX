const db = require('@/config/database');

class CategoryModel {
    /**
     * Get all active categories with sub-categories
     */
    async getAllWithSubCategories() {
        const query = `
            SELECT 
                sc.id as sub_category_id,
                sc.name as sub_category_name,
                sc.description as sub_category_description,
                sc.icon_url as sub_category_icon,
                sc.display_order as sub_category_order
            FROM quiz_sub_categories sc
            LEFT JOIN quiz_questions q ON sc.id = q.sub_category_id AND q.status = 'ACTIVE'
            LEFT JOIN practice_mode_config pc ON sc.id = pc.sub_category_id AND pc.status = 'ACTIVE'
            LEFT JOIN tournament_slots ts ON sc.id = ts.sub_category_id 
                AND ts.status = 'SCHEDULED' AND ts.start_time > NOW()
            WHERE c.status = 'ACTIVE'
            ORDER BY c.display_order ASC, sc.display_order ASC
        `;

        const result = await db.query(query);
        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            icon_url: row.icon_url,
            display_order: row.display_order,
            total_questions: parseInt(row.total_questions),
            practice_available: row.practice_available,
            tournament_available: parseInt(row.active_tournaments) > 0,
            active_tournaments: parseInt(row.active_tournaments)
        }));
    }

    /**
     * Get all active categories (simple list)
     */
    // async getAllCategories() {
    //     const query = `
    //         SELECT id, name, description, icon_url, display_order
    //         FROM quiz_categories
    //         WHERE status = 'ACTIVE'
    //         ORDER BY display_order ASC
    //     `;
    //     const result = await db.query(query);
    //     return result.rows;
    // }

    // /**
    //  * Get category by ID
    //  */
    // async findById(categoryId) {
    //     const query = `
    //         SELECT id, name, description, icon_url, display_order
    //         FROM quiz_categories
    //         WHERE id = $1 AND status = 'ACTIVE'
    //     `;
    //     const result = await db.query(query, [categoryId]);
    //     return result.rows[0];
    // }

    /**
     * Get sub-categories by category ID
     */
    async getSubCategories(categoryId) {
        const query = `
            SELECT id, name, description, icon_url, display_order
            FROM quiz_sub_categories
            WHERE category_id = $1 AND status = 'ACTIVE'
            ORDER BY display_order ASC
        `;
        const result = await db.query(query, [categoryId]);
        return result.rows;
    }

    /**
     * Get sub-category by ID
     */
    async findSubCategoryById(subCategoryId) {
        const query = `
            SELECT 
                sc.*,
                COUNT(DISTINCT q.id) as total_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'EASY' THEN q.id END) as easy_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'MEDIUM' THEN q.id END) as medium_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'HARD' THEN q.id END) as hard_questions,
                COUNT(DISTINCT qs.id) as question_sets,
                COUNT(DISTINCT ts.id) as active_tournaments
            FROM quiz_sub_categories c
            LEFT JOIN quiz_questions q ON sc.id = q.sub_category_id AND q.status = 'ACTIVE'
            LEFT JOIN question_sets qs ON sc.id = qs.sub_category_id AND qs.status = 'ACTIVE'
            LEFT JOIN tournament_slots ts ON sc.id = ts.sub_category_id 
                AND ts.status = 'SCHEDULED' AND ts.start_time > NOW()
            WHERE sc.id = $1 AND sc.status = 'ACTIVE'
            GROUP BY sc.id
        `;
        const result = await db.query(query, [subCategoryId]);
        return result.rows[0];
    }

    /**
     * Get category with statistics
     */
    async getCategoryWithStats(subCategoryId) {
        const query = `
            SELECT 
                c.*,
                COUNT(DISTINCT q.id) as total_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'EASY' THEN q.id END) as easy_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'MEDIUM' THEN q.id END) as medium_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'HARD' THEN q.id END) as hard_questions,
                COUNT(DISTINCT qs.id) as question_sets,
                COUNT(DISTINCT ts.id) as active_tournaments,
                COUNT(DISTINCT CASE WHEN pc.id IS NOT NULL THEN 1 END) > 0 as practice_available
            FROM quiz_sub_categories c
            LEFT JOIN quiz_questions q ON c.id = q.sub_category_id AND q.status = 'ACTIVE'
            LEFT JOIN question_sets qs ON c.id = qs.sub_category_id AND qs.status = 'ACTIVE'
            LEFT JOIN tournament_slots ts ON c.id = ts.sub_category_id 
                AND ts.status = 'SCHEDULED' AND ts.start_time > NOW()
            LEFT JOIN practice_mode_config pc ON c.id = pc.sub_category_id AND pc.status = 'ACTIVE'
            WHERE c.id = $1 AND c.status = 'ACTIVE'
            GROUP BY c.id
        `;
        const result = await db.query(query, [subCategoryId]);
        return result.rows[0];
    }

    /**
    * Search categories
    */
    async search(searchTerm) {
        const query = `
            SELECT 
                sc.id,
                sc.name,
                sc.description,
                sc.icon_url,
                sc.display_order
            FROM quiz_sub_categories sc
            WHERE sc.status = 'ACTIVE' 
            AND (sc.name ILIKE $1 OR sc.description ILIKE $1)
            ORDER BY sc.display_order ASC
            LIMIT 20
        `;

        const searchPattern = `%${searchTerm}%`;
        const result = await db.query(query, [searchPattern]);
        return result.rows;
    }


    /**
     * Get sub-category with statistics
     */
    async getSubCategoryWithStats(subCategoryId) {
        const query = `
            SELECT 
                sc.*,
                c.name as category_name,
                COUNT(DISTINCT q.id) as total_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'EASY' THEN q.id END) as easy_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'MEDIUM' THEN q.id END) as medium_questions,
                COUNT(DISTINCT CASE WHEN q.difficulty = 'HARD' THEN q.id END) as hard_questions,
                COUNT(DISTINCT qs.id) as question_sets,
                COUNT(DISTINCT ts.id) as active_tournaments
            FROM quiz_sub_categories sc
            JOIN quiz_categories c ON sc.category_id = c.id
            LEFT JOIN quiz_questions q ON sc.id = q.sub_category_id AND q.status = 'ACTIVE'
            LEFT JOIN question_sets qs ON sc.id = qs.sub_category_id AND qs.status = 'ACTIVE'
            LEFT JOIN tournament_slots ts ON sc.id = ts.sub_category_id 
                AND ts.status = 'SCHEDULED' AND ts.start_time > NOW()
            WHERE sc.id = $1 AND sc.status = 'ACTIVE'
            GROUP BY sc.id, c.name
        `;
        const result = await db.query(query, [subCategoryId]);
        return result.rows[0];
    }

    /**
     * Create subCategory (Admin)
     */
    async create(subCategoryData) {
        const gameResult = await db.query(
            `SELECT id FROM games WHERE name = $1 LIMIT 1`,
            ['Quiz']
        );

        if (gameResult.rows.length === 0) {
            throw new Error("Game 'Quiz' not found");
        }

        const quiz_id = gameResult.rows[0].id;
        const query = `
            INSERT INTO quiz_sub_categories (game_id,name, description, icon_url, display_order)
            VALUES ($1, $2, $3, $4,$5)
            RETURNING *
        `;
        const values = [
            quiz_id,
            subCategoryData.name,
            subCategoryData.description,
            subCategoryData.icon_url,
            subCategoryData.display_order || 0
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Update subCategory (Admin)
     */
    async update(id, subCategoryData) {
        const query = `
            UPDATE quiz_sub_categories
            SET name = $1, description = $2, icon_url = $3, display_order = $4, updated_at = NOW()
            WHERE id = $5
            RETURNING *
        `;
        const values = [
            subCategoryData.name,
            subCategoryData.description,
            subCategoryData.icon_url,
            subCategoryData.display_order,
            id
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Toggle status (Admin)
     */
    async toggleStatus(id, status) {
        const query = `
            UPDATE quiz_sub_categories
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        const result = await db.query(query, [status, id]);
        return result.rows[0];
    }

    /**
     * Delete category (Admin)
     */
    async delete(id) {
        // Check if category has questions
        const checkQuery = `
            SELECT COUNT(*) FROM quiz_questions WHERE sub_category_id = $1
        `;
        const checkResult = await db.query(checkQuery, [id]);

        if (parseInt(checkResult.rows[0].count) > 0) {
            throw new Error('Cannot delete sub category with existing questions');
        }

        const query = 'DELETE FROM quiz_sub_categories WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = new CategoryModel();