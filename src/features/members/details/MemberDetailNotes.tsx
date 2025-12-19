'use client';

import { ArrowDown01, ArrowDownAZ, ArrowUp10, ArrowUpZA, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input/input';
import { Textarea } from '@/components/ui/textarea';

export type MemberNote = {
  id: string;
  date: string;
  author: string;
  content: string;
};

type MemberDetailNotesProps = {
  memberId: string;
  memberName: string;
  notes: MemberNote[];
  onAddNote?: (content: string) => void;
};

// Maximum character limit for notes to prevent abuse
const MAX_NOTE_LENGTH = 2000;

type SortField = 'date' | 'author' | 'content';
type SortDirection = 'asc' | 'desc';

export function MemberDetailNotes({
  notes,
  onAddNote,
}: MemberDetailNotesProps) {
  const t = useTranslations('MemberDetailNotes');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!newNoteContent.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      onAddNote?.(newNoteContent.trim());
      setNewNoteContent('');
    } finally {
      setIsSubmitting(false);
    }
  }, [newNoteContent, isSubmitting, onAddNote]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Default to descending for date (newest first), ascending for text fields
      setSortDirection(field === 'date' ? 'desc' : 'asc');
    }
  }, [sortField]);

  const filteredAndSortedNotes = useMemo(() => {
    // Filter notes by search query
    const query = searchQuery.toLowerCase().trim();
    const filtered = query
      ? notes.filter(
          note =>
            note.content.toLowerCase().includes(query)
            || note.author.toLowerCase().includes(query)
            || note.date.toLowerCase().includes(query),
        )
      : notes;

    // Sort filtered notes
    return [...filtered].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortField) {
        case 'date': {
          // Parse dates for comparison - assumes format like "Dec 15, 2025 at 2:30 PM"
          aValue = a.date;
          bValue = b.date;
          // Try to parse as dates for proper sorting
          const aDate = new Date(a.date.replace(' at ', ' '));
          const bDate = new Date(b.date.replace(' at ', ' '));
          if (!Number.isNaN(aDate.getTime()) && !Number.isNaN(bDate.getTime())) {
            const comparison = aDate.getTime() - bDate.getTime();
            return sortDirection === 'asc' ? comparison : -comparison;
          }
          break;
        }
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'content':
          aValue = a.content.toLowerCase();
          bValue = b.content.toLowerCase();
          break;
        default:
          aValue = '';
          bValue = '';
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [notes, sortField, sortDirection, searchQuery]);

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }

    // Date field uses numeric icons, text fields use alphabetic icons
    if (field === 'date') {
      return sortDirection === 'asc'
        ? <ArrowDown01 className="h-4 w-4" />
        : <ArrowUp10 className="h-4 w-4" />;
    }

    return sortDirection === 'asc'
      ? <ArrowDownAZ className="h-4 w-4" />
      : <ArrowUpZA className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Add Note Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">{t('add_note_title')}</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder={t('note_placeholder')}
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              className="min-h-[120px] resize-none"
              aria-label={t('note_placeholder')}
              maxLength={MAX_NOTE_LENGTH}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              {newNoteContent.length}
              /
              {MAX_NOTE_LENGTH}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!newNoteContent.trim() || isSubmitting}
            >
              {isSubmitting ? t('saving_button') : t('save_note_button')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Notes History Section */}
      <div className="rounded-lg border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{t('notes_history_title')}</h2>
        </div>
        {notes.length > 0 && (
          <div className="border-b border-border px-6 py-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label={t('search_placeholder')}
              />
            </div>
          </div>
        )}
        {notes.length === 0
          ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">{t('no_notes')}</p>
              </div>
            )
          : filteredAndSortedNotes.length === 0
            ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">{t('no_matching_notes')}</p>
                </div>
              )
            : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            <button
                              type="button"
                              onClick={() => handleSort('date')}
                              className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                            >
                              {t('table_date')}
                              {renderSortIcon('date')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            <button
                              type="button"
                              onClick={() => handleSort('author')}
                              className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                            >
                              {t('table_author')}
                              {renderSortIcon('author')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            <button
                              type="button"
                              onClick={() => handleSort('content')}
                              className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                            >
                              {t('table_note')}
                              {renderSortIcon('content')}
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedNotes.map(note => (
                          <tr key={note.id} className="border-b border-border hover:bg-secondary/30">
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(note.date)}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                              {note.author}
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground">
                              {note.content}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="space-y-4 p-4 lg:hidden">
                    {filteredAndSortedNotes.map(note => (
                      <Card key={note.id} className="p-4">
                        <div className="space-y-3">
                          {/* Header with Date and Author */}
                          <div className="flex items-start justify-between border-b border-border pb-3">
                            <div>
                              <div className="text-xs font-semibold text-muted-foreground">
                                {t('table_date')}
                              </div>
                              <div className="mt-1 text-sm font-medium text-foreground">
                                {formatDate(note.date)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-semibold text-muted-foreground">
                                {t('table_author')}
                              </div>
                              <div className="mt-1 text-sm font-medium text-foreground">
                                {note.author}
                              </div>
                            </div>
                          </div>

                          {/* Note Content */}
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground">
                              {t('table_note')}
                            </div>
                            <div className="mt-1 text-sm text-foreground">
                              {note.content}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
      </div>
    </div>
  );
}
