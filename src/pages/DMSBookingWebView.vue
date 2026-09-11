<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Web</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text2">{{ modeLabel }}</span>
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
                  class="desktop-action-btn bg-green-white bdr-green text-dgreen"
                  @click="saveWebBooking"
                />
              </div>
            </div>
          </div>
        </div>

        <q-card class="notab-container">
          <q-inner-loading :showing="loading" color="primary" />
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
    </q-page>
  </div>
</template>

<script>
import { apiGetWebBookingById, apiSaveWebBooking, MOCK_DATA } from "./DMSBookingWeb.vue";

export default {
  name: "DMSBookingWebView",

  // Set by DynamicTab.vue's openTab() from the `?mode=...&webId=...` query
  // string it's opened with — see openAddWebBooking()/editWebBooking() in
  // DMSBookingWeb.vue.
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
      this.loadWebBooking();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadWebBooking() {
      const id = Number(this.params && this.params.webId);
      this.loading = true;
      try {
        this.form = (await apiGetWebBookingById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
    },

    emptyForm() {
      return {
        BookingWebId: null,
        BookingWebNo: "WEB0001",
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

    async saveWebBooking() {
      if (!this.form.FromCity || !this.form.ToCity) {
        this.$q.notify({ message: "From City and To City are required", color: "negative", position: "top" });
        return;
      }
      const res = await apiSaveWebBooking({ ...this.form });
      if (res.success) {
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({ message: "Booking Web saved!", color: "positive", position: "top" });
      }
    },
  },
};
</script>
