/**
 * API service layer for policy data.
 * Handles all communication with the json-server backend.
 */

const API_BASE = 'http://localhost:3000/policies';

/**
 * Build query parameters from filter object.
 * Supports pagination, filtering, and searching.
 *
 * @param {Object} filters - Filter configuration
 * @returns {string} - Query string for the API
 */
function buildQueryString(filters) {
  const params = new URLSearchParams();

  // Pagination
  const pageSize = filters.pageSize || 20;
  const page = filters.page || 1;
  params.append('_page', page);
  params.append('_limit', pageSize);

  // Sorting
  if (filters.sortBy) {
    params.append('_sort', filters.sortBy);
    params.append('_order', filters.sortOrder || 'asc');
  }

  // Free-text search (using q parameter for json-server full-text search)
  if (filters.search) {
    params.append('q', filters.search);
  }

  // Status filter
  if (filters.status) {
    params.append('status', filters.status);
  }

  // Line of Business filter
  if (filters.lineOfBusiness) {
    params.append('lineOfBusiness', filters.lineOfBusiness);
  }

  // Region filter
  if (filters.region) {
    params.append('region', filters.region);
  }

  // Date range filters
  if (filters.effectiveDateFrom) {
    params.append('effectiveDate_gte', filters.effectiveDateFrom);
  }
  if (filters.effectiveDateTo) {
    params.append('effectiveDate_lte', filters.effectiveDateTo);
  }
  if (filters.expiryDateFrom) {
    params.append('expiryDate_gte', filters.expiryDateFrom);
  }
  if (filters.expiryDateTo) {
    params.append('expiryDate_lte', filters.expiryDateTo);
  }

  return params.toString();
}

/**
 * Fetch policies from the backend with pagination and filters.
 * Also returns X-Total-Count header for pagination metadata.
 *
 * @param {Object} filters - Filter configuration
 * @returns {Promise<Object>} - { data: policies, total: totalCount }
 */
export async function fetchPolicies(filters = {}) {
  const queryString = buildQueryString(filters);
  const url = `${API_BASE}${queryString ? '?' + queryString : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch policies: ${response.statusText}`);
  }

  const data = await response.json();
  const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);

  return {
    data,
    total,
  };
}

/**
 * Flag one or multiple policies for review.
 * Sends PATCH requests to update flaggedForReview status.
 *
 * @param {string|string[]} policyIds - Single ID or array of IDs
 * @returns {Promise<Object>} - Updated policy/policies
 */
export async function flagPoliciesForReview(policyIds) {
  const ids = Array.isArray(policyIds) ? policyIds : [policyIds];
  const updatePromises = ids.map((id) =>
    fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flaggedForReview: true }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to update policy ${id}`);
        return res.json();
      })
  );

  return Promise.all(updatePromises);
}

/**
 * Fetch summary statistics from the policies dataset.
 * Aggregates policy counts by status and line of business.
 *
 * @returns {Promise<Object>} - Summary statistics
 */
export async function fetchPolicySummary() {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`Failed to fetch summary: ${response.statusText}`);
  }

  const policies = await response.json();

  // Calculate status breakdown
  const statusCounts = {
    Active: 0,
    Expired: 0,
    Pending: 0,
    Cancelled: 0,
  };

  // Calculate line of business totals
  const lobTotals = {
    Property: 0,
    Casualty: 0,
    'A&H': 0,
    Marine: 0,
  };

  // Calculate expiring within 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  let expiringIn30Days = 0;

  policies.forEach((policy) => {
    // Count by status
    if (statusCounts.hasOwnProperty(policy.status)) {
      statusCounts[policy.status]++;
    }

    // Sum by line of business
    if (lobTotals.hasOwnProperty(policy.lineOfBusiness)) {
      lobTotals[policy.lineOfBusiness] += policy.premiumAmount;
    }

    // Count expiring within 30 days
    const expiryDate = new Date(policy.expiryDate);
    if (expiryDate >= today && expiryDate <= thirtyDaysFromNow) {
      expiringIn30Days++;
    }
  });

  return {
    statusCounts,
    lobTotals,
    expiringIn30Days,
    totalPolicies: policies.length,
  };
}
