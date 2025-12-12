'use client';

import type { RolesFilters } from './RolesFilterBar';
import { ArrowDownAZ, ArrowUpZA, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { UserCard } from '@/templates/UserCard';
import { RolesFilterBar } from './RolesFilterBar';

type User = {
  id: string;
  name: string;
  title: string;
  roles: string;
  status: 'Active' | 'Inactive' | 'Invitation sent';
  recentActivity: string;
  lastLoggedIn: string;
  avatar?: string;
};

type SortField = 'name' | 'title' | 'roles' | 'status' | 'recentActivity' | 'lastLoggedIn';
type SortDirection = 'asc' | 'desc';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Charlie Baptista',
    title: 'Account Owner',
    roles: 'Owner, Admin, ...',
    status: 'Active',
    recentActivity: 'May 1, 2025',
    lastLoggedIn: 'May 1, 2025',
  },
  {
    id: '2',
    name: 'Hanna Septimus',
    title: 'VP',
    roles: 'Admin, Coach',
    status: 'Active',
    recentActivity: 'April 30, 2025',
    lastLoggedIn: 'April 30, 2025',
  },
  {
    id: '3',
    name: 'Zain Dokidis',
    title: 'Fitness Instructor',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '4',
    name: 'Ryan Carder',
    title: 'No Gi Instructor',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '5',
    name: 'Abram Curtis',
    title: 'Kids Instructor',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 30, 2025',
    lastLoggedIn: 'April 30, 2025',
  },
  {
    id: '6',
    name: 'Nolan Donin',
    title: 'Instructor',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '7',
    name: 'Anika Rosser',
    title: 'Head Professor',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '8',
    name: 'Talan George',
    title: 'Instructor',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '9',
    name: 'Professor Ivan',
    title: 'Senior Coach',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 10, 2025',
    lastLoggedIn: 'April 10, 2025',
  },
  {
    id: '10',
    name: 'Jessica Smith',
    title: 'Admin Coach',
    roles: 'Admin, Coach',
    status: 'Active',
    recentActivity: 'April 8, 2025',
    lastLoggedIn: 'April 8, 2025',
  },
  {
    id: '11',
    name: 'Daniel Jackson',
    title: 'Coach',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 5, 2025',
    lastLoggedIn: 'April 5, 2025',
  },
  {
    id: '12',
    name: 'Abigail Martinez',
    title: 'Assistant Coach',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 3, 2025',
    lastLoggedIn: 'April 3, 2025',
  },
  {
    id: '13',
    name: 'Benjamin Taylor',
    title: 'Instructor',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 1, 2025',
    lastLoggedIn: 'April 1, 2025',
  },
];

const permissionTypes = [
  {
    id: 'owner',
    title: 'Owner',
    description: 'Can do anything any other user type can do, as well as manage Dojo Planner subscription, manage anyones user profile, add or delete data, upgrade or delete account, and more. You can only have one owner per Dojo Planner account.',
    members: ['Charlie Baptista'],
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Can do anything coaches can do, as well as add transactions, add or delete members, manage classes, assign teachers, add users, delete users, and more.',
    members: ['Professor Ivan', 'Jessica Smith'],
  },
  {
    id: 'coach',
    title: 'Coach',
    description: 'Can view member information, log attendance, and confirm teaching schedule and attendance.',
    members: ['Daniel Jackson', 'Abigail Martinez', 'Benjamin Taylor'],
  },
];

export function RolesPage() {
  const t = useTranslations('Roles');
  const [filters, setFilters] = useState<RolesFilters>({
    search: '',
    status: 'all',
    role: 'all',
  });
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const ROWS_PER_PAGE = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFiltersChange = (newFilters: RolesFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleRowClick = (_userId: string) => {
    // TODO: Navigate to user details page
  };

  const availableStatuses = useMemo(() => {
    const statuses = new Set(mockUsers.map(u => u.status));
    return Array.from(statuses);
  }, []);

  const availableRoles = useMemo(() => {
    const roles = new Set<string>();
    for (const user of mockUsers) {
      const userRoles = user.roles.split(',').map(r => r.trim().replace('...', ''));
      for (const role of userRoles) {
        if (role && role !== '') {
          roles.add(role);
        }
      }
    }
    return Array.from(roles);
  }, []);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = user.name.toLowerCase().includes(searchLower)
          || user.title.toLowerCase().includes(searchLower)
          || user.roles.toLowerCase().includes(searchLower);
        if (!matchesSearch) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && user.status !== filters.status) {
        return false;
      }

      // Role filter
      if (filters.role !== 'all' && !user.roles.includes(filters.role)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: string | undefined;
    let bValue: string | undefined;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'roles':
        aValue = a.roles.toLowerCase();
        bValue = b.roles.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'recentActivity':
        aValue = a.recentActivity;
        bValue = b.recentActivity;
        break;
      case 'lastLoggedIn':
        aValue = a.lastLoggedIn;
        bValue = b.lastLoggedIn;
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (aValue && bValue) {
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE);
  const totalEntries = sortedUsers.length;

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Invitation sent':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">{t('total_users_label')}</div>
          <div className="mt-2 text-3xl font-bold text-foreground">{mockUsers.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">{t('total_admins_label')}</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {mockUsers.filter(u => u.roles.includes('Admin')).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">{t('total_coaches_label')}</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {mockUsers.filter(u => u.roles.includes('Coach')).length}
          </div>
        </Card>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Filter Bar and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <RolesFilterBar
            onFiltersChangeAction={handleFiltersChange}
            availableStatuses={availableStatuses}
            availableRoles={availableRoles}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('add_role_button')}
        </Button>
      </div>

      {/* Users Table - Desktop View */}
      <div className="hidden rounded-lg border border-border bg-background lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('user_name_column')}
                    {sortField === 'name' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('title')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('user_title_column')}
                    {sortField === 'title' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('roles')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('roles_column')}
                    {sortField === 'roles' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('status')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('status_column')}
                    {sortField === 'status' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('recentActivity')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('recent_activity_column')}
                    {sortField === 'recentActivity' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('lastLoggedIn')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('last_logged_in_column')}
                    {sortField === 'lastLoggedIn' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user.id)}
                  className="cursor-pointer border-b border-border hover:bg-secondary/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{user.title}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{user.roles}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{user.recentActivity}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{user.lastLoggedIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Cards - Mobile View */}
      <div className="space-y-4 lg:hidden">
        {paginatedUsers.map(user => (
          <UserCard
            key={user.id}
            id={user.id}
            name={user.name}
            title={user.title}
            roles={user.roles}
            status={user.status}
            recentActivity={user.recentActivity}
            lastLoggedIn={user.lastLoggedIn}
            avatar={user.avatar}
            onClick={handleRowClick}
            labels={{
              roles: t('roles_column'),
              status: t('status_column'),
              recentActivity: t('recent_activity_column'),
              lastLoggedIn: t('last_logged_in_column'),
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {sortedUsers.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalEntries / ROWS_PER_PAGE)}
            totalItems={totalEntries}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChangeAction={setCurrentPage}
          />
        </div>
      )}

      {/* Permission Types Section */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-foreground">{t('permission_types_title')}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {permissionTypes.map(permType => (
            <Card key={permType.id} className="p-6">
              <h3 className="text-lg font-semibold text-foreground">{permType.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{permType.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {permType.members.map(member => (
                  <Avatar key={member} className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {member.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
