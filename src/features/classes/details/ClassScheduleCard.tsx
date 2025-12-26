'use client';

import type { DayOfWeek } from '@/hooks/useAddClassWizard';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ClassScheduleCardProps = {
  daysOfWeek: DayOfWeek[];
  timeHour: number;
  timeMinute: number;
  timeAmPm: 'AM' | 'PM';
  durationHours: number;
  durationMinutes: number;
  location: string;
  calendarColor: string;
  onEdit: () => void;
};

export function ClassScheduleCard({
  daysOfWeek,
  timeHour,
  timeMinute,
  timeAmPm,
  durationHours,
  durationMinutes,
  location,
  calendarColor,
  onEdit,
}: ClassScheduleCardProps) {
  const t = useTranslations('ClassDetailPage.ScheduleCard');

  const formatTime = (): string => {
    const hour = timeHour.toString().padStart(2, '0');
    const minute = timeMinute.toString().padStart(2, '0');
    return `${hour}:${minute} ${timeAmPm}`;
  };

  const formatDuration = (): string => {
    const parts: string[] = [];
    if (durationHours > 0) {
      parts.push(`${durationHours}h`);
    }
    if (durationMinutes > 0) {
      parts.push(`${durationMinutes}m`);
    }
    return parts.join(' ') || '0m';
  };

  const formatDays = (): string => {
    if (daysOfWeek.length === 0) {
      return t('no_days');
    }
    // Abbreviate day names
    const abbreviations: Record<DayOfWeek, string> = {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun',
    };
    return daysOfWeek.map(day => abbreviations[day]).join(', ');
  };

  return (
    <Card className="flex flex-col p-6">
      <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>

      <div className="mt-6 flex-1 space-y-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">{t('days_label')}</span>
          <p className="mt-1 text-foreground">{formatDays()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">{t('time_label')}</span>
            <p className="mt-1 text-foreground">{formatTime()}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">{t('duration_label')}</span>
            <p className="mt-1 text-foreground">{formatDuration()}</p>
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground">{t('location_label')}</span>
          <p className="mt-1 text-foreground">{location || t('no_location')}</p>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground">{t('calendar_color_label')}</span>
          <div className="mt-1 flex items-center gap-2">
            <div
              className="size-6 rounded border border-border"
              style={{ backgroundColor: calendarColor }}
            />
            <span className="text-sm text-foreground">{calendarColor}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
