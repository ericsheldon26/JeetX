const leaderboardScheduler = require('./leaderboard.scheduler');
const logger = require('@/utils/logger');

class SchedulerManager {
    startAll() {
        try {
            logger.info('🕐 Starting all schedulers...\n');

            // Start tournament scheduler


            // Start leaderboard scheduler
            leaderboardScheduler.start();
            logger.info('✓ Leaderboard scheduler started');

            logger.info('\n✓ All schedulers started successfully\n');
        } catch (error) {
            logger.error('❌ Error starting schedulers:', error);
            throw error;
        }
    }

    stopAll() {
        logger.info('Stopping all schedulers...');
        // Add stop logic if needed
    }
}

module.exports = new SchedulerManager();