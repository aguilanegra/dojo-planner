import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search } from '../search';

const meta = {
  title: 'UI/Primitives/Search',
  component: Search,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    showCmdK: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search anything',
    showCmdK: true,
  },
};

export const WithoutCmdK: Story = {
  args: {
    placeholder: 'Search anything',
    showCmdK: false,
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search anything',
    showCmdK: true,
    defaultValue: 'example search',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search anything',
    disabled: true,
    showCmdK: true,
  },
};

export const WithAriaInvalid: Story = {
  args: {
    'aria-invalid': true,
    'placeholder': 'Search anything',
    'showCmdK': true,
  },
};

export const DarkMode: Story = {
  args: {},
  render: () => (
    <div className="dark bg-background p-8">
      <Search placeholder="Search anything" showCmdK />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-medium">Default</p>
        <Search placeholder="Search anything" showCmdK />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Without Cmd K</p>
        <Search placeholder="Search anything" showCmdK={false} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">With Value</p>
        <Search placeholder="Search anything" showCmdK defaultValue="example" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Disabled</p>
        <Search placeholder="Search anything" disabled showCmdK />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">With Error State</p>
        <Search placeholder="Search anything" aria-invalid showCmdK />
      </div>
    </div>
  ),
};
