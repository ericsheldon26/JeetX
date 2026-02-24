/* eslint-disable no-undef */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Create a new pool specifically for migration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'auth_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
});

async function runMigrations() {
    const client = await pool.connect();

    try {
        console.log('🔄 Starting database migration...\n');

        // Read schema file
        // eslint-disable-next-line no-undef
        // const schemaPath = path.join(__dirname, 'schema.sql');

        const quizSchemaPath = path.join(__dirname, 'quiz.schema.sql');
        const walletSchemaPath = path.join(__dirname, 'wallet.schema.sql');
        const leaderboardSchemaPath = path.join(__dirname, 'leaderboard.schema.sql');

        const schemaArrays = [
            // schemaPath,
            // walletSchemaPath,
            quizSchemaPath,
            leaderboardSchemaPath
        ]

        for (const schemaFilePath of schemaArrays) {
            if (!fs.existsSync(schemaFilePath)) {
                console.error('❌ schema.sql file not found at:', schemaFilePath);
                console.log('\nPlease create database/schema.sql with the schema provided in the artifacts');
                process.exit(1);
            }

            const schema = fs.readFileSync(schemaFilePath, 'utf8');
            console.log(`🧱 Running ${path.basename(schemaFilePath, ".sql")} schema`);

            // Execute the schema
            await client.query(schema);
        }



        // console.log('\n✅ Database migration completed successfully!\n');
        // console.log('Tables created:');
        // console.log('  ✓ users');
        // console.log('  ✓ user_devices');
        // console.log('\nIndexes created:');
        // console.log('  ✓ idx_users_firebase_uid');
        // console.log('  ✓ idx_users_email');
        // console.log('  ✓ idx_users_mobile');
        // console.log('  ✓ idx_users_status');
        // console.log('  ✓ idx_user_devices_user_id');
        // console.log('  ✓ idx_user_devices_fingerprint');
        // console.log('\nTriggers created:');
        // console.log('  ✓ update_users_updated_at\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
