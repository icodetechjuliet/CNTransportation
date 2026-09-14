<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Door Delivery Register</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredRows.length }}</span>
                <span class="total-stat-label">Door Delivery Runs</span>
              </div>
            </div>
            <div class="total-stat-tile total-stat-tile--inline q-ml-sm">
              <q-icon name="payments" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ totalVehicleAmount }}</span>
                <span class="total-stat-label">Total Vehicle Amt.</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — report/list only, mirrors GET /api/Delivery/door-delivery. ── -->
          <q-table
            square
            :rows="filteredRows"
            :columns="tableColumns"
            row-key="DoorDeliveryID"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
            card-class="text-black"
            :grid="$q.screen.lt.sm"
          >
            <template v-slot:top="props">
              <div class="tb-app col">
                <div class="filter-bar-wrapper accent-filter-bar">
                  <div class="search-combo-wrapper">
                    <input
                      v-model="searchText"
                      class="search-combo-input"
                      placeholder="Search Any"
                      @keyup.enter="applyFilters"
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
                      @click="applyFilters"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-select
                    square=""
                    v-model="transporterFilter"
                    :options="transporterOptions"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="min-width: 190px"
                    class="q-mx-xs"
                    @update:model-value="applyFilters"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadRows"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />

                  <q-btn
                    flat
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
                    @click="props.toggleFullscreen"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                  />
                </div>
              </div>
            </template>

            <template v-slot:pagination>
              <q-pagination
                v-model="pagination.page"
                direction-links
                :max="maxPages"
                :max-pages="10"
                boundary-links
                boundary-numbers
                color="blue"
                size="md"
                dense
                @update:model-value="handlePageChange"
              />
              <span class="q-ml-md">
                Page {{ pagination.page }} of {{ maxPages }}
              </span>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { apiGetDoorDeliveries, MOCK_DATA } from "src/data/deliveryData.js";

export default {
  name: "DMSDoorDeliveryRegister",

  data() {
    return {
      allRows: [],
      filteredRows: [],
      transporterFilter: "All",
      transporterOptions: ["All", ...MOCK_DATA.transporters],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

      baseColumns: [
        {
          name: "DoorDeliveryNo",
          label: "Door Delivery No.",
          field: "DoorDeliveryNo",
          sortable: true,
        },
        {
          name: "DoorDeliveryDate",
          label: "Date",
          field: "DoorDeliveryDate",
          sortable: true,
        },
        { name: "DoorDeliveryName", label: "Name", field: "DoorDeliveryName" },
        { name: "Vehicle", label: "Vehicle", field: "Vehicle" },
        {
          name: "TransporterAccount",
          label: "Transporter",
          field: "TransporterAccount",
          sortable: true,
        },
        { name: "RateType", label: "Rate Type", field: "RateType" },
        {
          name: "ReceivableAmount",
          label: "Receivable",
          field: "ReceivableAmount",
          align: "right",
        },
        {
          name: "VehicleAmount",
          label: "Vehicle Amt.",
          field: "VehicleAmount",
          align: "right",
          sortable: true,
        },
        {
          name: "IsDoorCollection",
          label: "Door Collection",
          field: (r) => (r.IsDoorCollection ? "Yes" : "No"),
          align: "center",
        },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    totalVehicleAmount() {
      return this.filteredRows
        .reduce((sum, r) => sum + (parseFloat(r.VehicleAmount) || 0), 0)
        .toFixed(2);
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredRows.length / rows));
    },
  },

  async mounted() {
    await this.loadRows();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.applyFilters();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadRows() {
      this.allRows = await apiGetDoorDeliveries();
      this.applyFilters();
    },

    applyFilters() {
      let result = [...this.allRows];
      if (this.transporterFilter && this.transporterFilter !== "All")
        result = result.filter(
          (r) => r.TransporterAccount === this.transporterFilter
        );
      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        result = result.filter(
          (r) =>
            r.DoorDeliveryNo.toLowerCase().includes(s) ||
            (r.DoorDeliveryName || "").toLowerCase().includes(s) ||
            (r.Vehicle || "").toLowerCase().includes(s) ||
            (r.TransporterAccount || "").toLowerCase().includes(s)
        );
      }
      this.filteredRows = result;
    },
  },
};
</script>
