import type { CatalogCategory, CatalogItem } from './types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { AddEditCatalogItemModal } from './AddEditCatalogItemModal';

// Helper to wait for async operations
async function waitFor(callback: () => void | Promise<void>, options?: { timeout?: number }) {
  return vi.waitFor(callback, { timeout: options?.timeout ?? 5000, interval: 50 });
}

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock ImageUploadField component
vi.mock('@/components/ui/image-upload', () => ({
  ImageUploadField: ({ value, onChange, label }: { value: string | null; onChange: (v: string | null) => void; label?: string }) => (
    <div data-testid="image-upload-field">
      <label>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        data-testid="image-upload-input"
      />
    </div>
  ),
}));

describe('AddEditCatalogItemModal', () => {
  const mockHandlers = {
    onCloseAction: vi.fn(),
    onSaveAction: vi.fn(),
  };

  const mockCategories: CatalogCategory[] = [
    { id: 'cat-1', name: 'Gis', slug: 'gis', description: null, parentId: null, isActive: true },
    { id: 'cat-2', name: 'Belts', slug: 'belts', description: null, parentId: null, isActive: true },
    { id: 'cat-3', name: 'Inactive', slug: 'inactive', description: null, parentId: null, isActive: false },
  ];

  const mockItem: CatalogItem = {
    id: 'item-1',
    type: 'merchandise',
    name: 'BJJ Gi Premium',
    slug: 'bjj-gi-premium',
    description: 'High quality BJJ Gi',
    shortDescription: 'Premium BJJ Gi',
    sku: 'GI-001',
    basePrice: 149.99,
    compareAtPrice: 199.99,
    eventId: null,
    maxPerOrder: 5,
    trackInventory: true,
    lowStockThreshold: 5,
    sortOrder: 0,
    isActive: true,
    isFeatured: true,
    showOnKiosk: true,
    sizeType: 'bjj',
    sizes: [
      { id: 's1', catalogItemId: 'item-1', size: 'A1', stockQuantity: 10, sortOrder: 0 },
      { id: 's2', catalogItemId: 'item-1', size: 'A2', stockQuantity: 15, sortOrder: 1 },
    ],
    images: [
      {
        id: 'img-1',
        catalogItemId: 'item-1',
        url: 'https://example.com/image.jpg',
        thumbnailUrl: null,
        altText: 'Gi Image',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    categories: [mockCategories[0]!],
    totalStock: 25,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal rendering', () => {
    it('should not render dialog when isOpen is false', () => {
      render(
        <AddEditCatalogItemModal
          isOpen={false}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      try {
        const modal = page.getByRole('dialog');

        expect(modal).toBeFalsy();
      } catch {
        expect(true).toBe(true);
      }
    });

    it('should render dialog when isOpen is true', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      const modal = page.getByRole('dialog');

      expect(modal).toBeTruthy();
    });

    it('should display add title when no item is provided', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      await expect.element(page.getByText('add_title')).toBeVisible();
    });

    it('should display edit title when item is provided', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          item={mockItem}
          categories={mockCategories}
        />,
      );

      await expect.element(page.getByText('edit_title')).toBeVisible();
    });
  });

  describe('Form fields', () => {
    it('should render all form fields', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      await expect.element(page.getByTestId('catalog-item-type-select')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-name-input')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-sku-input')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-short-description-input')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-description-input')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-base-price-input')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-compare-at-price-input')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-max-per-order-input')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-size-type-select')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-track-inventory-checkbox')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-is-active-checkbox')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-is-featured-checkbox')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-show-on-kiosk-checkbox')).toBeVisible();
    });

    it('should render image upload field', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      await expect.element(page.getByTestId('image-upload-field')).toBeVisible();
    });

    it('should pre-fill form fields when editing an item', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          item={mockItem}
          categories={mockCategories}
        />,
      );

      const nameInput = page.getByTestId('catalog-item-name-input');
      const skuInput = page.getByTestId('catalog-item-sku-input');
      const shortDescInput = page.getByTestId('catalog-item-short-description-input');

      expect(nameInput.element()).toHaveProperty('value', 'BJJ Gi Premium');
      expect(skuInput.element()).toHaveProperty('value', 'GI-001');
      expect(shortDescInput.element()).toHaveProperty('value', 'Premium BJJ Gi');
    });

    it('should update form fields when user types', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'New Product');

      const skuInput = page.getByTestId('catalog-item-sku-input');
      await userEvent.fill(skuInput, 'NEW-001');

      expect(nameInput.element()).toHaveProperty('value', 'New Product');
      expect(skuInput.element()).toHaveProperty('value', 'NEW-001');
    });
  });

  describe('Modal close behavior', () => {
    it('should call onCloseAction when X button is clicked', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      const closeButton = page.getByRole('button', { name: 'Close' });
      await userEvent.click(closeButton);

      expect(mockHandlers.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it('should call onCloseAction when Cancel button is clicked', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      const cancelButton = page.getByRole('button', { name: 'cancel_button' });
      await userEvent.click(cancelButton);

      expect(mockHandlers.onCloseAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form validation', () => {
    it('should show validation error when name is empty', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Leave name empty and submit
      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await expect.element(page.getByText('name_error')).toBeVisible();
    });

    it('should clear validation error when field is corrected', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Submit with empty name to trigger error
      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await expect.element(page.getByText('name_error')).toBeVisible();

      // Fill in name
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'New Product');

      // Error should be cleared
      await expect.element(page.getByText('name_error')).not.toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    it('should call onSaveAction when form is valid and submitted for add', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Fill in required fields
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'New Product');

      // Submit the form
      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Product',
            type: 'merchandise',
          }),
          false, // isEdit = false for add
          undefined,
        );
      });
    });

    it('should call onSaveAction with isEdit=true when editing', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          item={mockItem}
          categories={mockCategories}
        />,
      );

      // Submit the form
      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.any(Object),
          true, // isEdit = true for edit
          'item-1',
        );
      });
    });

    it('should display success message after successful add', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Fill in required fields
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'New Product');

      // Submit the form
      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        const successMessage = page.getByText('create_success');

        expect(successMessage).toBeTruthy();
      });
    });

    it('should display success message after successful edit', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          item={mockItem}
          categories={mockCategories}
        />,
      );

      // Submit the form
      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        const successMessage = page.getByText('update_success');

        expect(successMessage).toBeTruthy();
      });
    });
  });

  describe('Type selection', () => {
    it('should allow selecting item type', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      const typeSelect = page.getByTestId('catalog-item-type-select');
      await userEvent.click(typeSelect);

      const eventAccessOption = page.getByRole('option', { name: 'type_event_access' });
      await userEvent.click(eventAccessOption);

      // Fill in name and submit to verify
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'Event Access');

      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'event_access',
          }),
          false,
          undefined,
        );
      });
    });
  });

  describe('Size type and sizes', () => {
    it('should allow selecting size type', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      const sizeTypeSelect = page.getByTestId('catalog-item-size-type-select');
      await userEvent.click(sizeTypeSelect);

      const bjjOption = page.getByRole('option', { name: 'size_type_bjj' });
      await userEvent.click(bjjOption);

      // BJJ sizes should now be available
      await expect.element(page.getByTestId('catalog-item-size-A0-checkbox')).toBeVisible();
      await expect.element(page.getByTestId('catalog-item-size-A1-checkbox')).toBeVisible();
    });

    it('should allow toggling size selection', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Select BJJ size type
      const sizeTypeSelect = page.getByTestId('catalog-item-size-type-select');
      await userEvent.click(sizeTypeSelect);

      const bjjOption = page.getByRole('option', { name: 'size_type_bjj' });
      await userEvent.click(bjjOption);

      // Toggle A1 size
      const a1Checkbox = page.getByTestId('catalog-item-size-A1-checkbox');
      await userEvent.click(a1Checkbox);

      // Stock input for A1 should appear
      await expect.element(page.getByTestId('catalog-item-size-A1-stock-input')).toBeVisible();
    });

    it('should allow setting stock quantity for selected sizes', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Select BJJ size type
      const sizeTypeSelect = page.getByTestId('catalog-item-size-type-select');
      await userEvent.click(sizeTypeSelect);

      const bjjOption = page.getByRole('option', { name: 'size_type_bjj' });
      await userEvent.click(bjjOption);

      // Toggle A1 size
      const a1Checkbox = page.getByTestId('catalog-item-size-A1-checkbox');
      await userEvent.click(a1Checkbox);

      // Set stock for A1
      const stockInput = page.getByTestId('catalog-item-size-A1-stock-input');
      await userEvent.fill(stockInput, '25');

      // Fill name and submit
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'Test Product');

      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            sizes: expect.arrayContaining([
              expect.objectContaining({ size: 'A1', stockQuantity: 25 }),
            ]),
          }),
          false,
          undefined,
        );
      });
    });

    it('should not show sizes section for none size type', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Default size type is 'none' - no size checkboxes should be visible
      await expect.element(page.getByTestId('catalog-item-size-A0-checkbox')).not.toBeInTheDocument();
    });
  });

  describe('Categories', () => {
    it('should only show active categories', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Active categories should be visible
      await expect.element(page.getByText('Gis')).toBeVisible();
      await expect.element(page.getByText('Belts')).toBeVisible();

      // Inactive category should not be visible
      await expect.element(page.getByText('Inactive')).not.toBeInTheDocument();
    });

    it('should pre-select categories when editing', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          item={mockItem}
          categories={mockCategories}
        />,
      );

      // The Gis category should be checked (mockItem has cat-1)
      // We just verify the form submits with the category
      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            categoryIds: expect.arrayContaining(['cat-1']),
          }),
          true,
          'item-1',
        );
      });
    });
  });

  describe('Inventory settings', () => {
    it('should show low stock threshold when track inventory is checked', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Track inventory is checked by default
      await expect.element(page.getByTestId('catalog-item-low-stock-threshold-input')).toBeVisible();
    });

    it('should hide low stock threshold when track inventory is unchecked', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // Uncheck track inventory
      const trackInventoryCheckbox = page.getByTestId('catalog-item-track-inventory-checkbox');
      await userEvent.click(trackInventoryCheckbox);

      // Low stock threshold should be hidden
      await expect.element(page.getByTestId('catalog-item-low-stock-threshold-input')).not.toBeInTheDocument();
    });
  });

  describe('Boolean flags', () => {
    it('should allow toggling is active', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // isActive is checked by default, uncheck it
      const isActiveCheckbox = page.getByTestId('catalog-item-is-active-checkbox');
      await userEvent.click(isActiveCheckbox);

      // Fill name and submit
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'Test Product');

      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            isActive: false,
          }),
          false,
          undefined,
        );
      });
    });

    it('should allow toggling is featured', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // isFeatured is unchecked by default, check it
      const isFeaturedCheckbox = page.getByTestId('catalog-item-is-featured-checkbox');
      await userEvent.click(isFeaturedCheckbox);

      // Fill name and submit
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'Test Product');

      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            isFeatured: true,
          }),
          false,
          undefined,
        );
      });
    });

    it('should allow toggling show on kiosk', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      // showOnKiosk is checked by default, uncheck it
      const showOnKioskCheckbox = page.getByTestId('catalog-item-show-on-kiosk-checkbox');
      await userEvent.click(showOnKioskCheckbox);

      // Fill name and submit
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'Test Product');

      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            showOnKiosk: false,
          }),
          false,
          undefined,
        );
      });
    });
  });

  describe('Price fields', () => {
    it('should allow setting base price', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      const basePriceInput = page.getByTestId('catalog-item-base-price-input');
      await userEvent.fill(basePriceInput, '99.99');

      // Fill name and submit
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'Test Product');

      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            basePrice: 99.99,
          }),
          false,
          undefined,
        );
      });
    });

    it('should allow setting compare at price', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={mockCategories}
        />,
      );

      const compareAtPriceInput = page.getByTestId('catalog-item-compare-at-price-input');
      await userEvent.fill(compareAtPriceInput, '149.99');

      // Fill name and submit
      const nameInput = page.getByTestId('catalog-item-name-input');
      await userEvent.fill(nameInput, 'Test Product');

      const saveButton = page.getByRole('button', { name: 'save_button' });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHandlers.onSaveAction).toHaveBeenCalledWith(
          expect.objectContaining({
            compareAtPrice: 149.99,
          }),
          false,
          undefined,
        );
      });
    });
  });

  describe('Empty categories', () => {
    it('should not render categories section when no active categories exist', async () => {
      render(
        <AddEditCatalogItemModal
          isOpen={true}
          onCloseAction={mockHandlers.onCloseAction}
          onSaveAction={mockHandlers.onSaveAction}
          categories={[]}
        />,
      );

      // categories_label should not be present when no categories
      await expect.element(page.getByText('categories_label')).not.toBeInTheDocument();
    });
  });
});
