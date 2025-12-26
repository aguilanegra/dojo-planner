'use client';

import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type PhoneSupportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Support phone number - not a real user credential, placeholder for demo purposes
const SUPPORT_PHONE_NUMBER = '+1 (555) 123-4567';

export function PhoneSupportModal({ isOpen, onClose }: PhoneSupportModalProps) {
  const t = useTranslations('PhoneSupportModal');

  const handleCallClick = () => {
    window.location.href = `tel:${SUPPORT_PHONE_NUMBER.replaceAll(/\D/g, '')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Phone className="size-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('phone_label')}</p>
            <p className="text-xl font-semibold text-foreground">
              {SUPPORT_PHONE_NUMBER}
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {t('availability_message')}
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleCallClick} className="w-full">
            <Phone className="mr-2 size-4" />
            {t('call_button')}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            {t('close_button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
