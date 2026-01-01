'use client';

export type PageHeaderProps = {
  /**
   * The main title of the page
   */
  title: string;

  /**
   * Optional actions that appear next to the title (e.g., "Manage Tags")
   */
  headerActions?: React.ReactNode;

  /**
   * Content that appears below the header, typically filter components
   */
  children?: React.ReactNode;

  /**
   * Optional CSS classes for the container
   */
  className?: string;
};

export function PageHeader({
  title,
  headerActions,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`w-full space-y-4 ${className}`.trim()}>
      {/* Header Row */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {headerActions}
      </div>

      {/* Content Area (typically filter components) */}
      {children}
    </div>
  );
}
