<template>
  <div>
    <!-- Old app: BUK_EWayBill's "Generate Part B" action, done one bill at
         a time — lists Part A records still pending a vehicle
         (PartBStatus "Not Generated") with a Generate action per row. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">E Way Bill - Part B - Single</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredBills.length }}</span>
                <span class="total-stat-label">Pending Part B</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredBills"
            :columns="tableColumns"
            row-key="EWayBillId"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-black m-table-style"
            table-header-class="text-black m-table-style"
            card-class="text-black"
            :grid="$q.screen.lt.sm"
          >
            <template v-slot:top>
              <div class="tb-app col">
                <div class="filter-bar-wrapper accent-filter-bar">
                  <div class="search-combo-wrapper">
                    <input
                      v-model="searchText"
                      class="search-combo-input"
                      placeholder="Search Any"
                      @keyup.enter="loadBills"
                    />
                    <q-btn
                      v-if="searchText"
                      flat
                      dense
                      round
                      icon="close"
                      size="xs"
                      class="search-combo-clear-btn"
                      @click="clearSearch"
                    >
                      <q-tooltip>Clear</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      icon="search"
                      class="search-combo-icon-btn"
                      @click="loadBills"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="loadBills"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  unelevated
                  no-caps
                  dense
                  size="sm"
                  icon="local_shipping"
                  label="Generate Part B"
                  color="primary"
                  class="m-btn-style"
                  @click="openGenerate(props.row)"
                />
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="local_shipping" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.EWayBillNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.BookingNo }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="mjc-actions">
                  <q-btn
                    dense
                    unelevated
                    icon="local_shipping"
                    label="Generate Part B"
                    class="mjc-btn mjc-btn-edit"
                    @click="openGenerate(props.row)"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <q-dialog v-model="showDialog">
      <q-card style="min-width: 420px">
        <q-card-section class="row items-center">
          <div class="text-h6">Generate Part B</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            E-Way Bill No.:
            <b>{{ selectedBill && selectedBill.EWayBillNo }}</b>
          </div>
          <div class="row q-col-gutter-sm items-start">
            <div class="col-12 col-sm-6 col-md-3">
              <q-select
                square=""
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
                square=""
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
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions
          align="right"
          class="q-gutter-sm q-pt-none q-pb-none q-pr-none"
        >
          <q-btn label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            class="m-btn-style"
            label="Generate"
            @click="generate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  apiGetEWayBills,
  apiGeneratePartBSingle,
  MOCK_DATA,
} from "src/data/ewayBillData.js";

export default {
  name: "DMSEWayBillPartBSingle",

  data() {
    return {
      filteredBills: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      mockData: MOCK_DATA,

      showDialog: false,
      selectedBill: null,
      vehicleNo: "",
      fromPlace: "",

      tableColumns: [
        {
          name: "EWayBillNo",
          label: "E-Way Bill No.",
          field: "EWayBillNo",
          sortable: true,
        },
        {
          name: "BookingNo",
          label: "Booking No.",
          field: "BookingNo",
          sortable: true,
        },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
        { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
        { name: "DocValue", label: "Value", field: "DocValue", align: "right" },
        { name: "action", label: "Action", field: "action" },
      ],
    };
  },

  mounted() {
    this.loadBills();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.loadBills();
    },

    async loadBills() {
      const all = await apiGetEWayBills(this.searchText);
      this.filteredBills = all.filter((e) => e.PartBStatus === "Not Generated");
    },

    openGenerate(row) {
      this.selectedBill = row;
      this.vehicleNo = "";
      this.fromPlace = row.FromCity;
      this.showDialog = true;
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
      const res = await apiGeneratePartBSingle(
        this.selectedBill.EWayBillId,
        this.vehicleNo,
        this.fromPlace
      );
      if (res.success) {
        this.$q.notify({
          message: "Part B generated!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadBills();
      }
    },
  },
};
</script>
