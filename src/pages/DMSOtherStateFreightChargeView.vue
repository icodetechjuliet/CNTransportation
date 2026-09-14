<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Other State Freight Charge</span>
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
                label="Voucher No."
                v-model="form.VoucherNo"
              />
            </div>
            <div class="header-field-group header-field-group-sm">
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
                  @click="saveCharge"
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
                  label="Voucher Date"
                  v-model="form.VoucherDate"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="voucherDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="form.VoucherDate"
                          mask="DD/MM/YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.voucherDateProxy.hide()"
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
                  label="Account Name"
                  v-model="form.AccountName"
                  :options="mockData.parties"
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
                  label="Reference No."
                  v-model="form.ReferenceNo"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Reference Date"
                  v-model="form.ReferenceDate"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="referenceDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="form.ReferenceDate"
                          mask="DD/MM/YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.referenceDateProxy.hide()"
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
                  label="SAC Code"
                  v-model="form.SACCode"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Print Title"
                  v-model="form.PrintTitle"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Total Amount"
                  type="number"
                  v-model.number="form.TotalAmount"
                  @update:model-value="calcTDS"
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
                      v-model="form.IsDeductTDS"
                      val="orange"
                      color="orange"
                      intermediate-icon="black"
                      @update:model-value="calcTDS"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>Deduct TDS</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="TDS %"
                  type="number"
                  :disable="!form.IsDeductTDS"
                  v-model.number="form.TDSPCT"
                  @update:model-value="calcTDS"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3" v-if="form.IsDeductTDS">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  readonly
                  label="TDS Amount"
                  v-model="form.TDSAmount"
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
  apiGetOSFChargeById as apiGetChargeById,
  apiSaveOSFCharge as apiSaveCharge,
  MOCK_DATA_OSF_CHARGE as MOCK_DATA,
} from "src/data/bookingData.js";

export default {
  mixins: [entryNavigation],
  name: "DMSOtherStateFreightChargeView",

  // Set by DynamicTab.vue's openTab() from the `?mode=...&chargeId=...`
  // query string it's opened with — see openAddCharge()/editCharge() in
  // DMSOtherStateFreightCharge.vue.
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
      this.loadCharge();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadCharge() {
      const id = Number(this.params && this.params.chargeId);
      this.loading = true;
      try {
        this.form = (await apiGetChargeById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
    },

    calcTDS() {
      const total = Number(this.form.TotalAmount) || 0;
      const pct = this.form.IsDeductTDS ? Number(this.form.TDSPCT) || 0 : 0;
      this.form.TDSAmount = this.form.IsDeductTDS
        ? Math.round((total * pct) / 100)
        : 0;
      this.form.NetAmount = total - this.form.TDSAmount;
    },

    emptyForm() {
      return {
        OSFChargeId: null,
        VoucherNo: "OSF0001",
        VoucherDate: "",
        AccountName: "",
        ReferenceNo: "",
        ReferenceDate: "",
        SACCode: "",
        PrintTitle: "",
        TotalAmount: 0,
        IsDeductTDS: false,
        TDSPCT: 0,
        TDSAmount: 0,
        NetAmount: 0,
        Remarks: "",
      };
    },

    async saveCharge() {
      if (!this.form.AccountName) {
        this.$q.notify({
          message: "Account Name is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.calcTDS();
      const res = await apiSaveCharge({ ...this.form });
      if (res.success) {
        this.notifyEntrySaved();
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({
          message: "Other State Freight Charge saved!",
          color: "positive",
          position: "top",
        });
      }
    },
  },
};
</script>
