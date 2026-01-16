/**
 * Rate Limit Guard for ORPC API Routes
 *
 * Provides rate limiting protection for API endpoints to prevent abuse.
 * Part of SOC2 compliance (CC6.1 - Access Control).
 *
 * Usage:
 * ```typescript
 * // In route handler
 * await guardRateLimit(request, 'org', context.orgId);
 * // or for unauthenticated requests
 * await guardRateLimit(request, 'ip');
 * ```
 */
import { ORPCError } from '@orpc/server';
import { auditLogger } from '@/libs/Logger';
import { getClientIP, isRateLimitingEnabled, rpcRateLimiter, unauthenticatedRateLimiter } from '@/libs/RateLimit';

/**
 * Rate limit identifier type.
 * - 'org': Use organization ID for authenticated requests
 * - 'ip': Use client IP for unauthenticated requests
 */
export type RateLimitIdentifierType = 'org' | 'ip';

/**
 * Guards ORPC procedures against rate limit abuse.
 *
 * @param request - The incoming request (for IP extraction)
 * @param identifierType - How to identify the client ('org' or 'ip')
 * @param identifier - The org ID (when type is 'org') or undefined (IP extracted from request)
 * @throws ORPCError with 429 status if rate limit exceeded
 */
export async function guardRateLimit(
  request: Request,
  identifierType: RateLimitIdentifierType,
  identifier?: string,
): Promise<void> {
  // Skip if rate limiting is not configured
  if (!isRateLimitingEnabled()) {
    return;
  }

  const clientIP = getClientIP(request);
  const rateLimitKey = identifierType === 'org' && identifier
    ? identifier
    : clientIP;

  const limiter = identifierType === 'org'
    ? rpcRateLimiter
    : unauthenticatedRateLimiter;

  const result = await limiter.limit(rateLimitKey);

  if (!result.success) {
    // Log rate limit exceeded for audit trail
    auditLogger.warn(`[RATE_LIMIT] Rate limit exceeded for ${identifierType}:${rateLimitKey}`, {
      identifierType,
      identifier: rateLimitKey,
      clientIP,
      remaining: result.remaining,
      reset: new Date(result.reset).toISOString(),
    });

    throw new ORPCError('Too Many Requests', {
      status: 429,
      data: {
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        limit: result.limit,
        remaining: result.remaining,
      },
    });
  }
}

/**
 * Creates rate limit headers for the response.
 * Useful for informing clients about their rate limit status.
 *
 * @param remaining - Requests remaining in current window
 * @param limit - Maximum requests allowed
 * @param reset - Unix timestamp when limit resets
 * @returns Headers object with rate limit information
 */
export function createRateLimitHeaders(
  remaining: number,
  limit: number,
  reset: number,
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
    'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
  };
}
