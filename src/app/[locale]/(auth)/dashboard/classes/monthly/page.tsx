import { MonthlyView } from '@/features/classes/MonthlyView';

export default async function MonthlyPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <MonthlyView />;
}
