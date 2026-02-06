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

type EditMergeFieldModalProps = {
  isOpen: boolean;
  onClose: () => void;
  field: {
    id: string;
    key: string;
    label: string;
    defaultValue: string;
    description: string | null;
  };
  onSave: (data: { id: string; label?: string; defaultValue?: string; description?: string | null }) => Promise<void>;
};

export function EditMergeFieldModal({
  isOpen,
  onClose,
  field,
  onSave,
}: EditMergeFieldModalProps) {
  const t = useTranslations('EditMergeFieldModal');

  const [label, setLabel] = useState(field.label);
  const [defaultValue, setDefaultValue] = useState(field.defaultValue);
  const [description, setDescription] = useState(field.description ?? '');
  const [touched, setTouched] = useState({ label: false, defaultValue: false });
  const [isLoading, setIsLoading] = useState(false);

  const isLabelError = touched.label && !label.trim();
  const isDefaultValueError = touched.defaultValue && !defaultValue.trim();
  const isFormValid = label.trim() && defaultValue.trim();

  const resetState = () => {
    setLabel(field.label);
    setDefaultValue(field.defaultValue);
    setDescription(field.description ?? '');
    setTouched({ label: false, defaultValue: false });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave({
        id: field.id,
        label: label.trim(),
        defaultValue: defaultValue.trim(),
        description: description.trim() || null,
      });
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
          {/* Key (read-only) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('key_label')}</label>
            <Input
              value={`<${field.key}>`}
              disabled
            />
            <p className="text-xs text-muted-foreground">{t('key_readonly_help')}</p>
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
