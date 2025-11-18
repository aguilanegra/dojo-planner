import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '../input';

const meta = {
  title: 'UI/Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: 'Input field type',
    },
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
      description: 'Input disabled state',
    },
    placeholder: {
      control: 'text',
      description: 'Input field placeholder',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Placeholder',
    error: true,
  },
};

export const Highlight: Story = {
  args: {
    placeholder: 'Placeholder',
    variant: 'highlight',
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'Default value',
  },
};
