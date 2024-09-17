import { redis } from ".";

export type RedisStats = Record<string, number>; // {[day]: count}

function getStatsKey(email: string) {
  return `stats:${email}`;
}

export async function getAllStats(options: { email: string }) {
  const key = getStatsKey(options.email);
  return redis.hgetall<RedisStats>(key);
}

export async function getDayStat(options: { email: string; day: string }) {
  const key = getStatsKey(options.email);
  return redis.hget<number>(key, options.day);
}
