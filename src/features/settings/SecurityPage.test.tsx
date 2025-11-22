import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { SecurityPage } from './SecurityPage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Security',
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
    };
    return translations[key] || key;
  },
}));

describe('SecurityPage', () => {
  it('should render the page title', () => {
    render(<SecurityPage />);

    expect(page.getByText('Security')).toBeDefined();
  });

  it('should render change password section title', () => {
    render(<SecurityPage />);

    expect(page.getByText('Change Password')).toBeDefined();
  });

  it('should render change password button', () => {
    render(<SecurityPage />);
    const changePasswordButton = page.getByRole('button', { name: /change password/i });

    expect(changePasswordButton).toBeDefined();
  });

  it('should render 2FA section title', () => {
    render(<SecurityPage />);

    expect(page.getByText('2-Factor Authentication (2FA)')).toBeDefined();
  });

  it('should render 2FA description', () => {
    render(<SecurityPage />);

    expect(
      page.getByText('Make your account more secure by adding a second form of authentication'),
    ).toBeDefined();
  });

  it('should render add 2FA button', () => {
    render(<SecurityPage />);
    const add2faButton = page.getByRole('button', { name: /add 2fa/i });

    expect(add2faButton).toBeDefined();
  });
});
