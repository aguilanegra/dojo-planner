'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { MemberBreadcrumb } from '@/components/ui/breadcrumb/MemberBreadcrumb';
import { MemberDetailFinancial } from '@/features/members/details/MemberDetailFinancial';
import { MemberDetailOverview } from '@/features/members/details/MemberDetailOverview';

type Tab = 'overview' | 'financial';

// Mock data generator - in real application this would come from the API
function generateMockMemberData(memberId: string) {
  return {
    memberId,
    memberName: 'Anika Smith',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anika',
    billingContactRole: 'Billing Contact',
    membershipBadge: 'Monthly Member',
    amountOverdue: '$45 Overdue',
    contactInfo: {
      address: '1234 S Side Road, San Francisco CA 94125',
      phone: '(415) 223-4123',
      email: 'email@example.com',
    },
    subscriptionDetails: {
      membershipType: 'Monthly Membership',
      status: 'active' as const,
      amount: 160,
      pastDuePayments: 0,
      lastPayment: 'Last payment: Sep 1, 2025',
    },
    membershipDetails: {
      status: 'active' as const,
      program: 'Caio Terra Academy Palo Alto (Adults)',
      membershipType: 'Month-to-Month',
      membershipFee: 300,
      paymentFrequency: 'Monthly',
      registrationDate: 'Sep 01, 2025',
      startDate: 'Sep 01, 2025',
      nextPaymentDate: 'Oct 01, 2025',
      nextPaymentAmount: 300,
    },
    paymentMethod: {
      last4: '0046',
      brand: 'Visa',
      isDefault: true,
    },
    agreement: {
      signedDate: 'Sep 01, 2025',
      status: 'signed' as const,
    },
    familyMembers: [
      {
        id: '2',
        name: 'John Smith',
        relationship: 'Family Member',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        membershipType: 'Monthly Membership',
        status: 'active' as const,
        amount: 160,
      },
      {
        id: '3',
        name: 'Emma Smith',
        relationship: 'Family Member',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        membershipType: 'Youth Membership',
        status: 'active' as const,
        amount: 80,
      },
      {
        id: '4',
        name: 'Jake Smith',
        relationship: 'Family Member',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',
        membershipType: 'Youth Membership',
        status: 'on-hold' as const,
        amount: 80,
      },
    ],
    billingHistory: [
      {
        id: '1',
        date: 'Apr 15, 2025',
        member: 'Family Membership',
        amount: 480,
        purpose: 'Monthly Family Dues',
        method: 'Card ending •••• 1234',
        groupType: 'family' as const,
        children: [
          {
            id: '1-1',
            date: 'Apr 15, 2025',
            member: 'Anika Smith',
            amount: 160,
            purpose: 'Monthly membership',
            method: 'Card ending •••• 1234',
          },
          {
            id: '1-2',
            date: 'Apr 15, 2025',
            member: 'John Smith',
            amount: 160,
            purpose: 'Monthly membership',
            method: 'Card ending •••• 1234',
          },
          {
            id: '1-3',
            date: 'Apr 15, 2025',
            member: 'Emma Smith',
            amount: 80,
            purpose: 'Youth membership',
            method: 'Card ending •••• 1234',
          },
          {
            id: '1-4',
            date: 'Apr 15, 2025',
            member: 'Jake Smith',
            amount: 80,
            purpose: 'Youth membership',
            method: 'Card ending •••• 1234',
          },
        ],
      },
      {
        id: '2',
        date: 'Mar 15, 2025',
        member: 'Family Membership',
        amount: 480,
        purpose: 'Monthly Family Dues',
        method: 'Card ending •••• 1234',
        groupType: 'family' as const,
        children: [],
      },
    ],
  };
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params?.memberId as string;

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Mock data - in real app this would be fetched from API
  const memberData = generateMockMemberData(memberId);

  const handleEditDetails = () => {
    console.warn('Edit details for member:', memberId);
  };

  const handleAddFamilyMember = () => {
    console.warn('Add family member for:', memberId);
  };

  const handleChangeMembership = () => {
    console.warn('Change membership for:', memberId);
  };

  const handleHoldMembership = () => {
    console.warn('Hold membership for:', memberId);
  };

  const handleSendSecureLink = () => {
    console.warn('Send secure link to member:', memberId);
  };

  const handleDownloadAgreement = () => {
    console.warn('Download agreement for member:', memberId);
  };

  const handleRefund = (itemId: string) => {
    console.warn('Refund for item:', itemId);
  };

  const handleBackToMembers = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <MemberBreadcrumb
        memberName={memberData.memberName}
        onBackClick={handleBackToMembers}
      />
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`cursor-pointer pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-foreground text-foreground'
                : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`cursor-pointer pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'financial'
                ? 'border-b-2 border-foreground text-foreground'
                : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Financial
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview'
        ? (
            <MemberDetailOverview
              memberId={memberId}
              memberName={memberData.memberName}
              photoUrl={memberData.photoUrl}
              billingContactRole={memberData.billingContactRole}
              membershipBadge={memberData.membershipBadge}
              amountOverdue={memberData.amountOverdue}
              contactInfo={memberData.contactInfo}
              subscriptionDetails={memberData.subscriptionDetails}
              familyMembers={memberData.familyMembers}
              onEditDetails={handleEditDetails}
              onAddFamilyMember={handleAddFamilyMember}
              onChangeMembership={handleChangeMembership}
              onHoldMembership={handleHoldMembership}
            />
          )
        : (
            <MemberDetailFinancial
              memberId={memberId}
              memberName={memberData.memberName}
              photoUrl={memberData.photoUrl}
              billingContactRole={memberData.billingContactRole}
              membershipBadge={memberData.membershipBadge}
              amountOverdue={memberData.amountOverdue}
              membershipDetails={memberData.membershipDetails}
              paymentMethod={memberData.paymentMethod}
              agreement={memberData.agreement}
              billingHistory={memberData.billingHistory}
              onChangeMembership={handleChangeMembership}
              onSendSecureLink={handleSendSecureLink}
              onDownloadAgreement={handleDownloadAgreement}
              onRefund={handleRefund}
            />
          )}
    </div>
  );
}
