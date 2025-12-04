'use client';

import { MoreHorizontal, Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Panel, PanelContent, PanelHeader, PanelTabs } from '@/components/ui/panel';
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

      {/* Event Calendar Panel */}
      <Panel>
        <Tabs defaultValue="month" className="w-full">
          <PanelHeader withDivider={true}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-medium text-foreground">Event Calendar</h2>
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
              <PanelTabs>
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger value="month" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">{t('month_tab')}</TabsTrigger>
                  <TabsTrigger value="week" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">{t('week_tab')}</TabsTrigger>
                  <TabsTrigger value="day" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">{t('day_tab')}</TabsTrigger>
                </TabsList>
              </PanelTabs>
            </div>
          </PanelHeader>

          <TabsContent value="month" className="mt-0">
            <PanelContent padded>
              <div className="space-y-4">
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
              </div>
            </PanelContent>
          </TabsContent>

          <TabsContent value="week" className="mt-0">
            <PanelContent padded>
              <div className="py-8 text-center text-muted-foreground">
                Week view coming soon
              </div>
            </PanelContent>
          </TabsContent>

          <TabsContent value="day" className="mt-0">
            <PanelContent padded>
              <div className="py-8 text-center text-muted-foreground">
                Day view coming soon
              </div>
            </PanelContent>
          </TabsContent>
        </Tabs>
      </Panel>
    </div>
  );
}
