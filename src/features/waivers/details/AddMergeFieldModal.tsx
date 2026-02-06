'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type AddMergeFieldModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { key: string; label: string; defaultValue: string; description?: string }) => Promise<void>;
};

function formatKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export function AddMergeFieldModal({
  isOpen,
  onClose,
  onSave,
}: AddMergeFieldModalProps) {
  const t = useTranslations('AddMergeFieldModal');

  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState({ key: false, label: false, defaultValue: false });
  const [isLoading, setIsLoading] = useState(false);

  const isKeyValid = /^[a-z][a-z0-9_]*$/.test(key);
  const isKeyError = touched.key && (!key || !isKeyValid);
  const isLabelError = touched.label && !label.trim();
  const isDefaultValueError = touched.defaultValue && !defaultValue.trim();
  const isFormValid = key && isKeyValid && label.trim() && defaultValue.trim();

  const resetState = () => {
    setKey('');
    setLabel('');
    setDefaultValue('');
    setDescription('');
    setTouched({ key: false, label: false, defaultValue: false });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave({
        key,
        label: label.trim(),
        defaultValue: defaultValue.trim(),
        description: description.trim() || undefined,
      });
      resetState();
    } finally {
      setIsLoading(false);
    }
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Key */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('key_label')}</label>
            <Input
              placeholder={t('key_placeholder')}
              value={key}
              onChange={e => setKey(formatKey(e.target.value))}
              onBlur={() => setTouched(prev => ({ ...prev, key: true }))}
              error={isKeyError}
            />
            {isKeyError
              ? <p className="text-xs text-destructive">{t('key_error')}</p>
              : <p className="text-xs text-muted-foreground">{t('key_help')}</p>}
            {key && isKeyValid && (
              <p className="text-xs text-muted-foreground">
                {t('preview_title')}
                {': '}
                <code className="rounded bg-muted px-1">{`<${key}>`}</code>
              </p>
            )}
          </div>

          {/* Label */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('label_label')}</label>
            <Input
              placeholder={t('label_placeholder')}
              value={label}
              onChange={e => setLabel(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, label: true }))}
              error={isLabelError}
            />
            {isLabelError && <p className="text-xs text-destructive">{t('label_error')}</p>}
          </div>

          {/* Default Value */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('default_value_label')}</label>
            <Input
              placeholder={t('default_value_placeholder')}
              value={defaultValue}
              onChange={e => setDefaultValue(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, defaultValue: true }))}
              error={isDefaultValueError}
            />
            {isDefaultValueError && <p className="text-xs text-destructive">{t('default_value_error')}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('description_label')}</label>
            <Textarea
              placeholder={t('description_placeholder')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
            />
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
