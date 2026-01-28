import { ORPCError, os } from '@orpc/server';
import { logger } from '@/libs/Logger';
import { audit } from '@/services/AuditService';
import {
  adjustSizeStock,
  createCatalogImage,
  createCatalogItem,
  createCatalogSize,
  createCategory,
  deleteCatalogImage,
  deleteCatalogItem,
  deleteCatalogSize,
  deleteCategory,
  getCatalogItemById,
  getKioskCatalogItems,
  getOrganizationCatalogItems,
  getOrganizationCategories,
  updateCatalogItem,
  updateCatalogSize,
  updateCategory,
} from '@/services/CatalogService';
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from '@/types/Audit';
import { ORG_ROLE } from '@/types/Auth';
import {
  AdjustStockValidation,
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
} from '@/validations/CatalogValidation';
import { guardRole } from './AuthGuards';

// =============================================================================
// CATALOG ITEM HANDLERS
// =============================================================================

/**
 * List all catalog items for the organization
 */
export const list = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

  try {
    const items = await getOrganizationCatalogItems(orgId);
    return { items };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to fetch catalog items: ${errorMessage}`);
    throw error instanceof ORPCError ? error : new ORPCError('Failed to fetch catalog items.', { status: 500 });
  }
});

/**
 * List catalog items visible on kiosk
 */
export const listForKiosk = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.MEMBER);

  try {
    const items = await getKioskCatalogItems(orgId);
    return { items };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to fetch kiosk catalog items: ${errorMessage}`);
    throw error instanceof ORPCError ? error : new ORPCError('Failed to fetch catalog items.', { status: 500 });
  }
});

/**
 * Get a single catalog item by ID
 */
export const get = os
  .input(GetCatalogItemValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

    try {
      const item = await getCatalogItemById(input.id, orgId);
      if (!item) {
        throw new ORPCError('Catalog item not found', { status: 404 });
      }
      return { item };
    } catch (error) {
      if (error instanceof ORPCError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to fetch catalog item: ${errorMessage}`);
      throw new ORPCError('Failed to fetch catalog item.', { status: 500 });
    }
  });

/**
 * Create a new catalog item
 */
export const create = os
  .input(CreateCatalogItemValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      logger.info(`[Catalog.create] Creating catalog item for organization: ${context.orgId}`, {
        name: input.name,
        type: input.type,
      });

      const item = await createCatalogItem(input, context.orgId);

      logger.info(`[Catalog.create] Catalog item created successfully: ${item.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_ITEM_CREATE, AUDIT_ENTITY_TYPE.CATALOG_ITEM, {
        entityId: item.id,
        status: 'success',
      });

      return { item };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to create catalog item: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_ITEM_CREATE, AUDIT_ENTITY_TYPE.CATALOG_ITEM, {
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to create catalog item.', { status: 500 });
    }
  });

/**
 * Update an existing catalog item
 */
export const update = os
  .input(UpdateCatalogItemValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      const item = await updateCatalogItem(input, context.orgId);

      logger.info(`[Catalog.update] Catalog item updated: ${input.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_ITEM_UPDATE, AUDIT_ENTITY_TYPE.CATALOG_ITEM, {
        entityId: input.id,
        status: 'success',
      });

      return { item };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to update catalog item: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_ITEM_UPDATE, AUDIT_ENTITY_TYPE.CATALOG_ITEM, {
        entityId: input.id,
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to update catalog item.', { status: 500 });
    }
  });

/**
 * Delete a catalog item
 */
export const remove = os
  .input(DeleteCatalogItemValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      await deleteCatalogItem(input.id, context.orgId);

      logger.info(`[Catalog.remove] Catalog item deleted: ${input.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_ITEM_DELETE, AUDIT_ENTITY_TYPE.CATALOG_ITEM, {
        entityId: input.id,
        status: 'success',
      });

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to delete catalog item: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_ITEM_DELETE, AUDIT_ENTITY_TYPE.CATALOG_ITEM, {
        entityId: input.id,
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to delete catalog item.', { status: 500 });
    }
  });

// =============================================================================
// SIZE HANDLERS
// =============================================================================

/**
 * Create a size for a catalog item
 */
export const sizeCreate = os
  .input(CreateSizeValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      const size = await createCatalogSize(input);

      logger.info(`[Catalog.sizeCreate] Size created: ${size.id} for item: ${input.catalogItemId}`);

      await audit(context, AUDIT_ACTION.CATALOG_SIZE_CREATE, AUDIT_ENTITY_TYPE.CATALOG_SIZE, {
        entityId: size.id,
        status: 'success',
      });

      return { size };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to create size: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_SIZE_CREATE, AUDIT_ENTITY_TYPE.CATALOG_SIZE, {
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to create size.', { status: 500 });
    }
  });

/**
 * Update a size
 */
export const sizeUpdate = os
  .input(UpdateSizeValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      const size = await updateCatalogSize(input);

      logger.info(`[Catalog.sizeUpdate] Size updated: ${input.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_SIZE_UPDATE, AUDIT_ENTITY_TYPE.CATALOG_SIZE, {
        entityId: input.id,
        status: 'success',
      });

      return { size };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to update size: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_SIZE_UPDATE, AUDIT_ENTITY_TYPE.CATALOG_SIZE, {
        entityId: input.id,
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to update size.', { status: 500 });
    }
  });

/**
 * Delete a size
 */
export const sizeRemove = os
  .input(DeleteSizeValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      await deleteCatalogSize(input.id);

      logger.info(`[Catalog.sizeRemove] Size deleted: ${input.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_SIZE_DELETE, AUDIT_ENTITY_TYPE.CATALOG_SIZE, {
        entityId: input.id,
        status: 'success',
      });

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to delete size: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_SIZE_DELETE, AUDIT_ENTITY_TYPE.CATALOG_SIZE, {
        entityId: input.id,
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to delete size.', { status: 500 });
    }
  });

/**
 * Adjust size stock
 */
export const stockAdjust = os
  .input(AdjustStockValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.FRONT_DESK);

    try {
      const size = await adjustSizeStock(input.sizeId, input.adjustment);

      logger.info(`[Catalog.stockAdjust] Stock adjusted for size: ${input.sizeId}, adjustment: ${input.adjustment}, reason: ${input.reason}`);

      await audit(context, AUDIT_ACTION.CATALOG_STOCK_ADJUST, AUDIT_ENTITY_TYPE.CATALOG_SIZE, {
        entityId: input.sizeId,
        status: 'success',
      });

      return { size };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to adjust stock: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_STOCK_ADJUST, AUDIT_ENTITY_TYPE.CATALOG_SIZE, {
        entityId: input.sizeId,
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to adjust stock.', { status: 500 });
    }
  });

// =============================================================================
// CATEGORY HANDLERS
// =============================================================================

/**
 * List all categories for the organization
 */
export const categoryList = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

  try {
    const categories = await getOrganizationCategories(orgId);
    return { categories };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to fetch categories: ${errorMessage}`);
    throw error instanceof ORPCError ? error : new ORPCError('Failed to fetch categories.', { status: 500 });
  }
});

/**
 * Create a category
 */
export const categoryCreate = os
  .input(CreateCategoryValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      const category = await createCategory(input, context.orgId);

      logger.info(`[Catalog.categoryCreate] Category created: ${category.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_CATEGORY_CREATE, AUDIT_ENTITY_TYPE.CATALOG_CATEGORY, {
        entityId: category.id,
        status: 'success',
      });

      return { category };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to create category: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_CATEGORY_CREATE, AUDIT_ENTITY_TYPE.CATALOG_CATEGORY, {
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to create category.', { status: 500 });
    }
  });

/**
 * Update a category
 */
export const categoryUpdate = os
  .input(UpdateCategoryValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      const category = await updateCategory(input, context.orgId);

      logger.info(`[Catalog.categoryUpdate] Category updated: ${input.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_CATEGORY_UPDATE, AUDIT_ENTITY_TYPE.CATALOG_CATEGORY, {
        entityId: input.id,
        status: 'success',
      });

      return { category };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to update category: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_CATEGORY_UPDATE, AUDIT_ENTITY_TYPE.CATALOG_CATEGORY, {
        entityId: input.id,
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to update category.', { status: 500 });
    }
  });

/**
 * Delete a category
 */
export const categoryRemove = os
  .input(DeleteCategoryValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      await deleteCategory(input.id, context.orgId);

      logger.info(`[Catalog.categoryRemove] Category deleted: ${input.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_CATEGORY_DELETE, AUDIT_ENTITY_TYPE.CATALOG_CATEGORY, {
        entityId: input.id,
        status: 'success',
      });

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to delete category: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_CATEGORY_DELETE, AUDIT_ENTITY_TYPE.CATALOG_CATEGORY, {
        entityId: input.id,
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to delete category.', { status: 500 });
    }
  });

// =============================================================================
// IMAGE HANDLERS
// =============================================================================

/**
 * Add an image to a catalog item
 */
export const imageCreate = os
  .input(CreateCatalogImageValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      const image = await createCatalogImage(input);

      logger.info(`[Catalog.imageCreate] Image added: ${image.id} for item: ${input.catalogItemId}`);

      await audit(context, AUDIT_ACTION.CATALOG_IMAGE_UPLOAD, AUDIT_ENTITY_TYPE.CATALOG_IMAGE, {
        entityId: image.id,
        status: 'success',
      });

      return { image };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to add image: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_IMAGE_UPLOAD, AUDIT_ENTITY_TYPE.CATALOG_IMAGE, {
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to add image.', { status: 500 });
    }
  });

/**
 * Delete an image
 */
export const imageRemove = os
  .input(DeleteCatalogImageValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      await deleteCatalogImage(input.id);

      logger.info(`[Catalog.imageRemove] Image deleted: ${input.id}`);

      await audit(context, AUDIT_ACTION.CATALOG_IMAGE_DELETE, AUDIT_ENTITY_TYPE.CATALOG_IMAGE, {
        entityId: input.id,
        status: 'success',
      });

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to delete image: ${errorMessage}`);

      await audit(context, AUDIT_ACTION.CATALOG_IMAGE_DELETE, AUDIT_ENTITY_TYPE.CATALOG_IMAGE, {
        entityId: input.id,
        status: 'failure',
        error: errorMessage,
      });

      throw error instanceof ORPCError ? error : new ORPCError('Failed to delete image.', { status: 500 });
    }
  });
