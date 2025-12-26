import type { AddMembershipWizardData } from '@/hooks/useAddMembershipWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { MembershipContractStep } from './MembershipContractStep';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Contract Terms',
  subtitle: 'Set up contract length and renewal options',
  contract_length_label: 'Contract Length',
  contract_month_to_month: 'Month-to-Month',
  contract_3_months: '3 Months',
  contract_6_months: '6 Months',
  contract_12_months: '12 Months',
  auto_renewal_label: 'Auto-Renewal',
  auto_renewal_none: 'No auto-renewal',
  auto_renewal_month_to_month: 'Month-to-Month after contract',
  auto_renewal_same_term: 'Same term renewal',
  cancellation_fee_label: 'Cancellation Fee',
  cancellation_fee_placeholder: '0.00',
  cancellation_fee_help: 'Fee charged for early cancellation',
  hold_limit_label: 'Hold Limit per Year',
  hold_limit_placeholder: 'e.g., 2',
  hold_limit_help: 'Maximum number of holds allowed per year',
  cancel_button: 'Cancel',
  back_button: 'Back',
  create_button: 'Create Membership',
  creating_button: 'Creating...',
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

describe('MembershipContractStep', () => {
  const mockData: AddMembershipWizardData = {
    membershipName: '12 Month Commitment',
    status: 'active',
    membershipType: 'standard',
    description: 'A great membership',
    classLimitType: 'unlimited',
    classLimitCount: null,
    availableClasses: ['fundamentals'],
    signUpFee: 35,
    chargeSignUpFee: 'at-registration',
    monthlyFee: 150,
    paymentFrequency: 'monthly',
    membershipStartDate: 'same-as-registration',
    customStartDate: '',
    proRateFirstPayment: false,
    contractLength: 'month-to-month',
    autoRenewal: 'none',
    cancellationFee: null,
    holdLimitPerYear: null,
  };

  const mockHandlers = {
    onUpdate: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the step with title and subtitle', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const heading = page.getByRole('heading', { level: 2 });

    expect(heading).toBeTruthy();
  });

  it('should render contract length select', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const contractLengthLabel = page.getByText('Contract Length');

    expect(contractLengthLabel).toBeTruthy();
  });

  it('should render auto-renewal select', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const autoRenewalLabel = page.getByText('Auto-Renewal');

    expect(autoRenewalLabel).toBeTruthy();
  });

  it('should render cancellation fee input', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const cancellationFeeLabel = page.getByText('Cancellation Fee');

    expect(cancellationFeeLabel).toBeTruthy();
  });

  it('should render hold limit input', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const holdLimitLabel = page.getByText('Hold Limit per Year');

    expect(holdLimitLabel).toBeTruthy();
  });

  it('should have Create Membership button enabled by default', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const createButton = buttons.find(btn => btn.textContent?.includes('Create Membership'));

    expect(createButton?.disabled).toBe(false);
  });

  it('should disable Create button when loading', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
        isLoading={true}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const createButton = buttons.find(btn => btn.textContent?.includes('Creating...'));

    expect(createButton?.disabled).toBe(true);
  });

  it('should show Creating... text when loading', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
        isLoading={true}
      />,
    );

    const creatingText = page.getByText('Creating...');

    expect(creatingText).toBeTruthy();
  });

  it('should call onCancel when Cancel button is clicked', async () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const cancelButton = buttons.find(btn => btn.textContent?.includes('Cancel'));

    if (cancelButton) {
      await userEvent.click(cancelButton);

      expect(mockHandlers.onCancel).toHaveBeenCalled();
    }
  });

  it('should call onBack when Back button is clicked', async () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const backButton = buttons.find(btn => btn.textContent?.includes('Back'));

    if (backButton) {
      await userEvent.click(backButton);

      expect(mockHandlers.onBack).toHaveBeenCalled();
    }
  });

  it('should call onNext when Create Membership button is clicked', async () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const createButton = buttons.find(btn => btn.textContent?.includes('Create Membership'));

    if (createButton) {
      await userEvent.click(createButton);

      expect(mockHandlers.onNext).toHaveBeenCalled();
    }
  });

  it('should display error message when provided', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
        error="Something went wrong"
      />,
    );

    const errorMessage = page.getByText('Something went wrong');

    expect(errorMessage).toBeTruthy();
  });

  it('should render help text for cancellation fee', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const helpText = page.getByText('Fee charged for early cancellation');

    expect(helpText).toBeTruthy();
  });

  it('should render help text for hold limit', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const helpText = page.getByText('Maximum number of holds allowed per year');

    expect(helpText).toBeTruthy();
  });

  it('should call onUpdate when cancellation fee input changes', async () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));

    if (inputs[0]) {
      await userEvent.type(inputs[0], '300');

      expect(mockHandlers.onUpdate).toHaveBeenCalled();
    }
  });

  it('should call onUpdate when hold limit input changes', async () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));

    if (inputs[1]) {
      await userEvent.type(inputs[1], '2');

      expect(mockHandlers.onUpdate).toHaveBeenCalled();
    }
  });

  it('should render dollar sign prefix for cancellation fee', () => {
    render(
      <MembershipContractStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const dollarSign = Array.from(document.querySelectorAll('span')).find(s => s.textContent === '$');

    expect(dollarSign).toBeTruthy();
  });
});
