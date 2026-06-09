# Browser Web Storage Architecture

## 1. Storage Encapsulation Rule
* Do not invoke direct, unabstracted `window.localStorage` read/write events deep within visual render files.
* Every browser persistence requirement must run exclusively through the centralized `useLocalStorage.js` primitive layer.

## 2. Configuration Parameters
* Set sensible storage fallback limits:
  * Key: `chubb-theme` -> Default: `"system"` (Resolve via `window.matchMedia('(prefers-color-scheme: dark)')` check)
  * Key: `chubb-page-size` -> Default: `20` items per view page.
* Handle input parse failures using try/catch wrapper logic inside the hook initialization phase.