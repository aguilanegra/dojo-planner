'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

type TabType = 'notifications' | 'appearance' | 'billing' | 'data-export';

export function PreferencesPage() {
  const t = useTranslations('Preferences');
  const [activeTab, setActiveTab] = useState<TabType>('notifications');

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'notifications', label: t('notifications_tab') },
    { id: 'appearance', label: t('appearance_tab') },
    { id: 'billing', label: t('billing_tab') },
    { id: 'data-export', label: t('data_export_tab') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Horizontal Tab Navigation */}
      <div className="flex gap-4 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer px-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <>
            <Card className="p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">{t('email_notifications_title')}</h2>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('communication_emails_label')}</p>
                    <p className="text-sm text-muted-foreground">{t('communication_emails_description')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border pt-4" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('member_change_emails_label')}</p>
                    <p className="text-sm text-muted-foreground">{t('member_change_emails_description')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border pt-4" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('financial_transaction_emails_label')}</p>
                    <p className="text-sm text-muted-foreground">{t('financial_transaction_emails_description')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border pt-4" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('announcements_label')}</p>
                    <p className="text-sm text-muted-foreground">{t('announcements_description')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">{t('text_notifications_title')}</h2>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('communication_texts_label')}</p>
                    <p className="text-sm text-muted-foreground">{t('communication_texts_description')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border pt-4" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('member_change_texts_label')}</p>
                    <p className="text-sm text-muted-foreground">{t('member_change_texts_description')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border pt-4" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('financial_transaction_texts_label')}</p>
                    <p className="text-sm text-muted-foreground">{t('financial_transaction_texts_description')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card className="border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">{t('danger_zone_title')}</h3>
                  <p className="mt-2 text-sm text-red-800 dark:text-red-200">{t('danger_zone_warning')}</p>
                </div>
                <Switch />
              </div>
            </Card>
          </>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground">{t('appearance_coming_soon')}</h2>
              <p className="mt-2 text-muted-foreground">{t('appearance_description')}</p>
            </Card>
          </>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground">{t('billing_coming_soon')}</h2>
              <p className="mt-2 text-muted-foreground">{t('billing_description')}</p>
            </Card>
          </>
        )}

        {/* Data Export Tab */}
        {activeTab === 'data-export' && (
          <>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground">{t('data_export_coming_soon')}</h2>
              <p className="mt-2 text-muted-foreground">{t('data_export_description')}</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
