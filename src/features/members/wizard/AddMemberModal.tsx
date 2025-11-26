'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
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
  const { user } = useUser();
  const { organization } = useOrganization();

  const handleCancel = () => {
    wizard.reset();
    onCloseAction();
  };

  const handleSuccess = async () => {
    console.info('[Add Member Wizard] Member created successfully:', {
      timestamp: new Date().toISOString(),
      memberData: wizard.data,
    });
    wizard.reset();
    onCloseAction();
    router.refresh();
  };

  const handleFinalNext = async () => {
    try {
      wizard.setIsLoading(true);
      wizard.clearError();

      // Log authorization context
      console.info('[Add Member Wizard] Starting member creation with Clerk context:', {
        timestamp: new Date().toISOString(),
        user: {
          id: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          role: user?.publicMetadata?.role,
        },
        organization: {
          id: organization?.id,
          name: organization?.name,
          subscriptionPlan: organization?.publicMetadata?.subscriptionPlan,
        },
        wizardData: wizard.data,
      });

      // Verify authorization
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!organization) {
        throw new Error('User not part of an organization');
      }

      // Create the member with all collected data
      const createPayload = {
        email: wizard.data.email,
        firstName: wizard.data.firstName,
        lastName: wizard.data.lastName,
        phone: wizard.data.phone,
        memberType: wizard.data.memberType || undefined,
        subscriptionPlan: wizard.data.subscriptionPlan || undefined,
        address: wizard.data.address,
      };

      console.info('[Add Member Wizard] Member creation payload:', {
        timestamp: new Date().toISOString(),
        payload: createPayload,
      });

      await client.member.create(createPayload);

      // Move to success step
      wizard.nextStep();
    } catch (error) {
      console.error('[Add Member Wizard] Failed to create member:', {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        fullError: error,
      });
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
