import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { MembershipClassAccessCard } from './MembershipClassAccessCard';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Class Access',
  edit_button: 'Edit',
  class_limit_label: 'Class Limit',
  access_unlimited: 'Unlimited Classes',
  access_limited: '{count} Classes per Month',
  available_classes_label: 'Available Classes',
  no_classes: 'No classes assigned',
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

describe('MembershipClassAccessCard', () => {
  const mockOnEdit = vi.fn();

  const defaultProps = {
    classLimitType: 'unlimited' as const,
    classLimitCount: null,
    availableClasses: ['fundamentals', 'intro-bjj', 'no-gi'],
    onEdit: mockOnEdit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the card with title', () => {
    render(<MembershipClassAccessCard {...defaultProps} />);

    const heading = page.getByText('Class Access');

    expect(heading).toBeTruthy();
  });

  it('should render Edit button', () => {
    render(<MembershipClassAccessCard {...defaultProps} />);

    const editButton = page.getByRole('button');

    expect(editButton).toBeTruthy();
  });

  it('should call onEdit when Edit button is clicked', async () => {
    render(<MembershipClassAccessCard {...defaultProps} />);

    const editButton = page.getByRole('button');
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should render Unlimited Classes for unlimited class limit type', () => {
    render(<MembershipClassAccessCard {...defaultProps} />);

    const accessLabel = page.getByText('Unlimited Classes');

    expect(accessLabel).toBeTruthy();
  });

  it('should render limited classes count for limited class limit type', () => {
    render(
      <MembershipClassAccessCard
        {...defaultProps}
        classLimitType="limited"
        classLimitCount={8}
      />,
    );

    const accessLabel = page.getByText('8 Classes per Month');

    expect(accessLabel).toBeTruthy();
  });

  it('should render available classes as badges', () => {
    render(<MembershipClassAccessCard {...defaultProps} />);

    const fundamentals = page.getByText('Fundamentals');
    const introBjj = page.getByText('Intro to BJJ');
    const noGi = page.getByText('No-Gi');

    expect(fundamentals).toBeTruthy();
    expect(introBjj).toBeTruthy();
    expect(noGi).toBeTruthy();
  });

  it('should render no classes message when no classes are assigned', () => {
    render(
      <MembershipClassAccessCard
        {...defaultProps}
        availableClasses={[]}
      />,
    );

    const noClassesMessage = page.getByText('No classes assigned');

    expect(noClassesMessage).toBeTruthy();
  });

  it('should render class limit label', () => {
    render(<MembershipClassAccessCard {...defaultProps} />);

    const classLimitLabel = page.getByText('Class Limit');

    expect(classLimitLabel).toBeTruthy();
  });

  it('should render available classes label', () => {
    render(<MembershipClassAccessCard {...defaultProps} />);

    const availableClassesLabel = page.getByText('Available Classes');

    expect(availableClassesLabel).toBeTruthy();
  });
});
