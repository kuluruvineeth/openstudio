import { redis } from ".";

export type RedisStats = Record<string, number>; // {[day]: count}

function getStatsKey(email: string) {
  return `stats:${email}`;
}
