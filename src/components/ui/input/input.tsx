import { cn } from '@/utils/Helpers';

export type InputProps = React.ComponentProps<'input'> & {
  error?: boolean;
  variant?: 'default' | 'highlight';
};

function Input({ className, type, error, variant = 'default', ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      aria-invalid={error || props['aria-invalid']}
      className={cn(
        'file:text-foreground placeholder:text-neutral-800 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 md:text-sm',
        // Variant-specific styles
        variant === 'default' && 'border-neutral-600 bg-neutral-100 text-neutral-1500 dark:text-foreground disabled:bg-neutral-500 disabled:text-neutral-800 dark:disabled:text-muted-foreground',
        variant === 'highlight' && 'border-neutral-1500 bg-neutral-100 text-neutral-1500 dark:text-foreground disabled:bg-neutral-500 disabled:text-neutral-800 dark:disabled:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
