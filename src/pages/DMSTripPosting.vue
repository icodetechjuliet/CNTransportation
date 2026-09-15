<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Trip Posting</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="receipt_long" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ pendingCount }}</span>
                <span class="total-stat-label">Pending Posting</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — completed trips awaiting accounting posting, with a
               one-click "Post" action per row (mirrors TRP_Trip_Posting.cs
               from the legacy EagleParcel WinForms app). ── -->
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

                  <q-select
                    square=""
                    v-model="postedFilter"
                    :options="['Pending Posting', 'Posted', 'All']"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="width: 160px"
                    class="q-mx-xs"
                    @update:model-value="loadTrips"
                  />

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    style="width: 140px"
                    class="q-ml-sm"
                    @update:model-value="loadTrips"
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
                    @update:model-value="loadTrips"
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

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge
                  :color="statusColor(props.value)"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-Posted="props">
              <q-td :props="props" class="button-container">
                <q-badge
                  v-if="props.row.Posted"
                  color="positive"
                  label="Posted"
                />
                <q-btn
                  v-else
                  unelevated
                  no-caps
                  dense
                  size="sm"
                  icon="task_alt"
                  label="Post"
                  color="primary"
                  class="m-btn-style"
                  @click="postTrip(props.row)"
                />
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
                      <span class="mjc-job-date">{{ props.row.TripDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      v-if="props.row.Posted"
                      color="positive"
                      label="Posted"
                    />
                    <q-btn
                      v-else
                      unelevated
                      no-caps
                      dense
                      size="sm"
                      label="Post"
                      color="primary"
                      class="m-btn-style"
                      @click="postTrip(props.row)"
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
                      <span class="mjc-detail-label">Total Amt.</span>
                      <span class="mjc-detail-value">
                        {{ props.row.TotalTripAmount }}
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
import { apiGetTrips, apiSetTripPosted } from "src/data/tripData.js";

export default {
  name: "DMSTripPosting",

  data() {
    return {
      filteredTrips: [],
      postedFilter: "Pending Posting",
      searchText: "",
      fromDate: "01-04-2026",
      toDate: "30-04-2026",
      pagination: { page: 1, rowsPerPage: 15 },

      baseColumns: [
        { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
        { name: "TripDate", label: "Date", field: "TripDate", sortable: true },
        { name: "Status", label: "Status", field: "Status", align: "center" },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        {
          name: "FromBookingOffice",
          label: "Booking Office",
          field: "FromBookingOffice",
        },
        {
          name: "Quantity",
          label: "Quantity",
          field: "Quantity",
          align: "right",
          sortable: true,
        },
        { name: "Posted", label: "Posting", field: "Posted", align: "center" },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    pendingCount() {
      return this.filteredTrips.filter((t) => !t.Posted).length;
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

    statusColor(status) {
      const map = { Loaded: "orange", Unloaded: "positive" };
      return map[status] || "grey";
    },

    // TripDate is stored as a "DD-MM-YYYY" display string.
    parseDMY(value) {
      if (!value) return null;
      const [d, m, y] = value.split("-").map(Number);
      if (!d || !m || !y) return null;
      return new Date(y, m - 1, d);
    },

    async loadTrips() {
      // Only unloaded (delivered) trips are eligible for posting.
      let result = await apiGetTrips("All", "Trip No", this.searchText);
      result = result.filter((t) => t.Status === "Unloaded");
      if (this.postedFilter === "Pending Posting")
        result = result.filter((t) => !t.Posted);
      else if (this.postedFilter === "Posted")
        result = result.filter((t) => t.Posted);
      const from = this.parseDMY(this.fromDate);
      const to = this.parseDMY(this.toDate);
      result = result.filter((t) => {
        const d = this.parseDMY(t.TripDate);
        if (!d) return true;
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
      this.filteredTrips = result;
    },

    async postTrip(row) {
      const res = await apiSetTripPosted(row.TripId, true);
      if (res.success) {
        this.$q.notify({
          message: `Trip ${row.TripNo} posted!`,
          color: "positive",
          position: "top",
        });
        await this.loadTrips();
      }
    },
  },
};
</script>
