import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchPolicies, flagPoliciesForReview, fetchPolicySummary } from './policyApi';

const API_BASE = 'http://localhost:3000/policies';

describe('policyApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(); // Mock global fetch
  });

  describe('fetchPolicies', () => {
    it('fetches policies with default pagination', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1' }]),
        headers: { get: (name) => (name === 'X-Total-Count' ? '1' : null) },
      });

      const result = await fetchPolicies();
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}?_page=1&_limit=20`);
      expect(result).toEqual({ data: [{ id: '1' }], total: 1 });
    });

    it('fetches policies with custom filters', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '2' }]),
        headers: { get: (name) => (name === 'X-Total-Count' ? '1' : null) },
      });

      const filters = {
        page: 2,
        pageSize: 10,
        search: 'test',
        status: 'Active',
        lineOfBusiness: 'Property',
        region: 'Singapore',
        effectiveDateFrom: '2023-01-01',
        expiryDateTo: '2024-12-31',
        sortBy: 'policyNumber',
        sortOrder: 'desc',
      };
      const result = await fetchPolicies(filters);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE}?_page=2&_limit=10&_sort=policyNumber&_order=desc&q=test&status=Active&lineOfBusiness=Property&region=Singapore&effectiveDate_gte=2023-01-01&expiryDate_lte=2024-12-31`
      );
      expect(result).toEqual({ data: [{ id: '2' }], total: 1 });
    });

    it('throws error if fetch fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(fetchPolicies()).rejects.toThrow('Failed to fetch policies: Not Found');
    });
  });

  describe('flagPoliciesForReview', () => {
    it('sends PATCH request for a single policy ID', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', flaggedForReview: true }),
      });

      const result = await flagPoliciesForReview('1');
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flaggedForReview: true }),
      });
      expect(result).toEqual([{ id: '1', flaggedForReview: true }]);
    });

    it('sends PATCH requests for multiple policy IDs', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '1', flaggedForReview: true }) });
      global.fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '2', flaggedForReview: true }) });

      const result = await flagPoliciesForReview(['1', '2']);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/1`, expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/2`, expect.any(Object));
      expect(result.length).toBe(2);
    });
  });

  describe('fetchPolicySummary', () => {
    it('fetches and aggregates policy summary', async () => {
      const mockPolicies = [
        { status: 'Active', premiumAmount: 1000, lineOfBusiness: 'Property', expiryDate: '2026-07-01' },
        { status: 'Expired', premiumAmount: 2000, lineOfBusiness: 'Casualty', expiryDate: '2024-01-01' },
        { status: 'Pending', premiumAmount: 3000, lineOfBusiness: 'Property', expiryDate: '2026-06-01' },
        { status: 'Active', premiumAmount: 4000, lineOfBusiness: 'Casualty', expiryDate: '2026-06-15' }, // Expiring in 30 days
      ];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPolicies),
      });

      const result = await fetchPolicySummary();
      expect(global.fetch).toHaveBeenCalledWith(API_BASE);
      expect(result.statusCounts.Active).toBe(2);
      expect(result.lobTotals.Property).toBe(4000);
      expect(result.expiringIn30Days).toBe(2);
      expect(result.totalPolicies).toBe(4);
    });
  });
});