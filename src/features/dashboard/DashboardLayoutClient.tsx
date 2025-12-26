'use client';

import { useEffect } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { client } from '@/libs/Orpc';
import { AppSidebar } from './AppSidebar';
import { AppSidebarHeader } from './AppSidebarHeader';
import { HelpButton } from './HelpButton';

type DashboardLayoutClientProps = {
  children: React.ReactNode;
  defaultOpen: boolean;
};

export function DashboardLayoutClient({ children, defaultOpen }: DashboardLayoutClientProps) {
  useEffect(() => {
    // Update the lastAccessedAt timestamp when the user accesses the dashboard
    const updateLastAccessed = async () => {
      try {
        await client.member.updateLastAccessed();
      } catch (error) {
        // Silently fail - don't disrupt user experience if timestamp update fails
        console.error('Failed to update lastAccessedAt:', error);
      }
    };

    updateLastAccessed();
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppSidebarHeader />

        <div className="@container flex-1 px-6 py-4">
          {children}
        </div>
      </SidebarInset>
      <HelpButton />
    </SidebarProvider>
  );
}
