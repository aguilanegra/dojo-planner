import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock database and schemas
vi.mock('@/libs/DB', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve([])),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
  },
}));

vi.mock('@/models/Schema', () => ({
  catalogCategorySchema: { id: 'id', organizationId: 'organizationId', name: 'name' },
  catalogItemCategorySchema: { catalogItemId: 'catalogItemId', categoryId: 'categoryId' },
  catalogItemImageSchema: { id: 'id', catalogItemId: 'catalogItemId' },
  catalogItemSchema: { id: 'id', organizationId: 'organizationId', type: 'type', name: 'name' },
  catalogItemSizeSchema: { id: 'id', catalogItemId: 'catalogItemId' },
}));

describe('CatalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('Constants', () => {
    it('should export BJJ_SIZES array', async () => {
      const { BJJ_SIZES } = await import('./CatalogService');

      expect(BJJ_SIZES).toEqual(['A0', 'A1', 'A2', 'A3', 'A4', 'A5']);
    });

    it('should export APPAREL_SIZES array', async () => {
      const { APPAREL_SIZES } = await import('./CatalogService');

      expect(APPAREL_SIZES).toEqual(['S', 'M', 'L', 'XL', 'XXL']);
    });
  });

  describe('getOrganizationCatalogItems', () => {
    it('should return empty array when no items exist', async () => {
      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const { getOrganizationCatalogItems } = await import('./CatalogService');
      const result = await getOrganizationCatalogItems('test-org-123');

      expect(result).toEqual([]);
    });

    it('should return items with related data', async () => {
      const { db } = await import('@/libs/DB');
      const mockItem = {
        id: 'item-1',
        organizationId: 'test-org-123',
        type: 'merchandise',
        name: 'Test Product',
        slug: 'test-product',
        description: 'A test product',
        shortDescription: 'Test',
        sku: 'TEST-001',
        basePrice: 29.99,
        compareAtPrice: null,
        eventId: null,
        maxPerOrder: 10,
        trackInventory: true,
        lowStockThreshold: 5,
        sortOrder: 0,
        isActive: true,
        isFeatured: false,
        showOnKiosk: true,
        sizeType: 'apparel',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSize = {
        id: 'size-1',
        catalogItemId: 'item-1',
        size: 'M',
        stockQuantity: 10,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockImage = {
        id: 'img-1',
        catalogItemId: 'item-1',
        url: 'https://example.com/image.jpg',
        thumbnailUrl: null,
        altText: 'Product image',
        isPrimary: true,
        sortOrder: 0,
        createdAt: new Date(),
      };

      const mockCategory = {
        id: 'cat-1',
        organizationId: 'test-org-123',
        name: 'Apparel',
        slug: 'apparel',
        description: null,
        parentId: null,
        sortOrder: 0,
        isActive: true,
        createdAt: new Date(),
      };

      const mockItemCategory = {
        catalogItemId: 'item-1',
        categoryId: 'cat-1',
      };

      let callCount = 0;
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation(() => {
            callCount++;
            // First call: items, Second: sizes, Third: images, Fourth: item categories, Fifth: all categories
            if (callCount === 1) {
              return Promise.resolve([mockItem]);
            }
            if (callCount === 2) {
              return Promise.resolve([mockSize]);
            }
            if (callCount === 3) {
              return Promise.resolve([mockImage]);
            }
            if (callCount === 4) {
              return Promise.resolve([mockItemCategory]);
            }
            if (callCount === 5) {
              return Promise.resolve([mockCategory]);
            }
            return Promise.resolve([]);
          }),
        }),
      } as any);

      const { getOrganizationCatalogItems } = await import('./CatalogService');
      const result = await getOrganizationCatalogItems('test-org-123');

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Test Product');
      expect(result[0]?.sizes).toHaveLength(1);
      expect(result[0]?.images).toHaveLength(1);
      expect(result[0]?.categories).toHaveLength(1);
      expect(result[0]?.totalStock).toBe(10);
    });

    it('should handle items with null optional fields', async () => {
      const { db } = await import('@/libs/DB');
      const mockItem = {
        id: 'item-1',
        organizationId: 'test-org-123',
        type: 'merchandise',
        name: 'Test Product',
        slug: 'test-product',
        description: null,
        shortDescription: null,
        sku: null,
        basePrice: 0,
        compareAtPrice: null,
        eventId: null,
        maxPerOrder: null,
        trackInventory: null,
        lowStockThreshold: null,
        sortOrder: null,
        isActive: null,
        isFeatured: null,
        showOnKiosk: null,
        sizeType: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let callCount = 0;
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve([mockItem]);
            }
            return Promise.resolve([]);
          }),
        }),
      } as any);

      const { getOrganizationCatalogItems } = await import('./CatalogService');
      const result = await getOrganizationCatalogItems('test-org-123');

      expect(result).toHaveLength(1);
      expect(result[0]?.maxPerOrder).toBe(10);
      expect(result[0]?.trackInventory).toBe(true);
      expect(result[0]?.lowStockThreshold).toBe(5);
      expect(result[0]?.isActive).toBe(true);
      expect(result[0]?.isFeatured).toBe(false);
      expect(result[0]?.showOnKiosk).toBe(true);
      expect(result[0]?.sizeType).toBe('none');
    });
  });

  describe('getCatalogItemById', () => {
    it('should return null when item not found', async () => {
      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const { getCatalogItemById } = await import('./CatalogService');
      const result = await getCatalogItemById('nonexistent', 'test-org-123');

      expect(result).toBeNull();
    });

    it('should return item when found', async () => {
      const { db } = await import('@/libs/DB');
      const mockItem = {
        id: 'item-1',
        organizationId: 'test-org-123',
        type: 'merchandise',
        name: 'Test Product',
        slug: 'test-product',
        description: null,
        shortDescription: null,
        sku: null,
        basePrice: 29.99,
        compareAtPrice: null,
        eventId: null,
        maxPerOrder: 10,
        trackInventory: true,
        lowStockThreshold: 5,
        sortOrder: 0,
        isActive: true,
        isFeatured: false,
        showOnKiosk: true,
        sizeType: 'none',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let callCount = 0;
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve([mockItem]);
            }
            return Promise.resolve([]);
          }),
        }),
      } as any);

      const { getCatalogItemById } = await import('./CatalogService');
      const result = await getCatalogItemById('item-1', 'test-org-123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('item-1');
      expect(result?.name).toBe('Test Product');
    });
  });

  describe('getCatalogItemsByType', () => {
    it('should filter items by merchandise type', async () => {
      const { db } = await import('@/libs/DB');
      const mockItems = [
        {
          id: 'item-1',
          organizationId: 'test-org-123',
          type: 'merchandise',
          name: 'Product 1',
          slug: 'product-1',
          basePrice: 29.99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'item-2',
          organizationId: 'test-org-123',
          type: 'event_access',
          name: 'Event 1',
          slug: 'event-1',
          basePrice: 49.99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      let callCount = 0;
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve(mockItems);
            }
            return Promise.resolve([]);
          }),
        }),
      } as any);

      const { getCatalogItemsByType } = await import('./CatalogService');
      const result = await getCatalogItemsByType('test-org-123', 'merchandise');

      expect(result).toHaveLength(1);
      expect(result[0]?.type).toBe('merchandise');
    });
  });

  describe('getKioskCatalogItems', () => {
    it('should filter items that are active and showOnKiosk', async () => {
      const { db } = await import('@/libs/DB');
      const mockItems = [
        {
          id: 'item-1',
          organizationId: 'test-org-123',
          type: 'merchandise',
          name: 'Kiosk Product',
          slug: 'kiosk-product',
          basePrice: 29.99,
          isActive: true,
          showOnKiosk: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'item-2',
          organizationId: 'test-org-123',
          type: 'merchandise',
          name: 'Hidden Product',
          slug: 'hidden-product',
          basePrice: 39.99,
          isActive: true,
          showOnKiosk: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'item-3',
          organizationId: 'test-org-123',
          type: 'merchandise',
          name: 'Inactive Product',
          slug: 'inactive-product',
          basePrice: 19.99,
          isActive: false,
          showOnKiosk: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      let callCount = 0;
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve(mockItems);
            }
            return Promise.resolve([]);
          }),
        }),
      } as any);

      const { getKioskCatalogItems } = await import('./CatalogService');
      const result = await getKioskCatalogItems('test-org-123');

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Kiosk Product');
    });
  });

  describe('createCatalogItem', () => {
    // Note: Due to the complexity of mocking with vi.resetModules() and dynamic imports,
    // we focus on testing that createCatalogItem correctly throws when getCatalogItemById
    // returns null, which validates the error handling path.
    // The successful creation path is tested via integration/e2e tests.

    it('should throw error when item creation fails', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const { createCatalogItem } = await import('./CatalogService');

      await expect(
        createCatalogItem({ type: 'merchandise', name: 'Test', basePrice: 10 }, 'test-org-123'),
      ).rejects.toThrow('Failed to create catalog item');
    });
  });

  describe('updateCatalogItem', () => {
    it('should update an item', async () => {
      const { db } = await import('@/libs/DB');
      const mockUpdatedItem = {
        id: 'item-1',
        organizationId: 'test-org-123',
        type: 'merchandise',
        name: 'Updated Product',
        slug: 'updated-product',
        basePrice: 39.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUpdatedItem]),
          }),
        }),
      } as any);

      let callCount = 0;
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve([mockUpdatedItem]);
            }
            return Promise.resolve([]);
          }),
        }),
      } as any);

      const { updateCatalogItem } = await import('./CatalogService');
      const result = await updateCatalogItem(
        { id: 'item-1', name: 'Updated Product', basePrice: 39.99 },
        'test-org-123',
      );

      expect(result.name).toBe('Updated Product');
      expect(db.update).toHaveBeenCalled();
    });

    it('should update categories when provided', async () => {
      const { db } = await import('@/libs/DB');
      const mockUpdatedItem = {
        id: 'item-1',
        organizationId: 'test-org-123',
        type: 'merchandise',
        name: 'Product',
        slug: 'product',
        basePrice: 29.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUpdatedItem]),
          }),
        }),
      } as any);

      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      } as any);

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      let callCount = 0;
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve([mockUpdatedItem]);
            }
            return Promise.resolve([]);
          }),
        }),
      } as any);

      const { updateCatalogItem } = await import('./CatalogService');
      const result = await updateCatalogItem(
        { id: 'item-1', categoryIds: ['cat-1', 'cat-2'] },
        'test-org-123',
      );

      expect(result.name).toBe('Product');
      expect(db.delete).toHaveBeenCalled();
      expect(db.insert).toHaveBeenCalled();
    });

    it('should throw error when item not found', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const { updateCatalogItem } = await import('./CatalogService');

      await expect(
        updateCatalogItem({ id: 'nonexistent' }, 'test-org-123'),
      ).rejects.toThrow('Catalog item not found');
    });
  });

  describe('deleteCatalogItem', () => {
    it('should delete an item and its associations', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      } as any);

      const { deleteCatalogItem } = await import('./CatalogService');
      await deleteCatalogItem('item-1', 'test-org-123');

      // Should delete categories, images, sizes, and the item itself (4 calls)
      expect(db.delete).toHaveBeenCalledTimes(4);
    });
  });

  describe('createCatalogSize', () => {
    it('should create a size', async () => {
      const { db } = await import('@/libs/DB');
      const mockSize = {
        id: 'size-1',
        catalogItemId: 'item-1',
        size: 'M',
        stockQuantity: 10,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockSize]),
        }),
      } as any);

      const { createCatalogSize } = await import('./CatalogService');
      const result = await createCatalogSize({
        catalogItemId: 'item-1',
        size: 'M',
        stockQuantity: 10,
      });

      expect(result.size).toBe('M');
      expect(result.stockQuantity).toBe(10);
    });

    it('should throw error when creation fails', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const { createCatalogSize } = await import('./CatalogService');

      await expect(
        createCatalogSize({ catalogItemId: 'item-1', size: 'M' }),
      ).rejects.toThrow('Failed to create size');
    });
  });

  describe('updateCatalogSize', () => {
    it('should update a size', async () => {
      const { db } = await import('@/libs/DB');
      const mockSize = {
        id: 'size-1',
        catalogItemId: 'item-1',
        size: 'L',
        stockQuantity: 15,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockSize]),
          }),
        }),
      } as any);

      const { updateCatalogSize } = await import('./CatalogService');
      const result = await updateCatalogSize({ id: 'size-1', size: 'L', stockQuantity: 15 });

      expect(result.size).toBe('L');
      expect(result.stockQuantity).toBe(15);
    });

    it('should throw error when size not found', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const { updateCatalogSize } = await import('./CatalogService');

      await expect(
        updateCatalogSize({ id: 'nonexistent' }),
      ).rejects.toThrow('Size not found');
    });
  });

  describe('deleteCatalogSize', () => {
    it('should delete a size', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      } as any);

      const { deleteCatalogSize } = await import('./CatalogService');
      await deleteCatalogSize('size-1');

      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe('adjustSizeStock', () => {
    it('should increase stock by positive adjustment', async () => {
      const { db } = await import('@/libs/DB');
      const mockSize = {
        id: 'size-1',
        catalogItemId: 'item-1',
        size: 'M',
        stockQuantity: 10,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedSize = { ...mockSize, stockQuantity: 15 };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockSize]),
        }),
      } as any);

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUpdatedSize]),
          }),
        }),
      } as any);

      const { adjustSizeStock } = await import('./CatalogService');
      const result = await adjustSizeStock('size-1', 5);

      expect(result.stockQuantity).toBe(15);
    });

    it('should decrease stock by negative adjustment', async () => {
      const { db } = await import('@/libs/DB');
      const mockSize = {
        id: 'size-1',
        catalogItemId: 'item-1',
        size: 'M',
        stockQuantity: 10,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedSize = { ...mockSize, stockQuantity: 5 };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockSize]),
        }),
      } as any);

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUpdatedSize]),
          }),
        }),
      } as any);

      const { adjustSizeStock } = await import('./CatalogService');
      const result = await adjustSizeStock('size-1', -5);

      expect(result.stockQuantity).toBe(5);
    });

    it('should not allow stock to go below zero', async () => {
      const { db } = await import('@/libs/DB');
      const mockSize = {
        id: 'size-1',
        catalogItemId: 'item-1',
        size: 'M',
        stockQuantity: 5,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedSize = { ...mockSize, stockQuantity: 0 };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockSize]),
        }),
      } as any);

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUpdatedSize]),
          }),
        }),
      } as any);

      const { adjustSizeStock } = await import('./CatalogService');
      const result = await adjustSizeStock('size-1', -10);

      expect(result.stockQuantity).toBe(0);
    });

    it('should throw error when size not found', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const { adjustSizeStock } = await import('./CatalogService');

      await expect(adjustSizeStock('nonexistent', 5)).rejects.toThrow('Size not found');
    });

    it('should throw error when update fails', async () => {
      const { db } = await import('@/libs/DB');
      const mockSize = {
        id: 'size-1',
        catalogItemId: 'item-1',
        size: 'M',
        stockQuantity: 10,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockSize]),
        }),
      } as any);

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const { adjustSizeStock } = await import('./CatalogService');

      await expect(adjustSizeStock('size-1', 5)).rejects.toThrow('Failed to update stock');
    });
  });

  describe('getOrganizationCategories', () => {
    it('should return categories for an organization', async () => {
      const { db } = await import('@/libs/DB');
      const mockCategories = [
        {
          id: 'cat-1',
          organizationId: 'test-org-123',
          name: 'Apparel',
          slug: 'apparel',
          description: null,
          parentId: null,
          sortOrder: 0,
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: 'cat-2',
          organizationId: 'test-org-123',
          name: 'Equipment',
          slug: 'equipment',
          description: 'Training equipment',
          parentId: null,
          sortOrder: 1,
          isActive: true,
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockCategories),
        }),
      } as any);

      const { getOrganizationCategories } = await import('./CatalogService');
      const result = await getOrganizationCategories('test-org-123');

      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe('Apparel');
      expect(result[1]?.name).toBe('Equipment');
    });

    it('should handle null optional fields', async () => {
      const { db } = await import('@/libs/DB');
      const mockCategories = [
        {
          id: 'cat-1',
          organizationId: 'test-org-123',
          name: 'Test',
          slug: 'test',
          description: null,
          parentId: null,
          sortOrder: null,
          isActive: null,
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockCategories),
        }),
      } as any);

      const { getOrganizationCategories } = await import('./CatalogService');
      const result = await getOrganizationCategories('test-org-123');

      expect(result[0]?.sortOrder).toBe(0);
      expect(result[0]?.isActive).toBe(true);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const { db } = await import('@/libs/DB');
      const mockCategory = {
        id: 'cat-1',
        organizationId: 'test-org-123',
        name: 'New Category',
        slug: 'new-category',
        description: null,
        parentId: null,
        sortOrder: 0,
        isActive: true,
        createdAt: new Date(),
      };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockCategory]),
        }),
      } as any);

      const { createCategory } = await import('./CatalogService');
      const result = await createCategory({ name: 'New Category' }, 'test-org-123');

      expect(result.name).toBe('New Category');
      expect(result.slug).toBe('new-category');
    });

    it('should throw error when creation fails', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const { createCategory } = await import('./CatalogService');

      await expect(
        createCategory({ name: 'Test' }, 'test-org-123'),
      ).rejects.toThrow('Failed to create category');
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const { db } = await import('@/libs/DB');
      const mockCategory = {
        id: 'cat-1',
        organizationId: 'test-org-123',
        name: 'Updated Category',
        slug: 'updated-category',
        description: 'New description',
        parentId: null,
        sortOrder: 0,
        isActive: true,
        createdAt: new Date(),
      };

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockCategory]),
          }),
        }),
      } as any);

      const { updateCategory } = await import('./CatalogService');
      const result = await updateCategory(
        { id: 'cat-1', name: 'Updated Category', description: 'New description' },
        'test-org-123',
      );

      expect(result.name).toBe('Updated Category');
      expect(result.description).toBe('New description');
    });

    it('should throw error when category not found', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const { updateCategory } = await import('./CatalogService');

      await expect(
        updateCategory({ id: 'nonexistent' }, 'test-org-123'),
      ).rejects.toThrow('Category not found');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category that is not in use', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      } as any);

      const { deleteCategory } = await import('./CatalogService');
      await deleteCategory('cat-1', 'test-org-123');

      expect(db.delete).toHaveBeenCalled();
    });

    it('should throw error when category is in use', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ catalogItemId: 'item-1', categoryId: 'cat-1' }]),
        }),
      } as any);

      const { deleteCategory } = await import('./CatalogService');

      await expect(
        deleteCategory('cat-1', 'test-org-123'),
      ).rejects.toThrow('Cannot delete category that is in use by catalog items');
    });
  });

  describe('createCatalogImage', () => {
    it('should create an image', async () => {
      const { db } = await import('@/libs/DB');
      const mockImage = {
        id: 'img-1',
        catalogItemId: 'item-1',
        url: 'https://example.com/image.jpg',
        thumbnailUrl: null,
        altText: 'Product image',
        isPrimary: false,
        sortOrder: 0,
        createdAt: new Date(),
      };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockImage]),
        }),
      } as any);

      const { createCatalogImage } = await import('./CatalogService');
      const result = await createCatalogImage({
        catalogItemId: 'item-1',
        url: 'https://example.com/image.jpg',
        altText: 'Product image',
      });

      expect(result.url).toBe('https://example.com/image.jpg');
      expect(result.isPrimary).toBe(false);
    });

    it('should unset other primary images when creating a primary image', async () => {
      const { db } = await import('@/libs/DB');
      const mockImage = {
        id: 'img-1',
        catalogItemId: 'item-1',
        url: 'https://example.com/image.jpg',
        thumbnailUrl: null,
        altText: null,
        isPrimary: true,
        sortOrder: 0,
        createdAt: new Date(),
      };

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      } as any);

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockImage]),
        }),
      } as any);

      const { createCatalogImage } = await import('./CatalogService');
      const result = await createCatalogImage({
        catalogItemId: 'item-1',
        url: 'https://example.com/image.jpg',
        isPrimary: true,
      });

      expect(result.isPrimary).toBe(true);
      expect(db.update).toHaveBeenCalled();
    });

    it('should throw error when creation fails', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const { createCatalogImage } = await import('./CatalogService');

      await expect(
        createCatalogImage({ catalogItemId: 'item-1', url: 'https://example.com/image.jpg' }),
      ).rejects.toThrow('Failed to create image');
    });
  });

  describe('deleteCatalogImage', () => {
    it('should delete an image', async () => {
      const { db } = await import('@/libs/DB');

      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      } as any);

      const { deleteCatalogImage } = await import('./CatalogService');
      await deleteCatalogImage('img-1');

      expect(db.delete).toHaveBeenCalled();
    });
  });
});
