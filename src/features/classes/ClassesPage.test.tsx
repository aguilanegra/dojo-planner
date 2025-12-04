import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import { ClassesPage } from './ClassesPage';

describe('ClassesPage', () => {
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

    it('should render the page description', () => {
      render(
        <I18nWrapper>
          <ClassesPage />
        </I18nWrapper>,
      );

      const description = page.getByText(/Manage and view all classes/);

      expect(description).toBeInTheDocument();
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
  });
});
