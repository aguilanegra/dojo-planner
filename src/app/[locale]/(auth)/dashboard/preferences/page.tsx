import { PreferencesPage } from '@/features/settings/PreferencesPage';

export default async function PreferencesRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <PreferencesPage />;
}
