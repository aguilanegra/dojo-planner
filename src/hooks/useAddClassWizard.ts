import { useState } from 'react';

type AllowWalkIns = 'Yes' | 'No';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type ScheduleInstance = {
  id: string;
  dayOfWeek: DayOfWeek;
  timeHour: number;
  timeMinute: number;
  timeAmPm: 'AM' | 'PM';
  durationHours: number;
  durationMinutes: number;
  staffMember: string;
  assistantStaff: string;
};

/**
 * Represents an exception to a regular schedule instance.
 * Can be used to:
 * 1. Delete a specific occurrence (type: 'deleted')
 * 2. Modify a specific occurrence (type: 'modified')
 * 3. Modify all future occurrences from a date (type: 'modified-forward')
 */
export type ScheduleException = {
  id: string;
  /** The ID of the parent schedule instance this exception applies to */
  scheduleInstanceId: string;
  /** The specific date this exception applies to (ISO date string YYYY-MM-DD) */
  date: string;
  /** Type of exception */
  type: 'deleted' | 'modified' | 'modified-forward';
  /** For 'modified' and 'modified-forward' types, the override values */
  overrides?: {
    timeHour?: number;
    timeMinute?: number;
    timeAmPm?: 'AM' | 'PM';
    durationHours?: number;
    durationMinutes?: number;
    staffMember?: string;
    assistantStaff?: string;
  };
  /** When type is 'modified-forward', this indicates changes apply from this date onwards */
  effectiveFromDate?: string;
  /** Human-readable note about the exception */
  note?: string;
  /** Timestamp when the exception was created */
  createdAt: string;
};

export type ClassSchedule = {
  instances: ScheduleInstance[];
  exceptions: ScheduleException[];
  location: string;
};

export type AddClassWizardData = {
  // Step 1: Class Basics
  className: string;
  program: string;
  maximumCapacity: number | null;
  minimumAge: number | null;
  allowWalkIns: AllowWalkIns;
  description: string;

  // Step 2: Schedule Details
  schedule: ClassSchedule;
  calendarColor: string;

  // Step 3: Tags
  tags: string[];
};

type ClassWizardStep = 'class-basics' | 'schedule' | 'tags' | 'success';

const initialSchedule: ClassSchedule = {
  instances: [],
  exceptions: [],
  location: '',
};

const initialData: AddClassWizardData = {
  className: '',
  program: '',
  maximumCapacity: null,
  minimumAge: null,
  allowWalkIns: 'Yes',
  description: '',
  schedule: initialSchedule,
  calendarColor: '#000000',
  tags: [],
};

export const useAddClassWizard = () => {
  const [step, setStep] = useState<ClassWizardStep>('class-basics');
  const [data, setData] = useState<AddClassWizardData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = (updates: Partial<AddClassWizardData>) => {
    setData((prev) => {
      const newData = { ...prev, ...updates };
      return newData;
    });
    setError(null);
  };

  const updateSchedule = (updates: Partial<ClassSchedule>) => {
    setData(prev => ({
      ...prev,
      schedule: { ...prev.schedule, ...updates },
    }));
    setError(null);
  };

  const nextStep = () => {
    const steps: ClassWizardStep[] = ['class-basics', 'schedule', 'tags', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1 && currentIndex !== -1) {
      const nextStepValue = steps[currentIndex + 1];
      if (nextStepValue) {
        setStep(nextStepValue);
        setError(null);
      }
    }
  };

  const previousStep = () => {
    const steps: ClassWizardStep[] = ['class-basics', 'schedule', 'tags', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      const prevStepValue = steps[currentIndex - 1];
      if (prevStepValue) {
        setStep(prevStepValue);
        setError(null);
      }
    }
  };

  const setErrorMessage = (message: string) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  const reset = () => {
    setStep('class-basics');
    setData(initialData);
    setError(null);
    setIsLoading(false);
  };

  return {
    step,
    setStep,
    data,
    updateData,
    updateSchedule,
    nextStep,
    previousStep,
    reset,
    error,
    setError: setErrorMessage,
    clearError,
    isLoading,
    setIsLoading,
  };
};
