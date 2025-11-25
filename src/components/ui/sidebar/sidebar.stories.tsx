import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/templates/Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '../sidebar';

const meta = {
  title: 'UI/Utility/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible sidebar component that supports collapsing, different variants, and positioning. Features interactive navigation with icons and theming.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState('dashboard');

    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <Home /> },
      { id: 'inbox', label: 'Inbox', icon: <Inbox /> },
      { id: 'calendar', label: 'Calendar', icon: <Calendar /> },
      { id: 'search', label: 'Search', icon: <Search /> },
      { id: 'settings', label: 'Settings', icon: <Settings /> },
    ];

    return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex justify-center pt-3 pb-0">
              <Logo />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Academy</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map(item => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        icon={item.icon}
                        isActive={activeItem === item.id}
                        onClick={() => setActiveItem(item.id)}
                      >
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-2 text-xs text-neutral-800">
              © 2024 Dojo Planner
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <main className="flex-1 p-4">
          <div className="mb-6 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-neutral-1200">
              {menuItems.find(item => item.id === activeItem)?.label}
            </h1>
          </div>
          <div className="space-y-4">
            <p className="text-neutral-900">
              Welcome to your
              {' '}
              {activeItem}
              {' '}
              page. Click the sidebar items to see the
              selection state changes.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-neutral-200 p-4">
                <h3 className="mb-2 font-medium text-neutral-1200">Selected State</h3>
                <p className="text-sm text-neutral-900">
                  Selected items have a dark background (neutral-1200) with light text and icons.
                </p>
              </div>
              <div className="rounded-lg bg-neutral-200 p-4">
                <h3 className="mb-2 font-medium text-neutral-1200">Unselected State</h3>
                <p className="text-sm text-neutral-900">
                  Unselected items have a light background (neutral-100) with dark text and icons.
                </p>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  },
};
