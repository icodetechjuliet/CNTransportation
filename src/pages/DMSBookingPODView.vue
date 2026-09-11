<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <!-- ── Header — same "header-style" bar as DMSBookingOfficeView.vue /
             DMSBBookingView.vue. ── -->
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking POD</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text2">{{ modeLabel }}</span>
            </div>
            <div class="header-field-group">
              <q-input square dense outlined bg-color="blue-1" readonly label="POD No." v-model="form.PodNo" />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input square dense outlined bg-color="blue-1" readonly label="Status" v-model="form.Status" />
            </div>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
            <div class="row q-col-gutter-x-sm justify-end items-center">
              <div class="row items-center no-wrap desktop-actions-group">
                <q-btn
                  dense
                  unelevated
                  no-caps
                  icon="task_alt"
                  label="Save"
                  :disable="dialogMode === 'view'"
                  class="desktop-action-btn bg-green-white bdr-green text-dgreen"
                  @click="savePod"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ── Body — header fields, then a sub-table of pending bookings
             with a checkbox column to pick which ones this POD batch
             covers. No q-tabs needed (short field set + one table). ── -->
        <q-card class="notab-container">
          <q-inner-loading :showing="loading" color="primary" />
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="POD Date"
                  v-model="form.PodDate"
                  placeholder="dd/mm/yyyy"
                  :readonly="dialogMode === 'view'"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" v-if="dialogMode !== 'view'">
                      <q-popup-proxy ref="podDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="form.PodDate"
                          mask="DD/MM/YYYY"
                          minimal
                          style="width: 280px"
                          @update:model-value="$refs.podDateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-select
                  square
                  dense
                  outlined
                  bg-color="blue-1"
                  label="Booking Office"
                  v-model="form.BookingOfficeName"
                  :options="mockData.bookingOffices"
                  :readonly="dialogMode === 'view'"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="yellow-1" readonly label="Booking Count" :model-value="selectedBookingIds.length" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <q-input square dense outlined bg-color="yellow-1" readonly label="Total Amt." :model-value="totalAmount.toFixed(2)" />
              </div>
              <div class="col-xs-12">
                <q-input square dense outlined bg-color="blue-1" label="Remarks" v-model="form.Remarks" :readonly="dialogMode === 'view'" />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="pending-bookings-title">Pending Bookings</div>
            <q-table
              square
              flat
              :rows="mockData.pendingBookings"
              :columns="bookingColumns"
              row-key="BookingId"
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
                    :model-value="selectedBookingIds.includes(props.row.BookingId)"
                    :disable="dialogMode === 'view'"
                    @update:model-value="toggleBooking(props.row.BookingId)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<style scoped>
/* The app-wide ".q-field--dense.q-field--float .q-field__label" rule
   (cn-style.css) colors every filled/floated field label a medium blue
   (rgb(9 107 163)) with no ancestor scoping, so it applies here too. The
   Booking family's own fields (DMSBooking.vue's dialogs, DMSBBookingView.vue's
   tab panels) read the same way visually, but this page's plain
   ".notab-container" card doesn't carry any of the narrower selectors that
   happen to win over it elsewhere — scope the fix locally instead of
   touching the shared global rule.
   The "Pending Bookings" sub-heading gets an explicit dark, bold caption
   instead of ".text-subtitle2" (grey, easy to misread against the card's
   light background) to match the weight of "field-label" captions used
   elsewhere in this family. */
.pending-bookings-title {
  color: #1b1b1b;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

:deep(.q-field--dense.q-field--float .q-field__label) {
  color: rgba(0, 0, 0, 0.6) !important;
}
</style>

<script>
import { apiGetPodById, apiSavePod, MOCK_DATA } from "./DMSBookingPOD.vue";

export default {
  name: "DMSBookingPODView",

  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      loading: true,
      dialogMode: this.params.mode || "add",
      form: this.emptyForm(),
      selectedBookingIds: [],
      mockData: MOCK_DATA,
      bookingColumns: [
        { name: "select", label: "", field: "select" },
        { name: "BookingNo", label: "Booking No.", field: "BookingNo" },
        { name: "BookingDate", label: "Date", field: "BookingDate" },
        { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "NetAmt", label: "Net Amt.", field: "NetAmt", align: "right" },
      ],
    };
  },

  computed: {
    modeLabel() {
      if (this.dialogMode === "add") return "Add";
      if (this.dialogMode === "edit") return "Edit";
      return "View";
    },
    totalAmount() {
      return this.mockData.pendingBookings
        .filter((b) => this.selectedBookingIds.includes(b.BookingId))
        .reduce((sum, b) => sum + (Number(b.NetAmt) || 0), 0);
    },
  },

  created() {
    if (this.dialogMode === "add") {
      this.loading = false;
    } else {
      this.loadPod();
    }
  },

  methods: {
    toggleBooking(id) {
      const idx = this.selectedBookingIds.indexOf(id);
      if (idx === -1) this.selectedBookingIds.push(id);
      else this.selectedBookingIds.splice(idx, 1);
    },

    async loadPod() {
      const id = Number(this.params && this.params.podId);
      this.loading = true;
      try {
        const data = await apiGetPodById(id);
        this.form = data || this.emptyForm();
        this.selectedBookingIds = (data && data.BookingIds) || [];
      } finally {
        this.loading = false;
      }
    },

    emptyForm() {
      return {
        PodId: null,
        PodNo: "",
        PodDate: "03/04/2026",
        BookingOfficeName: "",
        Status: "Confirmed",
        Remarks: "",
      };
    },

    async savePod() {
      if (!this.form.BookingOfficeName) {
        this.$q.notify({ message: "Booking Office is required", color: "negative", position: "top" });
        return;
      }
      const res = await apiSavePod({
        ...this.form,
        BookingCount: this.selectedBookingIds.length,
        TotalAmount: this.totalAmount,
        BookingIds: [...this.selectedBookingIds],
      });
      if (res.success) {
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({ message: "POD saved!", color: "positive", position: "top" });
      }
    },
  },
};
</script>
