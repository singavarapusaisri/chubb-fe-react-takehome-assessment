import { useState, useMemo } from 'react';
import { Button, Checkbox, Skeleton, SkeletonTable } from '../../../components/index';
import { usePolicies, useFlagForReview } from '../hooks/usePolicies';
import { usePolicyFilters } from '../../../hooks/usePolicyFilters';

/**
 * PolicyTable Component
 * Displays paginated policy data with multi-select and bulk actions.
 * Supports sorting, filtering, and optimistic updates for "Flag for Review" action.
 */
export function PolicyTable() {
  const { filters, updatePage } = usePolicyFilters();
  const { data, isLoading, isError, error } = usePolicies(filters);
  const flagMutation = useFlagForReview(filters);
  
  const [selectedIds, setSelectedIds] = useState(new Set());

  const policies = data?.data || [];
  const totalCount = data?.total || 0;
  const pageSize = filters.pageSize || 20;
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate if all items on current page are selected
  const allSelected = useMemo(() => {
    if (policies.length === 0) return false;
    return policies.every((p) => selectedIds.has(p.id));
  }, [policies, selectedIds]);

  // Handlers
  const toggleSelectAll = () => {
    if (allSelected) {
      const newSelected = new Set(selectedIds);
      policies.forEach((p) => newSelected.delete(p.id));
      setSelectedIds(newSelected);
    } else {
      const newSelected = new Set(selectedIds);
      policies.forEach((p) => newSelected.add(p.id));
      setSelectedIds(newSelected);
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleFlagForReview = async () => {
    if (selectedIds.size === 0) return;
    try {
      await flagMutation.mutateAsync(Array.from(selectedIds));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Error flagging policies:', err);
    }
  };

  // Loading state
  if (isLoading && policies.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">
                <Skeleton height="h-4" width="w-4" />
              </th>
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-6 py-4 text-left">
                  <Skeleton height="h-4" width="w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <SkeletonTable rows={5} columns={9} />
        </table>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm p-8 border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">Error Loading Policies</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error?.message || 'An unexpected error occurred'}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (policies.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-16 text-center border border-gray-100 dark:border-gray-700">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
          No Policies Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  // Table render
  return (
    <div className="space-y-5">
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              {selectedIds.size} {selectedIds.size === 1 ? 'policy' : 'policies'} selected
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleFlagForReview}
            disabled={flagMutation.isPending}
          >
            {flagMutation.isPending ? '⏳ Flagging...' : '🚩 Flag for Review'}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-5 text-left w-12">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all policies on this page"
                />
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Policy #
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Policyholder
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Line of Business
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-5 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Premium
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Expiry
              </th>
              <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Flag
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {policies.map((policy) => (
              <tr
                key={policy.id}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20 dark:hover:to-transparent transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <Checkbox
                    id={`select-${policy.id}`}
                    checked={selectedIds.has(policy.id)}
                    onChange={() => toggleSelect(policy.id)}
                    aria-label={`Select policy ${policy.policyNumber}`}
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {policy.policyNumber}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {policy.policyholderName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      policy.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : policy.status === 'Expired'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : policy.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300'
                    }`}
                  >
                    {policy.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {policy.lineOfBusiness}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {policy.region}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                    {policy.premiumAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">
                      {policy.currency}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(policy.expiryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {policy.flaggedForReview ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30">
                      <span className="text-sm">🚩</span>
                    </span>
                  ) : (
                    <span className="text-gray-300 dark:text-gray-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-gray-50">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-50">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-50">{totalCount}</span> policies
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>
          <div className="flex items-center gap-1 px-3">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => updatePage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-medium text-sm transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
