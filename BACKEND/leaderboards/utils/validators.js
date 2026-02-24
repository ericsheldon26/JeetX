const { validationResult } = require('express-validator');

/**
 * Validation middleware
 * Checks for validation errors from express-validator
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg,
                value: err.value,
            })),
        });
    }

    next();
};

/**
 * Sanitize user object - remove sensitive fields
 */
const sanitizeUser = (user) => {
    if (!user) return null;

    const {
        password,
        firebase_uid,
        ...sanitized
    } = user;

    return sanitized;
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate mobile number format (basic)
 */
const isValidMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
};

/**
 * Validate country code format
 */
const isValidCountryCode = (code) => {
    const countryCodeRegex = /^\+\d{1,4}$/;
    return countryCodeRegex.test(code);
};

/**
 * Validate OTP format
 */
const isValidOTP = (otp) => {
    return /^\d{6}$/.test(otp);
};

/**
 * Validate UUID format
 */
const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

/**
 * Sanitize string input
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';

    return str
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000); // Limit length
};

/**
 * Parse and validate pagination parameters
 */
const parsePagination = (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Ensure reasonable limits
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const offset = (safePage - 1) * safeLimit;

    return {
        page: safePage,
        limit: safeLimit,
        offset,
    };
};

/**
 * Validate request body has required fields
 */
const hasRequiredFields = (body, requiredFields) => {
    const missing = [];

    for (const field of requiredFields) {
        if (!body[field]) {
            missing.push(field);
        }
    }

    return {
        valid: missing.length === 0,
        missing,
    };
};

/**
 * Create standardized success response
 */
const successResponse = (data, message = 'Success') => {
    return {
        success: true,
        message,
        ...data,
    };
};

/**
 * Create standardized error response
 */
const errorResponse = (error, message = 'Error occurred') => {
    return {
        success: false,
        error: error || 'UNKNOWN_ERROR',
        message,
    };
};

module.exports = {
    validate,
    sanitizeUser,
    isValidEmail,
    isValidMobile,
    isValidCountryCode,
    isValidOTP,
    isValidUUID,
    sanitizeString,
    parsePagination,
    hasRequiredFields,
    successResponse,
    errorResponse,
};
