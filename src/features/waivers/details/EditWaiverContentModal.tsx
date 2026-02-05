'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const MAX_CONTENT_LENGTH = 50000;
const MIN_CONTENT_LENGTH = 100;

type EditWaiverContentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onSave: (data: { content: string }) => Promise<void>;
};

export function EditWaiverContentModal({
  isOpen,
  onClose,
  content: initialContent,
  onSave,
}: EditWaiverContentModalProps) {
  const t = useTranslations('WaiverDetailPage.EditContentModal');

  const [content, setContent] = useState(initialContent);
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isContentInvalid = touched && content.trim().length < MIN_CONTENT_LENGTH;
  const isFormValid = content.trim().length >= MIN_CONTENT_LENGTH;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave({ content });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setContent(initialContent);
    setTouched(false);
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetState();
    } else {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t('version_warning')}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('content_label')}</label>
            <Textarea
              placeholder={t('content_placeholder')}
              value={content}
              onChange={e => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
              onBlur={() => setTouched(true)}
              error={isContentInvalid}
              rows={16}
            />
            <div className="flex justify-between">
              {isContentInvalid
                ? <p className="text-xs text-destructive">{t('content_error')}</p>
                : <span />}
              <p className="text-xs text-muted-foreground">
                {t('content_character_count', { count: content.length, max: MAX_CONTENT_LENGTH })}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{t('content_help')}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              {t('cancel_button')}
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || isLoading}>
              {isLoading ? t('saving_button') : t('save_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
