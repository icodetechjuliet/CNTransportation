<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Cash Credit</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text2">{{ modeLabel }}</span>
            </div>
            <div class="header-field-group">
              <q-input square dense outlined bg-color="blue-1" readonly label="Voucher No." v-model="form.VoucherNo" />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input square dense outlined bg-color="blue-1" readonly label="Pending Amount" v-model="form.PendingAmount" />
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
                  @click="saveCredit"
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
                <q-input square dense outlined bg-color="blue-1" label="Voucher Date" v-model="form.VoucherDate">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="voucherDateProxy" transition-show="scale" transition-hide="scale">
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
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Party Account Name"
                  v-model="form.PartyAccountName"
                  :options="mockData.parties"
                  use-input
                  fill-input
                  display-value=""
                  input-debounce="0"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="Reference User Name" v-model="form.ReferenceUserName" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="Booking No." v-model="form.BookingNo" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Booking Office"
                  v-model="form.BookingOfficeName"
                  :options="mockData.bookingOffices"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Received Amount"
                  type="number"
                  v-model.number="form.ReceivedAmount"
                  @update:model-value="calcPending"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Debit Amount"
                  type="number"
                  v-model.number="form.DebitAmount"
                  @update:model-value="calcPending"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" readonly label="Pending Amount" v-model="form.PendingAmount" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                  <q-item-section avatar>
                    <q-checkbox dense v-model="form.IsClear" val="orange" color="orange" intermediate-icon="black" />
                  </q-item-section>
                  <q-item-section><q-item-label dense>Is Clear</q-item-label></q-item-section>
                </q-item>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <q-input square dense outlined bg-color="blue-1" label="Narration" v-model="form.Narration" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { apiGetCreditById, apiSaveCredit, MOCK_DATA } from "./DMSCashCredit.vue";

export default {
  name: "DMSCashCreditView",

  // Set by DynamicTab.vue's openTab() from the `?mode=...&creditId=...`
  // query string it's opened with — see openAddCredit()/editCredit() in
  // DMSCashCredit.vue.
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
      this.loadCredit();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadCredit() {
      const id = Number(this.params && this.params.creditId);
      this.loading = true;
      try {
        this.form = (await apiGetCreditById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
    },

    calcPending() {
      const debit = Number(this.form.DebitAmount) || 0;
      const received = Number(this.form.ReceivedAmount) || 0;
      this.form.PendingAmount = debit - received;
    },

    emptyForm() {
      return {
        CashCreditId: null,
        VoucherNo: "CC0001",
        VoucherDate: "",
        PartyAccountName: "",
        ReferenceUserName: "",
        BookingNo: "",
        BookingOfficeName: "",
        ReceivedAmount: 0,
        DebitAmount: 0,
        PendingAmount: 0,
        IsClear: false,
        Narration: "",
      };
    },

    async saveCredit() {
      if (!this.form.PartyAccountName) {
        this.$q.notify({ message: "Party Account Name is required", color: "negative", position: "top" });
        return;
      }
      this.calcPending();
      const res = await apiSaveCredit({ ...this.form });
      if (res.success) {
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({ message: "Cash Credit saved!", color: "positive", position: "top" });
      }
    },
  },
};
</script>
