import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserCard } from './UserCard';

const meta = {
  title: 'Templates/UserCard',
  component: UserCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying user information, matching the existing mobile user card design from the roles page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['Active', 'Inactive', 'Invitation sent'],
    },
    formatText: {
      control: 'boolean',
    },
    onClick: {
      control: false,
    },
    labels: {
      control: 'object',
    },
  },
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    name: 'Charlie Baptista',
    title: 'Account Owner',
    roles: 'Owner, Admin, Coach',
    status: 'Active',
    recentActivity: 'May 1, 2025',
    lastLoggedIn: 'May 1, 2025',
  },
};

export const WithAvatar: Story = {
  args: {
    ...Default.args,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  },
};

export const Clickable: Story = {
  args: {
    ...Default.args,
    onClick: (id: string) => console.info('Clicked user:', id),
  },
};

export const InactiveUser: Story = {
  args: {
    id: '2',
    name: 'Jessica Smith',
    title: 'Former Coach',
    roles: 'Coach',
    status: 'Inactive',
    recentActivity: 'March 15, 2025',
    lastLoggedIn: 'March 15, 2025',
    onClick: (id: string) => console.info('Clicked inactive user:', id),
  },
};

export const InvitationSent: Story = {
  args: {
    id: '3',
    name: 'Alex Johnson',
    title: 'New Instructor',
    roles: 'Coach',
    status: 'Invitation sent',
    recentActivity: 'Never',
    lastLoggedIn: 'Never',
    onClick: (id: string) => console.info('Clicked pending user:', id),
  },
};

export const VPUser: Story = {
  args: {
    id: '4',
    name: 'Hanna Septimus',
    title: 'VP',
    roles: 'Admin, Coach',
    status: 'Active',
    recentActivity: 'April 30, 2025',
    lastLoggedIn: 'April 30, 2025',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hanna',
    onClick: (id: string) => console.info('Clicked VP user:', id),
  },
};

export const HeadProfessor: Story = {
  args: {
    id: '5',
    name: 'Anika Rosser',
    title: 'Head Professor',
    roles: 'Coach',
    status: 'Active',
    recentActivity: 'April 15, 2025',
    lastLoggedIn: 'April 15, 2025',
    onClick: (id: string) => console.info('Clicked head professor:', id),
  },
};

export const UnformattedText: Story = {
  args: {
    id: '6',
    name: 'Daniel Jackson',
    title: 'Coach',
    roles: 'Coach',
    status: 'Invitation sent',
    recentActivity: 'Never',
    lastLoggedIn: 'Never',
    formatText: false,
    onClick: (id: string) => console.info('Clicked unformatted user:', id),
  },
};

export const LongName: Story = {
  args: {
    id: '7',
    name: 'Professor Ivan Aleksandrovich',
    title: 'Senior Coach & Technique Specialist',
    roles: 'Head Coach, Technical Director, Admin',
    status: 'Active',
    recentActivity: 'April 10, 2025',
    lastLoggedIn: 'April 10, 2025',
    onClick: (id: string) => console.info('Clicked long name user:', id),
  },
};

export const DarkMode: Story = {
  args: {
    id: '8',
    name: 'Carlos Mendez',
    title: 'Assistant Instructor',
    roles: 'Coach, Student Mentor',
    status: 'Active',
    recentActivity: 'May 2, 2025',
    lastLoggedIn: 'May 2, 2025',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    onClick: (id: string) => console.info('Clicked user in dark mode:', id),
  },
  parameters: {
    themes: {
      themeOverride: 'dark',
    },
  },
  decorators: [
    Story => (
      <div className="dark">
        <div className="bg-background p-4 text-foreground">
          <Story />
        </div>
      </div>
    ),
  ],
};
