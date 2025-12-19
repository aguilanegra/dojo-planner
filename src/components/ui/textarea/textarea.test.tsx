import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Textarea } from './textarea';

describe('Textarea', () => {
  describe('Rendering', () => {
    it('should render a textarea element', () => {
      render(<Textarea aria-label="test-textarea" />);

      expect(page.getByRole('textbox', { name: 'test-textarea' })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Textarea aria-label="test-textarea" className="min-h-24" />);

      const textarea = page.getByRole('textbox', { name: 'test-textarea' });

      expect(textarea).toHaveClass('min-h-24');
    });

    it('should render with placeholder', () => {
      render(<Textarea placeholder="Enter text here" />);

      expect(page.getByPlaceholder('Enter text here')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should set error state via aria-invalid', () => {
      render(<Textarea aria-label="test-textarea" error={true} />);

      const textarea = page.getByRole('textbox', { name: 'test-textarea' });

      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Textarea aria-label="test-textarea" disabled />);

      const textarea = page.getByRole('textbox', { name: 'test-textarea' });

      expect(textarea).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    it('should accept user input', async () => {
      render(<Textarea aria-label="test-textarea" />);

      const textarea = page.getByRole('textbox', { name: 'test-textarea' });
      await userEvent.type(textarea, 'Hello World');

      expect(textarea).toHaveValue('Hello World');
    });
  });
});
