<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office Wise City</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="location_city" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredWiseCities.length }}</span>
                <span class="total-stat-label">Total Records</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredWiseCities"
            :columns="tableColumns"
            row-key="WiseCityId"
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
                      @keyup.enter="loadWiseCities"
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
                      @click="loadWiseCities"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_WiseCity m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddWiseCity"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadWiseCities"
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
                  @click="editWiseCity(props.row)"
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteWiseCity(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.WiseCityId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="location_city" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingOfficeName }}</span>
                      <span class="mjc-job-date">{{ props.row.CityName }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" :color="props.row.IsActive ? 'positive' : 'grey'">
                      {{ props.row.IsActive ? "Active" : "Inactive" }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.WiseCityId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editWiseCity(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeleteWiseCity(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.WiseCityId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
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
                <span class="header_text1">Booking Office Wise City</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
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
                    @click="saveWiseCity"
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
                    label="City Name"
                    v-model="form.CityName"
                    :options="mockData.cities"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                  />
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
  cities: ["Rajkot-G", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const MOCK_WISE_CITIES = [
  {
    WiseCityId: 1,
    BookingOfficeName: "Greenland",
    CityName: "Rajkot-G",
    Remarks: "",
    IsActive: true,
  },
  {
    WiseCityId: 2,
    BookingOfficeName: "Greenland",
    CityName: "Chakan",
    Remarks: "",
    IsActive: true,
  },
  {
    WiseCityId: 3,
    BookingOfficeName: "Chakan",
    CityName: "Nasik",
    Remarks: "",
    IsActive: true,
  },
  {
    WiseCityId: 4,
    BookingOfficeName: "Chakan",
    CityName: "Pune",
    Remarks: "",
    IsActive: false,
  },
];

function apiGetWiseCities(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_WISE_CITIES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.BookingOfficeName.toLowerCase().includes(s) ||
            o.CityName.toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveWiseCity(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (record.WiseCityId) {
        const idx = MOCK_WISE_CITIES.findIndex((o) => o.WiseCityId === record.WiseCityId);
        if (idx !== -1) MOCK_WISE_CITIES[idx] = { ...record };
      } else {
        record.WiseCityId = MOCK_WISE_CITIES.length + 1;
        MOCK_WISE_CITIES.push(record);
      }
      resolve({ success: true, data: record });
    }, 200);
  });
}

function apiDeleteWiseCity(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_WISE_CITIES.findIndex((o) => o.WiseCityId === id);
      if (idx !== -1) MOCK_WISE_CITIES.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

function apiGetWiseCityById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_WISE_CITIES.find((o) => o.WiseCityId === id) || null),
      100
    );
  });
}

// Consumed by DMSBookingOfficeWiseCityView.vue — its own Add/Edit full-page
// tab, opened via openTab() from openAddWiseCity()/editWiseCity() below
// (same pattern as DMSBookingOffice.vue → DMSBookingOfficeView.vue).
export { apiGetWiseCityById, apiSaveWiseCity, MOCK_DATA };

export default {
  name: "DMSBookingOfficeWiseCity",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      wiseCities: [],
      filteredWiseCities: [],
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
        { name: "CityName", label: "City", field: "CityName", sortable: true },
        { name: "Remarks", label: "Remarks", field: "Remarks" },
        { name: "IsActive", label: "Status", field: "IsActive", align: "center" },
      ],
    };
  },

  mounted() {
    this.loadWiseCities();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadWiseCities();
    },

    async loadWiseCities() {
      this.filteredWiseCities = await apiGetWiseCities(this.searchText);
    },

    emptyForm() {
      return {
        WiseCityId: null,
        BookingOfficeName: "",
        CityName: "",
        Remarks: "",
        IsActive: true,
      };
    },

    openAddWiseCity() {
      if (this.openTab) {
        this.openTab("/DMSBookingOfficeWiseCityView?mode=add", "New Wise City");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editWiseCity(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSBookingOfficeWiseCityView?mode=edit&wiseCityId=${row.WiseCityId}`,
          `Wise City ${row.CityName || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async saveWiseCity() {
      if (!this.form.BookingOfficeName || !this.form.CityName) {
        this.$q.notify({ message: "Booking Office and City are required", color: "negative", position: "top" });
        return;
      }
      const res = await apiSaveWiseCity({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Wise City saved!", color: "positive", position: "top" });
        this.showDialog = false;
        this.loadWiseCities();
      }
    },

    confirmDeleteWiseCity(row) {
      this.$q
        .dialog({
          title: "Delete Wise City",
          message: `Delete mapping for <b>${row.BookingOfficeName}</b> / <b>${row.CityName}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteWiseCity(row.WiseCityId);
          this.$q.notify({ message: "Wise City deleted", color: "negative", position: "top" });
          this.loadWiseCities();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
