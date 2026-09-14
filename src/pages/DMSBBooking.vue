<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <!-- ── Header row (title + total count) — same shape as
               JobDetailsGrid.vue's header; no in-page breadcrumb, since the
               open tab above this page already shows which module/menu it
               belongs to. ── -->
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">BBooking</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredBookings.length }}
                </span>
                <span class="total-stat-label">Total Bookings</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid ── -->
          <q-table
            square
            :rows="filteredBookings"
            :columns="tableColumns"
            row-key="BookingId"
            :visible-columns="visibleColumns"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
            card-class="text-black"
            :grid="$q.screen.lt.sm"
          >
            <template v-slot:top="props">
              <div class="tb-app col">
                <div class="filter-bar-wrapper accent-filter-bar">
                  <!-- Search combo — matches JobDetailsGrid style -->
                  <div class="search-combo-wrapper">
                    <input
                      v-model="searchText"
                      class="search-combo-input"
                      placeholder="Search Any"
                      @keyup.enter="loadBookings"
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
                      @click="loadBookings"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    v-if="canAddEdit"
                    flat
                    dense
                    no-caps
                    class="add_new_booking m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddBooking"
                  />

                  <q-select
                    square=""
                    v-model="direction"
                    :options="['All', 'Outward', 'Inward']"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="width: 110px"
                    class="q-mx-xs"
                    @update:model-value="loadBookings"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadBookings"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />

                  <q-btn
                    flat
                    dense
                    icon="tune"
                    label="Columns"
                    class="filter-btn bg-blue-300 bdr-blue-2 q-mx-sm"
                  >
                    <q-menu
                      anchor="bottom right"
                      self="top right"
                      :offset="[0, 8]"
                      class="column-filter-menu"
                    >
                      <div class="menu-header">Columns</div>
                      <q-separator />
                      <q-list class="column-list">
                        <q-item
                          v-for="col in columnOptions"
                          :key="col.name"
                          clickable
                          v-ripple
                          @click="toggleColumn(col.name)"
                          class="column-item"
                        >
                          <q-item-section avatar>
                            <q-checkbox
                              :model-value="isChecked(col.name)"
                              @update:model-value="toggleColumn(col.name)"
                              @click.stop
                            />
                          </q-item-section>
                          <q-item-section>{{ col.label }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>

                  <q-btn
                    flat
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
                    @click="props.toggleFullscreen"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                  />
                </div>
              </div>
            </template>

            <template v-slot:pagination>
              <q-pagination
                v-model="pagination.page"
                direction-links
                :max="maxPages"
                :max-pages="10"
                boundary-links
                boundary-numbers
                color="blue"
                size="md"
                dense
                @update:model-value="handlePageChange"
              />
              <span class="q-ml-md">
                Page {{ pagination.page }} of {{ maxPages }}
              </span>
            </template>

            <!-- ── Desktop column slots ── -->
            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value === 'Delivered' ? 'positive' : 'orange'"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-DeliveryType="props">
              <q-td :props="props">
                <q-badge
                  v-if="props.value === 'Door Delivery'"
                  color="orange-6"
                  :label="props.value"
                />
                <span v-else>{{ props.value }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-PaymentType="props">
              <q-td :props="props">
                <q-badge
                  :color="paymentColor(props.value)"
                  :label="props.value"
                  outline
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-eye"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style vw"
                  @click="viewBooking(props.row)"
                >
                  <q-tooltip>View</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="canAddEdit"
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editBooking(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <!-- ── Mobile card (grid mode) — reuses the global
                 .mobile-job-card/.mjc-* pattern (cn-style.css) already
                 established by JobDetailsGrid.vue's own mobile card list
                 and by DMSBooking.vue, instead of this page's own former
                 .mobile-job-card markup/classes. ── -->
            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.BookingId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="local_shipping" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.BookingDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="
                        props.row.Status === 'Delivered' ? 'positive' : 'orange'
                      "
                    >
                      {{ props.row.Status }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.BookingId)
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
                    icon="fa-solid fa-eye"
                    label="View"
                    class="mjc-btn mjc-btn-view"
                    @click="viewBooking(props.row)"
                  />
                  <q-btn
                    v-if="canAddEdit"
                    dense
                    unelevated
                    icon="fa-solid fa-pen-to-square"
                    label="Edit"
                    class="mjc-btn mjc-btn-edit"
                    @click="editBooking(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.BookingId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Delivery Type</span>
                        <span class="mjc-detail-value">
                          {{ props.row.DeliveryType || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Payment</span>
                        <span class="mjc-detail-value">
                          {{ props.row.PaymentType || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Route</span>
                        <span class="mjc-detail-value">
                          {{ props.row.FromCity }} → {{ props.row.ToCity }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">From</span>
                        <span class="mjc-detail-value">
                          {{ maskName(props.row.ConsignorName) }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">To</span>
                        <span class="mjc-detail-value">
                          {{ maskName(props.row.ConsigneeName) }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Carrier</span>
                        <span class="mjc-detail-value">
                          {{ props.row.LoadCarrier || "—" }}
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
    <q-dialog
      v-model="showPrintDialog"
      maximized
      @before-hide="closePrintDialog"
    >
      <q-card style="display: flex; flex-direction: column; height: 100%">
        <q-toolbar class="bg-primary text-white">
          <q-icon name="receipt_long" size="22px" class="q-mr-sm" />
          <q-toolbar-title>Booking Report Preview</q-toolbar-title>
          <q-btn
            unelevated
            icon="picture_as_pdf"
            label="Download PDF"
            color="white"
            text-color="primary"
            size="sm"
            class="q-mr-sm"
            no-caps
            @click="downloadPDF"
          />
          <q-btn flat round icon="close" @click="closePrintDialog" />
        </q-toolbar>
        <iframe
          ref="reportFrame"
          :src="printBlobUrl"
          style="flex: 1; border: none; width: 100%; background: #f4f4f4"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import entryNavigation from "src/mixins/entryNavigation.js";
import html2pdf from "html2pdf.js";
import ictLogoUrl from "src/assets/ICT-logo.png";

import {
  apiGetBookings,
  apiGetBookingById,
  apiSaveBooking,
  MOCK_DATA_BOOKING as MOCK_DATA,
} from "src/data/bookingData.js";

// Booking data/mock-"backend" now lives in its own module,
// src/data/bookingData.js (localStorage-backed, so add/edit/delete persist
// like a real DB) — every Booking-family page imports from there directly
// instead of from this page.

// ─────────────────────────────────────────────
export default {
  mixins: [entryNavigation],
  entryReload: "loadBookings",
  name: "DMSBBooking",

  // Lets the eye icon open the read-only booking view as a new full-page
  // dynamic tab (see viewBooking() below) instead of the in-page popup.
  // `default: null` keeps this page working standalone (outside DynamicTab.vue)
  // by falling back to the old popup.
  inject: {
    openTab: { default: null },
  },

  data() {
    // Fixed — this page is only ever the "BBooking" list now (see the
    // separate DMSBooking.vue / DMSTruckBooking.vue pages for those modes).
    return {
      bookings: [],
      filteredBookings: [],
      fromDate: "2026-04-01",
      toDate: "2027-03-31",
      direction: "All",
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      // Tracks which mobile job-cards (global .mobile-job-card/.mjc-*
      // pattern — see toggleMobileCard()) are expanded, same as
      // JobDetailsGrid.vue's / DMSBooking.vue's own mobile card list.
      expandedMobileCards: [],

      showBookingDialog: false,
      dialogMode: "view",
      form: this.emptyForm(),

      showPrintDialog: false,
      printBlobUrl: null,
      printIncludeFreight: false,

      mockData: MOCK_DATA,

      visibleColumns: [
        "action",
        "Status",
        "DeliveryType",
        "BookingMadeBy",
        "BookingNo",
        "BookingDate",
        "BookingTime",
        "LoadCarrier",
        "ToCity",
        "DeliveryCity",
        "ConsigneeName",
        "ConsignorName",
        "FromCity",
        "PaymentType",
      ],

      baseColumns: [
        {
          name: "action",
          label: "Action",
          field: "action",
        },
        {
          name: "Status",
          label: "Status",
          field: "Status",
          align: "center",
          sortable: true,
        },
        {
          name: "DeliveryType",
          label: "Delivery Type",
          field: "DeliveryType",
          sortable: true,
        },
        {
          name: "BookingMadeBy",
          label: "Booking Made",
          field: "BookingMadeBy",
        },
        {
          name: "BookingNo",
          label: "Booking No.",
          field: "BookingNo",
          sortable: true,
        },
        {
          name: "BookingDate",
          label: "Date",
          field: "BookingDate",
          sortable: true,
        },
        { name: "BookingTime", label: "Time", field: "BookingTime" },
        { name: "LoadCarrier", label: "Load Carrier", field: "LoadCarrier" },
        { name: "ToCity", label: "To City", field: "ToCity", sortable: true },
        { name: "DeliveryCity", label: "Delivery City", field: "DeliveryCity" },
        {
          name: "ConsigneeName",
          label: "To Party (Consignee)",
          field: "ConsigneeName",
          sortable: true,
        },
        {
          name: "ConsignorName",
          label: "From Party (Consignor)",
          field: "ConsignorName",
          sortable: true,
        },
        {
          name: "FromCity",
          label: "From City",
          field: "FromCity",
          sortable: true,
        },
        {
          name: "PaymentType",
          label: "Payment Type",
          field: "PaymentType",
          align: "center",
        },
      ],
    };
  },

  computed: {
    // BBooking is a permanently read-only list — there is no edit mode.
    canAddEdit() {
      return false;
    },

    tableColumns() {
      return this.baseColumns;
    },

    dialogCarrierOptions() {
      return ["Own", "Truck", "Air"];
    },

    columnOptions() {
      return [{ name: "all", label: "Select All" }, ...this.baseColumns];
    },

    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredBookings.length / rows));
    },
  },

  mounted() {
    this.loadBookings();
  },

  methods: {
    // Same expand/collapse toggle as JobDetailsGrid.vue's / DMSBooking.vue's
    // mobile card list (the global .mobile-job-card/.mjc-* pattern this
    // page's mobile view now reuses instead of its own invented
    // .dms-mobile-card markup).
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) {
        this.expandedMobileCards.push(id);
      } else {
        this.expandedMobileCards.splice(index, 1);
      }
    },

    maskName(name) {
      if (!name) return "";
      const words = String(name).trim().split(/\s+/);
      if (words.length <= 1) return words[0];
      if (words.length === 2) return `${words[0]} xxx ${words[1]}`;
      return `${words[0]} xxx ${words[words.length - 1]}`;
    },

    clearSearch() {
      this.searchText = "";
      this.loadBookings();
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    isChecked(col) {
      if (col === "all") {
        return this.visibleColumns.length === this.baseColumns.length;
      }
      return this.visibleColumns.includes(col);
    },

    toggleColumn(col) {
      if (col === "all") {
        // Toggle Select All: if all columns visible, deselect all (except
        // action); otherwise select all.
        if (this.visibleColumns.length === this.baseColumns.length) {
          this.visibleColumns = ["action"];
        } else {
          this.visibleColumns = this.baseColumns.map((c) => c.name);
        }
        return;
      }

      const index = this.visibleColumns.indexOf(col);
      if (index > -1) {
        this.visibleColumns.splice(index, 1);
      } else {
        this.visibleColumns.push(col);
      }
    },

    async loadBookings() {
      const result = await apiGetBookings(
        this.fromDate,
        this.toDate,
        this.direction,
        this.searchText
      );
      this.filteredBookings = result;
    },

    paymentColor(type) {
      const map = {
        TBBS: "blue",
        ToPay: "orange",
        Paid: "positive",
        TBBR: "purple",
        Cash: "teal",
      };
      return map[type] || "grey";
    },

    emptyForm() {
      return {
        BookingId: null,
        BookingType: "Outward",
        BookedFrom: "Greenland",
        Carrier: "Own",
        Load: "own",
        BookingNo: "",
        BookingDate: "01/04/2026",
        BookingTime: "",
        FromCity: "",
        FromBookingOffice: "Greenland",
        ConsignorAccount: "",
        ConsignorName: "",
        ConsignorPhone: "",
        FromAddress: "",
        FromGSTNo: "",
        EWayBillNo: "",
        BillNo: "",
        BillValue: 0,
        Item: "Box",
        PartNo: "",
        Quantity: 1,
        Weight: 0,
        Rate: 0,
        FreightAmount: 0,
        IsDoorDelivery: false,
        DoorDeliveryAmt: 0,
        IsDoorCollection: false,
        DoorCollectionAmt: 0,
        HasOther: false,
        OtherAmt: 0,
        STBy: "NoST",
        DiscountType: "Select Value",
        DiscountLeft: 0,
        Kasar: 0,
        OtherFreight: 0,
        OtherFreightAc: "Select Account",
        Remarks: "",
        DisplayRemarks: "",
        PaymentType: "TBBS (Paid Debit)",
        PaymentMode: "Select Payment",
        ToCity: "",
        DeliveryCity: "",
        ToBookingOffice: "",
        ConsigneeAccount: "",
        ConsigneeName: "",
        ConsigneePhone: "",
        ToAddress: "",
        ToGSTNo: "",
        LockDate: "",
        LockBy: "",
        taxType: "CGST_SGST",
        CGSTRate: 2.5,
        CGSTAmt: "0.00",
        SGSTRate: 2.5,
        SGSTAmt: "0.00",
        IGSTRate: 5,
        IGSTAmt: "0.00",
        ServiceTax: 0,
        TotalAmt: "0.00",
        TotalTax: "0.00",
        Discount: 0,
        NetAmt: "0.00",
        Received: 0,
        RefUser: "",
        CashCredit: false,
        PayReceived: false,
        PayReceivedDate: "",
        ReferenceNo: "",
        ReferenceDate: "",
        InvoiceNo: "",
        BankName: "",
        PrintDate: "",
        PrintBy: "",
        Count: 0,
      };
    },

    calcFreight() {
      const rate = parseFloat(this.form.Rate) || 0;
      const weight = parseFloat(this.form.Weight) || 0;
      this.form.FreightAmount = (rate * weight).toFixed(2);
      this.calcTotal();
    },

    calcTotal() {
      const freight = parseFloat(this.form.FreightAmount) || 0;
      const dd = this.form.IsDoorDelivery
        ? parseFloat(this.form.DoorDeliveryAmt) || 0
        : 0;
      const dc = this.form.IsDoorCollection
        ? parseFloat(this.form.DoorCollectionAmt) || 0
        : 0;
      const other = this.form.HasOther
        ? parseFloat(this.form.OtherAmt) || 0
        : 0;
      const total = freight + dd + dc + other;
      this.form.TotalAmt = total.toFixed(2);

      let tax = 0;
      if (this.form.taxType === "CGST_SGST") {
        const cgst = (total * (parseFloat(this.form.CGSTRate) || 0)) / 100;
        const sgst = (total * (parseFloat(this.form.SGSTRate) || 0)) / 100;
        this.form.CGSTAmt = cgst.toFixed(2);
        this.form.SGSTAmt = sgst.toFixed(2);
        this.form.IGSTAmt = "0.00";
        tax = cgst + sgst;
      } else {
        const igst = (total * (parseFloat(this.form.IGSTRate) || 0)) / 100;
        this.form.IGSTAmt = igst.toFixed(2);
        this.form.CGSTAmt = "0.00";
        this.form.SGSTAmt = "0.00";
        tax = igst;
      }
      this.form.TotalTax = tax.toFixed(2);
      const discount = parseFloat(this.form.Discount) || 0;
      this.form.NetAmt = (total + tax - discount).toFixed(2);
    },

    openAddBooking() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      if (this.entryPage) {
        this.showBookingDialog = true;
      } else {
        this.openEntryPage(
          `/DMSBBookingForm?mode=${this.dialogMode}&id=${
            this.form.BookingId || ""
          }`,
          "BBooking"
        );
      }
    },

    viewBooking(row) {
      // Full-page view, opened as its own dynamic tab (same pattern as the
      // rest of the app's job-form pages) instead of the popup dialog.
      if (this.openTab) {
        this.openTab(
          `/DMSBBookingView?bookingId=${row.BookingId}`,
          `BBooking ${row.BookingNo || ""}`.trim()
        );
        return;
      }
      // Fallback for when this page is rendered outside the DynamicTab shell
      // (e.g. direct route access) — keep the old popup behavior.
      this.viewBookingInDialog(row);
    },

    async viewBookingInDialog(row) {
      const data = await apiGetBookingById(row.BookingId);
      this.form = { ...data };
      this.dialogMode = "view";
      if (this.entryPage) {
        this.showBookingDialog = true;
      } else {
        this.openEntryPage(
          `/DMSBBookingForm?mode=${this.dialogMode}&id=${
            this.form.BookingId || ""
          }`,
          "BBooking"
        );
      }
    },

    async editBooking(row) {
      const data = await apiGetBookingById(row.BookingId);
      this.form = { ...data };
      this.dialogMode = "edit";
      if (this.entryPage) {
        this.showBookingDialog = true;
      } else {
        this.openEntryPage(
          `/DMSBBookingForm?mode=${this.dialogMode}&id=${
            this.form.BookingId || ""
          }`,
          "BBooking"
        );
      }
    },

    async saveBooking() {
      this.calcTotal();
      const res = await apiSaveBooking({ ...this.form });
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Booking saved!",
          color: "positive",
          position: "top",
        });
        this.showBookingDialog = false;
        this.notifyEntrySaved();
        await this.loadBookings();
      }
    },

    async saveAndCopy() {
      await this.saveBooking();
      const copy = { ...this.form, BookingId: null, BookingNo: "" };
      this.form = copy;
      this.dialogMode = "add";
      if (this.entryPage) {
        this.showBookingDialog = true;
      } else {
        this.openEntryPage(
          `/DMSBBookingForm?mode=${this.dialogMode}&id=${
            this.form.BookingId || ""
          }`,
          "BBooking"
        );
      }
    },

    async saveAndPrint(includeFreight = false) {
      this.calcTotal();
      const res = await apiSaveBooking({ ...this.form });
      if (res.success) {
        this.form = { ...res.data };
        this.$q.notify({
          message: "Saved!",
          color: "positive",
          position: "top",
        });
        this.printBooking(includeFreight);
      }
    },

    async printBooking(includeFreight) {
      this.printIncludeFreight = includeFreight;
      const logoDataUrl = await this.getLogoDataUrl();
      const html = this.buildReceiptHtml(includeFreight, logoDataUrl);
      const blob = new Blob([html], { type: "text/html" });
      if (this.printBlobUrl) URL.revokeObjectURL(this.printBlobUrl);
      this.printBlobUrl = URL.createObjectURL(blob);
      this.showPrintDialog = true;
    },

    async getLogoDataUrl() {
      try {
        const res = await fetch(ictLogoUrl);
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch {
        return "";
      }
    },

    downloadPDF() {
      if (!this.$refs.reportFrame) return;
      this.$refs.reportFrame.contentWindow.focus();
      this.$refs.reportFrame.contentWindow.print();
    },

    closePrintDialog() {
      this.showPrintDialog = false;
      setTimeout(() => {
        if (this.printBlobUrl) {
          URL.revokeObjectURL(this.printBlobUrl);
          this.printBlobUrl = null;
        }
      }, 500);
    },

    buildReceiptHtml(includeFreight, logoDataUrl = "") {
      const f = this.form;
      const deliveryType = f.IsDoorDelivery ? "Door Delivery" : "Ware House";

      // Tax rows (right-side charge table)
      let taxRows = "";
      if (f.taxType === "CGST_SGST") {
        if (Number(f.CGSTAmt) > 0)
          taxRows += `<tr><td class="lbl">CGST ${f.CGSTRate}%</td><td class="sep">:</td><td class="val">${f.CGSTAmt}</td></tr>`;
        if (Number(f.SGSTAmt) > 0)
          taxRows += `<tr><td class="lbl">SGST ${f.SGSTRate}%</td><td class="sep">:</td><td class="val">${f.SGSTAmt}</td></tr>`;
      } else {
        if (Number(f.IGSTAmt) > 0)
          taxRows += `<tr><td class="lbl">IGST ${f.IGSTRate}%</td><td class="sep">:</td><td class="val">${f.IGSTAmt}</td></tr>`;
      }

      const chargesBlock = includeFreight
        ? `
    <table class="kv-table">
      <tr><td class="lbl">Freight</td><td class="sep">:</td><td class="val">${
        f.FreightAmount || 0
      }</td></tr>
      ${
        f.IsDoorDelivery
          ? `<tr><td class="lbl">Door Delivery</td><td class="sep">:</td><td class="val">${
              f.DoorDeliveryAmt || 0
            }</td></tr>`
          : ""
      }
      ${
        f.IsDoorCollection
          ? `<tr><td class="lbl">Collection</td><td class="sep">:</td><td class="val">${
              f.DoorCollectionAmt || 0
            }</td></tr>`
          : ""
      }
      ${
        f.HasOther
          ? `<tr><td class="lbl">Other</td><td class="sep">:</td><td class="val">${
              f.OtherAmt || 0
            }</td></tr>`
          : ""
      }
      ${
        Number(f.OtherFreight) > 0
          ? `<tr><td class="lbl">Other Frgt.</td><td class="sep">:</td><td class="val">${f.OtherFreight}</td></tr>`
          : ""
      }
      <tr class="total-row"><td class="lbl">Total</td><td class="sep">:</td><td class="val">${
        f.TotalAmt || 0
      }</td></tr>
      ${taxRows}
      ${
        Number(f.TotalTax) > 0
          ? `<tr><td class="lbl">GST Total</td><td class="sep">:</td><td class="val">${f.TotalTax}</td></tr>`
          : ""
      }
      ${
        Number(f.Discount) > 0
          ? `<tr><td class="lbl">Discount</td><td class="sep">:</td><td class="val">${f.Discount}</td></tr>`
          : ""
      }
      <tr class="net-row"><td class="lbl">Net Amount</td><td class="sep">:</td><td class="val">${
        f.NetAmt || 0
      }</td></tr>
    </table>`
        : `<div class="no-amount-box">Amount Not Printed</div>`;

      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>LR – ${f.BookingNo || "NEW"}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:9pt;color:#000;padding:10px 14px;background:#fff}

  /* ── Header ── */
  .hdr{width:100%;border-collapse:collapse;margin-bottom:6px}
  .hdr-logo{width:150px;vertical-align:middle;padding-right:10px;text-align:left}
  .hdr-logo img{width:140px;height:auto;display:inline-block}
  .hdr-info{vertical-align:middle;text-align:center}
  .hdr-company{font-size:13pt;font-weight:bold;text-transform:uppercase;color:#0178bc;letter-spacing:.5px}
  .hdr-sub{font-size:8.5pt;color:#0178bc;letter-spacing:.3px;margin:1px 0 2px}
  .hdr-addr{font-size:8pt;color:#333;line-height:1.6}
  .hdr-contact{font-size:8pt;color:#333;margin-top:1px}

  /* ── Top band: L.R. No / City / Risk box ── */
  .top-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:0}
  .top-cell{display:table-cell;border:1px solid #000;padding:2px 5px;vertical-align:top}
  .top-cell-lr{width:33%}
  .top-cell-city{width:33%}
  .top-cell-risk{width:34%;text-align:center;vertical-align:middle}

  /* ── Consignor / Consignee band ── */
  .party-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;border-top:none;margin-bottom:0}
  .party-cell{display:table-cell;width:50%;border:1px solid #000;padding:4px 6px;vertical-align:top}

  /* ── Body: cargo + charges ── */
  .body-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;border-top:none;margin-bottom:0}
  .cargo-cell{display:table-cell;width:68%;border-right:1px solid #000;padding:4px 6px;vertical-align:top}
  .charges-cell{display:table-cell;width:32%;padding:4px 6px;vertical-align:top}

  /* ── E-Way Bill band ── */
  .eway-band{border:1px solid #000;border-top:none;padding:3px 6px}

  /* ── Label : Value table ── */
  table.kv-table{width:100%;border-collapse:collapse}
  table.kv-table td{padding:1px 2px;vertical-align:top}
  td.lbl{font-weight:700;white-space:nowrap;width:38%}
  td.sep{width:8px;font-weight:700}
  td.val{width:62%}
  .total-row td{border-top:1px solid #000;font-weight:700}
  .net-row td{border-top:2px solid #000;font-weight:700}

  /* ── Misc ── */
  .section-title{font-weight:bold;font-size:8pt;border-bottom:1px solid #ccc;margin-bottom:3px;padding-bottom:1px;color:#333;text-transform:uppercase;letter-spacing:.4px}
  .risk-text{font-size:8pt;font-weight:700;padding:2px 0;border:1px solid #000;margin-bottom:3px;display:block;text-align:center}
  .no-amount-box{text-align:center;padding:20px;font-style:italic;color:#666}

  /* ── Signature row ── */
  .sig-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;border-top:none}
  .sig-cell{display:table-cell;width:33.33%;border:1px solid #000;padding:30px 6px 4px;text-align:center;font-size:8pt}

  /* ── Footer ── */
  .footer-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;border-top:none}
  .footer-cell{display:table-cell;padding:2px 6px;font-size:8pt;border:1px solid #000}

  @media print{body{padding:0;margin:0}}
</style>
</head>
<body>

<!-- ── HEADER ── -->
<table class="hdr">
  <tr>
    <td class="hdr-logo">
      ${
        logoDataUrl
          ? `<img src="${logoDataUrl}" alt="iCode Technologies" />`
          : ""
      }
    </td>
    <td class="hdr-info">
      <div class="hdr-company">I CODE TECHNOLOGIES PVT LTD</div>
      <div class="hdr-sub">CargoNet &mdash; Cargo Management System</div>
      <div class="hdr-addr">23/7, CHRISTA KRUPA, 1ST CROSS, CSI COMPOUND, LALBAGH ROAD, BANGALORE - 560027, KARNATAKA, INDIA</div>
      <div class="hdr-contact">Tel: +91-80-25970728 &nbsp;|&nbsp; Email: INFO@ICODETECH.COM &nbsp;|&nbsp; Web: WWW.ICODETECH.COM</div>
    </td>
  </tr>
</table>

<!-- ── TOP BAND: L.R. No | City | Risk ── -->
<div class="top-band">
  <div class="top-cell top-cell-lr">
    <table class="kv-table">
      <tr><td class="lbl">L.R. No.</td><td class="sep">:</td><td class="val"><b>${
        f.BookingNo || ""
      }</b></td></tr>
      <tr><td class="lbl">L.R. Date</td><td class="sep">:</td><td class="val">${
        f.BookingDate || ""
      }</td></tr>
      ${
        f.BookingTime
          ? `<tr><td class="lbl">Time</td><td class="sep">:</td><td class="val">${f.BookingTime}</td></tr>`
          : ""
      }
    </table>
  </div>
  <div class="top-cell top-cell-city">
    <table class="kv-table">
      <tr><td class="lbl">To City</td><td class="sep">:</td><td class="val">${
        f.ToCity || ""
      }</td></tr>
      <tr><td class="lbl">From City</td><td class="sep">:</td><td class="val">${
        f.FromCity || ""
      }</td></tr>
    </table>
  </div>
  <div class="top-cell top-cell-risk">
    <span class="risk-text">Booked At Owner's Risk</span>
    <span class="risk-text">Goods Consignment Note</span>
  </div>
</div>

<!-- ── CONSIGNOR / CONSIGNEE BAND ── -->
<div class="party-band">
  <div class="party-cell">
    <table class="kv-table">
      <tr><td colspan="3"><b>Consignor :</b> ${f.ConsignorName || ""}</td></tr>
      <tr><td colspan="3" style="padding:2px 0 4px">${(
        f.FromAddress || ""
      ).replace(/\n/g, "<br>")}</td></tr>
      <tr><td class="lbl">GSTIN</td><td class="sep">:</td><td class="val">${
        f.FromGSTNo || ""
      }</td></tr>
      <tr><td class="lbl">Phone No</td><td class="sep">:</td><td class="val">${
        f.ConsignorPhone || ""
      }</td></tr>
    </table>
  </div>
  <div class="party-cell">
    <table class="kv-table">
      <tr><td colspan="3"><b>Consignee :</b> ${f.ConsigneeName || ""}</td></tr>
      <tr><td class="lbl" style="padding-top:1px">Bill To</td><td class="sep">:</td><td class="val">${
        f.ConsigneeName || ""
      }</td></tr>
      <tr><td colspan="3" style="padding:2px 0 4px">${(
        f.ToAddress || ""
      ).replace(/\n/g, "<br>")}</td></tr>
      <tr><td class="lbl">GSTIN</td><td class="sep">:</td><td class="val">${
        f.ToGSTNo || ""
      }</td></tr>
      <tr><td class="lbl">Phone No</td><td class="sep">:</td><td class="val">${
        f.ConsigneePhone || ""
      }</td></tr>
    </table>
  </div>
</div>

<!-- ── CARGO + CHARGES BAND ── -->
<div class="body-band">
  <div class="cargo-cell">
    <table class="kv-table">
      <tr>
        <td class="lbl">Item</td><td class="sep">:</td><td class="val">${
          f.Item || ""
        }</td>
      </tr>
      <tr>
        <td class="lbl">Part No</td><td class="sep">:</td><td class="val">${
          f.PartNo || ""
        }</td>
      </tr>
      <tr>
        <td class="lbl">Delivery Type</td><td class="sep">:</td><td class="val">${deliveryType}</td>
      </tr>
      <tr>
        <td class="lbl">Inv/Ch. No.</td><td class="sep">:</td><td class="val">${
          f.BillNo || ""
        }</td>
      </tr>
      <tr>
        <td class="lbl">Inv/Ch. Value</td><td class="sep">:</td><td class="val">${
          f.BillValue || ""
        }</td>
      </tr>
      <tr>
        <td class="lbl">Qty.</td><td class="sep">:</td><td class="val">${
          f.Quantity || ""
        }</td>
      </tr>
      <tr>
        <td class="lbl">Weight</td><td class="sep">:</td><td class="val">${
          f.Weight || ""
        }</td>
      </tr>
      ${
        includeFreight
          ? `<tr><td class="lbl">Rate</td><td class="sep">:</td><td class="val">${
              f.Rate || ""
            }</td></tr>`
          : ""
      }
      <tr>
        <td class="lbl">Payment Mode</td><td class="sep">:</td><td class="val">${
          f.PaymentMode || ""
        }</td>
      </tr>
      <tr>
        <td class="lbl">Payment Type</td><td class="sep">:</td><td class="val">${
          f.PaymentType || ""
        }</td>
      </tr>
      ${
        f.STBy && f.STBy !== "NoST"
          ? `<tr><td class="lbl">GST Payable By</td><td class="sep">:</td><td class="val">${f.STBy}</td></tr>`
          : ""
      }
      ${
        f.Remarks
          ? `<tr><td class="lbl">Remarks</td><td class="sep">:</td><td class="val">${f.Remarks}</td></tr>`
          : ""
      }
      ${
        f.DisplayRemarks
          ? `<tr><td class="lbl">Display Rem.</td><td class="sep">:</td><td class="val">${f.DisplayRemarks}</td></tr>`
          : ""
      }
    </table>
  </div>
  <div class="charges-cell">
    ${chargesBlock}
  </div>
</div>

<!-- ── E-WAY BILL BAND ── -->
<div class="eway-band">
  <table class="kv-table">
    <tr>
      <td class="lbl">E Way Bill No.</td>
      <td class="sep">:</td>
      <td class="val">${f.EWayBillNo || ""}</td>
    </tr>
  </table>
</div>

<!-- ── SIGNATURE BAND ── -->
<div class="sig-band">
  <div class="sig-cell">Consignor's Signature</div>
  <div class="sig-cell">${
    f.BookedFrom || "Eagle Logistics"
  }<br>Authorised Signatory</div>
  <div class="sig-cell">Consignee's Signature</div>
</div>

<!-- ── FOOTER ── -->
<div class="footer-band">
  <div class="footer-cell" style="width:40%">Print Dt.: <b>${new Date().toLocaleString()}</b></div>
  <div class="footer-cell" style="width:30%;text-align:center">Count: <b>${
    f.Count || 1
  }</b></div>
  <div class="footer-cell" style="width:30%;text-align:right">Print By: <b>${
    f.PrintBy || "Admin"
  }</b></div>
</div>

</body>
</html>`;
    },

    closeDialog() {
      this.showBookingDialog = false;
    },
  },
};
</script>
