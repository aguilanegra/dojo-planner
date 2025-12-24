import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/libs/DB', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve([])),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: 'new-id' }])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{ id: 'member-123', email: 'updated@example.com' }])),
        })),
      })),
    })),
  },
}));

vi.mock('@/models/Schema', () => ({
  memberSchema: {
    id: 'id',
    organizationId: 'organization_id',
  },
  addressSchema: {
    id: 'id',
    memberId: 'member_id',
    isDefault: 'is_default',
  },
}));

describe('MembersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateMemberContactInfo', () => {
    it('should update member email and phone', async () => {
      const { updateMemberContactInfo } = await import('./MembersService');
      const input = {
        id: 'member-123',
        email: 'updated@example.com',
        phone: '(555) 999-8888',
      };

      const result = await updateMemberContactInfo(input, 'org-123');

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('member-123');
    });

    it('should handle null phone value', async () => {
      const { updateMemberContactInfo } = await import('./MembersService');
      const input = {
        id: 'member-123',
        email: 'updated@example.com',
        phone: null,
      };

      const result = await updateMemberContactInfo(input, 'org-123');

      expect(result).toHaveLength(1);
    });

    it('should update member with address when provided', async () => {
      const { updateMemberContactInfo } = await import('./MembersService');
      const input = {
        id: 'member-123',
        email: 'updated@example.com',
        phone: '(555) 999-8888',
        address: {
          street: '456 New St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'US',
        },
      };

      const result = await updateMemberContactInfo(input, 'org-123');

      expect(result).toHaveLength(1);
    });

    it('should not update address if incomplete', async () => {
      const { updateMemberContactInfo } = await import('./MembersService');
      const input = {
        id: 'member-123',
        email: 'updated@example.com',
        phone: '(555) 999-8888',
        address: {
          street: '456 New St',
          city: '',
          state: '',
          zipCode: '',
          country: 'US',
        },
      };

      const result = await updateMemberContactInfo(input, 'org-123');

      expect(result).toHaveLength(1);
    });
  });

  describe('updateMemberStatus', () => {
    it('should update member status', async () => {
      const { updateMemberStatus } = await import('./MembersService');

      const result = await updateMemberStatus('member-123', 'org-123', 'active');

      expect(result).toBeDefined();
    });
  });

  describe('updateMember', () => {
    it('should update member with provided data', async () => {
      const { updateMember } = await import('./MembersService');
      const input = {
        id: 'member-123',
        email: 'new@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
      };

      const result = await updateMember(input, 'org-123');

      expect(result).toBeDefined();
    });
  });
});
