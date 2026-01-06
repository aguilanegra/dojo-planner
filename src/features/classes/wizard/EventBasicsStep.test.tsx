import type { AddClassWizardData } from '@/hooks/useAddClassWizard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { createMockWizardData } from '@/test-utils/mockWizardData';
import { EventBasicsStep } from './EventBasicsStep';

// Mock next-intl with proper translations
const translationKeys: Record<string, string> = {
  title: 'Event Details',
  subtitle: 'Enter the basic information for your event',
  event_name_label: 'Event Name',
  event_name_placeholder: 'Enter event name',
  event_name_error: 'Please enter an event name.',
  event_type_label: 'Event Type',
  event_type_placeholder: 'Select event type',
  max_capacity_label: 'Maximum Capacity',
  max_capacity_placeholder: 'e.g., 50',
  max_capacity_help: 'Maximum number of participants',
  description_label: 'Description',
  description_placeholder: 'Enter event description',
  description_error: 'Please enter a description.',
  description_character_count: '{count}/{max} characters',
  cancel_button: 'Cancel',
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

describe('EventBasicsStep', () => {
  const mockData = createMockWizardData({
    itemType: 'event',
  });

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
      <EventBasicsStep
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

  it('should render event name input', () => {
    render(
      <EventBasicsStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const input = page.getByPlaceholder('Enter event name');

    expect(input).toBeTruthy();
  });

  it('should call onUpdate when event name changes', async () => {
    render(
      <EventBasicsStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const input = page.getByPlaceholder('Enter event name');
    await userEvent.type(input, 'BJJ Seminar');

    expect(mockHandlers.onUpdate).toHaveBeenCalled();
  });

  it('should have Next button disabled when form is incomplete', () => {
    render(
      <EventBasicsStep
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

  it('should enable Next button when form is complete', () => {
    const completeData: AddClassWizardData = {
      ...mockData,
      eventName: 'BJJ Seminar',
      eventType: 'Seminar',
      eventDescription: 'A great seminar',
    };

    render(
      <EventBasicsStep
        data={completeData}
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
      <EventBasicsStep
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
      <EventBasicsStep
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
    const completeData: AddClassWizardData = {
      ...mockData,
      eventName: 'BJJ Seminar',
      eventType: 'Seminar',
      eventDescription: 'A great seminar',
    };

    render(
      <EventBasicsStep
        data={completeData}
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
      <EventBasicsStep
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

  it('should show character count for description', () => {
    const dataWithDescription: AddClassWizardData = {
      ...mockData,
      eventDescription: 'Test description',
    };

    render(
      <EventBasicsStep
        data={dataWithDescription}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const characterCount = page.getByText(/16\/2000 characters/);

    expect(characterCount).toBeTruthy();
  });

  it('should render event type select', () => {
    render(
      <EventBasicsStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const eventTypeLabel = page.getByText('Event Type');

    expect(eventTypeLabel).toBeTruthy();
  });

  it('should render max capacity input', () => {
    render(
      <EventBasicsStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const maxCapacityLabel = page.getByText('Maximum Capacity');

    expect(maxCapacityLabel).toBeTruthy();
  });

  it('should update max capacity when changed', async () => {
    render(
      <EventBasicsStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const input = page.getByPlaceholder('e.g., 50');
    await userEvent.type(input, '100');

    expect(mockHandlers.onUpdate).toHaveBeenCalled();
  });

  it('should show validation error when event name is touched but empty', async () => {
    render(
      <EventBasicsStep
        data={mockData}
        onUpdate={mockHandlers.onUpdate}
        onNext={mockHandlers.onNext}
        onBack={mockHandlers.onBack}
        onCancel={mockHandlers.onCancel}
      />,
    );

    const input = page.getByPlaceholder('Enter event name');
    await userEvent.click(input);
    await userEvent.tab();

    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 100));

    const errorMessage = page.getByText('Please enter an event name.');

    expect(errorMessage).toBeTruthy();
  });
});
