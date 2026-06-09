import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock useLocalStorage to control theme state and persistence
vi.mock('./hooks/useLocalStorage', () => {
  let isDarkGlobal = false;
  let themeGlobal = 'light';
  let pageSizeGlobal = 20;

  return {
    useTheme: () => {
      const [isDark, setIsDark] = React.useState(isDarkGlobal);
      const [theme, setTheme] = React.useState(themeGlobal);

      const toggleTheme = React.useCallback(() => {
        isDarkGlobal = !isDarkGlobal;
        themeGlobal = (themeGlobal === 'system' || themeGlobal === 'dark') ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', isDarkGlobal);
        setIsDark(isDarkGlobal);
        setTheme(themeGlobal);
      }, []);

      return { isDark, theme, toggleTheme };
    },
    usePageSize: () => {
      const [pageSize, setPageSizeState] = React.useState(pageSizeGlobal);
      const setPageSize = React.useCallback((newSize) => {
        pageSizeGlobal = newSize;
        setPageSizeState(newSize);
      }, []);
      return { pageSize, setPageSize };
    },
  };
});

// Mock child components to simplify App testing
vi.mock('./features/policies/components/FilterBarMUI', () => ({
  FilterBar: () => <div data-testid="mock-filter-bar">Mock Filter Bar</div>,
}));
vi.mock('./features/policies/components/PolicyTableMUI', () => ({
  PolicyTable: () => <div data-testid="mock-policy-table">Mock Policy Table</div>,
}));
vi.mock('./features/policies/components/StatsPanel', () => ({
  StatsPanel: () => <div data-testid="mock-stats-panel">Mock Stats Panel</div>,
}));

const queryClient = new QueryClient();

describe('App', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark'); // Ensure clean state
  });

  it('renders main layout and child components', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('📊 Policy Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('mock-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-policy-table')).toBeInTheDocument();
    expect(screen.getByTestId('mock-stats-panel')).toBeInTheDocument();
  });

  it('toggles theme between light and dark mode', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const themeToggleButton = screen.getByRole('button', { name: /light|dark/i });

    // Initial state (default to light in mock)
    expect(themeToggleButton).toHaveTextContent('Dark'); // Label indicates current mode, so clicking it will switch to dark
    expect(document.documentElement).not.toHaveClass('dark');

    // Toggle to dark
    fireEvent.click(themeToggleButton);
    expect(themeToggleButton).toHaveTextContent('Light'); // Now in dark mode, button offers to switch to light
    expect(document.documentElement).toHaveClass('dark');

    // Toggle back to light
    fireEvent.click(themeToggleButton);
    expect(themeToggleButton).toHaveTextContent('Dark'); // Now in light mode, button offers to switch to dark
    expect(document.documentElement).not.toHaveClass('dark');
  });
});