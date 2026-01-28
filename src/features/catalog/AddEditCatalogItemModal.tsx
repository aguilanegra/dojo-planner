'use client';

import type { CatalogCategory, CatalogItem, CatalogItemFormData, CatalogItemType, CatalogSizeType } from './types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUploadField } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';
import { Textarea } from '@/components/ui/textarea';
import { getAvailableSizes, getPrimaryImage } from './types';

type AddEditCatalogItemModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  item?: CatalogItem | null;
  categories: CatalogCategory[];
  onSaveAction: (formData: CatalogItemFormData, isEdit: boolean, itemId?: string) => void;
};

function getInitialFormData(item?: CatalogItem | null): CatalogItemFormData {
  if (item) {
    const primaryImage = getPrimaryImage(item);
    return {
      type: item.type,
      name: item.name,
      description: item.description || '',
      shortDescription: item.shortDescription || '',
      sku: item.sku || '',
      basePrice: item.basePrice,
      compareAtPrice: item.compareAtPrice,
      eventId: item.eventId,
      maxPerOrder: item.maxPerOrder,
      trackInventory: item.trackInventory,
      lowStockThreshold: item.lowStockThreshold,
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      showOnKiosk: item.showOnKiosk,
      sizeType: item.sizeType,
      sizes: item.sizes.map(s => ({ size: s.size, stockQuantity: s.stockQuantity })),
      categoryIds: item.categories.map(c => c.id),
      // For existing items, keep the URL as-is (existing images won't be re-uploaded)
      imageDataUrl: primaryImage?.url || null,
    };
  }

  return {
    type: 'merchandise',
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    basePrice: 0,
    compareAtPrice: null,
    eventId: null,
    maxPerOrder: 10,
    trackInventory: true,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured: false,
    showOnKiosk: true,
    sizeType: 'none',
    sizes: [],
    categoryIds: [],
    imageDataUrl: null,
  };
}

type CatalogItemFormContentProps = {
  item?: CatalogItem | null;
  categories: CatalogCategory[];
  onCloseAction: () => void;
  onSaveAction: (formData: CatalogItemFormData, isEdit: boolean, itemId?: string) => void;
};

function CatalogItemFormContent({
  item,
  categories,
  onCloseAction,
  onSaveAction,
}: CatalogItemFormContentProps) {
  const t = useTranslations('AddEditCatalogItemModal');
  const [formData, setFormData] = useState<CatalogItemFormData>(() => getInitialFormData(item));
  const [errors, setErrors] = useState<Partial<Record<keyof CatalogItemFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEditMode = !!item?.id;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CatalogItemFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('name_error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      onSaveAction(formData, isEditMode, item?.id);
      setSuccessMessage(isEditMode ? t('update_success') : t('create_success'));

      setTimeout(() => {
        onCloseAction();
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = <K extends keyof CatalogItemFormData>(
    field: K,
    value: CatalogItemFormData[K],
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      const isSelected = prev.categoryIds.includes(categoryId);
      return {
        ...prev,
        categoryIds: isSelected
          ? prev.categoryIds.filter(id => id !== categoryId)
          : [...prev.categoryIds, categoryId],
      };
    });
  };

  const handleSizeTypeChange = (sizeType: CatalogSizeType) => {
    // When changing size type, preserve any sizes that exist in the new type
    const availableSizes = getAvailableSizes(sizeType);
    const preservedSizes = formData.sizes.filter(s => availableSizes.includes(s.size));
    setFormData(prev => ({
      ...prev,
      sizeType,
      sizes: preservedSizes,
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => {
      const existingSize = prev.sizes.find(s => s.size === size);
      if (existingSize) {
        // Remove the size
        return {
          ...prev,
          sizes: prev.sizes.filter(s => s.size !== size),
        };
      } else {
        // Add the size with default stock of 0
        return {
          ...prev,
          sizes: [...prev.sizes, { size, stockQuantity: 0 }],
        };
      }
    });
  };

  const handleSizeStockChange = (size: string, stockQuantity: number) => {
    setFormData((prev) => {
      const updatedSizes = prev.sizes.map(s =>
        s.size === size ? { ...s, stockQuantity } : s,
      );
      return { ...prev, sizes: updatedSizes };
    });
  };

  const isSizeSelected = (size: string) => formData.sizes.some(s => s.size === size);
  const getSizeStock = (size: string) => formData.sizes.find(s => s.size === size)?.stockQuantity ?? 0;

  const itemTypes: CatalogItemType[] = ['merchandise', 'event_access'];
  const sizeTypes: CatalogSizeType[] = ['none', 'bjj', 'apparel'];
  const activeCategories = categories.filter(c => c.isActive);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditMode ? t('edit_title') : t('add_title')}
        </DialogTitle>
      </DialogHeader>

      <div className="max-h-[60vh] overflow-y-auto py-4">
        {successMessage
          ? (
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
                <p className="text-sm text-green-900 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
            )
          : (
              <div className="space-y-4">
                {/* Item Type */}
                <div className="space-y-2">
                  <Label htmlFor="item-type">{t('type_label')}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={value => handleInputChange('type', value as CatalogItemType)}
                  >
                    <SelectTrigger id="item-type" data-testid="catalog-item-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'merchandise' ? t('type_merchandise') : t('type_event_access')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="item-name">{t('name_label')}</Label>
                  <Input
                    id="item-name"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder={t('name_placeholder')}
                    data-testid="catalog-item-name-input"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* SKU */}
                <div className="space-y-2">
                  <Label htmlFor="item-sku">{t('sku_label')}</Label>
                  <Input
                    id="item-sku"
                    value={formData.sku}
                    onChange={e => handleInputChange('sku', e.target.value)}
                    placeholder={t('sku_placeholder')}
                    data-testid="catalog-item-sku-input"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <Label htmlFor="item-short-description">{t('short_description_label')}</Label>
                  <Input
                    id="item-short-description"
                    value={formData.shortDescription}
                    onChange={e => handleInputChange('shortDescription', e.target.value)}
                    placeholder={t('short_description_placeholder')}
                    data-testid="catalog-item-short-description-input"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="item-description">{t('description_label')}</Label>
                  <Textarea
                    id="item-description"
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder={t('description_placeholder')}
                    rows={3}
                    data-testid="catalog-item-description-input"
                  />
                </div>

                {/* Product Image */}
                <ImageUploadField
                  value={formData.imageDataUrl}
                  onChange={value => handleInputChange('imageDataUrl', value)}
                  label={t('product_image_label')}
                  helpText={t('product_image_help')}
                  previewSize="lg"
                />

                {/* Price Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-base-price">{t('base_price_label')}</Label>
                    <Input
                      id="item-base-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={e => handleInputChange('basePrice', Number.parseFloat(e.target.value) || 0)}
                      data-testid="catalog-item-base-price-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item-compare-at-price">{t('compare_at_price_label')}</Label>
                    <Input
                      id="item-compare-at-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.compareAtPrice ?? ''}
                      onChange={e => handleInputChange(
                        'compareAtPrice',
                        e.target.value ? Number.parseFloat(e.target.value) : null,
                      )}
                      data-testid="catalog-item-compare-at-price-input"
                    />
                    <p className="text-xs text-muted-foreground">{t('compare_at_price_help')}</p>
                  </div>
                </div>

                {/* Max Per Order */}
                <div className="space-y-2">
                  <Label htmlFor="item-max-per-order">{t('max_per_order_label')}</Label>
                  <Input
                    id="item-max-per-order"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxPerOrder}
                    onChange={e => handleInputChange('maxPerOrder', Number.parseInt(e.target.value, 10) || 1)}
                    data-testid="catalog-item-max-per-order-input"
                  />
                </div>

                {/* Categories */}
                {activeCategories.length > 0 && (
                  <div className="space-y-2">
                    <Label>{t('categories_label')}</Label>
                    <div className="flex flex-wrap gap-2 rounded-md border p-3">
                      {activeCategories.map(category => (
                        <label
                          key={category.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted"
                        >
                          <Checkbox
                            checked={formData.categoryIds.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                          />
                          {category.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="item-size-type">{t('size_type_label')}</Label>
                  <Select
                    value={formData.sizeType}
                    onValueChange={value => handleSizeTypeChange(value as CatalogSizeType)}
                  >
                    <SelectTrigger id="item-size-type" data-testid="catalog-item-size-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeTypes.map(sizeType => (
                        <SelectItem key={sizeType} value={sizeType}>
                          {t(`size_type_${sizeType}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{t('size_type_help')}</p>
                </div>

                {/* Available Sizes Selection */}
                {formData.sizeType !== 'none' && (
                  <div className="space-y-2">
                    <Label>{t('available_sizes_label')}</Label>
                    <div className="flex flex-wrap gap-2 rounded-md border p-3">
                      {getAvailableSizes(formData.sizeType).map(size => (
                        <label
                          key={size}
                          className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                            isSizeSelected(size)
                              ? 'border-primary bg-primary/10 hover:bg-primary/20'
                              : 'bg-background hover:bg-muted'
                          }`}
                        >
                          <Checkbox
                            checked={isSizeSelected(size)}
                            onCheckedChange={() => handleSizeToggle(size)}
                            data-testid={`catalog-item-size-${size}-checkbox`}
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{t('available_sizes_help')}</p>
                  </div>
                )}

                {/* Stock Quantities for Selected Sizes */}
                {formData.sizeType !== 'none' && formData.sizes.length > 0 && (
                  <div className="space-y-3 rounded-md border p-3">
                    <Label>{t('sizes_stock_label')}</Label>
                    <div className="space-y-2">
                      {formData.sizes.map(sizeStock => (
                        <div key={sizeStock.size} className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium">{sizeStock.size}</span>
                          <Input
                            type="number"
                            min="0"
                            value={getSizeStock(sizeStock.size)}
                            onChange={e => handleSizeStockChange(sizeStock.size, Number.parseInt(e.target.value, 10) || 0)}
                            className="w-24"
                            data-testid={`catalog-item-size-${sizeStock.size}-stock-input`}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{t('sizes_stock_help')}</p>
                  </div>
                )}

                {/* Inventory Settings */}
                <div className="space-y-3 rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="item-track-inventory"
                      checked={formData.trackInventory}
                      onCheckedChange={checked => handleInputChange('trackInventory', !!checked)}
                      data-testid="catalog-item-track-inventory-checkbox"
                    />
                    <Label htmlFor="item-track-inventory" className="cursor-pointer font-medium">
                      {t('track_inventory_label')}
                    </Label>
                  </div>

                  {formData.trackInventory && (
                    <div className="space-y-2 pl-6">
                      <Label htmlFor="item-low-stock-threshold">{t('low_stock_threshold_label')}</Label>
                      <Input
                        id="item-low-stock-threshold"
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold}
                        onChange={e => handleInputChange('lowStockThreshold', Number.parseInt(e.target.value, 10) || 0)}
                        className="max-w-[150px]"
                        data-testid="catalog-item-low-stock-threshold-input"
                      />
                    </div>
                  )}
                </div>

                {/* Boolean Flags */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="item-is-active"
                      checked={formData.isActive}
                      onCheckedChange={checked => handleInputChange('isActive', !!checked)}
                      data-testid="catalog-item-is-active-checkbox"
                    />
                    <Label htmlFor="item-is-active" className="cursor-pointer">
                      {t('is_active_label')}
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="item-is-featured"
                      checked={formData.isFeatured}
                      onCheckedChange={checked => handleInputChange('isFeatured', !!checked)}
                      data-testid="catalog-item-is-featured-checkbox"
                    />
                    <Label htmlFor="item-is-featured" className="cursor-pointer">
                      {t('is_featured_label')}
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="item-show-on-kiosk"
                      checked={formData.showOnKiosk}
                      onCheckedChange={checked => handleInputChange('showOnKiosk', !!checked)}
                      data-testid="catalog-item-show-on-kiosk-checkbox"
                    />
                    <Label htmlFor="item-show-on-kiosk" className="cursor-pointer">
                      {t('show_on_kiosk_label')}
                    </Label>
                  </div>
                </div>
              </div>
            )}
      </div>

      {!successMessage && (
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCloseAction}
            disabled={isLoading}
          >
            {t('cancel_button')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? t('saving_button') : t('save_button')}
          </Button>
        </DialogFooter>
      )}
    </>
  );
}

export function AddEditCatalogItemModal({
  isOpen,
  onCloseAction,
  item,
  categories,
  onSaveAction,
}: AddEditCatalogItemModalProps) {
  const formKey = item?.id ?? 'new';

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onCloseAction()}>
      <DialogContent className="max-w-lg">
        {isOpen && (
          <CatalogItemFormContent
            key={formKey}
            item={item}
            categories={categories}
            onCloseAction={onCloseAction}
            onSaveAction={onSaveAction}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
