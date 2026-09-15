<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">
              Booking Office Commission Add Multiple
            </span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="checklist" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ selectedRows.length }}</span>
                <span class="total-stat-label">Selected</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Shared commission rate applied to every selected booking ── -->
          <q-card-section class="q-pa-sm">
            <div class="row q-col-gutter-sm items-start">
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Commission Type"
                  :options="['Percentage', 'Fixed']"
                  v-model="sharedFields.CommissionType"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  :label="
                    sharedFields.CommissionType === 'Fixed'
                      ? 'Amount'
                      : 'Rate %'
                  "
                  type="number"
                  v-model="sharedFields.Rate"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Applied Date"
                  placeholder="dd-mm-yyyy"
                  v-model="sharedFields.AppliedDate"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="dateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="sharedFields.AppliedDate"
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
            </div>
            <div class="row justify-end q-mt-sm">
              <q-btn
                unelevated
                no-caps
                dense
                label="Apply Commission"
                icon="percent"
                color="primary"
                class="m-btn-style"
                :disable="!selectedRows.length || !sharedFields.Rate"
                @click="applyCommission"
              />
            </div>
          </q-card-section>

          <q-separator class="q-mb-sm" />

          <!-- ── Delivered bookings eligible for commission ── -->
          <q-table
            square
            :rows="filteredBookingRows"
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
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    style="width: 150px"
                    class="q-mx-xs"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="fromDate" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
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
                    style="width: 150px"
                    class="q-mx-xs"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="toDate" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
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
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadRows"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>
          </q-table>

          <!-- ── Commission entries applied so far (this session) ── -->
          <div class="row items-center q-px-sm q-pt-md q-pb-xs">
            <q-icon
              name="fact_check"
              size="18px"
              class="q-mr-xs text-primary"
            />
            <span class="text-subtitle2 text-weight-bold">
              Applied Commission Entries
            </span>
          </div>
          <q-table
            square
            flat
            bordered
            :rows="appliedEntries"
            :columns="appliedColumns"
            row-key="EntryID"
            :rows-per-page-options="[10, 25, 50]"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
          >
            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-6 q-pa-md">
                No commission applied yet this session.
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { apiGetPreDeliveryList } from "src/data/deliveryData.js";

export default {
  name: "DMSBOCommissionAddMultiple",

  data() {
    return {
      bookingRows: [],
      selectedRows: [],
      appliedEntries: [],
      pagination: { page: 1, rowsPerPage: 15 },
      fromDate: this.defaultFromDate(),
      toDate: this.defaultToDate(),

      sharedFields: {
        CommissionType: "Percentage",
        Rate: 2.5,
        AppliedDate: "",
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
        { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
        { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
        {
          name: "NetAmount",
          label: "Net Amt.",
          field: "NetAmount",
          align: "right",
          sortable: true,
        },
      ],

      appliedColumns: [
        { name: "BookingNo", label: "Booking No", field: "BookingNo" },
        {
          name: "NetAmount",
          label: "Net Amt.",
          field: "NetAmount",
          align: "right",
        },
        { name: "CommissionType", label: "Type", field: "CommissionType" },
        { name: "Rate", label: "Rate", field: "Rate", align: "right" },
        {
          name: "CommissionAmount",
          label: "Commission Amt.",
          field: "CommissionAmount",
          align: "right",
        },
        { name: "AppliedDate", label: "Applied Date", field: "AppliedDate" },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },

    filteredBookingRows() {
      return this.bookingRows.filter((r) => {
        const bd = this.parseDMYDate(r.BookingDate);
        if (!bd) return true;
        if (this.fromDate && bd < this.fromDate) return false;
        if (this.toDate && bd > this.toDate) return false;
        return true;
      });
    },
  },

  mounted() {
    this.loadRows();
  },

  methods: {
    defaultFromDate() {
      return "2026-04-01";
    },

    defaultToDate() {
      return "2026-04-04";
    },

    // BookingDate here is "DD-MM-YYYY" (deliveryData.js) — convert to a
    // lexically-comparable "YYYY-MM-DD" to compare against fromDate/toDate.
    parseDMYDate(str) {
      if (!str) return null;
      const parts = String(str).split("-");
      if (parts.length !== 3) return null;
      const [d, m, y] = parts;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    },

    async loadRows() {
      // Commission is computed against already-delivered bookings.
      this.bookingRows = await apiGetPreDeliveryList("Delivered", "");
    },

    applyCommission() {
      const rate = parseFloat(this.sharedFields.Rate) || 0;
      let nextId = this.appliedEntries.length
        ? Math.max(...this.appliedEntries.map((e) => e.EntryID)) + 1
        : 1;
      this.selectedRows.forEach((row) => {
        const netAmount = parseFloat(row.NetAmount) || 0;
        const commissionAmount =
          this.sharedFields.CommissionType === "Fixed"
            ? rate
            : (netAmount * rate) / 100;
        this.appliedEntries.push({
          EntryID: nextId++,
          BookingNo: row.BookingNo,
          NetAmount: netAmount,
          CommissionType: this.sharedFields.CommissionType,
          Rate: rate,
          CommissionAmount: commissionAmount.toFixed(2),
          AppliedDate: this.sharedFields.AppliedDate || "—",
        });
      });
      this.$q.notify({
        message: `Commission applied to ${this.selectedRows.length} booking(s).`,
        color: "positive",
        position: "top",
      });
      this.selectedRows = [];
    },
  },
};
</script>
