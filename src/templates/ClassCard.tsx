'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export type ClassCardProps = {
  id: string;
  name: string;
  description: string;
  level: string;
  type: string;
  style: string;
  schedule: string;
  location: string;
  instructors: Array<{
    name: string;
    photoUrl: string;
  }>;
};

function getLevelColor(level: string): 'default' | 'secondary' | 'destructive' | 'outline' {
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

function getInitials(name: string) {
  const parts = name.split(' ');
  return parts.map(part => part[0]).join('').toUpperCase();
}

export const ClassCard = (props: ClassCardProps) => {
  const { name, description, level, type, style, schedule, location, instructors } = props;

  return (
    <Card className="overflow-hidden p-6">
      <div className="space-y-4">
        {/* Title and Level */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={getLevelColor(level)}>{level}</Badge>
          <Badge variant="outline">{type}</Badge>
          <Badge variant="outline">{style}</Badge>
        </div>

        {/* Details */}
        <div className="space-y-2 border-t border-border pt-4">
          <div className="text-sm">
            <p className="text-muted-foreground">Schedule</p>
            <p className="font-medium text-foreground">{schedule}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium text-foreground">{location}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Instructors</p>
            <div className="mt-2 flex flex-col gap-2">
              {instructors.map(instructor => (
                <div key={instructor.name} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={instructor.photoUrl} alt={instructor.name} />
                    <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">{instructor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
