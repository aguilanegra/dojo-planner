import { SchedulePage } from '@/features/schedule/SchedulePage';

export default async function ScheduleRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <SchedulePage />;
}
