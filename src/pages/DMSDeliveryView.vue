<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <!-- ── Header — same shape as DMSTripView.vue's: breadcrumb +
             Save/dropdown/Close actions, switching with `mode`. ── -->
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">DMS</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text1">Delivery</span>
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
                    @click="saveDelivery"
                  />
                  <q-btn-dropdown
                    dense
                    unelevated
                    no-caps
                    class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-more-joined"
                    content-class="desktop-actions-dropdown"
                  >
                    <q-list class="desktop-actions-list">
                      <q-item clickable v-close-popup class="desktop-actions-item" @click="printDelivery">
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
            <!-- Read-only booking context — pulled from the booking being
                 delivered, never edited here (matches the reference: a
                 delivery always links to exactly one existing booking). -->
            <div class="text-subtitle2 text-weight-bold q-mb-xs">Booking Details</div>
            <div class="row q-col-gutter-sm q-mb-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Booking No</span>
                <q-input square dense outlined bg-color="yellow-1" readonly v-model="booking.BookingNo" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Booking Date</span>
                <q-input square dense outlined bg-color="blue-1" readonly v-model="booking.BookingDate" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Consignor</span>
                <q-input square dense outlined bg-color="blue-1" readonly v-model="booking.FromPartyName" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Consignee</span>
                <q-input square dense outlined bg-color="blue-1" readonly v-model="booking.ToPartyName" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Route</span>
                <q-input square dense outlined bg-color="blue-1" readonly :model-value="`${booking.FromCity || '—'} → ${booking.ToCity || '—'}`" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Item / Qty / Weight</span>
                <q-input square dense outlined bg-color="blue-1" readonly :model-value="`${booking.ItemName || '—'} · ${booking.Qty || 0} · ${booking.Weight || 0}kg`" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Payment Type</span>
                <q-input square dense outlined bg-color="blue-1" readonly v-model="booking.PaymentType" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Net Amount (Receivable)</span>
                <q-input square dense outlined bg-color="yellow-1" readonly v-model="booking.NetAmount" input-class="text-weight-bold" />
              </div>
            </div>

            <q-separator class="q-mb-sm" />

            <div class="text-subtitle2 text-weight-bold q-mb-xs">Delivery Details</div>
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Delivery No.</span>
                <q-input square dense outlined bg-color="yellow-1" readonly v-model="form.DeliveryNo" placeholder="(auto)" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Delivery Date</span>
                <q-input square dense outlined bg-color="blue-1" placeholder="dd-mm-yyyy" v-model="form.DeliveryDate" :readonly="isReadonly">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" v-if="!isReadonly">
                      <q-popup-proxy ref="deliveryDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.DeliveryDate" mask="DD-MM-YYYY" minimal style="width: 280px" @update:model-value="$refs.deliveryDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Receiver Name</span>
                <q-input square dense outlined bg-color="blue-1" v-model="form.ReceiverName" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Receiver Phone No.</span>
                <q-input square dense outlined bg-color="blue-1" v-model="form.ReceiverPhoneNo" :readonly="isReadonly" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Reference No.</span>
                <q-input square dense outlined bg-color="blue-1" v-model="form.ReferenceNo" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Reference Date</span>
                <q-input square dense outlined bg-color="blue-1" placeholder="dd-mm-yyyy" v-model="form.ReferenceDate" :readonly="isReadonly">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" v-if="!isReadonly">
                      <q-popup-proxy ref="refDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.ReferenceDate" mask="DD-MM-YYYY" minimal style="width: 280px" @update:model-value="$refs.refDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                  <q-item-section avatar>
                    <q-checkbox dense v-model="form.IsItemDelivered" :disable="isReadonly" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>Item Delivered</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                  <q-item-section avatar>
                    <q-checkbox dense v-model="form.IsCashCredit" :disable="isReadonly" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>Cash Credit</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Kasar</span>
                <q-input square dense outlined bg-color="blue-1" type="number" v-model="form.Kasar" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Received Amount</span>
                <q-input square dense outlined bg-color="blue-1" type="number" v-model="form.ReceivedAmount" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                  <q-item-section avatar>
                    <q-checkbox dense v-model="form.IsPaymentReceived" :disable="isReadonly" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>Payment Received</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Received Date</span>
                <q-input square dense outlined bg-color="blue-1" placeholder="dd-mm-yyyy" v-model="form.ReceivedDate" :readonly="isReadonly">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" v-if="!isReadonly">
                      <q-popup-proxy ref="recvDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.ReceivedDate" mask="DD-MM-YYYY" minimal style="width: 280px" @update:model-value="$refs.recvDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Payment Mode</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.paymentModes" v-model="form.PaymentMode" clearable :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Bank Name</span>
                <q-input square dense outlined bg-color="blue-1" v-model="form.BankName" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <span class="field-label">Delivered By</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.users" v-model="form.DeliveredBy" :readonly="isReadonly" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                  <q-item-section avatar>
                    <q-checkbox dense v-model="form.IsDoorDelivery" :disable="isReadonly" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>Door Delivery</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" v-if="form.IsDoorDelivery">
                <span class="field-label">Door Delivery Vehicle</span>
                <q-select square dense outlined bg-color="blue-1" :options="mockData.vehicles" v-model="form.DoorDeliveryVehicle" :readonly="isReadonly" />
              </div>

              <div class="col-xs-12">
                <span class="field-label">Narration</span>
                <q-input square dense outlined bg-color="blue-1" type="textarea" :rows="2" autogrow v-model="form.Narration" :readonly="isReadonly" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import {
  apiGetDeliveryById,
  apiGetBookingById,
  apiSaveDelivery,
  MOCK_DATA,
} from "src/data/deliveryData.js";

export default {
  name: "DMSDeliveryView",

  // Set by DynamicTab.vue's openTab() from the query string it's opened
  // with — `?deliveryId=1&mode=view|edit` for an existing delivery, or
  // `?bookingId=1001&mode=add` to capture a new one for that booking.
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
      mode: this.params && this.params.mode === "edit" ? "edit" : this.params && this.params.mode === "view" ? "view" : "add",
      booking: {},
      form: this.emptyForm(),
      savedForm: null,
      mockData: MOCK_DATA,
    };
  },

  computed: {
    isReadonly() {
      return this.mode === "view";
    },
  },

  created() {
    this.load();
  },

  methods: {
    emptyForm() {
      return {
        DeliveryID: null,
        DeliveryNo: "",
        DeliveryDate: "",
        BookingID: null,
        ReceiverName: "",
        ReceiverPhoneNo: "",
        IsItemDelivered: true,
        ReferenceNo: "",
        ReferenceDate: "",
        ReceivableAmount: 0,
        Kasar: 0,
        ReceivedAmount: 0,
        IsPaymentReceived: false,
        ReceivedDate: "",
        PaymentMode: "",
        BankName: "",
        IsCashCredit: false,
        IsDoorDelivery: false,
        DoorDeliveryVehicle: "",
        DeliveredBy: "",
        Narration: "",
      };
    },

    async load() {
      this.loading = true;
      try {
        const deliveryId = Number(this.params && this.params.deliveryId);
        if (deliveryId) {
          const delivery = await apiGetDeliveryById(deliveryId);
          this.form = delivery ? { ...delivery } : this.emptyForm();
          this.booking = (await apiGetBookingById(this.form.BookingID)) || {};
        } else {
          const bookingId = Number(this.params && this.params.bookingId);
          this.booking = (await apiGetBookingById(bookingId)) || {};
          this.form = this.emptyForm();
          this.form.BookingID = bookingId;
          this.form.ReceivableAmount = this.booking.NetAmount || 0;
          this.form.DeliveryDate = this.booking.BookingDate || "";
        }
        this.savedForm = JSON.parse(JSON.stringify(this.form));
      } finally {
        this.loading = false;
      }
    },

    async saveDelivery() {
      this.form.ReceivableAmount = this.booking.NetAmount || this.form.ReceivableAmount;
      try {
        const res = await apiSaveDelivery({ ...this.form });
        if (res.success) {
          this.$q.notify({ message: "Delivery saved!", color: "positive", position: "top" });
          this.form = { ...res.data };
          this.savedForm = JSON.parse(JSON.stringify(this.form));
          this.mode = "edit";
        }
      } catch (err) {
        this.$q.notify({ message: err.message, color: "negative", position: "top" });
      }
    },

    printDelivery() {
      window.print();
    },

    resetForm() {
      this.form = this.savedForm
        ? JSON.parse(JSON.stringify(this.savedForm))
        : this.emptyForm();
    },

    closeThisTab() {
      if (this.goBackTab && this.goBackTab()) return;
      if (this.openTab) this.openTab("/DMSDelivery", "Delivery");
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
