'use client';

import type { MembershipCardProps } from '@/templates/MembershipCard';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddMembershipWizard } from '@/hooks/useAddMembershipWizard';
import { MembershipBasicsStep } from './MembershipBasicsStep';
import { MembershipClassAccessStep } from './MembershipClassAccessStep';
import { MembershipContractStep } from './MembershipContractStep';
import { MembershipPaymentStep } from './MembershipPaymentStep';
import { MembershipSuccessStep } from './MembershipSuccessStep';

type AddMembershipModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  onMembershipCreated?: (newMembership: MembershipCardProps) => void;
};

export const AddMembershipModal = ({ isOpen, onCloseAction, onMembershipCreated }: AddMembershipModalProps) => {
  const router = useRouter();
  const wizard = useAddMembershipWizard();
  const t = useTranslations('AddMembershipWizard');

  const handleCancel = () => {
    wizard.reset();
    onCloseAction();
  };

  const handleSuccess = () => {
    console.info('[Add Membership Wizard] Membership created successfully:', {
      timestamp: new Date().toISOString(),
      membershipData: wizard.data,
    });
    wizard.reset();
    onCloseAction();
    router.refresh();
  };

  const handleFinalStep = async () => {
    try {
      wizard.setIsLoading(true);
      wizard.clearError();

      // Log creation (mock)
      console.info('[Add Membership Wizard] Starting membership creation:', {
        timestamp: new Date().toISOString(),
        wizardData: wizard.data,
      });

      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create the mock membership object
      const formatPrice = () => {
        if (wizard.data.monthlyFee === null || wizard.data.monthlyFee === 0) {
          return 'Free';
        }
        return `$${wizard.data.monthlyFee.toFixed(2)}/mo`;
      };

      const formatSignupFee = () => {
        if (wizard.data.signUpFee === null || wizard.data.signUpFee === 0) {
          return 'No signup fee';
        }
        return `$${wizard.data.signUpFee.toFixed(2)} signup fee`;
      };

      const getFrequency = () => {
        switch (wizard.data.paymentFrequency) {
          case 'monthly':
            return 'Monthly';
          case 'weekly':
            return 'Weekly';
          case 'annually':
            return 'Annually';
          default:
            return 'Monthly';
        }
      };

      const getContract = () => {
        switch (wizard.data.contractLength) {
          case 'month-to-month':
            return 'Month-to-Month';
          case '3-months':
            return '3 Months';
          case '6-months':
            return '6 Months';
          case '12-months':
            return '12 Months';
          default:
            return 'Month-to-Month';
        }
      };

      const getAccess = () => {
        if (wizard.data.classLimitType === 'unlimited') {
          return 'Unlimited';
        }
        return `${wizard.data.classLimitCount} Classes/mo`;
      };

      const newMembership: MembershipCardProps = {
        id: `membership-${Date.now()}`,
        name: wizard.data.membershipName,
        category: wizard.data.membershipType === 'trial' ? 'Trial Membership' : 'Standard Membership',
        status: wizard.data.status === 'active' ? 'Active' : 'Inactive',
        isTrial: wizard.data.membershipType === 'trial',
        isMonthly: wizard.data.paymentFrequency === 'monthly',
        price: formatPrice(),
        signupFee: formatSignupFee(),
        frequency: getFrequency(),
        contract: getContract(),
        access: getAccess(),
        activeCount: 0,
        revenue: '$0/mo revenue',
      };

      console.info('[Add Membership Wizard] Membership created successfully:', {
        timestamp: new Date().toISOString(),
        newMembership,
      });

      // Notify parent about the new membership
      if (onMembershipCreated) {
        onMembershipCreated(newMembership);
      }

      // Move to success step
      wizard.setStep('success');
    } catch (err) {
      console.error('[Add Membership Wizard] Failed to create membership:', {
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
      });
      wizard.setError('Failed to create membership. Please try again.');
    } finally {
      wizard.setIsLoading(false);
    }
  };

  const getDialogTitle = () => {
    switch (wizard.step) {
      case 'basics':
        return t('step_basics_title');
      case 'class-access':
        return t('step_class_access_title');
      case 'payment-details':
        return t('step_payment_details_title');
      case 'contract-terms':
        return t('step_contract_terms_title');
      case 'success':
        return t('step_success_title');
      default:
        return t('modal_title');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && handleCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {wizard.step === 'basics' && (
            <MembershipBasicsStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'class-access' && (
            <MembershipClassAccessStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'payment-details' && (
            <MembershipPaymentStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'contract-terms' && (
            <MembershipContractStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={handleFinalStep}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              isLoading={wizard.isLoading}
              error={wizard.error}
            />
          )}

          {wizard.step === 'success' && (
            <MembershipSuccessStep
              data={wizard.data}
              onDone={handleSuccess}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
