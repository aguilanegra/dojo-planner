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
