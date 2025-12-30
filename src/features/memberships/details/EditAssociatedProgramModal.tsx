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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock programs data - in real app, this would come from API
const MOCK_PROGRAMS = [
  { id: '1', name: 'Adult Brazilian Jiu-jitsu', status: 'active' as const },
  { id: '2', name: 'Kids Program', status: 'active' as const },
  { id: '3', name: 'Competition Team', status: 'active' as const },
  { id: '4', name: 'Judo Fundamentals', status: 'active' as const },
  { id: '5', name: 'Wrestling Fundamentals', status: 'inactive' as const },
];

// Only show active programs in the dropdown
const ACTIVE_PROGRAMS = MOCK_PROGRAMS.filter(p => p.status === 'active');

type EditAssociatedProgramModalProps = {
  isOpen: boolean;
  onClose: () => void;
  associatedProgramId: string | null;
  onSave: (data: {
    associatedProgramId: string | null;
    associatedProgramName: string | null;
  }) => void;
};

export function EditAssociatedProgramModal({
  isOpen,
  onClose,
  associatedProgramId: initialProgramId,
  onSave,
}: EditAssociatedProgramModalProps) {
  const t = useTranslations('MembershipDetailPage.EditAssociatedProgramModal');

  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(initialProgramId);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProgram = ACTIVE_PROGRAMS.find(p => p.id === selectedProgramId);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave({
      associatedProgramId: selectedProgramId,
      associatedProgramName: selectedProgram?.name ?? null,
    });
    setIsLoading(false);
  };

  const handleCancel = () => {
    setSelectedProgramId(initialProgramId);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSelectedProgramId(initialProgramId);
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
          {/* Program Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('program_label')}</label>
            <Select
              value={selectedProgramId ?? ''}
              onValueChange={(value: string) => setSelectedProgramId(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('program_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {ACTIVE_PROGRAMS.map(program => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t('program_help')}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              {t('cancel_button')}
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedProgramId || isLoading}>
              {isLoading ? t('saving_button') : t('save_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
