import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PolicyTable } from './PolicyTableMUI';
import { usePolicies, useFlagForReview } from '../hooks/usePolicies';
import { usePolicyFilters } from '../../../hooks/usePolicyFilters';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock hooks
const mockUpdatePage = vi.fn();
const mockUpdatePageSize = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('../hooks/usePolicies', () => ({
  usePolicies: vi.fn(),
  useFlagForReview: vi.fn(),
}));

vi.mock('../../../hooks/usePolicyFilters', () => ({
  usePolicyFilters: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui) => {
  const theme = createTheme();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>
  );
};

const mockPolicies = [
  {
    id: '1',
    policyNumber: 'POL-001',
    policyholderName: 'Test Corp A',
    status: 'Active',
    lineOfBusiness: 'Property',
    region: 'Singapore',
    premiumAmount: 100000,
    currency: 'SGD',
    expiryDate: '2025-12-31',
    flaggedForReview: false,
  },
  {
    id: '2',
    policyNumber: 'POL-002',
    policyholderName: 'Test Corp B',
    status: 'Expired',
    lineOfBusiness: 'Casualty',
    region: 'Japan',
    premiumAmount: 200000,
    currency: 'JPY',
    expiryDate: '2024-01-15',
    flaggedForReview: true,
  },
  {
    id: '3',
    policyNumber: 'POL-003',
    policyholderName: 'Test Corp C',
    status: 'Pending',
    lineOfBusiness: 'A&H',
    region: 'Australia',
    premiumAmount: 300000,
    currency: 'AUD',
    expiryDate: '2026-06-01',
    flaggedForReview: false,
  },
];

describe('PolicyTableMUI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePolicyFilters.mockReturnValue({
      filters: { page: 1, pageSize: 20 },
      updatePage: mockUpdatePage,
      updatePageSize: mockUpdatePageSize,
    });
    usePolicies.mockReturnValue({
      data: { data: mockPolicies, total: 3 },
      isLoading: false,
      isError: false,
      error: null,
    });
    useFlagForReview.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it('renders loading state with skeletons', () => {
    usePolicies.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: true,
      isError: false,
      error: null,
    });
    renderWithProviders(<PolicyTable />);
    expect(screen.getByRole('table')).toBeInTheDocument(); // Check for the table itself

    expect(screen.getAllByRole('row', { name: /loading/i }).length).toBe(5);
    expect(screen.getAllByText('', { selector: 'span.MuiSkeleton-root' }).length).toBeGreaterThan(0);
  });

  it('renders error state', () => {
    usePolicies.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch policies'),
    });
    renderWithProviders(<PolicyTable />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch policies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders empty state when no policies are found', () => {
    usePolicies.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      isError: false,
      error: null,
    });
    renderWithProviders(<PolicyTable />);
    expect(screen.getByText(/no policies found/i)).toBeInTheDocument();
    expect(screen.getByText(/try adjusting your filters or search criteria/i)).toBeInTheDocument();
  });

  it('renders policies correctly in the table', () => {
    renderWithProviders(<PolicyTable />);

    expect(screen.getByRole('columnheader', { name: /policy #/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /policyholder/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();

    mockPolicies.forEach((policy) => {
      expect(screen.getByText(policy.policyNumber)).toBeInTheDocument();
      expect(screen.getByText(policy.policyholderName)).toBeInTheDocument();
      expect(screen.getByText(policy.status)).toBeInTheDocument();
    });
  });

  it('handles single policy selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PolicyTable />);

    const firstPolicyCheckbox = screen.getByLabelText(`select policy ${mockPolicies[0].policyNumber}`);
    await user.click(firstPolicyCheckbox);

    expect(firstPolicyCheckbox).toBeChecked();
    expect(screen.getByText((_, node) => node.textContent === '1 policy selected')).toBeInTheDocument();
  });

  it('handles select all policies on current page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PolicyTable />);

    const selectAllCheckbox = screen.getByLabelText('select all policies');
    await user.click(selectAllCheckbox);

    mockPolicies.forEach((policy) => {
      expect(screen.getByLabelText(`select policy ${policy.policyNumber}`)).toBeChecked();
    });
    expect(screen.getByText((_, node) => node.textContent === `${mockPolicies.length} policies selected`)).toBeInTheDocument();

    await user.click(selectAllCheckbox); // Deselect all
    mockPolicies.forEach((policy) => {
      expect(screen.getByLabelText(`select policy ${policy.policyNumber}`)).not.toBeChecked();
    });
    expect(screen.queryByText(/policies selected/i)).not.toBeInTheDocument();
  });

  it('triggers flag for review action for selected policies', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PolicyTable />);

    await user.click(screen.getByLabelText(`select policy ${mockPolicies[0].policyNumber}`));
    await user.click(screen.getByLabelText(`select policy ${mockPolicies[1].policyNumber}`));

    const flagButton = screen.getByRole('button', { name: /flag for review/i });
    await user.click(flagButton);

    expect(mockMutateAsync).toHaveBeenCalledWith([mockPolicies[0].id, mockPolicies[1].id]);
    await waitFor(() => { // Use waitFor to ensure the UI update (removal of selected message) has occurred
      expect(screen.queryByText(/policies selected/i)).not.toBeInTheDocument();
    });
  });

  it('handles pagination page change', async () => {
    const user = userEvent.setup();
    usePolicies.mockReturnValue({
      data: { data: mockPolicies, total: 50 }, // Simulate more pages
      isLoading: false,
      isError: false,
      error: null,
    });
    renderWithProviders(<PolicyTable />);

    const nextButton = screen.getByRole('button', { name: /next page/i });
    await user.click(nextButton);

    expect(mockUpdatePage).toHaveBeenCalledWith(2);
  });

  it('handles rows per page change', async () => {
    const user = userEvent.setup();
    usePolicies.mockReturnValue({
      data: { data: mockPolicies, total: 50 },
      isLoading: false,
      isError: false,
      error: null,
    });
    usePolicyFilters.mockReturnValue({
      filters: { page: 1, pageSize: 20 },
      updatePage: mockUpdatePage,
      updatePageSize: mockUpdatePageSize,
    });
    renderWithProviders(<PolicyTable />);

    const rowsPerPageSelect = screen.getByRole('combobox', { name: /rows per page/i });
    await user.click(rowsPerPageSelect);
    await user.click(screen.getByRole('option', { name: '10' }));

    expect(mockUpdatePageSize).toHaveBeenCalledWith(10);
  });

  it('displays flagged policies with a chip', () => {
    renderWithProviders(<PolicyTable />);

    const flaggedPolicyRow = screen.getByText(mockPolicies[1].policyNumber).closest('tr');
    expect(within(flaggedPolicyRow).getByText('Review')).toBeInTheDocument(); // The chip's label is "Review"
  });

  it('applies correct background colors for dark mode zebra striping', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    usePolicyFilters.mockReturnValue({
      filters: { page: 1, pageSize: 20 },
      updatePage: mockUpdatePage,
      updatePageSize: mockUpdatePageSize,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <PolicyTable />
        </ThemeProvider>
      </QueryClientProvider>
    );

    const tableHeadRow = screen.getByRole('table').querySelector('thead tr'); // Target the actual table header row
    expect(tableHeadRow).toHaveStyle('background-color: rgba(255, 255, 255, 0.05)');

    const firstDataRow = screen.getAllByRole('row')[1]; // First data row (index 0 in policies array)
    expect(firstDataRow).toHaveStyle('background-color: #121212'); // MUI default theme.palette.background.paper for dark mode

    const secondDataRow = screen.getAllByRole('row')[2]; // Second data row (index 1 in policies array)
    expect(secondDataRow).toHaveStyle('background-color: rgba(255, 255, 255, 0.03)'); // dark mode odd row
  });
});