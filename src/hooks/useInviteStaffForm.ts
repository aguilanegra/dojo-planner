'use client';

import { useState } from 'react';

export type StaffRole = 'admin' | 'instructor' | 'front-desk';

export type StaffPermissions = {
  canManageClassSchedules: boolean;
  canViewMemberInformation: boolean;
  canAccessBillingInformation: boolean;
  canGenerateReports: boolean;
  canModifyLocationSettings: boolean;
};

export type InviteStaffFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole | null;
  phone: string;
  permissions: StaffPermissions;
};

const defaultPermissions: StaffPermissions = {
  canManageClassSchedules: false,
  canViewMemberInformation: false,
  canAccessBillingInformation: false,
  canGenerateReports: false,
  canModifyLocationSettings: false,
};

const defaultFormData: InviteStaffFormData = {
  firstName: '',
  lastName: '',
  email: '',
  role: null,
  phone: '',
  permissions: defaultPermissions,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const useInviteStaffForm = () => {
  const [data, setData] = useState<InviteStaffFormData>(defaultFormData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = (updates: Partial<InviteStaffFormData>) => {
    setData(prev => ({ ...prev, ...updates }));
    setError(null);
  };

  const updatePermission = (key: keyof StaffPermissions, value: boolean) => {
    setData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: value,
      },
    }));
  };

  const reset = () => {
    setData(defaultFormData);
    setError(null);
    setIsLoading(false);
  };

  const clearError = () => {
    setError(null);
  };

  const isValid = () => {
    return (
      data.firstName.trim() !== ''
      && data.lastName.trim() !== ''
      && isValidEmail(data.email)
      && data.role !== null
      && data.phone.trim() !== ''
    );
  };

  return {
    data,
    updateData,
    updatePermission,
    reset,
    error,
    setError,
    clearError,
    isLoading,
    setIsLoading,
    isValid,
  };
};
