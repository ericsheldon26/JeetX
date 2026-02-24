const db = require('@/config/database');


class CampaignModel {
    async create(campaignData) {
        const query = `
      INSERT INTO admin_notification_campaigns (
        title, message, category, target_type, target_segment,
        screen_redirect, data, schedule_at, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

        const values = [
            campaignData.title,
            campaignData.message,
            campaignData.category,
            campaignData.target_type,
            campaignData.target_segment || null,
            campaignData.screen_redirect || null,
            campaignData.data ? JSON.stringify(campaignData.data) : null,
            campaignData.schedule_at || null,
            campaignData.created_by,
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findById(id) {
        const query = 'SELECT * FROM admin_notification_campaigns WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async findAll(limit = 50, offset = 0) {
        const query = `
      SELECT c.*, u.full_name as created_by_name
      FROM admin_notification_campaigns c
      LEFT JOIN users u ON c.created_by = u.id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await db.query(query, [limit, offset]);
        return result.rows;
    }

    async updateStatus(id, status, updateData = {}) {
        const fields = ['status = $2'];
        const values = [id, status];
        let paramCount = 3;

        if (status === 'SENT') {
            fields.push('sent_at = CURRENT_TIMESTAMP');
        }

        if (updateData.total_users !== undefined) {
            fields.push(`total_users = $${paramCount}`);
            values.push(updateData.total_users);
            paramCount++;
        }

        if (updateData.sent_count !== undefined) {
            fields.push(`sent_count = $${paramCount}`);
            values.push(updateData.sent_count);
            paramCount++;
        }

        if (updateData.failed_count !== undefined) {
            fields.push(`failed_count = $${paramCount}`);
            values.push(updateData.failed_count);
            paramCount++;
        }

        const query = `
      UPDATE admin_notification_campaigns
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async addTargets(campaignId, userIds) {
        const values = userIds.map((userId, index) =>
            `($1, $${index + 2})`
        ).join(', ');

        const query = `
      INSERT INTO admin_notification_targets (campaign_id, user_id)
      VALUES ${values}
      ON CONFLICT (campaign_id, user_id) DO NOTHING
    `;

        await db.query(query, [campaignId, ...userIds]);
    }

    async getTargetUsers(campaignId) {
        const query = `
      SELECT user_id FROM admin_notification_targets
      WHERE campaign_id = $1 AND is_sent = FALSE
    `;
        const result = await db.query(query, [campaignId]);
        return result.rows.map(row => row.user_id);
    }

    async markTargetSent(campaignId, userId) {
        const query = `
      UPDATE admin_notification_targets
      SET is_sent = TRUE, sent_at = CURRENT_TIMESTAMP
      WHERE campaign_id = $1 AND user_id = $2
    `;
        await db.query(query, [campaignId, userId]);
    }
}

module.exports = new CampaignModel();
