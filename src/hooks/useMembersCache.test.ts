import { describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { invalidateMembersCache, useMembersCache } from './useMembersCache';

describe('useMembersCache hook', () => {
  describe('without organization', () => {
    it('should not fetch members when organizationId is undefined', async () => {
      const { result } = await renderHook(() => useMembersCache(undefined));

      expect(result.current.members).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should reset state when organizationId is undefined', async () => {
      const { result } = await renderHook(() => useMembersCache(undefined));

      expect(result.current.members).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should provide a revalidate function', async () => {
      const { result } = await renderHook(() => useMembersCache(undefined));

      expect(typeof result.current.revalidate).toBe('function');
    });
  });

  describe('invalidateMembersCache', () => {
    it('should be an async function', () => {
      expect(typeof invalidateMembersCache).toBe('function');
    });

    it('should return a promise', async () => {
      const result = invalidateMembersCache();

      expect(result).toBeInstanceOf(Promise);

      // Wait for the promise to settle
      await result;
    });
  });
});
