<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Delivery Register Screen</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="fact_check" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredRows.length }}</span>
                <span class="total-stat-label">Deliveries</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — every captured delivery, joined with its booking
               (mirrors DEL_DeliveryENT + the booking it links to). ── -->
          <q-table
            square
            :rows="filteredRows"
            :columns="tableColumns"
            row-key="DeliveryID"
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

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="loadRows"
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

            <template v-slot:body-cell-IsPaymentReceived="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value ? 'positive' : 'orange'"
                  :label="props.value ? 'Received' : 'Pending'"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-print"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="printDelivery(props.row)"
                >
                  <q-tooltip>Print</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { apiGetDeliveryRegister } from "src/data/deliveryData.js";

export default {
  name: "DMSDeliveryRegisterScreen",

  data() {
    return {
      allRows: [],
      filteredRows: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      baseColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "DeliveryNo",
          label: "Delivery No.",
          field: "DeliveryNo",
          sortable: true,
        },
        {
          name: "DeliveryDate",
          label: "Date",
          field: "DeliveryDate",
          sortable: true,
        },
        {
          name: "BookingNo",
          label: "Booking No",
          field: "BookingNo",
          sortable: true,
        },
        { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
        { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "ReceiverName", label: "Receiver", field: "ReceiverName" },
        {
          name: "NetAmount",
          label: "Net Amt.",
          field: "NetAmount",
          align: "right",
        },
        {
          name: "ReceivedAmount",
          label: "Received",
          field: "ReceivedAmount",
          align: "right",
          sortable: true,
        },
        {
          name: "IsPaymentReceived",
          label: "Payment",
          field: "IsPaymentReceived",
          align: "center",
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
      return Math.max(1, Math.ceil(this.filteredRows.length / rows));
    },
  },

  async mounted() {
    await this.loadRows();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.applyFilters();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadRows() {
      this.allRows = await apiGetDeliveryRegister();
      this.applyFilters();
    },

    applyFilters() {
      let result = [...this.allRows];
      if (this.searchText) {
        this.applySearch(result);
      } else {
        this.filteredRows = result;
      }
    },

    applySearch(result) {
      const s = this.searchText.toLowerCase();
      this.filteredRows = result.filter(
        (d) =>
          d.DeliveryNo.toLowerCase().includes(s) ||
          d.BookingNo.toLowerCase().includes(s) ||
          (d.ReceiverName || "").toLowerCase().includes(s) ||
          (d.ToPartyName || "").toLowerCase().includes(s)
      );
    },

    printDelivery(row) {
      const html = `<!doctype html><html><head><title>${row.DeliveryNo}</title>
        <style>body{font-family:Arial,sans-serif;font-size:12px;padding:16px}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{border:1px solid #ccc;padding:6px 10px;text-align:left}
        h2{margin-bottom:4px}</style></head><body>
        <h2>Delivery Register — ${row.DeliveryNo}</h2>
        <div>Date: ${row.DeliveryDate} &nbsp; Booking No: ${row.BookingNo}</div>
        <table><tbody>
          <tr><th>Consignor</th><td>${row.FromPartyName}</td></tr>
          <tr><th>Consignee</th><td>${row.ToPartyName}</td></tr>
          <tr><th>Route</th><td>${row.FromCity} → ${row.ToCity}</td></tr>
          <tr><th>Receiver</th><td>${row.ReceiverName || "—"}</td></tr>
          <tr><th>Net Amount</th><td>${row.NetAmount}</td></tr>
          <tr><th>Received Amount</th><td>${row.ReceivedAmount}</td></tr>
        </tbody></table>
        </body></html>`;
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
      }
    },
  },
};
</script>
