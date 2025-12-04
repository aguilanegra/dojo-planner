'use client';

import { ArchiveRestore, ArrowDown01, ArrowDownAZ, ArrowUp10, ArrowUpZA, Edit, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Panel, PanelContent, PanelFooter, PanelHeader, PanelTabs } from '@/components/ui/panel';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Member = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
  photoUrl: string | null;
  lastAccessedAt: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  create_organization_enabled?: boolean;
  // Extended fields from Clerk Billing API (to be added)
  membershipType?: 'free' | 'free_trial' | 'monthly' | 'annual';
  amountDue?: string;
  nextPayment?: Date;
};

type MembersTableProps = {
  members: Member[];
  onEditAction: (memberId: string) => void;
  onRemoveAction: (memberId: string) => void;
  onRestoreAction: (memberId: string) => void;
  loading?: boolean;
  headerActions?: React.ReactNode;
};

type SortField = 'firstName' | 'membershipType' | 'amountDue' | 'nextPayment' | 'status' | 'lastAccessedAt';
type SortDirection = 'asc' | 'desc';

export function MembersTable({
  members,
  onEditAction,
  onRemoveAction,
  onRestoreAction,
  loading = false,
  headerActions,
}: MembersTableProps) {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'active' | 'cancelled' | 'removed'
  >('all');
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const ROWS_PER_PAGE = 10;

  const filteredMembers = activeFilter === 'all'
    ? members
    : activeFilter === 'active'
      ? members.filter(m => m.status === 'active')
      : activeFilter === 'cancelled'
        ? members.filter(m => m.status === 'cancelled')
        : members.filter(m => m.status === 'flagged-for-deletion');

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let aValue: string | number | Date | null | undefined;
    let bValue: string | number | Date | null | undefined;

    switch (sortField) {
      case 'firstName':
        aValue = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
        bValue = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        break;
      case 'membershipType':
        aValue = a.membershipType || '';
        bValue = b.membershipType || '';
        break;
      case 'amountDue':
        aValue = a.amountDue ? Number.parseFloat(a.amountDue) : 0;
        bValue = b.amountDue ? Number.parseFloat(b.amountDue) : 0;
        break;
      case 'nextPayment':
        aValue = a.nextPayment ? new Date(a.nextPayment).getTime() : 0;
        bValue = b.nextPayment ? new Date(b.nextPayment).getTime() : 0;
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'lastAccessedAt':
        aValue = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
        bValue = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
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

  const totalPages = Math.ceil(sortedMembers.length / ROWS_PER_PAGE);
  const paginatedMembers = sortedMembers.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0);
  };

  const stats = {
    totalMembers: members.filter(m => m.status === 'active').length,
    totalCancelled: members.filter(m => m.status === 'cancelled').length,
    totalRemoved: members.filter(m => m.status === 'flagged-for-deletion').length,
    paidMembers: members.filter(m => m.membershipType === 'monthly' || m.membershipType === 'annual').length,
    freeMembers: members.filter(m => m.membershipType === 'free' || m.membershipType === 'free_trial').length,
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (!firstName || !lastName) {
      return '?';
    }
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) {
      return '-';
    }
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    const timeZone = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
    }).formatToParts(d).find(part => part.type === 'timeZoneName')?.value || '';

    return `${month}/${day}/${year} ${hours}${minutes} ${timeZone}`;
  };

  const formatCurrency = (amount: string | undefined) => {
    if (!amount) {
      return '-';
    }
    return Number.parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') {
      return 'default';
    }
    if (status === 'flagged-for-deletion') {
      return 'destructive';
    }
    return 'secondary';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'flagged-for-deletion') {
      return 'Flagged for removal';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getMembershipTypeLabel = (membershipType: string | undefined) => {
    switch (membershipType) {
      case 'free-trial':
        return 'Free Trial';
      case 'monthly':
        return 'Monthly';
      case 'annual':
        return 'Annual';
      case 'free':
        return 'Free';
      default:
        return '-';
    }
  };

  const getMembershipTypeVariant = (membershipType: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (membershipType) {
      case 'free-trial':
        return 'outline';
      case 'monthly':
        return 'default';
      case 'annual':
        return 'default';
      case 'free':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total members</div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalMembers}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total cancelled
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalCancelled}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Paid members</div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.paidMembers}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Free members
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.freeMembers}</div>
        </Card>
      </div>

      {/* Members Panel */}
      <Panel>
        <Tabs
          defaultValue="all"
          onValueChange={(value) => {
            setActiveFilter(value as typeof activeFilter);
            setCurrentPage(0);
          }}
        >
          <PanelHeader withDivider={true}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-medium text-foreground">All Members</h2>
                <div className="flex gap-2">
                  {headerActions}
                </div>
              </div>
              <PanelTabs>
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger value="all" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">All</TabsTrigger>
                  <TabsTrigger value="active" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">Active</TabsTrigger>
                  <TabsTrigger value="cancelled" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">Cancelled</TabsTrigger>
                  <TabsTrigger value="removed" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">Removed</TabsTrigger>
                </TabsList>
              </PanelTabs>
            </div>
          </PanelHeader>

          <TabsContent value={activeFilter} className="mt-0">
            <PanelContent>
              {/* Members Table - Desktop View */}
              <div className="hidden lg:block">
                {loading
                  ? (
                      <div className="flex flex-col items-center justify-center gap-3 p-8">
                        <Spinner size="lg" />
                        <p className="text-sm text-muted-foreground">Loading members...</p>
                      </div>
                    )
                  : filteredMembers.length === 0
                    ? (
                        <div className="p-8 text-center text-muted-foreground">
                          No members found
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
                                  Member name
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
                                  onClick={() => handleSort('membershipType')}
                                  className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                                >
                                  Membership type
                                  {sortField === 'membershipType' && (
                                    sortDirection === 'asc'
                                      ? <ArrowDownAZ className="h-4 w-4" />
                                      : <ArrowUpZA className="h-4 w-4" />
                                  )}
                                </button>
                              </TableHead>
                              <TableHead>
                                <button
                                  type="button"
                                  onClick={() => handleSort('amountDue')}
                                  className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                                >
                                  Amount due
                                  {sortField === 'amountDue' && (
                                    sortDirection === 'asc'
                                      ? <ArrowDown01 className="h-4 w-4" />
                                      : <ArrowUp10 className="h-4 w-4" />
                                  )}
                                </button>
                              </TableHead>
                              <TableHead>
                                <button
                                  type="button"
                                  onClick={() => handleSort('nextPayment')}
                                  className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                                >
                                  Next payment
                                  {sortField === 'nextPayment' && (
                                    sortDirection === 'asc'
                                      ? <ArrowDownAZ className="h-4 w-4" />
                                      : <ArrowUpZA className="h-4 w-4" />
                                  )}
                                </button>
                              </TableHead>
                              <TableHead>
                                <button
                                  type="button"
                                  onClick={() => handleSort('status')}
                                  className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                                >
                                  Status
                                  {sortField === 'status' && (
                                    sortDirection === 'asc'
                                      ? <ArrowDownAZ className="h-4 w-4" />
                                      : <ArrowUpZA className="h-4 w-4" />
                                  )}
                                </button>
                              </TableHead>
                              <TableHead>
                                <button
                                  type="button"
                                  onClick={() => handleSort('lastAccessedAt')}
                                  className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                                >
                                  Last visited
                                  {sortField === 'lastAccessedAt' && (
                                    sortDirection === 'asc'
                                      ? <ArrowDownAZ className="h-4 w-4" />
                                      : <ArrowUpZA className="h-4 w-4" />
                                  )}
                                </button>
                              </TableHead>
                              <TableHead>
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedMembers.map(member => (
                              <TableRow key={member.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 shrink-0">
                                      {member.photoUrl && (
                                        <AvatarImage src={member.photoUrl} />
                                      )}
                                      <AvatarFallback>
                                        {getInitials(member.firstName, member.lastName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-foreground">
                                      {member.firstName}
                                      {' '}
                                      {member.lastName}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getMembershipTypeVariant(member.membershipType)}>
                                    {getMembershipTypeLabel(member.membershipType)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatCurrency(member.amountDue)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(member.nextPayment)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusColor(member.status)}>
                                    {getStatusLabel(member.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(member.lastAccessedAt)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {member.status !== 'flagged-for-deletion' && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditAction(member.id)}
                                        aria-label={`Edit ${member.firstName} ${member.lastName}`}
                                        title={`Edit ${member.firstName} ${member.lastName}`}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    )}
                                    {member.status !== 'flagged-for-deletion'
                                      ? (
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onRemoveAction(member.id)}
                                            aria-label={`Remove ${member.firstName} ${member.lastName}`}
                                            title="Flag for removal"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        )
                                      : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onRestoreAction(member.id)}
                                            aria-label={`Restore ${member.firstName} ${member.lastName}`}
                                            title="Restore member"
                                          >
                                            <ArchiveRestore className="h-4 w-4" />
                                          </Button>
                                        )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
              </div>

              {/* Members Cards - Mobile View */}
              <div className="space-y-4 lg:hidden">
                {loading
                  ? (
                      <div className="flex flex-col items-center justify-center gap-3 p-8">
                        <Spinner size="lg" />
                        <p className="text-sm text-muted-foreground">Loading members...</p>
                      </div>
                    )
                  : filteredMembers.length === 0
                    ? (
                        <div className="p-8 text-center text-muted-foreground">
                          No members found
                        </div>
                      )
                    : (
                        paginatedMembers.map(member => (
                          <Card key={member.id} className="p-4">
                            <div className="space-y-4">
                              {/* Member Name */}
                              <div className="flex items-center gap-3 border-b border-border pb-4">
                                <Avatar className="h-10 w-10 shrink-0">
                                  {member.photoUrl && (
                                    <AvatarImage src={member.photoUrl} />
                                  )}
                                  <AvatarFallback>
                                    {getInitials(member.firstName, member.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground">
                                    {member.firstName}
                                    {' '}
                                    {member.lastName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{member.email}</div>
                                </div>
                              </div>

                              {/* Member Details Grid */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs font-semibold text-muted-foreground">Membership</div>
                                  <div className="mt-1">
                                    <Badge variant={getMembershipTypeVariant(member.membershipType)}>
                                      {getMembershipTypeLabel(member.membershipType)}
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs font-semibold text-muted-foreground">Amount Due</div>
                                  <div className="mt-1 text-sm text-foreground">
                                    {formatCurrency(member.amountDue)}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs font-semibold text-muted-foreground">Next Payment</div>
                                  <div className="mt-1 text-sm text-foreground">
                                    {formatDate(member.nextPayment)}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs font-semibold text-muted-foreground">Last Visited</div>
                                  <div className="mt-1 text-sm text-foreground">
                                    {formatDate(member.lastAccessedAt)}
                                  </div>
                                </div>
                              </div>

                              {/* Status and Action */}
                              <div className="flex items-center justify-between border-t border-border pt-4">
                                <Badge variant={getStatusColor(member.status)}>
                                  {getStatusLabel(member.status)}
                                </Badge>
                                <div className="flex items-center gap-2">
                                  {member.status !== 'flagged-for-deletion' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => onEditAction(member.id)}
                                      aria-label={`Edit ${member.firstName} ${member.lastName}`}
                                      title={`Edit ${member.firstName} ${member.lastName}`}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {member.status !== 'flagged-for-deletion'
                                    ? (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => onRemoveAction(member.id)}
                                          aria-label={`Remove ${member.firstName} ${member.lastName}`}
                                          title="Flag for removal"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )
                                    : (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => onRestoreAction(member.id)}
                                          aria-label={`Restore ${member.firstName} ${member.lastName}`}
                                          title="Restore member"
                                        >
                                          <RotateCcw className="h-4 w-4" />
                                        </Button>
                                      )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
              </div>
            </PanelContent>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {!loading && sortedMembers.length > 0 && (
          <PanelFooter>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedMembers.length}
              itemsPerPage={ROWS_PER_PAGE}
              onPageChangeAction={setCurrentPage}
            />
          </PanelFooter>
        )}
      </Panel>
    </div>
  );
}
