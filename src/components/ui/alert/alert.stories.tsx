import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Alert } from './alert';

const meta = {
  title: 'UI/Primitives/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['error', 'warning', 'success', 'info'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is an alert message',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'An error occurred. Please try again.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning: This action cannot be undone.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Your changes have been saved successfully.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Please note: This feature is in beta.',
  },
};

export const AllVariants: Story = {
  args: {
    children: 'Alert message',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="error">Error: Something went wrong.</Alert>
      <Alert variant="warning">Warning: Proceed with caution.</Alert>
      <Alert variant="success">Success: Operation completed.</Alert>
      <Alert variant="info">Info: New updates available.</Alert>
    </div>
  ),
};

export const LongMessage: Story = {
  args: {
    variant: 'error',
    children:
      'This is a longer error message that demonstrates how the alert component handles multiple lines of text. The icon should remain aligned properly.',
  },
};

export const WithCustomClass: Story = {
  args: {
    variant: 'info',
    className: 'max-w-md',
    children: 'This alert has a custom max-width class applied.',
  },
};
