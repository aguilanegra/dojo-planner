'use client';

import type { MemberNote } from '@/features/members/details/MemberDetailNotes';
import type { Member } from '@/hooks/useMembersCache';
import { useOrganization } from '@clerk/nextjs';
import { Plus, Trash2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MemberBreadcrumb } from '@/components/ui/breadcrumb/MemberBreadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChangeMembershipModal } from '@/features/members/details/ChangeMembershipModal';
import { EditContactInfoModal } from '@/features/members/details/EditContactInfoModal';
import { MemberDetailFinancial } from '@/features/members/details/MemberDetailFinancial';
import { MemberDetailNotes } from '@/features/members/details/MemberDetailNotes';
import { useMembersCache } from '@/hooks/useMembersCache';

type Tab = 'overview' | 'financial' | 'notes';

type ContactInfo = {
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
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
  firstName: string;
  lastName: string;
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

// Mock notes data for demonstration
// Note: Author names are for demonstration purposes only
const MOCK_NOTES: MemberNote[] = [
  {
    id: 'note-1',
    date: 'Dec 15, 2025 at 2:30 PM',
    author: 'Staff Member',
    content: 'Member requested to pause membership for 2 weeks due to travel. Approved and scheduled for Jan 5-19, 2026.',
  },
  {
    id: 'note-2',
    date: 'Nov 28, 2025 at 10:15 AM',
    author: 'Front Desk',
    content: 'Updated emergency contact information. New contact: spouse at the same address.',
  },
  {
    id: 'note-3',
    date: 'Oct 10, 2025 at 4:45 PM',
    author: 'Instructor',
    content: 'Great progress in fundamentals class. Ready to move up to intermediate level next month.',
  },
  {
    id: 'note-4',
    date: 'Sep 15, 2025 at 11:00 AM',
    author: 'Admin',
    content: 'Welcome call completed. Member is interested in competition training starting next year.',
  },
];

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

// Build MemberData from API member data - use Member type from cache

function getMembershipBadgeText(membershipType?: string, planName?: string | null): string {
  // If we have an actual plan name, use it
  if (planName) {
    return planName;
  }
  // Fallback to legacy membership type mapping
  switch (membershipType) {
    case 'free':
      return 'Free Member';
    case 'free-trial':
      return 'Free Trial';
    case 'annual':
      return 'Annual Member';
    case 'monthly':
      return 'Monthly Member';
    default:
      return 'No Membership';
  }
}

function getSubscriptionMembershipType(membershipType?: string, planName?: string | null): string {
  // If we have an actual plan name, use it
  if (planName) {
    return planName;
  }
  // Fallback to legacy membership type mapping
  switch (membershipType) {
    case 'free':
      return 'Free Membership';
    case 'free-trial':
      return 'Free Trial Membership';
    case 'annual':
      return 'Annual Membership';
    case 'monthly':
      return 'Monthly Membership';
    default:
      return 'No Membership';
  }
}

function getSubscriptionAmount(membershipType?: string, planPrice?: number | null): number {
  // If we have an actual plan price, use it
  if (planPrice !== undefined && planPrice !== null) {
    return planPrice;
  }
  // Fallback to legacy membership type pricing
  if (membershipType === 'free' || membershipType === 'free-trial') {
    return 0;
  }
  // Default monthly amount
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

type MembershipPlanInfo = {
  name?: string;
  price?: number;
  frequency?: string;
  contractLength?: string;
  isTrial?: boolean | null;
};

function buildMembershipDetails(
  membershipType?: string,
  status?: string,
  program?: string,
  plan?: MembershipPlanInfo | null,
): MembershipDetailsData {
  const memberStatus = getMemberStatus(status);
  const isFreeOrTrial = plan?.isTrial || membershipType === 'free' || membershipType === 'free-trial' || plan?.price === 0;

  // Use actual program from member data, or N/A if not set
  const displayProgram = program || 'N/A';
  // Use N/A for dates if not set
  const hasMembership = plan?.name || membershipType;
  const registrationDate = hasMembership ? 'Sep 01, 2025' : 'N/A';
  const startDate = hasMembership ? 'Sep 01, 2025' : 'N/A';

  // Base membership details
  const baseDetails = {
    status: memberStatus,
    program: displayProgram,
    registrationDate,
    startDate,
  };

  // If we have actual plan data, use it
  if (plan?.name) {
    const isPaid = plan.price && plan.price > 0;
    return {
      ...baseDetails,
      membershipType: plan.name,
      membershipFee: plan.price || 0,
      paymentFrequency: plan.frequency || 'N/A',
      nextPaymentDate: isPaid ? 'Oct 01, 2025' : 'N/A',
      nextPaymentAmount: plan.price || 0,
    };
  }

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

  // Fallback for legacy paid memberships
  return {
    ...baseDetails,
    membershipType: membershipType === 'annual' ? 'Annual' : 'Month-to-Month',
    membershipFee: membershipType === 'annual' ? 1800 : 300,
    paymentFrequency: membershipType === 'annual' ? 'Annual' : 'Monthly',
    nextPaymentDate: 'Oct 01, 2025',
    nextPaymentAmount: membershipType === 'annual' ? 1800 : 300,
  };
}

function buildMemberDataFromAPI(apiMember: Member & { membershipType?: string; program?: string }): MemberData {
  const memberName = `${apiMember.firstName || ''} ${apiMember.lastName || ''}`.trim() || 'Member';
  const memberStatus = getMemberStatus(apiMember.status);
  const membershipTypeStr = apiMember.membershipType || '';

  // Get membership plan details from currentMembership if available
  const currentPlan = apiMember.currentMembership?.membershipPlan;
  const planName = currentPlan?.name || null;
  const planPrice = currentPlan?.price ?? null;
  const planProgram = currentPlan?.program || apiMember.program;
  const planIsTrial = currentPlan?.isTrial;

  // Check if it's a free/trial membership
  const isFreeOrTrial = planIsTrial || membershipTypeStr === 'free' || membershipTypeStr === 'free-trial' || planPrice === 0;

  return {
    memberName,
    firstName: apiMember.firstName || '',
    lastName: apiMember.lastName || '',
    photoUrl: apiMember.photoUrl || undefined,
    billingContactRole: 'Billing Contact',
    membershipBadge: getMembershipBadgeText(membershipTypeStr, planName),
    amountOverdue: '$0',
    contactInfo: {
      phone: apiMember.phone || '',
      email: apiMember.email || '',
      street: apiMember.address?.street || '',
      city: apiMember.address?.city || '',
      state: apiMember.address?.state || '',
      zipCode: apiMember.address?.zipCode || '',
      country: apiMember.address?.country || 'US',
    },
    subscriptionDetails: {
      membershipType: getSubscriptionMembershipType(membershipTypeStr, planName),
      status: memberStatus,
      amount: getSubscriptionAmount(membershipTypeStr, planPrice),
      pastDuePayments: 0,
      lastPayment: isFreeOrTrial ? undefined : 'Last payment: N/A',
    },
    familyMembers: BASE_MOCK_DATA.familyMembers,
    membershipDetails: buildMembershipDetails(membershipTypeStr, apiMember.status, planProgram, currentPlan),
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
    | { type: 'UPDATE_NAME'; payload: { firstName: string; lastName: string } }
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
    case 'UPDATE_NAME': {
      if (!state.currentData) {
        return state;
      }
      const { firstName, lastName } = action.payload;
      const memberName = `${firstName} ${lastName}`.trim() || 'Member';
      return {
        ...state,
        currentData: {
          ...state.currentData,
          firstName,
          lastName,
          memberName,
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

  // State for edit contact info modal
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);

  // State for change membership modal
  const [isChangeMembershipModalOpen, setIsChangeMembershipModalOpen] = useState(false);
  const [membershipModalMode, setMembershipModalMode] = useState<'add' | 'change'>('add');

  // Get the current member from cache for membership info
  const currentMember: Member | undefined = members?.find(m => m.id === memberId);
  const currentMembership = currentMember?.currentMembership;
  const hasActiveMembership = currentMembership?.status === 'active';

  const handleOpenMembershipModal = (mode: 'add' | 'change') => {
    setMembershipModalMode(mode);
    setIsChangeMembershipModalOpen(true);
  };

  // Handler to sync tab from URL
  const syncTabFromUrl = useCallback(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'financial' || tabParam === 'overview' || tabParam === 'notes') {
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
          const membershipTypeToUse = (state.subscriptionType || member.membershipType) as 'free' | 'free-trial' | 'monthly' | 'annual' | undefined;
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

  const handleRemoveFamilyMember = useCallback((familyMemberId: string) => {
    dispatch({ type: 'REMOVE_FAMILY_MEMBER', payload: familyMemberId });
  }, []);

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
            {hasActiveMembership && state.currentData.membershipBadge && (
              <Badge variant="default">{state.currentData.membershipBadge}</Badge>
            )}
            {state.currentData.subscriptionDetails.pastDuePayments > 0 && (
              <Badge variant="destructive">{state.currentData.amountOverdue}</Badge>
            )}
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
          <button
            type="button"
            onClick={() => handleTabChange('notes')}
            className={`cursor-pointer pb-3 text-sm font-semibold transition-colors ${
              state.activeTab === 'notes'
                ? 'border-b-2 border-foreground text-foreground'
                : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {state.activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contact Information - Read Only Display */}
            <Card className="flex flex-col p-6">
              <div>
                <h2 className="mb-6 text-lg font-semibold text-foreground">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Address:</p>
                    <p className="text-sm text-foreground">
                      {state.currentData.contactInfo.street && `${state.currentData.contactInfo.street}, `}
                      {state.currentData.contactInfo.city && `${state.currentData.contactInfo.city} `}
                      {state.currentData.contactInfo.state && `${state.currentData.contactInfo.state} `}
                      {state.currentData.contactInfo.zipCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Phone:</p>
                    <p className="text-sm text-foreground">{state.currentData.contactInfo.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Email:</p>
                    <p className="text-sm text-foreground">{state.currentData.contactInfo.email || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-auto flex justify-end pt-6">
                <Button
                  className="w-fit bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => setIsEditContactModalOpen(true)}
                >
                  Edit Details
                </Button>
              </div>
            </Card>

            {/* Edit Contact Info Modal */}
            <EditContactInfoModal
              isOpen={isEditContactModalOpen}
              onClose={() => setIsEditContactModalOpen(false)}
              memberId={memberId}
              initialEmail={state.currentData.contactInfo.email || ''}
              initialPhone={state.currentData.contactInfo.phone || ''}
              initialAddress={
                state.currentData.contactInfo.street
                  ? {
                      street: state.currentData.contactInfo.street,
                      apartment: undefined,
                      city: state.currentData.contactInfo.city || '',
                      state: state.currentData.contactInfo.state || '',
                      zipCode: state.currentData.contactInfo.zipCode || '',
                      country: state.currentData.contactInfo.country || 'US',
                    }
                  : undefined
              }
            />

            {/* Membership Details - Read Only */}
            <Card className="flex flex-col p-6">
              <div>
                <h2 className="mb-6 text-lg font-semibold text-foreground">Membership Details</h2>
                {hasActiveMembership
                  ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {currentMembership?.membershipPlan?.name || state.currentData.subscriptionDetails.membershipType}
                            </h3>
                            <Badge variant={getStatusColor(state.currentData.subscriptionDetails.status)} className="mt-2">
                              {getStatusLabel(state.currentData.subscriptionDetails.status)}
                            </Badge>
                          </div>
                          {(currentMembership?.membershipPlan?.price || state.currentData.subscriptionDetails.amount) > 0 && (
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                $
                                {currentMembership?.membershipPlan?.price || state.currentData.subscriptionDetails.amount}
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
                    )
                  : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="text-muted-foreground">No membership assigned</p>
                        <p className="mt-1 text-sm text-muted-foreground">Add a membership plan for this member</p>
                      </div>
                    )}
              </div>
              <div className="mt-auto flex justify-end gap-3 pt-6">
                {hasActiveMembership
                  ? (
                      <>
                        <Button
                          className="w-fit bg-foreground text-background hover:bg-foreground/90"
                          onClick={() => handleOpenMembershipModal('change')}
                        >
                          Change Membership
                        </Button>
                        <Button variant="destructive" className="w-fit">
                          Hold
                        </Button>
                      </>
                    )
                  : (
                      <Button
                        className="w-fit bg-foreground text-background hover:bg-foreground/90"
                        onClick={() => handleOpenMembershipModal('add')}
                      >
                        Add Membership
                      </Button>
                    )}
              </div>
            </Card>

            {/* Change Membership Modal */}
            <ChangeMembershipModal
              isOpen={isChangeMembershipModalOpen}
              onClose={() => setIsChangeMembershipModalOpen(false)}
              memberId={memberId}
              currentMembershipPlanId={currentMembership?.membershipPlanId}
              mode={membershipModalMode}
            />
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

        </div>
      )}

      {state.activeTab === 'financial' && (
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

      {state.activeTab === 'notes' && (
        <MemberDetailNotes
          memberId={memberId}
          memberName={state.currentData.memberName}
          notes={MOCK_NOTES}
          onAddNote={content => console.info('New note added:', content)}
        />
      )}
    </div>
  );
}
