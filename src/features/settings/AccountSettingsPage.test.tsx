import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { AccountSettingsPage } from './AccountSettingsPage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Account Settings',
      location_label: 'Location',
      location_information_title: 'Location Information',
      address_label: 'Address:',
      phone_label: 'Phone:',
      email_label: 'Email:',
      active_members_label: 'Active Members:',
      status_label: 'Status:',
      active_status: 'Active',
      subscription_details_title: 'Subscription Details',
      subscription_plan_name: 'Dojo Planner Pro - Annual',
      subscription_price: '$99/month (billed annually at $1,188)',
      next_billing_label: 'Next billing: January 15, 2025',
      change_plan_button: 'Change Plan',
      cancel_subscription_button: 'Cancel Subscription',
      payment_method_title: 'Payment Method',
      payment_method_card: '•••• •••• •••• 1234',
      payment_method_expires: 'Expires 12/26',
      billing_address_label: 'Billing Address:',
      update_payment_method_button: 'Updated Payment Method',
      billing_history_title: 'Billing History',
      download_all_invoices_button: 'Download All Invoices',
      invoice_number_column: 'Invoice #',
      date_column: 'Date',
      description_column: 'Description',
      amount_column: 'Amount',
      status_column: 'Status',
      actions_column: 'Actions',
      view_action_button: 'View',
    };
    return translations[key] || key;
  },
}));

describe('AccountSettingsPage', () => {
  it('should render the page title', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('Account Settings')).toBeDefined();
  });

  it('should render location selector', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('Location')).toBeDefined();
  });

  it('should render location and billing heading', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText(/Downtown HQ - Billing/i)).toBeDefined();
  });

  it('should render location information section', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('Location Information')).toBeDefined();
    expect(page.getByText('123 Main St. San Francisco. CA')).toBeDefined();
    expect(page.getByText('(415) 555-0123')).toBeDefined();
    expect(page.getByText('downtown@example.com')).toBeDefined();
  });

  it('should render subscription details section', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('Subscription Details')).toBeDefined();
    expect(page.getByText('Dojo Planner Pro - Annual')).toBeDefined();
  });

  it('should render change plan and cancel subscription buttons', () => {
    render(<AccountSettingsPage />);

    expect(page.getByRole('button', { name: /change plan/i })).toBeDefined();
    expect(page.getByRole('button', { name: /cancel subscription/i })).toBeDefined();
  });

  it('should render payment method section', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('Payment Method')).toBeDefined();
    expect(page.getByText(/1234/)).toBeDefined();
  });

  it('should render update payment method button', () => {
    render(<AccountSettingsPage />);

    expect(page.getByRole('button', { name: /updated payment method/i })).toBeDefined();
  });

  it('should render billing history section', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('Billing History')).toBeDefined();
  });

  it('should render download all invoices button', () => {
    render(<AccountSettingsPage />);

    expect(page.getByRole('button', { name: /download all invoices/i })).toBeDefined();
  });

  it('should render billing history table headers', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('Invoice #')).toBeDefined();
    expect(page.getByText('Date')).toBeDefined();
    expect(page.getByText('Description')).toBeDefined();
    expect(page.getByText('Amount')).toBeDefined();
  });

  it('should render invoices in the table', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('INV-2024-012')).toBeDefined();
    expect(page.getByText('INV-2023-011')).toBeDefined();
    expect(page.getByText('Dec 15, 2024')).toBeDefined();
  });

  it('should render view button for invoices', () => {
    render(<AccountSettingsPage />);
    const viewButton = page.getByRole('button', { name: /view/i });

    expect(viewButton).toBeDefined();
  });

  it('should display active members count', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('247')).toBeDefined();
  });

  it('should display billing address', () => {
    render(<AccountSettingsPage />);

    expect(page.getByText('123 Main St. San Francisco. CA 94102')).toBeDefined();
  });
});
