# Icons

## Which icon set to use

**Material Icons** (Quasar's built-in default, `q-icon name="..."`) is the dominant icon system — used far more than anything else across pages (`search`, `event`, `receipt_long`, `description`, `inventory_2`, `info`, `directions_boat`, `restart_alt`, `local_shipping`, `warning`, `picture_as_pdf`, `place`, `add_circle`, etc.). **Default to Material Icons for any new icon.**

**Font Awesome 6** is also live (loaded via CDN in `app.scss` + Quasar's `fontawesome-v6` extra) and used in 100+ page files as `fa fa-*` / `fas fa-*` / `far fa-*` classes — acceptable to use where the surrounding component already uses FA classes, but don't mix FA and Material Icons within the same small component/toolbar.

**Do not use** `src/fonts/font-awesome-4.7.0` — confirmed dead/unreferenced local assets, not loaded anywhere. Ignore this folder entirely; it's legacy.

**Bootstrap Icons** extra is enabled but reserved specifically for the MainLayout2 sidebar menu (per `quasar.config.js` comment) — don't pull from it for general page content.

## Sizing / weight

Use Quasar's default icon sizing via the `size` prop or contextual `q-icon`/`q-btn` default (don't hardcode custom `font-size` on icons) — keep icon visual weight consistent with the Material Icons outline/filled style already dominant on that page. Don't mix filled and outlined Material Icon variants within the same table/toolbar.

## Logistics-domain icons

No dedicated logistics icon component exists — pages pick sensible Material Icons per shipment mode already:
- Sea Import/Export → `directions_boat`
- Road → `local_shipping`
- Container → `inventory_2`
- Documents → `description` / `picture_as_pdf`
- Warehouse → check nearest existing page for the icon already chosen (`warehouse` Material Icon if unused elsewhere)
- Finance/charges → `receipt_long`
- Quotation → check `QuoteReference.vue`/quote pages for the icon already in use before picking a new one

When adding an icon for a logistics concept not yet iconified anywhere, prefer the semantically closest Material Icon (Google's icon set is large and has direct matches for shipping/logistics concepts) over Font Awesome, to keep the dominant icon family consistent.
