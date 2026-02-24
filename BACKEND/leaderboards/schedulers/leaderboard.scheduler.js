const cron = require('node-cron');
const leaderboardService = require('@/services/leaderboard.service');
const logger = require('@/utils/logger');

class LeaderboardScheduler {
    start() {
        // Rebuild daily leaderboard every hour
        cron.schedule('0 * * * *', async () => {
            try {
                await leaderboardService.rebuildCache('DAILY');
                logger.info('Daily leaderboard cache rebuilt');
            } catch (error) {
                logger.error('Daily leaderboard rebuild error:', error);
            }
        });

        // Rebuild weekly leaderboard every 4 hours
        cron.schedule('0 */4 * * *', async () => {
            try {
                await leaderboardService.rebuildCache('WEEKLY');
                logger.info('Weekly leaderboard cache rebuilt');
            } catch (error) {
                logger.error('Weekly leaderboard rebuild error:', error);
            }
        });

        // Rebuild monthly leaderboard daily at midnight
        cron.schedule('0 0 * * *', async () => {
            try {
                await leaderboardService.rebuildCache('MONTHLY');
                logger.info('Monthly leaderboard cache rebuilt');
            } catch (error) {
                logger.error('Monthly leaderboard rebuild error:', error);
            }
        });

        logger.info('Leaderboard schedulers started');
    }
}

module.exports = new LeaderboardScheduler();