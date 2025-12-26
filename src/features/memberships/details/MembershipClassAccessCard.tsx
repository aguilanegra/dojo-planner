'use client';

import type { ClassLimitType } from '@/hooks/useAddMembershipWizard';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mock class data to match wizard - in real app, this would come from API
const MOCK_CLASSES: { id: string; name: string }[] = [
  { id: 'fundamentals', name: 'Fundamentals' },
  { id: 'intro-bjj', name: 'Intro to BJJ' },
  { id: 'no-gi', name: 'No-Gi' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'open-mat', name: 'Open Mat' },
  { id: 'competition-team', name: 'Competition Team' },
  { id: 'kids-fundamentals', name: 'Kids Fundamentals' },
  { id: 'kids-advanced', name: 'Kids Advanced' },
];

type MembershipClassAccessCardProps = {
  classLimitType: ClassLimitType;
  classLimitCount: number | null;
  availableClasses: string[];
  onEdit: () => void;
};

export function MembershipClassAccessCard({
  classLimitType,
  classLimitCount,
  availableClasses,
  onEdit,
}: MembershipClassAccessCardProps) {
  const t = useTranslations('MembershipDetailPage.ClassAccessCard');

  const accessLabel = classLimitType === 'unlimited'
    ? t('access_unlimited')
    : t('access_limited', { count: classLimitCount ?? 0 });

  // Get class names from IDs
  const classNames = availableClasses.map((classId) => {
    const classItem = MOCK_CLASSES.find(c => c.id === classId);
    return classItem?.name ?? classId;
  });

  return (
    <Card className="flex flex-col p-6">
      <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>

      <div className="mt-6 flex-1 space-y-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">{t('class_limit_label')}</span>
          <p className="mt-1 text-foreground">{accessLabel}</p>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground">{t('available_classes_label')}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {classNames.map((className, index) => (
              <Badge key={availableClasses[index]} variant="secondary">
                {className}
              </Badge>
            ))}
            {classNames.length === 0 && (
              <p className="text-sm text-muted-foreground">{t('no_classes')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
