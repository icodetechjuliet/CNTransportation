<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Web</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="language" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredWebBookings.length }}
                </span>
                <span class="total-stat-label">Total Web Bookings</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredWebBookings"
            :columns="tableColumns"
            row-key="BookingWebId"
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
                      @keyup.enter="loadWebBookings"
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
                      @click="loadWebBookings"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_Web m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddWebBooking"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadWebBookings"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge
                  :color="statusColor(props.value)"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editWebBooking(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-right-left"
                  color="positive"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="convertToBooking(props.row)"
                >
                  <q-tooltip>Convert to Booking</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteWebBooking(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.BookingWebId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="language" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">
                        {{ props.row.BookingWebNo }}
                      </span>
                      <span class="mjc-job-date">
                        {{ props.row.BookingWebDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="statusColor(props.row.Status)"
                    >
                      {{ props.row.Status }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.BookingWebId)
                          ? 'expand_less'
                          : 'expand_more'
                      "
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-pen-to-square"
                    label="Edit"
                    class="mjc-btn mjc-btn-edit"
                    @click="editWebBooking(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-right-left"
                    label="Convert"
                    class="mjc-btn mjc-btn-edit"
                    @click="convertToBooking(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteWebBooking(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.BookingWebId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignor</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsignorAccount || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignee</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsigneeAccount || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Item</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ItemName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Bill No.</span>
                        <span class="mjc-detail-value">
                          {{ props.row.BillNo || "—" }}
                        </span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import entryNavigation from "src/mixins/entryNavigation.js";
// Booking Web data/mock-"backend" now lives in its own module,
// src/data/bookingData.js (localStorage-backed, so add/edit/delete persist
// like a real DB) — every Booking-family page imports from there directly
// instead of from this page.
import {
  apiGetWebBookings,
  apiSaveWebBooking,
  apiDeleteWebBooking,
  apiGetWebBookingById,
  peekNextWebBookingNo,
  MOCK_DATA_BOOKING_WEB as MOCK_DATA,
} from "src/data/bookingData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadWebBookings",
  name: "DMSBookingWeb",

  // Lets openAddWebBooking()/editWebBooking() open the full-page Add/Edit
  // tab (DMSBookingWebView.vue) instead of the in-page popup. `default:
  // null` keeps this page working standalone (outside DynamicTab.vue) by
  // falling back to the old dialog — same convention as DMSBBooking.vue.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      webBookings: [],
      filteredWebBookings: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "BookingWebNo",
          label: "Web No.",
          field: "BookingWebNo",
          sortable: true,
        },
        {
          name: "BookingWebDate",
          label: "Date",
          field: "BookingWebDate",
          sortable: true,
        },
        {
          name: "FromCity",
          label: "From City",
          field: "FromCity",
          sortable: true,
        },
        { name: "ToCity", label: "To City", field: "ToCity", sortable: true },
        {
          name: "ConsignorAccount",
          label: "Consignor",
          field: "ConsignorAccount",
        },
        {
          name: "ConsigneeAccount",
          label: "Consignee",
          field: "ConsigneeAccount",
        },
        { name: "Status", label: "Status", field: "Status", align: "center" },
      ],
    };
  },

  mounted() {
    this.loadWebBookings();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    statusColor(status) {
      if (status === "Converted") return "positive";
      if (status === "Rejected") return "negative";
      return "orange";
    },

    clearSearch() {
      this.searchText = "";
      this.loadWebBookings();
    },

    async loadWebBookings() {
      this.filteredWebBookings = await apiGetWebBookings(this.searchText);
    },

    nextWebNo() {
      return peekNextWebBookingNo();
    },

    emptyForm() {
      return {
        BookingWebId: null,
        BookingWebNo: this.nextWebNo(),
        BookingWebDate: "",
        BookingWebTime: "",
        FromCity: "",
        ToCity: "",
        ConsignorAccount: "",
        ConsigneeAccount: "",
        ItemName: "",
        BillNo: "",
        BillValue: 0,
        Quantity: 0,
        PaymentType: "ToPay",
        Status: "Pending Conversion",
        Remarks: "",
      };
    },

    openAddWebBooking() {
      this.openEntryPage("/DMSBookingWebView?mode=add", "New Booking Web");
    },

    editWebBooking(row) {
      this.openEntryPage(
        `/DMSBookingWebView?mode=edit&webId=${row.BookingWebId}`,
        `Booking Web ${row.BookingWebNo || ""}`.trim()
      );
    },

    convertToBooking() {
      this.$q.notify({
        message: "Convert to Booking — not yet wired to DMSBooking.vue",
        color: "info",
        position: "top",
      });
    },

    async saveWebBooking() {
      if (!this.form.FromCity || !this.form.ToCity) {
        this.$q.notify({
          message: "From City and To City are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveWebBooking({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Booking Web saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadWebBookings();
      }
    },

    confirmDeleteWebBooking(row) {
      this.$q
        .dialog({
          title: "Delete Booking Web",
          message: `Delete web booking <b>${row.BookingWebNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteWebBooking(row.BookingWebId);
          this.$q.notify({
            message: "Booking Web deleted",
            color: "negative",
            position: "top",
          });
          this.loadWebBookings();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
