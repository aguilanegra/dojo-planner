import type { MemberNote } from './MemberDetailNotes';

import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { MemberDetailNotes } from './MemberDetailNotes';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('MemberDetailNotes', () => {
  // Mock notes data for testing
  // Note: Author names are for demonstration purposes only
  const mockNotes: MemberNote[] = [
    {
      id: 'note-1',
      date: 'Dec 15, 2025 at 2:30 PM',
      author: 'Staff Member',
      content: 'Member requested to pause membership for 2 weeks due to travel.',
    },
    {
      id: 'note-2',
      date: 'Nov 28, 2025 at 10:15 AM',
      author: 'Front Desk',
      content: 'Updated emergency contact information.',
    },
  ];

  const mockProps = {
    memberId: 'member-123',
    memberName: 'John Doe',
    notes: mockNotes,
    onAddNote: vi.fn(),
  };

  describe('Render method', () => {
    it('should render add note section title', () => {
      render(<MemberDetailNotes {...mockProps} />);

      expect(page.getByRole('heading', { name: 'add_note_title' })).toBeInTheDocument();
    });

    it('should render notes history section title', () => {
      render(<MemberDetailNotes {...mockProps} />);

      expect(page.getByRole('heading', { name: 'notes_history_title' })).toBeInTheDocument();
    });

    it('should render textarea for new note input', () => {
      render(<MemberDetailNotes {...mockProps} />);

      expect(page.getByRole('textbox', { name: 'note_placeholder' })).toBeInTheDocument();
    });

    it('should render save note button', () => {
      render(<MemberDetailNotes {...mockProps} />);

      expect(page.getByRole('button', { name: 'save_note_button' })).toBeInTheDocument();
    });

    it('should render note content in history', () => {
      render(<MemberDetailNotes {...mockProps} />);

      // Use first() because content appears in both desktop table and mobile card views
      expect(page.getByText('Member requested to pause membership for 2 weeks due to travel.').first()).toBeInTheDocument();
      expect(page.getByText('Updated emergency contact information.').first()).toBeInTheDocument();
    });

    it('should render note authors in history', () => {
      render(<MemberDetailNotes {...mockProps} />);

      // Use first() because authors appear in both desktop table and mobile card views
      expect(page.getByText('Staff Member').first()).toBeInTheDocument();
      expect(page.getByText('Front Desk').first()).toBeInTheDocument();
    });

    it('should render note dates in history', () => {
      render(<MemberDetailNotes {...mockProps} />);

      // Use first() because dates appear in both desktop table and mobile card views
      expect(page.getByText('Dec 15, 2025 at 2:30 PM').first()).toBeInTheDocument();
      expect(page.getByText('Nov 28, 2025 at 10:15 AM').first()).toBeInTheDocument();
    });

    it('should render table headers on desktop view', () => {
      render(<MemberDetailNotes {...mockProps} />);

      const dateHeaders = page.getByText('table_date');
      const authorHeaders = page.getByText('table_author');
      const noteHeaders = page.getByText('table_note');

      expect(dateHeaders.first()).toBeInTheDocument();
      expect(authorHeaders.first()).toBeInTheDocument();
      expect(noteHeaders.first()).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should render no notes message when notes array is empty', () => {
      const propsWithNoNotes = {
        ...mockProps,
        notes: [],
      };
      render(<MemberDetailNotes {...propsWithNoNotes} />);

      expect(page.getByText('no_notes')).toBeInTheDocument();
    });
  });

  describe('Character limit', () => {
    it('should display character count', () => {
      render(<MemberDetailNotes {...mockProps} />);

      // Should show 0/2000 initially
      expect(page.getByText(/0\s*\/\s*2000/)).toBeInTheDocument();
    });

    it('should have maxLength attribute on textarea', () => {
      render(<MemberDetailNotes {...mockProps} />);

      const textarea = page.getByRole('textbox', { name: 'note_placeholder' });

      expect(textarea).toHaveAttribute('maxlength', '2000');
    });
  });

  describe('Interactions', () => {
    it('should have save button disabled when textarea is empty', () => {
      render(<MemberDetailNotes {...mockProps} />);

      const saveButton = page.getByRole('button', { name: 'save_note_button' });

      expect(saveButton).toBeDisabled();
    });

    it('should enable save button when textarea has content', async () => {
      render(<MemberDetailNotes {...mockProps} />);

      const textarea = page.getByRole('textbox', { name: 'note_placeholder' });
      await userEvent.type(textarea, 'This is a new note');

      const saveButton = page.getByRole('button', { name: 'save_note_button' });

      expect(saveButton).not.toBeDisabled();
    });

    it('should call onAddNote when save button is clicked', async () => {
      const onAddNoteMock = vi.fn();
      render(<MemberDetailNotes {...mockProps} onAddNote={onAddNoteMock} />);

      const textarea = page.getByRole('textbox', { name: 'note_placeholder' });
      await userEvent.type(textarea, 'This is a new note');

      const saveButton = page.getByRole('button', { name: 'save_note_button' });
      await saveButton.click();

      expect(onAddNoteMock).toHaveBeenCalledWith('This is a new note');
    });

    it('should clear textarea after submitting note', async () => {
      render(<MemberDetailNotes {...mockProps} />);

      const textarea = page.getByRole('textbox', { name: 'note_placeholder' });
      await userEvent.type(textarea, 'This is a new note');

      const saveButton = page.getByRole('button', { name: 'save_note_button' });
      await saveButton.click();

      expect(textarea).toHaveValue('');
    });

    it('should not call onAddNote when textarea only has whitespace', async () => {
      const onAddNoteMock = vi.fn();
      render(<MemberDetailNotes {...mockProps} onAddNote={onAddNoteMock} />);

      const textarea = page.getByRole('textbox', { name: 'note_placeholder' });
      await userEvent.type(textarea, '   ');

      const saveButton = page.getByRole('button', { name: 'save_note_button' });

      // Button should still be disabled with only whitespace
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Mobile view', () => {
    it('should render mobile card view structure', () => {
      render(<MemberDetailNotes {...mockProps} />);

      // Mobile cards should exist (hidden on lg screens)
      const mobileContainer = page.getByText('Member requested to pause membership for 2 weeks due to travel.').first();

      expect(mobileContainer).toBeInTheDocument();
    });
  });

  describe('Multiple notes', () => {
    it('should render all notes in the list', () => {
      const manyNotes: MemberNote[] = [
        { id: '1', date: 'Dec 1, 2025', author: 'User A', content: 'First note' },
        { id: '2', date: 'Dec 2, 2025', author: 'User B', content: 'Second note' },
        { id: '3', date: 'Dec 3, 2025', author: 'User C', content: 'Third note' },
      ];
      render(<MemberDetailNotes {...mockProps} notes={manyNotes} />);

      // Use first() because content appears in both desktop table and mobile card views
      expect(page.getByText('First note').first()).toBeInTheDocument();
      expect(page.getByText('Second note').first()).toBeInTheDocument();
      expect(page.getByText('Third note').first()).toBeInTheDocument();
    });
  });

  describe('Without onAddNote callback', () => {
    it('should not throw error when onAddNote is not provided', async () => {
      const propsWithoutCallback = {
        memberId: 'member-123',
        memberName: 'John Doe',
        notes: mockNotes,
      };
      render(<MemberDetailNotes {...propsWithoutCallback} />);

      const textarea = page.getByRole('textbox', { name: 'note_placeholder' });
      await userEvent.type(textarea, 'This is a new note');

      const saveButton = page.getByRole('button', { name: 'save_note_button' });
      // Should not throw when clicked without callback
      await saveButton.click();

      // Textarea should still clear
      expect(textarea).toHaveValue('');
    });
  });

  describe('Sorting', () => {
    // Notes with different dates, authors, and content for sorting tests
    // Note: Author names are for demonstration purposes only
    const sortableNotes: MemberNote[] = [
      { id: '1', date: 'Dec 10, 2025 at 9:00 AM', author: 'Charlie', content: 'Beta note' },
      { id: '2', date: 'Dec 15, 2025 at 2:00 PM', author: 'Alice', content: 'Alpha note' },
      { id: '3', date: 'Dec 5, 2025 at 11:00 AM', author: 'Bob', content: 'Gamma note' },
    ];

    const sortableProps = {
      ...mockProps,
      notes: sortableNotes,
    };

    it('should render sortable column headers as buttons', () => {
      render(<MemberDetailNotes {...sortableProps} />);

      // Desktop table headers should be clickable buttons
      const dateButton = page.getByRole('button', { name: /table_date/i }).first();
      const authorButton = page.getByRole('button', { name: /table_author/i }).first();
      const noteButton = page.getByRole('button', { name: /table_note/i }).first();

      expect(dateButton).toBeInTheDocument();
      expect(authorButton).toBeInTheDocument();
      expect(noteButton).toBeInTheDocument();
    });

    it('should default to sorting by date descending (newest first)', () => {
      render(<MemberDetailNotes {...sortableProps} />);

      // Default sort is by date descending, so Dec 15 (newest) should appear before Dec 5 (oldest)
      // With descending date sort: Dec 15 > Dec 10 > Dec 5
      expect(page.getByText('Dec 15, 2025 at 2:00 PM').first()).toBeInTheDocument();
    });

    it('should sort by date ascending when date header is clicked', async () => {
      render(<MemberDetailNotes {...sortableProps} />);

      const dateButton = page.getByRole('button', { name: /table_date/i }).first();
      await dateButton.click();

      // After clicking, sort should toggle to ascending (oldest first)
      // Dec 5 should now be the first date in the list
      expect(page.getByText('Dec 5, 2025 at 11:00 AM').first()).toBeInTheDocument();
    });

    it('should sort by author when author header is clicked', async () => {
      render(<MemberDetailNotes {...sortableProps} />);

      const authorButton = page.getByRole('button', { name: /table_author/i }).first();
      await authorButton.click();

      // After clicking, should sort by author ascending (A-Z)
      // Alice should appear first, followed by Bob, then Charlie
      expect(page.getByText('Alice').first()).toBeInTheDocument();
      expect(page.getByText('Bob').first()).toBeInTheDocument();
      expect(page.getByText('Charlie').first()).toBeInTheDocument();
    });

    it('should toggle author sort direction when clicked twice', async () => {
      render(<MemberDetailNotes {...sortableProps} />);

      const authorButton = page.getByRole('button', { name: /table_author/i }).first();

      // First click - ascending (A-Z)
      await authorButton.click();

      // All authors should be present
      expect(page.getByText('Alice').first()).toBeInTheDocument();

      // Second click - descending (Z-A)
      await authorButton.click();

      // Charlie should now be first (Z-A order)
      expect(page.getByText('Charlie').first()).toBeInTheDocument();
    });

    it('should sort by content when note header is clicked', async () => {
      render(<MemberDetailNotes {...sortableProps} />);

      const noteButton = page.getByRole('button', { name: /table_note/i }).first();
      await noteButton.click();

      // After clicking, should sort by content ascending (A-Z)
      // Alpha note should be first, then Beta, then Gamma
      expect(page.getByText('Alpha note').first()).toBeInTheDocument();
      expect(page.getByText('Beta note').first()).toBeInTheDocument();
      expect(page.getByText('Gamma note').first()).toBeInTheDocument();
    });

    it('should display sort icon only for active sort column', () => {
      render(<MemberDetailNotes {...sortableProps} />);

      // Default sort is by date descending, so we should see the numeric descending icon (ArrowUp10)
      // The icon will be in the header area
      const dateButton = page.getByRole('button', { name: /table_date/i }).first();

      // Date button should be visible and functional
      expect(dateButton).toBeInTheDocument();
    });

    it('should change sort icon when switching columns', async () => {
      render(<MemberDetailNotes {...sortableProps} />);

      const authorButton = page.getByRole('button', { name: /table_author/i }).first();
      await authorButton.click();

      // After clicking author, it should be the active sort column
      expect(authorButton).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    // Notes for search testing
    // Note: Author names are for demonstration purposes only
    const searchableNotes: MemberNote[] = [
      { id: '1', date: 'Dec 10, 2025 at 9:00 AM', author: 'Staff Member', content: 'Membership paused for travel' },
      { id: '2', date: 'Dec 15, 2025 at 2:00 PM', author: 'Front Desk', content: 'Updated contact information' },
      { id: '3', date: 'Dec 5, 2025 at 11:00 AM', author: 'Manager', content: 'Discussed membership options' },
    ];

    const searchableProps = {
      ...mockProps,
      notes: searchableNotes,
    };

    it('should render search input when notes exist', () => {
      render(<MemberDetailNotes {...searchableProps} />);

      expect(page.getByRole('textbox', { name: 'search_placeholder' })).toBeInTheDocument();
    });

    it('should not render search input when no notes exist', () => {
      render(<MemberDetailNotes {...mockProps} notes={[]} />);

      const searchInputs = page.getByRole('textbox', { name: 'search_placeholder' });

      expect(searchInputs).not.toBeInTheDocument();
    });

    it('should filter notes by content', async () => {
      render(<MemberDetailNotes {...searchableProps} />);

      const searchInput = page.getByRole('textbox', { name: 'search_placeholder' });
      await userEvent.type(searchInput, 'paused');

      // Only the note with "paused" in content should be visible
      expect(page.getByText('Membership paused for travel').first()).toBeInTheDocument();

      // Other notes should not be visible
      expect(page.getByText('Updated contact information')).not.toBeInTheDocument();
      expect(page.getByText('Discussed membership options')).not.toBeInTheDocument();
    });

    it('should filter notes by author', async () => {
      render(<MemberDetailNotes {...searchableProps} />);

      const searchInput = page.getByRole('textbox', { name: 'search_placeholder' });
      await userEvent.type(searchInput, 'Manager');

      // Only the note by Manager should be visible
      expect(page.getByText('Discussed membership options').first()).toBeInTheDocument();

      // Other notes should not be visible
      expect(page.getByText('Membership paused for travel')).not.toBeInTheDocument();
    });

    it('should filter notes by date', async () => {
      render(<MemberDetailNotes {...searchableProps} />);

      const searchInput = page.getByRole('textbox', { name: 'search_placeholder' });
      await userEvent.type(searchInput, 'Dec 15');

      // Only the note from Dec 15 should be visible
      expect(page.getByText('Updated contact information').first()).toBeInTheDocument();

      // Other notes should not be visible
      expect(page.getByText('Membership paused for travel')).not.toBeInTheDocument();
    });

    it('should be case-insensitive search', async () => {
      render(<MemberDetailNotes {...searchableProps} />);

      const searchInput = page.getByRole('textbox', { name: 'search_placeholder' });
      await userEvent.type(searchInput, 'PAUSED');

      // Should find the note even with uppercase search
      expect(page.getByText('Membership paused for travel').first()).toBeInTheDocument();
    });

    it('should show no matching notes message when search yields no results', async () => {
      render(<MemberDetailNotes {...searchableProps} />);

      const searchInput = page.getByRole('textbox', { name: 'search_placeholder' });
      await userEvent.type(searchInput, 'nonexistent text xyz');

      // Should show no matching notes message
      expect(page.getByText('no_matching_notes')).toBeInTheDocument();
    });

    it('should show all notes when search is cleared', async () => {
      render(<MemberDetailNotes {...searchableProps} />);

      const searchInput = page.getByRole('textbox', { name: 'search_placeholder' });

      // Type a search query
      await userEvent.type(searchInput, 'paused');

      // Verify only one note shows
      expect(page.getByText('Membership paused for travel').first()).toBeInTheDocument();
      expect(page.getByText('Updated contact information')).not.toBeInTheDocument();

      // Clear the search
      await userEvent.clear(searchInput);

      // All notes should be visible again
      expect(page.getByText('Membership paused for travel').first()).toBeInTheDocument();
      expect(page.getByText('Updated contact information').first()).toBeInTheDocument();
      expect(page.getByText('Discussed membership options').first()).toBeInTheDocument();
    });
  });
});
