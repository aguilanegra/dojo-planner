'use client';

import type { AddMembershipWizardData } from '@/hooks/useAddMembershipWizard';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type MembershipBasicsStepProps = {
  data: AddMembershipWizardData;
  onUpdate: (updates: Partial<AddMembershipWizardData>) => void;
  onNext: () => void;
  onCancel: () => void;
  error?: string | null;
};

const MAX_DESCRIPTION_LENGTH = 2000;

export const MembershipBasicsStep = ({ data, onUpdate, onNext, onCancel, error }: MembershipBasicsStepProps) => {
  const t = useTranslations('AddMembershipWizard.MembershipBasicsStep');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof AddMembershipWizardData, value: string | boolean) => {
    onUpdate({ [field]: value });
  };

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid
    = data.membershipName.trim() !== ''
      && data.description.trim() !== '';

  const isMembershipNameInvalid = touched.membershipName && !data.membershipName.trim();
  const isDescriptionInvalid = touched.description && !data.description.trim();

  const characterCount = data.description.length;

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

        {/* Membership Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('membership_name_label')}</label>
          <Input
            placeholder={t('membership_name_placeholder')}
            value={data.membershipName}
            onChange={e => handleInputChange('membershipName', e.target.value)}
            onBlur={() => handleInputBlur('membershipName')}
            error={isMembershipNameInvalid}
          />
          {isMembershipNameInvalid && (
            <p className="text-xs text-destructive">{t('membership_name_error')}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('status_label')}</label>
          <div className="flex items-center gap-3">
            <Switch
              checked={data.status === 'active'}
              onCheckedChange={(checked) => {
                handleInputChange('status', checked ? 'active' : 'inactive');
              }}
            />
            <span className="text-sm text-muted-foreground">
              {data.status === 'active' ? t('status_active') : t('status_inactive')}
            </span>
          </div>
        </div>

        {/* Membership Type Selection Cards */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('membership_type_label')}</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Standard Membership Card */}
            <button
              type="button"
              onClick={() => handleInputChange('membershipType', 'standard')}
              className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${
                data.membershipType === 'standard'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <span className="font-medium text-foreground">{t('membership_type_standard')}</span>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('membership_type_standard_help')}
              </p>
            </button>

            {/* Trial Membership Card */}
            <button
              type="button"
              onClick={() => handleInputChange('membershipType', 'trial')}
              className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${
                data.membershipType === 'trial'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <span className="font-medium text-foreground">{t('membership_type_trial')}</span>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('membership_type_trial_help')}
              </p>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('description_label')}</label>
          <Textarea
            placeholder={t('description_placeholder')}
            value={data.description}
            onChange={e => handleInputChange('description', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
            onBlur={() => handleInputBlur('description')}
            error={isDescriptionInvalid}
            rows={4}
          />
          <div className="flex justify-between">
            {isDescriptionInvalid
              ? (
                  <p className="text-xs text-destructive">{t('description_error')}</p>
                )
              : (
                  <span />
                )}
            <p className="text-xs text-muted-foreground">
              {t('description_character_count', { count: characterCount, max: MAX_DESCRIPTION_LENGTH })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={onCancel}>
          {t('cancel_button')}
        </Button>
        <Button onClick={onNext} disabled={!isFormValid}>
          {t('next_button')}
        </Button>
      </div>
    </div>
  );
};
