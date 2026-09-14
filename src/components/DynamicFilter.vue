<template><div>
    <!-- ═══════════════════════════════════════════════════
         FILTER BAR
    ═══════════════════════════════════════════════════ -->
    <div class="filter-bar-wrapper">
      <!-- ── SEARCH BY + GLOBAL SEARCH (combined) ── -->
      <div class="search-combo-wrapper">
        <q-select bg-color="blue-1"
          v-model="localSearchBy"
          :options="searchByOptions"
          dense
          outlined
          emit-value
          map-options
          class="search-by-select"
          :dropdown-icon="'arrow_drop_down'"
          behavior="menu"
        />
        <div class="search-combo-divider" />
        <q-input bg-color="blue-1"
          class="global-search"
          dense
          outlined
          v-model="localSearchInputValue"
          :placeholder="searchPlaceholder"
          clearable
          @clear="onSearchClear"
        />
      </div>

      <!-- Origin / Destination Pill -->
      <div
        class="filter-pill route-pill"
        :class="{ 'pill-active': origin || destination }"
      >
        <q-btn-dropdown flat no-caps dense icon="route" :label="routeLabel">
          <div class="dropdown-inner route-dropdown-inner">
            <div class="dp-section-label">Origin &amp; Destination</div>

            <div class="route-row">
              <div class="route-field">
                <q-select
                  v-model="origin"
                  dense
                  outlined
                  clearable
                  use-input
                  fill-input
                  hide-selected
                  input-debounce="0"
                  bg-color="blue-1"
                  label="Origin"
                  :options="opfilterPlaceofReceipt"
                  option-label="label"
                  option-value="value"
                  @filter="filterPlaceOfFn"
                  class="route-select"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.code }}</q-item-label>
                        <q-item-label caption>{{
                          scope.opt.label
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="route-arrow">
                <q-icon name="arrow_forward" size="16px" color="grey-5" />
              </div>

              <div class="route-field">
                <q-select
                  v-model="destination"
                  dense
                  outlined
                  use-input
                  fill-input
                  hide-selected
                  clearable
                  input-debounce="0"
                  bg-color="blue-1"
                  label="Destination"
                  :options="opfilterPlaceofReceipt"
                  option-label="label"
                  option-value="value"
                  @filter="filterPlaceOfFn"
                  class="route-select"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.code }}</q-item-label>
                        <q-item-label caption>{{
                          scope.opt.label
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>

            <div class="dp-footer dp-footer-spaced">
              <q-btn
                flat
                dense
                no-caps
                class="m-btn-style-sm bg-grey-white bdr-grey text-black"
                label="Clear"
                @click="
                  origin = null;
                  destination = null;
                "
              />
            </div>
          </div>
        </q-btn-dropdown>
      </div>

      <!-- Date Range Pill -->
      <div
        class="filter-pill date-pill"
        :class="{
          'pill-active': fromDate || toDate,
        }"
      >
        <q-btn-dropdown
          flat
          no-caps
          dense
          icon="calendar_today"
          :label="dateRangeLabel"
        >
          <div class="dropdown-inner date-dropdown-inner">
            <div class="dp-section-label">Date Range</div>
            <div class="date-range-row">
              <div class="date-field">
                <DateInput v-model="fromDate" label="From Date" dense />
              </div>
              <div class="date-range-divider">
                <q-icon name="arrow_forward" size="16px" color="grey-5" />
              </div>
              <div class="date-field">
                <DateInput v-model="toDate" label="To Date" dense />
              </div>
            </div>
            <div class="dp-footer dp-footer-spaced">
              <q-btn
                flat
                dense
                no-caps
                class="m-btn-style-sm bg-grey-white bdr-grey text-black"
                label="Clear"
                @click="
                  fromDate = '';
                  toDate = '';
                "
              />
            </div>
          </div>
        </q-btn-dropdown>
      </div>

      <!-- ── BRANCH SELECT (now inside filter bar) ── -->
      <div class="branch-select-wrapper">
        <BranchSelect
          v-model="localSelectedBranches"
          label="Branches"
          :userid="userid"
          dense
          @selected-branches="getSelectedBranches"
        />
      </div>

      <!-- Apply Button -->
      <div class="apply-filter-btn">
        <q-btn
          unelevated
          no-caps
          dense
          icon="check"
          label="Apply Filters"
          class="m-btn-style bg-dblue-lblue text-white"
          @click="applyFilters"
        />
      </div>
    </div>

    <!-- ── ACTIVE FILTER CHIPS ROW ── -->
    <div v-if="activeFilterChips.length > 0" class="chips-row">
      <span class="chips-label">Active Filters:</span>

      <q-chip
        v-for="chip in activeFilterChips"
        :key="chip.key"
        class="filter-chip"
        removable
        dense
        :label="chip.label"
        @remove="removeChip(chip.key)"
      />

      <q-btn
        flat
        no-caps
        dense
        label="Clear All"
        icon="close"
        size="sm"
        class="clear-all-btn"
        @click="clearAllFilters"
      />
    </div>
  </div></template>

<script>
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import { LoaderMixin } from "src/mixins/Loadermixin.js";
import { LoadPortMixin } from "/src/mixins/LoadPortMixin.js";
import DateInput from "/src/components/DateInput.vue";
import BranchSelect from "/src/components/BranchSelectMultiselect.vue";

export default {
  name: "DynamicFilter",

  components: { DateInput, BranchSelect },
  mixins: [LoaderMixin, LoadPortMixin],

  props: {
    /** Pass the user id so BranchSelect can load correct branches */
    userid: {
      type: [String, Number],
      default: null,
    },
    /** Document Type ID passed from the parent page */
    documentTypeId: {
      type: [String, Number],
      default: 0,
    },
    voucherTypeId: {
      type: [String, Number],
      default: 0,
    },
    /** Document type (e.g. "QuotationApproval") */
    type: {
      type: String,
      default: null,
    },
    /** Initial branch selection (array of branch IDs) */
    modelSelectedBranches: {
      type: Array,
      default: () => [],
    },
  },

  emits: [
    /** Emitted whenever "Apply Filters" is clicked.
     *  Payload: { committedSearchChips, filterInputs, selectedBranches }
     */
    "apply",
    /** Emitted immediately when branch selection changes, so the parent
     *  can trigger a fresh API load if needed.
     */
    "branch-change",
  ],

  data() {
    return {
      // ── Search By ──────────────────────────────────────────────
      localSearchBy: null,
      localSearchInputValue: "",
      committedSearchChips: [],
      searchByOptions: [],
      activeFilterChips: [],

      origin: null,
      destination: null,
      opfilterPlaceofReceipt: [],
      // ── Branches ───────────────────────────────────────────────
      localSelectedBranches: [],
      selectedBranches: [],
      branchFilterQuery: "",
      // ── Date ───────────────────────────────────────────────
      date: { fromDate: null, toDate: null },
      fromDate: "",
      toDate: "",
    };
  },

  async created() {
    this.localSelectedBranches = [...(this.modelSelectedBranches || [])];
    this.getDynamicFilterOptions();
    //this.LoadAllPort();
    await this.LoadPorts(this.documentTypeId); // ← add this
    this.opfilterOrigin = (this.filterPort || []).slice(0, 10);
    this.opfilterDestination = (this.filterPort || []).slice(0, 10);
    this.filterPlaceOf = this.filterPort;
  },
  // mounted() {
  //   this.LoadAllPort();
  //   this.getDynamicFilterOptions();
  //   this.opfilterOrigin = (this.filterPort || []).slice(0, 10);
  //   this.opfilterDestination = (this.filterPort || []).slice(0, 10);
  //   //this.filterPlaceOf = this.filterPort;
  // },
  watch: {
    // Keep local branches in sync if parent changes the prop
    modelSelectedBranches(val) {
      this.localSelectedBranches = [...(val || [])];
    },

    // Emit branch changes upward so parent can reload grid if desired
    localSelectedBranches(val) {
      this.$emit("branch-change", val);
      if (this.selectedBranches.length > 0) {
        this.branchFilterQuery = this.selectedBranches
          .map((b) => b.value)
          .join(",");
      } else {
        this.branchFilterQuery = "";
      }
    },
  },

  computed: {
    searchPlaceholder() {
      const opt = this.searchByOptions.find(
        (o) => o.value === this.localSearchBy
      );
      return opt ? `Search by ${opt.label}...` : "Search...";
    },

    dateRangeLabel() {
      const fmt = (d) => (d ? d.split("-").reverse().join("/") : null);
      const f = fmt(this.fromDate);
      const t = fmt(this.toDate);
      if (f && t) return `${f} – ${t}`;
      if (f) return `From ${f}`;
      if (t) return `To ${t}`;
      return "Date Range";
    },

    routeLabel() {
      const o = this.origin?.label;
      const d = this.destination?.label;
      if (o && d) return `${o} → ${d}`;
      if (o) return `From: ${o}`;
      if (d) return `To: ${d}`;
      return "Origin / Destination";
    },
  },

  methods: {
    async getDynamicFilterOptions() {
      try {
        const res = await axios.get(
          `${CargoNet_API}/industrydata/dynamicfilterfields/${this.documentTypeId}/${this.voucherTypeId}`,
          { params: { type: this.type } }
        );
        this.searchByOptions = res.data.map((item) => ({
          label: item.DisplayName,
          value: item.Name,
        }));
        this.localSearchBy = this.searchByOptions[0]?.value ?? null;
      } catch (err) {
        console.error(err);
      }
    },

    // ── Search chip ───────────────────────────────────────────────
    applySearchChip() {
      const val = (this.localSearchInputValue || "").trim();
      if (!val) return false;
      const fieldOpt = this.searchByOptions.find(
        (o) => o.value === this.localSearchBy
      );
      const fieldLabel = fieldOpt ? fieldOpt.label : "All Fields";
      const chipLabel = `${fieldLabel}: ${val}`;
      const duplicate = this.committedSearchChips.find(
        (c) =>
          c.field === this.localSearchBy &&
          c.value.toLowerCase() === val.toLowerCase()
      );
      if (duplicate) {
        this.$q.notify({
          message: `"${chipLabel}" is already an active filter.`,
          color: "orange-8",
          icon: "warning",
          position: "top",
          timeout: 2500,
        });
        return false;
      }
      const chipKey = `search_${this.localSearchBy}_${Date.now()}`;
      this.committedSearchChips.push({
        key: chipKey,
        field: this.localSearchBy,
        label: chipLabel,
        value: val,
      });
      this.localSearchInputValue = "";
      return true;
    },

    onSearchClear() {
      this.localSearchInputValue = "";
    },

    // ── Date range validation ─────────────────────────────────────
    // Alert only when BOTH dates are selected and From Date is after
    // To Date. If either one is empty, no alert is shown.
    // DateInput emits values as "DD/MM/YYYY", so parse to a comparable
    // timestamp before comparing.
    toTimestamp(val) {
      if (!val) return null;
      const m = String(val).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return null;
      const [, d, mo, y] = m;
      return new Date(Number(y), Number(mo) - 1, Number(d)).getTime();
    },
    // Returns false (and shows an alert) only when BOTH dates are
    // selected and From Date is after To Date. Returns true otherwise.
    validateDateRange() {
      if (!this.fromDate || !this.toDate) return true;
      const from = this.toTimestamp(this.fromDate);
      const to = this.toTimestamp(this.toDate);
      if (from === null || to === null) return true;
      if (from > to) {
        this.$q.notify({
          message: "From Date cannot be greater than To Date.",
          color: "orange-8",
          icon: "warning",
          position: "top",
          timeout: 2500,
        });
        return false;
      }
      return true;
    },

    // ── Chip removal ──────────────────────────────────────────────
    removeChip(key) {
      if (key.startsWith("branch_")) {
        const index = Number(key.split("_")[1]);
        this.localSelectedBranches.splice(index, 1);
        this.selectedBranches = this.selectedBranches.filter((item) =>
          this.localSelectedBranches.includes(item.value)
        );
        if (this.selectedBranches.length > 0) {
          this.branchFilterQuery = this.selectedBranches
            .map((b) => b.value)
            .join(",");
        } else {
          this.branchFilterQuery = "";
        }
        this.buildActiveFilterChips();
        this.emitApply();
        return;
      }
      if (key.startsWith("dateRange_")) {
        this.fromDate = "";
        this.toDate = "";
        this.committedSearchChips = this.committedSearchChips.filter(
          (c) => c.key !== key
        );
        this.dateFilterQuery = "";
        this.buildActiveFilterChips();
        this.emitApply();
        return;
      }
      if (key.startsWith("search_")) {
        this.committedSearchChips = this.committedSearchChips.filter(
          (c) => c.key !== key
        );

        this.buildActiveFilterChips();
        this.emitApply();
        return;
      }

      if (key === "origin_") {
        this.origin = null;
        this.buildActiveFilterChips();
        this.emitApply();
        return;
      }
      if (key === "destination_") {
        this.destination = null;
        this.buildActiveFilterChips();
        this.emitApply();
        return;
      }

      this.buildActiveFilterChips();
      this.emitApply();
    },

    // ── Clear all ─────────────────────────────────────────────────
    clearAllFilters() {
      this.committedSearchChips = [];
      this.localSearchInputValue = "";
      this.localSelectedBranches = [];
      this.selectedBranches = [];
      this.dateFilterQuery = "";
      this.fromDate = "";
      this.toDate = "";
      this.origin = null;
      this.destination = null;
      this.activeFilterChips = [];
      this.branchFilterQuery = "";
      this.emitApply();
    },

    // ── Build Active Filter Chips ─────────────────────────────────
    buildActiveFilterChips() {
      const chips = [];

      this.committedSearchChips.forEach((c) =>
        chips.push({ key: c.key, label: c.label })
      );

      this.selectedBranches.forEach((branch, index) => {
        chips.push({
          key: `branch_${index}`,
          label: `Branch: ${branch.label}`,
        });
      });

      if (this.fromDate && this.toDate) {
        chips.push({
          key: "dateRange_",
          label: `From: ${this.fromDate} To: ${this.toDate}`,
        });
      } else if (this.fromDate) {
        chips.push({ key: "dateRange_", label: `From: ${this.fromDate}` });
      } else if (this.toDate) {
        chips.push({ key: "dateRange_", label: `To: ${this.toDate}` });
      }

      if (this.origin) {
        // Look up label from the port list since origin is now just an ID
        const originPort = (this.filterPort || []).find(
          (p) => p.value === this.origin
        );
        chips.push({
          key: "origin_",
          label: `Origin: ${this.origin.label}`,
        });
      }
      if (this.destination) {
        const destPort = (this.filterPort || []).find(
          (p) => p.value === this.destination
        );
        chips.push({
          key: "destination_",
          label: `Destination: ${this.destination.label}`,
        });
      }

      this.activeFilterChips = chips;
    },

    // ── Apply ─────────────────────────────────────────────────────
    applyFilters() {
      // Block applying when the selected date range is invalid
      if (!this.validateDateRange()) return;
      //const val = (this.localSearchInputValue || "").trim();
      //if (val) this.applySearchChip();

      this.applySearchChip();
      this.buildActiveFilterChips();
      this.emitApply();
    },

    emitApply() {
      //Fields filters
      var searchFilter = this.committedSearchChips
        .map((item) => `${item.field}:${item.value}`)
        .join(",");

      // if (this.origin) {
      //   searchFilter += `${searchFilter ? "," : ""}Origin:${
      //     this.origin.label.split("[")[0]
      //   }`;
      // }
      // if (this.destination) {
      //   searchFilter += `${searchFilter ? "," : ""}Destination:${
      //     this.destination.label.split("[")[0]
      //   }`;
      // }

      this.date = { fromDate: this.fromDate, toDate: this.toDate };

      this.$emit("apply", {
        searchFilter,
        date: this.date,
        branchFilterQuery: this.branchFilterQuery,
        Origin: this.origin,
        Destination: this.destination,
      });
    },
    getSelectedBranches(branches) {
      this.selectedBranches = branches;
    },

    async getPortList() {
      try {
        const res = await axios.get(`${CargoNet_API}/industrydata/portlist`);
        this.portList = res.data.map((item) => ({
          value: item.Id,
          label: item.Name,
        }));
        this.opfilterOrigin = this.portList.slice(0, 20);
        this.opfilterDestination = this.portList.slice(0, 20);
      } catch (err) {
        console.error("Failed to load port list", err);
      }
    },
    // In DynamicFilter.vue methods — replace filterPortFn with these two:
  },
};
</script>

<style scoped>
/* ─── FILTER BAR WRAPPER ─────────────────────────────────── */
.filter-bar-wrapper {
  background: #e1f5ff;
  border: 1px solid #9edfff;
  border-radius: 10px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

/* ─── SEARCH COMBO ───────────────────────────────────────── */
.search-combo-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 320px;
  height: 40px;
  border: 1px solid #9edfff;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
}
.search-by-select {
  min-width: 130px;
  max-width: 150px;
  flex-shrink: 0;
}
:deep(.search-by-select .q-field__control) {
  height: 40px !important;
  min-height: 40px !important;
  border: none !important;
  border-radius: 0 !important;
  background: #ffffff !important;
  box-shadow: none !important;
  padding: 0 6px 0 12px !important;
}
:deep(.search-by-select .q-field__control::before),
:deep(.search-by-select .q-field__control::after) {
  display: none !important;
}
:deep(.search-by-select .q-field__native) {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #1565c0 !important;
  padding: 0 !important;
  min-height: unset !important;
  height: auto;
}
:deep(.search-by-select .q-field__append) {
  padding: 0 4px 0 0 !important;
  margin: 0;
  height: 40px;
}
:deep(.search-by-select .q-field__append .q-icon) {
  font-size: 16px !important;
  color: #1565c0 !important;
}
.search-combo-divider {
  width: 1px;
  background: #b3d9f7;
  flex-shrink: 0;
}
.global-search {
  flex: 1;
}
:deep(.global-search .q-field__control) {
  height: 40px !important;
  min-height: 40px !important;
  border: none !important;
  border-radius: 0 !important;
  background: #ffffff !important;
  box-shadow: none !important;
  padding: 0 4px 0 10px !important;
  border-left: 1px solid #d3f1ff !important;
}
:deep(.global-search .q-field__control::before),
:deep(.global-search .q-field__control::after) {
  display: none !important;
}
:deep(.global-search .q-field__native) {
  font-size: 13px;
  color: #1e293b;
  padding: 0 !important;
  min-height: unset !important;
}
:deep(.global-search .q-field__label) {
  display: none !important;
}
:deep(.global-search .q-field__append) {
  padding-right: 4px !important;
  height: 40px;
  margin: 0;
}

/* ─── BRANCH SELECT INSIDE FILTER BAR ───────────────────── */
.branch-select-wrapper {
  min-width: 180px;
  max-width: 260px;
  flex-shrink: 0;
}
/* Constrain BranchSelect height to match the bar */
.branch-select-wrapper :deep(.q-field__control) {
  height: 40px !important;
  min-height: 40px !important;
  border-radius: 8px !important;
  border: 1px solid #9edfff !important;
  background: #f8fafc !important;
  box-shadow: none !important;
}
.branch-select-wrapper :deep(.q-field__control::before),
.branch-select-wrapper :deep(.q-field__control::after) {
  display: none !important;
}
.branch-select-wrapper :deep(.q-field__native) {
  font-size: 12px !important;
  min-height: unset !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.branch-select-wrapper :deep(.q-field__label) {
  font-size: 12px !important;
  top: 10px !important;
  color: #64748b !important;
}
.branch-select-wrapper :deep(.q-field--float .q-field__label) {
  transform: translateY(-70%) scale(0.75) !important;
  top: 10px !important;
}

.branch-select-wrapper :deep(.q-card.branch-filter-card) {
  border-radius: 16px 16px 0 0;
  background: transparent;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
  margin-top: 0;
  border: 0;
}

/* CARD HEADER */
.branch-select-wrapper
  :deep(.branch-filter-card-header .q-expansion-item__container .q-item) {
  font-weight: 700;
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  color: #1f2937;
  border: var(--bdr-blue-2) !important;
  background: #fff !important;
  border-radius: 8px;
  padding: 8px 12px;
  min-height: 36px;
}

.branch-select-wrapper
  :deep(
    .branch-filter-card-header
      .q-expansion-item__container
      .q-item
      .q-item__section--side
      i.q-icon
  ) {
  font-size: 15px;
  color: #1565c0;
}

.branch-select-wrapper
  :deep(
    .branch-filter-card-header .q-expansion-item__container .q-item.branch-item
  ) {
  padding: 3px 12px;
  min-height: 25px;
}
.branch-select-wrapper
  :deep(
    .branch-filter-card-header
      .q-expansion-item__container
      .q-item.branch-item
      .q-checkbox__inner
  ) {
  font-size: 32px;
}

/* ─── FILTER PILLS ───────────────────────────────────────── */
.filter-pill :deep(.q-btn-dropdown) {
  height: 36px !important;
  border-radius: 8px !important;
  border: 1px solid #9edfff !important;
  background: #fff !important;
  color: #334155 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 0 12px !important;
  box-shadow: none !important;
  text-transform: none !important;
  letter-spacing: 0.6px !important;
  transition: border-color 0.15s, background 0.15s !important;
}
.filter-pill :deep(.q-btn-dropdown .q-btn__content) {
  gap: 6px;
}
.filter-pill :deep(.q-btn-dropdown .q-btn__content i) {
  font-size: 16px !important;
  color: #1565c0 !important;
}
.filter-pill :deep(.q-btn-dropdown__arrow) {
  font-size: 14px !important;
  margin-left: 4px !important;
  opacity: 0.7;
}

/* ─── DATE PILL ──────────────────────────────────────────── */
.date-pill :deep(.q-btn-dropdown) {
  height: 36px !important;
  border-radius: 8px !important;
  border: 1px solid #9edfff !important;
  background: #fff !important;
  color: #334155 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 0 12px !important;
  box-shadow: none !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  transition: border-color 0.15s, background 0.15s !important;
}

/* ─── DROPDOWN INNER ─────────────────────────────────────── */
.dropdown-inner {
  padding: 12px;
  min-width: 230px;
  background: #fff;
}
.dp-section-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.dp-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}
.dp-footer-spaced {
  justify-content: space-between;
}

/* ─── DATE DROPDOWN ──────────────────────────────────────── */
.date-dropdown-inner {
  padding: 14px;
  min-width: 530px;
  background: #fff;
}
.date-range-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.date-field {
  flex: 1;
}
.date-field-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 4px;
}
.date-field .q-field--dense.q-field--float .q-field__label {
  transform: translateY(-30%) scale(0.75);
  font-size: 14px;
  color: rgb(9 107 163);
  top: 9px;
}

.date-field .q-field--labeled.q-field--dense input.q-field__native {
  padding-top: 14px;
  padding-bottom: 0px;
  padding-left: 2px;
  font-size: 12px;
}
.date-dropdown-inner :deep(.q-field__control) {
  height: 40px !important;
  border-radius: 6px !important;
  background: #f8fafc !important;
  border: 1px solid #cbd5e1 !important;
  font-size: 13px !important;
}
.date-dropdown-inner :deep(.q-field__control::before),
.date-dropdown-inner :deep(.q-field__control::after) {
  display: none !important;
}

.route-dropdown-inner {
  padding: 14px;
  min-width: 260px;
  background: #fff;
}
.route-field {
  margin-bottom: 4px;
}

.route-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.route-arrow {
  display: flex;
  justify-content: center;
}
.route-select :deep(.q-field__control) {
  height: 40px !important;
  border-radius: 6px !important;
  background: #f8fafc !important;
  border: 1px solid #cbd5e1 !important;
  font-size: 13px !important;
}

.route-select :deep(.q-field__control-container) {
  padding-top: 14px !important;
  font-size: 13px;
}

.route-select :deep(.q-field__append) {
  height: 40px;
}

.route-select :deep(.q-field__label) {
  font-size: 13px;
  letter-spacing: 0.85px;
  top: 10px;
}

.q-field--dense.q-field--float.route-select :deep(.q-field__label) {
  transform: translateY(-34%) scale(0.75);
}

.route-select :deep(.q-field__control::before),
.route-select :deep(.q-field__control::after) {
  display: none !important;
}

/* ─── APPLY BUTTON ───────────────────────────────────────── */
.apply-filter-btn {
  margin-left: auto;
}
.apply-filter-btn :deep(.q-btn) {
  height: 36px !important;
  border-radius: 8px !important;
  color: #fff !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 0 18px !important;
  box-shadow: none !important;
  text-transform: none !important;
  transition: background 0.15s !important;
}

/* ─── ACTIVE FILTER CHIPS ROW ────────────────────────────── */
.chips-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 2px 4px;
}
.chips-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}
:deep(.filter-chip) {
  height: 26px !important;
  border-radius: 99px !important;
  background: #dbeafe !important;
  border: 1px solid #93c5fd !important;
  color: #1e40af !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 0 10px !important;
  margin: 0px 1px;
}
:deep(.filter-chip .q-chip__icon--remove) {
  color: #3b82f6 !important;
  font-size: 14px !important;
  opacity: 0.8;
  margin-left: 7px;
}
:deep(.filter-chip .q-chip__icon--remove:hover) {
  opacity: 1;
}

.q-btn.clear-all-btn {
  height: 26px !important;
  border-radius: 99px !important;
  border: 1px solid #fca5a5 !important;
  background: #fff1f2 !important;
  color: #dc2626 !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  padding: 0 10px !important;
  margin: 0px 1px;
}
.q-btn.clear-all-btn .q-btn__content i.q-icon.on-left {
  font-size: 14px !important;
}
.q-btn.clear-all-btn:hover {
  background: #fee2e2 !important;
}

@media (min-width: 768px) and (max-width: 1600px) {
  .search-by-select {
    min-width: 120px;
  }
  .filter-bar-wrapper {
    padding: 6px 8px;
  }
  .filter-pill .q-btn-dropdown {
    font-size: 12px !important;
  }
  .apply-filter-btn {
    margin: 0 auto;
  }
  .search-combo-wrapper {
    height: 36px;
  }
  .search-by-select .q-field__control {
    height: 36px !important;
    min-height: 36px !important;
  }
  .search-by-select .q-field__append {
    height: 36px;
  }
  .global-search .q-field__inner .q-field__control {
    height: 36px !important;
    min-height: 36px !important;
  }
  .global-search :deep(.q-field__native) {
    font-size: 12px !important;
  }
  .apply-filter-btn .q-btn {
    height: 34px !important;
    font-size: 12px !important;
    padding: 0 10px !important;
  }
}

@media (max-width: 767px) {
  .search-combo-wrapper {
    height: 34px;
  }
  .search-combo-wrapper {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: auto;
    border: 1px solid #9edfff;
    border-radius: 8px;
    overflow: hidden;
    background: #f8fafc;
  }
  .route-row {
    display: inline-block;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    width: 100%;
  }
  .branch-select-wrapper
    .branch-filter-card-header
    .q-expansion-item__container
    .q-item {
    min-height: 36px;
    height: 36px;
  }
  :deep(.search-by-select .q-field__append) {
    padding: 0 4px 0 0 !important;
    margin: 0;
    height: 34px;
  }
  :deep(.search-by-select .q-field__control) {
    height: 34px !important;
    min-height: 34px !important;
  }
  :deep(.global-search .q-field__control) {
    height: 34px !important;
    min-height: 34px !important;
  }
  :deep(.global-search .q-field__native) {
    font-size: 11px;
  }
  .search-by-select .q-field__append {
    background-color: #ffffff !important;
  }
  .filter-bar-wrapper {
    display: inline-grid;
    align-items: center;
    width: 100%;
  }
  .filter-pill .q-btn-dropdown {
    width: 100%;
    font-size: 12px !important;
  }
  .apply-filter-btn {
    margin: 0 auto;
  }
  .branch-select-wrapper {
    min-width: 100%;
    max-width: 100%;
    flex-shrink: 0;
  }
  .search-by-select .q-field__control {
    height: 36px !important;
    min-height: 36px !important;
  }
  .search-by-select .q-field__append {
    height: 36px;
  }
  .global-search .q-field__control {
    height: 36px !important;
    min-height: 36px !important;
  }
  .global-search .q-field__native {
    font-size: 12px;
  }
  .apply-filter-btn .q-btn {
    height: 34px !important;
    border-radius: 8px !important;
    color: #fff !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    padding: 0 15px !important;
    box-shadow: none !important;
    text-transform: none !important;
    transition: background 0.15s !important;
  }

  /* Dropdown popups must not exceed the viewport width on mobile */
  .date-dropdown-inner {
    min-width: 0;
    width: 84vw;
    max-width: 340px;
  }
  .route-dropdown-inner {
    min-width: 0;
    width: 84vw;
    max-width: 280px;
  }
  .date-range-row {
    flex-direction: column;
    align-items: stretch;
  }
  .date-range-divider {
    display: flex;
    justify-content: center;
    transform: rotate(90deg);
    margin: 2px 0;
  }
}
</style>
