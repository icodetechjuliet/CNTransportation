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
                    <q-item clickable v-close-popup @click="printBooking">
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
                  <q-checkbox v-model="form.IsDoorDelivery" label="Door Del." dense disable />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="D.D. Amt." v-model="form.DoorDeliveryAmt" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center">
                  <q-checkbox v-model="form.IsDoorCollection" label="Door Coll." dense disable />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Collection" v-model="form.DoorCollectionAmt" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center">
                  <q-checkbox v-model="form.HasOther" label="Other" dense disable />
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
                  <q-checkbox v-model="form.CashCredit" label="Cash Credit" dense disable />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center">
                  <q-checkbox v-model="form.PayReceived" label="Pay. Received" dense disable />
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
  </div>
</template>

<script>
import { apiGetBookingById } from "./DMSBBooking.vue";

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
    // empty menu.
    printBooking() {
      window.print();
    },
  },
};
</script>
