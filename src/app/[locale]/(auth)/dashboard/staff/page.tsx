import { StaffPage } from '@/features/staff/StaffPage';

export default async function StaffRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <StaffPage />;
}
