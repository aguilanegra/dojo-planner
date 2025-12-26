'use client';

import type { DayOfWeek } from '@/hooks/useAddClassWizard';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 15, 30, 45];
const DURATION_HOURS = [0, 1, 2, 3];
const DURATION_MINUTES = [0, 15, 30, 45];

const AVAILABLE_COLORS = [
  { value: '#22c55e', label: 'Green' },
  { value: '#a855f7', label: 'Purple' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#ef4444', label: 'Red' },
  { value: '#6b7280', label: 'Gray' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Yellow' },
  { value: '#14b8a6', label: 'Teal' },
];

type EditClassScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  daysOfWeek: DayOfWeek[];
  timeHour: number;
  timeMinute: number;
  timeAmPm: 'AM' | 'PM';
  durationHours: number;
  durationMinutes: number;
  location: string;
  calendarColor: string;
  onSave: (data: {
    daysOfWeek: DayOfWeek[];
    timeHour: number;
    timeMinute: number;
    timeAmPm: 'AM' | 'PM';
    durationHours: number;
    durationMinutes: number;
    location: string;
    calendarColor: string;
  }) => void;
};

export function EditClassScheduleModal({
  isOpen,
  onClose,
  daysOfWeek: initialDaysOfWeek,
  timeHour: initialTimeHour,
  timeMinute: initialTimeMinute,
  timeAmPm: initialTimeAmPm,
  durationHours: initialDurationHours,
  durationMinutes: initialDurationMinutes,
  location: initialLocation,
  calendarColor: initialCalendarColor,
  onSave,
}: EditClassScheduleModalProps) {
  const t = useTranslations('ClassDetailPage.EditScheduleModal');

  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(initialDaysOfWeek);
  const [timeHour, setTimeHour] = useState(initialTimeHour);
  const [timeMinute, setTimeMinute] = useState(initialTimeMinute);
  const [timeAmPm, setTimeAmPm] = useState<'AM' | 'PM'>(initialTimeAmPm);
  const [durationHours, setDurationHours] = useState(initialDurationHours);
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes);
  const [location, setLocation] = useState(initialLocation);
  const [calendarColor, setCalendarColor] = useState(initialCalendarColor);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleDayToggle = (day: DayOfWeek) => {
    setDaysOfWeek(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day],
    );
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isDaysInvalid = touched.daysOfWeek && daysOfWeek.length === 0;
  const isDurationInvalid = touched.duration && durationHours === 0 && durationMinutes === 0;

  const isFormValid = daysOfWeek.length > 0 && (durationHours > 0 || durationMinutes > 0);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave({
      daysOfWeek,
      timeHour,
      timeMinute,
      timeAmPm,
      durationHours,
      durationMinutes,
      location,
      calendarColor,
    });
    setIsLoading(false);
  };

  const handleCancel = () => {
    setDaysOfWeek(initialDaysOfWeek);
    setTimeHour(initialTimeHour);
    setTimeMinute(initialTimeMinute);
    setTimeAmPm(initialTimeAmPm);
    setDurationHours(initialDurationHours);
    setDurationMinutes(initialDurationMinutes);
    setLocation(initialLocation);
    setCalendarColor(initialCalendarColor);
    setTouched({});
    onClose();
  };

  // Reset state when modal opens with new data
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDaysOfWeek(initialDaysOfWeek);
      setTimeHour(initialTimeHour);
      setTimeMinute(initialTimeMinute);
      setTimeAmPm(initialTimeAmPm);
      setDurationHours(initialDurationHours);
      setDurationMinutes(initialDurationMinutes);
      setLocation(initialLocation);
      setCalendarColor(initialCalendarColor);
      setTouched({});
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
          {/* Days of Week */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('days_label')}</label>
            <div
              className="flex flex-wrap gap-3"
              onBlur={() => handleBlur('daysOfWeek')}
            >
              {DAYS_OF_WEEK.map((day) => {
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
                      checked={daysOfWeek.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <span className="text-sm">{dayLabels[day]}</span>
                  </label>
                );
              })}
            </div>
            {isDaysInvalid && (
              <p className="text-xs text-destructive">{t('days_error')}</p>
            )}
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('time_label')}</label>
              <div className="flex gap-2">
                <Select
                  value={timeHour.toString()}
                  onValueChange={value => setTimeHour(Number.parseInt(value, 10))}
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
                  value={timeMinute.toString()}
                  onValueChange={value => setTimeMinute(Number.parseInt(value, 10))}
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
                  value={timeAmPm}
                  onValueChange={value => setTimeAmPm(value as 'AM' | 'PM')}
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
                  value={durationHours.toString()}
                  onValueChange={(value) => {
                    setDurationHours(Number.parseInt(value, 10));
                    handleBlur('duration');
                  }}
                >
                  <SelectTrigger className="w-16">
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
                  value={durationMinutes.toString()}
                  onValueChange={(value) => {
                    setDurationMinutes(Number.parseInt(value, 10));
                    handleBlur('duration');
                  }}
                >
                  <SelectTrigger className="w-16">
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

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('location_label')}</label>
            <Input
              placeholder={t('location_placeholder')}
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          {/* Calendar Color */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('calendar_color_label')}</label>
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded border border-border"
                style={{ backgroundColor: calendarColor }}
              />
              <Input
                type="text"
                value={calendarColor}
                onChange={e => setCalendarColor(e.target.value)}
                placeholder="#000000"
                className="w-32"
              />
              <Select
                value={calendarColor}
                onValueChange={setCalendarColor}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('calendar_color_select')} />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_COLORS.map(color => (
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              {t('cancel_button')}
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || isLoading}>
              {isLoading ? t('saving_button') : t('save_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
