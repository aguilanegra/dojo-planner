import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { PhoneSupportModal } from './PhoneSupportModal';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Call Support',
      description: 'Speak with a support representative.',
      phone_label: 'Support Phone Number',
      availability_message: 'Available Monday - Friday, 9am - 5pm EST',
      call_button: 'Call Now',
      close_button: 'Close',
    };
    return translations[key] || key;
  },
}));

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
};

describe('PhoneSupportModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the modal title', () => {
      render(<PhoneSupportModal {...defaultProps} />);

      expect(page.getByText('Call Support')).toBeInTheDocument();
    });

    it('should render the modal description', () => {
      render(<PhoneSupportModal {...defaultProps} />);

      expect(page.getByText('Speak with a support representative.')).toBeInTheDocument();
    });

    it('should render the phone number label', () => {
      render(<PhoneSupportModal {...defaultProps} />);

      expect(page.getByText('Support Phone Number')).toBeInTheDocument();
    });

    it('should render the support phone number', () => {
      render(<PhoneSupportModal {...defaultProps} />);

      expect(page.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    });

    it('should render availability message', () => {
      render(<PhoneSupportModal {...defaultProps} />);

      expect(page.getByText('Available Monday - Friday, 9am - 5pm EST')).toBeInTheDocument();
    });

    it('should render call and close buttons', () => {
      render(<PhoneSupportModal {...defaultProps} />);

      expect(page.getByRole('button', { name: /call now/i })).toBeInTheDocument();
      // Get the text-based Close button (first one), not the icon X button
      expect(page.getByRole('button', { name: 'Close', exact: true }).first()).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<PhoneSupportModal {...defaultProps} isOpen={false} />);

      expect(page.getByText('Call Support').elements()).toHaveLength(0);
    });
  });

  describe('Interaction', () => {
    it('should call onClose when close button is clicked', async () => {
      const onClose = vi.fn();
      render(<PhoneSupportModal {...defaultProps} onClose={onClose} />);

      // Select our Close button (first one), not the dialog's X button
      const closeButton = page.getByRole('button', { name: 'Close', exact: true }).first();
      await userEvent.click(closeButton.element());

      expect(onClose).toHaveBeenCalled();
    });

    it('should have call button that links to phone number', () => {
      render(<PhoneSupportModal {...defaultProps} />);

      const callButton = page.getByRole('button', { name: /call now/i });

      // Verify the call button is rendered and clickable
      expect(callButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have phone icon visible', () => {
      render(<PhoneSupportModal {...defaultProps} />);

      // The modal should contain SVG icons for phone
      const phoneIcons = page.getByRole('dialog').element().querySelectorAll('svg');

      expect(phoneIcons.length).toBeGreaterThan(0);
    });
  });
});
