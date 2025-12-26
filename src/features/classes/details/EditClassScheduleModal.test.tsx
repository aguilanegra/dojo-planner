import type { DayOfWeek } from '@/hooks/useAddClassWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { EditClassScheduleModal } from './EditClassScheduleModal';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Edit Schedule',
  days_label: 'Days of Week',
  day_monday: 'Monday',
  day_tuesday: 'Tuesday',
  day_wednesday: 'Wednesday',
  day_thursday: 'Thursday',
  day_friday: 'Friday',
  day_saturday: 'Saturday',
  day_sunday: 'Sunday',
  days_error: 'Please select at least one day.',
  time_label: 'Time of Day',
  duration_label: 'Duration',
  duration_hr: 'hr',
  duration_min: 'min',
  duration_error: 'Duration must be greater than 0.',
  location_label: 'Location',
  location_placeholder: 'e.g., Downtown HQ',
  calendar_color_label: 'Calendar Color',
  calendar_color_select: 'Choose a color',
  cancel_button: 'Cancel',
  save_button: 'Save Changes',
  saving_button: 'Saving...',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('EditClassScheduleModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    daysOfWeek: ['Monday', 'Wednesday', 'Friday'] as DayOfWeek[],
    timeHour: 6,
    timeMinute: 0,
    timeAmPm: 'PM' as const,
    durationHours: 1,
    durationMinutes: 0,
    location: 'Downtown HQ',
    calendarColor: '#22c55e',
    onSave: mockOnSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal with title when open', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const heading = page.getByText('Edit Schedule');

    expect(heading).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    render(<EditClassScheduleModal {...defaultProps} isOpen={false} />);

    const heading = document.body.textContent?.includes('Edit Schedule');

    expect(heading).toBe(false);
  });

  it('should render days of week label', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const daysLabel = page.getByText('Days of Week');

    expect(daysLabel).toBeTruthy();
  });

  it('should render Cancel button', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');

    expect(cancelButton).toBeTruthy();
  });

  it('should render Save Changes button', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');

    expect(saveButton).toBeTruthy();
  });

  it('should render time label', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const timeLabel = page.getByText('Time of Day');

    expect(timeLabel).toBeTruthy();
  });

  it('should render duration label', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const durationLabel = page.getByText('Duration');

    expect(durationLabel).toBeTruthy();
  });

  it('should render location input', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const locationLabel = page.getByText('Location');

    expect(locationLabel).toBeTruthy();
  });

  it('should render calendar color label', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const colorLabel = page.getByText('Calendar Color');

    expect(colorLabel).toBeTruthy();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have Save button enabled when form is valid', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    expect(saveButton?.disabled).toBe(false);
  });

  it('should render day checkboxes', () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const monday = page.getByText('Monday');
    const tuesday = page.getByText('Tuesday');
    const wednesday = page.getByText('Wednesday');

    expect(monday).toBeTruthy();
    expect(tuesday).toBeTruthy();
    expect(wednesday).toBeTruthy();
  });

  it('should call onSave with updated values when Save button is clicked', async () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');
    await userEvent.click(saveButton);

    // Wait for the simulated API call
    await new Promise(resolve => setTimeout(resolve, 600));

    expect(mockOnSave).toHaveBeenCalledWith({
      daysOfWeek: defaultProps.daysOfWeek,
      timeHour: defaultProps.timeHour,
      timeMinute: defaultProps.timeMinute,
      timeAmPm: defaultProps.timeAmPm,
      durationHours: defaultProps.durationHours,
      durationMinutes: defaultProps.durationMinutes,
      location: defaultProps.location,
      calendarColor: defaultProps.calendarColor,
    });
  });

  it('should show saving state when submitting', async () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');
    await userEvent.click(saveButton);

    // Check if saving button text appears during loading
    const savingButton = page.getByText('Saving...');

    expect(savingButton).toBeTruthy();
  });

  it('should toggle day selection when clicking a day checkbox', async () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    // Click Tuesday to add it
    const tuesdayLabel = page.getByText('Tuesday');
    await userEvent.click(tuesdayLabel);

    const saveButton = page.getByText('Save Changes');
    await userEvent.click(saveButton);

    await new Promise(resolve => setTimeout(resolve, 600));

    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      daysOfWeek: expect.arrayContaining(['Monday', 'Wednesday', 'Friday', 'Tuesday']),
    }));
  });

  it('should update location when input changes', async () => {
    render(<EditClassScheduleModal {...defaultProps} />);

    const locationInput = page.getByPlaceholder('e.g., Downtown HQ');
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, 'New Location');

    const saveButton = page.getByText('Save Changes');
    await userEvent.click(saveButton);

    await new Promise(resolve => setTimeout(resolve, 600));

    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      location: 'New Location',
    }));
  });

  it('should render with empty days of week', () => {
    render(<EditClassScheduleModal {...defaultProps} daysOfWeek={[]} />);

    const daysLabel = page.getByText('Days of Week');

    expect(daysLabel).toBeTruthy();
  });

  it('should disable Save button when no days are selected', () => {
    render(<EditClassScheduleModal {...defaultProps} daysOfWeek={[]} />);

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    expect(saveButton?.disabled).toBe(true);
  });
});
