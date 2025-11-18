import { clerkClient } from '@clerk/nextjs/server';
import { test as base, expect } from '@playwright/test';

type TestFixtures = {
  testUser: {
    userId: string;
    email: string;
    username: string;
  };
  testOrganization: {
    orgId: string;
    name: string;
  };
};

/**
 * Extended test fixture that provides test user and organization management
 * Automatically cleans up created resources after each test
 */
export const test = base.extend<TestFixtures>({
  testUser: async (_, use) => {
    const client = await clerkClient();

    // Create test user with +clerk_test email subaddress
    const testEmail = `test_${Date.now()}+clerk_test@example.com`;
    const testUsername = `test_user_${Date.now()}`;

    const user = await client.users.createUser({
      emailAddress: [testEmail],
      username: testUsername,
      password: `TestPassword123!${Date.now()}`,
    });

    const testUser = {
      userId: user.id,
      email: testEmail,
      username: testUsername,
    };

    // Provide the test user to the test
    await use(testUser);

    // Cleanup: Delete the user and all associated data after test
    try {
      // Delete all organizations the user is part of
      const membershipsResponse = await client.users.getOrganizationMembershipList({
        userId: user.id,
      });

      for (const membership of membershipsResponse.data) {
        try {
          await client.organizations.deleteOrganization(membership.organization.id);
        } catch (error) {
          console.warn(`Failed to delete organization ${membership.organization.id}:`, error);
        }
      }

      // Delete the user
      await client.users.deleteUser(user.id);
    } catch (error) {
      console.warn(`Failed to cleanup user ${user.id}:`, error);
    }
  },

  testOrganization: async ({ testUser }, use) => {
    const client = await clerkClient();

    // Create test organization
    const orgName = `Test Org ${Date.now()}`;

    const organization = await client.organizations.createOrganization({
      name: orgName,
      createdBy: testUser.userId,
    });

    const testOrganization = {
      orgId: organization.id,
      name: orgName,
    };

    // Provide the test organization to the test
    await use(testOrganization);

    // Cleanup: Delete the organization after test
    try {
      await client.organizations.deleteOrganization(organization.id);
    } catch (error) {
      console.warn(`Failed to delete organization ${organization.id}:`, error);
    }
  },
});

export { expect };
