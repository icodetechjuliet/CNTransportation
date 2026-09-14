<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Trip Register - Transporter Wise</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredTrips.length }}</span>
                <span class="total-stat-label">Trips</span>
              </div>
            </div>
            <div class="total-stat-tile total-stat-tile--inline q-ml-sm">
              <q-icon name="inventory_2" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ totalQuantity }}</span>
                <span class="total-stat-label">Total Quantity</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — report/list only, filterable by transporter and
               date range, mirrors TRP_TripRegister_TransporterWise.cs from
               the legacy EagleParcel WinForms app. ── -->
          <q-table
            square
            :rows="filteredTrips"
            :columns="tableColumns"
            row-key="TripId"
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

                  <q-select
                    square=""
                    v-model="transporterFilter"
                    :options="transporterOptions"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="min-width: 200px"
                    class="q-mx-xs"
                    label="Transporter"
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

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge
                  :color="statusColor(props.value)"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="local_shipping" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.TripNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.Transporter }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="statusColor(props.row.Status)"
                    >
                      {{ props.row.Status }}
                    </q-badge>
                  </div>
                </div>
                <div class="mjc-details">
                  <div class="mjc-details-grid">
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Route</span>
                      <span class="mjc-detail-value">
                        {{ props.row.FromCity }} → {{ props.row.ToCity }}
                      </span>
                    </div>
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Quantity</span>
                      <span class="mjc-detail-value">
                        {{ props.row.Quantity }}
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
import { apiGetTrips, MOCK_DATA } from "src/data/tripData.js";

export default {
  name: "DMSTripRegisterTransporterWise",

  data() {
    return {
      allTrips: [],
      filteredTrips: [],
      transporterFilter: "All",
      transporterOptions: ["All", ...MOCK_DATA.transporters],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      baseColumns: [
        {
          name: "Transporter",
          label: "Transporter",
          field: "Transporter",
          sortable: true,
        },
        { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
        { name: "TripDate", label: "Date", field: "TripDate", sortable: true },
        { name: "Status", label: "Status", field: "Status", align: "center" },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "VehicleNo", label: "Vehicle", field: "VehicleNo" },
        {
          name: "Quantity",
          label: "Quantity",
          field: "Quantity",
          align: "right",
          sortable: true,
        },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    totalQuantity() {
      return this.filteredTrips.reduce(
        (sum, t) => sum + (parseFloat(t.Quantity) || 0),
        0
      );
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredTrips.length / rows));
    },
  },

  async mounted() {
    this.allTrips = await apiGetTrips("All", "Trip No", "");
    this.applyFilters();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.applyFilters();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    statusColor(status) {
      const map = { Loaded: "orange", Unloaded: "positive" };
      return map[status] || "grey";
    },

    applyFilters() {
      let result = [...this.allTrips];
      if (this.transporterFilter && this.transporterFilter !== "All")
        result = result.filter((t) => t.Transporter === this.transporterFilter);
      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        result = result.filter(
          (t) =>
            t.TripNo.toLowerCase().includes(s) ||
            (t.Transporter || "").toLowerCase().includes(s) ||
            (t.VehicleNo || "").toLowerCase().includes(s)
        );
      }
      this.filteredTrips = result.sort((a, b) =>
        (a.Transporter || "").localeCompare(b.Transporter || "")
      );
    },
  },
};
</script>
