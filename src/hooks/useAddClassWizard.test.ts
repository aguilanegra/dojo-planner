import type { AddClassWizardData, ClassSchedule, DayOfWeek } from './useAddClassWizard';
import { describe, expect, it } from 'vitest';

describe('useAddClassWizard types and exports', () => {
  it('should export AddClassWizardData type', () => {
    const testData: AddClassWizardData = {
      className: 'Test Class',
      program: 'adult-bjj',
      maximumCapacity: 20,
      minimumAge: 16,
      allowWalkIns: 'Yes',
      description: 'Test description',
      schedule: {
        daysOfWeek: ['Monday', 'Wednesday'],
        timeHour: 6,
        timeMinute: 0,
        timeAmPm: 'AM',
        durationHours: 1,
        durationMinutes: 0,
        location: 'cta-irving',
        staffMember: 'coach-alex',
        assistantStaff: '',
      },
      calendarColor: '#000000',
      tags: ['tag1', 'tag2'],
    };

    expect(testData.className).toBe('Test Class');
    expect(testData.program).toBe('adult-bjj');
    expect(testData.maximumCapacity).toBe(20);
  });

  it('should support ClassSchedule type', () => {
    const schedule: ClassSchedule = {
      daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
      timeHour: 6,
      timeMinute: 30,
      timeAmPm: 'PM',
      durationHours: 1,
      durationMinutes: 30,
      location: 'downtown-hq',
      staffMember: 'professor-jessica',
      assistantStaff: 'coach-liza',
    };

    expect(schedule.daysOfWeek).toHaveLength(3);
    expect(schedule.timeHour).toBe(6);
    expect(schedule.timeAmPm).toBe('PM');
  });

  it('should support all days of week', () => {
    const days: DayOfWeek[] = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    expect(days).toHaveLength(7);
    expect(days[0]).toBe('Monday');
    expect(days[6]).toBe('Sunday');
  });

  it('should support all allow walk-ins options', () => {
    const options: Array<'Yes' | 'No'> = ['Yes', 'No'];

    expect(options).toHaveLength(2);
    expect(options[0]).toBe('Yes');
    expect(options[1]).toBe('No');
  });

  it('should support all wizard steps', () => {
    const steps: Array<'class-basics' | 'schedule' | 'tags' | 'success'> = [
      'class-basics',
      'schedule',
      'tags',
      'success',
    ];

    expect(steps).toHaveLength(4);
    expect(steps[0]).toBe('class-basics');
    expect(steps[1]).toBe('schedule');
    expect(steps[2]).toBe('tags');
    expect(steps[3]).toBe('success');
  });

  it('should allow null values for optional number fields', () => {
    const minimalData: AddClassWizardData = {
      className: '',
      program: '',
      maximumCapacity: null,
      minimumAge: null,
      allowWalkIns: 'Yes',
      description: '',
      schedule: {
        daysOfWeek: [],
        timeHour: 6,
        timeMinute: 0,
        timeAmPm: 'AM',
        durationHours: 1,
        durationMinutes: 0,
        location: '',
        staffMember: '',
        assistantStaff: '',
      },
      calendarColor: '#000000',
      tags: [],
    };

    expect(minimalData.maximumCapacity).toBeNull();
    expect(minimalData.minimumAge).toBeNull();
    expect(minimalData.className).toBe('');
  });

  it('should allow creating schedule with all time options', () => {
    const morningSchedule: ClassSchedule = {
      daysOfWeek: ['Monday'],
      timeHour: 6,
      timeMinute: 0,
      timeAmPm: 'AM',
      durationHours: 1,
      durationMinutes: 0,
      location: 'test',
      staffMember: 'test',
      assistantStaff: '',
    };

    const eveningSchedule: ClassSchedule = {
      daysOfWeek: ['Friday'],
      timeHour: 7,
      timeMinute: 30,
      timeAmPm: 'PM',
      durationHours: 2,
      durationMinutes: 30,
      location: 'test',
      staffMember: 'test',
      assistantStaff: '',
    };

    expect(morningSchedule.timeAmPm).toBe('AM');
    expect(eveningSchedule.timeAmPm).toBe('PM');
    expect(eveningSchedule.durationHours).toBe(2);
    expect(eveningSchedule.durationMinutes).toBe(30);
  });

  it('should allow tags to be an array of strings', () => {
    const testData: AddClassWizardData = {
      className: 'Test',
      program: 'test',
      maximumCapacity: null,
      minimumAge: null,
      allowWalkIns: 'Yes',
      description: 'Test',
      schedule: {
        daysOfWeek: [],
        timeHour: 6,
        timeMinute: 0,
        timeAmPm: 'AM',
        durationHours: 1,
        durationMinutes: 0,
        location: '',
        staffMember: '',
        assistantStaff: '',
      },
      calendarColor: '#000000',
      tags: ['beginner', 'adults', 'gi'],
    };

    expect(testData.tags).toHaveLength(3);
    expect(testData.tags[0]).toBe('beginner');
    expect(testData.tags[1]).toBe('adults');
    expect(testData.tags[2]).toBe('gi');
  });

  it('should allow hex color codes for calendar color', () => {
    const testData: AddClassWizardData = {
      className: 'Test',
      program: 'test',
      maximumCapacity: null,
      minimumAge: null,
      allowWalkIns: 'Yes',
      description: 'Test',
      schedule: {
        daysOfWeek: [],
        timeHour: 6,
        timeMinute: 0,
        timeAmPm: 'AM',
        durationHours: 1,
        durationMinutes: 0,
        location: '',
        staffMember: '',
        assistantStaff: '',
      },
      calendarColor: '#ff0000',
      tags: [],
    };

    expect(testData.calendarColor).toBe('#ff0000');
    expect(testData.calendarColor).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
