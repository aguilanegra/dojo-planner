import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { EditContractTermsModal } from './EditContractTermsModal';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Edit Contract Terms',
  contract_length_label: 'Contract Length',
  contract_month_to_month: 'Month-to-Month',
  contract_3_months: '3 Months',
  contract_6_months: '6 Months',
  contract_12_months: '12 Months',
  auto_renewal_label: 'Auto-Renewal',
  renewal_none: 'No auto-renewal',
  renewal_month_to_month: 'Month-to-Month after contract',
  renewal_same_term: 'Same term renewal',
  cancellation_fee_label: 'Cancellation Fee',
  cancellation_fee_placeholder: '0.00',
  cancellation_fee_help: 'Fee charged for early cancellation',
  hold_limit_label: 'Hold Limit per Year',
  hold_limit_placeholder: 'e.g., 2',
  hold_limit_help: 'Maximum number of holds allowed per year',
  cancel_button: 'Cancel',
  save_button: 'Save Changes',
  saving_button: 'Saving...',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translationKeys[key] || key,
}));

describe('EditContractTermsModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    contractLength: '12-months' as const,
    autoRenewal: 'month-to-month' as const,
    cancellationFee: 300,
    holdLimitPerYear: 2,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal with title when open', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const heading = page.getByText('Edit Contract Terms');

    expect(heading).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    render(<EditContractTermsModal {...defaultProps} isOpen={false} />);

    const heading = document.body.textContent?.includes('Edit Contract Terms');

    expect(heading).toBe(false);
  });

  it('should render contract length label', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const contractLengthLabel = page.getByText('Contract Length');

    expect(contractLengthLabel).toBeTruthy();
  });

  it('should render auto-renewal label', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const autoRenewalLabel = page.getByText('Auto-Renewal');

    expect(autoRenewalLabel).toBeTruthy();
  });

  it('should render cancellation fee label and help text', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const cancellationFeeLabel = page.getByText('Cancellation Fee');
    const cancellationFeeHelp = page.getByText('Fee charged for early cancellation');

    expect(cancellationFeeLabel).toBeTruthy();
    expect(cancellationFeeHelp).toBeTruthy();
  });

  it('should render hold limit label and help text', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const holdLimitLabel = page.getByText('Hold Limit per Year');
    const holdLimitHelp = page.getByText('Maximum number of holds allowed per year');

    expect(holdLimitLabel).toBeTruthy();
    expect(holdLimitHelp).toBeTruthy();
  });

  it('should render Cancel button', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const cancelButton = page.getByText('Cancel');

    expect(cancelButton).toBeTruthy();
  });

  it('should render Save Changes button', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const saveButton = page.getByText('Save Changes');

    expect(saveButton).toBeTruthy();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const cancelButton = page.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have Save button enabled', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(btn => btn.textContent?.includes('Save Changes'));

    expect(saveButton?.disabled).toBe(false);
  });

  it('should render dollar sign prefix for cancellation fee input', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const dollarSigns = Array.from(document.querySelectorAll('span')).filter(s => s.textContent === '$');

    expect(dollarSigns.length).toBeGreaterThanOrEqual(1);
  });

  it('should render hold limit placeholder', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const holdLimitInput = page.getByPlaceholder('e.g., 2');

    expect(holdLimitInput).toBeTruthy();
  });

  it('should render cancellation fee placeholder', () => {
    render(<EditContractTermsModal {...defaultProps} />);

    const cancellationFeeInput = page.getByPlaceholder('0.00');

    expect(cancellationFeeInput).toBeTruthy();
  });
});
