import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is required for Redis.');
}

declare global {
  var redisClient: Redis | undefined;
}

export const redis =
  global.redisClient ??
  new Redis(redisUrl, {
    maxRetriesPerRequest: null,
  });

if (!global.redisClient) {
  global.redisClient = redis;
}