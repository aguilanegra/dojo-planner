'use client';

import type { AddMemberWizardData, SubscriptionPlan } from '@/hooks/useAddMemberWizard';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

type MemberSubscriptionStepProps = {
  data: AddMemberWizardData;
  onUpdate: (updates: Partial<AddMemberWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export const MemberSubscriptionStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
  onCancel,
  isLoading = false,
}: MemberSubscriptionStepProps) => {
  const t = useTranslations('AddMemberWizard.MemberSubscriptionStep');

  const subscriptionPlans: {
    id: SubscriptionPlan;
    label: string;
    description: string;
    price?: string;
  }[] = [
    {
      id: 'free-trial',
      label: t('free_trial_label'),
      description: t('free_trial_description'),
    },
    {
      id: 'monthly',
      label: t('monthly_label'),
      description: t('monthly_description'),
      price: t('monthly_price'),
    },
    {
      id: 'annual',
      label: t('annual_label'),
      description: t('annual_description'),
      price: t('annual_price'),
    },
    {
      id: 'custom',
      label: t('custom_label'),
      description: t('custom_description'),
    },
  ];

  const handleSelect = (plan: SubscriptionPlan) => {
    onUpdate({ subscriptionPlan: plan });
  };

  const handleNext = () => {
    if (data.subscriptionPlan) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-3">
        {subscriptionPlans.map(plan => (
          <button
            key={plan.id}
            type="button"
            onClick={() => handleSelect(plan.id)}
            className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
              data.subscriptionPlan === plan.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{plan.label}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              {plan.price && <span className="text-sm font-semibold text-foreground">{plan.price}</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between gap-3 pt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            {t('back_button')}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {t('cancel_button')}
          </Button>
        </div>
        <Button onClick={handleNext} disabled={!data.subscriptionPlan || isLoading}>
          {isLoading ? `${t('next_button')}...` : t('next_button')}
        </Button>
      </div>
    </div>
  );
};
