'use client';

import { ArrowDownAZ, ArrowUpZA, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination/Pagination';

type User = {
  id: string;
  name: string;
  title: string;
  permissions: string;
  status: 'Active' | 'Inactive' | 'Invitation sent';
  recentActivity: string;
  lastLoggedIn: string;
  avatar?: string;
};

type FilterType = 'all' | 'admins' | 'coaches' | 'others';
type SortField = 'name' | 'title' | 'permissions' | 'status' | 'recentActivity' | 'lastLoggedIn';
type SortDirection = 'asc' | 'desc';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Charlie Baptista',
    title: 'Account Owner',
    permissions: 'Owner, Admin, ...',
    status: 'Active',
    recentActivity: 'May 1, 2025',
    lastLoggedIn: 'May 1, 2025',
  },
  {
    id: '2',
    name: 'Hanna Septimus',
    title: 'VP',
    permissions: 'Admin, Coach',
    status: 'Active',
    recentActivity: 'April 30, 2025',
    lastLoggedIn: 'April 30, 2025',
  },
  {
    id: '3',
    name: 'Zain Dokidis',
    title: 'Fitness Instructor',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '4',
    name: 'Ryan Carder',
    title: 'No Gi Instructor',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '5',
    name: 'Abram Curtis',
    title: 'Kids Instructor',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 30, 2025',
    lastLoggedIn: 'April 30, 2025',
  },
  {
    id: '6',
    name: 'Nolan Donin',
    title: 'Instructor',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '7',
    name: 'Anika Rosser',
    title: 'Head Professor',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '8',
    name: 'Talan George',
    title: 'Instructor',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
  },
  {
    id: '9',
    name: 'Professor Ivan',
    title: 'Senior Coach',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 10, 2025',
    lastLoggedIn: 'April 10, 2025',
  },
  {
    id: '10',
    name: 'Jessica Smith',
    title: 'Admin Coach',
    permissions: 'Admin, Coach',
    status: 'Active',
    recentActivity: 'April 8, 2025',
    lastLoggedIn: 'April 8, 2025',
  },
  {
    id: '11',
    name: 'Daniel Jackson',
    title: 'Coach',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 5, 2025',
    lastLoggedIn: 'April 5, 2025',
  },
  {
    id: '12',
    name: 'Abigail Martinez',
    title: 'Assistant Coach',
    permissions: 'Coach',
    status: 'Active',
    recentActivity: 'April 3, 2025',
    lastLoggedIn: 'April 3, 2025',
  },
  {
    id: '13',
    name: 'Benjamin Taylor',
    title: 'Instructor',
    permissions: 'Coach',
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

export function UserPermissionsPage() {
  const t = useTranslations('UserPermissions');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
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

  const filteredUsers = activeFilter === 'all'
    ? mockUsers
    : activeFilter === 'admins'
      ? mockUsers.filter(u => u.permissions.includes('Admin'))
      : activeFilter === 'coaches'
        ? mockUsers.filter(u => u.permissions.includes('Coach') && !u.permissions.includes('Admin'))
        : mockUsers.filter(u => !u.permissions.includes('Admin') && !u.permissions.includes('Coach'));

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
      case 'permissions':
        aValue = a.permissions.toLowerCase();
        bValue = b.permissions.toLowerCase();
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('total_users_label')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{mockUsers.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('total_admins_label')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {mockUsers.filter(u => u.permissions.includes('Admin')).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('total_coaches_label')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {mockUsers.filter(u => u.permissions.includes('Coach')).length}
          </p>
        </Card>
      </div>

      {/* My Users Section */}
      <div>
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-foreground">{t('my_users_title')}</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('add_user_button')}
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-4 flex gap-2 border-b border-border">
          {(['all', 'admins', 'coaches', 'others'] as const).map(filter => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'border-b-2 border-foreground text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(`filter_${filter}`)}
            </button>
          ))}
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
                      onClick={() => handleSort('permissions')}
                      className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                    >
                      {t('permissions_column')}
                      {sortField === 'permissions' && (
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t('action_column')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="border-b border-border hover:bg-secondary/30">
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
                    <td className="px-6 py-4 text-sm text-foreground">{user.permissions}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{user.recentActivity}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{user.lastLoggedIn}</td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm">
                        {t('view_details_button')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile View */}
        <div className="space-y-4 lg:hidden">
          {paginatedUsers.map(user => (
            <Card key={user.id} className="p-4">
              <div className="space-y-4">
                {/* User Name and Avatar */}
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.title}</div>
                  </div>
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t('permissions_column')}</div>
                    <div className="mt-1 text-sm text-foreground">{user.permissions}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t('status_column')}</div>
                    <div className="mt-1">
                      <Badge variant={getStatusVariant(user.status)} className="text-xs">
                        {user.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t('recent_activity_column')}</div>
                    <div className="mt-1 text-sm text-foreground">{user.recentActivity}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t('last_logged_in_column')}</div>
                    <div className="mt-1 text-sm text-foreground">{user.lastLoggedIn}</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end border-t border-border pt-4">
                  <Button variant="outline" size="sm">
                    {t('view_details_button')}
                  </Button>
                </div>
              </div>
            </Card>
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
      </div>

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
              <Button variant="outline" size="sm" className="mt-4">
                {t('view_details_button')}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
