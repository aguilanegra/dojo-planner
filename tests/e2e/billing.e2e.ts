import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Billing', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display current plan section', async ({ page }) => {
    await navigateTo(page, '/dashboard/billing');

    // TitleBar renders title as <div>, not <h1>; "Billing" also appears in sidebar
    await expect(page.getByText('Manage your billing and subscription')).toBeVisible();
    await expect(page.getByText('Current Plan').first()).toBeVisible();
  });

  test('should display plan upgrade options', async ({ page }) => {
    await navigateTo(page, '/dashboard/billing');

    // Free plan users see upgrade options with "Get Started" links
    await expect(page.getByText('Get Started').first()).toBeVisible();
  });
});
