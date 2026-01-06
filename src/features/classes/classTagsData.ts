export type ClassTag = {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  classNames: string[];
};

export const mockClassTags: ClassTag[] = [
  {
    id: 'tag-0',
    name: 'Event',
    color: '#0ea5e9', // sky blue
    usageCount: 2,
    classNames: ['BJJ Fundamentals Seminar Series', 'Guest Instructor: Master Rodriguez'],
  },
  {
    id: 'tag-1',
    name: 'Beginner',
    color: '#22c55e', // green
    usageCount: 4,
    classNames: ['BJJ Fundamentals I', 'BJJ Fundamentals II', 'Kids Class', 'Judo Fundamentals'],
  },
  {
    id: 'tag-2',
    name: 'Advanced',
    color: '#ef4444', // red
    usageCount: 2,
    classNames: ['BJJ Advanced', 'Advanced No-Gi'],
  },
  {
    id: 'tag-3',
    name: 'Adults',
    color: '#3b82f6', // blue
    usageCount: 6,
    classNames: ['All BJJ classes', 'Competition Team', 'Judo Fundamentals'],
  },
  {
    id: 'tag-4',
    name: 'Kids',
    color: '#06b6d4', // cyan
    usageCount: 2,
    classNames: ['Kids Class (Ages 6-9)', 'Kids Class (Ages 10-12)'],
  },
  {
    id: 'tag-5',
    name: 'Gi',
    color: '#8b5cf6', // purple
    usageCount: 5,
    classNames: ['BJJ Fundamentals I & II', 'Intermediate', 'Advanced', 'Kids Classes'],
  },
  {
    id: 'tag-6',
    name: 'No-Gi',
    color: '#f97316', // orange
    usageCount: 2,
    classNames: ['Advanced No-Gi', 'Competition Team Training'],
  },
  {
    id: 'tag-7',
    name: 'Intermediate',
    color: '#eab308', // yellow
    usageCount: 1,
    classNames: ['BJJ Intermediate'],
  },
  {
    id: 'tag-8',
    name: 'Competition',
    color: '#ec4899', // pink
    usageCount: 3,
    classNames: ['Competition Team Training', 'Advanced Sparring', 'Competition Prep'],
  },
];
