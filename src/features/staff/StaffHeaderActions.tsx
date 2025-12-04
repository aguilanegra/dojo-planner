'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InviteStaffModal } from './InviteStaffModal';

export function StaffHeaderActions() {
  const t = useTranslations('Staff');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button data-testid="invite-staff-button" onClick={() => setIsModalOpen(true)}>
        <Plus className="mr-0.5 h-4 w-4" />
        {t('invite_staff_button')}
      </Button>
      <InviteStaffModal
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
      />
    </div>
  );
}
