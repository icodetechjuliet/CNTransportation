---
name: dms-booking-page-pattern
description: Reference pattern for CargoNet's DMS Booking-family pages (list + Add/Edit/View full page or dialog + print/PDF) — built from DMSBooking.vue, DMSBBooking.vue, DMSTruckBooking.vue, and their full-page companions DMSBookingView.vue, DMSBBookingView.vue, DMSTruckBookingView.vue. Load this before creating a new page in this family (e.g. another "list grid + full-page Add/Edit/View tab + print" DMS module) or before touching any of these six files, so the new/edited page reuses the exact same structure, global classes, and known-fixed bugs instead of re-introducing them.
---

# DMS Booking-family page pattern

Six pages share one design: **DMSBooking.vue** (Booking), **DMSBBooking.vue**
(BBooking, view-only), **DMSTruckBooking.vue** (Truck Booking) — the three
list pages — plus each one's full-page Add/Edit/View companion,
**DMSBookingView.vue**, **DMSBBookingView.vue**, **DMSTruckBookingView.vue**,
opened as a dynamic tab from a row's action icons (see §5). Each is its own
route/file, fixed to one mode — there is no in-page mode switcher. When
building a new page in this family, copy the closest sibling's
markup/classes wholesale and only change field names/data.

This skill exists because every pattern below was arrived at by fixing a real,
shipped visual bug caused by deviating from it. Follow the "why" notes — they
are not style preference, they are regression prevention.

## 1. List page (grid) structure

```html
<q-page padding class="page hide-overflow">
  <div class="folder">
    <q-card class="notab-container-report">
      <!-- Header: title + total-count pill -->
      <div class="row items-center no-wrap q-px-sm">
        <span class="header_text1">Booking</span>
        <div class="total-stat-tile total-stat-tile--inline">
          <q-icon name="local_shipping" size="16px" />
          <div class="total-stat-text">
            <span class="total-stat-count">{{ filteredBookings.length }}</span>
            <span class="total-stat-label">Total Bookings</span>
          </div>
        </div>
      </div>
      <div class="q-py-xs q-px-xs">
        <q-separator class="h-seperator"></q-separator>
      </div>

      <q-table
        square
        :rows="filteredBookings"
        :columns="tableColumns"
        row-key="BookingId"
        :visible-columns="visibleColumns"
        :rows-per-page-options="[15, 25, 50, 100]"
        v-model:pagination="pagination"
        table-class="text-white-8 m-table-style"
        table-header-class="text-black"
        card-class="text-black"
        :grid="$q.screen.lt.sm"
      >
        <!-- v-slot:top, v-slot:pagination, body-cell-* slots, v-slot:item — see below -->
      </q-table>
    </q-card>
  </div>
</q-page>
```

### Filter bar (`v-slot:top`)

```html
<div class="tb-app col">
  <div class="filter-bar-wrapper accent-filter-bar">
    <div class="search-combo-wrapper">
      <input v-model="searchText" class="search-combo-input" placeholder="Search Any" @keyup.enter="loadBookings" />
      <q-btn v-if="searchText" flat dense round icon="close" size="xs" class="search-combo-clear-btn" @click="clearSearch">
        <q-tooltip>Clear</q-tooltip>
      </q-btn>
      <q-btn flat dense icon="search" class="search-combo-icon-btn" @click="loadBookings">
        <q-tooltip>Search</q-tooltip>
      </q-btn>
    </div>

    <!-- "Raise New ..." button — see §2, do NOT pass a `label` prop -->
    <q-btn v-if="canAddEdit" flat dense no-caps class="add_new_booking m_add_newjob bg-dblue-lblue" accesskey="n" @click="openAddBooking" />

    <q-select v-model="direction" :options="['All', 'Outward', 'Inward']" dense outlined bg-color="blue-1" style="width: 110px" class="q-mx-xs" @update:model-value="loadBookings" />

    <q-btn unelevated icon="refresh" class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue" @click="loadBookings">
      <q-tooltip>Refresh</q-tooltip>
    </q-btn>

    <q-space />

    <q-btn flat dense icon="tune" label="Columns" class="filter-btn bg-blue-300 bdr-blue-2 q-mx-sm">
      <q-menu anchor="bottom right" self="top right" :offset="[0, 8]" class="column-filter-menu">
        <div class="menu-header">Columns</div>
        <q-separator />
        <q-list class="column-list">
          <q-item v-for="col in columnOptions" :key="col.name" clickable v-ripple @click="toggleColumn(col.name)" class="column-item">
            <q-item-section avatar>
              <q-checkbox :model-value="isChecked(col.name)" @update:model-value="toggleColumn(col.name)" @click.stop />
            </q-item-section>
            <q-item-section>{{ col.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn flat :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue" />
  </div>
</div>
```

### Action column — `class="button-container"` is a known trade-off, not settled

```html
<template v-slot:body-cell-action="props">
  <q-td :props="props" class="button-container">
    <q-btn icon="fa-solid fa-eye" color="primary" dense outline class="edit-icon-style vw" @click="viewBooking(props.row)"><q-tooltip>View</q-tooltip></q-btn>
    <q-btn v-if="canAddEdit" icon="fa-solid fa-pen-to-square" color="primary" dense outline class="edit-icon-style mody" @click="editBooking(props.row)"><q-tooltip>Edit</q-tooltip></q-btn>
  </q-td>
</template>
```

**History, so this doesn't get "fixed" back and forth again:** `.button-container`
sets `display:flex`. Under this table's `table-layout:fixed`, a flexed `<td>`
*can* collapse to its content's minimum width instead of the column's
allotted width, clipping/skewing the icon buttons (this was reproduced via
devtools on DMSBBooking.vue: cell shrank to ~74×28px, cutting off the Edit
icon). Removing the class fixed that — but it was then explicitly put back on
DMSBooking.vue and DMSBBooking.vue on request (no reason given for the
reversal); DMSTruckBooking.vue was later brought to the same state (drop the
extra `booking-action-td` sizing hack it also carried, keep `button-container`).
**As of now all three pages' action `<q-td>` carry `class="button-container"`
alone** — i.e. the class IS present, contradicting what the class name/history
above would suggest you should do. Don't remove it again on your own
judgment just because you recognize this failure mode; it's gone back and
forth on explicit instruction already. If the collapse/clipping bug is
reported again, that's the known trade-off resurfacing, not a new mystery —
confirm with whoever's asking whether they want it fixed (remove the class)
or left as instructed (keep it) before touching it.

Also note: the `<q-table>`'s `dense` prop was removed on request from all
three list pages (DMSBooking.vue, DMSBBooking.vue, DMSTruckBooking.vue) — the
canonical snippet in §1 reflects this. All three are in sync as of now.

### Mobile card (`v-slot:item`) — reuse the global pattern, don't invent one

```html
<template v-slot:item="props">
  <div class="mobile-job-card">
    <div class="mjc-header" @click="toggleMobileCard(props.row.BookingId)">
      <div class="mjc-header-left">
        <div class="mjc-job-badge"><q-icon name="local_shipping" size="14px" /></div>
        <div class="mjc-header-info">
          <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
          <span class="mjc-job-date">{{ props.row.BookingDate }}</span>
        </div>
      </div>
      <div class="mjc-header-right">
        <q-badge class="mjc-status-badge" :color="props.row.Status === 'Delivered' ? 'positive' : 'orange'">{{ props.row.Status }}</q-badge>
        <q-icon :name="expandedMobileCards.includes(props.row.BookingId) ? 'expand_less' : 'expand_more'" size="20px" color="grey-6" />
      </div>
    </div>

    <div class="mjc-actions">
      <q-btn dense unelevated icon="fa-solid fa-eye" label="View" class="mjc-btn mjc-btn-view" @click="viewBooking(props.row)" />
      <q-btn v-if="canAddEdit" dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editBooking(props.row)" />
    </div>

    <transition name="mobile-expand">
      <div v-if="expandedMobileCards.includes(props.row.BookingId)" class="mjc-details">
        <q-separator class="mjc-divider" />
        <div class="mjc-details-grid">
          <div class="mjc-detail-row"><span class="mjc-detail-label">Delivery Type</span><span class="mjc-detail-value">{{ props.row.DeliveryType || "—" }}</span></div>
          <!-- ...more mjc-detail-row pairs... -->
        </div>
      </div>
    </transition>
  </div>
</template>
```

Backing state/method (add to `data()`/`methods`):
```js
expandedMobileCards: [],
```
```js
toggleMobileCard(id) {
  const index = this.expandedMobileCards.indexOf(id);
  if (index === -1) this.expandedMobileCards.push(id);
  else this.expandedMobileCards.splice(index, 1);
},
```

**Why:** `.mobile-job-card`/`.mjc-*` is already global in `cn-style.css`
(the same pattern JobDetailsGrid.vue's mobile view uses). An earlier version
of these pages invented their own `.dms-mobile-card`/`.dms-mc-*` classes in a
scoped `<style>` block — pure duplication with no visual benefit. Don't
recreate that; use the global classes directly.

## 2. The "Raise New ___" button — extend the class family, don't reuse `add_new_job` with a `label`

```html
<q-btn v-if="canAddEdit" flat dense no-caps class="add_new_booking m_add_newjob bg-dblue-lblue" accesskey="n" @click="openAddBooking" />
```

No `label` prop. The button text comes entirely from CSS
(`cn-style.css`), which has a family of button classes, each hard-wired to
its own wording via a `::after` pseudo-element:

| Class | Injected text |
|---|---|
| `add_new_job` | "Raise New Shipment (n)" |
| `add_new_Lead` | "Raise New Lead (n)" |
| `add_new_button` | "Raise New Voucher (n)" |
| `add_new_delivery` | "Raise New Delivery Order (n)" |
| `add_new_booking` | "Raise New Booking (n)" |

**Why this exists:** an earlier version of these pages reused `add_new_job`
(JobDetailsGrid.vue's class) **and** passed `label="Raise New Booking"`. Since
`add_new_job`'s CSS unconditionally injects "Raise New Shipment (n)" as a
`::after` on `.q-btn__content`, the real Quasar label text and the
CSS-injected text rendered on top of each other — a garbled overlapping
button label.

**If a future page needs new wording** ("Raise New Xxx"), add the new class
to **every** one of these shared selector groups in `cn-style.css` (all live
around line 12111 and 14686–14798 — search for `.add_new_delivery` to find
every group, since it's the last member listed in each one):

1. the outer wrapper reset — `display:inline-block; background:none!important; width:min-content` (this collapses the plain `q-btn` chrome so only `.q-btn__content` is visible)
2. **the actual gradient/shape rule on `.q-btn__content`** — `border-radius:8px; background:linear-gradient(0deg,#086fb8 70%,#00b8ff 100%); border:1px solid #00a2ff;` etc. — **this is the one that's easy to forget**; skipping it is exactly what happened the first time `.add_new_booking` was added, and the button rendered as a flat plain-blue box instead of JobDetailsGrid's rounded gradient chip
3. the `:hover` glass-sweep gradient + `animation: glassSweep …` on `.q-btn__content:hover`
4. the icon badge — `.q-btn__content::before` (white circle + Material Icons "add" glyph `\e145`)
5. the label — `.q-btn__content::after` (padding) + the page-specific `content: "Raise New Xxx (n)"` declaration
6. the hover underline — `:hover .q-btn__content::after { text-decoration: underline; }`

Then add the same one-off `.add_new_xxx .q-btn__content::after { content: "..."; }`
rule this class needs. Don't reuse an existing class with a `label` prop, and
don't write a one-off page-scoped style — extend the shared family instead.
There are also older, narrower-scope duplicates of groups 1–2 further down
the file (inside media queries, and a `.header-style`-scoped one around line
12109) for responsive breakpoints and other layout contexts — mirror the new
class into those too if the button needs to look right at those breakpoints;
they weren't all backfilled for `.add_new_booking` since the desktop look was
the immediate need.

## 3. Add/Edit/View dialog (fallback path — see §5 for the primary path)

```html
<q-dialog v-model="showBookingDialog" persistent maximized>
  <q-card style="display: flex; flex-direction: column; height: 100%">
    <q-toolbar style="background: linear-gradient(to right, #0178bc 0%, #00bdda 100%);" class="text-white">
      <q-toolbar-title class="text-body2">
        <span class="q-mr-md">Booking Type: <b>{{ form.BookingType }}</b></span>
        <span class="q-mr-md">Booked From: <b>{{ form.BookedFrom }}</b></span>
        <span>Carrier: <b>{{ form.Carrier }}</b></span>
        <span v-if="form.BookingNo" class="q-ml-lg text-weight-bold">{{ form.BookingNo }}</span>
      </q-toolbar-title>
      <q-space />
      <template v-if="dialogMode !== 'view'">
        <q-btn dense flat icon="save" label="Save" class="q-mr-xs" @click="saveBooking" />
        <q-btn dense flat icon="content_copy" label="Save &amp; Copy" class="q-mr-xs" @click="saveAndCopy" />
      </template>
      <q-btn dense flat icon="close" v-close-popup @click="closeDialog" />
    </q-toolbar>

    <q-card-section class="q-pa-sm col" style="overflow-y: auto">
      <!-- two-column row of q-card (flat bordered), each field: -->
      <span class="field-label">Booking Type</span>
      <q-select v-model="form.BookingType" :options="['Outward', 'Inward']" dense outlined bg-color="blue-1" :readonly="dialogMode === 'view'" />
    </q-card-section>

    <q-separator />
    <q-card-section class="q-pa-sm bg-grey-2">
      <!-- Save / Save & Copy / Save & Print / Save & Print with Freight / Cancel row -->
    </q-card-section>
  </q-card>
</q-dialog>
```

`.field-label` is a **global** class (`cn-style.css`) — a plain caption above
a field, distinct from Quasar's built-in floating label. It used to be
duplicated identically in a scoped `<style>` block in all three edit pages;
it's now defined once globally. Don't re-add it locally.

**`q-select` with `use-input`/`fill-input` MUST also set `display-value=""`.**
Without it, the field renders its value twice back-to-back (e.g. "ChakanChakan",
"Balaji xxx Co.Balaji xxx Co.") — the input's own filled-in text and Quasar's
default selected-option display both show. Every `use-input fill-input`
`q-select` across these pages (From/To/Delivery City, Consignor/Consignee
A/c.) was missing this and had to be fixed in bulk. GeneralDetailsComponent.vue
(a different page family) already gets this right — copy its exact prop
combo: `use-input fill-input display-value=""`.

### Checkboxes — always the `chckbx-style` card, never a bare `q-checkbox`

```html
<q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
  <q-item-section avatar>
    <q-checkbox dense v-model="form.IsDoorDelivery" val="orange" color="orange" intermediate-icon="black" :disable="dialogMode === 'view'" @update:model-value="calcTotal" />
  </q-item-section>
  <q-item-section>
    <q-item-label dense>Door Del.</q-item-label>
  </q-item-section>
</q-item>
```

- `chckbx-style` is global (`cn-style.css`) — a bordered light-blue chip,
  matching the checkbox convention used elsewhere in the app (e.g.
  GeneralDetailsComponent.vue's "Mate Receipt"/"EP Copy" checkboxes). A bare
  `<q-checkbox label="...">` renders as an unstyled native checkbox that
  looks out of place next to this convention.
- **Always add `full-width`.** Without it, the `q-item` shrinks to its
  content width instead of filling its grid column, leaving it visually
  narrower than the sibling field boxes in the same row.
- On a permanently-disabled view page (no `dialogMode`), just use a static
  `disable` prop instead of the `:disable="dialogMode === 'view'"` binding.

## 4. Full-page Add/Edit/View companion

Every list page has a matching full-page companion opened as its own dynamic
tab instead of the dialog:

- **`DMSBBookingView.vue`** — permanently read-only (BBooking has no edit
  capability at all: `canAddEdit` is always `false`). Every field is
  `readonly`/`disable`, there's no Save, and the header's Save button is
  `disable` unconditionally.
- **`DMSBookingView.vue`** / **`DMSTruckBookingView.vue`** — support all
  three modes. Fields are `:readonly="dialogMode === 'view'"` (matching the
  dialog's own binding exactly), Save is `:disable="dialogMode === 'view'"`,
  and the header dropdown additionally offers Save & Copy / Save & Print /
  Save & Print with Freight (only `v-if="dialogMode !== 'view'"`) alongside
  a Print item that's always shown. These two pages otherwise share the
  read-only page's exact header/tabs shape below — same fields, same
  `chckbx-style` checkboxes, same tab split — just with the readonly
  bindings and Save wiring turned on.

```html
<div class="row header-style items-center">
  <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
    <div class="header-title">
      <span class="header_text1">BBooking</span>
      <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
      <span class="header_text2">View</span>
    </div>
    <div class="header-field-group">
      <q-input square dense outlined bg-color="blue-1" readonly label="Booking No." v-model="form.BookingNo" />
    </div>
    <!-- more header-field-group / header-field-group-sm boxes -->
  </div>

  <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
    <div class="row q-col-gutter-x-sm justify-end items-center">
      <div class="row items-center no-wrap desktop-actions-group">
        <!-- Read-only page (DMSBBookingView.vue): Save is always disable.
             Editable page (DMSBookingView.vue / DMSTruckBookingView.vue):
             :disable="dialogMode === 'view'", @click="saveBooking", and the
             dropdown gains Save & Copy / Save & Print / Save & Print with
             Freight items (each v-if="dialogMode !== 'view'") above Print. -->
        <q-btn dense unelevated no-caps icon="task_alt" label="Save" disable class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-save-joined" />
        <q-btn-dropdown dense unelevated no-caps class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-more-joined" content-class="desktop-actions-dropdown">
          <q-list class="desktop-actions-list">
            <q-item clickable v-close-popup class="desktop-actions-item" @click="printBooking">
              <q-item-section avatar><div class="action-icon-badge bg-export"><q-icon name="print" color="white" /></div></q-item-section>
              <q-item-section><q-item-label>Print</q-item-label></q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
</div>

<q-card class="tabs-container">
  <q-tabs v-model="activeTab" dense class="text-teal custom-tabs" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
    <q-tab name="general" label="General Details [1]" accesskey="1" />
    <q-tab name="party" label="Party Details [2]" accesskey="2" />
    <q-tab name="charges" label="Charge Details [3]" accesskey="3" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="activeTab" animated keep-alive>
    <q-tab-panel name="general">
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <q-input square dense outlined bg-color="blue-1" readonly label="Booking Type" v-model="form.BookingType" />
        </div>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</q-card>
```

**Every item inside `.desktop-actions-list` must carry `class="desktop-actions-item"`.**
Without it, the item renders as a bare unstyled Quasar `q-item` — no rounded
hover background, no correct padding/label typography — even though its
container already carries the matching `desktop-actions-dropdown`/
`desktop-actions-list` wrapper classes. This is the same joined
Save-button-plus-dropdown pattern JobCNFormDynamicTab.vue uses for its own
header actions — copy it exactly.

Same `chckbx-style full-width` checkbox pattern applies here too — static
`disable` on the read-only page, `:disable="dialogMode === 'view'"` (plus any
original `@update:model-value` handler, e.g. `calcTotal`) on the editable
pages, exactly like the dialog's own checkboxes in §3.

## 5. Navigation — dialog vs. full page

`openAddBooking()` / `viewBooking(row)` / `editBooking(row)` on the list page
prefer the full-page companion and only fall back to the dialog when opened
outside the DynamicTab shell:

```js
// Component options:
inject: {
  openTab: { default: null },
},
```
```js
openAddBooking() {
  if (this.openTab) {
    this.openTab("/DMSBookingView?mode=add", "New Booking");
    return;
  }
  this.form = this.emptyForm();
  this.dialogMode = "add";
  this.showBookingDialog = true;
},

viewBooking(row) {
  if (this.openTab) {
    this.openTab(
      `/DMSBookingView?mode=view&bookingId=${row.BookingId}`,
      `Booking ${row.BookingNo || ""}`.trim()
    );
    return;
  }
  this.viewBookingInDialog(row); // old dialog body, renamed
},
// editBooking(row) is the same shape as viewBooking, mode=edit.
```

`DynamicTab.vue`'s `openTab(pathWithQuery, tablabel)` parses the query string
into a `params` object and passes it to the opened component as
`:params="tab.params"` — so the companion page reads its mode/id from
`this.params.mode` / `this.params.bookingId` (always strings; `Number(...)`
the id). `DMSBBookingView.vue` only ever needs `bookingId` since it's
permanently `view` mode; the two editable companions branch on `params.mode`.

**Wiring a new companion page requires all of these, not just the file itself:**
1. `export { apiGetBookingById, apiSaveBooking, MOCK_DATA };` from the list
   page (module-level, alongside the existing mock functions) — the
   companion imports them with `import { apiGetBookingById, apiSaveBooking, MOCK_DATA } from "./DMSBooking.vue";`.
2. Register the route in `routes.js` next to the list page's own route:
   `{ path: "DMSBookingView", component: () => import("pages/DMSBookingView.vue") }`.
3. `calcTotal()` / `calcFreight()` / `emptyForm()` / `buildReceiptHtml()` /
   `getLogoDataUrl()` / `downloadPDF()` / `closePrintDialog()` are
   **duplicated** into the companion page's own `methods`, not imported —
   same "copy, don't parametrize" rule as everywhere else in this family (see
   §7). Only the two mock-data functions and `MOCK_DATA` are actually shared
   via `export`/`import`, since those model the same backing data the list
   page's own grid reads.

## 6. Print / PDF receipt

Each edit dialog builds its own printable HTML as a JS template literal
(`buildReceiptHtml(includeFreight, logoDataUrl)`), turns it into a
`Blob`/object URL, and shows it in an `<iframe>` inside a maximized
"Print / PDF Preview Dialog". `downloadPDF()` just calls
`this.$refs.reportFrame.contentWindow.print()` — **no `html2pdf.js` needed**;
don't import it unless something actually calls it.

The receipt's own `<style>` (inside the template literal, isolated from the
app's CSS) should include print-page sizing so multi-record printing/PDF
doesn't split bands mid-page or use inconsistent margins across browsers:
```css
@page { size: A4; margin: 10mm; }
@media print {
  body { padding: 0; margin: 0; }
  .top-band, .party-band, .body-band, .eway-band, .sig-band, .footer-band { page-break-inside: avoid; }
}
```

## 7. Data layer conventions

- Each page is fixed to one mode — don't add an `activeMode`/`mode` data
  property with `=== 'truck'`/`=== 'bbooking'` ternary branches "for future
  reuse". Every one of those branches was dead code once the three modes
  became three separate files, and got removed. If a genuinely new
  page-family member is needed, copy the file; don't parametrize an existing
  one.
- `apiGetBookings(fromDate, toDate, direction, search[, carrierFilter])` /
  `apiGetBookingById` / `apiSaveBooking` are local mock functions per page
  (`MOCK_LOGIN_MODE` style) — replace with real `axios` calls the same way
  JobDetailsGrid.vue does. On DMSBooking.vue/DMSBBooking.vue the
  `carrierFilter` param was dead (always resolved to `"all"`) and was
  removed; on DMSTruckBooking.vue it's genuinely load-bearing — that page's
  `apiGetBookings` always passes the literal `"truck"` and the function
  filters `LoadCarrier === "Truck" || Carrier === "Truck"` — don't remove it
  there or the grid stops filtering.
- `canAddEdit` computed gates the Add/Edit affordances (button, Edit action
  icon, Tax Type toggle) — `true` for Booking/Truck Booking, `false` for the
  read-only BBooking family.
- Truck Booking's Carrier is fixed to `"Truck"` everywhere — the field is
  plain `readonly` (not `:readonly="dialogMode === 'view'"`) and
  `dialogCarrierOptions`/`emptyForm().Carrier` are hardcoded to `"Truck"` /
  `["Truck"]`, not conditional. There's nothing to choose.

## 8. One CSS trap specific to this app's sidebar (not this page family, but easy to hit while touching `cn-style.css`)

`MainLayout1.vue`'s `setTheme()`/`changeColor()` methods inject a **second**
runtime `<style id="cn-theme-override">`/`<style id="cn-expansion-style">`
tag into `<head>` with `!important` rules that **duplicate selectors already
in `cn-style.css`**. If you scope/exclude a selector in the static
stylesheet (e.g. `:not(.some-class)`), and the same selector also exists in
that injected JS string, the injected copy will silently override your fix
whenever a saved theme is active — because it's appended later and uses
`!important`. Any such fix must be mirrored in both places.
