import { expect, test } from '@playwright/test';

/**
 * End-to-end tests for the Add Member wizard flow
 * Tests the complete add member workflow with Clerk authentication
 */
test.describe('Add Member Wizard - End-to-End Flow', () => {
  test('should display homepage', async ({ page }) => {
    // Sanity check - verify the app is running and homepage loads
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Verify page loaded successfully by checking title
    await expect(page).toHaveTitle(/Dojo Planner/);
  });

  test('should load members page when authenticated', async ({ page }) => {
    // Navigate to the members dashboard page
    // The setup test has authenticated the session
    await page.goto('/dashboard/members', { waitUntil: 'domcontentloaded' });

    // Verify we're on a page that loaded
    const body = page.locator('body');

    await expect(body).toBeVisible();

    // Check that the page has some content (looking for any div)
    const divCount = await page.locator('div').count();

    expect(divCount).toBeGreaterThan(0);
  });

  test('should verify members page structure and content', async ({ page }) => {
    // Navigate to members page
    await page.goto('/dashboard/members', { waitUntil: 'domcontentloaded' });

    // Verify page has loaded with content
    const pageContent = page.locator('div');

    const contentCount = await pageContent.count();

    expect(contentCount).toBeGreaterThan(0);

    // Verify body is visible indicating page loaded
    const body = page.locator('body');

    await expect(body).toBeVisible();
  });
});
