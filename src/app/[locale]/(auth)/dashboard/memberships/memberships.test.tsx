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

  it('renders statistics cards', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const totalMemberships = page.getByText(/Total memberships/);
    const trialOptions = page.getByText(/Trial Options/);
    const totalMembers = page.getByText(/Total Members/);

    expect(totalMemberships).toBeInTheDocument();
    expect(trialOptions).toBeInTheDocument();
    expect(totalMembers).toBeInTheDocument();
  });

  it('renders statistics values', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    // Stats should show dynamic values from mock data
    // Total memberships count of 7 appears in stats card
    const statValues = page.getByText('7', { exact: true }).elements();

    expect(statValues.length).toBeGreaterThan(0);
  });

  it('renders add new membership button', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const button = page.getByRole('button', { name: /Add New Membership/i });

    expect(button).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const searchInput = page.getByPlaceholder(/Search memberships/i);

    expect(searchInput).toBeInTheDocument();
  });

  it('renders tags filter dropdown', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    // Select trigger should show "All Tags" as default
    const tagsSelect = page.getByRole('combobox').elements();

    expect(tagsSelect.length).toBeGreaterThanOrEqual(2);
  });

  it('renders programs filter dropdown', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    // Both tag and program selects should be rendered
    const selectTriggers = page.getByRole('combobox').elements();

    expect(selectTriggers.length).toBe(2);
  });

  it('renders membership cards with names', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const monthlyCard = page.getByText(/12 Month Commitment/);
    const kidsCard = page.getByText(/Kids Monthly/);

    expect(monthlyCard).toBeInTheDocument();
    expect(kidsCard).toBeInTheDocument();
  });

  it('renders membership card pricing', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const price = page.getByText(/\$150.00\/mo/);

    expect(price).toBeInTheDocument();
  });

  it('renders membership card active members count', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const activeMembers = page.getByText(/89 Active Members/);

    expect(activeMembers).toBeInTheDocument();
  });

  it('renders membership card details labels', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const frequencyLabels = page.getByText('Frequency').elements();
    const contractLabels = page.getByText('Contract').elements();
    const accessLabels = page.getByText('Access').elements();

    expect(frequencyLabels.length).toBeGreaterThan(0);
    expect(contractLabels.length).toBeGreaterThan(0);
    expect(accessLabels.length).toBeGreaterThan(0);
  });

  it('renders edit buttons on membership cards', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const editButtons = page.getByRole('button', { name: /Edit membership/i }).elements();

    expect(editButtons.length).toBe(7);
  });

  it('renders active trials label for trial memberships', () => {
    render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

    const activeTrials = page.getByText(/Active Trials/).elements();

    expect(activeTrials.length).toBeGreaterThan(0);
  });
});
