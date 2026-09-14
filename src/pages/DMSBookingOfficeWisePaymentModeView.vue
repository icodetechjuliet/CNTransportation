<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Office Wise Payment Mode</span>
              <span class="arrow_right_icon">
                <i class="fa fa-chevron-right"></i>
              </span>
              <span class="header_text2">{{ modeLabel }}</span>
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
                  @click="saveWisePaymentMode"
                />
              </div>
            </div>
          </div>
        </div>

        <q-card class="notab-container">
          <q-inner-loading :showing="loading" color="primary" />
          <q-card-section>
            <div class="row q-col-gutter-sm items-start">
              <div class="col-12 col-sm-6 col-md-3">
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
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Payment Mode Name"
                  v-model="form.PaymentModeName"
                  :options="mockData.paymentModes"
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
  apiGetWisePaymentModeById,
  apiSaveWisePaymentMode,
  MOCK_DATA_WISE_PAYMENT_MODE as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  name: "DMSBookingOfficeWisePaymentModeView",

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
      this.loadWisePaymentMode();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadWisePaymentMode() {
      const id = Number(this.params && this.params.wisePaymentModeId);
      this.loading = true;
      try {
        this.form = (await apiGetWisePaymentModeById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
    },

    emptyForm() {
      return {
        WisePaymentModeId: null,
        BookingOfficeName: "",
        PaymentModeName: "",
        IsActive: true,
      };
    },

    async saveWisePaymentMode() {
      if (!this.form.BookingOfficeName || !this.form.PaymentModeName) {
        this.$q.notify({
          message: "Booking Office and Payment Mode are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveWisePaymentMode({ ...this.form });
      if (res.success) {
        this.notifyEntrySaved();
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({
          message: "Wise Payment Mode saved!",
          color: "positive",
          position: "top",
        });
      }
    },
  },
};
</script>
