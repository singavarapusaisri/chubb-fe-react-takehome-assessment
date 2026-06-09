# React Coding Standards & Conventions

## Code Architecture Rules
* **File Naming:** All components use PascalCase and `.jsx` extensions (e.g., `PolicyTable.jsx`). Hooks and utility scripts use camelCase and `.js` extensions (e.g., `useLocalStorage.js`).
* **Component Declarations:** Use explicit named functional components (`export function Component() {}`) rather than implicit anonymous arrow functions (`export const Component = () => {}`) to improve error stack readability.
* **Hook Ingestion:** Keep hooks clean and clean of inline logic. Extract business behaviors out of the component visual tree and map them directly into domain-scoped custom hooks.
* **DRY vs. WET:** Prioritize code clarity over abstracting blocks too early. If a layout block is used less than three times across the dashboard, keep it inline before factoring it into a standalone file.