'use client';

import { ArrowDownAZ, ArrowUpZA, Plus } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const mockStaff = [
  {
    id: '1',
    name: 'Charlie Baptista',
    email: 'charlie@dojo.com',
    status: 'Active',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  },
  {
    id: '2',
    name: 'Professor Jessica',
    email: 'jessica@dojo.com',
    status: 'Active',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
  },
  {
    id: '3',
    name: 'Coach Alex',
    email: 'alex@dojo.com',
    status: 'Active',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: '4',
    name: 'Sarah Martinez',
    email: 'sarah@dojo.com',
    status: 'Active',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '5',
    name: 'Mike Johnson',
    email: 'mike@dojo.com',
    status: 'Invitation sent',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  },
];

type SortField = 'name' | 'status' | 'email';
type SortDirection = 'asc' | 'desc';

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'Active') {
    return 'default';
  }
  if (status === 'Invitation sent') {
    return 'secondary';
  }
  return 'outline';
}

function getInitials(name: string) {
  const parts = name.split(' ');
  return parts.map(part => part[0]).join('').toUpperCase();
}

export function StaffPage() {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStaff = [...mockStaff].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    if (sortField === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else if (sortField === 'email') {
      aValue = a.email.toLowerCase();
      bValue = b.email.toLowerCase();
    } else {
      aValue = a.status.toLowerCase();
      bValue = b.status.toLowerCase();
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Staff</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your team members</p>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-end gap-4">
        {/* Invite Staff Member Button */}
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Staff Member
        </Button>
      </div>

      {/* Staff Table */}
      <div className="rounded-lg border border-border bg-background">
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
                    Staff member name
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
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStaff.map(staff => (
                <tr key={staff.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={staff.photoUrl} alt={staff.name} />
                        <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{staff.name}</span>
                        <span className="text-xs text-muted-foreground">{staff.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(staff.status)}>{staff.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
