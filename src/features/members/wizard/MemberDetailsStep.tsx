'use client';

import type { AddMemberWizardData } from '@/hooks/useAddMemberWizard';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type MemberDetailsStepProps = {
  data: AddMemberWizardData;
  onUpdate: (updates: Partial<AddMemberWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  error?: string | null;
};

export const MemberDetailsStep = ({ data, onUpdate, onNext, onBack, onCancel, error }: MemberDetailsStepProps) => {
  const t = useTranslations('AddMemberWizard.MemberDetailsStep');

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleAddressChange = (field: string, value: string) => {
    onUpdate({
      address: {
        ...(data.address || { street: '', city: '', state: '', country: '' }),
        [field]: value,
      },
    });
  };

  const isFormValid = data.firstName && data.lastName && data.email && data.phone;

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

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('first_name_label')}</label>
            <Input
              placeholder={t('first_name_placeholder')}
              value={data.firstName}
              onChange={e => handleInputChange('firstName', e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('last_name_label')}</label>
            <Input
              placeholder={t('last_name_placeholder')}
              value={data.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('email_label')}</label>
          <Input
            type="email"
            placeholder={t('email_placeholder')}
            value={data.email}
            onChange={e => handleInputChange('email', e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('phone_label')}</label>
          <Input
            type="tel"
            placeholder={t('phone_placeholder')}
            value={data.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
          />
        </div>

        {/* Address Fields (Optional) */}
        <div className="border-t border-border pt-4">
          <h3 className="mb-4 text-sm font-medium text-foreground">{t('address_label')}</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t('street_label')}</label>
              <Input
                placeholder={t('street_placeholder')}
                value={data.address?.street || ''}
                onChange={e => handleAddressChange('street', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t('apartment_label')}</label>
              <Input
                placeholder={t('apartment_placeholder')}
                value={data.address?.apartment || ''}
                onChange={e => handleAddressChange('apartment', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('city_label')}</label>
                <Input
                  placeholder={t('city_placeholder')}
                  value={data.address?.city || ''}
                  onChange={e => handleAddressChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('state_label')}</label>
                <Input
                  placeholder={t('state_placeholder')}
                  value={data.address?.state || ''}
                  onChange={e => handleAddressChange('state', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t('country_label')}</label>
              <Input
                placeholder={t('country_placeholder')}
                value={data.address?.country || ''}
                onChange={e => handleAddressChange('country', e.target.value)}
              />
            </div>
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
        <Button onClick={onNext} disabled={!isFormValid}>
          {t('next_button')}
        </Button>
      </div>
    </div>
  );
};
