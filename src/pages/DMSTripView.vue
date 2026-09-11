<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <!-- ── Header — same two-column shape as DMSBBookingView.vue's
             header: breadcrumb + Save/dropdown/Close actions. Breadcrumb's
             3rd crumb and the action buttons switch with `mode`, matching
             the reference app's "View Mode" / "Modify Mode" screens. ── -->
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">DMS</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text1">Trip</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text2">{{ isReadonly ? "View Mode" : "Modify Mode" }}</span>
            </div>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
            <div class="row q-col-gutter-x-sm justify-end items-center">
              <div class="row items-center no-wrap desktop-actions-group">
                <template v-if="!isReadonly">
                  <q-btn
                    dense
                    unelevated
                    no-caps
                    icon="task_alt"
                    label="Save"
                    accesskey="s"
                    class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-save-joined"
                    @click="saveTrip"
                  />
                  <q-btn-dropdown
                    dense
                    unelevated
                    no-caps
                    class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-more-joined"
                    content-class="desktop-actions-dropdown"
                  >
                    <q-list class="desktop-actions-list">
                      <q-item clickable v-close-popup class="desktop-actions-item" @click="saveAndNew">
                        <q-item-section avatar>
                          <div class="action-icon-badge bg-save-new">
                            <q-icon name="post_add" color="white" />
                          </div>
                        </q-item-section>
                        <q-item-section><q-item-label>Save +</q-item-label></q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup class="desktop-actions-item" @click="exportTrip">
                        <q-item-section avatar>
                          <div class="action-icon-badge bg-report">
                            <q-icon name="file_download" color="white" />
                          </div>
                        </q-item-section>
                        <q-item-section><q-item-label>Export</q-item-label></q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup class="desktop-actions-item" @click="printTrip">
                        <q-item-section avatar>
                          <div class="action-icon-badge bg-export">
                            <q-icon name="print" color="white" />
                          </div>
                        </q-item-section>
                        <q-item-section><q-item-label>Print</q-item-label></q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup class="desktop-actions-item" @click="resetForm">
                        <q-item-section avatar>
                          <div class="action-icon-badge bg-reset">
                            <q-icon name="restart_alt" color="white" />
                          </div>
                        </q-item-section>
                        <q-item-section><q-item-label>Reset</q-item-label></q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </template>
                <q-btn
                  dense
                  unelevated
                  no-caps
                  icon="close"
                  label="Close"
                  class="desktop-action-btn bg-blue-300 bdr-blue-2 font-Mblue q-ml-xs"
                  @click="closeThisTab"
                />
              </div>
            </div>
          </div>
        </div>

        <q-card class="tabs-container">
          <q-inner-loading :showing="loading" color="primary" />

          <q-card-section class="q-pa-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Trip Date</span>
                <q-input square dense outlined bg-color="blue-1" placeholder="dd-mm-yyyy" v-model="form.TripDate" :readonly="isReadonly">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" v-if="!isReadonly">
                      <q-popup-proxy ref="tripDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.TripDate" mask="DD-MM-YYYY" minimal style="width: 280px" @update:model-value="$refs.tripDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Time</span>
                <q-input square dense outlined bg-color="blue-1" placeholder="hh:mm AM/PM" v-model="form.TripStartTime" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Trip No</span>
                <q-input square dense outlined bg-color="yellow-1" readonly v-model="form.TripNo" placeholder="(auto)" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">End Date</span>
                <q-input square dense outlined bg-color="blue-1" placeholder="dd-mm-yyyy" v-model="form.TripEndDate" :readonly="isReadonly">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" v-if="!isReadonly">
                      <q-popup-proxy ref="endDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.TripEndDate" mask="DD-MM-YYYY" minimal style="width: 280px" @update:model-value="$refs.endDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Carrier</span>
                <q-select square dense outlined bg-color="blue-1" :options="['own', 'Truck']" v-model="form.Carrier" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">From City</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.cities" use-input fill-input display-value="" input-debounce="0" v-model="form.FromCity" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">To City</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.cities" use-input fill-input display-value="" input-debounce="0" v-model="form.ToCity" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">From B.O.</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.bookingOffices" v-model="form.FromBookingOffice" :readonly="isReadonly" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">To B.O.</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.bookingOffices" v-model="form.ToBookingOffice" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Transporter</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.transporters" use-input fill-input display-value="" input-debounce="0" v-model="form.Transporter" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Vehicle</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.vehicles" use-input fill-input display-value="" input-debounce="0" v-model="form.Vehicle" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Vehicle No</span>
                <q-input square dense outlined bg-color="blue-1" v-model="form.VehicleNo" :readonly="isReadonly" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Adv.</span>
                <q-input square dense outlined bg-color="blue-1" type="number" v-model="form.AdvanceAmount" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Wt.</span>
                <q-input square dense outlined bg-color="blue-1" type="number" v-model="form.Weight" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Driver</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.drivers" use-input fill-input display-value="" input-debounce="0" v-model="form.Driver" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Remarks</span>
                <q-input square dense outlined bg-color="blue-1" v-model="form.Remarks" :readonly="isReadonly" />
              </div>
            </div>

            <!-- Select To City / Fill Booking / Other Details -->
            <div class="row justify-end q-col-gutter-sm q-mt-xs">
              <div class="col-auto">
                <q-btn
                  unelevated
                  no-caps
                  dense
                  label="Select To City"
                  color="primary"
                  class="m-btn-style"
                  :disable="isReadonly"
                  @click="openSelectToCity"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  unelevated
                  no-caps
                  dense
                  label="Fill Booking"
                  color="primary"
                  class="m-btn-style"
                  :disable="isReadonly"
                  @click="openFillBooking"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  unelevated
                  no-caps
                  dense
                  label="Other Details"
                  color="primary"
                  class="m-btn-style"
                  :disable="isReadonly"
                  @click="openOtherDetails"
                />
              </div>
            </div>

            <!-- ── Bookings sub-grid — the bookings loaded on this trip ── -->
            <div class="row items-center q-mt-md q-mb-xs">
              <q-icon name="local_shipping" size="18px" class="q-mr-xs text-primary" />
              <span class="text-subtitle2 text-weight-bold">Bookings</span>
              <q-space />
              <q-checkbox
                v-model="allBookingsChecked"
                label="All Booking"
                dense
                :disable="isReadonly"
                @update:model-value="toggleAllBookings"
              />
            </div>

            <q-table
              square
              dense
              flat
              bordered
              :rows="form.Bookings"
              :columns="bookingColumns"
              row-key="BookingTranId"
              :rows-per-page-options="[10, 25, 50]"
              table-class="text-white-8 m-table-style"
              table-header-class="text-black"
            >
              <template v-slot:body-cell-Load="props">
                <q-td :props="props">
                  <q-checkbox v-model="props.row.Load" dense :disable="isReadonly" />
                </q-td>
              </template>
              <template v-slot:body-cell-Status="props">
                <q-td :props="props">
                  <q-badge :color="bookingStatusColor(props.value)" :label="props.value" />
                </q-td>
              </template>
              <template v-slot:body-cell-BookingNo="props">
                <q-td :props="props">
                  <span class="text-primary text-weight-medium">{{ props.value }}</span>
                </q-td>
              </template>
              <template v-slot:body-cell-Payment="props">
                <q-td :props="props">
                  <q-badge outline :color="paymentColor(props.value)" :label="props.value" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-page>

    <!-- ══════════════════════════════════════
         Fill Booking — pull pending bookings matching this trip's route
         onto the trip (canonical compact-dialog shape).
    ══════════════════════════════════════ -->
    <q-dialog v-model="showFillBookingDialog">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center">
          <div class="text-h6">Fill Booking</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Pending bookings matching {{ form.FromCity || "—" }} → {{ form.ToCity || "—" }}
          </div>
          <q-list bordered separator v-if="availableBookings.length">
            <q-item v-for="b in availableBookings" :key="b.BookingId" tag="label">
              <q-item-section avatar>
                <q-checkbox v-model="selectedAvailableBookingIds" :val="b.BookingId" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ b.BookingNo }} — {{ b.Consignee }}</q-item-label>
                <q-item-label caption>{{ b.FromCity }} → {{ b.ToCity }} · {{ b.Date }} · {{ b.Payment }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey-6 text-center q-pa-md">No pending bookings match this route.</div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-gutter-sm q-pt-none q-pb-none q-pr-none">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="primary" class="m-btn-style" label="Add Selected" @click="addSelectedBookings" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ══════════════════════════════════════
         Select To City — bulk-update the delivery city on every checked
         ("Load") booking row.
    ══════════════════════════════════════ -->
    <q-dialog v-model="showSelectToCityDialog">
      <q-card style="min-width: 420px">
        <q-card-section class="row items-center">
          <div class="text-h6">Select To City</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <span class="field-label">To City</span>
          <q-select v-model="selectToCityValue" :options="mockData.cities" dense outlined bg-color="blue-1" />
          <div class="text-caption text-grey-7 q-mt-sm">
            Applies to every booking row currently checked in the Load column.
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-gutter-sm q-pt-none q-pb-none q-pr-none">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="primary" class="m-btn-style" label="Apply" @click="applySelectToCity" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ══════════════════════════════════════
         Other Details — extra fields not on the main form.
    ══════════════════════════════════════ -->
    <q-dialog v-model="showOtherDetailsDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6">Other Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <span class="field-label">Insurance No.</span>
              <q-input v-model="otherDetailsForm.InsuranceNo" dense outlined bg-color="blue-1" :readonly="isReadonly" />
            </div>
            <div class="col-6">
              <span class="field-label">E-Way Bill Ref No.</span>
              <q-input v-model="otherDetailsForm.EwayBillRefNo" dense outlined bg-color="blue-1" :readonly="isReadonly" />
            </div>
            <div class="col-12">
              <span class="field-label">Special Instructions</span>
              <q-input v-model="otherDetailsForm.SpecialInstructions" dense outlined bg-color="blue-1" type="textarea" :rows="2" autogrow :readonly="isReadonly" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-gutter-sm q-pt-none q-pb-none q-pr-none">
          <q-btn label="Cancel" v-close-popup />
          <q-btn v-if="!isReadonly" color="primary" class="m-btn-style" label="Apply" @click="saveOtherDetails" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  apiGetTripById,
  apiSaveTrip,
  apiGetAvailableBookings,
  apiConsumeAvailableBookings,
  MOCK_DATA,
} from "src/data/tripData.js";

export default {
  name: "DMSTripView",

  // Set by DynamicTab.vue's openTab() from the query string it's opened
  // with — `?tripId=1&mode=view|edit`, or `?mode=add` for a new trip.
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },

  inject: {
    openTab: { default: null },
    goBackTab: { default: null },
  },

  data() {
    return {
      loading: false,
      mode: this.params && this.params.mode === "add" ? "add" : this.params && this.params.mode === "edit" ? "edit" : "view",
      form: this.emptyForm(),
      savedForm: null,
      mockData: MOCK_DATA,

      allBookingsChecked: false,

      showFillBookingDialog: false,
      availableBookings: [],
      selectedAvailableBookingIds: [],
      pendingConsumedBookingIds: [],

      showSelectToCityDialog: false,
      selectToCityValue: "",

      showOtherDetailsDialog: false,
      otherDetailsForm: { InsuranceNo: "", EwayBillRefNo: "", SpecialInstructions: "" },

      bookingColumns: [
        { name: "Load", label: "Load", field: "Load", align: "center" },
        { name: "Status", label: "Status", field: "Status", align: "center" },
        { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
        { name: "Date", label: "Date", field: "Date", sortable: true },
        { name: "Carrier", label: "Carrier", field: "Carrier" },
        { name: "LoadCarrier", label: "Load Carrier", field: "LoadCarrier" },
        { name: "Payment", label: "Payment", field: "Payment", align: "center" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "Consignee", label: "Consignee", field: "Consignee" },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "Consignor", label: "Consignor", field: "Consignor" },
      ],
    };
  },

  computed: {
    isReadonly() {
      return this.mode === "view";
    },
  },

  created() {
    this.loadTrip();
  },

  methods: {
    emptyForm() {
      return {
        TripId: null,
        TripNo: "",
        TripDate: "",
        TripStartTime: "",
        TripEndDate: "",
        TripType: "Outward",
        Status: "Loaded",
        Carrier: "own",
        FromCity: "",
        ToCity: "",
        FromBookingOffice: "",
        ToBookingOffice: "",
        Transporter: "",
        Vehicle: "",
        VehicleNo: "",
        AdvanceAmount: 0,
        Weight: 0,
        Driver: "",
        Remarks: "",
        Quantity: 0,
        IsStockTransferTrip: false,
        Posted: false,
        OtherDetails: { InsuranceNo: "", EwayBillRefNo: "", SpecialInstructions: "" },
        Bookings: [],
      };
    },

    async loadTrip() {
      const id = Number(this.params && this.params.tripId);
      if (!id) {
        this.form = this.emptyForm();
        this.savedForm = null;
        return;
      }
      this.loading = true;
      try {
        const data = await apiGetTripById(id);
        this.form = data ? { ...data, Bookings: (data.Bookings || []).map((b) => ({ ...b })) } : this.emptyForm();
        this.savedForm = JSON.parse(JSON.stringify(this.form));
        this.otherDetailsForm = { ...(this.form.OtherDetails || {}) };
      } finally {
        this.loading = false;
      }
    },

    bookingStatusColor(status) {
      const map = { Loaded: "blue", Unloaded: "orange", Delivered: "positive" };
      return map[status] || "grey";
    },

    paymentColor(type) {
      const map = { TBBS: "blue", ToPay: "orange", Paid: "positive", TBBR: "purple", Cash: "teal" };
      return map[type] || "grey";
    },

    toggleAllBookings(checked) {
      this.form.Bookings.forEach((b) => {
        b.Load = checked;
      });
    },

    async openFillBooking() {
      this.selectedAvailableBookingIds = [];
      this.availableBookings = await apiGetAvailableBookings(this.form.FromCity, this.form.ToCity);
      this.showFillBookingDialog = true;
    },

    addSelectedBookings() {
      const chosen = this.availableBookings.filter((b) =>
        this.selectedAvailableBookingIds.includes(b.BookingId)
      );
      let nextId = Math.max(0, ...this.form.Bookings.map((b) => b.BookingTranId)) + 1;
      chosen.forEach((b) => {
        this.form.Bookings.push({
          BookingTranId: nextId++,
          Load: true,
          Status: "Loaded",
          BookingNo: b.BookingNo,
          Date: b.Date,
          Carrier: b.Carrier,
          LoadCarrier: b.LoadCarrier,
          Payment: b.Payment,
          ToCity: b.ToCity,
          Consignee: b.Consignee,
          FromCity: b.FromCity,
          Consignor: b.Consignor,
        });
        // Removed from the shared pending pool once the trip is actually
        // saved (see saveTrip()) — tracked here so a cancelled Modify
        // session doesn't permanently consume a booking it never kept.
        this.pendingConsumedBookingIds.push(b.BookingId);
      });
      // Keeps a booking from being pulled in twice within the same dialog.
      this.availableBookings = this.availableBookings.filter(
        (b) => !this.selectedAvailableBookingIds.includes(b.BookingId)
      );
      this.showFillBookingDialog = false;
      this.$q.notify({ message: `${chosen.length} booking(s) added to trip.`, color: "positive", position: "top" });
    },

    openSelectToCity() {
      this.selectToCityValue = this.form.ToCity || "";
      this.showSelectToCityDialog = true;
    },

    applySelectToCity() {
      this.form.Bookings.forEach((b) => {
        if (b.Load) b.ToCity = this.selectToCityValue;
      });
      this.showSelectToCityDialog = false;
    },

    openOtherDetails() {
      this.otherDetailsForm = { ...(this.form.OtherDetails || {}) };
      this.showOtherDetailsDialog = true;
    },

    saveOtherDetails() {
      this.form.OtherDetails = { ...this.otherDetailsForm };
      this.showOtherDetailsDialog = false;
    },

    async saveTrip() {
      this.form.Quantity = this.form.Bookings.filter((b) => b.Load).length || this.form.Quantity;
      const res = await apiSaveTrip({ ...this.form });
      if (res.success) {
        if (this.pendingConsumedBookingIds.length) {
          await apiConsumeAvailableBookings(this.pendingConsumedBookingIds);
          this.pendingConsumedBookingIds = [];
        }
        this.$q.notify({ message: "Trip saved!", color: "positive", position: "top" });
        this.form = { ...res.data };
        this.savedForm = JSON.parse(JSON.stringify(this.form));
        this.mode = "edit";
      }
    },

    async saveAndNew() {
      await this.saveTrip();
      this.form = this.emptyForm();
      this.savedForm = null;
      this.pendingConsumedBookingIds = [];
      this.mode = "add";
    },

    exportTrip() {
      this.$q.notify({ message: "Export coming soon.", color: "info", position: "top" });
    },

    printTrip() {
      window.print();
    },

    resetForm() {
      this.form = this.savedForm
        ? JSON.parse(JSON.stringify(this.savedForm))
        : this.emptyForm();
    },

    closeThisTab() {
      if (this.goBackTab && this.goBackTab()) return;
      if (this.openTab) this.openTab("/DMSTrip", "Trip");
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
