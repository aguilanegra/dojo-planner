'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  // Extended fields from Clerk Billing API (to be added)
  membershipType?: 'free' | 'free_trial' | 'monthly' | 'annual';
  amountDue?: string;
  nextPayment?: Date;
};

type MembersTableProps = {
  members: Member[];
  onViewDetailsAction: (memberId: string) => void;
  loading?: boolean;
};

export function MembersTable({
  members,
  onViewDetailsAction,
  loading = false,
}: MembersTableProps) {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'active' | 'cancelled'
  >('all');

  const filteredMembers = activeFilter === 'all'
    ? members
    : activeFilter === 'active'
      ? members.filter(m => m.status === 'active')
      : members.filter(m => m.status === 'cancelled');

  const stats = {
    totalMembers: members.length,
    totalCancelled: members.filter(m => m.status === 'cancelled').length,
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
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
    return status === 'active' ? 'default' : 'secondary';
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

      {/* Filter Tabs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">All Members</h2>

        <div className="flex gap-4 border-b border-border">
          {(['all', 'active', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-1 pb-3 text-sm font-medium transition-colors ${
                activeFilter === tab
                  ? 'border-b-2 border-foreground text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Members Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          {loading
            ? (
                <div className="p-8 text-center text-muted-foreground">Loading members...</div>
              )
            : filteredMembers.length === 0
              ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No members found
                  </div>
                )
              : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Member name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Membership type
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Amount due
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Next payment
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Last visited
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map(member => (
                          <tr key={member.id} className="border-b border-border hover:bg-secondary/30">
                            <td className="px-6 py-4">
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
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {member.membershipType === 'monthly'
                                ? 'Month to month'
                                : member.membershipType === 'annual'
                                  ? 'Annual'
                                  : member.membershipType === 'free'
                                    ? 'Free'
                                    : member.membershipType === 'free_trial'
                                      ? 'Free Trial'
                                      : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatCurrency(member.amountDue)}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(member.nextPayment)}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={getStatusColor(member.status)}>
                                {member.status.charAt(0).toUpperCase()
                                  + member.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(member.lastAccessedAt)}
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewDetailsAction(member.id)}
                                className="whitespace-nowrap"
                              >
                                View details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
        </div>

        {/* Pagination info */}
        {!loading && filteredMembers.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing
            {' '}
            {filteredMembers.length}
            {' '}
            of
            {' '}
            {members.length}
            {' '}
            members
          </div>
        )}
      </div>
    </div>
  );
}
