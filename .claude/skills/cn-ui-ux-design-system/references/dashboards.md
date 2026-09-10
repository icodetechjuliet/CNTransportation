# Dashboards — KPI + list/detail pattern

Canonical implementation: [src/pages/DashboardSaleslead.vue](../../../../src/pages/DashboardSaleslead.vue) ("Sales Lead → Follow-Up Dashboard"). Reuse this pattern's markup/classes wholesale for any new "list of records + detail/activity panel" dashboard (follow-up trackers, activity feeds, lead/ticket/job dashboards) instead of inventing a new layout. It's also referenced from `.dashboard-page .kpi` in `nvocc-common.css` (NVOCC Export Dashboard / Sales Dashboard) — this page is a self-contained copy of that same accent-tile treatment for pages outside the `.nvocc-form-page` family.

## Page skeleton

1. **Page shell** — the `q-page` gets a soft blue background (`#eef5fb`) and a single wrapper div (e.g. `.sl-dashboard-shell`) with `border: 1px solid #cfe4f7; border-radius: 12px; background: #eef5fb; padding: 16px;` framing everything below. **Don't** wrap the whole page in one big white `q-card`/`.notab-container-report` — that merges the KPI tiles, list and detail panel into a single flush surface and loses the "distinct floating white cards on a tinted page" look this pattern depends on. Each section below (KPI tiles, list card, detail card) supplies its own white background/border — the shell only supplies the tinted margin around them.
2. **Breadcrumb header** — a plain `row items-center` directly on the shell background (no white card, no subtitle line): `header_text1` (parent, grey) → chevron (`arrow_right_icon`) → `header_text2` (current, bold, blue), then a `q-separator`.
3. **Filter bar** — a row of pill-shaped `q-btn-dropdown`s wrapped in a `.tb-app` container (`.tb-app .filter-bar-wrapper` supplies its own `#f1faff` bg / `#c0eaff` border — see `references/filters.md` for the pill pattern) + a `Search` button (`m-btn-style bg-dblue-lblue text-white`) + a round `refresh` icon button. Active filters render as a `q-chip` row underneath with a "Clear All" text button.
4. **KPI summary row** — `kpi-grid`, one accent tile per metric (see below).
5. **Main content** — a two-column `row.q-col-gutter-md`: `col-xs-12 col-md-4` record list on the left, `col-xs-12 col-md-8` detail panel on the right. Both panels share a fixed height (`620px`) with internal `overflow-y: auto` scroll — the page itself doesn't scroll past the fold.

## KPI accent tiles (`kpi-grid` / `.kpi`)

Each tile is data-driven off 4 CSS custom properties set inline per card — `--kpi-accent`, `--kpi-accent-dark`, `--kpi-bg` (a soft gradient), `--kpi-glow` (a low-alpha rgba of the accent, used for shadow/glow). Pick a new accent pair + soft gradient background per metric; don't reuse an existing metric's exact accent for an unrelated one. Established accents in this app: blue `#1787d4`/`#0566a9`, green `#2e9e5b`/`#1f7a44`, orange `#e88725`/`#bd5d08`, purple `#6657d9`/`#4435b8`, teal `#119b8e`/`#087268`, red `#e24d68`/`#b92e49`.

```css
.kpi-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px; }
.kpi {
  position: relative; display: flex; align-items: center; min-height: 96px;
  padding: 16px 55px 15px 25px; overflow: hidden; border-radius: 7px;
  border: 1px solid color-mix(in srgb, var(--kpi-accent) 28%, white);
  background: var(--kpi-bg);
  box-shadow: 0 5px 16px var(--kpi-glow);
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.kpi::before { /* left accent bar, 5px, vertical gradient of accent → accent-dark */ }
.kpi::after  { /* soft accent-tinted circle bleeding off the top-right corner */ }
.kpi:hover { border-color: color-mix(in srgb, var(--kpi-accent) 48%, white); box-shadow: 0 10px 24px var(--kpi-glow); transform: translateY(-3px); }
.kpi.kpi-active { box-shadow: 0 0 0 2px color-mix(in srgb, var(--kpi-accent) 55%, white), 0 10px 24px var(--kpi-glow); }
```

Label is uppercase 10px/700 in the dark accent, value is 24px/800 in near-black (`#102a43`), note line is 11px/500 grey (`#526a7a`). Icon sits in a 39px rounded-square (`border-radius: 11px`) diagonal gradient chip (`--kpi-accent → --kpi-accent-dark`) pinned top-right, with an `arrow_forward` affordance icon bottom-right that fades in on hover. Tiles are clickable and filter the page (toggle `kpi-active`) — treat KPI tiles as filter triggers, not passive stat displays, when the dashboard has a list below it.

Responsive: 6 → 3 columns at `max-width: 1300px`, 3 → 2 at `max-width: 700px`. Don't invent other breakpoints — match `references/responsive.md`.

## Record list panel (left column)

`q-card flat bordered` (`border-radius: 8px`, fixed `height: 620px`, flex column). Header section: icon + bold `text-subtitle2` title + `q-badge` count, then a `dense outlined` search `q-input` with a `search` prepend icon. Body is a scrollable `q-list separator` of `q-item`s, each: 40px `q-avatar` (initials, `avatarColor()` rotating palette) → name/code/status-badge/salesman stack → right-aligned meta (city, date) + `chevron_right`. Selected row uses `active-class="bg-blue-1"`. Empty state: centered `search_off` icon + caption. Paginate with a centered prev/page-of-total/next row, `1px solid #e0e0e0` top border, when the list exceeds a page.

## Detail panel (right column) — "Salesforce-style" record header

Empty state (nothing selected): centered `q-card flat bordered`, large muted icon (`grey-3`, `5rem`), `text-h6 text-grey-4` prompt, caption hint below.

Selected state — stacked cards inside a `620px` scroll container:

1. **Record header card** — gradient banner + field grid, one `q-card`:
   ```css
   .lead-record-header { background: linear-gradient(135deg, #1565c0 0%, #0288d1 100%); border-radius: 8px 8px 0 0; }
   ```
   Inside: white-bordered avatar (initials, 52px) + white `text-h6` name + white/opacity-80 code + a status pill (`lead-workflow-badge`: pill radius 10px, 10px/700 uppercase text, bg/color/border driven by the status's own color) + an edit icon button (`flat round white`).

   Below the banner, a plain field grid (`row q-col-gutter-sm`, `col-xs-6 col-sm-4` per field) using the Salesforce-style label/value pair:
   ```css
   .sf-label { font-size: 10px; color: #78909c; text-transform: uppercase; letter-spacing: .6px; font-weight: 500; margin-bottom: 2px; }
   .sf-value { font-size: 13px; color: #212121; font-weight: 500; border-bottom: 1px solid #eeeeee; padding-bottom: 5px; min-height: 22px; }
   ```
   Use `—` (em dash) as the placeholder for an empty value, never blank space.

2. **Activity/follow-up timeline card** — header row (icon + bold title + count badge + refresh icon button), then grouped sections. Each group has a colored, uppercase, letter-spaced label with a `border-left: 3px solid currentColor` tag (`.fu-section-header`, bg `#f5f5f5`, radius 4px) — pick one accent color per logical grouping (indigo for "lead-level", teal for "enquiry-level", etc.), not a fixed palette.

   Timeline rows: a left rail (`.timeline-indicator`, 18px wide) with a 12px dot + connecting 2px line down to the next entry, next to an `activity-card` (bg `#fafafa`, `1px solid #eeeeee`, radius 6px). Dot/card color reflects task status — reuse the existing semantic set, don't add new ones:

   | State | Dot | Card (`background` / `border-left`) |
   |---|---|---|
   | Completed | `.dot-green` `#4caf50` | `.card-completed` `#f1f8e9` / `#66bb6a` |
   | In progress | `.dot-blue` `#2196f3` | `.card-inprogress` `#e3f2fd` / `#42a5f5` |
   | Pending | `.dot-orange` `#ff9800` | `.card-pending` `#fff8e1` / `#ffa726` |
   | Overdue | `.dot-red` `#f44336` | `.card-overdue` `#fff3e0` / `#ef5350` |
   | Cancelled | — | `.card-cancelled` `#fce4ec` / `#ef9a9a` |
   | Closed | `.dot-grey` `#bdbdbd` | `.card-closed` `#f5f5f5` / `#bdbdbd` |

   Each activity card's own content: a row of small (10px) status/type `q-badge`s, a right-aligned timestamp with a `schedule` icon, then a `row q-col-gutter-xs` of label/value pairs (Contact, Assigned To, Next Action, Next Date, Revenue, Gross Profit, Volume…) — grey 11px caption label, `text-weight-medium` value. A free-text note renders in a `.notes-box` (bg `#f5f5f5`, radius 4px, `border-left: 3px solid #90caf9`, `notes` icon prefix). An overdue `NextDate` is red with a `warning` icon; otherwise green.

## When this pattern applies

Use this whole pattern for a new page only when it's genuinely a **list-of-records-with-a-detail/activity-view dashboard** (leads, tickets, jobs, shipments with a timeline). For a plain metrics-only dashboard with no drill-down list, use just the KPI tile section on its own — don't force a list/detail split that has nothing to show. For everything else (forms, plain tables, filter bars), keep using the other reference docs — this file is additive, not a replacement for them.
