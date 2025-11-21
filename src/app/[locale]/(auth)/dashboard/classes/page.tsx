import { ClassesPage } from '@/features/classes/ClassesPage';

export default async function ClassesRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <ClassesPage />;
}
