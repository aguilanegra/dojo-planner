import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { ManageProfileDialog } from './ManageProfileDialog';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ManageProfileDialog: {
        title: 'Manage Profile',
      },
      MyProfile: {
        title: 'My Profile',
        edit_button: 'Edit My Information',
        first_name_label: 'First Name',
        last_name_label: 'Last Name',
        phone_label: 'Phone',
        email_label: 'Email',
      },
      Security: {
        change_password_title: 'Change Password',
        change_password_button: 'Change Password',
        current_password_label: 'Enter Current Password',
        current_password_placeholder: 'Enter current password',
        new_password_label: 'Enter New Password',
        new_password_placeholder: 'Enter new password',
        confirm_password_label: 'Confirm New Password',
        confirm_password_placeholder: 'Confirm new password',
        save_button: 'Save',
        cancel_button: 'Cancel',
        two_factor_title: '2-Factor Authentication (2FA)',
        two_factor_description: 'Make your account more secure by adding a second form of authentication',
        add_2fa_button: 'Add 2FA',
      },
    };
    return translations[namespace]?.[key] || key;
  },
}));

describe('ManageProfileDialog', () => {
  it('should render the dialog when open', () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);

    expect(page.getByText('Manage Profile')).toBeDefined();
  });

  it('should not render when closed', () => {
    render(<ManageProfileDialog open={false} onOpenChange={() => {}} />);

    expect(page.getByText('Manage Profile').elements().length).toBe(0);
  });

  it('should display user information', () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);

    expect(page.getByText('Anika Green')).toBeDefined();
    expect(page.getByText('Account Owner')).toBeDefined();
  });

  it('should display user details in the profile section', () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);

    expect(page.getByText('Anika')).toBeDefined();
    expect(page.getByText('Green')).toBeDefined();
    expect(page.getByText('(415) 223-4123')).toBeDefined();
    expect(page.getByText('agreen@gmail.com')).toBeDefined();
  });

  it('should render all profile label fields', () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);

    expect(page.getByText('First Name')).toBeDefined();
    expect(page.getByText('Last Name')).toBeDefined();
    expect(page.getByText('Phone')).toBeDefined();
    expect(page.getByText('Email')).toBeDefined();
  });

  it('should render the edit button', () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);
    const editButton = page.getByRole('button', { name: /edit my information/i });

    expect(editButton).toBeDefined();
  });

  it('should render change password section', () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);

    expect(page.getByText('Change Password')).toBeDefined();
  });

  it('should render 2FA section', () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);

    expect(page.getByText('2-Factor Authentication (2FA)')).toBeDefined();
    expect(
      page.getByText('Make your account more secure by adding a second form of authentication'),
    ).toBeDefined();
  });

  it('should render add 2FA button', () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);
    const add2faButton = page.getByRole('button', { name: /add 2fa/i });

    expect(add2faButton).toBeDefined();
  });

  it('should show password form when change password button is clicked', async () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);
    const changePasswordButton = page.getByRole('button', { name: /change password/i });

    await userEvent.click(changePasswordButton.element());

    expect(page.getByText('Enter Current Password')).toBeDefined();
    expect(page.getByText('Enter New Password')).toBeDefined();
    expect(page.getByText('Confirm New Password')).toBeDefined();
  });

  it('should hide password form when cancel button is clicked', async () => {
    render(<ManageProfileDialog open onOpenChange={() => {}} />);
    const changePasswordButton = page.getByRole('button', { name: /change password/i });

    await userEvent.click(changePasswordButton.element());

    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton.element());

    expect(page.getByText('Enter Current Password').elements().length).toBe(0);
  });
});
