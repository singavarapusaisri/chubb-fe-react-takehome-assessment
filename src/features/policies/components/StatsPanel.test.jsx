import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StatsPanel } from './StatsPanel';
import { usePolicySummary } from '../hooks/usePolicies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock the usePolicySummary hook
vi.mock('../hooks/usePolicies', () => ({
  usePolicySummary: vi.fn(),
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

const mockSummaryData = {
  statusCounts: {
    Active: 150,
    Expired: 30,
    Pending: 15,
    Cancelled: 5,
  },
  lobTotals: {
    Property: 120000000,
    Casualty: 80000000,
    'A&H': 50000000,
    Marine: 30000000,
  },
  expiringIn30Days: 10,
  totalPolicies: 200,
};

describe('StatsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePolicySummary.mockReturnValue({
      data: mockSummaryData,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it('renders loading state with skeletons', () => {
    usePolicySummary.mockReturnValue({
      data: null,
      isLoading: true,
    });
    renderWithProviders(<StatsPanel />); // The existing check for MuiSkeleton-root is sufficient
    expect(screen.getAllByText('', { selector: 'span.MuiSkeleton-root' }).length).toBeGreaterThan(0);
  });

  it('renders summary statistics correctly', () => {
    renderWithProviders(<StatsPanel />);

    expect(screen.getByText('Active Policies')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('75.0% of total')).toBeInTheDocument();

    expect(screen.getByText('Expiring in 30 Days')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Total Premium (P&C)')).toBeInTheDocument();
    expect(screen.getByText(/\$200\.0M/i)).toBeInTheDocument(); // Use regex for more flexible matching
    expect(screen.getByText(/Property: \$120.0M, Casualty: \$80.0M/i)).toBeInTheDocument();
  });
});