'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/input/password-input';
import { Label } from '@/components/ui/label';

export function SecurityPage() {
  const t = useTranslations('Security');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Change Password Section */}
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
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="current-password">{t('current_password_label')}</Label>
              <PasswordInput
                id="current-password"
                placeholder={t('current_password_placeholder')}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="new-password">{t('new_password_label')}</Label>
              <PasswordInput
                id="new-password"
                placeholder={t('new_password_placeholder')}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">{t('confirm_password_label')}</Label>
              <PasswordInput
                id="confirm-password"
                placeholder={t('confirm_password_placeholder')}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button>{t('save_button')}</Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(false)}
              >
                {t('cancel_button')}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Two-Factor Authentication Section */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{t('two_factor_title')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('two_factor_description')}</p>
          </div>
          <Button>{t('add_2fa_button')}</Button>
        </div>
      </Card>
    </div>
  );
}
