# State Typologies & Services Configuration

## 1. Server State Construction
* Keep query operations fully automated using TanStack React Query. 
* Do not capture network outputs using raw `useState` and `useEffect` assignments.
* Bind parameters directly to dynamic cache keys: `queryKey: ['policies', queryFilters]`. Whenever filters alter the target path, React Query handles invalidation and network retrieval automatically.

## 2. UI Parameter Bindings
* Extract search settings directly from the address layout parameters using React Router’s `useSearchParams` hook. 
* Avoid mapping search selections to local state scopes. If an element updates, write that change immediately to the URL query string to maintain a shareable dashboard state.