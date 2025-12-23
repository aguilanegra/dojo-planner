'use client';

import type { AddClassWizardData } from '@/hooks/useAddClassWizard';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { mockClassTags } from '../classTagsData';

type ClassTagsStepProps = {
  data: AddClassWizardData;
  onUpdate: (updates: Partial<AddClassWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
};

export const ClassTagsStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
  onCancel,
  isLoading,
  error,
}: ClassTagsStepProps) => {
  const t = useTranslations('AddClassWizard.ClassTagsStep');

  const handleTagToggle = (tagId: string) => {
    const currentTags = data.tags;
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(t => t !== tagId)
      : [...currentTags, tagId];
    onUpdate({ tags: newTags });
  };

  const handleRemoveTag = (tagId: string) => {
    onUpdate({ tags: data.tags.filter(t => t !== tagId) });
  };

  const selectedTagObjects = mockClassTags.filter(tag => data.tags.includes(tag.id));
  const availableTags = mockClassTags.filter(tag => !data.tags.includes(tag.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Selected Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('selected_tags_label')}</label>
          <div className="min-h-[48px] rounded-lg border border-border bg-background p-3">
            {selectedTagObjects.length === 0
              ? (
                  <p className="text-sm text-muted-foreground">{t('no_tags_selected')}</p>
                )
              : (
                  <div className="flex flex-wrap gap-2">
                    {selectedTagObjects.map(tag => (
                      <div
                        key={tag.id}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag.id)}
                          className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                          aria-label={t('remove_tag_aria', { tag: tag.name })}
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
          </div>
        </div>

        {/* Available Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('available_tags_label')}</label>
          <div className="rounded-lg border border-border bg-background p-4">
            {availableTags.length === 0
              ? (
                  <p className="text-sm text-muted-foreground">{t('all_tags_selected')}</p>
                )
              : (
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                        <span className="text-xs text-muted-foreground">
                          (
                          {tag.usageCount}
                          )
                        </span>
                      </button>
                    ))}
                  </div>
                )}
          </div>
          <p className="text-xs text-muted-foreground">{t('tags_help')}</p>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} disabled={isLoading}>
            {t('back_button')}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {t('cancel_button')}
          </Button>
        </div>
        <Button onClick={onNext} disabled={isLoading}>
          {isLoading ? t('creating_button') : t('finish_button')}
        </Button>
      </div>
    </div>
  );
};
