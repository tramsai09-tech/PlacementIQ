import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redisClient.on('error', (err) => logger.error({ err }, 'Redis Client Error'));
