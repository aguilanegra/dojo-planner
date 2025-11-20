import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Link from 'next/link';
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
  }[];
} & ComponentPropsWithoutRef<typeof SidebarGroup>) => {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        {props.label && (<SidebarGroupLabel>{props.label}</SidebarGroupLabel>)}
        <SidebarMenu>
          {props.items.map(item => (
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
                            className={item.badge ? 'flex items-center justify-between' : undefined}
                            onClick={async () => {
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
                            className={item.badge ? 'flex items-center justify-between' : undefined}
                            onClick={() => {
                              if (isMobile) {
                                toggleSidebar();
                              }
                            }}
                          >
                            <Link href={item.url} className="flex w-full items-center justify-between">
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
