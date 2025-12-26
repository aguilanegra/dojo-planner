'use client';

import type { AddMembershipWizardData, ClassLimitType } from '@/hooks/useAddMembershipWizard';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type MembershipClassAccessStepProps = {
  data: AddMembershipWizardData;
  onUpdate: (updates: Partial<AddMembershipWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  error?: string | null;
};

const MOCK_CLASSES = [
  { id: 'fundamentals', name: 'Fundamentals' },
  { id: 'intro-bjj', name: 'Intro to BJJ' },
  { id: 'no-gi', name: 'No-Gi' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'open-mat', name: 'Open Mat' },
  { id: 'competition-team', name: 'Competition Team' },
];

export const MembershipClassAccessStep = ({ data, onUpdate, onNext, onBack, onCancel, error }: MembershipClassAccessStepProps) => {
  const t = useTranslations('AddMembershipWizard.MembershipClassAccessStep');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleClassLimitTypeChange = (value: ClassLimitType) => {
    onUpdate({
      classLimitType: value,
      classLimitCount: value === 'unlimited' ? null : data.classLimitCount,
    });
  };

  const handleClassLimitCountChange = (value: string) => {
    const numValue = value ? Number.parseInt(value, 10) : null;
    onUpdate({ classLimitCount: numValue });
  };

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleClassToggle = (classId: string, checked: boolean) => {
    const currentClasses = data.availableClasses;
    if (checked) {
      onUpdate({ availableClasses: [...currentClasses, classId] });
    } else {
      onUpdate({ availableClasses: currentClasses.filter(id => id !== classId) });
    }
  };

  const handleSelectAll = () => {
    const allClassIds = MOCK_CLASSES.map(c => c.id);
    if (data.availableClasses.length === allClassIds.length) {
      onUpdate({ availableClasses: [] });
    } else {
      onUpdate({ availableClasses: allClassIds });
    }
  };

  const isClassLimitInvalid = touched.classLimitCount
    && data.classLimitType === 'limited'
    && (data.classLimitCount === null || data.classLimitCount <= 0);

  const isClassesInvalid = touched.availableClasses && data.availableClasses.length === 0;

  const isFormValid
    = (data.classLimitType === 'unlimited' || (data.classLimitCount !== null && data.classLimitCount > 0))
      && data.availableClasses.length > 0;

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

        {/* Class Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('class_limits_label')}</label>
            <Select
              value={data.classLimitType}
              onValueChange={handleClassLimitTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('class_limits_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlimited">{t('class_limits_unlimited')}</SelectItem>
                <SelectItem value="limited">{t('class_limits_limited')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {data.classLimitType === 'limited' && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('class_limit_count_label')}</label>
              <Input
                type="number"
                placeholder={t('class_limit_count_placeholder')}
                value={data.classLimitCount ?? ''}
                onChange={e => handleClassLimitCountChange(e.target.value)}
                onBlur={() => handleInputBlur('classLimitCount')}
                error={isClassLimitInvalid}
                min={1}
              />
              {isClassLimitInvalid && (
                <p className="text-xs text-destructive">{t('class_limit_count_error')}</p>
              )}
            </div>
          )}
        </div>

        {/* Available Classes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">{t('available_classes_label')}</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              {data.availableClasses.length === MOCK_CLASSES.length
                ? t('deselect_all_button')
                : t('select_all_button')}
            </Button>
          </div>
          <div
            className="rounded-lg border border-border p-4"
            onBlur={() => handleInputBlur('availableClasses')}
          >
            <div className="grid grid-cols-2 gap-3">
              {MOCK_CLASSES.map(classItem => (
                <label
                  key={classItem.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={data.availableClasses.includes(classItem.id)}
                    onCheckedChange={(checked) => {
                      handleClassToggle(classItem.id, !!checked);
                    }}
                  />
                  <span className="text-sm">{classItem.name}</span>
                </label>
              ))}
            </div>
          </div>
          {isClassesInvalid && (
            <p className="text-xs text-destructive">{t('available_classes_error')}</p>
          )}
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
