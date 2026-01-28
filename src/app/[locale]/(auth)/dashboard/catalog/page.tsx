'use client';

import { useOrganization } from '@clerk/nextjs';
import { CatalogPage } from '@/features/catalog';

export default function DashboardCatalogPage() {
  const { organization } = useOrganization();

  if (!organization?.id) {
    return null;
  }

  return <CatalogPage organizationId={organization.id} />;
}
