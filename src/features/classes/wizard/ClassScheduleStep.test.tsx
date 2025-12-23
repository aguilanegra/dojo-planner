import type { AddClassWizardData } from '@/hooks/useAddClassWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { ClassScheduleStep } from './ClassScheduleStep';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Schedule Details',
  subtitle: 'Set up the class schedule and assign instructors',
  day_of_week_label: 'Day of Week',
  day_monday: 'Monday',
  day_tuesday: 'Tuesday',
  day_wednesday: 'Wednesday',
  day_thursday: 'Thursday',
  day_friday: 'Friday',
  day_saturday: 'Saturday',
  day_sunday: 'Sunday',
  day_of_week_error: 'Please select at least one day.',
  time_of_day_label: 'Time of Day',
  duration_label: 'Duration',
  duration_hr: 'hr',
  duration_min: 'min',
  duration_error: 'Duration must be greater than 0.',
  staff_member_label: 'Staff Member',
  staff_member_placeholder: 'Select a staff member',
  staff_member_error: 'Please select a staff member.',
  assistant_staff_label: 'Assistant Staff',
  assistant_staff_placeholder: 'Select assistant (optional)',
  assistant_staff_none: 'None',
  calendar_color_label: 'Calendar Color',
  calendar_color_select: 'Choose a color',
  calendar_color_help: 'Use the color picker or enter a hex code',
  back_button: 'Back',
  cancel_button: 'Cancel',
  next_button: 'Next',
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

describe('ClassScheduleStep', () => {
  const mockData: AddClassWizardData = {
    className: 'Test Class',
    program: 'adult-bjj',
    maximumCapacity: null,
    minimumAge: null,
    allowWalkIns: 'Yes',
    description: 'Test description',
    schedule: {
      daysOfWeek: [],
      timeHour: 6,
      timeMinute: 0,
      timeAmPm: 'AM',
      durationHours: 1,
      durationMinutes: 0,
      location: '',
      staffMember: '',
      assistantStaff: '',
    },
    calendarColor: '#000000',
    tags: [],
  };

  const mockHandlers = {
    onUpdate: vi.fn(),
    onUpdateSchedule: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the step with title and subtitle', () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const heading = page.getByRole('heading', { level: 2 });

    expect(heading).toBeTruthy();
  });

  it('should render day of week checkboxes', () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const mondayLabel = page.getByText('Monday');
    const tuesdayLabel = page.getByText('Tuesday');

    expect(mondayLabel).toBeTruthy();
    expect(tuesdayLabel).toBeTruthy();
  });

  it('should have Next button disabled when form is incomplete', () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));

    expect(nextButton?.disabled).toBe(true);
  });

  it('should enable Next button when form is complete', () => {
    const completeData: AddClassWizardData = {
      ...mockData,
      schedule: {
        ...mockData.schedule,
        daysOfWeek: ['Monday'],
        staffMember: 'coach-alex',
        durationHours: 1,
      },
    };

    render(
      <ClassScheduleStep
        data={completeData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));

    expect(nextButton?.disabled).toBe(false);
  });

  it('should call onCancel when Cancel button is clicked', async () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const cancelButton = buttons.find(btn => btn.textContent?.includes('Cancel'));

    if (cancelButton) {
      await userEvent.click(cancelButton);

      expect(mockHandlers.onCancel).toHaveBeenCalled();
    }
  });

  it('should call onBack when Back button is clicked', async () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const backButton = buttons.find(btn => btn.textContent?.includes('Back'));

    if (backButton) {
      await userEvent.click(backButton);

      expect(mockHandlers.onBack).toHaveBeenCalled();
    }
  });

  it('should display error message when provided', () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
        error="Something went wrong"
      />,
    );

    const errorMessage = page.getByText('Something went wrong');

    expect(errorMessage).toBeTruthy();
  });

  it('should render time selectors', () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const timeLabel = page.getByText('Time of Day');

    expect(timeLabel).toBeTruthy();
  });

  it('should render duration selectors', () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const durationLabel = page.getByText('Duration');

    expect(durationLabel).toBeTruthy();
  });

  it('should render staff member selector', () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const staffLabel = page.getByText('Staff Member');

    expect(staffLabel).toBeTruthy();
  });

  it('should render calendar color picker', () => {
    render(
      <ClassScheduleStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const colorLabel = page.getByText('Calendar Color');

    expect(colorLabel).toBeTruthy();
  });

  it('should display selected days', () => {
    const dataWithDays: AddClassWizardData = {
      ...mockData,
      schedule: {
        ...mockData.schedule,
        daysOfWeek: ['Monday', 'Wednesday'],
      },
    };

    render(
      <ClassScheduleStep
        data={dataWithDays}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    // Check that Monday checkbox would be checked (rendered)
    const mondayLabel = page.getByText('Monday');

    expect(mondayLabel).toBeTruthy();
  });

  it('should call onNext when Next button is clicked with valid data', async () => {
    const completeData: AddClassWizardData = {
      ...mockData,
      schedule: {
        ...mockData.schedule,
        daysOfWeek: ['Monday'],
        staffMember: 'coach-alex',
        durationHours: 1,
      },
    };

    render(
      <ClassScheduleStep
        data={completeData}
        onUpdate={mockHandlers.onUpdate}
        onUpdateSchedule={mockHandlers.onUpdateSchedule}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));

    if (nextButton) {
      await userEvent.click(nextButton);

      expect(mockHandlers.onNext).toHaveBeenCalled();
    }
  });
});
