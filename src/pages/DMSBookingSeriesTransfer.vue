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
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select square dense outlined bg-color="blue-1" label="Series" v-model="form.SeriesName" :options="mockData.series" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select square dense outlined bg-color="blue-1" label="From Booking Office" v-model="form.FromBookingOffice" :options="mockData.bookingOffices" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select square dense outlined bg-color="blue-1" label="To Booking Office" v-model="form.ToBookingOffice" :options="mockData.bookingOffices" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="From No." v-model="form.FromNo" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="blue-1" label="To No." v-model="form.ToNo" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <q-input square dense outlined bg-color="blue-1" label="Remarks" v-model="form.Remarks" />
              </div>
            </div>

            <div class="row q-mt-md">
              <q-btn unelevated no-caps color="positive" icon="fa-solid fa-right-left" label="Transfer" @click="transfer" />
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 q-mb-sm">Transfer History</div>
            <q-table
              square
              flat
              bordered
              dense
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
const MOCK_DATA = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune"],
  series: ["RKG-2026", "CHK-2026", "NSK-2026"],
};

const MOCK_HISTORY = [
  { HistoryId: 1, SeriesName: "RKG-2026", FromBookingOffice: "Greenland", ToBookingOffice: "Chakan", FromNo: "2200", ToNo: "2250", DoneOn: "25/03/2026 03:15 PM", DoneBy: "Admin" },
];

export default {
  name: "DMSBookingSeriesTransfer",

  data() {
    return {
      mockData: MOCK_DATA,
      history: MOCK_HISTORY,
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
        { name: "FromBookingOffice", label: "From Office", field: "FromBookingOffice" },
        { name: "ToBookingOffice", label: "To Office", field: "ToBookingOffice" },
        { name: "FromNo", label: "From No.", field: "FromNo" },
        { name: "ToNo", label: "To No.", field: "ToNo" },
        { name: "DoneOn", label: "Done On", field: "DoneOn" },
        { name: "DoneBy", label: "Done By", field: "DoneBy" },
      ],
    };
  },

  methods: {
    transfer() {
      if (!this.form.SeriesName || !this.form.FromBookingOffice || !this.form.ToBookingOffice || !this.form.FromNo || !this.form.ToNo) {
        this.$q.notify({ message: "Series, From/To Booking Office and From/To No. are required", color: "negative", position: "top" });
        return;
      }
      if (this.form.FromBookingOffice === this.form.ToBookingOffice) {
        this.$q.notify({ message: "From and To Booking Office must be different", color: "negative", position: "top" });
        return;
      }
      this.history = [
        {
          HistoryId: this.history.length + 1,
          SeriesName: this.form.SeriesName,
          FromBookingOffice: this.form.FromBookingOffice,
          ToBookingOffice: this.form.ToBookingOffice,
          FromNo: this.form.FromNo,
          ToNo: this.form.ToNo,
          DoneOn: new Date().toLocaleString(),
          DoneBy: "CargoNet User",
        },
        ...this.history,
      ];
      this.$q.notify({ message: "Booking series transferred (mock)", color: "positive", position: "top" });
      this.form = { SeriesName: "", FromBookingOffice: "", ToBookingOffice: "", FromNo: "", ToNo: "", Remarks: "" };
    },
  },
};
</script>
