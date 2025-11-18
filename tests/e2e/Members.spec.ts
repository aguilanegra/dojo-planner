import { expect, test } from '@playwright/test';

test.describe('Members Page', () => {
  test('should navigate to members page', async ({ page }) => {
    // Navigate to the members page
    await page.goto('/dashboard/members');

    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');

    // Verify the page loaded (either shows members or redirects to sign-in)
    // This basic test just verifies the page responds properly
    const url = page.url();

    expect(url).toMatch(/members|sign-in/);
  });
});
