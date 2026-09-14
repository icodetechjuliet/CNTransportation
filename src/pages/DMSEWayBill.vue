<template>
  <div>
    <!-- Not a list+CRUD page like the rest of the Booking family — the old
         app's BUK_EWayBill / BUK_EWayBill_Consolidated are utility/API
         integration screens (single form, no grid of records to add/edit),
         so this is one page instead of a list + full-page companion pair. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 header-inner">
            <div class="header-title">
              <span class="header_text1">E Way Bill</span>
            </div>
          </div>
        </div>

        <q-card class="notab-container">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-btn-toggle
                v-model="mode"
                dense
                unelevated
                toggle-color="primary"
                color="white"
                text-color="primary"
                :options="[
                  { label: 'Single', value: 'single' },
                  { label: 'Consolidated', value: 'consolidated' },
                ]"
                style="border: 1px solid #ddd; border-radius: 4px"
              />
            </div>

            <!-- Single E-Way Bill -->
            <div v-if="mode === 'single'" class="row q-col-gutter-sm">
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
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Vehicle No."
                  v-model="form.VehicleNo"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Search Booking No. / Any"
                  v-model="form.SearchAny"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  icon="search"
                  label="Search Bookings"
                  class="full-width"
                  @click="searchBookings"
                />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="GST Portal User Name"
                  v-model="form.UserName"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="GST Portal Password"
                  type="password"
                  v-model="form.Password"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Portal URL"
                  v-model="form.URL"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="JSON File Path"
                  v-model="form.JSONFilePath"
                />
              </div>
            </div>

            <!-- Consolidated E-Way Bill -->
            <div v-else class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Booking Date"
                  v-model="form.BookingDate"
                  placeholder="dd/mm/yyyy"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="bookingDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="form.BookingDate"
                          mask="DD/MM/YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.bookingDateProxy.hide()"
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
                  readonly
                  label="Consolidated E-Way Bill No."
                  v-model="form.ConsolidatedEWayBillNo"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="From Place"
                  v-model="form.FromPlace"
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
                  label="From State"
                  v-model="form.FromStateName"
                  :options="mockData.states"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Vehicle No."
                  v-model="form.VehicleNo"
                />
              </div>
            </div>

            <div class="row q-mt-md">
              <q-btn
                unelevated
                no-caps
                color="positive"
                icon="fa-solid fa-file-invoice"
                :label="
                  mode === 'single'
                    ? 'Generate E-Way Bill'
                    : 'Generate Consolidated E-Way Bill'
                "
                @click="generate"
              />
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 q-mb-sm">Recent E-Way Bills</div>
            <q-table
              square
              flat
              bordered
              :rows="recentBills"
              :columns="recentColumns"
              row-key="EWayBillId"
              :rows-per-page-options="[0]"
              hide-pagination
            >
              <template v-slot:body-cell-Status="props">
                <q-td :props="props">
                  <q-badge
                    :color="
                      props.value === 'Generated' ? 'positive' : 'negative'
                    "
                    :label="props.value"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
// ─────────────────────────────────────────────
//  Mock data — replace with a real GST e-way bill portal integration
//  (the old app's BUK_EWayBill posts UserName/Password/JSON payload to an
//  external URL; this page only stubs that call with a local mock).
// ─────────────────────────────────────────────
const MOCK_DATA = {
  cities: ["Rajkot-G", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
  states: ["Gujarat", "Maharashtra", "Karnataka", "Rajasthan"],
};

const MOCK_RECENT_BILLS = [
  {
    EWayBillId: 1,
    EWayBillNo: "601284646429",
    BookingNo: "RKG21040001",
    VehicleNo: "GJ01AB1234",
    GeneratedOn: "01/04/2026 11:10 AM",
    Status: "Generated",
  },
  {
    EWayBillId: 2,
    EWayBillNo: "701284646430",
    BookingNo: "RKG21040002",
    VehicleNo: "MH12CD5678",
    GeneratedOn: "01/04/2026 12:05 PM",
    Status: "Generated",
  },
];

export default {
  name: "DMSEWayBill",

  data() {
    return {
      mode: "single",
      mockData: MOCK_DATA,
      recentBills: MOCK_RECENT_BILLS,
      form: {
        FromCity: "",
        VehicleNo: "",
        SearchAny: "",
        UserName: "",
        Password: "",
        URL: "",
        JSONFilePath: "",
        BookingDate: "03/04/2026",
        ConsolidatedEWayBillNo: "",
        FromPlace: "",
        FromStateName: "",
      },
      recentColumns: [
        { name: "EWayBillNo", label: "E-Way Bill No.", field: "EWayBillNo" },
        { name: "BookingNo", label: "Booking No.", field: "BookingNo" },
        { name: "VehicleNo", label: "Vehicle No.", field: "VehicleNo" },
        { name: "GeneratedOn", label: "Generated On", field: "GeneratedOn" },
        { name: "Status", label: "Status", field: "Status", align: "center" },
      ],
    };
  },

  methods: {
    searchBookings() {
      this.$q.notify({
        message:
          "Booking search — not yet wired to DMSBooking.vue's booking list.",
        color: "info",
        position: "top",
      });
    },

    generate() {
      if (this.mode === "single" && !this.form.VehicleNo) {
        this.$q.notify({
          message: "Vehicle No. is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      if (this.mode === "consolidated" && !this.form.FromPlace) {
        this.$q.notify({
          message: "From Place is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      // Stubbed — the real flow posts UserName/Password + a JSON payload to
      // the GST e-way bill portal URL and reads back the generated number.
      this.recentBills = [
        {
          EWayBillId: this.recentBills.length + 1,
          EWayBillNo: String(
            Math.floor(100000000000 + Math.random() * 899999999999)
          ),
          BookingNo: this.form.SearchAny || "—",
          VehicleNo: this.form.VehicleNo || "—",
          GeneratedOn: new Date().toLocaleString(),
          Status: "Generated",
        },
        ...this.recentBills,
      ];
      this.$q.notify({
        message: "E-Way Bill generated (mock)",
        color: "positive",
        position: "top",
      });
    },
  },
};
</script>
