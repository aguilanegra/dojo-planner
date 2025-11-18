import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from '../label';
import { PasswordInput } from './password-input';

const meta = {
  title: 'UI/Primitives/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'highlight'],
      description: 'Input field visual style variant',
      table: {
        type: { summary: 'default | highlight' },
        defaultValue: { summary: 'default' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Input field error state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Input field disabled state',
    },
    showToggle: {
      control: 'boolean',
      description: 'Show visibility toggle',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Input field placeholder',
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter password...',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Password1234#',
  },
};

export const NoToggle: Story = {
  args: {
    placeholder: 'Password (no toggle)',
    showToggle: false,
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Enter password...',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Enter password...',
    disabled: true,
  },
};

export const Highlight: Story = {
  args: {
    placeholder: 'Enter password...',
    variant: 'highlight',
  },
};

export const UseCase: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="password-demo">
          Password
        </Label>
        <PasswordInput
          id="password-demo"
          placeholder="Enter your password"
        />
        <p className="text-sm text-neutral-600">
          Click the eye icon to toggle password visibility
        </p>
      </div>
    </div>
  ),
};
