import { useState } from 'react';

export type MemberType = 'individual' | 'family-member' | 'head-of-household';
type SubscriptionPlan = 'free-trial' | 'monthly' | 'annual';
export type PaymentMethod = 'card' | 'ach';

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
    zipCode: string;
    country: string;
  };

  // Step 3: Photo
  photoFile?: File | null;
  photoUrl?: string;

  // Step 4: Membership
  membershipPlanId: string | null;
  // Legacy fields (kept for backwards compatibility)
  subscriptionPlan?: SubscriptionPlan | null;
  subscriptionId?: string;

  // Step 5: Payment (only for monthly/annual plans)
  paymentMethod?: PaymentMethod;
  cardholderName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  achAccountHolder?: string;
  achRoutingNumber?: string;
  achAccountNumber?: string;
};

export type WizardStep = 'member-type' | 'details' | 'photo' | 'subscription' | 'payment' | 'success';

export const useAddMemberWizard = () => {
  const [step, setStep] = useState<WizardStep>('member-type');
  const [data, setData] = useState<AddMemberWizardData>({
    memberType: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    membershipPlanId: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = (updates: Partial<AddMemberWizardData>) => {
    setData((prev) => {
      const newData = { ...prev, ...updates };
      return newData;
    });
    setError(null);
  };

  const nextStep = () => {
    const steps: WizardStep[] = ['member-type', 'details', 'photo', 'subscription', 'payment', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1 && currentIndex !== -1) {
      const nextStepValue = steps[currentIndex + 1];
      if (nextStepValue) {
        setStep(nextStepValue);
        setError(null);
      }
    }
  };

  const previousStep = () => {
    const steps: WizardStep[] = ['member-type', 'details', 'photo', 'subscription', 'payment', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      const prevStepValue = steps[currentIndex - 1];
      if (prevStepValue) {
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
    setStep('member-type');
    setData({
      memberType: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      membershipPlanId: null,
      paymentMethod: undefined,
      cardholderName: undefined,
      cardNumber: undefined,
      cardExpiry: undefined,
      cardCvc: undefined,
      achAccountHolder: undefined,
      achRoutingNumber: undefined,
      achAccountNumber: undefined,
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
