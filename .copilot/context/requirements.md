# Product Requirements Document (PRD): Chubb APAC Policy Overview Dashboard

## 1. Background & Objective
Chubb's APAC operations team manages insurance policies across multiple regions, currently relying heavily on manual spreadsheets. The objective is to build the **Policy Overview Dashboard**—a highly performant, accessible, and shareable Single-Page Application (SPA) that acts as a centralized web-based interface to view, filter, and execute bulk actions on policy data. 

This project must demonstrate production-quality frontend engineering, adhering strictly to SOLID principles, DRY code, and a clean separation of concerns.

---

## 2. Technical Stack & Architecture Goals
- **Frontend Focus:** Clean separation between presentation (UI) and data/business logic.
- **Component Architecture:** Composable, single-responsibility components with appropriate granularity.
- **Backend Data Source:** Consumes data from a lightweight local API (e.g., JSON Server or a mock server node).
- **Quality Standards:** Senior-engineer level code structure, thorough test automation, and strict accessibility compliance.

---

## 3. Core Features & Specifications

### 3.1 Policy Table View
- **Pagination & Sorting:** Client-side UI driving server-side data fetching. Configurable page size with sensible defaults (e.g., 10, 25, 50).
- **Server-Side Filtering:** Sync filters with the backend for:
  - Status
  - Line of Business (LoB)
  - Date Range (Effective/Expiry)
  - Region
- **Free-Text Search:** Global search matching across `policyNumber`, `policyholderName`, and `underwriter`.

### 3.2 Bulk Actions
- **Multi-Select:** Checkbox selection system integrated into the table layout (including a "Select All" header toggle).
- **Action Execution:** A batch "Flag for Review" action applicable to all selected records.
- **Feedback Loop:** Clear visual success/failure notifications (e.g., toasts or banners) post-action execution.

### 3.3 Summary Statistics Panel
- Dynamic metric cards that automatically recalculate or re-fetch when filters are applied.
- **Required Metrics:**
  - Total counts broken down by policy status (*Active, Expired, Pending, Cancelled*).
  - Total premium volume aggregated by Line of Business.
  - Total count of policies expiring within the next 30 days.

### 3.4 State Management & UX States
- **State Separation:** Strict boundary between Server State (API cache/fetching) and Client UI State.
- **URL Synchronization:** Synchronize filters, search queries, pagination, and sorting parameters with the URL query string to ensure the dashboard state is shareable and bookmarkable.
- **Asynchronous UI States:**
  - *Loading:* Use high-fidelity skeleton screens or structural loading indicators (avoid generic full-screen spinners).
  - *Empty:* Elegant fallback UI when zero records match current filters.
  - *Error:* Graceful error boundaries displaying meaningful messages alongside a "Retry" mechanism.
  - *Optimistic Updates:* Implement optimistic UI changes for quick-acting states, specifically for the "Flag for Review" action.

---

## 4. Non-Functional & Cross-Cutting Requirements

### 4.1 Theming & Design Tokens
- Modern token-driven architecture supporting Light and Dark modes.
- Implement a global user theme toggle.
- **Defaults & Persistence:** Respect system preferences (`prefers-color-scheme`) by default, but persist manual user overrides across sessions.

### 4.2 Local Storage & Abstracted Browser Storage
- Centralized, encapsulated storage utilities (e.g., custom hooks or service abstractions) to handle user preferences.
- **Stored Data Points:** Active theme, default page size, and last-used filter states. Direct, un-encapsulated `localStorage` calls scattered throughout components are strictly prohibited.

### 4.3 Accessibility (a11y)
- Must achieve **WCAG 2.1 AA** compliance natively from inception.
- Semantic HTML tags, robust ARIA attributes for dynamic states, logical keyboard navigation focus traps where necessary, and high-contrast color ratios for both light and dark modes.

### 4.4 Test Automation
- Production-grade testing strategy including:
  - **Unit Testing:** Pure functions, business logic utility assertions.
  - **Component Testing:** Mocking interactions, confirming accessible roles, testing conditional states (loading, empty, error).
  - **Integration Testing:** Verification of state transitions, filter combinations, and bulk action triggers.

---

## 5. Data Schema & Seed Specification
The mock backend must serve a seed dataset containing **200+ realistic APAC records** conforming exactly to the following model:

| Field Name | Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `policyNumber` | String | Unique, format: `POL-XXXXXX` |
| `policyholderName` | String | Realistic APAC-region corporate/individual names |
| `lineOfBusiness` | Enum | `Property`, `Casualty`, `A&H`, `Marine` |
| `status` | Enum | `Active`, `Expired`, `Pending`, `Cancelled` |
| `premiumAmount` | Decimal | Numeric range: `1,000` to `5,000,000` |
| `currency` | String | `USD`, `SGD`, `HKD`, `AUD`, `JPY`, `THB` |
| `effectiveDate` | Date | ISO Format (`YYYY-MM-DD`) |
| `expiryDate` | Date | ISO Format (`YYYY-MM-DD`) |
| `region` | String | Limited to: `Singapore`, `Hong Kong`, `Australia`, `Japan`, `Thailand`, `Indonesia`, `Malaysia`, `Philippines` |
| `underwriter` | String | Full name of assigned underwriting professional |
| `flaggedForReview` | Boolean | Default: `false` |