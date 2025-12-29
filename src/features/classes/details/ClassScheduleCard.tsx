'use client';

import type { DayOfWeek, ScheduleInstance } from '@/hooks/useAddClassWizard';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ClassScheduleCardProps = {
  scheduleInstances: ScheduleInstance[];
  location: string;
  calendarColor: string;
  onEdit: () => void;
};

const MOCK_STAFF: Record<string, string> = {
  'collin-grayson': 'Collin Grayson',
  'coach-alex': 'Coach Alex',
  'professor-jessica': 'Professor Jessica',
  'professor-joao': 'Professor Joao',
  'coach-liza': 'Coach Liza',
  'professor-ivan': 'Professor Ivan',
};

export function ClassScheduleCard({
  scheduleInstances,
  location,
  calendarColor,
  onEdit,
}: ClassScheduleCardProps) {
  const t = useTranslations('ClassDetailPage.ScheduleCard');

  const formatTime = (hour: number, minute: number, amPm: 'AM' | 'PM'): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${amPm}`;
  };

  const formatDuration = (hours: number, minutes: number): string => {
    const parts: string[] = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    return parts.join(' ') || '0m';
  };

  const getDayAbbreviation = (day: DayOfWeek): string => {
    const abbreviations: Record<DayOfWeek, string> = {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun',
    };
    return abbreviations[day];
  };

  const getStaffName = (staffValue: string): string => {
    return MOCK_STAFF[staffValue] || staffValue;
  };

  return (
    <Card className="flex h-full flex-col p-6">
      <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>

      <div className="mt-6 flex-1 space-y-4">
        {/* Schedule Instances Table */}
        <div>
          <span className="text-sm font-medium text-muted-foreground">{t('schedule_label')}</span>
          {scheduleInstances.length > 0
            ? (
                <div className="mt-2 overflow-x-auto rounded-lg border border-border bg-background">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t('column_day')}</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t('column_time')}</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t('column_duration')}</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t('column_instructor')}</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t('column_assistant')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleInstances.map(instance => (
                        <tr key={instance.id} className="border-b border-border last:border-b-0" data-testid={`schedule-instance-${instance.id}`}>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {getDayAbbreviation(instance.dayOfWeek)}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {formatTime(instance.timeHour, instance.timeMinute, instance.timeAmPm)}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {formatDuration(instance.durationHours, instance.durationMinutes)}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {instance.staffMember ? getStaffName(instance.staffMember) : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {instance.assistantStaff ? getStaffName(instance.assistantStaff) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            : (
                <p className="mt-1 text-foreground">{t('no_schedule')}</p>
              )}
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
