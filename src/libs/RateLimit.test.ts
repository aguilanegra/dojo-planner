import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the Env module before importing RateLimit
vi.mock('./Env', () => ({
  Env: {
    UPSTASH_REDIS_REST_URL: undefined,
    UPSTASH_REDIS_REST_TOKEN: undefined,
  },
}));

// Mock Upstash modules
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn().mockImplementation(() => ({
    limit: vi.fn().mockResolvedValue({
      success: true,
      remaining: 99,
      reset: Date.now() + 60000,
      limit: 100,
    }),
  })),
}));

describe('RateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('getClientIP', () => {
    it('should extract IP from X-Forwarded-For header', async () => {
      const { getClientIP } = await import('./RateLimit');

      const request = new Request('http://localhost/api', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      });

      const ip = getClientIP(request);

      expect(ip).toBe('192.168.1.1');
    });

    it('should extract IP from X-Real-IP header', async () => {
      const { getClientIP } = await import('./RateLimit');

      const request = new Request('http://localhost/api', {
        headers: {
          'x-real-ip': '192.168.1.2',
        },
      });

      const ip = getClientIP(request);

      expect(ip).toBe('192.168.1.2');
    });

    it('should extract IP from CF-Connecting-IP header', async () => {
      const { getClientIP } = await import('./RateLimit');

      const request = new Request('http://localhost/api', {
        headers: {
          'cf-connecting-ip': '192.168.1.3',
        },
      });

      const ip = getClientIP(request);

      expect(ip).toBe('192.168.1.3');
    });

    it('should prioritize X-Forwarded-For over other headers', async () => {
      const { getClientIP } = await import('./RateLimit');

      const request = new Request('http://localhost/api', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '192.168.1.2',
          'cf-connecting-ip': '192.168.1.3',
        },
      });

      const ip = getClientIP(request);

      expect(ip).toBe('192.168.1.1');
    });

    it('should return unknown when no IP headers present', async () => {
      const { getClientIP } = await import('./RateLimit');

      const request = new Request('http://localhost/api');

      const ip = getClientIP(request);

      expect(ip).toBe('unknown');
    });

    it('should handle empty X-Forwarded-For header', async () => {
      const { getClientIP } = await import('./RateLimit');

      const request = new Request('http://localhost/api', {
        headers: {
          'x-forwarded-for': '',
          'x-real-ip': '192.168.1.2',
        },
      });

      const ip = getClientIP(request);

      expect(ip).toBe('192.168.1.2');
    });
  });

  describe('isRateLimitingEnabled', () => {
    it('should return false when Upstash is not configured', async () => {
      const { isRateLimitingEnabled } = await import('./RateLimit');

      expect(isRateLimitingEnabled()).toBe(false);
    });
  });

  describe('noop rate limiters', () => {
    it('should always succeed with noop limiter', async () => {
      const { rpcRateLimiter } = await import('./RateLimit');

      const result = await rpcRateLimiter.limit('test-identifier');

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(999);
      expect(result.limit).toBe(1000);
    });

    it('should return consistent results for unauthenticated limiter', async () => {
      const { unauthenticatedRateLimiter } = await import('./RateLimit');

      const result = await unauthenticatedRateLimiter.limit('test-ip');

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(999);
    });

    it('should return consistent results for webhook limiter', async () => {
      const { webhookRateLimiter } = await import('./RateLimit');

      const result = await webhookRateLimiter.limit('test-ip');

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(999);
    });

    it('should return consistent results for auth limiter', async () => {
      const { authRateLimiter } = await import('./RateLimit');

      const result = await authRateLimiter.limit('test-ip');

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(999);
    });
  });
});

describe('RateLimit with Upstash configured', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should enable rate limiting when Upstash is configured', async () => {
    // Re-mock Env with Upstash configured
    vi.doMock('./Env', () => ({
      Env: {
        UPSTASH_REDIS_REST_URL: 'https://test.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'test-token-not-real', // nosecret
      },
    }));

    // Re-mock Redis as a proper constructor for this test
    vi.doMock('@upstash/redis', () => ({
      Redis: class MockRedis {
        constructor() {
          // Mock Redis instance
        }
      },
    }));

    // Re-mock Ratelimit as a proper constructor
    vi.doMock('@upstash/ratelimit', () => ({
      Ratelimit: class MockRatelimit {
        static slidingWindow() {
          return {};
        }

        constructor() {
          // Mock Ratelimit instance
        }

        limit = vi.fn().mockResolvedValue({
          success: true,
          remaining: 99,
          reset: Date.now() + 60000,
          limit: 100,
        });
      },
    }));

    const { isRateLimitingEnabled } = await import('./RateLimit');

    expect(isRateLimitingEnabled()).toBe(true);
  });
});
