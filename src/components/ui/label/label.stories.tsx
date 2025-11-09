import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from '../label';

const meta = {
  title: 'UI/Primitives/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const WithFor: Story = {
  args: {
    htmlFor: 'input-id',
    children: 'Email Address',
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'text-lg font-bold',
    children: 'Custom Styled Label',
  },
};

export const FormLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="name">Name</Label>
      <input
        id="name"
        type="text"
        placeholder="Enter your name"
        className="rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
  ),
};
