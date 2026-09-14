<template>
  <div>
    <!-- Old app: ReceiptNoRenumbering — a utility screen (not a list+CRUD
         entity), same single-page shape as DMSEWayBill.vue: renumbers a
         range of booking receipt numbers under a series, e.g. after a
         gap/duplicate is found. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 header-inner">
            <div class="header-title">
              <span class="header_text1">Receipt No Renumbering</span>
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
                  label="Booking Office"
                  v-model="form.BookingOfficeName"
                  :options="mockData.bookingOffices"
                />
              </div>
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
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="From Receipt No."
                  v-model="form.FromReceiptNo"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="To Receipt No."
                  v-model="form.ToReceiptNo"
                />
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="New Starting No."
                  v-model="form.NewStartingNo"
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
                icon="fa-solid fa-list-ol"
                label="Renumber"
                @click="renumber"
              />
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 q-mb-sm">Renumbering History</div>
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
// Receipt No Renumbering data/mock-"backend" now lives in its own module,
// src/data/bookingData.js (localStorage-backed, so the renumbering history
// persists like a real DB) — every Booking-family page imports from there
// directly instead of from this page.
import {
  apiGetReceiptRenumberHistory,
  apiAddReceiptRenumber,
  MOCK_DATA_RECEIPT_RENUMBER as MOCK_DATA,
} from "src/data/bookingData.js";

export default {
  name: "DMSReceiptNoRenumbering",

  data() {
    return {
      mockData: MOCK_DATA,
      history: [],
      form: {
        BookingOfficeName: "",
        SeriesName: "",
        FromReceiptNo: "",
        ToReceiptNo: "",
        NewStartingNo: "",
        Remarks: "",
      },
      historyColumns: [
        {
          name: "BookingOfficeName",
          label: "Booking Office",
          field: "BookingOfficeName",
        },
        { name: "SeriesName", label: "Series", field: "SeriesName" },
        { name: "FromReceiptNo", label: "From No.", field: "FromReceiptNo" },
        { name: "ToReceiptNo", label: "To No.", field: "ToReceiptNo" },
        {
          name: "NewStartingNo",
          label: "New Starting No.",
          field: "NewStartingNo",
        },
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
      this.history = await apiGetReceiptRenumberHistory();
    },

    async renumber() {
      if (
        !this.form.BookingOfficeName ||
        !this.form.SeriesName ||
        !this.form.FromReceiptNo ||
        !this.form.ToReceiptNo ||
        !this.form.NewStartingNo
      ) {
        this.$q.notify({
          message:
            "Booking Office, Series, From/To Receipt No. and New Starting No. are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      await apiAddReceiptRenumber({
        BookingOfficeName: this.form.BookingOfficeName,
        SeriesName: this.form.SeriesName,
        FromReceiptNo: this.form.FromReceiptNo,
        ToReceiptNo: this.form.ToReceiptNo,
        NewStartingNo: this.form.NewStartingNo,
        DoneOn: new Date().toLocaleString(),
        DoneBy: "CargoNet User",
      });
      await this.loadHistory();
      this.$q.notify({
        message: "Receipt numbers renumbered (mock)",
        color: "positive",
        position: "top",
      });
      this.form = {
        BookingOfficeName: "",
        SeriesName: "",
        FromReceiptNo: "",
        ToReceiptNo: "",
        NewStartingNo: "",
        Remarks: "",
      };
    },
  },
};
</script>
