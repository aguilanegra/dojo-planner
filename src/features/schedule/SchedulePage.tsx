'use client';

import { MoreHorizontal, Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateCalendarDays() {
  const days = [];
  const startDay = 2;
  const daysInMonth = 30;

  for (let i = 0; i < startDay; i++) {
    days.push({ id: `empty-${i}`, day: null });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ id: `day-${i}`, day: i });
  }

  return days;
}

const calendarDays = generateCalendarDays();

const mockEvents: Record<number, string[]> = {
  1: ['12pm BJJ Open', '4pm Reserved'],
  2: ['4pm Reserved'],
  3: ['4pm Reserved'],
  4: ['4pm Reserved'],
  5: ['4pm Reserved'],
  6: ['11am Fundamentals'],
};

export function SchedulePage() {
  const t = useTranslations('SchedulePage');

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Event Calendar Card */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Event Calendar</h2>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              {t('import_calendar_button')}
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('add_event_button')}
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        <Tabs defaultValue="month" className="w-full">
          <TabsList>
            <TabsTrigger value="month">{t('month_tab')}</TabsTrigger>
            <TabsTrigger value="week">{t('week_tab')}</TabsTrigger>
            <TabsTrigger value="day">{t('day_tab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="month" className="space-y-4">
            {/* Days of Week */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {daysOfWeek.map(day => (
                <div key={day} className="py-2 text-center text-sm font-semibold text-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(({ id, day }) => (
                <div
                  key={id}
                  className="min-h-24 rounded-md border border-border p-2"
                >
                  {day && (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        {day === 1 && <span className="text-sm font-semibold text-foreground">April</span>}
                        <p className="text-sm font-semibold text-foreground">{day}</p>
                      </div>
                      {mockEvents[day] && (
                        <div className="space-y-0.5">
                          {mockEvents[day].slice(0, 2).map(event => (
                            <p key={event} className="truncate text-xs text-muted-foreground">
                              •
                              {' '}
                              {event}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <div className="py-8 text-center text-muted-foreground">
              Week view coming soon
            </div>
          </TabsContent>

          <TabsContent value="day" className="space-y-4">
            <div className="py-8 text-center text-muted-foreground">
              Day view coming soon
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
