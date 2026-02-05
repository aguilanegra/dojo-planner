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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const MAX_DESCRIPTION_LENGTH = 500;
const MAX_CONTENT_LENGTH = 50000;
const MIN_CONTENT_LENGTH = 100;

type AddWaiverFormData = {
  name: string;
  content: string;
  description: string | null;
  isActive: boolean;
  isDefault: boolean;
  requiresGuardian: boolean;
  guardianAgeThreshold: number;
};

type AddWaiverModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddWaiverFormData) => Promise<void>;
};

export function AddWaiverModal({ isOpen, onClose, onSave }: AddWaiverModalProps) {
  const t = useTranslations('WaiversPage.AddWaiverModal');

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [requiresGuardian, setRequiresGuardian] = useState(true);
  const [guardianAgeThreshold, setGuardianAgeThreshold] = useState(16);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isNameInvalid = touched.name && !name.trim();
  const isContentInvalid = touched.content && content.trim().length < MIN_CONTENT_LENGTH;
  const isFormValid = name.trim() !== '' && content.trim().length >= MIN_CONTENT_LENGTH;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave({
        name,
        content,
        description: description.trim() || null,
        isActive,
        isDefault,
        requiresGuardian,
        guardianAgeThreshold,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setName('');
    setContent('');
    setDescription('');
    setIsActive(true);
    setIsDefault(false);
    setRequiresGuardian(true);
    setGuardianAgeThreshold(16);
    setTouched({});
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

        <div className="space-y-6 py-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('name_label')}</label>
            <Input
              placeholder={t('name_placeholder')}
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => handleInputBlur('name')}
              error={isNameInvalid}
            />
            {isNameInvalid && (
              <p className="text-xs text-destructive">{t('name_error')}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('description_label')}</label>
            <Textarea
              placeholder={t('description_placeholder')}
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              {t('description_character_count', { count: description.length, max: MAX_DESCRIPTION_LENGTH })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('content_label')}</label>
            <Textarea
              placeholder={t('content_placeholder')}
              value={content}
              onChange={e => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
              onBlur={() => handleInputBlur('content')}
              error={isContentInvalid}
              rows={10}
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

          {/* Toggles Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Status Toggle */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('status_label')}</label>
              <div className="flex items-center gap-3">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <span className="text-sm text-muted-foreground">
                  {isActive ? t('status_active') : t('status_inactive')}
                </span>
              </div>
            </div>

            {/* Default Toggle */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('default_label')}</label>
              <div className="flex items-center gap-3">
                <Switch checked={isDefault} onCheckedChange={setIsDefault} />
                <span className="text-sm text-muted-foreground">
                  {isDefault ? t('default_yes') : t('default_no')}
                </span>
              </div>
            </div>

            {/* Guardian Toggle */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('guardian_label')}</label>
              <div className="flex items-center gap-3">
                <Switch checked={requiresGuardian} onCheckedChange={setRequiresGuardian} />
                <span className="text-sm text-muted-foreground">
                  {requiresGuardian ? t('guardian_yes') : t('guardian_no')}
                </span>
              </div>
            </div>

            {/* Guardian Age Threshold */}
            {requiresGuardian && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{t('guardian_age_label')}</label>
                <Input
                  type="number"
                  min={13}
                  max={21}
                  value={guardianAgeThreshold}
                  onChange={e => setGuardianAgeThreshold(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">{t('guardian_age_help')}</p>
              </div>
            )}
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
