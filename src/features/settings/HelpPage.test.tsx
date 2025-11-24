import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { HelpPage } from './HelpPage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Help',
      featured_articles_title: 'Featured articles',
      read_article_button: 'Read article',
      see_all_articles_button: 'See all articles',
    };
    return translations[key] || key;
  },
}));

describe('HelpPage', () => {
  it('should render the page title', () => {
    render(<HelpPage />);

    expect(page.getByText('Help')).toBeDefined();
  });

  it('should render support option cards', () => {
    render(<HelpPage />);

    expect(page.getByText('Help articles')).toBeDefined();
    expect(page.getByText('Chat with support')).toBeDefined();
    expect(page.getByText('Call us')).toBeDefined();
    expect(page.getByText('Send us an email')).toBeDefined();
  });

  it('should render featured articles section title', () => {
    render(<HelpPage />);

    expect(page.getByText('Featured articles')).toBeDefined();
  });

  it('should render featured article cards', () => {
    render(<HelpPage />);

    expect(page.getByText('Setting Up Your Dojo Planner Account')).toBeDefined();
    expect(page.getByText('Importing Your Student Roster')).toBeDefined();
    expect(page.getByText('Adding and Editing Student Profiles')).toBeDefined();
    expect(page.getByText('Creating and Managing Class Schedules')).toBeDefined();
  });

  it('should render read article button', () => {
    render(<HelpPage />);
    const readButton = page.getByRole('button', { name: /read article/i });

    expect(readButton).toBeDefined();
  });
});
