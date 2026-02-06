import { describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { invalidateMembershipPlansCache, useMembershipPlansCache } from './useMembershipPlansCache';

describe('useMembershipPlansCache hook', () => {
  describe('without organization', () => {
    it('should not fetch plans when organizationId is undefined', async () => {
      const { result } = await renderHook(() => useMembershipPlansCache(undefined));

      expect(result.current.plans).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should reset state when organizationId is undefined', async () => {
      const { result } = await renderHook(() => useMembershipPlansCache(undefined));

      expect(result.current.plans).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should provide a revalidate function', async () => {
      const { result } = await renderHook(() => useMembershipPlansCache(undefined));

      expect(typeof result.current.revalidate).toBe('function');
    });
  });

  describe('invalidateMembershipPlansCache', () => {
    it('should be an async function', () => {
      expect(typeof invalidateMembershipPlansCache).toBe('function');
    });

    it('should return a promise', async () => {
      const result = invalidateMembershipPlansCache();

      expect(result).toBeInstanceOf(Promise);

      // Wait for the promise to settle
      await result;
    });
  });
});
