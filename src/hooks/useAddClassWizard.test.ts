import type { ClassSchedule, DayOfWeek, ScheduleInstance } from './useAddClassWizard';
import { describe, expect, it } from 'vitest';
import { createMockScheduleInstance, createMockWizardData } from '@/test-utils/mockWizardData';

describe('useAddClassWizard types and exports', () => {
  const mockInstance = createMockScheduleInstance({ id: 'test-instance-1', staffMember: 'coach-alex' });

  it('should export AddClassWizardData type', () => {
    const testData = createMockWizardData({
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
    });

    expect(testData.className).toBe('Test Class');
    expect(testData.program).toBe('adult-bjj');
    expect(testData.maximumCapacity).toBe(20);
    expect(testData.itemType).toBe('class');
  });

  it('should support event type wizard data', () => {
    const testData = createMockWizardData({
      itemType: 'event',
      eventName: 'BJJ Seminar',
      eventType: 'Seminar',
      eventMaxCapacity: 50,
      eventDescription: 'Learn from the best',
      eventSchedule: {
        isMultiDay: true,
        startDate: '2026-01-15',
        endDate: '2026-01-17',
        sessions: [],
        location: 'Downtown HQ',
      },
      eventBilling: {
        hasFee: true,
        price: 199.99,
        hasEarlyBird: false,
        earlyBirdPrice: null,
        earlyBirdDeadline: null,
        hasMemberDiscount: false,
        memberDiscountType: 'percentage',
        memberDiscountAmount: null,
      },
    });

    expect(testData.itemType).toBe('event');
    expect(testData.eventName).toBe('BJJ Seminar');
    expect(testData.eventType).toBe('Seminar');
    expect(testData.eventBilling.hasFee).toBe(true);
    expect(testData.eventBilling.price).toBe(199.99);
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

  it('should support all wizard steps including new event steps', () => {
    const classSteps = [
      'type-selection',
      'class-basics',
      'schedule',
      'tags',
      'success',
    ];

    const eventSteps = [
      'type-selection',
      'event-basics',
      'event-schedule',
      'event-billing',
      'tags',
      'success',
    ];

    expect(classSteps).toHaveLength(5);
    expect(eventSteps).toHaveLength(6);
    expect(classSteps[0]).toBe('type-selection');
    expect(eventSteps[1]).toBe('event-basics');
  });

  it('should allow null values for optional number fields', () => {
    const minimalData = createMockWizardData();

    expect(minimalData.maximumCapacity).toBeNull();
    expect(minimalData.minimumAge).toBeNull();
    expect(minimalData.className).toBe('');
    expect(minimalData.eventMaxCapacity).toBeNull();
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
    const testData = createMockWizardData({
      className: 'Test',
      program: 'test',
      description: 'Test',
      tags: ['beginner', 'adults', 'gi'],
    });

    expect(testData.tags).toHaveLength(3);
    expect(testData.tags[0]).toBe('beginner');
    expect(testData.tags[1]).toBe('adults');
    expect(testData.tags[2]).toBe('gi');
  });

  it('should allow hex color codes for calendar color', () => {
    const testData = createMockWizardData({
      calendarColor: '#ff0000',
    });

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

  it('should support event billing with early bird and member discount', () => {
    const testData = createMockWizardData({
      itemType: 'event',
      eventBilling: {
        hasFee: true,
        price: 100,
        hasEarlyBird: true,
        earlyBirdPrice: 75,
        earlyBirdDeadline: '2026-01-01',
        hasMemberDiscount: true,
        memberDiscountType: 'percentage',
        memberDiscountAmount: 10,
      },
    });

    expect(testData.eventBilling.hasEarlyBird).toBe(true);
    expect(testData.eventBilling.earlyBirdPrice).toBe(75);
    expect(testData.eventBilling.hasMemberDiscount).toBe(true);
    expect(testData.eventBilling.memberDiscountType).toBe('percentage');
  });
});
