import { env } from "@/env.mjs";
import { Redis } from "@upstash/redis";

// export const redis = new Redis({
//   url: env.UPSTASH_REDIS_URL,
//   token: env.UPSTASH_REDIS_TOKEN,
// });

// for local development
export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

export async function expire(key: string, seconds: number) {
  return redis.expire(key, seconds);
}
