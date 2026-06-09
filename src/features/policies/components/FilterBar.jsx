import { useState } from 'react';
import { Input, Select, Button } from '../../../components/index';
import { usePolicyFilters } from '../../../hooks/usePolicyFilters';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Expired', value: 'Expired' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const LOB_OPTIONS = [
  { label: 'Property', value: 'Property' },
  { label: 'Casualty', value: 'Casualty' },
  { label: 'A&H', value: 'A&H' },
  { label: 'Marine', value: 'Marine' },
];

const REGION_OPTIONS = [
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Hong Kong', value: 'Hong Kong' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Philippines', value: 'Philippines' },
];

/**
 * FilterBar Component
 * Provides filtering controls for the policy dashboard.
 * Filters are synchronized with URL query parameters for shareability and bookmarking.
 */
export function FilterBar() {
  const {
    filters,
    updateSearch,
    updateStatus,
    updateLineOfBusiness,
    updateRegion,
    updateDateRange,
    clearFilters,
  } = usePolicyFilters();

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
      {/* Search Input */}
      <div className="mb-6">
        <Input
          id="search"
          label="🔍 Search Policies"
          type="text"
          placeholder="Policy #, holder name, or underwriter..."
          value={filters.search}
          onChange={(e) => updateSearch(e.target.value)}
          aria-label="Search policies"
        />
      </div>

      {/* Basic Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Select
          id="status"
          label="📊 Status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => updateStatus(e.target.value)}
          aria-label="Filter by status"
        />
        <Select
          id="lob"
          label="📋 Line of Business"
          options={LOB_OPTIONS}
          value={filters.lineOfBusiness}
          onChange={(e) => updateLineOfBusiness(e.target.value)}
          aria-label="Filter by line of business"
        />
        <Select
          id="region"
          label="🌏 Region"
          options={REGION_OPTIONS}
          value={filters.region}
          onChange={(e) => updateRegion(e.target.value)}
          aria-label="Filter by region"
        />
      </div>

      {/* Advanced Filters Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold mb-4 transition-colors flex items-center gap-2"
        aria-expanded={showAdvanced}
      >
        <span>{showAdvanced ? '▼' : '▶'}</span>
        {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
      </button>

      {/* Advanced Date Filters */}
      {showAdvanced && (
        <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
              <span>📅</span> Effective Date Range
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="effectiveDateFrom"
                label="From"
                type="date"
                value={filters.effectiveDateFrom}
                onChange={(e) =>
                  updateDateRange('effective', e.target.value, filters.effectiveDateTo)
                }
              />
              <Input
                id="effectiveDateTo"
                label="To"
                type="date"
                value={filters.effectiveDateTo}
                onChange={(e) =>
                  updateDateRange('effective', filters.effectiveDateFrom, e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
              <span>⏰</span> Expiry Date Range
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="expiryDateFrom"
                label="From"
                type="date"
                value={filters.expiryDateFrom}
                onChange={(e) =>
                  updateDateRange('expiry', e.target.value, filters.expiryDateTo)
                }
              />
              <Input
                id="expiryDateTo"
                label="To"
                type="date"
                value={filters.expiryDateTo}
                onChange={(e) =>
                  updateDateRange('expiry', filters.expiryDateFrom, e.target.value)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={clearFilters}
        className="mt-2"
      >
        ✕ Clear All Filters
      </Button>
    </div>
  );
}
