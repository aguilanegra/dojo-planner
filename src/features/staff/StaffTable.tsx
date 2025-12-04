'use client';

import { ArrowDownAZ, ArrowUpZA, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Panel, PanelContent, PanelFooter, PanelHeader } from '@/components/ui/panel';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  const [currentPage, setCurrentPage] = useState(0);
  const ROWS_PER_PAGE = 10;

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

  // Pagination logic
  const totalPages = Math.ceil(sortedStaff.length / ROWS_PER_PAGE);
  const paginatedStaff = sortedStaff.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE,
  );

  return (
    <div className="w-full space-y-6">
      {/* Staff Panel */}
      <Panel>
        <PanelHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-medium text-foreground">Staff Members</h2>
            <div className="flex gap-2">
              {headerActions}
            </div>
          </div>
        </PanelHeader>

        <PanelContent>
          {/* Staff Table - Desktop View */}
          <div className="hidden lg:block">
            {staffMembers.length === 0
              ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No staff members found
                  </div>
                )
              : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
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
                        </TableHead>
                        <TableHead>
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
                        </TableHead>
                        <TableHead>
                          Status
                        </TableHead>
                        <TableHead>
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStaff.map(staff => (
                        <TableRow key={staff.id}>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleVariant(staff.role)}>
                              {staff.role === 'org:admin' ? 'Admin' : staff.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant()}>
                              {staff.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  paginatedStaff.map(staff => (
                    <Card key={staff.id} className="p-4">
                      <div className="space-y-4">
                        {/* Staff Name */}
                        <div className="flex items-center gap-3 border-b border-border pb-4">
                          <Avatar className="h-10 w-10 shrink-0">
                            {staff.photoUrl && (
                              <AvatarImage src={staff.photoUrl} alt={`${staff.firstName} ${staff.lastName}`} />
                            )}
                            <AvatarFallback>
                              {getInitials(staff.firstName, staff.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">
                              {staff.firstName}
                              {' '}
                              {staff.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">{staff.email}</div>
                          </div>
                        </div>

                        {/* Staff Details */}
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground">Role</div>
                            <div className="mt-1">
                              <Badge variant={getRoleVariant(staff.role)}>
                                {staff.role === 'org:admin' ? 'Admin' : staff.role}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground">Status</div>
                            <div className="mt-1">
                              <Badge variant={getStatusVariant()}>
                                {staff.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
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
                      </div>
                    </Card>
                  ))
                )}
          </div>
        </PanelContent>

        {/* Pagination */}
        {staffMembers.length > 0 && (
          <PanelFooter>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedStaff.length}
              itemsPerPage={ROWS_PER_PAGE}
              onPageChangeAction={setCurrentPage}
            />
          </PanelFooter>
        )}
      </Panel>
    </div>
  );
}
