import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../select';

const meta = {
  title: 'UI/Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a dropdown item..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Dropdown Item 1</SelectItem>
          <SelectItem value="item2">Dropdown Item 2</SelectItem>
          <SelectItem value="item3">Dropdown Item 3</SelectItem>
          <SelectItem value="item4">Dropdown Item 4</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Select defaultValue="item2">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1">Dropdown Item 1</SelectItem>
          <SelectItem value="item2">Another Item (Selected)</SelectItem>
          <SelectItem value="item3">Third Option</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectSeparator />
        <SelectLabel>Vegetables</SelectLabel>
        <SelectItem value="carrot">Carrot</SelectItem>
        <SelectItem value="lettuce">Lettuce</SelectItem>
        <SelectItem value="tomato">Tomato</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const LargeList: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="usa">United States</SelectItem>
        <SelectItem value="canada">Canada</SelectItem>
        <SelectItem value="mexico">Mexico</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="france">France</SelectItem>
        <SelectItem value="germany">Germany</SelectItem>
        <SelectItem value="spain">Spain</SelectItem>
        <SelectItem value="italy">Italy</SelectItem>
        <SelectItem value="japan">Japan</SelectItem>
        <SelectItem value="australia">Australia</SelectItem>
        <SelectItem value="brazil">Brazil</SelectItem>
        <SelectItem value="india">India</SelectItem>
      </SelectContent>
    </Select>
  ),
};
