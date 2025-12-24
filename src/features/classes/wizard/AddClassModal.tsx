'use client';

import type { ClassCardProps } from '@/templates/ClassCard';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddClassWizard } from '@/hooks/useAddClassWizard';
import { ClassBasicsStep } from './ClassBasicsStep';
import { ClassScheduleStep } from './ClassScheduleStep';
import { ClassSuccessStep } from './ClassSuccessStep';
import { ClassTagsStep } from './ClassTagsStep';

type AddClassModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  onClassCreated?: (newClass: ClassCardProps) => void;
};

const MOCK_PROGRAMS: Record<string, string> = {
  'adult-bjj': 'Adult Brazilian Jiu-Jitsu',
  'kids-bjj': 'Kids Brazilian Jiu-Jitsu',
  'womens-bjj': 'Women\'s Brazilian Jiu-Jitsu',
  'competition': 'Competition Team',
  'judo': 'Judo',
  'wrestling': 'Wrestling',
};

const MOCK_STAFF: Record<string, { name: string; photoUrl: string }> = {
  'collin-grayson': { name: 'Collin Grayson', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Collin' },
  'coach-alex': { name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  'professor-jessica': { name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
  'professor-joao': { name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' },
  'coach-liza': { name: 'Coach Liza', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liza' },
  'professor-ivan': { name: 'Professor Ivan', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' },
};

export const AddClassModal = ({ isOpen, onCloseAction, onClassCreated }: AddClassModalProps) => {
  const router = useRouter();
  const wizard = useAddClassWizard();
  const t = useTranslations('AddClassWizard');

  const handleCancel = () => {
    wizard.reset();
    onCloseAction();
  };

  const handleSuccess = () => {
    console.info('[Add Class Wizard] Class created successfully:', {
      timestamp: new Date().toISOString(),
      classData: wizard.data,
    });
    wizard.reset();
    onCloseAction();
    router.refresh();
  };

  const handleFinalStep = async () => {
    try {
      wizard.setIsLoading(true);
      wizard.clearError();

      // Log creation (mock)
      console.info('[Add Class Wizard] Starting class creation:', {
        timestamp: new Date().toISOString(),
        wizardData: wizard.data,
      });

      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create the mock class object
      const formatSchedule = () => {
        const days = wizard.data.schedule.daysOfWeek.map(d => d.substring(0, 3).toUpperCase()).join('/');
        const hour = wizard.data.schedule.timeHour;
        const minute = wizard.data.schedule.timeMinute.toString().padStart(2, '0');
        return `${days} ${hour}:${minute} ${wizard.data.schedule.timeAmPm}`;
      };

      const staffMember = MOCK_STAFF[wizard.data.schedule.staffMember];
      const assistantStaff = wizard.data.schedule.assistantStaff
        ? MOCK_STAFF[wizard.data.schedule.assistantStaff]
        : null;

      const newClass: ClassCardProps = {
        id: `class-${Date.now()}`,
        name: wizard.data.className,
        description: wizard.data.description,
        level: 'All Levels', // Default for new classes
        type: MOCK_PROGRAMS[wizard.data.program]?.split(' ')[0] || 'Adults',
        style: 'Gi', // Default
        schedule: formatSchedule(),
        location: 'Current Location', // Uses the selected location from app context
        instructors: [
          ...(staffMember ? [staffMember] : []),
          ...(assistantStaff ? [assistantStaff] : []),
        ],
      };

      console.info('[Add Class Wizard] Class created successfully:', {
        timestamp: new Date().toISOString(),
        newClass,
      });

      // Notify parent about the new class
      if (onClassCreated) {
        onClassCreated(newClass);
      }

      // Move to success step
      wizard.setStep('success');
    } catch (err) {
      console.error('[Add Class Wizard] Failed to create class:', {
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
      });
      wizard.setError('Failed to create class. Please try again.');
    } finally {
      wizard.setIsLoading(false);
    }
  };

  const getDialogTitle = () => {
    switch (wizard.step) {
      case 'class-basics':
        return t('step_class_basics_title');
      case 'schedule':
        return t('step_schedule_title');
      case 'tags':
        return t('step_tags_title');
      case 'success':
        return t('step_success_title');
      default:
        return t('modal_title');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && handleCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {wizard.step === 'class-basics' && (
            <ClassBasicsStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'schedule' && (
            <ClassScheduleStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onUpdateSchedule={wizard.updateSchedule}
              onNext={wizard.nextStep}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'tags' && (
            <ClassTagsStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={handleFinalStep}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              isLoading={wizard.isLoading}
              error={wizard.error}
            />
          )}

          {wizard.step === 'success' && (
            <ClassSuccessStep
              data={wizard.data}
              onDone={handleSuccess}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
