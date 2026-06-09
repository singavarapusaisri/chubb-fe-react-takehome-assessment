# Accessibility (a11y) Implementation Standard (WCAG 2.1 AA)

## 1. Semantic Structure Rules
* Interactive tabular blocks must use standard semantic markers (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`). Avoid styling plain `<div>` containers as grid representations.
* Column headers (`<th>`) must include explicit `scope="col"` indicators to support navigational context for screen reader utilities.

## 2. ARIA Attribute Specifications
* Every selection control checkbox embedded within a table row must map a distinct `aria-label` highlighting the specific item ID (e.g., `aria-label="Select policy POL-100201"`).
* Interactive dashboard triggers must maintain visible focus indicators using custom class bindings (`focus-visible:ring-2`). Ensure the color contrast ratio for textual summaries meets or exceeds the required 4.5:1 ratio.