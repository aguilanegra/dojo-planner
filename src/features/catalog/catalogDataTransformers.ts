import type { CatalogItem } from './types';
import type { CatalogItem as ApiCatalogItem } from '@/hooks/useCatalogCache';

/**
 * Transforms API catalog item data to UI format
 */
export function transformCatalogItemToUi(item: ApiCatalogItem): CatalogItem {
  return {
    id: item.id,
    type: item.type,
    name: item.name,
    slug: item.slug,
    description: item.description,
    shortDescription: item.shortDescription,
    sku: item.sku,
    basePrice: item.basePrice,
    compareAtPrice: item.compareAtPrice,
    eventId: item.eventId,
    maxPerOrder: item.maxPerOrder,
    trackInventory: item.trackInventory,
    lowStockThreshold: item.lowStockThreshold,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    isFeatured: item.isFeatured,
    showOnKiosk: item.showOnKiosk,
    variants: item.variants.map(v => ({
      id: v.id,
      catalogItemId: v.catalogItemId,
      name: v.name,
      price: v.price,
      stockQuantity: v.stockQuantity,
      sortOrder: v.sortOrder,
    })),
    images: item.images.map(img => ({
      id: img.id,
      catalogItemId: img.catalogItemId,
      url: img.url,
      thumbnailUrl: img.thumbnailUrl,
      altText: img.altText,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
    categories: item.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parentId: cat.parentId,
      isActive: cat.isActive,
    })),
    totalStock: item.totalStock,
  };
}

/**
 * Transforms array of API catalog items to UI format
 */
export function transformCatalogItemsToUi(items: ApiCatalogItem[]): CatalogItem[] {
  return items.map(transformCatalogItemToUi);
}
