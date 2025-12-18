'use client';

import type { MembershipTag } from './membershipTagsData';
import { Plus, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { mockMembershipTags } from './membershipTagsData';

type MembershipTagsManagementProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MembershipTagsManagement({ open, onOpenChange }: MembershipTagsManagementProps) {
  const t = useTranslations('MembershipTagsManagement');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockMembershipTags;
    }
    const query = searchQuery.toLowerCase();
    return mockMembershipTags.filter(
      tag =>
        tag.name.toLowerCase().includes(query)
        || tag.membershipNames.some(membershipName => membershipName.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[50vw] sm:max-w-3xl">
        <SheetHeader className="pt-10 pb-4">
          <SheetTitle className="text-xl">{t('title')}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          {/* Search and Add New Tag Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9"
                aria-label={t('search_placeholder')}
              />
            </div>
            <Button>
              <Plus className="mr-1 size-4" />
              {t('add_new_tag_button')}
            </Button>
          </div>

          {/* Tags Table */}
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="w-[200px] px-6 py-3 text-left text-sm font-semibold text-foreground">{t('tag_name_column')}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t('usage_column')}</th>
                    <th className="w-[150px] px-6 py-3 text-right text-sm font-semibold text-foreground">{t('actions_column')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTags.length === 0
                    ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-muted-foreground">
                            {t('no_tags_found')}
                          </td>
                        </tr>
                      )
                    : (
                        filteredTags.map(tag => (
                          <MembershipTagRow key={tag.id} tag={tag} />
                        ))
                      )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type MembershipTagRowProps = {
  tag: MembershipTag;
};

function MembershipTagRow({ tag }: MembershipTagRowProps) {
  const t = useTranslations('MembershipTagsManagement');

  return (
    <tr className="border-b border-border hover:bg-secondary/30">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className="size-4 rounded"
            style={{ backgroundColor: tag.color }}
            aria-hidden="true"
          />
          <span className="font-medium text-foreground">{tag.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-primary">{tag.usageCount}</span>
          <span className="text-sm text-muted-foreground">
            {tag.membershipNames.join(', ')}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm">
            {t('edit_button')}
          </Button>
          <Button variant="destructive" size="sm">
            {t('delete_button')}
          </Button>
        </div>
      </td>
    </tr>
  );
}
