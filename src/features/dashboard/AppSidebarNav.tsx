'use client';

import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';

export const AppSidebarNav = (props: {
  label?: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    badge?: ReactNode;
    isSwitchItem?: boolean;
    onSwitchChange?: (checked: boolean) => void;
    onClick?: () => void | Promise<void>;
    disabled?: boolean;
    hidden?: boolean;
  }[];
} & ComponentPropsWithoutRef<typeof SidebarGroup>) => {
  const { toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();
  const locale = useLocale();

  const isActive = (url: string) => {
    const pathWithoutLocale = pathname.startsWith(`/${locale}`) ? pathname.slice(`/${locale}`.length) : pathname;

    // Exact match
    if (pathWithoutLocale === url) {
      return true;
    }

    // Sub-route matching: only match if there's a deeper path level
    // This prevents /dashboard from matching /dashboard/members
    const subRoutePrefix = `${url}/`;
    if (pathWithoutLocale.startsWith(subRoutePrefix)) {
      // Extract what comes after the url/
      const remaining = pathWithoutLocale.slice(subRoutePrefix.length);
      // Only consider it a sub-route if it has additional path segments (contains another /)
      // e.g., "members/123/edit" matches /dashboard/members, but "members" doesn't match /dashboard
      return remaining.includes('/');
    }

    return false;
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        {props.label && (<SidebarGroupLabel>{props.label}</SidebarGroupLabel>)}
        <SidebarMenu>
          {props.items.filter(item => !item.hidden).map(item => (
            <SidebarMenuItem key={item.title}>
              {item.isSwitchItem
                ? (
                    // Special rendering for switch items (like Dark Mode)
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <item.icon size={16} />
                        <span>{item.title}</span>
                      </div>
                      <Switch
                        onCheckedChange={item.onSwitchChange}
                      />
                    </div>
                  )
                : (
                    // Regular link items or custom action items, possibly with badge
                    item.onClick
                      ? (
                          <SidebarMenuButton
                            className={`${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${isActive(item.url) ? 'bg-slate-200 dark:bg-slate-700' : ''} ${item.badge ? 'flex items-center justify-between' : ''}`}
                            onClick={async () => {
                              if (item.disabled) {
                                return;
                              }
                              await item.onClick?.();
                              if (isMobile) {
                                toggleSidebar();
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <item.icon size={16} />
                              <span>{item.title}</span>
                            </div>
                            {item.badge && (
                              <span className="pointer-events-none">
                                {item.badge}
                              </span>
                            )}
                          </SidebarMenuButton>
                        )
                      : (
                          <SidebarMenuButton
                            asChild
                            className={`${item.disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer'} ${isActive(item.url) ? 'bg-slate-200 dark:bg-slate-700' : ''} ${item.badge ? 'flex items-center justify-between' : ''}`}
                            onClick={() => {
                              if (isMobile) {
                                toggleSidebar();
                              }
                            }}
                          >
                            <Link href={item.disabled ? '#' : item.url} className="flex w-full items-center justify-between">
                              <div className="flex items-center gap-2">
                                <item.icon size={16} />
                                <span>{item.title}</span>
                              </div>
                              {item.badge && (
                                <span className="pointer-events-none">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        )
                  )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
