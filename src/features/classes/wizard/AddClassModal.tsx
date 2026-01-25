'use client';

import type { ClassCardProps, ScheduleItem } from '@/templates/ClassCard';
import type { EventCardProps, EventSession as EventCardSession } from '@/templates/EventCard';
import { useOrganization } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddClassWizard } from '@/hooks/useAddClassWizard';
import { useTagsCache } from '@/hooks/useTagsCache';
import { ClassBasicsStep } from './ClassBasicsStep';
import { ClassScheduleStep } from './ClassScheduleStep';
import { ClassSuccessStep } from './ClassSuccessStep';
import { ClassTagsStep } from './ClassTagsStep';
import { EventBasicsStep } from './EventBasicsStep';
import { EventBillingStep } from './EventBillingStep';
import { EventScheduleStep } from './EventScheduleStep';
import { TypeSelectionStep } from './TypeSelectionStep';

type AddClassModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  onClassCreated?: (newClass: ClassCardProps) => void;
  onEventCreated?: (newEvent: EventCardProps) => void;
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

export const AddClassModal = ({ isOpen, onCloseAction, onClassCreated, onEventCreated }: AddClassModalProps) => {
  const router = useRouter();
  const wizard = useAddClassWizard();
  const t = useTranslations('AddClassWizard');
  const { organization } = useOrganization();
  const { classTags } = useTagsCache(organization?.id);

  const handleCancel = () => {
    wizard.reset();
    onCloseAction();
  };

  const handleSuccess = () => {
    const itemType = wizard.data.itemType;
    console.info(`[Add Class/Event Wizard] ${itemType === 'event' ? 'Event' : 'Class'} created successfully:`, {
      timestamp: new Date().toISOString(),
      data: wizard.data,
    });
    wizard.reset();
    onCloseAction();
    router.refresh();
  };

  const handleFinalStep = async () => {
    try {
      wizard.setIsLoading(true);
      wizard.clearError();

      const isEvent = wizard.data.itemType === 'event';

      // Log creation (mock)
      console.info(`[Add Class/Event Wizard] Starting ${isEvent ? 'event' : 'class'} creation:`, {
        timestamp: new Date().toISOString(),
        wizardData: wizard.data,
      });

      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (isEvent) {
        // Create event object
        const formatEventSessions = (): EventCardSession[] => {
          return wizard.data.eventSchedule.sessions.map((session) => {
            const hour = session.timeHour;
            const minute = session.timeMinute.toString().padStart(2, '0');
            const endHour = hour + session.durationHours + Math.floor((session.timeMinute + session.durationMinutes) / 60);
            const endMinute = (session.timeMinute + session.durationMinutes) % 60;
            const endAmPm = session.timeAmPm === 'AM' && endHour >= 12 ? 'PM' : session.timeAmPm;
            const displayEndHour = endHour > 12 ? endHour - 12 : endHour;

            // Format the date for display
            const dateObj = new Date(session.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return {
              date: formattedDate,
              time: `${hour}:${minute} ${session.timeAmPm} - ${displayEndHour}:${endMinute.toString().padStart(2, '0')} ${endAmPm}`,
            };
          });
        };

        // Get unique staff members from all sessions
        const uniqueStaffIds = [...new Set(wizard.data.eventSchedule.sessions.flatMap(s => [s.staffMember, s.assistantStaff].filter(Boolean)))];
        const eventInstructors = uniqueStaffIds
          .map(id => MOCK_STAFF[id])
          .filter((staff): staff is { name: string; photoUrl: string } => staff !== undefined);

        // Format dates for display
        const formatDate = (dateStr: string) => {
          const dateObj = new Date(dateStr);
          return dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        };

        const newEvent: EventCardProps = {
          id: `event-${Date.now()}`,
          name: wizard.data.eventName,
          description: wizard.data.eventDescription,
          eventType: wizard.data.eventType || 'Other',
          startDate: formatDate(wizard.data.eventSchedule.startDate),
          endDate: formatDate(wizard.data.eventSchedule.endDate || wizard.data.eventSchedule.startDate),
          sessions: formatEventSessions(),
          location: wizard.data.eventSchedule.location || 'Current Location',
          instructors: eventInstructors,
          price: wizard.data.eventBilling.hasFee ? wizard.data.eventBilling.price : null,
        };

        console.info('[Add Class/Event Wizard] Event created successfully:', {
          timestamp: new Date().toISOString(),
          newEvent,
        });

        // Notify parent about the new event
        if (onEventCreated) {
          onEventCreated(newEvent);
        }
      } else {
        // Create the mock class object
        const formatSchedule = (): ScheduleItem[] => {
          const instances = wizard.data.schedule.instances;
          return instances.map((instance) => {
            const hour = instance.timeHour;
            const minute = instance.timeMinute.toString().padStart(2, '0');
            const endHour = hour + instance.durationHours + Math.floor((instance.timeMinute + instance.durationMinutes) / 60);
            const endMinute = (instance.timeMinute + instance.durationMinutes) % 60;
            const endAmPm = instance.timeAmPm === 'AM' && endHour >= 12 ? 'PM' : instance.timeAmPm;
            const displayEndHour = endHour > 12 ? endHour - 12 : endHour;
            return {
              day: instance.dayOfWeek,
              time: `${hour}:${minute} ${instance.timeAmPm} - ${displayEndHour}:${endMinute.toString().padStart(2, '0')} ${endAmPm}`,
            };
          });
        };

        // Get unique staff members from all instances
        const uniqueStaffIds = [...new Set(wizard.data.schedule.instances.flatMap(i => [i.staffMember, i.assistantStaff].filter(Boolean)))];
        const classInstructors = uniqueStaffIds
          .map(id => MOCK_STAFF[id])
          .filter((staff): staff is { name: string; photoUrl: string } => staff !== undefined);

        const newClass: ClassCardProps = {
          id: `class-${Date.now()}`,
          name: wizard.data.className,
          description: wizard.data.description,
          level: 'All Levels', // Default for new classes
          type: MOCK_PROGRAMS[wizard.data.program]?.split(' ')[0] || 'Adults',
          style: 'Gi', // Default
          schedule: formatSchedule(),
          location: 'Current Location', // Uses the selected location from app context
          instructors: classInstructors,
        };

        console.info('[Add Class/Event Wizard] Class created successfully:', {
          timestamp: new Date().toISOString(),
          newClass,
        });

        // Notify parent about the new class
        if (onClassCreated) {
          onClassCreated(newClass);
        }
      }

      // Move to success step
      wizard.setStep('success');
    } catch (err) {
      console.error('[Add Class/Event Wizard] Failed to create:', {
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
      });
      wizard.setError('Failed to create. Please try again.');
    } finally {
      wizard.setIsLoading(false);
    }
  };

  const getDialogTitle = () => {
    switch (wizard.step) {
      case 'type-selection':
        return t('step_type_selection_title');
      case 'class-basics':
        return t('step_class_basics_title');
      case 'event-basics':
        return t('step_event_basics_title');
      case 'schedule':
        return t('step_schedule_title');
      case 'event-schedule':
        return t('step_event_schedule_title');
      case 'event-billing':
        return t('step_billing_title');
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
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto py-6">
          {wizard.step === 'type-selection' && (
            <TypeSelectionStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'class-basics' && (
            <ClassBasicsStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'event-basics' && (
            <EventBasicsStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onNext={wizard.nextStep}
              onBack={wizard.previousStep}
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

          {wizard.step === 'event-schedule' && (
            <EventScheduleStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onUpdateEventSchedule={wizard.updateEventSchedule}
              onNext={wizard.nextStep}
              onBack={wizard.previousStep}
              onCancel={handleCancel}
              error={wizard.error}
            />
          )}

          {wizard.step === 'event-billing' && (
            <EventBillingStep
              data={wizard.data}
              onUpdate={wizard.updateData}
              onUpdateEventBilling={wizard.updateEventBilling}
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
              classTags={classTags}
            />
          )}

          {wizard.step === 'success' && (
            <ClassSuccessStep
              data={wizard.data}
              onDone={handleSuccess}
              classTags={classTags}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
