<template>
  <div>
    <!-- Old app: E-Way Bill Part B Log — read-only feed of every bill that
         has had Part B generated (single or consolidated), pulled straight
         from src/data/ewayBillData.js's own store — no add/edit here. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">E-Way Bill Part B Log</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="history" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredBills.length }}</span>
                <span class="total-stat-label">Part B Generated</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredBills"
            :columns="tableColumns"
            row-key="EWayBillId"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-black m-table-style"
            table-header-class="text-black m-table-style"
            card-class="text-black"
            :grid="$q.screen.lt.sm"
          >
            <template v-slot:top>
              <div class="tb-app col">
                <div class="filter-bar-wrapper accent-filter-bar">
                  <div class="search-combo-wrapper">
                    <input
                      v-model="searchText"
                      class="search-combo-input"
                      placeholder="Search Any"
                      @keyup.enter="loadBills"
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
                      @click="loadBills"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    style="width: 140px"
                    class="q-ml-sm"
                    @update:model-value="loadBills"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="fromDate" mask="DD-MM-YYYY" color="black">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="black"
                                flat
                              ></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="toDate"
                    label="To Date"
                    style="width: 140px"
                    class="q-ml-xs"
                    @update:model-value="loadBills"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="toDate" mask="DD-MM-YYYY" color="black">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="black"
                                flat
                              ></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="loadBills"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-IsConsolidated="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value ? 'primary' : 'grey'"
                  :label="props.value ? 'Consolidated' : 'Single'"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { apiGetPartBLog } from "src/data/ewayBillData.js";

export default {
  name: "DMSEWayBillPartBLog",

  data() {
    return {
      filteredBills: [],
      searchText: "",
      fromDate: "01-01-2026",
      toDate: "31-12-2026",
      pagination: { page: 1, rowsPerPage: 15 },

      tableColumns: [
        {
          name: "EWayBillNo",
          label: "E-Way Bill No.",
          field: "EWayBillNo",
          sortable: true,
        },
        {
          name: "ConsolidatedNo",
          label: "Consolidated No.",
          field: "ConsolidatedNo",
        },
        {
          name: "IsConsolidated",
          label: "Type",
          field: "IsConsolidated",
          align: "center",
        },
        { name: "VehicleNo", label: "Vehicle No.", field: "VehicleNo" },
        { name: "FromPlace", label: "From Place", field: "FromPlace" },
        {
          name: "PartBDate",
          label: "Generated On",
          field: "PartBDate",
          sortable: true,
        },
        { name: "GeneratedBy", label: "Generated By", field: "GeneratedBy" },
      ],
    };
  },

  mounted() {
    this.loadBills();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.loadBills();
    },

    // PartBDate mock values are either a fixed "DD-MM-YYYY hh:mm AM/PM"
    // string or, for freshly generated bills, `new Date().toLocaleString()`
    // (locale "M/D/YYYY, hh:mm:ss AM/PM") — handle both.
    parsePartBDate(value) {
      if (!value) return null;
      const datePart = value.split(",")[0].trim().split(" ")[0];
      if (datePart.includes("-")) {
        const [d, m, y] = datePart.split("-").map(Number);
        if (d && m && y) return new Date(y, m - 1, d);
      }
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    },

    async loadBills() {
      const all = await apiGetPartBLog(this.searchText);
      const from = this.fromDate ? this.parsePartBDate(this.fromDate) : null;
      const to = this.toDate ? this.parsePartBDate(this.toDate) : null;
      this.filteredBills = all.filter((b) => {
        const d = this.parsePartBDate(b.PartBDate);
        if (!d) return true;
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    },
  },
};
</script>
