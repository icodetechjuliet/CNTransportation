<template>
  <div>
    <!-- Old app: BUK_Booking_BookingRegister_GST_Screen — a filterable,
         read-only booking register report (date range + print/export),
         distinct from DMSBookingView.vue (that one is the single-booking
         Add/Edit/View full page opened from the Booking list's row
         actions). This page is the menu's own standalone "Booking View"
         report screen. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking View</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="visibility" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredBookings.length }}</span>
                <span class="total-stat-label">Total Bookings</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredBookings"
            :columns="tableColumns"
            row-key="BookingId"
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
                      @keyup.enter="loadBookings"
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
                    <q-btn flat dense icon="search" class="search-combo-icon-btn" @click="loadBookings">
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-select
                    v-model="direction"
                    :options="['All', 'Outward', 'Inward']"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="width: 110px"
                    class="q-mx-xs"
                    @update:model-value="loadBookings"
                  />

                  <q-btn
                    unelevated
                    no-caps
                    color="primary"
                    icon="print"
                    label="Print Register"
                    class="q-mx-xs"
                    @click="printRegister"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadBookings"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge :color="props.value === 'Delivered' ? 'positive' : 'orange'" :label="props.value" />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-eye"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style vw"
                  @click="viewBooking(props.row)"
                  ><q-tooltip>View</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.BookingId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="visibility" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
                      <span class="mjc-job-date">{{ props.row.BookingDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" :color="props.row.Status === 'Delivered' ? 'positive' : 'orange'">
                      {{ props.row.Status }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.BookingId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-eye" label="View" class="mjc-btn mjc-btn-view" @click="viewBooking(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.BookingId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Route</span><span class="mjc-detail-value">{{ props.row.FromCity }} → {{ props.row.ToCity }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Consignor</span><span class="mjc-detail-value">{{ props.row.ConsignorName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Consignee</span><span class="mjc-detail-value">{{ props.row.ConsigneeName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Net Amt.</span><span class="mjc-detail-value">{{ props.row.NetAmt || "—" }}</span></div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls. Read-only report register,
//  same MOCK_BOOKINGS field shape as DMSBooking.vue (own local copy, per
//  the "copy don't parametrize" convention this family follows).
// ─────────────────────────────────────────────
const MOCK_BOOKINGS = [
  { BookingId: 1, BookingNo: "RKG21040001", BookingDate: "01/04/2026", BookingType: "Outward", FromCity: "Rajkot-G", ToCity: "Chakan", ConsignorName: "Balaji xxx Co.", ConsigneeName: "Galaxy xxx Tooling", NetAmt: "262.50", Status: "Delivered" },
  { BookingId: 2, BookingNo: "RKG21040002", BookingDate: "01/04/2026", BookingType: "Outward", FromCity: "Rajkot-G", ToCity: "Nasik", ConsignorName: "Rajsani xxx Polymers", ConsigneeName: "Ring xxx Ltd", NetAmt: "340.00", Status: "Pending" },
  { BookingId: 3, BookingNo: "RKG21040003", BookingDate: "02/04/2026", BookingType: "Inward", FromCity: "Chakan", ToCity: "Rajkot-G", ConsignorName: "Galaxy xxx Tooling", ConsigneeName: "Balaji xxx Co.", NetAmt: "180.00", Status: "Delivered" },
];

function apiGetBookings(direction, search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_BOOKINGS];
      if (direction !== "All") result = result.filter((b) => b.BookingType === direction);
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (b) =>
            b.BookingNo.toLowerCase().includes(s) ||
            b.ConsignorName.toLowerCase().includes(s) ||
            b.ConsigneeName.toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export default {
  name: "DMSBookingViewReport",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      filteredBookings: [],
      searchText: "",
      direction: "All",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],
      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "BookingNo", label: "Booking No.", field: "BookingNo", sortable: true },
        { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
        { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
        { name: "NetAmt", label: "Net Amt.", field: "NetAmt", align: "right" },
        { name: "Status", label: "Status", field: "Status", align: "center" },
      ],
    };
  },

  mounted() {
    this.loadBookings();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadBookings();
    },

    async loadBookings() {
      this.filteredBookings = await apiGetBookings(this.direction, this.searchText);
    },

    viewBooking(row) {
      if (this.openTab) {
        this.openTab(`/DMSBookingView?mode=view&bookingId=${row.BookingId}`, `Booking ${row.BookingNo || ""}`.trim());
      }
    },

    printRegister() {
      this.$q.notify({ message: "Booking register print — not yet wired to a PDF export.", color: "info", position: "top" });
    },
  },
};
</script>
