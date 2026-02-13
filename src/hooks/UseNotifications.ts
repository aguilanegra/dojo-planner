import type { Notification } from '@/types/Notification';
import { useCallback, useState } from 'react';

/**
 * React Hook to manage notifications state.
 * Provides functionality to track, read, and manage notifications.
 * @hook
 */
export const useNotifications = (initialNotifications: Notification[] = []) => {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications,
  );

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true })),
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id),
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    unreadCount,
    hasUnread,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    addNotification,
  };
};
