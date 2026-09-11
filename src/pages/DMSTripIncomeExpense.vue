<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Trip Income Expense</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="trending_up" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count text-positive">{{ totalIncome }}</span>
                <span class="total-stat-label">Total Income</span>
              </div>
            </div>
            <div class="total-stat-tile total-stat-tile--inline q-ml-sm">
              <q-icon name="trending_down" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count text-negative">{{ totalExpense }}</span>
                <span class="total-stat-label">Total Expense</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — income/expense entries booked against a trip,
               mirrors TRP_Trip_TripIncomeExpense.cs from the legacy
               EagleParcel WinForms app. ── -->
          <q-table
            square
            dense
            :rows="filteredEntries"
            :columns="tableColumns"
            row-key="EntryId"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
            card-class="text-black"
            :grid="$q.screen.lt.sm"
          >
            <template v-slot:top="props">
              <div class="tb-app col">
                <div class="filter-bar-wrapper accent-filter-bar">
                  <div class="search-combo-wrapper">
                    <input
                      v-model="searchText"
                      class="search-combo-input"
                      placeholder="Search Any"
                      @keyup.enter="applyFilters"
                    />
                    <q-btn
                      v-if="searchText"
                      flat
                      dense
                      round
                      icon="close"
                      size="xs"
                      class="search-combo-clear-btn"
                      @click="clearSearch"
                    >
                      <q-tooltip>Clear</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      icon="search"
                      class="search-combo-icon-btn"
                      @click="applyFilters"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    label="New Entry"
                    class="add_new_job m_add_newjob bg-dblue-lblue"
                    @click="openAddEntry"
                  />

                  <q-select
                    v-model="typeFilter"
                    :options="['All', 'Income', 'Expense']"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="width: 130px"
                    class="q-mx-xs"
                    @update:model-value="applyFilters"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="applyFilters"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />

                  <q-btn
                    flat
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
                    @click="props.toggleFullscreen"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                  />
                </div>
              </div>
            </template>

            <template v-slot:pagination>
              <q-pagination
                v-model="pagination.page"
                direction-links
                :max="maxPages"
                :max-pages="10"
                boundary-links
                boundary-numbers
                color="blue"
                size="md"
                dense
                @update:model-value="handlePageChange"
              />
              <span class="q-ml-md">Page {{ pagination.page }} of {{ maxPages }}</span>
            </template>

            <template v-slot:body-cell-EntryType="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value === 'Income' ? 'positive' : 'negative'"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editEntry(props.row)"
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style q-ml-xs"
                  @click="deleteEntry(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="trending_up" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.TripNo }}</span>
                      <span class="mjc-job-date">{{ props.row.Category }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge :color="props.row.EntryType === 'Income' ? 'positive' : 'negative'" :label="props.row.EntryType" />
                  </div>
                </div>
                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editEntry(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-view" @click="deleteEntry(props.row)" />
                </div>
                <div class="mjc-details">
                  <div class="mjc-details-grid">
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Amount</span>
                      <span class="mjc-detail-value">{{ props.row.Amount }}</span>
                    </div>
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Date</span>
                      <span class="mjc-detail-value">{{ props.row.EntryDate }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <!-- ══════════════════════════════════════
         Income/Expense Add / Edit Dialog — canonical compact-dialog shape
         (ReferredDetailsDialog.vue), same as DMSTripCharge.vue's own.
    ══════════════════════════════════════ -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ dialogMode === "add" ? "New Income / Expense Entry" : "Edit Income / Expense Entry" }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <span class="field-label">Trip No.</span>
              <q-select
                v-model="form.TripNo"
                :options="tripOptions.filter((t) => t !== 'All')"
                dense
                outlined
                bg-color="blue-1"
              />
            </div>
            <div class="col-6">
              <span class="field-label">Type</span>
              <q-select
                v-model="form.EntryType"
                :options="['Income', 'Expense']"
                dense
                outlined
                bg-color="blue-1"
                @update:model-value="onTypeChange"
              />
            </div>
            <div class="col-6">
              <span class="field-label">Category</span>
              <q-select
                v-model="form.Category"
                :options="categoryOptions"
                dense
                outlined
                bg-color="blue-1"
              />
            </div>
            <div class="col-6">
              <span class="field-label">Entry Date</span>
              <q-input v-model="form.EntryDate" dense outlined bg-color="blue-1" placeholder="dd/mm/yyyy">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="entryDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="form.EntryDate"
                        mask="DD/MM/YYYY"
                        minimal
                        style="width: 280px"
                        @update:model-value="$refs.entryDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <span class="field-label">Amount</span>
              <q-input v-model="form.Amount" type="number" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-12">
              <span class="field-label">Remarks</span>
              <q-input v-model="form.Remarks" dense outlined bg-color="blue-1" type="textarea" :rows="2" autogrow />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-gutter-sm q-pt-none q-pb-none q-pr-none">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="primary" class="m-btn-style" label="Save" @click="saveEntry" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { apiGetTrips } from "src/data/tripData.js";

const INCOME_CATEGORIES = ["Freight Income", "Detention Income", "Other Income"];
const EXPENSE_CATEGORIES = ["Diesel Expense", "Toll Expense", "Driver Batta", "Other Expense"];

const MOCK_ENTRIES = [
  {
    EntryId: 1,
    TripNo: "TRP20260001",
    EntryType: "Income",
    Category: "Freight Income",
    EntryDate: "01/04/2026",
    Amount: 28000,
    Remarks: "",
  },
  {
    EntryId: 2,
    TripNo: "TRP20260001",
    EntryType: "Expense",
    Category: "Diesel Expense",
    EntryDate: "01/04/2026",
    Amount: 4200,
    Remarks: "",
  },
  {
    EntryId: 3,
    TripNo: "TRP20260002",
    EntryType: "Expense",
    Category: "Driver Batta",
    EntryDate: "02/04/2026",
    Amount: 600,
    Remarks: "2-day batta.",
  },
];

function apiGetEntries() {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...MOCK_ENTRIES]), 150)
  );
}

function apiSaveEntry(entry) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (entry.EntryId) {
        const idx = MOCK_ENTRIES.findIndex((e) => e.EntryId === entry.EntryId);
        if (idx !== -1) MOCK_ENTRIES[idx] = { ...entry };
      } else {
        entry.EntryId = MOCK_ENTRIES.length
          ? Math.max(...MOCK_ENTRIES.map((e) => e.EntryId)) + 1
          : 1;
        MOCK_ENTRIES.push(entry);
      }
      resolve({ success: true, data: entry });
    }, 200);
  });
}

function apiDeleteEntry(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_ENTRIES.findIndex((e) => e.EntryId === id);
      if (idx !== -1) MOCK_ENTRIES.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

export default {
  name: "DMSTripIncomeExpense",

  data() {
    return {
      allEntries: [],
      filteredEntries: [],
      typeFilter: "All",
      tripOptions: ["All"],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      baseColumns: [
        { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
        { name: "EntryType", label: "Type", field: "EntryType", align: "center", sortable: true },
        { name: "Category", label: "Category", field: "Category", sortable: true },
        { name: "EntryDate", label: "Date", field: "EntryDate", sortable: true },
        { name: "Amount", label: "Amount", field: "Amount", align: "right", sortable: true },
        { name: "Remarks", label: "Remarks", field: "Remarks" },
        { name: "action", label: "Action", field: "action" },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    categoryOptions() {
      return this.form.EntryType === "Income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    },
    totalIncome() {
      return this.filteredEntries
        .filter((e) => e.EntryType === "Income")
        .reduce((sum, e) => sum + (parseFloat(e.Amount) || 0), 0)
        .toFixed(2);
    },
    totalExpense() {
      return this.filteredEntries
        .filter((e) => e.EntryType === "Expense")
        .reduce((sum, e) => sum + (parseFloat(e.Amount) || 0), 0)
        .toFixed(2);
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredEntries.length / rows));
    },
  },

  async mounted() {
    const trips = await apiGetTrips("All", "");
    this.tripOptions = ["All", ...trips.map((t) => t.TripNo)];
    await this.loadEntries();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.applyFilters();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadEntries() {
      this.allEntries = await apiGetEntries();
      this.applyFilters();
    },

    applyFilters() {
      let result = [...this.allEntries];
      if (this.typeFilter && this.typeFilter !== "All")
        result = result.filter((e) => e.EntryType === this.typeFilter);
      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        result = result.filter(
          (e) =>
            e.TripNo.toLowerCase().includes(s) ||
            e.Category.toLowerCase().includes(s) ||
            (e.Remarks || "").toLowerCase().includes(s)
        );
      }
      this.filteredEntries = result;
    },

    onTypeChange() {
      this.form.Category = this.categoryOptions[0];
    },

    emptyForm() {
      return {
        EntryId: null,
        TripNo: "",
        EntryType: "Income",
        Category: INCOME_CATEGORIES[0],
        EntryDate: "01/04/2026",
        Amount: 0,
        Remarks: "",
      };
    },

    openAddEntry() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editEntry(row) {
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveEntry() {
      const res = await apiSaveEntry({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Entry saved!", color: "positive", position: "top" });
        this.showDialog = false;
        await this.loadEntries();
      }
    },

    async deleteEntry(row) {
      const res = await apiDeleteEntry(row.EntryId);
      if (res.success) {
        this.$q.notify({ message: "Entry deleted.", color: "positive", position: "top" });
        await this.loadEntries();
      }
    },
  },
};
</script>

<style scoped>
.field-label {
  display: block;
  font-size: 11px;
  color: #555;
  margin-bottom: 2px;
  font-weight: 500;
}
</style>
