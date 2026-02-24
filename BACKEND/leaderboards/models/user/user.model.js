// const mongoose = require("mongoose");
// const getRedisClient = require("@/utils/connections/database/redisClient");


// const UserSchema = mongoose.Schema({
//     name: {
//         firstName: {
//             type: String,
//             required: [true, "First name is required."]
//         },
//         middleName: {
//             type: String,
//             required: false
//         },
//         lastName: {
//             type: String,
//             required: [true, "Last name is required."]
//         }
//     },
//     email: {
//         address: {
//             type: String,
//             match: [
//                 /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                 "Please enter a valid email address."
//             ],
//             lowercase: true
//         },
//         isValid: {
//             type: Boolean,
//             required: true,
//             default: false
//         }
//     },
//     loginEmail: {
//         address: {
//             type: String,
//             match: [
//                 /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                 "Please enter a valid email address."
//             ],
//             lowercase: true
//         },
//         isValid: {
//             type: Boolean,
//             required: true,
//             default: false
//         }
//     },
//     userCategoryId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "UserCategory",
//         required: [true, "User category is required."]
//     },
//     userRoleId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "UserRole",
//         required: [true, "User role is required."]
//     },
//     playerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "PlayerInformation",
//     },
//     employeeId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Employee",
//     },
//     password: {
//         type: String,
//         required: [true, "Password is required."]
//     },
//     userStatus: {
//         type: String,
//         required: [true, "User status is required."],
//         enum: ["active", "inactive"],
//         default: "active"
//     },
//     userType: {
//         type: String,
//         required: [true, "User type is required."],
//         enum: ["admin", "employee", "student", "parent"]
//     },
//     userBlockStatus: {
//         type: String,
//         required: [true, "User block status is required."],
//         enum: ["yes", "no"],
//         default: "no"
//     },
//     userBlockTime: {
//         type: Date,
//         required: false
//     },
//     timezone: {
//         type: String,
//         required: [true, "User timezone is required."]
//     },

// }, { timestamps: true });


// // module.exports = mongoose.model("User", UserSchema);


// const { pool } = require("@/utils/connections/database/connectDBPG")

// class User {
//   static async create(data) {
//     const query = `
//       INSERT INTO users (
//         firebase_user_id,
//         first_name, middle_name, last_name,
//         email_address, email_is_valid,
//         login_email_address, login_email_is_valid,
//         user_category_id, user_role_id,
//         player_id, employee_id,
//         user_status, user_type,
//         user_block_status, user_block_time,
//         timezone
//       ) VALUES (
//         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
//       )
//       RETURNING *;
//     `;

//     const values = [
//       data.firebaseUserId || null,
//       data.name.firstName,
//       data.name.middleName,
//       data.name.lastName,
//       data.email?.address?.toLowerCase(),
//       data.email?.isValid ?? false,
//       data.loginEmail?.address?.toLowerCase(),
//       data.loginEmail?.isValid ?? false,
//       data.userCategoryId,
//       data.userRoleId,
//       data.playerId,
//       data.employeeId,
//       data.userStatus || "active",
//       data.userType,
//       data.userBlockStatus || "no",
//       data.userBlockTime,
//       data.timezone,
//     ];

//     const { rows } = await pool.query(query, values);
//     return rows[0];
//   }

//   static async findByEmail(email) {
//     const { rows } = await pool.query(
//       `SELECT * FROM users WHERE email_address = $1`,
//       [email.toLowerCase()]
//     );
//     return rows[0];
//   }

//   static async findByFirebaseId(firebaseId) {
//     if (!firebaseId) return null;
//     const { rows } = await pool.query(
//       `SELECT * FROM users WHERE firebase_user_id = $1`,
//       [firebaseId]
//     );
//     return rows[0];
//   }

//   // Login by firebase id (passwords removed)
//   static async loginByFirebase(firebaseId) {
//     if (!firebaseId) return null;
//     const { rows } = await pool.query(
//       `SELECT
//               id,
//               first_name,
//               middle_name,
//               last_name,
//               email_address,
//               email_is_valid,
//               user_status,
//               user_type,
//               user_block_status
//             FROM users
//             WHERE firebase_user_id = $1
//             LIMIT 1;`,
//       [firebaseId]
//     );

//     return rows[0];
//   }
//   static async middleware(userId) {
//     const query = `
//     SELECT
//       first_name,
//       middle_name,
//       last_name,
//       email_address,
//       email_is_valid,
//       user_status,
//       user_type,
//       user_block_status,
//       timezone
//     FROM users
//     WHERE id = $1
//     LIMIT 1;
//   `;
//     const { rows } = await pool.query(
//       query,
//       [userId]
//     );

//     return rows[0] || null;
//   }

//   static async findById(id) {
//     const { rows } = await pool.query(
//       `SELECT * FROM users WHERE id = $1`,
//       [id]
//     );
//     return rows[0];
//   }
// }

// module.exports = User;


// ==========================================
// src/models/user.model.js
// ==========================================
const db = require('@/config/database');

class UserModel {
  async create(userData) {
    const query = `
      INSERT INTO users (
        firebase_uid, full_name, email, mobile,
        is_email_verified, is_mobile_verified,
        referral_code, status,role
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      userData.firebase_uid,
      userData.full_name,
      userData.email,
      userData.mobile,
      userData.is_email_verified || false,
      userData.is_mobile_verified || false,
      userData.referral_code || null,
      userData.status || 'ACTIVE',
      userData.role,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  async findByMobile(mobile) {
    const query = 'SELECT * FROM users WHERE mobile = $1';
    const result = await db.query(query, [mobile]);
    return result.rows[0];
  }

  async findByFirebaseUid(firebaseUid) {
    const query = 'SELECT * FROM users WHERE firebase_uid = $1';
    const result = await db.query(query, [firebaseUid]);
    return result.rows[0];
  }

  async update(id, userData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(userData[key]);
        paramCount++;
      }
    });

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async updateLastLogin(id) {
    const query = `
      UPDATE users
      SET last_login_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async blockUser(id) {
    const query = `
      UPDATE users
      SET status = 'BLOCKED'
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async unblockUser(id) {
    const query = `
      UPDATE users
      SET status = 'ACTIVE'
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = new UserModel();
