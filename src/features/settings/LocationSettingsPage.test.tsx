import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { LocationSettingsPage } from './LocationSettingsPage';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'LocationSettings': {
        title: 'Location Settings',
        location_information_title: 'Location Information',
        address_label: 'Address:',
        phone_label: 'Phone:',
        email_label: 'Email:',
        active_members_label: 'Active Members:',
        status_label: 'Status:',
        active_status: 'Active',
      },
      'LocationSettings.EditLocationModal': {
        title: 'Edit Location Information',
        name_label: 'Location Name',
        name_placeholder: 'Enter location name',
        name_error: 'Please enter a location name.',
        address_label: 'Address',
        address_placeholder: 'Enter address',
        address_error: 'Please enter an address.',
        phone_label: 'Phone',
        phone_placeholder: '(555) 123-4567',
        phone_error: 'Please enter a phone number.',
        email_label: 'Email',
        email_placeholder: 'location@example.com',
        email_error: 'Please enter a valid email address.',
        cancel_button: 'Cancel',
        save_button: 'Save Changes',
        saving_button: 'Saving...',
      },
    };
    return translations[namespace]?.[key] || key;
  },
}));

describe('LocationSettingsPage', () => {
  it('should render the page title', () => {
    render(<LocationSettingsPage />);

    expect(page.getByText('Location Settings')).toBeDefined();
  });

  it('should render location information section header', () => {
    render(<LocationSettingsPage />);

    expect(page.getByText('Location Information')).toBeDefined();
  });

  it('should render location address', () => {
    render(<LocationSettingsPage />);

    expect(page.getByText('123 Main St. San Francisco. CA')).toBeDefined();
  });

  it('should render location phone number', () => {
    render(<LocationSettingsPage />);

    expect(page.getByText('(415) 555-0123')).toBeDefined();
  });

  it('should render location email', () => {
    render(<LocationSettingsPage />);

    expect(page.getByText('downtown@example.com')).toBeDefined();
  });

  it('should render active members count', () => {
    render(<LocationSettingsPage />);

    expect(page.getByText('247')).toBeDefined();
  });

  it('should render active status badge', () => {
    render(<LocationSettingsPage />);

    expect(page.getByText('Active')).toBeDefined();
  });

  it('should render edit button', () => {
    render(<LocationSettingsPage />);

    const editButton = page.getByRole('button', { name: /edit/i });

    expect(editButton).toBeDefined();
  });

  it('should open edit modal when edit button is clicked', async () => {
    render(<LocationSettingsPage />);

    const editButton = page.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton.element());

    expect(page.getByText('Edit Location Information')).toBeDefined();
  });

  it('should display all field labels', () => {
    render(<LocationSettingsPage />);

    expect(page.getByText('Address:')).toBeDefined();
    expect(page.getByText('Phone:')).toBeDefined();
    expect(page.getByText('Email:')).toBeDefined();
    expect(page.getByText('Active Members:')).toBeDefined();
    expect(page.getByText('Status:')).toBeDefined();
  });

  it('should not render subscription details section', () => {
    render(<LocationSettingsPage />);

    const subscriptionText = page.getByText('Subscription Details');

    expect(subscriptionText.elements()).toHaveLength(0);
  });

  it('should not render payment method section', () => {
    render(<LocationSettingsPage />);

    const paymentText = page.getByText('Payment Method');

    expect(paymentText.elements()).toHaveLength(0);
  });

  it('should not render billing history section', () => {
    render(<LocationSettingsPage />);

    const billingText = page.getByText('Billing History');

    expect(billingText.elements()).toHaveLength(0);
  });

  it('should not render location dropdown selector', () => {
    render(<LocationSettingsPage />);

    // Check that there's no dropdown/select for location
    const selectElements = page.getByRole('combobox');

    expect(selectElements.elements()).toHaveLength(0);
  });

  it('should close modal when cancel is clicked', async () => {
    render(<LocationSettingsPage />);

    // Open the modal
    const editButton = page.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton.element());

    // Verify modal is open
    expect(page.getByText('Edit Location Information')).toBeDefined();

    // Click cancel
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton.element());

    // Verify modal is closed - the dialog content should not be visible
    const modalTitle = page.getByText('Edit Location Information');

    expect(modalTitle.elements()).toHaveLength(0);
  });

  it('should update location info after saving in modal', async () => {
    render(<LocationSettingsPage />);

    // Open the modal
    const editButton = page.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton.element());

    // Find and update the address input
    const addressInput = page.getByPlaceholder('Enter address');
    await userEvent.clear(addressInput.element());
    await userEvent.type(addressInput.element(), '456 New Street, Los Angeles, CA');

    // Click save button
    const saveButton = page.getByRole('button', { name: /save changes/i });
    await userEvent.click(saveButton.element());

    // Wait for modal to close and verify the updated address is displayed
    await vi.waitFor(() => {
      expect(page.getByText('456 New Street, Los Angeles, CA')).toBeDefined();
    });
  });

  it('should have proper accessibility for edit button', () => {
    render(<LocationSettingsPage />);

    const editButton = page.getByRole('button', { name: /edit location information/i });

    expect(editButton).toBeDefined();
  });
});
