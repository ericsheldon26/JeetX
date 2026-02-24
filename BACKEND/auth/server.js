
require("module-alias/register");
require('dotenv').config();
const app = require('@/app');
const logger = require('@/utils/logger');
const { initializeConfig } = require('./config');


const PORT = process.env.PORT || 3000;

// Initialize all configurations
initializeConfig()
    .then(() => {
        // Start server only after config is ready
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch((error) => {
        logger.error('Failed to initialize:', error);

        process.exit(1);
    });
// Graceful shutdown
const gracefulShutdown = () => {
    logger.info('Received shutdown signal, closing server...');
    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);





