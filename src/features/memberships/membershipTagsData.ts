export type MembershipTag = {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  membershipNames: string[];
};

export const mockMembershipTags: MembershipTag[] = [
  {
    id: 'tag-1',
    name: 'Active',
    color: '#22c55e', // green-500 - matches Active badge color
    usageCount: 4,
    membershipNames: ['12 Month Commitment (Gold)', 'Month to Month (Gold)', 'Kids Monthly', 'Competition Team'],
  },
  {
    id: 'tag-2',
    name: 'Trial',
    color: '#f59e0b', // amber-500 - matches Trial badge color
    usageCount: 2,
    membershipNames: ['7-Day Free Trial', 'Kids Free Trial Week'],
  },
  {
    id: 'tag-3',
    name: 'Inactive',
    color: '#ef4444', // red-500 - matches Inactive badge color
    usageCount: 1,
    membershipNames: ['6 Month Commitment (Silver)'],
  },
];
