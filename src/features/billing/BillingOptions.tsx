import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { PLAN_ID } from '@/utils/AppConfig';
import { PricingInformation } from './PricingInformation';

export const BillingOptions = () => {
  const t = useTranslations('BillingOptions');

  return (
    <PricingInformation
      buttonList={{
        [PLAN_ID.FREE]: (
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            disabled
          >
            {t('current_plan')}
          </Button>
        ),
        [PLAN_ID.FREE_TRIAL]: (
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            disabled
          >
            {t('current_plan')}
          </Button>
        ),
        [PLAN_ID.MONTHLY]: (
          <Link
            className={buttonVariants({
              size: 'sm',
              className: 'w-full',
            })}
            href={`/dashboard/billing/checkout/${PLAN_ID.MONTHLY}`}
            prefetch={false}
          >
            {t('upgrade_plan')}
          </Link>
        ),
        [PLAN_ID.ANNUAL]: (
          <Link
            className={buttonVariants({
              size: 'sm',
              className: 'w-full',
            })}
            href={`/dashboard/billing/checkout/${PLAN_ID.ANNUAL}`}
            prefetch={false}
          >
            {t('upgrade_plan')}
          </Link>
        ),
      }}
    />
  );
};
