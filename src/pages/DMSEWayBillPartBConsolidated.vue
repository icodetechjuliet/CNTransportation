<template>
  <div>
    <!-- Old app: BUK_EWayBill_Consolidated — group several pending Part A
         bills bound for the same vehicle and generate one Consolidated
         E-Way Bill No. covering all of them at once. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 header-inner">
            <div class="header-title">
              <span class="header_text1">
                E Way Bill - Part B - Consolidated
              </span>
            </div>
          </div>
        </div>

        <q-card class="notab-container">
          <q-card-section>
            <div class="row q-col-gutter-sm items-start">
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Vehicle No."
                  v-model="vehicleNo"
                  :options="mockData.vehicles"
                  use-input
                  fill-input
                  display-value=""
                  input-debounce="0"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="From Place"
                  v-model="fromPlace"
                  :options="mockData.cities"
                  use-input
                  fill-input
                  display-value=""
                  input-debounce="0"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3 flex items-center">
                <q-input
                  square
                  dense
                  outlined
                  readonly
                  bg-color="blue-1"
                  label="Selected Bills"
                  :model-value="selectedIds.length"
                  class="full-width"
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2 text-dark">Pending Part A Bills</div>
              <q-space />
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                label="Select All"
                @click="selectedIds = filteredBills.map((b) => b.EWayBillId)"
              />
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                label="Clear"
                @click="selectedIds = []"
              />
            </div>
            <q-table
              square
              flat
              :rows="filteredBills"
              :columns="tableColumns"
              row-key="EWayBillId"
              :rows-per-page-options="[0]"
              hide-pagination
              table-class="text-black m-table-style"
              table-header-class="text-black m-table-style"
              card-class="text-black"
            >
              <template v-slot:body-cell-select="props">
                <q-td :props="props">
                  <q-checkbox
                    dense
                    v-model="selectedIds"
                    :val="props.row.EWayBillId"
                    color="orange"
                  />
                </q-td>
              </template>
            </q-table>

            <div class="row q-mt-md">
              <q-btn
                unelevated
                no-caps
                color="positive"
                icon="fa-solid fa-layer-group"
                :label="`Generate Consolidated E-Way Bill (${selectedIds.length})`"
                @click="generate"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import {
  apiGetEWayBills,
  apiGeneratePartBConsolidated,
  MOCK_DATA,
} from "src/data/ewayBillData.js";

export default {
  name: "DMSEWayBillPartBConsolidated",

  data() {
    return {
      filteredBills: [],
      selectedIds: [],
      vehicleNo: "",
      fromPlace: "",
      mockData: MOCK_DATA,

      tableColumns: [
        { name: "select", label: "", field: "select" },
        { name: "EWayBillNo", label: "E-Way Bill No.", field: "EWayBillNo" },
        { name: "BookingNo", label: "Booking No.", field: "BookingNo" },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "DocValue", label: "Value", field: "DocValue", align: "right" },
      ],
    };
  },

  mounted() {
    this.loadBills();
  },

  methods: {
    async loadBills() {
      const all = await apiGetEWayBills(null);
      this.filteredBills = all.filter((e) => e.PartBStatus === "Not Generated");
    },

    async generate() {
      if (!this.vehicleNo || !this.fromPlace) {
        this.$q.notify({
          message: "Vehicle No. and From Place are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      if (this.selectedIds.length === 0) {
        this.$q.notify({
          message: "Select at least one E-Way Bill",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiGeneratePartBConsolidated(
        this.selectedIds,
        this.vehicleNo,
        this.fromPlace
      );
      if (res.success) {
        this.$q.notify({
          message: `Consolidated E-Way Bill ${res.consolidatedNo} generated!`,
          color: "positive",
          position: "top",
        });
        this.selectedIds = [];
        this.loadBills();
      }
    },
  },
};
</script>
