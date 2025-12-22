import type { Notification } from '@/types/Notification';
import { describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useNotifications } from './UseNotifications';

const createMockNotifications = (): Notification[] => [
  {
    id: 'test-1',
    type: 'info',
    title: 'new_member_joined',
    message: 'new_member_joined_message',
    timestamp: new Date(),
    read: false,
  },
  {
    id: 'test-2',
    type: 'success',
    title: 'payment_received',
    message: 'payment_received_message',
    timestamp: new Date(),
    read: false,
  },
  {
    id: 'test-3',
    type: 'warning',
    title: 'membership_expiring',
    message: 'membership_expiring_message',
    timestamp: new Date(),
    read: true,
  },
];

describe('UseNotifications', () => {
  describe('Initial state', () => {
    it('should initialize with provided notifications', async () => {
      const mockNotifications = createMockNotifications();
      const { result } = await renderHook(() => useNotifications(mockNotifications));

      expect(result.current.notifications).toHaveLength(3);
      expect(result.current.notifications[0]?.id).toBe('test-1');
    });

    it('should initialize with default mock notifications when none provided', async () => {
      const { result } = await renderHook(() => useNotifications());

      expect(result.current.notifications.length).toBeGreaterThan(0);
    });

    it('should calculate unread count correctly', async () => {
      const mockNotifications = createMockNotifications();
      const { result } = await renderHook(() => useNotifications(mockNotifications));

      expect(result.current.unreadCount).toBe(2);
    });

    it('should indicate hasUnread when there are unread notifications', async () => {
      const mockNotifications = createMockNotifications();
      const { result } = await renderHook(() => useNotifications(mockNotifications));

      expect(result.current.hasUnread).toBe(true);
    });

    it('should indicate no unread when all notifications are read', async () => {
      const allReadNotifications: Notification[] = [
        {
          id: 'test-1',
          type: 'info',
          title: 'class_reminder',
          message: 'class_reminder_message',
          timestamp: new Date(),
          read: true,
        },
      ];
      const { result } = await renderHook(() => useNotifications(allReadNotifications));

      expect(result.current.hasUnread).toBe(false);
      expect(result.current.unreadCount).toBe(0);
    });
  });

  describe('markAsRead', () => {
    it('should mark a specific notification as read', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      act(() => {
        result.current.markAsRead('test-1');
      });

      const notification = result.current.notifications.find(n => n.id === 'test-1');

      expect(notification?.read).toBe(true);
    });

    it('should update unread count after marking as read', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      expect(result.current.unreadCount).toBe(2);

      act(() => {
        result.current.markAsRead('test-1');
      });

      expect(result.current.unreadCount).toBe(1);
    });

    it('should not affect other notifications when marking one as read', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      act(() => {
        result.current.markAsRead('test-1');
      });

      const notification2 = result.current.notifications.find(n => n.id === 'test-2');

      expect(notification2?.read).toBe(false);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      act(() => {
        result.current.markAllAsRead();
      });

      expect(result.current.unreadCount).toBe(0);
      expect(result.current.hasUnread).toBe(false);

      result.current.notifications.forEach((notification) => {
        expect(notification.read).toBe(true);
      });
    });
  });

  describe('removeNotification', () => {
    it('should remove a specific notification', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      act(() => {
        result.current.removeNotification('test-1');
      });

      expect(result.current.notifications).toHaveLength(2);
      expect(result.current.notifications.find(n => n.id === 'test-1')).toBeUndefined();
    });

    it('should update unread count after removing unread notification', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      expect(result.current.unreadCount).toBe(2);

      act(() => {
        result.current.removeNotification('test-1');
      });

      expect(result.current.unreadCount).toBe(1);
    });

    it('should not change unread count when removing read notification', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      expect(result.current.unreadCount).toBe(2);

      act(() => {
        result.current.removeNotification('test-3');
      });

      expect(result.current.unreadCount).toBe(2);
    });
  });

  describe('clearAll', () => {
    it('should remove all notifications', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.notifications).toHaveLength(0);
      expect(result.current.unreadCount).toBe(0);
      expect(result.current.hasUnread).toBe(false);
    });
  });

  describe('addNotification', () => {
    it('should add a new notification to the beginning of the list', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      act(() => {
        result.current.addNotification({
          type: 'error',
          title: 'payment_failed',
          message: 'payment_failed_message',
        });
      });

      expect(result.current.notifications).toHaveLength(4);
      expect(result.current.notifications[0]?.type).toBe('error');
      expect(result.current.notifications[0]?.title).toBe('payment_failed');
    });

    it('should set new notification as unread', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      const initialUnreadCount = result.current.unreadCount;

      act(() => {
        result.current.addNotification({
          type: 'info',
          title: 'class_reminder',
          message: 'class_reminder_message',
        });
      });

      expect(result.current.unreadCount).toBe(initialUnreadCount + 1);
      expect(result.current.notifications[0]?.read).toBe(false);
    });

    it('should generate unique id for new notification', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      act(() => {
        result.current.addNotification({
          type: 'info',
          title: 'trial_ending',
          message: 'trial_ending_message',
        });
      });

      const newNotification = result.current.notifications[0];

      expect(newNotification?.id).toMatch(/^notif-\d+$/);
    });

    it('should set current timestamp for new notification', async () => {
      const mockNotifications = createMockNotifications();
      const { result, act } = await renderHook(() => useNotifications(mockNotifications));

      const beforeAdd = new Date();

      act(() => {
        result.current.addNotification({
          type: 'success',
          title: 'profile_updated',
          message: 'profile_updated_message',
        });
      });

      const afterAdd = new Date();
      const newNotification = result.current.notifications[0];

      expect(newNotification?.timestamp.getTime()).toBeGreaterThanOrEqual(beforeAdd.getTime());
      expect(newNotification?.timestamp.getTime()).toBeLessThanOrEqual(afterAdd.getTime());
    });
  });

  describe('Empty state', () => {
    it('should handle empty notifications array', async () => {
      const { result } = await renderHook(() => useNotifications([]));

      expect(result.current.notifications).toHaveLength(0);
      expect(result.current.unreadCount).toBe(0);
      expect(result.current.hasUnread).toBe(false);
    });
  });
});
