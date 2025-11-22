import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ClassesPage } from '@/features/classes/ClassesPage';
import { I18nWrapper } from '@/lib/test-utils';

describe('Classes Page', () => {
  it('renders classes header', () => {
    render(<I18nWrapper><ClassesPage /></I18nWrapper>);

    const heading = page.getByRole('heading', { name: /Classes/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders add new class button', () => {
    render(<I18nWrapper><ClassesPage /></I18nWrapper>);

    const addButton = page.getByRole('button', { name: /Add New Class/i });

    expect(addButton).toBeInTheDocument();
  });

  it('displays class cards', () => {
    render(<I18nWrapper><ClassesPage /></I18nWrapper>);

    const fundamentalsClass = page.getByRole('heading', { name: 'BJJ Fundamentals I' }).first();

    expect(fundamentalsClass).toBeInTheDocument();
  });

  it('displays class details', () => {
    render(<I18nWrapper><ClassesPage /></I18nWrapper>);

    const schedule = page.getByText(/M\/W\/F • 6-7 PM/);
    const location = page.getByText(/Downtown HQ/).first();

    expect(schedule).toBeInTheDocument();
    expect(location).toBeInTheDocument();
  });

  it('displays class level badges', () => {
    render(<I18nWrapper><ClassesPage /></I18nWrapper>);

    const beginnerBadge = page.getByText(/Beginner/).first();

    expect(beginnerBadge).toBeInTheDocument();
  });

  it('displays instructor names', () => {
    render(<I18nWrapper><ClassesPage /></I18nWrapper>);

    const instructorName = page.getByText(/Coach Alex/).first();

    expect(instructorName).toBeInTheDocument();
  });
});
