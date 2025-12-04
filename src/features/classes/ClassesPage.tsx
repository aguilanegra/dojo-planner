'use client';

import { Grid3x3, List, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockClasses = [
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

function getLevelColor(level: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (level) {
    case 'Beginner':
      return 'default';
    case 'Intermediate':
      return 'secondary';
    case 'Advanced':
      return 'destructive';
    case 'All Levels':
      return 'outline';
    default:
      return 'outline';
  }
}

function getInitials(name: string) {
  const parts = name.split(' ');
  return parts.map(part => part[0]).join('').toUpperCase();
}

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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Location Dropdown */}
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('location_label')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('location_label')}</SelectItem>
                <SelectItem value="downtown">Downtown HQ</SelectItem>
                <SelectItem value="northside">Northside Branch</SelectItem>
                <SelectItem value="eastside">Eastside Dojo</SelectItem>
              </SelectContent>
            </Select>

            {/* Arrange Dropdown */}
            <Select defaultValue="name-asc">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('arrange_label')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">{t('arrange_label')}</SelectItem>
                <SelectItem value="name-desc">Name (Z to A)</SelectItem>
                <SelectItem value="level-beginner">Level (Beginner First)</SelectItem>
                <SelectItem value="level-advanced">Level (Advanced First)</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Dropdown */}
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('filter_label')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filter_label')}</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="adults">Adults</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
                <SelectItem value="gi">Gi Classes</SelectItem>
                <SelectItem value="nogi">No-Gi Classes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle Button Group */}
            <ButtonGroupRoot value={viewType} onValueChange={setViewType}>
              <ButtonGroupItem value="list" title="List view">
                <List className="h-4 w-4" />
                <span className="ml-2 text-xs">{t('list_view_label')}</span>
              </ButtonGroupItem>
              <ButtonGroupItem value="grid" title="Grid view">
                <Grid3x3 className="h-4 w-4" />
                <span className="ml-2 text-xs">{t('grid_view_label')}</span>
              </ButtonGroupItem>
            </ButtonGroupRoot>

            {/* Add New Class Button */}
            <Button>
              <Plus className="h-4 w-4" />
              {t('add_new_class_button')}
            </Button>
          </div>
        </div>
      </div>

      {/* Classes Container - Dynamic Grid or List */}
      <div className={viewType === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>
        {mockClasses.map(classItem => (
          <Card key={classItem.id} className="overflow-hidden p-6">
            <div className="space-y-4">
              {/* Title and Level */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{classItem.name}</h3>
                <p className="text-sm text-muted-foreground">{classItem.description}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={getLevelColor(classItem.level)}>{classItem.level}</Badge>
                <Badge variant="outline">{classItem.type}</Badge>
                <Badge variant="outline">{classItem.style}</Badge>
              </div>

              {/* Details */}
              <div className="space-y-2 border-t border-border pt-4">
                <div className="text-sm">
                  <p className="text-muted-foreground">Schedule</p>
                  <p className="font-medium text-foreground">{classItem.schedule}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{classItem.location}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Instructors</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {classItem.instructors.map(instructor => (
                      <div key={instructor.name} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={instructor.photoUrl} alt={instructor.name} />
                          <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{instructor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
