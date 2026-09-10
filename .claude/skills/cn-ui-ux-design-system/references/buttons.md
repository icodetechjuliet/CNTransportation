# Buttons

## Class family: `.m-btn-style*` (`src/css/cn-style.css:11458-11500`)

```
.m-btn-style     { padding: 8px 16px;  font-size: 13px; text-transform: capitalize; }
.m-btn-style-md  { padding: 6px 13px;  font-size: 13px; }
.m-btn-style-sm  { padding: 5px 10px;  font-size: 12px; line-height: 15px; }
.m-btn-style-lg  { padding: 10px 16px; font-size: 14px; }
```
This is CargoNet's button-sizing system. Pick a size variant by context (compact toolbar → `-sm`, standard form action → default/`-md`, prominent page-level action → `-lg`) — don't invent new padding values.

## Hierarchy

| Role | Markup |
|---|---|
| **Primary** (Save/Submit/Create/Confirm) | `<q-btn color="primary" class="m-btn-style" label="Save" />` |
| **Secondary / Cancel / Back** | `<q-btn label="Cancel" v-close-popup />` — plain, no `color`, no class. The app's convention for cancel/neutral actions is an unstyled flat-looking `q-btn`, not an "outline" variant. |
| **Outline (lower-priority action)** | `<q-btn outline color="primary" class="m-btn-style-sm" label="…" />` — use sparingly; the codebase leans on the plain/primary split above more than a third outline tier. |
| **Icon buttons** (Edit/Delete/View/Refresh/Search/More/Close) | `<q-btn flat round dense icon="edit" />` — flat+round+dense is the standard triple for icon-only actions (matches the dialog close-button pattern, see `references/dialogs.md`). |
| **Danger** (destructive) | `<q-btn color="negative" class="m-btn-style" label="Delete" />` or the existing `.btn-delete` utility class (`cn-style.css:6915`) for pill-style delete actions already used in a few tables. |

## Dynamic state buttons

Some save buttons swap color/icon based on row state — reuse this pattern rather than a static button when the action is genuinely stateful:
```html
<q-btn :color="row.isRowSaved ? 'warning' : 'positive'" :icon="row.isRowSaved ? 'edit' : 'save'" />
```
(from `ChargesDetailsComponent.vue`)

## NVOCC toolbar buttons

On NVOCC-scoped pages, toolbar `q-btn`s are globally styled to `min-height:34px; border-radius:8px`, and the primary toolbar action often uses the gradient `linear-gradient(90deg, #046ca8, #16a8e7)` instead of flat `color="primary"` — check whether the page you're editing is in the NVOCC page-class whitelist (`.nvocc-form-page`, `.nvocc-flow-page`, `.nvocc-principal-page`, etc. — see `references/design-tokens.md`) before deciding which primary-button treatment applies.

## Utility classes

- `.btn-marg` — `margin-right:5px; margin-top:10px`, for spacing buttons in a row without gutter classes.
- `.small-heading` — not a button, but often paired with button rows as a compact section label (`font-size:14px`).

## What NOT to do

- Don't make buttons taller/larger than the `.m-btn-style*` scale "for better touch targets" — the existing sizes are already the app's accessibility baseline; if a specific mobile view needs bigger targets, scale via the existing `@media` breakpoints (`references/responsive.md`), not a one-off inline style.
- Don't add box-shadows, gradients, or rounded-pill shapes to buttons beyond what's documented here — CargoNet's buttons are flat/rectangular with the radius already baked into `.m-btn-style`/NVOCC's `8px` toolbar radius.
