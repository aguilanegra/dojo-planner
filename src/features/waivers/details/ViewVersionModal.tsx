'use client';

import type { WaiverMergeField, WaiverTemplate } from '@/services/WaiversService';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ViewVersionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  template: WaiverTemplate | null;
  mergeFields: WaiverMergeField[];
};

export function ViewVersionModal({
  isOpen,
  onClose,
  template,
  mergeFields,
}: ViewVersionModalProps) {
  const t = useTranslations('ViewVersionModal');

  const resolvedContentNodes = useMemo(() => {
    if (!template) {
      return null;
    }

    if (mergeFields.length === 0) {
      return template.content;
    }

    const fieldMap = new Map(mergeFields.map(f => [f.key.toLowerCase(), f.defaultValue]));
    const pattern = new RegExp(
      `(${mergeFields.map(f => `<${f.key}>`).join('|')})`,
      'gi',
    );
    const parts = template.content.split(pattern);

    let mergeFieldCounter = 0;
    return parts.map((part) => {
      const match = part.match(/^<(.+)>$/);
      if (match) {
        const value = fieldMap.get(match[1]!.toLowerCase());
        if (value !== undefined) {
          mergeFieldCounter += 1;
          return (
            <mark key={`mf-${match[1]}-${mergeFieldCounter}`} className="rounded bg-yellow-200 px-0.5 font-bold dark:bg-yellow-800">
              {value}
            </mark>
          );
        }
      }
      return part;
    });
  }, [template, mergeFields]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{template ? t('title', { version: template.version }) : ''}</DialogTitle>
          {template && (
            <p className="text-sm text-muted-foreground">
              {t('version_date', { date: format(template.createdAt, 'MMM d, yyyy') })}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('content_label')}</label>
            <div className="max-h-125 overflow-y-auto rounded-lg border bg-muted/30 p-4">
              <pre className="font-sans text-sm whitespace-pre-wrap">
                {resolvedContentNodes}
              </pre>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              {t('close_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
