require('dotenv').config();
require("module-alias/register");

const { Pool } = require('pg');
const firebaseService = require('@/auth/services/firebase.service');
const userModel = require('@/auth/models/user/user.model');
const adminAuthController = require('@/admin/controllers/admin/auth.controller');
const userAuthController = require('@/auth/controllers/auth.controller');

// Create a new pool specifically for seeding
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'auth_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
});

async function seedDatabase() {
    const client = await pool.connect();

    try {
        console.log('🌱 Starting database seeding...\n');

        // Check if tables exist
        const tablesExist = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'users', 
        'user_devices', 
        'user_fcm_tokens',
        'user_notifications',
        'user_notification_preferences',
        'referrals',
        'wallets',
        'wallet_transactions'
    )
`);

        const requiredTables = [
            'users',
            'user_devices',
            'user_fcm_tokens',
            'user_notifications',
            'user_notification_preferences',
            'referrals',
            'wallets',
            'wallet_transactions'
        ];

        if (tablesExist.rows.length < requiredTables.length) {
            console.error('❌ Required tables do not exist!');
            console.log('\nMissing tables:');
            const existingTableNames = tablesExist.rows.map(row => row.table_name);
            const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));
            missingTables.forEach(table => console.log(`  - ${table}`));
            console.log('\nPlease run migrations first:');
            console.log('  npm run migrate\n');
            process.exit(1);
        }

        console.log('✓ All required tables verified\n');

        // Clear existing data
        console.log('🗑️  Clearing existing user data...');

        // Truncate in correct order (respecting foreign key constraints)
        await client.query(`
    TRUNCATE 
        wallet_transactions,
        wallets,
        user_fcm_tokens,
        user_notifications,
        user_notification_preferences,
        referrals,
        user_devices,
        users
    CASCADE
`);

        console.log('✓ User data cleared\n');

        // Seed test users
        console.log('👤 Seeding test users...');



        const testUsers = [
            {
                full_name: 'Aritra Naharay',
                email: 'aritranaharay@gmail.com',
                password: 'Shashwatin@0812',
                mobile: '+919599904224',
                country_code: '+91',
                is_email_verified: true,
                is_mobile_verified: true,
                status: 'ACTIVE',
                role: 'SUPER_ADMIN'
            },
            {
                full_name: 'Himanshi P',
                email: 'ph093279@gmail.com',
                password: 'Shashwatin@0812',
                mobile: '+919499172303',
                country_code: '+91',
                is_email_verified: true,
                is_mobile_verified: true,
                status: 'ACTIVE',
                role: 'USER'
            },

            {
                full_name: 'Aritra N',
                email: 'aritrasings@gmail.com',
                mobile: '+919958050224',
                password: 'Shashwatin@0812',
                country_code: '+91',
                is_email_verified: true,
                is_mobile_verified: true,
                status: 'ACTIVE',
                role: 'ADMIN'
            }
        ];

        for (const user of testUsers) {
            let admin_permissions = null
            let result
            const password_hash = userAuthController.hashPassword(user.password)

            const firebaseUser = await firebaseService.createUserWithEmailPassword(
                user.email,
                user.password,
                user.mobile
            );

            if (user.role == 'USER') {
                const userData = {
                    firebase_uid: firebaseUser.uid,
                    password_hash,
                    full_name: user.full_name,
                    mobile: user.mobile,
                    country_code: user.country_code,
                    email: user.email,
                    password: user.password,
                    confirm_password: user.password,
                    role: user.role,
                }
                const createUser = await userModel.create(userData);
                const userId = createUser.id
                const referralService = require('@/auth/services/referral.service');
                await referralService.createReferralCodeForUser(userId);

                // CREATE WALLET FOR NEW USER
                const walletModel = require('@/auth/models/wallet/wallet.model');
                await walletModel.create(userId, 10000000);
            }
            else {
                admin_permissions = adminAuthController.getDefaultPermissions()


                const query = `
        INSERT INTO users (
          firebase_uid,password_hash, full_name, email, mobile,
          is_email_verified, is_mobile_verified, status,role,admin_permissions
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10)
        RETURNING id, email
      `;

                await client.query(query, [
                    firebaseUser.uid,
                    password_hash,
                    user.full_name,
                    user.email,
                    user.mobile,
                    user.is_email_verified,
                    user.is_mobile_verified,
                    user.status,
                    user.role,
                    admin_permissions
                ]);
            }

            console.log(`  ✓ Created user: ${user.email}`);
        }

        console.log('\n✅ Database seeded successfully!\n');
        console.log('Test users created:');
        console.log('  Email: aritranaharay@gmail.com-SUPER_ADMIN');
        console.log('  Email: ph093279@gmail.com-USER');
        console.log('  Email: aritrasings@gmail.com-ADMIN');
        console.log('\nYou can use these emails for testing with any password\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase();
