import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getOrganizationPermission,
  getOrganizationPermissions,
  getOrganizationRole,
  getOrganizationRoles,
} from './ClerkRolesService';

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('ClerkRolesService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv, CLERK_SECRET_KEY: 'test_secret_key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getOrganizationPermissions', () => {
    it('should fetch permissions from Clerk API', async () => {
      const mockPermissions = [
        { id: 'perm-1', key: 'org:manage_members', name: 'Manage Members', description: 'Can manage members', type: 'user', created_at: 1234567890, updated_at: 1234567890 },
        { id: 'perm-2', key: 'org:view_members', name: 'View Members', description: 'Can view members', type: 'user', created_at: 1234567890, updated_at: 1234567890 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockPermissions, total_count: 2 }),
      });

      const result = await getOrganizationPermissions();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.clerk.com/v1/organization_permissions?limit=100',
        {
          headers: {
            'Authorization': 'Bearer test_secret_key',
            'Content-Type': 'application/json',
          },
        },
      );
      expect(result).toEqual(mockPermissions);
    });

    it('should throw error when CLERK_SECRET_KEY is not configured', async () => {
      process.env.CLERK_SECRET_KEY = '';

      await expect(getOrganizationPermissions()).rejects.toThrow('CLERK_SECRET_KEY is not configured');
    });

    it('should throw error when API returns non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      await expect(getOrganizationPermissions()).rejects.toThrow('Clerk API error: 401 - Unauthorized');
    });
  });

  describe('getOrganizationRoles', () => {
    it('should fetch roles from Clerk API', async () => {
      const mockRoles = [
        {
          id: 'role-1',
          key: 'org:admin',
          name: 'Admin',
          description: 'Full access',
          permissions: [],
          is_creator_eligible: true,
          created_at: 1234567890,
          updated_at: 1234567890,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockRoles, total_count: 1 }),
      });

      const result = await getOrganizationRoles();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.clerk.com/v1/organization_roles?limit=100',
        {
          headers: {
            'Authorization': 'Bearer test_secret_key',
            'Content-Type': 'application/json',
          },
        },
      );
      expect(result).toEqual(mockRoles);
    });

    it('should throw error when API returns 500', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      });

      await expect(getOrganizationRoles()).rejects.toThrow('Clerk API error: 500 - Internal Server Error');
    });
  });

  describe('getOrganizationRole', () => {
    it('should fetch a single role by ID', async () => {
      const mockRole = {
        id: 'role-123',
        key: 'org:custom_role',
        name: 'Custom Role',
        description: 'A custom role',
        permissions: [],
        is_creator_eligible: false,
        created_at: 1234567890,
        updated_at: 1234567890,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRole),
      });

      const result = await getOrganizationRole('role-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.clerk.com/v1/organization_roles/role-123',
        {
          headers: {
            'Authorization': 'Bearer test_secret_key',
            'Content-Type': 'application/json',
          },
        },
      );
      expect(result).toEqual(mockRole);
    });

    it('should throw error when role not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Role not found'),
      });

      await expect(getOrganizationRole('nonexistent')).rejects.toThrow('Clerk API error: 404 - Role not found');
    });
  });

  describe('getOrganizationPermission', () => {
    it('should fetch a single permission by ID', async () => {
      const mockPermission = {
        id: 'perm-123',
        key: 'org:custom_permission',
        name: 'Custom Permission',
        description: 'A custom permission',
        type: 'user' as const,
        created_at: 1234567890,
        updated_at: 1234567890,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPermission),
      });

      const result = await getOrganizationPermission('perm-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.clerk.com/v1/organization_permissions/perm-123',
        {
          headers: {
            'Authorization': 'Bearer test_secret_key',
            'Content-Type': 'application/json',
          },
        },
      );
      expect(result).toEqual(mockPermission);
    });

    it('should throw error when permission not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Permission not found'),
      });

      await expect(getOrganizationPermission('nonexistent')).rejects.toThrow('Clerk API error: 404 - Permission not found');
    });
  });
});
