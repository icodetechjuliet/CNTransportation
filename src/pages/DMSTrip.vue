<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Trip</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredTrips.length }}</span>
                <span class="total-stat-label">Total Trips</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid ── -->
          <q-table
            square
            dense
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

                  <!-- Plain gradient chip, NOT the ".add_new_job" class family —
                       that class injects its own CSS ::after text ("Raise
                       New Shipment (n)") on ".q-btn__content", which
                       renders on top of/alongside this button's own real
                       label and garbles into overlapping text. See
                       dms-booking-page-pattern skill §2 for the mechanism
                       (DMSBooking.vue's own "Raise New Booking" button
                       currently has this same live bug — not fixed here,
                       out of scope, but not copied into this new button). -->
                  <q-btn
                    unelevated
                    dense
                    no-caps
                    icon="add"
                    label="Raise New TripSheet"
                    class="bg-dblue-lblue text-white radius-md q-px-sm text-no-wrap"
                    @click="openAddTrip"
                  />

                  <q-select
                    v-model="tripType"
                    :options="['All', 'Outward', 'Inward']"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="width: 110px"
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
                    dense
                    icon="tune"
                    label="Columns"
                    class="filter-btn bg-blue-300 bdr-blue-2 q-mx-sm"
                  >
                    <q-menu
                      anchor="bottom right"
                      self="top right"
                      :offset="[0, 8]"
                      class="column-filter-menu"
                    >
                      <div class="menu-header">Columns</div>
                      <q-separator />
                      <q-list class="column-list">
                        <q-item
                          v-for="col in columnOptions"
                          :key="col.name"
                          clickable
                          v-ripple
                          @click="toggleColumn(col.name)"
                          class="column-item"
                        >
                          <q-item-section avatar>
                            <q-checkbox
                              :model-value="isChecked(col.name)"
                              @update:model-value="toggleColumn(col.name)"
                              @click.stop
                            />
                          </q-item-section>
                          <q-item-section>{{ col.label }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>

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
              <span class="q-ml-md"
                >Page {{ pagination.page }} of {{ maxPages }}</span
              >
            </template>

            <!-- ── Desktop column slots ── -->
            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge :color="statusColor(props.value)" :label="props.value" />
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
                  ><q-tooltip>View</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editTrip(props.row)"
                  ><q-tooltip>Modify</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-print"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style q-ml-xs"
                  @click="printTrip(props.row)"
                  ><q-tooltip>Print</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-truck"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style q-ml-xs"
                  @click="openUpdateVehicle(props.row)"
                  ><q-tooltip>Update Vehicle / Carrier</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:body-cell-delete="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="deleteTrip(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <!-- ── Mobile card (grid mode) ── -->
            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.TripId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="local_shipping" size="14px" />
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
                    label="Modify"
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
                        <span class="mjc-detail-value"
                          >{{ props.row.FromCity }} →
                          {{ props.row.ToCity }}</span
                        >
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Vehicle</span>
                        <span class="mjc-detail-value">{{
                          props.row.VehicleNo || "—"
                        }}</span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Transporter</span>
                        <span class="mjc-detail-value">{{
                          props.row.Transporter || "—"
                        }}</span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Quantity</span>
                        <span class="mjc-detail-value">{{
                          props.row.Quantity
                        }}</span>
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

    <!-- ══════════════════════════════════════
         Quick "Update Vehicle / Carrier" dialog — the list row's truck
         icon, for reassigning a trip's vehicle/transporter without
         entering full Modify mode. Canonical compact-dialog shape
         (ReferredDetailsDialog.vue).
    ══════════════════════════════════════ -->
    <q-dialog v-model="showVehicleDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6">Update Vehicle / Carrier</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <span class="field-label">Carrier</span>
              <q-select v-model="vehicleForm.Carrier" :options="['own', 'Truck']" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <span class="field-label">Transporter</span>
              <q-select v-model="vehicleForm.Transporter" :options="mockData.transporters" dense outlined bg-color="blue-1" use-input fill-input display-value="" input-debounce="0" />
            </div>
            <div class="col-6">
              <span class="field-label">Vehicle</span>
              <q-select v-model="vehicleForm.Vehicle" :options="mockData.vehicles" dense outlined bg-color="blue-1" use-input fill-input display-value="" input-debounce="0" />
            </div>
            <div class="col-6">
              <span class="field-label">Vehicle No.</span>
              <q-input v-model="vehicleForm.VehicleNo" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <span class="field-label">Driver</span>
              <q-select v-model="vehicleForm.Driver" :options="mockData.drivers" dense outlined bg-color="blue-1" use-input fill-input display-value="" input-debounce="0" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-gutter-sm q-pt-none q-pb-none q-pr-none">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="primary" class="m-btn-style" label="Update" @click="saveVehicleUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// Trip data/mock-"backend" now lives in its own module, src/data/tripData.js
// (localStorage-backed, so add/edit/delete persist like a real DB) — every
// Trip-family page imports from there directly instead of from this page.
import {
  apiGetTrips,
  apiDeleteTrip,
  apiUpdateTripFields,
  MOCK_DATA,
} from "src/data/tripData.js";

// ─────────────────────────────────────────────
export default {
  name: "DMSTrip",

  // "View"/"Modify" open this record as a page in a new tab
  // (DMSTripView.vue) via the tab shell's injected openTab() — same
  // convention as DMSBBooking.vue's viewBooking()/openTab pair.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      filteredTrips: [],
      tripType: "All",
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      mockData: MOCK_DATA,

      showVehicleDialog: false,
      vehicleForm: {},
      vehicleTripId: null,

      baseColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "Status", label: "Trip Status", field: "Status", align: "center", sortable: true },
        { name: "TripDate", label: "Trip Start Date", field: "TripDate", sortable: true },
        { name: "TripStartTime", label: "Trip Start Time", field: "TripStartTime" },
        { name: "TripNo", label: "Trip No", field: "TripNo", sortable: true },
        { name: "TripEndDate", label: "Trip End Date", field: "TripEndDate", sortable: true },
        { name: "Carrier", label: "Carrier", field: "Carrier" },
        { name: "FromCity", label: "From City", field: "FromCity", sortable: true },
        { name: "ToCity", label: "To City", field: "ToCity", sortable: true },
        { name: "Quantity", label: "Quantity", field: "Quantity", align: "right", sortable: true },
        { name: "Transporter", label: "Vehicle1 Transporter", field: "Transporter" },
        { name: "Vehicle", label: "Vehicle1", field: "Vehicle" },
        { name: "VehicleNo", label: "Vehicle No", field: "VehicleNo" },
        { name: "delete", label: "Delete", field: "delete", align: "center" },
      ],

      visibleColumns: [
        "action",
        "Status",
        "TripDate",
        "TripStartTime",
        "TripNo",
        "TripEndDate",
        "Carrier",
        "FromCity",
        "ToCity",
        "Quantity",
        "Transporter",
        "Vehicle",
        "VehicleNo",
        "delete",
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    columnOptions() {
      return [{ name: "all", label: "Select All" }, ...this.baseColumns];
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

    isChecked(col) {
      if (col === "all") {
        return this.visibleColumns.length === this.baseColumns.length;
      }
      return this.visibleColumns.includes(col);
    },

    toggleColumn(col) {
      if (col === "all") {
        if (this.visibleColumns.length === this.baseColumns.length) {
          this.visibleColumns = ["action"];
        } else {
          this.visibleColumns = this.baseColumns.map((c) => c.name);
        }
        return;
      }

      const index = this.visibleColumns.indexOf(col);
      if (index > -1) {
        this.visibleColumns.splice(index, 1);
      } else {
        this.visibleColumns.push(col);
      }
    },

    async loadTrips() {
      // No field-picker in the toolbar (matches the Booking-family
      // pattern) — searches across the common fields at once, see
      // tripData.js's apiGetTrips for the multi-field fallback when
      // searchBy is omitted.
      this.filteredTrips = await apiGetTrips(this.tripType, null, this.searchText);
    },

    statusColor(status) {
      const map = { Loaded: "orange", Unloaded: "positive" };
      return map[status] || "grey";
    },

    openAddTrip() {
      if (this.openTab) {
        this.openTab(`/DMSTripView?mode=add`, `New Trip`);
      }
    },

    viewTrip(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSTripView?tripId=${row.TripId}&mode=view`,
          `Trip ${row.TripNo}`.trim()
        );
      }
    },

    editTrip(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSTripView?tripId=${row.TripId}&mode=edit`,
          `Trip ${row.TripNo}`.trim()
        );
      }
    },

    printTrip(row) {
      const rowsHtml = (row.Bookings || [])
        .map(
          (b) =>
            `<tr><td>${b.BookingNo}</td><td>${b.Date}</td><td>${b.Status}</td><td>${b.Consignee}</td></tr>`
        )
        .join("");
      const html = `<!doctype html><html><head><title>${row.TripNo}</title>
        <style>body{font-family:Arial,sans-serif;font-size:12px;padding:16px}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{border:1px solid #ccc;padding:4px 8px;text-align:left}
        h2{margin-bottom:4px}</style></head><body>
        <h2>Trip Sheet — ${row.TripNo}</h2>
        <div>Date: ${row.TripDate} ${row.TripStartTime} &nbsp; Carrier: ${row.Carrier} &nbsp; Route: ${row.FromCity} → ${row.ToCity}</div>
        <div>Vehicle: ${row.VehicleNo || "—"} &nbsp; Transporter: ${row.Transporter || "—"}</div>
        <table><thead><tr><th>Booking No</th><th>Date</th><th>Status</th><th>Consignee</th></tr></thead>
        <tbody>${rowsHtml || '<tr><td colspan="4">No bookings loaded.</td></tr>'}</tbody></table>
        </body></html>`;
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
      }
    },

    openUpdateVehicle(row) {
      this.vehicleTripId = row.TripId;
      this.vehicleForm = {
        Carrier: row.Carrier,
        Transporter: row.Transporter,
        Vehicle: row.Vehicle,
        VehicleNo: row.VehicleNo,
        Driver: row.Driver,
      };
      this.showVehicleDialog = true;
    },

    async saveVehicleUpdate() {
      const res = await apiUpdateTripFields(this.vehicleTripId, {
        ...this.vehicleForm,
      });
      if (res.success) {
        this.$q.notify({ message: "Vehicle / carrier updated!", color: "positive", position: "top" });
        this.showVehicleDialog = false;
        await this.loadTrips();
      }
    },

    async deleteTrip(row) {
      const res = await apiDeleteTrip(row.TripId);
      if (res.success) {
        this.$q.notify({ message: `Trip ${row.TripNo} deleted.`, color: "positive", position: "top" });
        await this.loadTrips();
      }
    },
  },
};
</script>

<style scoped>
.field-label {
  display: block;
  font-size: 11px;
  color: #555;
  margin-bottom: 2px;
  font-weight: 500;
}

</style>
