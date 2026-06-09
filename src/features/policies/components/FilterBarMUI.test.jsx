import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FilterBar } from './FilterBarMUI';
import { usePolicyFilters } from '../../../hooks/usePolicyFilters';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock the usePolicyFilters hook
const mockUpdateSearch = vi.fn();
const mockUpdateStatus = vi.fn();
const mockUpdateLineOfBusiness = vi.fn();
const mockUpdateRegion = vi.fn();
const mockUpdateDateRange = vi.fn();
const mockClearFilters = vi.fn();

vi.mock('../../../hooks/usePolicyFilters', () => ({
  usePolicyFilters: vi.fn(),
}));

const renderWithTheme = (ui) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('FilterBarMUI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePolicyFilters.mockReturnValue({
      filters: {
        page: 1,
        search: '',
        status: '',
        lineOfBusiness: '',
        region: '',
        effectiveDateFrom: '',
        effectiveDateTo: '',
        expiryDateFrom: '',
        expiryDateTo: '',
        sortBy: '',
        sortOrder: 'asc',
        pageSize: 20,
      },
      updateSearch: mockUpdateSearch,
      updateStatus: mockUpdateStatus,
      updateLineOfBusiness: mockUpdateLineOfBusiness,
      updateRegion: mockUpdateRegion,
      updateDateRange: mockUpdateDateRange,
      clearFilters: mockClearFilters,
    });
  });

  it('renders search input and basic filter dropdowns', () => {
    renderWithTheme(<FilterBar />);

    expect(screen.getByLabelText(/search policies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/line of business/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/region/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show advanced filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
  });

  it('updates search filter on input change', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FilterBar />);

    const searchInput = screen.getByLabelText(/search policies/i);
    fireEvent.change(searchInput, { target: { value: 'POL-123' } });
    
    expect(mockUpdateSearch).toHaveBeenCalledWith('POL-123'); // Should be called with the final value
  });

  it('updates status filter on select change', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FilterBar />);

    const statusSelect = screen.getByLabelText(/status/i);
    await user.click(statusSelect);
    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(mockUpdateStatus).toHaveBeenCalledWith('Active');
  });

  it('toggles advanced filters visibility', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FilterBar />);

    const toggleButton = screen.getByRole('button', { name: /show advanced filters/i });
    expect(screen.queryByLabelText(/effective date from/i)).not.toBeInTheDocument();

    await user.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByLabelText(/effective date from/i)).toBeVisible();
      expect(screen.getByRole('button', { name: /hide advanced filters/i })).toBeInTheDocument();
    });

    await user.click(toggleButton);
    await waitFor(() => {
      expect(screen.queryByLabelText(/effective date from/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show advanced filters/i })).toBeInTheDocument();
    });
  });

  it('updates date range filters when advanced filters are visible', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FilterBar />);

    await user.click(screen.getByRole('button', { name: /show advanced filters/i }));

    const effectiveDateFrom = screen.getByLabelText(/effective date from/i);
    await user.type(effectiveDateFrom, '2023-01-01');
    expect(mockUpdateDateRange).toHaveBeenCalledWith('effective', '2023-01-01', '');
  });

  it('clears all filters when "Clear All Filters" button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FilterBar />);

    await user.click(screen.getByRole('button', { name: /clear all filters/i }));
    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });
});