import { describe, expect, it } from 'vitest';
import messages from '@/locales/en.json';

describe('AppSidebar', () => {
  describe('Navigation structure', () => {
    it('should have Academy section with correct navigation items', () => {
      const dashboardLayout = messages.DashboardLayout;

      // Check Academy section label exists
      expect(dashboardLayout.academy_section_label).toBe('Academy');

      // Check Academy items exist and have correct values
      expect(dashboardLayout.dashboard).toBe('Dashboard');
      expect(dashboardLayout.programs).toBe('Programs');
      expect(dashboardLayout.classes).toBe('Classes');
      expect(dashboardLayout.schedule).toBe('Schedule');
      expect(dashboardLayout.members).toBe('Members');
      expect(dashboardLayout.roles).toBe('Roles');
      expect(dashboardLayout.staff).toBe('Staff');
      expect(dashboardLayout.messaging).toBe('Messaging');
    });

    it('should have Business section with correct navigation items', () => {
      const dashboardLayout = messages.DashboardLayout;

      // Check Business section label exists
      expect(dashboardLayout.business_section_label).toBe('Business');

      // Check Business items exist and have correct values
      // Note: subscription was moved to user menu dropdown
      expect(dashboardLayout.finances).toBe('Finances');
      expect(dashboardLayout.memberships).toBe('Memberships');
      expect(dashboardLayout.marketing).toBe('Marketing');
    });

    it('should have Settings section with correct navigation items', () => {
      const dashboardLayout = messages.DashboardLayout;

      // Check Settings section label exists
      expect(dashboardLayout.settings_section_label).toBe('Settings');

      // Check Settings items exist and have correct values
      expect(dashboardLayout.account_settings).toBe('Account Settings');
      expect(dashboardLayout.preferences).toBe('Preferences');
      expect(dashboardLayout.help).toBe('Help');
    });

    it('should have Log Out option', () => {
      const dashboardLayout = messages.DashboardLayout;

      // Check Log Out option exists
      expect(dashboardLayout.log_out).toBe('Log Out');
    });

    it('should have all required localization keys for navigation', () => {
      const dashboardLayout = messages.DashboardLayout;
      // Note: subscription was moved to user menu dropdown
      const requiredKeys = [
        'academy_section_label',
        'business_section_label',
        'settings_section_label',
        'dashboard',
        'classes',
        'schedule',
        'members',
        'roles',
        'staff',
        'messaging',
        'finances',
        'memberships',
        'programs',
        'marketing',
        'account_settings',
        'preferences',
        'help',
        'log_out',
      ];

      for (const key of requiredKeys) {
        expect(dashboardLayout).toHaveProperty(key);
        expect(dashboardLayout[key as keyof typeof dashboardLayout]).toBeTruthy();
      }
    });
  });
});
