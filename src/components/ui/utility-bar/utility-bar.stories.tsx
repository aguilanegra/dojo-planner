import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UtilityBar } from './utility-bar';

const meta = {
  title: 'UI/Utility/UtilityBar',
  component: UtilityBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UtilityBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InHeader: Story = {
  decorators: [
    Story => (
      <div className="flex items-center justify-between bg-background p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">View your dashboard overview</p>
        </div>
        <Story />
      </div>
    ),
  ],
};
