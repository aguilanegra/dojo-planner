import { HelpPage } from '@/features/settings/HelpPage';

export default async function HelpRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <HelpPage />;
}
