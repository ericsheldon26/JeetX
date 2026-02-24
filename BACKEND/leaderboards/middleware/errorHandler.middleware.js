
// ==========================================
// src/middleware/errorHandler.middleware.js
// ==========================================
const logger = require('@/utils/logger');

const errorHandler = (err, req, res) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'VALIDATION_ERROR',
            details: err.details,
        });
    }

    if (err.code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({
            success: false,
            error: 'DUPLICATE_ENTRY',
            message: 'Email or mobile number already exists',
        });
    }

    // Default error response
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;

