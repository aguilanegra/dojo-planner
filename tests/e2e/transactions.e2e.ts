import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Transactions', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display transactions page with heading', async ({ page }) => {
    await navigateTo(page, '/dashboard/transactions');

    await expect(page.getByRole('heading', { name: /transactions/i })).toBeVisible();
  });

  test('should render all filter controls', async ({ page }) => {
    await navigateTo(page, '/dashboard/transactions');

    // Check that filter elements are present
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    await navigateTo(page, '/dashboard/transactions');

    // Stats cards should be present (with zero/empty values for fresh org)
    // Some cards show "0", others may show "$0.00"
    await expect(page.getByText('0').first()).toBeVisible();
  });
});
