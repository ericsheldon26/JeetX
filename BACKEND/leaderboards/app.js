
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const v1Routes = require('@/routes/index.js');


const errorHandler = require('@/middleware/errorHandler.middleware');
const logger = require('@/utils/logger');

const app = express();
app.set('trust proxy', 1);
// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/api/v1', v1Routes);

// Admin routes

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'ROUTE_NOT_FOUND',
        path: req.path,
    });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
