import { AppError } from "./errors";

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const localStore = new Map<string, RateLimitStore>();

export async function rateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<void> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = Redis.fromEnv();
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }
      if (current > maxRequests) {
        throw new AppError("FORBIDDEN", "Too many requests. Please slow down.", 429);
      }
      return;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.warn("Upstash rate limit failed, falling back to in-memory:", error);
    }
  }

  const now = Date.now();
  const entry = localStore.get(key);
  if (!entry || now > entry.resetAt) {
    localStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return;
  }

  if (entry.count >= maxRequests) {
    throw new AppError("FORBIDDEN", "Too many requests. Please slow down.", 429);
  }

  entry.count += 1;
}
