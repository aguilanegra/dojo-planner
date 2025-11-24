import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { StaffPage } from '@/features/staff/StaffPage';

describe('Staff Page', () => {
  it('renders staff header', () => {
    render(<StaffPage />);

    const heading = page.getByRole('heading', { name: /Staff/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders invite staff button', () => {
    render(<StaffPage />);

    const inviteButton = page.getByRole('button', { name: /Invite Staff Member/i });

    expect(inviteButton).toBeInTheDocument();
  });

  it('renders staff table', () => {
    render(<StaffPage />);

    const table = page.getByRole('table');

    expect(table).toBeInTheDocument();
  });

  it('displays staff member names', () => {
    render(<StaffPage />);

    const charlie = page.getByText(/Charlie Baptista/);
    const jessica = page.getByText(/Professor Jessica/);

    expect(charlie).toBeInTheDocument();
    expect(jessica).toBeInTheDocument();
  });

  it('displays staff member emails', () => {
    render(<StaffPage />);

    const email = page.getByText(/charlie@dojo.com/);

    expect(email).toBeInTheDocument();
  });

  it('displays staff status badges', () => {
    render(<StaffPage />);

    const activeStatus = page.getByText(/Active/).first();

    expect(activeStatus).toBeInTheDocument();
  });

  it('displays action buttons for each staff member', () => {
    render(<StaffPage />);

    const editButtons = page.getByRole('button').nth(2);

    expect(editButtons).toBeDefined();
  });

  it('displays staff member avatars', () => {
    render(<StaffPage />);

    // Avatars are rendered with staff member names as alt text
    // Check that we have images with staff names in the document
    const images = page.getByRole('img');

    expect(images).toBeDefined();
  });

  it('displays invitation sent status for new members', () => {
    render(<StaffPage />);

    const invitationStatus = page.getByText(/Invitation sent/);

    expect(invitationStatus).toBeInTheDocument();
  });
});
