import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display catalog page with heading', async ({ page }) => {
    await navigateTo(page, '/dashboard/catalog');

    await expect(page.getByRole('heading', { name: /product catalog/i })).toBeVisible();

    // Stats cards should be visible
    await expect(page.getByText('Total Items')).toBeVisible();
  });

  test('should create a merchandise item', async ({ page }) => {
    await navigateTo(page, '/dashboard/catalog');

    await page.getByRole('button', { name: /add item/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();

    // Select type: Merchandise
    await page.locator('[data-testid="catalog-item-type-select"]').click();
    await page.getByRole('option', { name: /merchandise/i }).click();

    const itemName = `T-Shirt ${faker.string.alphanumeric(6)}`;
    await page.locator('[data-testid="catalog-item-name-input"]').fill(itemName);
    await page.locator('[data-testid="catalog-item-description-input"]').fill('Academy branded t-shirt');
    await page.locator('[data-testid="catalog-item-base-price-input"]').fill('29.99');

    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText(itemName)).toBeVisible();
  });

  test('should create a category', async ({ page }) => {
    await navigateTo(page, '/dashboard/catalog');

    await page.getByRole('button', { name: /manage categories/i }).click();

    // Categories open in a Sheet (side panel)
    await expect(page.getByRole('heading', { name: /manage categories/i })).toBeVisible();

    await page.getByRole('button', { name: /add category/i }).click();

    const categoryName = `Apparel ${faker.string.alphanumeric(4)}`;
    await page.getByPlaceholder(/category name/i).fill(categoryName);

    // Save button is an icon-only checkmark — find it by its position in the new row
    const newRow = page.locator('tr', { has: page.getByPlaceholder(/category name/i) });
    await newRow.getByRole('button').first().click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText(categoryName)).toBeVisible();
  });

  test('should search by product name', async ({ page }) => {
    await navigateTo(page, '/dashboard/catalog');

    await page.getByPlaceholder(/search products/i).fill('T-Shirt');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /product catalog/i })).toBeVisible();
  });

  test('should validate name when creating item', async ({ page }) => {
    await navigateTo(page, '/dashboard/catalog');

    await page.getByRole('button', { name: /add item/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();

    // Save button validates on click — not disabled beforehand
    // Click Save without filling name to trigger validation error
    await page.getByRole('button', { name: /save/i }).click();

    // Dialog should still be open (validation prevented save)
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
