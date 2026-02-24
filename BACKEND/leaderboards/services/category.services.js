
const categoryModel = require('@/models/quiz/category.model');
const practiceConfigModel = require('@/models/quiz/practiceConfig.model');
const tournamentSlotModel = require('@/models/quiz/tournamentSlot.model');
const logger = require('@/utils/logger');
const db = require('@/config/database');


class CategoryService {
    /**
     * Get all categories with sub-categories for mobile
     */
    async getAllCategoriesForMobile() {
        try {
            const categories = await categoryModel.getAllWithSubCategories();

            // Enrich with availability info
            const enrichedCategories = await Promise.all(
                categories.map(async (category) => {
                    const enrichedSubCategories = await Promise.all(
                        category.sub_categories.map(async (subCategory) => {
                            // Check if practice mode is available
                            const practiceConfig = await practiceConfigModel.findBySubCategory(subCategory.id);

                            // Check if tournaments are available
                            const tournaments = await tournamentSlotModel.findActiveSlots(subCategory.id);

                            return {
                                ...subCategory,
                                practice_available: !!practiceConfig,
                                tournament_available: tournaments.length > 0,
                                active_tournaments: tournaments.length
                            };
                        })
                    );

                    return {
                        ...category,
                        sub_categories: enrichedSubCategories,
                        total_sub_categories: enrichedSubCategories.length
                    };
                })
            );

            return enrichedCategories;
        } catch (error) {
            logger.error('Get all categories error:', error);
            throw error;
        }
    }

    /**
     * Get category details with sub-categories
     */
    async getCategoryDetails(categoryId) {
        try {
            const category = await categoryModel.getCategoryWithStats(categoryId);

            if (!category) {
                throw new Error('Category not found');
            }

            const subCategories = await categoryModel.getSubCategories(categoryId);

            // Enrich sub-categories with availability
            const enrichedSubCategories = await Promise.all(
                subCategories.map(async (subCategory) => {
                    const practiceConfig = await practiceConfigModel.findBySubCategory(subCategory.id);
                    const tournaments = await tournamentSlotModel.findActiveSlots(subCategory.id);

                    return {
                        ...subCategory,
                        practice_available: !!practiceConfig,
                        tournament_available: tournaments.length > 0,
                        active_tournaments: tournaments.length
                    };
                })
            );

            return {
                ...category,
                sub_categories: enrichedSubCategories
            };
        } catch (error) {
            logger.error('Get category details error:', error);
            throw error;
        }
    }

    /**
     * Get sub-category details
     */
    async getSubCategoryDetails(subCategoryId) {
        try {
            const subCategory = await categoryModel.getSubCategoryWithStats(subCategoryId);

            if (!subCategory) {
                throw new Error('Sub-category not found');
            }

            // Get practice config
            const practiceConfig = await practiceConfigModel.findBySubCategory(subCategoryId);

            // Get active tournaments
            const tournaments = await tournamentSlotModel.findActiveSlots(subCategoryId);

            return {
                ...subCategory,
                practice_mode: practiceConfig ? {
                    available: true,
                    entry_coins: practiceConfig.entry_coins,
                    timer_enabled: practiceConfig.timer_enabled,
                    timer_duration: practiceConfig.timer_duration
                } : {
                    available: false
                },
                tournament_mode: {
                    available: tournaments.length > 0,
                    active_slots: tournaments.length,
                    upcoming_tournaments: tournaments.slice(0, 5) // First 5 upcoming
                }
            };
        } catch (error) {
            logger.error('Get sub-category details error:', error);
            throw error;
        }
    }

    /**
     * Search categories and sub-categories
     */
    async searchCategories(searchTerm) {
        try {
            const query = `
                SELECT 
                    'category' as type,
                    c.id,
                    c.name,
                    c.description,
                    c.icon_url,
                    NULL as category_id,
                    NULL as category_name
                FROM quiz_categories c
                WHERE c.status = 'ACTIVE' 
                AND (c.name ILIKE $1 OR c.description ILIKE $1)
                
                UNION ALL
                
                SELECT 
                    'sub_category' as type,
                    sc.id,
                    sc.name,
                    sc.description,
                    sc.icon_url,
                    sc.category_id,
                    c.name as category_name
                FROM quiz_sub_categories sc
                JOIN quiz_categories c ON sc.category_id = c.id
                WHERE sc.status = 'ACTIVE' 
                AND (sc.name ILIKE $1 OR sc.description ILIKE $1)
                
                ORDER BY type DESC, name ASC
                LIMIT 20
            `;

            const searchPattern = `%${searchTerm}%`;
            const result = await db.query(query, [searchPattern]);

            return result.rows;
        } catch (error) {
            logger.error('Search categories error:', error);
            throw error;
        }
    }
}

module.exports = new CategoryService();