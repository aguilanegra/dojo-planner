export type NotificationType = 'info' | 'success' | 'warning' | 'error';

type NotificationTitleKey
  = | 'new_member_joined'
    | 'payment_received'
    | 'membership_expiring'
    | 'payment_failed'
    | 'class_reminder'
    | 'trial_ending'
    | 'profile_updated';

type NotificationMessageKey
  = | 'new_member_joined_message'
    | 'payment_received_message'
    | 'membership_expiring_message'
    | 'payment_failed_message'
    | 'class_reminder_message'
    | 'trial_ending_message'
    | 'profile_updated_message';

export type Notification = {
  id: string;
  type: NotificationType;
  title: NotificationTitleKey;
  message: NotificationMessageKey;
  timestamp: Date;
  read: boolean;
};

/**
 * Mock notifications for development and testing purposes.
 * These represent various notification types with different statuses.
 * Note: In production, notifications would come from a backend service.
 */
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'info',
    title: 'new_member_joined',
    message: 'new_member_joined_message',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
  },
  {
    id: 'notif-2',
    type: 'success',
    title: 'payment_received',
    message: 'payment_received_message',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 'notif-3',
    type: 'warning',
    title: 'membership_expiring',
    message: 'membership_expiring_message',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
  },
  {
    id: 'notif-4',
    type: 'error',
    title: 'payment_failed',
    message: 'payment_failed_message',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: 'notif-5',
    type: 'info',
    title: 'class_reminder',
    message: 'class_reminder_message',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
  },
  {
    id: 'notif-6',
    type: 'warning',
    title: 'trial_ending',
    message: 'trial_ending_message',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: false,
  },
  {
    id: 'notif-7',
    type: 'success',
    title: 'profile_updated',
    message: 'profile_updated_message',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];
