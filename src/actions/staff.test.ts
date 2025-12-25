import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchStaffRoles, inviteStaffMember, updateStaffMember } from './staff';

// Mock Clerk auth
const mockAuth = vi.fn();
const mockCreateInvitation = vi.fn();
const mockUpdateMembership = vi.fn();
const mockUpdateUser = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
  clerkClient: () => Promise.resolve({
    organizations: {
      createOrganizationInvitation: mockCreateInvitation,
      updateOrganizationMembership: mockUpdateMembership,
    },
    users: {
      updateUser: mockUpdateUser,
    },
  }),
}));

// Mock ClerkRolesService
const mockGetOrganizationRoles = vi.fn();
vi.mock('@/services/ClerkRolesService', () => ({
  getOrganizationRoles: () => mockGetOrganizationRoles(),
}));

describe('Staff Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchStaffRoles', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null, orgId: null, orgRole: null });

      const result = await fetchStaffRoles();

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not authenticated or not part of an organization');
    });

    it('should return error when user is not part of an organization', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: null, orgRole: null });

      const result = await fetchStaffRoles();

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not authenticated or not part of an organization');
    });

    it('should fetch and filter roles for admin users', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
        orgRole: 'org:admin',
      });

      mockGetOrganizationRoles.mockResolvedValue([
        { id: 'role_1', key: 'org:admin', name: 'Admin', description: 'Full access' },
        { id: 'role_2', key: 'org:instructor', name: 'Instructor', description: 'Teaching access' },
        { id: 'role_3', key: 'org:individual_member', name: 'Individual Member', description: 'Member' },
      ]);

      const result = await fetchStaffRoles();

      expect(result.success).toBe(true);
      expect(result.roles).toHaveLength(2); // individual_member is filtered out
      expect(result.roles?.find(r => r.key === 'org:admin')).toBeTruthy();
      expect(result.roles?.find(r => r.key === 'org:instructor')).toBeTruthy();
      expect(result.roles?.find(r => r.key === 'org:individual_member')).toBeFalsy();
    });

    it('should filter out admin role for non-admin users', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
        orgRole: 'org:instructor',
      });

      mockGetOrganizationRoles.mockResolvedValue([
        { id: 'role_1', key: 'org:admin', name: 'Admin', description: 'Full access' },
        { id: 'role_2', key: 'org:instructor', name: 'Instructor', description: 'Teaching access' },
        { id: 'role_3', key: 'org:front_desk', name: 'Front Desk', description: 'Reception' },
      ]);

      const result = await fetchStaffRoles();

      expect(result.success).toBe(true);
      expect(result.roles).toHaveLength(2); // admin is filtered out
      expect(result.roles?.find(r => r.key === 'org:admin')).toBeFalsy();
      expect(result.roles?.find(r => r.key === 'org:instructor')).toBeTruthy();
      expect(result.roles?.find(r => r.key === 'org:front_desk')).toBeTruthy();
    });

    it('should return error when getOrganizationRoles fails', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
        orgRole: 'org:admin',
      });

      mockGetOrganizationRoles.mockRejectedValue(new Error('API Error'));

      const result = await fetchStaffRoles();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch roles. Please try again.');
    });

    it('should map roles to the correct format', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
        orgRole: 'org:admin',
      });

      mockGetOrganizationRoles.mockResolvedValue([
        {
          id: 'role_1',
          key: 'org:instructor',
          name: 'Instructor',
          description: 'Teaching access',
          permissions: [{ id: 'perm_1', key: 'org:manage_classes' }],
          is_creator_eligible: false,
        },
      ]);

      const result = await fetchStaffRoles();

      expect(result.success).toBe(true);
      expect(result.roles).toHaveLength(1);
      expect(result.roles?.[0]).toEqual({
        id: 'role_1',
        key: 'org:instructor',
        name: 'Instructor',
        description: 'Teaching access',
      });
    });
  });

  describe('inviteStaffMember', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null, orgId: null });

      const result = await inviteStaffMember({
        emailAddress: 'test@example.com',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not authenticated or not part of an organization');
    });

    it('should return error when user is not part of an organization', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: null });

      const result = await inviteStaffMember({
        emailAddress: 'test@example.com',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not authenticated or not part of an organization');
    });

    it('should call createOrganizationInvitation with correct parameters', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
      });

      mockCreateInvitation.mockResolvedValue({
        id: 'inv_123',
      });

      const result = await inviteStaffMember({
        emailAddress: 'test@example.com',
        roleKey: 'org:admin',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-123-4567',
      });

      expect(result.success).toBe(true);
      expect(result.invitationId).toBe('inv_123');
      expect(mockCreateInvitation).toHaveBeenCalledWith({
        organizationId: 'org_123',
        inviterUserId: 'user_123',
        emailAddress: 'test@example.com',
        role: 'org:admin',
        publicMetadata: {
          invitedFirstName: 'John',
          invitedLastName: 'Doe',
          invitedPhone: '555-123-4567',
        },
      });
    });

    it('should return error when invitation fails', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
      });

      mockCreateInvitation.mockRejectedValue(new Error('Invitation failed'));

      const result = await inviteStaffMember({
        emailAddress: 'test@example.com',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to send invitation. Please try again.');
    });

    it('should handle already a member error', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
      });

      mockCreateInvitation.mockRejectedValue(new Error('already a member'));

      const result = await inviteStaffMember({
        emailAddress: 'test@example.com',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('This email address is already a member of this organization.');
    });

    it('should handle already invited error', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
      });

      mockCreateInvitation.mockRejectedValue(new Error('already invited'));

      const result = await inviteStaffMember({
        emailAddress: 'test@example.com',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('An invitation has already been sent to this email address.');
    });
  });

  describe('updateStaffMember', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null, orgId: null });

      const result = await updateStaffMember({
        userId: 'user_456',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not authenticated or not part of an organization');
    });

    it('should return error when user is not part of an organization', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: null });

      const result = await updateStaffMember({
        userId: 'user_456',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not authenticated or not part of an organization');
    });

    it('should update membership and user profile successfully', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
      });

      mockUpdateMembership.mockResolvedValue({});
      mockUpdateUser.mockResolvedValue({});

      const result = await updateStaffMember({
        userId: 'user_456',
        roleKey: 'org:instructor',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-123-4567',
      });

      expect(result.success).toBe(true);
      expect(mockUpdateMembership).toHaveBeenCalledWith({
        organizationId: 'org_123',
        userId: 'user_456',
        role: 'org:instructor',
      });
      expect(mockUpdateUser).toHaveBeenCalledWith('user_456', {
        firstName: 'John',
        lastName: 'Doe',
        publicMetadata: {
          phone: '555-123-4567',
        },
      });
    });

    it('should return error when update fails', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
      });

      mockUpdateMembership.mockRejectedValue(new Error('Update failed'));

      const result = await updateStaffMember({
        userId: 'user_456',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to update staff member. Please try again.');
    });

    it('should handle not found error', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
      });

      mockUpdateMembership.mockRejectedValue(new Error('not found'));

      const result = await updateStaffMember({
        userId: 'user_456',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Staff member not found.');
    });

    it('should handle permission error', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user_123',
        orgId: 'org_123',
      });

      mockUpdateMembership.mockRejectedValue(new Error('permission denied'));

      const result = await updateStaffMember({
        userId: 'user_456',
        roleKey: 'org:admin',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('You do not have permission to update this staff member.');
    });
  });
});
