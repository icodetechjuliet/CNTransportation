<template>
  <q-page
    padding
    class="page nvocc-form-page cn-dashboard-page cn-page-sales-dashboard"
  >
    <q-card class="notab-container-report nvocc-dialog-card">
      <!-- HEADER -->
      <div class="page-head dashboard-topbar">
        <div class="dashboard-heading">
          <div class="col">
            <div class="nvocc-page-title-row">
              <span class="header_text1">DMS</span>
              <span class="arrow_right_icon"
                ><i class="fa fa-chevron-right"></i
              ></span>
              <span class="header_text2">DMS Dashboard</span>
            </div>
            <div class="sub">
              Overview of bookings, trips and freight revenue across your DMS
              operations
            </div>
          </div>
        </div>
        <div class="head-actions">
          <q-btn
            dense
            unelevated
            no-caps
            icon="visibility"
            label="Bookings"
            class="m-btn-style-sm bg-blue-white radius-sm text-primary"
            @click="openBookingsView"
          />
          <q-btn
            dense
            unelevated
            no-caps
            icon="add"
            label="New Booking"
            class="m-btn-style-sm bg-dblue-lblue radius-sm text-white"
            @click="openNewBooking"
          />
        </div>
      </div>

      <div class="q-py-sm"><q-separator class="h-seperator" /></div>

      <!-- FILTERS: reuses the same tb-app filter-bar-wrapper/filter-pill/
           chips design as SalesDashboard.vue / TrailBalanceTreeView.vue
           (cn-style.css) instead of a page-specific filter class. -->
      <div class="q-pb-xs tb-app">
        <div class="filter-bar-wrapper">
          <!-- Date Range pill -->
          <div
            class="filter-pill date-pill"
            :class="{ 'pill-active': fromDate || toDate }"
          >
            <q-btn-dropdown
              flat
              no-caps
              dense
              ref="datePillDropdown"
              icon="calendar_today"
            >
              <template #label>
                <span class="dp-pill-prefix">Date Range :</span>
                <span class="dp-pill-value">{{ dateRangeLabel }}</span>
              </template>
              <div class="date-dropdown-inner">
                <div class="date-tab-row">
                  <div
                    class="date-tab"
                    :class="{ active: dateMode === 'quick' }"
                    @click="dateMode = 'quick'"
                  >
                    Quick Select
                  </div>
                  <div
                    class="date-tab"
                    :class="{ active: dateMode === 'custom' }"
                    @click="dateMode = 'custom'"
                  >
                    Custom Range
                  </div>
                </div>
                <div v-if="dateMode === 'quick'" class="quick-list">
                  <div
                    v-for="opt in quickDateOptions"
                    :key="opt.value"
                    class="quick-item"
                    :class="{ active: selectedQuickDate === opt.value }"
                    @click="applyQuickDate(opt)"
                  >
                    {{ opt.label }}
                  </div>
                </div>
                <div v-else>
                  <div class="dp-section-label">Date Range</div>
                  <div class="date-range-row">
                    <div class="date-field">
                      <DateInput v-model="fromDate" label="From Date" dense />
                    </div>
                    <div class="date-range-divider">
                      <q-icon name="arrow_forward" size="16px" color="grey-5" />
                    </div>
                    <div class="date-field">
                      <DateInput v-model="toDate" label="To Date" dense />
                    </div>
                  </div>
                  <div class="dp-footer dp-footer-spaced">
                    <q-btn
                      flat
                      dense
                      no-caps
                      class="m-btn-style-sm bg-grey-white bdr-grey text-black"
                      label="Clear"
                      @click="
                        fromDate = '';
                        toDate = '';
                        selectedQuickDate = null;
                      "
                    />
                    <q-btn
                      unelevated
                      dense
                      no-caps
                      class="m-btn-style-sm bg-dblue-lblue text-white"
                      color="primary"
                      label="Apply"
                      @click="applyCustomRange"
                    />
                  </div>
                </div>
              </div>
            </q-btn-dropdown>
          </div>

          <!-- Booking Type pill -->
          <div
            class="filter-pill"
            :class="{ 'pill-active': selectedBookingType }"
          >
            <q-btn-dropdown
              flat
              no-caps
              dense
              icon="swap_horiz"
              ref="bookingTypeDropdown"
            >
              <template #label>
                <span class="dp-pill-prefix">Booking Type :</span>
                <span class="dp-pill-value">{{
                  selectedBookingType ? selectedBookingType.label : "All"
                }}</span>
              </template>
              <div class="sl-dropdown-inner">
                <div class="dp-section-label">Select Booking Type</div>
                <div
                  class="sl-option-item"
                  @click="
                    selectedBookingType = null;
                    $refs.bookingTypeDropdown.hide();
                  "
                >
                  <q-icon
                    :name="
                      !selectedBookingType
                        ? 'radio_button_checked'
                        : 'radio_button_unchecked'
                    "
                    size="16px"
                    color="primary"
                  />
                  <span class="text-caption">All</span>
                </div>
                <q-separator class="q-my-xs" />
                <div
                  v-for="opt in bookingTypeOptions"
                  :key="opt.value"
                  class="sl-option-item"
                  :class="{
                    active:
                      selectedBookingType &&
                      selectedBookingType.value === opt.value,
                  }"
                  @click="
                    selectedBookingType = opt;
                    $refs.bookingTypeDropdown.hide();
                  "
                >
                  <q-icon
                    :name="
                      selectedBookingType &&
                      selectedBookingType.value === opt.value
                        ? 'radio_button_checked'
                        : 'radio_button_unchecked'
                    "
                    size="16px"
                    :color="
                      selectedBookingType &&
                      selectedBookingType.value === opt.value
                        ? 'primary'
                        : 'grey-4'
                    "
                  />
                  <span class="text-caption">{{ opt.label }}</span>
                </div>
              </div>
            </q-btn-dropdown>
          </div>

          <!-- Status pill -->
          <div
            class="filter-pill"
            :class="{ 'pill-active': selectedStatusFilter }"
          >
            <q-btn-dropdown flat no-caps dense icon="flag" ref="statusDropdown">
              <template #label>
                <span class="dp-pill-prefix">Status :</span>
                <span class="dp-pill-value">{{
                  selectedStatusFilter ? selectedStatusFilter.label : "All"
                }}</span>
              </template>
              <div class="sl-dropdown-inner" style="min-width: 200px">
                <div class="dp-section-label">Booking Status</div>
                <div
                  class="sl-option-item"
                  @click="
                    selectedStatusFilter = null;
                    $refs.statusDropdown.hide();
                  "
                >
                  <q-icon
                    :name="
                      !selectedStatusFilter
                        ? 'radio_button_checked'
                        : 'radio_button_unchecked'
                    "
                    size="16px"
                    color="primary"
                  />
                  <span class="text-caption">All</span>
                </div>
                <q-separator class="q-my-xs" />
                <div
                  v-for="opt in statusFilterOptions"
                  :key="opt.value"
                  class="sl-option-item"
                  :class="{
                    active:
                      selectedStatusFilter &&
                      selectedStatusFilter.value === opt.value,
                  }"
                  @click="
                    selectedStatusFilter = opt;
                    $refs.statusDropdown.hide();
                  "
                >
                  <q-icon
                    :name="
                      selectedStatusFilter &&
                      selectedStatusFilter.value === opt.value
                        ? 'radio_button_checked'
                        : 'radio_button_unchecked'
                    "
                    size="16px"
                    :color="
                      selectedStatusFilter &&
                      selectedStatusFilter.value === opt.value
                        ? 'primary'
                        : 'grey-4'
                    "
                  />
                  <span class="text-caption">{{ opt.label }}</span>
                </div>
              </div>
            </q-btn-dropdown>
          </div>

          <!-- Search / Refresh -->
          <div class="apply-filter-btn">
            <q-btn
              unelevated
              no-caps
              dense
              icon="search"
              label="Search"
              class="m-btn-style radius-md bg-dblue-lblue text-white"
              color="primary"
              @click="onSearch"
            />
            <q-btn
              flat
              dense
              icon="refresh"
              class="m-btn-style-sm radius-md bdr-blue-2 q-ml-xs refresh-btn"
              @click="refreshDashboard"
            >
              <q-tooltip>Refresh</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Active Filter Chips Row -->
        <div v-if="activeFilterChips.length > 0" class="chips-row q-mb-sm">
          <span class="chips-label">Active Filters:</span>
          <q-chip
            v-for="chip in activeFilterChips"
            :key="chip.key"
            class="filter-chip"
            :removable="chip.removable"
            dense
            :label="chip.label"
            @remove="removeChip(chip.key)"
          />
          <q-btn
            flat
            no-caps
            dense
            label="Clear All"
            icon="close"
            size="sm"
            class="clear-all-btn"
            @click="clearAllChips"
          />
        </div>
      </div>

      <!-- KPI SUMMARY CARDS -->
      <div class="kpi-grid">
        <div
          class="kpi"
          v-for="card in summaryCards"
          :key="card.key"
          :class="{ 'kpi-active': activeStatusFilter === card.key }"
          :style="{
            '--kpi-accent': card.accent,
            '--kpi-accent-dark': card.accentDark,
            '--kpi-bg': card.background,
            '--kpi-glow': card.glow,
          }"
          @click="filterByStatus(card.key)"
        >
          <div class="kpi-copy">
            <span class="kl">{{ card.label }}</span>
            <span class="kv">{{ card.count }}</span>
            <div class="kpi-note" v-if="card.note">{{ card.note }}</div>
          </div>
          <div class="kpi-icon-wrap">
            <q-icon class="kpi-icon" :name="card.icon" />
          </div>
          <q-icon class="kpi-open-icon" name="arrow_forward" />
        </div>
      </div>

      <!-- CHARTS -->
      <div class="dash-columns">
        <div class="dash-card">
          <div class="dash-title">
            <span><q-icon name="donut_large" /> Booking Status Split</span>
          </div>
          <div class="dash-card-body">
            <apexchart
              v-if="statusSeries.some((v) => v > 0)"
              type="donut"
              height="240"
              :options="statusChartOptions"
              :series="statusSeries"
            ></apexchart>
            <div v-else class="dash-empty text-center">
              <q-icon name="pie_chart" size="2rem" />
              <div class="text-caption q-mt-xs">No booking data</div>
            </div>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-title">
            <span
              ><q-icon name="location_city" /> Top Destination Cities</span
            >
          </div>
          <div class="dash-card-body">
            <apexchart
              v-if="destinationChartSeries[0].data.length"
              type="bar"
              height="240"
              :options="destinationChartOptions"
              :series="destinationChartSeries"
            ></apexchart>
            <div v-else class="dash-empty text-center">
              <q-icon name="bar_chart" size="2rem" />
              <div class="text-caption q-mt-xs">No booking data</div>
            </div>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-title">
            <span><q-icon name="show_chart" /> Bookings Trend (Monthly)</span>
          </div>
          <div class="dash-card-body">
            <apexchart
              v-if="trendChartSeries[0].data.length"
              type="area"
              height="240"
              :options="trendChartOptions"
              :series="trendChartSeries"
            ></apexchart>
            <div v-else class="dash-empty text-center">
              <q-icon name="show_chart" size="2rem" />
              <div class="text-caption q-mt-xs">No booking data</div>
            </div>
          </div>
        </div>

        <div class="dash-card-full row q-col-gutter-md dash-split-row">
          <div class="col-12 col-md-8">
            <div class="dash-card">
              <div class="dash-title">
                <span
                  ><q-icon name="payments" /> Freight Revenue by City</span
                >
              </div>
              <div class="dash-card-body">
                <apexchart
                  v-if="revenueChartSeries[0].data.length"
                  type="bar"
                  height="240"
                  :options="revenueChartOptions"
                  :series="revenueChartSeries"
                ></apexchart>
                <div v-else class="dash-empty text-center">
                  <q-icon name="payments" size="2rem" />
                  <div class="text-caption q-mt-xs">No revenue data</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="dash-card">
              <div class="dash-title">
                <span><q-icon name="account_balance_wallet" /> Payment Type Split</span>
              </div>
              <div class="dash-card-body">
                <apexchart
                  v-if="paymentTypeSeries.some((v) => v > 0)"
                  type="donut"
                  height="220"
                  width="280"
                  class="centered-donut"
                  :options="paymentTypeChartOptions"
                  :series="paymentTypeSeries"
                ></apexchart>
                <div v-else class="dash-empty text-center">
                  <q-icon name="account_balance_wallet" size="2rem" />
                  <div class="text-caption q-mt-xs">No booking data</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { LoaderMixin } from "src/mixins/Loadermixin.js";
import DateInput from "src/components/DateInput.vue";
import VueApexCharts from "vue3-apexcharts";
import { apiGetBookings } from "src/data/bookingData.js";
import { apiGetTrips } from "src/data/tripData.js";

export default {
  name: "DMSDashboard",

  components: { DateInput, apexchart: VueApexCharts },

  mixins: [LoaderMixin],

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      // filters
      fromDate: "",
      toDate: "",
      dateMode: "quick",
      selectedQuickDate: null,
      quickDateOptions: [
        { label: "Today", value: "today" },
        { label: "This Week", value: "this_week" },
        { label: "This Month", value: "this_month" },
        { label: "This Quarter", value: "this_quarter" },
        { label: "This Financial Year", value: "this_year" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Previous Week", value: "prev_week" },
        { label: "Previous Month", value: "prev_month" },
        { label: "Previous Financial Year", value: "prev_year" },
      ],
      selectedBookingType: null,
      bookingTypeOptions: [
        { label: "Inward", value: "Inward" },
        { label: "Outward", value: "Outward" },
      ],
      selectedStatusFilter: null,
      statusFilterOptions: [
        { label: "Delivered", value: "Delivered" },
        { label: "Confirmed", value: "Confirmed" },
        { label: "Converted", value: "Converted" },
        { label: "Pending Conversion", value: "Pending Conversion" },
      ],

      activeStatusFilter: null,
      bookingList: [],
      tripList: [],
    };
  },

  created() {
    this.applyQuickDate({ value: "this_year", label: "This Financial Year" });
  },

  mounted() {
    this.showLoading();
    Promise.all([this.loadBookings(), this.loadTrips()]).finally(() => {
      this.hideloading();
    });
  },

  computed: {
    summaryCards() {
      const base = this.globalFilteredBookings;
      const totalRevenue = base.reduce(
        (sum, b) => sum + (Number(b.FreightAmount) || 0),
        0
      );
      const delivered = base.filter((b) => b.Status === "Delivered").length;
      const confirmed = base.filter((b) => b.Status === "Confirmed").length;
      const converted = base.filter((b) => b.Status === "Converted").length;
      const pendingConversion = base.filter(
        (b) => b.Status === "Pending Conversion"
      ).length;
      const outward = base.filter((b) => b.BookingType === "Outward").length;
      const inward = base.filter((b) => b.BookingType === "Inward").length;
      const deliveryRate =
        base.length > 0 ? ((delivered / base.length) * 100).toFixed(1) : "0.0";

      return [
        {
          key: "total",
          label: "Total Bookings",
          icon: "receipt_long",
          count: base.length,
          note: "All bookings",
          accent: "#1787d4",
          accentDark: "#0566a9",
          background: "linear-gradient(135deg, #eef8ff 0%, #dff2ff 100%)",
          glow: "rgba(23, 135, 212, 0.2)",
        },
        {
          key: "revenue",
          label: "Freight Revenue",
          icon: "payments",
          count: `₹${totalRevenue.toLocaleString("en-IN")}`,
          note: "Total freight amount",
          accent: "#119b8e",
          accentDark: "#087268",
          background: "linear-gradient(135deg, #edfcf9 0%, #d9f6f1 100%)",
          glow: "rgba(17, 155, 142, 0.2)",
        },
        {
          key: "delivered",
          label: "Delivered",
          icon: "check_circle",
          count: delivered,
          note: "Completed deliveries",
          accent: "#2e9e5b",
          accentDark: "#1f7a44",
          background: "linear-gradient(135deg, #eefcf3 0%, #dcf6e6 100%)",
          glow: "rgba(46, 158, 91, 0.2)",
        },
        {
          key: "confirmed",
          label: "Confirmed",
          icon: "task_alt",
          count: confirmed,
          note: "Confirmed bookings",
          accent: "#6657d9",
          accentDark: "#4435b8",
          background: "linear-gradient(135deg, #f5f2ff 0%, #ebe7ff 100%)",
          glow: "rgba(102, 87, 217, 0.2)",
        },
        {
          key: "pendingConversion",
          label: "Pending Conversion",
          icon: "pending_actions",
          count: pendingConversion,
          note: "Awaiting conversion",
          accent: "#e88725",
          accentDark: "#bd5d08",
          background: "linear-gradient(135deg, #fff8eb 0%, #ffedcf 100%)",
          glow: "rgba(232, 135, 37, 0.22)",
        },
        {
          key: "deliveryRate",
          label: "Delivery Rate",
          icon: "trending_up",
          count: `${deliveryRate}%`,
          note: "Delivered ÷ total bookings",
          accent: "#2e9e5b",
          accentDark: "#1f7a44",
          background: "linear-gradient(135deg, #eefcf3 0%, #dcf6e6 100%)",
          glow: "rgba(46, 158, 91, 0.2)",
        },
        {
          key: "trips",
          label: "Total Trips",
          icon: "local_shipping",
          count: this.dateFilteredTrips.length,
          note: "In selected period",
          accent: "#455a9d",
          accentDark: "#2d3c73",
          background: "linear-gradient(135deg, #eef1ff 0%, #dfe4ff 100%)",
          glow: "rgba(69, 90, 157, 0.2)",
        },
        {
          key: "outward",
          label: "Outward Bookings",
          icon: "north_east",
          count: outward,
          note: "Dispatched from here",
          accent: "#e5484d",
          accentDark: "#b5262b",
          background: "linear-gradient(135deg, #fff2f0 0%, #ffe1de 100%)",
          glow: "rgba(229, 72, 77, 0.22)",
        },
        {
          key: "inward",
          label: "Inward Bookings",
          icon: "south_west",
          count: inward,
          note: "Received here",
          accent: "#5b8ab0",
          accentDark: "#3d6382",
          background: "linear-gradient(135deg, #eef6fb 0%, #dcedf6 100%)",
          glow: "rgba(91, 138, 176, 0.2)",
        },
      ];
    },

    dateFilteredBookings() {
      // BookingDate_raw is already stored as "YYYY-MM-DD", same shape as
      // fromDate/toDate, so a plain string compare is enough — no need
      // for the DD/MM/YYYY parsing SalesDashboard.vue's LeadDate needs.
      if (!this.fromDate && !this.toDate) return this.bookingList;
      return this.bookingList.filter((b) => {
        const d = b.BookingDate_raw;
        if (!d) return true;
        if (this.fromDate && d < this.fromDate) return false;
        if (this.toDate && d > this.toDate) return false;
        return true;
      });
    },

    dateFilteredTrips() {
      const parseTripDate = (str) => {
        // TripDate is "DD-MM-YYYY" — normalize to "YYYY-MM-DD" for the
        // same lexical compare used above.
        if (!str) return null;
        const parts = String(str).split("-");
        if (parts.length !== 3) return null;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      };
      if (!this.fromDate && !this.toDate) return this.tripList;
      return this.tripList.filter((t) => {
        const d = parseTripDate(t.TripDate);
        if (!d) return true;
        if (this.fromDate && d < this.fromDate) return false;
        if (this.toDate && d > this.toDate) return false;
        return true;
      });
    },

    dateRangeLabel() {
      if (this.selectedQuickDate) {
        const opt = this.quickDateOptions.find(
          (o) => o.value === this.selectedQuickDate
        );
        return opt ? opt.label : "Date Range";
      }
      const toDisplay = (d) => {
        if (!d) return null;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) return d;
        const parts = d.split("-");
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return null;
      };
      const f = toDisplay(this.fromDate);
      const t = toDisplay(this.toDate);
      if (f && t) return `${f} – ${t}`;
      if (f) return `From ${f}`;
      if (t) return `To ${t}`;
      return "Date Range";
    },

    // Every dashboard tile (KPIs, charts) is built on top of this single
    // filtered list, so Date Range / Booking Type / Status all apply
    // consistently everywhere — same convention as SalesDashboard.vue's
    // globalFilteredLeads.
    globalFilteredBookings() {
      let bookings = [...this.dateFilteredBookings];

      if (this.selectedBookingType?.value) {
        bookings = bookings.filter(
          (b) => b.BookingType === this.selectedBookingType.value
        );
      }

      if (this.selectedStatusFilter?.value) {
        bookings = bookings.filter(
          (b) => b.Status === this.selectedStatusFilter.value
        );
      }

      return bookings;
    },

    statusSeries() {
      const base = this.globalFilteredBookings;
      const count = (status) => base.filter((b) => b.Status === status).length;
      return [
        count("Delivered"),
        count("Confirmed"),
        count("Converted"),
        count("Pending Conversion"),
      ];
    },

    statusChartOptions() {
      return {
        labels: ["Delivered", "Confirmed", "Converted", "Pending Conversion"],
        colors: ["#2e9e5b", "#6657d9", "#1787d4", "#e88725"],
        legend: {
          position: "bottom",
          fontSize: "12px",
          markers: { width: 9, height: 9, radius: 3 },
          itemMargin: { horizontal: 8, vertical: 4 },
        },
        dataLabels: {
          enabled: true,
          style: { fontSize: "11px", fontWeight: 600 },
          dropShadow: { enabled: false },
        },
        stroke: { width: 2, colors: ["#fff"] },
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  fontSize: "12px",
                  color: "#78909c",
                  formatter: (w) =>
                    w.globals.seriesTotals.reduce((a, b) => a + b, 0),
                },
                value: {
                  fontSize: "20px",
                  fontWeight: 700,
                  offsetY: 2,
                },
              },
            },
          },
        },
      };
    },

    // Top destination cities by booking count — top 8, same shape as
    // SalesDashboard.vue's Top Salesmen chart.
    destinationCityData() {
      const counts = {};
      this.globalFilteredBookings.forEach((b) => {
        const city = (b.ToCity || "").trim();
        if (!city) return;
        counts[city] = (counts[city] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    },

    destinationChartOptions() {
      return {
        chart: { toolbar: { show: false }, fontFamily: "inherit" },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            barHeight: "55%",
            distributed: false,
          },
        },
        dataLabels: {
          enabled: true,
          style: { fontSize: "11px", fontWeight: 600, colors: ["#fff"] },
          offsetX: -4,
        },
        grid: { borderColor: "#f0f0f0", strokeDashArray: 3 },
        xaxis: {
          categories: this.destinationCityData.map((d) => d[0]),
          labels: { style: { fontSize: "11px" } },
        },
        yaxis: { labels: { style: { fontSize: "11px" } } },
        colors: ["#1787d4"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            gradientToColors: ["#6ec3f5"],
            opacityFrom: 1,
            opacityTo: 0.85,
          },
        },
      };
    },

    destinationChartSeries() {
      return [
        { name: "Bookings", data: this.destinationCityData.map((d) => d[1]) },
      ];
    },

    trendChartData() {
      const months = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          key: `${d.getFullYear()}-${d.getMonth()}`,
          label: d.toLocaleString("default", {
            month: "short",
            year: "2-digit",
          }),
          count: 0,
        });
      }
      this.globalFilteredBookings.forEach((b) => {
        const raw = b.BookingDate_raw;
        if (!raw) return;
        const d = new Date(raw);
        if (isNaN(d.getTime())) return;
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const month = months.find((m) => m.key === key);
        if (month) month.count++;
      });
      return months;
    },

    trendChartOptions() {
      return {
        chart: { toolbar: { show: false }, fontFamily: "inherit" },
        stroke: { curve: "smooth", width: 2.5 },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0.6,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 90, 100],
          },
        },
        markers: {
          size: 4,
          colors: ["#1787d4"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: { size: 6 },
        },
        grid: { borderColor: "#f0f0f0", strokeDashArray: 3 },
        dataLabels: { enabled: false },
        xaxis: {
          categories: this.trendChartData.map((m) => m.label),
          labels: { style: { fontSize: "11px" } },
        },
        yaxis: { labels: { style: { fontSize: "11px" } } },
        colors: ["#1787d4"],
      };
    },

    trendChartSeries() {
      return [
        { name: "Bookings", data: this.trendChartData.map((m) => m.count) },
      ];
    },

    // Freight revenue by destination city — top 8 by summed FreightAmount.
    revenueByCityData() {
      const totals = {};
      this.globalFilteredBookings.forEach((b) => {
        const city = (b.ToCity || "").trim();
        if (!city) return;
        totals[city] = (totals[city] || 0) + (Number(b.FreightAmount) || 0);
      });
      return Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    },

    revenueChartOptions() {
      return {
        chart: { toolbar: { show: false }, fontFamily: "inherit" },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            barHeight: "55%",
            distributed: false,
          },
        },
        dataLabels: {
          enabled: true,
          style: { fontSize: "11px", fontWeight: 600, colors: ["#fff"] },
          offsetX: -4,
          formatter: (v) => `₹${Number(v).toLocaleString("en-IN")}`,
        },
        grid: { borderColor: "#f0f0f0", strokeDashArray: 3 },
        xaxis: {
          categories: this.revenueByCityData.map((d) => d[0]),
          labels: { style: { fontSize: "11px" } },
        },
        yaxis: { labels: { style: { fontSize: "11px" } } },
        colors: ["#119b8e"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            gradientToColors: ["#5fd6c4"],
            opacityFrom: 1,
            opacityTo: 0.85,
          },
        },
      };
    },

    revenueChartSeries() {
      return [
        { name: "Revenue", data: this.revenueByCityData.map((d) => d[1]) },
      ];
    },

    paymentTypeCounts() {
      const counts = {};
      this.globalFilteredBookings.forEach((b) => {
        const type = b.PaymentType || "Unknown";
        counts[type] = (counts[type] || 0) + 1;
      });
      return counts;
    },

    paymentTypeLabels() {
      return Object.keys(this.paymentTypeCounts);
    },

    paymentTypeSeries() {
      return Object.values(this.paymentTypeCounts);
    },

    paymentTypeChartOptions() {
      return {
        labels: this.paymentTypeLabels,
        colors: [
          "#1787d4",
          "#119b8e",
          "#e88725",
          "#e5484d",
          "#6657d9",
          "#5b8ab0",
        ],
        legend: {
          position: "bottom",
          fontSize: "12px",
          markers: { width: 9, height: 9, radius: 3 },
          itemMargin: { horizontal: 8, vertical: 4 },
        },
        dataLabels: {
          enabled: true,
          style: { fontSize: "11px", fontWeight: 600 },
          dropShadow: { enabled: false },
        },
        stroke: { width: 2, colors: ["#fff"] },
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  fontSize: "12px",
                  color: "#78909c",
                  formatter: (w) =>
                    w.globals.seriesTotals.reduce((a, b) => a + b, 0),
                },
                value: {
                  fontSize: "20px",
                  fontWeight: 700,
                  offsetY: 2,
                },
              },
            },
          },
        },
      };
    },

    activeFilterChips() {
      const chips = [];

      chips.push({
        key: "dateRange",
        label: `Date : ${this.dateRangeLabel}`,
        removable: false,
      });

      if (this.selectedBookingType)
        chips.push({
          key: "bookingType",
          label: `Booking Type : ${this.selectedBookingType.label}`,
          removable: true,
        });

      if (this.selectedStatusFilter)
        chips.push({
          key: "status",
          label: `Status : ${this.selectedStatusFilter.label}`,
          removable: true,
        });

      if (this.activeStatusFilter) {
        const card = this.summaryCards.find(
          (c) => c.key === this.activeStatusFilter
        );
        chips.push({
          key: "kpi",
          label: card ? card.label : this.activeStatusFilter,
          removable: true,
        });
      }

      return chips;
    },
  },

  methods: {
    applyQuickDate(opt) {
      this.selectedQuickDate = opt.value;
      const today = new Date();
      const fmt = (d) => {
        const yy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yy}-${mm}-${dd}`;
      };
      const startOfWeek = (d) => {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(new Date(d).setDate(diff));
      };
      let from, to;
      if (opt.value === "today") {
        from = to = fmt(today);
      } else if (opt.value === "yesterday") {
        const y = new Date(today);
        y.setDate(y.getDate() - 1);
        from = to = fmt(y);
      } else if (opt.value === "this_week") {
        from = fmt(startOfWeek(today));
        to = fmt(today);
      } else if (opt.value === "prev_week") {
        const s = startOfWeek(today);
        s.setDate(s.getDate() - 7);
        const e = new Date(s);
        e.setDate(s.getDate() + 6);
        from = fmt(s);
        to = fmt(e);
      } else if (opt.value === "this_month") {
        from = fmt(new Date(today.getFullYear(), today.getMonth(), 1));
        to = fmt(today);
      } else if (opt.value === "prev_month") {
        from = fmt(new Date(today.getFullYear(), today.getMonth() - 1, 1));
        to = fmt(new Date(today.getFullYear(), today.getMonth(), 0));
      } else if (opt.value === "this_quarter") {
        const q = Math.floor(today.getMonth() / 3);
        from = fmt(new Date(today.getFullYear(), q * 3, 1));
        to = fmt(today);
      } else if (opt.value === "this_year") {
        const fyStartYear =
          today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
        from = `${fyStartYear}-04-01`;
        to = fmt(today);
      } else if (opt.value === "prev_year") {
        const prevFyStart =
          today.getMonth() >= 3
            ? today.getFullYear() - 1
            : today.getFullYear() - 2;
        from = `${prevFyStart}-04-01`;
        to = `${prevFyStart + 1}-03-31`;
      }
      this.fromDate = from;
      this.toDate = to;
      this.$nextTick(() => {
        this.$refs.datePillDropdown?.hide();
      });
    },

    applyCustomRange() {
      this.selectedQuickDate = null;
      this.$refs.datePillDropdown?.hide();
      this.onSearch();
    },

    async loadBookings() {
      try {
        // apiGetBookings(fromDate, toDate, direction, ...) only skips its
        // own BookingType filter when direction === "All" exactly — an
        // omitted/undefined direction filters every row out instead of
        // returning everything, so "All" must be passed explicitly here
        // (date range and Booking Type / Status are already applied
        // client-side by dateFilteredBookings/globalFilteredBookings).
        const res = await apiGetBookings(undefined, undefined, "All");
        this.bookingList = res || [];
      } catch (err) {
        console.log(err);
        this.bookingList = [];
      }
    },

    async loadTrips() {
      try {
        const res = await apiGetTrips();
        this.tripList = res || [];
      } catch (err) {
        console.log(err);
        this.tripList = [];
      }
    },

    filterByStatus(key) {
      this.activeStatusFilter = this.activeStatusFilter === key ? null : key;
    },

    async onSearch() {
      this.showLoading();
      await Promise.all([this.loadBookings(), this.loadTrips()]);
      this.hideloading();
    },

    async refreshDashboard() {
      this.showLoading();
      this.activeStatusFilter = null;
      this.selectedBookingType = null;
      this.selectedStatusFilter = null;
      await Promise.all([this.loadBookings(), this.loadTrips()]);
      this.hideloading();
    },

    // ── Chip Helpers ────────────────────────────────────────
    removeChip(key) {
      if (key === "bookingType") {
        this.selectedBookingType = null;
        this.onSearch();
      } else if (key === "status") {
        this.selectedStatusFilter = null;
        this.onSearch();
      } else if (key === "kpi") {
        this.activeStatusFilter = null;
      }
    },

    clearAllChips() {
      this.selectedBookingType = null;
      this.selectedStatusFilter = null;
      this.activeStatusFilter = null;
      this.onSearch();
    },

    openNewBooking() {
      const fullPath = "/DMSBookingView?mode=add";
      if (this.openTab) this.openTab(fullPath, "New Booking");
      else this.$router.push({ path: fullPath });
    },

    openBookingsView() {
      const fullPath = "/DMSBooking";
      if (this.openTab) this.openTab(fullPath, "Booking");
      else this.$router.push({ path: fullPath });
    },
  },
};
</script>
