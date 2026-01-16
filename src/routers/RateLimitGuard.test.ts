import { ORPCError } from '@orpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@/libs/Logger', () => ({
  auditLogger: {
    warn: vi.fn(),
  },
}));

vi.mock('@/libs/RateLimit', () => ({
  isRateLimitingEnabled: vi.fn(),
  getClientIP: vi.fn(),
  rpcRateLimiter: {
    limit: vi.fn(),
  },
  unauthenticatedRateLimiter: {
    limit: vi.fn(),
  },
}));

describe('RateLimitGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('guardRateLimit', () => {
    it('should skip rate limiting when not enabled', async () => {
      const { isRateLimitingEnabled, rpcRateLimiter } = await import('@/libs/RateLimit');
      vi.mocked(isRateLimitingEnabled).mockReturnValue(false);

      const { guardRateLimit } = await import('./RateLimitGuard');
      const request = new Request('http://localhost/api');

      await expect(guardRateLimit(request, 'org', 'test-org-123')).resolves.toBeUndefined();
      expect(rpcRateLimiter.limit).not.toHaveBeenCalled();
    });

    it('should use orgId for authenticated requests', async () => {
      const { isRateLimitingEnabled, getClientIP, rpcRateLimiter } = await import('@/libs/RateLimit');

      vi.mocked(isRateLimitingEnabled).mockReturnValue(true);
      vi.mocked(getClientIP).mockReturnValue('192.168.1.1');
      vi.mocked(rpcRateLimiter.limit).mockResolvedValue({
        success: true,
        remaining: 99,
        reset: Date.now() + 60000,
        limit: 100,
        pending: Promise.resolve(),
      } as any);

      const { guardRateLimit } = await import('./RateLimitGuard');
      const request = new Request('http://localhost/api');

      await guardRateLimit(request, 'org', 'test-org-123');

      expect(rpcRateLimiter.limit).toHaveBeenCalledWith('test-org-123');
    });

    it('should use IP for unauthenticated requests', async () => {
      const { isRateLimitingEnabled, getClientIP, unauthenticatedRateLimiter } = await import('@/libs/RateLimit');

      vi.mocked(isRateLimitingEnabled).mockReturnValue(true);
      vi.mocked(getClientIP).mockReturnValue('192.168.1.1');
      vi.mocked(unauthenticatedRateLimiter.limit).mockResolvedValue({
        success: true,
        remaining: 9,
        reset: Date.now() + 60000,
        limit: 10,
        pending: Promise.resolve(),
      } as any);

      const { guardRateLimit } = await import('./RateLimitGuard');
      const request = new Request('http://localhost/api');

      await guardRateLimit(request, 'ip');

      expect(unauthenticatedRateLimiter.limit).toHaveBeenCalledWith('192.168.1.1');
    });

    it('should throw 429 when rate limit exceeded', async () => {
      const { isRateLimitingEnabled, getClientIP, rpcRateLimiter } = await import('@/libs/RateLimit');
      const resetTime = Date.now() + 60000;

      vi.mocked(isRateLimitingEnabled).mockReturnValue(true);
      vi.mocked(getClientIP).mockReturnValue('192.168.1.1');
      vi.mocked(rpcRateLimiter.limit).mockResolvedValue({
        success: false,
        remaining: 0,
        reset: resetTime,
        limit: 100,
        pending: Promise.resolve(),
      } as any);

      const { guardRateLimit } = await import('./RateLimitGuard');
      const request = new Request('http://localhost/api');

      await expect(guardRateLimit(request, 'org', 'test-org-123')).rejects.toThrow(ORPCError);
      await expect(guardRateLimit(request, 'org', 'test-org-123')).rejects.toMatchObject({
        message: 'Too Many Requests',
        status: 429,
      });
    });

    it('should log rate limit exceeded events', async () => {
      const { isRateLimitingEnabled, getClientIP, rpcRateLimiter } = await import('@/libs/RateLimit');
      const { auditLogger } = await import('@/libs/Logger');
      const resetTime = Date.now() + 60000;

      vi.mocked(isRateLimitingEnabled).mockReturnValue(true);
      vi.mocked(getClientIP).mockReturnValue('192.168.1.1');
      vi.mocked(rpcRateLimiter.limit).mockResolvedValue({
        success: false,
        remaining: 0,
        reset: resetTime,
        limit: 100,
        pending: Promise.resolve(),
      } as any);

      const { guardRateLimit } = await import('./RateLimitGuard');
      const request = new Request('http://localhost/api');

      try {
        await guardRateLimit(request, 'org', 'test-org-123');
      } catch {
        // Expected to throw
      }

      expect(auditLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('[RATE_LIMIT] Rate limit exceeded for org:test-org-123'),
        expect.objectContaining({
          identifierType: 'org',
          identifier: 'test-org-123',
          clientIP: '192.168.1.1',
        }),
      );
    });

    it('should include retry information in error data', async () => {
      const { isRateLimitingEnabled, getClientIP, rpcRateLimiter } = await import('@/libs/RateLimit');
      const resetTime = Date.now() + 30000; // 30 seconds from now

      vi.mocked(isRateLimitingEnabled).mockReturnValue(true);
      vi.mocked(getClientIP).mockReturnValue('192.168.1.1');
      vi.mocked(rpcRateLimiter.limit).mockResolvedValue({
        success: false,
        remaining: 0,
        reset: resetTime,
        limit: 100,
        pending: Promise.resolve(),
      } as any);

      const { guardRateLimit } = await import('./RateLimitGuard');
      const request = new Request('http://localhost/api');

      try {
        await guardRateLimit(request, 'org', 'test-org-123');

        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ORPCError);

        const orpcError = error as ORPCError<string, Record<string, unknown>>;

        expect(orpcError.data).toMatchObject({
          limit: 100,
          remaining: 0,
        });
        expect(orpcError.data?.retryAfter).toBeGreaterThan(0);
      }
    });

    it('should fall back to IP when org identifier is not provided', async () => {
      const { isRateLimitingEnabled, getClientIP, rpcRateLimiter } = await import('@/libs/RateLimit');

      vi.mocked(isRateLimitingEnabled).mockReturnValue(true);
      vi.mocked(getClientIP).mockReturnValue('192.168.1.1');
      vi.mocked(rpcRateLimiter.limit).mockResolvedValue({
        success: true,
        remaining: 99,
        reset: Date.now() + 60000,
        limit: 100,
        pending: Promise.resolve(),
      } as any);

      const { guardRateLimit } = await import('./RateLimitGuard');
      const request = new Request('http://localhost/api');

      await guardRateLimit(request, 'org'); // No identifier provided

      expect(rpcRateLimiter.limit).toHaveBeenCalledWith('192.168.1.1');
    });
  });

  describe('createRateLimitHeaders', () => {
    it('should create correct rate limit headers', async () => {
      const { createRateLimitHeaders } = await import('./RateLimitGuard');
      const reset = Date.now() + 60000;

      const headers = createRateLimitHeaders(50, 100, reset);

      expect(headers['X-RateLimit-Limit']).toBe('100');
      expect(headers['X-RateLimit-Remaining']).toBe('50');
      expect(headers['X-RateLimit-Reset']).toBeDefined();
      expect(headers['Retry-After']).toBeDefined();
    });

    it('should calculate correct retry-after value', async () => {
      const { createRateLimitHeaders } = await import('./RateLimitGuard');
      const reset = Date.now() + 30000; // 30 seconds from now

      const headers = createRateLimitHeaders(0, 100, reset);

      const retryAfter = Number.parseInt(headers['Retry-After'] ?? '0', 10);

      expect(retryAfter).toBeGreaterThan(0);
      expect(retryAfter).toBeLessThanOrEqual(30);
    });
  });
});
