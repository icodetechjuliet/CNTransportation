<template>
  <div>
    <!-- Read-only audit list — no "Add" affordance (the old app's
         BUK_BookingDeleteLog is system-inserted whenever a booking is
         deleted, capturing a full snapshot plus who/when/why). -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Delete Log</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="delete_history" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredLogs.length }}</span>
                <span class="total-stat-label">Total Deletions</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredLogs"
            :columns="tableColumns"
            row-key="DeleteLogId"
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
                      @keyup.enter="loadLogs"
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
                      @click="loadLogs"
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
                    @update:model-value="loadLogs"
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
                            @update:model-value="loadLogs"
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
                    @update:model-value="loadLogs"
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
                            @update:model-value="loadLogs"
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
                    @click="loadLogs"
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
                  icon="fa-solid fa-eye"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style vw"
                  @click="viewLog(props.row)"
                >
                  <q-tooltip>View</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.DeleteLogId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="delete_history" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.DeleteDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="negative">
                      Deleted
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.DeleteLogId)
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
                    icon="fa-solid fa-eye"
                    label="View"
                    class="mjc-btn mjc-btn-view"
                    @click="viewLog(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.DeleteLogId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Deleted By</span>
                        <span class="mjc-detail-value">
                          {{ props.row.DeleteUserName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Reason</span>
                        <span class="mjc-detail-value">
                          {{ props.row.DeleteRemarks || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Net Amt.</span>
                        <span class="mjc-detail-value">
                          {{ props.row.NetAmt || "—" }}
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
//  Mock data — replace with real axios calls. Rows here are system-inserted
//  whenever DMSBooking.vue's confirmDeleteBooking() reason prompt commits a
//  delete — this page only reads them back.
// ─────────────────────────────────────────────
const MOCK_DELETE_LOGS = [
  {
    DeleteLogId: 1,
    BookingNo: "RKG21030099",
    BookingDate: "30/03/2026",
    BookingTime: "04:15 PM",
    BookingType: "Outward",
    BookedFrom: "Greenland",
    Load: "own",
    Carrier: "Own",
    PaymentType: "TBBS",
    PaymentMode: "Cash",
    FromCity: "Rajkot-G",
    ToCity: "Chakan",
    DeliveryCity: "",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Chakan",
    ConsignorAccount: "Balaji xxx Co.",
    ConsignorName: "Balaji xxx Co.",
    ConsignorPhone: "",
    FromGSTNo: "24BUHPS2708D1ZT",
    FromAddress: "Rajkot-G – Gujarat",
    ConsigneeAccount: "Select Party",
    ConsigneeName: "Galaxy xxx Tooling",
    ConsigneePhone: "",
    ToGSTNo: "27ATJPB8586E1ZF",
    ToAddress: "Chakan-Maharashtra-27",
    EWayBillNo: "601284646000",
    BillNo: "80",
    BillValue: 4000,
    TotalAmt: "250.00",
    LockDate: "",
    LockBy: "",
    Item: "Box",
    PartNo: "",
    Quantity: 1,
    Weight: 20,
    Rate: 10,
    FreightAmount: 200,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: false,
    OtherAmt: 0,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "6.25",
    SGSTRate: 2.5,
    SGSTAmt: "6.25",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalTax: "12.50",
    Discount: 0,
    NetAmt: "262.50",
    Received: 0,
    BookingTime2: "",
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    Remarks: "",
    DisplayRemarks: "",
    DeleteDate: "31/03/2026 10:00 AM",
    DeleteUserName: "Admin",
    DeleteRemarks: "Duplicate entry raised twice by counter staff",
    EntryType: "Manual",
  },
];

function apiGetDeleteLogs(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_DELETE_LOGS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (l) =>
            l.BookingNo.toLowerCase().includes(s) ||
            (l.DeleteUserName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiGetDeleteLogById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_DELETE_LOGS.find((l) => l.DeleteLogId === id) || null),
      100
    );
  });
}

// Consumed by DMSBookingDeleteLogView.vue.
export { apiGetDeleteLogById };

export default {
  name: "DMSBookingDeleteLog",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      logs: [],
      filteredLogs: [],
      searchText: "",
      fromDate: this.defaultFromDate(),
      toDate: this.defaultToDate(),
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "BookingNo",
          label: "Booking No.",
          field: "BookingNo",
          sortable: true,
        },
        { name: "BookingDate", label: "Booking Date", field: "BookingDate" },
        {
          name: "DeleteDate",
          label: "Deleted On",
          field: "DeleteDate",
          sortable: true,
        },
        {
          name: "DeleteUserName",
          label: "Deleted By",
          field: "DeleteUserName",
        },
        { name: "DeleteRemarks", label: "Reason", field: "DeleteRemarks" },
        { name: "NetAmt", label: "Net Amt.", field: "NetAmt", align: "right" },
      ],
    };
  },

  mounted() {
    this.loadLogs();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadLogs();
    },

    defaultFromDate() {
      return "2026-03-30";
    },

    defaultToDate() {
      return "2026-03-31";
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

    async loadLogs() {
      let result = await apiGetDeleteLogs(this.searchText);
      result = result.filter((l) => {
        const bd = this.parseDMYDate(l.BookingDate);
        if (!bd) return true;
        if (this.fromDate && bd < this.fromDate) return false;
        if (this.toDate && bd > this.toDate) return false;
        return true;
      });
      this.filteredLogs = result;
    },

    viewLog(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSBookingDeleteLogView?logId=${row.DeleteLogId}`,
          `Deleted ${row.BookingNo || ""}`.trim()
        );
      }
    },
  },
};
</script>
