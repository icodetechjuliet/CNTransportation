<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">{{ def.title }}</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon :name="def.icon" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredRows.length }}</span>
                <span class="total-stat-label">Records</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── EagleParcel-style filter bar — only shown for reports whose
               def declares `filters` (Covering Letter / Door Delivery
               Summary / SI Register - Account - Service Tax so far),
               matching the legacy WinForms From Date/To Date + Account
               or Vehicle or Party + Show(/Change) screens. ── -->
          <div v-if="def.filters" class="row items-end q-col-gutter-sm q-px-sm q-pb-sm eagle-filter-bar">
            <div class="col-auto" style="min-width: 160px">
              <SearchDateInput v-model="filters.fromDate" label="From Date" />
            </div>
            <div class="col-auto" style="min-width: 160px">
              <SearchDateInput v-model="filters.toDate" label="To Date" />
            </div>
            <div v-if="def.filters.select" class="col-auto" style="min-width: 200px">
              <q-select
                square
                outlined
                dense
                clearable
                bg-color="blue-1"
                v-model="filters.selectValue"
                :options="selectOptions"
                :label="def.filters.select.label"
                :placeholder="`Select ${def.filters.select.label}`"
              />
            </div>

            <template v-if="def.filters.extra">
              <template v-if="def.filters.extra.includes('printMonth')">
                <div class="col-auto" style="min-width: 130px">
                  <q-input
                    square
                    outlined
                    dense
                    bg-color="blue-1"
                    v-model="filters.printMonth"
                    label="Print Month"
                  />
                </div>
                <div class="col-auto" style="min-width: 160px">
                  <SearchDateInput v-model="filters.printDate" label="Date" />
                </div>
              </template>
              <template v-if="def.filters.extra.includes('outstanding')">
                <div class="col-auto" style="min-width: 130px">
                  <q-input
                    square
                    outlined
                    dense
                    bg-color="blue-1"
                    v-model="filters.outstanding"
                    label="Outstanding"
                  />
                </div>
                <div class="col-auto" style="min-width: 160px">
                  <SearchDateInput v-model="filters.outstandingDate" label="Date" />
                </div>
              </template>
              <div
                v-if="def.filters.extra.includes('headerFooter')"
                class="col-auto flex items-center"
                style="height: 40px"
              >
                <q-checkbox v-model="filters.headerFooter" label="Header Footer" dense />
              </div>
            </template>

            <div class="col-auto">
              <q-btn
                unelevated
                no-caps
                color="primary"
                label="Show"
                class="m-btn-style"
                @click="applyFilter"
              />
            </div>
            <div v-if="def.filters.changeButton" class="col-auto">
              <q-btn outline no-caps label="Change" @click="resetExtraFilters" />
            </div>
          </div>
          <div v-if="def.filters" class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Report/list only — no add/edit, this mirrors a read-only
               screen from the legacy EagleParcel WinForms app. ── -->
          <q-table
            square
            :rows="filteredRows"
            :columns="tableColumns"
            row-key="__rowKey"
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
                      @keyup.enter="applyFilter"
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
                      @click="applyFilter"
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

                  <!-- ── Print the whole currently-filtered register — every
                       EagleParcel RDLC register/list this screen mirrors had
                       its own print button; this is the one shared place
                       that gives all of them one, instead of the per-row
                       print action below (a different, single-record
                       document some report defs also declare). ── -->
                  <q-btn
                    unelevated
                    icon="print"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="printList"
                  >
                    <q-tooltip>Print List</q-tooltip>
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

            <template v-if="def.actionLabel" v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  :icon="def.actionIcon"
                  color="primary"
                  dense
                  outline
                  :class="[
                    'edit-icon-style',
                    def.actionIcon === 'print' ? 'prt' : '',
                  ]"
                  @click="runAction(props.row)"
                >
                  <q-tooltip>{{ def.actionLabel }}</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <!-- ── Print preview — same windowed blob+iframe dialog shape as
         DMSTrip.vue's Trip Sheet Print Preview (auto-height iframe,
         outline record badge, download/print/close icons). ── -->
    <q-dialog v-model="showPrintDialog" @before-hide="closePrintDialog">
      <q-card
        style="
          display: flex;
          flex-direction: column;
          width: 1200px;
          max-width: 95vw;
          max-height: 92vh;
          overflow: hidden;
        "
      >
        <q-toolbar class="bg-primary text-white">
          <q-icon :name="def.icon" size="22px" class="q-mr-sm" />
          <q-toolbar-title>{{ def.title }} Print Preview</q-toolbar-title>
          <q-badge v-if="printRecordNo" class="q-mr-sm print-preview-badge">
            {{ printRecordNo }}
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
import { getReportDef, apiGetReportRows } from "src/data/reportsData.js";
import SearchDateInput from "src/components/SearchDateInput.vue";
import {
  getCompanyProfile,
  getCompanyLogoDataUrl,
  buildPrintHeaderHtml,
  PRINT_HEADER_CSS,
} from "src/data/companyProfile.js";
import { downloadIframeAsPdf } from "src/Utils/downloadIframePdf.js";

function parseDdMmYyyy(str) {
  if (!str || typeof str !== "string") return null;
  const [d, m, y] = str.split("-").map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

function parseIso(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export default {
  name: "GenericReportList",

  components: { SearchDateInput },

  props: {
    reportKey: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      def: getReportDef(this.reportKey),
      allRows: [],
      filteredRows: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      filters: {
        fromDate: null,
        toDate: null,
        selectValue: null,
        printMonth: "",
        printDate: null,
        outstanding: "",
        outstandingDate: null,
        headerFooter: true,
      },

      showPrintDialog: false,
      printBlobUrl: null,
      printRecordNo: "",
    };
  },

  computed: {
    tableColumns() {
      const cols = this.def.columns;
      return this.def.actionLabel
        ? [{ name: "action", label: "Action", field: "action" }, ...cols]
        : cols;
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredRows.length / rows));
    },
    selectOptions() {
      if (!this.def.filters?.select) return [];
      const field = this.def.filters.select.field;
      const seen = new Set();
      this.allRows.forEach((row) => {
        const value = row[field];
        if (value) seen.add(value);
      });
      return [...seen];
    },
  },

  watch: {
    reportKey() {
      this.def = getReportDef(this.reportKey);
      this.resetExtraFilters();
      this.loadRows();
    },
  },

  mounted() {
    this.loadRows();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.applyFilter();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadRows() {
      const rows = await apiGetReportRows(this.reportKey);
      this.allRows = rows.map((r, i) => ({ __rowKey: i, ...r }));
      this.applyFilter();
    },

    resetExtraFilters() {
      this.filters.printMonth = "";
      this.filters.printDate = null;
      this.filters.outstanding = "";
      this.filters.outstandingDate = null;
      this.filters.headerFooter = true;
    },

    applyFilter() {
      let rows = [...this.allRows];

      const rangeDef = this.def.filters?.dateRange;
      if (rangeDef && (this.filters.fromDate || this.filters.toDate)) {
        const from = parseIso(this.filters.fromDate);
        const to = parseIso(this.filters.toDate);
        rows = rows.filter((row) => {
          const rowDate = parseDdMmYyyy(row[rangeDef.field]);
          if (!rowDate) return true;
          if (from && rowDate < from) return false;
          if (to && rowDate > to) return false;
          return true;
        });
      }

      const selectDef = this.def.filters?.select;
      if (selectDef && this.filters.selectValue) {
        rows = rows.filter(
          (row) => row[selectDef.field] === this.filters.selectValue
        );
      }

      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        rows = rows.filter((row) =>
          this.def.columns.some((c) => {
            if (typeof c.field !== "string") return false;
            return String(row[c.field] ?? "")
              .toLowerCase()
              .includes(s);
          })
        );
      }

      this.filteredRows = rows;
    },

    // Mock action per row (Post / Send Email / Print) — flips the row's own
    // boolean flag locally (Posted/EmailSent) where one exists, and always
    // notifies; there's no live posting/emailing engine yet.
    runAction(row) {
      if ("Posted" in row) row.Posted = true;
      if ("EmailSent" in row) row.EmailSent = true;
      if (this.def.actionIcon === "print") {
        this.printRow(row);
      } else {
        this.$q.notify({
          message: `${this.def.actionLabel} — ${
            row.BookingNo || row.SINo || ""
          } done.`,
          color: "positive",
          position: "top",
        });
      }
    },

    async printList() {
      this.printRecordNo = "";
      const [logoDataUrl, company] = await Promise.all([
        getCompanyLogoDataUrl(),
        getCompanyProfile(),
      ]);
      const html = this.buildListPrintHtml(
        this.filteredRows,
        logoDataUrl,
        company
      );
      const blob = new Blob([html], { type: "text/html" });
      if (this.printBlobUrl) URL.revokeObjectURL(this.printBlobUrl);
      this.printBlobUrl = URL.createObjectURL(blob);
      this.showPrintDialog = true;
    },

    async printRow(row) {
      this.printRecordNo =
        row.BookingNo ||
        row.SINo ||
        row.DoorDeliveryNo ||
        row.__rowKey ||
        "";
      const [logoDataUrl, company] = await Promise.all([
        getCompanyLogoDataUrl(),
        getCompanyProfile(),
      ]);
      const html = this.buildPrintHtml(row, logoDataUrl, company);
      const blob = new Blob([html], { type: "text/html" });
      if (this.printBlobUrl) URL.revokeObjectURL(this.printBlobUrl);
      this.printBlobUrl = URL.createObjectURL(blob);
      this.showPrintDialog = true;
    },

    downloadPDF() {
      downloadIframeAsPdf(
        this.$refs.reportFrame,
        `${this.def.title}-${this.printRecordNo}`
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

    buildPrintHtml(row, logoDataUrl = "", company = {}) {
      const cols = this.def.columns.filter((c) => c.name !== "action");
      const cellValue = (c) =>
        typeof c.field === "function" ? c.field(row) : row[c.field] ?? "";

      const headerCells = cols
        .map((c) => `<th>${c.label}</th>`)
        .join("");
      const valueCells = cols
        .map((c) => `<td>${cellValue(c)}</td>`)
        .join("");

      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${this.def.title} — ${this.printRecordNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:9pt;color:#000;padding:10px 14px;background:#fff}
  ${PRINT_HEADER_CSS}
  .title{font-size:12pt;font-weight:bold;border-top:2px solid #0178bc;border-bottom:1px solid #0178bc;padding:4px 0;margin-bottom:8px}
  table.data{width:100%;border-collapse:collapse;border:1px solid #000}
  table.data th,table.data td{border:1px solid #000;padding:4px 6px;text-align:left;font-size:8.5pt}
  table.data th{background:#f2f9ff}
  @page{size:A4;margin:10mm}
  @media print{ body{padding:0;margin:0} }
</style>
</head>
<body>
${buildPrintHeaderHtml(logoDataUrl, company)}

<div class="title">${this.def.title} &mdash; ${this.printRecordNo}</div>

<table class="data">
  <tr>${headerCells}</tr>
  <tr>${valueCells}</tr>
</table>
</body>
</html>`;
    },

    // Whole-register print — the RDLC-equivalent of "print this list", as
    // opposed to buildPrintHtml() above which prints one clicked row as its
    // own single-record document.
    buildListPrintHtml(rows, logoDataUrl = "", company = {}) {
      const cols = this.def.columns.filter((c) => c.name !== "action");
      const cellValue = (row, c) =>
        typeof c.field === "function" ? c.field(row) : row[c.field] ?? "";

      const headerCells = cols.map((c) => `<th>${c.label}</th>`).join("");
      const bodyRows = rows
        .map(
          (row) =>
            `<tr>${cols
              .map((c) => `<td>${cellValue(row, c)}</td>`)
              .join("")}</tr>`
        )
        .join("");

      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${this.def.title}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:9pt;color:#000;padding:10px 14px;background:#fff}
  ${PRINT_HEADER_CSS}
  .title{font-size:12pt;font-weight:bold;border-top:2px solid #0178bc;border-bottom:1px solid #0178bc;padding:4px 0;margin-bottom:8px}
  table.data{width:100%;border-collapse:collapse;border:1px solid #000}
  table.data th,table.data td{border:1px solid #000;padding:4px 6px;text-align:left;font-size:8.5pt}
  table.data th{background:#f2f9ff}
  @page{size:A4;margin:10mm}
  @media print{ body{padding:0;margin:0} }
</style>
</head>
<body>
${buildPrintHeaderHtml(logoDataUrl, company)}

<div class="title">${this.def.title}</div>

<table class="data">
  <tr>${headerCells}</tr>
  ${bodyRows}
</table>
</body>
</html>`;
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
