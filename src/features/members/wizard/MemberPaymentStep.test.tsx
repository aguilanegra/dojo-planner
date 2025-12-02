import type { AddMemberWizardData } from '@/hooks/useAddMemberWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { MemberPaymentStep } from './MemberPaymentStep';

// Mock next-intl
const translationKeys: Record<string, string> = {
  pay_amount: 'Pay {amount}',
  payment_description: '{plan} recurring membership ({period})',
  plan_monthly: 'monthly',
  plan_annual: 'annual',
  period_month: 'month',
  period_year: 'year',
  card_tab_label: 'Debit / Credit Card',
  ach_tab_label: 'ACH Bank Account',
  cardholder_name_label: 'Name on card',
  cardholder_name_placeholder: 'Full name as it appears on your card',
  card_number_label: 'Card number',
  card_number_placeholder: '1234 5678 9012 3456',
  card_expiry_label: 'Expiration MM/YY',
  card_expiry_placeholder: 'MM/YY',
  card_cvc_label: 'CVC/CVV',
  card_cvc_placeholder: '123',
  ach_account_holder_label: 'Account holder name',
  ach_account_holder_placeholder: 'Full name',
  ach_routing_number_label: 'Routing number',
  ach_routing_number_placeholder: '021000021',
  ach_account_number_label: 'Account number',
  ach_account_number_placeholder: '123456789',
  back_button: 'Back',
  cancel_button: 'Cancel',
  pay_button: 'Pay and finish',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string | number>) => {
    let result = translationKeys[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    return result;
  },
}));

const defaultProps = {
  data: {
    memberType: 'individual' as const,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    subscriptionPlan: 'monthly' as const,
    paymentMethod: 'card' as const,
  } as AddMemberWizardData,
  onUpdate: vi.fn(),
  onNext: vi.fn(),
  onBack: vi.fn(),
  onCancel: vi.fn(),
  isLoading: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('MemberPaymentStep', () => {
  it('renders payment amount for monthly plan', () => {
    render(
      <MemberPaymentStep {...defaultProps} />,
    );

    expect(page.getByText(/Pay \$160/)).toBeTruthy();
  });

  it('renders payment description with correct plan type', () => {
    render(
      <MemberPaymentStep {...defaultProps} />,
    );

    const description = page.getByText(/monthly recurring membership/);

    expect(description).toBeTruthy();
  });

  it('displays correct amount for annual plan', () => {
    const annualProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        subscriptionPlan: 'annual' as const,
      },
    };

    render(
      <MemberPaymentStep {...annualProps} />,
    );

    expect(page.getByText(/Pay \$1600/)).toBeTruthy();
  });

  it('shows credit card tab as selected by default', () => {
    render(
      <MemberPaymentStep {...defaultProps} />,
    );

    const cardButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Debit / Credit Card')) as HTMLButtonElement;

    expect(cardButton?.classList.contains('border-primary')).toBeTruthy();
  });

  it('switches to ACH tab when clicked', async () => {
    const onUpdate = vi.fn();
    render(
      <MemberPaymentStep
        {...defaultProps}
        onUpdate={onUpdate}
      />,
    );

    const achButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('ACH Bank Account')) as HTMLButtonElement;
    await userEvent.click(achButton!);

    expect(onUpdate).toHaveBeenCalledWith({ paymentMethod: 'ach' });
  });

  it('renders card form fields when card tab is selected', () => {
    render(
      <MemberPaymentStep {...defaultProps} />,
    );

    expect(page.getByLabelText(/Name on card/)).toBeTruthy();
    expect(page.getByLabelText(/Card number/)).toBeTruthy();
    expect(page.getByLabelText(/Expiration MM\/YY/)).toBeTruthy();
    expect(page.getByLabelText(/CVC\/CVV/)).toBeTruthy();
  });

  it('renders ACH form fields when ACH tab is selected', () => {
    const achProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        paymentMethod: 'ach' as const,
      },
    };

    render(
      <MemberPaymentStep {...achProps} />,
    );

    expect(page.getByLabelText(/Account holder name/)).toBeTruthy();
    expect(page.getByLabelText(/Routing number/)).toBeTruthy();
    expect(page.getByLabelText(/Account number/)).toBeTruthy();
  });

  it('disables pay button when card form is incomplete', () => {
    render(
      <MemberPaymentStep {...defaultProps} />,
    );

    const payButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Pay and finish')) as HTMLButtonElement;

    expect(payButton?.disabled).toBe(true);
  });

  it('disables pay button when ACH form is incomplete', () => {
    const achProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        paymentMethod: 'ach' as const,
        achAccountHolder: '',
      },
    };

    render(
      <MemberPaymentStep {...achProps} />,
    );

    const payButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Pay and finish')) as HTMLButtonElement;

    expect(payButton?.disabled).toBe(true);
  });

  it('enables pay button when all card fields are filled', () => {
    const completedProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        cardholderName: 'John Doe',
        cardNumber: '4111111111111111',
        cardExpiry: '12/25',
        cardCvc: '123',
      },
    };

    render(
      <MemberPaymentStep {...completedProps} />,
    );

    const payButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Pay and finish')) as HTMLButtonElement;

    expect(payButton?.disabled).toBe(false);
  });

  it('enables pay button when all ACH fields are filled', () => {
    const completedProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        paymentMethod: 'ach' as const,
        achAccountHolder: 'John Doe',
        achRoutingNumber: '021000021',
        achAccountNumber: '123456789',
      },
    };

    render(
      <MemberPaymentStep {...completedProps} />,
    );

    const payButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Pay and finish')) as HTMLButtonElement;

    expect(payButton?.disabled).toBe(false);
  });

  it('calls onUpdate when card field changes', async () => {
    const onUpdate = vi.fn();
    render(
      <MemberPaymentStep
        {...defaultProps}
        onUpdate={onUpdate}
      />,
    );

    const nameInput = document.querySelector('input#cardholderName') as HTMLInputElement;
    if (nameInput) {
      await userEvent.fill(nameInput, 'Jane Doe');
    }

    expect(onUpdate).toHaveBeenCalledWith({ cardholderName: 'Jane Doe' });
  });

  it('calls onUpdate when ACH field changes', async () => {
    const onUpdate = vi.fn();
    const achProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        paymentMethod: 'ach' as const,
      },
      onUpdate,
    };

    render(
      <MemberPaymentStep {...achProps} />,
    );

    const accountHolderInput = document.querySelector('input#achAccountHolder') as HTMLInputElement;
    if (accountHolderInput) {
      await userEvent.fill(accountHolderInput, 'Jane Doe');
    }

    expect(onUpdate).toHaveBeenCalledWith({ achAccountHolder: 'Jane Doe' });
  });

  it('calls onNext when pay button is clicked', async () => {
    const onNext = vi.fn();
    const completedProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        cardholderName: 'John Doe',
        cardNumber: '4111111111111111',
        cardExpiry: '12/25',
        cardCvc: '123',
      },
      onNext,
    };

    render(
      <MemberPaymentStep {...completedProps} />,
    );

    const payButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Pay and finish'));
    if (payButton) {
      await userEvent.click(payButton);

      expect(onNext).toHaveBeenCalled();
    }
  });

  it('calls onBack when back button is clicked', async () => {
    const onBack = vi.fn();
    render(
      <MemberPaymentStep
        {...defaultProps}
        onBack={onBack}
      />,
    );

    const backButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Back'));
    if (backButton) {
      await userEvent.click(backButton);

      expect(onBack).toHaveBeenCalled();
    }
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn();
    render(
      <MemberPaymentStep
        {...defaultProps}
        onCancel={onCancel}
      />,
    );

    const cancelButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Cancel'));
    if (cancelButton) {
      await userEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    }
  });

  it('shows loading state on pay button', () => {
    const completedProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        cardholderName: 'John Doe',
        cardNumber: '4111111111111111',
        cardExpiry: '12/25',
        cardCvc: '123',
      },
      isLoading: true,
    };

    render(
      <MemberPaymentStep {...completedProps} />,
    );

    const payButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Pay and finish...')) as HTMLButtonElement;

    expect(payButton?.disabled).toBe(true);
  });

  it('populates card fields with provided data', () => {
    const populatedProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        cardholderName: 'John Doe',
        cardNumber: '4111111111111111',
        cardExpiry: '12/25',
        cardCvc: '123',
      },
    };

    render(
      <MemberPaymentStep {...populatedProps} />,
    );

    const nameInput = document.querySelector('input#cardholderName') as HTMLInputElement;
    const cardInput = document.querySelector('input#cardNumber') as HTMLInputElement;
    const expiryInput = document.querySelector('input#cardExpiry') as HTMLInputElement;
    const cvcInput = document.querySelector('input#cardCvc') as HTMLInputElement;

    expect(nameInput?.value).toBe('John Doe');
    expect(cardInput?.value).toBe('4111111111111111');
    expect(expiryInput?.value).toBe('12/25');
    expect(cvcInput?.value).toBe('123');
  });

  it('populates ACH fields with provided data', () => {
    const populatedProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        paymentMethod: 'ach' as const,
        achAccountHolder: 'Jane Doe',
        achRoutingNumber: '021000021',
        achAccountNumber: '123456789',
      },
    };

    render(
      <MemberPaymentStep {...populatedProps} />,
    );

    const accountHolderInput = document.querySelector('input#achAccountHolder') as HTMLInputElement;
    const routingInput = document.querySelector('input#achRoutingNumber') as HTMLInputElement;
    const accountInput = document.querySelector('input#achAccountNumber') as HTMLInputElement;

    expect(accountHolderInput?.value).toBe('Jane Doe');
    expect(routingInput?.value).toBe('021000021');
    expect(accountInput?.value).toBe('123456789');
  });
});
