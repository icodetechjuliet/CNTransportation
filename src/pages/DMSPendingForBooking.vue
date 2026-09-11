<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Pending For Booking</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="pending_actions" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredBookingWebs.length }}</span>
                <span class="total-stat-label">Total Pending</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredBookingWebs"
            :columns="tableColumns"
            row-key="BookingWebId"
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
                      @keyup.enter="loadBookingWebs"
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
                      @click="loadBookingWebs"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadBookingWebs"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-plus"
                  color="positive"
                  dense
                  outline
                  label="Convert"
                  no-caps
                  class="edit-icon-style"
                  @click="confirmConvert(props.row)"
                  ><q-tooltip>Add Booking</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.BookingWebId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="pending_actions" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingWebNo }}</span>
                      <span class="mjc-job-date">{{ props.row.BookingWebDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="orange">Pending</q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.BookingWebId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-plus" label="Convert" class="mjc-btn mjc-btn-edit" @click="confirmConvert(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.BookingWebId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">From City</span><span class="mjc-detail-value">{{ props.row.FromCity || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">To City</span><span class="mjc-detail-value">{{ props.row.ToCity || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Consignor</span><span class="mjc-detail-value">{{ props.row.ConsignorAccount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Consignee</span><span class="mjc-detail-value">{{ props.row.ConsigneeAccount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Item</span><span class="mjc-detail-value">{{ props.row.ItemName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Quantity</span><span class="mjc-detail-value">{{ props.row.Quantity || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Bill Value</span><span class="mjc-detail-value">{{ props.row.BillValue || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Payment Type</span><span class="mjc-detail-value">{{ props.row.PaymentType || "—" }}</span></div>
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
//  Mock data — replace with real axios calls. This page mirrors the old
//  app's BUK_BookingWeb_PendingForBooking worklist: online/customer-submitted
//  Booking Web entries still awaiting conversion into a real Booking record.
//  Local mock data only — no import from DMSBookingWeb.vue or any other page.
// ─────────────────────────────────────────────
const MOCK_PENDING_BOOKING_WEBS = [
  {
    BookingWebId: 1,
    BookingWebNo: "BWEB21040001",
    BookingWebDate: "01/04/2026",
    FromCity: "Rajkot-G",
    ToCity: "Chakan",
    ConsignorAccount: "Balaji xxx Co.",
    ConsigneeAccount: "Galaxy xxx Tooling",
    ItemName: "Machine Parts",
    Quantity: 12,
    BillValue: "18500.00",
    PaymentType: "ToPay",
  },
  {
    BookingWebId: 2,
    BookingWebNo: "BWEB21040002",
    BookingWebDate: "02/04/2026",
    FromCity: "Rajkot-G",
    ToCity: "Nasik",
    ConsignorAccount: "Rajsani xxx Polymers",
    ConsigneeAccount: "Ring xxx Ltd",
    ItemName: "Polymer Granules",
    Quantity: 25,
    BillValue: "42300.00",
    PaymentType: "Paid",
  },
  {
    BookingWebId: 3,
    BookingWebNo: "BWEB21040003",
    BookingWebDate: "03/04/2026",
    FromCity: "Rajkot-G",
    ToCity: "Pune",
    ConsignorAccount: "Carver xxx Ltd",
    ConsigneeAccount: "Carver xxx Ltd",
    ItemName: "Auto Components",
    Quantity: 8,
    BillValue: "9750.00",
    PaymentType: "TBBS",
  },
];

function apiGetPendingBookingWebs(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_PENDING_BOOKING_WEBS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (b) =>
            b.BookingWebNo.toLowerCase().includes(s) ||
            (b.FromCity || "").toLowerCase().includes(s) ||
            (b.ToCity || "").toLowerCase().includes(s) ||
            (b.ConsignorAccount || "").toLowerCase().includes(s) ||
            (b.ConsigneeAccount || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export default {
  name: "DMSPendingForBooking",

  data() {
    return {
      bookingWebs: [],
      filteredBookingWebs: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "BookingWebNo", label: "Booking Web No.", field: "BookingWebNo", sortable: true },
        { name: "BookingWebDate", label: "Date", field: "BookingWebDate", sortable: true },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "ConsignorAccount", label: "Consignor", field: "ConsignorAccount" },
        { name: "ConsigneeAccount", label: "Consignee", field: "ConsigneeAccount" },
      ],
    };
  },

  mounted() {
    this.loadBookingWebs();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadBookingWebs();
    },

    async loadBookingWebs() {
      this.filteredBookingWebs = await apiGetPendingBookingWebs(this.searchText);
    },

    confirmConvert(row) {
      this.$q
        .dialog({
          title: "Convert to Booking",
          message: `Convert Booking Web <b>${row.BookingWebNo}</b> into a Booking?`,
          html: true,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          const idx = MOCK_PENDING_BOOKING_WEBS.findIndex((b) => b.BookingWebId === row.BookingWebId);
          if (idx !== -1) MOCK_PENDING_BOOKING_WEBS.splice(idx, 1);
          this.$q.notify({
            message: "Converted to Booking (mock) — not yet wired to DMSBooking.vue",
            color: "positive",
            position: "top",
          });
          this.loadBookingWebs();
        });
    },
  },
};
</script>
