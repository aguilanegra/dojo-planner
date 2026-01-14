import { describe, expect, it } from 'vitest';
import { formatPrice, getInitials, mockEventDetails } from './eventData';

// Get events with non-null assertions for testing - we know these exist
const event1 = mockEventDetails['event-1']!;
const event2 = mockEventDetails['event-2']!;

describe('EventDetailPage - Helper Functions', () => {
  describe('getInitials', () => {
    it('should return initials from a full name', () => {
      expect(getInitials('Professor Joao')).toBe('PJ');
    });

    it('should return initials from a single word', () => {
      expect(getInitials('Admin')).toBe('A');
    });

    it('should return initials from multiple words', () => {
      expect(getInitials('Master John Rodriguez')).toBe('MJR');
    });

    it('should handle names with extra spaces between words', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });
  });

  describe('formatPrice', () => {
    it('should return "Free" for null price', () => {
      expect(formatPrice(null)).toBe('Free');
    });

    it('should return "Free" for zero price', () => {
      expect(formatPrice(0)).toBe('Free');
    });

    it('should format a price with two decimal places', () => {
      expect(formatPrice(199.99)).toBe('$199.99');
    });

    it('should format an integer price with two decimal places', () => {
      expect(formatPrice(75)).toBe('$75.00');
    });

    it('should format a small price correctly', () => {
      expect(formatPrice(9.5)).toBe('$9.50');
    });

    it('should format a large price correctly', () => {
      expect(formatPrice(1000.00)).toBe('$1000.00');
    });
  });
});

describe('EventDetailPage - Mock Data Structure', () => {
  describe('mockEventDetails', () => {
    it('should contain event-1 with BJJ Fundamentals Seminar Series', () => {
      expect(event1).toBeDefined();
      expect(event1.name).toBe('BJJ Fundamentals Seminar Series');
    });

    it('should contain event-2 with Guest Instructor: Master Rodriguez', () => {
      expect(event2).toBeDefined();
      expect(event2.name).toBe('Guest Instructor: Master Rodriguez');
    });

    it('should have correct structure for event-1', () => {
      const event = event1;

      expect(event.id).toBe('event-1');
      expect(event.eventType).toBe('Seminar');
      expect(event.startDate).toBe('January 15, 2026');
      expect(event.endDate).toBe('January 17, 2026');
      expect(event.location).toBe('Downtown HQ');
      expect(event.price).toBe(199.99);
      expect(event.maxCapacity).toBe(50);
      expect(event.currentRegistrations).toBe(32);
      expect(event.earlyBirdPrice).toBe(149.99);
      expect(event.earlyBirdDeadline).toBe('January 1, 2026');
      expect(event.memberDiscount).toBe(15);
      expect(event.memberDiscountType).toBe('percentage');
    });

    it('should have correct structure for event-2', () => {
      const event = event2;

      expect(event.id).toBe('event-2');
      expect(event.eventType).toBe('Guest Instructor');
      expect(event.startDate).toBe('February 8, 2026');
      expect(event.endDate).toBe('February 8, 2026');
      expect(event.price).toBe(75);
      expect(event.maxCapacity).toBe(30);
      expect(event.currentRegistrations).toBe(28);
      expect(event.earlyBirdPrice).toBeNull();
      expect(event.earlyBirdDeadline).toBeNull();
      expect(event.memberDiscount).toBe(10);
      expect(event.memberDiscountType).toBe('fixed');
    });

    it('event-1 should be a multi-day event', () => {
      const event = event1;

      expect(event.startDate).not.toBe(event.endDate);
    });

    it('event-2 should be a single-day event', () => {
      const event = event2;

      expect(event.startDate).toBe(event.endDate);
    });

    it('event-1 should have multiple sessions', () => {
      const event = event1;
      const firstSession = event.sessions[0];

      expect(event.sessions.length).toBe(5);
      expect(firstSession?.date).toBe('January 15, 2026');
      expect(firstSession?.time).toBe('10:00 AM - 1:00 PM');
    });

    it('event-2 should have a single session', () => {
      const event = event2;
      const firstSession = event.sessions[0];

      expect(event.sessions.length).toBe(1);
      expect(firstSession?.date).toBe('February 8, 2026');
      expect(firstSession?.time).toBe('11:00 AM - 2:00 PM');
    });

    it('event-1 should have multiple instructors', () => {
      const event = event1;
      const firstInstructor = event.instructors[0];
      const secondInstructor = event.instructors[1];

      expect(event.instructors.length).toBe(2);
      expect(firstInstructor?.name).toBe('Professor Joao');
      expect(secondInstructor?.name).toBe('Professor Jessica');
    });

    it('event-2 should have a single instructor', () => {
      const event = event2;
      const firstInstructor = event.instructors[0];

      expect(event.instructors.length).toBe(1);
      expect(firstInstructor?.name).toBe('Master Rodriguez');
    });

    it('event-1 should have spots remaining', () => {
      const event = event1;
      const spotsRemaining = event.maxCapacity! - event.currentRegistrations;

      expect(spotsRemaining).toBe(18);
    });

    it('event-2 should have limited spots remaining', () => {
      const event = event2;
      const spotsRemaining = event.maxCapacity! - event.currentRegistrations;

      expect(spotsRemaining).toBe(2);
    });
  });

  describe('Event types', () => {
    it('event-1 should have percentage member discount', () => {
      const event = event1;

      expect(event.memberDiscountType).toBe('percentage');
      expect(event.memberDiscount).toBe(15);
    });

    it('event-2 should have fixed member discount', () => {
      const event = event2;

      expect(event.memberDiscountType).toBe('fixed');
      expect(event.memberDiscount).toBe(10);
    });
  });

  describe('Instructor data', () => {
    it('instructors should have valid photo URLs', () => {
      for (const instructor of event1.instructors) {
        expect(instructor.photoUrl).toMatch(/^https:\/\/api\.dicebear\.com/);
      }

      for (const instructor of event2.instructors) {
        expect(instructor.photoUrl).toMatch(/^https:\/\/api\.dicebear\.com/);
      }
    });

    it('instructors should have unique IDs', () => {
      const allInstructors = [
        ...event1.instructors,
        ...event2.instructors,
      ];
      const ids = allInstructors.map(i => i.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Event description', () => {
    it('event-1 should have a meaningful description', () => {
      const event = event1;

      expect(event.description).toContain('BJJ');
      expect(event.description).toContain('fundamentals');
      expect(event.description.length).toBeGreaterThan(50);
    });

    it('event-2 should have a meaningful description', () => {
      const event = event2;

      expect(event.description).toContain('IBJJF');
      expect(event.description).toContain('Rodriguez');
      expect(event.description.length).toBeGreaterThan(50);
    });
  });
});
