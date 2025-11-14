'use client';

import { Search as SearchIcon, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/Helpers';

type SearchProps = React.ComponentProps<'input'> & {
  showCmdK?: boolean;
  onClear?: () => void;
};

const Search = (
  { ref, className, showCmdK = true, onClear, value: controlledValue, defaultValue, ...props }: SearchProps & { ref?: React.RefObject<HTMLInputElement | null> },
) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? '',
  );
  const isControlled = controlledValue !== undefined;
  const displayValue = isControlled ? controlledValue : uncontrolledValue;
  const hasValue = String(displayValue).length > 0;

  const handleClear = () => {
    if (isControlled) {
      props.onChange?.({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setUncontrolledValue('');
    }

    if (ref) {
      if (typeof ref === 'function') {
        ref(null);
      } else {
        ref.current?.focus();
      }
    }

    onClear?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledValue(e.currentTarget.value);
    }

    props.onChange?.(e);
  };

  return (
    <div className={cn('relative w-full', className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        type="search"
        value={displayValue}
        onChange={handleChange}
        data-slot="search"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:text-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pl-10 pr-24 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
        {...props}
      />
      {showCmdK
        ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center gap-1 rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 dark:bg-neutral-1200 dark:text-neutral-900 dark:hover:bg-neutral-1200/80"
              aria-label="Search keyboard shortcut"
            >
              <kbd className="font-sans">⌘</kbd>
              <span>K</span>
            </button>
          )
        : (hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center rounded bg-transparent px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ))}
    </div>
  );
};

Search.displayName = 'Search';

export { Search };
export type { SearchProps };
