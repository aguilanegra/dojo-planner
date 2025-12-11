'use client';

import type { ProgramFilters } from '@/features/programs/ProgramFilterBar';
import type { ProgramCardProps, ProgramStatus } from '@/templates/ProgramCard';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgramFilterBar } from '@/features/programs/ProgramFilterBar';
import { ProgramCard } from '@/templates/ProgramCard';

type Program = {
  id: string;
  name: string;
  description: string;
  classCount: number;
  classNames: string;
  status: ProgramStatus;
};

const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'Adult Brazilian Jiu-jitsu',
    description: 'Traditional Brazilian Jiu-Jitsu program for adults focusing on self-defense, competition, and fitness.',
    classCount: 5,
    classNames: 'BJJ Fundamentals I & II, Intermediate, Advanced, Advanced No-Gi',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Kids Program',
    description: 'Fun and engaging martial arts program designed specifically for children ages 6-12.',
    classCount: 2,
    classNames: 'Kids Class (Ages 6-9), Kids Class (Ages 10-12)',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Competition Team',
    description: 'Elite training program for competitive athletes with advanced techniques and intensive conditioning.',
    classCount: 3,
    classNames: 'Competition Team Training, Advanced Sparring, Competition Prep',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Judo Fundamentals',
    description: 'Traditional Judo program focusing on throws, breakfalls, and Olympic-style techniques.',
    classCount: 1,
    classNames: 'Judo Fundamentals',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Wrestling Fundamentals',
    description: 'Traditional Wrestling program focusing on takedowns, mat control, and collegiate-style techniques.',
    classCount: 1,
    classNames: 'Wrestling Fundamentals',
    status: 'Inactive',
  },
];

function handleEditProgram(_id: string) {
  // Placeholder for edit functionality - will be implemented when edit modal is added
}

function handleDeleteProgram(_id: string) {
  // Placeholder for delete functionality - will be implemented when delete confirmation is added
}

export default function ProgramsPage() {
  const t = useTranslations('ProgramsPage');
  const [filters, setFilters] = useState<ProgramFilters>({
    search: '',
    status: 'all',
  });

  const stats = useMemo(() => ({
    totalPrograms: mockPrograms.length,
    active: mockPrograms.filter(p => p.status === 'Active').length,
    totalClasses: mockPrograms.reduce((sum, p) => sum + p.classCount, 0),
  }), []);

  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter((program) => {
      // Search filter
      const matchesSearch = program.name.toLowerCase().includes(filters.search.toLowerCase())
        || program.description.toLowerCase().includes(filters.search.toLowerCase());

      // Status filter
      const matchesStatus = filters.status === 'all' || program.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [filters]);

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('total_programs_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalPrograms}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('active_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('total_classes_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalClasses}</div>
        </Card>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Filter Bar and Add Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-1">
          <ProgramFilterBar
            onFiltersChangeAction={setFilters}
          />
        </div>

        <Button>
          <Plus className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">{t('add_new_program_button')}</span>
        </Button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredPrograms.length === 0
          ? (
              <div className="col-span-full p-8 text-center text-muted-foreground">
                {t('no_programs_found')}
              </div>
            )
          : (
              filteredPrograms.map((program) => {
                const cardProps: ProgramCardProps = {
                  id: program.id,
                  name: program.name,
                  description: program.description,
                  classCount: program.classCount,
                  classNames: program.classNames,
                  status: program.status,
                  onEdit: handleEditProgram,
                  onDelete: handleDeleteProgram,
                };

                return <ProgramCard key={program.id} {...cardProps} />;
              })
            )}
      </div>
    </div>
  );
}
