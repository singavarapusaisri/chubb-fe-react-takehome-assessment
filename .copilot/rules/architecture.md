# System Architecture & Directory Topology

## 1. Directory Blueprint
Code must strict-map to the following structural outline. No alternative file structures are permitted:
* `src/components/`: Pure, decoupled presentational primitives (e.g., Buttons, Form inputs, Loaders).
* `src/features/policies/`: Domain encapsulation folder containing its own target components, custom network hooks, and backend communications.
* `src/hooks/`: Global shared behavioral modules (`useLocalStorage.js`, `usePolicyFilters.js`).

src/
├── components/          # Reusable presentational UI elements (Atoms)
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   └── Skeleton.jsx     # Handles loading states elegantly
│
├── features/            # Feature-scoped logic (Encapsulation)
│   └── policies/
│       ├── components/  # Smart feature components
│       │   ├── FilterBar.jsx
│       │   ├── PolicyTable.jsx
│       │   └── StatsPanel.jsx
│       ├── hooks/       
│       │   └── usePolicies.js   # React Query hook handling server state
│       └── services/    
│           └── policyApi.js     # Fetch API requests to json-server
│
├── hooks/               # Global utility hooks for client state
│   ├── useLocalStorage.js       # Handles theme & page size persistence
│   └── usePolicyFilters.js      # Syncs active UI controls with URL params
│
├── styles/              
│   └── index.css        # Tailwind directives & Design Tokens (CSS Variables)
│
├── App.jsx              # Core layout, Context providers, & Theme wrapper
└── main.jsx             # React DOM mounting entry point

## 2. Domain Encapsulation Rule
The `features/policies/` directory must act as an isolated silo. Outside components are prohibited from importing private policy entities. If the dashboard expands tomorrow to include another business unit (e.g., Claims), it must follow a parallel architecture layout: `src/features/claims/`.