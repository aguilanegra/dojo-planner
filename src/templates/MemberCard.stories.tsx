import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MemberCard } from './MemberCard';

const meta = {
  title: 'Templates/MemberCard',
  component: MemberCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying member information, matching the existing mobile member card design from the members page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    membershipType: {
      control: 'select',
      options: ['free', 'free-trial', 'monthly', 'annual'],
    },
    status: {
      control: 'text',
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
    formatters: {
      control: 'object',
    },
  },
} satisfies Meta<typeof MemberCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    dateOfBirth: new Date('1990-01-15'),
    photoUrl: null,
    lastAccessedAt: new Date('2025-05-01'),
    status: 'Active',
    membershipType: 'monthly',
    amountDue: '$99.00',
    nextPayment: new Date('2025-06-01'),
  },
};

export const WithAvatar: Story = {
  args: {
    ...Default.args,
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
};

export const Clickable: Story = {
  args: {
    ...Default.args,
    onClick: (id: string) => console.info('Clicked member:', id),
  },
};

export const AnnualMember: Story = {
  args: {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1987654321',
    dateOfBirth: new Date('1985-03-22'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    lastAccessedAt: new Date('2025-05-02'),
    status: 'Active',
    membershipType: 'annual',
    amountDue: '$0.00',
    nextPayment: new Date('2026-01-15'),
    onClick: (id: string) => console.info('Clicked annual member:', id),
  },
};

export const FreeTrialMember: Story = {
  args: {
    id: '3',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    email: 'mike.rodriguez@example.com',
    phone: '+1555123456',
    dateOfBirth: new Date('1992-07-10'),
    photoUrl: null,
    lastAccessedAt: new Date('2025-04-28'),
    status: 'Trial',
    membershipType: 'free-trial',
    amountDue: '$0.00',
    nextPayment: new Date('2025-06-15'),
    onClick: (id: string) => console.info('Clicked trial member:', id),
  },
};

export const FreeMember: Story = {
  args: {
    id: '4',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@example.com',
    phone: null,
    dateOfBirth: new Date('1995-11-03'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    lastAccessedAt: new Date('2025-04-20'),
    status: 'Active',
    membershipType: 'free',
    amountDue: '$0.00',
    nextPayment: null,
    onClick: (id: string) => console.info('Clicked free member:', id),
  },
};

export const InactiveMember: Story = {
  args: {
    id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '+1777888999',
    dateOfBirth: new Date('1988-09-18'),
    photoUrl: null,
    lastAccessedAt: new Date('2025-02-10'),
    status: 'Inactive',
    membershipType: 'monthly',
    amountDue: '$199.00',
    nextPayment: new Date('2025-03-01'),
    onClick: (id: string) => console.info('Clicked inactive member:', id),
  },
};

export const PastDueMember: Story = {
  args: {
    id: '6',
    firstName: 'Lisa',
    lastName: 'Martinez',
    email: 'lisa.martinez@example.com',
    phone: '+1444555666',
    dateOfBirth: new Date('1991-12-07'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    lastAccessedAt: new Date('2025-04-15'),
    status: 'Past Due',
    membershipType: 'monthly',
    amountDue: '$298.00',
    nextPayment: new Date('2025-04-01'), // Past date
    onClick: (id: string) => console.info('Clicked past due member:', id),
  },
};

export const CustomLabelsAndFormatters: Story = {
  args: {
    ...Default.args,
    labels: {
      membership: 'Plan Type',
      amountDue: 'Balance',
      nextPayment: 'Due Date',
      lastVisited: 'Last Check-in',
    },
    formatters: {
      currency: (amount: string) => `€${amount.replace('$', '')}`,
      date: (date: Date | null) => {
        if (!date) {
          return 'Never';
        }
        return date.toLocaleDateString('en-GB');
      },
      membershipType: (type: string) => `Premium ${type}`,
      status: (status: string) => `Status: ${status}`,
    },
    onClick: (id: string) => console.info('Clicked custom formatted member:', id),
  },
};

export const UnformattedText: Story = {
  args: {
    ...Default.args,
    membershipType: 'free-trial',
    status: 'active member',
    formatText: false,
    onClick: (id: string) => console.info('Clicked unformatted member:', id),
  },
};

export const NeverVisited: Story = {
  args: {
    id: '7',
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'alex.thompson@example.com',
    phone: '+1222333444',
    dateOfBirth: new Date('1993-04-25'),
    photoUrl: null,
    lastAccessedAt: null,
    status: 'Pending',
    membershipType: 'monthly',
    amountDue: '$99.00',
    nextPayment: new Date('2025-06-01'),
    onClick: (id: string) => console.info('Clicked never visited member:', id),
  },
};

export const DarkMode: Story = {
  args: {
    id: '8',
    firstName: 'Isabella',
    lastName: 'Chen',
    email: 'isabella.chen@example.com',
    phone: '+1666777888',
    dateOfBirth: new Date('1987-08-12'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
    lastAccessedAt: new Date('2025-05-03'),
    status: 'Active',
    membershipType: 'annual',
    amountDue: '$0.00',
    nextPayment: new Date('2026-02-01'),
    onClick: (id: string) => console.info('Clicked member in dark mode:', id),
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
