import { useState, useEffect } from 'react';

/**
 * Custom hook for managing browser localStorage with type safety and error handling.
 * Respects system preferences by default but persists manual user overrides.
 *
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - The default value if key doesn't exist
 * @returns {[*, Function]} - [value, setValue] tuple
 */
export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      // Persist the default value immediately to ensure synchronization between state and storage
      window.localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for managing theme preference with system fallback.
 * Persists user selection in localStorage under 'chubb-theme' key.
 *
 * @returns {Object} - { theme: string, setTheme: Function, isDark: boolean }
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage('chubb-theme', 'system');

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const isDark = theme === 'system' ? getSystemTheme() === 'dark' : theme === 'dark';

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

  return {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  };
}

/**
 * Hook for managing pagination page size preference.
 * Persists user selection in localStorage under 'chubb-page-size' key.
 * Default: 20 items per page.
 *
 * @returns {Object} - { pageSize: number, setPageSize: Function }
 */
export function usePageSize() {
  const [pageSize, setPageSize] = useLocalStorage('chubb-page-size', 20);

  return {
    pageSize,
    setPageSize,
  };
}
