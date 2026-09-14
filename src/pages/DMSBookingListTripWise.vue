<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking List - Trip Wise</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="description" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredRows.length }}</span>
                <span class="total-stat-label">Total Bookings</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — report/list only, no add/edit; a booking's Trip
               link is set from the booking side, not here. ── -->
          <q-table
            square
            :rows="filteredRows"
            :columns="tableColumns"
            row-key="BookingTripId"
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
                    v-model="tripFilter"
                    :options="tripOptions"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="min-width: 200px"
                    class="q-mx-xs"
                    label="Trip No."
                    @update:model-value="applyFilters"
                  />

                  <q-select
                    square=""
                    v-model="statusFilter"
                    :options="['All', 'Loaded', 'Unloaded', 'Delivered']"
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
                    @click="reload"
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
                      <q-icon name="description" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
                      <span class="mjc-job-date">{{ props.row.TripNo }}</span>
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
                      <span class="mjc-detail-label">Consignee</span>
                      <span class="mjc-detail-value">
                        {{ props.row.ConsigneeName }}
                      </span>
                    </div>
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Tran Date</span>
                      <span class="mjc-detail-value">
                        {{ props.row.TranDate }}
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
// Mirrors the legacy EagleParcel TRP_TripTran link table (TripID, BookingID,
// BookingNo, Status "Loaded|Unloaded|Delivered", TranDate) — a report of
// which bookings are riding on which trip. Self-contained mock data since
// this page is read-only and doesn't need to share a mutable store with
// DMSTrip.vue the way DMSTripStockTransfer.vue/DMSTripView.vue do.
import { apiGetTrips } from "src/data/tripData.js";

const MOCK_BOOKING_TRIP_LINKS = [
  {
    BookingTripId: 1,
    TripNo: "TRP20260001",
    BookingNo: "RKG21040011",
    Status: "Delivered",
    TranDate: "01/04/2026",
    FromCity: "Bangalore",
    ToCity: "Rajkot-G",
    ConsigneeName: "Rajsani Polymers",
  },
  {
    BookingTripId: 2,
    TripNo: "TRP20260001",
    BookingNo: "RKG21040012",
    Status: "Delivered",
    TranDate: "01/04/2026",
    FromCity: "Bangalore",
    ToCity: "Rajkot-G",
    ConsigneeName: "Varun Casting Co",
  },
  {
    BookingTripId: 3,
    TripNo: "TRP20260002",
    BookingNo: "RKG21040013",
    Status: "Loaded",
    TranDate: "02/04/2026",
    FromCity: "Pune",
    ToCity: "Hyderabad",
    ConsigneeName: "Mahindra Heavy Engines Ltd",
  },
  {
    BookingTripId: 4,
    TripNo: "TRP20260004",
    BookingNo: "RKG21040014",
    Status: "Unloaded",
    TranDate: "03/04/2026",
    FromCity: "Chakan",
    ToCity: "Vasai",
    ConsigneeName: "Amul Industries Pvt Ltd",
  },
  {
    BookingTripId: 5,
    TripNo: "TRP20260004",
    BookingNo: "RKG21040015",
    Status: "Delivered",
    TranDate: "03/04/2026",
    FromCity: "Chakan",
    ToCity: "Vasai",
    ConsigneeName: "Krishna Engineering",
  },
];

export default {
  name: "DMSBookingListTripWise",

  data() {
    return {
      allRows: MOCK_BOOKING_TRIP_LINKS,
      filteredRows: [],
      tripFilter: "All",
      tripOptions: ["All"],
      statusFilter: "All",
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      baseColumns: [
        { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
        {
          name: "BookingNo",
          label: "Booking No.",
          field: "BookingNo",
          sortable: true,
        },
        {
          name: "Status",
          label: "Status",
          field: "Status",
          align: "center",
          sortable: true,
        },
        {
          name: "TranDate",
          label: "Tran Date",
          field: "TranDate",
          sortable: true,
        },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredRows.length / rows));
    },
  },

  async mounted() {
    const trips = await apiGetTrips("All", "");
    this.tripOptions = ["All", ...trips.map((t) => t.TripNo)];
    this.applyFilters();
  },

  methods: {
    reload() {
      this.applyFilters();
    },

    clearSearch() {
      this.searchText = "";
      this.applyFilters();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    statusColor(status) {
      const map = { Loaded: "blue", Unloaded: "orange", Delivered: "positive" };
      return map[status] || "grey";
    },

    applyFilters() {
      let result = [...this.allRows];
      if (this.tripFilter && this.tripFilter !== "All")
        result = result.filter((r) => r.TripNo === this.tripFilter);
      if (this.statusFilter && this.statusFilter !== "All")
        result = result.filter((r) => r.Status === this.statusFilter);
      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        result = result.filter(
          (r) =>
            r.BookingNo.toLowerCase().includes(s) ||
            r.TripNo.toLowerCase().includes(s) ||
            r.ConsigneeName.toLowerCase().includes(s)
        );
      }
      this.filteredRows = result;
    },
  },
};
</script>
