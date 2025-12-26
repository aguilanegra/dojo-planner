'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Input } from '@/components/ui/input/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';

export type FinancesFilters = {
  search: string;
  purpose: string;
};

type FinancesFilterBarProps = {
  onFiltersChangeAction: (filters: FinancesFilters) => void;
  availablePurposes: string[];
};

export function FinancesFilterBar({
  onFiltersChangeAction,
  availablePurposes,
}: FinancesFilterBarProps) {
  const t = useTranslations('FinancesPage');
  const [filters, setFilters] = useState<FinancesFilters>({
    search: '',
    purpose: 'all',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFiltersChangeAction(newFilters);
  };

  const handlePurposeChange = (value: string) => {
    const newFilters = { ...filters, purpose: value };
    setFilters(newFilters);
    onFiltersChangeAction(newFilters);
  };

  const purposeOptions = [
    { value: 'all', label: t('all_purposes_filter') },
    ...availablePurposes.map(purpose => ({
      value: purpose,
      label: purpose,
    })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 sm:max-w-xs sm:flex-initial">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('search_placeholder')}
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-9"
          data-testid="finances-search-input"
        />
      </div>

      {/* Purpose Filter */}
      <Select value={filters.purpose} onValueChange={handlePurposeChange}>
        <SelectTrigger className="w-full sm:w-48" data-testid="finances-purpose-filter">
          <SelectValue placeholder={t('all_purposes_filter')} />
        </SelectTrigger>
        <SelectContent>
          {purposeOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
