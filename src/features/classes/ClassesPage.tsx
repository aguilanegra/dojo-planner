'use client';

import type { ClassCardProps } from '@/templates/ClassCard';
import { ChevronDown, Grid3x3, List, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { ClassCard } from '@/templates/ClassCard';

const mockClasses: ClassCardProps[] = [
  {
    id: '1',
    name: 'BJJ Fundamentals I',
    description: 'Covers core positions, escapes, and submissions. Ideal for students in their first 6 months.',
    level: 'Beginner',
    type: 'Adults',
    style: 'Gi',
    schedule: 'M/W/F • 6-7 PM',
    location: 'Downtown HQ',
    instructors: [
      { name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    ],
  },
  {
    id: '2',
    name: 'BJJ Fundamentals II',
    description: 'Learn core BJJ techniques like sweeps, submissions, and escapes. Ideal for building a strong grappling foundation.',
    level: 'Beginner',
    type: 'Adults',
    style: 'Gi',
    schedule: 'T/Th • 6-7:30 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Professor Ivan', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' }],
  },
  {
    id: '3',
    name: 'BJJ Intermediate',
    description: 'Covers our intermediate curriculum. Builds on what was learned in Fundamentals I and II. Has rolling after.',
    level: 'Intermediate',
    type: 'Adults',
    style: 'Gi',
    schedule: 'M/W • 7-8 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' }],
  },
  {
    id: '4',
    name: 'BJJ Advanced',
    description: 'Advanced curriculum that requires at least blue belt level to attend. Builds on previous curriculum. Has rolling after.',
    level: 'Advanced',
    type: 'Adults',
    style: 'No Gi',
    schedule: 'W/F • 7-8 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }],
  },
  {
    id: '5',
    name: 'Kids Class (Ages 6-9)',
    description: 'Builds coordination, focus, and basic grappling skills through games and technique. Emphasis on safety and fun.',
    level: 'Advanced',
    type: 'Adults',
    style: 'Gi',
    schedule: 'T/Th • 7-8 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Coach Liza', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liza' }],
  },
  {
    id: '6',
    name: 'Advanced No-Gi',
    description: 'Explores high percentage transitions, leg entanglements, and situational sparring. Best for experienced students.',
    level: 'Advanced',
    type: 'Adults',
    style: 'No Gi',
    schedule: 'Sa/Su • 12-1 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' }],
  },
  {
    id: '7',
    name: 'Jiujitsu Fit',
    description: 'Conditioning class using jiu-jitsu based movements and drills. No sparring. Focuses on agility, endurance, and body control.',
    level: 'All Levels',
    type: 'Adults',
    style: 'No Gi',
    schedule: 'M/W/F • 12-1 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Coach Liza', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liza' }],
  },
  {
    id: '8',
    name: 'Women\'s BJJ',
    description: 'Technique focused class with optional sparring, designed to create a welcoming space for women to build skills and confidence.',
    level: 'All Levels',
    type: 'Women',
    style: 'Gi',
    schedule: 'M/W/F • 5-6 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' }],
  },
  {
    id: '9',
    name: 'Judo Fundamentals',
    description: 'Fundamentals of Judo including breakfalls, technique (tachiwaza), holds (newaza), and Judo rules. No randori.',
    level: 'Beginner',
    type: 'Adults',
    style: 'Judo Gi',
    schedule: 'T/Th • 5-6 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Sensei Nakayama', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nakayama' }],
  },
];

export function ClassesPage() {
  const t = useTranslations('ClassesPage');
  const [viewType, setViewType] = useState('grid');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Controls Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Location Dropdown */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-2 text-xs text-foreground hover:bg-muted sm:gap-2 sm:px-3 sm:text-sm"
            >
              <span className="hidden sm:inline">{t('location_label')}</span>
              <span className="sm:hidden">Loc</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Arrange Dropdown */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-2 text-xs text-foreground hover:bg-muted sm:gap-2 sm:px-3 sm:text-sm"
            >
              <span className="hidden sm:inline">{t('arrange_label')}</span>
              <span className="sm:hidden">Arr</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Filter Dropdown */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-2 text-xs text-foreground hover:bg-muted sm:gap-2 sm:px-3 sm:text-sm"
            >
              <span className="hidden sm:inline">{t('filter_label')}</span>
              <span className="sm:hidden">Flt</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Toggle Button Group */}
            <ButtonGroupRoot value={viewType} onValueChange={setViewType}>
              <ButtonGroupItem value="list" title="List view">
                <List className="h-4 w-4" />
                <span className="ml-1 hidden text-xs sm:ml-2 sm:inline">{t('list_view_label')}</span>
              </ButtonGroupItem>
              <ButtonGroupItem value="grid" title="Grid view">
                <Grid3x3 className="h-4 w-4" />
                <span className="ml-1 hidden text-xs sm:ml-2 sm:inline">{t('grid_view_label')}</span>
              </ButtonGroupItem>
            </ButtonGroupRoot>

            {/* Add New Class Button */}
            <Button>
              <Plus className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">{t('add_new_class_button')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Classes Container - Dynamic Grid or List */}
      <div className={viewType === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>
        {mockClasses.map(classItem => (
          <ClassCard key={classItem.id} {...classItem} />
        ))}
      </div>
    </div>
  );
}
