import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ClassCard } from './ClassCard';

const meta = {
  title: 'Templates/ClassCard',
  component: ClassCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying class information including instructors, schedule, and details.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    },
    type: {
      control: 'select',
      options: ['Adults', 'Kids', 'Women', 'Open', 'Competition'],
    },
    style: {
      control: 'select',
      options: ['Gi', 'No Gi'],
    },
  },
} satisfies Meta<typeof ClassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    name: 'BJJ Fundamentals I',
    description: 'Learn the basic positions, escapes, and submissions. Perfect for beginners with little to no experience.',
    level: 'Beginner',
    type: 'Adults',
    style: 'Gi',
    schedule: 'M/W/F • 6-7:30 PM',
    location: 'Main Training Area',
    instructors: [
      {
        name: 'Professor Silva',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Silva',
      },
    ],
  },
};

export const Advanced: Story = {
  args: {
    id: '2',
    name: 'Advanced No-Gi',
    description: 'Explores high percentage transitions, leg entanglements, and situational sparring. Best for experienced students.',
    level: 'Advanced',
    type: 'Adults',
    style: 'No Gi',
    schedule: 'Sa/Su • 12-1 PM',
    location: 'Competition Area',
    instructors: [
      {
        name: 'Coach Alex',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
    ],
  },
};

export const KidsClass: Story = {
  args: {
    id: '3',
    name: 'Kids BJJ',
    description: 'Builds coordination, focus, and basic grappling skills through games and technique. Emphasis on safety and fun.',
    level: 'Beginner',
    type: 'Kids',
    style: 'Gi',
    schedule: 'T/Th • 4-5 PM',
    location: 'Kids Area',
    instructors: [
      {
        name: 'Coach Maria',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      },
    ],
  },
};

export const WomensClass: Story = {
  args: {
    id: '4',
    name: 'Women\'s BJJ',
    description: 'Technique focused class with optional sparring, designed to create a welcoming space for women to build skills and confidence.',
    level: 'All Levels',
    type: 'Women',
    style: 'Gi',
    schedule: 'T • 5-6 PM',
    location: 'Main Training Area',
    instructors: [
      {
        name: 'Professor Jessica',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
      },
    ],
  },
};

export const MultipleInstructors: Story = {
  args: {
    id: '5',
    name: 'Competition Team',
    description: 'Advanced training for competition preparation with multiple world-class instructors.',
    level: 'Advanced',
    type: 'Competition',
    style: 'Gi',
    schedule: 'M/W/F • 8-9 PM',
    location: 'Competition Area',
    instructors: [
      {
        name: 'Professor Silva',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Silva',
      },
      {
        name: 'Coach Alex',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      {
        name: 'Professor Jessica',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
      },
    ],
  },
};

export const OpenMat: Story = {
  args: {
    id: '6',
    name: 'Open Mat',
    description: 'Open training session. Bring your skill level to practice freely with other students.',
    level: 'All Levels',
    type: 'Open',
    style: 'Gi',
    schedule: 'Sa/Su • 10 AM-12 PM',
    location: 'Main Training Area',
    instructors: [],
  },
};
