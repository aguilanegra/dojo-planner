'use client';

import type { AddMemberWizardData, PaymentMethod } from '@/hooks/useAddMemberWizard';
import { CreditCard, Landmark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type MemberPaymentStepProps = {
  data: AddMemberWizardData;
  onUpdate: (updates: Partial<AddMemberWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const PAYMENT_AMOUNTS: Record<string, string> = {
  monthly: '$160',
  annual: '$1600',
};

const getPaymentAmount = (plan: string | null): string => {
  if (!plan || plan === 'free-trial' || plan === 'custom') {
    return '$0';
  }

  return PAYMENT_AMOUNTS[plan] || '$0';
};

export const MemberPaymentStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
  onCancel,
  isLoading = false,
}: MemberPaymentStepProps) => {
  const t = useTranslations('AddMemberWizard.MemberPaymentStep');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const paymentMethod = data.paymentMethod || 'card';
  const paymentAmount = getPaymentAmount(data.subscriptionPlan);

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    onUpdate({ paymentMethod: method });
  };

  // Card validation helpers for touched fields
  const isCardholderNameInvalid = touched.cardholderName && !data.cardholderName;
  const isCardNumberInvalid = touched.cardNumber && !data.cardNumber;
  const isCardExpiryInvalid = touched.cardExpiry && !data.cardExpiry;
  const isCardCvcInvalid = touched.cardCvc && !data.cardCvc;

  // ACH validation helpers for touched fields
  const isAchAccountHolderInvalid = touched.achAccountHolder && !data.achAccountHolder;
  const isAchRoutingNumberInvalid = touched.achRoutingNumber && !data.achRoutingNumber;
  const isAchAccountNumberInvalid = touched.achAccountNumber && !data.achAccountNumber;

  const isCardFormValid = paymentMethod === 'card'
    && data.cardholderName
    && data.cardNumber
    && data.cardExpiry
    && data.cardCvc;

  const isAchFormValid = paymentMethod === 'ach'
    && data.achAccountHolder
    && data.achRoutingNumber
    && data.achAccountNumber;

  const isFormValid = isCardFormValid || isAchFormValid;

  // Determine plan label and period for translations
  let planText = '';
  let periodText = '';
  if (data.subscriptionPlan === 'monthly') {
    planText = t('plan_monthly');
    periodText = t('period_month');
  } else if (data.subscriptionPlan === 'annual') {
    planText = t('plan_annual');
    periodText = t('period_year');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('pay_amount', { amount: paymentAmount })}</h2>
        <p className="text-sm text-muted-foreground">
          {t('payment_description', {
            plan: planText,
            amount: paymentAmount,
            period: periodText,
          })}
        </p>
      </div>

      {/* Payment Method Tabs */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handlePaymentMethodChange('card')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
            paymentMethod === 'card'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
          }`}
        >
          <CreditCard className="h-5 w-5" />
          <span className="font-medium">{t('card_tab_label')}</span>
        </button>

        <button
          type="button"
          onClick={() => handlePaymentMethodChange('ach')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
            paymentMethod === 'ach'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
          }`}
        >
          <Landmark className="h-5 w-5" />
          <span className="font-medium">{t('ach_tab_label')}</span>
        </button>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium">
              {t('cardholder_name_label')}
            </label>
            <Input
              id="cardholderName"
              placeholder={t('cardholder_name_placeholder')}
              value={data.cardholderName || ''}
              onChange={e => handleInputChange('cardholderName', e.target.value)}
              onBlur={() => handleInputBlur('cardholderName')}
              error={isCardholderNameInvalid}
              className="mt-1"
            />
            {isCardholderNameInvalid && (
              <p className="text-xs text-destructive">Please enter a cardholder name.</p>
            )}
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium">
              {t('card_number_label')}
            </label>
            <Input
              id="cardNumber"
              placeholder={t('card_number_placeholder')}
              value={data.cardNumber || ''}
              onChange={e => handleInputChange('cardNumber', e.target.value)}
              onBlur={() => handleInputBlur('cardNumber')}
              error={isCardNumberInvalid}
              className="mt-1"
            />
            {isCardNumberInvalid && (
              <p className="text-xs text-destructive">Please enter a card number.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardExpiry" className="block text-sm font-medium">
                {t('card_expiry_label')}
              </label>
              <Input
                id="cardExpiry"
                placeholder={t('card_expiry_placeholder')}
                value={data.cardExpiry || ''}
                onChange={e => handleInputChange('cardExpiry', e.target.value)}
                onBlur={() => handleInputBlur('cardExpiry')}
                error={isCardExpiryInvalid}
                className="mt-1"
              />
              {isCardExpiryInvalid && (
                <p className="text-xs text-destructive">Please enter an expiration date.</p>
              )}
            </div>

            <div>
              <label htmlFor="cardCvc" className="block text-sm font-medium">
                {t('card_cvc_label')}
              </label>
              <Input
                id="cardCvc"
                placeholder={t('card_cvc_placeholder')}
                value={data.cardCvc || ''}
                onChange={e => handleInputChange('cardCvc', e.target.value)}
                onBlur={() => handleInputBlur('cardCvc')}
                error={isCardCvcInvalid}
                className="mt-1"
              />
              {isCardCvcInvalid && (
                <p className="text-xs text-destructive">Please enter a CVC.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACH Payment Form */}
      {paymentMethod === 'ach' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="achAccountHolder" className="block text-sm font-medium">
              {t('ach_account_holder_label')}
            </label>
            <Input
              id="achAccountHolder"
              placeholder={t('ach_account_holder_placeholder')}
              value={data.achAccountHolder || ''}
              onChange={e => handleInputChange('achAccountHolder', e.target.value)}
              onBlur={() => handleInputBlur('achAccountHolder')}
              error={isAchAccountHolderInvalid}
              className="mt-1"
            />
            {isAchAccountHolderInvalid && (
              <p className="text-xs text-destructive">Please enter an account holder name.</p>
            )}
          </div>

          <div>
            <label htmlFor="achRoutingNumber" className="block text-sm font-medium">
              {t('ach_routing_number_label')}
            </label>
            <Input
              id="achRoutingNumber"
              placeholder={t('ach_routing_number_placeholder')}
              value={data.achRoutingNumber || ''}
              onChange={e => handleInputChange('achRoutingNumber', e.target.value)}
              onBlur={() => handleInputBlur('achRoutingNumber')}
              error={isAchRoutingNumberInvalid}
              className="mt-1"
            />
            {isAchRoutingNumberInvalid && (
              <p className="text-xs text-destructive">Please enter a routing number.</p>
            )}
          </div>

          <div>
            <label htmlFor="achAccountNumber" className="block text-sm font-medium">
              {t('ach_account_number_label')}
            </label>
            <Input
              id="achAccountNumber"
              placeholder={t('ach_account_number_placeholder')}
              value={data.achAccountNumber || ''}
              onChange={e => handleInputChange('achAccountNumber', e.target.value)}
              onBlur={() => handleInputBlur('achAccountNumber')}
              error={isAchAccountNumberInvalid}
              className="mt-1"
            />
            {isAchAccountNumberInvalid && (
              <p className="text-xs text-destructive">Please enter an account number.</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            {t('back_button')}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {t('cancel_button')}
          </Button>
        </div>
        <Button onClick={onNext} disabled={!isFormValid || isLoading}>
          {isLoading ? `${t('pay_button')}...` : t('pay_button')}
        </Button>
      </div>
    </div>
  );
};
