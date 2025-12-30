import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { EditLocationForm } from './EditLocationForm';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
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
        cancel_button: 'Cancel',
        save_button: 'Save',
        saving_button: 'Saving...',
      },
    };
    return translations[namespace]?.[key] || key;
  },
}));

describe('EditLocationForm', () => {
  const mockOnCancel = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnSave = vi.fn();

  // Test fixtures - not real credentials
  const initialData = {
    name: 'Downtown HQ',
    address: '123 Main St',
    phone: '(415) 555-0123', // pragma: allowlist secret
    email: 'test@example.com', // pragma: allowlist secret
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields with labels', () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    expect(page.getByText('Location Name')).toBeDefined();
    expect(page.getByText('Address')).toBeDefined();
    expect(page.getByText('Phone')).toBeDefined();
    expect(page.getByText('Email')).toBeDefined();
  });

  it('should populate fields with initial data', () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    expect(page.getByLabelText('Location Name').element()).toHaveProperty('value', 'Downtown HQ');
    expect(page.getByLabelText('Address').element()).toHaveProperty('value', '123 Main St');
    expect(page.getByLabelText('Phone').element()).toHaveProperty('value', '(415) 555-0123');
    expect(page.getByLabelText('Email').element()).toHaveProperty('value', 'test@example.com');
  });

  it('should render save and cancel buttons', () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    expect(page.getByRole('button', { name: /save/i })).toBeDefined();
    expect(page.getByRole('button', { name: /cancel/i })).toBeDefined();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should validate required name field', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const nameInput = page.getByLabelText('Location Name');
    await userEvent.clear(nameInput);

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(page.getByText('Please enter a location name.')).toBeDefined();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should validate required address field', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const addressInput = page.getByLabelText('Address');
    await userEvent.clear(addressInput);

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(page.getByText('Please enter an address.')).toBeDefined();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should validate required phone field', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const phoneInput = page.getByLabelText('Phone');
    await userEvent.clear(phoneInput);

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(page.getByText('Please enter a phone number.')).toBeDefined();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should validate required email field', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const emailInput = page.getByLabelText('Email');
    await userEvent.clear(emailInput);

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(page.getByText('Please enter a valid email.')).toBeDefined();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const emailInput = page.getByLabelText('Email');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'invalid-email');

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(page.getByText('Please enter a valid email.')).toBeDefined();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onSave with sanitized data on valid submission', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Downtown HQ',
      address: '123 Main St',
      phone: '(415) 555-0123',
      email: 'test@example.com',
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should sanitize inputs with dangerous characters', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={{
          name: 'Test <script>',
          address: '123 Main <div>',
          phone: '(415) 555-0123abc',
          email: 'TEST@EXAMPLE.COM',
        }}
      />,
    );

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Test script',
      address: '123 Main div',
      phone: '(415) 555-0123',
      email: 'test@example.com',
    });
  });

  it('should update name field when user types', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const nameInput = page.getByLabelText('Location Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Location');

    expect(nameInput.element()).toHaveProperty('value', 'New Location');
  });

  it('should update address field when user types', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const addressInput = page.getByLabelText('Address');
    await userEvent.clear(addressInput);
    await userEvent.type(addressInput, '456 New St');

    expect(addressInput.element()).toHaveProperty('value', '456 New St');
  });

  it('should update phone field when user types', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const phoneInput = page.getByLabelText('Phone');
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '(310) 555-9999');

    expect(phoneInput.element()).toHaveProperty('value', '(310) 555-9999');
  });

  it('should update email field when user types', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={initialData}
      />,
    );

    const emailInput = page.getByLabelText('Email');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'new@example.com');

    expect(emailInput.element()).toHaveProperty('value', 'new@example.com');
  });

  it('should show all validation errors at once', async () => {
    render(
      <EditLocationForm
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
        onSave={mockOnSave}
        initialData={{
          name: '',
          address: '',
          phone: '',
          email: '',
        }}
      />,
    );

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(page.getByText('Please enter a location name.')).toBeDefined();
    expect(page.getByText('Please enter an address.')).toBeDefined();
    expect(page.getByText('Please enter a phone number.')).toBeDefined();
    expect(page.getByText('Please enter a valid email.')).toBeDefined();
  });
});
