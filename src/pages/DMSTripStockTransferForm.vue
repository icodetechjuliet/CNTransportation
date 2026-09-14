<template>
  <q-page padding class="page hide-overflow">
    <div class="folder">
      <div class="row header-style items-center">
        <div class="col-xs-12 col-sm-8 col-md-9 header-inner">
          <div class="header-title">
            <span class="header_text1">Trip - Stock Transfer</span>
            <span class="arrow_right_icon">
              <i class="fa fa-chevron-right"></i>
            </span>
            <span class="header_text2">
              {{
                dialogMode === "view"
                  ? "View"
                  : dialogMode === "edit"
                  ? "Edit"
                  : "Add"
              }}
            </span>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-4 col-md-3 row justify-end items-center desktop-actions-group"
        >
          <template v-if="dialogMode !== 'view'">
            <q-btn
              class="desktop-action-btn bg-green-white bdr-green text-dgreen"
              dense
              unelevated
              no-caps
              icon="task_alt"
              label="Save"
              @click="saveTrip"
              :disable="entryLoading || !!entryError"
            />
          </template>

          <q-btn dense flat round icon="close" @click="closeDialog">
            <q-tooltip>Back to list</q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-card class="tabs-container">
        <q-inner-loading :showing="entryLoading" color="primary" />
        <div v-if="entryError" class="q-pa-md text-negative">
          {{ entryError }}
        </div>
        <template v-else-if="!entryLoading">
          <q-tabs
            v-model="entryTab"
            dense
            class="text-teal custom-tabs"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="details0" label="General Details [1]" accesskey="1" />
            <q-tab name="details1" label="Vehicle Details [2]" accesskey="2" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="entryTab" animated keep-alive>
            <q-tab-panel name="details0">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="row q-col-gutter-sm items-start">
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-input
                        square
                        label="Trip No."
                        v-model="form.TripNo"
                        dense
                        outlined
                        bg-color="blue-1"
                        readonly
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-input
                        square
                        label="Trip Date"
                        v-model="form.TripDate"
                        dense
                        outlined
                        bg-color="blue-1"
                        placeholder="dd/mm/yyyy"
                        :readonly="dialogMode === 'view'"
                      >
                        <template v-slot:append>
                          <q-icon
                            name="event"
                            class="cursor-pointer"
                            v-if="dialogMode !== 'view'"
                          >
                            <q-popup-proxy
                              ref="tripDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="form.TripDate"
                                mask="DD/MM/YYYY"
                                minimal
                                @update:model-value="$refs.tripDateProxy.hide()"
                              />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="Status"
                        v-model="form.Status"
                        :options="['Loaded', 'Unloaded']"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="From Branch (City)"
                        v-model="form.FromCity"
                        :options="mockData.cities"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        display-value=""
                        input-debounce="0"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="To Branch (City)"
                        v-model="form.ToCity"
                        :options="mockData.cities"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        display-value=""
                        input-debounce="0"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="Booking Office"
                        v-model="form.BookingOffice"
                        :options="mockData.bookingOffices"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="To Booking Office"
                        v-model="form.ToBookingOffice"
                        :options="mockData.bookingOffices"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-input
                        square
                        label="Trip Start Time"
                        v-model="form.TripStartTime"
                        dense
                        outlined
                        bg-color="blue-1"
                        placeholder="hh:mm AM/PM"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-input
                        square
                        label="Trip Complete Date Time"
                        v-model="form.TripCompleteDateTime"
                        dense
                        outlined
                        bg-color="blue-1"
                        placeholder="dd/mm/yyyy hh:mm"
                        :readonly="dialogMode === 'view'"
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
                            v-model="form.IsStockTransferTrip"
                            disable
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label dense>Stock Transfer Trip</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-sm-6 col-md-6">
                      <q-input
                        square
                        label="Remarks"
                        v-model="form.Remarks"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="textarea"
                        :rows="2"
                        autogrow
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="details1">
              <q-card v-for="n in 3" :key="n" flat bordered class="q-mb-sm">
                <q-card-section class="q-pa-sm">
                  <div class="field-label text-weight-bold q-mb-xs">
                    Vehicle {{ n }}{{ n === 1 ? " (Primary)" : " (Optional)" }}
                  </div>
                  <div class="row q-col-gutter-sm items-start">
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="Vehicle No."
                        v-model="form['Vehicle' + n + 'No']"
                        :options="mockData.vehicles"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        display-value=""
                        input-debounce="0"
                        clearable
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="Driver"
                        v-model="form['Vehicle' + n + 'Driver']"
                        :options="mockData.drivers"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        display-value=""
                        input-debounce="0"
                        clearable
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="From City"
                        v-model="form['Vehicle' + n + 'FromCity']"
                        :options="mockData.cities"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        display-value=""
                        input-debounce="0"
                        clearable
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-select
                        square
                        label="To City"
                        v-model="form['Vehicle' + n + 'ToCity']"
                        :options="mockData.cities"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        display-value=""
                        input-debounce="0"
                        clearable
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                      <q-input
                        square
                        label="Amount"
                        v-model="form['Vehicle' + n + 'Amount']"
                        type="number"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="row items-center">
                    <div class="col-xs-12 col-sm-6 col-md-3">
                      <span class="field-label">Total Trip Amount</span>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3">
                      <q-input
                        square
                        v-model="form.TotalTripAmount"
                        dense
                        outlined
                        bg-color="blue-1"
                        readonly
                        input-class="text-weight-bold"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import ListPage from "./DMSTripStockTransfer.vue";
import { apiGetTripById } from "src/data/tripData.js";
export default {
  name: "DMSTripStockTransferForm",
  extends: ListPage,
  props: { params: { type: Object, default: () => ({}) } },
  data() {
    return {
      entryPage: true,
      entryTab: "details0",
      entryLoading: true,
      entryError: "",
    };
  },
  async created() {
    const query = { ...this.$route?.query, ...this.params };
    this.dialogMode = ["add", "edit", "view"].includes(query.mode)
      ? query.mode
      : "add";
    const id = query.id;
    try {
      if (this.dialogMode !== "add") {
        const record = await apiGetTripById(Number(id));
        if (!record)
          throw new Error(
            "This record could not be found. Return to the list and select it again."
          );
        this.form = { ...record };
      }
    } catch (error) {
      this.entryError = error.message || "Unable to load record.";
    } finally {
      this.entryLoading = false;
    }
  },
  methods: {
    closeDialog() {
      this.backToEntryList("/DMSTripStockTransfer", "Trip - Stock Transfer");
    },
  },
};
</script>
