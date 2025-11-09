import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';

const meta = {
  title: 'UI/Display/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a helpful tooltip!</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithLongText: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Information</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a longer tooltip with more detailed information about the button.</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Different: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Save
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Save changes</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Open settings</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Delete
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Delete this item</TooltipContent>
      </Tooltip>
    </div>
  ),
};
