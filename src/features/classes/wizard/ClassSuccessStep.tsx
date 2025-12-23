'use client';

import type { AddClassWizardData } from '@/hooks/useAddClassWizard';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { mockClassTags } from '../classTagsData';

type ClassSuccessStepProps = {
  data: AddClassWizardData;
  onDone: () => void;
};

const MOCK_PROGRAMS: Record<string, string> = {
  'adult-bjj': 'Adult Brazilian Jiu-Jitsu',
  'kids-bjj': 'Kids Brazilian Jiu-Jitsu',
  'womens-bjj': 'Women\'s Brazilian Jiu-Jitsu',
  'competition': 'Competition Team',
  'judo': 'Judo',
  'wrestling': 'Wrestling',
};

const MOCK_STAFF: Record<string, string> = {
  'collin-grayson': 'Collin Grayson',
  'coach-alex': 'Coach Alex',
  'professor-jessica': 'Professor Jessica',
  'professor-joao': 'Professor Joao',
  'coach-liza': 'Coach Liza',
  'professor-ivan': 'Professor Ivan',
};

export const ClassSuccessStep = ({ data, onDone }: ClassSuccessStepProps) => {
  const t = useTranslations('AddClassWizard.ClassSuccessStep');

  const selectedTags = mockClassTags.filter(tag => data.tags.includes(tag.id));
  const programName = MOCK_PROGRAMS[data.program] || data.program;
  const staffName = MOCK_STAFF[data.schedule.staffMember] || data.schedule.staffMember;

  const formatTime = () => {
    const hour = data.schedule.timeHour;
    const minute = data.schedule.timeMinute.toString().padStart(2, '0');
    return `${hour}:${minute} ${data.schedule.timeAmPm}`;
  };

  const formatDuration = () => {
    const hours = data.schedule.durationHours;
    const minutes = data.schedule.durationMinutes;
    if (hours > 0 && minutes > 0) {
      return `${hours} hr ${minutes} min`;
    }
    if (hours > 0) {
      return `${hours} hr`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-4 dark:bg-green-950">
          <svg className="h-12 w-12 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {t('title')}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t('description', { name: data.className })}
        </p>
      </div>

      {/* Class Summary */}
      <div className="rounded-lg border border-border bg-secondary/30 p-4 text-left">
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t('summary_title')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('summary_class_name')}</span>
            <span className="font-medium text-foreground">{data.className}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('summary_program')}</span>
            <span className="font-medium text-foreground">{programName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('summary_schedule')}</span>
            <span className="font-medium text-foreground">
              {data.schedule.daysOfWeek.join(', ')}
              {' '}
              @
              {formatTime()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('summary_duration')}</span>
            <span className="font-medium text-foreground">{formatDuration()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('summary_instructor')}</span>
            <span className="font-medium text-foreground">{staffName}</span>
          </div>
          {selectedTags.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('summary_tags')}</span>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map(tag => (
                  <span
                    key={tag.id}
                    className="rounded-full px-2 py-0.5 text-xs text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('summary_calendar_color')}</span>
            <div className="flex items-center gap-2">
              <div
                className="size-4 rounded"
                style={{ backgroundColor: data.calendarColor }}
              />
              <span className="font-medium text-foreground">{data.calendarColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button onClick={onDone} className="w-full">
          {t('done_button')}
        </Button>
      </div>
    </div>
  );
};
