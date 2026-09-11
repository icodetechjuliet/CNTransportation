<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Office Wise Debit Collection</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text2">{{ modeLabel }}</span>
            </div>
            <div class="header-field-group">
              <q-input square dense outlined bg-color="blue-1" readonly label="Voucher No." v-model="form.VoucherNo" />
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
                  @click="saveVoucher"
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
                <q-input square dense outlined bg-color="blue-1" readonly label="Voucher No." v-model="form.VoucherNo" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="Voucher Date" v-model="form.VoucherDate" placeholder="dd/mm/yyyy">
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
                  label="Booking Office"
                  v-model="form.BookingOfficeName"
                  :options="mockData.bookingOffices"
                  use-input
                  fill-input
                  display-value=""
                  input-debounce="0"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="Total Amount" type="number" v-model="form.TotalAmount" />
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
import { apiGetVoucherById, apiSaveVoucher, MOCK_DATA } from "./DMSBookingOfficeWiseDebitCollection.vue";

export default {
  name: "DMSBookingOfficeWiseDebitCollectionView",

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
      this.loadVoucher();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadVoucher() {
      const id = Number(this.params && this.params.debitCollectionId);
      this.loading = true;
      try {
        this.form = (await apiGetVoucherById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
    },

    emptyForm() {
      return {
        DebitCollectionId: null,
        VoucherNo: "",
        VoucherDate: "",
        BookingOfficeName: "",
        TotalAmount: 0,
        Remarks: "",
      };
    },

    async saveVoucher() {
      if (!this.form.VoucherDate || !this.form.BookingOfficeName) {
        this.$q.notify({ message: "Voucher Date and Booking Office are required", color: "negative", position: "top" });
        return;
      }
      const res = await apiSaveVoucher({ ...this.form });
      if (res.success) {
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({ message: "Debit Collection saved!", color: "positive", position: "top" });
      }
    },
  },
};
</script>
