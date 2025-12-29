'use client';

import type { ScheduleInstance } from '@/hooks/useAddClassWizard';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClassBasicsCard } from '@/features/classes/details/ClassBasicsCard';
import { ClassScheduleCard } from '@/features/classes/details/ClassScheduleCard';
import { ClassSettingsCard } from '@/features/classes/details/ClassSettingsCard';
import { ClassStatsCard } from '@/features/classes/details/ClassStatsCard';
import { DeleteClassAlertDialog } from '@/features/classes/details/DeleteClassAlertDialog';
import { EditClassBasicsModal } from '@/features/classes/details/EditClassBasicsModal';
import { EditClassScheduleModal } from '@/features/classes/details/EditClassScheduleModal';
import { EditClassSettingsModal } from '@/features/classes/details/EditClassSettingsModal';

export type ClassLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type ClassType = 'Adults' | 'Kids' | 'Women' | 'Open' | 'Competition';
export type ClassStyle = 'Gi' | 'No Gi';
export type AllowWalkIns = 'Yes' | 'No';

export type ClassInstructor = {
  id: string;
  name: string;
  photoUrl: string;
  role: 'primary' | 'assistant';
};

export type ClassDetailData = {
  id: string;
  // Basics
  className: string;
  program: string;
  description: string;
  level: ClassLevel;
  type: ClassType;
  style: ClassStyle;
  // Schedule
  scheduleInstances: ScheduleInstance[];
  location: string;
  calendarColor: string;
  // Instructors
  instructors: ClassInstructor[];
  // Settings
  maximumCapacity: number | null;
  minimumAge: number | null;
  allowWalkIns: AllowWalkIns;
  // Stats (read-only)
  activeEnrollments: number;
  averageAttendance: number;
  totalSessions: number;
};

// Mock data for classes
const mockClassDetails: Record<string, ClassDetailData> = {
  1: {
    id: '1',
    className: 'BJJ Fundamentals I',
    program: 'adult-bjj',
    description: 'Covers core positions, escapes, and submissions. Ideal for students in their first 6 months.',
    level: 'Beginner',
    type: 'Adults',
    style: 'Gi',
    scheduleInstances: [
      { id: 'si-1-1', dayOfWeek: 'Monday', timeHour: 6, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-alex', assistantStaff: 'professor-jessica' },
      { id: 'si-1-2', dayOfWeek: 'Wednesday', timeHour: 6, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-alex', assistantStaff: '' },
      { id: 'si-1-3', dayOfWeek: 'Friday', timeHour: 6, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'professor-jessica', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#22c55e',
    instructors: [
      { id: '1', name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'primary' },
      { id: '2', name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', role: 'assistant' },
    ],
    maximumCapacity: 25,
    minimumAge: 16,
    allowWalkIns: 'Yes',
    activeEnrollments: 45,
    averageAttendance: 18,
    totalSessions: 156,
  },
  2: {
    id: '2',
    className: 'BJJ Fundamentals II',
    program: 'adult-bjj',
    description: 'Learn core BJJ techniques like sweeps, submissions, and escapes. Ideal for building a strong grappling foundation.',
    level: 'Beginner',
    type: 'Adults',
    style: 'Gi',
    scheduleInstances: [
      { id: 'si-2-1', dayOfWeek: 'Tuesday', timeHour: 6, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 30, staffMember: 'professor-ivan', assistantStaff: '' },
      { id: 'si-2-2', dayOfWeek: 'Thursday', timeHour: 6, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 30, staffMember: 'professor-ivan', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#22c55e',
    instructors: [
      { id: '3', name: 'Professor Ivan', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan', role: 'primary' },
    ],
    maximumCapacity: 20,
    minimumAge: 16,
    allowWalkIns: 'Yes',
    activeEnrollments: 38,
    averageAttendance: 15,
    totalSessions: 124,
  },
  3: {
    id: '3',
    className: 'BJJ Intermediate',
    program: 'adult-bjj',
    description: 'Covers our intermediate curriculum. Builds on what was learned in Fundamentals I and II. Has rolling after.',
    level: 'Intermediate',
    type: 'Adults',
    style: 'Gi',
    scheduleInstances: [
      { id: 'si-3-1', dayOfWeek: 'Monday', timeHour: 7, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'professor-joao', assistantStaff: '' },
      { id: 'si-3-2', dayOfWeek: 'Wednesday', timeHour: 7, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'professor-joao', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#6b7280',
    instructors: [
      { id: '4', name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao', role: 'primary' },
    ],
    maximumCapacity: 20,
    minimumAge: 16,
    allowWalkIns: 'No',
    activeEnrollments: 28,
    averageAttendance: 12,
    totalSessions: 98,
  },
  4: {
    id: '4',
    className: 'BJJ Advanced',
    program: 'adult-bjj',
    description: 'Advanced curriculum that requires at least blue belt level to attend. Builds on previous curriculum. Has rolling after.',
    level: 'Advanced',
    type: 'Adults',
    style: 'No Gi',
    scheduleInstances: [
      { id: 'si-4-1', dayOfWeek: 'Wednesday', timeHour: 7, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-alex', assistantStaff: '' },
      { id: 'si-4-2', dayOfWeek: 'Friday', timeHour: 7, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-alex', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#a855f7',
    instructors: [
      { id: '1', name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'primary' },
    ],
    maximumCapacity: 15,
    minimumAge: 18,
    allowWalkIns: 'No',
    activeEnrollments: 16,
    averageAttendance: 10,
    totalSessions: 76,
  },
  5: {
    id: '5',
    className: 'Kids Class',
    program: 'kids-bjj',
    description: 'Builds coordination, focus, and basic grappling skills through games and technique. Emphasis on safety and fun.',
    level: 'Beginner',
    type: 'Kids',
    style: 'Gi',
    scheduleInstances: [
      { id: 'si-5-1', dayOfWeek: 'Tuesday', timeHour: 4, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-liza', assistantStaff: '' },
      { id: 'si-5-2', dayOfWeek: 'Thursday', timeHour: 4, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-liza', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#06b6d4',
    instructors: [
      { id: '5', name: 'Coach Liza', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liza', role: 'primary' },
    ],
    maximumCapacity: 20,
    minimumAge: 5,
    allowWalkIns: 'Yes',
    activeEnrollments: 34,
    averageAttendance: 16,
    totalSessions: 112,
  },
  6: {
    id: '6',
    className: 'Advanced No-Gi',
    program: 'adult-bjj',
    description: 'Explores high percentage transitions, leg entanglements, and situational sparring. Best for experienced students.',
    level: 'Advanced',
    type: 'Adults',
    style: 'No Gi',
    scheduleInstances: [
      { id: 'si-6-1', dayOfWeek: 'Saturday', timeHour: 12, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'professor-joao', assistantStaff: '' },
      { id: 'si-6-2', dayOfWeek: 'Sunday', timeHour: 12, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'professor-joao', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#a855f7',
    instructors: [
      { id: '4', name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao', role: 'primary' },
    ],
    maximumCapacity: 15,
    minimumAge: 18,
    allowWalkIns: 'No',
    activeEnrollments: 12,
    averageAttendance: 8,
    totalSessions: 48,
  },
  7: {
    id: '7',
    className: 'Women\'s BJJ',
    program: 'womens-bjj',
    description: 'Technique focused class with optional sparring, designed to create a welcoming space for women to build skills and confidence.',
    level: 'All Levels',
    type: 'Women',
    style: 'Gi',
    scheduleInstances: [
      { id: 'si-7-1', dayOfWeek: 'Tuesday', timeHour: 5, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'professor-jessica', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#ec4899',
    instructors: [
      { id: '2', name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', role: 'primary' },
    ],
    maximumCapacity: 15,
    minimumAge: 16,
    allowWalkIns: 'Yes',
    activeEnrollments: 22,
    averageAttendance: 10,
    totalSessions: 52,
  },
  8: {
    id: '8',
    className: 'Open Mat',
    program: 'adult-bjj',
    description: 'Open training session. Bring your skill level to practice freely.',
    level: 'All Levels',
    type: 'Open',
    style: 'Gi',
    scheduleInstances: [
      { id: 'si-8-1', dayOfWeek: 'Saturday', timeHour: 10, timeMinute: 0, timeAmPm: 'AM', durationHours: 2, durationMinutes: 0, staffMember: '', assistantStaff: '' },
      { id: 'si-8-2', dayOfWeek: 'Sunday', timeHour: 10, timeMinute: 0, timeAmPm: 'AM', durationHours: 2, durationMinutes: 0, staffMember: '', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#ef4444',
    instructors: [],
    maximumCapacity: null,
    minimumAge: null,
    allowWalkIns: 'Yes',
    activeEnrollments: 89,
    averageAttendance: 25,
    totalSessions: 104,
  },
  9: {
    id: '9',
    className: 'Competition Team',
    program: 'competition',
    description: 'Advanced training for competition preparation.',
    level: 'Advanced',
    type: 'Competition',
    style: 'Gi',
    scheduleInstances: [
      { id: 'si-9-1', dayOfWeek: 'Monday', timeHour: 8, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-alex', assistantStaff: '' },
      { id: 'si-9-2', dayOfWeek: 'Wednesday', timeHour: 8, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-alex', assistantStaff: '' },
      { id: 'si-9-3', dayOfWeek: 'Friday', timeHour: 8, timeMinute: 0, timeAmPm: 'PM', durationHours: 1, durationMinutes: 0, staffMember: 'coach-alex', assistantStaff: '' },
    ],
    location: 'Downtown HQ',
    calendarColor: '#a855f7',
    instructors: [
      { id: '1', name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', role: 'primary' },
    ],
    maximumCapacity: 12,
    minimumAge: 16,
    allowWalkIns: 'No',
    activeEnrollments: 16,
    averageAttendance: 12,
    totalSessions: 156,
  },
};

type PageParams = {
  classId: string;
};

export default function ClassDetailPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const t = useTranslations('ClassDetailPage');
  const router = useRouter();

  // Modal states
  const [isEditBasicsOpen, setIsEditBasicsOpen] = useState(false);
  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false);
  const [isEditSettingsOpen, setIsEditSettingsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get class data (in real app, this would come from an API)
  const [classData, setClassData] = useState<ClassDetailData | null>(
    mockClassDetails[resolvedParams.classId] || null,
  );

  // Handler for updating class data
  const handleUpdateClass = (updates: Partial<ClassDetailData>) => {
    if (classData) {
      setClassData({ ...classData, ...updates });
    }
  };

  // Handler for deleting class
  const handleDeleteClass = () => {
    // In a real app, this would call an API to delete the class
    router.push('/dashboard/classes');
  };

  if (!classData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">{t('not_found')}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/classes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_classes')}
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">{classData.className}</h1>
        <p className="text-lg text-muted-foreground">{classData.program}</p>
      </div>

      {/* Stats Card */}
      <ClassStatsCard
        activeEnrollments={classData.activeEnrollments}
        averageAttendance={classData.averageAttendance}
        totalSessions={classData.totalSessions}
        level={classData.level}
      />

      {/* Detail Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Basics + Settings */}
        <div className="flex flex-col gap-6">
          {/* Class Basics Card */}
          <ClassBasicsCard
            className={classData.className}
            program={classData.program}
            description={classData.description}
            level={classData.level}
            type={classData.type}
            style={classData.style}
            onEdit={() => setIsEditBasicsOpen(true)}
          />

          {/* Settings Card */}
          <ClassSettingsCard
            maximumCapacity={classData.maximumCapacity}
            minimumAge={classData.minimumAge}
            allowWalkIns={classData.allowWalkIns}
            onEdit={() => setIsEditSettingsOpen(true)}
          />
        </div>

        {/* Right Column: Schedule Card spanning full height */}
        <ClassScheduleCard
          scheduleInstances={classData.scheduleInstances}
          location={classData.location}
          calendarColor={classData.calendarColor}
          onEdit={() => setIsEditScheduleOpen(true)}
        />
      </div>

      {/* Edit Modals */}
      <EditClassBasicsModal
        isOpen={isEditBasicsOpen}
        onClose={() => setIsEditBasicsOpen(false)}
        className={classData.className}
        program={classData.program}
        description={classData.description}
        level={classData.level}
        type={classData.type}
        style={classData.style}
        onSave={(data) => {
          handleUpdateClass(data);
          setIsEditBasicsOpen(false);
        }}
      />

      <EditClassScheduleModal
        isOpen={isEditScheduleOpen}
        onClose={() => setIsEditScheduleOpen(false)}
        scheduleInstances={classData.scheduleInstances}
        location={classData.location}
        calendarColor={classData.calendarColor}
        onSave={(data) => {
          handleUpdateClass(data);
          setIsEditScheduleOpen(false);
        }}
      />

      <EditClassSettingsModal
        isOpen={isEditSettingsOpen}
        onClose={() => setIsEditSettingsOpen(false)}
        maximumCapacity={classData.maximumCapacity}
        minimumAge={classData.minimumAge}
        allowWalkIns={classData.allowWalkIns}
        onSave={(data) => {
          handleUpdateClass(data);
          setIsEditSettingsOpen(false);
        }}
      />

      {/* Delete Button */}
      <div className="flex justify-end">
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t('delete_button')}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteClassAlertDialog
        isOpen={isDeleteDialogOpen}
        classDisplayName={classData.className}
        onCloseAction={() => setIsDeleteDialogOpen(false)}
        onConfirmAction={handleDeleteClass}
      />
    </div>
  );
}
