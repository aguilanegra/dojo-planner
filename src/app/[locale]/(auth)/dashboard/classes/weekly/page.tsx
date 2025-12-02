import { WeeklyView } from '@/features/classes/WeeklyView';

export default async function WeeklyPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <WeeklyView />;
}
