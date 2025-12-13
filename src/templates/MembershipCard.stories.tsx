import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MembershipCard } from './MembershipCard';

const meta = {
  title: 'Templates/MembershipCard',
  component: MembershipCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying membership information including pricing, status, and statistics.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['Active', 'Inactive', 'Trial'],
    },
    isTrial: {
      control: 'boolean',
    },
    onEdit: {
      action: 'edit',
    },
  },
} satisfies Meta<typeof MembershipCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    name: 'Unlimited Monthly',
    category: 'Adult Brazilian Jiu-Jitsu',
    status: 'Active',
    price: '$180.00/mo',
    signupFee: '$50 signup fee',
    frequency: 'Monthly',
    contract: 'Month-to-Month',
    access: 'Unlimited Classes',
    activeCount: 87,
    revenue: '$15,660/mo revenue',
    onEdit: undefined,
  },
};

export const WithEditAction: Story = {
  args: {
    ...Default.args,
    onEdit: (id: string) => console.info('Edit membership:', id),
  },
};

export const TrialMembership: Story = {
  args: {
    id: '2',
    name: 'Free Trial Week',
    category: 'Adult Brazilian Jiu-Jitsu',
    status: 'Active',
    isTrial: true,
    price: 'Free',
    signupFee: 'No signup fee',
    frequency: 'None',
    contract: '7 Days',
    access: '3 Classes Total',
    activeCount: 23,
    revenue: '15 Converted This Month',
    onEdit: (id: string) => console.info('Edit trial:', id),
  },
};

export const InactiveMembership: Story = {
  args: {
    id: '3',
    name: '6 Month Commitment (Silver)',
    category: 'Adult Brazilian Jiu-Jitsu',
    status: 'Inactive',
    price: '$165.00/mo',
    signupFee: '$35 signup fee',
    frequency: 'Monthly',
    contract: '6 Months',
    access: 'Unlimited Classes',
    activeCount: 0,
    revenue: '$0/mo revenue',
  },
};

export const KidsMembership: Story = {
  args: {
    id: '4',
    name: 'Kids Monthly',
    category: 'Kids Program',
    status: 'Active',
    price: '$95.00/mo',
    signupFee: '$25 signup fee',
    frequency: 'Monthly',
    contract: 'Month-to-Month',
    access: '8 Classes/mo',
    activeCount: 34,
    revenue: '$3,230/mo revenue',
  },
};

export const CompetitionTeam: Story = {
  args: {
    id: '5',
    name: 'Competition Team',
    category: 'Competition Team',
    status: 'Active',
    price: '$200.00/mo',
    signupFee: '$50 signup fee',
    frequency: 'Monthly',
    contract: '6 Months',
    access: 'Unlimited',
    activeCount: 16,
    revenue: '$3,200/mo revenue',
  },
};

export const TrialWithHighConversion: Story = {
  args: {
    id: '6',
    name: 'Kids Free Trial Week',
    category: 'Kids Program',
    status: 'Active',
    isTrial: true,
    price: 'Free',
    signupFee: 'No signup fee',
    frequency: 'None',
    contract: '7 Days',
    access: '2 Classes Total',
    activeCount: 8,
    revenue: '6 Converted This Month',
    onEdit: (id: string) => console.info('Edit kids trial:', id),
  },
};
