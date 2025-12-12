'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/utils/Helpers';

// Main Panel container
function Panel({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn('overflow-hidden', className)}
      {...props}
    />
  );
}

// Panel Header with title and optional actions
function PanelHeader({
  className,
  title,
  actions,
  children,
  withDivider = false,
  ...props
}: React.ComponentProps<'div'> & {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  withDivider?: boolean;
}) {
  return (
    <>
      <div
        className={cn('px-6', className)}
        {...props}
      >
        {children || (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {title && (
              <h2 className="text-xl font-medium text-foreground">{title}</h2>
            )}
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
        )}
      </div>
      {withDivider && <div className="border-b border-border"></div>}
    </>
  );
}

// Panel Tabs for navigation (no padding when used inside PanelHeader)
function PanelTabs({
  className,
  children,
  standalone = false,
  ...props
}: React.ComponentProps<'div'> & {
  standalone?: boolean;
}) {
  return (
    <div
      className={cn(standalone && 'px-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Panel Content area (full width, no padding by default)
function PanelContent({
  className,
  padded = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  padded?: boolean;
}) {
  return (
    <div
      className={cn(padded && 'px-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Panel Footer with separator line and padding
function PanelFooter({
  className,
  withSeparator = true,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  withSeparator?: boolean;
}) {
  return (
    <>
      {withSeparator && <div className="border-t border-border"></div>}
      <div
        className={cn('px-6', className)}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export {
  Panel,
  PanelContent,
  PanelFooter,
  PanelHeader,
  PanelTabs,
};
