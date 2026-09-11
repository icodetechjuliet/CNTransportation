<template>
  <div>
    <!-- Old app: OutstandingList / BUK_CashButDebit_PartyWiseDebitList —
         party-wise outstanding (booked-but-not-yet-received) amount
         report, filterable by date range, read-only + print. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Outstanding List</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="account_balance" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredRows.length }}</span>
                <span class="total-stat-label">Parties</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredRows"
            :columns="tableColumns"
            row-key="PartyAccountName"
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
                      placeholder="Search Party"
                      @keyup.enter="loadRows"
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
                    <q-btn flat dense icon="search" class="search-combo-icon-btn" @click="loadRows">
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    no-caps
                    color="primary"
                    icon="print"
                    label="Print"
                    class="q-mx-xs"
                    @click="printReport"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadRows"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:bottom-row>
              <q-tr>
                <q-td class="text-weight-bold">Total</q-td>
                <q-td class="text-right text-weight-bold">{{ totalBooked.toFixed(2) }}</q-td>
                <q-td class="text-right text-weight-bold">{{ totalReceived.toFixed(2) }}</q-td>
                <q-td class="text-right text-weight-bold text-negative">{{ totalOutstanding.toFixed(2) }}</q-td>
              </q-tr>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="account_balance" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.PartyAccountName }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="negative">{{ props.row.OutstandingAmount.toFixed(2) }}</q-badge>
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
// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls (aggregated server-side in a
//  real backend; computed client-side here from a small local mock set).
// ─────────────────────────────────────────────
const MOCK_ROWS = [
  { PartyAccountName: "Balaji xxx Co.", BookedAmount: 12500, ReceivedAmount: 9500 },
  { PartyAccountName: "Rajsani xxx Polymers", BookedAmount: 8200, ReceivedAmount: 8200 },
  { PartyAccountName: "Ring xxx Ltd", BookedAmount: 4600, ReceivedAmount: 2100 },
  { PartyAccountName: "Galaxy xxx Tooling", BookedAmount: 3000, ReceivedAmount: 0 },
];

function apiGetOutstanding(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = MOCK_ROWS.map((r) => ({ ...r, OutstandingAmount: r.BookedAmount - r.ReceivedAmount }));
      if (search) {
        const s = search.toLowerCase();
        result = result.filter((r) => r.PartyAccountName.toLowerCase().includes(s));
      }
      resolve(result);
    }, 150);
  });
}

export default {
  name: "DMSBookingOutstandingList",

  data() {
    return {
      filteredRows: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      tableColumns: [
        { name: "PartyAccountName", label: "Party", field: "PartyAccountName", sortable: true },
        { name: "BookedAmount", label: "Booked Amt.", field: "BookedAmount", align: "right", sortable: true },
        { name: "ReceivedAmount", label: "Received Amt.", field: "ReceivedAmount", align: "right", sortable: true },
        { name: "OutstandingAmount", label: "Outstanding", field: "OutstandingAmount", align: "right", sortable: true },
      ],
    };
  },

  computed: {
    totalBooked() {
      return this.filteredRows.reduce((s, r) => s + r.BookedAmount, 0);
    },
    totalReceived() {
      return this.filteredRows.reduce((s, r) => s + r.ReceivedAmount, 0);
    },
    totalOutstanding() {
      return this.filteredRows.reduce((s, r) => s + r.OutstandingAmount, 0);
    },
  },

  mounted() {
    this.loadRows();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.loadRows();
    },

    async loadRows() {
      this.filteredRows = await apiGetOutstanding(this.searchText);
    },

    printReport() {
      this.$q.notify({ message: "Outstanding List print — not yet wired to a PDF export.", color: "info", position: "top" });
    },
  },
};
</script>
