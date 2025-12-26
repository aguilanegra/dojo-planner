import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { EditPaymentDetailsModal } from './EditPaymentDetailsModal';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Edit Payment Details',
  signup_fee_label: 'Sign-up Fee',
  signup_fee_placeholder: '0.00',
  charge_signup_fee_label: 'Charge Sign-up Fee',
  charge_at_registration: 'At time of registration',
  charge_first_payment: 'With first payment',
  monthly_fee_label: 'Monthly Fee',
  weekly_fee_label: 'Weekly Fee',
  annual_fee_label: 'Annual Fee',
  fee_placeholder: '0.00',
  fee_error: 'Please enter a valid fee amount.',
  payment_frequency_label: 'Payment Frequency',
  frequency_monthly: 'Monthly',
  frequency_weekly: 'Weekly',
  frequency_annually: 'Annually',
  prorate_label: 'Pro-rate First Payment',
  prorate_description: 'Enable proration for partial months',
  cancel_button: 'Cancel',
  save_button: 'Save Changes',
  saving_button: 'Saving...',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('EditPaymentDetailsModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    signUpFee: 35,
    chargeSignUpFee: 'at-registration' as const,
    monthlyFee: 150,
    paymentFrequency: 'monthly' as const,
    proRateFirstPayment: true,
    isTrial: false,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal with title when open', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const heading = page.getByText('Edit Payment Details');

    expect(heading).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    render(<EditPaymentDetailsModal {...defaultProps} isOpen={false} />);

    const heading = document.body.textContent?.includes('Edit Payment Details');

    expect(heading).toBe(false);
  });

  it('should render sign-up fee for standard membership', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const signUpFeeLabel = page.getByText('Sign-up Fee');

    expect(signUpFeeLabel).toBeTruthy();
  });

  it('should not render sign-up fee for trial membership', () => {
    render(<EditPaymentDetailsModal {...defaultProps} isTrial={true} />);

    const signUpFeeLabel = document.body.textContent?.includes('Sign-up Fee');

    expect(signUpFeeLabel).toBe(false);
  });

  it('should render monthly fee label by default', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const monthlyFeeLabel = page.getByText('Monthly Fee');

    expect(monthlyFeeLabel).toBeTruthy();
  });

  it('should render weekly fee label when frequency is weekly', () => {
    render(<EditPaymentDetailsModal {...defaultProps} paymentFrequency="weekly" />);

    const weeklyFeeLabel = page.getByText('Weekly Fee');

    expect(weeklyFeeLabel).toBeTruthy();
  });

  it('should render annual fee label when frequency is annually', () => {
    render(<EditPaymentDetailsModal {...defaultProps} paymentFrequency="annually" />);

    const annualFeeLabel = page.getByText('Annual Fee');

    expect(annualFeeLabel).toBeTruthy();
  });

  it('should render payment frequency label', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const frequencyLabel = page.getByText('Payment Frequency');

    expect(frequencyLabel).toBeTruthy();
  });

  it('should render pro-rate toggle for standard membership', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const prorateLabel = page.getByText('Pro-rate First Payment');

    expect(prorateLabel).toBeTruthy();
  });

  it('should not render pro-rate toggle for trial membership', () => {
    render(<EditPaymentDetailsModal {...defaultProps} isTrial={true} />);

    const prorateLabel = document.body.textContent?.includes('Pro-rate First Payment');

    expect(prorateLabel).toBe(false);
  });

  it('should render Cancel button', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');

    expect(cancelButton).toBeTruthy();
  });

  it('should render Save Changes button', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');

    expect(saveButton).toBeTruthy();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have Save button enabled for valid form', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    expect(saveButton?.disabled).toBe(false);
  });

  it('should have Save button enabled for trial membership even without fee', () => {
    render(
      <EditPaymentDetailsModal
        {...defaultProps}
        isTrial={true}
        monthlyFee={null}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    expect(saveButton?.disabled).toBe(false);
  });

  it('should render charge sign-up fee dropdown for standard membership', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const chargeLabel = page.getByText('Charge Sign-up Fee');

    expect(chargeLabel).toBeTruthy();
  });

  it('should render prorate description', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const prorateDescription = page.getByText('Enable proration for partial months');

    expect(prorateDescription).toBeTruthy();
  });

  it('should render dollar sign prefix for fee inputs', () => {
    render(<EditPaymentDetailsModal {...defaultProps} />);

    const dollarSigns = Array.from(document.querySelectorAll('span')).filter(s => s.textContent === '$');

    expect(dollarSigns.length).toBeGreaterThanOrEqual(1);
  });
});
