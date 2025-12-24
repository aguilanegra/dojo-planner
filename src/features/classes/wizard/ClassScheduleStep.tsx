'use client';

import type { AddClassWizardData, ClassSchedule, DayOfWeek } from '@/hooks/useAddClassWizard';
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
import { mockClassTags } from '../classTagsData';

type ClassScheduleStepProps = {
  data: AddClassWizardData;
  onUpdate: (updates: Partial<AddClassWizardData>) => void;
  onUpdateSchedule: (updates: Partial<ClassSchedule>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  error?: string | null;
};

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 15, 30, 45];
const DURATION_HOURS = [0, 1, 2, 3];
const DURATION_MINUTES = [0, 15, 30, 45];

const MOCK_STAFF = [
  { value: 'collin-grayson', label: 'Collin Grayson' },
  { value: 'coach-alex', label: 'Coach Alex' },
  { value: 'professor-jessica', label: 'Professor Jessica' },
  { value: 'professor-joao', label: 'Professor Joao' },
  { value: 'coach-liza', label: 'Coach Liza' },
  { value: 'professor-ivan', label: 'Professor Ivan' },
];

// Colors that are already used in the calendar (from classesData)
const USED_CALENDAR_COLORS = ['#22c55e', '#a855f7', '#06b6d4', '#ec4899', '#ef4444', '#6b7280'];

// Available colors for new classes (excluding used ones)
const AVAILABLE_COLORS = [
  { value: '#000000', label: 'Black' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Yellow' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#84cc16', label: 'Lime' },
].filter(color => !USED_CALENDAR_COLORS.includes(color.value));

// Also include colors from existing tags that aren't used
const TAG_COLORS = mockClassTags.map(tag => tag.color);
const ALL_AVAILABLE_COLORS = [
  ...AVAILABLE_COLORS,
  ...TAG_COLORS.filter(c => !AVAILABLE_COLORS.some(ac => ac.value === c) && !USED_CALENDAR_COLORS.includes(c))
    .map(c => ({ value: c, label: c })),
];

export const ClassScheduleStep = ({
  data,
  onUpdate,
  onUpdateSchedule,
  onNext,
  onBack,
  onCancel,
  error,
}: ClassScheduleStepProps) => {
  const t = useTranslations('AddClassWizard.ClassScheduleStep');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleDayToggle = (day: DayOfWeek) => {
    const currentDays = data.schedule.daysOfWeek;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    onUpdateSchedule({ daysOfWeek: newDays });
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid
    = data.schedule.daysOfWeek.length > 0
      && data.schedule.staffMember !== ''
      && (data.schedule.durationHours > 0 || data.schedule.durationMinutes > 0);

  // Validation helpers
  const isDaysInvalid = touched.daysOfWeek && data.schedule.daysOfWeek.length === 0;
  const isStaffInvalid = touched.staffMember && !data.schedule.staffMember;
  const isDurationInvalid = touched.duration && data.schedule.durationHours === 0 && data.schedule.durationMinutes === 0;

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

        {/* Day of Week */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('day_of_week_label')}</label>
          <div
            className="flex flex-wrap gap-3"
            onBlur={() => handleBlur('daysOfWeek')}
          >
            {DAYS_OF_WEEK.map((day) => {
              // Use static translation keys to satisfy i18n-check
              const dayLabels: Record<DayOfWeek, string> = {
                Monday: t('day_monday'),
                Tuesday: t('day_tuesday'),
                Wednesday: t('day_wednesday'),
                Thursday: t('day_thursday'),
                Friday: t('day_friday'),
                Saturday: t('day_saturday'),
                Sunday: t('day_sunday'),
              };
              return (
                <label
                  key={day}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={data.schedule.daysOfWeek.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <span className="text-sm">{dayLabels[day]}</span>
                </label>
              );
            })}
          </div>
          {isDaysInvalid && (
            <p className="text-xs text-destructive">{t('day_of_week_error')}</p>
          )}
        </div>

        {/* Time of Day and Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('time_of_day_label')}</label>
            <div className="flex gap-2">
              <Select
                value={data.schedule.timeHour.toString()}
                onValueChange={value => onUpdateSchedule({ timeHour: Number.parseInt(value, 10) })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map(hour => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={data.schedule.timeMinute.toString()}
                onValueChange={value => onUpdateSchedule({ timeMinute: Number.parseInt(value, 10) })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MINUTES.map(minute => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={data.schedule.timeAmPm}
                onValueChange={value => onUpdateSchedule({ timeAmPm: value as 'AM' | 'PM' })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('duration_label')}</label>
            <div className="flex items-center gap-2">
              <Select
                value={data.schedule.durationHours.toString()}
                onValueChange={(value) => {
                  onUpdateSchedule({ durationHours: Number.parseInt(value, 10) });
                  handleBlur('duration');
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_HOURS.map(hour => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">{t('duration_hr')}</span>
              <Select
                value={data.schedule.durationMinutes.toString()}
                onValueChange={(value) => {
                  onUpdateSchedule({ durationMinutes: Number.parseInt(value, 10) });
                  handleBlur('duration');
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_MINUTES.map(minute => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">{t('duration_min')}</span>
            </div>
            {isDurationInvalid && (
              <p className="text-xs text-destructive">{t('duration_error')}</p>
            )}
          </div>
        </div>

        {/* Staff Member and Assistant */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('staff_member_label')}</label>
            <Select
              value={data.schedule.staffMember}
              onValueChange={(value) => {
                onUpdateSchedule({ staffMember: value });
                handleBlur('staffMember');
              }}
            >
              <SelectTrigger aria-invalid={isStaffInvalid}>
                <SelectValue placeholder={t('staff_member_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {MOCK_STAFF.map(staff => (
                  <SelectItem key={staff.value} value={staff.value}>
                    {staff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isStaffInvalid && (
              <p className="text-xs text-destructive">{t('staff_member_error')}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('assistant_staff_label')}</label>
            <Select
              value={data.schedule.assistantStaff || 'none'}
              onValueChange={value => onUpdateSchedule({ assistantStaff: value === 'none' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('assistant_staff_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('assistant_staff_none')}</SelectItem>
                {MOCK_STAFF.map(staff => (
                  <SelectItem key={staff.value} value={staff.value}>
                    {staff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar Color */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('calendar_color_label')}</label>
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded border border-border"
              style={{ backgroundColor: data.calendarColor }}
            />
            <Input
              type="text"
              value={data.calendarColor}
              onChange={e => onUpdate({ calendarColor: e.target.value })}
              placeholder="#000000"
              className="w-32"
            />
            <Select
              value={data.calendarColor}
              onValueChange={value => onUpdate({ calendarColor: value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('calendar_color_select')} />
              </SelectTrigger>
              <SelectContent>
                {ALL_AVAILABLE_COLORS.map(color => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-4 rounded"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">{t('calendar_color_help')}</p>
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
