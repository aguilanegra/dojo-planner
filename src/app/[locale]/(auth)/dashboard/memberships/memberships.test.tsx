import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import MembershipsPage from './page';

describe('Memberships Page', () => {
  it('renders memberships header', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const heading = page.getByRole('heading', { name: /Memberships/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders statistics', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const totalMemberships = page.getByText(/Total memberships/);
    const trialOptions = page.getByText(/Trial Options/);
    const totalMembers = page.getByText(/Total Members/);

    expect(totalMemberships).toBeInTheDocument();
    expect(trialOptions).toBeInTheDocument();
    expect(totalMembers).toBeInTheDocument();
  });

  it('renders add new membership button', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const button = page.getByRole('button', { name: /Add New Membership/i });

    expect(button).toBeInTheDocument();
  });

  it('renders filter dropdowns', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const statusButton = page.getByRole('button', { name: /All Status/i });
    const programButton = page.getByRole('button', { name: /All Programs/i });

    expect(statusButton).toBeInTheDocument();
    expect(programButton).toBeInTheDocument();
  });

  it('renders membership cards', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const monthlyCard = page.getByText(/12 Month Commitment/);
    const kidsCard = page.getByText(/Kids Monthly/);

    expect(monthlyCard).toBeInTheDocument();
    expect(kidsCard).toBeInTheDocument();
  });

  it('renders membership details', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const price = page.getByText(/\$150.00\/mo/);
    const activeMembers = page.getByText(/89 Active Members/);

    expect(price).toBeInTheDocument();
    expect(activeMembers).toBeInTheDocument();
  });
});
