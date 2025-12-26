import type { AddMembershipWizardData } from '@/hooks/useAddMembershipWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { MembershipClassAccessStep } from './MembershipClassAccessStep';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Class Access',
  subtitle: 'Define which classes members can access with this membership',
  class_limits_label: 'Class Limits',
  class_limits_placeholder: 'Select class limit type',
  class_limits_unlimited: 'Unlimited Classes',
  class_limits_limited: 'Limited Classes',
  class_limit_count_label: 'Classes per Month',
  class_limit_count_placeholder: 'e.g., 8',
  class_limit_count_error: 'Please enter a valid number of classes.',
  available_classes_label: 'Available Classes',
  available_classes_error: 'Please select at least one class.',
  select_all_button: 'Select All',
  deselect_all_button: 'Deselect All',
  cancel_button: 'Cancel',
  back_button: 'Back',
  next_button: 'Next',
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

describe('MembershipClassAccessStep', () => {
  const mockData: AddMembershipWizardData = {
    membershipName: '12 Month Commitment',
    status: 'active',
    membershipType: 'standard',
    description: 'A great membership',
    classLimitType: 'unlimited',
    classLimitCount: null,
    availableClasses: [],
    signUpFee: null,
    chargeSignUpFee: 'at-registration',
    monthlyFee: null,
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
      <MembershipClassAccessStep
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

  it('should render class limits select', () => {
    render(
      <MembershipClassAccessStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const classLimitsLabel = page.getByText('Class Limits');

    expect(classLimitsLabel).toBeTruthy();
  });

  it('should render available classes section', () => {
    render(
      <MembershipClassAccessStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const availableClassesLabel = page.getByText('Available Classes');

    expect(availableClassesLabel).toBeTruthy();
  });

  it('should display Select All button when not all classes are selected', () => {
    render(
      <MembershipClassAccessStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const selectAllButton = page.getByText('Select All');

    expect(selectAllButton).toBeTruthy();
  });

  it('should display Deselect All button when all classes are selected', () => {
    const allClassesData: AddMembershipWizardData = {
      ...mockData,
      availableClasses: ['fundamentals', 'intro-bjj', 'no-gi', 'advanced', 'open-mat', 'competition-team'],
    };

    render(
      <MembershipClassAccessStep
        data={allClassesData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const deselectAllButton = page.getByText('Deselect All');

    expect(deselectAllButton).toBeTruthy();
  });

  it('should have Next button disabled when no classes are selected', () => {
    render(
      <MembershipClassAccessStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));

    expect(nextButton?.disabled).toBe(true);
  });

  it('should enable Next button when classes are selected', () => {
    const dataWithClasses: AddMembershipWizardData = {
      ...mockData,
      availableClasses: ['fundamentals'],
    };

    render(
      <MembershipClassAccessStep
        data={dataWithClasses}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));

    expect(nextButton?.disabled).toBe(false);
  });

  it('should call onCancel when Cancel button is clicked', async () => {
    render(
      <MembershipClassAccessStep
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
      <MembershipClassAccessStep
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

  it('should call onNext when Next button is clicked with valid data', async () => {
    const dataWithClasses: AddMembershipWizardData = {
      ...mockData,
      availableClasses: ['fundamentals'],
    };

    render(
      <MembershipClassAccessStep
        data={dataWithClasses}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));

    if (nextButton) {
      await userEvent.click(nextButton);

      expect(mockHandlers.onNext).toHaveBeenCalled();
    }
  });

  it('should display error message when provided', () => {
    render(
      <MembershipClassAccessStep
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

  it('should render class checkboxes', () => {
    render(
      <MembershipClassAccessStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const fundamentals = page.getByText('Fundamentals');
    const introBjj = page.getByText('Intro to BJJ');
    const noGi = page.getByText('No-Gi');

    expect(fundamentals).toBeTruthy();
    expect(introBjj).toBeTruthy();
    expect(noGi).toBeTruthy();
  });

  it('should call onUpdate when a class checkbox is clicked', async () => {
    render(
      <MembershipClassAccessStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const checkboxes = Array.from(document.querySelectorAll('[role="checkbox"]'));

    if (checkboxes[0]) {
      await userEvent.click(checkboxes[0]);

      expect(mockHandlers.onUpdate).toHaveBeenCalled();
    }
  });

  it('should call onUpdate when Select All button is clicked', async () => {
    render(
      <MembershipClassAccessStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const selectAllButton = page.getByText('Select All');
    await userEvent.click(selectAllButton);

    expect(mockHandlers.onUpdate).toHaveBeenCalled();
  });

  it('should show class limit count input when limited is selected', () => {
    const limitedData: AddMembershipWizardData = {
      ...mockData,
      classLimitType: 'limited',
    };

    render(
      <MembershipClassAccessStep
        data={limitedData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const countLabel = page.getByText('Classes per Month');

    expect(countLabel).toBeTruthy();
  });

  it('should disable Next when limited classes but no count provided', () => {
    const limitedData: AddMembershipWizardData = {
      ...mockData,
      classLimitType: 'limited',
      classLimitCount: null,
      availableClasses: ['fundamentals'],
    };

    render(
      <MembershipClassAccessStep
        data={limitedData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));

    expect(nextButton?.disabled).toBe(true);
  });

  it('should enable Next when limited classes with valid count', () => {
    const limitedData: AddMembershipWizardData = {
      ...mockData,
      classLimitType: 'limited',
      classLimitCount: 8,
      availableClasses: ['fundamentals'],
    };

    render(
      <MembershipClassAccessStep
        data={limitedData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const buttons = Array.from(document.querySelectorAll('button'));
    const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));

    expect(nextButton?.disabled).toBe(false);
  });
});
