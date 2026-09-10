# Filters

## Filter bar wrapper (`.filter-bar-wrapper`, `nvocc-common.css:1028-1069`)

```css
.filter-bar-wrapper { padding:10px 14px; border:1px solid #c0eaff; border-radius:10px; background:#f1faff; }
.search-combo-wrapper { height:36px; border:1px solid #9edfff; border-radius:8px; background:#fff; }
```
Wrap a page's filter row in `.filter-bar-wrapper`; individual search/combo inputs inside it use `.search-combo-wrapper` (36px height, tighter than the standard 40px form field — filters are meant to feel lighter/faster than the data-entry form below them).

## Existing reusable filter components — check these before building a new filter panel

- `src/components/ApplyFiltersComponent.vue`
- `src/components/DynamicFilter.vue`
- `src/components/DashLogsApplyFiltersComponent.vue`
- `src/components/QuoteApprovalFilter.vue`

Several filter panels already exist per domain area (dashboard logs, quote approvals, generic apply-filters). Grep for the closest one to the entity you're filtering before writing a new filter panel from scratch — this app already has this exact duplication risk and these components exist specifically to prevent more of it.

## Layout

Filter fields sit in a single compact row (or wraps responsively), using the same `square outlined dense bg-color="blue-1"` field convention as forms (`references/fields.md`), just inside the lighter `.filter-bar-wrapper`/`.search-combo-wrapper` shells. Always include:
- A **Search/Apply** primary action.
- A **Reset/Clear** action (plain/secondary style, see `references/buttons.md`).
- **Export** only where the page already offers export functionality.

## What NOT to do

- Don't let the filter bar visually outweigh the table below it — no large cards, no heavy shadows beyond the standard `1px 2px 4px rgba(0,0,0,0.1)`/blue-tinted shadow already used for panels.
- Don't stack filters vertically as a tall sidebar unless the page already uses a drawer-style advanced-filter pattern (`.drawer-card`, see `references/dialogs.md`).
