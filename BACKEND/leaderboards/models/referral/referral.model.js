const db = require('@/config/database');


class ReferralModel {
    async create(referralData) {
        const query = `
      INSERT INTO referrals (
        referrer_user_id, referred_user_id, referral_code,
        status, ip_address, device_fingerprint
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

        const values = [
            referralData.referrer_user_id,
            referralData.referred_user_id,
            referralData.referral_code,
            referralData.status || 'APPLIED',
            referralData.ip_address,
            referralData.device_fingerprint,
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findById(id) {
        const query = 'SELECT * FROM referrals WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async findByReferredUser(userId) {
        const query = 'SELECT * FROM referrals WHERE referred_user_id = $1';
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    async findByReferrerUser(userId) {
        const query = 'SELECT * FROM referrals WHERE referrer_user_id = $1';
        const result = await db.query(query, [userId]);
        return result.rows;
    }

    async updateStatus(referralId, status, coinsAwarded = 0) {

        const query = `
      UPDATE referrals
      SET status = $1::varchar,
          coins_awarded = $2,
          completed_at = CASE WHEN $1::varchar = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE completed_at END,
          eligibility_met = CASE WHEN $1::varchar = 'COMPLETED' THEN TRUE ELSE eligibility_met END,
          eligibility_met_at = CASE WHEN $1::varchar = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE eligibility_met_at END
      WHERE id = $3::uuid
      RETURNING *
    `;

        const result = await db.query(query, [status, coinsAwarded, referralId]);
        return result.rows[0];
    }

    async getReferralStats(userId) {
        const query = `
      SELECT 
        COUNT(*) as total_referrals,
        SUM(coins_awarded) as total_earned_coins,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_referrals,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_referrals
      FROM referrals
      WHERE referrer_user_id = $1
    `;

        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    async checkDuplicateReferral(referrerId, referredId) {
        const query = `
      SELECT * FROM referrals
      WHERE referrer_user_id = $1 AND referred_user_id = $2
    `;
        const result = await db.query(query, [referrerId, referredId]);
        return result.rows[0];
    }
}

module.exports = new ReferralModel();
