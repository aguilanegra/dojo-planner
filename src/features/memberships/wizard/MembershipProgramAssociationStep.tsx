'use client';

import type { AddMembershipWizardData } from '@/hooks/useAddMembershipWizard';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { client } from '@/libs/Orpc';

type WaiverOption = {
  id: string;
  name: string;
  version: number;
};

type MembershipProgramAssociationStepProps = {
  data: AddMembershipWizardData;
  onUpdate: (updates: Partial<AddMembershipWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  error?: string | null;
};

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

export const MembershipProgramAssociationStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
  onCancel,
  error,
}: MembershipProgramAssociationStepProps) => {
  const t = useTranslations('AddMembershipWizard.MembershipProgramAssociationStep');
  const [waiverOptions, setWaiverOptions] = useState<WaiverOption[]>([]);
  const [waiversLoading, setWaiversLoading] = useState(true);

  useEffect(() => {
    const fetchWaivers = async () => {
      try {
        setWaiversLoading(true);
        const result = await client.waivers.listActiveTemplates();
        const options: WaiverOption[] = (result.templates || []).map((template: { id: string; name: string; version: number }) => ({
          id: template.id,
          name: template.name,
          version: template.version,
        }));
        setWaiverOptions(options);
      } catch {
        setWaiverOptions([]);
      } finally {
        setWaiversLoading(false);
      }
    };

    fetchWaivers();
  }, []);

  const handleProgramChange = (programId: string) => {
    const selectedProgram = ACTIVE_PROGRAMS.find(p => p.id === programId);
    onUpdate({
      associatedProgramId: programId,
      associatedProgramName: selectedProgram?.name ?? null,
    });
  };

  const handleWaiverChange = (waiverId: string) => {
    const selectedWaiver = waiverOptions.find(w => w.id === waiverId);
    onUpdate({
      associatedWaiverId: waiverId,
      associatedWaiverName: selectedWaiver ? `${selectedWaiver.name} (v${selectedWaiver.version})` : null,
    });
  };

  const isProgramSelected = data.associatedProgramId !== null && data.associatedProgramId !== '';
  const isWaiverSelected = data.associatedWaiverId !== null && data.associatedWaiverId !== '';
  const isFormValid = isProgramSelected && isWaiverSelected;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Program Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('program_label')}</label>
          <Select
            value={data.associatedProgramId ?? ''}
            onValueChange={handleProgramChange}
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

        {/* Waiver Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('waiver_label')}</label>
          <Select
            value={data.associatedWaiverId ?? ''}
            onValueChange={handleWaiverChange}
            disabled={waiversLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={waiversLoading ? t('waiver_loading') : t('waiver_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {waiverOptions.map(waiver => (
                <SelectItem key={waiver.id} value={waiver.id}>
                  {waiver.name}
                  {' '}
                  (v
                  {waiver.version}
                  )
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{t('waiver_help')}</p>
        </div>
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
        <Button onClick={onNext} disabled={!isFormValid}>
          {t('next_button')}
        </Button>
      </div>
    </div>
  );
};
