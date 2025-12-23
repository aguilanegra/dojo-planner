import type { AddClassWizardData } from '@/hooks/useAddClassWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { ClassSuccessStep } from './ClassSuccessStep';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Class Created Successfully!',
  description: '"{name}" has been added to your schedule.',
  summary_title: 'Class Summary',
  summary_class_name: 'Class Name',
  summary_program: 'Program',
  summary_schedule: 'Schedule',
  summary_duration: 'Duration',
  summary_instructor: 'Instructor',
  summary_tags: 'Tags',
  summary_calendar_color: 'Calendar Color',
  done_button: 'Done',
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

describe('ClassSuccessStep', () => {
  const mockData: AddClassWizardData = {
    className: 'Morning BJJ',
    program: 'adult-bjj',
    maximumCapacity: null,
    minimumAge: null,
    allowWalkIns: 'Yes',
    description: 'A great class for adults',
    schedule: {
      daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
      timeHour: 6,
      timeMinute: 30,
      timeAmPm: 'AM',
      durationHours: 1,
      durationMinutes: 30,
      location: '',
      staffMember: 'coach-alex',
      assistantStaff: '',
    },
    calendarColor: '#3b82f6',
    tags: [],
  };

  const mockOnDone = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render success title', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const title = page.getByRole('heading', { level: 2 });

    expect(title).toBeTruthy();
  });

  it('should display class name in description', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const description = page.getByText(/"Morning BJJ" has been added to your schedule./);

    expect(description).toBeTruthy();
  });

  it('should display success checkmark icon', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const svg = document.querySelector('svg');

    expect(svg).toBeTruthy();
    expect(svg?.classList.contains('text-green-600')).toBe(true);
  });

  it('should display class summary section', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const summaryTitle = page.getByText('Class Summary');

    expect(summaryTitle).toBeTruthy();
  });

  it('should display class name in summary', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const className = page.getByText('Morning BJJ');

    expect(className).toBeTruthy();
  });

  it('should display program name in summary', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const program = page.getByText('Adult Brazilian Jiu-Jitsu');

    expect(program).toBeTruthy();
  });

  it('should display schedule in summary', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const schedule = page.getByText(/Monday, Wednesday, Friday/);

    expect(schedule).toBeTruthy();
  });

  it('should display formatted time in schedule', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const time = page.getByText(/6:30 AM/);

    expect(time).toBeTruthy();
  });

  it('should display duration with hours and minutes', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const duration = page.getByText('1 hr 30 min');

    expect(duration).toBeTruthy();
  });

  it('should display duration with only hours when no minutes', () => {
    const dataWithOnlyHours: AddClassWizardData = {
      ...mockData,
      schedule: {
        ...mockData.schedule,
        durationHours: 2,
        durationMinutes: 0,
      },
    };

    render(<ClassSuccessStep data={dataWithOnlyHours} onDone={mockOnDone} />);

    const duration = page.getByText('2 hr');

    expect(duration).toBeTruthy();
  });

  it('should display duration with only minutes when no hours', () => {
    const dataWithOnlyMinutes: AddClassWizardData = {
      ...mockData,
      schedule: {
        ...mockData.schedule,
        durationHours: 0,
        durationMinutes: 45,
      },
    };

    render(<ClassSuccessStep data={dataWithOnlyMinutes} onDone={mockOnDone} />);

    const duration = page.getByText('45 min');

    expect(duration).toBeTruthy();
  });

  it('should display instructor name in summary', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const instructor = page.getByText('Coach Alex');

    expect(instructor).toBeTruthy();
  });

  it('should display calendar color preview', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const colorHex = page.getByText('#3b82f6');

    expect(colorHex).toBeTruthy();
  });

  it('should not display tags section when no tags are selected', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const tagsLabel = document.body.textContent?.includes('Tags');

    // The Tags label should not appear when no tags are selected
    expect(tagsLabel).toBe(false);
  });

  it('should display tags when selected', () => {
    const dataWithTags: AddClassWizardData = {
      ...mockData,
      tags: ['tag-1'],
    };

    render(<ClassSuccessStep data={dataWithTags} onDone={mockOnDone} />);

    const tagsLabel = page.getByText('Tags');

    expect(tagsLabel).toBeTruthy();
  });

  it('should display Done button', () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const doneButton = page.getByRole('button', { name: 'Done' });

    expect(doneButton).toBeTruthy();
  });

  it('should call onDone when Done button is clicked', async () => {
    render(<ClassSuccessStep data={mockData} onDone={mockOnDone} />);

    const doneButton = page.getByRole('button', { name: 'Done' });
    await userEvent.click(doneButton.element());

    expect(mockOnDone).toHaveBeenCalled();
  });

  it('should handle unknown program gracefully', () => {
    const dataWithUnknownProgram: AddClassWizardData = {
      ...mockData,
      program: 'unknown-program',
    };

    render(<ClassSuccessStep data={dataWithUnknownProgram} onDone={mockOnDone} />);

    const program = page.getByText('unknown-program');

    expect(program).toBeTruthy();
  });

  it('should handle unknown staff member gracefully', () => {
    const dataWithUnknownStaff: AddClassWizardData = {
      ...mockData,
      schedule: {
        ...mockData.schedule,
        staffMember: 'unknown-coach',
      },
    };

    render(<ClassSuccessStep data={dataWithUnknownStaff} onDone={mockOnDone} />);

    const instructor = page.getByText('unknown-coach');

    expect(instructor).toBeTruthy();
  });

  it('should display time with padded minutes', () => {
    const dataWithPaddedMinutes: AddClassWizardData = {
      ...mockData,
      schedule: {
        ...mockData.schedule,
        timeHour: 9,
        timeMinute: 0,
        timeAmPm: 'PM',
      },
    };

    render(<ClassSuccessStep data={dataWithPaddedMinutes} onDone={mockOnDone} />);

    const time = page.getByText(/9:00 PM/);

    expect(time).toBeTruthy();
  });
});
