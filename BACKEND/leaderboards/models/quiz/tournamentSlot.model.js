const db = require('@/config/database');

class TournamentSlotModel {
    async findById(id) {
        const query = `
            SELECT ts.*, qsc.name as sub_category_name 
            FROM tournament_slots ts
            JOIN quiz_sub_categories qsc ON ts.sub_category_id = qsc.id
            WHERE ts.id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async findActiveSlots(subCategoryId = null) {
        let query = `
            SELECT ts.*, qsc.name as sub_category_name,
                   (ts.max_players - ts.current_players) as available_spots
            FROM tournament_slots ts
            JOIN quiz_sub_categories qsc ON ts.sub_category_id = qsc.id
            WHERE ts.status = 'SCHEDULED' 
            AND ts.start_time > NOW()
            AND ts.current_players < ts.max_players
        `;
        const params = [];

        if (subCategoryId) {
            query += ' AND ts.sub_category_id = $1';
            params.push(subCategoryId);
        }

        query += ' ORDER BY ts.start_time ASC';
        const result = await db.query(query, params);
        return result.rows;
    }

    async incrementPlayerCount(slotId) {
        const query = `
            UPDATE tournament_slots 
            SET current_players = current_players + 1,
                total_pool = total_pool + entry_coins,
                distributable_pool = FLOOR((total_pool + entry_coins) * (100 - platform_fee_percentage) / 100),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(query, [slotId]);
        return result.rows[0];
    }

    async updateStatus(slotId, status) {
        const query = 'UPDATE tournament_slots SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
        const result = await db.query(query, [status, slotId]);
        return result.rows[0];
    }

    async create(slotData) {
        const query = `
            INSERT INTO tournament_slots (
                sub_category_id, question_set_id, slot_name, entry_coins,
                start_time, end_time, max_players, timer_duration,
                platform_fee_percentage, reward_distribution
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const values = [
            slotData.sub_category_id,
            slotData.question_set_id,
            slotData.slot_name,
            slotData.entry_coins,
            slotData.start_time,
            slotData.end_time,
            slotData.max_players,
            slotData.timer_duration,
            slotData.platform_fee_percentage || 20,
            JSON.stringify(slotData.reward_distribution)
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = new TournamentSlotModel();