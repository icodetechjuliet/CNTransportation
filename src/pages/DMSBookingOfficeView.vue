<template>
  <div>
    <!-- Same shape as DMSBBookingView.vue's own page wrapper — the global
         ".hide-overflow" class (cn-style.css) already carries
         "min-height: 0 !important", overriding QPage's own forced
         min-height for this shorter, few-fields page. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <!-- ── Header — same two-column "header-style" shape as
             DMSBBookingView.vue: a white bar with a left "header-inner"
             column (breadcrumb + read-only-ish field boxes) and a
             right-aligned column for the Save action. No tabs needed here
             (Booking Office is one short field set), so the body below is
             a single card instead of a q-tabs/tab-panels split. ── -->
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Office</span>
              <span class="arrow_right_icon">
                <i class="fa fa-chevron-right"></i>
              </span>
              <span class="header_text2">{{ modeLabel }}</span>
            </div>
            <div class="header-field-group">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                label="Code"
                v-model="form.BookingOfficeCode"
              />
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
                  class="desktop-action-btn bg-green-white bdr-green text-dgreen"
                  @click="saveOffice"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ── Body — single card, four fields per row on desktop, same
             grid density as the Booking family's own View pages. Uses
             ".notab-container" (not "tabs-container") since this page has
             no q-tabs — that class is meant for a plain single-panel card,
             matching the list page's own report card sibling
             (.notab-container-report). ── -->
        <q-card class="notab-container">
          <q-inner-loading :showing="loading" color="primary" />
          <q-card-section>
            <div class="row q-col-gutter-sm items-start">
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Booking Office Name"
                  v-model="form.BookingOfficeName"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Print Name"
                  v-model="form.PrintName"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
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
              <div class="col-12 col-sm-6 col-md-3">
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

              <div class="col-12 col-sm-6 col-md-3">
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
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="State"
                  v-model="form.StateName"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Pincode"
                  v-model="form.Pincode"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Email"
                  v-model="form.Email"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Phone No."
                  v-model="form.PhoneNo"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Mobile No."
                  v-model="form.MobileNo"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Contact Person"
                  v-model="form.ContactPersonName"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Contact Phone"
                  v-model="form.ContactPersonPhoneNo"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="TDS %"
                  type="number"
                  v-model="form.TDSPCT"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
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
              <div class="col-12 col-sm-6 col-md-6">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Address"
                  type="textarea"
                  :rows="1"
                  autogrow
                  v-model="form.Address"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-6">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Remarks"
                  v-model="form.Remarks"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-item
                  tag="label"
                  v-ripple
                  bg-color="blue-1"
                  class="chckbx-style full-width"
                >
                  <q-item-section avatar>
                    <q-checkbox
                      dense
                      v-model="form.IsActive"
                      val="orange"
                      color="orange"
                      intermediate-icon="black"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>Active</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-item
                  tag="label"
                  v-ripple
                  bg-color="blue-1"
                  class="chckbx-style full-width"
                >
                  <q-item-section avatar>
                    <q-checkbox
                      dense
                      v-model="form.IsAgent"
                      val="orange"
                      color="orange"
                      intermediate-icon="black"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>Is Agent</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-item
                  tag="label"
                  v-ripple
                  bg-color="blue-1"
                  class="chckbx-style full-width"
                >
                  <q-item-section avatar>
                    <q-checkbox
                      dense
                      v-model="form.IsDeductTDS"
                      val="orange"
                      color="orange"
                      intermediate-icon="black"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>Deduct TDS</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import entryNavigation from "src/mixins/entryNavigation.js";
import {
  apiGetOfficeById,
  apiSaveOffice,
  MOCK_DATA_BOOKING_OFFICE as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  name: "DMSBookingOfficeView",

  // Set by DynamicTab.vue's openTab() from the `?mode=...&officeId=...`
  // query string it's opened with — see openAddOffice()/editOffice() in
  // DMSBookingOffice.vue.
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      loading: true,
      dialogMode: this.params.mode || "add",
      form: this.emptyForm(),
      mockData: MOCK_DATA,
    };
  },

  computed: {
    modeLabel() {
      return this.dialogMode === "edit" ? "Edit" : "Add";
    },
  },

  created() {
    if (this.dialogMode === "edit") {
      this.loadOffice();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadOffice() {
      const id = Number(this.params && this.params.officeId);
      this.loading = true;
      try {
        this.form = (await apiGetOfficeById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
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

    async saveOffice() {
      if (!this.form.BookingOfficeName) {
        this.$q.notify({
          message: "Booking Office Name is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveOffice({ ...this.form });
      if (res.success) {
        this.notifyEntrySaved();
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({
          message: "Booking Office saved!",
          color: "positive",
          position: "top",
        });
      }
    },
  },
};
</script>
