'use client';

import { useOrganization } from '@clerk/nextjs';
import { Plus, Trash2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useReducer } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MemberBreadcrumb } from '@/components/ui/breadcrumb/MemberBreadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MemberDetailFinancial } from '@/features/members/details/MemberDetailFinancial';
import { invalidateMembersCache, useMembersCache } from '@/hooks/useMembersCache';
import { client } from '@/libs/Orpc';

type Tab = 'overview' | 'financial';

type ContactInfo = {
  address?: string;
  phone?: string;
  email?: string;
};

type SubscriptionDetails = {
  membershipType: string;
  status: 'active' | 'on-hold' | 'cancelled';
  amount: number;
  pastDuePayments: number;
  lastPayment?: string;
};

type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  photoUrl?: string;
  membershipType: string;
  status: 'active' | 'on-hold' | 'cancelled';
  amount: number;
};

type MembershipDetailsData = {
  status: 'active' | 'on-hold' | 'cancelled';
  program: string;
  membershipType: string;
  membershipFee: number;
  paymentFrequency: string;
  registrationDate: string;
  startDate: string;
  nextPaymentDate: string;
  nextPaymentAmount: number;
};

type PaymentMethod = {
  last4: string;
  brand: string;
  isDefault: boolean;
};

type Agreement = {
  signedDate: string;
  status: 'signed' | 'unsigned' | 'expired';
};

type BillingHistoryItem = {
  id: string;
  date: string;
  member: string;
  amount: number;
  purpose: string;
  method: string;
  groupType?: 'family' | 'individual';
  children?: BillingHistoryItem[];
};

type MemberData = {
  memberName: string;
  photoUrl?: string;
  billingContactRole: string;
  membershipBadge: string;
  amountOverdue: string;
  contactInfo: ContactInfo;
  subscriptionDetails: SubscriptionDetails;
  familyMembers: FamilyMember[];
  membershipDetails: MembershipDetailsData;
  paymentMethod: PaymentMethod;
  agreement: Agreement;
  billingHistory: BillingHistoryItem[];
};

// Base mock data fallback
const BASE_MOCK_DATA = {
  familyMembers: [] as FamilyMember[],
  paymentMethod: {
    last4: '0046',
    brand: 'Visa',
    isDefault: true,
  },
  agreement: {
    signedDate: 'Sep 01, 2025',
    status: 'signed' as const,
  },
  billingHistory: [] as BillingHistoryItem[],
};

// Build MemberData from API member data
type MemberType = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  photoUrl?: string | null;
  membershipType?: 'free' | 'free_trial' | 'monthly' | 'annual';
  status?: string;
  program?: string;
  amountDue?: string;
  [key: string]: unknown;
};

function getMembershipBadgeText(membershipType?: string): string {
  switch (membershipType) {
    case 'free':
      return 'Free Member';
    case 'free_trial':
      return 'Free Trial';
    case 'annual':
      return 'Annual Member';
    case 'monthly':
    default:
      return 'Monthly Member';
  }
}

function getSubscriptionMembershipType(membershipType?: string): string {
  switch (membershipType) {
    case 'free':
      return 'Free Membership';
    case 'free_trial':
      return 'Free Trial Membership';
    case 'annual':
      return 'Annual Membership';
    case 'monthly':
    default:
      return 'Monthly Membership';
  }
}

function getSubscriptionAmount(membershipType?: string): number {
  // Free and free trial memberships have no payment amount
  if (membershipType === 'free' || membershipType === 'free_trial') {
    return 0;
  }
  // Default monthly amount (will be replaced with real data when API provides it)
  return 160;
}

function getMemberStatus(status?: string): 'active' | 'on-hold' | 'cancelled' {
  switch (status?.toLowerCase()) {
    case 'on-hold':
      return 'on-hold';
    case 'cancelled':
      return 'cancelled';
    case 'active':
    default:
      return 'active';
  }
}

function buildMembershipDetails(membershipType?: string, status?: string, program?: string): MembershipDetailsData {
  const memberStatus = getMemberStatus(status);
  const isFreeOrTrial = membershipType === 'free' || membershipType === 'free_trial';

  // Use actual program from member data, or N/A if not set
  const displayProgram = program || 'N/A';
  // Use N/A for dates if not set
  const registrationDate = membershipType ? 'Sep 01, 2025' : 'N/A';
  const startDate = membershipType ? 'Sep 01, 2025' : 'N/A';

  // Base membership details
  const baseDetails = {
    status: memberStatus,
    program: displayProgram,
    registrationDate,
    startDate,
  };

  // For free and free trial, no membership fee or payment information
  if (isFreeOrTrial) {
    return {
      ...baseDetails,
      membershipType: getSubscriptionMembershipType(membershipType),
      membershipFee: 0,
      paymentFrequency: 'N/A',
      nextPaymentDate: 'N/A',
      nextPaymentAmount: 0,
    };
  }

  // If no membership type set, show N/A values
  if (!membershipType) {
    return {
      ...baseDetails,
      membershipType: 'N/A',
      membershipFee: 0,
      paymentFrequency: 'N/A',
      nextPaymentDate: 'N/A',
      nextPaymentAmount: 0,
    };
  }

  // For paid memberships, include fee and payment details
  return {
    ...baseDetails,
    membershipType: membershipType === 'annual' ? 'Annual' : 'Month-to-Month',
    membershipFee: membershipType === 'annual' ? 1800 : 300,
    paymentFrequency: membershipType === 'annual' ? 'Annual' : 'Monthly',
    nextPaymentDate: 'Oct 01, 2025',
    nextPaymentAmount: membershipType === 'annual' ? 1800 : 300,
  };
}

function buildMemberDataFromAPI(apiMember: MemberType): MemberData {
  const memberName = `${apiMember.firstName || ''} ${apiMember.lastName || ''}`.trim() || 'Member';
  const memberStatus = getMemberStatus(apiMember.status);
  const isFreeOrTrial = apiMember.membershipType === 'free' || apiMember.membershipType === 'free_trial';

  return {
    memberName,
    photoUrl: apiMember.photoUrl || undefined,
    billingContactRole: 'Billing Contact',
    membershipBadge: getMembershipBadgeText(apiMember.membershipType),
    amountOverdue: '$0',
    contactInfo: {
      address: '',
      phone: apiMember.phone || '',
      email: apiMember.email || '',
    },
    subscriptionDetails: {
      membershipType: getSubscriptionMembershipType(apiMember.membershipType),
      status: memberStatus,
      amount: getSubscriptionAmount(apiMember.membershipType),
      pastDuePayments: 0,
      lastPayment: isFreeOrTrial ? undefined : 'Last payment: N/A',
    },
    familyMembers: BASE_MOCK_DATA.familyMembers,
    membershipDetails: buildMembershipDetails(apiMember.membershipType, apiMember.status, apiMember.program),
    paymentMethod: BASE_MOCK_DATA.paymentMethod,
    agreement: BASE_MOCK_DATA.agreement,
    billingHistory: BASE_MOCK_DATA.billingHistory,
  };
}

type PageState = {
  originalData: MemberData | null;
  currentData: MemberData | null;
  error: string | null;
  isLoading: boolean;
  activeTab: Tab;
  isLoadingMember: boolean;
  subscriptionType: string | null;
};

type PageAction
  = { type: 'SET_ACTIVE_TAB'; payload: Tab }
    | { type: 'SET_SUBSCRIPTION_TYPE'; payload: string }
    | { type: 'SET_MEMBER_DATA'; payload: MemberData }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LOADING_MEMBER'; payload: boolean }
    | { type: 'UPDATE_CONTACT_INFO'; payload: { field: keyof ContactInfo; value: string } }
    | { type: 'REMOVE_FAMILY_MEMBER'; payload: string };

function pageReducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_SUBSCRIPTION_TYPE':
      return { ...state, subscriptionType: action.payload };
    case 'SET_MEMBER_DATA':
      return { ...state, originalData: action.payload, currentData: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LOADING_MEMBER':
      return { ...state, isLoadingMember: action.payload };
    case 'UPDATE_CONTACT_INFO': {
      if (!state.currentData) {
        return state;
      }
      return {
        ...state,
        currentData: {
          ...state.currentData,
          contactInfo: {
            ...state.currentData.contactInfo,
            [action.payload.field]: action.payload.value,
          },
        },
        error: null,
      };
    }
    case 'REMOVE_FAMILY_MEMBER': {
      if (!state.currentData) {
        return state;
      }
      return {
        ...state,
        currentData: {
          ...state.currentData,
          familyMembers: state.currentData.familyMembers.filter(m => m.id !== action.payload),
        },
      };
    }
    default:
      return state;
  }
}

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = params?.memberId as string;
  const locale = (params?.locale as string) || 'en';

  // Get organization
  const { organization } = useOrganization();

  // Fetch members from cache
  const { members } = useMembersCache(organization?.id);

  // State for member data
  const [state, dispatch] = useReducer(pageReducer, {
    originalData: null,
    currentData: null,
    error: null,
    isLoading: false,
    activeTab: 'overview' as Tab,
    isLoadingMember: true,
    subscriptionType: null,
  });

  // Handler to sync tab from URL
  const syncTabFromUrl = useCallback(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'financial' || tabParam === 'overview') {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tabParam as Tab });
    }
  }, [searchParams]);

  // Sync tab from URL search params
  useEffect(() => {
    syncTabFromUrl();
  }, [syncTabFromUrl]);

  // Fetch organization subscription type (same as members landing page)
  useEffect(() => {
    const fetchSubscriptionType = async () => {
      if (!organization?.id) {
        return;
      }
      try {
        const response = await fetch(`/${locale}/api/organization/${organization.id}/subscription`);
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'SET_SUBSCRIPTION_TYPE', payload: data.subscriptionType });
        }
      } catch (err) {
        console.warn('[Edit Member] Failed to fetch subscription type:', err);
      }
    };
    fetchSubscriptionType();
  }, [organization?.id, locale]);

  // Handler to load member data from cache
  const loadMemberData = useCallback(() => {
    try {
      if (members && members.length > 0) {
        const member = members.find(m => m.id === memberId);
        if (member) {
          // Use organization subscription type if available, otherwise use member's individual type
          const membershipTypeToUse = (state.subscriptionType || member.membershipType) as 'free' | 'free_trial' | 'monthly' | 'annual' | undefined;
          const memberWithType = { ...member, membershipType: membershipTypeToUse };
          const memberData = buildMemberDataFromAPI(memberWithType);
          dispatch({ type: 'SET_MEMBER_DATA', payload: memberData });
          console.info('[Edit Member] Member data loaded from cache:', {
            timestamp: new Date().toISOString(),
            memberId,
            memberName: memberData.memberName,
            membershipType: membershipTypeToUse,
          });
        } else {
          console.warn('[Edit Member] Member not found in cache:', { memberId });
          dispatch({ type: 'SET_ERROR', payload: 'Member not found' });
        }
      }
    } finally {
      dispatch({ type: 'SET_LOADING_MEMBER', payload: false });
    }
  }, [members, memberId, state.subscriptionType]);

  // Load member data from cache
  useEffect(() => {
    loadMemberData();
  }, [loadMemberData]);

  // Check if data has changed
  const hasChanges = JSON.stringify(state.currentData) !== JSON.stringify(state.originalData);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: 'active' | 'on-hold' | 'cancelled'): 'default' | 'secondary' | 'destructive' => {
    if (status === 'active') {
      return 'default';
    }
    if (status === 'on-hold') {
      return 'secondary';
    }
    return 'destructive';
  };

  const getStatusLabel = (status: 'active' | 'on-hold' | 'cancelled') => {
    if (status === 'on-hold') {
      return 'On Hold';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleContactInfoChange = useCallback((field: keyof ContactInfo, value: string) => {
    dispatch({ type: 'UPDATE_CONTACT_INFO', payload: { field, value } });
  }, []);

  const handleRemoveFamilyMember = useCallback((familyMemberId: string) => {
    dispatch({ type: 'REMOVE_FAMILY_MEMBER', payload: familyMemberId });
  }, []);

  const handleSave = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Guard against null data
      if (!state.currentData || !state.originalData) {
        dispatch({ type: 'SET_ERROR', payload: 'Member data not loaded' });
        return;
      }

      // Validate required fields
      if (!state.currentData.contactInfo.email) {
        dispatch({ type: 'SET_ERROR', payload: 'Email is required' });
        return;
      }

      console.info('[Edit Member] Saving member changes for member ID:', {
        timestamp: new Date().toISOString(),
        memberId,
        changes: state.currentData,
      });

      // Extract first and last name from memberName
      const nameParts = state.currentData.memberName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Call API to update member
      await client.member.update({
        id: memberId,
        email: state.currentData.contactInfo.email,
        firstName,
        lastName,
        phone: state.currentData.contactInfo.phone || null,
      });

      console.info('[Edit Member] Member updated successfully:', {
        timestamp: new Date().toISOString(),
        memberId,
      });

      // Invalidate cache to refresh member list
      invalidateMembersCache();

      // Navigate back to members list page
      router.push(`/${locale}/dashboard/members`);
    } catch (err) {
      console.error('[Edit Member] Failed to update member:', {
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
        memberId,
      });

      const errorMessage = err instanceof Error ? err.message : 'Failed to save member changes';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleTabChange = useCallback((tab: Tab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    // Update URL with tab parameter
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', tab);
    router.push(newUrl.pathname + newUrl.search);
  }, [router]);

  const handleCancel = () => {
    router.push(`/${locale}/dashboard/members`);
  };

  // Show loading state
  if (state.isLoadingMember || !state.currentData || !state.originalData) {
    return (
      <div className="space-y-6">
        <MemberBreadcrumb
          memberName="Loading..."
          onBackClick={handleCancel}
        />
        {state.error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading member data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MemberBreadcrumb
        memberName={state.currentData.memberName}
        onBackClick={handleCancel}
      />

      {state.error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Member Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {state.currentData.photoUrl && <AvatarImage src={state.currentData.photoUrl} alt={state.currentData.memberName} />}
          <AvatarFallback>{getInitials(state.currentData.memberName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">{state.currentData.memberName}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{state.currentData.billingContactRole}</Badge>
            <Badge variant="default">{state.currentData.membershipBadge}</Badge>
            <Badge variant="destructive">{state.currentData.amountOverdue}</Badge>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`cursor-pointer pb-3 text-sm font-semibold transition-colors ${
              state.activeTab === 'overview'
                ? 'border-b-2 border-foreground text-foreground'
                : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('financial')}
            className={`cursor-pointer pb-3 text-sm font-semibold transition-colors ${
              state.activeTab === 'financial'
                ? 'border-b-2 border-foreground text-foreground'
                : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Financial
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {state.activeTab === 'overview'
        ? (
            <div className="space-y-6">
              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Contact Information - Editable */}
                <Card className="p-6">
                  <h2 className="mb-6 text-lg font-semibold text-foreground">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="address" className="text-sm font-medium text-muted-foreground">Address</label>
                      <Input
                        id="address"
                        placeholder="Address"
                        value={state.currentData.contactInfo.address || ''}
                        onChange={e => handleContactInfoChange('address', e.target.value)}
                        disabled={state.isLoading}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Phone</label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Phone number"
                        value={state.currentData.contactInfo.phone || ''}
                        onChange={e => handleContactInfoChange('phone', e.target.value)}
                        disabled={state.isLoading}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        value={state.currentData.contactInfo.email || ''}
                        onChange={e => handleContactInfoChange('email', e.target.value)}
                        disabled={state.isLoading}
                      />
                    </div>
                  </div>
                </Card>

                {/* Subscription Details - Read Only */}
                <Card className="p-6">
                  <h2 className="mb-6 text-lg font-semibold text-foreground">Subscription Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{state.currentData.subscriptionDetails.membershipType}</h3>
                        <Badge variant={getStatusColor(state.currentData.subscriptionDetails.status)} className="mt-2">
                          {getStatusLabel(state.currentData.subscriptionDetails.status)}
                        </Badge>
                      </div>
                      {state.currentData.subscriptionDetails.amount > 0 && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            $
                            {state.currentData.subscriptionDetails.amount}
                          </p>
                        </div>
                      )}
                    </div>
                    {state.currentData.subscriptionDetails.pastDuePayments > 0 && (
                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">Past Due Payments</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{state.currentData.subscriptionDetails.lastPayment}</p>
                          </div>
                          <p className="text-2xl font-bold text-destructive">
                            $
                            {state.currentData.subscriptionDetails.pastDuePayments.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                    {state.currentData.subscriptionDetails.pastDuePayments === 0 && (
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">No payments due</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Family Members Section - With Remove Buttons */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Family Members</h2>

                {state.currentData.familyMembers.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {state.currentData.familyMembers.map((member: FamilyMember) => (
                      <Card key={member.id} className="relative p-6">
                        {/* Remove Button */}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-4 right-4"
                          onClick={() => handleRemoveFamilyMember(member.id)}
                          aria-label={`Remove ${member.name}`}
                          title={`Remove ${member.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="mb-4 flex flex-col gap-3 pr-10">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="h-10 w-10 shrink-0">
                              {member.photoUrl && <AvatarImage src={member.photoUrl} alt={member.name} />}
                              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-semibold text-foreground">{member.name}</h3>
                              <Badge variant="outline" className="mt-1 text-xs">{member.relationship}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 border-t border-border pt-4">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground">{member.membershipType}</p>
                            <Badge variant={getStatusColor(member.status)} className="mt-2">
                              {getStatusLabel(member.status)}
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold text-primary">
                            $
                            {member.amount}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add Family Member Card */}
                <Card className="border-2 border-dashed p-6">
                  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                    <div className="rounded-lg bg-secondary p-3">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Add Family Member</h3>
                    <p className="text-sm text-muted-foreground">Create a new family membership</p>
                    <Button variant="outline" className="mt-2">
                      Add Family Member
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-3 border-t border-border pt-6">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={state.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || state.isLoading}
                >
                  {state.isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )
        : (
            <MemberDetailFinancial
              memberId={memberId}
              memberName={state.currentData.memberName}
              photoUrl={state.currentData.photoUrl}
              billingContactRole={state.currentData.billingContactRole}
              membershipBadge={state.currentData.membershipBadge}
              amountOverdue={state.currentData.amountOverdue}
              membershipDetails={state.currentData.membershipDetails}
              paymentMethod={state.currentData.paymentMethod}
              agreement={state.currentData.agreement}
              billingHistory={state.currentData.billingHistory}
              hideHeader={true}
              onChangeMembership={() => console.warn('Change membership')}
              onSendSecureLink={() => console.warn('Send secure link')}
              onDownloadAgreement={() => console.warn('Download agreement')}
              onRefund={() => console.warn('Refund')}
            />
          )}
    </div>
  );
}
