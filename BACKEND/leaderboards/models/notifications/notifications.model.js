const db = require('@/config/database');


class NotificationModel {
    async create(notificationData) {
        const query = `
      INSERT INTO user_notifications (
        user_id, title, message, category, delivery_mode,
        screen_redirect, data, campaign_id, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

        const values = [
            notificationData.user_id,
            notificationData.title,
            notificationData.message,
            notificationData.category,
            notificationData.delivery_mode || 'BOTH',
            notificationData.screen_redirect || null,
            notificationData.data ? JSON.stringify(notificationData.data) : null,
            notificationData.campaign_id || null,
            notificationData.expires_at || null,
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findByUserId(userId, limit = 50, offset = 0) {
        const query = `
      SELECT * FROM user_notifications
      WHERE user_id = $1
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
        const result = await db.query(query, [userId, limit, offset]);
        return result.rows;
    }

    async findByCategory(userId, category, limit = 50) {
        const query = `
      SELECT * FROM user_notifications
      WHERE user_id = $1 AND category = $2
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      ORDER BY created_at DESC
      LIMIT $3
    `;
        const result = await db.query(query, [userId, category, limit]);
        return result.rows;
    }

    async getUnreadCount(userId) {
        const query = `
      SELECT COUNT(*) as count
      FROM user_notifications
      WHERE user_id = $1 AND is_read = FALSE
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;
        const result = await db.query(query, [userId]);
        return parseInt(result.rows[0].count);
    }

    async markAsRead(notificationId, userId) {
        const query = `
      UPDATE user_notifications
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
        const result = await db.query(query, [notificationId, userId]);
        return result.rows[0];
    }

    async markAllAsRead(userId) {
        const query = `
      UPDATE user_notifications
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND is_read = FALSE
      RETURNING COUNT(*) as count
    `;
        const result = await db.query(query, [userId]);
        return parseInt(result.rows[0].count);
    }

    async deleteNotification(notificationId, userId) {
        const query = `
      DELETE FROM user_notifications
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
        const result = await db.query(query, [notificationId, userId]);
        return result.rows[0];
    }

    async deleteExpired() {
        const query = `
      DELETE FROM user_notifications
      WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP
      RETURNING COUNT(*) as count
    `;
        const result = await db.query(query);
        return parseInt(result.rows[0].count);
    }
}

module.exports = new NotificationModel();
