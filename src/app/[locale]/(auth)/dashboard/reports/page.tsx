'use client';

import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { ReportsPage } from '@/features/reports/ReportsPage';

export default function ReportsRoute() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center"><Spinner /></div>}>
      <ReportsPage />
    </Suspense>
  );
}
