import { SecurityPage } from '@/features/settings/SecurityPage';

export default async function SecurityRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <SecurityPage />;
}
