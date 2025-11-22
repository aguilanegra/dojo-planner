import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { MyProfilePage } from './MyProfilePage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'My Profile',
      edit_button: 'Edit My Information',
      first_name_label: 'First Name',
      last_name_label: 'Last Name',
      phone_label: 'Phone',
      email_label: 'Email',
    };
    return translations[key] || key;
  },
}));

describe('MyProfilePage', () => {
  it('should render the page title', () => {
    render(<MyProfilePage />);

    expect(page.getByText('My Profile')).toBeDefined();
  });

  it('should display the user information', () => {
    render(<MyProfilePage />);

    expect(page.getByText('Anika Green')).toBeDefined();
    expect(page.getByText('Account Owner')).toBeDefined();
  });

  it('should display user details in the grid', () => {
    render(<MyProfilePage />);

    expect(page.getByText('Anika')).toBeDefined();
    expect(page.getByText('Green')).toBeDefined();
    expect(page.getByText('(415) 223-4123')).toBeDefined();
    expect(page.getByText('agreen@gmail.com')).toBeDefined();
  });

  it('should render the edit button', () => {
    render(<MyProfilePage />);
    const editButton = page.getByRole('button', { name: /edit my information/i });

    expect(editButton).toBeDefined();
  });

  it('should render all label fields', () => {
    render(<MyProfilePage />);

    expect(page.getByText('First Name')).toBeDefined();
    expect(page.getByText('Last Name')).toBeDefined();
    expect(page.getByText('Phone')).toBeDefined();
    expect(page.getByText('Email')).toBeDefined();
  });
});
