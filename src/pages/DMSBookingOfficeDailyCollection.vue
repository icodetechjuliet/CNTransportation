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
                <span class="total-stat-count">{{ filteredCollections.length }}</span>
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
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCollection(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.CollectionId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="payments" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingOfficeName }}</span>
                      <span class="mjc-job-date">{{ props.row.CollectionDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="positive">
                      {{ props.row.NetTotalAmount }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.CollectionId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editCollection(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeleteCollection(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.CollectionId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Cash Booking</span><span class="mjc-detail-value">{{ props.row.CashBookingAmount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Cash Delivery</span><span class="mjc-detail-value">{{ props.row.CashDeliveryAmount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Net Total</span><span class="mjc-detail-value">{{ props.row.NetTotalAmount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Remarks</span><span class="mjc-detail-value">{{ props.row.Remarks || "—" }}</span></div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <!-- ══════════════════════════════════════
         Add / Edit Dialog
    ══════════════════════════════════════ -->
    <q-dialog v-model="showDialog" persistent maximized>
      <q-card style="display: flex; flex-direction: column; height: 100%" class="page hide-overflow">
        <div class="folder" style="display: flex; flex-direction: column; height: 100%; overflow-y: auto">
          <div class="row header-style items-center">
            <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
              <div class="header-title">
                <span class="header_text1">Booking Office Daily Collection</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
              </div>
              <div class="header-field-group">
                <q-input square dense outlined bg-color="blue-1" readonly label="Net Total" v-model="form.NetTotalAmount" />
              </div>
            </div>

            <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
              <div class="row q-col-gutter-x-sm justify-end items-center">
                <div class="row items-center no-wrap desktop-actions-group">
                  <q-btn
                    dense
                    unelevated
                    no-caps
                    icon="task_alt"
                    label="Save"
                    class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-save-joined"
                    @click="saveCollection"
                  />
                  <q-btn dense flat round icon="close" class="q-ml-xs" v-close-popup @click="closeDialog" />
                </div>
              </div>
            </div>
          </div>

          <q-card class="tabs-container" style="flex: 1">
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Collection Date" v-model="form.CollectionDate" placeholder="dd/mm/yyyy">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="collectionDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="form.CollectionDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.collectionDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Booking Office"
                    v-model="form.BookingOfficeName"
                    :options="mockData.bookingOffices"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Cash Booking Amount" type="number" v-model="form.CashBookingAmount" @update:model-value="calcTotals" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Cash Booking Kasar Amount" type="number" v-model="form.CashBookingKasarAmount" @update:model-value="calcTotals" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Cash Delivery Amount" type="number" v-model="form.CashDeliveryAmount" @update:model-value="calcTotals" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Cash Delivery Kasar Amount" type="number" v-model="form.CashDeliveryKasarAmount" @update:model-value="calcTotals" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Booking Cash Credit Amount" type="number" v-model="form.BookingCashCreditAmount" @update:model-value="calcTotals" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Delivery Cash Credit Amount" type="number" v-model="form.DeliveryCashCreditAmount" @update:model-value="calcTotals" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Total Cash Credit Amount" v-model="form.TotalCashCreditAmount" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Cash Credit Receipt Amount" type="number" v-model="form.CashCreditReceiptAmount" @update:model-value="calcTotals" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Other Cash Receipt Amount" type="number" v-model="form.OtherCashReceiptAmount" @update:model-value="calcTotals" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Other Cash Payment Amount" type="number" v-model="form.OtherCashPaymentAmount" @update:model-value="calcTotals" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Uchak Debit Amount" type="number" v-model="form.UchakDebitAmount" @update:model-value="calcTotals" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Uchak Received Amount" type="number" v-model="form.UchakReceivedAmount" @update:model-value="calcTotals" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Sub Total Amount" v-model="form.SubTotalAmount" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Net Total Amount" v-model="form.NetTotalAmount" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <q-input square dense outlined bg-color="blue-1" label="Remarks" v-model="form.Remarks" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls (see dms-booking-page-pattern
//  skill's "Data layer conventions" — same MOCK/apiX pattern as
//  DMSBooking.vue, kept local to this page rather than shared).
// ─────────────────────────────────────────────
const MOCK_DATA = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const MOCK_COLLECTIONS = [
  {
    CollectionId: 1,
    CollectionDate: "01/04/2026",
    BookingOfficeName: "Greenland",
    CashBookingAmount: 15000,
    CashBookingKasarAmount: 100,
    CashDeliveryAmount: 8000,
    CashDeliveryKasarAmount: 50,
    BookingCashCreditAmount: 2000,
    DeliveryCashCreditAmount: 1000,
    TotalCashCreditAmount: "3000.00",
    CashCreditReceiptAmount: 500,
    OtherCashReceiptAmount: 200,
    OtherCashPaymentAmount: 300,
    UchakDebitAmount: 100,
    UchakReceivedAmount: 150,
    SubTotalAmount: "23000.00",
    NetTotalAmount: "23450.00",
    Remarks: "",
  },
  {
    CollectionId: 2,
    CollectionDate: "02/04/2026",
    BookingOfficeName: "Chakan",
    CashBookingAmount: 12000,
    CashBookingKasarAmount: 0,
    CashDeliveryAmount: 6000,
    CashDeliveryKasarAmount: 0,
    BookingCashCreditAmount: 1500,
    DeliveryCashCreditAmount: 500,
    TotalCashCreditAmount: "2000.00",
    CashCreditReceiptAmount: 300,
    OtherCashReceiptAmount: 0,
    OtherCashPaymentAmount: 100,
    UchakDebitAmount: 0,
    UchakReceivedAmount: 0,
    SubTotalAmount: "18000.00",
    NetTotalAmount: "18200.00",
    Remarks: "",
  },
];

function apiGetCollections(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_COLLECTIONS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            (o.BookingOfficeName || "").toLowerCase().includes(s) ||
            (o.CollectionDate || "").toLowerCase().includes(s) ||
            (o.Remarks || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveCollection(collection) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (collection.CollectionId) {
        const idx = MOCK_COLLECTIONS.findIndex((o) => o.CollectionId === collection.CollectionId);
        if (idx !== -1) MOCK_COLLECTIONS[idx] = { ...collection };
      } else {
        collection.CollectionId = MOCK_COLLECTIONS.length + 1;
        MOCK_COLLECTIONS.push(collection);
      }
      resolve({ success: true, data: collection });
    }, 200);
  });
}

function apiDeleteCollection(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_COLLECTIONS.findIndex((o) => o.CollectionId === id);
      if (idx !== -1) MOCK_COLLECTIONS.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

function apiGetCollectionById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_COLLECTIONS.find((o) => o.CollectionId === id) || null),
      100
    );
  });
}

// Consumed by DMSBookingOfficeDailyCollectionView.vue — its own Add/Edit
// full-page tab, opened via openTab() from openAddCollection()/editCollection()
// below (same pattern as DMSBBooking.vue → DMSBBookingView.vue).
export { apiGetCollectionById, apiSaveCollection, MOCK_DATA };

export default {
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
        { name: "CollectionDate", label: "Collection Date", field: "CollectionDate", sortable: true },
        { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName", sortable: true },
        { name: "CashBookingAmount", label: "Cash Booking Amt", field: "CashBookingAmount", align: "right" },
        { name: "CashDeliveryAmount", label: "Cash Delivery Amt", field: "CashDeliveryAmount", align: "right" },
        { name: "NetTotalAmount", label: "Net Total", field: "NetTotalAmount", align: "right" },
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
      if (this.openTab) {
        this.openTab("/DMSBookingOfficeDailyCollectionView?mode=add", "New Daily Collection");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editCollection(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSBookingOfficeDailyCollectionView?mode=edit&collectionId=${row.CollectionId}`,
          `Daily Collection ${row.BookingOfficeName || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveCollection() {
      if (!this.form.CollectionDate) {
        this.$q.notify({ message: "Collection Date is required", color: "negative", position: "top" });
        return;
      }
      this.calcTotals();
      const res = await apiSaveCollection({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Daily Collection saved!", color: "positive", position: "top" });
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
          this.$q.notify({ message: "Daily Collection deleted", color: "negative", position: "top" });
          this.loadCollections();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
