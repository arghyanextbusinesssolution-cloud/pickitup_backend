import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisConnection = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
    logger.info('Connected to Redis');
});

redisConnection.on('error', (err) => {
    logger.error(err, 'Redis error');
});

export default redisConnection;
