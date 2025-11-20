'use client';

import type { AddMemberWizardData } from '@/hooks/useAddMemberWizard';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type MemberPhotoStepProps = {
  data: AddMemberWizardData;
  onUpdate: (updates: Partial<AddMemberWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
};

export const MemberPhotoStep = ({ onUpdate, onNext, onBack, onCancel }: MemberPhotoStepProps) => {
  const t = useTranslations('AddMemberWizard.MemberPhotoStep');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        // eslint-disable-next-line no-alert
        alert(t('invalid_file_type'));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onUpdate({ photoFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect({ target: { files: event.dataTransfer.files } } as any);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        {preview
          ? (
              <div className="flex flex-col items-center gap-4">
                <Image src={preview} alt="Preview" width={192} height={192} className="rounded-lg object-cover" />
                <Button
                  variant="outline"
                  onClick={() => {
                    setPreview(null);
                    onUpdate({ photoFile: null });
                  }}
                >
                  {t('remove_photo_button')}
                </Button>
              </div>
            )
          : (
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="rounded-lg border-2 border-dashed border-border bg-accent/50 p-8 text-center"
              >
                <p className="mb-4 text-sm font-medium text-foreground">
                  {t('drop_text')}
                </p>
                <p className="mb-4 text-xs text-muted-foreground">{t('file_types')}</p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-input"
                  aria-label={t('choose_file_button')}
                />
                <label htmlFor="photo-input" className="inline-block cursor-pointer">
                  {t('choose_file_button')}
                  <Button asChild variant="outline" className="ml-2">
                    <span>Upload</span>
                  </Button>
                </label>
              </div>
            )}
      </div>

      <div className="flex justify-between gap-3 pt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            {t('back_button')}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {t('cancel_button')}
          </Button>
        </div>
        <Button onClick={onNext}>
          {t('next_button')}
        </Button>
      </div>
    </div>
  );
};
