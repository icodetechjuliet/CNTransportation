<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Commission</span>
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
                label="Commission No."
                v-model="form.CommissionNo"
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
                  @click="saveCommission"
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
                  readonly
                  label="Commission No."
                  v-model="form.CommissionNo"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Commission Date"
                  v-model="form.CommissionDate"
                  placeholder="dd/mm/yyyy"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="commissionDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="form.CommissionDate"
                          mask="DD/MM/YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.commissionDateProxy.hide()"
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
                  label="Commission Amount"
                  type="number"
                  v-model="form.CommissionAmount"
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
                  v-model="form.TDSPCT"
                  :disable="!form.IsDeductTDS"
                  @update:model-value="calcTDS"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
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
                  label="Net Payable"
                  v-model="form.NetPayable"
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
  apiGetCommissionById,
  apiSaveCommission,
  MOCK_DATA_BK_COMMISSION as MOCK_DATA,
} from "src/data/bookingData.js";

export default {
  mixins: [entryNavigation],
  name: "DMSCommissionView",

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
      this.loadCommission();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadCommission() {
      const id = Number(this.params && this.params.commissionId);
      this.loading = true;
      try {
        this.form = (await apiGetCommissionById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
    },

    calcTDS() {
      const amount = parseFloat(this.form.CommissionAmount) || 0;
      const pct = parseFloat(this.form.TDSPCT) || 0;
      const tds = this.form.IsDeductTDS ? (amount * pct) / 100 : 0;
      this.form.TDSAmount = tds.toFixed(2);
      this.form.NetPayable = (amount - tds).toFixed(2);
    },

    emptyForm() {
      return {
        CommissionId: null,
        CommissionNo: "",
        CommissionDate: "",
        BookingOfficeName: "",
        CommissionAmount: 0,
        IsDeductTDS: false,
        TDSPCT: 0,
        TDSAmount: "0.00",
        NetPayable: "0.00",
        Remarks: "",
      };
    },

    async saveCommission() {
      if (!this.form.CommissionDate || !this.form.BookingOfficeName) {
        this.$q.notify({
          message: "Commission Date and Booking Office are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.calcTDS();
      const res = await apiSaveCommission({ ...this.form });
      if (res.success) {
        this.notifyEntrySaved();
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({
          message: "Commission saved!",
          color: "positive",
          position: "top",
        });
      }
    },
  },
};
</script>
