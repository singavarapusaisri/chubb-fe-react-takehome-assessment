# Test Automation Principles

## 1. Test Architecture Goals
* Target functionality over individual code paths. Avoid writing tests for trivial, unexposed functions.
* Write user-centric integration assertions using Vitest and React Testing Library (RTL).

## 2. User Event Simulation Rule
* Interface interactions must use the standard user simulation library: `@testing-library/user-event`. Avoid older, primitive trigger patterns like `fireEvent`.
* Query interactive page regions using accessible semantic roles rather than internal implementation details:
  * Valid approach: `screen.getByRole('button', { name: /filter/i })`
  * Invalid approach: `container.querySelector('.filter-btn')`