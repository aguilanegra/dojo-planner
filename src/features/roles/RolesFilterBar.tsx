'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Input } from '@/components/ui/input/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';

export type RolesFilters = {
  search: string;
  status: string;
  role: string;
};

type RolesFilterBarProps = {
  onFiltersChangeAction: (filters: RolesFilters) => void;
  availableStatuses: string[];
  availableRoles: string[];
};

export function RolesFilterBar({
  onFiltersChangeAction,
  availableStatuses,
  availableRoles,
}: RolesFilterBarProps) {
  const t = useTranslations('Roles');
  const [filters, setFilters] = useState<RolesFilters>({
    search: '',
    status: 'all',
    role: 'all',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFiltersChangeAction(newFilters);
  };

  const handleStatusChange = (value: string) => {
    const newFilters = { ...filters, status: value };
    setFilters(newFilters);
    onFiltersChangeAction(newFilters);
  };

  const handleRoleChange = (value: string) => {
    const newFilters = { ...filters, role: value };
    setFilters(newFilters);
    onFiltersChangeAction(newFilters);
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'Active':
        return t('status_active');
      case 'Inactive':
        return t('status_inactive');
      case 'Invitation sent':
        return t('status_invitation_sent');
      default:
        return status;
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'Owner':
        return t('role_owner');
      case 'Admin':
        return t('role_admin');
      case 'Coach':
        return t('role_coach');
      default:
        return role;
    }
  };

  const statusOptions = [
    { value: 'all', label: t('all_statuses_filter') },
    ...availableStatuses.map(status => ({
      value: status,
      label: getStatusLabel(status),
    })),
  ];

  const roleOptions = [
    { value: 'all', label: t('all_roles_filter') },
    ...availableRoles.map(role => ({
      value: role,
      label: getRoleLabel(role),
    })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 sm:max-w-xs sm:flex-initial">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('search_placeholder')}
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder={t('all_statuses_filter')} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Role Filter */}
      <Select value={filters.role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder={t('all_roles_filter')} />
        </SelectTrigger>
        <SelectContent>
          {roleOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
