import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spinner } from './spinner';

const meta = {
  title: 'UI/Utility/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <p className="text-sm text-muted-foreground">Small</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <p className="text-sm text-muted-foreground">Medium</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Large</p>
      </div>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">Loading members...</p>
    </div>
  ),
};

export const InContainer: Story = {
  render: () => (
    <div className="flex h-48 w-full items-center justify-center rounded-lg border border-border bg-secondary">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  ),
};
