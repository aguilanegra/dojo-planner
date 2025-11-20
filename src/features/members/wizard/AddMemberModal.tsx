'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddMemberWizard } from '@/hooks/useAddMemberWizard';
import { client } from '@/libs/Orpc';
import { MemberDetailsStep } from './MemberDetailsStep';
import { MemberPhotoStep } from './MemberPhotoStep';
import { MemberSubscriptionStep } from './MemberSubscriptionStep';
import { MemberSuccessStep } from './MemberSuccessStep';
import { MemberTypeStep } from './MemberTypeStep';

type AddMemberModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

export const AddMemberModal = ({ isOpen, onCloseAction }: AddMemberModalProps) => {
  const router = useRouter();
  const wizard = useAddMemberWizard();

  const handleCancel = () => {
    wizard.reset();
    onCloseAction();
  };

  const handleSuccess = async () => {
    wizard.reset();
    onCloseAction();
    router.refresh();
  };

  const handleFinalNext = async () => {
    try {
      wizard.setIsLoading(true);
      wizard.clearError();

      // Create the member with all collected data
      await client.member.create({
        email: wizard.data.email,
        firstName: wizard.data.firstName,
        lastName: wizard.data.lastName,
        phone: wizard.data.phone,
        memberType: wizard.data.memberType || undefined,
        subscriptionPlan: wizard.data.subscriptionPlan || undefined,
        address: wizard.data.address,
      });

      // Move to success step
      wizard.nextStep();
    } catch (error) {
      console.error('Failed to create member:', error);
      let errorMessage = 'Failed to create member. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      wizard.setError(errorMessage);
    } finally {
      wizard.setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && handleCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {wizard.step === 'member-type' && 'Choose Member Type'}
            {wizard.step === 'details' && 'Add Member Details'}
            {wizard.step === 'photo' && 'Add Member Photo'}
            {wizard.step === 'subscription' && 'Choose Membership Plan'}
            {wizard.step === 'success' && 'Success'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {wizard.step === 'member-type' && (
            <MemberTypeStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onCancel={handleCancel}
            />
          )}

          {wizard.step === 'details' && (
            <MemberDetailsStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'photo' && (
            <MemberPhotoStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
            />
          )}

          {wizard.step === 'subscription' && (
            <MemberSubscriptionStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={handleFinalNext}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              isLoading={wizard.isLoading}
            />
          )}

          {wizard.step === 'success' && (
            <MemberSuccessStep
              data={wizard.data}
              onDone={handleSuccess}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
