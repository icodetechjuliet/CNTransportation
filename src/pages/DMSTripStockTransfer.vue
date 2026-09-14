<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <!-- ── Header row (title + total count) — same shape as
               DMSTrip.vue's header. This page is the same Trip entity,
               fixed to IsStockTransferTrip = true, the way
               DMSTruckBooking.vue is DMSBooking.vue's data fixed to one
               carrier mode. ── -->
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Trip - Stock Transfer</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="swap_horiz" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredTrips.length }}</span>
                <span class="total-stat-label">Total Stock Transfer Trips</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid ── -->
          <q-table
            square
            :rows="filteredTrips"
            :columns="tableColumns"
            row-key="TripId"
            :visible-columns="visibleColumns"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
            card-class="text-black"
            :grid="$q.screen.lt.sm"
          >
            <template v-slot:top="props">
              <div class="tb-app col">
                <div class="filter-bar-wrapper accent-filter-bar">
                  <div class="search-combo-wrapper">
                    <input
                      v-model="searchText"
                      class="search-combo-input"
                      placeholder="Search Any"
                      @keyup.enter="loadTrips"
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
                      @click="loadTrips"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    accesskey="n"
                    class="add_new_stocktransfer m_add_newjob bg-dblue-lblue"
                    @click="openAddTrip"
                  />

                  <q-select
                    square=""
                    v-model="statusFilter"
                    :options="['All', 'Loaded', 'Unloaded']"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="width: 130px"
                    class="q-mx-xs"
                    @update:model-value="loadTrips"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadTrips"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />

                  <q-btn
                    flat
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
                    @click="props.toggleFullscreen"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                  />
                </div>
              </div>
            </template>

            <template v-slot:pagination>
              <q-pagination
                v-model="pagination.page"
                direction-links
                :max="maxPages"
                :max-pages="10"
                boundary-links
                boundary-numbers
                color="blue"
                size="md"
                dense
                @update:model-value="handlePageChange"
              />
              <span class="q-ml-md">
                Page {{ pagination.page }} of {{ maxPages }}
              </span>
            </template>

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge
                  :color="statusColor(props.value)"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-eye"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style vw"
                  @click="viewTrip(props.row)"
                >
                  <q-tooltip>View</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editTrip(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.TripId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="swap_horiz" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.TripNo }}</span>
                      <span class="mjc-job-date">{{ props.row.TripDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="statusColor(props.row.Status)"
                    >
                      {{ props.row.Status }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.TripId)
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
                    icon="fa-solid fa-eye"
                    label="View"
                    class="mjc-btn mjc-btn-view"
                    @click="viewTrip(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-pen-to-square"
                    label="Edit"
                    class="mjc-btn mjc-btn-edit"
                    @click="editTrip(props.row)"
                  />
                </div>
                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.TripId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Route</span>
                        <span class="mjc-detail-value">
                          {{ props.row.FromCity }} → {{ props.row.ToCity }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Booking Office</span>
                        <span class="mjc-detail-value">
                          {{ props.row.FromBookingOffice }} →
                          {{ props.row.ToBookingOffice }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Vehicle</span>
                        <span class="mjc-detail-value">
                          {{ props.row.VehicleNo || "—" }}
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
// Reuses DMSTrip.vue's mock "backend" — a stock transfer trip is just a
// Trip row with IsStockTransferTrip = true, same as the legacy EagleParcel
// TRP_Trip table's own IsStockTransferTrip column. Keeping one shared
// MOCK_TRIPS store (instead of a second copy here) is what lets a trip
// created here show up correctly in DMSTrip.vue's own list too.
import {
  apiGetTrips,
  apiGetTripById,
  apiSaveTrip,
  MOCK_DATA,
} from "src/data/tripData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadTrips",
  name: "DMSTripStockTransfer",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      filteredTrips: [],
      statusFilter: "All",
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showTripDialog: false,
      dialogMode: "view",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      visibleColumns: [
        "action",
        "Status",
        "TripNo",
        "TripDate",
        "FromCity",
        "ToCity",
        "VehicleNo",
        "Quantity",
        "FromBookingOffice",
      ],

      baseColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "Status",
          label: "Status",
          field: "Status",
          align: "center",
          sortable: true,
        },
        { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
        { name: "TripDate", label: "Date", field: "TripDate", sortable: true },
        {
          name: "FromCity",
          label: "From Branch",
          field: "FromCity",
          sortable: true,
        },
        { name: "ToCity", label: "To Branch", field: "ToCity", sortable: true },
        { name: "VehicleNo", label: "Vehicle", field: "VehicleNo" },
        {
          name: "Quantity",
          label: "Quantity",
          field: "Quantity",
          align: "right",
        },
        {
          name: "FromBookingOffice",
          label: "Booking Office",
          field: "FromBookingOffice",
        },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredTrips.length / rows));
    },
  },

  mounted() {
    this.loadTrips();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadTrips();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadTrips() {
      const result = await apiGetTrips("All", "Trip No", this.searchText);
      this.filteredTrips = result.filter(
        (t) =>
          t.IsStockTransferTrip &&
          (this.statusFilter === "All" || t.Status === this.statusFilter)
      );
    },

    statusColor(status) {
      const map = { Loaded: "orange", Unloaded: "positive" };
      return map[status] || "grey";
    },

    emptyForm() {
      return {
        TripId: null,
        TripNo: "",
        TripDate: "01/04/2026",
        Status: "Loaded",
        FromCity: "",
        ToCity: "",
        BookingOffice: "Greenland",
        ToBookingOffice: "",
        Transporter: "",
        TripStartTime: "",
        TripCompleteDateTime: "",
        AdvanceAmount: 0,
        Remarks: "",
        IsStockTransferTrip: true,
        Vehicle1No: "",
        Vehicle1Driver: "",
        Vehicle1FromCity: "",
        Vehicle1ToCity: "",
        Vehicle1Amount: 0,
        Vehicle2No: "",
        Vehicle2Driver: "",
        Vehicle2FromCity: "",
        Vehicle2ToCity: "",
        Vehicle2Amount: 0,
        Vehicle3No: "",
        Vehicle3Driver: "",
        Vehicle3FromCity: "",
        Vehicle3ToCity: "",
        Vehicle3Amount: 0,
        TotalTripAmount: "0.00",
        Posted: false,
      };
    },

    calcTotal() {
      const total =
        (parseFloat(this.form.Vehicle1Amount) || 0) +
        (parseFloat(this.form.Vehicle2Amount) || 0) +
        (parseFloat(this.form.Vehicle3Amount) || 0);
      this.form.TotalTripAmount = total.toFixed(2);
    },

    openAddTrip() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      if (this.entryPage) {
        this.showTripDialog = true;
      } else {
        this.openEntryPage(
          `/DMSTripStockTransferForm?mode=${this.dialogMode}&id=${
            this.form.TripId || ""
          }`,
          "Trip - Stock Transfer"
        );
      }
    },

    viewTrip(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSTripView?tripId=${row.TripId}`,
          `Trip ${row.TripNo}`.trim()
        );
        return;
      }
      this.editTrip(row, "view");
    },

    async editTrip(row, mode = "edit") {
      const data = await apiGetTripById(row.TripId);
      this.form = { ...data };
      this.dialogMode = mode;
      if (this.entryPage) {
        this.showTripDialog = true;
      } else {
        this.openEntryPage(
          `/DMSTripStockTransferForm?mode=${this.dialogMode}&id=${
            this.form.TripId || ""
          }`,
          "Trip - Stock Transfer"
        );
      }
    },

    async saveTrip() {
      this.calcTotal();
      this.form.IsStockTransferTrip = true;
      const res = await apiSaveTrip({ ...this.form });
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Stock transfer trip saved!",
          color: "positive",
          position: "top",
        });
        this.showTripDialog = false;
        this.notifyEntrySaved();
        await this.loadTrips();
      }
    },

    closeDialog() {
      this.showTripDialog = false;
    },
  },
};
</script>
