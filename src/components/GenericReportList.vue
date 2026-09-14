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
  </div>
</template>

<script>
import { getReportDef, apiGetReportRows } from "src/data/reportsData.js";

export default {
  name: "GenericReportList",

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
  },

  watch: {
    reportKey() {
      this.def = getReportDef(this.reportKey);
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

    applyFilter() {
      if (!this.searchText) {
        this.filteredRows = [...this.allRows];
        return;
      }
      const s = this.searchText.toLowerCase();
      this.filteredRows = this.allRows.filter((row) =>
        this.def.columns.some((c) => {
          if (typeof c.field !== "string") return false;
          return String(row[c.field] ?? "")
            .toLowerCase()
            .includes(s);
        })
      );
    },

    // Mock action per row (Post / Send Email / Print) — flips the row's own
    // boolean flag locally (Posted/EmailSent) where one exists, and always
    // notifies; there's no live posting/emailing engine yet.
    runAction(row) {
      if ("Posted" in row) row.Posted = true;
      if ("EmailSent" in row) row.EmailSent = true;
      if (this.def.actionIcon === "print") {
        window.print();
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
  },
};
</script>
