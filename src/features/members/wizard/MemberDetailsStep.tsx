'use client';

import type { AddMemberWizardData } from '@/hooks/useAddMemberWizard';
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
import { COUNTRIES, US_STATES } from '@/constants/locations';

type MemberDetailsStepProps = {
  data: AddMemberWizardData;
  onUpdate: (updates: Partial<AddMemberWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  error?: string | null;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const MemberDetailsStep = ({ data, onUpdate, onNext, onBack, onCancel, error }: MemberDetailsStepProps) => {
  const t = useTranslations('AddMemberWizard.MemberDetailsStep');

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleAddressChange = (field: string, value: string) => {
    onUpdate({
      address: {
        ...(data.address || { street: '', apartment: '', city: '', state: '', zipCode: '', country: 'US' }),
        [field]: value,
      },
    });
  };

  const isAddressValid
    = data.address?.street
      && data.address?.city
      && data.address?.state
      && data.address?.zipCode
      && data.address?.country;

  const isFormValid
    = data.firstName
      && data.lastName
      && data.phone
      && isValidEmail(data.email)
      && isAddressValid;

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
            aria-invalid={data.email && !isValidEmail(data.email) ? 'true' : 'false'}
          />
          {data.email && !isValidEmail(data.email) && (
            <p className="text-xs text-destructive">Please enter a valid email address</p>
          )}
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

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('city_label')}</label>
                <Input
                  placeholder={t('city_placeholder')}
                  value={data.address?.city || ''}
                  onChange={e => handleAddressChange('city', e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('state_label')}</label>
                <Select value={data.address?.state || ''} onValueChange={value => handleAddressChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('state_placeholder')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {US_STATES.map(state => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t('zip_code_label')}</label>
                <Input
                  placeholder={t('zip_code_placeholder')}
                  value={data.address?.zipCode || ''}
                  onChange={e => handleAddressChange('zipCode', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t('country_label')}</label>
              <Select value={data.address?.country || 'US'} onValueChange={value => handleAddressChange('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('country_placeholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {COUNTRIES.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
