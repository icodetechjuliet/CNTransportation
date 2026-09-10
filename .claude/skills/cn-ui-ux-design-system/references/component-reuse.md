# Component reuse workflow + final UI review

## Step-by-step before creating anything new

1. **Search** `src/components/` and the nearest sibling pages in `src/pages/` for a component/pattern that already does this.
2. **Identify** the closest existing design (even if not a perfect match).
3. **Inspect** its CSS classes, Quasar props, dimensions, spacing, colors, and interaction states.
4. **Reuse** it — same classes/props/markup — rather than writing parallel CSS.
5. **Only create new** if there's a genuine UX gap with no existing fit. State explicitly why nothing existing worked.

## Inventory of existing reusable components (`src/components/`)

Check this list before writing a new component — CargoNet already has ~35 shared components covering most common needs:

- **Fields**: `DateInput.vue`, `BranchSelect.vue`, `BranchSelectMultiselect.vue`, `ModuleMultiSelect.vue`, `Inputwithdynamicdecimal.vue`, `SearchDateInput.vue`, `CurrencyTotalAmount.vue`, `FinancialYearSelect.vue`, `VoucherTypeSelect.vue`.
- **Autocomplete**: `AccountAutoComplete.vue`, `AccountAutoCompleteplaceholder.vue`, `AccountwithaddressAutoComplete.vue`, `ChargeAutoComplete.vue`, `ACVoucherSearchAutoComplete.vue`.
- **Filters**: `ApplyFiltersComponent.vue`, `DynamicFilter.vue`, `DashLogsApplyFiltersComponent.vue`, `QuoteApprovalFilter.vue`.
- **Dialogs**: `ReferredDetailsDialog.vue` (canonical structure — see `references/dialogs.md`), `SplitChargesDialog.vue` (non-canonical, avoid copying).
- **Tables/grids**: `AWBStockGrid.vue`, `MappedVouchersTable.vue`, `VoucherMapGridTable.vue`, `LedgerForReport.vue`.
- **Uploads/export**: `UploadExcelComponent.vue`.
- **Misc**: `UserComponent.vue`, `JobSettingPanel.vue`, `ContainerLocationPopup.vue`, `MobilePreview.vue`, `Ml2SwitcherPanel.vue`, `EssentialLink.vue`, `QuoteReference.vue`.
- **Mixins**: `src/mixins/ViewModeHideEmptyFieldsMixin.js` — reuse for view-mode/read-only form rendering instead of writing new conditional-display logic.

Files named `..._don'tuse.vue` (`AdvancePayablesTab_don'tuse.vue`, `AdvanceReceivablesTab_don'tuse.vue`, `PayablesTab_don'tuse.vue`, `ReceivablesTab_don'tuse.vue`) are explicitly deprecated — never use them as a reference pattern or import them into new work.

## Pre-completion UI review checklist

Run through this before considering any UI task done:

**Layout** — alignment, spacing, density, hierarchy consistent with surrounding page?

**Form** — label placement matches `references/forms.md`? Field height/spacing consistent? Focus/error states native Quasar, not custom?

**Buttons** — correct hierarchy (`references/buttons.md`)? Correct `.m-btn-style*` size? Icon buttons `flat round dense`?

**Table** — `.m-table-style` applied? Row height ~36-38px preserved? Numeric columns right-aligned? Action column compact icons?

**Theme** — if the page is Aurora/ml2-scoped, are colors using `--aurora-*`/`--ml2-*` vars instead of hardcoded hex (`references/themes.md`)?

**Responsive** — checked against the page's existing breakpoints (`references/responsive.md`), no horizontal overflow, no clipped content at 125-150% scaling?

**Code** — reused existing classes/components instead of duplicating CSS? No new component written when an existing one in the inventory above would do? Business logic (`methods`/`emits`/`computed`/`watch`/API calls) left untouched for a UI-only task? Options API preserved, not converted to Composition API?

**Layout preservation** — if the task was "improve the UI" (not "redesign"), did field/button/table placement stay exactly where it was?
