<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office Wise Debit Collection</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="receipt_long" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredVouchers.length }}</span>
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
            row-key="DebitCollectionId"
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
                    class="add_new_DebitColl m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddVoucher"
                  />

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
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteVoucher(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.DebitCollectionId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="receipt_long" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.VoucherNo }}</span>
                      <span class="mjc-job-date">{{ props.row.VoucherDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="positive">
                      {{ props.row.TotalAmount }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.DebitCollectionId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editVoucher(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeleteVoucher(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.DebitCollectionId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Booking Office</span><span class="mjc-detail-value">{{ props.row.BookingOfficeName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Total Amount</span><span class="mjc-detail-value">{{ props.row.TotalAmount || "—" }}</span></div>
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
                <span class="header_text1">Booking Office Wise Debit Collection</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
              </div>
              <div class="header-field-group">
                <q-input square dense outlined bg-color="blue-1" readonly label="Voucher No." v-model="form.VoucherNo" />
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
                    @click="saveVoucher"
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
                  <q-input square dense outlined bg-color="blue-1" readonly label="Voucher No." v-model="form.VoucherNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Voucher Date" v-model="form.VoucherDate" placeholder="dd/mm/yyyy">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="voucherDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="form.VoucherDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.voucherDateProxy.hide()"
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
                  <q-input square dense outlined bg-color="blue-1" label="Total Amount" type="number" v-model="form.TotalAmount" />
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

const MOCK_VOUCHERS = [
  {
    DebitCollectionId: 1,
    VoucherNo: "DC20260001",
    VoucherDate: "01/04/2026",
    BookingOfficeName: "Greenland",
    TotalAmount: 5000,
    Remarks: "",
  },
  {
    DebitCollectionId: 2,
    VoucherNo: "DC20260002",
    VoucherDate: "02/04/2026",
    BookingOfficeName: "Chakan",
    TotalAmount: 3200,
    Remarks: "",
  },
];

function apiGetVouchers(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_VOUCHERS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.VoucherNo.toLowerCase().includes(s) ||
            (o.BookingOfficeName || "").toLowerCase().includes(s) ||
            (o.Remarks || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveVoucher(voucher) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (voucher.DebitCollectionId) {
        const idx = MOCK_VOUCHERS.findIndex((o) => o.DebitCollectionId === voucher.DebitCollectionId);
        if (idx !== -1) MOCK_VOUCHERS[idx] = { ...voucher };
      } else {
        voucher.DebitCollectionId = MOCK_VOUCHERS.length + 1;
        voucher.VoucherNo = "DC" + new Date().getFullYear() + String(voucher.DebitCollectionId).padStart(4, "0");
        MOCK_VOUCHERS.push(voucher);
      }
      resolve({ success: true, data: voucher });
    }, 200);
  });
}

function apiDeleteVoucher(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_VOUCHERS.findIndex((o) => o.DebitCollectionId === id);
      if (idx !== -1) MOCK_VOUCHERS.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

function apiGetVoucherById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_VOUCHERS.find((o) => o.DebitCollectionId === id) || null),
      100
    );
  });
}

// Consumed by DMSBookingOfficeWiseDebitCollectionView.vue — its own
// Add/Edit full-page tab, opened via openTab() from
// openAddVoucher()/editVoucher() below (same pattern as
// DMSBBooking.vue → DMSBBookingView.vue).
export { apiGetVoucherById, apiSaveVoucher, MOCK_DATA };

export default {
  name: "DMSBookingOfficeWiseDebitCollection",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      vouchers: [],
      filteredVouchers: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "VoucherNo", label: "Voucher No.", field: "VoucherNo", sortable: true },
        { name: "VoucherDate", label: "Voucher Date", field: "VoucherDate", sortable: true },
        { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName", sortable: true },
        { name: "TotalAmount", label: "Total Amount", field: "TotalAmount", align: "right" },
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

    async loadVouchers() {
      this.filteredVouchers = await apiGetVouchers(this.searchText);
    },

    emptyForm() {
      return {
        DebitCollectionId: null,
        VoucherNo: "",
        VoucherDate: "",
        BookingOfficeName: "",
        TotalAmount: 0,
        Remarks: "",
      };
    },

    openAddVoucher() {
      if (this.openTab) {
        this.openTab("/DMSBookingOfficeWiseDebitCollectionView?mode=add", "New Debit Collection");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editVoucher(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSBookingOfficeWiseDebitCollectionView?mode=edit&debitCollectionId=${row.DebitCollectionId}`,
          `Debit Collection ${row.VoucherNo || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveVoucher() {
      if (!this.form.VoucherDate || !this.form.BookingOfficeName) {
        this.$q.notify({ message: "Voucher Date and Booking Office are required", color: "negative", position: "top" });
        return;
      }
      const res = await apiSaveVoucher({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Debit Collection saved!", color: "positive", position: "top" });
        this.showDialog = false;
        this.loadVouchers();
      }
    },

    confirmDeleteVoucher(row) {
      this.$q
        .dialog({
          title: "Delete Debit Collection",
          message: `Delete voucher <b>${row.VoucherNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteVoucher(row.DebitCollectionId);
          this.$q.notify({ message: "Debit Collection deleted", color: "negative", position: "top" });
          this.loadVouchers();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
