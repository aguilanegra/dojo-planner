import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { MembersTable } from './MembersTable';

describe('MembersTable', () => {
  describe('Render method', () => {
    it('should render members table with members list', () => {
      const mockMembers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: null,
          dateOfBirth: null,
          photoUrl: null,
          lastAccessedAt: null,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          membershipType: 'monthly' as const,
          amountDue: '0.00',
          nextPayment: new Date(),
        },
      ];

      const mockOnEditAction = vi.fn();
      const mockOnRemoveAction = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onEditAction={mockOnEditAction}
          onRemoveAction={mockOnRemoveAction}
        />,
      );

      const memberName = page.getByRole('table').getByText('John Doe');

      expect(memberName).toBeInTheDocument();
    });

    it('should render empty state when no members', () => {
      const mockOnEditAction = vi.fn();
      const mockOnRemoveAction = vi.fn();

      render(
        <MembersTable
          members={[]}
          onEditAction={mockOnEditAction}
          onRemoveAction={mockOnRemoveAction}
        />,
      );

      const emptyState = page.getByText('No members found').first();

      expect(emptyState).toBeInTheDocument();
    });

    it('should render loading state when loading prop is true', () => {
      const mockOnEditAction = vi.fn();
      const mockOnRemoveAction = vi.fn();

      render(
        <MembersTable
          members={[]}
          onEditAction={mockOnEditAction}
          onRemoveAction={mockOnRemoveAction}
          loading
        />,
      );

      const loadingText = page.getByText('Loading members...').first();

      expect(loadingText).toBeInTheDocument();
    });
  });
});
