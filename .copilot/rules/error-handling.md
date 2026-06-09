# Asynchronous Operational Error Systems

## 1. UI Resilience Pattern
* All network actions must include explicit error handling fallback states. Avoid simple screen freeze behaviors.
* Use React Query's built-in `isError` check to swap normal display layouts with a styled error banner.

## 2. Remediation Requirements
* Display friendly, clear alerts indicating the point of failure (e.g., "Unable to fetch policy records due to a temporary network issue.").
* Error states must include a visible retry button that manually triggers the query function (`refetch()`) to restore visual components cleanly.