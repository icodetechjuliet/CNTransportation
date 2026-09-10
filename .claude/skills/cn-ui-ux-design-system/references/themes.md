# Themes (dark/light)

CargoNet has **3 selectable themes**, switched via attributes on `<html>`. Identify which theme system a page belongs to before styling — MainLayout1 pages get Aurora, MainLayout2 pages get ml2, and most business/NVOCC pages just run the default Blue Ocean theme with no dark-mode concept at all.

## 1. Blue Ocean (default)

No dedicated CSS var file — colors come from a runtime `changeColor()` JS function. Most NVOCC/business pages (the majority of the app) run in this theme only, with no dark variant. Don't add `prefers-color-scheme`/dark-mode CSS to a page that's only ever rendered in Blue Ocean — it has no dark counterpart to switch to.

## 2. cn-aurora (`src/css/cn-themes.css`, MainLayout1 only)

Single dark theme. `data-theme="cn-aurora"` + `data-accent="violet|emerald|amber|rose|cyan"`.
Tokens: `--aurora-bg`, `--aurora-surface`, `--aurora-surface-alt`, `--aurora-border`, `--aurora-text`, `--aurora-text-dim`, `--aurora-accent`, `--aurora-accent-soft`, `--aurora-header-from/to`, `--aurora-radius`.
If you're styling something inside `MainLayout1.vue`'s scope, use these vars for background/border/text instead of hardcoding — the theme file already has global-safety-net rules (`div/section/span/...{background-color:transparent}` under `[data-theme="cn-aurora"]`) that a hardcoded light background would fight against.

## 3. ml2 (`src/css/cn-theme-ml2.css`, MainLayout2 only)

`data-theme="ml2"` with independent sub-attributes (`data-accent`, `data-menu-color`, `data-header-color`, `data-color-mode: dark|light`, `data-layout-width`, `data-bg-color`) — this is the only theme with an actual light/dark toggle (`data-color-mode`). Controlled via `src/components/Ml2SwitcherPanel.vue`.
Tokens: `--ml2-accent`, `--ml2-bg`, `--ml2-surface`, `--ml2-surface-alt`, `--ml2-border`, `--ml2-text`, `--ml2-text-dim`, `--ml2-radius(-sm/-lg)`, `--ml2-shadow-(sm/md/lg)`, `--ml2-space-1..5`.

## Rules for dark-theme-aware CSS

- Never hardcode a light background/dark text pair inside a component that's rendered under `cn-aurora` or `ml2` — use the matching `--aurora-*`/`--ml2-*` var so it survives the accent/light-dark switch.
- Layered surfaces, not pure black: both dark systems already use layered `bg`/`surface`/`surface-alt` — reuse that 3-tier structure rather than flattening to one dark color.
- Keep borders subtle (`--aurora-border` / `--ml2-border`) rather than high-contrast white borders.
- Focus states must stay visible in both themes — check `.q-field__control:after` overrides in the relevant theme file before assuming Quasar's default focus ring is what renders.
- A component meant to work in multiple layouts (shared component, not a page) should either avoid hardcoded colors entirely (rely on Quasar's own `$primary`/`dark`-aware classes) or explicitly test in both MainLayout1 and MainLayout2 contexts.
