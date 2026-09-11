<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="store" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredOffices.length }}</span>
                <span class="total-stat-label">Total Offices</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredOffices"
            :columns="tableColumns"
            row-key="BookingOfficeId"
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
                      @keyup.enter="loadOffices"
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
                      @click="loadOffices"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <!-- Same "add_new_*" gradient-chip CSS family the Booking
                       pages use (see dms-booking-page-pattern skill) — text
                       comes entirely from the ".add_new_Master" class's
                       ::after rule in cn-style.css, so no `label` prop here
                       (passing one would double up the text, same trap as
                       add_new_job). -->
                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_Master m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddOffice"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadOffices"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-IsActive="props">
              <q-td :props="props">
                <q-badge :color="props.value ? 'positive' : 'grey'" :label="props.value ? 'Active' : 'Inactive'" />
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
                  @click="editOffice(props.row)"
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteOffice(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.BookingOfficeId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="store" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingOfficeName }}</span>
                      <span class="mjc-job-date">{{ props.row.BookingOfficeCode }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" :color="props.row.IsActive ? 'positive' : 'grey'">
                      {{ props.row.IsActive ? "Active" : "Inactive" }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.BookingOfficeId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editOffice(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeleteOffice(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.BookingOfficeId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">City</span><span class="mjc-detail-value">{{ props.row.CityName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Phone</span><span class="mjc-detail-value">{{ props.row.PhoneNo || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Contact</span><span class="mjc-detail-value">{{ props.row.ContactPersonName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Commission %</span><span class="mjc-detail-value">{{ props.row.DefaultCommission || "—" }}</span></div>
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
          <!-- ── Header — same "header-style" bar as DMSBBookingView.vue /
               DMSBookingView.vue: white bar, left breadcrumb + a couple of
               header-field-group boxes, right-aligned Save pill. No tabs
               needed here (Booking Office is one short field set), so the
               body below is a single card instead of a q-tabs/tab-panels
               split. ── -->
          <div class="row header-style items-center">
            <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
              <div class="header-title">
                <span class="header_text1">Booking Office</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
              </div>
              <div class="header-field-group">
                <q-input square dense outlined bg-color="blue-1" label="Code" v-model="form.BookingOfficeCode" />
              </div>
              <div class="header-field-group header-field-group-sm">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Status"
                  :model-value="form.IsActive ? 'Active' : 'Inactive'"
                />
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
                    @click="saveOffice"
                  />
                  <q-btn dense flat round icon="close" class="q-ml-xs" v-close-popup @click="closeDialog" />
                </div>
              </div>
            </div>
          </div>

          <!-- ── Body — single card, four fields per row on desktop, same
               grid density as the View pages' tab panels. ── -->
          <q-card class="tabs-container" style="flex: 1">
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Booking Office Name" v-model="form.BookingOfficeName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Print Name" v-model="form.PrintName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Account"
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
                    label="Booking Office Type"
                    v-model="form.BookingOfficeType"
                    :options="['Own Branch', 'Agent', 'Franchise']"
                  />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="City"
                    v-model="form.CityName"
                    :options="mockData.cities"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="State" v-model="form.StateName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Pincode" v-model="form.Pincode" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Email" v-model="form.Email" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Phone No." v-model="form.PhoneNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Mobile No." v-model="form.MobileNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Contact Person" v-model="form.ContactPersonName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Contact Phone" v-model="form.ContactPersonPhoneNo" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="TDS %" type="number" v-model="form.TDSPCT" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Default Commission %"
                    type="number"
                    v-model="form.DefaultCommission"
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <q-input square dense outlined bg-color="blue-1" label="Address" type="textarea" :rows="1" autogrow v-model="form.Address" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <q-input square dense outlined bg-color="blue-1" label="Remarks" v-model="form.Remarks" />
                </div>

                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.IsActive" val="orange" color="orange" intermediate-icon="black" />
                    </q-item-section>
                    <q-item-section><q-item-label dense>Active</q-item-label></q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.IsAgent" val="orange" color="orange" intermediate-icon="black" />
                    </q-item-section>
                    <q-item-section><q-item-label dense>Is Agent</q-item-label></q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.IsDeductTDS" val="orange" color="orange" intermediate-icon="black" />
                    </q-item-section>
                    <q-item-section><q-item-label dense>Deduct TDS</q-item-label></q-item-section>
                  </q-item>
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
  cities: ["Rajkot-G", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const MOCK_OFFICES = [
  {
    BookingOfficeId: 1,
    BookingOfficeName: "Greenland",
    PrintName: "Greenland Booking Office",
    BookingOfficeCode: "GRL",
    AccountName: "Select Party",
    Address: "Rajkot-G – Gujarat",
    CityName: "Rajkot-G",
    StateName: "Gujarat",
    Pincode: "360001",
    PhoneNo: "0281-1234567",
    MobileNo: "9876543210",
    Email: "greenland@cargonet.com",
    ContactPersonName: "Ketan Patel",
    ContactPersonPhoneNo: "9876543211",
    BookingOfficeType: "Own Branch",
    TDSPCT: 0,
    DefaultCommission: 5,
    Remarks: "",
    IsActive: true,
    IsAgent: false,
    IsDeductTDS: false,
  },
  {
    BookingOfficeId: 2,
    BookingOfficeName: "Chakan",
    PrintName: "Chakan Booking Office",
    BookingOfficeCode: "CHK",
    AccountName: "Select Party",
    Address: "Chakan – Maharashtra",
    CityName: "Chakan",
    StateName: "Maharashtra",
    Pincode: "410501",
    PhoneNo: "02135-123456",
    MobileNo: "9876500000",
    Email: "chakan@cargonet.com",
    ContactPersonName: "Suresh Rao",
    ContactPersonPhoneNo: "9876500001",
    BookingOfficeType: "Agent",
    TDSPCT: 2,
    DefaultCommission: 4,
    Remarks: "",
    IsActive: true,
    IsAgent: true,
    IsDeductTDS: true,
  },
];

function apiGetOffices(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_OFFICES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.BookingOfficeName.toLowerCase().includes(s) ||
            o.BookingOfficeCode.toLowerCase().includes(s) ||
            (o.CityName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveOffice(office) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (office.BookingOfficeId) {
        const idx = MOCK_OFFICES.findIndex((o) => o.BookingOfficeId === office.BookingOfficeId);
        if (idx !== -1) MOCK_OFFICES[idx] = { ...office };
      } else {
        office.BookingOfficeId = MOCK_OFFICES.length + 1;
        MOCK_OFFICES.push(office);
      }
      resolve({ success: true, data: office });
    }, 200);
  });
}

function apiDeleteOffice(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_OFFICES.findIndex((o) => o.BookingOfficeId === id);
      if (idx !== -1) MOCK_OFFICES.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

function apiGetOfficeById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_OFFICES.find((o) => o.BookingOfficeId === id) || null),
      100
    );
  });
}

// Consumed by DMSBookingOfficeView.vue — its own Add/Edit full-page tab,
// opened via openTab() from openAddOffice()/editOffice() below (same
// pattern as DMSBBooking.vue → DMSBBookingView.vue).
export { apiGetOfficeById, apiSaveOffice, MOCK_DATA };

export default {
  name: "DMSBookingOffice",

  // Lets openAddOffice()/editOffice() open the full-page Add/Edit tab
  // (DMSBookingOfficeView.vue) instead of the in-page popup. `default: null`
  // keeps this page working standalone (outside DynamicTab.vue) by falling
  // back to the old dialog — same convention as DMSBBooking.vue.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      offices: [],
      filteredOffices: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "BookingOfficeCode", label: "Code", field: "BookingOfficeCode", sortable: true },
        { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName", sortable: true },
        { name: "CityName", label: "City", field: "CityName", sortable: true },
        { name: "BookingOfficeType", label: "Type", field: "BookingOfficeType" },
        { name: "PhoneNo", label: "Phone", field: "PhoneNo" },
        { name: "DefaultCommission", label: "Commission %", field: "DefaultCommission", align: "center" },
        { name: "IsActive", label: "Status", field: "IsActive", align: "center" },
      ],
    };
  },

  mounted() {
    this.loadOffices();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadOffices();
    },

    async loadOffices() {
      this.filteredOffices = await apiGetOffices(this.searchText);
    },

    emptyForm() {
      return {
        BookingOfficeId: null,
        BookingOfficeName: "",
        PrintName: "",
        BookingOfficeCode: "",
        AccountName: "",
        Address: "",
        CityName: "",
        StateName: "",
        Pincode: "",
        PhoneNo: "",
        MobileNo: "",
        Email: "",
        ContactPersonName: "",
        ContactPersonPhoneNo: "",
        BookingOfficeType: "Own Branch",
        TDSPCT: 0,
        DefaultCommission: 0,
        Remarks: "",
        IsActive: true,
        IsAgent: false,
        IsDeductTDS: false,
      };
    },

    openAddOffice() {
      if (this.openTab) {
        this.openTab("/DMSBookingOfficeView?mode=add", "New Booking Office");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editOffice(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSBookingOfficeView?mode=edit&officeId=${row.BookingOfficeId}`,
          `Booking Office ${row.BookingOfficeName || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveOffice() {
      if (!this.form.BookingOfficeName) {
        this.$q.notify({ message: "Booking Office Name is required", color: "negative", position: "top" });
        return;
      }
      const res = await apiSaveOffice({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Booking Office saved!", color: "positive", position: "top" });
        this.showDialog = false;
        this.loadOffices();
      }
    },

    confirmDeleteOffice(row) {
      this.$q
        .dialog({
          title: "Delete Booking Office",
          message: `Delete booking office <b>${row.BookingOfficeName}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteOffice(row.BookingOfficeId);
          this.$q.notify({ message: "Booking Office deleted", color: "negative", position: "top" });
          this.loadOffices();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
