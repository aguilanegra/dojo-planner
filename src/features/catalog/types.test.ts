import type { CatalogItem, CatalogItemImage } from './types';

import { describe, expect, it } from 'vitest';
import {
  formatPrice,
  getCatalogItemStatus,
  getPrimaryImage,
  MAX_VARIANTS_PER_ITEM,
} from './types';

// =============================================================================
// TEST HELPERS
// =============================================================================

function createMockCatalogItem(overrides: Partial<CatalogItem> = {}): CatalogItem {
  return {
    id: 'test-item-1',
    type: 'merchandise',
    name: 'Test Item',
    slug: 'test-item',
    description: 'Test description',
    shortDescription: 'Short desc',
    sku: 'TEST-001',
    basePrice: 49.99,
    compareAtPrice: null,
    eventId: null,
    maxPerOrder: 10,
    trackInventory: true,
    lowStockThreshold: 5,
    sortOrder: 0,
    isActive: true,
    isFeatured: false,
    showOnKiosk: true,
    variants: [],
    images: [],
    categories: [],
    totalStock: 100,
    ...overrides,
  };
}

function createMockImage(overrides: Partial<CatalogItemImage> = {}): CatalogItemImage {
  return {
    id: 'img-1',
    catalogItemId: 'test-item-1',
    url: 'https://example.com/image.jpg',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    altText: 'Test image',
    isPrimary: false,
    sortOrder: 0,
    ...overrides,
  };
}

// =============================================================================
// CONSTANTS
// =============================================================================

describe('Constants', () => {
  describe('MAX_VARIANTS_PER_ITEM', () => {
    it('should be 8', () => {
      expect(MAX_VARIANTS_PER_ITEM).toBe(8);
    });
  });
});

// =============================================================================
// getCatalogItemStatus
// =============================================================================

describe('getCatalogItemStatus', () => {
  describe('inactive items', () => {
    it('should return Inactive for inactive items', () => {
      const item = createMockCatalogItem({ isActive: false });

      expect(getCatalogItemStatus(item)).toBe('Inactive');
    });

    it('should return Inactive regardless of stock when inactive', () => {
      const item = createMockCatalogItem({
        isActive: false,
        trackInventory: true,
        totalStock: 0,
      });

      expect(getCatalogItemStatus(item)).toBe('Inactive');
    });
  });

  describe('inventory tracking enabled', () => {
    it('should return Out of Stock when totalStock is 0', () => {
      const item = createMockCatalogItem({
        isActive: true,
        trackInventory: true,
        totalStock: 0,
      });

      expect(getCatalogItemStatus(item)).toBe('Out of Stock');
    });

    it('should return Low Stock when totalStock equals lowStockThreshold', () => {
      const item = createMockCatalogItem({
        isActive: true,
        trackInventory: true,
        totalStock: 5,
        lowStockThreshold: 5,
      });

      expect(getCatalogItemStatus(item)).toBe('Low Stock');
    });

    it('should return Low Stock when totalStock is below lowStockThreshold', () => {
      const item = createMockCatalogItem({
        isActive: true,
        trackInventory: true,
        totalStock: 3,
        lowStockThreshold: 5,
      });

      expect(getCatalogItemStatus(item)).toBe('Low Stock');
    });

    it('should return Active when totalStock is above lowStockThreshold', () => {
      const item = createMockCatalogItem({
        isActive: true,
        trackInventory: true,
        totalStock: 10,
        lowStockThreshold: 5,
      });

      expect(getCatalogItemStatus(item)).toBe('Active');
    });
  });

  describe('inventory tracking disabled', () => {
    it('should return Active regardless of stock when inventory tracking is disabled', () => {
      const item = createMockCatalogItem({
        isActive: true,
        trackInventory: false,
        totalStock: 0,
      });

      expect(getCatalogItemStatus(item)).toBe('Active');
    });
  });
});

// =============================================================================
// getPrimaryImage
// =============================================================================

describe('getPrimaryImage', () => {
  it('should return null when item has no images', () => {
    const item = createMockCatalogItem({ images: [] });

    expect(getPrimaryImage(item)).toBeNull();
  });

  it('should return the primary image when available', () => {
    const primaryImage = createMockImage({ id: 'primary', isPrimary: true });
    const secondaryImage = createMockImage({ id: 'secondary', isPrimary: false });
    const item = createMockCatalogItem({
      images: [secondaryImage, primaryImage],
    });

    expect(getPrimaryImage(item)).toEqual(primaryImage);
  });

  it('should return the first image when no primary is set', () => {
    const firstImage = createMockImage({ id: 'first', isPrimary: false });
    const secondImage = createMockImage({ id: 'second', isPrimary: false });
    const item = createMockCatalogItem({
      images: [firstImage, secondImage],
    });

    expect(getPrimaryImage(item)).toEqual(firstImage);
  });

  it('should prioritize primary image over first image', () => {
    const firstImage = createMockImage({ id: 'first', isPrimary: false, sortOrder: 0 });
    const primaryImage = createMockImage({ id: 'primary', isPrimary: true, sortOrder: 2 });
    const lastImage = createMockImage({ id: 'last', isPrimary: false, sortOrder: 1 });
    const item = createMockCatalogItem({
      images: [firstImage, lastImage, primaryImage],
    });

    expect(getPrimaryImage(item)).toEqual(primaryImage);
  });
});

// =============================================================================
// formatPrice
// =============================================================================

describe('formatPrice', () => {
  it('should format integer prices correctly', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });

  it('should format decimal prices correctly', () => {
    expect(formatPrice(49.99)).toBe('$49.99');
  });

  it('should format zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should format large prices with commas', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('should format very large prices', () => {
    expect(formatPrice(1000000)).toBe('$1,000,000.00');
  });

  it('should round prices with more than 2 decimal places', () => {
    // Intl.NumberFormat rounds to 2 decimal places
    expect(formatPrice(49.999)).toBe('$50.00');
    expect(formatPrice(49.994)).toBe('$49.99');
  });
});
