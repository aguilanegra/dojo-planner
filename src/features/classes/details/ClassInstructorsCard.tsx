'use client';

import type { ClassInstructor } from '@/app/[locale]/(auth)/dashboard/classes/[classId]/page';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ClassInstructorsCardProps = {
  instructors: ClassInstructor[];
  onEdit: () => void;
};

function getInitials(name: string): string {
  const parts = name.split(' ');
  return parts.map(part => part[0]).join('').toUpperCase();
}

export function ClassInstructorsCard({
  instructors,
  onEdit,
}: ClassInstructorsCardProps) {
  const t = useTranslations('ClassDetailPage.InstructorsCard');

  return (
    <Card className="flex flex-col p-6">
      <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>

      <div className="mt-6 flex-1 space-y-4">
        {instructors.length === 0
          ? (
              <p className="text-sm text-muted-foreground">{t('no_instructors')}</p>
            )
          : (
              <div className="space-y-3">
                {instructors.map(instructor => (
                  <div key={instructor.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={instructor.photoUrl} alt={instructor.name} />
                        <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{instructor.name}</p>
                      </div>
                    </div>
                    <Badge variant={instructor.role === 'primary' ? 'default' : 'secondary'}>
                      {instructor.role === 'primary' ? t('role_primary') : t('role_assistant')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
