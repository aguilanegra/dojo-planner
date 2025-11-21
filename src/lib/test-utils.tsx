import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/locales/en.json';

export function I18nWrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {children}
    </NextIntlClientProvider>
  );
}
