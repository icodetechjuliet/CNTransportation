<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking List - Cheque Posting</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="fa-solid fa-money-check" size="16px" />
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

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    style="width: 150px"
                    class="q-mx-xs"
                    @update:model-value="loadBookings"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="fromDate"
                            mask="YYYY-MM-DD"
                            @update:model-value="loadBookings"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
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
                    style="width: 150px"
                    class="q-mx-xs"
                    @update:model-value="loadBookings"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="toDate"
                            mask="YYYY-MM-DD"
                            @update:model-value="loadBookings"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
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
                    @click="loadBookings"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-IsPosted="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value ? 'positive' : 'orange'"
                  :label="props.value ? 'Posted' : 'Pending'"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  v-if="!props.row.IsPosted"
                  icon="fa-solid fa-money-check"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="openPostDialog(props.row)"
                >
                  <q-tooltip>Post Cheque</q-tooltip>
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
                    <div class="mjc-job-badge">
                      <q-icon name="fa-solid fa-money-check" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.BookingDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="props.row.IsPosted ? 'positive' : 'orange'"
                    >
                      {{ props.row.IsPosted ? "Posted" : "Pending" }}
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
                    v-if="!props.row.IsPosted"
                    dense
                    unelevated
                    icon="fa-solid fa-money-check"
                    label="Post Cheque"
                    class="mjc-btn mjc-btn-edit"
                    @click="openPostDialog(props.row)"
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
                        <span class="mjc-detail-label">Cheque No.</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ChequeNo || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Cheque Date</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ChequeDate || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Bank Name</span>
                        <span class="mjc-detail-value">
                          {{ props.row.BankName || "—" }}
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

    <!-- ══════════════════════════════════════
         Post Cheque Dialog — compact, non-maximized, same shape as
         DMSBookingLog.vue's "Delete By Date" dialog.
    ══════════════════════════════════════ -->
    <q-dialog v-model="showPostDialog" persistent>
      <q-card style="min-width: 340px">
        <q-card-section class="text-subtitle1">
          Post Cheque — {{ postForm.BookingNo }}
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm items-start">
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                label="Cheque No."
                square
                dense
                outlined
                bg-color="blue-1"
                v-model="postForm.ChequeNo"
              />
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                label="Cheque Date"
                square
                dense
                outlined
                bg-color="blue-1"
                v-model="postForm.ChequeDate"
                placeholder="dd/mm/yyyy"
              />
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                label="Bank Name"
                square
                dense
                outlined
                bg-color="blue-1"
                v-model="postForm.BankName"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            label="Save"
            @click="savePostCheque"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls. This page mirrors the old
//  app's Booking_CashBookingWithChequePayment / BUK_Booking_BookingList_
//  ChequePosting worklist: bookings paid by cheque awaiting the cheque's
//  bank details to be posted/cleared. Local mock data only.
// ─────────────────────────────────────────────
const MOCK_CHEQUE_BOOKINGS = [
  {
    BookingId: 1,
    BookingNo: "RKG21040006",
    BookingDate: "01/04/2026",
    ConsignorName: "Carver xxx Ltd",
    ConsigneeName: "Carver xxx Ltd",
    NetAmt: "425.00",
    PaymentMode: "Cheque",
    ChequeNo: "",
    ChequeDate: "",
    BankName: "",
    IsPosted: false,
  },
  {
    BookingId: 2,
    BookingNo: "RKG21040007",
    BookingDate: "02/04/2026",
    ConsignorName: "Balaji xxx Co.",
    ConsigneeName: "Galaxy xxx Tooling",
    NetAmt: "312.50",
    PaymentMode: "Cheque",
    ChequeNo: "CHQ100234",
    ChequeDate: "01/04/2026",
    BankName: "HDFC Bank",
    IsPosted: true,
  },
  {
    BookingId: 3,
    BookingNo: "RKG21040008",
    BookingDate: "03/04/2026",
    ConsignorName: "Rajsani xxx Polymers",
    ConsigneeName: "Ring xxx Ltd",
    NetAmt: "580.75",
    PaymentMode: "Cheque",
    ChequeNo: "",
    ChequeDate: "",
    BankName: "",
    IsPosted: false,
  },
];

function apiGetChequeBookings(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_CHEQUE_BOOKINGS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (b) =>
            b.BookingNo.toLowerCase().includes(s) ||
            (b.ConsignorName || "").toLowerCase().includes(s) ||
            (b.ConsigneeName || "").toLowerCase().includes(s) ||
            (b.ChequeNo || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export default {
  name: "DMSBookingChequePosting",

  data() {
    return {
      bookings: [],
      filteredBookings: [],
      searchText: "",
      fromDate: this.defaultFromDate(),
      toDate: this.defaultToDate(),
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showPostDialog: false,
      postForm: {
        BookingId: null,
        BookingNo: "",
        ChequeNo: "",
        ChequeDate: "",
        BankName: "",
      },

      tableColumns: [
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
        { name: "ChequeNo", label: "Cheque No.", field: "ChequeNo" },
        {
          name: "IsPosted",
          label: "Status",
          field: "IsPosted",
          align: "center",
        },
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

    defaultFromDate() {
      return "2026-04-01";
    },

    defaultToDate() {
      return "2026-04-03";
    },

    // BookingDate here is "DD/MM/YYYY" — convert to a lexically-comparable
    // "YYYY-MM-DD" to compare against fromDate/toDate.
    parseDMYDate(str) {
      if (!str) return null;
      const parts = String(str).split(" ")[0].split("/");
      if (parts.length !== 3) return null;
      const [d, m, y] = parts;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    },

    async loadBookings() {
      let result = await apiGetChequeBookings(this.searchText);
      result = result.filter((b) => {
        const bd = this.parseDMYDate(b.BookingDate);
        if (!bd) return true;
        if (this.fromDate && bd < this.fromDate) return false;
        if (this.toDate && bd > this.toDate) return false;
        return true;
      });
      this.filteredBookings = result;
    },

    openPostDialog(row) {
      this.postForm = {
        BookingId: row.BookingId,
        BookingNo: row.BookingNo,
        ChequeNo: row.ChequeNo || "",
        ChequeDate: row.ChequeDate || "",
        BankName: row.BankName || "",
      };
      this.showPostDialog = true;
    },

    savePostCheque() {
      const row = MOCK_CHEQUE_BOOKINGS.find(
        (b) => b.BookingId === this.postForm.BookingId
      );
      if (row) {
        row.ChequeNo = this.postForm.ChequeNo;
        row.ChequeDate = this.postForm.ChequeDate;
        row.BankName = this.postForm.BankName;
        row.IsPosted = true;
      }
      this.$q.notify({
        message: "Cheque posted!",
        color: "positive",
        position: "top",
      });
      this.showPostDialog = false;
      this.loadBookings();
    },
  },
};
</script>
