import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSearchParams, BrowserRouter } from 'react-router-dom';
import { usePolicyFilters } from './usePolicyFilters';
import { usePageSize } from './useLocalStorage';

// Mock react-router-dom's useSearchParams
const mockSetSearchParams = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useSearchParams: vi.fn(() => [new URLSearchParams(), mockSetSearchParams]),
  };
});

// Mock useLocalStorage's usePageSize
const mockSetPageSize = vi.fn();
vi.mock('./useLocalStorage', () => ({
  usePageSize: vi.fn(() => ({
    pageSize: 20, // Default page size from mock
    setPageSize: mockSetPageSize,
  })),
}));

describe('usePolicyFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchParams.mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
  });

  it('initializes filters from URL search params', () => {
    useSearchParams.mockReturnValue([new URLSearchParams('?page=2&search=test&status=Active&pageSize=10'), mockSetSearchParams]);
    const { result } = renderHook(() => usePolicyFilters(), { wrapper: BrowserRouter });

    expect(result.current.filters).toEqual(
      expect.objectContaining({
        page: 2,
        search: 'test',
        status: 'Active',
        pageSize: 10,
      })
    );
  });

  it('updates search filter and resets page', () => {
    const { result } = renderHook(() => usePolicyFilters(), { wrapper: BrowserRouter });

    act(() => {
      result.current.updateSearch('new query');
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams('search=new+query&page=1'));
  });

  it('updates status filter and resets page', () => {
    const { result } = renderHook(() => usePolicyFilters(), { wrapper: BrowserRouter });

    act(() => {
      result.current.updateStatus('Expired');
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams('status=Expired&page=1'));
  });

  it('updates page number', () => {
    const { result } = renderHook(() => usePolicyFilters(), { wrapper: BrowserRouter });

    act(() => {
      result.current.updatePage(3);
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams('page=3'));
  });

  it('updates page size and resets page to 1', () => {
    const { result } = renderHook(() => usePolicyFilters(), { wrapper: BrowserRouter });

    act(() => {
      result.current.updatePageSize(50);
    });

    expect(mockSetPageSize).toHaveBeenCalledWith(50);
    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams('pageSize=50&page=1'));
  });

  it('clears all filters', () => {
    useSearchParams.mockReturnValue([new URLSearchParams('?page=2&search=test'), mockSetSearchParams]);
    const { result } = renderHook(() => usePolicyFilters(), { wrapper: BrowserRouter });

    act(() => {
      result.current.clearFilters();
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({});
  });

  it('updates date range filters', () => {
    const { result } = renderHook(() => usePolicyFilters(), { wrapper: BrowserRouter });

    act(() => {
      result.current.updateDateRange('effective', '2023-01-01', '2023-12-31');
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(
      new URLSearchParams('effectiveDateFrom=2023-01-01&effectiveDateTo=2023-12-31&page=1')
    );
  });
});