import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from '../label';
import { RadioGroup, RadioGroupItem } from '../radio-group';

const meta = {
  title: 'UI/Form/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="radio-v1" />
        <Label htmlFor="radio-v1">Vertical Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="radio-v2" />
        <Label htmlFor="radio-v2">Vertical Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="radio-v3" />
        <Label htmlFor="radio-v3">Vertical Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="radio-h1" />
        <Label htmlFor="radio-h1">Yes</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="radio-h2" />
        <Label htmlFor="radio-h2">No</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="radio-h3" />
        <Label htmlFor="radio-h3">Maybe</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="radio-d1" />
        <Label htmlFor="radio-d1">Enabled</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="radio-d2" disabled />
        <Label htmlFor="radio-d2">Disabled</Label>
      </div>
    </RadioGroup>
  ),
};
