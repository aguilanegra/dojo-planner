import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
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

  describe('Manage Tags Button', () => {
    it('renders manage tags button next to header', () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      const manageTagsButton = page.getByRole('button', { name: /Manage Tags/i });

      expect(manageTagsButton).toBeInTheDocument();
    });

    it('opens membership tags management sheet when clicked', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      const manageTagsButton = page.getByRole('button', { name: /Manage Tags/i });
      await userEvent.click(manageTagsButton);

      const sheetTitle = page.getByRole('heading', { name: 'Membership Tags Management' });

      expect(sheetTitle).toBeInTheDocument();
    });

    it('closes membership tags management sheet when close button is clicked', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      const manageTagsButton = page.getByRole('button', { name: /Manage Tags/i });
      await userEvent.click(manageTagsButton);

      const closeButton = page.getByRole('button', { name: 'Close' });
      await userEvent.click(closeButton);

      const sheetTitle = page.getByRole('heading', { name: 'Membership Tags Management' });

      expect(sheetTitle.elements()).toHaveLength(0);
    });
  });

  describe('Filter Functionality', () => {
    it('filters memberships when searching by name', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder(/Search memberships/i);
      await userEvent.type(searchInput, 'Kids Monthly');

      const kidsCard = page.getByText(/Kids Monthly/);

      expect(kidsCard).toBeInTheDocument();

      // Gold membership should not be visible
      const goldCardElements = page.getByText('12 Month Commitment (Gold)');

      expect(goldCardElements.elements()).toHaveLength(0);
    });

    it('filters memberships by tag - Trial', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      // Click on tags dropdown (first combobox)
      const tagDropdown = page.getByRole('combobox').first();
      await userEvent.click(tagDropdown);

      // Select Trial
      const trialOption = page.getByRole('option', { name: 'Trial' });
      await userEvent.click(trialOption);

      // Trial memberships should be visible
      const trialCard = page.getByText('7-Day Free Trial');

      expect(trialCard).toBeInTheDocument();
    });

    it('filters memberships by tag - Active', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      // Click on tags dropdown (first combobox)
      const tagDropdown = page.getByRole('combobox').first();
      await userEvent.click(tagDropdown);

      // Select Active (use exact match to avoid matching 'Inactive')
      const activeOption = page.getByRole('option', { name: 'Active', exact: true });
      await userEvent.click(activeOption);

      // Active memberships should be visible (non-trial)
      const goldCard = page.getByText('12 Month Commitment (Gold)');

      expect(goldCard).toBeInTheDocument();
    });

    it('filters memberships by tag - Inactive', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      // Click on tags dropdown (first combobox)
      const tagDropdown = page.getByRole('combobox').first();
      await userEvent.click(tagDropdown);

      // Select Inactive
      const inactiveOption = page.getByRole('option', { name: 'Inactive' });
      await userEvent.click(inactiveOption);

      // Inactive membership should be visible
      const inactiveCard = page.getByText('6 Month Commitment (Silver)');

      expect(inactiveCard).toBeInTheDocument();
    });

    it('filters memberships by program', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      // Click on programs dropdown (second combobox)
      const programDropdown = page.getByRole('combobox').nth(1);
      await userEvent.click(programDropdown);

      // Select Kids
      const kidsOption = page.getByRole('option', { name: 'Kids' });
      await userEvent.click(kidsOption);

      // Kids memberships should be visible
      const kidsCard = page.getByText('Kids Monthly');

      expect(kidsCard).toBeInTheDocument();

      // Adult Gold membership should not be visible
      const goldCardElements = page.getByText('12 Month Commitment (Gold)');

      expect(goldCardElements.elements()).toHaveLength(0);
    });

    it('shows no memberships found message when search has no results', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder(/Search memberships/i);
      await userEvent.type(searchInput, 'NonexistentMembership12345');

      const noMembershipsMessage = page.getByText('No memberships found');

      expect(noMembershipsMessage).toBeInTheDocument();
    });
  });

  describe('Dynamic Filter Options', () => {
    it('hides Inactive tag option when filtering by Kids program (no inactive kids memberships)', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      // Click on programs dropdown and select Kids
      const programDropdown = page.getByRole('combobox').nth(1);
      await userEvent.click(programDropdown);
      const kidsOption = page.getByRole('option', { name: 'Kids' });
      await userEvent.click(kidsOption);

      // Now check the tags dropdown - Inactive should not be available
      const tagDropdown = page.getByRole('combobox').first();
      await userEvent.click(tagDropdown);

      // Active and Trial should still be available (Kids has both active and trial memberships)
      const activeOption = page.getByRole('option', { name: 'Active', exact: true });
      const trialOption = page.getByRole('option', { name: 'Trial' });

      expect(activeOption).toBeInTheDocument();
      expect(trialOption).toBeInTheDocument();

      // Inactive should NOT be available since no Kids memberships are inactive
      const inactiveOption = page.getByRole('option', { name: 'Inactive' });

      expect(inactiveOption.elements()).toHaveLength(0);
    });

    it('hides Trial tag option when filtering by Inactive tag (no inactive trials)', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      // Click on tags dropdown and select Inactive
      const tagDropdown = page.getByRole('combobox').first();
      await userEvent.click(tagDropdown);
      const inactiveOption = page.getByRole('option', { name: 'Inactive' });
      await userEvent.click(inactiveOption);

      // Now check the programs dropdown - only Adult should be available
      const programDropdown = page.getByRole('combobox').nth(1);
      await userEvent.click(programDropdown);

      // Adult should be available (the only inactive membership is Adult)
      const adultOption = page.getByRole('option', { name: 'Adult' });

      expect(adultOption).toBeInTheDocument();

      // Kids and Competition should NOT be available since they have no inactive memberships
      const kidsOption = page.getByRole('option', { name: 'Kids' });
      const competitionOption = page.getByRole('option', { name: 'Competition' });

      expect(kidsOption.elements()).toHaveLength(0);
      expect(competitionOption.elements()).toHaveLength(0);
    });

    it('shows only Competition program when filtering by Competition in search', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      // Search for "Competition"
      const searchInput = page.getByPlaceholder(/Search memberships/i);
      await userEvent.type(searchInput, 'Competition');

      // Check the programs dropdown
      const programDropdown = page.getByRole('combobox').nth(1);
      await userEvent.click(programDropdown);

      // Competition should be available
      const competitionOption = page.getByRole('option', { name: 'Competition' });

      expect(competitionOption).toBeInTheDocument();

      // Kids should NOT be available since no Kids memberships match "Competition"
      const kidsOption = page.getByRole('option', { name: 'Kids' });

      expect(kidsOption.elements()).toHaveLength(0);
    });

    it('shows only Active tag when filtering by Competition program', async () => {
      render(<I18nWrapper><MembershipsPage /></I18nWrapper>);

      // Click on programs dropdown and select Competition
      const programDropdown = page.getByRole('combobox').nth(1);
      await userEvent.click(programDropdown);
      const competitionOption = page.getByRole('option', { name: 'Competition' });
      await userEvent.click(competitionOption);

      // Now check the tags dropdown
      const tagDropdown = page.getByRole('combobox').first();
      await userEvent.click(tagDropdown);

      // Active should be available (Competition Team is Active)
      const activeOption = page.getByRole('option', { name: 'Active', exact: true });

      expect(activeOption).toBeInTheDocument();

      // Trial and Inactive should NOT be available since Competition Team is neither
      const trialOption = page.getByRole('option', { name: 'Trial' });
      const inactiveOption = page.getByRole('option', { name: 'Inactive' });

      expect(trialOption.elements()).toHaveLength(0);
      expect(inactiveOption.elements()).toHaveLength(0);
    });
  });
});
