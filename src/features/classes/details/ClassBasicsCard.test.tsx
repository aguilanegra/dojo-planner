import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { ClassBasicsCard } from './ClassBasicsCard';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Class Basics',
  name_label: 'Name',
  program_label: 'Program',
  level_label: 'Level',
  type_label: 'Type',
  style_label: 'Style',
  description_label: 'Description',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('ClassBasicsCard', () => {
  const mockOnEdit = vi.fn();

  const defaultProps = {
    className: 'BJJ Fundamentals I',
    program: 'adult-bjj',
    description: 'Covers core positions, escapes, and submissions.',
    level: 'Beginner' as const,
    type: 'Adults' as const,
    style: 'Gi' as const,
    onEdit: mockOnEdit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the card with title', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const heading = page.getByText('Class Basics');

    expect(heading).toBeTruthy();
  });

  it('should render the class name', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const name = page.getByText('BJJ Fundamentals I');

    expect(name).toBeTruthy();
  });

  it('should render the program label', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const programLabel = page.getByText('Adult Brazilian Jiu-Jitsu');

    expect(programLabel).toBeTruthy();
  });

  it('should render the description', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const description = page.getByText('Covers core positions, escapes, and submissions.');

    expect(description).toBeTruthy();
  });

  it('should render level badge', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const levelBadge = page.getByText('Beginner');

    expect(levelBadge).toBeTruthy();
  });

  it('should render type badge', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const typeBadge = page.getByText('Adults');

    expect(typeBadge).toBeTruthy();
  });

  it('should render style badge', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const styleBadge = page.getByText('Gi');

    expect(styleBadge).toBeTruthy();
  });

  it('should render Edit button', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const editButton = page.getByRole('button');

    expect(editButton).toBeTruthy();
  });

  it('should call onEdit when Edit button is clicked', async () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const editButton = page.getByRole('button');
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should render all field labels', () => {
    render(<ClassBasicsCard {...defaultProps} />);

    const nameLabel = page.getByText('Name');
    const programLabel = page.getByText('Program');
    const levelLabel = page.getByText('Level');
    const typeLabel = page.getByText('Type');
    const styleLabel = page.getByText('Style');
    const descriptionLabel = page.getByText('Description');

    expect(nameLabel).toBeTruthy();
    expect(programLabel).toBeTruthy();
    expect(levelLabel).toBeTruthy();
    expect(typeLabel).toBeTruthy();
    expect(styleLabel).toBeTruthy();
    expect(descriptionLabel).toBeTruthy();
  });

  it('should render different level badges correctly', () => {
    render(<ClassBasicsCard {...defaultProps} level="Advanced" />);

    const advancedBadge = page.getByText('Advanced');

    expect(advancedBadge).toBeTruthy();
  });

  it('should render different style badges correctly', () => {
    render(<ClassBasicsCard {...defaultProps} style="No Gi" />);

    const noGiBadge = page.getByText('No Gi');

    expect(noGiBadge).toBeTruthy();
  });
});
