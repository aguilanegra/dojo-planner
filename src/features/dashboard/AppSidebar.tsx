'use client';

import { OrganizationSwitcher, useClerk } from '@clerk/nextjs';
import { BookMarked, Briefcase, CalendarDays, CircleUser, CreditCard, HelpCircle, Home, LogOut, Mail, Map, Megaphone, Settings, ShieldCheck, Users, Users2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/features/dashboard/AppSidebarNav';
import { Logo } from '@/templates/Logo';
import { getI18nPath } from '@/utils/Helpers';

export const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  const locale = useLocale();
  const t = useTranslations('DashboardLayout');
  const { signOut } = useClerk();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="pt-5">
        <div className="flex justify-center pb-3">
          <Logo />
        </div>

        <OrganizationSwitcher
          organizationProfileMode="navigation"
          organizationProfileUrl={getI18nPath('/dashboard/organization-profile', locale)}
          afterCreateOrganizationUrl="/onboarding/organization-selection"
          hidePersonal
          skipInvitationScreen
          appearance={{
            elements: {
              organizationSwitcherTrigger: 'w-64 md:w-60 justify-between',
              organizationSwitcherPopoverRootBox: {
                // WORKAROUND: conflict with Shadcn Sidebar, solution from https://github.com/clerk/javascript/issues/3739
                pointerEvents: 'auto',
              },
            },
          }}
        />
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
              title: t('classes'),
              url: '/dashboard/classes',
              icon: BookMarked,
            },
            {
              title: t('schedule'),
              url: '/dashboard/schedule',
              icon: CalendarDays,
            },
            {
              title: t('members'),
              url: '/dashboard/members',
              icon: Users,
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
              title: t('subscription'),
              url: '/dashboard/subscription',
              icon: CreditCard,
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
              title: t('my_profile'),
              url: '/dashboard/my-profile',
              icon: CircleUser,
            },
            {
              title: t('account_settings'),
              url: '/dashboard/account-settings',
              icon: Settings,
            },
            {
              title: t('location_settings'),
              url: '/dashboard/location-settings',
              icon: Map,
              disabled: true,
            },
            {
              title: t('preferences'),
              url: '/dashboard/preferences',
              icon: Settings,
            },
            {
              title: t('user_permissions'),
              url: '/dashboard/user-permissions',
              icon: CircleUser,
            },
            {
              title: t('security'),
              url: '/dashboard/security',
              icon: ShieldCheck,
            },
            {
              title: t('help'),
              url: '/dashboard/help',
              icon: HelpCircle,
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
