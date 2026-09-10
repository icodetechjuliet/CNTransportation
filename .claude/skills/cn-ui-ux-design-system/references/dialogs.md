# Dialogs / popups / drawers

## Canonical structure (`ReferredDetailsDialog.vue`)

```html
<q-dialog v-model="show">
  <q-card style="min-width: 800px">
    <q-card-section class="row items-center">
      <div class="text-h6">Dialog Title</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <!-- body: form fields / table -->
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="q-gutter-sm q-pt-none q-pb-none q-pr-none">
      <q-btn label="Cancel" v-close-popup />
      <q-btn color="primary" class="m-btn-style" label="Save" />
    </q-card-actions>
  </q-card>
</q-dialog>
```
- **Header**: `q-card-section` with `text-h6` title + `q-space` + `flat round dense` close icon button. Always give the user a close button even if there's a footer Cancel.
- **Body**: one or more `q-card-section`s, separated by `q-separator` when there are distinct header/body/footer zones.
- **Footer**: `q-card-actions align="right"`, Cancel (plain) then primary action (`color="primary" class="m-btn-style"`), matching `references/buttons.md`.
- **Width**: set an explicit `min-width` (e.g. `800px`) on the `q-card`, don't leave it to shrink to content — but also don't make it wider than needed; check a similar existing dialog's width first.

## NVOCC dialog/drawer variants

On NVOCC-scoped pages, use these existing card wrapper classes rather than raw `q-card` — they already get shared border/radius/field treatment via `nvocc-common.css`'s `:is()` selectors:
- `.nvocc-dialog-card` — header/body/footer sub-elements can be named `.dialog-head`/`.card-head`/`.dialog-title` and `.form-actions`/`.dialog-actions` interchangeably; the CSS supports all these synonyms.
- `.dialog-card-sm`, `.dialog-card`, `.compare-card` — standard modal sizes.
- `.drawer-card` — side-drawer style (`width:720px; max-width:95vw; height:100%`) for a slide-in panel instead of a centered modal. Use this when the content is a long form better suited to a drawer than a centered dialog (matches how advanced filters/detail panels are already done on NVOCC pages).

## Inconsistency to be aware of, not to copy

`SplitChargesDialog.vue` doesn't follow the `q-card` dialog pattern — it's built as a full `q-page padding` with inline styles. Don't use it as your reference; treat `ReferredDetailsDialog.vue` (and the `.nvocc-dialog-card` classes) as canonical. If asked to fix `SplitChargesDialog.vue` itself, that's an explicit opportunity to bring it in line with this pattern — but don't do that unprompted.

## Responsive

Dialogs must not overflow the viewport — Quasar's default dialog behavior (scrollable body, capped height) already handles this; don't disable it. For drawer-style panels, `max-width:95vw` is already the safety net used in the codebase — keep it.
