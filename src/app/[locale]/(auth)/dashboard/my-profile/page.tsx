import { MyProfilePage } from '@/features/settings/MyProfilePage';

export default async function MyProfileRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: _locale } = await props.params;

  return <MyProfilePage />;
}
