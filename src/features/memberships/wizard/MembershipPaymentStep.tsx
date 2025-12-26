'use client';

import type {
  AddMembershipWizardData,
  ChargeSignUpFeeOption,
  MembershipStartDateOption,
  PaymentFrequency,
} from '@/hooks/useAddMembershipWizard';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type MembershipPaymentStepProps = {
  data: AddMembershipWizardData;
  onUpdate: (updates: Partial<AddMembershipWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  error?: string | null;
};

export const MembershipPaymentStep = ({ data, onUpdate, onNext, onBack, onCancel, error }: MembershipPaymentStepProps) => {
  const t = useTranslations('AddMembershipWizard.MembershipPaymentStep');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleNumberChange = (field: keyof AddMembershipWizardData, value: string) => {
    const numValue = value ? Number.parseFloat(value) : null;
    onUpdate({ [field]: numValue });
  };

  // For trial memberships, payment details are optional (can be $0)
  // For standard memberships, monthly fee is required
  const isTrialMembership = data.membershipType === 'trial';

  const isMonthlyFeeInvalid = touched.monthlyFee
    && !isTrialMembership
    && (data.monthlyFee === null || data.monthlyFee < 0);

  const isFormValid = isTrialMembership || (data.monthlyFee !== null && data.monthlyFee >= 0);

  // Get the appropriate fee label based on payment frequency
  const getFeeLabel = () => {
    switch (data.paymentFrequency) {
      case 'weekly':
        return t('weekly_fee_label');
      case 'annually':
        return t('annual_fee_label');
      default:
        return t('monthly_fee_label');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Sign-up Fee and Charge Option */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('signup_fee_label')}</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder={t('signup_fee_placeholder')}
                value={data.signUpFee ?? ''}
                onChange={e => handleNumberChange('signUpFee', e.target.value)}
                className="pl-7"
                min={0}
                step="0.01"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('charge_signup_fee_label')}</label>
            <Select
              value={data.chargeSignUpFee}
              onValueChange={(value: ChargeSignUpFeeOption) => onUpdate({ chargeSignUpFee: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="at-registration">{t('charge_at_registration')}</SelectItem>
                <SelectItem value="first-payment">{t('charge_first_payment')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fee and Payment Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{getFeeLabel()}</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder={t('monthly_fee_placeholder')}
                value={data.monthlyFee ?? ''}
                onChange={e => handleNumberChange('monthlyFee', e.target.value)}
                onBlur={() => handleInputBlur('monthlyFee')}
                error={isMonthlyFeeInvalid}
                className="pl-7"
                min={0}
                step="0.01"
              />
            </div>
            {isMonthlyFeeInvalid && (
              <p className="text-xs text-destructive">{t('monthly_fee_error')}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('payment_frequency_label')}</label>
            <Select
              value={data.paymentFrequency}
              onValueChange={(value: PaymentFrequency) => onUpdate({ paymentFrequency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{t('frequency_monthly')}</SelectItem>
                <SelectItem value="weekly">{t('frequency_weekly')}</SelectItem>
                <SelectItem value="annually">{t('frequency_annually')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Membership Start Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('start_date_label')}</label>
            <Select
              value={data.membershipStartDate}
              onValueChange={(value: MembershipStartDateOption) => onUpdate({ membershipStartDate: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same-as-registration">{t('start_date_same_as_registration')}</SelectItem>
                <SelectItem value="custom">{t('start_date_custom')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {data.membershipStartDate === 'custom' && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('custom_start_date_label')}</label>
              <Input
                type="date"
                value={data.customStartDate}
                onChange={e => onUpdate({ customStartDate: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* Pro-rate First Payment */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-foreground">{t('prorate_label')}</label>
            <p className="text-xs text-muted-foreground">{t('prorate_description')}</p>
          </div>
          <Switch
            checked={data.proRateFirstPayment}
            onCheckedChange={(checked) => {
              onUpdate({ proRateFirstPayment: checked });
            }}
          />
        </div>
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
        <Button onClick={onNext} disabled={!isFormValid}>
          {t('next_button')}
        </Button>
      </div>
    </div>
  );
};
