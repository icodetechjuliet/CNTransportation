# Forms

## Grid

Standard Quasar 12-col responsive grid, nested per field:

```html
<div class="row q-col-gutter-sm">
  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
    <!-- one field -->
  </div>
  <!-- 3-4 fields per row at md/lg -->
</div>
```
Reuse `q-col-gutter-sm` (not `-md`/`-lg` — the app is intentionally compact/information-dense). Field column widths are typically `col-md-3`/`col-lg-3` (4 per row) or `col-md-4` (3 per row) depending on field content length — match whatever the surrounding rows on that page already use, don't mix widths within one form arbitrarily.

## Field convention (apply to every new field)

```html
<q-input square outlined dense bg-color="blue-1" v-model="localForm.FieldName" label="Field Label" />
```
- `square outlined dense bg-color="blue-1"` is the house convention — present on nearly every field in the app. Always include all four.
- Label is the Quasar `label` prop (floating label inside the field), **not** a separate `<label>` element beside or above the field. Don't switch to label-beside-field layout unless the specific page already does it that way.
- For autocomplete/search-as-you-type fields, also add `use-input fill-input display-value=""` plus `:options=`.

## Sections

Group related fields under a section heading, matching how the page being edited already names its section-title class (e.g. `.charge-card__section-title`, `.ie-card__section-title` — BEM-style `<component>__section-title`, `font-weight:700; font-size:13px; text-transform:uppercase; letter-spacing:0.03em; color:#475569`). If the page has no section-title class yet and you're adding one, follow this same BEM pattern scoped to that component rather than inventing a new global class name — CargoNet does not use one shared global section-title class across the whole app, each major form defines its own scoped variant with these same typographic values.

Typical section groupings seen in the app (reuse this order/naming where it fits the domain): General Information → Party Details → Routing Details → Shipment/Commodity Details → Charges. Don't add decorative dividers/icons to section headers beyond what the page already has.

## What NOT to do

- Don't enlarge field height/padding beyond the `dense` Quasar default — the whole app is deliberately compact (NVOCC pages standardize on 40px field height via CSS, everywhere else `dense` alone is the convention).
- Don't remove `square` (the app does not use rounded/pill-shaped input fields).
- Don't switch `bg-color="blue-1"` to a plain white/transparent field unless the surrounding form is already white-background style — check the nearest sibling field first.
- Don't reflow a multi-column form to single-column "for better mobile support" unless asked — responsive collapse is handled by the existing `col-xs-12` breakpoints already in the grid.
