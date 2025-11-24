import { UserPermissionsPage } from '@/features/settings/UserPermissionsPage';

export default async function UserPermissionsRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <UserPermissionsPage />;
}
