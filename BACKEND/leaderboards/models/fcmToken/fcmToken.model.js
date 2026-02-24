const db = require('@/config/database');


class FCMTokenModel {
    async saveToken(userId, fcmToken, deviceType, deviceId) {
        const query = `
      INSERT INTO user_fcm_tokens (user_id, fcm_token, device_type, device_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, fcm_token) 
      DO UPDATE SET 
        is_active = TRUE,
        last_used_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

        const result = await db.query(query, [userId, fcmToken, deviceType, deviceId]);
        return result.rows[0];
    }

    async getActiveTokens(userId) {
        const query = `
      SELECT fcm_token FROM user_fcm_tokens
      WHERE user_id = $1 AND is_active = TRUE
    `;
        const result = await db.query(query, [userId]);
        return result.rows.map(row => row.fcm_token);
    }

    async deactivateToken(fcmToken) {
        const query = `
      UPDATE user_fcm_tokens
      SET is_active = FALSE
      WHERE fcm_token = $1
    `;
        await db.query(query, [fcmToken]);
    }

    async removeToken(userId, fcmToken) {
        const query = `
      DELETE FROM user_fcm_tokens
      WHERE user_id = $1 AND fcm_token = $2
    `;
        await db.query(query, [userId, fcmToken]);
    }

    async cleanupInactiveTokens(daysInactive = 30) {
        const query = `
      DELETE FROM user_fcm_tokens
      WHERE is_active = FALSE 
      AND last_used_at < CURRENT_TIMESTAMP - INTERVAL '${daysInactive} days'
      RETURNING COUNT(*) as count
    `;
        const result = await db.query(query);
        return parseInt(result.rows[0].count);
    }
}

module.exports = new FCMTokenModel();