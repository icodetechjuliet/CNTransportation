<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Parcel Handling Charge</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="inventory_2" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredCharges.length }}
                </span>
                <span class="total-stat-label">Total Vouchers</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredCharges"
            :columns="tableColumns"
            row-key="PHChargeId"
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
                      @keyup.enter="loadCharges"
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
                      @click="loadCharges"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_ParcelHC m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddCharge"
                  />

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    style="width: 140px"
                    class="q-ml-sm"
                    @update:model-value="loadCharges"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="fromDate" mask="DD/MM/YYYY" color="black">
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
                    style="width: 140px"
                    class="q-ml-xs"
                    @update:model-value="loadCharges"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="toDate" mask="DD/MM/YYYY" color="black">
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
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadCharges"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-IsChargePaid="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value ? 'positive' : 'orange'"
                  :label="props.value ? 'Paid' : 'Unpaid'"
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
                  @click="editCharge(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteCharge(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.PHChargeId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="inventory_2" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.VoucherNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.VoucherDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="props.row.IsChargePaid ? 'positive' : 'orange'"
                    >
                      {{ props.row.IsChargePaid ? "Paid" : "Unpaid" }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.PHChargeId)
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
                    @click="editCharge(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteCharge(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.PHChargeId)"
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
                        <span class="mjc-detail-label">Payment Type</span>
                        <span class="mjc-detail-value">
                          {{ props.row.PaymentType || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Total Amount</span>
                        <span class="mjc-detail-value">
                          {{ props.row.TotalAmount || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Net Amount</span>
                        <span class="mjc-detail-value">
                          {{ props.row.NetAmount || "—" }}
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
// Parcel Handling Charge data/mock-"backend" now lives in its own module,
// src/data/bookingData.js (localStorage-backed, so add/edit/delete persist
// like a real DB) — every Booking-family page imports from there directly
// instead of from this page.
import {
  apiGetParcelCharges as apiGetCharges,
  apiSaveParcelCharge as apiSaveCharge,
  apiDeleteParcelCharge as apiDeleteCharge,
  apiGetParcelChargeById as apiGetChargeById,
  peekNextParcelChargeNo,
  MOCK_DATA_PARCEL_CHARGE as MOCK_DATA,
} from "src/data/bookingData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadCharges",
  name: "DMSParcelHandlingCharge",

  // Lets openAddCharge()/editCharge() open the full-page Add/Edit tab
  // (DMSParcelHandlingChargeView.vue) instead of the in-page popup.
  // `default: null` keeps this page working standalone (outside
  // DynamicTab.vue) by falling back to the old dialog — same convention as
  // DMSBBooking.vue.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      charges: [],
      filteredCharges: [],
      searchText: "",
      fromDate: "01/09/2026",
      toDate: "30/09/2026",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "VoucherNo",
          label: "Voucher No.",
          field: "VoucherNo",
          sortable: true,
        },
        {
          name: "VoucherDate",
          label: "Date",
          field: "VoucherDate",
          sortable: true,
        },
        {
          name: "BookingOfficeName",
          label: "Booking Office",
          field: "BookingOfficeName",
          sortable: true,
        },
        {
          name: "TotalAmount",
          label: "Total Amount",
          field: "TotalAmount",
          align: "right",
        },
        {
          name: "NetAmount",
          label: "Net Amount",
          field: "NetAmount",
          align: "right",
        },
        {
          name: "IsChargePaid",
          label: "Paid Status",
          field: "IsChargePaid",
          align: "center",
        },
      ],
    };
  },

  mounted() {
    this.loadCharges();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadCharges();
    },

    // VoucherDate is stored as a "DD/MM/YYYY" display string.
    parseDMY(value) {
      if (!value) return null;
      const [d, m, y] = value.split("/").map(Number);
      if (!d || !m || !y) return null;
      return new Date(y, m - 1, d);
    },

    async loadCharges() {
      const all = await apiGetCharges(this.searchText);
      const from = this.parseDMY(this.fromDate);
      const to = this.parseDMY(this.toDate);
      this.filteredCharges = all.filter((c) => {
        const d = this.parseDMY(c.VoucherDate);
        if (!d) return true;
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    },

    calcTDS() {
      const total = Number(this.form.TotalAmount) || 0;
      const pct = this.form.IsDeductTDS ? Number(this.form.TDSPCT) || 0 : 0;
      this.form.TDSAmount = this.form.IsDeductTDS
        ? Math.round((total * pct) / 100)
        : 0;
      this.form.NetAmount = total - this.form.TDSAmount;
    },

    nextVoucherNo() {
      return peekNextParcelChargeNo();
    },

    emptyForm() {
      return {
        PHChargeId: null,
        VoucherNo: this.nextVoucherNo(),
        VoucherDate: "",
        AccountName: "",
        BookingOfficeName: "",
        ReferenceNo: "",
        ReferenceDate: "",
        PaymentType: "Cash",
        IsBusEntry: false,
        IsTruckEntry: false,
        IsChargePaid: false,
        TotalAmount: 0,
        IsDeductTDS: false,
        TDSPCT: 0,
        TDSAmount: 0,
        NetAmount: 0,
        Remarks: "",
      };
    },

    openAddCharge() {
      this.openEntryPage(
        "/DMSParcelHandlingChargeView?mode=add",
        "New Parcel Handling Charge"
      );
    },

    editCharge(row) {
      this.openEntryPage(
        `/DMSParcelHandlingChargeView?mode=edit&chargeId=${row.PHChargeId}`,
        `Parcel Handling Charge ${row.VoucherNo || ""}`.trim()
      );
    },

    async saveCharge() {
      if (!this.form.AccountName) {
        this.$q.notify({
          message: "Account Name is required",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.calcTDS();
      const res = await apiSaveCharge({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Parcel Handling Charge saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadCharges();
      }
    },

    confirmDeleteCharge(row) {
      this.$q
        .dialog({
          title: "Delete Parcel Handling Charge",
          message: `Delete voucher <b>${row.VoucherNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteCharge(row.PHChargeId);
          this.$q.notify({
            message: "Parcel Handling Charge deleted",
            color: "negative",
            position: "top",
          });
          this.loadCharges();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
