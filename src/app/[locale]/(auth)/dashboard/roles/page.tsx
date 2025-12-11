import { RolesPage } from '@/features/roles/RolesPage';

export default async function RolesRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <RolesPage />;
}
