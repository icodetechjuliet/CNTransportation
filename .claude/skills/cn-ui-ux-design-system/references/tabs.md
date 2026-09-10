# Tabs

## Reference implementation

`src/pages/JobCNFormDynamicTab.vue` is the app's primary example of a dynamic, data-driven tab set (job form sections as tabs) — check it first for the current tab markup/props before adding new tabs elsewhere, since it's the most actively maintained tab pattern in the app.

## Standard markup

```html
<q-tabs v-model="activeTab" dense align="left" class="text-primary" active-color="primary" indicator-color="primary">
  <q-tab name="general" label="General" />
  <q-tab name="party" label="Party Details" />
  <q-tab name="routing" label="Routing" />
</q-tabs>
<q-separator />
<q-tab-panels v-model="activeTab" animated>
  <q-tab-panel name="general"> ... </q-tab-panel>
  <q-tab-panel name="party"> ... </q-tab-panel>
</q-tab-panels>
```
- `dense` — keep tabs compact, matching the app's overall density.
- Tab names should map 1:1 to the form sections defined in `references/forms.md` (General Information, Party Details, Routing Details, Shipment/Commodity Details, Charges) when the tabbed content is a large multi-section form — this mirrors how the app already breaks the same long forms into sections/tabs elsewhere.
- `q-separator` between the tab strip and the panel content is standard (same convention as dialogs — see `references/dialogs.md`).

## What NOT to do

- Don't add a tab for something that could be a single scrollable section — tabs are for genuinely distinct groupings, not to hide length.
- Don't use vertical/side tabs unless the page already has a drawer-style layout that calls for it — horizontal top tabs are the default across the app.
- Don't change `active-color`/`indicator-color` away from `primary` (or the page's established accent) without a reason — tab active-state color should match the button/link accent used elsewhere on that page.
