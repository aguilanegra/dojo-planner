import type { InviteStaffFormData, StaffPermissions, StaffRole } from './useInviteStaffForm';
import { describe, expect, it } from 'vitest';

describe('useInviteStaffForm types and exports', () => {
  it('should export InviteStaffFormData type', () => {
    const testData: InviteStaffFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'admin',
      phone: '555-123-4567',
      permissions: {
        canManageClassSchedules: true,
        canViewMemberInformation: false,
        canAccessBillingInformation: false,
        canGenerateReports: false,
        canModifyLocationSettings: false,
      },
    };

    expect(testData.firstName).toBe('John');
    expect(testData.lastName).toBe('Doe');
    expect(testData.email).toBe('john@example.com');
  });

  it('should support all staff roles', () => {
    const roles: StaffRole[] = ['admin', 'instructor', 'front-desk'];

    expect(roles).toHaveLength(3);
    expect(roles[0]).toBe('admin');
    expect(roles[1]).toBe('instructor');
    expect(roles[2]).toBe('front-desk');
  });

  it('should have all expected permission fields', () => {
    const permissions: StaffPermissions = {
      canManageClassSchedules: true,
      canViewMemberInformation: true,
      canAccessBillingInformation: true,
      canGenerateReports: true,
      canModifyLocationSettings: true,
    };

    expect(permissions.canManageClassSchedules).toBe(true);
    expect(permissions.canViewMemberInformation).toBe(true);
    expect(permissions.canAccessBillingInformation).toBe(true);
    expect(permissions.canGenerateReports).toBe(true);
    expect(permissions.canModifyLocationSettings).toBe(true);
  });

  it('should allow null role', () => {
    const testData: InviteStaffFormData = {
      firstName: '',
      lastName: '',
      email: '',
      role: null,
      phone: '',
      permissions: {
        canManageClassSchedules: false,
        canViewMemberInformation: false,
        canAccessBillingInformation: false,
        canGenerateReports: false,
        canModifyLocationSettings: false,
      },
    };

    expect(testData.role).toBeNull();
  });

  it('should allow empty strings for text fields', () => {
    const testData: InviteStaffFormData = {
      firstName: '',
      lastName: '',
      email: '',
      role: null,
      phone: '',
      permissions: {
        canManageClassSchedules: false,
        canViewMemberInformation: false,
        canAccessBillingInformation: false,
        canGenerateReports: false,
        canModifyLocationSettings: false,
      },
    };

    expect(testData.firstName).toBe('');
    expect(testData.lastName).toBe('');
    expect(testData.email).toBe('');
    expect(testData.phone).toBe('');
  });

  it('should support admin role', () => {
    const role: StaffRole = 'admin';

    expect(role).toBe('admin');
  });

  it('should support instructor role', () => {
    const role: StaffRole = 'instructor';

    expect(role).toBe('instructor');
  });

  it('should support front-desk role', () => {
    const role: StaffRole = 'front-desk';

    expect(role).toBe('front-desk');
  });

  it('should allow all permissions to be false', () => {
    const permissions: StaffPermissions = {
      canManageClassSchedules: false,
      canViewMemberInformation: false,
      canAccessBillingInformation: false,
      canGenerateReports: false,
      canModifyLocationSettings: false,
    };

    expect(permissions.canManageClassSchedules).toBe(false);
    expect(permissions.canViewMemberInformation).toBe(false);
    expect(permissions.canAccessBillingInformation).toBe(false);
    expect(permissions.canGenerateReports).toBe(false);
    expect(permissions.canModifyLocationSettings).toBe(false);
  });

  it('should allow mixed permission values', () => {
    const permissions: StaffPermissions = {
      canManageClassSchedules: true,
      canViewMemberInformation: false,
      canAccessBillingInformation: true,
      canGenerateReports: false,
      canModifyLocationSettings: true,
    };

    expect(permissions.canManageClassSchedules).toBe(true);
    expect(permissions.canViewMemberInformation).toBe(false);
    expect(permissions.canAccessBillingInformation).toBe(true);
    expect(permissions.canGenerateReports).toBe(false);
    expect(permissions.canModifyLocationSettings).toBe(true);
  });

  it('should create a valid form data structure', () => {
    const formData: InviteStaffFormData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: 'instructor',
      phone: '(555) 987-6543',
      permissions: {
        canManageClassSchedules: true,
        canViewMemberInformation: true,
        canAccessBillingInformation: false,
        canGenerateReports: false,
        canModifyLocationSettings: false,
      },
    };

    expect(formData.firstName).toBe('Jane');
    expect(formData.lastName).toBe('Smith');
    expect(formData.email).toBe('jane.smith@example.com');
    expect(formData.role).toBe('instructor');
    expect(formData.phone).toBe('(555) 987-6543');
    expect(formData.permissions.canManageClassSchedules).toBe(true);
    expect(formData.permissions.canViewMemberInformation).toBe(true);
  });
});
