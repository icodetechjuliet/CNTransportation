<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Trip List - Pending For Unload</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredTrips.length }}</span>
                <span class="total-stat-label">Pending For Unload</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — trips still "InTransit" (arrived/on the way, not
               yet unloaded at destination), with a one-click "Mark
               Unloaded" action per row (mirrors
               TRP_TripList_PendingForUnload.cs from the legacy EagleParcel
               WinForms app). ── -->
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
                      @keyup.enter="loadTrips"
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
                      @click="loadTrips"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadTrips"
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
                  icon="inventory_2"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="markUnloaded(props.row)"
                >
                  <q-tooltip>Mark Unloaded</q-tooltip>
                </q-btn>
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
                      <span class="mjc-job-date">{{ props.row.TripDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-btn
                      unelevated
                      no-caps
                      dense
                      size="sm"
                      label="Mark Unloaded"
                      color="primary"
                      class="m-btn-style"
                      @click="markUnloaded(props.row)"
                    />
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
                      <span class="mjc-detail-label">Vehicle</span>
                      <span class="mjc-detail-value">
                        {{ props.row.VehicleNo || "—" }}
                      </span>
                    </div>
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Driver</span>
                      <span class="mjc-detail-value">
                        {{ props.row.Driver || "—" }}
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
import { apiGetTrips, apiUpdateTripStatus } from "src/data/tripData.js";

function todayStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

export default {
  name: "DMSTripListPendingForUnload",

  data() {
    return {
      filteredTrips: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      baseColumns: [
        { name: "action", label: "Action", field: "action", align: "center" },
        { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
        { name: "TripDate", label: "Date", field: "TripDate", sortable: true },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "VehicleNo", label: "Vehicle", field: "VehicleNo" },
        { name: "Driver", label: "Driver", field: "Driver" },
        {
          name: "FromBookingOffice",
          label: "Booking Office",
          field: "FromBookingOffice",
        },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredTrips.length / rows));
    },
  },

  mounted() {
    this.loadTrips();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.loadTrips();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadTrips() {
      const result = await apiGetTrips("All", "Trip No", this.searchText);
      this.filteredTrips = result.filter((t) => t.Status === "Loaded");
    },

    async markUnloaded(row) {
      const res = await apiUpdateTripStatus(row.TripId, "Unloaded", {
        TripEndDate: todayStamp(),
      });
      if (res.success) {
        this.$q.notify({
          message: `Trip ${row.TripNo} marked unloaded!`,
          color: "positive",
          position: "top",
        });
        await this.loadTrips();
      }
    },
  },
};
</script>
