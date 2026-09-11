<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Office Commission</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text2">{{ modeLabel }}</span>
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
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
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
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
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
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Item Name"
                  v-model="form.ItemName"
                  :options="mockData.items"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="From Date"
                  v-model="form.FromDate"
                  placeholder="dd/mm/yyyy"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="fromDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="form.FromDate"
                          mask="DD/MM/YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.fromDateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="To Date"
                  v-model="form.ToDate"
                  placeholder="dd/mm/yyyy"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="toDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="form.ToDate"
                          mask="DD/MM/YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.toDateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Inward Commission Rate"
                  type="number"
                  v-model="form.InwardCommissionRate"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Outward Commission Rate"
                  type="number"
                  v-model="form.OutwardCommissionRate"
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
import { apiGetCommissionById, apiSaveCommission, MOCK_DATA } from "./DMSBookingOfficeCommission.vue";

export default {
  name: "DMSBookingOfficeCommissionView",

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

    emptyForm() {
      return {
        CommissionId: null,
        BookingOfficeName: "",
        AccountName: "",
        ItemName: "",
        FromDate: "",
        ToDate: "",
        InwardCommissionRate: 0,
        OutwardCommissionRate: 0,
        Remarks: "",
      };
    },

    async saveCommission() {
      if (!this.form.BookingOfficeName || !this.form.AccountName) {
        this.$q.notify({ message: "Booking Office and Account are required", color: "negative", position: "top" });
        return;
      }
      const res = await apiSaveCommission({ ...this.form });
      if (res.success) {
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({ message: "Commission saved!", color: "positive", position: "top" });
      }
    },
  },
};
</script>
