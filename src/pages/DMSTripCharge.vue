<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Trip Charge</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="receipt_long" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ totalAmount }}</span>
                <span class="total-stat-label">Total Charges</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — extra costs booked against a trip (fuel, toll,
               loading/unloading, detention, …), mirrors the legacy
               EagleParcel TRP_TripCharge module. ── -->
          <q-table
            square
            :rows="filteredCharges"
            :columns="tableColumns"
            row-key="ChargeId"
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
                    flat
                    dense
                    no-caps
                    label="New Charge"
                    class="add_new_job m_add_newjob bg-dblue-lblue"
                    @click="openAddCharge"
                  />

                  <q-select
                    square=""
                    v-model="tripFilter"
                    :options="tripOptions"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="min-width: 180px"
                    class="q-mx-xs"
                    label="Trip No."
                    @update:model-value="applyFilters"
                  />

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    style="width: 140px"
                    class="q-ml-sm"
                    @update:model-value="applyFilters"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="fromDate" mask="DD/MM/YYYY" color="black">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="black"
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
                    style="width: 140px"
                    class="q-ml-xs"
                    @update:model-value="applyFilters"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="toDate" mask="DD/MM/YYYY" color="black">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="black"
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
                    @click="applyFilters"
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

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editCharge(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="print"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style prt q-ml-xs"
                  @click="printCharge(props.row)"
                >
                  <q-tooltip>Print</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style q-ml-xs"
                  @click="deleteCharge(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="receipt_long" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.TripNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.ChargeDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <span class="mjc-job-no">{{ props.row.Amount }}</span>
                  </div>
                </div>
                <div class="mjc-actions">
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-pen-to-square"
                    label="Edit"
                    class="mjc-btn mjc-btn-edit"
                    @click="editCharge(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="print"
                    label="Print"
                    class="mjc-btn mjc-btn-edit"
                    @click="printCharge(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-view"
                    @click="deleteCharge(props.row)"
                  />
                </div>
                <div class="mjc-details">
                  <div class="mjc-details-grid">
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Charge Type</span>
                      <span class="mjc-detail-value">
                        {{ props.row.ChargeType }}
                      </span>
                    </div>
                    <div class="mjc-detail-row">
                      <span class="mjc-detail-label">Remarks</span>
                      <span class="mjc-detail-value">
                        {{ props.row.Remarks || "—" }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <!-- ── Trip charge print — matches EagleParcel
         Reports/Trip/TRP_TripCharge/TRP_TripCharge_Print.rdlc in spirit
         (this list is a flat per-charge ledger rather than the RDLC's
         full per-trip transporter settlement, so the print mirrors this
         page's own fields rather than that fuller layout). Same windowed
         blob+iframe dialog shape as every other print-preview here. ── -->
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
          <q-icon name="receipt_long" size="22px" class="q-mr-sm" />
          <q-toolbar-title>Trip Charge Print Preview</q-toolbar-title>
          <q-badge v-if="printChargeTripNo" class="q-mr-sm print-preview-badge">
            {{ printChargeTripNo }}
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
import { apiGetTrips } from "src/data/tripData.js";
import {
  getCompanyProfile,
  getCompanyLogoDataUrl,
  buildPrintHeaderHtml,
  PRINT_HEADER_CSS,
} from "src/data/companyProfile.js";
import { downloadIframeAsPdf } from "src/Utils/downloadIframePdf.js";

const MOCK_CHARGES = [
  {
    ChargeId: 1,
    TripNo: "TRP20260001",
    ChargeType: "Diesel",
    ChargeDate: "01/04/2026",
    Amount: 4200,
    Remarks: "Full tank at departure.",
  },
  {
    ChargeId: 2,
    TripNo: "TRP20260001",
    ChargeType: "Toll",
    ChargeDate: "01/04/2026",
    Amount: 850,
    Remarks: "",
  },
  {
    ChargeId: 3,
    TripNo: "TRP20260002",
    ChargeType: "Detention",
    ChargeDate: "02/04/2026",
    Amount: 1500,
    Remarks: "Waited 6 hrs at destination dock.",
  },
];

function apiGetCharges() {
  return new Promise((resolve) =>
    setTimeout(() => resolve([...MOCK_CHARGES]), 150)
  );
}

function apiSaveCharge(charge) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (charge.ChargeId) {
        const idx = MOCK_CHARGES.findIndex(
          (c) => c.ChargeId === charge.ChargeId
        );
        if (idx !== -1) MOCK_CHARGES[idx] = { ...charge };
      } else {
        charge.ChargeId = MOCK_CHARGES.length
          ? Math.max(...MOCK_CHARGES.map((c) => c.ChargeId)) + 1
          : 1;
        MOCK_CHARGES.push(charge);
      }
      resolve({ success: true, data: charge });
    }, 200);
  });
}

function apiDeleteCharge(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_CHARGES.findIndex((c) => c.ChargeId === id);
      if (idx !== -1) MOCK_CHARGES.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

export default {
  mixins: [entryNavigation],
  entryReload: "loadCharges",
  name: "DMSTripCharge",

  data() {
    return {
      allCharges: [],
      filteredCharges: [],
      tripFilter: "All",
      tripOptions: ["All"],
      searchText: "",
      fromDate: "01/04/2026",
      toDate: "30/04/2026",
      pagination: { page: 1, rowsPerPage: 15 },

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      showPrintDialog: false,
      printBlobUrl: null,
      printChargeTripNo: "",

      baseColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
        {
          name: "ChargeType",
          label: "Charge Type",
          field: "ChargeType",
          sortable: true,
        },
        {
          name: "ChargeDate",
          label: "Charge Date",
          field: "ChargeDate",
          sortable: true,
        },
        {
          name: "Amount",
          label: "Amount",
          field: "Amount",
          align: "right",
          sortable: true,
        },
        { name: "Remarks", label: "Remarks", field: "Remarks" },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    totalAmount() {
      return this.filteredCharges
        .reduce((sum, c) => sum + (parseFloat(c.Amount) || 0), 0)
        .toFixed(2);
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredCharges.length / rows));
    },
  },

  async mounted() {
    const trips = await apiGetTrips("All", "");
    this.tripOptions = ["All", ...trips.map((t) => t.TripNo)];
    await this.loadCharges();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.applyFilters();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadCharges() {
      this.allCharges = await apiGetCharges();
      this.applyFilters();
    },

    // ChargeDate is stored as a "DD/MM/YYYY" display string.
    parseDMY(value) {
      if (!value) return null;
      const [d, m, y] = value.split("/").map(Number);
      if (!d || !m || !y) return null;
      return new Date(y, m - 1, d);
    },

    applyFilters() {
      let result = [...this.allCharges];
      if (this.tripFilter && this.tripFilter !== "All")
        result = result.filter((c) => c.TripNo === this.tripFilter);
      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        result = result.filter(
          (c) =>
            c.TripNo.toLowerCase().includes(s) ||
            c.ChargeType.toLowerCase().includes(s) ||
            (c.Remarks || "").toLowerCase().includes(s)
        );
      }
      const from = this.parseDMY(this.fromDate);
      const to = this.parseDMY(this.toDate);
      result = result.filter((c) => {
        const d = this.parseDMY(c.ChargeDate);
        if (!d) return true;
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
      this.filteredCharges = result;
    },

    emptyForm() {
      return {
        ChargeId: null,
        TripNo: "",
        ChargeType: "Diesel",
        ChargeDate: "01/04/2026",
        Amount: 0,
        Remarks: "",
      };
    },

    openAddCharge() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSTripChargeForm?mode=${this.dialogMode}&id=${
            this.form.ChargeId || ""
          }`,
          "Trip Charge"
        );
      }
    },

    editCharge(row) {
      this.form = { ...row };
      this.dialogMode = "edit";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSTripChargeForm?mode=${this.dialogMode}&id=${
            this.form.ChargeId || ""
          }`,
          "Trip Charge"
        );
      }
    },

    async printCharge(row) {
      this.printChargeTripNo = row.TripNo;
      const [logoDataUrl, company] = await Promise.all([
        getCompanyLogoDataUrl(),
        getCompanyProfile(),
      ]);
      const html = this.buildChargePrintHtml(row, logoDataUrl, company);
      const blob = new Blob([html], { type: "text/html" });
      if (this.printBlobUrl) URL.revokeObjectURL(this.printBlobUrl);
      this.printBlobUrl = URL.createObjectURL(blob);
      this.showPrintDialog = true;
    },

    downloadPDF() {
      downloadIframeAsPdf(
        this.$refs.reportFrame,
        `TripCharge-${this.printChargeTripNo}`
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

    buildChargePrintHtml(row, logoDataUrl = "", company = {}) {
      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Trip Charge — ${row.TripNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:9pt;color:#000;padding:10px 14px;background:#fff}
  ${PRINT_HEADER_CSS}
  .title{font-size:12pt;font-weight:bold;border-top:2px solid #0178bc;border-bottom:1px solid #0178bc;padding:4px 0;margin-bottom:8px}
  table.kv{width:100%;border-collapse:collapse;border:1px solid #000}
  table.kv td{border:1px solid #000;padding:5px 8px}
  td.lbl{font-weight:700;width:35%;background:#f2f2f2}
  @page{size:A4;margin:10mm}
  @media print{ body{padding:0;margin:0} }
</style>
</head>
<body>
${buildPrintHeaderHtml(logoDataUrl, company)}

<div class="title">Trip Charge &mdash; ${row.TripNo}</div>

<table class="kv">
  <tr><td class="lbl">Trip No.</td><td>${row.TripNo || ""}</td></tr>
  <tr><td class="lbl">Charge Type</td><td>${row.ChargeType || ""}</td></tr>
  <tr><td class="lbl">Charge Date</td><td>${row.ChargeDate || ""}</td></tr>
  <tr><td class="lbl">Amount</td><td>${row.Amount || 0}</td></tr>
  <tr><td class="lbl">Remarks</td><td>${row.Remarks || "—"}</td></tr>
</table>
</body>
</html>`;
    },

    async saveCharge() {
      const res = await apiSaveCharge({ ...this.form });
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Trip charge saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.notifyEntrySaved();
        await this.loadCharges();
      }
    },

    async deleteCharge(row) {
      const res = await apiDeleteCharge(row.ChargeId);
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Trip charge deleted.",
          color: "positive",
          position: "top",
        });
        await this.loadCharges();
      }
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
