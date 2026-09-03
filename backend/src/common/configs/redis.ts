import Redis from 'ioredis';
import { logger } from './logger';
import { CONFIGS } from '.';

let redisClient: Redis | null = null;
let redisWorkerClient: Redis | null = null;
const redisUrl = CONFIGS.REDIS.REDIS_URL;

  export const getRedisClient = (): Redis => {
    if (redisClient) return redisClient;
        redisClient = new Redis(redisUrl, {
            // tls: {},
            retryStrategy: (times) => Math.min(times * 50, 2000),
            maxRetriesPerRequest: 5,
          });
  
    redisClient.on('error', (error: any) => {
      logger.error('Redis client error:', {
        error: error.message,
        stack: error.stack,
      });
    });
  
    redisClient.on('connect', () => {
      logger.info('✅ Redis client connected');
    });
  
    redisClient.on('ready', () => {
      logger.info('✅ Redis client is ready to use');
    });

    return redisClient;
  };

  export const getRedisWorkerClient = (): Redis => {
    if (redisWorkerClient) return redisWorkerClient;
    redisWorkerClient =new Redis(redisUrl, {
            retryStrategy: (times) => Math.min(times * 50, 2000),
            maxRetriesPerRequest: null,
          });
  
    redisWorkerClient.on('error', (error: any) => {
      logger.error('Redis worker client error:', {
        error: error.message,
        stack: error.stack,
      });
    });
  
    redisWorkerClient.on('connect', () => {
      logger.info('✅ Redis worker client connected');
    });
  
    redisWorkerClient.on('ready', () => {
      logger.info('✅ Redis worker is ready to use');
    });

    return redisWorkerClient;
  };

export const clearStoreContextCache = async (shopId: number | string) => {
    try {
        const client = getRedisClient();
        const pattern = `store:context:${shopId}`;
        await client.del(pattern);
        logger.info('Store context cache cleared', { shopId, pattern });
    } catch (error: any) {
        logger.error('Error clearing store context cache:', {
            error: error.message,
            stack: error.stack,
            shopId
        });
    }
};