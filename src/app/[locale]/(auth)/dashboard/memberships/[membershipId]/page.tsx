'use client';

import type {
  AutoRenewalOption,
  ChargeSignUpFeeOption,
  ContractLength,
  MembershipStatus,
  MembershipType,
  PaymentFrequency,
} from '@/hooks/useAddMembershipWizard';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteMembershipAlertDialog } from '@/features/memberships/details/DeleteMembershipAlertDialog';
import { EditAssociatedProgramModal } from '@/features/memberships/details/EditAssociatedProgramModal';
import { EditContractTermsModal } from '@/features/memberships/details/EditContractTermsModal';
import { EditMembershipBasicsModal } from '@/features/memberships/details/EditMembershipBasicsModal';
import { EditPaymentDetailsModal } from '@/features/memberships/details/EditPaymentDetailsModal';
import { MembershipAssociatedProgramCard } from '@/features/memberships/details/MembershipAssociatedProgramCard';
import { MembershipBasicsCard } from '@/features/memberships/details/MembershipBasicsCard';
import { MembershipContractTermsCard } from '@/features/memberships/details/MembershipContractTermsCard';
import { MembershipPaymentDetailsCard } from '@/features/memberships/details/MembershipPaymentDetailsCard';
import { MembershipStatsCard } from '@/features/memberships/details/MembershipStatsCard';

// Membership data type matching the wizard data structure
export type MembershipDetailData = {
  id: string;
  // Basics
  membershipName: string;
  status: MembershipStatus;
  membershipType: MembershipType;
  description: string;
  category: string;
  // Associated Program
  associatedProgramId: string | null;
  associatedProgramName: string | null;
  // Payment Details
  signUpFee: number | null;
  chargeSignUpFee: ChargeSignUpFeeOption;
  monthlyFee: number | null;
  paymentFrequency: PaymentFrequency;
  proRateFirstPayment: boolean;
  // Contract Terms
  contractLength: ContractLength;
  autoRenewal: AutoRenewalOption;
  cancellationFee: number | null;
  holdLimitPerYear: number | null;
  // Stats (read-only)
  activeCount: number;
  revenue: string;
};

// Mock data for memberships - matching the landing page mock data
const mockMembershipDetails: Record<string, MembershipDetailData> = {
  1: {
    id: '1',
    membershipName: '12 Month Commitment (Gold)',
    status: 'active',
    membershipType: 'standard',
    description: 'Our most popular membership option for dedicated practitioners. Includes unlimited access to all adult BJJ classes with a 12-month commitment for the best monthly rate.',
    category: 'Adult Brazilian Jiu-Jitsu',
    associatedProgramId: '1',
    associatedProgramName: 'Adult Brazilian Jiu-jitsu',
    signUpFee: 35,
    chargeSignUpFee: 'at-registration',
    monthlyFee: 150,
    paymentFrequency: 'monthly',
    proRateFirstPayment: true,
    contractLength: '12-months',
    autoRenewal: 'month-to-month',
    cancellationFee: 300,
    holdLimitPerYear: 2,
    activeCount: 89,
    revenue: '$13,350/mo revenue',
  },
  2: {
    id: '2',
    membershipName: 'Month to Month (Gold)',
    status: 'active',
    membershipType: 'standard',
    description: 'Flexible month-to-month membership with no long-term commitment. Perfect for those who need flexibility in their training schedule.',
    category: 'Adult Brazilian Jiu-Jitsu',
    associatedProgramId: '1',
    associatedProgramName: 'Adult Brazilian Jiu-jitsu',
    signUpFee: 35,
    chargeSignUpFee: 'at-registration',
    monthlyFee: 170,
    paymentFrequency: 'monthly',
    proRateFirstPayment: false,
    contractLength: 'month-to-month',
    autoRenewal: 'none',
    cancellationFee: null,
    holdLimitPerYear: 1,
    activeCount: 52,
    revenue: '$9,100/mo revenue',
  },
  3: {
    id: '3',
    membershipName: '7-Day Free Trial',
    status: 'active',
    membershipType: 'trial',
    description: 'Experience our academy for free! New students can try up to 3 classes over 7 days to see if BJJ is right for them.',
    category: 'Adult Brazilian Jiu-Jitsu',
    associatedProgramId: '1',
    associatedProgramName: 'Adult Brazilian Jiu-jitsu',
    signUpFee: null,
    chargeSignUpFee: 'at-registration',
    monthlyFee: null,
    paymentFrequency: 'monthly',
    proRateFirstPayment: false,
    contractLength: 'month-to-month',
    autoRenewal: 'none',
    cancellationFee: null,
    holdLimitPerYear: null,
    activeCount: 23,
    revenue: '15 Converted This Month',
  },
  4: {
    id: '4',
    membershipName: 'Kids Monthly',
    status: 'active',
    membershipType: 'standard',
    description: 'Monthly membership for our kids program. Includes access to all kids BJJ classes with age-appropriate instruction.',
    category: 'Kids Program',
    associatedProgramId: '2',
    associatedProgramName: 'Kids Program',
    signUpFee: 25,
    chargeSignUpFee: 'at-registration',
    monthlyFee: 95,
    paymentFrequency: 'monthly',
    proRateFirstPayment: false,
    contractLength: 'month-to-month',
    autoRenewal: 'none',
    cancellationFee: null,
    holdLimitPerYear: 2,
    activeCount: 34,
    revenue: '$3,230/mo revenue',
  },
  5: {
    id: '5',
    membershipName: 'Kids Free Trial Week',
    status: 'active',
    membershipType: 'trial',
    description: 'Let your child try BJJ for free! Two classes over one week to see if they enjoy training.',
    category: 'Kids Program',
    associatedProgramId: '2',
    associatedProgramName: 'Kids Program',
    signUpFee: null,
    chargeSignUpFee: 'at-registration',
    monthlyFee: null,
    paymentFrequency: 'monthly',
    proRateFirstPayment: false,
    contractLength: 'month-to-month',
    autoRenewal: 'none',
    cancellationFee: null,
    holdLimitPerYear: null,
    activeCount: 8,
    revenue: '6 Converted This Month',
  },
  6: {
    id: '6',
    membershipName: 'Competition Team',
    status: 'active',
    membershipType: 'standard',
    description: 'For serious competitors. Includes unlimited access to all classes plus exclusive competition team training sessions.',
    category: 'Competition Team',
    associatedProgramId: '3',
    associatedProgramName: 'Competition Team',
    signUpFee: 50,
    chargeSignUpFee: 'at-registration',
    monthlyFee: 200,
    paymentFrequency: 'monthly',
    proRateFirstPayment: true,
    contractLength: '6-months',
    autoRenewal: 'month-to-month',
    cancellationFee: 200,
    holdLimitPerYear: 1,
    activeCount: 16,
    revenue: '$3,200/mo revenue',
  },
  7: {
    id: '7',
    membershipName: '6 Month Commitment (Silver)',
    status: 'inactive',
    membershipType: 'standard',
    description: 'Previously offered 6-month commitment plan. This membership is no longer available for new sign-ups.',
    category: 'Adult Brazilian Jiu-Jitsu',
    associatedProgramId: '1',
    associatedProgramName: 'Adult Brazilian Jiu-jitsu',
    signUpFee: 35,
    chargeSignUpFee: 'at-registration',
    monthlyFee: 165,
    paymentFrequency: 'monthly',
    proRateFirstPayment: false,
    contractLength: '6-months',
    autoRenewal: 'none',
    cancellationFee: 150,
    holdLimitPerYear: 1,
    activeCount: 0,
    revenue: 'Discontinued',
  },
};

type PageParams = {
  membershipId: string;
};

export default function MembershipDetailPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const t = useTranslations('MembershipDetailPage');
  const router = useRouter();

  // Modal states
  const [isEditBasicsOpen, setIsEditBasicsOpen] = useState(false);
  const [isEditAssociatedProgramOpen, setIsEditAssociatedProgramOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [isEditContractOpen, setIsEditContractOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get membership data (in real app, this would come from an API)
  const [membershipData, setMembershipData] = useState<MembershipDetailData | null>(
    mockMembershipDetails[resolvedParams.membershipId] || null,
  );

  const isTrial = membershipData?.membershipType === 'trial';

  // Check if deletion is allowed (must be inactive with zero members)
  const canDelete = membershipData?.status === 'inactive' && membershipData?.activeCount === 0;

  // Handler for updating membership data
  const handleUpdateMembership = (updates: Partial<MembershipDetailData>) => {
    if (membershipData) {
      setMembershipData({ ...membershipData, ...updates });
    }
  };

  // Handler for deleting membership
  const handleDeleteMembership = () => {
    // In a real app, this would call an API to delete the membership
    router.push('/dashboard/memberships');
  };

  // Format price for display
  const formattedPrice = useMemo(() => {
    if (!membershipData) {
      return '';
    }
    if (membershipData.monthlyFee === null || membershipData.monthlyFee === 0) {
      return t('price_free');
    }
    const frequencySuffix = {
      monthly: '/mo',
      weekly: '/wk',
      annually: '/yr',
    }[membershipData.paymentFrequency];
    return `$${membershipData.monthlyFee.toFixed(2)}${frequencySuffix}`;
  }, [membershipData, t]);

  if (!membershipData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">{t('not_found')}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/memberships">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_memberships')}
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">{membershipData.membershipName}</h1>
        <p className="text-lg text-muted-foreground">{membershipData.category}</p>
      </div>

      {/* Stats Card */}
      <MembershipStatsCard
        activeCount={membershipData.activeCount}
        revenue={membershipData.revenue}
        isTrial={isTrial}
        price={formattedPrice}
      />

      {/* Detail Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Membership Basics Card */}
        <MembershipBasicsCard
          membershipName={membershipData.membershipName}
          status={membershipData.status}
          membershipType={membershipData.membershipType}
          description={membershipData.description}
          onEdit={() => setIsEditBasicsOpen(true)}
        />

        {/* Associated Program Card */}
        <MembershipAssociatedProgramCard
          associatedProgramId={membershipData.associatedProgramId}
          associatedProgramName={membershipData.associatedProgramName}
          onEdit={() => setIsEditAssociatedProgramOpen(true)}
        />

        {/* Payment Details Card */}
        <MembershipPaymentDetailsCard
          signUpFee={membershipData.signUpFee}
          chargeSignUpFee={membershipData.chargeSignUpFee}
          monthlyFee={membershipData.monthlyFee}
          paymentFrequency={membershipData.paymentFrequency}
          proRateFirstPayment={membershipData.proRateFirstPayment}
          isTrial={isTrial}
          onEdit={() => setIsEditPaymentOpen(true)}
        />

        {/* Contract Terms Card */}
        <MembershipContractTermsCard
          contractLength={membershipData.contractLength}
          autoRenewal={membershipData.autoRenewal}
          cancellationFee={membershipData.cancellationFee}
          holdLimitPerYear={membershipData.holdLimitPerYear}
          onEdit={() => setIsEditContractOpen(true)}
        />
      </div>

      {/* Edit Modals */}
      <EditMembershipBasicsModal
        isOpen={isEditBasicsOpen}
        onClose={() => setIsEditBasicsOpen(false)}
        membershipName={membershipData.membershipName}
        status={membershipData.status}
        membershipType={membershipData.membershipType}
        description={membershipData.description}
        onSave={(data) => {
          handleUpdateMembership(data);
          setIsEditBasicsOpen(false);
        }}
      />

      <EditAssociatedProgramModal
        isOpen={isEditAssociatedProgramOpen}
        onClose={() => setIsEditAssociatedProgramOpen(false)}
        associatedProgramId={membershipData.associatedProgramId}
        onSave={(data) => {
          handleUpdateMembership(data);
          setIsEditAssociatedProgramOpen(false);
        }}
      />

      <EditPaymentDetailsModal
        isOpen={isEditPaymentOpen}
        onClose={() => setIsEditPaymentOpen(false)}
        signUpFee={membershipData.signUpFee}
        chargeSignUpFee={membershipData.chargeSignUpFee}
        monthlyFee={membershipData.monthlyFee}
        paymentFrequency={membershipData.paymentFrequency}
        proRateFirstPayment={membershipData.proRateFirstPayment}
        isTrial={isTrial}
        onSave={(data) => {
          handleUpdateMembership(data);
          setIsEditPaymentOpen(false);
        }}
      />

      <EditContractTermsModal
        isOpen={isEditContractOpen}
        onClose={() => setIsEditContractOpen(false)}
        contractLength={membershipData.contractLength}
        autoRenewal={membershipData.autoRenewal}
        cancellationFee={membershipData.cancellationFee}
        holdLimitPerYear={membershipData.holdLimitPerYear}
        onSave={(data) => {
          handleUpdateMembership(data);
          setIsEditContractOpen(false);
        }}
      />

      {/* Delete Button - only shown if inactive and no members */}
      {canDelete && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('delete_button')}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteMembershipAlertDialog
        isOpen={isDeleteDialogOpen}
        membershipName={membershipData.membershipName}
        onCloseAction={() => setIsDeleteDialogOpen(false)}
        onConfirmAction={handleDeleteMembership}
      />
    </div>
  );
}
