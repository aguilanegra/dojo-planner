'use client';

import { useClerk } from '@clerk/nextjs';
import { BookMarked, Briefcase, Building, CircleUser, Home, LogOut, Mail, Map, Megaphone, Settings, Users, Users2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/features/dashboard/AppSidebarNav';
import { OrganizationSelector } from '@/features/dashboard/OrganizationSelector';
import { Logo } from '@/templates/Logo';

export const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  const t = useTranslations('DashboardLayout');
  const { signOut } = useClerk();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="pt-5">
        <div className="flex justify-center pb-3">
          <Logo />
        </div>

        <OrganizationSelector />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarNav
          label={t('academy_section_label')}
          items={[
            {
              title: t('dashboard'),
              url: '/dashboard',
              icon: Home,
            },
            {
              title: t('programs'),
              url: '/dashboard/programs',
              icon: Map,
            },
            {
              title: t('classes'),
              url: '/dashboard/classes',
              icon: BookMarked,
            },
            {
              title: t('members'),
              url: '/dashboard/members',
              icon: Users,
            },
            {
              title: t('roles'),
              url: '/dashboard/roles',
              icon: CircleUser,
            },
            {
              title: t('staff'),
              url: '/dashboard/staff',
              icon: Users2,
            },
            {
              title: t('messaging'),
              url: '/dashboard/messaging',
              icon: Mail,
              badge: <Badge variant="default">40</Badge>,
              disabled: true,
              hidden: true,
            },
          ]}
        />
        <AppSidebarNav
          label={t('business_section_label')}
          items={[
            {
              title: t('finances'),
              url: '/dashboard/finances',
              icon: Briefcase,
            },
            {
              title: t('memberships'),
              url: '/dashboard/memberships',
              icon: Users2,
            },
            {
              title: t('marketing'),
              url: '/dashboard/marketing',
              icon: Megaphone,
            },
          ]}
        />
        <AppSidebarNav
          label={t('settings_section_label')}
          items={[
            {
              title: t('location'),
              url: '/dashboard/location-settings',
              icon: Building,
            },
            {
              title: t('preferences'),
              url: '/dashboard/preferences',
              icon: Settings,
              disabled: true,
            },
          ]}
        />
        <AppSidebarNav
          label=""
          items={[
            {
              title: t('log_out'),
              url: '/dashboard/logout',
              icon: LogOut,
              onClick: () => signOut({ redirectUrl: '/' }),
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
