import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from '../checkbox';
import { Label } from '../label';

const meta = {
  title: 'UI/Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">I agree to the terms and conditions</Label>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="check1" />
        <Label htmlFor="check1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="check2" />
        <Label htmlFor="check2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="check3" />
        <Label htmlFor="check3">Option 3</Label>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Default</p>
        <Checkbox />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Checked</p>
        <Checkbox checked />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Disabled</p>
        <Checkbox disabled />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Disabled Checked</p>
        <Checkbox disabled checked />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  args: {},
  render: () => (
    <div className="dark bg-background p-8">
      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Default</p>
          <Checkbox />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Checked</p>
          <Checkbox checked />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Disabled</p>
          <Checkbox disabled />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Disabled Checked</p>
          <Checkbox disabled checked />
        </div>
      </div>
    </div>
  ),
};
