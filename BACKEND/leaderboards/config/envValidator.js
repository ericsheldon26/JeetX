
// ==========================================
// src/config/envValidator.js - Detailed Environment Validator
// ==========================================
const chalk = require('chalk'); // Optional: for colored output

/**
 * Environment variable schema
 */
const envSchema = {
    // Server
    PORT: { type: 'number', default: 3000, required: false },
    NODE_ENV: { type: 'string', default: 'development', required: false },

    // Database
    DB_HOST: { type: 'string', required: true },
    DB_PORT: { type: 'number', required: true },
    DB_NAME: { type: 'string', required: true },
    DB_USER: { type: 'string', required: true },
    DB_PASSWORD: { type: 'string', required: true, sensitive: true },

    // Redis
    REDIS_HOST: { type: 'string', required: true },
    REDIS_PORT: { type: 'number', required: true },
    REDIS_PASSWORD: { type: 'string', required: false, sensitive: true },

    // JWT
    JWT_SECRET: { type: 'string', required: true, minLength: 32, sensitive: true },
    JWT_REFRESH_SECRET: { type: 'string', required: true, minLength: 32, sensitive: true },
    JWT_ACCESS_EXPIRY: { type: 'string', default: '15m', required: false },
    JWT_REFRESH_EXPIRY: { type: 'string', default: '7d', required: false },

    // Firebase
    FIREBASE_PROJECT_ID: { type: 'string', required: true },
    FIREBASE_PRIVATE_KEY: { type: 'string', required: true, sensitive: true },
    FIREBASE_CLIENT_EMAIL: { type: 'string', required: true },

    // SMTP
    SMTP_HOST: { type: 'string', required: true },
    SMTP_PORT: { type: 'number', required: true },
    SMTP_USER: { type: 'string', required: true },
    SMTP_PASSWORD: { type: 'string', required: true, sensitive: true },

    // OTP
    OTP_LENGTH: { type: 'number', default: 6, required: false },
    OTP_EXPIRY_MINUTES: { type: 'number', default: 5, required: false },
    OTP_RESEND_SECONDS: { type: 'number', default: 30, required: false },
    MAX_OTP_ATTEMPTS: { type: 'number', default: 5, required: false },

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: { type: 'number', default: 3600000, required: false },
    RATE_LIMIT_MAX_REQUESTS: { type: 'number', default: 5, required: false },

    // CORS
    CORS_ORIGIN: { type: 'string', default: '*', required: false },
};

/**
 * Validate environment variables against schema
 */
const validateEnvSchema = () => {
    const errors = [];
    const warnings = [];

    Object.entries(envSchema).forEach(([key, schema]) => {
        const value = process.env[key];

        // Check required
        if (schema.required && !value) {
            errors.push(`Missing required environment variable: ${key}`);
            return;
        }

        // Skip if not required and not set
        if (!schema.required && !value) {
            if (schema.default) {
                process.env[key] = schema.default.toString();
            }
            return;
        }

        // Type validation
        if (schema.type === 'number' && isNaN(Number(value))) {
            errors.push(`${key} must be a number, got: ${value}`);
        }

        // Min length validation
        if (schema.minLength && value.length < schema.minLength) {
            errors.push(`${key} must be at least ${schema.minLength} characters long`);
        }

        // Warnings for defaults in production
        if (process.env.NODE_ENV === 'production' && value === schema.default) {
            warnings.push(`${key} is using default value in production`);
        }
    });

    // Check for matching secrets
    if (process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
        errors.push('JWT_SECRET and JWT_REFRESH_SECRET must be different');
    }

    return { errors, warnings };
};

/**
 * Print validation results
 */
const printValidationResults = (results) => {
    if (results.errors.length > 0) {
        console.error('\n' + chalk.red.bold('❌ Environment Validation Errors:'));
        results.errors.forEach(error =>
            console.error(chalk.red(`  • ${error}`))
        );
        console.error('');
        return false;
    }

    if (results.warnings.length > 0) {
        console.warn('\n' + chalk.yellow.bold('⚠️  Environment Validation Warnings:'));
        results.warnings.forEach(warning =>
            console.warn(chalk.yellow(`  • ${warning}`))
        );
        console.warn('');
    }
    console.log(chalk.green.bold('✓ Environment validation passed\n'));
    return true;
}
/**
 * Generate .env.example from schema
 */
const generateEnvExample = () => {
    let content = '# Environment Configuration\n\n';

    const categories = {
        'Server Configuration': ['PORT', 'NODE_ENV'],
        'PostgreSQL Configuration': ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'],
        'Redis Configuration': ['REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD'],
        'JWT Configuration': ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'JWT_ACCESS_EXPIRY', 'JWT_REFRESH_EXPIRY'],
        'Firebase Configuration': ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL'],
        'Email Configuration': ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'],
        'OTP Configuration': ['OTP_LENGTH', 'OTP_EXPIRY_MINUTES', 'OTP_RESEND_SECONDS', 'MAX_OTP_ATTEMPTS'],
        'Rate Limiting': ['RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_MAX_REQUESTS'],
        'CORS': ['CORS_ORIGIN'],
    };

    Object.entries(categories).forEach(([category, keys]) => {
        content += `# ${category}\n`;
        keys.forEach(key => {
            const schema = envSchema[key];
            const defaultValue = schema.default || (schema.sensitive ? 'your_secret_here' : '');
            content += `${key}=${defaultValue}\n`;
        });
        content += '\n';
    });

    return content;
};

module.exports = {
    envSchema,
    validateEnvSchema,
    printValidationResults,
    generateEnvExample,
};