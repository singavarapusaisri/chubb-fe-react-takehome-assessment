import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { usePageSize } from './useLocalStorage';

/**
 * Hook for synchronizing dashboard filters with URL query parameters.
 * Ensures shareable and bookmarkable dashboard state.
 *
 * @returns {Object} - Filters object and setter functions
 */
export function usePolicyFilters() {
  const { pageSize: defaultPageSize, setPageSize } = usePageSize();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from URL params
  const filters = useMemo(() => ({
    page: parseInt(searchParams.get('page') || '1', 10),
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    lineOfBusiness: searchParams.get('lob') || '',
    region: searchParams.get('region') || '',
    effectiveDateFrom: searchParams.get('effectiveDateFrom') || '',
    effectiveDateTo: searchParams.get('effectiveDateTo') || '',
    expiryDateFrom: searchParams.get('expiryDateFrom') || '',
    expiryDateTo: searchParams.get('expiryDateTo') || '',
    sortBy: searchParams.get('sortBy') || '',
    sortOrder: searchParams.get('sortOrder') || 'asc',
    pageSize: parseInt(searchParams.get('pageSize') || defaultPageSize.toString(), 10),
  }), [searchParams, defaultPageSize]);

  const updateFilters = useCallback((updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 when filters change (unless explicitly updating page)
    if (updates.page === undefined && !updates.hasOwnProperty('page')) {
      params.set('page', '1');
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const updatePage = useCallback((pageNumber) => {
    updateFilters({ page: pageNumber });
  }, [updateFilters]);

  const updateSearch = useCallback((query) => {
    updateFilters({ search: query || null, page: null });
  }, [updateFilters]);

  const updateStatus = useCallback((status) => {
    updateFilters({ status: status || null, page: null });
  }, [updateFilters]);

  const updateLineOfBusiness = useCallback((lob) => {
    updateFilters({ lob: lob || null, page: null });
  }, [updateFilters]);

  const updateRegion = useCallback((region) => {
    updateFilters({ region: region || null, page: null });
  }, [updateFilters]);

  const updateDateRange = useCallback((type, from, to) => {
    updateFilters({
      [`${type}DateFrom`]: from || null,
      [`${type}DateTo`]: to || null,
      page: null,
    });
  }, [updateFilters]);

  const updatePageSize = useCallback((size) => {
    setPageSize(size);
    updateFilters({ pageSize: size, page: 1 }); // Reset to page 1 when page size changes
  }, [updateFilters, setPageSize]);

  return {
    filters,
    updateFilters,
    clearFilters,
    updatePage,
    updatePageSize,
    updateSearch,
    updateStatus,
    updateLineOfBusiness,
    updateRegion,
    updateDateRange,
  };
}
