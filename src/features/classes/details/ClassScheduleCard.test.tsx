import type { DayOfWeek } from '@/hooks/useAddClassWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { ClassScheduleCard } from './ClassScheduleCard';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Schedule',
  days_label: 'Days',
  time_label: 'Time',
  duration_label: 'Duration',
  location_label: 'Location',
  calendar_color_label: 'Calendar Color',
  no_days: 'No days selected',
  no_location: 'No location set',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('ClassScheduleCard', () => {
  const mockOnEdit = vi.fn();

  const defaultProps = {
    daysOfWeek: ['Monday', 'Wednesday', 'Friday'] as DayOfWeek[],
    timeHour: 6,
    timeMinute: 0,
    timeAmPm: 'PM' as const,
    durationHours: 1,
    durationMinutes: 0,
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

  it('should render the days of week', () => {
    render(<ClassScheduleCard {...defaultProps} />);

    const days = page.getByText('Mon, Wed, Fri');

    expect(days).toBeTruthy();
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

    const daysLabel = page.getByText('Days');
    const timeLabel = page.getByText('Time');
    const durationLabel = page.getByText('Duration');
    const locationLabel = page.getByText('Location');
    const colorLabel = page.getByText('Calendar Color');

    expect(daysLabel).toBeTruthy();
    expect(timeLabel).toBeTruthy();
    expect(durationLabel).toBeTruthy();
    expect(locationLabel).toBeTruthy();
    expect(colorLabel).toBeTruthy();
  });

  it('should show no days message when no days selected', () => {
    render(<ClassScheduleCard {...defaultProps} daysOfWeek={[]} />);

    const noDays = page.getByText('No days selected');

    expect(noDays).toBeTruthy();
  });

  it('should show no location message when location is empty', () => {
    render(<ClassScheduleCard {...defaultProps} location="" />);

    const noLocation = page.getByText('No location set');

    expect(noLocation).toBeTruthy();
  });

  it('should format duration with hours and minutes', () => {
    render(<ClassScheduleCard {...defaultProps} durationHours={1} durationMinutes={30} />);

    const duration = page.getByText('1h 30m');

    expect(duration).toBeTruthy();
  });
});
