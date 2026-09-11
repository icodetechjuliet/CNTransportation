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
                <span class="total-stat-count">{{ filteredCredits.length }}</span>
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
                <q-badge :color="props.value ? 'positive' : 'orange'" :label="props.value ? 'Clear' : 'Pending'" />
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
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCredit(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.CashCreditId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="payments" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.VoucherNo }}</span>
                      <span class="mjc-job-date">{{ props.row.VoucherDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" :color="props.row.IsClear ? 'positive' : 'orange'">
                      {{ props.row.IsClear ? "Clear" : "Pending" }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.CashCreditId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editCredit(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeleteCredit(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.CashCreditId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Booking No.</span><span class="mjc-detail-value">{{ props.row.BookingNo || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Booking Office</span><span class="mjc-detail-value">{{ props.row.BookingOfficeName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Reference User</span><span class="mjc-detail-value">{{ props.row.ReferenceUserName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Pending Amount</span><span class="mjc-detail-value">{{ props.row.PendingAmount || "—" }}</span></div>
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
                <span class="header_text1">Cash Credit</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
              </div>
              <div class="header-field-group">
                <q-input square dense outlined bg-color="blue-1" readonly label="Voucher No." v-model="form.VoucherNo" />
              </div>
              <div class="header-field-group header-field-group-sm">
                <q-input square dense outlined bg-color="blue-1" readonly label="Pending Amount" v-model="form.PendingAmount" />
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
                    @click="saveCredit"
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
                  <q-input square dense outlined bg-color="blue-1" label="Voucher Date" v-model="form.VoucherDate">
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
                    label="Party Account Name"
                    v-model="form.PartyAccountName"
                    :options="mockData.parties"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Reference User Name" v-model="form.ReferenceUserName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Booking No." v-model="form.BookingNo" />
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
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Received Amount"
                    type="number"
                    v-model.number="form.ReceivedAmount"
                    @update:model-value="calcPending"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Debit Amount"
                    type="number"
                    v-model.number="form.DebitAmount"
                    @update:model-value="calcPending"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Pending Amount" v-model="form.PendingAmount" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.IsClear" val="orange" color="orange" intermediate-icon="black" />
                    </q-item-section>
                    <q-item-section><q-item-label dense>Is Clear</q-item-label></q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <q-input square dense outlined bg-color="blue-1" label="Narration" v-model="form.Narration" />
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
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
  bookingOffices: ["Greenland", "Chakan", "Rajkot-G", "Nasik"],
};

const MOCK_CREDITS = [
  {
    CashCreditId: 1,
    VoucherNo: "CC0001",
    VoucherDate: "02/09/2026",
    PartyAccountName: "Balaji xxx Co.",
    ReferenceUserName: "Ketan Patel",
    BookingNo: "BK-1001",
    BookingOfficeName: "Greenland",
    ReceivedAmount: 3000,
    DebitAmount: 5000,
    PendingAmount: 2000,
    IsClear: false,
    Narration: "",
  },
  {
    CashCreditId: 2,
    VoucherNo: "CC0002",
    VoucherDate: "05/09/2026",
    PartyAccountName: "Rajsani xxx Polymers",
    ReferenceUserName: "Suresh Rao",
    BookingNo: "BK-1002",
    BookingOfficeName: "Chakan",
    ReceivedAmount: 4200,
    DebitAmount: 4200,
    PendingAmount: 0,
    IsClear: true,
    Narration: "",
  },
];

function apiGetCredits(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_CREDITS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.VoucherNo.toLowerCase().includes(s) ||
            (o.PartyAccountName || "").toLowerCase().includes(s) ||
            (o.BookingNo || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveCredit(credit) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credit.CashCreditId) {
        const idx = MOCK_CREDITS.findIndex((o) => o.CashCreditId === credit.CashCreditId);
        if (idx !== -1) MOCK_CREDITS[idx] = { ...credit };
      } else {
        credit.CashCreditId = MOCK_CREDITS.length + 1;
        MOCK_CREDITS.push(credit);
      }
      resolve({ success: true, data: credit });
    }, 200);
  });
}

function apiDeleteCredit(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_CREDITS.findIndex((o) => o.CashCreditId === id);
      if (idx !== -1) MOCK_CREDITS.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

function apiGetCreditById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_CREDITS.find((o) => o.CashCreditId === id) || null),
      100
    );
  });
}

// Consumed by DMSCashCreditView.vue — its own Add/Edit full-page tab,
// opened via openTab() from openAddCredit()/editCredit() below (same
// pattern as DMSBBooking.vue → DMSBBookingView.vue).
export { apiGetCreditById, apiSaveCredit, MOCK_DATA };

export default {
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
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "VoucherNo", label: "Voucher No.", field: "VoucherNo", sortable: true },
        { name: "VoucherDate", label: "Date", field: "VoucherDate", sortable: true },
        { name: "PartyAccountName", label: "Party Account", field: "PartyAccountName", sortable: true },
        { name: "DebitAmount", label: "Debit Amount", field: "DebitAmount", align: "right" },
        { name: "ReceivedAmount", label: "Received Amount", field: "ReceivedAmount", align: "right" },
        { name: "PendingAmount", label: "Pending Amount", field: "PendingAmount", align: "right" },
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
      this.filteredCredits = await apiGetCredits(this.searchText);
    },

    calcPending() {
      const debit = Number(this.form.DebitAmount) || 0;
      const received = Number(this.form.ReceivedAmount) || 0;
      this.form.PendingAmount = debit - received;
    },

    nextVoucherNo() {
      const n = MOCK_CREDITS.length + 1;
      return "CC" + String(n).padStart(4, "0");
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
      if (this.openTab) {
        this.openTab("/DMSCashCreditView?mode=add", "New Cash Credit");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editCredit(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSCashCreditView?mode=edit&creditId=${row.CashCreditId}`,
          `Cash Credit ${row.VoucherNo || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveCredit() {
      if (!this.form.PartyAccountName) {
        this.$q.notify({ message: "Party Account Name is required", color: "negative", position: "top" });
        return;
      }
      this.calcPending();
      const res = await apiSaveCredit({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Cash Credit saved!", color: "positive", position: "top" });
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
          this.$q.notify({ message: "Cash Credit deleted", color: "negative", position: "top" });
          this.loadCredits();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
