import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { EditProfileForm } from './EditProfileForm';

// Mock user with update function
const mockUpdate = vi.fn();
const mockCreateEmailAddress = vi.fn();

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  primaryEmailAddress: { emailAddress: 'john.doe@example.com' },
  emailAddresses: [{ emailAddress: 'john.doe@example.com' }],
  update: mockUpdate,
  createEmailAddress: mockCreateEmailAddress,
};

// Mock logger to prevent process.env issues
vi.mock('@/libs/Logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

// Mock Clerk useUser hook
vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({
    user: mockUser,
    isLoaded: true,
    isSignedIn: true,
  })),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      first_name_label: 'First Name',
      last_name_label: 'Last Name',
      email_label: 'Email',
      first_name_placeholder: 'Enter first name',
      last_name_placeholder: 'Enter last name',
      email_placeholder: 'Enter email address',
      save_button: 'Save',
      cancel_button: 'Cancel',
      saving_button: 'Saving...',
      profile_updated_success: 'Profile updated successfully',
      profile_update_error: 'Failed to update profile. Please try again.',
      first_name_required: 'First name is required',
      last_name_required: 'Last name is required',
      email_required: 'Email is required',
    };
    return translations[key] || key;
  },
}));

describe('EditProfileForm', () => {
  const mockOnCancel = vi.fn();
  const mockOnSuccess = vi.fn();
  const initialData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockReset();
    mockCreateEmailAddress.mockReset();
  });

  it('should render all form fields', () => {
    render(<EditProfileForm onCancel={mockOnCancel} initialData={initialData} />);

    expect(page.getByText('First Name')).toBeDefined();
    expect(page.getByText('Last Name')).toBeDefined();
    expect(page.getByText('Email')).toBeDefined();
  });

  it('should render save and cancel buttons', () => {
    render(<EditProfileForm onCancel={mockOnCancel} initialData={initialData} />);

    expect(page.getByRole('button', { name: /save/i })).toBeDefined();
    expect(page.getByRole('button', { name: /cancel/i })).toBeDefined();
  });

  it('should populate fields with initial data', () => {
    render(<EditProfileForm onCancel={mockOnCancel} initialData={initialData} />);

    const firstNameInput = page.getByPlaceholder('Enter first name');
    const lastNameInput = page.getByPlaceholder('Enter last name');
    const emailInput = page.getByPlaceholder('Enter email address');

    expect(firstNameInput.element()).toHaveProperty('value', 'John');
    expect(lastNameInput.element()).toHaveProperty('value', 'Doe');
    expect(emailInput.element()).toHaveProperty('value', 'john.doe@example.com');
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(<EditProfileForm onCancel={mockOnCancel} initialData={initialData} />);

    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton.element());

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should validate required first name', async () => {
    render(<EditProfileForm onCancel={mockOnCancel} initialData={initialData} />);

    const firstNameInput = page.getByPlaceholder('Enter first name');
    await userEvent.clear(firstNameInput.element());

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton.element());

    expect(page.getByText('First name is required')).toBeDefined();
  });

  it('should validate required last name', async () => {
    render(<EditProfileForm onCancel={mockOnCancel} initialData={initialData} />);

    const lastNameInput = page.getByPlaceholder('Enter last name');
    await userEvent.clear(lastNameInput.element());

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton.element());

    expect(page.getByText('Last name is required')).toBeDefined();
  });

  it('should validate required email', async () => {
    render(<EditProfileForm onCancel={mockOnCancel} initialData={initialData} />);

    const emailInput = page.getByPlaceholder('Enter email address');
    await userEvent.clear(emailInput.element());

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton.element());

    expect(page.getByText('Email is required')).toBeDefined();
  });

  it('should call user.update on valid submission', async () => {
    mockUpdate.mockResolvedValue({});

    render(<EditProfileForm onCancel={mockOnCancel} onSuccess={mockOnSuccess} initialData={initialData} />);

    const firstNameInput = page.getByPlaceholder('Enter first name');
    const lastNameInput = page.getByPlaceholder('Enter last name');

    await userEvent.clear(firstNameInput.element());
    await userEvent.fill(firstNameInput.element(), 'Jane');
    await userEvent.clear(lastNameInput.element());
    await userEvent.fill(lastNameInput.element(), 'Smith');

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton.element());

    expect(mockUpdate).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Smith',
    });
  });

  it('should show success message on successful update', async () => {
    mockUpdate.mockResolvedValue({});

    render(<EditProfileForm onCancel={mockOnCancel} onSuccess={mockOnSuccess} initialData={initialData} />);

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton.element());

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(page.getByText('Profile updated successfully')).toBeDefined();
  });

  it('should show alert banner on API error', async () => {
    mockUpdate.mockRejectedValue(new Error('API Error'));

    render(<EditProfileForm onCancel={mockOnCancel} initialData={initialData} />);

    const saveButton = page.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton.element());

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const alert = page.getByRole('alert');

    expect(alert).toBeDefined();
    expect(page.getByText('Failed to update profile. Please try again.')).toBeDefined();
  });
});
