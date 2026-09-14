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
                <span class="total-stat-label">Total {{ def.title }}</span>
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
            :row-key="def.idField"
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
                    dense
                    no-caps
                    icon="add"
                    :label="'New ' + def.title"
                    class="bg-dblue-lblue text-white radius-md q-px-sm text-no-wrap q-ml-sm"
                    @click="openAdd"
                  />

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

            <template
              v-for="field in checkboxFields"
              :key="field.name"
              v-slot:[bodyCellSlot(field.name)]="props"
            >
              <q-td :props="props">
                <q-icon
                  :name="
                    props.value ? 'check_circle' : 'radio_button_unchecked'
                  "
                  :color="props.value ? 'positive' : 'grey-5'"
                  size="18px"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="openEdit(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style q-ml-xs"
                  @click="deleteRow(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="def.printable"
                  icon="print"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style prt q-ml-xs"
                  @click="printRow(props.row)"
                >
                  <q-tooltip>Print</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <!-- ── Print preview — same windowed blob+iframe dialog as
         GenericReportList.vue's (auto-height iframe, real PDF download via
         downloadIframeAsPdf, print via contentWindow.print()) — only shown
         for entities that opt in via `printable: true` (accountvoucher). ── -->
    <q-dialog
      v-if="def.printable"
      v-model="showPrintDialog"
      @before-hide="closePrintDialog"
    >
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
            ref="printFrameEl"
            :src="printBlobUrl"
            style="border: none; width: 100%; display: block"
            @load="onPrintFrameLoad"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- ══════════════════════════════════════
         Add / Edit Dialog — canonical compact-dialog shape
         (ReferredDetailsDialog.vue), fields rendered from `def.fields`.
    ══════════════════════════════════════ -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{
              dialogMode === "add" ? "New " + def.title : "Edit " + def.title
            }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <template v-for="field in def.fields" :key="field.name">
              <div :class="field.type === 'checkbox' ? 'col-6' : 'col-12'">
                <q-select
                  square=""
                  v-if="field.type === 'select'"
                  v-model="form[field.name]"
                  :options="field.options"
                  :label="field.label"
                  dense
                  outlined
                  bg-color="blue-1"
                />
                <q-item
                  v-else-if="field.type === 'checkbox'"
                  tag="label"
                  v-ripple
                  bg-color="blue-1"
                  class="chckbx-style full-width"
                >
                  <q-item-section avatar>
                    <q-checkbox dense v-model="form[field.name]" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>{{ field.label }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-input
                  square=""
                  v-else-if="field.type === 'date'"
                  v-model="form[field.name]"
                  :label="field.label"
                  placeholder="dd-mm-yyyy"
                  dense
                  outlined
                  bg-color="blue-1"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="form[field.name]"
                          mask="DD-MM-YYYY"
                          minimal
                          style="width: 280px"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input
                  square=""
                  v-else
                  v-model="form[field.name]"
                  :label="field.label"
                  :type="field.type === 'number' ? 'number' : 'text'"
                  dense
                  outlined
                  bg-color="blue-1"
                />
              </div>
            </template>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions
          align="right"
          class="q-gutter-sm q-pt-none q-pb-none q-pr-none"
        >
          <q-btn label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            class="m-btn-style"
            label="Save"
            @click="save"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  getEntityDef,
  apiGetMasterList,
  apiSaveMasterRow,
  apiDeleteMasterRow,
} from "src/data/mastersData.js";
import {
  getCompanyProfile,
  getCompanyLogoDataUrl,
  buildPrintHeaderHtml,
  PRINT_HEADER_CSS,
} from "src/data/companyProfile.js";
import { downloadIframeAsPdf } from "src/Utils/downloadIframePdf.js";

export default {
  name: "GenericMasterList",

  props: {
    entity: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      def: getEntityDef(this.entity),
      allRows: [],
      filteredRows: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      showDialog: false,
      dialogMode: "add",
      form: {},

      showPrintDialog: false,
      printBlobUrl: null,
      printRecordNo: "",
    };
  },

  computed: {
    tableColumns() {
      const fieldColumns = this.def.fields.map((f) => ({
        name: f.name,
        label: f.label,
        field: f.name,
        align:
          f.type === "number"
            ? "right"
            : f.type === "checkbox"
            ? "center"
            : "left",
        sortable: f.type !== "checkbox",
      }));
      return [
        { name: "action", label: "Action", field: "action" },
        ...fieldColumns,
      ];
    },
    checkboxFields() {
      return this.def.fields.filter((f) => f.type === "checkbox");
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredRows.length / rows));
    },
  },

  watch: {
    entity() {
      this.def = getEntityDef(this.entity);
      this.loadRows();
    },
  },

  mounted() {
    this.loadRows();
  },

  methods: {
    bodyCellSlot(name) {
      return "body-cell-" + name;
    },

    clearSearch() {
      this.searchText = "";
      this.applyFilter();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadRows() {
      this.allRows = await apiGetMasterList(this.entity);
      this.applyFilter();
    },

    applyFilter() {
      if (!this.searchText) {
        this.filteredRows = [...this.allRows];
        return;
      }
      const s = this.searchText.toLowerCase();
      this.filteredRows = this.allRows.filter((row) =>
        this.def.fields.some((f) =>
          String(row[f.name] ?? "")
            .toLowerCase()
            .includes(s)
        )
      );
    },

    emptyForm() {
      const form = {};
      this.def.fields.forEach((f) => {
        form[f.name] =
          f.type === "checkbox" ? false : f.type === "number" ? 0 : "";
      });
      return form;
    },

    openAdd() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    openEdit(row) {
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async save() {
      const res = await apiSaveMasterRow(this.entity, { ...this.form });
      if (res.success) {
        this.$q.notify({
          message: this.def.title + " saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        await this.loadRows();
      }
    },

    async deleteRow(row) {
      const res = await apiDeleteMasterRow(this.entity, row[this.def.idField]);
      if (res.success) {
        this.$q.notify({
          message: this.def.title + " deleted.",
          color: "positive",
          position: "top",
        });
        await this.loadRows();
      }
    },

    // ── Print preview (entities with `printable: true` only) — mirrors
    // GenericReportList.vue's printRow/buildPrintHtml/downloadPDF/printFrame/
    // onPrintFrameLoad/closePrintDialog mechanism as closely as possible. ──
    async printRow(row) {
      this.printRecordNo = row[this.def.idField] ?? "";
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
        this.$refs.printFrameEl,
        `${this.def.title}-${this.printRecordNo}`
      );
    },

    printFrame() {
      if (!this.$refs.printFrameEl) return;
      this.$refs.printFrameEl.contentWindow.focus();
      this.$refs.printFrameEl.contentWindow.print();
    },

    onPrintFrameLoad() {
      const frame = this.$refs.printFrameEl;
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
      const fields = this.def.fields;
      const cellValue = (f) => row[f.name] ?? "";

      const headerCells = fields
        .map((f) => `<th>${f.label}</th>`)
        .join("");
      const valueCells = fields
        .map((f) => `<td>${cellValue(f)}</td>`)
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
