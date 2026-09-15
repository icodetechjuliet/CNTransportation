<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">
              Booking Office Wise Received Collection
            </span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="receipt_long" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredVouchers.length }}
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
            :rows="filteredVouchers"
            :columns="tableColumns"
            row-key="ReceivedCollectionId"
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
                      @keyup.enter="loadVouchers"
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
                      @click="loadVouchers"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_RecvColl m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddVoucher"
                  />

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    style="width: 150px"
                    class="q-mx-xs"
                    @update:model-value="loadVouchers"
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
                            @update:model-value="loadVouchers"
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
                    @update:model-value="loadVouchers"
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
                            @update:model-value="loadVouchers"
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
                    @click="loadVouchers"
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
                  @click="editVoucher(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteVoucher(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.ReceivedCollectionId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="receipt_long" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.VoucherNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.VoucherDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="positive">
                      {{ props.row.TotalAmount }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(
                          props.row.ReceivedCollectionId
                        )
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
                    @click="editVoucher(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteVoucher(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="
                      expandedMobileCards.includes(
                        props.row.ReceivedCollectionId
                      )
                    "
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
                        <span class="mjc-detail-label">Total Amount</span>
                        <span class="mjc-detail-value">
                          {{ props.row.TotalAmount || "—" }}
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
import entryNavigation from "src/mixins/entryNavigation.js";
// Booking Office Wise Received Collection data/mock-"backend" now lives in
// its own module, src/data/bookingOfficeData.js (localStorage-backed, so
// add/edit/delete persist like a real DB) — every Booking Office-family
// page imports from there directly instead of from this page.
import {
  apiGetReceivedVouchers as apiGetVouchers,
  apiSaveReceivedVoucher as apiSaveVoucher,
  apiDeleteReceivedVoucher as apiDeleteVoucher,
  apiGetReceivedVoucherById as apiGetVoucherById,
  MOCK_DATA_WISE_RECEIVED_COLLECTION as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadVouchers",
  name: "DMSBookingOfficeWiseReceivedCollection",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      vouchers: [],
      filteredVouchers: [],
      searchText: "",
      fromDate: this.defaultFromDate(),
      toDate: this.defaultToDate(),
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "VoucherNo",
          label: "Voucher No.",
          field: "VoucherNo",
          sortable: true,
        },
        {
          name: "VoucherDate",
          label: "Voucher Date",
          field: "VoucherDate",
          sortable: true,
        },
        {
          name: "BookingOfficeName",
          label: "Booking Office",
          field: "BookingOfficeName",
          sortable: true,
        },
        {
          name: "TotalAmount",
          label: "Total Amount",
          field: "TotalAmount",
          align: "right",
        },
      ],
    };
  },

  mounted() {
    this.loadVouchers();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadVouchers();
    },

    defaultFromDate() {
      return "2026-04-01";
    },

    defaultToDate() {
      return "2026-04-02";
    },

    // VoucherDate here is "DD/MM/YYYY" — convert to a lexically-comparable
    // "YYYY-MM-DD" to compare against fromDate/toDate.
    parseDMYDate(str) {
      if (!str) return null;
      const parts = String(str).split("/");
      if (parts.length !== 3) return null;
      const [d, m, y] = parts;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    },

    async loadVouchers() {
      let result = await apiGetVouchers(this.searchText);
      result = result.filter((v) => {
        const vd = this.parseDMYDate(v.VoucherDate);
        if (!vd) return true;
        if (this.fromDate && vd < this.fromDate) return false;
        if (this.toDate && vd > this.toDate) return false;
        return true;
      });
      this.filteredVouchers = result;
    },

    emptyForm() {
      return {
        ReceivedCollectionId: null,
        VoucherNo: "",
        VoucherDate: "",
        BookingOfficeName: "",
        TotalAmount: 0,
        Remarks: "",
      };
    },

    openAddVoucher() {
      this.openEntryPage(
        "/DMSBookingOfficeWiseReceivedCollectionView?mode=add",
        "New Received Collection"
      );
    },

    editVoucher(row) {
      this.openEntryPage(
        `/DMSBookingOfficeWiseReceivedCollectionView?mode=edit&receivedCollectionId=${row.ReceivedCollectionId}`,
        `Received Collection ${row.VoucherNo || ""}`.trim()
      );
    },

    async saveVoucher() {
      if (!this.form.VoucherDate || !this.form.BookingOfficeName) {
        this.$q.notify({
          message: "Voucher Date and Booking Office are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveVoucher({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Received Collection saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadVouchers();
      }
    },

    confirmDeleteVoucher(row) {
      this.$q
        .dialog({
          title: "Delete Received Collection",
          message: `Delete voucher <b>${row.VoucherNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteVoucher(row.ReceivedCollectionId);
          this.$q.notify({
            message: "Received Collection deleted",
            color: "negative",
            position: "top",
          });
          this.loadVouchers();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
