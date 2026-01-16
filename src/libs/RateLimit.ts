/**
 * Rate Limiting Utility for SOC2 Compliance
 *
 * Uses Upstash Redis for distributed rate limiting across serverless functions.
 * Falls back to a no-op implementation when Upstash is not configured.
 *
 * Rate limits are configured per endpoint type:
 * - RPC endpoints: 100 req/min per org (authenticated), 10 req/min per IP (unauthenticated)
 * - Webhooks: 100 req/min per IP
 * - Auth endpoints: 5 failures/15min per IP
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Env } from './Env';

/**
 * Result of a rate limit check.
 */
type RateLimitResult = {
  /** Whether the request is allowed */
  success: boolean;
  /** Number of requests remaining in the current window */
  remaining: number;
  /** Unix timestamp when the rate limit resets */
  reset: number;
  /** Maximum requests allowed in the window */
  limit: number;
};

/**
 * No-op rate limiter for when Upstash is not configured.
 * Always allows requests (used in development without Redis).
 */
const noopRateLimiter = {
  limit: async (): Promise<RateLimitResult> => ({
    success: true,
    remaining: 999,
    reset: Date.now() + 60000,
    limit: 1000,
  }),
};

/**
 * Creates an Upstash Redis client if configured.
 */
function createRedisClient(): Redis | null {
  if (!Env.UPSTASH_REDIS_REST_URL || !Env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return new Redis({
    url: Env.UPSTASH_REDIS_REST_URL,
    token: Env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const redis = createRedisClient();

/**
 * Rate limiter for authenticated RPC requests.
 * 100 requests per minute per organization.
 */
export const rpcRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: 'ratelimit:rpc:org',
      analytics: true,
    })
  : noopRateLimiter;

/**
 * Rate limiter for unauthenticated requests.
 * 10 requests per minute per IP address.
 */
export const unauthenticatedRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      prefix: 'ratelimit:unauth:ip',
      analytics: true,
    })
  : noopRateLimiter;

/**
 * Rate limiter for webhook endpoints.
 * 100 requests per minute per IP address.
 */
export const webhookRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: 'ratelimit:webhook:ip',
      analytics: true,
    })
  : noopRateLimiter;

/**
 * Rate limiter for authentication attempts.
 * 5 attempts per 15 minutes per IP address.
 */
export const authRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      prefix: 'ratelimit:auth:ip',
      analytics: true,
    })
  : noopRateLimiter;

/**
 * Checks if rate limiting is enabled (Upstash is configured).
 */
export function isRateLimitingEnabled(): boolean {
  return redis !== null;
}

/**
 * Extracts client IP address from request headers.
 * Handles common proxy headers (X-Forwarded-For, X-Real-IP).
 *
 * @param request - The incoming request
 * @returns The client IP address or 'unknown'
 */
export function getClientIP(request: Request): string {
  const headers = request.headers;

  // Check X-Forwarded-For header (common with proxies/load balancers)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    const ip = forwardedFor.split(',')[0]?.trim();
    if (ip) {
      return ip;
    }
  }

  // Check X-Real-IP header (nginx)
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Check CF-Connecting-IP header (Cloudflare)
  const cfIP = headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP;
  }

  // Fallback to unknown
  return 'unknown';
}
