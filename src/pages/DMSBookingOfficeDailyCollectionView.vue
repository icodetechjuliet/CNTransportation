<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Office Daily Collection</span>
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
                readonly
                label="Net Total"
                v-model="form.NetTotalAmount"
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
                  @click="saveCollection"
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
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Collection Date"
                  v-model="form.CollectionDate"
                  placeholder="dd/mm/yyyy"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="collectionDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="form.CollectionDate"
                          mask="DD/MM/YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.collectionDateProxy.hide()"
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
                  label="Booking Office"
                  v-model="form.BookingOfficeName"
                  :options="mockData.bookingOffices"
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
                  label="Cash Booking Amount"
                  type="number"
                  v-model="form.CashBookingAmount"
                  @update:model-value="calcTotals"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Cash Booking Kasar Amount"
                  type="number"
                  v-model="form.CashBookingKasarAmount"
                  @update:model-value="calcTotals"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Cash Delivery Amount"
                  type="number"
                  v-model="form.CashDeliveryAmount"
                  @update:model-value="calcTotals"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Cash Delivery Kasar Amount"
                  type="number"
                  v-model="form.CashDeliveryKasarAmount"
                  @update:model-value="calcTotals"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Booking Cash Credit Amount"
                  type="number"
                  v-model="form.BookingCashCreditAmount"
                  @update:model-value="calcTotals"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Delivery Cash Credit Amount"
                  type="number"
                  v-model="form.DeliveryCashCreditAmount"
                  @update:model-value="calcTotals"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Total Cash Credit Amount"
                  v-model="form.TotalCashCreditAmount"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Cash Credit Receipt Amount"
                  type="number"
                  v-model="form.CashCreditReceiptAmount"
                  @update:model-value="calcTotals"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Other Cash Receipt Amount"
                  type="number"
                  v-model="form.OtherCashReceiptAmount"
                  @update:model-value="calcTotals"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Other Cash Payment Amount"
                  type="number"
                  v-model="form.OtherCashPaymentAmount"
                  @update:model-value="calcTotals"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Uchak Debit Amount"
                  type="number"
                  v-model="form.UchakDebitAmount"
                  @update:model-value="calcTotals"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Uchak Received Amount"
                  type="number"
                  v-model="form.UchakReceivedAmount"
                  @update:model-value="calcTotals"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Sub Total Amount"
                  v-model="form.SubTotalAmount"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="Net Total Amount"
                  v-model="form.NetTotalAmount"
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
  apiGetCollectionById,
  apiSaveCollection,
  MOCK_DATA_DAILY_COLLECTION as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  name: "DMSBookingOfficeDailyCollectionView",

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
      this.loadCollection();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadCollection() {
      const id = Number(this.params && this.params.collectionId);
      this.loading = true;
      try {
        this.form = (await apiGetCollectionById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
    },

    calcTotals() {
      const cb = parseFloat(this.form.CashBookingAmount) || 0;
      const cd = parseFloat(this.form.CashDeliveryAmount) || 0;
      const bcc = parseFloat(this.form.BookingCashCreditAmount) || 0;
      const dcc = parseFloat(this.form.DeliveryCashCreditAmount) || 0;
      const ccr = parseFloat(this.form.CashCreditReceiptAmount) || 0;
      const ocr = parseFloat(this.form.OtherCashReceiptAmount) || 0;
      const ocp = parseFloat(this.form.OtherCashPaymentAmount) || 0;
      const ud = parseFloat(this.form.UchakDebitAmount) || 0;
      const ur = parseFloat(this.form.UchakReceivedAmount) || 0;

      const totalCashCredit = bcc + dcc;
      const subTotal = cb + cd;
      const netTotal = subTotal + ccr + ocr - ocp - ud + ur;

      this.form.TotalCashCreditAmount = totalCashCredit.toFixed(2);
      this.form.SubTotalAmount = subTotal.toFixed(2);
      this.form.NetTotalAmount = netTotal.toFixed(2);
    },

    emptyForm() {
      return {
        CollectionId: null,
        CollectionDate: "",
        BookingOfficeName: "",
        CashBookingAmount: 0,
        CashBookingKasarAmount: 0,
        CashDeliveryAmount: 0,
        CashDeliveryKasarAmount: 0,
        BookingCashCreditAmount: 0,
        DeliveryCashCreditAmount: 0,
        TotalCashCreditAmount: "0.00",
        CashCreditReceiptAmount: 0,
        OtherCashReceiptAmount: 0,
        OtherCashPaymentAmount: 0,
        UchakDebitAmount: 0,
        UchakReceivedAmount: 0,
        SubTotalAmount: "0.00",
        NetTotalAmount: "0.00",
        Remarks: "",
      };
    },

    async saveCollection() {
      if (!this.form.CollectionDate) {
        this.$q.notify({
          message: "Collection Date is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.calcTotals();
      const res = await apiSaveCollection({ ...this.form });
      if (res.success) {
        this.notifyEntrySaved();
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({
          message: "Daily Collection saved!",
          color: "positive",
          position: "top",
        });
      }
    },
  },
};
</script>
