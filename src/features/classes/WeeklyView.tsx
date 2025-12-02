'use client';

import { ChevronDown, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { generateWeeklySchedule } from './classesData';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

export function WeeklyView() {
  const t = useTranslations('ClassesPage');
  const [currentDate, setCurrentDate] = useState(() => new Date(2025, 8, 15)); // September 15, 2025
  const dayOfWeek = currentDate.getDay();
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - dayOfWeek);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const dateDisplay = `${monthName} ${currentDate.getDate()}-${currentDate.getFullYear()} (day:${currentDate.getDate()})`;

  const weeklyEvents = generateWeeklySchedule(currentDate);

  const getEventsForTimeSlot = (dayIndex: number, hour: number) => {
    return weeklyEvents.filter(
      event => event.dayOfWeek === dayIndex && event.hour === hour,
    );
  };

  const formatHour = (hour: number) => {
    if (hour === 0) {
      return '12:00 AM';
    }
    if (hour < 12) {
      return `${hour}:00 AM`;
    }
    if (hour === 12) {
      return '12:00 PM';
    }
    return `${hour - 12}:00 PM`;
  };

  const classColors = {
    'BJJ Fundamentals I': '#22c55e',
    'BJJ Fundamentals II': '#22c55e',
    'BJJ Intermediate': '#22c55e',
    'BJJ Advanced': '#a855f7',
    'Advanced No-Gi': '#a855f7',
    'Competition Team': '#a855f7',
    'Kids Class': '#06b6d4',
    'Women\'s BJJ': '#ec4899',
    'Open Mat': '#ef4444',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Class Calendar</h1>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Location Dropdown */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-2 text-xs text-foreground hover:bg-muted sm:gap-2 sm:px-3 sm:text-sm"
            >
              <span className="hidden sm:inline">{t('location_label')}</span>
              <span className="sm:hidden">Loc</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Instructors Dropdown */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-2 text-xs text-foreground hover:bg-muted sm:gap-2 sm:px-3 sm:text-sm"
            >
              <span className="hidden sm:inline">All Instructors</span>
              <span className="sm:hidden">Instr</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Toggle Button Group */}
            <ButtonGroupRoot value="weekly" onValueChange={() => {}}>
              <ButtonGroupItem value="cards" title="Cards view">
                <span className="text-xs">Cards</span>
              </ButtonGroupItem>
              <ButtonGroupItem value="weekly" title="Weekly view">
                <span className="text-xs">Weekly</span>
              </ButtonGroupItem>
              <ButtonGroupItem value="monthly" title="Monthly view">
                <span className="text-xs">Monthly</span>
              </ButtonGroupItem>
            </ButtonGroupRoot>

            {/* Add New Class Button */}
            <Button>
              <Plus className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Add New Class</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            ← Previous
          </button>
          <h2 className="text-lg font-semibold text-foreground">{dateDisplay}</h2>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            Next →
          </button>
        </div>
        <Button onClick={handleToday} className="bg-blue-600 hover:bg-blue-700">
          Today
        </Button>
      </div>

      {/* Weekly Schedule Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <div className="inline-block min-w-full">
          {/* Header with days */}
          <div className="grid gap-0 bg-muted" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
            <div className="border-r border-border p-2 text-center text-sm font-semibold text-foreground">Time</div>
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date(weekStart);
              date.setDate(weekStart.getDate() + i);
              return (
                <div
                  key={date.toISOString()}
                  className="border-r border-border p-2 text-center text-xs font-semibold text-foreground last:border-r-0 sm:text-sm"
                >
                  <div>{DAYS_OF_WEEK[i]}</div>
                  <div>{date.getDate()}</div>
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          <div className="bg-background">
            {HOURS.map(hour => (
              <div key={hour} className="grid gap-0 border-b border-border" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
                {/* Time label */}
                <div className="border-r border-border p-1 text-center text-xs text-muted-foreground sm:p-2 sm:text-sm">
                  {formatHour(hour)}
                </div>

                {/* Day cells */}
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const events = getEventsForTimeSlot(dayIndex, hour);
                  return (
                    <div
                      key={`${DAYS_OF_WEEK[dayIndex]}-${hour}`}
                      className="border-r border-border p-1 last:border-r-0 sm:p-2"
                      style={{ minHeight: '60px' }}
                    >
                      {events.map(event => (
                        <div
                          key={event.classId}
                          className="mb-1 rounded px-2 py-1 text-xs font-medium text-white sm:text-sm"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.className}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 rounded-lg border border-border p-4">
        {Object.entries(classColors).map(([className, color]) => (
          <div key={className} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-foreground sm:text-sm">{className}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
