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
