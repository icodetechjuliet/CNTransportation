<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office Commission</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="percent" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredCommissions.length }}
                </span>
                <span class="total-stat-label">Total Records</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredCommissions"
            :columns="tableColumns"
            row-key="CommissionId"
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
                      @keyup.enter="loadCommissions"
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
                      @click="loadCommissions"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_OfcCommission m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddCommission"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadCommissions"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editCommission(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCommission(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.CommissionId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="percent" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">
                        {{ props.row.BookingOfficeName }}
                      </span>
                      <span class="mjc-job-date">
                        {{ props.row.FromDate }} - {{ props.row.ToDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.CommissionId)
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
                    @click="editCommission(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteCommission(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.CommissionId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Account</span>
                        <span class="mjc-detail-value">
                          {{ props.row.AccountName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Item</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ItemName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Inward %</span>
                        <span class="mjc-detail-value">
                          {{ props.row.InwardCommissionRate || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Outward %</span>
                        <span class="mjc-detail-value">
                          {{ props.row.OutwardCommissionRate || "—" }}
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
// Booking Office Commission data/mock-"backend" now lives in its own
// module, src/data/bookingOfficeData.js (localStorage-backed, so
// add/edit/delete persist like a real DB) — every Booking Office-family
// page imports from there directly instead of from this page.
import {
  apiGetCommissions,
  apiSaveCommission,
  apiDeleteCommission,
  apiGetCommissionById,
  MOCK_DATA_BOOKING_OFFICE_COMMISSION as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadCommissions",
  name: "DMSBookingOfficeCommission",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      commissions: [],
      filteredCommissions: [],
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
          name: "BookingOfficeName",
          label: "Booking Office",
          field: "BookingOfficeName",
          sortable: true,
        },
        {
          name: "AccountName",
          label: "Account",
          field: "AccountName",
          sortable: true,
        },
        { name: "ItemName", label: "Item", field: "ItemName", sortable: true },
        { name: "FromDate", label: "From Date", field: "FromDate" },
        { name: "ToDate", label: "To Date", field: "ToDate" },
        {
          name: "InwardCommissionRate",
          label: "Inward Rate",
          field: "InwardCommissionRate",
          align: "center",
        },
        {
          name: "OutwardCommissionRate",
          label: "Outward Rate",
          field: "OutwardCommissionRate",
          align: "center",
        },
      ],
    };
  },

  mounted() {
    this.loadCommissions();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadCommissions();
    },

    async loadCommissions() {
      this.filteredCommissions = await apiGetCommissions(this.searchText);
    },

    emptyForm() {
      return {
        CommissionId: null,
        BookingOfficeName: "",
        AccountName: "",
        ItemName: "",
        FromDate: "",
        ToDate: "",
        InwardCommissionRate: 0,
        OutwardCommissionRate: 0,
        Remarks: "",
      };
    },

    openAddCommission() {
      this.openEntryPage(
        "/DMSBookingOfficeCommissionView?mode=add",
        "New Booking Office Commission"
      );
    },

    editCommission(row) {
      this.openEntryPage(
        `/DMSBookingOfficeCommissionView?mode=edit&commissionId=${row.CommissionId}`,
        `Commission ${row.BookingOfficeName || ""}`.trim()
      );
    },

    async saveCommission() {
      if (!this.form.BookingOfficeName || !this.form.AccountName) {
        this.$q.notify({
          message: "Booking Office and Account are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveCommission({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Commission saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadCommissions();
      }
    },

    confirmDeleteCommission(row) {
      this.$q
        .dialog({
          title: "Delete Commission",
          message: `Delete commission slab for <b>${row.BookingOfficeName}</b> / <b>${row.AccountName}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteCommission(row.CommissionId);
          this.$q.notify({
            message: "Commission deleted",
            color: "negative",
            position: "top",
          });
          this.loadCommissions();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
