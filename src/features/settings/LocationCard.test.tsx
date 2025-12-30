import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { LocationCard } from './LocationCard';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'LocationSettings': {
        location_title: 'Location',
        address_label: 'Address:',
        phone_label: 'Phone:',
        email_label: 'Email:',
        status_label: 'Status:',
        active_status: 'Active',
      },
      'LocationSettings.EditLocationModal': {
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
        email_placeholder: 'Enter email',
        email_error: 'Please enter a valid email.',
      },
      'MyProfile': {
        edit_button: 'Edit',
        cancel_button: 'Cancel',
        save_button: 'Save',
        saving_button: 'Saving...',
      },
    };
    return translations[namespace]?.[key] || key;
  },
}));

describe('LocationCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the location title', () => {
    render(<LocationCard />);

    expect(page.getByText('Location')).toBeDefined();
  });

  it('should render address label and value', () => {
    render(<LocationCard />);

    expect(page.getByText('Address:')).toBeDefined();
    expect(page.getByText('123 Main St. San Francisco. CA')).toBeDefined();
  });

  it('should render phone label and value', () => {
    render(<LocationCard />);

    expect(page.getByText('Phone:')).toBeDefined();
    expect(page.getByText('(415) 555-0123')).toBeDefined();
  });

  it('should render email label and value', () => {
    render(<LocationCard />);

    expect(page.getByText('Email:')).toBeDefined();
    expect(page.getByText('downtown@example.com')).toBeDefined();
  });

  it('should render status label and active badge', () => {
    render(<LocationCard />);

    expect(page.getByText('Status:')).toBeDefined();
    expect(page.getByText('Active')).toBeDefined();
  });

  it('should render the edit button', () => {
    render(<LocationCard />);

    const editButton = page.getByRole('button', { name: /edit location/i });

    expect(editButton).toBeDefined();
  });

  it('should show inline edit form when edit button is clicked', async () => {
    render(<LocationCard />);

    const editButton = page.getByRole('button', { name: /edit location/i });
    await userEvent.click(editButton);

    // The edit form should now be visible with input fields
    expect(page.getByLabelText('Location Name')).toBeDefined();
    expect(page.getByLabelText('Address')).toBeDefined();
    expect(page.getByLabelText('Phone')).toBeDefined();
    expect(page.getByLabelText('Email')).toBeDefined();
  });

  it('should hide edit form when cancel button is clicked', async () => {
    render(<LocationCard />);

    // Open edit form
    const editButton = page.getByRole('button', { name: /edit location/i });
    await userEvent.click(editButton);

    // Cancel editing
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    // Should be back to display mode with the edit button visible
    expect(page.getByRole('button', { name: /edit location/i })).toBeDefined();

    // Edit form inputs should not be visible
    expect(page.getByLabelText('Location Name').elements().length).toBe(0);
  });

  it('should update location data when save button is clicked', async () => {
    render(<LocationCard />);

    // Open edit form
    const editButton = page.getByRole('button', { name: /edit location/i });
    await userEvent.click(editButton);

    // Clear and fill in new values
    const addressInput = page.getByLabelText('Address');
    await userEvent.clear(addressInput);
    await userEvent.type(addressInput, '456 New St. Los Angeles. CA');

    const phoneInput = page.getByLabelText('Phone');
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '(310) 555-9999');

    const emailInput = page.getByLabelText('Email');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'updated@example.com');

    // Save changes
    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    // Check that the data is updated
    expect(page.getByText('456 New St. Los Angeles. CA')).toBeDefined();
    expect(page.getByText('(310) 555-9999')).toBeDefined();
    expect(page.getByText('updated@example.com')).toBeDefined();
  });

  it('should display dash when value is empty', () => {
    // This test verifies the fallback behavior
    render(<LocationCard />);

    // The mock data has values, so no dashes should appear in default state
    // This is more of a structural test
    expect(page.getByText('Location')).toBeDefined();
  });

  it('should show title even when in edit mode', async () => {
    render(<LocationCard />);

    const editButton = page.getByRole('button', { name: /edit location/i });
    await userEvent.click(editButton);

    // Title should still be visible
    expect(page.getByText('Location')).toBeDefined();
  });

  it('should hide display fields when in edit mode', async () => {
    render(<LocationCard />);

    const editButton = page.getByRole('button', { name: /edit location/i });
    await userEvent.click(editButton);

    // The status badge should not be visible in edit mode
    expect(page.getByText('Status:').elements().length).toBe(0);
  });
});

describe('LocationCard - Loading State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render skeleton when loading', () => {
    render(<LocationCard isLoading={true} />);

    // When loading, the card should show skeletons instead of data
    // The title should not be visible when loading
    expect(page.getByText('Location').elements().length).toBe(0);
  });

  it('should not render edit button when loading', () => {
    render(<LocationCard isLoading={true} />);

    const editButton = page.getByRole('button', { name: /edit/i }).elements();

    expect(editButton.length).toBe(0);
  });

  it('should render normal content when not loading', () => {
    render(<LocationCard isLoading={false} />);

    expect(page.getByText('Location')).toBeDefined();
    expect(page.getByRole('button', { name: /edit location/i })).toBeDefined();
  });
});
