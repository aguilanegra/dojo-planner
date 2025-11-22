import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { SchedulePage } from '@/features/schedule/SchedulePage';
import { I18nWrapper } from '@/lib/test-utils';

describe('Schedule Page', () => {
  it('renders schedule header', () => {
    render(<I18nWrapper><SchedulePage /></I18nWrapper>);

    const heading = page.getByRole('heading', { name: /Schedule/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders import calendar button', () => {
    render(<I18nWrapper><SchedulePage /></I18nWrapper>);

    const importButton = page.getByRole('button', { name: /Import Calendar/i });

    expect(importButton).toBeInTheDocument();
  });

  it('renders add event button', () => {
    render(<I18nWrapper><SchedulePage /></I18nWrapper>);

    const addButton = page.getByRole('button', { name: /Add Event/i });

    expect(addButton).toBeInTheDocument();
  });

  it('renders calendar tabs', () => {
    render(<I18nWrapper><SchedulePage /></I18nWrapper>);

    const monthTab = page.getByRole('tab', { name: /Month/i });
    const weekTab = page.getByRole('tab', { name: /Week/i });
    const dayTab = page.getByRole('tab', { name: /Day/i });

    expect(monthTab).toBeInTheDocument();
    expect(weekTab).toBeInTheDocument();
    expect(dayTab).toBeInTheDocument();
  });

  it('renders calendar with month name', () => {
    render(<I18nWrapper><SchedulePage /></I18nWrapper>);

    const monthHeader = page.getByText(/April/);

    expect(monthHeader).toBeInTheDocument();
  });

  it('displays days of week', () => {
    render(<I18nWrapper><SchedulePage /></I18nWrapper>);

    const sunday = page.getByText(/Sun/);

    expect(sunday).toBeInTheDocument();
  });

  it('displays calendar days', () => {
    render(<I18nWrapper><SchedulePage /></I18nWrapper>);

    const day1 = page.getByText('1').first();

    expect(day1).toBeInTheDocument();
  });

  it('displays events for days', () => {
    render(<I18nWrapper><SchedulePage /></I18nWrapper>);

    const event = page.getByText(/BJJ Open/);

    expect(event).toBeInTheDocument();
  });
});
