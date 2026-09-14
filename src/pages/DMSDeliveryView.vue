<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <!-- ── Header — same shape as DMSBBookingView.vue's: two-crumb
             breadcrumb ("Delivery > View"/"Modify") + read-only header
             field boxes + a Save/dropdown pair that's only shown at all in
             Modify mode. No Close button — the tab strip's own "x" is how
             a tab gets closed. ── -->
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Delivery</span>
              <span class="arrow_right_icon">
                <i class="fa fa-chevron-right"></i>
              </span>
              <span class="header_text2">
                {{ isReadonly ? "View" : "Modify" }}
              </span>
            </div>
            <div class="header-field-group">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                readonly
                label="Delivery No."
                v-model="form.DeliveryNo"
                placeholder="(auto)"
              />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                readonly
                label="Date"
                v-model="form.DeliveryDate"
              />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                readonly
                label="Booking No."
                v-model="booking.BookingNo"
              />
            </div>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
            <div class="row q-col-gutter-x-sm justify-end items-center">
              <template v-if="!isReadonly">
                <div class="row items-center no-wrap desktop-actions-group">
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
                      <q-item
                        clickable
                        v-close-popup
                        class="desktop-actions-item"
                        @click="printDelivery"
                      >
                        <q-item-section avatar>
                          <div class="action-icon-badge bg-export">
                            <q-icon name="print" color="white" />
                          </div>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Print</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        class="desktop-actions-item"
                        @click="resetForm"
                      >
                        <q-item-section avatar>
                          <div class="action-icon-badge bg-reset">
                            <q-icon name="restart_alt" color="white" />
                          </div>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Reset</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </template>
            </div>
          </div>
        </div>

        <q-card class="tabs-container">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-teal custom-tabs"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            outside-arrows
          >
            <q-tab name="booking" label="Booking Details [1]" accesskey="1" />
            <q-tab name="delivery" label="Delivery Details [2]" accesskey="2" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="activeTab" animated keep-alive>
            <q-inner-loading :showing="loading" color="primary" />

            <!-- Booking Details — read-only context pulled from the
                 booking being delivered, never edited here (matches the
                 reference: a delivery always links to exactly one existing
                 booking). -->
            <q-tab-panel name="booking">
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    label="Consignor"
                    v-model="booking.FromPartyName"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    label="Consignee"
                    v-model="booking.ToPartyName"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    label="Route"
                    :model-value="`${booking.FromCity || '—'} → ${
                      booking.ToCity || '—'
                    }`"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    label="Item / Qty / Weight"
                    :model-value="`${booking.ItemName || '—'} · ${
                      booking.Qty || 0
                    } · ${booking.Weight || 0}kg`"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    label="Payment Type"
                    v-model="booking.PaymentType"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    label="Net Amount (Receivable)"
                    v-model="booking.NetAmount"
                    input-class="text-weight-bold"
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- Delivery Details -->
            <q-tab-panel name="delivery">
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Delivery Date"
                    placeholder="dd-mm-yyyy"
                    v-model="form.DeliveryDate"
                    :readonly="isReadonly"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        v-if="!isReadonly"
                      >
                        <q-popup-proxy
                          ref="deliveryDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="form.DeliveryDate"
                            mask="DD-MM-YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.deliveryDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Receiver Name"
                    v-model="form.ReceiverName"
                    :readonly="isReadonly"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Receiver Phone No."
                    v-model="form.ReceiverPhoneNo"
                    :readonly="isReadonly"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Reference No."
                    v-model="form.ReferenceNo"
                    :readonly="isReadonly"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Reference Date"
                    placeholder="dd-mm-yyyy"
                    v-model="form.ReferenceDate"
                    :readonly="isReadonly"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        v-if="!isReadonly"
                      >
                        <q-popup-proxy
                          ref="refDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="form.ReferenceDate"
                            mask="DD-MM-YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.refDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
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
                        v-model="form.IsItemDelivered"
                        :disable="isReadonly"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Item Delivered</q-item-label>
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
                        v-model="form.IsCashCredit"
                        :disable="isReadonly"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Cash Credit</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Kasar"
                    type="number"
                    v-model="form.Kasar"
                    :readonly="isReadonly"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Received Amount"
                    type="number"
                    v-model="form.ReceivedAmount"
                    :readonly="isReadonly"
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
                        v-model="form.IsPaymentReceived"
                        :disable="isReadonly"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Payment Received</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Received Date"
                    placeholder="dd-mm-yyyy"
                    v-model="form.ReceivedDate"
                    :readonly="isReadonly"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        v-if="!isReadonly"
                      >
                        <q-popup-proxy
                          ref="recvDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="form.ReceivedDate"
                            mask="DD-MM-YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.recvDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Payment Mode"
                    :options="mockData.paymentModes"
                    v-model="form.PaymentMode"
                    clearable
                    :readonly="isReadonly"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Bank Name"
                    v-model="form.BankName"
                    :readonly="isReadonly"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Delivered By"
                    :options="mockData.users"
                    v-model="form.DeliveredBy"
                    :readonly="isReadonly"
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
                        v-model="form.IsDoorDelivery"
                        :disable="isReadonly"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Door Delivery</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div
                  class="col-12 col-sm-6 col-md-3"
                  v-if="form.IsDoorDelivery"
                >
                  <q-select
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Door Delivery Vehicle"
                    :options="mockData.vehicles"
                    v-model="form.DoorDeliveryVehicle"
                    :readonly="isReadonly"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-6">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    label="Narration"
                    type="textarea"
                    :rows="2"
                    autogrow
                    v-model="form.Narration"
                    :readonly="isReadonly"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <!-- Prev/Next tab nav — same structure/classes as
               DMSBBookingView.vue's own tab-panel nav. -->
          <div class="q-pa-xs row justify-between tab-nav-buttons">
            <q-btn
              icon="chevron_left"
              class="Navtab"
              label=""
              flat
              :disable="tabIndex === 0"
              @click="goToPreviousTab"
            />
            <q-btn
              label=""
              icon-right="chevron_right"
              class="Navtab"
              flat
              :disable="tabIndex === tabOrder.length - 1"
              @click="goToNextTab"
            />
          </div>
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

  data() {
    return {
      activeTab: "booking",
      tabOrder: ["booking", "delivery"],
      loading: false,
      mode:
        this.params && this.params.mode === "edit"
          ? "edit"
          : this.params && this.params.mode === "view"
          ? "view"
          : "add",
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
    tabIndex() {
      return this.tabOrder.indexOf(this.activeTab);
    },
  },

  created() {
    this.load();
  },

  methods: {
    goToPreviousTab() {
      if (this.tabIndex > 0) {
        this.activeTab = this.tabOrder[this.tabIndex - 1];
      }
    },
    goToNextTab() {
      if (this.tabIndex < this.tabOrder.length - 1) {
        this.activeTab = this.tabOrder[this.tabIndex + 1];
      }
    },

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
      this.form.ReceivableAmount =
        this.booking.NetAmount || this.form.ReceivableAmount;
      try {
        const res = await apiSaveDelivery({ ...this.form });
        if (res.success) {
          this.$q.notify({
            message: "Delivery saved!",
            color: "positive",
            position: "top",
          });
          this.form = { ...res.data };
          this.savedForm = JSON.parse(JSON.stringify(this.form));
          this.mode = "edit";
        }
      } catch (err) {
        this.$q.notify({
          message: err.message,
          color: "negative",
          position: "top",
        });
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
  },
};
</script>
