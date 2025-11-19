import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="py-36">
      <CenteredHero
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
