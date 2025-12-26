'use client';

import type { MembershipStatus, MembershipType } from '@/hooks/useAddMembershipWizard';
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

const MAX_DESCRIPTION_LENGTH = 2000;

type EditMembershipBasicsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  membershipName: string;
  status: MembershipStatus;
  membershipType: MembershipType;
  description: string;
  onSave: (data: {
    membershipName: string;
    status: MembershipStatus;
    membershipType: MembershipType;
    description: string;
  }) => void;
};

export function EditMembershipBasicsModal({
  isOpen,
  onClose,
  membershipName: initialName,
  status: initialStatus,
  membershipType: initialType,
  description: initialDescription,
  onSave,
}: EditMembershipBasicsModalProps) {
  const t = useTranslations('MembershipDetailPage.EditBasicsModal');

  const [membershipName, setMembershipName] = useState(initialName);
  const [status, setStatus] = useState<MembershipStatus>(initialStatus);
  const [membershipType, setMembershipType] = useState<MembershipType>(initialType);
  const [description, setDescription] = useState(initialDescription);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isNameInvalid = touched.membershipName && !membershipName.trim();
  const isDescriptionInvalid = touched.description && !description.trim();

  const isFormValid = membershipName.trim() !== '' && description.trim() !== '';

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave({
      membershipName,
      status,
      membershipType,
      description,
    });
    setIsLoading(false);
  };

  const handleCancel = () => {
    setMembershipName(initialName);
    setStatus(initialStatus);
    setMembershipType(initialType);
    setDescription(initialDescription);
    setTouched({});
    onClose();
  };

  // Reset state when modal opens with new data
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setMembershipName(initialName);
      setStatus(initialStatus);
      setMembershipType(initialType);
      setDescription(initialDescription);
      setTouched({});
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

        <div className="space-y-6 py-4">
          {/* Membership Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('name_label')}</label>
            <Input
              placeholder={t('name_placeholder')}
              value={membershipName}
              onChange={e => setMembershipName(e.target.value)}
              onBlur={() => handleInputBlur('membershipName')}
              error={isNameInvalid}
            />
            {isNameInvalid && (
              <p className="text-xs text-destructive">{t('name_error')}</p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('status_label')}</label>
            <div className="flex items-center gap-3">
              <Switch
                checked={status === 'active'}
                onCheckedChange={checked => setStatus(checked ? 'active' : 'inactive')}
              />
              <span className="text-sm text-muted-foreground">
                {status === 'active' ? t('status_active') : t('status_inactive')}
              </span>
            </div>
          </div>

          {/* Membership Type Selection Cards */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('type_label')}</label>
            <div className="grid grid-cols-2 gap-3">
              {/* Standard Membership Card */}
              <button
                type="button"
                onClick={() => setMembershipType('standard')}
                className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${
                  membershipType === 'standard'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <span className="font-medium text-foreground">{t('type_standard')}</span>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('type_standard_help')}
                </p>
              </button>

              {/* Trial Membership Card */}
              <button
                type="button"
                onClick={() => setMembershipType('trial')}
                className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${
                  membershipType === 'trial'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <span className="font-medium text-foreground">{t('type_trial')}</span>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('type_trial_help')}
                </p>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('description_label')}</label>
            <Textarea
              placeholder={t('description_placeholder')}
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
              onBlur={() => handleInputBlur('description')}
              error={isDescriptionInvalid}
              rows={4}
            />
            <div className="flex justify-between">
              {isDescriptionInvalid
                ? (
                    <p className="text-xs text-destructive">{t('description_error')}</p>
                  )
                : (
                    <span />
                  )}
              <p className="text-xs text-muted-foreground">
                {t('description_character_count', { count: description.length, max: MAX_DESCRIPTION_LENGTH })}
              </p>
            </div>
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
