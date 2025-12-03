'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInviteStaffForm } from '@/hooks/useInviteStaffForm';
import { InviteStaffFormContent } from './InviteStaffFormContent';

type InviteStaffModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

export const InviteStaffModal = ({ isOpen, onCloseAction }: InviteStaffModalProps) => {
  const t = useTranslations('Staff.InviteStaffModal');
  const form = useInviteStaffForm();
  const prevIsOpenRef = useRef(isOpen);

  // Reset form when modal closes (not during close, but after)
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      form.reset();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, form]);

  const handleSave = async () => {
    if (!form.isValid()) {
      form.setError(t('validation_error'));
      return;
    }

    try {
      form.setIsLoading(true);
      form.clearError();

      console.info('[Invite Staff] Inviting staff member:', {
        timestamp: new Date().toISOString(),
        data: form.data,
      });

      // TODO: Implement actual API call to invite staff member
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));

      onCloseAction();
    } catch (error) {
      console.error('[Invite Staff] Failed to invite staff member:', error);
      form.setError(t('submit_error'));
    } finally {
      form.setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onCloseAction()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <InviteStaffFormContent
            data={form.data}
            onUpdate={form.updateData}
            onUpdatePermission={form.updatePermission}
            onSave={handleSave}
            onCancel={onCloseAction}
            isLoading={form.isLoading}
            error={form.error}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
