import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from '../label';
import { Switch } from '../switch';

const meta = {
  title: 'UI/Form/Switch',
  component: Switch,
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
} satisfies Meta<typeof Switch>;

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
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="marketing">Marketing Emails</Label>
        <Switch id="marketing" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="updates">Product Updates</Label>
        <Switch id="updates" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="security">Security Alerts</Label>
        <Switch id="security" defaultChecked />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Off</p>
        <Switch />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">On</p>
        <Switch checked />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Disabled</p>
        <Switch disabled />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Disabled On</p>
        <Switch disabled checked />
      </div>
    </div>
  ),
};

export const DarkModeStates: Story = {
  render: () => (
    <div className="dark rounded-lg bg-background p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Off</p>
            <Switch />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">On</p>
            <Switch checked />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Disabled</p>
            <Switch disabled />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Disabled On</p>
            <Switch disabled checked />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const LightVsDark: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Light Mode Section */}
      <div className="rounded-lg border bg-background p-6">
        <h3 className="mb-4 font-semibold text-foreground">Light Mode</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Switch />
            <span className="text-xs text-muted-foreground">Off</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Switch checked />
            <span className="text-xs text-muted-foreground">On</span>
          </div>
        </div>
      </div>

      {/* Dark Mode Section */}
      <div className="dark rounded-lg border bg-background p-6">
        <h3 className="mb-4 font-semibold text-foreground">Dark Mode</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Switch />
            <span className="text-xs text-muted-foreground">Off</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Switch checked />
            <span className="text-xs text-muted-foreground">On</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
