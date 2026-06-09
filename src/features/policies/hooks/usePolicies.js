import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPolicies, flagPoliciesForReview, fetchPolicySummary } from '../services/policyApi';

/**
 * Custom hook for fetching policies with React Query.
 * Automatically handles caching, loading states, and refetching based on filters.
 * Server state is the single source of truth for policy data.
 *
 * @param {Object} filters - Filter configuration from URL params
 * @returns {Object} - Query result with data, loading, and error states
 */
export function usePolicies(filters) {
  return useQuery({
    queryKey: ['policies', filters],
    queryFn: () => fetchPolicies(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    keepPreviousData: true,
  });
}

/**
 * Custom hook for flagging policies for review.
 * Provides optimistic update capability through useMutation.
 *
 * @param {Object} filters - Current filter configuration for query invalidation
 * @returns {Object} - Mutation result with isPending, error, and mutate function
 */
export function useFlagForReview(filters) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flagPoliciesForReview,
    onSuccess: () => {
      // Invalidate the policies query to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ['policies'],
      });
    },
    onError: (error) => {
      console.error('Failed to flag policies for review:', error);
    },
  });
}

/**
 * Custom hook for fetching policy summary statistics.
 * Returns aggregated metrics for the statistics panel.
 *
 * @returns {Object} - Query result with summary data and loading state
 */
export function usePolicySummary() {
  return useQuery({
    queryKey: ['policySummary'],
    queryFn: fetchPolicySummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
