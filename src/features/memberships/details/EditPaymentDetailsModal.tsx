'use client';

import type { ChargeSignUpFeeOption, PaymentFrequency } from '@/hooks/useAddMembershipWizard';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type EditPaymentDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  signUpFee: number | null;
  chargeSignUpFee: ChargeSignUpFeeOption;
  monthlyFee: number | null;
  paymentFrequency: PaymentFrequency;
  proRateFirstPayment: boolean;
  isTrial: boolean;
  onSave: (data: {
    signUpFee: number | null;
    chargeSignUpFee: ChargeSignUpFeeOption;
    monthlyFee: number | null;
    paymentFrequency: PaymentFrequency;
    proRateFirstPayment: boolean;
  }) => void;
};

export function EditPaymentDetailsModal({
  isOpen,
  onClose,
  signUpFee: initialSignUpFee,
  chargeSignUpFee: initialChargeSignUpFee,
  monthlyFee: initialMonthlyFee,
  paymentFrequency: initialPaymentFrequency,
  proRateFirstPayment: initialProRate,
  isTrial,
  onSave,
}: EditPaymentDetailsModalProps) {
  const t = useTranslations('MembershipDetailPage.EditPaymentDetailsModal');

  const [signUpFee, setSignUpFee] = useState<number | null>(initialSignUpFee);
  const [chargeSignUpFee, setChargeSignUpFee] = useState<ChargeSignUpFeeOption>(initialChargeSignUpFee);
  const [monthlyFee, setMonthlyFee] = useState<number | null>(initialMonthlyFee);
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>(initialPaymentFrequency);
  const [proRateFirstPayment, setProRateFirstPayment] = useState(initialProRate);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleNumberChange = (setter: (value: number | null) => void, value: string) => {
    const numValue = value ? Number.parseFloat(value) : null;
    setter(numValue);
  };

  const isMonthlyFeeInvalid = touched.monthlyFee
    && !isTrial
    && (monthlyFee === null || monthlyFee < 0);

  const isFormValid = isTrial || (monthlyFee !== null && monthlyFee >= 0);

  // Get fee label based on frequency
  const getFeeLabel = (): string => {
    switch (paymentFrequency) {
      case 'weekly':
        return t('weekly_fee_label');
      case 'annually':
        return t('annual_fee_label');
      default:
        return t('monthly_fee_label');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave({
      signUpFee,
      chargeSignUpFee,
      monthlyFee,
      paymentFrequency,
      proRateFirstPayment,
    });
    setIsLoading(false);
  };

  const handleCancel = () => {
    setSignUpFee(initialSignUpFee);
    setChargeSignUpFee(initialChargeSignUpFee);
    setMonthlyFee(initialMonthlyFee);
    setPaymentFrequency(initialPaymentFrequency);
    setProRateFirstPayment(initialProRate);
    setTouched({});
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSignUpFee(initialSignUpFee);
      setChargeSignUpFee(initialChargeSignUpFee);
      setMonthlyFee(initialMonthlyFee);
      setPaymentFrequency(initialPaymentFrequency);
      setProRateFirstPayment(initialProRate);
      setTouched({});
    } else {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sign-up Fee and Charge Option */}
          {!isTrial && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{t('signup_fee_label')}</label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder={t('signup_fee_placeholder')}
                    value={signUpFee ?? ''}
                    onChange={e => handleNumberChange(setSignUpFee, e.target.value)}
                    className="pl-7"
                    min={0}
                    step="0.01"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{t('charge_signup_fee_label')}</label>
                <Select
                  value={chargeSignUpFee}
                  onValueChange={(value: ChargeSignUpFeeOption) => setChargeSignUpFee(value)}
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
          )}

          {/* Fee and Payment Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{getFeeLabel()}</label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder={t('fee_placeholder')}
                  value={monthlyFee ?? ''}
                  onChange={e => handleNumberChange(setMonthlyFee, e.target.value)}
                  onBlur={() => handleInputBlur('monthlyFee')}
                  error={isMonthlyFeeInvalid}
                  className="pl-7"
                  min={0}
                  step="0.01"
                />
              </div>
              {isMonthlyFeeInvalid && (
                <p className="text-xs text-destructive">{t('fee_error')}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('payment_frequency_label')}</label>
              <Select
                value={paymentFrequency}
                onValueChange={(value: PaymentFrequency) => setPaymentFrequency(value)}
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

          {/* Pro-rate First Payment */}
          {!isTrial && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-foreground">{t('prorate_label')}</label>
                <p className="text-xs text-muted-foreground">{t('prorate_description')}</p>
              </div>
              <Switch
                checked={proRateFirstPayment}
                onCheckedChange={setProRateFirstPayment}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              {t('cancel_button')}
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || isLoading}>
              {isLoading ? t('saving_button') : t('save_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
