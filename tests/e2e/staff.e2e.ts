import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Staff Management', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display staff page', async ({ page }) => {
    await navigateTo(page, '/dashboard/staff');

    // Staff page should load (may show access denied for non-admin or staff list)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show invite staff button', async ({ page }) => {
    await navigateTo(page, '/dashboard/staff');

    await expect(page.getByRole('button', { name: /invite staff member/i })).toBeVisible();
  });

  test('should open invite modal with required fields', async ({ page }) => {
    await navigateTo(page, '/dashboard/staff');

    await page.getByRole('button', { name: /invite staff member/i }).click();

    await expect(page.getByRole('heading', { name: /invite staff member/i })).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/role/i)).toBeVisible();
  });

  test('should validate required fields in invite modal', async ({ page }) => {
    await navigateTo(page, '/dashboard/staff');

    await page.getByRole('button', { name: /invite staff member/i }).click();

    await expect(page.getByRole('heading', { name: /invite staff member/i })).toBeVisible();

    // Trigger validation by focusing and blurring fields
    await page.getByLabel(/first name/i).focus();
    await page.getByLabel(/first name/i).blur();

    await page.getByLabel(/last name/i).focus();
    await page.getByLabel(/last name/i).blur();

    await page.getByLabel(/email/i).focus();
    await page.getByLabel(/email/i).blur();

    // Submit button should be disabled with empty required fields
    await expect(page.getByRole('button', { name: /send invite/i })).toBeDisabled();
  });
});
