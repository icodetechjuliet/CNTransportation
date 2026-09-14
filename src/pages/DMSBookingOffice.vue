<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="store" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredOffices.length }}
                </span>
                <span class="total-stat-label">Total Offices</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredOffices"
            :columns="tableColumns"
            row-key="BookingOfficeId"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
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
                      @keyup.enter="loadOffices"
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
                      @click="loadOffices"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <!-- Same "add_new_*" gradient-chip CSS family the Booking
                       pages use (see dms-booking-page-pattern skill) — text
                       comes entirely from the ".add_new_Master" class's
                       ::after rule in cn-style.css, so no `label` prop here
                       (passing one would double up the text, same trap as
                       add_new_job). -->
                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_Master m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddOffice"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadOffices"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-IsActive="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value ? 'positive' : 'grey'"
                  :label="props.value ? 'Active' : 'Inactive'"
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
                  @click="editOffice(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteOffice(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.BookingOfficeId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="store" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">
                        {{ props.row.BookingOfficeName }}
                      </span>
                      <span class="mjc-job-date">
                        {{ props.row.BookingOfficeCode }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="props.row.IsActive ? 'positive' : 'grey'"
                    >
                      {{ props.row.IsActive ? "Active" : "Inactive" }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.BookingOfficeId)
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
                    @click="editOffice(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteOffice(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="
                      expandedMobileCards.includes(props.row.BookingOfficeId)
                    "
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">City</span>
                        <span class="mjc-detail-value">
                          {{ props.row.CityName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Phone</span>
                        <span class="mjc-detail-value">
                          {{ props.row.PhoneNo || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Contact</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ContactPersonName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Commission %</span>
                        <span class="mjc-detail-value">
                          {{ props.row.DefaultCommission || "—" }}
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
// Booking Office data/mock-"backend" now lives in its own module,
// src/data/bookingOfficeData.js (localStorage-backed, so add/edit/delete
// persist like a real DB) — every Booking Office-family page imports from
// there directly instead of from this page.
import {
  apiGetOffices,
  apiSaveOffice,
  apiDeleteOffice,
  apiGetOfficeById,
  MOCK_DATA_BOOKING_OFFICE as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadOffices",
  name: "DMSBookingOffice",

  // Lets openAddOffice()/editOffice() open the full-page Add/Edit tab
  // (DMSBookingOfficeView.vue) instead of the in-page popup. `default: null`
  // keeps this page working standalone (outside DynamicTab.vue) by falling
  // back to the old dialog — same convention as DMSBBooking.vue.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      offices: [],
      filteredOffices: [],
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
          name: "BookingOfficeCode",
          label: "Code",
          field: "BookingOfficeCode",
          sortable: true,
        },
        {
          name: "BookingOfficeName",
          label: "Booking Office",
          field: "BookingOfficeName",
          sortable: true,
        },
        { name: "CityName", label: "City", field: "CityName", sortable: true },
        {
          name: "BookingOfficeType",
          label: "Type",
          field: "BookingOfficeType",
        },
        { name: "PhoneNo", label: "Phone", field: "PhoneNo" },
        {
          name: "DefaultCommission",
          label: "Commission %",
          field: "DefaultCommission",
          align: "center",
        },
        {
          name: "IsActive",
          label: "Status",
          field: "IsActive",
          align: "center",
        },
      ],
    };
  },

  mounted() {
    this.loadOffices();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadOffices();
    },

    async loadOffices() {
      this.filteredOffices = await apiGetOffices(this.searchText);
    },

    emptyForm() {
      return {
        BookingOfficeId: null,
        BookingOfficeName: "",
        PrintName: "",
        BookingOfficeCode: "",
        AccountName: "",
        Address: "",
        CityName: "",
        StateName: "",
        Pincode: "",
        PhoneNo: "",
        MobileNo: "",
        Email: "",
        ContactPersonName: "",
        ContactPersonPhoneNo: "",
        BookingOfficeType: "Own Branch",
        TDSPCT: 0,
        DefaultCommission: 0,
        Remarks: "",
        IsActive: true,
        IsAgent: false,
        IsDeductTDS: false,
      };
    },

    openAddOffice() {
      this.openEntryPage(
        "/DMSBookingOfficeView?mode=add",
        "New Booking Office"
      );
    },

    editOffice(row) {
      this.openEntryPage(
        `/DMSBookingOfficeView?mode=edit&officeId=${row.BookingOfficeId}`,
        `Booking Office ${row.BookingOfficeName || ""}`.trim()
      );
    },

    async saveOffice() {
      if (!this.form.BookingOfficeName) {
        this.$q.notify({
          message: "Booking Office Name is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveOffice({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Booking Office saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadOffices();
      }
    },

    confirmDeleteOffice(row) {
      this.$q
        .dialog({
          title: "Delete Booking Office",
          message: `Delete booking office <b>${row.BookingOfficeName}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteOffice(row.BookingOfficeId);
          this.$q.notify({
            message: "Booking Office deleted",
            color: "negative",
            position: "top",
          });
          this.loadOffices();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
