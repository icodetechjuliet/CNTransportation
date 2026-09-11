<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Commission</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="percent" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredCommissions.length }}</span>
                <span class="total-stat-label">Total Vouchers</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredCommissions"
            :columns="tableColumns"
            row-key="CommissionId"
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
                      @keyup.enter="loadCommissions"
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
                      @click="loadCommissions"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_Commission m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddCommission"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadCommissions"
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
                  @click="editCommission(props.row)"
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCommission(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.CommissionId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="percent" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.CommissionNo }}</span>
                      <span class="mjc-job-date">{{ props.row.CommissionDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" color="positive">
                      {{ props.row.NetPayable }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.CommissionId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editCommission(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeleteCommission(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.CommissionId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Booking Office</span><span class="mjc-detail-value">{{ props.row.BookingOfficeName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Commission Amt</span><span class="mjc-detail-value">{{ props.row.CommissionAmount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">TDS Amt</span><span class="mjc-detail-value">{{ props.row.TDSAmount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Net Payable</span><span class="mjc-detail-value">{{ props.row.NetPayable || "—" }}</span></div>
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
                <span class="header_text1">Commission</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
              </div>
              <div class="header-field-group">
                <q-input square dense outlined bg-color="blue-1" readonly label="Commission No." v-model="form.CommissionNo" />
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
                    @click="saveCommission"
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
                  <q-input square dense outlined bg-color="blue-1" readonly label="Commission No." v-model="form.CommissionNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Commission Date" v-model="form.CommissionDate" placeholder="dd/mm/yyyy">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="commissionDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="form.CommissionDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.commissionDateProxy.hide()"
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
                  <q-input square dense outlined bg-color="blue-1" label="Commission Amount" type="number" v-model="form.CommissionAmount" @update:model-value="calcTDS" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.IsDeductTDS" val="orange" color="orange" intermediate-icon="black" @update:model-value="calcTDS" />
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
                    v-model="form.TDSPCT"
                    :disable="!form.IsDeductTDS"
                    @update:model-value="calcTDS"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="TDS Amount" v-model="form.TDSAmount" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Net Payable" v-model="form.NetPayable" />
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

const MOCK_COMMISSIONS = [
  {
    CommissionId: 1,
    CommissionNo: "CM20260001",
    CommissionDate: "01/04/2026",
    BookingOfficeName: "Greenland",
    CommissionAmount: 5000,
    IsDeductTDS: true,
    TDSPCT: 5,
    TDSAmount: "250.00",
    NetPayable: "4750.00",
    Remarks: "",
  },
  {
    CommissionId: 2,
    CommissionNo: "CM20260002",
    CommissionDate: "02/04/2026",
    BookingOfficeName: "Chakan",
    CommissionAmount: 3200,
    IsDeductTDS: false,
    TDSPCT: 0,
    TDSAmount: "0.00",
    NetPayable: "3200.00",
    Remarks: "",
  },
];

function apiGetCommissions(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_COMMISSIONS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.CommissionNo.toLowerCase().includes(s) ||
            (o.BookingOfficeName || "").toLowerCase().includes(s) ||
            (o.Remarks || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveCommission(commission) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (commission.CommissionId) {
        const idx = MOCK_COMMISSIONS.findIndex((o) => o.CommissionId === commission.CommissionId);
        if (idx !== -1) MOCK_COMMISSIONS[idx] = { ...commission };
      } else {
        commission.CommissionId = MOCK_COMMISSIONS.length + 1;
        commission.CommissionNo = "CM" + new Date().getFullYear() + String(commission.CommissionId).padStart(4, "0");
        MOCK_COMMISSIONS.push(commission);
      }
      resolve({ success: true, data: commission });
    }, 200);
  });
}

function apiDeleteCommission(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_COMMISSIONS.findIndex((o) => o.CommissionId === id);
      if (idx !== -1) MOCK_COMMISSIONS.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

function apiGetCommissionById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_COMMISSIONS.find((o) => o.CommissionId === id) || null),
      100
    );
  });
}

// Consumed by DMSCommissionView.vue — its own Add/Edit full-page tab,
// opened via openTab() from openAddCommission()/editCommission() below
// (same pattern as DMSBBooking.vue → DMSBBookingView.vue).
export { apiGetCommissionById, apiSaveCommission, MOCK_DATA };

export default {
  name: "DMSCommission",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      commissions: [],
      filteredCommissions: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "CommissionNo", label: "Commission No.", field: "CommissionNo", sortable: true },
        { name: "CommissionDate", label: "Commission Date", field: "CommissionDate", sortable: true },
        { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName", sortable: true },
        { name: "CommissionAmount", label: "Commission Amt", field: "CommissionAmount", align: "right" },
        { name: "NetPayable", label: "Net Payable", field: "NetPayable", align: "right" },
      ],
    };
  },

  mounted() {
    this.loadCommissions();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadCommissions();
    },

    async loadCommissions() {
      this.filteredCommissions = await apiGetCommissions(this.searchText);
    },

    calcTDS() {
      const amount = parseFloat(this.form.CommissionAmount) || 0;
      const pct = parseFloat(this.form.TDSPCT) || 0;
      const tds = this.form.IsDeductTDS ? (amount * pct) / 100 : 0;
      this.form.TDSAmount = tds.toFixed(2);
      this.form.NetPayable = (amount - tds).toFixed(2);
    },

    emptyForm() {
      return {
        CommissionId: null,
        CommissionNo: "",
        CommissionDate: "",
        BookingOfficeName: "",
        CommissionAmount: 0,
        IsDeductTDS: false,
        TDSPCT: 0,
        TDSAmount: "0.00",
        NetPayable: "0.00",
        Remarks: "",
      };
    },

    openAddCommission() {
      if (this.openTab) {
        this.openTab("/DMSCommissionView?mode=add", "New Commission");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editCommission(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSCommissionView?mode=edit&commissionId=${row.CommissionId}`,
          `Commission ${row.CommissionNo || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveCommission() {
      if (!this.form.CommissionDate || !this.form.BookingOfficeName) {
        this.$q.notify({ message: "Commission Date and Booking Office are required", color: "negative", position: "top" });
        return;
      }
      this.calcTDS();
      const res = await apiSaveCommission({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Commission saved!", color: "positive", position: "top" });
        this.showDialog = false;
        this.loadCommissions();
      }
    },

    confirmDeleteCommission(row) {
      this.$q
        .dialog({
          title: "Delete Commission",
          message: `Delete commission voucher <b>${row.CommissionNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteCommission(row.CommissionId);
          this.$q.notify({ message: "Commission deleted", color: "negative", position: "top" });
          this.loadCommissions();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
