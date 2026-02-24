/* eslint-disable no-undef */

const { Pool } = require('pg');
const logger = require('@/utils/logger');

// Database configuration from environment variables
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'auth_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',

    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    min: 5, // Minimum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 5000, // How long to wait for a connection

    // Additional SSL configuration for production
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false, // Set to true in production with proper certificates
    } : false,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Event handlers for pool
pool.on('connect', (client) => {
    // logger.info('New database connection established');
});

pool.on('acquire', (client) => {
    // logger.debug('Client acquired from pool');
});

pool.on('error', (err, client) => {
    logger.error('Unexpected error on idle database client:', err);
    process.exit(-1);
});

pool.on('remove', (client) => {
    logger.debug('Client removed from pool');
});

// Test database connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        logger.error('Database connection test failed:', err);
        process.exit(-1);
    } else {
        // logger.info('✓ PostgreSQL connected successfully');
        // logger.info(`✓ Database: ${dbConfig.database}`);
        // logger.info(`✓ Server time: ${res.rows[0].now}`);
    }
});

/**
 * Execute a SQL query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
    const start = Date.now();

    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        logger.debug('Executed query', {
            text,
            duration,
            rows: result.rowCount,
        });

        return result;
    } catch (error) {
        logger.error('Database query error:', {
            text,
            error: error.message,
        });
        throw error;
    }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
const getClient = async () => {
    const client = await pool.connect();

    const originalQuery = client.query;
    const originalRelease = client.release;

    // Set a timeout for the client
    const timeout = setTimeout(() => {
        logger.error('Client checkout timeout - releasing client');
        client.release();
    }, 30000);

    // Monkey patch the query method to add logging
    client.query = (...args) => {
        client.lastQuery = args;
        return originalQuery.apply(client, args);
    };

    // Monkey patch the release method
    client.release = () => {
        clearTimeout(timeout);
        client.query = originalQuery;
        client.release = originalRelease;
        return originalRelease.apply(client);
    };

    return client;
};

/**
 * Execute queries in a transaction
 * @param {Function} callback - Async function containing queries
 * @returns {Promise} Transaction result
 */
const transaction = async (callback) => {
    const client = await getClient();

    try {
        await client.query('BEGIN');
        logger.debug('Transaction started');

        const result = await callback(client);

        await client.query('COMMIT');
        logger.debug('Transaction committed');

        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Transaction rolled back:', error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Check database connection health
 * @returns {Promise<boolean>}
 */
const healthCheck = async () => {
    try {
        const result = await query('SELECT 1 as health');
        return result.rows[0].health === 1;
    } catch (error) {
        logger.error('Database health check failed:', error);
        return false;
    }
};

/**
 * Get pool statistics
 * @returns {Object} Pool statistics
 */
const getPoolStats = () => {
    return {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount,
    };
};

/**
 * Close all database connections
 * Useful for graceful shutdown
 */
const closePool = async () => {
    try {
        await pool.end();
        logger.info('Database connection pool closed');
    } catch (error) {
        logger.error('Error closing database pool:', error);
        throw error;
    }
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
    logger.info('SIGINT received: closing database connections...');
    await closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('SIGTERM received: closing database connections...');
    await closePool();
    process.exit(0);
});

// Export the pool and helper functions
module.exports = {
    pool,
    query,
    getClient,
    transaction,
    healthCheck,
    getPoolStats,
    closePool,
};
