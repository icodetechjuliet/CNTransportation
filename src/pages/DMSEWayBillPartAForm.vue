<template>
  <q-page padding class="page hide-overflow">
    <div class="folder">
      <div class="row header-style items-center">
        <div class="col-xs-12 col-sm-8 col-md-9 header-inner">
          <div class="header-title">
            <span class="header_text1">E-Way Bill Part A</span>
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
                      dense
                      outlined
                      bg-color="blue-1"
                      label="Booking No."
                      v-model="form.BookingNo"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-select
                      :readonly="dialogMode === 'view'"
                      square
                      dense
                      outlined
                      bg-color="blue-1"
                      label="From City"
                      v-model="form.FromCity"
                      :options="mockData.cities"
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
                      dense
                      outlined
                      bg-color="blue-1"
                      label="To City"
                      v-model="form.ToCity"
                      :options="mockData.cities"
                      use-input
                      fill-input
                      display-value=""
                      input-debounce="0"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      :readonly="dialogMode === 'view'"
                      square
                      dense
                      outlined
                      bg-color="blue-1"
                      label="Consignor Name"
                      v-model="form.ConsignorName"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      :readonly="dialogMode === 'view'"
                      square
                      dense
                      outlined
                      bg-color="blue-1"
                      label="Consignee Name"
                      v-model="form.ConsigneeName"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      :readonly="dialogMode === 'view'"
                      square
                      dense
                      outlined
                      bg-color="blue-1"
                      label="Document Value"
                      type="number"
                      v-model="form.DocValue"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      :readonly="dialogMode === 'view'"
                      square
                      dense
                      outlined
                      bg-color="blue-1"
                      label="HSN Code"
                      v-model="form.HSNCode"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-select
                      :readonly="dialogMode === 'view'"
                      square
                      dense
                      outlined
                      bg-color="blue-1"
                      label="Transport Mode"
                      v-model="form.TransportMode"
                      :options="mockData.transportModes"
                    />
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
import ListPage from "./DMSEWayBillPartA.vue";

export default {
  name: "DMSEWayBillPartAForm",
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
        await this.loadBills();
        const record = this.filteredBills.find(
          (row) => String(row.EWayBillId) === String(id)
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
      this.backToEntryList("/DMSEWayBillPartA", "E-Way Bill Part A");
    },
  },
};
</script>
