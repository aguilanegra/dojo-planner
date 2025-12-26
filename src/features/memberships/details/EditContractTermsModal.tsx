'use client';

import type { AutoRenewalOption, ContractLength } from '@/hooks/useAddMembershipWizard';
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

type EditContractTermsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  contractLength: ContractLength;
  autoRenewal: AutoRenewalOption;
  cancellationFee: number | null;
  holdLimitPerYear: number | null;
  onSave: (data: {
    contractLength: ContractLength;
    autoRenewal: AutoRenewalOption;
    cancellationFee: number | null;
    holdLimitPerYear: number | null;
  }) => void;
};

export function EditContractTermsModal({
  isOpen,
  onClose,
  contractLength: initialContractLength,
  autoRenewal: initialAutoRenewal,
  cancellationFee: initialCancellationFee,
  holdLimitPerYear: initialHoldLimit,
  onSave,
}: EditContractTermsModalProps) {
  const t = useTranslations('MembershipDetailPage.EditContractTermsModal');

  const [contractLength, setContractLength] = useState<ContractLength>(initialContractLength);
  const [autoRenewal, setAutoRenewal] = useState<AutoRenewalOption>(initialAutoRenewal);
  const [cancellationFee, setCancellationFee] = useState<number | null>(initialCancellationFee);
  const [holdLimitPerYear, setHoldLimitPerYear] = useState<number | null>(initialHoldLimit);
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberChange = (setter: (value: number | null) => void, value: string) => {
    const numValue = value ? Number.parseFloat(value) : null;
    setter(numValue);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave({
      contractLength,
      autoRenewal,
      cancellationFee,
      holdLimitPerYear,
    });
    setIsLoading(false);
  };

  const handleCancel = () => {
    setContractLength(initialContractLength);
    setAutoRenewal(initialAutoRenewal);
    setCancellationFee(initialCancellationFee);
    setHoldLimitPerYear(initialHoldLimit);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setContractLength(initialContractLength);
      setAutoRenewal(initialAutoRenewal);
      setCancellationFee(initialCancellationFee);
      setHoldLimitPerYear(initialHoldLimit);
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
          {/* Contract Length and Auto-Renewal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('contract_length_label')}</label>
              <Select
                value={contractLength}
                onValueChange={(value: ContractLength) => setContractLength(value)}
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
                value={autoRenewal}
                onValueChange={(value: AutoRenewalOption) => setAutoRenewal(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('renewal_none')}</SelectItem>
                  <SelectItem value="month-to-month">{t('renewal_month_to_month')}</SelectItem>
                  <SelectItem value="same-term">{t('renewal_same_term')}</SelectItem>
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
                  value={cancellationFee ?? ''}
                  onChange={e => handleNumberChange(setCancellationFee, e.target.value)}
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
                value={holdLimitPerYear ?? ''}
                onChange={e => handleNumberChange(setHoldLimitPerYear, e.target.value)}
                min={0}
              />
              <p className="text-xs text-muted-foreground">{t('hold_limit_help')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              {t('cancel_button')}
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? t('saving_button') : t('save_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
