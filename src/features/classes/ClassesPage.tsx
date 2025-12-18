'use client';

import type { ClassFilters } from './ClassFilterBar';
import { Grid3x3, List, Plus, Tags } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { ClassCard } from '@/templates/ClassCard';
import { mockClasses } from './classesData';
import { ClassFilterBar } from './ClassFilterBar';
import { ClassTagsManagement } from './ClassTagsManagement';
import { MonthlyView } from './MonthlyView';
import { WeeklyView } from './WeeklyView';

export function ClassesPage() {
  const t = useTranslations('ClassesPage');
  const [viewType, setViewType] = useState('grid');
  const [isTagsSheetOpen, setIsTagsSheetOpen] = useState(false);
  const [filters, setFilters] = useState<ClassFilters>({
    search: '',
    tag: 'all',
    instructor: 'all',
  });

  // Get unique instructors from mockClasses
  const allInstructors = Array.from(
    new Set(mockClasses.flatMap(cls => cls.instructors.map(i => i.name))),
  );

  // Calculate stats
  const stats = useMemo(() => {
    const uniqueTypes = new Set(mockClasses.map(cls => cls.type));
    const uniqueStyles = new Set(mockClasses.map(cls => cls.style));
    const totalTags = uniqueTypes.size + uniqueStyles.size;
    return {
      totalClasses: mockClasses.length,
      totalTags,
      totalInstructors: allInstructors.length,
    };
  }, [allInstructors.length]);

  // Filter classes based on filters
  const filteredClasses = mockClasses.filter((cls) => {
    const matchesSearch = cls.name.toLowerCase().includes(filters.search.toLowerCase())
      || cls.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesTag = filters.tag === 'all' || cls.type === filters.tag || cls.style === filters.tag;
    const matchesInstructor = filters.instructor === 'all'
      || cls.instructors.some(i => i.name === filters.instructor);
    return matchesSearch && matchesTag && matchesInstructor;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('total_classes_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalClasses}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('total_tags_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalTags}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('total_instructors_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalInstructors}</div>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <Button variant="outline" onClick={() => setIsTagsSheetOpen(true)}>
          <Tags className="mr-1 size-4" />
          {t('manage_tags_button')}
        </Button>
      </div>

      {/* Controls - Shown for all views */}
      <div className="space-y-4">
        {/* Controls Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Filter Bar */}
          <div className="flex-1">
            <ClassFilterBar
              onFiltersChangeAction={setFilters}
              instructors={allInstructors}
            />
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
              <ButtonGroupItem value="weekly" title="Weekly view">
                <span className="text-xs">Weekly</span>
              </ButtonGroupItem>
              <ButtonGroupItem value="monthly" title="Monthly view">
                <span className="text-xs">Monthly</span>
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

      {/* Render Views */}
      {viewType === 'monthly' && (
        <MonthlyView withFilters={filters} />
      )}

      {viewType === 'weekly' && (
        <WeeklyView withFilters={filters} />
      )}

      {/* Render Card/List View */}
      {(viewType === 'grid' || viewType === 'list') && (
        <div className={viewType === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>
          {filteredClasses.map(classItem => (
            <ClassCard key={classItem.id} {...classItem} />
          ))}
        </div>
      )}

      {/* Class Tags Management Sheet */}
      <ClassTagsManagement
        open={isTagsSheetOpen}
        onOpenChange={setIsTagsSheetOpen}
      />
    </div>
  );
}
