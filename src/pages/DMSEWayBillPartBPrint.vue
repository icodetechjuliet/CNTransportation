<template>
  <div>
    <!-- Old app: E Way Bill - Part B - Print — search generated bills and
         (re)print the Part B slip. Same blob+iframe print pattern as the
         Booking family's own print dialogs (e.g. DMSBookingView.vue). -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">E Way Bill - Part B - Print</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="print" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredBills.length }}</span>
                <span class="total-stat-label">Part B Generated</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredBills"
            :columns="tableColumns"
            row-key="EWayBillId"
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
                      @keyup.enter="loadBills"
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
                      @click="loadBills"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="loadBills"
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
                  icon="print"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style prt"
                  @click="printBill(props.row)"
                >
                  <q-tooltip>Print</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <q-dialog
      v-model="showPrintDialog"
      maximized
      @before-hide="closePrintDialog"
    >
      <q-card style="display: flex; flex-direction: column; height: 100%">
        <q-toolbar class="bg-primary text-white">
          <q-icon name="receipt_long" size="22px" class="q-mr-sm" />
          <q-toolbar-title>E-Way Bill Part B Preview</q-toolbar-title>
          <q-btn
            unelevated
            icon="picture_as_pdf"
            label="Download PDF"
            color="white"
            text-color="primary"
            size="sm"
            class="q-mr-sm"
            no-caps
            @click="downloadPDF"
          />
          <q-btn flat round icon="close" @click="closePrintDialog" />
        </q-toolbar>
        <iframe
          ref="reportFrame"
          :src="printBlobUrl"
          style="flex: 1; border: none; width: 100%; background: #f4f4f4"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { apiGetPartBLog } from "src/data/ewayBillData.js";

export default {
  name: "DMSEWayBillPartBPrint",

  data() {
    return {
      filteredBills: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      showPrintDialog: false,
      printBlobUrl: null,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "EWayBillNo",
          label: "E-Way Bill No.",
          field: "EWayBillNo",
          sortable: true,
        },
        { name: "BookingNo", label: "Booking No.", field: "BookingNo" },
        { name: "VehicleNo", label: "Vehicle No.", field: "VehicleNo" },
        { name: "FromPlace", label: "From Place", field: "FromPlace" },
        { name: "PartBDate", label: "Generated On", field: "PartBDate" },
      ],
    };
  },

  mounted() {
    this.loadBills();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.loadBills();
    },

    async loadBills() {
      this.filteredBills = await apiGetPartBLog(this.searchText);
    },

    printBill(bill) {
      const html = this.buildSlipHtml(bill);
      const blob = new Blob([html], { type: "text/html" });
      if (this.printBlobUrl) URL.revokeObjectURL(this.printBlobUrl);
      this.printBlobUrl = URL.createObjectURL(blob);
      this.showPrintDialog = true;
    },

    downloadPDF() {
      if (!this.$refs.reportFrame) return;
      this.$refs.reportFrame.contentWindow.focus();
      this.$refs.reportFrame.contentWindow.print();
    },

    closePrintDialog() {
      this.showPrintDialog = false;
      setTimeout(() => {
        if (this.printBlobUrl) {
          URL.revokeObjectURL(this.printBlobUrl);
          this.printBlobUrl = null;
        }
      }, 500);
    },

    buildSlipHtml(bill) {
      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>E-Way Bill ${bill.EWayBillNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:10pt;color:#000;padding:16px}
  .title{font-size:14pt;font-weight:bold;text-align:center;margin-bottom:10px;text-transform:uppercase}
  table.kv{width:100%;border-collapse:collapse;border:1px solid #000}
  table.kv td{border:1px solid #000;padding:5px 8px}
  td.lbl{font-weight:700;width:35%;background:#f2f2f2}
  @page{size:A4;margin:10mm}
</style>
</head>
<body>
<div class="title">E-Way Bill — Part B</div>
<table class="kv">
  <tr><td class="lbl">E-Way Bill No.</td><td>${bill.EWayBillNo}</td></tr>
  <tr><td class="lbl">Booking No.</td><td>${bill.BookingNo}</td></tr>
  <tr><td class="lbl">Consolidated No.</td><td>${
    bill.ConsolidatedNo || "—"
  }</td></tr>
  <tr><td class="lbl">Vehicle No.</td><td>${bill.VehicleNo}</td></tr>
  <tr><td class="lbl">From Place</td><td>${bill.FromPlace}</td></tr>
  <tr><td class="lbl">Route</td><td>${bill.FromCity} → ${bill.ToCity}</td></tr>
  <tr><td class="lbl">Consignor</td><td>${bill.ConsignorName}</td></tr>
  <tr><td class="lbl">Consignee</td><td>${bill.ConsigneeName}</td></tr>
  <tr><td class="lbl">Document Value</td><td>${bill.DocValue}</td></tr>
  <tr><td class="lbl">Generated On</td><td>${bill.PartBDate}</td></tr>
  <tr><td class="lbl">Generated By</td><td>${bill.GeneratedBy}</td></tr>
</table>
</body>
</html>`;
    },
  },
};
</script>
