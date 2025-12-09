'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHasPasswordAuth } from '@/hooks/useHasPasswordAuth';
import { ChangePasswordForm } from './ChangePasswordForm';

export function SecurityPage() {
  const t = useTranslations('Security');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { hasPasswordAuth, isLoadingAuth } = useHasPasswordAuth();

  const handlePasswordChangeSuccess = () => {
    setShowPasswordForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Change Password Section - Only show for password-based auth users */}
      {!isLoadingAuth && hasPasswordAuth && (
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t('change_password_title')}</h2>
            </div>
            {!showPasswordForm && (
              <Button onClick={() => setShowPasswordForm(true)}>
                {t('change_password_button')}
              </Button>
            )}
          </div>

          {showPasswordForm && (
            <ChangePasswordForm
              onCancel={() => setShowPasswordForm(false)}
              onSuccess={handlePasswordChangeSuccess}
            />
          )}
        </Card>
      )}

      {/* Two-Factor Authentication Section */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{t('two_factor_title')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('two_factor_description')}</p>
          </div>
          <Button disabled>{t('add_2fa_button')}</Button>
        </div>
      </Card>
    </div>
  );
}
