# Golden Ratio layout proportions

A proportion **guideline** for deciding how to split space between primary/secondary content — new pages, dashboards, wide dialogs, panel layouts. It never overrides the core rule: **existing app patterns win over this guideline.** Use it when there's a genuine layout gap and no sibling page/pattern to copy (see SKILL.md "Decision workflow" step 2-3). Don't retrofit it onto an existing page just because it exists — that's a layout change, gated by "Layout preservation" in SKILL.md.

φ = 1.618 → **61.8% / 38.2%** split for primary/secondary content.

## Where it's actually useful here

- **Dashboard sections**: primary chart/KPI area vs. a secondary panel — `grid-template-columns: 1.618fr 1fr` (or `61.8% 38.2%`).
- **Wide two-pane dialogs**: main form vs. a summary/preview pane.
- **New page layouts** with a clear primary-content + secondary-content split (e.g. detail form + activity/notes rail).

## Where it does NOT apply

- **Standard forms** — keep using the existing `row.q-col-gutter-sm` + `col-md-3`/`col-md-4` grid from `references/forms.md`. Don't convert field grids to golden-ratio CSS grids; field width should follow content type (see below), not a mathematical ratio applied to every row.
- **q-table columns** — column width is driven by data importance/content length (see `references/tables.md`), not 61.8/38.2 math.
- **q-drawer/sidebar width** — keep the app's existing practical nav width; don't literally set it to 38.2% of viewport.
- **Typography scale** — don't multiply font sizes by 1.618. Keep the existing scale (page title/section title/body/label/helper — see whatever the page already uses).

## Spacing scale (when starting a genuinely new section/page)

Prefer values already in use across the app (4 / 8 / 13 / 21 / 34px), which happen to roughly track the golden spacing progression. This is consistent with — not a replacement for — `references/design-tokens.md`; don't invent a parallel spacing system for one new page.

```css
gap: 8px;    /* compact, inline field groups */
gap: 13px;   /* normal, within a field row */
gap: 21px;   /* section/component gap */
margin-bottom: 34px; /* major section separation */
```

Avoid arbitrary values (17px, 23px, 27px, 31px, 43px) unless the page being matched already uses them.

## Field width by content, not by ratio

When laying out a brand-new field row with no sibling pattern to copy, size fields by expected content rather than making every field equal width:

- **Large** (wide column): description/remarks/address/notes/long names/email.
- **Medium**: customer/supplier/location/contact/reference number/port/country.
- **Compact**: date/time/status/currency/quantity/code/percentage/boolean.

A primary+secondary field pair (e.g. "Customer Name" + "Customer Code") can use `1.618fr 1fr` as a starting proportion — but check whether the page's existing `col-md-*` grid can express the same relationship first (e.g. `col-md-8` / `col-md-4`) before introducing a separate CSS grid just for that row.

## Responsive behavior

61.8/38.2 is desktop-only. Collapse the same way the rest of the app does — via the existing `col-xs-12` breakpoints (see `references/responsive.md`), not a new custom breakpoint set. On tablet, simplify to 60/40 or 50/50; on mobile, single column, same as every other section in the app.

## Sanity checklist before using this

1. Is there already a sibling page/section that solves this layout? → copy it, skip golden ratio.
2. Is this genuinely a primary/secondary content split (not a form field row, not a table)? → golden ratio may help.
3. Does 61.8/38.2 clearly communicate which side is more important, or would equal columns be just as clear? → only use it when it adds real hierarchy.
4. Does it still work at 1920×1080 with 125%/150% Windows scaling, and collapse cleanly on the app's existing breakpoints?

If in doubt, prefer the plainer, already-established pattern. The Golden Ratio is a tool for hierarchy, not a requirement to apply everywhere.
