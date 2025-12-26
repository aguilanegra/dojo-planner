'use client';

import type { ClassLimitType } from '@/hooks/useAddMembershipWizard';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock class data - in real app, this would come from API
const MOCK_CLASSES = [
  { id: 'fundamentals', name: 'Fundamentals' },
  { id: 'intro-bjj', name: 'Intro to BJJ' },
  { id: 'no-gi', name: 'No-Gi' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'open-mat', name: 'Open Mat' },
  { id: 'competition-team', name: 'Competition Team' },
  { id: 'kids-fundamentals', name: 'Kids Fundamentals' },
  { id: 'kids-advanced', name: 'Kids Advanced' },
];

type EditClassAccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  classLimitType: ClassLimitType;
  classLimitCount: number | null;
  availableClasses: string[];
  onSave: (data: {
    classLimitType: ClassLimitType;
    classLimitCount: number | null;
    availableClasses: string[];
  }) => void;
};

export function EditClassAccessModal({
  isOpen,
  onClose,
  classLimitType: initialLimitType,
  classLimitCount: initialLimitCount,
  availableClasses: initialClasses,
  onSave,
}: EditClassAccessModalProps) {
  const t = useTranslations('MembershipDetailPage.EditClassAccessModal');

  const [classLimitType, setClassLimitType] = useState<ClassLimitType>(initialLimitType);
  const [classLimitCount, setClassLimitCount] = useState<number | null>(initialLimitCount);
  const [availableClasses, setAvailableClasses] = useState<string[]>(initialClasses);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleClassToggle = (classId: string, checked: boolean) => {
    if (checked) {
      setAvailableClasses(prev => [...prev, classId]);
    } else {
      setAvailableClasses(prev => prev.filter(id => id !== classId));
    }
  };

  const handleSelectAll = () => {
    if (availableClasses.length === MOCK_CLASSES.length) {
      setAvailableClasses([]);
    } else {
      setAvailableClasses(MOCK_CLASSES.map(c => c.id));
    }
  };

  const handleClassLimitCountChange = (value: string) => {
    const numValue = value ? Number.parseInt(value, 10) : null;
    setClassLimitCount(numValue);
  };

  const isClassLimitInvalid = touched.classLimitCount
    && classLimitType === 'limited'
    && (classLimitCount === null || classLimitCount < 1);

  const isClassesInvalid = touched.availableClasses && availableClasses.length === 0;

  const isFormValid = availableClasses.length > 0
    && (classLimitType === 'unlimited' || (classLimitCount !== null && classLimitCount >= 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave({
      classLimitType,
      classLimitCount: classLimitType === 'unlimited' ? null : classLimitCount,
      availableClasses,
    });
    setIsLoading(false);
  };

  const handleCancel = () => {
    setClassLimitType(initialLimitType);
    setClassLimitCount(initialLimitCount);
    setAvailableClasses(initialClasses);
    setTouched({});
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setClassLimitType(initialLimitType);
      setClassLimitCount(initialLimitCount);
      setAvailableClasses(initialClasses);
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
          {/* Class Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('class_limits_label')}</label>
              <Select
                value={classLimitType}
                onValueChange={(value: ClassLimitType) => setClassLimitType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlimited">{t('class_limits_unlimited')}</SelectItem>
                  <SelectItem value="limited">{t('class_limits_limited')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {classLimitType === 'limited' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{t('class_limit_count_label')}</label>
                <Input
                  type="number"
                  placeholder={t('class_limit_count_placeholder')}
                  value={classLimitCount ?? ''}
                  onChange={e => handleClassLimitCountChange(e.target.value)}
                  onBlur={() => handleInputBlur('classLimitCount')}
                  error={isClassLimitInvalid}
                  min={1}
                />
                {isClassLimitInvalid && (
                  <p className="text-xs text-destructive">{t('class_limit_count_error')}</p>
                )}
              </div>
            )}
          </div>

          {/* Available Classes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{t('available_classes_label')}</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
              >
                {availableClasses.length === MOCK_CLASSES.length
                  ? t('deselect_all_button')
                  : t('select_all_button')}
              </Button>
            </div>
            <div
              className="rounded-lg border border-border p-4"
              onBlur={() => handleInputBlur('availableClasses')}
            >
              <div className="grid grid-cols-2 gap-3">
                {MOCK_CLASSES.map(classItem => (
                  <label
                    key={classItem.id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      checked={availableClasses.includes(classItem.id)}
                      onCheckedChange={(checked) => {
                        handleClassToggle(classItem.id, checked === true);
                      }}
                    />
                    <span className="text-sm text-foreground">{classItem.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {isClassesInvalid && (
              <p className="text-xs text-destructive">{t('available_classes_error')}</p>
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
