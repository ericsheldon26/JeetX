
const redis = require('redis');
const logger = require('@/utils/logger');

// Redis configuration
const redisConfig = {
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                logger.error('Redis: Too many reconnection attempts');
                return new Error('Too many reconnection attempts');
            }
            // Exponential backoff: 50ms, 100ms, 200ms, etc.
            const delay = Math.min(retries * 50, 3000);
            logger.info(`Redis: Reconnecting in ${delay}ms...`);
            return delay;
        },
    },
    password: process.env.REDIS_PASSWORD || undefined,
};

// Create Redis client
const redisClient = redis.createClient(redisConfig);

// Event handlers
redisClient.on('connect', () => {
    // logger.info('Redis client connecting...');
});

redisClient.on('ready', () => {
    // logger.info('✓ Redis connected successfully');
    // logger.info(`✓ Redis host: ${redisConfig.socket.host}:${redisConfig.socket.port}`);
});

redisClient.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

redisClient.on('end', () => {
    logger.warn('Redis connection closed');
});

redisClient.on('reconnecting', () => {
    // logger.info('Redis reconnecting...');
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error('Failed to connect to Redis:', error);
        process.exit(-1);
    }
})();

/**
 * Set a key-value pair with expiration
 * @param {string} key 
 * @param {string} value 
 * @param {number} expirySeconds 
 */
const setWithExpiry = async (key, value, expirySeconds) => {
    try {
        await redisClient.setEx(key, expirySeconds, value);
        logger.debug(`Redis SET: ${key} (expires in ${expirySeconds}s)`);
    } catch (error) {
        logger.error(`Redis SET error for key ${key}:`, error);
        throw error;
    }
};

/**
 * Get a value by key
 * @param {string} key 
 * @returns {Promise<string|null>}
 */
const get = async (key) => {
    try {
        const value = await redisClient.get(key);
        logger.debug(`Redis GET: ${key} - ${value ? 'found' : 'not found'}`);
        return value;
    } catch (error) {
        logger.error(`Redis GET error for key ${key}:`, error);
        throw error;
    }
};

/**
 * Delete a key
 * @param {string} key 
 */
const del = async (key) => {
    try {
        const result = await redisClient.del(key);
        logger.debug(`Redis DEL: ${key} - ${result ? 'deleted' : 'not found'}`);
        return result;
    } catch (error) {
        logger.error(`Redis DEL error for key ${key}:`, error);
        throw error;
    }
};

/**
 * Check if key exists
 * @param {string} key 
 * @returns {Promise<boolean>}
 */
const exists = async (key) => {
    try {
        const result = await redisClient.exists(key);
        return result === 1;
    } catch (error) {
        logger.error(`Redis EXISTS error for key ${key}:`, error);
        throw error;
    }
};

/**
 * Get remaining TTL for a key
 * @param {string} key 
 * @returns {Promise<number>} TTL in seconds, -1 if no expiry, -2 if key doesn't exist
 */
const getTTL = async (key) => {
    try {
        return await redisClient.ttl(key);
    } catch (error) {
        logger.error(`Redis TTL error for key ${key}:`, error);
        throw error;
    }
};

/**
 * Increment a counter
 * @param {string} key 
 * @returns {Promise<number>} New value
 */
const increment = async (key) => {
    try {
        return await redisClient.incr(key);
    } catch (error) {
        logger.error(`Redis INCR error for key ${key}:`, error);
        throw error;
    }
};

/**
 * Set multiple key-value pairs
 * @param {Object} keyValuePairs 
 */
const setMultiple = async (keyValuePairs) => {
    try {
        const multi = redisClient.multi();

        Object.entries(keyValuePairs).forEach(([key, value]) => {
            multi.set(key, value);
        });

        await multi.exec();
        logger.debug(`Redis MSET: ${Object.keys(keyValuePairs).length} keys set`);
    } catch (error) {
        logger.error('Redis MSET error:', error);
        throw error;
    }
};

/**
 * Flush all data (use with caution!)
 */
const flushAll = async () => {
    try {
        await redisClient.flushAll();
        logger.warn('Redis: All data flushed');
    } catch (error) {
        logger.error('Redis FLUSHALL error:', error);
        throw error;
    }
};

/**
 * Health check
 * @returns {Promise<boolean>}
 */
const healthCheck = async () => {
    try {
        const result = await redisClient.ping();
        return result === 'PONG';
    } catch (error) {
        logger.error('Redis health check failed:', error);
        return false;
    }
};

/**
 * Close Redis connection
 */
const closeConnection = async () => {
    try {
        await redisClient.quit();
        logger.info('Redis connection closed');
    } catch (error) {
        logger.error('Error closing Redis connection:', error);
        throw error;
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('SIGINT received: closing Redis connection...');
    await closeConnection();
});

process.on('SIGTERM', async () => {
    logger.info('SIGTERM received: closing Redis connection...');
    await closeConnection();
});

module.exports = {
    redisClient,
    setWithExpiry,
    get,
    del,
    exists,
    getTTL,
    increment,
    setMultiple,
    flushAll,
    healthCheck,
    closeConnection,

    // Export raw client for advanced use cases
    client: redisClient,
};
