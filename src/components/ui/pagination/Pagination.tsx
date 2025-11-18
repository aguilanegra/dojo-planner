'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChangeAction: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChangeAction,
}: PaginationProps) {
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  // Generate page numbers to display (with ellipsis if needed)
  const getPageNumbers = () => {
    const pages: (number | { type: 'ellipsis'; id: string })[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      // Calculate range around current page
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages - 1, currentPage + halfVisible);

      // Adjust if near the beginning
      if (currentPage <= halfVisible) {
        end = Math.min(totalPages - 1, maxVisible - 1);
      }

      // Adjust if near the end
      if (currentPage >= totalPages - halfVisible - 1) {
        start = Math.max(1, totalPages - maxVisible);
      }

      // Add ellipsis if needed
      if (start > 1) {
        pages.push({ type: 'ellipsis', id: 'start' });
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 2) {
        pages.push({ type: 'ellipsis', id: 'end' });
      }

      // Always show last page if not already included
      if (totalPages > 1 && end < totalPages - 1) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const shouldShowControls = totalPages > 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Showing
        {' '}
        {startItem}
        {' '}
        to
        {' '}
        {endItem}
        {' '}
        of
        {' '}
        {totalItems}
        {' '}
        entries
      </div>

      {shouldShowControls && (
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChangeAction(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {pageNumbers.map((page) => {
              if (typeof page === 'object') {
                return (
                  <span
                    key={`ellipsis-${page.id}`}
                    className="flex items-center justify-center px-2 py-2 text-sm text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <Button
                  key={`page-${pageNum}`}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChangeAction(pageNum)}
                  className="min-w-10"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChangeAction(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
