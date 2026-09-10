# Fields

## Base convention (all text/select/number/date fields)

```html
square outlined dense bg-color="blue-1"
```
This quartet is the house style. Apply it to every new `q-input`, `q-select`, `q-input` used as autocomplete, number field, etc. Never ship a field missing one of these four unless the page you're editing consistently omits it (check 2-3 sibling fields first).

## Reuse these existing wrapper components — don't rebuild them

| Need | Use | Notes |
|---|---|---|
| Date picker | `src/components/DateInput.vue` (`SharedDateInput`) | Wraps `q-input` (`square dense outlined bg-color="blue-1" mask="##/##/####"`) + `event` icon → `q-popup-proxy` → `q-date`. Handles DD/MM/YYYY, `readonly`, mandatory/rule validation, backdate-permission checks. Props: `label`, `modelValue`, `readonly`, `isFieldMandatory`/`getFieldRules`, `enforceBackdate`, `backdatePermission`, `voucherTypeId`. |
| Simple dropdown | `src/components/BranchSelect.vue` | Thin `q-select` wrapper: `square outlined dense bg-color="blue-1" option-label="label" option-value="value"`. Props: `modelValue`, `options`, `label`. |
| Multi-select checklist (module/permission style pickers) | `src/components/ModuleMultiSelect.vue` | `q-card` > `q-expansion-item` (icon `layers`) > `q-item` rows with `q-checkbox`; model is an array. |
| Search-as-you-type against a backend list | `ChargeAutoComplete.vue`, `AccountAutoComplete.vue`, `ACVoucherSearchAutoComplete.vue` | Look at the closest existing `*AutoComplete.vue` for the entity type before writing a new one — several already exist per entity (Account, Charge, Voucher). |
| Currency/amount display | `src/components/CurrencyTotalAmount.vue` | |
| Decimal-constrained numeric input | `src/components/Inputwithdynamicdecimal.vue` | |
| Date-range filter field | `src/components/SearchDateInput.vue` | Distinct from `DateInput.vue` — this one is filter-bar-oriented, check its props before reinventing a filter date field. |

Before writing a brand-new field component, grep `src/components/` for the entity/pattern name — CargoNet already has ~15 field-adjacent wrapper components; duplicating one is the single most common consistency failure to avoid.

## States

- **Normal**: `bg-color="blue-1"` (`#e3f2fd`), `outlined` gives a light border, `square` corners handled by the NVOCC-scope global CSS (8px radius on NVOCC pages, default Quasar square field elsewhere).
- **Hover**: leave to Quasar's default outlined-field hover (border darkens slightly) — don't add a custom hover style.
- **Focus**: leave to Quasar's default `outlined` focus (border becomes `primary`/`positive` colored per Quasar's own theming) unless the page's theme layer (Aurora/ML2) already overrides `.q-field__control:after` — check `references/themes.md`.
- **Disabled**: use Quasar's native `disable` prop, not a custom class — it already renders readable-but-muted text with Quasar's built-in opacity treatment. If you need "read-only but visually near-identical to editable" (common in view-mode forms), reuse `.readonly-wrapper` (`pointer-events:none; opacity:0.7`) or the app's `ViewModeHideEmptyFieldsMixin.js` pattern rather than a bespoke solution.
- **Error**: use Quasar's native `error` + `error-message` props on the field, not a custom red border — this keeps the built-in accessible error text/aria wiring intact.
- **Success**: only apply if the page already has a meaningful validation-success state (rare in this app) — don't add green ticks decoratively.

## Checkboxes / radios / toggles

Use plain `q-checkbox` / `q-radio` / `q-toggle` with Quasar defaults (`dense` where the surrounding form is dense). No custom checkbox/radio skin exists in the app — don't add one.
