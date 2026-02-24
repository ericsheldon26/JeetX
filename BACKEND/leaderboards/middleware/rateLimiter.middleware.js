
// ==========================================
// src/middleware/rateLimiter.middleware.js
// ==========================================
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
        success: false,
        error: 'RATE_LIMITED',
        message: 'Too many OTP requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        error: 'RATE_LIMITED',
        message: 'Too many login attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const passwordValidationLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    message: {
        success: false,
        error: 'RATE_LIMITED',
        message: 'Too many password validation requests.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    otpLimiter,
    loginLimiter,
    passwordValidationLimiter,
};
