<template>
  <div>
    <!-- Old app: BUK_BookingOfficeCommissionAddMultiple — applies the same
         commission slab (item/date-range/rates) to several booking offices
         at once, instead of adding them one at a time via
         DMSBookingOfficeCommission.vue's own Add/Edit page. Single utility
         page, same shape as DMSEWayBill.vue — not a list+CRUD pair. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Office Commission Add Multiple</span>
            </div>
          </div>
        </div>

        <q-card class="notab-container">
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Account"
                  v-model="form.AccountName"
                  :options="mockData.parties"
                  use-input
                  fill-input
                  display-value=""
                  input-debounce="0"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select square dense outlined bg-color="blue-1" label="Item" v-model="form.ItemName" :options="mockData.items" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="From Date" v-model="form.FromDate" placeholder="dd/mm/yyyy">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="fromDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.FromDate" mask="DD/MM/YYYY" minimal style="width: 280px" @update:model-value="$refs.fromDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="To Date" v-model="form.ToDate" placeholder="dd/mm/yyyy">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="toDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.ToDate" mask="DD/MM/YYYY" minimal style="width: 280px" @update:model-value="$refs.toDateProxy.hide()" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="Inward Commission %" type="number" v-model="form.InwardCommissionRate" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="Outward Commission %" type="number" v-model="form.OutwardCommissionRate" />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <q-input square dense outlined bg-color="blue-1" label="Remarks" v-model="form.Remarks" />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2">Apply To Booking Offices</div>
              <q-space />
              <q-btn flat dense no-caps size="sm" label="Select All" @click="selectedOffices = [...mockData.bookingOffices]" />
              <q-btn flat dense no-caps size="sm" label="Clear" @click="selectedOffices = []" />
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" v-for="office in mockData.bookingOffices" :key="office">
                <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                  <q-item-section avatar>
                    <q-checkbox dense v-model="selectedOffices" :val="office" color="orange" intermediate-icon="black" />
                  </q-item-section>
                  <q-item-section><q-item-label dense>{{ office }}</q-item-label></q-item-section>
                </q-item>
              </div>
            </div>

            <div class="row q-mt-md">
              <q-btn
                unelevated
                no-caps
                color="positive"
                icon="fa-solid fa-layer-group"
                :label="`Apply to ${selectedOffices.length} Booking Office(s)`"
                @click="applyToSelected"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { apiSaveCommission, MOCK_DATA } from "./DMSBookingOfficeCommission.vue";

export default {
  name: "DMSBookingOfficeCommissionAddMultiple",

  data() {
    return {
      mockData: MOCK_DATA,
      selectedOffices: [],
      form: {
        AccountName: "",
        ItemName: "",
        FromDate: "01/04/2026",
        ToDate: "30/09/2026",
        InwardCommissionRate: 0,
        OutwardCommissionRate: 0,
        Remarks: "",
      },
    };
  },

  methods: {
    async applyToSelected() {
      if (!this.form.AccountName || !this.form.ItemName) {
        this.$q.notify({ message: "Account and Item are required", color: "negative", position: "top" });
        return;
      }
      if (this.selectedOffices.length === 0) {
        this.$q.notify({ message: "Select at least one Booking Office", color: "negative", position: "top" });
        return;
      }

      await Promise.all(
        this.selectedOffices.map((office) =>
          apiSaveCommission({
            ...this.form,
            BookingOfficeName: office,
          })
        )
      );

      this.$q.notify({
        message: `Commission slab applied to ${this.selectedOffices.length} booking office(s)`,
        color: "positive",
        position: "top",
      });
      this.selectedOffices = [];
    },
  },
};
</script>
