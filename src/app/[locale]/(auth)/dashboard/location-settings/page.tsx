import { LocationSettingsPage } from '@/features/settings/LocationSettingsPage';

export default async function LocationSettingsRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <LocationSettingsPage />;
}
