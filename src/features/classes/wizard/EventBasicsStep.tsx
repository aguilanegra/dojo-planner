'use client';

import type { AddClassWizardData, EventType } from '@/hooks/useAddClassWizard';
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
import { Textarea } from '@/components/ui/textarea';

type EventBasicsStepProps = {
  data: AddClassWizardData;
  onUpdate: (updates: Partial<AddClassWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  error?: string | null;
};

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'Seminar', label: 'Seminar' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Guest Instructor', label: 'Guest Instructor' },
  { value: 'Tournament', label: 'Tournament' },
  { value: 'Other', label: 'Other' },
];

const MAX_DESCRIPTION_LENGTH = 2000;

export const EventBasicsStep = ({ data, onUpdate, onNext, onBack, onCancel, error }: EventBasicsStepProps) => {
  const t = useTranslations('AddClassWizard.EventBasicsStep');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof AddClassWizardData, value: string | number | null) => {
    onUpdate({ [field]: value });
  };

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid
    = data.eventName.trim() !== ''
      && data.eventType !== ''
      && data.eventDescription.trim() !== '';

  // Validation helpers for touched fields
  const isEventNameInvalid = touched.eventName && !data.eventName.trim();
  const isEventTypeInvalid = touched.eventType && !data.eventType;
  const isDescriptionInvalid = touched.eventDescription && !data.eventDescription.trim();

  const characterCount = data.eventDescription.length;

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

        {/* Event Name and Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('event_name_label')}</label>
            <Input
              placeholder={t('event_name_placeholder')}
              value={data.eventName}
              onChange={e => handleInputChange('eventName', e.target.value)}
              onBlur={() => handleInputBlur('eventName')}
              error={isEventNameInvalid}
            />
            {isEventNameInvalid && (
              <p className="text-xs text-destructive">{t('event_name_error')}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('event_type_label')}</label>
            <Select
              value={data.eventType}
              onValueChange={value => handleInputChange('eventType', value)}
            >
              <SelectTrigger
                aria-invalid={isEventTypeInvalid}
                onBlur={() => handleInputBlur('eventType')}
                className="w-full truncate"
              >
                <SelectValue placeholder={t('event_type_placeholder')} className="truncate" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map(eventType => (
                  <SelectItem key={eventType.value} value={eventType.value}>
                    {eventType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isEventTypeInvalid && (
              <p className="text-xs text-destructive">{t('event_name_error')}</p>
            )}
          </div>
        </div>

        {/* Max Capacity */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('max_capacity_label')}</label>
          <Input
            type="number"
            placeholder={t('max_capacity_placeholder')}
            value={data.eventMaxCapacity ?? ''}
            onChange={e => handleInputChange('eventMaxCapacity', e.target.value ? Number.parseInt(e.target.value, 10) : null)}
            min={1}
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">{t('max_capacity_help')}</p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('description_label')}</label>
          <Textarea
            placeholder={t('description_placeholder')}
            value={data.eventDescription}
            onChange={e => handleInputChange('eventDescription', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
            onBlur={() => handleInputBlur('eventDescription')}
            error={isDescriptionInvalid}
            rows={5}
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
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
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
