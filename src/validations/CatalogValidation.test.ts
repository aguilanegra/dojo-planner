import { describe, expect, it } from 'vitest';
import {
  AdjustStockValidation,
  CatalogItemTypeEnum,
  CatalogSizeTypeEnum,
  CreateCatalogImageValidation,
  CreateCatalogItemValidation,
  CreateCategoryValidation,
  CreateSizeValidation,
  DeleteCatalogImageValidation,
  DeleteCatalogItemValidation,
  DeleteCategoryValidation,
  DeleteSizeValidation,
  GetCatalogItemValidation,
  UpdateCatalogItemValidation,
  UpdateCategoryValidation,
  UpdateSizeValidation,
} from './CatalogValidation';

describe('CatalogValidation', () => {
  describe('CatalogItemTypeEnum', () => {
    it('should accept merchandise type', () => {
      const result = CatalogItemTypeEnum.safeParse('merchandise');

      expect(result.success).toBe(true);
    });

    it('should accept event_access type', () => {
      const result = CatalogItemTypeEnum.safeParse('event_access');

      expect(result.success).toBe(true);
    });

    it('should reject invalid type', () => {
      const result = CatalogItemTypeEnum.safeParse('invalid');

      expect(result.success).toBe(false);
    });
  });

  describe('CatalogSizeTypeEnum', () => {
    it('should accept bjj type', () => {
      const result = CatalogSizeTypeEnum.safeParse('bjj');

      expect(result.success).toBe(true);
    });

    it('should accept apparel type', () => {
      const result = CatalogSizeTypeEnum.safeParse('apparel');

      expect(result.success).toBe(true);
    });

    it('should accept none type', () => {
      const result = CatalogSizeTypeEnum.safeParse('none');

      expect(result.success).toBe(true);
    });

    it('should reject invalid type', () => {
      const result = CatalogSizeTypeEnum.safeParse('invalid');

      expect(result.success).toBe(false);
    });
  });

  describe('CreateCatalogItemValidation', () => {
    const validItem = {
      type: 'merchandise' as const,
      name: 'Test Product',
      basePrice: 29.99,
    };

    it('should validate a minimal valid item', () => {
      const result = CreateCatalogItemValidation.safeParse(validItem);

      expect(result.success).toBe(true);
    });

    it('should validate a complete item with all fields', () => {
      const completeItem = {
        ...validItem,
        slug: 'test-product',
        description: 'A test product description',
        shortDescription: 'Short desc',
        sku: 'TEST-001',
        compareAtPrice: 39.99,
        eventId: 'event-123',
        maxPerOrder: 5,
        trackInventory: true,
        lowStockThreshold: 10,
        isActive: true,
        isFeatured: true,
        showOnKiosk: true,
        sizeType: 'bjj' as const,
        categoryIds: ['cat-1', 'cat-2'],
        sizes: [
          { size: 'A1', stockQuantity: 10 },
          { size: 'A2', stockQuantity: 15 },
        ],
      };
      const result = CreateCatalogItemValidation.safeParse(completeItem);

      expect(result.success).toBe(true);
    });

    it('should fail when name is missing', () => {
      const invalidItem = { type: 'merchandise', basePrice: 29.99 };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when name is empty', () => {
      const invalidItem = { ...validItem, name: '' };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when type is invalid', () => {
      const invalidItem = { ...validItem, type: 'invalid' };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when basePrice is negative', () => {
      const invalidItem = { ...validItem, basePrice: -10 };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when slug contains uppercase', () => {
      const invalidItem = { ...validItem, slug: 'Test-Product' };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when slug contains spaces', () => {
      const invalidItem = { ...validItem, slug: 'test product' };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when shortDescription exceeds 200 characters', () => {
      const invalidItem = { ...validItem, shortDescription: 'a'.repeat(201) };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when maxPerOrder is less than 1', () => {
      const invalidItem = { ...validItem, maxPerOrder: 0 };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when maxPerOrder exceeds 100', () => {
      const invalidItem = { ...validItem, maxPerOrder: 101 };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should fail when lowStockThreshold is negative', () => {
      const invalidItem = { ...validItem, lowStockThreshold: -1 };
      const result = CreateCatalogItemValidation.safeParse(invalidItem);

      expect(result.success).toBe(false);
    });

    it('should accept nullable compareAtPrice', () => {
      const itemWithNull = { ...validItem, compareAtPrice: null };
      const result = CreateCatalogItemValidation.safeParse(itemWithNull);

      expect(result.success).toBe(true);
    });

    it('should accept nullable eventId', () => {
      const itemWithNull = { ...validItem, eventId: null };
      const result = CreateCatalogItemValidation.safeParse(itemWithNull);

      expect(result.success).toBe(true);
    });

    it('should apply default values', () => {
      const result = CreateCatalogItemValidation.safeParse(validItem);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.maxPerOrder).toBe(10);
        expect(result.data.trackInventory).toBe(true);
        expect(result.data.lowStockThreshold).toBe(5);
        expect(result.data.isActive).toBe(true);
        expect(result.data.isFeatured).toBe(false);
        expect(result.data.showOnKiosk).toBe(true);
        expect(result.data.sizeType).toBe('none');
      }
    });

    it('should validate sizes array with valid entries', () => {
      const itemWithSizes = {
        ...validItem,
        sizes: [
          { size: 'S', stockQuantity: 5 },
          { size: 'M', stockQuantity: 10 },
        ],
      };
      const result = CreateCatalogItemValidation.safeParse(itemWithSizes);

      expect(result.success).toBe(true);
    });

    it('should fail when size entry has empty size', () => {
      const itemWithInvalidSize = {
        ...validItem,
        sizes: [{ size: '', stockQuantity: 5 }],
      };
      const result = CreateCatalogItemValidation.safeParse(itemWithInvalidSize);

      expect(result.success).toBe(false);
    });

    it('should fail when size entry has negative stockQuantity', () => {
      const itemWithInvalidSize = {
        ...validItem,
        sizes: [{ size: 'S', stockQuantity: -1 }],
      };
      const result = CreateCatalogItemValidation.safeParse(itemWithInvalidSize);

      expect(result.success).toBe(false);
    });
  });

  describe('UpdateCatalogItemValidation', () => {
    it('should validate with only id', () => {
      const result = UpdateCatalogItemValidation.safeParse({ id: 'item-123' });

      expect(result.success).toBe(true);
    });

    it('should validate with id and partial updates', () => {
      const partialUpdate = {
        id: 'item-123',
        name: 'Updated Name',
        basePrice: 39.99,
      };
      const result = UpdateCatalogItemValidation.safeParse(partialUpdate);

      expect(result.success).toBe(true);
    });

    it('should fail when id is missing', () => {
      const result = UpdateCatalogItemValidation.safeParse({ name: 'Updated' });

      expect(result.success).toBe(false);
    });

    it('should fail when id is empty', () => {
      const result = UpdateCatalogItemValidation.safeParse({ id: '' });

      expect(result.success).toBe(false);
    });

    it('should accept nullable description', () => {
      const result = UpdateCatalogItemValidation.safeParse({
        id: 'item-123',
        description: null,
      });

      expect(result.success).toBe(true);
    });

    it('should accept nullable shortDescription', () => {
      const result = UpdateCatalogItemValidation.safeParse({
        id: 'item-123',
        shortDescription: null,
      });

      expect(result.success).toBe(true);
    });

    it('should accept nullable sku', () => {
      const result = UpdateCatalogItemValidation.safeParse({
        id: 'item-123',
        sku: null,
      });

      expect(result.success).toBe(true);
    });

    it('should validate sizes update', () => {
      const result = UpdateCatalogItemValidation.safeParse({
        id: 'item-123',
        sizes: [{ size: 'L', stockQuantity: 20 }],
      });

      expect(result.success).toBe(true);
    });
  });

  describe('DeleteCatalogItemValidation', () => {
    it('should validate with valid id', () => {
      const result = DeleteCatalogItemValidation.safeParse({ id: 'item-123' });

      expect(result.success).toBe(true);
    });

    it('should fail when id is missing', () => {
      const result = DeleteCatalogItemValidation.safeParse({});

      expect(result.success).toBe(false);
    });

    it('should fail when id is empty', () => {
      const result = DeleteCatalogItemValidation.safeParse({ id: '' });

      expect(result.success).toBe(false);
    });
  });

  describe('CreateSizeValidation', () => {
    it('should validate a valid size', () => {
      const result = CreateSizeValidation.safeParse({
        catalogItemId: 'item-123',
        size: 'A2',
        stockQuantity: 10,
      });

      expect(result.success).toBe(true);
    });

    it('should apply default stockQuantity of 0', () => {
      const result = CreateSizeValidation.safeParse({
        catalogItemId: 'item-123',
        size: 'A2',
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.stockQuantity).toBe(0);
      }
    });

    it('should fail when catalogItemId is missing', () => {
      const result = CreateSizeValidation.safeParse({
        size: 'A2',
        stockQuantity: 10,
      });

      expect(result.success).toBe(false);
    });

    it('should fail when size is empty', () => {
      const result = CreateSizeValidation.safeParse({
        catalogItemId: 'item-123',
        size: '',
        stockQuantity: 10,
      });

      expect(result.success).toBe(false);
    });

    it('should fail when stockQuantity is negative', () => {
      const result = CreateSizeValidation.safeParse({
        catalogItemId: 'item-123',
        size: 'A2',
        stockQuantity: -5,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('UpdateSizeValidation', () => {
    it('should validate with only id', () => {
      const result = UpdateSizeValidation.safeParse({ id: 'size-123' });

      expect(result.success).toBe(true);
    });

    it('should validate with id and size update', () => {
      const result = UpdateSizeValidation.safeParse({
        id: 'size-123',
        size: 'A3',
      });

      expect(result.success).toBe(true);
    });

    it('should validate with id and stockQuantity update', () => {
      const result = UpdateSizeValidation.safeParse({
        id: 'size-123',
        stockQuantity: 15,
      });

      expect(result.success).toBe(true);
    });

    it('should fail when id is missing', () => {
      const result = UpdateSizeValidation.safeParse({ size: 'A3' });

      expect(result.success).toBe(false);
    });

    it('should fail when id is empty', () => {
      const result = UpdateSizeValidation.safeParse({ id: '' });

      expect(result.success).toBe(false);
    });
  });

  describe('DeleteSizeValidation', () => {
    it('should validate with valid id', () => {
      const result = DeleteSizeValidation.safeParse({ id: 'size-123' });

      expect(result.success).toBe(true);
    });

    it('should fail when id is empty', () => {
      const result = DeleteSizeValidation.safeParse({ id: '' });

      expect(result.success).toBe(false);
    });
  });

  describe('AdjustStockValidation', () => {
    it('should validate a positive adjustment', () => {
      const result = AdjustStockValidation.safeParse({
        sizeId: 'size-123',
        adjustment: 10,
        reason: 'Received new inventory',
      });

      expect(result.success).toBe(true);
    });

    it('should validate a negative adjustment', () => {
      const result = AdjustStockValidation.safeParse({
        sizeId: 'size-123',
        adjustment: -5,
        reason: 'Damaged items removed',
      });

      expect(result.success).toBe(true);
    });

    it('should validate zero adjustment', () => {
      const result = AdjustStockValidation.safeParse({
        sizeId: 'size-123',
        adjustment: 0,
        reason: 'Inventory count correction',
      });

      expect(result.success).toBe(true);
    });

    it('should fail when sizeId is missing', () => {
      const result = AdjustStockValidation.safeParse({
        adjustment: 10,
        reason: 'Test',
      });

      expect(result.success).toBe(false);
    });

    it('should fail when reason is empty', () => {
      const result = AdjustStockValidation.safeParse({
        sizeId: 'size-123',
        adjustment: 10,
        reason: '',
      });

      expect(result.success).toBe(false);
    });

    it('should fail when reason is missing', () => {
      const result = AdjustStockValidation.safeParse({
        sizeId: 'size-123',
        adjustment: 10,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('CreateCategoryValidation', () => {
    it('should validate a minimal category', () => {
      const result = CreateCategoryValidation.safeParse({
        name: 'Test Category',
      });

      expect(result.success).toBe(true);
    });

    it('should validate a complete category', () => {
      const result = CreateCategoryValidation.safeParse({
        name: 'Test Category',
        slug: 'test-category',
        description: 'A category for testing',
        parentId: 'parent-123',
        isActive: false,
      });

      expect(result.success).toBe(true);
    });

    it('should apply default isActive of true', () => {
      const result = CreateCategoryValidation.safeParse({
        name: 'Test Category',
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it('should fail when name is missing', () => {
      const result = CreateCategoryValidation.safeParse({
        slug: 'test-category',
      });

      expect(result.success).toBe(false);
    });

    it('should fail when name is empty', () => {
      const result = CreateCategoryValidation.safeParse({
        name: '',
      });

      expect(result.success).toBe(false);
    });

    it('should fail when slug contains uppercase', () => {
      const result = CreateCategoryValidation.safeParse({
        name: 'Test',
        slug: 'Test-Category',
      });

      expect(result.success).toBe(false);
    });

    it('should accept nullable parentId', () => {
      const result = CreateCategoryValidation.safeParse({
        name: 'Test',
        parentId: null,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('UpdateCategoryValidation', () => {
    it('should validate with only id', () => {
      const result = UpdateCategoryValidation.safeParse({ id: 'cat-123' });

      expect(result.success).toBe(true);
    });

    it('should validate with partial updates', () => {
      const result = UpdateCategoryValidation.safeParse({
        id: 'cat-123',
        name: 'Updated Category',
        isActive: false,
      });

      expect(result.success).toBe(true);
    });

    it('should fail when id is missing', () => {
      const result = UpdateCategoryValidation.safeParse({
        name: 'Updated',
      });

      expect(result.success).toBe(false);
    });

    it('should accept nullable description', () => {
      const result = UpdateCategoryValidation.safeParse({
        id: 'cat-123',
        description: null,
      });

      expect(result.success).toBe(true);
    });

    it('should accept nullable parentId', () => {
      const result = UpdateCategoryValidation.safeParse({
        id: 'cat-123',
        parentId: null,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('DeleteCategoryValidation', () => {
    it('should validate with valid id', () => {
      const result = DeleteCategoryValidation.safeParse({ id: 'cat-123' });

      expect(result.success).toBe(true);
    });

    it('should fail when id is empty', () => {
      const result = DeleteCategoryValidation.safeParse({ id: '' });

      expect(result.success).toBe(false);
    });
  });

  describe('GetCatalogItemValidation', () => {
    it('should validate with valid id', () => {
      const result = GetCatalogItemValidation.safeParse({ id: 'item-123' });

      expect(result.success).toBe(true);
    });

    it('should fail when id is empty', () => {
      const result = GetCatalogItemValidation.safeParse({ id: '' });

      expect(result.success).toBe(false);
    });
  });

  describe('CreateCatalogImageValidation', () => {
    it('should validate a minimal image', () => {
      const result = CreateCatalogImageValidation.safeParse({
        catalogItemId: 'item-123',
        url: 'https://example.com/image.jpg',
      });

      expect(result.success).toBe(true);
    });

    it('should validate a complete image', () => {
      const result = CreateCatalogImageValidation.safeParse({
        catalogItemId: 'item-123',
        url: 'https://example.com/image.jpg',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        altText: 'Product image',
        isPrimary: true,
      });

      expect(result.success).toBe(true);
    });

    it('should validate data URL for image', () => {
      const result = CreateCatalogImageValidation.safeParse({
        catalogItemId: 'item-123',
        url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
      });

      expect(result.success).toBe(true);
    });

    it('should apply default isPrimary of false', () => {
      const result = CreateCatalogImageValidation.safeParse({
        catalogItemId: 'item-123',
        url: 'https://example.com/image.jpg',
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isPrimary).toBe(false);
      }
    });

    it('should fail when catalogItemId is missing', () => {
      const result = CreateCatalogImageValidation.safeParse({
        url: 'https://example.com/image.jpg',
      });

      expect(result.success).toBe(false);
    });

    it('should fail when url is invalid', () => {
      const result = CreateCatalogImageValidation.safeParse({
        catalogItemId: 'item-123',
        url: 'not-a-url',
      });

      expect(result.success).toBe(false);
    });

    it('should fail when thumbnailUrl is invalid', () => {
      const result = CreateCatalogImageValidation.safeParse({
        catalogItemId: 'item-123',
        url: 'https://example.com/image.jpg',
        thumbnailUrl: 'not-a-url',
      });

      expect(result.success).toBe(false);
    });

    it('should accept nullable thumbnailUrl', () => {
      const result = CreateCatalogImageValidation.safeParse({
        catalogItemId: 'item-123',
        url: 'https://example.com/image.jpg',
        thumbnailUrl: null,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('DeleteCatalogImageValidation', () => {
    it('should validate with valid id', () => {
      const result = DeleteCatalogImageValidation.safeParse({ id: 'img-123' });

      expect(result.success).toBe(true);
    });

    it('should fail when id is empty', () => {
      const result = DeleteCatalogImageValidation.safeParse({ id: '' });

      expect(result.success).toBe(false);
    });
  });
});
