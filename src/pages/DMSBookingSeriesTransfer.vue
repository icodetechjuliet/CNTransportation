<template>
  <div>
    <!-- Old app: BookingSeriesTransfer — a utility screen (not a list+CRUD
         entity), same single-page shape as DMSEWayBill.vue/
         DMSReceiptNoRenumbering.vue: reassigns a block of a booking
         number series from one booking office to another. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Series Transfer</span>
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
                  label="Series"
                  v-model="form.SeriesName"
                  :options="mockData.series"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="From Booking Office"
                  v-model="form.FromBookingOffice"
                  :options="mockData.bookingOffices"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="To Booking Office"
                  v-model="form.ToBookingOffice"
                  :options="mockData.bookingOffices"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="From No."
                  v-model="form.FromNo"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="To No."
                  v-model="form.ToNo"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-6">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Remarks"
                  v-model="form.Remarks"
                />
              </div>
            </div>

            <div class="row q-mt-md">
              <q-btn
                unelevated
                no-caps
                color="positive"
                icon="fa-solid fa-right-left"
                label="Transfer"
                @click="transfer"
              />
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 q-mb-sm">Transfer History</div>
            <q-table
              square
              flat
              bordered
              :rows="history"
              :columns="historyColumns"
              row-key="HistoryId"
              :rows-per-page-options="[0]"
              hide-pagination
            />
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
// Booking Series Transfer data/mock-"backend" now lives in its own module,
// src/data/bookingData.js (localStorage-backed, so the transfer history
// persists like a real DB) — every Booking-family page imports from there
// directly instead of from this page.
import {
  apiGetSeriesTransferHistory,
  apiAddSeriesTransfer,
  MOCK_DATA_SERIES_TRANSFER as MOCK_DATA,
} from "src/data/bookingData.js";

export default {
  name: "DMSBookingSeriesTransfer",

  data() {
    return {
      mockData: MOCK_DATA,
      history: [],
      form: {
        SeriesName: "",
        FromBookingOffice: "",
        ToBookingOffice: "",
        FromNo: "",
        ToNo: "",
        Remarks: "",
      },
      historyColumns: [
        { name: "SeriesName", label: "Series", field: "SeriesName" },
        {
          name: "FromBookingOffice",
          label: "From Office",
          field: "FromBookingOffice",
        },
        {
          name: "ToBookingOffice",
          label: "To Office",
          field: "ToBookingOffice",
        },
        { name: "FromNo", label: "From No.", field: "FromNo" },
        { name: "ToNo", label: "To No.", field: "ToNo" },
        { name: "DoneOn", label: "Done On", field: "DoneOn" },
        { name: "DoneBy", label: "Done By", field: "DoneBy" },
      ],
    };
  },

  mounted() {
    this.loadHistory();
  },

  methods: {
    async loadHistory() {
      this.history = await apiGetSeriesTransferHistory();
    },

    async transfer() {
      if (
        !this.form.SeriesName ||
        !this.form.FromBookingOffice ||
        !this.form.ToBookingOffice ||
        !this.form.FromNo ||
        !this.form.ToNo
      ) {
        this.$q.notify({
          message:
            "Series, From/To Booking Office and From/To No. are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      if (this.form.FromBookingOffice === this.form.ToBookingOffice) {
        this.$q.notify({
          message: "From and To Booking Office must be different",
          color: "negative",
          position: "top",
        });
        return;
      }
      await apiAddSeriesTransfer({
        SeriesName: this.form.SeriesName,
        FromBookingOffice: this.form.FromBookingOffice,
        ToBookingOffice: this.form.ToBookingOffice,
        FromNo: this.form.FromNo,
        ToNo: this.form.ToNo,
        DoneOn: new Date().toLocaleString(),
        DoneBy: "CargoNet User",
      });
      await this.loadHistory();
      this.$q.notify({
        message: "Booking series transferred (mock)",
        color: "positive",
        position: "top",
      });
      this.form = {
        SeriesName: "",
        FromBookingOffice: "",
        ToBookingOffice: "",
        FromNo: "",
        ToNo: "",
        Remarks: "",
      };
    },
  },
};
</script>
