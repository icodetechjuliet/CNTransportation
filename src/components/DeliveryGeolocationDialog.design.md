# DeliveryGeolocationDialog — design notes

> **2026-09-01 update — one-off restyle, not the shared skill.** The dialog was
> re-skinned a second time to match a reference dashboard mockup ("Sales Lead
> Follow-Up Dashboard": pastel duo-tone KPI cards, pill buttons/chips, glassy
> gradient icon badges, 16–20px radii). This was an **explicit, scoped request**
> — the user chose "just this one dialog, no skill change" when asked, so
> `.claude/skills/cn-ui-ux-design-system` was left untouched and this palette is
> **not** the app's new default. See "2026-09-01 restyle" section below for the
> tokens used here specifically.


Cleanup pass on the "Party locations" dialog (shipper/consignee address + geolocation
share). Scope: **CSS only** — no template structure, props, emits, or business logic
changed.

## What was wrong

The component had accumulated **6 cascading `<style scoped>` layers** in the same file
("legacy" → "production" → "NVOCC normalization" → "golden spacing" → "compact" →
"final cascade"), plus a **second, separate stylesheet**
(`DeliveryGeolocationDialog.material.css`, a full Google Material Design 3 token set)
loaded after it and overriding parts of it again with `!important`. Net effect:

- Every major selector (`.location-card`, `.card-heading`, `.party-location-grid`, …)
  was redefined 3–6 times with different spacing/radius/shadow values — genuinely
  unpredictable final rendering, and unreviewable as a diff.
- Two competing visual languages: CargoNet/NVOCC (blue, `10px` radius, soft blue
  shadow) vs. Material Design (`--md-*` tokens, `16px` radius, pill buttons,
  Roboto). The material stylesheet also carried the **only** working color rules for
  `.location-status--saved/--missing` and `.shipper-empty-location-icon` /
  `.consignee-empty-location-icon` (the classes the template actually renders) —
  deleting it outright would have silently broken those.
- Dead CSS for classes the template no longer uses (`.party-location-header`,
  `.status-badge`, `.status-dot`, `.saved-status`, `.add-button`, `.location-footer`,
  `.footer-note`, …), and a heavier drop shadow (`0 24px 70px …`) than anything else
  in the app uses on a card/dialog.

## What changed

Consolidated to **one stylesheet, one pass, each selector defined once**, using
CargoNet's existing NVOCC design tokens (this dialog is opened from the NVOCC job
form, `JobCNFormDynamicTab.vue`) instead of an invented/generic palette — per the
project's `cn-ui-ux-design-system` skill, the existing app's tokens are the source of
truth, not a new "clean design system" from scratch:

- **Palette (60/30/10)** — scoped CSS variables on `.delivery-location-dialog`:
  - 60% dominant: `--loc-surface` (#fff) / `--loc-surface-subtle` (#f1faff) —
    card/dialog backgrounds.
  - 30% structural: `--loc-text` (#172b3a), `--loc-text-muted` (#5f7482),
    `--loc-border` (#d0efff) — all text and hairline borders.
  - 10% accent: `--loc-primary` (#0178bc, CargoNet's NVOCC blue) for the one
    primary action (Share location) and focus rings; `--loc-success` /
    `--loc-danger` (Quasar `positive`/`negative` — #21ba45 / #c10015) used **only**
    for shipper/consignee identity and the saved/missing status badge, never as
    decoration.
- **Typography** — one family, `Inter` (already the convention in this file), fixed
  scale: title 18/24 700, subtitle 12/16, role label 10/16 700 uppercase, name
  14/20 700, body 12/18, coordinate mono value 11/16.
- **Spacing** — strict 8pt grid: `8 / 12 / 16 / 24px` only (dropped the mixed
  `13px`/`18px`/`9px`/`10.5px` values from the old layers).
- **Radius/shadow** — `10px` cards/dialog, `8px` inner panels/buttons, matching
  `references/cards.md`; single soft shadow
  `0 1px 5px rgb(146 215 255 / 65%)` (CargoNet's standard card shadow) — removed
  the Material `16px` radius, pill buttons, and the old `0 24px 70px` dialog
  shadow.
- **States** — explicit `:hover`, `:focus-visible` (2px outline, `--loc-primary`),
  and `.disabled`/`[disabled]` (0.55 opacity) on the share button, close icon, and
  share-menu items; `field-label`/status text kept at CargoNet's existing
  contrast (all pass WCAG AA at their weight/size).
- Removed: gradients (`linear-gradient(90deg, #f8fdff, #fff)` card heading, the
  Material header-icon gradient), the oversized dialog shadow, pill-shaped
  buttons, and all dead/unused selectors.
- Deleted `DeliveryGeolocationDialog.material.css` and its `<style src="...">`
  import — folded the two classes it uniquely provided
  (`.location-status--saved/--missing`, `.shipper/consignee-empty-location-icon`)
  into the single remaining stylesheet.

## Result

One `<style scoped>` block (~300 lines, down from ~700 lines across two files),
each selector appears once, and the visual result is CargoNet's own NVOCC look
(not Material Design) — restrained, 8px-gridded, one accent color used sparingly.

---

## 2026-09-01 restyle — dashboard reference palette (this component only)

Reskinned again on request to match a reference dashboard mockup, entirely via
the existing selector set — no template/script changes. All tokens scoped to
`.delivery-location-dialog` under new `--dlg-*` names (separate from the
`--loc-*` tokens above, which this update replaces in this file).

- **Palette (60/30/10)**:
  - 60% dominant: `--dlg-bg` (#eef4fb, dialog body) / `--dlg-surface` (#fff, cards).
  - 30% structural: `--dlg-text` (#16283c), `--dlg-text-muted` (#64748b),
    `--dlg-border` (#e3ecf6).
  - 10% accent: `--dlg-primary` (#1671c9 → #0f5fa6 gradient) for the header icon
    badge and primary/pill buttons; `--dlg-success` (#16a34a) / `--dlg-danger`
    (#dc2626) for shipper/consignee identity and status only.
- **Typography**: Inter, bolder scale than the previous pass — title 20/28 800,
  card name 15/20 800, uppercase tracked labels 10–10.5px/16 700.
- **Radius**: dialog 20px, party cards 18px, inner panels (address/coordinate)
  14px, icon badges 14px rounded-square, buttons/status pills fully rounded
  (999px) — reference mockup's signature "duo-tone card + pill button" look.
- **Gradients** (reintroduced deliberately, matching the reference — this is
  the one place in the app's styling where gradients are the point, not
  overuse): header icon badge and primary buttons use the blue
  `--dlg-primary` → `--dlg-primary-dark` diagonal; each party card heading
  uses a soft pastel diagonal duo-tone in its accent hue (green for shipper,
  red for consignee); address/coordinate panels use a barely-there blue-white
  diagonal.
- **Shadows**: dialog `0 20px 48px rgba(15,61,98,.16)`, cards
  `0 10px 24px rgba(15,61,98,.08)`, pill buttons `0 8px 18px
  rgba(22,113,201,.28)` — softer/larger than CargoNet's usual flat NVOCC
  shadow, matching the mockup's card elevation.
- **Spacing**: 10/12/14/16/20/24px, slightly looser than the previous 8pt-only
  pass to match the mockup's more generous card padding.
- **States**: hover/focus-visible/disabled kept explicit on the close button,
  share button, and share-menu items, same as the prior pass.

**Scope note**: this is intentionally inconsistent with the rest of the app
(NVOCC's flatter, denser look) — it was applied here only, by explicit user
choice, and is not registered in the shared `cn-ui-ux-design-system` skill. If
this look should become a reusable pattern (e.g. for a new dashboard-style
screen), that needs a separate, explicit decision to add it to the skill.

---

## 2026-09-01 restyle #2 — matched to a supplied reference mock

Rebuilt again, this time pixel-matched to a reference "Party locations" modal
mock the user supplied (Claude Design artifact). Template markup was
restructured (new class names: `.modal-head/.glyph/.titles`,
`.party-card/.card-head/.role-chip/.id-block/.status-pill`,
`.card-body/.pin-ring/.addr-block/.coord-pills`, `.card-foot`, `.modal-foot`)
to mirror the mock's DOM shape; **all data bindings and methods are
unchanged** (`isValidLocation`, `formatCoordinate`, `addLocation`,
`shareWhatsApp`, `shareLocation`, `copyLocationLink`, `openMaps`).

Two deliberate departures from the mock, because it was a static prototype
and this is the real feature:

- The mock's footer has "Cancel" / "Save & continue" buttons gated on both
  parties being added — that's a two-step wizard pattern. This dialog saves
  live via `GeolocationSelector`/the API as soon as a location is added, so
  there's nothing to "continue" — kept the mock's footer note text only
  ("Locations are visible to both parties once shared") and dropped the fake
  buttons.
- The mock's "added" state shows only an address line + coordinates; ours
  keeps the real **Share location** dropdown (WhatsApp / other apps / copy
  link / open in Maps) as a `.btn-secondary`-styled button in the same slot
  the mock uses for its "Edit location" button — same visual weight
  (bordered, neutral), real functionality.

Fonts: the mock specifies Manrope (headings) + IBM Plex Mono (coordinates)
via Google Fonts. Swapped Manrope → **Poppins**, since CargoNet already loads
Poppins app-wide (`src/index.template.html`) — no new webfont request for one
dialog. Swapped IBM Plex Mono → the existing `Consolas, Monaco, monospace`
fallback stack already used elsewhere in this file, for the same reason.

Tokens (scoped to `.delivery-location-dialog`, replacing the `--dlg-*` set
from restyle #1):

| Token | Value | Use |
|---|---|---|
| `--surface` / `--surface-sunken` | `#fff` / `#f7f8fb` | card / card-head backgrounds (60%) |
| `--border` / `--border-strong` | `#e1e5ee` / `#ccd3e1` | hairlines (30%) |
| `--ink-900/700/500/400` | `#161a23`…`#98a0b1` | text scale (30%) |
| `--accent` / `--accent-hover` | `#2452c9` / `#1d44ad` | header glyph gradient, focus ring (10%) |
| `--shipper` / `--shipper-soft` / `--shipper-border` | `#0f8f6f` / `#e8f6f1` / `#c7e9dc` | shipper identity + "Add location" CTA |
| `--consignee` / `--consignee-soft` / `--consignee-border` | `#b3521c` / `#fbeee3` / `#f0d3b8` | consignee identity + "Add location" CTA |
| `--success` | `#1a8f5a` | "Added" status pill text |

Radius: modal 20px, party card 16px, role-chip/close-btn/buttons 10-12px,
status pill + pin-ring fully rounded. Shadow: single layered
`--shadow-modal` on the dialog only; cards are flat (border only, no card
shadow) — flatter than restyle #1.

**Scope note (unchanged)**: still a one-off exception, not in the shared
skill.

---

## 2026-09-01 restyle #3 — global CSS + reused header chrome, tighter padding

Two changes, both scoping/spacing only — no visual redesign:

- **Header now reuses `nvocc-common.css`'s existing dialog-header
  convention** instead of custom CSS: the `q-card` carries `nvocc-dialog-card`
  and the header `q-card-section` carries `dialog-head` (see
  `references/dialogs.md`'s "NVOCC dialog/drawer variants"). That global rule
  supplies the header's padding/background/box-shadow and sizes the close
  button's `round` state to the app's standard 30px — none of that is
  redeclared locally any more. Only the icon glyph and title/subtitle
  typography (which nvocc-common doesn't provide) stay custom. The per-party
  card header div was renamed `card-head` → `party-head` specifically to
  **avoid** colliding with that same global `.nvocc-dialog-card :is(.card-head, .dialog-head)`
  selector — it's a small in-body card header, not the dialog's own header,
  and must not pick up the dialog-chrome styling (white bg, box-shadow,
  58px min-height).
- **`<style scoped>` → plain `<style>`.** This file's CSS is no longer
  Vue-scoped; it's a normal global stylesheet, like `nvocc-common.css` and
  `cn-style.css`. To avoid leaking generic class names (`.btn`, `.card-body`,
  `.status-pill`, …) into the rest of the app now that scoping is gone,
  every selector is written under the `.delivery-location-dialog` ancestor —
  the same namespacing pattern `nvocc-common.css` itself uses
  (`:is(.nvocc-form-page, .nvocc-dialog-card) .foo`), just anchored to this
  component's own unique root class instead of a shared page-family class.
- **Padding reduced app-wide within the dialog**: header/body/footer padding
  now comes from `nvocc-dialog-card`'s own compact defaults (12px 18px /
  16px 18px) instead of the previous custom 22-28px values; party-card
  radius 16px→12px, card-head 16px 18px→10px 12px, card-body
  22px 18px 18px→14px 12px (min-height 190px→150px), card-foot
  18px→12px, coord-pill gap/padding reduced ~25%, header glyph 44px→36px,
  title 19px→16px. Net effect: same layout/information, noticeably denser —
  closer to the rest of the app's NVOCC dialog density.

---

## 2026-09-01 restyle #4 — width trim, header follow-ups, and
## GeolocationSelector.vue matched to the same design

Three small follow-ups plus one sibling-component pass:

- **Add/Share location buttons** no longer stretch full-width — `.card-foot`
  is `display:flex; justify-content:center` instead, so the button sizes to
  its content and sits centered (was briefly full-width, reverted per
  feedback: "dont stretch it").
- **Header flattened further**: `.dialog-head` gets `box-shadow:none` to
  cancel the soft blue shadow `nvocc-dialog-card`'s global rule adds (that
  rule has no border, so no border override was needed). The header glyph
  dropped its dark blue gradient for a **light** treatment matching the
  shipper/consignee role-chip pattern: `--accent-soft` (#eef2fd) background,
  `--accent-soft-border` (#d5e0fa) border, `--accent` colored icon. The
  now-unused `--accent-hover` token was removed.
- **Dialog width trimmed**: 860px → **760px** ("reduce the popup width a
  little bit").
- **`GeolocationSelector.vue` ("Select company location") restyled to
  match**: same header pattern (`nvocc-dialog-card` + `dialog-head`, light
  icon glyph, no shadow, Poppins title/Inter subtitle) and the *same* token
  names/values (`--surface`, `--ink-*`, `--border*`, `--accent`,
  `--accent-soft`, `--accent-soft-border`) so the two dialogs in this
  add-location flow read as one system. Along the way, dropped the legacy
  `cn-location-dialog` class and **~90 lines of dead CSS** the file had
  accumulated across earlier passes — selectors like `.geo-header`,
  `.geo-title`, `.geo-close`, `.geo-footer`, `.geo-cancel`, `.map-title`,
  `.geo-dialog-head`, `.geo-company-context/-label/-name` that no longer
  matched anything in the template (it had drifted to `.dialog-head-icon`/
  `.dialog-head-title`/etc. naming in an earlier pass while this CSS still
  targeted the old names). Width trimmed 860px → 780px to match. No
  script/logic changes — same map, address search, and save behavior.

---

## 2026-09-01 restyle #5 — tabs & fields reverted to the skill, then tabs re-customized per a new reference

Two follow-ups to `GeolocationSelector.vue`, in order:

1. **Reverted the custom tab/field styling from restyle #4** back to the
   `cn-ui-ux-design-system` skill's defaults, per feedback ("no for tabs &
   fields ref the skill"): tabs went back to `references/tabs.md`'s
   canonical markup (`dense align="left" class="text-primary"` + a
   `q-separator`), and the field CSS overrides (custom radius/background/
   focus-border) were removed so fields render with the plain
   `square outlined dense bg-color="blue-1"` look, per
   `references/fields.md`.
2. **Tabs then re-customized to a segmented-pill control**, per a new,
   explicit reference design (Claude Design artifact + screenshot) supplied
   specifically for this dialog: equal-width pills inside a rounded
   (`12px`) `--surface-sunken` track with a `1px` border, active pill lifts
   to a white (`--surface`) card with a soft `0 1px 2px` shadow and
   `--accent` text, no underline indicator. This intentionally departs from
   `references/tabs.md`'s default underline-tab convention — scoped to
   `.geo-tabs` only, so it doesn't set a new app-wide tab pattern (every
   other tab set in the app should still follow the skill's default unless
   given the same kind of explicit reference).

Fields in this dialog remain on the skill's default (`blue-1`/`outlined`/
`square`, no custom overrides) — only the tab control was re-customized.

---

## 2026-09-01 restyle #6 — tab scroll arrows, font, close button, buttons

Four fixes across both dialogs:

- **Tab scroll arrows hidden**: `GeolocationSelector.vue`'s segmented tabs
  were showing Quasar's `< >` overflow-scroll arrows. Added
  `.geo-tabs :deep(.q-tabs__arrow) { display: none !important; }` rather
  than reworking the flex sizing — simplest fix for the visible symptom.
- **Font family — dropped the invented "Inter" stack**: this app's actual
  global font is Poppins (`cn-style.css` sets it on `body`, self-hosted
  Poppins-Regular/Medium/SemiBold/Bold + the Google-Fonts `<link>` in
  `index.template.html`); restyle #2 had introduced an unrelated
  `Inter, "Segoe UI", Roboto, Arial, sans-serif` stack in
  `GeolocationSelector.vue` (`DeliveryGeolocationDialog.vue` already only
  used Inter as a fallback pairing, not touched). Replaced with plain
  `font-family: Poppins, sans-serif;` on `.geo-dialog`, and removed the
  redundant `Poppins, Inter, sans-serif` on `.modal-title` (now inherits).
- **Close button given real style, in *both* dialogs, and centered**: the
  header close button (`flat round dense`, no class) was visually invisible
  outside hover — Quasar's `flat` variant has no background by default, and
  `nvocc-dialog-card`'s global `.q-btn--round` rule only sets size/color,
  not background. Added a `.dialog-head .q-btn--round` rule (light
  `--surface-sunken` fill + `--border` outline at rest, `--accent-soft` +
  `--accent` on hover) to **both** `GeolocationSelector.vue` and
  `DeliveryGeolocationDialog.vue` — the first restyle pass only added it to
  the former. Also added explicit `display:flex; align-items:center;
  justify-content:center; padding:0;` so the icon is centered in the
  30×30 box regardless of any inherited button padding.
- **Search / Locate / Save buttons switched to the app's global button
  classes**, per `references/buttons.md`, replacing the custom `.geo-btn`
  class this file had invented: `Search` and `Locate` now use
  `m-btn-style-md` (standard form action), `Save location` uses
  `m-btn-style` (primary dialog action, matching `references/dialogs.md`'s
  canonical `<q-btn color="primary" class="m-btn-style" label="Save" />`).
  Dropped `unelevated` on all three to match that same canonical example.
  The now-unused `.geo-btn` CSS block was deleted.
