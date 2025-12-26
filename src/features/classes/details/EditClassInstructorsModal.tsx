'use client';

import type { ClassInstructor } from '@/app/[locale]/(auth)/dashboard/classes/[classId]/page';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock staff data
const AVAILABLE_STAFF = [
  { id: '1', name: 'Coach Alex', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: '2', name: 'Professor Jessica', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
  { id: '3', name: 'Professor Ivan', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' },
  { id: '4', name: 'Professor Joao', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' },
  { id: '5', name: 'Coach Liza', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liza' },
  { id: '6', name: 'Collin Grayson', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Collin' },
];

type EditClassInstructorsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  instructors: ClassInstructor[];
  onSave: (data: {
    instructors: ClassInstructor[];
  }) => void;
};

function getInitials(name: string): string {
  const parts = name.split(' ');
  return parts.map(part => part[0]).join('').toUpperCase();
}

export function EditClassInstructorsModal({
  isOpen,
  onClose,
  instructors: initialInstructors,
  onSave,
}: EditClassInstructorsModalProps) {
  const t = useTranslations('ClassDetailPage.EditInstructorsModal');

  const [instructors, setInstructors] = useState<ClassInstructor[]>(initialInstructors);
  const [isLoading, setIsLoading] = useState(false);

  const selectedIds = instructors.map(i => i.id);

  const handleToggleInstructor = (staffId: string) => {
    const staff = AVAILABLE_STAFF.find(s => s.id === staffId);
    if (!staff) {
      return;
    }

    if (selectedIds.includes(staffId)) {
      // Remove instructor
      setInstructors(prev => prev.filter(i => i.id !== staffId));
    } else {
      // Add instructor
      const role: 'primary' | 'assistant' = instructors.length === 0 ? 'primary' : 'assistant';
      setInstructors(prev => [...prev, {
        id: staff.id,
        name: staff.name,
        photoUrl: staff.photoUrl,
        role,
      }]);
    }
  };

  const handleRoleChange = (instructorId: string, newRole: 'primary' | 'assistant') => {
    setInstructors(prev => prev.map((i) => {
      if (i.id === instructorId) {
        return { ...i, role: newRole };
      }
      // If setting a new primary, demote the old primary
      if (newRole === 'primary' && i.role === 'primary') {
        return { ...i, role: 'assistant' };
      }
      return i;
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave({ instructors });
    setIsLoading(false);
  };

  const handleCancel = () => {
    setInstructors(initialInstructors);
    onClose();
  };

  // Reset state when modal opens with new data
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setInstructors(initialInstructors);
    } else {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selected Instructors */}
          {instructors.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('selected_label')}</label>
              <div className="space-y-2">
                {instructors.map(instructor => (
                  <div key={instructor.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={instructor.photoUrl} alt={instructor.name} />
                        <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{instructor.name}</span>
                    </div>
                    <Select
                      value={instructor.role}
                      onValueChange={value => handleRoleChange(instructor.id, value as 'primary' | 'assistant')}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">{t('role_primary')}</SelectItem>
                        <SelectItem value="assistant">{t('role_assistant')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Staff */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('available_label')}</label>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
              {AVAILABLE_STAFF.map(staff => (
                <label
                  key={staff.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent"
                >
                  <Checkbox
                    checked={selectedIds.includes(staff.id)}
                    onCheckedChange={() => handleToggleInstructor(staff.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={staff.photoUrl} alt={staff.name} />
                    <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">{staff.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t('help_text')}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              {t('cancel_button')}
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? t('saving_button') : t('save_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
