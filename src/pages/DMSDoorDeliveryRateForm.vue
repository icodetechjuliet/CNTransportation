<template>
  <q-page padding class="page hide-overflow">
    <div class="folder">
      <div class="row header-style items-center">
        <div class="col-xs-12 col-sm-8 col-md-9 header-inner">
          <div class="header-title">
            <span class="header_text1">Door Delivery Rate</span>
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
          <q-btn
            class="desktop-action-btn bg-green-white bdr-green text-dgreen"
            label="Save"
            @click="save"
            :disable="entryLoading || !!entryError || dialogMode === 'view'"
          />
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
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="entryTab" animated keep-alive>
            <q-tab-panel name="details0">
              <q-card-section>
                <div class="row q-col-gutter-sm items-start">
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      :readonly="dialogMode === 'view'"
                      square
                      v-model="form.RateName"
                      label="Rate Name"
                      dense
                      outlined
                      bg-color="blue-1"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-select
                      :readonly="dialogMode === 'view'"
                      square
                      v-model="form.VehicleType"
                      :options="mockData.vehicleTypes"
                      label="Vehicle Type"
                      dense
                      outlined
                      bg-color="blue-1"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-select
                      :readonly="dialogMode === 'view'"
                      square
                      v-model="form.City"
                      :options="mockData.cities"
                      label="City"
                      dense
                      outlined
                      bg-color="blue-1"
                      use-input
                      fill-input
                      display-value=""
                      input-debounce="0"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-select
                      :readonly="dialogMode === 'view'"
                      square
                      v-model="form.RateType"
                      :options="mockData.rateTypes"
                      label="Rate Type"
                      dense
                      outlined
                      bg-color="blue-1"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      :readonly="dialogMode === 'view'"
                      square
                      v-model="form.RateAmount"
                      type="number"
                      label="Rate Amount"
                      dense
                      outlined
                      bg-color="blue-1"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      :readonly="dialogMode === 'view'"
                      square
                      v-model="form.EffectiveDate"
                      label="Effective Date"
                      placeholder="dd-mm-yyyy"
                      dense
                      outlined
                      bg-color="blue-1"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="effDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="form.EffectiveDate"
                              mask="DD-MM-YYYY"
                              minimal
                              @update:model-value="$refs.effDateProxy.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import ListPage from "./DMSDoorDeliveryRate.vue";

export default {
  name: "DMSDoorDeliveryRateForm",
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
        await this.loadRows();
        const record = this.rows.find(
          (row) => String(row.RateID) === String(id)
        );
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
      this.backToEntryList("/DMSDoorDeliveryRate", "Door Delivery Rate");
    },
  },
};
</script>
