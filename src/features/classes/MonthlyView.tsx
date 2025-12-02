'use client';

import { ChevronDown, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { generateMonthlySchedule } from './classesData';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function MonthlyView() {
  const t = useTranslations('ClassesPage');
  const [currentDate, setCurrentDate] = useState(() => new Date(2025, 8, 15)); // September 15, 2025
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthlyEvents = generateMonthlySchedule(year, month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevious = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const dateDisplay = `${monthName} ${currentDate.getFullYear()}`;

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

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
            <ButtonGroupRoot value="monthly" onValueChange={() => {}}>
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

      {/* Calendar Grid */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <div className="inline-block min-w-full">
          {/* Header with days of week */}
          <div className="grid grid-cols-7 gap-0 bg-muted">
            {DAYS_OF_WEEK.map(day => (
              <div
                key={day}
                className="border-r border-border p-2 text-center text-sm font-semibold text-foreground last:border-r-0 sm:p-3"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-0 divide-x divide-y divide-border bg-background">
            {calendarDays.map((day, index) => (
              <div
                key={day || index}
                className={`min-h-20 border-r border-border p-1 last:border-r-0 sm:min-h-24 sm:p-2 ${
                  !day ? 'bg-muted' : ''
                }`}
              >
                {day && (
                  <>
                    <div className="mb-1 text-sm font-semibold text-foreground">{day}</div>
                    <div className="flex flex-col gap-1">
                      {monthlyEvents[day.toString()]?.slice(0, 3).map(event => (
                        <div
                          key={event.classId}
                          className="truncate rounded px-1.5 py-1 text-xs font-medium text-white sm:text-sm"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.className}
                        </div>
                      ))}
                      {(monthlyEvents[day.toString()]?.length ?? 0) > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +
                          {monthlyEvents[day.toString()]!.length - 3}
                          {' more'}
                        </div>
                      )}
                    </div>
                  </>
                )}
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
