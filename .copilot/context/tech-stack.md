### Technical Stack Constraints (Non-Negotiable)
* **Core Engine:** React 18+ written in pure JavaScript, utilizing standard `.js` and `.jsx` extensions. Built via Vite.
* **Styling Engine:** Pure Tailwind CSS mapped to native CSS custom properties (Design Tokens). Heavy third-party component libraries (e.g., Material UI, Ant Design) and runtime CSS-in-JS engines (e.g., Emotion) are strictly prohibited.
* **Mock Backend:** `json-server` reading a static `db.json` dataset with 200+ mock records, simulating real-world URL pagination and REST query filters.
* **Testing Ecosystem:** Vitest + React Testing Library (RTL) leveraging `@testing-library/user-event`.

### Three-Layered State Topology (Single Source of Truth)
To prevent state-synchronization bugs and unnecessary global re-renders, state must be isolated into three strict layers:
1. **Server State (Remote Data):** Managed entirely by `TanStack React Query`. Responsible for fetching, caching, loading skeletons, empty/error boundaries, and automatic data refetching.
2. **URL Client State (Dashboard Settings):** Managed entirely by React Router (`useSearchParams`). Active page numbers, filter options (status, line of business, region, date range), and free-text search inputs must live directly in the browser address bar to guarantee shareable and bookmarkable dashboard views.
3. **Local UI State (Ephemeral & Persistent UI):** Row selection checkboxes must be tracked locally inside the table component via native `useState` to prevent layout re-renders. Global theme configuration (light/dark theme toggles) must be managed locally and persisted via browser Web Storage (`localStorage`). Monolithic global state stores (Redux, Zustand, global Context API) are strictly prohibited.