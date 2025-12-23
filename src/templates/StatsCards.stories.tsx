import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatsCards } from './StatsCards';

const meta = {
  title: 'Templates/StatsCards',
  component: StatsCards,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A reusable template for displaying statistical data in card format. Used across dashboard pages for members, classes, programs, roles, and other statistics.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [3, 4],
      description: 'Number of columns for medium+ screens',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether to show the cards in full width container',
    },
    className: {
      control: 'text',
      description: 'Optional CSS classes for the container',
    },
  },
} satisfies Meta<typeof StatsCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MembersStats: Story = {
  args: {
    columns: 4,
    stats: [
      { id: '1', label: 'Total members', value: 1 },
      { id: '2', label: 'Total cancelled', value: 0 },
      { id: '3', label: 'Paid members', value: 0 },
      { id: '4', label: 'Free members', value: 0 },
    ],
  },
};

export const ClassesStats: Story = {
  args: {
    columns: 3,
    stats: [
      { id: '1', label: 'Total Classes', value: 8 },
      { id: '2', label: 'Total Tags', value: 12 },
      { id: '3', label: 'Total Instructors', value: 4 },
    ],
  },
};

export const ProgramsStats: Story = {
  args: {
    columns: 3,
    stats: [
      { id: '1', label: 'Total Programs', value: 3 },
      { id: '2', label: 'Active', value: 3 },
      { id: '3', label: 'Total Classes', value: 24 },
    ],
  },
};

export const MembershipsStats: Story = {
  args: {
    columns: 4,
    stats: [
      { id: '1', label: 'Total Memberships', value: 7 },
      { id: '2', label: 'Active', value: 6 },
      { id: '3', label: 'Trial Options', value: 1 },
      { id: '4', label: 'Total Members', value: 277 },
    ],
  },
};

export const FinancialStats: Story = {
  args: {
    columns: 4,
    stats: [
      {
        id: '1',
        label: 'Monthly Revenue',
        value: 14394.20,
        formatValue: value => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      },
      {
        id: '2',
        label: 'Past Due',
        value: 450.62,
        formatValue: value => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      },
      { id: '3', label: 'Failed Payments', value: 3 },
      { id: '4', label: 'Active Subscriptions', value: 108 },
    ],
  },
};

export const RolesStats: Story = {
  args: {
    columns: 3,
    stats: [
      { id: '1', label: 'Total Users', value: 42 },
      { id: '2', label: 'Total Admins', value: 3 },
      { id: '3', label: 'Total Coaches', value: 8 },
    ],
  },
};

export const WithStringValues: Story = {
  args: {
    columns: 3,
    stats: [
      { id: '1', label: 'System Status', value: 'Online' },
      { id: '2', label: 'Last Backup', value: '2 hours ago' },
      { id: '3', label: 'Database Status', value: 'Healthy' },
    ],
  },
};

export const CustomFormatting: Story = {
  parameters: {
    docs: {
      source: {
        code: `<StatsCards 
  columns={4}
  stats={[
    { 
      id: '1', 
      label: 'Conversion Rate', 
      value: 23.5,
      formatValue: (value) => \`\${value}%\`
    },
    { 
      id: '2', 
      label: 'Average Session', 
      value: 75,
      formatValue: (value) => \`\${value} min\`
    },
    { 
      id: '3', 
      label: 'Growth Rate', 
      value: 12.3,
      formatValue: (value) => \`+\${value}%\`
    },
    { 
      id: '4', 
      label: 'Temperature', 
      value: 72,
      formatValue: (value) => \`\${value}°F\`
    },
  ]}
/>`,
      },
    },
  },
  args: {
    columns: 4,
    stats: [
      {
        id: '1',
        label: 'Conversion Rate',
        value: 23.5,
        formatValue: value => `${value}%`,
      },
      {
        id: '2',
        label: 'Average Session',
        value: 75,
        formatValue: value => `${value} min`,
      },
      {
        id: '3',
        label: 'Growth Rate',
        value: 12.3,
        formatValue: value => `+${value}%`,
      },
      {
        id: '4',
        label: 'Temperature',
        value: 72,
        formatValue: value => `${value}°F`,
      },
    ],
  },
};

export const DarkMode: Story = {
  args: {
    columns: 4,
    stats: [
      { id: '1', label: 'Total Members', value: 247 },
      { id: '2', label: 'Active Members', value: 231 },
      { id: '3', label: 'Revenue', value: 15420, formatValue: value => `$${Number(value).toLocaleString()}` },
      { id: '4', label: 'Growth Rate', value: 8.3, formatValue: value => `+${value}%` },
    ],
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
