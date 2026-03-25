import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Pre-configured rate limiters per endpoint
export const rateLimiters = {
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "rl:login",
  }),
  register: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    prefix: "rl:register",
  }),
  forgotPassword: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    prefix: "rl:forgot-password",
  }),
  resetPassword: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "rl:reset-password",
  }),
  resendVerification: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "15 m"),
    prefix: "rl:resend-verification",
  }),
} as const;

type RateLimiterKey = keyof typeof rateLimiters;

function getIP(headersList: Headers): string {
  return headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
}

function formatRetryAfter(resetMs: number): number {
  return Math.ceil((resetMs - Date.now()) / 1000);
}

export async function checkRateLimit(
  limiter: RateLimiterKey,
  identifier?: string
): Promise<NextResponse | null> {
  try {
    const headersList = await headers();
    const ip = getIP(headersList);
    const key = identifier ? `${ip}:${identifier}` : ip;

    const { success, reset } = await rateLimiters[limiter].limit(key);

    if (!success) {
      const retryAfter = formatRetryAfter(reset);
      const minutes = Math.ceil(retryAfter / 60);

      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    return null;
  } catch {
    // Fail open — allow request if Upstash is unavailable
    return null;
  }
}