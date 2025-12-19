import { cn } from '@/utils/Helpers';

export type TextareaProps = React.ComponentProps<'textarea'> & {
  error?: boolean;
};

function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={error || props['aria-invalid']}
      className={cn(
        'placeholder:text-neutral-800 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex min-h-[80px] w-full min-w-0 rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 md:text-sm',
        'border-neutral-600 bg-neutral-100 text-neutral-1500 dark:text-foreground disabled:bg-neutral-500 disabled:text-neutral-800 dark:disabled:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
