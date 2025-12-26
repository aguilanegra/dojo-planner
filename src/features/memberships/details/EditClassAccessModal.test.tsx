import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { EditClassAccessModal } from './EditClassAccessModal';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Edit Class Access',
  class_limits_label: 'Class Limits',
  class_limits_unlimited: 'Unlimited Classes',
  class_limits_limited: 'Limited Classes',
  class_limit_count_label: 'Classes per Month',
  class_limit_count_placeholder: 'e.g., 8',
  class_limit_count_error: 'Please enter a valid number of classes.',
  available_classes_label: 'Available Classes',
  available_classes_error: 'Please select at least one class.',
  select_all_button: 'Select All',
  deselect_all_button: 'Deselect All',
  cancel_button: 'Cancel',
  save_button: 'Save Changes',
  saving_button: 'Saving...',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('EditClassAccessModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    classLimitType: 'unlimited' as const,
    classLimitCount: null,
    availableClasses: ['fundamentals', 'intro-bjj'],
    onSave: mockOnSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal with title when open', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const heading = page.getByText('Edit Class Access');

    expect(heading).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    render(<EditClassAccessModal {...defaultProps} isOpen={false} />);

    const heading = document.body.textContent?.includes('Edit Class Access');

    expect(heading).toBe(false);
  });

  it('should render class limits label', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const classLimitsLabel = page.getByText('Class Limits');

    expect(classLimitsLabel).toBeTruthy();
  });

  it('should render available classes label', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const availableClassesLabel = page.getByText('Available Classes');

    expect(availableClassesLabel).toBeTruthy();
  });

  it('should render Select All button', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const selectAllButton = page.getByText('Select All');

    expect(selectAllButton).toBeTruthy();
  });

  it('should render Cancel button', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');

    expect(cancelButton).toBeTruthy();
  });

  it('should render Save Changes button', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');

    expect(saveButton).toBeTruthy();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render class checkboxes', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const fundamentals = page.getByText('Fundamentals');
    const introBjj = page.getByText('Intro to BJJ');

    expect(fundamentals).toBeTruthy();
    expect(introBjj).toBeTruthy();
  });

  it('should have Save button enabled when at least one class is selected', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    expect(saveButton?.disabled).toBe(false);
  });

  it('should render Deselect All button when all classes are selected', () => {
    render(
      <EditClassAccessModal
        {...defaultProps}
        availableClasses={[
          'fundamentals',
          'intro-bjj',
          'no-gi',
          'advanced',
          'open-mat',
          'competition-team',
          'kids-fundamentals',
          'kids-advanced',
        ]}
      />,
    );

    const deselectAllButton = page.getByText('Deselect All');

    expect(deselectAllButton).toBeTruthy();
  });

  it('should render class limit count input when limited is selected', () => {
    render(
      <EditClassAccessModal
        {...defaultProps}
        classLimitType="limited"
        classLimitCount={8}
      />,
    );

    const classLimitCountLabel = page.getByText('Classes per Month');

    expect(classLimitCountLabel).toBeTruthy();
  });

  it('should not render class limit count input when unlimited is selected', () => {
    render(<EditClassAccessModal {...defaultProps} />);

    const classLimitCountLabel = document.body.textContent?.includes('Classes per Month');

    expect(classLimitCountLabel).toBe(false);
  });
});
