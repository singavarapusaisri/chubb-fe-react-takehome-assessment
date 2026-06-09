import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePolicies, useFlagForReview, usePolicySummary } from './usePolicies';
import * as policyApi from '../services/policyApi';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for tests
    },
  },
});

// Wrapper component for React Query Provider
const wrapper = ({ children }) => 
  React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('usePolicies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear(); // Ensure a clean cache for each test
    vi.spyOn(policyApi, 'fetchPolicies').mockResolvedValue({
      data: [{ id: '1', policyNumber: 'POL-001' }],
      total: 1,
    });
  });

  it('fetches policies successfully', async () => {
    const filters = { page: 1, pageSize: 10 };
    const { result } = renderHook(() => usePolicies(filters), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.data).toEqual([{ id: '1', policyNumber: 'POL-001' }]);
    expect(policyApi.fetchPolicies).toHaveBeenCalledWith(filters);
  });

  it('handles fetch policies error', async () => {
    vi.spyOn(policyApi, 'fetchPolicies').mockRejectedValue(new Error('Network error'));

    const filters = { page: 1, pageSize: 10 };
    const { result } = renderHook(() => usePolicies(filters), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error('Network error'));
  });
});

describe('useFlagForReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear(); // Ensure a clean cache for each test
    vi.spyOn(policyApi, 'flagPoliciesForReview').mockResolvedValue([{ id: '1', flaggedForReview: true }]);
  });

  it('flags policies for review successfully and invalidates queries', async () => {
    const filters = { page: 1, pageSize: 10 };
    const { result } = renderHook(() => useFlagForReview(filters), { wrapper });

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await result.current.mutateAsync(['1']); // The first argument to mutateAsync is the variables

    expect(policyApi.flagPoliciesForReview).toHaveBeenCalledWith(['1'], expect.any(Object)); // useMutation passes variables as the first arg, and a mutation context object as the second.
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['policies'] });
  });

  it('handles flag policies for review error', async () => {
    vi.spyOn(policyApi, 'flagPoliciesForReview').mockRejectedValue(new Error('Flagging failed'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error

    const filters = { page: 1, pageSize: 10 };
    const { result } = renderHook(() => useFlagForReview(filters), { wrapper });

    await expect(result.current.mutateAsync(['1'])).rejects.toThrow('Flagging failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to flag policies for review:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});

describe('usePolicySummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(policyApi, 'fetchPolicySummary').mockResolvedValue({ totalPolicies: 100 });
  });

  it('fetches policy summary successfully', async () => {
    const { result } = renderHook(() => usePolicySummary(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ totalPolicies: 100 });
    expect(policyApi.fetchPolicySummary).toHaveBeenCalledTimes(1);
  });
});