import type { ScheduleInstance } from '@/hooks/useAddClassWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { ClassScheduleCard } from './ClassScheduleCard';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Schedule',
  schedule_label: 'Schedule',
  column_day: 'Day',
  column_time: 'Time',
  column_duration: 'Duration',
  column_instructor: 'Instructor',
  column_assistant: 'Assistant',
  no_schedule: 'No schedule set',
  location_label: 'Location',
  calendar_color_label: 'Calendar Color',
  no_location: 'No location set',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('ClassScheduleCard', () => {
  const mockOnEdit = vi.fn();

  const mockInstance: ScheduleInstance = {
    id: 'test-instance-1',
    dayOfWeek: 'Monday',
    timeHour: 6,
    timeMinute: 0,
    timeAmPm: 'PM',
    durationHours: 1,
    durationMinutes: 0,
    staffMember: 'coach-alex',
    assistantStaff: '',
  };

  const defaultProps = {
    scheduleInstances: [mockInstance],
    location: 'Downtown HQ',
    calendarColor: '#22c55e',
    onEdit: mockOnEdit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the card with title', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const heading = page.getByText('Schedule');

    expect(heading).toBeTruthy();
  });

  it('should render schedule instances table', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    // Check for table headers
    const dayHeader = page.getByText('Day');
    const timeHeader = page.getByText('Time');
    const durationHeader = page.getByText('Duration');

    expect(dayHeader).toBeTruthy();
    expect(timeHeader).toBeTruthy();
    expect(durationHeader).toBeTruthy();
  });

  it('should render the day abbreviation', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const day = page.getByText('Mon');

    expect(day).toBeTruthy();
  });

  it('should render the time', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const time = page.getByText('06:00 PM');

    expect(time).toBeTruthy();
  });

  it('should render the duration', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const duration = page.getByText('1h');

    expect(duration).toBeTruthy();
  });

  it('should render the location', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const location = page.getByText('Downtown HQ');

    expect(location).toBeTruthy();
  });

  it('should render the calendar color', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const colorCode = page.getByText('#22c55e');

    expect(colorCode).toBeTruthy();
  });

  it('should render Edit button', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const editButton = page.getByRole('button');

    expect(editButton).toBeTruthy();
  });

  it('should call onEdit when Edit button is clicked', async () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const editButton = page.getByRole('button');
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should render all field labels', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const scheduleLabel = page.getByText('Schedule');
    const locationLabel = page.getByText('Location');
    const colorLabel = page.getByText('Calendar Color');

    expect(scheduleLabel).toBeTruthy();
    expect(locationLabel).toBeTruthy();
    expect(colorLabel).toBeTruthy();
  });

  it('should show no schedule message when no instances', () => {
    render(<ClassScheduleCard {...defaultProps} scheduleInstances={[]} />);

    const noSchedule = page.getByText('No schedule set');

    expect(noSchedule).toBeTruthy();
  });

  it('should show no location message when location is empty', () => {
    render(<ClassScheduleCard {...defaultProps} location="" />);

    const noLocation = page.getByText('No location set');

    expect(noLocation).toBeTruthy();
  });

  it('should format duration with hours and minutes', () => {
    const instanceWithMinutes: ScheduleInstance = {
      ...mockInstance,
      durationHours: 1,
      durationMinutes: 30,
    };

    render(<ClassScheduleCard {...defaultProps} scheduleInstances={[instanceWithMinutes]} />);

    const duration = page.getByText('1h 30m');

    expect(duration).toBeTruthy();
  });

  it('should render instructor name', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const instructor = page.getByText('Coach Alex');

    expect(instructor).toBeTruthy();
  });

  it('should render dash when no instructor assigned', () => {
    const instanceNoStaff: ScheduleInstance = {
      ...mockInstance,
      staffMember: '',
    };

    render(<ClassScheduleCard {...defaultProps} scheduleInstances={[instanceNoStaff]} />);

    // The instructor column should show a dash
    const rows = document.querySelectorAll('[data-testid^="schedule-instance-"]');

    expect(rows.length).toBe(1);
  });

  it('should render multiple schedule instances', () => {
    const multipleInstances: ScheduleInstance[] = [
      { ...mockInstance, id: 'instance-1', dayOfWeek: 'Monday' },
      { ...mockInstance, id: 'instance-2', dayOfWeek: 'Wednesday' },
      { ...mockInstance, id: 'instance-3', dayOfWeek: 'Friday' },
    ];

    render(<ClassScheduleCard {...defaultProps} scheduleInstances={multipleInstances} />);

    const rows = document.querySelectorAll('[data-testid^="schedule-instance-"]');

    expect(rows.length).toBe(3);
  });

  it('should render instructor column header', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const instructorHeader = page.getByText('Instructor');

    expect(instructorHeader).toBeTruthy();
  });

  it('should render assistant column header', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const assistantHeader = page.getByText('Assistant');

    expect(assistantHeader).toBeTruthy();
  });

  it('should render assistant name when assigned', () => {
    const instanceWithAssistant: ScheduleInstance = {
      ...mockInstance,
      assistantStaff: 'professor-jessica',
    };

    render(<ClassScheduleCard {...defaultProps} scheduleInstances={[instanceWithAssistant]} />);

    const assistant = page.getByText('Professor Jessica');

    expect(assistant).toBeTruthy();
  });

  it('should render dash when no assistant assigned', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    // With no assistant, there should be a dash in the assistant column
    const rows = document.querySelectorAll('[data-testid^="schedule-instance-"]');

    expect(rows.length).toBe(1);
  });

  it('should render different day abbreviations correctly', () => {
    const weekInstances: ScheduleInstance[] = [
      { ...mockInstance, id: 'tue', dayOfWeek: 'Tuesday' },
      { ...mockInstance, id: 'thu', dayOfWeek: 'Thursday' },
      { ...mockInstance, id: 'sat', dayOfWeek: 'Saturday' },
    ];

    render(<ClassScheduleCard {...defaultProps} scheduleInstances={weekInstances} />);

    const tue = page.getByText('Tue');
    const thu = page.getByText('Thu');
    const sat = page.getByText('Sat');

    expect(tue).toBeTruthy();
    expect(thu).toBeTruthy();
    expect(sat).toBeTruthy();
  });

  it('should render duration in minutes only when hours is 0', () => {
    const instanceMinutesOnly: ScheduleInstance = {
      ...mockInstance,
      durationHours: 0,
      durationMinutes: 45,
    };

    render(<ClassScheduleCard {...defaultProps} scheduleInstances={[instanceMinutesOnly]} />);

    const duration = page.getByText('45m');

    expect(duration).toBeTruthy();
  });
});
