'use client';

import type { ClassLevel } from '@/app/[locale]/(auth)/dashboard/classes/[classId]/page';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type ClassStatsCardProps = {
  activeEnrollments: number;
  averageAttendance: number;
  totalSessions: number;
  level: ClassLevel;
};

function getLevelVariant(level: ClassLevel): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (level) {
    case 'Beginner':
      return 'default';
    case 'Intermediate':
      return 'secondary';
    case 'Advanced':
      return 'destructive';
    case 'All Levels':
      return 'outline';
    default:
      return 'outline';
  }
}

export function ClassStatsCard({
  activeEnrollments,
  averageAttendance,
  totalSessions,
  level,
}: ClassStatsCardProps) {
  const t = useTranslations('ClassDetailPage.StatsCard');

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Badge variant={getLevelVariant(level)} className="text-sm">
            {level}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{activeEnrollments}</p>
            <p className="text-sm text-muted-foreground">{t('active_enrollments')}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{averageAttendance}</p>
            <p className="text-sm text-muted-foreground">{t('average_attendance')}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
            <p className="text-sm text-muted-foreground">{t('total_sessions')}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
