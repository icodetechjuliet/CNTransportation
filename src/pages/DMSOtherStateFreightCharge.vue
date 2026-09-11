<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Other State Freight Charge</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredCharges.length }}</span>
                <span class="total-stat-label">Total Vouchers</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredCharges"
            :columns="tableColumns"
            row-key="OSFChargeId"
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
                      @keyup.enter="loadCharges"
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
                      @click="loadCharges"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_OSFreight m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddCharge"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadCharges"
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
                  @click="editCharge(props.row)"
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCharge(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.OSFChargeId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="local_shipping" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.VoucherNo }}</span>
                      <span class="mjc-job-date">{{ props.row.VoucherDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="primary">
                      {{ props.row.NetAmount }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.OSFChargeId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editCharge(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeleteCharge(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.OSFChargeId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Account</span><span class="mjc-detail-value">{{ props.row.AccountName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Reference No.</span><span class="mjc-detail-value">{{ props.row.ReferenceNo || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Total Amount</span><span class="mjc-detail-value">{{ props.row.TotalAmount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Net Amount</span><span class="mjc-detail-value">{{ props.row.NetAmount || "—" }}</span></div>
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
                <span class="header_text1">Other State Freight Charge</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
              </div>
              <div class="header-field-group">
                <q-input square dense outlined bg-color="blue-1" readonly label="Voucher No." v-model="form.VoucherNo" />
              </div>
              <div class="header-field-group header-field-group-sm">
                <q-input square dense outlined bg-color="blue-1" readonly label="Net Amount" v-model="form.NetAmount" />
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
                    @click="saveCharge"
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
                    label="Account Name"
                    v-model="form.AccountName"
                    :options="mockData.parties"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Reference No." v-model="form.ReferenceNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Reference Date" v-model="form.ReferenceDate">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="referenceDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="form.ReferenceDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.referenceDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="SAC Code" v-model="form.SACCode" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Print Title" v-model="form.PrintTitle" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Total Amount"
                    type="number"
                    v-model.number="form.TotalAmount"
                    @update:model-value="calcTDS"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox
                        dense
                        v-model="form.IsDeductTDS"
                        val="orange"
                        color="orange"
                        intermediate-icon="black"
                        @update:model-value="calcTDS"
                      />
                    </q-item-section>
                    <q-item-section><q-item-label dense>Deduct TDS</q-item-label></q-item-section>
                  </q-item>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="TDS %"
                    type="number"
                    :disable="!form.IsDeductTDS"
                    v-model.number="form.TDSPCT"
                    @update:model-value="calcTDS"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" v-if="form.IsDeductTDS">
                  <q-input square dense outlined bg-color="blue-1" readonly label="TDS Amount" v-model="form.TDSAmount" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Net Amount" v-model="form.NetAmount" />
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
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
};

const MOCK_CHARGES = [
  {
    OSFChargeId: 1,
    VoucherNo: "OSF0001",
    VoucherDate: "02/09/2026",
    AccountName: "Balaji xxx Co.",
    ReferenceNo: "REF-501",
    ReferenceDate: "01/09/2026",
    SACCode: "996511",
    PrintTitle: "Other State Freight",
    TotalAmount: 15000,
    IsDeductTDS: true,
    TDSPCT: 2,
    TDSAmount: 300,
    NetAmount: 14700,
    Remarks: "",
  },
  {
    OSFChargeId: 2,
    VoucherNo: "OSF0002",
    VoucherDate: "05/09/2026",
    AccountName: "Rajsani xxx Polymers",
    ReferenceNo: "REF-502",
    ReferenceDate: "04/09/2026",
    SACCode: "996511",
    PrintTitle: "Other State Freight",
    TotalAmount: 9000,
    IsDeductTDS: false,
    TDSPCT: 0,
    TDSAmount: 0,
    NetAmount: 9000,
    Remarks: "",
  },
];

function apiGetCharges(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_CHARGES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.VoucherNo.toLowerCase().includes(s) ||
            (o.AccountName || "").toLowerCase().includes(s) ||
            (o.ReferenceNo || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveCharge(charge) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (charge.OSFChargeId) {
        const idx = MOCK_CHARGES.findIndex((o) => o.OSFChargeId === charge.OSFChargeId);
        if (idx !== -1) MOCK_CHARGES[idx] = { ...charge };
      } else {
        charge.OSFChargeId = MOCK_CHARGES.length + 1;
        MOCK_CHARGES.push(charge);
      }
      resolve({ success: true, data: charge });
    }, 200);
  });
}

function apiDeleteCharge(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_CHARGES.findIndex((o) => o.OSFChargeId === id);
      if (idx !== -1) MOCK_CHARGES.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

function apiGetChargeById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_CHARGES.find((o) => o.OSFChargeId === id) || null),
      100
    );
  });
}

// Consumed by DMSOtherStateFreightChargeView.vue — its own Add/Edit
// full-page tab, opened via openTab() from openAddCharge()/editCharge()
// below (same pattern as DMSBBooking.vue → DMSBBookingView.vue).
export { apiGetChargeById, apiSaveCharge, MOCK_DATA };

export default {
  name: "DMSOtherStateFreightCharge",

  // Lets openAddCharge()/editCharge() open the full-page Add/Edit tab
  // (DMSOtherStateFreightChargeView.vue) instead of the in-page popup.
  // `default: null` keeps this page working standalone (outside
  // DynamicTab.vue) by falling back to the old dialog — same convention as
  // DMSBBooking.vue.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      charges: [],
      filteredCharges: [],
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
        { name: "AccountName", label: "Account", field: "AccountName", sortable: true },
        { name: "TotalAmount", label: "Total Amount", field: "TotalAmount", align: "right" },
        { name: "NetAmount", label: "Net Amount", field: "NetAmount", align: "right" },
      ],
    };
  },

  mounted() {
    this.loadCharges();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadCharges();
    },

    async loadCharges() {
      this.filteredCharges = await apiGetCharges(this.searchText);
    },

    calcTDS() {
      const total = Number(this.form.TotalAmount) || 0;
      const pct = this.form.IsDeductTDS ? Number(this.form.TDSPCT) || 0 : 0;
      this.form.TDSAmount = this.form.IsDeductTDS ? Math.round((total * pct) / 100) : 0;
      this.form.NetAmount = total - this.form.TDSAmount;
    },

    nextVoucherNo() {
      const n = MOCK_CHARGES.length + 1;
      return "OSF" + String(n).padStart(4, "0");
    },

    emptyForm() {
      return {
        OSFChargeId: null,
        VoucherNo: this.nextVoucherNo(),
        VoucherDate: "",
        AccountName: "",
        ReferenceNo: "",
        ReferenceDate: "",
        SACCode: "",
        PrintTitle: "",
        TotalAmount: 0,
        IsDeductTDS: false,
        TDSPCT: 0,
        TDSAmount: 0,
        NetAmount: 0,
        Remarks: "",
      };
    },

    openAddCharge() {
      if (this.openTab) {
        this.openTab("/DMSOtherStateFreightChargeView?mode=add", "New Other State Freight Charge");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editCharge(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSOtherStateFreightChargeView?mode=edit&chargeId=${row.OSFChargeId}`,
          `Other State Freight Charge ${row.VoucherNo || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveCharge() {
      if (!this.form.AccountName) {
        this.$q.notify({ message: "Account Name is required", color: "negative", position: "top" });
        return;
      }
      this.calcTDS();
      const res = await apiSaveCharge({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Other State Freight Charge saved!", color: "positive", position: "top" });
        this.showDialog = false;
        this.loadCharges();
      }
    },

    confirmDeleteCharge(row) {
      this.$q
        .dialog({
          title: "Delete Other State Freight Charge",
          message: `Delete voucher <b>${row.VoucherNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteCharge(row.OSFChargeId);
          this.$q.notify({ message: "Other State Freight Charge deleted", color: "negative", position: "top" });
          this.loadCharges();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
