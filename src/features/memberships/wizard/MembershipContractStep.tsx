'use client';

import type {
  AddMembershipWizardData,
  AutoRenewalOption,
  ContractLength,
} from '@/hooks/useAddMembershipWizard';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type MembershipContractStepProps = {
  data: AddMembershipWizardData;
  onUpdate: (updates: Partial<AddMembershipWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
};

export const MembershipContractStep = ({ data, onUpdate, onNext, onBack, onCancel, isLoading, error }: MembershipContractStepProps) => {
  const t = useTranslations('AddMembershipWizard.MembershipContractStep');

  const handleNumberChange = (field: keyof AddMembershipWizardData, value: string) => {
    const numValue = value ? Number.parseFloat(value) : null;
    onUpdate({ [field]: numValue });
  };

  // Contract step has all optional fields, so form is always valid
  const isFormValid = true;

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

        {/* Contract Length and Auto-Renewal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('contract_length_label')}</label>
            <Select
              value={data.contractLength}
              onValueChange={(value: ContractLength) => onUpdate({ contractLength: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month-to-month">{t('contract_month_to_month')}</SelectItem>
                <SelectItem value="3-months">{t('contract_3_months')}</SelectItem>
                <SelectItem value="6-months">{t('contract_6_months')}</SelectItem>
                <SelectItem value="12-months">{t('contract_12_months')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('auto_renewal_label')}</label>
            <Select
              value={data.autoRenewal}
              onValueChange={(value: AutoRenewalOption) => onUpdate({ autoRenewal: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('auto_renewal_none')}</SelectItem>
                <SelectItem value="month-to-month">{t('auto_renewal_month_to_month')}</SelectItem>
                <SelectItem value="same-term">{t('auto_renewal_same_term')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cancellation Fee and Hold Limit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('cancellation_fee_label')}</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder={t('cancellation_fee_placeholder')}
                value={data.cancellationFee ?? ''}
                onChange={e => handleNumberChange('cancellationFee', e.target.value)}
                className="pl-7"
                min={0}
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground">{t('cancellation_fee_help')}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('hold_limit_label')}</label>
            <Input
              type="number"
              placeholder={t('hold_limit_placeholder')}
              value={data.holdLimitPerYear ?? ''}
              onChange={e => handleNumberChange('holdLimitPerYear', e.target.value)}
              min={0}
            />
            <p className="text-xs text-muted-foreground">{t('hold_limit_help')}</p>
          </div>
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
        <Button onClick={onNext} disabled={!isFormValid || isLoading}>
          {isLoading ? t('creating_button') : t('create_button')}
        </Button>
      </div>
    </div>
  );
};
