'use client';

import type { InviteStaffFormData, StaffPermissions, StaffRole } from '@/hooks/useInviteStaffForm';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type InviteStaffFormContentProps = {
  data: InviteStaffFormData;
  onUpdate: (updates: Partial<InviteStaffFormData>) => void;
  onUpdatePermission: (key: keyof StaffPermissions, value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const InviteStaffFormContent = ({
  data,
  onUpdate,
  onUpdatePermission,
  onSave,
  onCancel,
  isLoading,
  error,
}: InviteStaffFormContentProps) => {
  const t = useTranslations('Staff.InviteStaffModal');

  const isFormValid
    = data.firstName.trim() !== ''
      && data.lastName.trim() !== ''
      && isValidEmail(data.email)
      && data.role !== null
      && data.phone.trim() !== '';

  type PermissionLabelKey
    = | 'permission_manage_class_schedules'
      | 'permission_view_member_information'
      | 'permission_access_billing_information'
      | 'permission_generate_reports'
      | 'permission_modify_location_settings';

  const permissionKeys: { key: keyof StaffPermissions; labelKey: PermissionLabelKey }[] = [
    { key: 'canManageClassSchedules', labelKey: 'permission_manage_class_schedules' },
    { key: 'canViewMemberInformation', labelKey: 'permission_view_member_information' },
    { key: 'canAccessBillingInformation', labelKey: 'permission_access_billing_information' },
    { key: 'canGenerateReports', labelKey: 'permission_generate_reports' },
    { key: 'canModifyLocationSettings', labelKey: 'permission_modify_location_settings' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          {t('info_message')}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/30">
          <p className="text-sm text-red-900 dark:text-red-200">
            {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            {t('first_name_label')}
          </label>
          <Input
            data-testid="invite-staff-first-name"
            placeholder={t('first_name_placeholder')}
            value={data.firstName}
            onChange={e => onUpdate({ firstName: e.target.value })}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            {t('last_name_label')}
          </label>
          <Input
            data-testid="invite-staff-last-name"
            placeholder={t('last_name_placeholder')}
            value={data.lastName}
            onChange={e => onUpdate({ lastName: e.target.value })}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {t('email_label')}
        </label>
        <Input
          type="email"
          data-testid="invite-staff-email"
          placeholder={t('email_placeholder')}
          value={data.email}
          onChange={e => onUpdate({ email: e.target.value })}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {t('role_label')}
        </label>
        <Select
          value={data.role || ''}
          onValueChange={value => onUpdate({ role: value as StaffRole })}
          disabled={isLoading}
        >
          <SelectTrigger
            data-testid="invite-staff-role"
            className="w-full"
          >
            <SelectValue placeholder={t('role_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">{t('role_admin')}</SelectItem>
            <SelectItem value="instructor">{t('role_instructor')}</SelectItem>
            <SelectItem value="front-desk">{t('role_front_desk')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {t('phone_label')}
        </label>
        <Input
          type="tel"
          data-testid="invite-staff-phone"
          placeholder={t('phone_placeholder')}
          value={data.phone}
          onChange={e => onUpdate({ phone: e.target.value })}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3">
        {permissionKeys.map(({ key, labelKey }) => (
          <div key={key} className="flex items-center justify-between">
            <label className="cursor-pointer text-sm font-medium text-foreground">
              {t(labelKey)}
            </label>
            <Switch
              data-testid={`invite-staff-permission-${key}`}
              checked={data.permissions[key]}
              onCheckedChange={checked => onUpdatePermission(key, checked)}
              disabled={isLoading}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button variant="outline" onClick={onCancel} disabled={isLoading} data-testid="invite-staff-cancel-button">
          {t('cancel_button')}
        </Button>
        <Button onClick={onSave} disabled={isLoading || !isFormValid} data-testid="invite-staff-save-button">
          {t('send_invite_button')}
        </Button>
      </div>
    </div>
  );
};
