'use client';

import { ArrowDownAZ, ArrowUpZA, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StaffCard } from '@/templates/StaffCard';

type StaffMember = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  photoUrl: string | null;
  emailAddress: string;
  role: string;
  status: 'Active' | 'Invitation sent' | 'Inactive';
};

type StaffTableProps = {
  staffMembers: StaffMember[];
  headerActions?: React.ReactNode;
};

type SortField = 'firstName' | 'role';
type SortDirection = 'asc' | 'desc';

export function StaffTable({
  staffMembers,
  headerActions,
}: StaffTableProps) {
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleEditStaff = (staffId: string) => {
    console.warn('[Staff] Edit staff action triggered for staff ID:', staffId);
  };

  const handleRemoveStaff = (staffId: string) => {
    console.warn('[Staff] Remove staff action triggered for staff ID:', staffId);
  };

  const sortedStaff = [...staffMembers].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    switch (sortField) {
      case 'firstName':
        aValue = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
        bValue = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        break;
      case 'role':
        aValue = a.role.toLowerCase();
        bValue = b.role.toLowerCase();
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (!firstName || !lastName) {
      return '?';
    }
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleVariant = (role: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (role === 'org:admin') {
      return 'default';
    }
    return 'outline';
  };

  const getStatusVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    return 'outline';
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Staff Members</h2>
          {headerActions}
        </div>

        {/* Staff Table - Desktop View */}
        <div className="hidden rounded-lg border border-border bg-background lg:block">
          {staffMembers.length === 0
            ? (
                <div className="p-8 text-center text-muted-foreground">
                  No staff members found
                </div>
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          <button
                            type="button"
                            onClick={() => handleSort('firstName')}
                            className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                          >
                            Staff member name
                            {sortField === 'firstName' && (
                              sortDirection === 'asc'
                                ? <ArrowDownAZ className="h-4 w-4" />
                                : <ArrowUpZA className="h-4 w-4" />
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          <button
                            type="button"
                            onClick={() => handleSort('role')}
                            className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                          >
                            Role
                            {sortField === 'role' && (
                              sortDirection === 'asc'
                                ? <ArrowDownAZ className="h-4 w-4" />
                                : <ArrowUpZA className="h-4 w-4" />
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedStaff.map(staff => (
                        <tr key={staff.id} className="border-b border-border hover:bg-secondary/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 shrink-0">
                                {staff.photoUrl && (
                                  <AvatarImage src={staff.photoUrl} alt={`${staff.firstName} ${staff.lastName}`} />
                                )}
                                <AvatarFallback>
                                  {getInitials(staff.firstName, staff.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">
                                  {staff.firstName}
                                  {' '}
                                  {staff.lastName}
                                </span>
                                <span className="text-xs text-muted-foreground">{staff.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getRoleVariant(staff.role)}>
                              {staff.role === 'org:admin' ? 'Admin' : staff.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusVariant()}>
                              {staff.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditStaff(staff.id)}
                                aria-label={`Edit ${staff.firstName} ${staff.lastName}`}
                                title={`Edit ${staff.firstName} ${staff.lastName}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveStaff(staff.id)}
                                aria-label={`Remove ${staff.firstName} ${staff.lastName}`}
                                title={`Remove ${staff.firstName} ${staff.lastName}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
        </div>

        {/* Staff Cards - Mobile View */}
        <div className="space-y-4 lg:hidden">
          {staffMembers.length === 0
            ? (
                <div className="p-8 text-center text-muted-foreground">
                  No staff members found
                </div>
              )
            : (
                sortedStaff.map(staff => (
                  <StaffCard
                    key={staff.id}
                    id={staff.id}
                    firstName={staff.firstName}
                    lastName={staff.lastName}
                    email={staff.email}
                    photoUrl={staff.photoUrl}
                    emailAddress={staff.emailAddress}
                    role={staff.role}
                    status={staff.status}
                    onEdit={handleEditStaff}
                    onRemove={handleRemoveStaff}
                  />
                ))
              )}
        </div>
      </div>
    </div>
  );
}
