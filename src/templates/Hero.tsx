import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';
import { Logo } from './Logo';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="flex min-h-screen items-center justify-center py-0">
      <CenteredHero
        logo={<Logo isTextHidden />}
        title={t.rich('title', {
          important: chunks => (
            <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {chunks}
            </span>
          ),
        })}
        buttons={(
          <>
            <Link className={buttonVariants({ size: 'lg' })} href="/sign-up">
              {t('primary_button')}
            </Link>
          </>
        )}
      />
    </Section>
  );
};
