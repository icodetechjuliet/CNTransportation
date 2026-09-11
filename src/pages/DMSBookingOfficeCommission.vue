<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office Commission</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="percent" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredCommissions.length }}</span>
                <span class="total-stat-label">Total Records</span>
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
                    class="add_new_OfcCommission m_add_newjob bg-dblue-lblue"
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
                      <span class="mjc-job-no">{{ props.row.BookingOfficeName }}</span>
                      <span class="mjc-job-date">{{ props.row.FromDate }} - {{ props.row.ToDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
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
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Account</span><span class="mjc-detail-value">{{ props.row.AccountName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Item</span><span class="mjc-detail-value">{{ props.row.ItemName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Inward %</span><span class="mjc-detail-value">{{ props.row.InwardCommissionRate || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Outward %</span><span class="mjc-detail-value">{{ props.row.OutwardCommissionRate || "—" }}</span></div>
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
                <span class="header_text1">Booking Office Commission</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
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
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Booking Office Name"
                    v-model="form.BookingOfficeName"
                    :options="mockData.bookingOffices"
                  />
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
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Item Name"
                    v-model="form.ItemName"
                    :options="mockData.items"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="From Date"
                    v-model="form.FromDate"
                    placeholder="dd/mm/yyyy"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="fromDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="form.FromDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.fromDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="To Date"
                    v-model="form.ToDate"
                    placeholder="dd/mm/yyyy"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="toDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="form.ToDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.toDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Inward Commission Rate"
                    type="number"
                    v-model="form.InwardCommissionRate"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Outward Commission Rate"
                    type="number"
                    v-model="form.OutwardCommissionRate"
                  />
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
  bookingOffices: ["Greenland", "Chakan"],
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
  items: ["Box", "Parcel", "Pallet", "Crate", "Drum"],
};

const MOCK_COMMISSIONS = [
  {
    CommissionId: 1,
    BookingOfficeName: "Greenland",
    AccountName: "Balaji xxx Co.",
    ItemName: "Box",
    FromDate: "01/04/2026",
    ToDate: "30/06/2026",
    InwardCommissionRate: 4,
    OutwardCommissionRate: 5,
    Remarks: "",
  },
  {
    CommissionId: 2,
    BookingOfficeName: "Greenland",
    AccountName: "Rajsani xxx Polymers",
    ItemName: "Pallet",
    FromDate: "01/04/2026",
    ToDate: "30/09/2026",
    InwardCommissionRate: 3,
    OutwardCommissionRate: 4,
    Remarks: "",
  },
  {
    CommissionId: 3,
    BookingOfficeName: "Chakan",
    AccountName: "Ring xxx Aqua",
    ItemName: "Crate",
    FromDate: "01/01/2026",
    ToDate: "31/03/2026",
    InwardCommissionRate: 2.5,
    OutwardCommissionRate: 3.5,
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
            o.BookingOfficeName.toLowerCase().includes(s) ||
            (o.AccountName || "").toLowerCase().includes(s) ||
            (o.ItemName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveCommission(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (record.CommissionId) {
        const idx = MOCK_COMMISSIONS.findIndex((o) => o.CommissionId === record.CommissionId);
        if (idx !== -1) MOCK_COMMISSIONS[idx] = { ...record };
      } else {
        record.CommissionId = MOCK_COMMISSIONS.length + 1;
        MOCK_COMMISSIONS.push(record);
      }
      resolve({ success: true, data: record });
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

// Consumed by DMSBookingOfficeCommissionView.vue — its own Add/Edit
// full-page tab, opened via openTab() from
// openAddCommission()/editCommission() below (same pattern as
// DMSBookingOffice.vue → DMSBookingOfficeView.vue).
export { apiGetCommissionById, apiSaveCommission, MOCK_DATA };

export default {
  name: "DMSBookingOfficeCommission",

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
        { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName", sortable: true },
        { name: "AccountName", label: "Account", field: "AccountName", sortable: true },
        { name: "ItemName", label: "Item", field: "ItemName", sortable: true },
        { name: "FromDate", label: "From Date", field: "FromDate" },
        { name: "ToDate", label: "To Date", field: "ToDate" },
        { name: "InwardCommissionRate", label: "Inward Rate", field: "InwardCommissionRate", align: "center" },
        { name: "OutwardCommissionRate", label: "Outward Rate", field: "OutwardCommissionRate", align: "center" },
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

    emptyForm() {
      return {
        CommissionId: null,
        BookingOfficeName: "",
        AccountName: "",
        ItemName: "",
        FromDate: "",
        ToDate: "",
        InwardCommissionRate: 0,
        OutwardCommissionRate: 0,
        Remarks: "",
      };
    },

    openAddCommission() {
      if (this.openTab) {
        this.openTab("/DMSBookingOfficeCommissionView?mode=add", "New Booking Office Commission");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editCommission(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSBookingOfficeCommissionView?mode=edit&commissionId=${row.CommissionId}`,
          `Commission ${row.BookingOfficeName || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveCommission() {
      if (!this.form.BookingOfficeName || !this.form.AccountName) {
        this.$q.notify({ message: "Booking Office and Account are required", color: "negative", position: "top" });
        return;
      }
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
          message: `Delete commission slab for <b>${row.BookingOfficeName}</b> / <b>${row.AccountName}</b>?`,
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
