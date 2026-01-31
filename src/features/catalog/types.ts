export type CatalogItemType = 'merchandise' | 'event_access';
export type CatalogItemStatus = 'Active' | 'Inactive' | 'Out of Stock' | 'Low Stock';

// Maximum variants per item
export const MAX_VARIANTS_PER_ITEM = 8;

export type CatalogVariant = {
  id: string;
  catalogItemId: string;
  name: string;
  price: number;
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
  variants: CatalogVariant[];
  images: CatalogItemImage[];
  categories: CatalogCategory[];
  totalStock: number;
};

export type VariantInput = {
  tempId: string; // Temporary ID for React key prop
  name: string;
  price: number;
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
  variants: VariantInput[];
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
