import { randomUUID } from 'node:crypto';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import {
  catalogCategorySchema,
  catalogItemCategorySchema,
  catalogItemImageSchema,
  catalogItemSchema,
  catalogItemSizeSchema,
} from '@/models/Schema';

// =============================================================================
// TYPES
// =============================================================================

export type CatalogItemType = 'merchandise' | 'event_access';
export type CatalogSizeType = 'bjj' | 'apparel' | 'none';

// BJJ sizes for gis and belts
export const BJJ_SIZES = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'] as const;
// Apparel sizes for shirts, shorts, rash guards
export const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export type CatalogSize = {
  id: string;
  catalogItemId: string;
  size: string;
  stockQuantity: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CatalogItemImage = {
  id: string;
  catalogItemId: string;
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
};

export type CatalogCategory = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
};

export type CatalogItem = {
  id: string;
  organizationId: string;
  type: CatalogItemType;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  sku: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  eventId: string | null;
  maxPerOrder: number;
  trackInventory: boolean;
  lowStockThreshold: number;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  showOnKiosk: boolean;
  sizeType: CatalogSizeType;
  createdAt: Date;
  updatedAt: Date;
  sizes: CatalogSize[];
  images: CatalogItemImage[];
  categories: CatalogCategory[];
  totalStock: number;
};

type CreateCatalogItemInput = {
  id?: string;
  type: CatalogItemType;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  basePrice: number;
  compareAtPrice?: number | null;
  eventId?: string | null;
  maxPerOrder?: number;
  trackInventory?: boolean;
  lowStockThreshold?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  showOnKiosk?: boolean;
  sizeType?: CatalogSizeType;
  categoryIds?: string[];
  sizes?: Array<{ size: string; stockQuantity: number }>;
};

type UpdateCatalogItemInput = {
  id: string;
  type?: CatalogItemType;
  name?: string;
  slug?: string;
  description?: string | null;
  shortDescription?: string | null;
  sku?: string | null;
  basePrice?: number;
  compareAtPrice?: number | null;
  eventId?: string | null;
  maxPerOrder?: number;
  trackInventory?: boolean;
  lowStockThreshold?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  showOnKiosk?: boolean;
  sizeType?: CatalogSizeType;
  categoryIds?: string[];
  sizes?: Array<{ size: string; stockQuantity: number }>;
};

type CreateSizeInput = {
  id?: string;
  catalogItemId: string;
  size: string;
  stockQuantity?: number;
};

type UpdateSizeInput = {
  id: string;
  size?: string;
  stockQuantity?: number;
};

type CreateCategoryInput = {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  isActive?: boolean;
};

type UpdateCategoryInput = {
  id: string;
  name?: string;
  slug?: string;
  description?: string | null;
  parentId?: string | null;
  isActive?: boolean;
};

type CreateImageInput = {
  id?: string;
  catalogItemId: string;
  url: string;
  thumbnailUrl?: string | null;
  altText?: string;
  isPrimary?: boolean;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// =============================================================================
// CATALOG ITEM SERVICE FUNCTIONS
// =============================================================================

/**
 * Get all catalog items for an organization with sizes, images, and categories
 */
export async function getOrganizationCatalogItems(organizationId: string): Promise<CatalogItem[]> {
  const items = await db
    .select()
    .from(catalogItemSchema)
    .where(eq(catalogItemSchema.organizationId, organizationId));

  if (items.length === 0) {
    return [];
  }

  const itemIds = items.map(item => item.id);

  // Fetch all related data in parallel
  const [sizes, images, itemCategories, allCategories] = await Promise.all([
    db.select().from(catalogItemSizeSchema).where(inArray(catalogItemSizeSchema.catalogItemId, itemIds)),
    db.select().from(catalogItemImageSchema).where(inArray(catalogItemImageSchema.catalogItemId, itemIds)),
    db.select().from(catalogItemCategorySchema).where(inArray(catalogItemCategorySchema.catalogItemId, itemIds)),
    db.select().from(catalogCategorySchema).where(eq(catalogCategorySchema.organizationId, organizationId)),
  ]);

  // Create lookup maps
  const categoryMap = new Map<string, CatalogCategory>();
  allCategories.forEach((cat) => {
    categoryMap.set(cat.id, {
      id: cat.id,
      organizationId: cat.organizationId,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parentId: cat.parentId,
      sortOrder: cat.sortOrder ?? 0,
      isActive: cat.isActive ?? true,
      createdAt: cat.createdAt,
    });
  });

  // Group sizes by item
  const sizesByItem = new Map<string, CatalogSize[]>();
  sizes.forEach((s) => {
    const existing = sizesByItem.get(s.catalogItemId) || [];
    existing.push({
      id: s.id,
      catalogItemId: s.catalogItemId,
      size: s.size,
      stockQuantity: s.stockQuantity ?? 0,
      sortOrder: s.sortOrder ?? 0,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    });
    sizesByItem.set(s.catalogItemId, existing);
  });

  // Group images by item
  const imagesByItem = new Map<string, CatalogItemImage[]>();
  images.forEach((img) => {
    const existing = imagesByItem.get(img.catalogItemId) || [];
    existing.push({
      id: img.id,
      catalogItemId: img.catalogItemId,
      url: img.url,
      thumbnailUrl: img.thumbnailUrl,
      altText: img.altText,
      isPrimary: img.isPrimary ?? false,
      sortOrder: img.sortOrder ?? 0,
      createdAt: img.createdAt,
    });
    imagesByItem.set(img.catalogItemId, existing);
  });

  // Group categories by item
  const categoriesByItem = new Map<string, CatalogCategory[]>();
  itemCategories.forEach((ic) => {
    const category = categoryMap.get(ic.categoryId);
    if (category) {
      const existing = categoriesByItem.get(ic.catalogItemId) || [];
      existing.push(category);
      categoriesByItem.set(ic.catalogItemId, existing);
    }
  });

  return items.map((item) => {
    const itemSizes = sizesByItem.get(item.id) || [];
    const totalStock = itemSizes.reduce((sum, s) => sum + s.stockQuantity, 0);

    return {
      id: item.id,
      organizationId: item.organizationId,
      type: item.type as CatalogItemType,
      name: item.name,
      slug: item.slug,
      description: item.description,
      shortDescription: item.shortDescription,
      sku: item.sku,
      basePrice: item.basePrice,
      compareAtPrice: item.compareAtPrice,
      eventId: item.eventId,
      maxPerOrder: item.maxPerOrder ?? 10,
      trackInventory: item.trackInventory ?? true,
      lowStockThreshold: item.lowStockThreshold ?? 5,
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
      isFeatured: item.isFeatured ?? false,
      showOnKiosk: item.showOnKiosk ?? true,
      sizeType: (item.sizeType as CatalogSizeType) ?? 'none',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      sizes: itemSizes.sort((a, b) => a.sortOrder - b.sortOrder),
      images: (imagesByItem.get(item.id) || []).sort((a, b) => a.sortOrder - b.sortOrder),
      categories: categoriesByItem.get(item.id) || [],
      totalStock,
    };
  });
}

/**
 * Get a single catalog item by ID
 */
export async function getCatalogItemById(itemId: string, organizationId: string): Promise<CatalogItem | null> {
  const items = await getOrganizationCatalogItems(organizationId);
  return items.find(item => item.id === itemId) || null;
}

/**
 * Get catalog items by type
 */
export async function getCatalogItemsByType(organizationId: string, type: CatalogItemType): Promise<CatalogItem[]> {
  const items = await getOrganizationCatalogItems(organizationId);
  return items.filter(item => item.type === type);
}

/**
 * Get catalog items visible on kiosk
 */
export async function getKioskCatalogItems(organizationId: string): Promise<CatalogItem[]> {
  const items = await getOrganizationCatalogItems(organizationId);
  return items.filter(item => item.showOnKiosk && item.isActive);
}

/**
 * Create a new catalog item
 */
export async function createCatalogItem(input: CreateCatalogItemInput, organizationId: string): Promise<CatalogItem> {
  const { categoryIds, sizes, ...itemData } = input;
  const itemId = itemData.id || randomUUID();
  const slug = itemData.slug || generateSlug(itemData.name);

  await db.insert(catalogItemSchema).values({
    id: itemId,
    organizationId,
    type: itemData.type,
    name: itemData.name,
    slug,
    description: itemData.description,
    shortDescription: itemData.shortDescription,
    sku: itemData.sku,
    basePrice: itemData.basePrice,
    compareAtPrice: itemData.compareAtPrice,
    eventId: itemData.eventId,
    maxPerOrder: itemData.maxPerOrder ?? 10,
    trackInventory: itemData.trackInventory ?? true,
    lowStockThreshold: itemData.lowStockThreshold ?? 5,
    isActive: itemData.isActive ?? true,
    isFeatured: itemData.isFeatured ?? false,
    showOnKiosk: itemData.showOnKiosk ?? true,
    sizeType: itemData.sizeType ?? 'none',
  });

  // Add category associations
  if (categoryIds && categoryIds.length > 0) {
    await db.insert(catalogItemCategorySchema).values(
      categoryIds.map(categoryId => ({
        catalogItemId: itemId,
        categoryId,
      })),
    );
  }

  // Add sizes if provided
  if (sizes && sizes.length > 0) {
    await db.insert(catalogItemSizeSchema).values(
      sizes.map((size, index) => ({
        id: randomUUID(),
        catalogItemId: itemId,
        size: size.size,
        stockQuantity: size.stockQuantity,
        sortOrder: index,
      })),
    );
  }

  const item = await getCatalogItemById(itemId, organizationId);
  if (!item) {
    throw new Error('Failed to create catalog item');
  }
  return item;
}

/**
 * Update an existing catalog item
 */
export async function updateCatalogItem(input: UpdateCatalogItemInput, organizationId: string): Promise<CatalogItem> {
  const { id, categoryIds, sizes, ...updateData } = input;

  // Generate slug if name is being updated and slug is not provided
  const dataToUpdate: Record<string, unknown> = { ...updateData };
  if (updateData.name && !updateData.slug) {
    dataToUpdate.slug = generateSlug(updateData.name);
  }

  await db
    .update(catalogItemSchema)
    .set(dataToUpdate)
    .where(and(eq(catalogItemSchema.id, id), eq(catalogItemSchema.organizationId, organizationId)));

  // Update category associations if provided
  if (categoryIds !== undefined) {
    // Remove existing associations
    await db.delete(catalogItemCategorySchema).where(eq(catalogItemCategorySchema.catalogItemId, id));

    // Add new associations
    if (categoryIds.length > 0) {
      await db.insert(catalogItemCategorySchema).values(
        categoryIds.map(categoryId => ({
          catalogItemId: id,
          categoryId,
        })),
      );
    }
  }

  // Update sizes if provided
  if (sizes !== undefined) {
    // Remove existing sizes
    await db.delete(catalogItemSizeSchema).where(eq(catalogItemSizeSchema.catalogItemId, id));

    // Add new sizes
    if (sizes.length > 0) {
      await db.insert(catalogItemSizeSchema).values(
        sizes.map((size, index) => ({
          id: randomUUID(),
          catalogItemId: id,
          size: size.size,
          stockQuantity: size.stockQuantity,
          sortOrder: index,
        })),
      );
    }
  }

  const item = await getCatalogItemById(id, organizationId);
  if (!item) {
    throw new Error('Catalog item not found');
  }
  return item;
}

/**
 * Delete a catalog item (and all associated sizes, images, category associations)
 */
export async function deleteCatalogItem(itemId: string, organizationId: string): Promise<void> {
  // Delete associated data first
  await db.delete(catalogItemCategorySchema).where(eq(catalogItemCategorySchema.catalogItemId, itemId));
  await db.delete(catalogItemImageSchema).where(eq(catalogItemImageSchema.catalogItemId, itemId));
  await db.delete(catalogItemSizeSchema).where(eq(catalogItemSizeSchema.catalogItemId, itemId));

  // Delete the item itself
  await db
    .delete(catalogItemSchema)
    .where(and(eq(catalogItemSchema.id, itemId), eq(catalogItemSchema.organizationId, organizationId)));
}

// =============================================================================
// SIZE SERVICE FUNCTIONS
// =============================================================================

/**
 * Create a size for a catalog item
 */
export async function createCatalogSize(input: CreateSizeInput): Promise<CatalogSize> {
  const sizeId = input.id || randomUUID();

  const result = await db
    .insert(catalogItemSizeSchema)
    .values({
      id: sizeId,
      catalogItemId: input.catalogItemId,
      size: input.size,
      stockQuantity: input.stockQuantity ?? 0,
    })
    .returning();

  const size = result[0];
  if (!size) {
    throw new Error('Failed to create size');
  }

  return {
    id: size.id,
    catalogItemId: size.catalogItemId,
    size: size.size,
    stockQuantity: size.stockQuantity ?? 0,
    sortOrder: size.sortOrder ?? 0,
    createdAt: size.createdAt,
    updatedAt: size.updatedAt,
  };
}

/**
 * Update a size
 */
export async function updateCatalogSize(input: UpdateSizeInput): Promise<CatalogSize> {
  const { id, ...updateData } = input;

  const result = await db
    .update(catalogItemSizeSchema)
    .set(updateData)
    .where(eq(catalogItemSizeSchema.id, id))
    .returning();

  const size = result[0];
  if (!size) {
    throw new Error('Size not found');
  }

  return {
    id: size.id,
    catalogItemId: size.catalogItemId,
    size: size.size,
    stockQuantity: size.stockQuantity ?? 0,
    sortOrder: size.sortOrder ?? 0,
    createdAt: size.createdAt,
    updatedAt: size.updatedAt,
  };
}

/**
 * Delete a size
 */
export async function deleteCatalogSize(sizeId: string): Promise<void> {
  await db.delete(catalogItemSizeSchema).where(eq(catalogItemSizeSchema.id, sizeId));
}

/**
 * Adjust size stock quantity
 */
export async function adjustSizeStock(sizeId: string, adjustment: number): Promise<CatalogSize> {
  // Get current stock
  const sizes = await db
    .select()
    .from(catalogItemSizeSchema)
    .where(eq(catalogItemSizeSchema.id, sizeId));

  const size = sizes[0];
  if (!size) {
    throw new Error('Size not found');
  }

  const newStock = Math.max(0, (size.stockQuantity ?? 0) + adjustment);

  const result = await db
    .update(catalogItemSizeSchema)
    .set({ stockQuantity: newStock })
    .where(eq(catalogItemSizeSchema.id, sizeId))
    .returning();

  const updated = result[0];
  if (!updated) {
    throw new Error('Failed to update stock');
  }

  return {
    id: updated.id,
    catalogItemId: updated.catalogItemId,
    size: updated.size,
    stockQuantity: updated.stockQuantity ?? 0,
    sortOrder: updated.sortOrder ?? 0,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

// =============================================================================
// CATEGORY SERVICE FUNCTIONS
// =============================================================================

/**
 * Get all categories for an organization
 */
export async function getOrganizationCategories(organizationId: string): Promise<CatalogCategory[]> {
  const categories = await db
    .select()
    .from(catalogCategorySchema)
    .where(eq(catalogCategorySchema.organizationId, organizationId));

  return categories.map(cat => ({
    id: cat.id,
    organizationId: cat.organizationId,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    parentId: cat.parentId,
    sortOrder: cat.sortOrder ?? 0,
    isActive: cat.isActive ?? true,
    createdAt: cat.createdAt,
  }));
}

/**
 * Create a category
 */
export async function createCategory(input: CreateCategoryInput, organizationId: string): Promise<CatalogCategory> {
  const categoryId = input.id || randomUUID();
  const slug = input.slug || generateSlug(input.name);

  const result = await db
    .insert(catalogCategorySchema)
    .values({
      id: categoryId,
      organizationId,
      name: input.name,
      slug,
      description: input.description,
      parentId: input.parentId,
      isActive: input.isActive ?? true,
    })
    .returning();

  const category = result[0];
  if (!category) {
    throw new Error('Failed to create category');
  }

  return {
    id: category.id,
    organizationId: category.organizationId,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    sortOrder: category.sortOrder ?? 0,
    isActive: category.isActive ?? true,
    createdAt: category.createdAt,
  };
}

/**
 * Update a category
 */
export async function updateCategory(input: UpdateCategoryInput, organizationId: string): Promise<CatalogCategory> {
  const { id, ...updateData } = input;

  // Generate slug if name is being updated and slug is not provided
  const dataToUpdate: Record<string, unknown> = { ...updateData };
  if (updateData.name && !updateData.slug) {
    dataToUpdate.slug = generateSlug(updateData.name);
  }

  const result = await db
    .update(catalogCategorySchema)
    .set(dataToUpdate)
    .where(and(eq(catalogCategorySchema.id, id), eq(catalogCategorySchema.organizationId, organizationId)))
    .returning();

  const category = result[0];
  if (!category) {
    throw new Error('Category not found');
  }

  return {
    id: category.id,
    organizationId: category.organizationId,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    sortOrder: category.sortOrder ?? 0,
    isActive: category.isActive ?? true,
    createdAt: category.createdAt,
  };
}

/**
 * Delete a category (only if not in use)
 */
export async function deleteCategory(categoryId: string, organizationId: string): Promise<void> {
  // Check if category is in use
  const usages = await db
    .select()
    .from(catalogItemCategorySchema)
    .where(eq(catalogItemCategorySchema.categoryId, categoryId));

  if (usages.length > 0) {
    throw new Error('Cannot delete category that is in use by catalog items');
  }

  await db
    .delete(catalogCategorySchema)
    .where(and(eq(catalogCategorySchema.id, categoryId), eq(catalogCategorySchema.organizationId, organizationId)));
}

// =============================================================================
// IMAGE SERVICE FUNCTIONS
// =============================================================================

/**
 * Add an image to a catalog item
 */
export async function createCatalogImage(input: CreateImageInput): Promise<CatalogItemImage> {
  const imageId = input.id || randomUUID();

  // If this is marked as primary, unset other primary images for this item
  if (input.isPrimary) {
    await db
      .update(catalogItemImageSchema)
      .set({ isPrimary: false })
      .where(eq(catalogItemImageSchema.catalogItemId, input.catalogItemId));
  }

  const result = await db
    .insert(catalogItemImageSchema)
    .values({
      id: imageId,
      catalogItemId: input.catalogItemId,
      url: input.url,
      thumbnailUrl: input.thumbnailUrl,
      altText: input.altText,
      isPrimary: input.isPrimary ?? false,
    })
    .returning();

  const image = result[0];
  if (!image) {
    throw new Error('Failed to create image');
  }

  return {
    id: image.id,
    catalogItemId: image.catalogItemId,
    url: image.url,
    thumbnailUrl: image.thumbnailUrl,
    altText: image.altText,
    isPrimary: image.isPrimary ?? false,
    sortOrder: image.sortOrder ?? 0,
    createdAt: image.createdAt,
  };
}

/**
 * Delete an image
 */
export async function deleteCatalogImage(imageId: string): Promise<void> {
  await db.delete(catalogItemImageSchema).where(eq(catalogItemImageSchema.id, imageId));
}
