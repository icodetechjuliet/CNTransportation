<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Cash Credit</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="payments" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredCredits.length }}
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
            :rows="filteredCredits"
            :columns="tableColumns"
            row-key="CashCreditId"
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
                      @keyup.enter="loadCredits"
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
                      @click="loadCredits"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    mask="##/##/####"
                    style="width: 130px"
                    class="q-mx-xs"
                    @update:model-value="loadCredits"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="fromDate"
                            mask="DD/MM/YYYY"
                            color="black"
                            @update:model-value="loadCredits"
                          >
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
                    mask="##/##/####"
                    style="width: 130px"
                    class="q-mx-xs"
                    @update:model-value="loadCredits"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="toDate"
                            mask="DD/MM/YYYY"
                            color="black"
                            @update:model-value="loadCredits"
                          >
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
                    flat
                    dense
                    no-caps
                    class="add_new_CashCredit m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddCredit"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadCredits"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-IsClear="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value ? 'positive' : 'orange'"
                  :label="props.value ? 'Clear' : 'Pending'"
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
                  @click="editCredit(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCredit(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.CashCreditId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="payments" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.VoucherNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.VoucherDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="props.row.IsClear ? 'positive' : 'orange'"
                    >
                      {{ props.row.IsClear ? "Clear" : "Pending" }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.CashCreditId)
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
                    @click="editCredit(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteCredit(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.CashCreditId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Booking No.</span>
                        <span class="mjc-detail-value">
                          {{ props.row.BookingNo || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Booking Office</span>
                        <span class="mjc-detail-value">
                          {{ props.row.BookingOfficeName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Reference User</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ReferenceUserName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Pending Amount</span>
                        <span class="mjc-detail-value">
                          {{ props.row.PendingAmount || "—" }}
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
// Cash Credit data/mock-"backend" now lives in its own module,
// src/data/bookingData.js (localStorage-backed, so add/edit/delete persist
// like a real DB) — every Booking-family page imports from there directly
// instead of from this page.
import {
  apiGetCredits,
  apiSaveCredit,
  apiDeleteCredit,
  apiGetCreditById,
  peekNextCashCreditNo,
  MOCK_DATA_CASH_CREDIT as MOCK_DATA,
} from "src/data/bookingData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadCredits",
  name: "DMSCashCredit",

  // Lets openAddCredit()/editCredit() open the full-page Add/Edit tab
  // (DMSCashCreditView.vue) instead of the in-page popup. `default: null`
  // keeps this page working standalone (outside DynamicTab.vue) by falling
  // back to the old dialog — same convention as DMSBBooking.vue.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      credits: [],
      filteredCredits: [],
      searchText: "",
      fromDate: "02/09/2026",
      toDate: "05/09/2026",
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
          label: "Date",
          field: "VoucherDate",
          sortable: true,
        },
        {
          name: "PartyAccountName",
          label: "Party Account",
          field: "PartyAccountName",
          sortable: true,
        },
        {
          name: "DebitAmount",
          label: "Debit Amount",
          field: "DebitAmount",
          align: "right",
        },
        {
          name: "ReceivedAmount",
          label: "Received Amount",
          field: "ReceivedAmount",
          align: "right",
        },
        {
          name: "PendingAmount",
          label: "Pending Amount",
          field: "PendingAmount",
          align: "right",
        },
        { name: "IsClear", label: "Status", field: "IsClear", align: "center" },
      ],
    };
  },

  mounted() {
    this.loadCredits();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadCredits();
    },

    async loadCredits() {
      this.filteredCredits = await apiGetCredits(
        this.searchText,
        this.fromDate,
        this.toDate
      );
    },

    calcPending() {
      const debit = Number(this.form.DebitAmount) || 0;
      const received = Number(this.form.ReceivedAmount) || 0;
      this.form.PendingAmount = debit - received;
    },

    nextVoucherNo() {
      return peekNextCashCreditNo();
    },

    emptyForm() {
      return {
        CashCreditId: null,
        VoucherNo: this.nextVoucherNo(),
        VoucherDate: "",
        PartyAccountName: "",
        ReferenceUserName: "",
        BookingNo: "",
        BookingOfficeName: "",
        ReceivedAmount: 0,
        DebitAmount: 0,
        PendingAmount: 0,
        IsClear: false,
        Narration: "",
      };
    },

    openAddCredit() {
      this.openEntryPage("/DMSCashCreditView?mode=add", "New Cash Credit");
    },

    editCredit(row) {
      this.openEntryPage(
        `/DMSCashCreditView?mode=edit&creditId=${row.CashCreditId}`,
        `Cash Credit ${row.VoucherNo || ""}`.trim()
      );
    },

    async saveCredit() {
      if (!this.form.PartyAccountName) {
        this.$q.notify({
          message: "Party Account Name is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.calcPending();
      const res = await apiSaveCredit({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Cash Credit saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadCredits();
      }
    },

    confirmDeleteCredit(row) {
      this.$q
        .dialog({
          title: "Delete Cash Credit",
          message: `Delete voucher <b>${row.VoucherNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteCredit(row.CashCreditId);
          this.$q.notify({
            message: "Cash Credit deleted",
            color: "negative",
            position: "top",
          });
          this.loadCredits();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
