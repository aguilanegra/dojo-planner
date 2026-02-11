import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Memberships Management', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display memberships page with heading', async ({ page }) => {
    await navigateTo(page, '/dashboard/memberships');

    await expect(page.getByRole('heading', { name: /memberships/i })).toBeVisible();
  });

  test('should open add membership wizard and show basics step', async ({ page }) => {
    await navigateTo(page, '/dashboard/memberships');

    await page.getByRole('button', { name: /add new membership/i }).click();

    // Dialog has two h2 elements with "Membership Basics" — use placeholder to find input
    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();
    await expect(dialog.getByPlaceholder(/12 Month Commitment/i)).toBeVisible();
  });

  test('should require name when creating membership', async ({ page }) => {
    await navigateTo(page, '/dashboard/memberships');

    await page.getByRole('button', { name: /add new membership/i }).click();

    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();

    // Leave name empty, try to proceed — label has no htmlFor, use placeholder
    await dialog.getByPlaceholder(/12 Month Commitment/i).focus();
    await dialog.getByPlaceholder(/12 Month Commitment/i).blur();

    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  });

  test('should search memberships', async ({ page }) => {
    await navigateTo(page, '/dashboard/memberships');

    await page.getByPlaceholder(/search memberships/i).fill('Monthly');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /memberships/i })).toBeVisible();
  });
});
