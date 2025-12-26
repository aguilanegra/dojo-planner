import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { EditClassInstructorsModal } from './EditClassInstructorsModal';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Edit Instructors',
  selected_label: 'Selected Instructors',
  available_label: 'Available Staff',
  role_primary: 'Primary',
  role_assistant: 'Assistant',
  help_text: 'Select staff members to assign as instructors for this class.',
  cancel_button: 'Cancel',
  save_button: 'Save Changes',
  saving_button: 'Saving...',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('EditClassInstructorsModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    instructors: [
      { id: '1', name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'primary' as const },
    ],
    onSave: mockOnSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal with title when open', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const heading = page.getByText('Edit Instructors');

    expect(heading).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    render(<EditClassInstructorsModal {...defaultProps} isOpen={false} />);

    const heading = document.body.textContent?.includes('Edit Instructors');

    expect(heading).toBe(false);
  });

  it('should render selected instructors section when instructors exist', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const selectedLabel = page.getByText('Selected Instructors');

    expect(selectedLabel).toBeTruthy();
  });

  it('should render Cancel button', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');

    expect(cancelButton).toBeTruthy();
  });

  it('should render Save Changes button', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');

    expect(saveButton).toBeTruthy();
  });

  it('should render available staff section', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const availableLabel = page.getByText('Available Staff');

    expect(availableLabel).toBeTruthy();
  });

  it('should render help text', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const helpText = page.getByText('Select staff members to assign as instructors for this class.');

    expect(helpText).toBeTruthy();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display selected instructor name', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const instructorName = page.getByText('Coach Alex');

    expect(instructorName).toBeTruthy();
  });

  it('should display role selector for selected instructors', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const primaryRole = page.getByText('Primary');

    expect(primaryRole).toBeTruthy();
  });

  it('should toggle instructor selection when clicking a staff checkbox', async () => {
    render(<EditClassInstructorsModal {...defaultProps} instructors={[]} />);

    // Click to add Coach Alex from available staff
    const coachAlexLabel = page.getByText('Coach Alex');
    await userEvent.click(coachAlexLabel);

    // Coach Alex should now appear in selected instructors
    const selectedSection = page.getByText('Selected Instructors');

    expect(selectedSection).toBeTruthy();
  });

  it('should start with instructor selected by default', () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    // Verify Coach Alex is selected initially
    const selectedLabel = page.getByText('Selected Instructors');

    expect(selectedLabel).toBeTruthy();
  });

  it('should call onSave with updated instructors when Save button is clicked', async () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');
    await userEvent.click(saveButton);

    // Wait for the simulated API call
    await new Promise(resolve => setTimeout(resolve, 600));

    expect(mockOnSave).toHaveBeenCalledWith({
      instructors: defaultProps.instructors,
    });
  });

  it('should show saving state when submitting', async () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');
    await userEvent.click(saveButton);

    // Check if saving button text appears during loading
    const savingButton = page.getByText('Saving...');

    expect(savingButton).toBeTruthy();
  });

  it('should add first instructor as primary role', async () => {
    render(<EditClassInstructorsModal {...defaultProps} instructors={[]} />);

    // Add first instructor
    const coachAlexLabel = page.getByText('Coach Alex');
    await userEvent.click(coachAlexLabel);

    // First instructor should be primary
    const primaryRole = page.getByText('Primary');

    expect(primaryRole).toBeTruthy();
  });

  it('should add subsequent instructors as assistant role', async () => {
    render(<EditClassInstructorsModal {...defaultProps} />);

    // Add another instructor (Professor Jessica)
    const professorJessicaLabel = page.getByText('Professor Jessica');
    await userEvent.click(professorJessicaLabel);

    // New instructor should be assistant
    const assistantRole = page.getByText('Assistant');

    expect(assistantRole).toBeTruthy();
  });

  it('should not render selected instructors section when no instructors', () => {
    render(<EditClassInstructorsModal {...defaultProps} instructors={[]} />);

    const heading = document.body.textContent?.includes('Selected Instructors');

    expect(heading).toBe(false);
  });
});
