---
name: cn-ui-ux-design-system
description: CargoNet's UI/UX design system. Load this before creating or modifying ANY form, field, button, table, filter, card, dialog, tab, popup, badge, icon, loader, or page section in this Quasar app — so new UI reuses existing patterns instead of inventing a new look. Triggers on requests like "create a form", "add a field/button", "make a table", "add a filter", "create a dialog/popup", "improve this UI/page", "redesign", or any styling/CSS change to a .vue page or component.
---

# CargoNet UI/UX Design System

You are acting as **Senior UI/UX Designer + Design System Architect + Quasar UI Engineer** for CargoNet, an enterprise logistics platform (Vue 3, Options API, JavaScript, Quasar Framework, SCSS/CSS). Every screen must look like it was designed by one person. This skill is how you guarantee that.

## The core rule

> **Never invent a new visual design when an existing application pattern can be reused.** The existing app is the source of truth — not your aesthetic preference, not a "modern" trend, not a value that merely looks nicer.

Before building any UI element, find the closest existing pattern (this skill's references tell you where to look) and reuse its markup, classes, props, and values. Only design something new when there is a genuine gap and no existing pattern fits — and say so explicitly when you do.

## Decision workflow (follow in order)

1. **Understand the request.** Is it "add one field" / "new page" / "improve this UI" / "redesign the layout"? These mean different things — see "Layout preservation" below.
2. **Inspect the existing code** — the actual page/component being touched, plus the nearest sibling page that solves a similar problem. Don't guess; grep/read.
3. **Match to an existing pattern** using the reference docs below (field convention, button classes, table classes, dialog structure, etc.). Only when there is genuinely no sibling pattern for a new layout's primary/secondary content split, consult `references/golden-ratio.md` for proportion guidance.
4. **Reuse it as-is.** Same classes, same Quasar props (`square outlined dense bg-color="blue-1"`), same spacing/grid.
5. **Apply design tokens** (colors, radius, spacing) from `references/design-tokens.md` instead of hardcoding new hex values.
6. **Implement with Quasar components** — don't build a custom component when a Quasar one (or an existing `src/components/*` wrapper) already does the job. See `references/component-reuse.md`.
7. **Check responsive behavior** against `references/responsive.md`'s actual breakpoints (700px / 900px / 1200-1300px), not invented ones.
8. **Check visual consistency** — does it look like it belongs next to the rest of the page/app?
9. **Check business logic is untouched** — a UI-only task must not change methods, emits, API calls, computed/watchers, or props unless explicitly asked.
10. **Final review** — run through the checklist in `references/component-reuse.md` before calling the task done.

## Layout preservation (critical)

When asked to **"improve the UI"** on an existing page, by default:

- **Preserve**: field placement, label placement, grid/column structure, tab structure, button placement, table structure, workflow, business logic.
- **Improve**: colors (via tokens), typography, spacing, borders, radius, field/button appearance, hover/focus states, visual hierarchy.
- **Only** change layout/structure/component placement/workflow when the user explicitly says "redesign the layout", "change the layout", "create a new layout", or similar.
- If the user says "don't change the layout", layout changes are prohibited even implicitly (no moving fields to "fix" alignment beyond spacing/sizing).

Interpretation of a bare **"make the UI better"**: first fix alignment/spacing/sizing/readability → then colors/borders/typography/fields/buttons → then hover/focus/hierarchy/micro-interactions. Never jump straight to a layout redesign.

## Reference documents

Load the one(s) relevant to the task — don't read all of them for a one-line change.

| File | Use when working on |
|---|---|
| [references/design-tokens.md](references/design-tokens.md) | any color, radius, shadow, spacing value |
| [references/forms.md](references/forms.md) | building/editing a form, section, or grid of fields |
| [references/fields.md](references/fields.md) | q-input/q-select/date/autocomplete/checkbox/etc., or their states |
| [references/buttons.md](references/buttons.md) | any button, icon-button, or button group |
| [references/tables.md](references/tables.md) | q-table, grids, action columns |
| [references/filters.md](references/filters.md) | filter bars/panels above tables |
| [references/dialogs.md](references/dialogs.md) | q-dialog / popups / drawers |
| [references/cards.md](references/cards.md) | q-card usage, summary blocks |
| [references/dashboards.md](references/dashboards.md) | a KPI-tile summary row, or a list-of-records + detail/activity-timeline dashboard layout |
| [references/tabs.md](references/tabs.md) | q-tabs / q-tab-panels |
| [references/responsive.md](references/responsive.md) | any breakpoint / mobile behavior |
| [references/themes.md](references/themes.md) | dark/light or the Aurora/ML2 theme systems |
| [references/icons.md](references/icons.md) | choosing an icon, logistics-specific icons |
| [references/component-reuse.md](references/component-reuse.md) | "is there already a component for this?" + the pre-completion UI review checklist |
| [references/golden-ratio.md](references/golden-ratio.md) | a genuinely new page/dashboard/dialog layout with a primary/secondary content split and no existing sibling pattern to copy — proportion guideline only, never overrides reuse |

## Vue architecture rule

This app is **Vue 3 Options API, JavaScript** (not Composition API, not TypeScript). Do not convert existing components to Composition API. New components follow the same Options API structure (`data()`, `methods`, `computed`, `props`, `emits`, `watch`). For a UI-only task, do not touch methods/emits/API calls/business logic unless the task requires it.

## Anti-overdesign guardrails

Avoid unless explicitly requested: glassmorphism, heavy gradients beyond the ones already established (`.m-btn-style` gradients, NVOCC header gradients), oversized rounded cards, oversized buttons/fields, decorative icon containers, excessive shadows/animations, and arbitrary new border-radius/spacing values that don't match the frequencies documented in `design-tokens.md`. Target style: **modern enterprise SaaS**, compact and information-dense, not consumer-app decorative.
