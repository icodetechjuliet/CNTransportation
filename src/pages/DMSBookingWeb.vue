<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Web</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="language" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredWebBookings.length }}</span>
                <span class="total-stat-label">Total Web Bookings</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredWebBookings"
            :columns="tableColumns"
            row-key="BookingWebId"
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
                      @keyup.enter="loadWebBookings"
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
                      @click="loadWebBookings"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_Web m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddWebBooking"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadWebBookings"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge :color="statusColor(props.value)" :label="props.value" />
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
                  @click="editWebBooking(props.row)"
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-right-left"
                  color="positive"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="convertToBooking(props.row)"
                  ><q-tooltip>Convert to Booking</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteWebBooking(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.BookingWebId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="language" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingWebNo }}</span>
                      <span class="mjc-job-date">{{ props.row.BookingWebDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" :color="statusColor(props.row.Status)">
                      {{ props.row.Status }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.BookingWebId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editWebBooking(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-right-left" label="Convert" class="mjc-btn mjc-btn-edit" @click="convertToBooking(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeleteWebBooking(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.BookingWebId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Consignor</span><span class="mjc-detail-value">{{ props.row.ConsignorAccount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Consignee</span><span class="mjc-detail-value">{{ props.row.ConsigneeAccount || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Item</span><span class="mjc-detail-value">{{ props.row.ItemName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Bill No.</span><span class="mjc-detail-value">{{ props.row.BillNo || "—" }}</span></div>
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
                <span class="header_text1">Booking Web</span>
                <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
                <span class="header_text2">{{ dialogMode === "add" ? "Add" : "Edit" }}</span>
              </div>
              <div class="header-field-group">
                <q-input square dense outlined bg-color="blue-1" readonly label="Web No." v-model="form.BookingWebNo" />
              </div>
              <div class="header-field-group header-field-group-sm">
                <q-input square dense outlined bg-color="blue-1" readonly label="Status" v-model="form.Status" />
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
                    @click="saveWebBooking"
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
                  <q-input square dense outlined bg-color="blue-1" label="Web Date" v-model="form.BookingWebDate">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="webDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="form.BookingWebDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.webDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Web Time" v-model="form.BookingWebTime" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="From City"
                    v-model="form.FromCity"
                    :options="mockData.cities"
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
                    label="To City"
                    v-model="form.ToCity"
                    :options="mockData.cities"
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
                    label="Consignor Account"
                    v-model="form.ConsignorAccount"
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
                    label="Consignee Account"
                    v-model="form.ConsigneeAccount"
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
                    :options="['Box', 'Parcel', 'Pallet', 'Crate', 'Drum']"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Bill No." v-model="form.BillNo" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Bill Value" type="number" v-model="form.BillValue" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" label="Quantity" type="number" v-model="form.Quantity" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Payment Type"
                    v-model="form.PaymentType"
                    :options="['ToPay', 'Paid', 'TBBS', 'TBBR']"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Status"
                    v-model="form.Status"
                    :options="['Pending Conversion', 'Converted', 'Rejected']"
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
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
  cities: ["Rajkot-G", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const MOCK_WEB_BOOKINGS = [
  {
    BookingWebId: 1,
    BookingWebNo: "WEB0001",
    BookingWebDate: "01/09/2026",
    BookingWebTime: "10:30",
    FromCity: "Mumbai",
    ToCity: "Pune",
    ConsignorAccount: "Balaji xxx Co.",
    ConsigneeAccount: "Rajsani xxx Polymers",
    ItemName: "Box",
    BillNo: "BN-1001",
    BillValue: 12500,
    Quantity: 10,
    PaymentType: "ToPay",
    Status: "Pending Conversion",
    Remarks: "",
  },
  {
    BookingWebId: 2,
    BookingWebNo: "WEB0002",
    BookingWebDate: "03/09/2026",
    BookingWebTime: "14:15",
    FromCity: "Chakan",
    ToCity: "Nasik",
    ConsignorAccount: "Ring xxx Aqua",
    ConsigneeAccount: "Select Party",
    ItemName: "Pallet",
    BillNo: "BN-1002",
    BillValue: 8600,
    Quantity: 4,
    PaymentType: "Paid",
    Status: "Converted",
    Remarks: "",
  },
];

function apiGetWebBookings(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_WEB_BOOKINGS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.BookingWebNo.toLowerCase().includes(s) ||
            (o.FromCity || "").toLowerCase().includes(s) ||
            (o.ToCity || "").toLowerCase().includes(s) ||
            (o.ConsignorAccount || "").toLowerCase().includes(s) ||
            (o.ConsigneeAccount || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiSaveWebBooking(webBooking) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (webBooking.BookingWebId) {
        const idx = MOCK_WEB_BOOKINGS.findIndex((o) => o.BookingWebId === webBooking.BookingWebId);
        if (idx !== -1) MOCK_WEB_BOOKINGS[idx] = { ...webBooking };
      } else {
        webBooking.BookingWebId = MOCK_WEB_BOOKINGS.length + 1;
        MOCK_WEB_BOOKINGS.push(webBooking);
      }
      resolve({ success: true, data: webBooking });
    }, 200);
  });
}

function apiDeleteWebBooking(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_WEB_BOOKINGS.findIndex((o) => o.BookingWebId === id);
      if (idx !== -1) MOCK_WEB_BOOKINGS.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

function apiGetWebBookingById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_WEB_BOOKINGS.find((o) => o.BookingWebId === id) || null),
      100
    );
  });
}

// Consumed by DMSBookingWebView.vue — its own Add/Edit full-page tab,
// opened via openTab() from openAddWebBooking()/editWebBooking() below
// (same pattern as DMSBBooking.vue → DMSBBookingView.vue).
export { apiGetWebBookingById, apiSaveWebBooking, MOCK_DATA };

export default {
  name: "DMSBookingWeb",

  // Lets openAddWebBooking()/editWebBooking() open the full-page Add/Edit
  // tab (DMSBookingWebView.vue) instead of the in-page popup. `default:
  // null` keeps this page working standalone (outside DynamicTab.vue) by
  // falling back to the old dialog — same convention as DMSBBooking.vue.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      webBookings: [],
      filteredWebBookings: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "BookingWebNo", label: "Web No.", field: "BookingWebNo", sortable: true },
        { name: "BookingWebDate", label: "Date", field: "BookingWebDate", sortable: true },
        { name: "FromCity", label: "From City", field: "FromCity", sortable: true },
        { name: "ToCity", label: "To City", field: "ToCity", sortable: true },
        { name: "ConsignorAccount", label: "Consignor", field: "ConsignorAccount" },
        { name: "ConsigneeAccount", label: "Consignee", field: "ConsigneeAccount" },
        { name: "Status", label: "Status", field: "Status", align: "center" },
      ],
    };
  },

  mounted() {
    this.loadWebBookings();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    statusColor(status) {
      if (status === "Converted") return "positive";
      if (status === "Rejected") return "negative";
      return "orange";
    },

    clearSearch() {
      this.searchText = "";
      this.loadWebBookings();
    },

    async loadWebBookings() {
      this.filteredWebBookings = await apiGetWebBookings(this.searchText);
    },

    nextWebNo() {
      const n = MOCK_WEB_BOOKINGS.length + 1;
      return "WEB" + String(n).padStart(4, "0");
    },

    emptyForm() {
      return {
        BookingWebId: null,
        BookingWebNo: this.nextWebNo(),
        BookingWebDate: "",
        BookingWebTime: "",
        FromCity: "",
        ToCity: "",
        ConsignorAccount: "",
        ConsigneeAccount: "",
        ItemName: "",
        BillNo: "",
        BillValue: 0,
        Quantity: 0,
        PaymentType: "ToPay",
        Status: "Pending Conversion",
        Remarks: "",
      };
    },

    openAddWebBooking() {
      if (this.openTab) {
        this.openTab("/DMSBookingWebView?mode=add", "New Booking Web");
        return;
      }
      this.form = this.emptyForm();
      this.dialogMode = "add";
      this.showDialog = true;
    },

    editWebBooking(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSBookingWebView?mode=edit&webId=${row.BookingWebId}`,
          `Booking Web ${row.BookingWebNo || ""}`.trim()
        );
        return;
      }
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    convertToBooking() {
      this.$q.notify({
        message: "Convert to Booking — not yet wired to DMSBooking.vue",
        color: "info",
        position: "top",
      });
    },

    async saveWebBooking() {
      if (!this.form.FromCity || !this.form.ToCity) {
        this.$q.notify({ message: "From City and To City are required", color: "negative", position: "top" });
        return;
      }
      const res = await apiSaveWebBooking({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Booking Web saved!", color: "positive", position: "top" });
        this.showDialog = false;
        this.loadWebBookings();
      }
    },

    confirmDeleteWebBooking(row) {
      this.$q
        .dialog({
          title: "Delete Booking Web",
          message: `Delete web booking <b>${row.BookingWebNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteWebBooking(row.BookingWebId);
          this.$q.notify({ message: "Booking Web deleted", color: "negative", position: "top" });
          this.loadWebBookings();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
