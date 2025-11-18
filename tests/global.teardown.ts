import { test as teardown } from '@playwright/test';

teardown('cleanup', async () => {
  // Global teardown after all tests
  // Individual tests handle their own data cleanup through fixtures
});
