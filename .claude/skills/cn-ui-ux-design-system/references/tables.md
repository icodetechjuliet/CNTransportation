# Tables

## Class: `.m-table-style` (`nvocc-common.css:1808-1893`)

The standard reusable table skin:

```css
header background: var(--bg-blue-white);   /* light blue-white gradient */
th { height:36px; padding:5px 10px; border-right:1px solid #54c7ff; border-bottom-color:#d0efff; font-size:12px; font-weight:600; }
tbody tr { height:38px; }
td { padding:5px 8px; border-right:1px solid #d0efff; font-size:12px; }
tbody tr:nth-child(even) { background-color:#f2f9ff; }  /* zebra */
```
Add `class="m-table-style"` to `q-table` (or the wrapping element per that page's pattern) when building a new data table. Row height (~36-38px) and 12px font are intentional — this is a dense enterprise data table, not a consumer list. Don't increase row height "for readability" — increase cell padding slightly instead if a table genuinely feels cramped, and only after checking nearby tables use the same height.

## Row hover

`nvocc-principal.css` reference style: hover background `#e4f6ff`. Apply a subtle hover only — no elevation/shadow on row hover.

## Alignment

- Numeric columns: right-align, consistent with accounting/finance conventions already used in charge/amount tables.
- Date columns: left or center align consistently within one table — match whatever the table's other date columns already do.
- Action column (edit/delete/view icons): right-most column, compact icon buttons (`flat round dense`, see `references/buttons.md`), not text buttons.

## Dialog-embedded tables

Inside dialogs, tables are typically `dense flat` on the `q-table` itself (see `ReferredDetailsDialog.vue`) rather than the full `.m-table-style` skin — a dialog table can be visually lighter than a full-page table since it's already inside a bordered card.

## Pagination / search / filters

Use Quasar's built-in `q-table` pagination (bottom-right) rather than a custom pager. Table-level search/filter fields go in the filter bar above the table (see `references/filters.md`), not inside the table header row, unless the existing page already embeds a search box in the table toolbar slot.

## Status columns

Use `q-badge class="mjc-status-badge"` with the semantic `color=` prop per `references/design-tokens.md`'s status table — this is the most widely reused status-badge pattern in the app (20+ pages). Don't invent a new status pill style for a new table.

## What NOT to do

- Don't switch to card-based "list" layouts for tabular data on desktop — tables stay tables. (Card-based responsive fallback on narrow screens is fine if the page already does that — see `references/responsive.md`.)
- Don't add row shadows, rounded row corners, or alternating bold/light font weights beyond the zebra background.
