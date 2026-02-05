import { describe, expect, it } from 'vitest';
import { formatPrice, getInitials } from './eventData';

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
