/**
 * Service for fetching organization roles and permissions from Clerk's Backend API.
 * The Clerk SDK doesn't yet have wrapper methods for these endpoints, so we use direct HTTP calls.
 *
 * API Reference: https://clerk.com/changelog/2025-11-24-organization-roles-and-permission-bapi-management
 */

// Types matching Clerk's API response structure
export type ClerkPermission = {
  id: string;
  key: string;
  name: string;
  description: string;
  type: 'system' | 'user';
  created_at: number;
  updated_at: number;
};

export type ClerkRole = {
  id: string;
  key: string;
  name: string;
  description: string;
  permissions: ClerkPermission[];
  is_creator_eligible: boolean;
  created_at: number;
  updated_at: number;
};

type ClerkPaginatedResponse<T> = {
  data: T[];
  total_count: number;
};

const CLERK_API_BASE_URL = 'https://api.clerk.com/v1';

/**
 * Makes an authenticated request to the Clerk Backend API
 */
async function clerkApiRequest<T>(endpoint: string): Promise<T> {
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY is not configured');
  }

  const response = await fetch(`${CLERK_API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Clerk API error: ${response.status} - ${errorText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches all organization permissions from Clerk
 */
export async function getOrganizationPermissions(): Promise<ClerkPermission[]> {
  const response = await clerkApiRequest<ClerkPaginatedResponse<ClerkPermission>>(
    '/organization_permissions?limit=100',
  );
  return response.data;
}

/**
 * Fetches all organization roles from Clerk
 */
export async function getOrganizationRoles(): Promise<ClerkRole[]> {
  const response = await clerkApiRequest<ClerkPaginatedResponse<ClerkRole>>(
    '/organization_roles?limit=100',
  );
  return response.data;
}

/**
 * Fetches a specific role by ID
 */
export async function getOrganizationRole(roleId: string): Promise<ClerkRole> {
  return clerkApiRequest<ClerkRole>(`/organization_roles/${roleId}`);
}

/**
 * Fetches a specific permission by ID
 */
export async function getOrganizationPermission(permissionId: string): Promise<ClerkPermission> {
  return clerkApiRequest<ClerkPermission>(`/organization_permissions/${permissionId}`);
}
