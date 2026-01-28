export type CatalogItemType = 'merchandise' | 'event_access';
export type CatalogSizeType = 'bjj' | 'apparel' | 'none';
export type CatalogItemStatus = 'Active' | 'Inactive' | 'Out of Stock' | 'Low Stock';

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
};

export type CatalogItemImage = {
  id: string;
  catalogItemId: string;
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
};

export type CatalogItem = {
  id: string;
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
  sizes: CatalogSize[];
  images: CatalogItemImage[];
  categories: CatalogCategory[];
  totalStock: number;
};

export type SizeStock = {
  size: string;
  stockQuantity: number;
};

export type CatalogItemFormData = {
  type: CatalogItemType;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  basePrice: number;
  compareAtPrice: number | null;
  eventId: string | null;
  maxPerOrder: number;
  trackInventory: boolean;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  showOnKiosk: boolean;
  sizeType: CatalogSizeType;
  sizes: SizeStock[];
  categoryIds: string[];
  imageDataUrl: string | null;
};

export type CatalogFilters = {
  search: string;
  type: string;
  category: string;
  stock: string;
};

/**
 * Calculates the display status of a catalog item based on its properties
 */
export function getCatalogItemStatus(item: CatalogItem): CatalogItemStatus {
  if (!item.isActive) {
    return 'Inactive';
  }

  if (item.trackInventory) {
    if (item.totalStock === 0) {
      return 'Out of Stock';
    }
    if (item.totalStock <= item.lowStockThreshold) {
      return 'Low Stock';
    }
  }

  return 'Active';
}

/**
 * Gets the primary image for a catalog item
 */
export function getPrimaryImage(item: CatalogItem): CatalogItemImage | null {
  const primary = item.images.find(img => img.isPrimary);
  return primary || item.images[0] || null;
}

/**
 * Formats price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Get available sizes based on size type
 */
export function getAvailableSizes(sizeType: CatalogSizeType): readonly string[] {
  switch (sizeType) {
    case 'bjj':
      return BJJ_SIZES;
    case 'apparel':
      return APPAREL_SIZES;
    case 'none':
    default:
      return [];
  }
}
