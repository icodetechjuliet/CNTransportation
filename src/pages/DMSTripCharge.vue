<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Trip Charge</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="receipt_long" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ totalAmount }}</span>
                <span class="total-stat-label">Total Charges</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — extra costs booked against a trip (fuel, toll,
               loading/unloading, detention, …), mirrors the legacy
               EagleParcel TRP_TripCharge module. ── -->
          <q-table
            square
            :rows="filteredCharges"
            :columns="tableColumns"
            row-key="ChargeId"
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
                    label="New Charge"
                    class="add_new_job m_add_newjob bg-dblue-lblue"
                    @click="openAddCharge"
                  />

                  <q-select
                    square=""
                    v-model="tripFilter"
                    :options="tripOptions"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="min-width: 180px"
                    class="q-mx-xs"
                    label="Trip No."
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
              <span class="q-ml-md">
                Page {{ pagination.page }} of {{ maxPages }}
              </span>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editCharge(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style q-ml-xs"
                  @click="deleteCharge(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="receipt_long" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.TripNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.ChargeDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <span class="mjc-job-no">{{ props.row.Amount }}</span>
                  </div>
                </div>
                <div class="mjc-actions">
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-pen-to-square"
                    label="Edit"
                    class="mjc-btn mjc-btn-edit"
                    @click="editCharge(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-view"
                    @click="deleteCharge(props.row)"
                  />
                </div>
                <div class="mjc-details">
                  <div class="mjc-details-grid">
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Charge Type</span>
                      <span class="mjc-detail-value">
                        {{ props.row.ChargeType }}
                      </span>
                    </div>
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Remarks</span>
                      <span class="mjc-detail-value">
                        {{ props.row.Remarks || "—" }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import entryNavigation from "src/mixins/entryNavigation.js";
import { apiGetTrips } from "src/data/tripData.js";

const MOCK_CHARGES = [
  {
    ChargeId: 1,
    TripNo: "TRP20260001",
    ChargeType: "Diesel",
    ChargeDate: "01/04/2026",
    Amount: 4200,
    Remarks: "Full tank at departure.",
  },
  {
    ChargeId: 2,
    TripNo: "TRP20260001",
    ChargeType: "Toll",
    ChargeDate: "01/04/2026",
    Amount: 850,
    Remarks: "",
  },
  {
    ChargeId: 3,
    TripNo: "TRP20260002",
    ChargeType: "Detention",
    ChargeDate: "02/04/2026",
    Amount: 1500,
    Remarks: "Waited 6 hrs at destination dock.",
  },
];

function apiGetCharges() {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...MOCK_CHARGES]), 150)
  );
}

function apiSaveCharge(charge) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (charge.ChargeId) {
        const idx = MOCK_CHARGES.findIndex(
          (c) => c.ChargeId === charge.ChargeId
        );
        if (idx !== -1) MOCK_CHARGES[idx] = { ...charge };
      } else {
        charge.ChargeId = MOCK_CHARGES.length
          ? Math.max(...MOCK_CHARGES.map((c) => c.ChargeId)) + 1
          : 1;
        MOCK_CHARGES.push(charge);
      }
      resolve({ success: true, data: charge });
    }, 200);
  });
}

function apiDeleteCharge(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_CHARGES.findIndex((c) => c.ChargeId === id);
      if (idx !== -1) MOCK_CHARGES.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

export default {
  mixins: [entryNavigation],
  entryReload: "loadCharges",
  name: "DMSTripCharge",

  data() {
    return {
      allCharges: [],
      filteredCharges: [],
      tripFilter: "All",
      tripOptions: ["All"],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      baseColumns: [
        { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
        {
          name: "ChargeType",
          label: "Charge Type",
          field: "ChargeType",
          sortable: true,
        },
        {
          name: "ChargeDate",
          label: "Charge Date",
          field: "ChargeDate",
          sortable: true,
        },
        {
          name: "Amount",
          label: "Amount",
          field: "Amount",
          align: "right",
          sortable: true,
        },
        { name: "Remarks", label: "Remarks", field: "Remarks" },
        { name: "action", label: "Action", field: "action" },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    totalAmount() {
      return this.filteredCharges
        .reduce((sum, c) => sum + (parseFloat(c.Amount) || 0), 0)
        .toFixed(2);
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredCharges.length / rows));
    },
  },

  async mounted() {
    const trips = await apiGetTrips("All", "");
    this.tripOptions = ["All", ...trips.map((t) => t.TripNo)];
    await this.loadCharges();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.applyFilters();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadCharges() {
      this.allCharges = await apiGetCharges();
      this.applyFilters();
    },

    applyFilters() {
      let result = [...this.allCharges];
      if (this.tripFilter && this.tripFilter !== "All")
        result = result.filter((c) => c.TripNo === this.tripFilter);
      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        result = result.filter(
          (c) =>
            c.TripNo.toLowerCase().includes(s) ||
            c.ChargeType.toLowerCase().includes(s) ||
            (c.Remarks || "").toLowerCase().includes(s)
        );
      }
      this.filteredCharges = result;
    },

    emptyForm() {
      return {
        ChargeId: null,
        TripNo: "",
        ChargeType: "Diesel",
        ChargeDate: "01/04/2026",
        Amount: 0,
        Remarks: "",
      };
    },

    openAddCharge() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSTripChargeForm?mode=${this.dialogMode}&id=${
            this.form.ChargeId || ""
          }`,
          "Trip Charge"
        );
      }
    },

    editCharge(row) {
      this.form = { ...row };
      this.dialogMode = "edit";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSTripChargeForm?mode=${this.dialogMode}&id=${
            this.form.ChargeId || ""
          }`,
          "Trip Charge"
        );
      }
    },

    async saveCharge() {
      const res = await apiSaveCharge({ ...this.form });
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Trip charge saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.notifyEntrySaved();
        await this.loadCharges();
      }
    },

    async deleteCharge(row) {
      const res = await apiDeleteCharge(row.ChargeId);
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Trip charge deleted.",
          color: "positive",
          position: "top",
        });
        await this.loadCharges();
      }
    },
  },
};
</script>
