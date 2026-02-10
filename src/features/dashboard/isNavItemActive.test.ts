import { describe, expect, it } from 'vitest';
import { isNavItemActive } from './isNavItemActive';

describe('isNavItemActive', () => {
  const locale = 'en';

  it('should match /dashboard exactly', () => {
    expect(isNavItemActive('/en/dashboard', locale, '/dashboard')).toBe(true);
  });

  it('should not match /dashboard when on /dashboard/members', () => {
    expect(isNavItemActive('/en/dashboard/members', locale, '/dashboard')).toBe(false);
  });

  it('should not match /dashboard when on a deep nested member page', () => {
    expect(isNavItemActive('/en/dashboard/members/45bf6a96-2e66-4e42-a94a-35042e2f8da2/edit', locale, '/dashboard')).toBe(false);
  });

  it('should match /dashboard/members exactly', () => {
    expect(isNavItemActive('/en/dashboard/members', locale, '/dashboard/members')).toBe(true);
  });

  it('should match /dashboard/members for a member detail page', () => {
    expect(isNavItemActive('/en/dashboard/members/45bf6a96-2e66-4e42-a94a-35042e2f8da2/edit', locale, '/dashboard/members')).toBe(true);
  });

  it('should match /dashboard/members for a direct child route', () => {
    expect(isNavItemActive('/en/dashboard/members/some-id', locale, '/dashboard/members')).toBe(true);
  });

  it('should match /dashboard/classes for a child route', () => {
    expect(isNavItemActive('/en/dashboard/classes/some-class-id', locale, '/dashboard/classes')).toBe(true);
  });

  it('should not match /dashboard/classes when on /dashboard/members', () => {
    expect(isNavItemActive('/en/dashboard/members', locale, '/dashboard/classes')).toBe(false);
  });

  it('should work without locale prefix', () => {
    expect(isNavItemActive('/dashboard', locale, '/dashboard')).toBe(true);
  });

  it('should work with a different locale', () => {
    expect(isNavItemActive('/fr/dashboard/members', 'fr', '/dashboard/members')).toBe(true);
  });
});
