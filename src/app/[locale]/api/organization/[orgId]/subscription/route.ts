import { NextResponse } from 'next/server';
import { determineSubscriptionPlan } from '@/services/BillingService';
import { getStripeSubscription } from '@/services/OrganizationService';
import { PLAN_ID } from '@/utils/AppConfig';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; orgId: string }> },
) {
  try {
    // Fetch the organization's subscription details from the database
    const { orgId } = await params;
    const subscription = await getStripeSubscription(orgId);

    if (!subscription) {
      // Organization has no subscription, return free plan
      return NextResponse.json({
        subscriptionType: 'free',
        plan: PLAN_ID.FREE,
        isPaid: false,
      });
    }

    // Determine the subscription plan details
    const planDetails = determineSubscriptionPlan(subscription);

    // Map plan ID to subscription type for display
    let subscriptionType: 'free' | 'free_trial' | 'monthly' | 'annual';

    switch (planDetails.plan.id) {
      case PLAN_ID.ANNUAL:
        subscriptionType = 'annual';
        break;
      case PLAN_ID.MONTHLY:
        subscriptionType = 'monthly';
        break;
      case PLAN_ID.FREE_TRIAL:
        subscriptionType = 'free_trial';
        break;
      case PLAN_ID.FREE:
      default:
        subscriptionType = 'free';
        break;
    }

    return NextResponse.json({
      subscriptionType,
      plan: planDetails.plan.id,
      isPaid: planDetails.isPaid,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 },
    );
  }
}
