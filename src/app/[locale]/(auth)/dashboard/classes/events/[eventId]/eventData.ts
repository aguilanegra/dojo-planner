import type { EventSession } from '@/templates/EventCard';

export type EventInstructor = {
  id: string;
  name: string;
  photoUrl: string;
};

export type EventDetailData = {
  id: string;
  name: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  sessions: EventSession[];
  location: string;
  instructors: EventInstructor[];
  price: number | null;
  maxCapacity: number | null;
  currentRegistrations: number;
  earlyBirdPrice: number | null;
  earlyBirdDeadline: string | null;
  memberDiscount: number | null;
  memberDiscountType: 'percentage' | 'fixed' | null;
};

// Mock data for events matching the landing page
export const mockEventDetails: Record<string, EventDetailData> = {
  'event-1': {
    id: 'event-1',
    name: 'BJJ Fundamentals Seminar Series',
    description: 'A comprehensive 3-day seminar covering essential BJJ fundamentals with world-class instruction. Perfect for beginners and experienced practitioners looking to refine their basics.',
    eventType: 'Seminar',
    startDate: 'January 15, 2026',
    endDate: 'January 17, 2026',
    sessions: [
      { date: 'January 15, 2026', time: '10:00 AM - 1:00 PM' },
      { date: 'January 15, 2026', time: '3:00 PM - 6:00 PM' },
      { date: 'January 16, 2026', time: '10:00 AM - 1:00 PM' },
      { date: 'January 16, 2026', time: '3:00 PM - 6:00 PM' },
      { date: 'January 17, 2026', time: '10:00 AM - 1:00 PM' },
    ],
    location: 'Downtown HQ',
    instructors: [
      { id: '1', name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' },
      { id: '2', name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    ],
    price: 199.99,
    maxCapacity: 50,
    currentRegistrations: 32,
    earlyBirdPrice: 149.99,
    earlyBirdDeadline: 'January 1, 2026',
    memberDiscount: 15,
    memberDiscountType: 'percentage',
  },
  'event-2': {
    id: 'event-2',
    name: 'Guest Instructor: Master Rodriguez',
    description: 'One-day exclusive training session with IBJJF World Champion Master Rodriguez. Limited spots available! Learn advanced guard techniques and competition strategies.',
    eventType: 'Guest Instructor',
    startDate: 'February 8, 2026',
    endDate: 'February 8, 2026',
    sessions: [
      { date: 'February 8, 2026', time: '11:00 AM - 2:00 PM' },
    ],
    location: 'Downtown HQ',
    instructors: [
      { id: '3', name: 'Master Rodriguez', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rodriguez' },
    ],
    price: 75,
    maxCapacity: 30,
    currentRegistrations: 28,
    earlyBirdPrice: null,
    earlyBirdDeadline: null,
    memberDiscount: 10,
    memberDiscountType: 'fixed',
  },
};

export function getInitials(name: string) {
  const parts = name.split(' ');
  return parts.map(part => part[0]).join('').toUpperCase();
}

export function formatPrice(price: number | null): string {
  if (price === null || price === 0) {
    return 'Free';
  }
  return `$${price.toFixed(2)}`;
}
