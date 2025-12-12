import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgramCard } from './ProgramCard';

const meta = {
  title: 'Templates/ProgramCard',
  component: ProgramCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying program information including class counts and management actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['Active', 'Inactive'],
    },
    onEdit: {
      action: 'edit',
    },
    onDelete: {
      action: 'delete',
    },
  },
} satisfies Meta<typeof ProgramCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    name: 'Adult Brazilian Jiu-Jitsu',
    description: 'Comprehensive Brazilian Jiu-Jitsu program for adults covering fundamentals through advanced techniques.',
    classCount: 4,
    classNames: 'BJJ Fundamentals I & II, Intermediate, Advanced, Advanced No-Gi',
    status: 'Active',
  },
};

export const WithActions: Story = {
  args: {
    ...Default.args,
    onEdit: (id: string) => console.info('Edit program:', id),
    onDelete: (id: string) => console.info('Delete program:', id),
  },
};

export const KidsProgram: Story = {
  args: {
    id: '2',
    name: 'Kids Program',
    description: 'Fun and engaging martial arts program designed specifically for children ages 6-12.',
    classCount: 2,
    classNames: 'Kids Class (Ages 6-9), Kids Class (Ages 10-12)',
    status: 'Active',
    onEdit: (id: string) => console.info('Edit kids program:', id),
    onDelete: (id: string) => console.info('Delete kids program:', id),
  },
};

export const CompetitionTeam: Story = {
  args: {
    id: '3',
    name: 'Competition Team',
    description: 'Elite training program for competitive athletes with advanced techniques and intensive conditioning.',
    classCount: 3,
    classNames: 'Competition Team Training, Advanced Sparring, Competition Prep',
    status: 'Active',
    onEdit: (id: string) => console.info('Edit competition program:', id),
  },
};

export const InactiveProgram: Story = {
  args: {
    id: '4',
    name: 'Wrestling Fundamentals',
    description: 'Basic wrestling techniques and conditioning program currently suspended.',
    classCount: 1,
    classNames: 'Wrestling Fundamentals',
    status: 'Inactive',
    onEdit: (id: string) => console.info('Edit wrestling program:', id),
    onDelete: (id: string) => console.info('Delete wrestling program:', id),
  },
};

export const JudoProgram: Story = {
  args: {
    id: '5',
    name: 'Judo Fundamentals',
    description: 'Traditional Judo program focusing on throws, breakfalls, and Olympic-style techniques.',
    classCount: 1,
    classNames: 'Judo Fundamentals',
    status: 'Active',
  },
};

export const OnlyEditAction: Story = {
  args: {
    id: '6',
    name: 'Women\'s Self Defense',
    description: 'Specialized self-defense program designed for women of all fitness levels and experience.',
    classCount: 2,
    classNames: 'Women\'s Self Defense Basics, Advanced Women\'s Self Defense',
    status: 'Active',
    onEdit: (id: string) => console.info('Edit women\'s program:', id),
  },
};
