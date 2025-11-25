import { AccountSettingsPage } from '@/features/settings/AccountSettingsPage';

export default async function AccountSettingsRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <AccountSettingsPage />;
}
