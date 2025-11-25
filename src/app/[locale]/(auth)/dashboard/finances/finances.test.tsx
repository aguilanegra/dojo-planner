import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import FinancesPage from './page';

describe('Finances Page', () => {
  it('renders finances header', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const heading = page.getByRole('heading', { name: /Finances/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders transactions heading', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const transactionsHeading = page.getByRole('heading', { name: /Transactions/i });

    expect(transactionsHeading).toBeInTheDocument();
  });

  it('renders import transactions button', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const importButton = page.getByRole('button', { name: /Import Transactions/i });

    expect(importButton).toBeInTheDocument();
  });

  it('renders new transaction button', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const newButton = page.getByRole('button', { name: /New Transaction/i });

    expect(newButton).toBeInTheDocument();
  });

  it('renders filter tabs', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const allTab = page.getByRole('button', { name: /^All$/i });
    const membershipTab = page.getByRole('button', { name: /Membership Dues/i });

    expect(allTab).toBeInTheDocument();
    expect(membershipTab).toBeInTheDocument();
  });

  it('renders transactions table headers', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const dateHeader = page.getByText(/Date/);
    const amountHeader = page.getByText(/Amount/);
    const purposeHeader = page.getByText(/Purpose/);

    expect(dateHeader).toBeInTheDocument();
    expect(amountHeader).toBeInTheDocument();
    expect(purposeHeader).toBeInTheDocument();
  });

  it('renders transaction data in table', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const transactionDate = page.getByText(/April 15, 2025/);
    const amountCell = page.getByRole('cell', { name: /160.00/ }).first();

    expect(transactionDate).toBeInTheDocument();
    expect(amountCell).toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const paginationText = page.getByText(/Showing 1-7 of 240 entries/);

    expect(paginationText).toBeInTheDocument();
  });

  it('renders pagination buttons', () => {
    render(<I18nWrapper><FinancesPage /></I18nWrapper>);

    const previousButton = page.getByRole('button', { name: /Previous/i });
    const nextButton = page.getByRole('button', { name: /Next/i });

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
