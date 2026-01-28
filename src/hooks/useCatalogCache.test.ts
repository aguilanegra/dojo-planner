import { describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import {
  invalidateCatalogCache,
  invalidateCatalogCategoriesCache,
  useCatalogCache,
  useCatalogCategoriesCache,
} from './useCatalogCache';

describe('useCatalogCache hook', () => {
  describe('without organization', () => {
    it('should not fetch items when organizationId is undefined', async () => {
      const { result } = await renderHook(() => useCatalogCache(undefined));

      expect(result.current.items).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should reset state when organizationId is undefined', async () => {
      const { result } = await renderHook(() => useCatalogCache(undefined));

      expect(result.current.items).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should provide a revalidate function', async () => {
      const { result } = await renderHook(() => useCatalogCache(undefined));

      expect(typeof result.current.revalidate).toBe('function');
    });
  });

  describe('invalidateCatalogCache', () => {
    it('should be an async function', () => {
      expect(typeof invalidateCatalogCache).toBe('function');
    });

    it('should return a promise', async () => {
      const result = invalidateCatalogCache();

      expect(result).toBeInstanceOf(Promise);

      // Wait for the promise to settle
      await result;
    });
  });
});

describe('useCatalogCategoriesCache hook', () => {
  describe('without organization', () => {
    it('should not fetch categories when organizationId is undefined', async () => {
      const { result } = await renderHook(() => useCatalogCategoriesCache(undefined));

      expect(result.current.categories).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should reset state when organizationId is undefined', async () => {
      const { result } = await renderHook(() => useCatalogCategoriesCache(undefined));

      expect(result.current.categories).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should provide a revalidate function', async () => {
      const { result } = await renderHook(() => useCatalogCategoriesCache(undefined));

      expect(typeof result.current.revalidate).toBe('function');
    });
  });

  describe('invalidateCatalogCategoriesCache', () => {
    it('should be an async function', () => {
      expect(typeof invalidateCatalogCategoriesCache).toBe('function');
    });

    it('should return a promise', async () => {
      const result = invalidateCatalogCategoriesCache();

      expect(result).toBeInstanceOf(Promise);

      // Wait for the promise to settle
      await result;
    });
  });
});
