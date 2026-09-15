<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Delivery - Add Multiple</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="pending_actions" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ pendingRows.length }}</span>
                <span class="total-stat-label">Pending Bookings</span>
              </div>
            </div>
            <div class="total-stat-tile total-stat-tile--inline q-ml-sm">
              <q-icon name="checklist" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ selectedIds.length }}</span>
                <span class="total-stat-label">Selected</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Shared delivery details applied to every selected booking ── -->
          <q-card-section class="q-pa-sm">
            <div class="row q-col-gutter-sm items-start">
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Delivery Date"
                  placeholder="dd-mm-yyyy"
                  v-model="sharedFields.DeliveryDate"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="dateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="sharedFields.DeliveryDate"
                          mask="DD-MM-YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.dateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Receiver Name"
                  v-model="sharedFields.ReceiverName"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Payment Mode"
                  :options="mockData.paymentModes"
                  v-model="sharedFields.PaymentMode"
                  clearable
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Delivered By"
                  :options="mockData.users"
                  v-model="sharedFields.DeliveredBy"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Narration"
                  v-model="sharedFields.Narration"
                />
              </div>
            </div>
            <div class="row justify-end q-mt-sm">
              <q-btn
                unelevated
                no-caps
                dense
                label="Deliver Selected"
                icon="local_shipping"
                color="primary"
                class="m-btn-style"
                :disable="!selectedIds.length"
                @click="deliverSelected"
              />
            </div>
          </q-card-section>

          <q-separator class="q-mb-sm" />

          <!-- ── Pending bookings pool ── -->
          <q-table
            square
            :rows="pendingRows"
            :columns="tableColumns"
            row-key="PreDeliveryID"
            selection="multiple"
            v-model:selected="selectedRows"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
            card-class="text-black"
          >
            <template v-slot:top>
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

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    mask="##-##-####"
                    style="width: 130px"
                    class="q-mx-xs"
                    @update:model-value="applyFilters"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="fromDate"
                            mask="DD-MM-YYYY"
                            color="black"
                            @update:model-value="applyFilters"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="black"
                                flat
                              ></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="toDate"
                    label="To Date"
                    mask="##-##-####"
                    style="width: 130px"
                    class="q-mx-xs"
                    @update:model-value="applyFilters"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="toDate"
                            mask="DD-MM-YYYY"
                            color="black"
                            @update:model-value="applyFilters"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="black"
                                flat
                              ></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="loadRows"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import {
  apiGetPreDeliveryList,
  apiBulkDeliver,
  MOCK_DATA,
} from "src/data/deliveryData.js";

export default {
  name: "DMSDeliveryAddMultiple",

  data() {
    return {
      allRows: [],
      pendingRows: [],
      selectedRows: [],
      searchText: "",
      fromDate: "01-04-2026",
      toDate: "04-04-2026",
      pagination: { page: 1, rowsPerPage: 15 },
      mockData: MOCK_DATA,

      sharedFields: {
        DeliveryDate: "",
        ReceiverName: "",
        PaymentMode: "",
        DeliveredBy: "",
        Narration: "",
      },

      baseColumns: [
        {
          name: "BookingNo",
          label: "Booking No",
          field: "BookingNo",
          sortable: true,
        },
        {
          name: "BookingDate",
          label: "Booking Date",
          field: "BookingDate",
          sortable: true,
        },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
        { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
        {
          name: "NetAmount",
          label: "Net Amt.",
          field: "NetAmount",
          align: "right",
        },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    selectedIds() {
      return this.selectedRows.map((r) => r.BookingID);
    },
  },

  mounted() {
    this.loadRows();
  },

  methods: {
    clearSearch() {
      this.searchText = "";
      this.applyFilters();
    },

    async loadRows() {
      this.allRows = await apiGetPreDeliveryList("Pending", "");
      this.applyFilters();
    },

    parseDMDDate(dateStr) {
      if (!dateStr) return null;
      const [d, m, y] = dateStr.split("-").map(Number);
      if (!d || !m || !y) return null;
      return new Date(y, m - 1, d);
    },

    applyFilters() {
      let result = [...this.allRows];
      const from = this.parseDMDDate(this.fromDate);
      const to = this.parseDMDDate(this.toDate);
      if (from || to) {
        result = result.filter((r) => {
          const rDate = this.parseDMDDate(r.BookingDate);
          if (!rDate) return true;
          if (from && rDate < from) return false;
          if (to && rDate > to) return false;
          return true;
        });
      }
      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        result = result.filter(
          (r) =>
            r.BookingNo.toLowerCase().includes(s) ||
            (r.ToPartyName || "").toLowerCase().includes(s) ||
            (r.FromPartyName || "").toLowerCase().includes(s)
        );
      }
      this.pendingRows = result;
    },

    async deliverSelected() {
      if (!this.selectedIds.length) return;
      if (!this.sharedFields.DeliveryDate || !this.sharedFields.ReceiverName) {
        this.$q.notify({
          message: "Delivery Date and Receiver Name are required.",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiBulkDeliver(this.selectedIds, {
        ...this.sharedFields,
      });
      if (res.success) {
        this.$q.notify({
          message: `${res.count} booking(s) marked delivered.`,
          color: "positive",
          position: "top",
        });
        this.selectedRows = [];
        await this.loadRows();
      }
    },
  },
};
</script>
