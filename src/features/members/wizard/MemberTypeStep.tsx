'use client';

import type { AddMemberWizardData, MemberType } from '@/hooks/useAddMemberWizard';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

type MemberTypeStepProps = {
  data: AddMemberWizardData;
  onUpdate: (updates: Partial<AddMemberWizardData>) => void;
  onNext: () => void;
  onCancel: () => void;
};

export const MemberTypeStep = ({ data, onUpdate, onNext, onCancel }: MemberTypeStepProps) => {
  const t = useTranslations('AddMemberWizard.MemberTypeStep');

  const memberTypes: { id: MemberType; label: string; description: string }[] = [
    {
      id: 'individual',
      label: t('individual_label'),
      description: t('individual_description'),
    },
    {
      id: 'family-member',
      label: t('family_member_label'),
      description: t('family_member_description'),
    },
    {
      id: 'head-of-household',
      label: t('head_of_household_label'),
      description: t('head_of_household_description'),
    },
  ];

  const handleSelect = (type: MemberType) => {
    onUpdate({ memberType: type });
  };

  const handleNext = () => {
    if (data.memberType) {
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
        {memberTypes.map(type => (
          <button
            key={type.id}
            type="button"
            onClick={() => handleSelect(type.id)}
            className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
              data.memberType === type.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
            }`}
          >
            <h3 className="font-semibold text-foreground">{type.label}</h3>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={onCancel}>
          {t('cancel_button')}
        </Button>
        <Button onClick={handleNext} disabled={!data.memberType}>
          {t('next_button')}
        </Button>
      </div>
    </div>
  );
};
