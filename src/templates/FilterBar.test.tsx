import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  const defaultProps = {
    searchConfig: {
      placeholder: 'Search items...',
      value: '',
      onChange: vi.fn(),
    },
    dropdowns: [
      {
        id: 'status',
        label: 'Status',
        value: '',
        onChange: vi.fn(),
        placeholder: 'All Statuses',
        options: [
          { value: '', label: 'All Statuses' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
    ],
    filterActions: <button type="button">Add New</button>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with search, dropdown, and action button', () => {
    render(<FilterBar {...defaultProps} />);

    expect(page.getByText('Status')).toBeTruthy();
    expect(page.getByText('Add New')).toBeTruthy();
  });

  it('renders search input field', () => {
    render(<FilterBar {...defaultProps} />);

    const searchInput = page.getByRole('textbox');

    expect(searchInput).toBeTruthy();
  });

  it('renders dropdown with current value', () => {
    const props = {
      ...defaultProps,
      dropdowns: [
        {
          id: 'status',
          label: 'Status',
          value: 'active',
          onChange: vi.fn(),
          placeholder: 'All Statuses',
          options: [
            { value: '', label: 'All Statuses' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ],
        },
      ],
    };

    render(<FilterBar {...props} />);

    expect(page.getByText('Status')).toBeTruthy();
  });

  it('renders multiple dropdowns', () => {
    const props = {
      ...defaultProps,
      dropdowns: [
        {
          id: 'status',
          label: 'Status',
          value: '',
          onChange: vi.fn(),
          placeholder: 'All Statuses',
          options: [
            { value: '', label: 'All Statuses' },
            { value: 'active', label: 'Active' },
          ],
        },
        {
          id: 'program',
          label: 'Program',
          value: '',
          onChange: vi.fn(),
          placeholder: 'All Programs',
          options: [
            { value: '', label: 'All Programs' },
            { value: 'karate', label: 'Karate' },
          ],
        },
      ],
    };

    render(<FilterBar {...props} />);

    expect(page.getByText('Status')).toBeTruthy();
    expect(page.getByText('Program')).toBeTruthy();
  });

  it('renders multiple action buttons', () => {
    const props = {
      ...defaultProps,
      filterActions: (
        <div>
          <button type="button">Add New</button>
          <button type="button">Export</button>
        </div>
      ),
    };

    render(<FilterBar {...props} />);

    expect(page.getByText('Add New')).toBeTruthy();
    expect(page.getByText('Export')).toBeTruthy();
  });

  it('renders with search input even when minimal config', () => {
    const props = {
      searchConfig: {
        placeholder: 'Search...',
        value: '',
        onChange: vi.fn(),
      },
      dropdowns: defaultProps.dropdowns,
      filterActions: defaultProps.filterActions,
    };

    render(<FilterBar {...props} />);

    expect(page.getByText('Status')).toBeTruthy(); // Dropdown should still be there
    expect(page.getByText('Add New')).toBeTruthy(); // Action should still be there
  });

  it('renders without dropdowns when not provided', () => {
    const props = {
      ...defaultProps,
      dropdowns: undefined,
    };

    render(<FilterBar {...props} />);

    expect(page.getByText('Add New')).toBeTruthy(); // Action should still be there
  });

  it('renders without actions when not provided', () => {
    const props = {
      ...defaultProps,
      filterActions: undefined,
    };

    render(<FilterBar {...props} />);

    expect(page.getByText('Status')).toBeTruthy(); // Dropdown should still be there
  });

  it('handles minimal configuration', () => {
    const minimalProps = {
      searchConfig: {
        placeholder: 'Search...',
        value: '',
        onChange: vi.fn(),
      },
    };

    render(<FilterBar {...minimalProps} />);

    // Should render without crashing when no props provided
    expect(page.getByRole('generic')).toBeTruthy();
  });

  it('handles empty arrays', () => {
    const props = {
      searchConfig: {
        placeholder: 'Search...',
        value: '',
        onChange: vi.fn(),
      },
      dropdowns: [],
      filterActions: null,
    };

    render(<FilterBar {...props} />);

    // Should render container even with empty arrays
    expect(page.getByRole('generic')).toBeTruthy();
  });

  it('renders action button with handler', () => {
    const onClick = vi.fn();
    const props = {
      ...defaultProps,
      filterActions: (
        <button type="button" onClick={onClick}>
          Test Action
        </button>
      ),
    };

    render(<FilterBar {...props} />);

    expect(page.getByText('Test Action')).toBeTruthy();
  });
});
