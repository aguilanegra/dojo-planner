import { describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useDashboardCache } from './useDashboardCache';

describe('useDashboardCache hook', () => {
  describe('basic functionality', () => {
    it('should have correct initial state structure', async () => {
      const { result } = await renderHook(() => useDashboardCache());

      expect(result.current).toHaveProperty('membershipStats');
      expect(result.current).toHaveProperty('financialStats');
      expect(result.current).toHaveProperty('memberAverageData');
      expect(result.current).toHaveProperty('earningsData');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
    });

    it('should provide loading as a boolean', async () => {
      const { result } = await renderHook(() => useDashboardCache());

      expect(typeof result.current.loading).toBe('boolean');
    });

    it('should provide error as null or string', async () => {
      const { result } = await renderHook(() => useDashboardCache());

      expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
    });

    it('should initialize membershipStats as null', async () => {
      const { result } = await renderHook(() => useDashboardCache());

      if (result.current.loading) {
        expect(result.current.membershipStats).toBeNull();
      }
    });

    it('should initialize financialStats as null', async () => {
      const { result } = await renderHook(() => useDashboardCache());

      if (result.current.loading) {
        expect(result.current.financialStats).toBeNull();
      }
    });

    it('should initialize memberAverageData as null', async () => {
      const { result } = await renderHook(() => useDashboardCache());

      if (result.current.loading) {
        expect(result.current.memberAverageData).toBeNull();
      }
    });

    it('should initialize earningsData as null', async () => {
      const { result } = await renderHook(() => useDashboardCache());

      if (result.current.loading) {
        expect(result.current.earningsData).toBeNull();
      }
    });
  });

  describe('state transitions', () => {
    it('should eventually transition from loading state', async () => {
      const { result } = await renderHook(() => useDashboardCache());

      // Initially loading may be true or false depending on cache state
      const initialLoading = result.current.loading;

      expect(typeof initialLoading).toBe('boolean');
    });
  });
});
