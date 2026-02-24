
const logger = require('@/utils/logger');

/**
 * Validate required environment variables
 */
const validateEnvironment = () => {
    const required = [
        'DB_HOST',
        'DB_PORT',
        'DB_NAME',
        'DB_USER',
        // 'DB_PASSWORD',
        'REDIS_HOST',
        'REDIS_PORT',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_CLIENT_EMAIL',
        // 'SMTP_HOST',
        // 'SMTP_PORT',
        // 'SMTP_USER',
        // 'SMTP_PASSWORD',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        logger.error('Missing required environment variables:');
        missing.forEach(key => logger.error(`  - ${key}`));
        throw new Error('Environment validation failed');
    }

    // logger.info('✓ Environment variables validated');
};

/**
 * Validate JWT secrets strength
 */
const validateSecrets = () => {
    const minLength = 32;

    if (process.env.JWT_SECRET.length < minLength) {
        throw new Error(`JWT_SECRET must be at least ${minLength} characters long`);
    }

    if (process.env.JWT_REFRESH_SECRET.length < minLength) {
        throw new Error(`JWT_REFRESH_SECRET must be at least ${minLength} characters long`);
    }

    if (process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different');
    }

    // logger.info('✓ JWT secrets validated');
};

/**
 * Display configuration summary (without sensitive data)
 */
const displayConfigSummary = () => {
    // logger.info('='.repeat(50));
    // logger.info('Configuration Summary:');
    // logger.info('='.repeat(50));
    // logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    // logger.info(`Port: ${process.env.PORT || 3000}`);
    // logger.info(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    // logger.info(`Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    // logger.info(`Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`);
    // logger.info(`SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
    // logger.info(`JWT Access Token Expiry: ${process.env.JWT_ACCESS_EXPIRY || '15m'}`);
    // logger.info(`JWT Refresh Token Expiry: ${process.env.JWT_REFRESH_EXPIRY || '7d'}`);
    // logger.info(`OTP Length: ${process.env.OTP_LENGTH || 6} digits`);
    // logger.info(`OTP Expiry: ${process.env.OTP_EXPIRY_MINUTES || 5} minutes`);
    // logger.info(`OTP Resend Delay: ${process.env.OTP_RESEND_SECONDS || 30} seconds`);
    // logger.info('='.repeat(50));
};

/**
 * Initialize all configurations
 */
const initializeConfig = async () => {
    try {
        // logger.info('Initializing configuration...');

        // Validate environment
        validateEnvironment();
        validateSecrets();

        // Display summary
        displayConfigSummary();

        // Import and initialize database
        const database = require('./database');

        // Import and initialize Redis
        const redis = require('./redis');

        // Import and initialize Firebase
        const firebase = require('./firebase');

        // Perform health checks
        logger.info('Performing health checks...');

        const dbHealthy = await database.healthCheck();
        if (!dbHealthy) {
            throw new Error('Database health check failed');
        }
        // logger.info('✓ Database health check passed');

        const redisHealthy = await redis.healthCheck();
        if (!redisHealthy) {
            throw new Error('Redis health check failed');
        }
        // logger.info('✓ Redis health check passed');

        const firebaseHealthy = await firebase.healthCheck();
        if (!firebaseHealthy) {
            throw new Error('Firebase health check failed');
        }
        // logger.info('✓ Firebase health check passed');

        logger.info('✓ All configurations initialized successfully');

        return {
            database,
            redis,
            firebase,
        };
    } catch (error) {
        logger.error('Configuration initialization failed:', error);
        throw error;
    }
};

/**
 * Get configuration values
 */
const getConfig = () => {
    return {
        app: {
            port: parseInt(process.env.PORT) || 3000,
            env: process.env.NODE_ENV || 'development',
            corsOrigin: process.env.CORS_ORIGIN || '*',
        },
        database: {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            name: process.env.DB_NAME,
            user: process.env.DB_USER,
        },
        redis: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
            refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
        },
        otp: {
            length: parseInt(process.env.OTP_LENGTH) || 6,
            expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES) || 5,
            resendSeconds: parseInt(process.env.OTP_RESEND_SECONDS) || 30,
            maxAttempts: parseInt(process.env.MAX_OTP_ATTEMPTS) || 5,
        },
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000,
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5,
        },
        firebase: {
            projectId: process.env.FIREBASE_PROJECT_ID,
        },
        smtp: {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            user: process.env.SMTP_USER,
        },
    };
};

module.exports = {
    validateEnvironment,
    validateSecrets,
    displayConfigSummary,
    initializeConfig,
    getConfig,
};
