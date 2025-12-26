import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { ClassInstructorsCard } from './ClassInstructorsCard';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Instructors',
  no_instructors: 'No instructors assigned',
  role_primary: 'Primary',
  role_assistant: 'Assistant',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('ClassInstructorsCard', () => {
  const mockOnEdit = vi.fn();

  const defaultProps = {
    instructors: [
      { id: '1', name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'primary' as const },
      { id: '2', name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', role: 'assistant' as const },
    ],
    onEdit: mockOnEdit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the card with title', () => {
    render(<ClassInstructorsCard {...defaultProps} />);

    const heading = page.getByText('Instructors');

    expect(heading).toBeTruthy();
  });

  it('should render instructor names', () => {
    render(<ClassInstructorsCard {...defaultProps} />);

    const coachAlex = page.getByText('Coach Alex');
    const professorJessica = page.getByText('Professor Jessica');

    expect(coachAlex).toBeTruthy();
    expect(professorJessica).toBeTruthy();
  });

  it('should render role badges', () => {
    render(<ClassInstructorsCard {...defaultProps} />);

    const primaryBadge = page.getByText('Primary');
    const assistantBadge = page.getByText('Assistant');

    expect(primaryBadge).toBeTruthy();
    expect(assistantBadge).toBeTruthy();
  });

  it('should render Edit button', () => {
    render(<ClassInstructorsCard {...defaultProps} />);

    const editButton = page.getByRole('button');

    expect(editButton).toBeTruthy();
  });

  it('should call onEdit when Edit button is clicked', async () => {
    render(<ClassInstructorsCard {...defaultProps} />);

    const editButton = page.getByRole('button');
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should show no instructors message when list is empty', () => {
    render(<ClassInstructorsCard {...defaultProps} instructors={[]} />);

    const noInstructors = page.getByText('No instructors assigned');

    expect(noInstructors).toBeTruthy();
  });

  it('should render avatars for instructors', () => {
    render(<ClassInstructorsCard {...defaultProps} />);

    // Check for avatar fallbacks (initials)
    const coachInitials = page.getByText('CA');
    const professorInitials = page.getByText('PJ');

    expect(coachInitials).toBeTruthy();
    expect(professorInitials).toBeTruthy();
  });
});
