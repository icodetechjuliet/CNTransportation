<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Commission</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="percent" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredCommissions.length }}
                </span>
                <span class="total-stat-label">Total Vouchers</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredCommissions"
            :columns="tableColumns"
            row-key="CommissionId"
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
                      @keyup.enter="loadCommissions"
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
                      @click="loadCommissions"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_Commission m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddCommission"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadCommissions"
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
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editCommission(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="print"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style prt"
                  @click="printCommission(props.row)"
                >
                  <q-tooltip>Print</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCommission(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.CommissionId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="percent" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">
                        {{ props.row.CommissionNo }}
                      </span>
                      <span class="mjc-job-date">
                        {{ props.row.CommissionDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="positive">
                      {{ props.row.NetPayable }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.CommissionId)
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
                    icon="fa-solid fa-pen-to-square"
                    label="Edit"
                    class="mjc-btn mjc-btn-edit"
                    @click="editCommission(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="print"
                    label="Print"
                    class="mjc-btn mjc-btn-edit"
                    @click="printCommission(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteCommission(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.CommissionId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Booking Office</span>
                        <span class="mjc-detail-value">
                          {{ props.row.BookingOfficeName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Commission Amt</span>
                        <span class="mjc-detail-value">
                          {{ props.row.CommissionAmount || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">TDS Amt</span>
                        <span class="mjc-detail-value">
                          {{ props.row.TDSAmount || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Net Payable</span>
                        <span class="mjc-detail-value">
                          {{ props.row.NetPayable || "—" }}
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

    <!-- ── Commission voucher print — matches EagleParcel
         Reports/Booking/BUK_Commission/BUK_CommissionPrint_BookingWise.rdlc.
         Same windowed blob+iframe dialog shape as every other print-preview
         in this app (DMSTrip.vue / GenericReportList.vue). ── -->
    <q-dialog v-model="showPrintDialog" @before-hide="closePrintDialog">
      <q-card
        style="
          display: flex;
          flex-direction: column;
          width: 900px;
          max-width: 95vw;
          max-height: 92vh;
          overflow: hidden;
        "
      >
        <q-toolbar class="bg-primary text-white">
          <q-icon name="percent" size="22px" class="q-mr-sm" />
          <q-toolbar-title>Commission Print Preview</q-toolbar-title>
          <q-badge v-if="printCommissionNo" class="q-mr-sm print-preview-badge">
            {{ printCommissionNo }}
          </q-badge>
          <q-btn flat round icon="download" @click="downloadPDF">
            <q-tooltip>Download</q-tooltip>
          </q-btn>
          <q-btn flat round icon="print" @click="printFrame">
            <q-tooltip>Print</q-tooltip>
          </q-btn>
          <q-btn flat round icon="close" @click="closePrintDialog">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-toolbar>
        <div style="overflow-y: auto; flex: 1 1 auto">
          <iframe
            ref="reportFrame"
            :src="printBlobUrl"
            style="border: none; width: 100%; display: block"
            @load="onPrintFrameLoad"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import entryNavigation from "src/mixins/entryNavigation.js";
// Commission data/mock-"backend" now lives in its own module,
// src/data/bookingData.js (localStorage-backed, so add/edit/delete persist
// like a real DB) — every Booking-family page imports from there directly
// instead of from this page.
import {
  apiGetCommissions,
  apiSaveCommission,
  apiDeleteCommission,
  apiGetCommissionById,
  MOCK_DATA_BK_COMMISSION as MOCK_DATA,
} from "src/data/bookingData.js";
import {
  getCompanyProfile,
  getCompanyLogoDataUrl,
  buildPrintHeaderHtml,
  PRINT_HEADER_CSS,
} from "src/data/companyProfile.js";
import { downloadIframeAsPdf } from "src/Utils/downloadIframePdf.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadCommissions",
  name: "DMSCommission",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      commissions: [],
      filteredCommissions: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      showPrintDialog: false,
      printBlobUrl: null,
      printCommissionNo: "",

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "CommissionNo",
          label: "Commission No.",
          field: "CommissionNo",
          sortable: true,
        },
        {
          name: "CommissionDate",
          label: "Commission Date",
          field: "CommissionDate",
          sortable: true,
        },
        {
          name: "BookingOfficeName",
          label: "Booking Office",
          field: "BookingOfficeName",
          sortable: true,
        },
        {
          name: "CommissionAmount",
          label: "Commission Amt",
          field: "CommissionAmount",
          align: "right",
        },
        {
          name: "NetPayable",
          label: "Net Payable",
          field: "NetPayable",
          align: "right",
        },
      ],
    };
  },

  mounted() {
    this.loadCommissions();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadCommissions();
    },

    async loadCommissions() {
      this.filteredCommissions = await apiGetCommissions(this.searchText);
    },

    calcTDS() {
      const amount = parseFloat(this.form.CommissionAmount) || 0;
      const pct = parseFloat(this.form.TDSPCT) || 0;
      const tds = this.form.IsDeductTDS ? (amount * pct) / 100 : 0;
      this.form.TDSAmount = tds.toFixed(2);
      this.form.NetPayable = (amount - tds).toFixed(2);
    },

    emptyForm() {
      return {
        CommissionId: null,
        CommissionNo: "",
        CommissionDate: "",
        BookingOfficeName: "",
        CommissionAmount: 0,
        IsDeductTDS: false,
        TDSPCT: 0,
        TDSAmount: "0.00",
        NetPayable: "0.00",
        Remarks: "",
      };
    },

    openAddCommission() {
      this.openEntryPage("/DMSCommissionView?mode=add", "New Commission");
    },

    editCommission(row) {
      this.openEntryPage(
        `/DMSCommissionView?mode=edit&commissionId=${row.CommissionId}`,
        `Commission ${row.CommissionNo || ""}`.trim()
      );
    },

    async printCommission(row) {
      this.printCommissionNo = row.CommissionNo;
      const [logoDataUrl, company] = await Promise.all([
        getCompanyLogoDataUrl(),
        getCompanyProfile(),
      ]);
      const html = this.buildCommissionPrintHtml(row, logoDataUrl, company);
      const blob = new Blob([html], { type: "text/html" });
      if (this.printBlobUrl) URL.revokeObjectURL(this.printBlobUrl);
      this.printBlobUrl = URL.createObjectURL(blob);
      this.showPrintDialog = true;
    },

    downloadPDF() {
      downloadIframeAsPdf(
        this.$refs.reportFrame,
        `Commission-${this.printCommissionNo}`
      );
    },

    printFrame() {
      if (!this.$refs.reportFrame) return;
      this.$refs.reportFrame.contentWindow.focus();
      this.$refs.reportFrame.contentWindow.print();
    },

    onPrintFrameLoad() {
      const frame = this.$refs.reportFrame;
      if (!frame || !frame.contentDocument) return;
      const height = frame.contentDocument.documentElement.scrollHeight;
      frame.style.height = `${height}px`;
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

    buildCommissionPrintHtml(row, logoDataUrl = "", company = {}) {
      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Commission — ${row.CommissionNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:9pt;color:#000;padding:10px 14px;background:#fff}
  ${PRINT_HEADER_CSS}
  .title{font-size:12pt;font-weight:bold;border-top:2px solid #0178bc;border-bottom:1px solid #0178bc;padding:4px 0;margin-bottom:8px}
  table.kv{width:100%;border-collapse:collapse;border:1px solid #000}
  table.kv td{border:1px solid #000;padding:5px 8px}
  td.lbl{font-weight:700;width:35%;background:#f2f2f2}
  .net-row td{font-weight:700}
  @page{size:A4;margin:10mm}
  @media print{ body{padding:0;margin:0} }
</style>
</head>
<body>
${buildPrintHeaderHtml(logoDataUrl, company)}

<div class="title">Commission Voucher &mdash; ${row.CommissionNo}</div>

<table class="kv">
  <tr><td class="lbl">Commission No.</td><td>${row.CommissionNo || ""}</td></tr>
  <tr><td class="lbl">Commission Date</td><td>${row.CommissionDate || ""}</td></tr>
  <tr><td class="lbl">Booking Office</td><td>${row.BookingOfficeName || ""}</td></tr>
  <tr><td class="lbl">Commission Amount</td><td>${row.CommissionAmount || 0}</td></tr>
  <tr><td class="lbl">TDS ${row.IsDeductTDS ? `(${row.TDSPCT}%)` : ""}</td><td>${row.TDSAmount || "0.00"}</td></tr>
  <tr class="net-row"><td class="lbl">Net Payable</td><td>${row.NetPayable || "0.00"}</td></tr>
  <tr><td class="lbl">Remarks</td><td>${row.Remarks || "—"}</td></tr>
</table>
</body>
</html>`;
    },

    async saveCommission() {
      if (!this.form.CommissionDate || !this.form.BookingOfficeName) {
        this.$q.notify({
          message: "Commission Date and Booking Office are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.calcTDS();
      const res = await apiSaveCommission({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Commission saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadCommissions();
      }
    },

    confirmDeleteCommission(row) {
      this.$q
        .dialog({
          title: "Delete Commission",
          message: `Delete commission voucher <b>${row.CommissionNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteCommission(row.CommissionId);
          this.$q.notify({
            message: "Commission deleted",
            color: "negative",
            position: "top",
          });
          this.loadCommissions();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>

<style scoped>
.print-preview-badge {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: #fff;
  font-weight: 500;
}
</style>
