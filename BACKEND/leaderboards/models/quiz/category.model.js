const db = require('@/config/database');

class CategoryModel {
    /**
     * Get all active categories with sub-categories
     */
    async getAllWithSubCategories() {
        const query = `
            SELECT 
                c.id as category_id,
                c.name as category_name,
                c.description as category_description,
                c.icon_url as category_icon,
                c.display_order as category_order,
                sc.id as sub_category_id,
                sc.name as sub_category_name,
                sc.description as sub_category_description,
                sc.icon_url as sub_category_icon,
                sc.display_order as sub_category_order
            FROM quiz_categories c
            LEFT JOIN quiz_sub_categories sc ON c.id = sc.category_id AND sc.status = 'ACTIVE'
            WHERE c.status = 'ACTIVE'
            ORDER BY c.display_order ASC, sc.display_order ASC
        `;

        const result = await db.query(query);
        return this.formatCategoriesWithSubCategories(result.rows);
    }

    /**
     * Format categories with nested sub-categories
     */
    formatCategoriesWithSubCategories(rows) {
        const categoriesMap = new Map();

        rows.forEach(row => {
            if (!categoriesMap.has(row.category_id)) {
                categoriesMap.set(row.category_id, {
                    id: row.category_id,
                    name: row.category_name,
                    description: row.category_description,
                    icon_url: row.category_icon,
                    display_order: row.category_order,
                    sub_categories: []
                });
            }

            // Add sub-category if exists
            if (row.sub_category_id) {
                categoriesMap.get(row.category_id).sub_categories.push({
                    id: row.sub_category_id,
                    name: row.sub_category_name,
                    description: row.sub_category_description,
                    icon_url: row.sub_category_icon,
                    display_order: row.sub_category_order
                });
            }
        });

        return Array.from(categoriesMap.values());
    }

    /**
     * Get all active categories (simple list)
     */
    async getAllCategories() {
        const query = `
            SELECT id, name, description, icon_url, display_order
            FROM quiz_categories
            WHERE status = 'ACTIVE'
            ORDER BY display_order ASC
        `;
        const result = await db.query(query);
        return result.rows;
    }

    /**
     * Get category by ID
     */
    async findById(categoryId) {
        const query = `
            SELECT id, name, description, icon_url, display_order
            FROM quiz_categories
            WHERE id = $1 AND status = 'ACTIVE'
        `;
        const result = await db.query(query, [categoryId]);
        return result.rows[0];
    }

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
                sc.id,
                sc.name,
                sc.description,
                sc.icon_url,
                sc.display_order,
                sc.category_id,
                c.name as category_name
            FROM quiz_sub_categories sc
            JOIN quiz_categories c ON sc.category_id = c.id
            WHERE sc.id = $1 AND sc.status = 'ACTIVE'
        `;
        const result = await db.query(query, [subCategoryId]);
        return result.rows[0];
    }

    /**
     * Get category with statistics
     */
    async getCategoryWithStats(categoryId) {
        const query = `
            SELECT 
                c.*,
                COUNT(DISTINCT sc.id) as total_sub_categories,
                COUNT(DISTINCT q.id) as total_questions
            FROM quiz_categories c
            LEFT JOIN quiz_sub_categories sc ON c.id = sc.category_id AND sc.status = 'ACTIVE'
            LEFT JOIN quiz_questions q ON sc.id = q.sub_category_id AND q.status = 'ACTIVE'
            WHERE c.id = $1 AND c.status = 'ACTIVE'
            GROUP BY c.id
        `;
        const result = await db.query(query, [categoryId]);
        return result.rows[0];
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
}

module.exports = new CategoryModel();