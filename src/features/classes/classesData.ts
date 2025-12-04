import type { ClassCardProps } from '@/templates/ClassCard';

export const mockClasses: ClassCardProps[] = [
  {
    id: '1',
    name: 'BJJ Fundamentals I',
    description: 'Covers core positions, escapes, and submissions. Ideal for students in their first 6 months.',
    level: 'Beginner',
    type: 'Adults',
    style: 'Gi',
    schedule: 'M/W/F • 6-7 PM',
    location: 'Downtown HQ',
    instructors: [
      { name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    ],
  },
  {
    id: '2',
    name: 'BJJ Fundamentals II',
    description: 'Learn core BJJ techniques like sweeps, submissions, and escapes. Ideal for building a strong grappling foundation.',
    level: 'Beginner',
    type: 'Adults',
    style: 'Gi',
    schedule: 'T/Th • 6-7:30 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Professor Ivan', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' }],
  },
  {
    id: '3',
    name: 'BJJ Intermediate',
    description: 'Covers our intermediate curriculum. Builds on what was learned in Fundamentals I and II. Has rolling after.',
    level: 'Intermediate',
    type: 'Adults',
    style: 'Gi',
    schedule: 'M/W • 7-8 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' }],
  },
  {
    id: '4',
    name: 'BJJ Advanced',
    description: 'Advanced curriculum that requires at least blue belt level to attend. Builds on previous curriculum. Has rolling after.',
    level: 'Advanced',
    type: 'Adults',
    style: 'No Gi',
    schedule: 'W/F • 7-8 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }],
  },
  {
    id: '5',
    name: 'Kids Class',
    description: 'Builds coordination, focus, and basic grappling skills through games and technique. Emphasis on safety and fun.',
    level: 'Beginner',
    type: 'Kids',
    style: 'Gi',
    schedule: 'T/Th • 4-5 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Coach Liza', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liza' }],
  },
  {
    id: '6',
    name: 'Advanced No-Gi',
    description: 'Explores high percentage transitions, leg entanglements, and situational sparring. Best for experienced students.',
    level: 'Advanced',
    type: 'Adults',
    style: 'No Gi',
    schedule: 'Sa/Su • 12-1 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' }],
  },
  {
    id: '7',
    name: 'Women\'s BJJ',
    description: 'Technique focused class with optional sparring, designed to create a welcoming space for women to build skills and confidence.',
    level: 'All Levels',
    type: 'Women',
    style: 'Gi',
    schedule: 'T • 5-6 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' }],
  },
  {
    id: '8',
    name: 'Open Mat',
    description: 'Open training session. Bring your skill level to practice freely.',
    level: 'All Levels',
    type: 'Open',
    style: 'Gi',
    schedule: 'Sa/Su • 10 AM-12 PM',
    location: 'Downtown HQ',
    instructors: [],
  },
  {
    id: '9',
    name: 'Competition Team',
    description: 'Advanced training for competition preparation.',
    level: 'Advanced',
    type: 'Competition',
    style: 'Gi',
    schedule: 'M/W/F • 8-9 PM',
    location: 'Downtown HQ',
    instructors: [{ name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }],
  },
];

type ClassEvent = {
  classId: string;
  className: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  hour: number; // 0-23
  minute: number; // 0-59
  duration: number; // in minutes
  color: string;
};

function getClassColor(className: string): string {
  if (className.includes('Fundamentals')) {
    return '#22c55e'; // green
  }
  if (className.includes('Advanced') || className.includes('Competition')) {
    return '#a855f7'; // purple
  }
  if (className.includes('Kids')) {
    return '#06b6d4'; // cyan
  }
  if (className.includes('Women')) {
    return '#ec4899'; // pink
  }
  if (className.includes('Open')) {
    return '#ef4444'; // red
  }
  return '#6b7280'; // gray
}

export function generateWeeklySchedule(startDate: Date, classesToUse?: typeof mockClasses): ClassEvent[] {
  const events: ClassEvent[] = [];
  const dayOfWeek = startDate.getDay();
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() - dayOfWeek);
  const classesData = classesToUse || mockClasses;

  const classSchedules: Record<string, { day: number; hour: number; minute: number; duration: number }[]> = {
    'BJJ Fundamentals I': [
      { day: 1, hour: 6, minute: 0, duration: 60 }, // Monday 6 AM
      { day: 3, hour: 6, minute: 0, duration: 60 }, // Wednesday 6 AM
      { day: 5, hour: 18, minute: 0, duration: 60 }, // Friday 6 PM
    ],
    'BJJ Fundamentals II': [
      { day: 2, hour: 6, minute: 0, duration: 90 }, // Tuesday 6 AM
      { day: 4, hour: 6, minute: 0, duration: 90 }, // Thursday 6 AM
      { day: 2, hour: 18, minute: 0, duration: 90 }, // Tuesday 6 PM
      { day: 4, hour: 18, minute: 0, duration: 90 }, // Thursday 6 PM
    ],
    'Kids Class': [
      { day: 2, hour: 16, minute: 0, duration: 60 }, // Tuesday 4 PM
      { day: 4, hour: 16, minute: 0, duration: 60 }, // Thursday 4 PM
    ],
    'Women\'s BJJ': [
      { day: 2, hour: 17, minute: 0, duration: 60 }, // Tuesday 5 PM
    ],
    'BJJ Intermediate': [
      { day: 1, hour: 19, minute: 0, duration: 60 }, // Monday 7 PM
      { day: 3, hour: 19, minute: 0, duration: 60 }, // Wednesday 7 PM
    ],
    'BJJ Advanced': [
      { day: 3, hour: 19, minute: 0, duration: 60 }, // Wednesday 7 PM
      { day: 5, hour: 19, minute: 0, duration: 60 }, // Friday 7 PM
      { day: 5, hour: 11, minute: 0, duration: 60 }, // Friday 11 AM
    ],
    'Open Mat': [
      { day: 6, hour: 10, minute: 0, duration: 120 }, // Saturday 10 AM
      { day: 0, hour: 10, minute: 0, duration: 120 }, // Sunday 10 AM
    ],
    'Advanced No-Gi': [
      { day: 6, hour: 12, minute: 0, duration: 60 }, // Saturday 12 PM
      { day: 0, hour: 12, minute: 0, duration: 60 }, // Sunday 12 PM
    ],
    'Competition Team': [
      { day: 1, hour: 20, minute: 0, duration: 60 }, // Monday 8 PM
      { day: 3, hour: 20, minute: 0, duration: 60 }, // Wednesday 8 PM
      { day: 5, hour: 20, minute: 0, duration: 60 }, // Friday 8 PM
    ],
  };

  for (const classData of classesData) {
    const schedules = classSchedules[classData.name] || [];
    for (const schedule of schedules) {
      events.push({
        classId: classData.id,
        className: classData.name,
        dayOfWeek: schedule.day,
        hour: schedule.hour,
        minute: schedule.minute,
        duration: schedule.duration,
        color: getClassColor(classData.name),
      });
    }
  }

  return events;
}

export function generateMonthlySchedule(year: number, month: number, classesToUse?: typeof mockClasses): Record<string, ClassEvent[]> {
  const monthlyEvents: Record<string, ClassEvent[]> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const classesData = classesToUse || mockClasses;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    monthlyEvents[day.toString()] = [];

    const classSchedules: Record<string, number[]> = {
      'BJJ Fundamentals I': [1, 3, 5], // Mon, Wed, Fri
      'BJJ Fundamentals II': [2, 4, 2, 4], // Tue, Thu
      'Kids Class': [2, 4], // Tue, Thu
      'Women\'s BJJ': [2], // Tue
      'BJJ Intermediate': [1, 3], // Mon, Wed
      'BJJ Advanced': [3, 5, 5], // Wed, Fri
      'Open Mat': [6, 0], // Sat, Sun
      'Advanced No-Gi': [6, 0], // Sat, Sun
      'Competition Team': [1, 3, 5], // Mon, Wed, Fri
    };

    for (const classData of classesData) {
      const daysForClass = classSchedules[classData.name] || [];
      if (daysForClass.includes(dayOfWeek)) {
        monthlyEvents[day.toString()]!.push({
          classId: classData.id,
          className: classData.name,
          dayOfWeek,
          hour: 0,
          minute: 0,
          duration: 0,
          color: getClassColor(classData.name),
        });
      }
    }
  }

  return monthlyEvents;
}
