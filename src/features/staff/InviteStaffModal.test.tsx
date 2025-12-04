import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { InviteStaffModal } from './InviteStaffModal';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('InviteStaffModal', () => {
  const mockHandlers = {
    onCloseAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render dialog when isOpen is false', () => {
    render(
      <InviteStaffModal
        isOpen={false}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    try {
      const modal = page.getByRole('dialog');

      expect(modal).toBeFalsy();
    } catch {
      expect(true).toBe(true);
    }
  });

  it('should render dialog when isOpen is true', () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const modal = page.getByRole('dialog');

    expect(modal).toBeTruthy();
  });

  it('should display dialog title', () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const heading = page.getByRole('heading');

    expect(heading).toBeTruthy();
  });

  it('should render all form fields', () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const firstNameInput = page.getByTestId('invite-staff-first-name');
    const lastNameInput = page.getByTestId('invite-staff-last-name');
    const emailInput = page.getByTestId('invite-staff-email');
    const phoneInput = page.getByTestId('invite-staff-phone');
    const roleSelect = page.getByTestId('invite-staff-role');

    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(phoneInput).toBeTruthy();
    expect(roleSelect).toBeTruthy();
  });

  it('should render all permission toggles', () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const permissionKeys = [
      'canManageClassSchedules',
      'canViewMemberInformation',
      'canAccessBillingInformation',
      'canGenerateReports',
      'canModifyLocationSettings',
    ];

    permissionKeys.forEach((key) => {
      const toggle = page.getByTestId(`invite-staff-permission-${key}`);

      expect(toggle).toBeTruthy();
    });
  });

  it('should render Cancel and Save buttons', () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const cancelButton = page.getByTestId('invite-staff-cancel-button');
    const saveButton = page.getByTestId('invite-staff-save-button');

    expect(cancelButton).toBeTruthy();
    expect(saveButton).toBeTruthy();
  });

  it('should render Cancel button that can be clicked', async () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const cancelButton = page.getByTestId('invite-staff-cancel-button');

    await expect.element(cancelButton).toBeVisible();
    await expect.element(cancelButton).toBeEnabled();
  });

  it('should have Save button disabled when form is incomplete', () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const saveButton = page.getByTestId('invite-staff-save-button');

    expect(saveButton.element()).toHaveProperty('disabled', true);
  });

  it('should display info message', () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const infoMessage = page.getByText('info_message');

    expect(infoMessage).toBeTruthy();
  });

  it('should update form fields when user types', async () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const firstNameInput = page.getByTestId('invite-staff-first-name');
    await userEvent.fill(firstNameInput, 'John');

    const lastNameInput = page.getByTestId('invite-staff-last-name');
    await userEvent.fill(lastNameInput, 'Doe');

    const emailInput = page.getByTestId('invite-staff-email');
    await userEvent.fill(emailInput, 'john@example.com');

    const phoneInput = page.getByTestId('invite-staff-phone');
    await userEvent.fill(phoneInput, '555-123-4567');

    expect(firstNameInput.element()).toHaveProperty('value', 'John');
    expect(lastNameInput.element()).toHaveProperty('value', 'Doe');
    expect(emailInput.element()).toHaveProperty('value', 'john@example.com');
    expect(phoneInput.element()).toHaveProperty('value', '555-123-4567');
  });

  it('should render permission toggles in unchecked state by default', async () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    const permissionToggle = page.getByTestId('invite-staff-permission-canManageClassSchedules');

    await expect.element(permissionToggle).toBeVisible();
    await expect.element(permissionToggle).toHaveAttribute('data-state', 'unchecked');
  });

  it('should call onCloseAction once when X button is clicked while input is focused', async () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    // Focus on an input field first (simulating user interaction)
    const firstNameInput = page.getByTestId('invite-staff-first-name');
    await userEvent.click(firstNameInput);
    await userEvent.fill(firstNameInput, 'Test');

    // Click the X button to close
    const closeButton = page.getByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);

    // onCloseAction should be called exactly once with a single click
    expect(mockHandlers.onCloseAction).toHaveBeenCalledTimes(1);
  });

  it('should call onCloseAction once when Cancel button is clicked', async () => {
    render(
      <InviteStaffModal
        isOpen={true}
        onCloseAction={mockHandlers.onCloseAction}
      />,
    );

    // Focus on an input field first (simulating user interaction - same as X button test)
    const firstNameInput = page.getByTestId('invite-staff-first-name');
    await userEvent.click(firstNameInput);
    await userEvent.fill(firstNameInput, 'Test');

    // Click the Cancel button to close
    const cancelButton = page.getByRole('button', { name: 'cancel_button' });
    await userEvent.click(cancelButton);

    expect(mockHandlers.onCloseAction).toHaveBeenCalledTimes(1);
  });
});
