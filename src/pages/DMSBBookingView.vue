<template>
  <div>
    <!-- The global ".hide-overflow" class (cn-style.css) already carries
         "min-height: 0 !important", which overrides QPage's own forced
         min-height (the thing that was stretching this shorter,
         few-fields-per-tab page to fill the full viewport) — no per-page
         style-fn override needed. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <!-- ── Header — same two-column shape as JobCNFormDynamicTab.vue's
             job-form header: a white "header-style" bar with a left
             "header-inner" column (breadcrumb + read-only field boxes,
             flowing left-to-right right after the title — no q-space
             pushing them to the edge) and a separate right-aligned column
             for the Save/dropdown pair, matching that page's
             col-*-10 / col-*-2 split exactly instead of one flexed row. ── -->
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">BBooking</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text2">View</span>
            </div>
            <div class="header-field-group">
              <q-input square dense outlined bg-color="blue-1" readonly label="Booking No." v-model="form.BookingNo" />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input square dense outlined bg-color="blue-1" readonly label="Date" v-model="form.BookingDate" />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input square dense outlined bg-color="blue-1" readonly label="Carrier" v-model="form.Carrier" />
            </div>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
            <div class="row q-col-gutter-x-sm justify-end items-center">
              <!-- Save (+ dropdown) — same joined-pill shape AND behavior as
                   JobCNFormDynamicTab.vue's header actions: Save itself is
                   disabled (this view page has nothing to save), but the
                   dropdown caret stays live and opens, same as that page's
                   own :disable="tabsreadonly" convention only ever disables
                   Save, never the dropdown trigger. -->
              <div class="row items-center no-wrap desktop-actions-group">
                <q-btn
                  dense
                  unelevated
                  no-caps
                  icon="task_alt"
                  label="Save"
                  disable
                  class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-save-joined"
                />
                <q-btn-dropdown
                  dense
                  unelevated
                  no-caps
                  class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-more-joined"
                  content-class="desktop-actions-dropdown"
                >
                  <q-list class="desktop-actions-list">
                    <q-item
                      clickable
                      v-close-popup
                      class="desktop-actions-item"
                      @click="printBooking"
                    >
                      <q-item-section avatar>
                        <div class="action-icon-badge bg-export">
                          <q-icon name="print" color="white" />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Print</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Tabs — splits the ~50 read-only fields into the same
             "General Details / Party Details / Charge Details" grouping
             JobCNFormDynamicTab.vue uses, instead of one long scrolling
             grid. ── -->
        <q-card class="tabs-container">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-teal custom-tabs"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="general" label="General Details [1]" accesskey="1" />
            <q-tab name="party" label="Party Details [2]" accesskey="2" />
            <q-tab name="charges" label="Charge Details [3]" accesskey="3" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="activeTab" animated keep-alive>
            <q-inner-loading :showing="loading" color="primary" />

            <!-- General Details -->
            <q-tab-panel name="general">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Booking Type" v-model="form.BookingType" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Booked From" v-model="form.BookedFrom" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Load" v-model="form.Load" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Payment Type" v-model="form.PaymentType" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Mode" v-model="form.PaymentMode" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="From City" v-model="form.FromCity" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="To City" v-model="form.ToCity" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Delivery City" v-model="form.DeliveryCity" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="From Buk. Office" v-model="form.FromBookingOffice" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="To Buk. Office" v-model="form.ToBookingOffice" />
                </div>
              </div>
            </q-tab-panel>

            <!-- Party Details -->
            <q-tab-panel name="party">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Consignor A/c." v-model="form.ConsignorAccount" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Consignor Name" v-model="form.ConsignorName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Consignor Phone No." v-model="form.ConsignorPhone" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="From GST No." v-model="form.FromGSTNo" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <q-input square dense outlined bg-color="blue-1" readonly type="textarea" :rows="1" autogrow label="From Address" v-model="form.FromAddress" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <q-input square dense outlined bg-color="blue-1" readonly type="textarea" :rows="1" autogrow label="To Address" v-model="form.ToAddress" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Consignee A/c." v-model="form.ConsigneeAccount" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Consignee Name" v-model="form.ConsigneeName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Consignee Phone No." v-model="form.ConsigneePhone" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="To GST No." v-model="form.ToGSTNo" />
                </div>
              </div>
            </q-tab-panel>

            <!-- Charge / Tax Details -->
            <q-tab-panel name="charges">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="E-Way Bill No." v-model="form.EWayBillNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Bill No." v-model="form.BillNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Value" v-model="form.BillValue" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Total Amt." v-model="form.TotalAmt" input-class="text-negative text-weight-bold" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Lock Dt." v-model="form.LockDate" input-class="text-red text-weight-bold" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Lock By" v-model="form.LockBy" input-class="text-red" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Item" v-model="form.Item" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Part No." v-model="form.PartNo" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Quantity" v-model="form.Quantity" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Weight" v-model="form.Weight" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Rate" v-model="form.Rate" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Freight" v-model="form.FreightAmount" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.IsDoorDelivery" val="orange" color="orange" intermediate-icon="black" disable />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Door Del.</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="D.D. Amt." v-model="form.DoorDeliveryAmt" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.IsDoorCollection" val="orange" color="orange" intermediate-icon="black" disable />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Door Coll.</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Collection" v-model="form.DoorCollectionAmt" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.HasOther" val="orange" color="orange" intermediate-icon="black" disable />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Other</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Other Amt." v-model="form.OtherAmt" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="S.T. By" v-model="form.STBy" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Discount Type" v-model="form.DiscountType" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Discount" v-model="form.DiscountLeft" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Kasar" v-model="form.Kasar" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Other Frgt." v-model="form.OtherFreight" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Other Frgt. A/c." v-model="form.OtherFreightAc" />
                </div>

                <!-- CGST / SGST / IGST -->
                <template v-if="form.taxType === 'CGST_SGST'">
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input square dense outlined bg-color="blue-1" readonly label="CGST %" v-model="form.CGSTRate" />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input square dense outlined bg-color="blue-1" readonly label="CGST Amt." v-model="form.CGSTAmt" />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input square dense outlined bg-color="blue-1" readonly label="Service Tax" v-model="form.ServiceTax" />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input square dense outlined bg-color="blue-1" readonly label="SGST %" v-model="form.SGSTRate" />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input square dense outlined bg-color="blue-1" readonly label="SGST Amt." v-model="form.SGSTAmt" />
                  </div>
                </template>
                <template v-else>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input square dense outlined bg-color="blue-1" readonly label="IGST %" v-model="form.IGSTRate" />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input square dense outlined bg-color="blue-1" readonly label="IGST Amt." v-model="form.IGSTAmt" />
                  </div>
                </template>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Total Tax" v-model="form.TotalTax" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Discount" v-model="form.Discount" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Net Amt." v-model="form.NetAmt" input-class="text-negative text-weight-bold" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Received" v-model="form.Received" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Time" v-model="form.BookingTime" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Ref." v-model="form.RefUser" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.CashCredit" val="orange" color="orange" intermediate-icon="black" disable />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Cash Credit</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center">
                  <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                    <q-item-section avatar>
                      <q-checkbox dense v-model="form.PayReceived" val="orange" color="orange" intermediate-icon="black" disable />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Pay. Received</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Pay. Received Date" v-model="form.PayReceivedDate" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Reference No." v-model="form.ReferenceNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Reference Date" v-model="form.ReferenceDate" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Invoice No." v-model="form.InvoiceNo" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Bank Name" v-model="form.BankName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Remarks" v-model="form.Remarks" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Display Remarks" v-model="form.DisplayRemarks" />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <!-- Prev/Next tab nav — same structure/classes as
               JobCNFormDynamicTab.vue's own tab-panel nav
               ("q-pa-xs row justify-between tab-nav-buttons", confirmed via
               DevTools on the reference page), sitting inside this q-card
               right after q-tab-panels, chevrons pushed to the card's own
               left/right edges by "justify-between" — not the outer footer
               tab strip. -->
          <div class="q-pa-xs row justify-between tab-nav-buttons">
            <q-btn
              icon="chevron_left"
              class="Navtab"
              label=""
              flat
              :disable="tabIndex === 0"
              @click="goToPreviousTab"
            />
            <q-btn
              label=""
              icon-right="chevron_right"
              class="Navtab"
              flat
              :disable="tabIndex === tabOrder.length - 1"
              @click="goToNextTab"
            />
          </div>
        </q-card>
      </div>
    </q-page>

    <!-- ══════════════════════════════════════
         Print / PDF Preview Dialog
    ══════════════════════════════════════ -->
    <q-dialog v-model="showPrintDialog" maximized @before-hide="closePrintDialog">
      <q-card style="display: flex; flex-direction: column; height: 100%">
        <q-toolbar class="bg-primary text-white">
          <q-icon name="receipt_long" size="22px" class="q-mr-sm" />
          <q-toolbar-title>Booking Report Preview</q-toolbar-title>
          <q-btn unelevated icon="picture_as_pdf" label="Download PDF" color="white" text-color="primary" size="sm" class="q-mr-sm" no-caps @click="downloadPDF" />
          <q-btn flat round icon="close" @click="closePrintDialog" />
        </q-toolbar>
        <iframe ref="reportFrame" :src="printBlobUrl" style="flex: 1; border: none; width: 100%; background: #f4f4f4" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { apiGetBookingById } from "./DMSBBooking.vue";
import ictLogoUrl from "src/assets/ICT-logo.png";

export default {
  name: "DMSBBookingView",

  // Set by DynamicTab.vue's openTab() from the `?bookingId=...` query string
  // it's opened with — see viewBooking() in DMSBBooking.vue.
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      loading: true,
      activeTab: "general",
      tabOrder: ["general", "party", "charges"],
      form: {},
      showPrintDialog: false,
      printBlobUrl: null,
    };
  },

  computed: {
    tabIndex() {
      return this.tabOrder.indexOf(this.activeTab);
    },
  },

  created() {
    this.loadBooking();
  },

  methods: {
    goToPreviousTab() {
      if (this.tabIndex > 0) {
        this.activeTab = this.tabOrder[this.tabIndex - 1];
      }
    },
    goToNextTab() {
      if (this.tabIndex < this.tabOrder.length - 1) {
        this.activeTab = this.tabOrder[this.tabIndex + 1];
      }
    },
    async loadBooking() {
      const id = Number(this.params && this.params.bookingId);
      this.loading = true;
      try {
        this.form = (await apiGetBookingById(id)) || {};
      } finally {
        this.loading = false;
      }
    },

    // Only real action left in the header's Save-dropdown once Save itself
    // is disabled (view-only page) — mirrors the "Export PDF"/"Report" items
    // in JobCNFormDynamicTab.vue's own dropdown rather than shipping an
    // empty menu. Builds the same formatted LR receipt (blob + iframe) as
    // DMSBookingView.vue/DMSTruckBookingView.vue instead of a raw
    // window.print() of the on-screen tabs, for a consistent printout
    // across the whole booking family.
    async printBooking() {
      const logoDataUrl = await this.getLogoDataUrl();
      const html = this.buildReceiptHtml(false, logoDataUrl);
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

    // Identical to DMSBookingView.vue's own buildReceiptHtml() — each page
    // in this family keeps its own independent copy (see the
    // dms-booking-page-pattern skill's "copy, don't parametrize" note)
    // rather than sharing one across files. BBooking never prints with
    // freight, so includeFreight is always passed as false above.
    buildReceiptHtml(includeFreight, logoDataUrl = "") {
      const f = this.form;
      const deliveryType = f.IsDoorDelivery ? "Door Delivery" : "Ware House";

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

  .hdr{width:100%;border-collapse:collapse;margin-bottom:6px}
  .hdr-logo{width:150px;vertical-align:middle;padding-right:10px;text-align:left}
  .hdr-logo img{width:140px;height:auto;display:inline-block}
  .hdr-info{vertical-align:middle;text-align:center}
  .hdr-company{font-size:13pt;font-weight:bold;text-transform:uppercase;color:#0178bc;letter-spacing:.5px}
  .hdr-sub{font-size:8.5pt;color:#0178bc;letter-spacing:.3px;margin:1px 0 2px}
  .hdr-addr{font-size:8pt;color:#333;line-height:1.6}
  .hdr-contact{font-size:8pt;color:#333;margin-top:1px}

  .top-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:0}
  .top-cell{display:table-cell;border:1px solid #000;padding:2px 5px;vertical-align:top}
  .top-cell-lr{width:33%}
  .top-cell-city{width:33%}
  .top-cell-risk{width:34%;text-align:center;vertical-align:middle}

  .party-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;border-top:none;margin-bottom:0}
  .party-cell{display:table-cell;width:50%;border:1px solid #000;padding:4px 6px;vertical-align:top}

  .body-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;border-top:none;margin-bottom:0}
  .cargo-cell{display:table-cell;width:68%;border-right:1px solid #000;padding:4px 6px;vertical-align:top}
  .charges-cell{display:table-cell;width:32%;padding:4px 6px;vertical-align:top}

  .eway-band{border:1px solid #000;border-top:none;padding:3px 6px}

  table.kv-table{width:100%;border-collapse:collapse}
  table.kv-table td{padding:1px 2px;vertical-align:top}
  td.lbl{font-weight:700;white-space:nowrap;width:38%}
  td.sep{width:8px;font-weight:700}
  td.val{width:62%}
  .total-row td{border-top:1px solid #000;font-weight:700}
  .net-row td{border-top:2px solid #000;font-weight:700}

  .risk-text{font-size:8pt;font-weight:700;padding:2px 0;border:1px solid #000;margin-bottom:3px;display:block;text-align:center}
  .no-amount-box{text-align:center;padding:20px;font-style:italic;color:#666}

  .sig-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;border-top:none}
  .sig-cell{display:table-cell;width:33.33%;border:1px solid #000;padding:30px 6px 4px;text-align:center;font-size:8pt}

  .footer-band{display:table;width:100%;border-collapse:collapse;border:1px solid #000;border-top:none}
  .footer-cell{display:table-cell;padding:2px 6px;font-size:8pt;border:1px solid #000}

  @page{size:A4;margin:10mm}
  @media print{
    body{padding:0;margin:0}
    .top-band,.party-band,.body-band,.eway-band,.sig-band,.footer-band{page-break-inside:avoid}
  }
</style>
</head>
<body>

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

<div class="eway-band">
  <table class="kv-table">
    <tr>
      <td class="lbl">E Way Bill No.</td>
      <td class="sep">:</td>
      <td class="val">${f.EWayBillNo || ""}</td>
    </tr>
  </table>
</div>

<div class="sig-band">
  <div class="sig-cell">Consignor's Signature</div>
  <div class="sig-cell">${
    f.BookedFrom || "Eagle Logistics"
  }<br>Authorised Signatory</div>
  <div class="sig-cell">Consignee's Signature</div>
</div>

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
  },
};
</script>
