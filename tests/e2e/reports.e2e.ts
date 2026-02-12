import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display reports page with title and subtitle', async ({ page }) => {
    await navigateTo(page, '/dashboard/reports');

    await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();

    await expect(page.getByText('Select a report to view detailed analytics and insights')).toBeVisible();
  });

  test('should display report cards', async ({ page }) => {
    await navigateTo(page, '/dashboard/reports');

    // Use data-testid for cards to avoid strict mode violations with duplicate text
    await expect(page.locator('[data-testid="report-card-accounts-autopay-suspended"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-card-expiring-credit-cards"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-card-amount-due"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-card-past-due"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-card-payments-last-30-days"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-card-payments-pending"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-card-failed-payments"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-card-income-per-student"]')).toBeVisible();
  });

  test('should show current values on report cards', async ({ page }) => {
    await navigateTo(page, '/dashboard/reports');

    // Currency reports show $0.00, count reports show 0
    const amountDueCard = page.locator('[data-testid="report-card-amount-due"]');

    await expect(amountDueCard).toBeVisible();

    await expect(amountDueCard.getByText(/\$[\d,.]+/)).toBeVisible();

    const autopayCard = page.locator('[data-testid="report-card-accounts-autopay-suspended"]');

    await expect(autopayCard).toBeVisible();

    await expect(autopayCard.getByText(/\d+/)).toBeVisible();
  });

  test('should navigate to report detail on card click', async ({ page }) => {
    await navigateTo(page, '/dashboard/reports');

    await page.locator('[data-testid="report-card-amount-due"]').click();

    await expect(page).toHaveURL(/report=amount-due/);

    await expect(page.getByRole('heading', { name: 'Amount Due' })).toBeVisible();

    await expect(page.getByText('Historical Data')).toBeVisible();

    await expect(page.getByText('Insights')).toBeVisible();
  });

  test('should display time period selector on report detail', async ({ page }) => {
    await navigateTo(page, '/dashboard/reports?report=amount-due');

    // Time period selector uses Shadcn Select with aria-label
    const periodSelect = page.getByLabel('Select time period');

    await expect(periodSelect).toBeVisible();

    // Verify default value is Monthly
    await expect(periodSelect).toContainText('Monthly');
  });

  test('should navigate back to reports grid', async ({ page }) => {
    await navigateTo(page, '/dashboard/reports?report=amount-due');

    await expect(page.getByRole('heading', { name: 'Amount Due' })).toBeVisible();

    // Click the back button using data-testid for reliability
    const backButton = page.locator('[data-testid="back-button"]');

    await expect(backButton).toBeVisible();

    await backButton.click();

    // Back button uses window.history.pushState (client-side state change),
    // so wait for the detail heading to disappear
    await expect(page.getByRole('heading', { name: 'Amount Due' })).not.toBeVisible({ timeout: 10000 });
  });

  test('should show current value beneath chart', async ({ page }) => {
    await navigateTo(page, '/dashboard/reports?report=amount-due');

    await expect(page.getByText('Current Value')).toBeVisible();
  });

  test('should handle deep link to specific report via URL', async ({ page }) => {
    await navigateTo(page, '/dashboard/reports?report=failed-payments');

    // Should directly show detail view, not grid
    await expect(page.getByRole('heading', { name: 'Failed Payments' })).toBeVisible();

    await expect(page.getByText('Historical Data')).toBeVisible();

    await expect(page.getByText('Insights')).toBeVisible();
  });
});
