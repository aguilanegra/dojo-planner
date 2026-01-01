'use client';

import type { ClassFilters } from './ClassFilterBar';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { generateWeeklySchedule, mockClasses } from './classesData';
import { ClassEventHoverCard } from './ClassEventHoverCard';
import { ClassFilterBar } from './ClassFilterBar';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

type WeeklyViewProps = {
  withFilters?: ClassFilters;
};

export function WeeklyView({ withFilters }: WeeklyViewProps = {}) {
  const [currentDate, setCurrentDate] = useState(() => new Date(2025, 8, 15)); // September 15, 2025
  const [localFilters, setLocalFilters] = useState<ClassFilters>({
    search: '',
    tag: 'all',
    instructor: 'all',
  });

  // Use parent filters if provided, otherwise use local filters
  const filters = withFilters || localFilters;
  const setFilters = withFilters ? () => {} : setLocalFilters;

  const dayOfWeek = currentDate.getDay();
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - dayOfWeek);

  // Get unique instructors from mockClasses
  const allInstructors = Array.from(
    new Set(mockClasses.flatMap(cls => cls.instructors.map(i => i.name))),
  );

  // Filter classes based on filters
  const filteredClasses = mockClasses.filter((cls) => {
    const matchesSearch = cls.name.toLowerCase().includes(filters.search.toLowerCase())
      || cls.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesTag = filters.tag === 'all' || cls.type === filters.tag || cls.style === filters.tag;
    const matchesInstructor = filters.instructor === 'all'
      || cls.instructors.some(i => i.name === filters.instructor);
    return matchesSearch && matchesTag && matchesInstructor;
  });

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

  // Calculate week end date (Saturday)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Format date range display
  const startMonth = weekStart.toLocaleString('default', { month: 'long' });
  const endMonth = weekEnd.toLocaleString('default', { month: 'long' });

  // If week spans two months, show both month names
  const dateDisplay = startMonth === endMonth
    ? `${startMonth} ${weekStart.getDate()} - ${weekEnd.getDate()}`
    : `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}`;

  const weeklyEvents = generateWeeklySchedule(currentDate, filteredClasses.length > 0 ? filteredClasses : mockClasses);

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
      {/* Header - Only show when not embedded */}
      {!withFilters && (
        <div>
          <h1 className="text-3xl font-bold text-foreground">Class Calendar</h1>
        </div>
      )}

      {/* Controls - Only show when not embedded */}
      {!withFilters && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Filter Bar */}
            <div className="flex-1">
              <ClassFilterBar
                onFiltersChangeAction={setFilters}
                instructors={allInstructors}
              />
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
      )}

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
        <table className="w-full table-fixed border-collapse">
          {/* Header with days */}
          <thead className="bg-muted">
            <tr>
              <th className="w-20 border-r border-border p-2 text-center text-sm font-semibold text-foreground">Time</th>
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                return (
                  <th
                    key={date.toISOString()}
                    className="border-r border-border p-2 text-center text-xs font-semibold text-foreground last:border-r-0 sm:text-sm"
                  >
                    <div>{DAYS_OF_WEEK[i]}</div>
                    <div>{date.getDate()}</div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Time slots */}
          <tbody className="bg-background">
            {HOURS.map(hour => (
              <tr key={hour} className="border-b border-border">
                {/* Time label */}
                <td className="w-20 border-r border-border p-1 text-center text-xs text-muted-foreground sm:p-2 sm:text-sm">
                  {formatHour(hour)}
                </td>

                {/* Day cells */}
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const events = getEventsForTimeSlot(dayIndex, hour);
                  return (
                    <td
                      key={`${DAYS_OF_WEEK[dayIndex]}-${hour}`}
                      className="border-r border-border p-1 align-top last:border-r-0 sm:p-2"
                      style={{ minHeight: '60px', height: '60px' }}
                    >
                      {events.map(event => (
                        <ClassEventHoverCard
                          key={`${event.classId}-${event.hour}-${event.minute}-${event.date ?? ''}`}
                          classId={event.classId}
                          className={event.className}
                          color={event.color}
                          hour={event.hour}
                          minute={event.minute}
                          duration={event.duration}
                          exception={event.exception}
                          sourceView="weekly"
                        >
                          {event.className}
                        </ClassEventHoverCard>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
