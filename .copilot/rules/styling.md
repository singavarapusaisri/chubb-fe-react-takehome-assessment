# Design Tokens & Styling Architecture

## 1. Class Organization Rules
* Compose layout, spacing, and sizing rules using modern utility classes provided by Tailwind CSS.
* Keep class structures scannable by enforcing a consistent ordering framework: 
  Layout/Display -> Box Model (Margin/Padding) -> Sizing (Width/Height) -> Typography -> Cosmetics (Colors/Borders).

## 2. Design Token Specifications
* Enforce all core color variables via native CSS properties declared in `src/styles/index.css`.
* Do not inject fixed hex codes inside individual component markups. Utilize structural color aliases instead:
  * Light Mode Surface: `bg-white text-slate-900`
  * Dark Mode Surface: `dark:bg-slate-900 dark:text-slate-50`
  * Active Interactive Focus Indicator: `focus-visible:ring-2 focus-visible:ring-blue-500 outline-none`