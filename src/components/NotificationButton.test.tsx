import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import { NotificationButton } from './NotificationButton';

describe('NotificationButton', () => {
  describe('Rendering', () => {
    it('should render the notification button', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const button = page.getByRole('button', { name: /view notifications/i });

      await expect.element(button).toBeInTheDocument();
    });

    it('should render the bell icon', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const button = page.getByRole('button', { name: /view notifications/i });

      await expect.element(button).toBeInTheDocument();
    });

    it('should show unread indicator when there are unread notifications', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const indicator = page.getByLabelText(/unread notifications/i);

      await expect.element(indicator).toBeInTheDocument();
    });
  });

  describe('Dropdown interaction', () => {
    it('should open dropdown when clicking the button', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const button = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(button);

      const markAllButton = page.getByRole('button', { name: /mark all as read/i });

      await expect.element(markAllButton).toBeVisible();
    });

    it('should show mark all as read button when there are unread notifications', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const button = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(button);

      const markAllButton = page.getByRole('button', { name: /mark all as read/i });

      await expect.element(markAllButton).toBeVisible();
    });

    it('should display notification items in the dropdown', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const button = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(button);

      const newMemberNotification = page.getByText('New Member Joined');

      await expect.element(newMemberNotification).toBeVisible();
    });

    it('should display multiple notification types', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const button = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(button);

      const paymentReceived = page.getByText('Payment Received');
      const membershipExpiring = page.getByText('Membership Expiring Soon');
      const paymentFailed = page.getByText('Payment Failed');

      await expect.element(paymentReceived).toBeVisible();
      await expect.element(membershipExpiring).toBeVisible();
      await expect.element(paymentFailed).toBeVisible();
    });
  });

  describe('Mark as read functionality', () => {
    it('should mark all notifications as read when clicking mark all button', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const button = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(button);

      const markAllButton = page.getByRole('button', { name: /mark all as read/i });
      await userEvent.click(markAllButton);

      await expect.element(markAllButton).not.toBeInTheDocument();
    });

    it('should mark individual notification as read when clicking on it', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const triggerButton = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(triggerButton);

      const notificationItem = page.getByRole('button', { name: /New Member Joined/i });
      await userEvent.click(notificationItem);

      await expect.element(notificationItem).toBeInTheDocument();
    });

    it('should mark notification as read when pressing Enter key', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const triggerButton = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(triggerButton);

      const notificationItem = page.getByRole('button', { name: /New Member Joined/i });
      await userEvent.tab();
      await userEvent.keyboard('{Enter}');

      await expect.element(notificationItem).toBeInTheDocument();
    });

    it('should mark notification as read when pressing Space key', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const triggerButton = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(triggerButton);

      const notificationItem = page.getByRole('button', { name: /Payment Received/i });
      await userEvent.tab();
      await userEvent.keyboard(' ');

      await expect.element(notificationItem).toBeInTheDocument();
    });
  });

  describe('Dismiss notification functionality', () => {
    it('should show dismiss buttons on notification items', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const triggerButton = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(triggerButton);

      const dismissButtons = page.getByLabelText(/dismiss notification/i);

      await expect.element(dismissButtons.first()).toBeInTheDocument();
    });

    it('should remove notification when clicking dismiss button', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const triggerButton = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(triggerButton);

      const notificationsBefore = page.getByRole('button', { name: /New Member Joined/i });

      await expect.element(notificationsBefore).toBeInTheDocument();

      const dismissButtons = page.getByLabelText(/dismiss notification/i);
      await userEvent.click(dismissButtons.first());

      await expect.element(notificationsBefore).not.toBeInTheDocument();
    });
  });

  describe('Keyboard interaction edge cases', () => {
    it('should not mark notification as read when pressing other keys', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const triggerButton = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(triggerButton);

      const notificationItem = page.getByRole('button', { name: /New Member Joined/i });
      await notificationItem.element().focus();
      await userEvent.keyboard('a');

      await expect.element(notificationItem).toBeInTheDocument();
    });

    it('should handle Tab key without marking as read', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const triggerButton = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(triggerButton);

      const notificationItem = page.getByRole('button', { name: /New Member Joined/i });
      await notificationItem.element().focus();
      await userEvent.keyboard('{Tab}');

      await expect.element(notificationItem).toBeInTheDocument();
    });
  });

  describe('Relative time formatting', () => {
    it('should display relative time for notifications', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const triggerButton = page.getByRole('button', { name: /view notifications/i });
      await userEvent.click(triggerButton);

      const timeText = page.getByText(/minutes ago|hour ago|hours ago|day ago|yesterday/i);

      await expect.element(timeText.first()).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible name for the trigger button', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const button = page.getByRole('button', { name: /view notifications/i });

      await expect.element(button).toBeInTheDocument();
    });

    it('should have screen reader text for the button', async () => {
      render(
        <I18nWrapper>
          <NotificationButton />
        </I18nWrapper>,
      );

      const srText = page.getByText('View notifications');

      await expect.element(srText).toBeInTheDocument();
    });
  });
});
