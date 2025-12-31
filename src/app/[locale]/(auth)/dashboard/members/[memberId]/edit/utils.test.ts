import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  getBrandIcon,
  getInitials,
  getStatusColor,
  getStatusLabel,
  resolveTabFromUrl,
} from './utils';

describe('Member Detail Page Utilities', () => {
  describe('getInitials', () => {
    it('returns initials for a two-word name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('returns initials for a single-word name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('returns initials for a three-word name', () => {
      expect(getInitials('John Michael Doe')).toBe('JMD');
    });

    it('handles lowercase names', () => {
      expect(getInitials('john doe')).toBe('JD');
    });

    it('handles names with extra spaces', () => {
      expect(getInitials('John  Doe')).toBe('JD');
    });
  });

  describe('formatCurrency', () => {
    it('formats a whole number as USD', () => {
      expect(formatCurrency(100)).toBe('$100.00');
    });

    it('formats a decimal number as USD', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
    });

    it('formats zero as USD', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats large numbers with commas', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('formats negative numbers', () => {
      expect(formatCurrency(-50)).toBe('-$50.00');
    });
  });

  describe('getBrandIcon', () => {
    it('returns icon for visa', () => {
      expect(getBrandIcon('visa')).toBe('💳');
    });

    it('returns icon for mastercard', () => {
      expect(getBrandIcon('mastercard')).toBe('💳');
    });

    it('returns icon for amex', () => {
      expect(getBrandIcon('amex')).toBe('💳');
    });

    it('returns icon for discover', () => {
      expect(getBrandIcon('discover')).toBe('💳');
    });

    it('handles uppercase brand names', () => {
      expect(getBrandIcon('VISA')).toBe('💳');
    });

    it('handles mixed case brand names', () => {
      expect(getBrandIcon('MasterCard')).toBe('💳');
    });

    it('returns default icon for unknown brand', () => {
      expect(getBrandIcon('unknown')).toBe('💳');
    });

    it('returns default icon for empty string', () => {
      expect(getBrandIcon('')).toBe('💳');
    });
  });

  describe('getStatusColor', () => {
    it('returns default for active status', () => {
      expect(getStatusColor('active')).toBe('default');
    });

    it('returns secondary for on-hold status', () => {
      expect(getStatusColor('on-hold')).toBe('secondary');
    });

    it('returns destructive for cancelled status', () => {
      expect(getStatusColor('cancelled')).toBe('destructive');
    });
  });

  describe('getStatusLabel', () => {
    it('returns "Active" for active status', () => {
      expect(getStatusLabel('active')).toBe('Active');
    });

    it('returns "On Hold" for on-hold status', () => {
      expect(getStatusLabel('on-hold')).toBe('On Hold');
    });

    it('returns "Cancelled" for cancelled status', () => {
      expect(getStatusLabel('cancelled')).toBe('Cancelled');
    });
  });

  describe('resolveTabFromUrl', () => {
    it('returns overview for null tab parameter', () => {
      expect(resolveTabFromUrl(null)).toBe('overview');
    });

    it('returns overview for overview tab parameter', () => {
      expect(resolveTabFromUrl('overview')).toBe('overview');
    });

    it('returns notes for notes tab parameter', () => {
      expect(resolveTabFromUrl('notes')).toBe('notes');
    });

    it('returns overview for financial tab parameter (backwards compatibility)', () => {
      expect(resolveTabFromUrl('financial')).toBe('overview');
    });

    it('returns overview for invalid tab parameter', () => {
      expect(resolveTabFromUrl('invalid')).toBe('overview');
    });

    it('returns overview for empty string tab parameter', () => {
      expect(resolveTabFromUrl('')).toBe('overview');
    });
  });
});
