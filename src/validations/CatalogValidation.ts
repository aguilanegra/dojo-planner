import * as z from 'zod';

// Catalog item type enum
export const CatalogItemTypeEnum = z.enum(['merchandise', 'event_access']);
export type CatalogItemType = z.infer<typeof CatalogItemTypeEnum>;

// Catalog size type enum
export const CatalogSizeTypeEnum = z.enum(['bjj', 'apparel', 'none']);
export type CatalogSizeType = z.infer<typeof CatalogSizeTypeEnum>;

// Size stock input for create/update
const SizeStockInput = z.object({
  size: z.string().min(1),
  stockQuantity: z.number().min(0).default(0),
});

// Create catalog item validation
export const CreateCatalogItemValidation = z.object({
  type: CatalogItemTypeEnum,
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(200).optional(),
  sku: z.string().optional(),
  basePrice: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().min(0).optional().nullable(),
  eventId: z.string().optional().nullable(),
  maxPerOrder: z.number().min(1).max(100).default(10),
  trackInventory: z.boolean().default(true),
  lowStockThreshold: z.number().min(0).default(5),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  showOnKiosk: z.boolean().default(true),
  sizeType: CatalogSizeTypeEnum.default('none'),
  categoryIds: z.array(z.string()).optional(),
  sizes: z.array(SizeStockInput).optional(),
});

// Update catalog item validation
export const UpdateCatalogItemValidation = z.object({
  id: z.string().min(1),
  type: CatalogItemTypeEnum.optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().optional().nullable(),
  shortDescription: z.string().max(200).optional().nullable(),
  sku: z.string().optional().nullable(),
  basePrice: z.number().min(0).optional(),
  compareAtPrice: z.number().min(0).optional().nullable(),
  eventId: z.string().optional().nullable(),
  maxPerOrder: z.number().min(1).max(100).optional(),
  trackInventory: z.boolean().optional(),
  lowStockThreshold: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  showOnKiosk: z.boolean().optional(),
  sizeType: CatalogSizeTypeEnum.optional(),
  categoryIds: z.array(z.string()).optional(),
  sizes: z.array(SizeStockInput).optional(),
});

// Delete catalog item validation
export const DeleteCatalogItemValidation = z.object({
  id: z.string().min(1),
});

// Create size validation
export const CreateSizeValidation = z.object({
  catalogItemId: z.string().min(1),
  size: z.string().min(1, 'Size is required'),
  stockQuantity: z.number().min(0).default(0),
});

// Update size validation
export const UpdateSizeValidation = z.object({
  id: z.string().min(1),
  size: z.string().min(1).optional(),
  stockQuantity: z.number().min(0).optional(),
});

// Delete size validation
export const DeleteSizeValidation = z.object({
  id: z.string().min(1),
});

// Stock adjustment validation
export const AdjustStockValidation = z.object({
  sizeId: z.string().min(1),
  adjustment: z.number(), // Can be positive or negative
  reason: z.string().min(1, 'Reason is required'),
});

// Create category validation
export const CreateCategoryValidation = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

// Update category validation
export const UpdateCategoryValidation = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// Delete category validation
export const DeleteCategoryValidation = z.object({
  id: z.string().min(1),
});

// Get catalog item by ID validation
export const GetCatalogItemValidation = z.object({
  id: z.string().min(1),
});

// Catalog image validation
export const CreateCatalogImageValidation = z.object({
  catalogItemId: z.string().min(1),
  url: z.string().url('Invalid image URL'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional().nullable(),
  altText: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const DeleteCatalogImageValidation = z.object({
  id: z.string().min(1),
});
