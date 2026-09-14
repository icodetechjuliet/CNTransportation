<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office Daily Collection</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="payments" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredCollections.length }}
                </span>
                <span class="total-stat-label">Total Collections</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredCollections"
            :columns="tableColumns"
            row-key="CollectionId"
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
                      @keyup.enter="loadCollections"
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
                      @click="loadCollections"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_DailyColl m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddCollection"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadCollections"
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
                  @click="editCollection(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCollection(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.CollectionId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="payments" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">
                        {{ props.row.BookingOfficeName }}
                      </span>
                      <span class="mjc-job-date">
                        {{ props.row.CollectionDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="positive">
                      {{ props.row.NetTotalAmount }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.CollectionId)
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
                    @click="editCollection(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteCollection(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.CollectionId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Cash Booking</span>
                        <span class="mjc-detail-value">
                          {{ props.row.CashBookingAmount || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Cash Delivery</span>
                        <span class="mjc-detail-value">
                          {{ props.row.CashDeliveryAmount || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Net Total</span>
                        <span class="mjc-detail-value">
                          {{ props.row.NetTotalAmount || "—" }}
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
// Booking Office Daily Collection data/mock-"backend" now lives in its own
// module, src/data/bookingOfficeData.js (localStorage-backed, so
// add/edit/delete persist like a real DB) — every Booking Office-family
// page imports from there directly instead of from this page.
import {
  apiGetCollections,
  apiSaveCollection,
  apiDeleteCollection,
  apiGetCollectionById,
  MOCK_DATA_DAILY_COLLECTION as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadCollections",
  name: "DMSBookingOfficeDailyCollection",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      collections: [],
      filteredCollections: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "CollectionDate",
          label: "Collection Date",
          field: "CollectionDate",
          sortable: true,
        },
        {
          name: "BookingOfficeName",
          label: "Booking Office",
          field: "BookingOfficeName",
          sortable: true,
        },
        {
          name: "CashBookingAmount",
          label: "Cash Booking Amt",
          field: "CashBookingAmount",
          align: "right",
        },
        {
          name: "CashDeliveryAmount",
          label: "Cash Delivery Amt",
          field: "CashDeliveryAmount",
          align: "right",
        },
        {
          name: "NetTotalAmount",
          label: "Net Total",
          field: "NetTotalAmount",
          align: "right",
        },
      ],
    };
  },

  mounted() {
    this.loadCollections();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadCollections();
    },

    async loadCollections() {
      this.filteredCollections = await apiGetCollections(this.searchText);
    },

    calcTotals() {
      const cb = parseFloat(this.form.CashBookingAmount) || 0;
      const cd = parseFloat(this.form.CashDeliveryAmount) || 0;
      const bcc = parseFloat(this.form.BookingCashCreditAmount) || 0;
      const dcc = parseFloat(this.form.DeliveryCashCreditAmount) || 0;
      const ccr = parseFloat(this.form.CashCreditReceiptAmount) || 0;
      const ocr = parseFloat(this.form.OtherCashReceiptAmount) || 0;
      const ocp = parseFloat(this.form.OtherCashPaymentAmount) || 0;
      const ud = parseFloat(this.form.UchakDebitAmount) || 0;
      const ur = parseFloat(this.form.UchakReceivedAmount) || 0;

      const totalCashCredit = bcc + dcc;
      const subTotal = cb + cd;
      const netTotal = subTotal + ccr + ocr - ocp - ud + ur;

      this.form.TotalCashCreditAmount = totalCashCredit.toFixed(2);
      this.form.SubTotalAmount = subTotal.toFixed(2);
      this.form.NetTotalAmount = netTotal.toFixed(2);
    },

    emptyForm() {
      return {
        CollectionId: null,
        CollectionDate: "",
        BookingOfficeName: "",
        CashBookingAmount: 0,
        CashBookingKasarAmount: 0,
        CashDeliveryAmount: 0,
        CashDeliveryKasarAmount: 0,
        BookingCashCreditAmount: 0,
        DeliveryCashCreditAmount: 0,
        TotalCashCreditAmount: "0.00",
        CashCreditReceiptAmount: 0,
        OtherCashReceiptAmount: 0,
        OtherCashPaymentAmount: 0,
        UchakDebitAmount: 0,
        UchakReceivedAmount: 0,
        SubTotalAmount: "0.00",
        NetTotalAmount: "0.00",
        Remarks: "",
      };
    },

    openAddCollection() {
      this.openEntryPage(
        "/DMSBookingOfficeDailyCollectionView?mode=add",
        "New Daily Collection"
      );
    },

    editCollection(row) {
      this.openEntryPage(
        `/DMSBookingOfficeDailyCollectionView?mode=edit&collectionId=${row.CollectionId}`,
        `Daily Collection ${row.BookingOfficeName || ""}`.trim()
      );
    },

    async saveCollection() {
      if (!this.form.CollectionDate) {
        this.$q.notify({
          message: "Collection Date is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.calcTotals();
      const res = await apiSaveCollection({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Daily Collection saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadCollections();
      }
    },

    confirmDeleteCollection(row) {
      this.$q
        .dialog({
          title: "Delete Daily Collection",
          message: `Delete daily collection for <b>${row.BookingOfficeName}</b> on <b>${row.CollectionDate}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteCollection(row.CollectionId);
          this.$q.notify({
            message: "Daily Collection deleted",
            color: "negative",
            position: "top",
          });
          this.loadCollections();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
