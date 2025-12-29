'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { mockClasses } from './classesData';

type ClassEventHoverCardProps = {
  classId: string;
  className: string;
  color: string;
  hour?: number;
  minute?: number;
  duration?: number;
  children?: React.ReactNode;
};

function formatTime(hour: number, minute: number): string {
  const amPm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${amPm}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

export function ClassEventHoverCard({
  classId,
  className,
  color,
  hour,
  minute,
  duration,
  children,
}: ClassEventHoverCardProps) {
  const router = useRouter();

  // Find the full class data from mockClasses
  const classData = mockClasses.find(c => c.id === classId);

  const handleClick = () => {
    router.push(`/dashboard/classes/${classId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className="mb-1 w-full cursor-pointer truncate rounded px-2 py-1 text-left text-xs font-medium text-white transition-opacity hover:opacity-80 sm:text-sm"
          style={{ backgroundColor: color }}
        >
          {children || className}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="w-64 rounded-lg border border-border bg-background p-3 text-foreground shadow-lg"
      >
        <div className="space-y-2">
          {/* Class Name */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground">{className}</h4>
            <div
              className="mt-0.5 h-3 w-3 shrink-0 rounded"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* Description */}
          {classData?.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {classData.description}
            </p>
          )}

          {/* Time info if available */}
          {hour !== undefined && minute !== undefined && duration !== undefined && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Time:</span>
              {' '}
              {formatTime(hour, minute)}
              {' '}
              (
              {formatDuration(duration)}
              )
            </div>
          )}

          {/* Badges */}
          {classData && (
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-[10px]">{classData.level}</Badge>
              <Badge variant="outline" className="text-[10px]">{classData.type}</Badge>
              <Badge variant="outline" className="text-[10px]">{classData.style}</Badge>
            </div>
          )}

          {/* Location */}
          {classData?.location && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Location:</span>
              {' '}
              {classData.location}
            </div>
          )}

          {/* Instructors */}
          {classData?.instructors && classData.instructors.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Instructors:</span>
              {' '}
              {classData.instructors.map(i => i.name).join(', ')}
            </div>
          )}

          {/* Click hint */}
          <div className="border-t border-border pt-2 text-[10px] text-muted-foreground">
            Click to view class details
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
