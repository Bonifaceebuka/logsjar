import {CONFIGS} from './common/configs';
if (
  CONFIGS.IS_STAGING || CONFIGS.IS_PRODUCTION
) {
    require("module-alias/register");
}
import http from 'http';
import { app as createExpressApp } from './app';
import { logger }
    from '@/common/configs/logger';
import { getRedisClient } from './common/configs/redis';
import "@/common/queues/workers";

let server: http.Server;

// Initialize services
async function initializeServices(): Promise<boolean> {
    try {
        const redis = getRedisClient();
        await redis.ping();
        
        logger.info('Redis connection established');

        return true;
    } catch (error) {
        logger.error('Service initialization error:', error);
        return false;
    }
}

// Start server
async function startServer(): Promise<void> {
    try {
        const { SERVER_PORT, NODE_ENV, BASE_URL } = CONFIGS;
        const servicesInitialized = await initializeServices();
        if (!servicesInitialized) throw new Error('Failed to initialize services');
        // Create HTTP server
        const expressApp = await createExpressApp()
        server = http.createServer(expressApp);

        server.listen(SERVER_PORT, () => {
            logger.info(`Server running on port ${SERVER_PORT}`);
            logger.info(`Environment: ${NODE_ENV}`);
            logger.info(`Host: ${BASE_URL}`);
        });

    } catch (error) {
        logger.error('Server startup error:', error);
        process.exit(1);
    }
}

// Graceful shutdown
function shutdownGracefully(): void {
    logger.info('Shutting down gracefully...');
    
    server.close(() => {
        logger.info('HTTP server closed');

        const redis = getRedisClient();
        if (redis) {
            redis.quit();
            logger.info('Redis connection closed');
        }

        setTimeout(() => {
            logger.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    });
}

process.on('SIGTERM', shutdownGracefully);
process.on('SIGINT', shutdownGracefully);

(async () => {
    await startServer();
})();