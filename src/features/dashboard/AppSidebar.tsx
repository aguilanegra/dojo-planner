'use client';

import { OrganizationSwitcher } from '@clerk/nextjs';
import { BookMarked, CalendarDays, CheckCircle2, CircleUser, Contact, Home, Landmark, LifeBuoy, Mail, Send, Settings, ShieldCheck, Users, Wallet } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/features/dashboard/AppSidebarNav';
import { Logo } from '@/templates/Logo';
import { getI18nPath } from '@/utils/Helpers';

export const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  const locale = useLocale();
  const t = useTranslations('DashboardLayout');

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
          label={t('main_section_label')}
          items={[
            {
              title: t('home'),
              url: '/dashboard',
              icon: Home,
            },
            {
              title: t('todos'),
              url: '/dashboard/todos',
              icon: CheckCircle2,
            },
          ]}
        />
        <AppSidebarNav
          label={t('organization_section_label')}
          items={[
            {
              title: t('members'),
              // url: '/dashboard/organization-profile/organization-members',
              url: '/dashboard/members',
              icon: Users,
            },
            {
              title: t('messaging'),
              url: '/dashboard/messaging',
              icon: Mail,
            },
            {
              title: t('classes'),
              url: '/dashboard/billing',
              icon: BookMarked,
            },
            {
              title: t('schedule'),
              url: '/dashboard/schedule',
              icon: CalendarDays,
            },
            {
              title: t('finances'),
              url: '/dashboard/finances',
              icon: Landmark,
            },
          ]}
        />
        <AppSidebarNav
          label={t('account_section_label')}
          items={[
            {
              title: t('my_information'),
              url: '/dashboard/account/my-info',
              icon: CircleUser,
            },
            {
              title: t('security'),
              url: '/dashboard/account/security',
              icon: ShieldCheck,
            },
            {
              title: t('subscription'),
              url: '/dashboard/account/subscription',
              icon: Wallet,
            },
            {
              title: t('user_permissions'),
              url: '/dashboard/account/user-permissions',
              icon: Contact,
            },
          ]}
        />
        <AppSidebarNav
          label={t('settings_section_label')}
          items={[
            {
              title: t('preferences'),
              url: '/dashboard/preferences',
              icon: Settings,
            },
            {
              title: t('support'),
              url: 'mailto:help@dojoplanner.com',
              icon: LifeBuoy,
            },
            {
              title: t('feedback'),
              url: 'mailto:feedback@dojoplanner.com',
              icon: Send,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
