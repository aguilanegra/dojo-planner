import type { CatalogItem as ApiCatalogItem } from '@/hooks/useCatalogCache';

import { describe, expect, it } from 'vitest';
import { transformCatalogItemsToUi, transformCatalogItemToUi } from './catalogDataTransformers';

// =============================================================================
// TEST HELPERS
// =============================================================================

function createMockApiCatalogItem(overrides: Partial<ApiCatalogItem> = {}): ApiCatalogItem {
  return {
    id: 'test-item-1',
    organizationId: 'org-123',
    type: 'merchandise',
    name: 'Test Item',
    slug: 'test-item',
    description: 'Test description',
    shortDescription: 'Short desc',
    sku: 'TEST-001',
    basePrice: 49.99,
    compareAtPrice: 59.99,
    eventId: null,
    maxPerOrder: 10,
    trackInventory: true,
    lowStockThreshold: 5,
    sortOrder: 0,
    isActive: true,
    isFeatured: false,
    showOnKiosk: true,
    sizeType: 'bjj',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    sizes: [],
    images: [],
    categories: [],
    totalStock: 100,
    ...overrides,
  };
}

// =============================================================================
// transformCatalogItemToUi
// =============================================================================

describe('transformCatalogItemToUi', () => {
  it('should transform basic item properties', () => {
    const apiItem = createMockApiCatalogItem();
    const result = transformCatalogItemToUi(apiItem);

    expect(result.id).toBe('test-item-1');
    expect(result.type).toBe('merchandise');
    expect(result.name).toBe('Test Item');
    expect(result.slug).toBe('test-item');
    expect(result.description).toBe('Test description');
    expect(result.shortDescription).toBe('Short desc');
    expect(result.sku).toBe('TEST-001');
    expect(result.basePrice).toBe(49.99);
    expect(result.compareAtPrice).toBe(59.99);
    expect(result.eventId).toBeNull();
    expect(result.maxPerOrder).toBe(10);
    expect(result.trackInventory).toBe(true);
    expect(result.lowStockThreshold).toBe(5);
    expect(result.sortOrder).toBe(0);
    expect(result.isActive).toBe(true);
    expect(result.isFeatured).toBe(false);
    expect(result.showOnKiosk).toBe(true);
    expect(result.sizeType).toBe('bjj');
    expect(result.totalStock).toBe(100);
  });

  it('should transform event_access type items', () => {
    const apiItem = createMockApiCatalogItem({
      type: 'event_access',
      eventId: 'event-123',
      sizeType: 'none',
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.type).toBe('event_access');
    expect(result.eventId).toBe('event-123');
    expect(result.sizeType).toBe('none');
  });

  it('should transform sizes correctly', () => {
    const apiItem = createMockApiCatalogItem({
      sizes: [
        {
          id: 'size-1',
          catalogItemId: 'test-item-1',
          size: 'A1',
          stockQuantity: 10,
          sortOrder: 0,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: 'size-2',
          catalogItemId: 'test-item-1',
          size: 'A2',
          stockQuantity: 15,
          sortOrder: 1,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
      ],
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.sizes).toHaveLength(2);
    expect(result.sizes[0]).toEqual({
      id: 'size-1',
      catalogItemId: 'test-item-1',
      size: 'A1',
      stockQuantity: 10,
      sortOrder: 0,
    });
    expect(result.sizes[1]).toEqual({
      id: 'size-2',
      catalogItemId: 'test-item-1',
      size: 'A2',
      stockQuantity: 15,
      sortOrder: 1,
    });
  });

  it('should transform images correctly', () => {
    const apiItem = createMockApiCatalogItem({
      images: [
        {
          id: 'img-1',
          catalogItemId: 'test-item-1',
          url: 'https://example.com/image1.jpg',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          altText: 'Image 1',
          isPrimary: true,
          sortOrder: 0,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'img-2',
          catalogItemId: 'test-item-1',
          url: 'https://example.com/image2.jpg',
          thumbnailUrl: null,
          altText: null,
          isPrimary: false,
          sortOrder: 1,
          createdAt: new Date('2024-01-01'),
        },
      ],
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.images).toHaveLength(2);
    expect(result.images[0]).toEqual({
      id: 'img-1',
      catalogItemId: 'test-item-1',
      url: 'https://example.com/image1.jpg',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      altText: 'Image 1',
      isPrimary: true,
      sortOrder: 0,
    });
    expect(result.images[1]).toEqual({
      id: 'img-2',
      catalogItemId: 'test-item-1',
      url: 'https://example.com/image2.jpg',
      thumbnailUrl: null,
      altText: null,
      isPrimary: false,
      sortOrder: 1,
    });
  });

  it('should transform categories correctly', () => {
    const apiItem = createMockApiCatalogItem({
      categories: [
        {
          id: 'cat-1',
          organizationId: 'org-123',
          name: 'Gis',
          slug: 'gis',
          description: 'BJJ Gis',
          parentId: null,
          sortOrder: 0,
          isActive: true,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'cat-2',
          organizationId: 'org-123',
          name: 'Belts',
          slug: 'belts',
          description: null,
          parentId: 'cat-1',
          sortOrder: 1,
          isActive: false,
          createdAt: new Date('2024-01-01'),
        },
      ],
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.categories).toHaveLength(2);
    expect(result.categories[0]).toEqual({
      id: 'cat-1',
      name: 'Gis',
      slug: 'gis',
      description: 'BJJ Gis',
      parentId: null,
      isActive: true,
    });
    expect(result.categories[1]).toEqual({
      id: 'cat-2',
      name: 'Belts',
      slug: 'belts',
      description: null,
      parentId: 'cat-1',
      isActive: false,
    });
  });

  it('should handle empty sizes, images, and categories', () => {
    const apiItem = createMockApiCatalogItem({
      sizes: [],
      images: [],
      categories: [],
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.sizes).toEqual([]);
    expect(result.images).toEqual([]);
    expect(result.categories).toEqual([]);
  });

  it('should handle null values', () => {
    const apiItem = createMockApiCatalogItem({
      description: null,
      shortDescription: null,
      sku: null,
      compareAtPrice: null,
      eventId: null,
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.description).toBeNull();
    expect(result.shortDescription).toBeNull();
    expect(result.sku).toBeNull();
    expect(result.compareAtPrice).toBeNull();
    expect(result.eventId).toBeNull();
  });

  it('should strip createdAt and updatedAt from result', () => {
    const apiItem = createMockApiCatalogItem();
    const result = transformCatalogItemToUi(apiItem);

    // UI type doesn't have createdAt/updatedAt
    expect(result).not.toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('updatedAt');
    expect(result).not.toHaveProperty('organizationId');
  });

  it('should strip timestamps from sizes', () => {
    const apiItem = createMockApiCatalogItem({
      sizes: [
        {
          id: 'size-1',
          catalogItemId: 'test-item-1',
          size: 'A1',
          stockQuantity: 10,
          sortOrder: 0,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
      ],
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.sizes[0]).not.toHaveProperty('createdAt');
    expect(result.sizes[0]).not.toHaveProperty('updatedAt');
  });

  it('should strip timestamps from images', () => {
    const apiItem = createMockApiCatalogItem({
      images: [
        {
          id: 'img-1',
          catalogItemId: 'test-item-1',
          url: 'https://example.com/image.jpg',
          thumbnailUrl: null,
          altText: null,
          isPrimary: true,
          sortOrder: 0,
          createdAt: new Date('2024-01-01'),
        },
      ],
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.images[0]).not.toHaveProperty('createdAt');
  });

  it('should strip extra properties from categories', () => {
    const apiItem = createMockApiCatalogItem({
      categories: [
        {
          id: 'cat-1',
          organizationId: 'org-123',
          name: 'Test',
          slug: 'test',
          description: null,
          parentId: null,
          sortOrder: 0,
          isActive: true,
          createdAt: new Date('2024-01-01'),
        },
      ],
    });
    const result = transformCatalogItemToUi(apiItem);

    expect(result.categories[0]).not.toHaveProperty('organizationId');
    expect(result.categories[0]).not.toHaveProperty('sortOrder');
    expect(result.categories[0]).not.toHaveProperty('createdAt');
  });
});

// =============================================================================
// transformCatalogItemsToUi
// =============================================================================

describe('transformCatalogItemsToUi', () => {
  it('should transform an empty array', () => {
    const result = transformCatalogItemsToUi([]);

    expect(result).toEqual([]);
  });

  it('should transform a single item', () => {
    const items = [createMockApiCatalogItem({ id: 'item-1' })];
    const result = transformCatalogItemsToUi(items);

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('item-1');
  });

  it('should transform multiple items', () => {
    const items = [
      createMockApiCatalogItem({ id: 'item-1', name: 'Item 1' }),
      createMockApiCatalogItem({ id: 'item-2', name: 'Item 2' }),
      createMockApiCatalogItem({ id: 'item-3', name: 'Item 3' }),
    ];
    const result = transformCatalogItemsToUi(items);

    expect(result).toHaveLength(3);
    expect(result[0]?.id).toBe('item-1');
    expect(result[0]?.name).toBe('Item 1');
    expect(result[1]?.id).toBe('item-2');
    expect(result[1]?.name).toBe('Item 2');
    expect(result[2]?.id).toBe('item-3');
    expect(result[2]?.name).toBe('Item 3');
  });

  it('should maintain array order', () => {
    const items = [
      createMockApiCatalogItem({ id: 'c', sortOrder: 2 }),
      createMockApiCatalogItem({ id: 'a', sortOrder: 0 }),
      createMockApiCatalogItem({ id: 'b', sortOrder: 1 }),
    ];
    const result = transformCatalogItemsToUi(items);

    expect(result.map(r => r.id)).toEqual(['c', 'a', 'b']);
  });

  it('should transform items with different types', () => {
    const items = [
      createMockApiCatalogItem({ id: 'item-1', type: 'merchandise' }),
      createMockApiCatalogItem({ id: 'item-2', type: 'event_access' }),
    ];
    const result = transformCatalogItemsToUi(items);

    expect(result[0]?.type).toBe('merchandise');
    expect(result[1]?.type).toBe('event_access');
  });
});
