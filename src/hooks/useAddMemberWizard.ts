import { useState } from 'react';

export type MemberType = 'individual' | 'family-member' | 'head-of-household';
export type SubscriptionPlan = 'free-trial' | 'monthly' | 'annual' | 'custom';

export type AddMemberWizardData = {
  // Step 1: Member Type
  memberType: MemberType | null;

  // Step 2: Member Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    country: string;
  };

  // Step 3: Photo
  photoFile?: File | null;
  photoUrl?: string;

  // Step 4: Subscription
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionId?: string;
};

export type WizardStep = 'member-type' | 'details' | 'photo' | 'subscription' | 'success';

export const useAddMemberWizard = () => {
  const [step, setStep] = useState<WizardStep>('member-type');
  const [data, setData] = useState<AddMemberWizardData>({
    memberType: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subscriptionPlan: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = (updates: Partial<AddMemberWizardData>) => {
    setData((prev) => {
      const newData = { ...prev, ...updates };
      console.error('[Add Member Wizard] Data Updated:', {
        timestamp: new Date().toISOString(),
        updates,
        currentData: newData,
      });
      return newData;
    });
    setError(null);
  };

  const nextStep = () => {
    const steps: WizardStep[] = ['member-type', 'details', 'photo', 'subscription', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1 && currentIndex !== -1) {
      const nextStepValue = steps[currentIndex + 1];
      if (nextStepValue) {
        console.error('[Add Member Wizard] Step Changed:', {
          timestamp: new Date().toISOString(),
          from: step,
          to: nextStepValue,
          data,
        });
        setStep(nextStepValue);
        setError(null);
      }
    }
  };

  const previousStep = () => {
    const steps: WizardStep[] = ['member-type', 'details', 'photo', 'subscription', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      const prevStepValue = steps[currentIndex - 1];
      if (prevStepValue) {
        console.error('[Add Member Wizard] Step Changed (Back):', {
          timestamp: new Date().toISOString(),
          from: step,
          to: prevStepValue,
        });
        setStep(prevStepValue);
        setError(null);
      }
    }
  };

  const setErrorMessage = (message: string) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  const reset = () => {
    console.error('[Add Member Wizard] Wizard Reset:', {
      timestamp: new Date().toISOString(),
    });
    setStep('member-type');
    setData({
      memberType: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subscriptionPlan: null,
    });
    setError(null);
    setIsLoading(false);
  };

  return {
    step,
    setStep,
    data,
    updateData,
    nextStep,
    previousStep,
    reset,
    error,
    setError: setErrorMessage,
    clearError,
    isLoading,
    setIsLoading,
  };
};
