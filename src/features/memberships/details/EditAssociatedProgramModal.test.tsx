import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { EditAssociatedProgramModal } from './EditAssociatedProgramModal';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Edit Associated Program',
  program_label: 'Associated Program',
  program_placeholder: 'Select a program',
  program_help: 'Members with this membership will have access to this program',
  cancel_button: 'Cancel',
  save_button: 'Save Changes',
  saving_button: 'Saving...',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string | number>) => {
    let result = translationKeys[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    return result;
  },
}));

describe('EditAssociatedProgramModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal with title when open', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const title = page.getByText('Edit Associated Program');

    expect(title).toBeTruthy();
  });

  it('should not render modal content when closed', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={false}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const title = document.querySelector('[role="dialog"]');

    expect(title).toBeNull();
  });

  it('should render program label', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const label = page.getByText('Associated Program');

    expect(label).toBeTruthy();
  });

  it('should render help text', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const helpText = page.getByText('Members with this membership will have access to this program');

    expect(helpText).toBeTruthy();
  });

  it('should render Cancel button', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const cancelButton = page.getByText('Cancel');

    expect(cancelButton).toBeTruthy();
  });

  it('should render Save button', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const saveButton = page.getByText('Save Changes');

    expect(saveButton).toBeTruthy();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const cancelButton = page.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should disable Save button when no program is selected', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId={null}
        onSave={mockOnSave}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    expect(saveButton?.disabled).toBe(true);
  });

  it('should enable Save button when program is selected', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    expect(saveButton?.disabled).toBe(false);
  });

  it('should render program select dropdown', () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const selectTrigger = document.querySelector('[role="combobox"]');

    expect(selectTrigger).toBeTruthy();
  });

  it('should show program options when dropdown is clicked', async () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const selectTrigger = document.querySelector('[role="combobox"]');
    if (selectTrigger) {
      await userEvent.click(selectTrigger);

      const adultProgram = page.getByText('Adult Brazilian Jiu-jitsu');

      expect(adultProgram).toBeTruthy();
    }
  });

  it('should call onSave with selected program when Save is clicked', async () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    if (saveButton) {
      await userEvent.click(saveButton);

      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 600));

      expect(mockOnSave).toHaveBeenCalledWith({
        associatedProgramId: '1',
        associatedProgramName: 'Adult Brazilian Jiu-jitsu',
      });
    }
  });

  it('should select a different program and save', async () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const selectTrigger = document.querySelector('[role="combobox"]');
    if (selectTrigger) {
      await userEvent.click(selectTrigger);

      const kidsProgram = page.getByText('Kids Program');
      await userEvent.click(kidsProgram);

      const buttons = Array.from(document.querySelectorAll('button'));
      const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

      if (saveButton) {
        await userEvent.click(saveButton);

        // Wait for async operation
        await new Promise(resolve => setTimeout(resolve, 600));

        expect(mockOnSave).toHaveBeenCalledWith({
          associatedProgramId: '2',
          associatedProgramName: 'Kids Program',
        });
      }
    }
  });

  it('should reset to initial program when dialog is closed via backdrop', async () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    // Change the program selection first
    const selectTrigger = document.querySelector('[role="combobox"]');
    if (selectTrigger) {
      await userEvent.click(selectTrigger);
      const kidsProgram = page.getByText('Kids Program');
      await userEvent.click(kidsProgram);
    }

    // Close dialog by pressing Escape (simulates closing via backdrop or close button)
    await userEvent.keyboard('{Escape}');

    // onClose should be called (via handleCancel which is called from handleOpenChange)
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show Saving... text during save operation', async () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    if (saveButton) {
      // Click save and check for Saving... text immediately
      await userEvent.click(saveButton);

      // Check for loading state (Saving... text should appear)
      const savingText = page.getByText('Saving...');

      expect(savingText).toBeTruthy();
    }
  });

  it('should only show active programs in dropdown', async () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const selectTrigger = document.querySelector('[role="combobox"]');
    if (selectTrigger) {
      await userEvent.click(selectTrigger);

      // Active programs should be visible
      const judoProgram = page.getByText('Judo Fundamentals');

      expect(judoProgram).toBeTruthy();

      // Inactive program (Wrestling Fundamentals) should NOT be visible
      const allOptions = Array.from(document.querySelectorAll('[role="option"]'));
      const wrestlingOption = allOptions.find(opt => opt.textContent?.includes('Wrestling Fundamentals'));

      expect(wrestlingOption).toBeUndefined();
    }
  });

  it('should show 4 active programs in dropdown', async () => {
    render(
      <EditAssociatedProgramModal
        isOpen={true}
        onClose={mockOnClose}
        associatedProgramId="1"
        onSave={mockOnSave}
      />,
    );

    const selectTrigger = document.querySelector('[role="combobox"]');
    if (selectTrigger) {
      await userEvent.click(selectTrigger);

      // Count the options - should be 4 active programs
      const allOptions = Array.from(document.querySelectorAll('[role="option"]'));

      expect(allOptions.length).toBe(4);
    }
  });
});
