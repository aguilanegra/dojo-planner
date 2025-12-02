'use client';

import { ChevronDown, Grid3x3, List, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { ClassCard } from '@/templates/ClassCard';
import { mockClasses } from './classesData';

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
