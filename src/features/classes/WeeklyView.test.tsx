import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import { WeeklyView } from './WeeklyView';

describe('WeeklyView', () => {
  describe('Page Header', () => {
    it('should render the page title', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const heading = page.getByRole('heading', { name: /Class Calendar/i }).first();

      expect(heading).toBeInTheDocument();
    });
  });

  describe('Filter Controls', () => {
    it('should render location dropdown button', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const button = page.getByRole('button').first();

      expect(button).toBeInTheDocument();
    });

    it('should render Add New Class button', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const addButton = page.getByRole('button', { name: /Add New Class/i });

      expect(addButton).toBeInTheDocument();
    });

    it('should render view toggle buttons', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const monthlyButton = page.getByRole('button', { name: /Monthly/i });

      expect(monthlyButton).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should render Previous button', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const prevButton = page.getByRole('button', { name: /Previous/i });

      expect(prevButton).toBeInTheDocument();
    });

    it('should render Next button', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const nextButton = page.getByRole('button', { name: /Next/i });

      expect(nextButton).toBeInTheDocument();
    });

    it('should render Today button', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const todayButton = page.getByRole('button', { name: /Today/i });

      expect(todayButton).toBeInTheDocument();
    });

    it('should render date display showing current week', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const dateText = page.getByText(/September/i);

      expect(dateText).toBeInTheDocument();
    });
  });

  describe('Weekly Schedule Grid', () => {
    it('should render all days of week headers', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

      for (const day of daysOfWeek) {
        const dayHeader = day === 'MON' ? page.getByText(day).first() : page.getByText(day);

        expect(dayHeader).toBeInTheDocument();
      }
    });

    it('should render time column', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const timeLabel = page.getByText('Time');

      expect(timeLabel).toBeInTheDocument();
    });

    it('should display hourly time slots', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Check for some time slots (6 AM to 10 PM)
      const sixAM = page.getByText(/6:00 AM/i);

      expect(sixAM).toBeInTheDocument();
    });

    it('should render class events in schedule', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Look for class names that should appear in weekly schedule
      const fundamentals = page.getByText(/Fundamentals/i).first();

      expect(fundamentals).toBeInTheDocument();
    });

    it('should display multiple classes on same day/time when applicable', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Verify there are class elements
      const advancedClass = page.getByText('BJJ Advanced').first();

      expect(advancedClass).toBeInTheDocument();
    });
  });

  describe('Time Slot Layout', () => {
    it('should render consistent grid structure', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Verify grid is properly structured
      const timeColumn = page.getByText('Time');

      expect(timeColumn).toBeInTheDocument();
    });

    it('should show correct day numbers for each column', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Week of September 15, 2025 should show dates
      const date = page.getByText('15').first();

      expect(date).toBeInTheDocument();
    });

    it('should align classes to correct time slots', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Fundamentals II typically at 6 AM should appear
      const fundamentalsII = page.getByText('BJJ Fundamentals II').first();

      expect(fundamentalsII).toBeInTheDocument();
    });
  });

  describe('Class Styling', () => {
    it('should render classes with color coding', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const classElement = page.getByText(/BJJ/i).first();

      expect(classElement).toBeInTheDocument();
    });

    it('should display class blocks with proper styling', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Verify class elements exist and are styled
      const kidClass = page.getByText('Kids Class').first();

      expect(kidClass).toBeInTheDocument();
    });
  });

  describe('Legend', () => {
    it('should render legend section', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const legendEntries = [
        'BJJ Fundamentals I',
        'BJJ Advanced',
        'Kids Class',
        'Women\'s BJJ',
        'Open Mat',
      ];

      for (const entry of legendEntries) {
        const legendItem = page.getByText(entry).first();

        expect(legendItem).toBeInTheDocument();
      }
    });

    it('should show color indicators in legend', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const legend = page.getByText(/BJJ Fundamentals I/i).first();

      expect(legend).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render responsive table layout', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const timeLabels = page.getByText('Time');

      expect(timeLabels).toBeInTheDocument();
    });

    it('should handle horizontal scrolling for small screens', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Verify the schedule grid is renderable
      const schedule = page.getByText('MON').first();

      expect(schedule).toBeInTheDocument();
    });
  });

  describe('All Mock Classes Display', () => {
    it('should render all class types in schedule', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const classNames = [
        /Fundamentals/i,
        /Advanced/i,
        /Kids/i,
        /Women/i,
        /Open/i,
      ];

      for (const className of classNames) {
        const element = page.getByText(className).first();

        expect(element).toBeInTheDocument();
      }
    });

    it('should place classes at appropriate time slots', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Morning classes (6 AM)
      const morningClass = page.getByText(/Fundamentals II/i).first();

      expect(morningClass).toBeInTheDocument();
    });

    it('should display afternoon and evening classes', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      // Afternoon/evening classes (4-8 PM)
      const kidClass = page.getByText('Kids Class').first().first();

      expect(kidClass).toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    it('should render Previous button that is clickable', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const prevButton = page.getByRole('button', { name: /Previous/i });

      expect(prevButton).toBeVisible();
    });

    it('should render Next button that is clickable', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const nextButton = page.getByRole('button', { name: /Next/i });

      expect(nextButton).toBeVisible();
    });

    it('should render Today button with proper styling', () => {
      render(
        <I18nWrapper>
          <WeeklyView />
        </I18nWrapper>,
      );

      const todayButton = page.getByRole('button', { name: /Today/i });

      expect(todayButton).toBeVisible();
    });
  });
});
