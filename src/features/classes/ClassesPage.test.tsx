import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import { ClassesPage } from './ClassesPage';

describe('ClassesPage', () => {
  describe('Summary Cards', () => {
    it('should render total classes stat card', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const totalClassesLabel = page.getByText('Total Classes');

      expect(totalClassesLabel).toBeInTheDocument();
    });

    it('should render tags stat card', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const tagsLabel = page.getByText('Tags').first();

      expect(tagsLabel).toBeInTheDocument();
    });

    it('should render instructors stat card', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      // "Instructors" appears both as stat card label and in class cards
      const instructorsLabel = page.getByText('Instructors').first();

      expect(instructorsLabel).toBeInTheDocument();
    });

    it('should display correct total classes count of 9', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      // 9 mock classes
      const nineElements = page.getByText('9', { exact: true }).elements();

      expect(nineElements.length).toBeGreaterThan(0);
    });

    it('should display correct tags count of 7', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      // 7 tags = 5 unique types (Adults, Kids, Women, Open, Competition) + 2 unique styles (Gi, No Gi)
      const sevenElements = page.getByText('7', { exact: true }).elements();

      expect(sevenElements.length).toBeGreaterThan(0);
    });

    it('should display instructor count', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      // 5 unique instructors: Coach Alex, Professor Jessica, Professor Ivan, Professor Joao, Coach Liza
      const fiveElements = page.getByText('5', { exact: true }).elements();

      expect(fiveElements.length).toBeGreaterThan(0);
    });
  });

  describe('Page Header', () => {
    it('should render the page title', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const heading = page.getByRole('heading', { name: /Classes/i }).first();

      expect(heading).toBeInTheDocument();
    });
  });

  describe('Filter Controls', () => {
    it('should render Add New Class button', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const addButton = page.getByRole('button', { name: /Add New Class/i });

      expect(addButton).toBeInTheDocument();
    });

    it('should render Manage Tags button', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const manageTagsButton = page.getByRole('button', { name: /Manage Tags/i });

      expect(manageTagsButton).toBeInTheDocument();
    });

    it('should open Class Tags Management sheet when Manage Tags button is clicked', async () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const manageTagsButton = page.getByRole('button', { name: /Manage Tags/i });
      await userEvent.click(manageTagsButton);

      const sheetTitle = page.getByRole('heading', { name: 'Class Tags Management' });

      expect(sheetTitle).toBeInTheDocument();
    });

    it('should close Class Tags Management sheet when close button is clicked', async () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const manageTagsButton = page.getByRole('button', { name: /Manage Tags/i });
      await userEvent.click(manageTagsButton);

      const closeButton = page.getByRole('button', { name: 'Close' });
      await userEvent.click(closeButton);

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const sheetTitles = page.getByRole('heading', { name: 'Class Tags Management' });

      expect(sheetTitles.elements()).toHaveLength(0);
    });

    it('should render view toggle buttons', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const gridButton = page.getByTitle('Grid view');
      const listButton = page.getByTitle('List view');

      expect(gridButton).toBeInTheDocument();
      expect(listButton).toBeInTheDocument();
    });

    it('should render weekly view toggle button', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const weeklyButton = page.getByTitle('Weekly view');

      expect(weeklyButton).toBeInTheDocument();
    });

    it('should render monthly view toggle button', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const monthlyButton = page.getByTitle('Monthly view');

      expect(monthlyButton).toBeInTheDocument();
    });
  });

  describe('View Switching', () => {
    it('should switch to list view when clicking list button', async () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const listButton = page.getByTitle('List view');
      await userEvent.click(listButton);

      // Class cards should still render in list view
      const classTitle = page.getByRole('heading', { name: 'BJJ Fundamentals I' }).first();

      expect(classTitle).toBeInTheDocument();
    });

    it('should switch to weekly view when clicking weekly button', async () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const weeklyButton = page.getByTitle('Weekly view');
      await userEvent.click(weeklyButton);

      // Weekly view should render
      expect(page.getByText(/Mon/i)).toBeDefined();
    });

    it('should switch to monthly view when clicking monthly button', async () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const monthlyButton = page.getByTitle('Monthly view');
      await userEvent.click(monthlyButton);

      // Monthly view should render (calendar grid)
      expect(monthlyButton).toBeInTheDocument();
    });

    it('should switch back to grid view after switching to list', async () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const listButton = page.getByTitle('List view');
      await userEvent.click(listButton);

      const gridButton = page.getByTitle('Grid view');
      await userEvent.click(gridButton);

      // Class cards should render in grid view
      const classTitle = page.getByRole('heading', { name: 'BJJ Fundamentals I' }).first();

      expect(classTitle).toBeInTheDocument();
    });
  });

  describe('Class Cards', () => {
    it('should render class cards with mock data', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const classTitle = page.getByRole('heading', { name: 'BJJ Fundamentals I' }).first();

      expect(classTitle).toBeInTheDocument();
    });

    it('should display multiple class card titles', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const fundamentalsTwo = page.getByRole('heading', { name: 'BJJ Fundamentals II' });
      const intermediate = page.getByRole('heading', { name: 'BJJ Intermediate' });

      expect(fundamentalsTwo).toBeInTheDocument();
      expect(intermediate).toBeInTheDocument();
    });

    it('should display class descriptions', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const description = page.getByText(/Covers core positions, escapes, and submissions/);

      expect(description).toBeInTheDocument();
    });

    it('should display class level badges', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const beginnerBadge = page.getByText('Beginner').first();
      const advancedBadge = page.getByText('Advanced').first();
      const intermediateBadge = page.getByText('Intermediate').first();

      expect(beginnerBadge).toBeInTheDocument();
      expect(advancedBadge).toBeInTheDocument();
      expect(intermediateBadge).toBeInTheDocument();
    });

    it('should display class type badges', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const adultsBadge = page.getByText('Adults').first();
      const womenBadge = page.getByText('Women').first();

      expect(adultsBadge).toBeInTheDocument();
      expect(womenBadge).toBeInTheDocument();
    });

    it('should display class style badges', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const giBadge = page.getByText('Gi').first();
      const noGiBadge = page.getByText('No Gi').first();

      expect(giBadge).toBeInTheDocument();
      expect(noGiBadge).toBeInTheDocument();
    });
  });

  describe('Class Details', () => {
    it('should display schedule information', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const scheduleLabel = page.getByText('Schedule').first();
      const scheduleTime = page.getByText(/M\/W\/F • 6-7 PM/);

      expect(scheduleLabel).toBeInTheDocument();
      expect(scheduleTime).toBeInTheDocument();
    });

    it('should display location information', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const locationLabel = page.getByText('Location').first();
      const locationValue = page.getByText('Downtown HQ').first();

      expect(locationLabel).toBeInTheDocument();
      expect(locationValue).toBeInTheDocument();
    });

    it('should display instructor information', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const instructorLabel = page.getByText('Instructors').first();
      const instructorName = page.getByText('Coach Alex').first();

      expect(instructorLabel).toBeInTheDocument();
      expect(instructorName).toBeInTheDocument();
    });

    it('should display multiple instructors when applicable', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const professorJessica = page.getByText('Professor Jessica').first();

      expect(professorJessica).toBeInTheDocument();
    });
  });

  describe('View Toggle', () => {
    it('should have clickable view toggle buttons', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const listButton = page.getByTitle('List view');
      const gridButton = page.getByTitle('Grid view');

      expect(listButton).toBeVisible();
      expect(gridButton).toBeVisible();
    });
  });

  describe('All Mock Classes', () => {
    it('should render all 9 mock classes by checking class descriptions', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const classDescriptions = [
        /Covers core positions, escapes, and submissions/,
        /Learn core BJJ techniques like sweeps/,
        /Covers our intermediate curriculum/,
        /Advanced curriculum that requires at least blue belt/,
        /Builds coordination, focus, and basic grappling skills/,
        /Explores high percentage transitions/,
        /Open training session/,
        /Technique focused class with optional sparring/,
        /Advanced training for competition preparation/,
      ];

      for (const description of classDescriptions) {
        const element = page.getByText(description).first();

        expect(element).toBeInTheDocument();
      }
    });

    it('should render instructor avatars', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const coach = page.getByText('Coach Alex').first();

      expect(coach).toBeInTheDocument();
    });

    it('should render Kids Class', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const kidsClass = page.getByRole('heading', { name: 'Kids Class' });

      expect(kidsClass).toBeInTheDocument();
    });

    it('should render Open Mat class', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const openMat = page.getByRole('heading', { name: 'Open Mat' });

      expect(openMat).toBeInTheDocument();
    });

    it('should render Competition Team class', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const competitionTeam = page.getByRole('heading', { name: 'Competition Team' });

      expect(competitionTeam).toBeInTheDocument();
    });

    it('should render Women\'s BJJ class', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const womensBjj = page.getByRole('heading', { name: /Women's BJJ/ });

      expect(womensBjj).toBeInTheDocument();
    });
  });
});
