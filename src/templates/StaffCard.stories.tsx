import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StaffCard } from './StaffCard';

const meta = {
  title: 'Templates/StaffCard',
  component: StaffCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying staff member information, matching the existing mobile staff card design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['Active', 'Invitation sent', 'Inactive'],
    },
    role: {
      control: 'select',
      options: ['org:admin', 'instructor', 'front-desk'],
    },
    formatText: {
      control: 'boolean',
    },
    onEdit: {
      control: false,
    },
    onRemove: {
      control: false,
    },
  },
} satisfies Meta<typeof StaffCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    firstName: 'Marcus',
    lastName: 'Silva',
    email: 'marcus@dojo.com',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    emailAddress: 'marcus@dojo.com',
    role: 'org:admin',
    status: 'Active',
  },
};

export const WithoutActions: Story = {
  args: {
    ...Default.args,
  },
};

export const WithActions: Story = {
  args: {
    ...Default.args,
    onEdit: (id: string) => console.info('Edit staff member:', id),
    onRemove: (id: string) => console.info('Remove staff member:', id),
  },
};

export const InvitationSent: Story = {
  args: {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@dojo.com',
    photoUrl: null,
    emailAddress: 'sarah@dojo.com',
    role: 'org:admin',
    status: 'Invitation sent',
    onEdit: (id: string) => console.info('Edit invited staff:', id),
    onRemove: (id: string) => console.info('Remove invited staff:', id),
  },
};

export const InactiveStaff: Story = {
  args: {
    id: '3',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    email: 'mike@dojo.com',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    emailAddress: 'mike@dojo.com',
    role: 'instructor',
    status: 'Inactive',
    onEdit: (id: string) => console.info('Edit inactive staff:', id),
    onRemove: (id: string) => console.info('Remove inactive staff:', id),
  },
};

export const FrontDeskStaff: Story = {
  args: {
    id: '4',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily@dojo.com',
    photoUrl: null,
    emailAddress: 'emily@dojo.com',
    role: 'front-desk',
    status: 'Active',
    onEdit: (id: string) => console.info('Edit front desk staff:', id),
  },
};

export const NullNames: Story = {
  args: {
    id: '5',
    firstName: null,
    lastName: null,
    email: 'pending@dojo.com',
    photoUrl: null,
    emailAddress: 'pending@dojo.com',
    role: 'org:admin',
    status: 'Invitation sent',
    onRemove: (id: string) => console.info('Remove pending invitation:', id),
  },
};

export const DarkMode: Story = {
  args: {
    id: '6',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria@dojo.com',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    emailAddress: 'maria@dojo.com',
    role: 'instructor',
    status: 'Active',
    onEdit: (id: string) => console.info('Edit staff member:', id),
    onRemove: (id: string) => console.info('Remove staff member:', id),
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
