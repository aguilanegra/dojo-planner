import type { AddClassWizardData, ClassSchedule, DayOfWeek, ScheduleInstance } from './useAddClassWizard';
import { describe, expect, it } from 'vitest';

describe('useAddClassWizard types and exports', () => {
  const mockInstance: ScheduleInstance = {
    id: 'test-instance-1',
    dayOfWeek: 'Monday',
    timeHour: 6,
    timeMinute: 0,
    timeAmPm: 'PM',
    durationHours: 1,
    durationMinutes: 0,
    staffMember: 'coach-alex',
    assistantStaff: '',
  };

  it('should export AddClassWizardData type', () => {
    const testData: AddClassWizardData = {
      className: 'Test Class',
      program: 'adult-bjj',
      maximumCapacity: 20,
      minimumAge: 16,
      allowWalkIns: 'Yes',
      description: 'Test description',
      schedule: {
        instances: [
          { ...mockInstance, dayOfWeek: 'Monday' },
          { ...mockInstance, id: 'test-2', dayOfWeek: 'Wednesday' },
        ],
        exceptions: [],
        location: 'cta-irving',
      },
      calendarColor: '#000000',
      tags: ['tag1', 'tag2'],
    };

    expect(testData.className).toBe('Test Class');
    expect(testData.program).toBe('adult-bjj');
    expect(testData.maximumCapacity).toBe(20);
  });

  it('should support ClassSchedule type with instances', () => {
    const schedule: ClassSchedule = {
      instances: [
        { ...mockInstance, dayOfWeek: 'Monday' },
        { ...mockInstance, id: 'test-2', dayOfWeek: 'Wednesday' },
        { ...mockInstance, id: 'test-3', dayOfWeek: 'Friday' },
      ],
      exceptions: [],
      location: 'downtown-hq',
    };

    expect(schedule.instances).toHaveLength(3);
    expect(schedule.instances[0]?.dayOfWeek).toBe('Monday');
    expect(schedule.location).toBe('downtown-hq');
  });

  it('should support ScheduleInstance type', () => {
    const instance: ScheduleInstance = {
      id: 'instance-1',
      dayOfWeek: 'Monday',
      timeHour: 6,
      timeMinute: 30,
      timeAmPm: 'PM',
      durationHours: 1,
      durationMinutes: 30,
      staffMember: 'professor-jessica',
      assistantStaff: 'coach-liza',
    };

    expect(instance.dayOfWeek).toBe('Monday');
    expect(instance.timeHour).toBe(6);
    expect(instance.timeAmPm).toBe('PM');
    expect(instance.staffMember).toBe('professor-jessica');
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
        instances: [],
        exceptions: [],
        location: '',
      },
      calendarColor: '#000000',
      tags: [],
    };

    expect(minimalData.maximumCapacity).toBeNull();
    expect(minimalData.minimumAge).toBeNull();
    expect(minimalData.className).toBe('');
  });

  it('should allow creating schedule instances with all time options', () => {
    const morningInstance: ScheduleInstance = {
      id: 'morning-1',
      dayOfWeek: 'Monday',
      timeHour: 6,
      timeMinute: 0,
      timeAmPm: 'AM',
      durationHours: 1,
      durationMinutes: 0,
      staffMember: 'test',
      assistantStaff: '',
    };

    const eveningInstance: ScheduleInstance = {
      id: 'evening-1',
      dayOfWeek: 'Friday',
      timeHour: 7,
      timeMinute: 30,
      timeAmPm: 'PM',
      durationHours: 2,
      durationMinutes: 30,
      staffMember: 'test',
      assistantStaff: '',
    };

    expect(morningInstance.timeAmPm).toBe('AM');
    expect(eveningInstance.timeAmPm).toBe('PM');
    expect(eveningInstance.durationHours).toBe(2);
    expect(eveningInstance.durationMinutes).toBe(30);
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
        instances: [],
        exceptions: [],
        location: '',
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
        instances: [],
        exceptions: [],
        location: '',
      },
      calendarColor: '#ff0000',
      tags: [],
    };

    expect(testData.calendarColor).toBe('#ff0000');
    expect(testData.calendarColor).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('should allow multiple instances on the same day with different instructors', () => {
    const schedule: ClassSchedule = {
      instances: [
        { ...mockInstance, id: 'mon-am', dayOfWeek: 'Monday', timeAmPm: 'AM', staffMember: 'coach-alex' },
        { ...mockInstance, id: 'mon-pm', dayOfWeek: 'Monday', timeAmPm: 'PM', staffMember: 'professor-jessica' },
      ],
      exceptions: [],
      location: 'downtown-hq',
    };

    expect(schedule.instances).toHaveLength(2);
    expect(schedule.instances[0]?.staffMember).toBe('coach-alex');
    expect(schedule.instances[1]?.staffMember).toBe('professor-jessica');
    expect(schedule.instances[0]?.dayOfWeek).toBe('Monday');
    expect(schedule.instances[1]?.dayOfWeek).toBe('Monday');
  });
});
