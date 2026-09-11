<template>
  <div>
    <!-- Read-only audit trail — no "Add" affordance (the old app's
         BUK_BookingLog is system-generated on every booking change), just
         a view action per row and a "Delete By Date" bulk-purge utility. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Log</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="history" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredLogs.length }}</span>
                <span class="total-stat-label">Total Entries</span>
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
            row-key="LogId"
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
                    <q-btn flat dense icon="search" class="search-combo-icon-btn" @click="loadLogs">
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    no-caps
                    color="negative"
                    icon="delete_sweep"
                    label="Delete By Date"
                    class="q-mx-xs"
                    @click="showDeleteByDateDialog = true"
                  />

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

            <template v-slot:body-cell-OperationType="props">
              <q-td :props="props">
                <q-badge :color="opColor(props.value)" :label="props.value" />
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
                  @click="viewLog(props.row)"
                  ><q-tooltip>View</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.LogId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="history" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
                      <span class="mjc-job-date">{{ props.row.Date }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" :color="opColor(props.row.OperationType)">
                      {{ props.row.OperationType }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.LogId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-eye" label="View" class="mjc-btn mjc-btn-view" @click="viewLog(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.LogId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">User</span><span class="mjc-detail-value">{{ props.row.UserName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">From</span><span class="mjc-detail-value">{{ props.row.OperationFrom || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Net Amt.</span><span class="mjc-detail-value">{{ props.row.NetAmount || "—" }}</span></div>
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
         Delete By Date utility dialog
    ══════════════════════════════════════ -->
    <q-dialog v-model="showDeleteByDateDialog" persistent>
      <q-card style="min-width: 320px">
        <q-card-section class="text-subtitle1">Delete Log Entries By Date</q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <span class="field-label">From Date</span>
              <q-input square dense outlined bg-color="blue-1" v-model="deleteFromDate" placeholder="dd/mm/yyyy" />
            </div>
            <div class="col-6">
              <span class="field-label">To Date</span>
              <q-input square dense outlined bg-color="blue-1" v-model="deleteToDate" placeholder="dd/mm/yyyy" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated color="negative" label="Delete" @click="deleteByDate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls. BUK_BookingLog in the old app
//  is system-written on every booking Save/Edit, so there is no manual
//  apiSaveLog here — only read + the bulk "Delete By Date" purge.
// ─────────────────────────────────────────────
const MOCK_LOGS = [
  {
    LogId: 1,
    BookingNo: "RKG21040001",
    BookingDate: "01/04/2026",
    Date: "01/04/2026 10:33 AM",
    OperationType: "Insert",
    OperationFrom: "Booking Screen",
    UserName: "CargoNet User",
    FreightAmount: 200,
    DoorDeliveryAmount: 0,
    DoorCollectionAmount: 0,
    OtherAmount: 50,
    DiscountAmount: 0,
    TotalTaxAmount: 12.5,
    NetAmount: 262.5,
    ReceivedAmount: 0,
    KasarAmount: 0,
  },
  {
    LogId: 2,
    BookingNo: "RKG21040001",
    BookingDate: "01/04/2026",
    Date: "02/04/2026 09:12 AM",
    OperationType: "Update",
    OperationFrom: "Booking Screen",
    UserName: "Admin",
    FreightAmount: 200,
    DoorDeliveryAmount: 0,
    DoorCollectionAmount: 0,
    OtherAmount: 50,
    DiscountAmount: 0,
    TotalTaxAmount: 12.5,
    NetAmount: 262.5,
    ReceivedAmount: 262.5,
    KasarAmount: 0,
  },
];

function apiGetLogs(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_LOGS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (l) => l.BookingNo.toLowerCase().includes(s) || (l.UserName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiGetLogById(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_LOGS.find((l) => l.LogId === id) || null), 100);
  });
}

// Consumed by DMSBookingLogView.vue.
export { apiGetLogById };

export default {
  name: "DMSBookingLog",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      logs: [],
      filteredLogs: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDeleteByDateDialog: false,
      deleteFromDate: "",
      deleteToDate: "",

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "BookingNo", label: "Booking No.", field: "BookingNo", sortable: true },
        { name: "Date", label: "Log Date/Time", field: "Date", sortable: true },
        { name: "OperationType", label: "Operation", field: "OperationType", align: "center" },
        { name: "OperationFrom", label: "From", field: "OperationFrom" },
        { name: "UserName", label: "User", field: "UserName" },
        { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right" },
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

    opColor(op) {
      const map = { Insert: "positive", Update: "orange", Delete: "negative" };
      return map[op] || "grey";
    },

    async loadLogs() {
      this.filteredLogs = await apiGetLogs(this.searchText);
    },

    viewLog(row) {
      if (this.openTab) {
        this.openTab(`/DMSBookingLogView?logId=${row.LogId}`, `Log ${row.BookingNo || ""}`.trim());
      }
    },

    deleteByDate() {
      if (!this.deleteFromDate || !this.deleteToDate) {
        this.$q.notify({ message: "From Date and To Date are required", color: "negative", position: "top" });
        return;
      }
      this.$q.notify({
        message: `Log entries from ${this.deleteFromDate} to ${this.deleteToDate} deleted (mock)`,
        color: "negative",
        position: "top",
      });
      this.showDeleteByDateDialog = false;
    },
  },
};
</script>
