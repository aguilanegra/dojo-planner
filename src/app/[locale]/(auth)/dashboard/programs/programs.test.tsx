import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import ProgramsPage from './page';

describe('Programs Page', () => {
  it('renders programs management header', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const heading = page.getByRole('heading', { name: /Programs Management/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders statistics cards', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const totalPrograms = page.getByText(/Total Programs/);
    const active = page.getByText('Active').elements();
    const totalClasses = page.getByText(/Total Classes/);

    expect(totalPrograms).toBeInTheDocument();
    expect(active.length).toBeGreaterThan(0);
    expect(totalClasses).toBeInTheDocument();
  });

  it('renders statistics values', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    // Stats should show dynamic values from mock data
    // Total programs count of 5 appears in stats card
    const statValues = page.getByText('5', { exact: true }).elements();

    expect(statValues.length).toBeGreaterThan(0);
  });

  it('renders total classes count correctly', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    // Total classes should be 12 (5 + 2 + 3 + 1 + 1)
    const classCount = page.getByText('12', { exact: true }).elements();

    expect(classCount.length).toBeGreaterThan(0);
  });

  it('renders add new program button', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const button = page.getByRole('button', { name: /Add New Program/i });

    expect(button).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const searchInput = page.getByPlaceholder(/Search programs/i);

    expect(searchInput).toBeInTheDocument();
  });

  it('renders status filter dropdown', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    // Select trigger should be rendered
    const statusSelect = page.getByRole('combobox').elements();

    expect(statusSelect.length).toBeGreaterThanOrEqual(1);
  });

  it('renders program cards with names', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const adultProgram = page.getByRole('heading', { name: 'Adult Brazilian Jiu-jitsu' });
    const kidsProgram = page.getByRole('heading', { name: 'Kids Program' });
    const competitionTeam = page.getByRole('heading', { name: 'Competition Team' });
    const judoProgram = page.getByRole('heading', { name: 'Judo Fundamentals' });

    expect(adultProgram).toBeInTheDocument();
    expect(kidsProgram).toBeInTheDocument();
    expect(competitionTeam).toBeInTheDocument();
    expect(judoProgram).toBeInTheDocument();
  });

  it('renders program card descriptions', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const adultDescription = page.getByText(/Traditional Brazilian Jiu-Jitsu program for adults/);
    const kidsDescription = page.getByText(/Fun and engaging martial arts program/);

    expect(adultDescription).toBeInTheDocument();
    expect(kidsDescription).toBeInTheDocument();
  });

  it('renders program card class counts', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    // Adult BJJ has 5 classes
    const fiveClasses = page.getByText('5', { exact: true }).elements();

    expect(fiveClasses.length).toBeGreaterThan(0);
  });

  it('renders program card class names', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const classNames = page.getByText(/BJJ Fundamentals I & II/);

    expect(classNames).toBeInTheDocument();
  });

  it('renders classes label on program cards', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const classesLabels = page.getByText('Classes').elements();

    expect(classesLabels.length).toBeGreaterThan(0);
  });

  it('renders edit buttons on program cards', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const editButtons = page.getByRole('button', { name: /Edit program/i }).elements();

    expect(editButtons.length).toBe(5);
  });

  it('renders delete buttons on program cards', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const deleteButtons = page.getByRole('button', { name: /Delete program/i }).elements();

    expect(deleteButtons.length).toBe(5);
  });

  it('renders active status badges on program cards', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    // All 4 programs are Active
    const activeBadges = page.getByText('Active').elements();

    // Should have Active in stats card + 4 program cards
    expect(activeBadges.length).toBeGreaterThanOrEqual(4);
  });

  it('renders all five program cards', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    // Verify all programs are rendered by checking unique program names using headings
    const adultBjj = page.getByRole('heading', { name: 'Adult Brazilian Jiu-jitsu' });
    const kidsProgram = page.getByRole('heading', { name: 'Kids Program' });
    const competitionTeam = page.getByRole('heading', { name: 'Competition Team' });
    const judoFundamentals = page.getByRole('heading', { name: 'Judo Fundamentals' });
    const wrestlingFundamentals = page.getByRole('heading', { name: 'Wrestling Fundamentals' });

    expect(adultBjj).toBeInTheDocument();
    expect(kidsProgram).toBeInTheDocument();
    expect(competitionTeam).toBeInTheDocument();
    expect(judoFundamentals).toBeInTheDocument();
    expect(wrestlingFundamentals).toBeInTheDocument();
  });

  it('renders inactive status badge for Wrestling Fundamentals', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    const inactiveBadges = page.getByText('Inactive').elements();

    // Should have 1 inactive program (Wrestling Fundamentals)
    expect(inactiveBadges.length).toBe(1);
  });

  it('renders active count of 4 in stats card', () => {
    render(<I18nWrapper><ProgramsPage /></I18nWrapper>);

    // 4 out of 5 programs are active
    const fourElements = page.getByText('4', { exact: true }).elements();

    expect(fourElements.length).toBeGreaterThan(0);
  });
});
