<template>
  <div>
    <!-- Permanently read-only, same convention as DMSBBookingView.vue — no
         Save at all, since a log entry is a system-written snapshot. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row q-col-gutter-sm items-start">
          <div class="col-12 col-sm-6 col-md-3 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Log</span>
              <span class="arrow_right_icon">
                <i class="fa fa-chevron-right"></i>
              </span>
              <span class="header_text2">View</span>
            </div>
            <div class="header-field-group">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                readonly
                label="Booking No."
                v-model="form.BookingNo"
              />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                readonly
                label="Operation"
                v-model="form.OperationType"
              />
            </div>
          </div>
        </div>

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
                  readonly
                  label="Booking Date"
                  v-model="form.BookingDate"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Log Date/Time"
                  v-model="form.Date"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Operation From"
                  v-model="form.OperationFrom"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="User"
                  v-model="form.UserName"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Freight Amount"
                  v-model="form.FreightAmount"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Door Delivery Amt."
                  v-model="form.DoorDeliveryAmount"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Door Collection Amt."
                  v-model="form.DoorCollectionAmount"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Other Amount"
                  v-model="form.OtherAmount"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Discount Amount"
                  v-model="form.DiscountAmount"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Total Tax Amount"
                  v-model="form.TotalTaxAmount"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Net Amount"
                  v-model="form.NetAmount"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Received Amount"
                  v-model="form.ReceivedAmount"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Kasar Amount"
                  v-model="form.KasarAmount"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { apiGetLogById } from "./DMSBookingLog.vue";

export default {
  name: "DMSBookingLogView",

  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      loading: true,
      form: {},
    };
  },

  created() {
    this.loadLog();
  },

  methods: {
    async loadLog() {
      const id = Number(this.params && this.params.logId);
      this.loading = true;
      try {
        this.form = (await apiGetLogById(id)) || {};
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
