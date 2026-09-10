# Design tokens — CargoNet

CargoNet does **not** have one unified `:root` token file. It has three layers. Use the layer that matches the page you're editing — don't mix them, and don't invent new hex values when one of these already covers the case.

## Layer 1 — Quasar base palette (`src/css/quasar.variables.scss`)

```scss
$primary:   #1976D2;
$secondary: #26A69A;
$accent:    #9C27B0;
$dark:      #1D1D1D;
$dark-page: #121212;
$positive:  #21BA45;
$negative:  #C10015;
$info:      #31CCEC;
$warning:   #F2C037;
```
Use these via Quasar's `color="primary"`, `color="positive"`, etc. props — this is the safest, most reusable way to color a `q-btn`/`q-badge`/`q-icon`.

## Layer 2 — NVOCC "house" tokens (used across most business pages)

These aren't CSS custom properties everywhere, but they are the de-facto standard fill/border/text colors on NVOCC-family pages (`nvocc-common.css`, `nvocc-principal.css`):

| Purpose | Value |
|---|---|
| Field background | `#e3f2fd` (`bg-color="blue-1"` prop on Quasar fields) |
| Field height | `40px` |
| Field radius | `8px` |
| Primary accent blue | `#0178bc` (`--nv-blue`), dark variant `--nv-blue-dark` |
| Table header gradient | `linear-gradient(90deg, #dff4ff, #f8fdff)` |
| Table border | `#54c7ff` (header), `#d0efff` (body cells) |
| Table zebra row | `#f2f9ff` |
| Table row hover | `#e4f6ff` |
| Card/panel shadow | `0 1px 5px rgb(146 215 255 / 65%)` |
| Filter bar bg/border | `#f1faff` bg, `#c0eaff` border |
| Card/dialog background | `#fff`, radius `10px` |

## Layer 3 — Theme systems (data-attribute driven, dark themes)

The app ships 3 selectable themes, switched on `<html>`:

1. **Blue Ocean (default)** — no dedicated CSS var file; produced at runtime by a `changeColor()` JS function. This is what you see with no `data-theme` attribute.
2. **cn-aurora** (`src/css/cn-themes.css`) — `data-theme="cn-aurora"`, plus `data-accent="violet|emerald|amber|rose|cyan"`. Tokens: `--aurora-bg`, `--aurora-surface`, `--aurora-surface-alt`, `--aurora-border`, `--aurora-text`, `--aurora-text-dim`, `--aurora-accent`, `--aurora-accent-soft`, `--aurora-header-from/to`, `--aurora-radius` (12px).
3. **ml2** (`src/css/cn-theme-ml2.css`, MainLayout2 only) — `data-theme="ml2"` with independent sub-attributes: `data-accent`, `data-menu-color`, `data-header-color`, `data-color-mode` (dark/light), `data-layout-width`, `data-bg-color`. ~29 tokens: `--ml2-accent`, `--ml2-bg`, `--ml2-surface`, `--ml2-surface-alt`, `--ml2-border`, `--ml2-text`, `--ml2-text-dim`, `--ml2-radius(-sm/-lg)`, `--ml2-shadow-(sm/md/lg)`, `--ml2-space-1..5`, etc.

**Rule:** if you're styling something inside a component that already carries `--aurora-*` or `--ml2-*` var usage nearby, keep using that theme's vars — don't hardcode a hex that will break in dark mode. If you're on a page with neither (most business pages), Layer 2's hardcoded NVOCC colors are the norm; that's consistent with the existing code, not a violation of "use tokens".

## Border-radius — use by context, not by preference

Observed frequency across the codebase: `8px` and `10px` dominate (fields, cards, buttons, table containers). `3px`–`6px` shows up on small chips/badges. `50px`/`999px`/pill values are for status pills/chips only. **Default to `8px` for fields/buttons, `10px` for cards/panels/dialogs, pill radius only for badges/chips.** Don't introduce `16px`/`20px`+ card radii — that's not in the existing vocabulary.

## Shadows

Standard subtle shadow: `1px 2px 4px rgba(0,0,0,0.1)` (generic) or `0 1px 5px rgb(146 215 255 / 65%)` (NVOCC blue-tinted, for page headers/cards). Don't add heavier shadows (`0 8px 24px …` etc.) outside dropdown menus/popovers, which already use that weight for cn-aurora dropdown menus only.

## Status colors

No single canonical status-color file exists — colors are applied via the Quasar `color=` prop at the call site on top of the shared shape class `.mjc-status-badge`. Reuse this pattern:

| Status | Quasar `color` |
|---|---|
| Approved / Active / Completed | `green` / `positive` |
| Pending / Warning | `orange` / `warning` |
| Rejected / Error / Inactive | `red` / `negative` |
| Draft | grey gradient via `.draft-chip` class (`nvocc-common.css`) |

See `references/tables.md` and `references/component-reuse.md` for the badge markup itself.
