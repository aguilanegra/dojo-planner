import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';

const meta = {
  title: 'UI/Utility/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="@user" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Various: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="" alt="@user1" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="" alt="@user2" />
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="" alt="@user3" />
        <AvatarFallback>EF</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithName: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <p className="font-semibold">Shadcn</p>
        <p className="text-sm text-gray-500">@shadcn</p>
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://github.com/shadcn.png" alt="@user1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="" alt="@user2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="" alt="@user3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
    </div>
  ),
};
