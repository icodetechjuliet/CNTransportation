# Cards

## Standard content card (`.content-card` / `.form-card`, `nvocc-principal.css`)

```css
border-radius: 10px;
background: #fff;
box-shadow: 0 1px 5px rgb(146 215 255 / 65%);
```
This is the standard "panel" look for grouping form sections, summary blocks, or dashboard tiles on NVOCC-scoped pages. Reuse it instead of Quasar's default `q-card` shadow (`q-card` elevation classes) when the page is already in the NVOCC family.

Generic (non-NVOCC) pages: plain `q-card` with `flat bordered` is the safer default — check the specific page/module for its existing card treatment before choosing between the two.

## When to use a card

- Summary/metric blocks (dashboard tiles).
- Grouping a form section that's logically separate from the rest of the page (e.g. "Party Details" as its own card within a longer form).
- Mobile/narrow-viewport representation of what's a table row on desktop, if the page already does responsive card-fallback (see `references/responsive.md`).

## When NOT to use a card

- Don't wrap every individual field or small widget in its own card — that's the single most common overdesign mistake for this app. Cards are for grouping, not decoration.
- Don't stack heavy shadows (`0 8px 24px …`) on cards — that weight is reserved for floating menus/dropdowns, not static content cards. Use the `0 1px 5px rgb(146 215 255/65%)` or generic `1px 2px 4px rgba(0,0,0,0.1)` shadow instead.
- Don't use large border-radius (16px+) on cards — `10px` is the established value.

## Job-type header cards

`.INC-heading` / `.EXP-heading` (`Quasarstyle.scss`) are gradient header bars used specifically for Income/Expense or Import/Export job-type distinction — reuse these exact classes when a similar "which type of job is this" header is needed rather than inventing a new gradient scheme.
