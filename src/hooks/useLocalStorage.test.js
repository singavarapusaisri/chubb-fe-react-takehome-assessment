import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTheme, usePageSize } from './useLocalStorage';

describe('useLocalStorage hooks', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    window.localStorage.clear();
    vi.clearAllMocks();

    // Default mock for matchMedia (simulating light mode by default)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
      })),
    });
  });

  describe('useTheme', () => {
    it('initializes with system preference if no stored value', () => {
      // Mock matchMedia for system preference
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true, // Simulate system prefers dark mode
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useTheme());
      expect(result.current.isDark).toBe(true);
      // Default value is returned by state, but not necessarily written to localStorage until set
      expect(result.current.theme).toBe('system');
    });

    it('initializes with stored theme preference', () => {
      window.localStorage.setItem('chubb-theme', 'light');
      const { result } = renderHook(() => useTheme());
      expect(result.current.isDark).toBe(false);
    });

    it('toggles theme and persists to localStorage', () => {
      const { result } = renderHook(() => useTheme());
      
      // Initial state: 'system' (which resolves to light via our beforeEach mock)
      expect(result.current.theme).toBe('system');
      expect(result.current.isDark).toBe(false);

      // Toggle 1: system -> light
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
      expect(window.localStorage.getItem('chubb-theme')).toBe(JSON.stringify('light'));

      // Toggle 2: light -> dark
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
      expect(window.localStorage.getItem('chubb-theme')).toBe(JSON.stringify('dark'));
    });
  });

  describe('usePageSize', () => {
    it('initializes with default page size if no stored value', () => {
      const { result } = renderHook(() => usePageSize());
      act(() => { /* Ensure effects run for initial value */ });
      expect(result.current.pageSize).toBe(20); // Check the hook's state
      expect(window.localStorage.getItem('chubb-page-size')).toBe(JSON.stringify(20)); // Check localStorage
    });

    it('sets page size and persists to localStorage', () => {
      const { result } = renderHook(() => usePageSize());
      act(() => {
        result.current.setPageSize(50);
      });
      expect(result.current.pageSize).toBe(50);
      expect(window.localStorage.getItem('chubb-page-size')).toBe(JSON.stringify(50));
    });
  });
});