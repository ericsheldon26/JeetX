
// ==========================================
// src/models/userDevice.model.js
// ==========================================
const db = require('../config/database');

class UserDeviceModel {
    async create(deviceData) {
        const query = `
      INSERT INTO user_devices (
        user_id, device_fingerprint, device_info, status
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

        const values = [
            deviceData.user_id,
            deviceData.device_fingerprint,
            JSON.stringify(deviceData.device_info || {}),
            deviceData.status || 'TRUSTED',
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findByUserAndFingerprint(userId, fingerprint) {
        const query = `
      SELECT * FROM user_devices
      WHERE user_id = $1 AND device_fingerprint = $2
    `;
        const result = await db.query(query, [userId, fingerprint]);
        return result.rows[0];
    }

    async findByUser(userId) {
        const query = `
      SELECT * FROM user_devices
      WHERE user_id = $1
      ORDER BY last_login_at DESC
    `;
        const result = await db.query(query, [userId]);
        return result.rows;
    }

    async updateLastLogin(id) {
        const query = `
      UPDATE user_devices
      SET last_login_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async blockDevice(id) {
        const query = `
      UPDATE user_devices
      SET status = 'BLOCKED'
      WHERE id = $1
      RETURNING *
    `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async delete(id) {
        const query = 'DELETE FROM user_devices WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = new UserDeviceModel();