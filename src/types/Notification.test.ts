import type { Notification, NotificationType } from './Notification';
import { describe, expect, it } from 'vitest';
import { mockNotifications } from './Notification';

describe('Notification types', () => {
  describe('mockNotifications', () => {
    it('should have at least 7 mock notifications', () => {
      expect(mockNotifications.length).toBeGreaterThanOrEqual(7);
    });

    it('should have unique ids for each notification', () => {
      const ids = mockNotifications.map(n => n.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid notification types', () => {
      const validTypes: NotificationType[] = ['info', 'success', 'warning', 'error'];

      mockNotifications.forEach((notification) => {
        expect(validTypes).toContain(notification.type);
      });
    });

    it('should include all notification types', () => {
      const types = new Set(mockNotifications.map(n => n.type));

      expect(types.has('info')).toBe(true);
      expect(types.has('success')).toBe(true);
      expect(types.has('warning')).toBe(true);
      expect(types.has('error')).toBe(true);
    });

    it('should have valid Date objects for timestamps', () => {
      mockNotifications.forEach((notification) => {
        expect(notification.timestamp).toBeInstanceOf(Date);
        expect(notification.timestamp.getTime()).not.toBeNaN();
      });
    });

    it('should have timestamps in the past', () => {
      const now = new Date();

      mockNotifications.forEach((notification) => {
        expect(notification.timestamp.getTime()).toBeLessThanOrEqual(now.getTime());
      });
    });

    it('should have non-empty title and message for each notification', () => {
      mockNotifications.forEach((notification) => {
        expect(notification.title.length).toBeGreaterThan(0);
        expect(notification.message.length).toBeGreaterThan(0);
      });
    });

    it('should have boolean read status for each notification', () => {
      mockNotifications.forEach((notification) => {
        expect(typeof notification.read).toBe('boolean');
      });
    });

    it('should have some unread notifications', () => {
      const unreadNotifications = mockNotifications.filter(n => !n.read);

      expect(unreadNotifications.length).toBeGreaterThan(0);
    });

    it('should conform to Notification type structure', () => {
      mockNotifications.forEach((notification) => {
        const keys = Object.keys(notification);

        expect(keys).toContain('id');
        expect(keys).toContain('type');
        expect(keys).toContain('title');
        expect(keys).toContain('message');
        expect(keys).toContain('timestamp');
        expect(keys).toContain('read');
      });
    });
  });

  describe('Notification type interface', () => {
    it('should allow creating a valid notification object', () => {
      const notification: Notification = {
        id: 'test-id',
        type: 'info',
        title: 'new_member_joined',
        message: 'new_member_joined_message',
        timestamp: new Date(),
        read: false,
      };

      expect(notification.id).toBe('test-id');
      expect(notification.type).toBe('info');
      expect(notification.title).toBe('new_member_joined');
      expect(notification.message).toBe('new_member_joined_message');
      expect(notification.read).toBe(false);
    });

    it('should allow all valid notification types', () => {
      const types: NotificationType[] = ['info', 'success', 'warning', 'error'];

      types.forEach((type) => {
        const notification: Notification = {
          id: `test-${type}`,
          type,
          title: 'class_reminder',
          message: 'class_reminder_message',
          timestamp: new Date(),
          read: false,
        };

        expect(notification.type).toBe(type);
      });
    });
  });
});
