'use client';

import type { AddMemberWizardData, PaymentDeclineReason, PaymentMethod, PaymentStatus } from '@/hooks/useAddMemberWizard';
import { AlertCircle, CheckCircle2, CreditCard, Landmark, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type MemberPaymentStepProps = {
  data: AddMemberWizardData;
  onUpdateAction: (updates: Partial<AddMemberWizardData>) => void;
  onNextAction: () => void;
  onBackAction: () => void;
  onCancelAction: () => void;
  isLoading?: boolean;
};

type MockPaymentResult = {
  success: boolean;
  status: PaymentStatus;
  declineReason?: PaymentDeclineReason;
  transactionId?: string;
};

/**
 * FIX: This mock payment API should be replaced with actual payment processor integration
 * (e.g., Stripe, Square, or similar payment gateway) in production.
 *
 * Mock payment logic for testing:
 * - Card number ending in '0000' or CVC all zeros (000, 0000, etc.) = declined (insufficient funds)
 * - Card number ending in '0001' or CVC '001' = declined (invalid CVC)
 * - Card number ending in '0002' = declined (expired card)
 * - Card number ending in '0003' = declined (card declined)
 * - ACH routing number '000000000' = declined (ACH failed)
 * - All other values = approved
 *
 * Test card numbers (use any expiry date in future):
 * - 4111111111111111 = approved
 * - 4111111111110000 = declined (insufficient funds)
 * - 4111111111110001 = declined (invalid CVC)
 */
async function mockProcessPayment(
  paymentMethod: PaymentMethod,
  cardNumber?: string,
  cardCvc?: string,
  achRoutingNumber?: string,
): Promise<MockPaymentResult> {
  // Simulate network delay (1-2 seconds)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Check for decline conditions based on card/ACH details
  // Normalize CVC by removing spaces and checking if it contains only zeros
  const normalizedCvc = cardCvc?.replace(/\s/g, '') || '';
  const isAllZerosCvc = normalizedCvc.length >= 3 && /^0+$/.test(normalizedCvc);

  if (paymentMethod === 'card') {
    if (cardNumber?.endsWith('0000') || isAllZerosCvc) {
      return {
        success: false,
        status: 'declined',
        declineReason: 'insufficient_funds',
      };
    }
    if (cardNumber?.endsWith('0001') || normalizedCvc === '001') {
      return {
        success: false,
        status: 'declined',
        declineReason: 'invalid_cvc',
      };
    }
    if (cardNumber?.endsWith('0002')) {
      return {
        success: false,
        status: 'declined',
        declineReason: 'expired_card',
      };
    }
    if (cardNumber?.endsWith('0003')) {
      return {
        success: false,
        status: 'declined',
        declineReason: 'card_declined',
      };
    }
  }

  if (paymentMethod === 'ach') {
    if (achRoutingNumber === '000000000') {
      return {
        success: false,
        status: 'declined',
        declineReason: 'ach_failed',
      };
    }
  }

  // Generate mock transaction ID
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    success: true,
    status: 'approved',
    transactionId,
  };
}

const formatPaymentAmount = (price?: number): string => {
  if (price === undefined || price === null || price === 0) {
    return '$0';
  }
  return `$${price.toFixed(2)}`;
};

const getFrequencyLabel = (frequency?: string): string => {
  if (!frequency || frequency === 'None') {
    return '';
  }
  const lower = frequency.toLowerCase();
  if (lower === 'monthly') {
    return 'month';
  }
  if (lower === 'annual' || lower === 'annually' || lower === 'yearly') {
    return 'year';
  }
  return lower;
};

export const MemberPaymentStep = ({
  data,
  onUpdateAction,
  onNextAction,
  onBackAction,
  onCancelAction,
  isLoading = false,
}: MemberPaymentStepProps) => {
  const t = useTranslations('AddMemberWizard.MemberPaymentStep');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const paymentMethod = data.paymentMethod || 'card';
  const paymentAmount = formatPaymentAmount(data.membershipPlanPrice);
  const frequencyLabel = getFrequencyLabel(data.membershipPlanFrequency);
  const paymentStatus = data.paymentStatus;
  const paymentProcessed = data.paymentProcessed;

  const handleInputChange = (field: string, value: string) => {
    // Reset payment status when user changes payment details after a decline
    // This allows them to retry with new information
    if (paymentStatus === 'declined') {
      onUpdateAction({
        [field]: value,
        paymentStatus: undefined,
        paymentDeclineReason: undefined,
        paymentProcessed: false,
      });
    } else {
      onUpdateAction({ [field]: value });
    }
  };

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    onUpdateAction({
      paymentMethod: method,
      // Reset payment status when changing method
      paymentStatus: undefined,
      paymentDeclineReason: undefined,
      paymentProcessed: false,
    });
  };

  // Card validation helpers for touched fields
  const isCardholderNameInvalid = touched.cardholderName && !data.cardholderName;
  const isCardNumberInvalid = touched.cardNumber && !data.cardNumber;
  const isCardExpiryInvalid = touched.cardExpiry && !data.cardExpiry;
  const isCardCvcInvalid = touched.cardCvc && !data.cardCvc;

  // ACH validation helpers for touched fields
  const isAchAccountHolderInvalid = touched.achAccountHolder && !data.achAccountHolder;
  const isAchRoutingNumberInvalid = touched.achRoutingNumber && !data.achRoutingNumber;
  const isAchAccountNumberInvalid = touched.achAccountNumber && !data.achAccountNumber;

  const isCardFormValid = paymentMethod === 'card'
    && data.cardholderName
    && data.cardNumber
    && data.cardExpiry
    && data.cardCvc;

  const isAchFormValid = paymentMethod === 'ach'
    && data.achAccountHolder
    && data.achRoutingNumber
    && data.achAccountNumber;

  const isFormValid = isCardFormValid || isAchFormValid;

  const handleProcessPayment = async () => {
    if (!isFormValid || isProcessingPayment) {
      return;
    }

    setIsProcessingPayment(true);
    onUpdateAction({ paymentStatus: 'processing' });

    try {
      const result = await mockProcessPayment(
        paymentMethod,
        data.cardNumber,
        data.cardCvc,
        data.achRoutingNumber,
      );

      onUpdateAction({
        paymentStatus: result.status,
        paymentDeclineReason: result.declineReason,
        paymentProcessed: true,
      });
    } catch {
      onUpdateAction({
        paymentStatus: 'declined',
        paymentDeclineReason: 'card_declined',
        paymentProcessed: true,
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getDeclineReasonMessage = (reason?: PaymentDeclineReason): string => {
    switch (reason) {
      case 'insufficient_funds':
        return t('decline_reason_insufficient_funds');
      case 'invalid_cvc':
        return t('decline_reason_invalid_cvc');
      case 'expired_card':
        return t('decline_reason_expired_card');
      case 'card_declined':
        return t('decline_reason_card_declined');
      case 'ach_failed':
        return t('decline_reason_ach_failed');
      default:
        return t('decline_reason_generic');
    }
  };

  // Determine plan label and period for display
  const planText = data.membershipPlanName || '';
  const periodText = frequencyLabel;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('pay_amount', { amount: paymentAmount })}</h2>
        <p className="text-sm text-muted-foreground">
          {t('payment_description', {
            plan: planText,
            amount: paymentAmount,
            period: periodText,
          })}
        </p>
      </div>

      {/* Payment Status Alerts */}
      {paymentStatus === 'approved' && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">
              {t('payment_approved_title')}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {t('payment_approved_message')}
            </p>
          </div>
        </div>
      )}

      {paymentStatus === 'declined' && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-200">
              {t('payment_declined_title')}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {getDeclineReasonMessage(data.paymentDeclineReason)}
            </p>
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
              {t('payment_declined_continue_message')}
            </p>
          </div>
        </div>
      )}

      {paymentStatus === 'processing' && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('payment_processing_message')}
          </p>
        </div>
      )}

      {/* Payment Method Tabs */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handlePaymentMethodChange('card')}
          disabled={isProcessingPayment}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
            paymentMethod === 'card'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
          } ${isProcessingPayment ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <CreditCard className="h-5 w-5" />
          <span className="font-medium">{t('card_tab_label')}</span>
        </button>

        <button
          type="button"
          onClick={() => handlePaymentMethodChange('ach')}
          disabled={isProcessingPayment}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
            paymentMethod === 'ach'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
          } ${isProcessingPayment ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <Landmark className="h-5 w-5" />
          <span className="font-medium">{t('ach_tab_label')}</span>
        </button>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium">
              {t('cardholder_name_label')}
            </label>
            <Input
              id="cardholderName"
              placeholder={t('cardholder_name_placeholder')}
              value={data.cardholderName || ''}
              onChange={e => handleInputChange('cardholderName', e.target.value)}
              onBlur={() => handleInputBlur('cardholderName')}
              error={isCardholderNameInvalid}
              disabled={isProcessingPayment}
              className="mt-1"
            />
            {isCardholderNameInvalid && (
              <p className="text-xs text-destructive">{t('cardholder_name_error')}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium">
              {t('card_number_label')}
            </label>
            <Input
              id="cardNumber"
              placeholder={t('card_number_placeholder')}
              value={data.cardNumber || ''}
              onChange={e => handleInputChange('cardNumber', e.target.value)}
              onBlur={() => handleInputBlur('cardNumber')}
              error={isCardNumberInvalid}
              disabled={isProcessingPayment}
              className="mt-1"
            />
            {isCardNumberInvalid && (
              <p className="text-xs text-destructive">{t('card_number_error')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardExpiry" className="block text-sm font-medium">
                {t('card_expiry_label')}
              </label>
              <Input
                id="cardExpiry"
                placeholder={t('card_expiry_placeholder')}
                value={data.cardExpiry || ''}
                onChange={e => handleInputChange('cardExpiry', e.target.value)}
                onBlur={() => handleInputBlur('cardExpiry')}
                error={isCardExpiryInvalid}
                disabled={isProcessingPayment}
                className="mt-1"
              />
              {isCardExpiryInvalid && (
                <p className="text-xs text-destructive">{t('card_expiry_error')}</p>
              )}
            </div>

            <div>
              <label htmlFor="cardCvc" className="block text-sm font-medium">
                {t('card_cvc_label')}
              </label>
              <Input
                id="cardCvc"
                placeholder={t('card_cvc_placeholder')}
                value={data.cardCvc || ''}
                onChange={e => handleInputChange('cardCvc', e.target.value)}
                onBlur={() => handleInputBlur('cardCvc')}
                error={isCardCvcInvalid}
                disabled={isProcessingPayment}
                className="mt-1"
              />
              {isCardCvcInvalid && (
                <p className="text-xs text-destructive">{t('card_cvc_error')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACH Payment Form */}
      {paymentMethod === 'ach' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="achAccountHolder" className="block text-sm font-medium">
              {t('ach_account_holder_label')}
            </label>
            <Input
              id="achAccountHolder"
              placeholder={t('ach_account_holder_placeholder')}
              value={data.achAccountHolder || ''}
              onChange={e => handleInputChange('achAccountHolder', e.target.value)}
              onBlur={() => handleInputBlur('achAccountHolder')}
              error={isAchAccountHolderInvalid}
              disabled={isProcessingPayment}
              className="mt-1"
            />
            {isAchAccountHolderInvalid && (
              <p className="text-xs text-destructive">{t('ach_account_holder_error')}</p>
            )}
          </div>

          <div>
            <label htmlFor="achRoutingNumber" className="block text-sm font-medium">
              {t('ach_routing_number_label')}
            </label>
            <Input
              id="achRoutingNumber"
              placeholder={t('ach_routing_number_placeholder')}
              value={data.achRoutingNumber || ''}
              onChange={e => handleInputChange('achRoutingNumber', e.target.value)}
              onBlur={() => handleInputBlur('achRoutingNumber')}
              error={isAchRoutingNumberInvalid}
              disabled={isProcessingPayment}
              className="mt-1"
            />
            {isAchRoutingNumberInvalid && (
              <p className="text-xs text-destructive">{t('ach_routing_number_error')}</p>
            )}
          </div>

          <div>
            <label htmlFor="achAccountNumber" className="block text-sm font-medium">
              {t('ach_account_number_label')}
            </label>
            <Input
              id="achAccountNumber"
              placeholder={t('ach_account_number_placeholder')}
              value={data.achAccountNumber || ''}
              onChange={e => handleInputChange('achAccountNumber', e.target.value)}
              onBlur={() => handleInputBlur('achAccountNumber')}
              error={isAchAccountNumberInvalid}
              disabled={isProcessingPayment}
              className="mt-1"
            />
            {isAchAccountNumberInvalid && (
              <p className="text-xs text-destructive">{t('ach_account_number_error')}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBackAction} disabled={isProcessingPayment}>
            {t('back_button')}
          </Button>
          <Button variant="outline" onClick={onCancelAction} disabled={isProcessingPayment}>
            {t('cancel_button')}
          </Button>
        </div>
        <div className="flex gap-3">
          {/* Show Process Payment button when payment has not been processed yet */}
          {!paymentProcessed && (
            <Button
              onClick={handleProcessPayment}
              disabled={!isFormValid || isProcessingPayment || isLoading}
            >
              {isProcessingPayment
                ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('processing_button')}
                    </>
                  )
                : t('process_payment_button')}
            </Button>
          )}
          {/* When payment is declined, show both Retry and Continue Anyway buttons */}
          {paymentStatus === 'declined' && (
            <>
              <Button
                variant="outline"
                onClick={handleProcessPayment}
                disabled={!isFormValid || isProcessingPayment || isLoading}
              >
                {isProcessingPayment
                  ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('processing_button')}
                      </>
                    )
                  : t('retry_payment_button')}
              </Button>
              <Button onClick={onNextAction} disabled={isLoading} variant="destructive">
                {isLoading ? `${t('continue_anyway_button')}...` : t('continue_anyway_button')}
              </Button>
            </>
          )}
          {/* Show Next button when payment is approved */}
          {paymentStatus === 'approved' && (
            <Button onClick={onNextAction} disabled={isLoading}>
              {isLoading ? `${t('next_button')}...` : t('next_button')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
