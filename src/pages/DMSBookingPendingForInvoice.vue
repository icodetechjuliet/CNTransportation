<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking List - Pending For Invoice</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="fa-solid fa-file-invoice-dollar" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredBookings.length }}
                </span>
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
                    <q-btn
                      flat
                      dense
                      icon="search"
                      class="search-combo-icon-btn"
                      @click="loadBookings"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    no-caps
                    icon="fa-solid fa-file-invoice-dollar"
                    label="Generate Invoice for Selected"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-mx-xs"
                    @click="generateInvoiceForSelected"
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

            <template v-slot:header-cell-select="props">
              <q-th :props="props">
                <q-checkbox
                  dense
                  v-model="selectAll"
                  color="orange"
                  @update:model-value="toggleSelectAll"
                />
              </q-th>
            </template>

            <template v-slot:body-cell-select="props">
              <q-td :props="props">
                <q-checkbox
                  dense
                  v-model="selectedIds"
                  :val="props.row.BookingId"
                  color="orange"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-file-invoice-dollar"
                  color="positive"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="addToInvoice(props.row)"
                >
                  <q-tooltip>Add To Invoice</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.BookingId)"
                >
                  <div class="mjc-header-left">
                    <q-checkbox
                      dense
                      v-model="selectedIds"
                      :val="props.row.BookingId"
                      color="orange"
                      class="q-mr-xs"
                      @click.stop
                    />
                    <div class="mjc-job-badge">
                      <q-icon
                        name="fa-solid fa-file-invoice-dollar"
                        size="14px"
                      />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.BookingDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="orange">
                      Pending
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.BookingId)
                          ? 'expand_less'
                          : 'expand_more'
                      "
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-file-invoice-dollar"
                    label="Add To Invoice"
                    class="mjc-btn mjc-btn-edit"
                    @click="addToInvoice(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.BookingId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignor</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsignorName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignee</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsigneeName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Net Amt.</span>
                        <span class="mjc-detail-value">
                          {{ props.row.NetAmt || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Payment Type</span>
                        <span class="mjc-detail-value">
                          {{ props.row.PaymentType || "—" }}
                        </span>
                      </div>
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
//  app's Booking_PendingForSIList worklist: bookings not yet included in
//  any Sale Invoice (SI), awaiting invoicing. Local mock data only.
// ─────────────────────────────────────────────
const MOCK_INVOICE_PENDING_BOOKINGS = [
  {
    BookingId: 1,
    BookingNo: "RKG21040004",
    BookingDate: "01/04/2026",
    ConsignorName: "Mona xxx Llp",
    ConsigneeName: "Sumit xxx Fasteners",
    NetAmt: "160.65",
    PaymentType: "TBBR",
  },
  {
    BookingId: 2,
    BookingNo: "RKG21040005",
    BookingDate: "01/04/2026",
    ConsignorName: "Nepolion xxx Packaging",
    ConsigneeName: "Krishna xxx Wire...",
    NetAmt: "189.00",
    PaymentType: "Paid",
  },
  {
    BookingId: 3,
    BookingNo: "RKG21040006",
    BookingDate: "01/04/2026",
    ConsignorName: "Carver xxx Ltd",
    ConsigneeName: "Carver xxx Ltd",
    NetAmt: "425.00",
    PaymentType: "Paid",
  },
];

function apiGetInvoicePendingBookings(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_INVOICE_PENDING_BOOKINGS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (b) =>
            b.BookingNo.toLowerCase().includes(s) ||
            (b.ConsignorName || "").toLowerCase().includes(s) ||
            (b.ConsigneeName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export default {
  name: "DMSBookingPendingForInvoice",

  data() {
    return {
      bookings: [],
      filteredBookings: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      selectAll: false,
      selectedIds: [],

      tableColumns: [
        { name: "select", label: "", field: "select" },
        { name: "action", label: "Action", field: "action" },
        {
          name: "BookingNo",
          label: "Booking No.",
          field: "BookingNo",
          sortable: true,
        },
        {
          name: "BookingDate",
          label: "Date",
          field: "BookingDate",
          sortable: true,
        },
        { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
        { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
        { name: "NetAmt", label: "Net Amt.", field: "NetAmt", align: "right" },
        { name: "PaymentType", label: "Payment Type", field: "PaymentType" },
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
      this.filteredBookings = await apiGetInvoicePendingBookings(
        this.searchText
      );
      this.selectedIds = [];
      this.selectAll = false;
    },

    toggleSelectAll(value) {
      this.selectedIds = value
        ? this.filteredBookings.map((b) => b.BookingId)
        : [];
    },

    addToInvoice() {
      this.$q.notify({
        message: "Add to Sale Invoice — not yet wired to a Sale Invoice module",
        color: "info",
        position: "top",
      });
    },

    generateInvoiceForSelected() {
      if (!this.selectedIds.length) {
        this.$q.notify({
          message: "Select at least one booking",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.$q.notify({
        message: `Add to Sale Invoice — not yet wired to a Sale Invoice module (${this.selectedIds.length} selected)`,
        color: "info",
        position: "top",
      });
    },
  },
};
</script>
