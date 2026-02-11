import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, signIn } from '../TestUtils';

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test.describe('Business Section', () => {
    test('should navigate to Performance dashboard', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Performance' }).click();

      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(page.getByRole('heading', { name: 'Performance' })).toBeVisible();
    });

    test('should navigate to Reports', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Reports' }).click();

      await expect(page).toHaveURL(/\/dashboard\/reports/);
      await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
    });

    test('should navigate to Transactions', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Transactions' }).click();

      await expect(page).toHaveURL(/\/dashboard\/transactions/);
    });

    test('should navigate to Marketing', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Marketing' }).click();

      await expect(page).toHaveURL(/\/dashboard\/marketing/);
      await expect(page.getByRole('heading', { name: 'Marketing' })).toBeVisible();
    });

    test('should navigate to Catalog', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Catalog' }).click();

      await expect(page).toHaveURL(/\/dashboard\/catalog/);
      await expect(page.getByRole('heading', { name: /product catalog/i })).toBeVisible();
    });
  });

  test.describe('Academy Section', () => {
    test('should navigate to Programs', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Programs' }).click();

      await expect(page).toHaveURL(/\/dashboard\/programs/);
      await expect(page.getByRole('heading', { name: /programs/i })).toBeVisible();
    });

    test('should navigate to Waivers', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Waivers' }).click();

      await expect(page).toHaveURL(/\/dashboard\/waivers/);
    });

    test('should navigate to Memberships', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Memberships', exact: true }).click();

      await expect(page).toHaveURL(/\/dashboard\/memberships/);
    });

    test('should navigate to Classes/Events', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: /classes/i }).click();

      await expect(page).toHaveURL(/\/dashboard\/classes/);
    });

    test('should navigate to Members', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Members', exact: true }).click();

      await expect(page).toHaveURL(/\/dashboard\/members/);
    });

    test('should navigate to Roles', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Roles' }).click();

      await expect(page).toHaveURL(/\/dashboard\/roles/);
    });

    test('should navigate to Staff', async ({ page }) => {
      const sidebar = page.locator('[data-sidebar="sidebar"]');
      await sidebar.getByRole('link', { name: 'Staff' }).click();

      await expect(page).toHaveURL(/\/dashboard\/staff/);
    });
  });
});
