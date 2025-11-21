import { DashboardPage } from '@/features/dashboard/DashboardPage';

export default async function DashboardRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <DashboardPage />;
}
