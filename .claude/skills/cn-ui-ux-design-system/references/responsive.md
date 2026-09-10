# Responsive design

CargoNet does **not** have one unified breakpoint scale — each component/page picks its own cutoff. That said, actual usage across `nvocc-common.css`'s ~90 `@media` blocks and `Quasarstyle.scss` shows recurring de-facto conventions. Use these, don't invent new breakpoint values.

## Observed breakpoints (use these, in this priority order)

| Breakpoint | Frequency | Informal meaning |
|---|---|---|
| `700px` | 35 occurrences — dominant | mobile cutoff |
| `1200px` / `1300px` | 20 / 18 | tablet/laptop cutoff |
| `900px` / `800px` | 12 each | mid-range tablet |
| `1100px` | 8 | secondary laptop cutoff |
| `600px` | 14 | secondary mobile cutoff |
| `520px` / `480px` | 8 each | small phone |
| `1440px` (global, `Quasarstyle.scss:240`) | tab-scroll max-height 50vh, `.q-item-label`/`.q-field` font-size drops to 12px |

When adding responsive behavior to a new component, default to `700px` for the mobile cutoff and `1200px` (or `1300px` if the surrounding NVOCC page already uses that) for the tablet/laptop cutoff, matching the nearest existing component rather than picking a round number arbitrarily.

## Target resolutions

Design/verify against: 1920×1080, 1600×900, 1440×900, 1366×768, plus 125%/150% OS display scaling and short-height laptop screens. At 125–150% scaling, dense tables/forms are especially prone to vertical cramping — verify row/field heights (36-40px) still render without clipped text before shipping.

## Rules

- No horizontal overflow — wide tables/forms get `overflow-x:auto` on their container, not a shrink of column content.
- No cut-off dialogs — dialogs already cap height/scroll internally via Quasar defaults and `.drawer-card`'s `max-width:95vw` safety net; keep that pattern for any new dialog/drawer.
