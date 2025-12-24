'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddMemberWizard } from '@/hooks/useAddMemberWizard';
import { client } from '@/libs/Orpc';
import { MemberDetailsStep } from './MemberDetailsStep';
import { MemberMembershipStep } from './MemberMembershipStep';
import { MemberPaymentStep } from './MemberPaymentStep';
import { MemberPhotoStep } from './MemberPhotoStep';
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
      // Build address object with only the fields needed
      const addressPayload = wizard.data.address
        ? {
            street: wizard.data.address.street,
            apartment: wizard.data.address.apartment,
            city: wizard.data.address.city,
            state: wizard.data.address.state,
            zipCode: wizard.data.address.zipCode,
            country: wizard.data.address.country,
          }
        : undefined;

      // Convert photo file to base64 data URL if present
      let photoUrl: string | undefined;
      if (wizard.data.photoFile) {
        photoUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(wizard.data.photoFile!);
        });
      }

      const createPayload = {
        email: wizard.data.email,
        firstName: wizard.data.firstName,
        lastName: wizard.data.lastName,
        phone: wizard.data.phone,
        ...(wizard.data.memberType && { memberType: wizard.data.memberType }),
        ...(wizard.data.membershipPlanId && { membershipPlanId: wizard.data.membershipPlanId }),
        ...(addressPayload && { address: addressPayload }),
        ...(photoUrl && { photoUrl }),
      };

      console.info('[Add Member Wizard] Member creation payload:', {
        timestamp: new Date().toISOString(),
        payload: createPayload,
        addressPayload,
        hasPhoto: !!photoUrl,
      });

      const result = await client.member.create(createPayload);
      console.info('[Add Member Wizard] Member created successfully:', {
        timestamp: new Date().toISOString(),
        result,
      });

      // Move to success step
      wizard.setStep('success');
    } catch (error) {
      console.error('[Add Member Wizard] Failed to create member:', {
        timestamp: new Date().toISOString(),
        errorType: typeof error,
        error: error instanceof Error ? error.message : String(error),
        errorObj: error,
        errorKeys: error && typeof error === 'object' ? Object.keys(error) : [],
      });
      let errorMessage = 'Failed to create member. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as any).message);
      }

      wizard.setError(errorMessage);
    } finally {
      wizard.setIsLoading(false);
    }
  };

  const handleSubscriptionNext = async () => {
    // For now, all membership plans go directly to member creation
    // Payment step can be added later for paid plans if needed
    await handleFinalNext();
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
            {wizard.step === 'payment' && 'Payment Information'}
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
            <MemberMembershipStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={handleSubscriptionNext}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              isLoading={wizard.isLoading}
            />
          )}

          {wizard.step === 'payment' && (
            <MemberPaymentStep
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
