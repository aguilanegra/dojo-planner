'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';

export type ClassFilters = {
  search: string;
  tag: string;
  instructor: string;
};

type ClassFilterBarProps = {
  onFiltersChange: (filters: ClassFilters) => void;
  instructors: string[];
};

export function ClassFilterBar({ onFiltersChange, instructors }: ClassFilterBarProps) {
  const [filters, setFilters] = useState<ClassFilters>({
    search: '',
    tag: 'all',
    instructor: 'all',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTagChange = (value: string) => {
    const newFilters = { ...filters, tag: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleInstructorChange = (value: string) => {
    const newFilters = { ...filters, instructor: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const tags = ['all', 'Adults', 'Kids', 'Women', 'No Gi', 'Gi', 'Competition', 'Open'];
  const uniqueInstructors = ['all', ...new Set(instructors)];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 sm:max-w-xs sm:flex-initial">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search classes..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>

      {/* Tags Dropdown */}
      <Select value={filters.tag} onValueChange={handleTagChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Select tags" />
        </SelectTrigger>
        <SelectContent>
          {tags.map(tag => (
            <SelectItem key={tag} value={tag}>
              {tag === 'all' ? 'All Tags' : tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Instructor Dropdown */}
      <Select value={filters.instructor} onValueChange={handleInstructorChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Select instructor" />
        </SelectTrigger>
        <SelectContent>
          {uniqueInstructors.map(instructor => (
            <SelectItem key={instructor} value={instructor}>
              {instructor === 'all' ? 'All Instructors' : instructor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
