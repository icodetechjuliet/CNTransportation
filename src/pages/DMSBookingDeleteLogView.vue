<template>
  <div>
    <!-- Same tabbed shape as DMSBBookingView.vue (General/Party/Charges),
         plus a 4th "Delete Info" tab for the delete-specific fields — this
         record mirrors nearly the whole Booking field set (a full snapshot
         taken at delete time), so it needs the tabs the way BBooking's
         View page does, unlike the shorter single-panel master pages. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking Delete Log</span>
              <span class="arrow_right_icon"><i class="fa fa-chevron-right"></i></span>
              <span class="header_text2">View</span>
            </div>
            <div class="header-field-group">
              <q-input square dense outlined bg-color="blue-1" readonly label="Booking No." v-model="form.BookingNo" />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input square dense outlined bg-color="blue-1" readonly label="Deleted By" v-model="form.DeleteUserName" />
            </div>
          </div>
        </div>

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
            <q-tab name="deleteinfo" label="Delete Info [4]" accesskey="4" />
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
                  <q-input square dense outlined bg-color="blue-1" readonly label="Carrier" v-model="form.Carrier" />
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
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Booking Date" v-model="form.BookingDate" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Booking Time" v-model="form.BookingTime" />
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
                  <q-input square dense outlined bg-color="blue-1" readonly label="Item" v-model="form.Item" />
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

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Total Tax" v-model="form.TotalTax" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Discount" v-model="form.Discount" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="yellow-1" readonly label="Net Amt." v-model="form.NetAmt" input-class="text-negative text-weight-bold" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Received" v-model="form.Received" />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Reference No." v-model="form.ReferenceNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Invoice No." v-model="form.InvoiceNo" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Remarks" v-model="form.Remarks" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Display Remarks" v-model="form.DisplayRemarks" />
                </div>
              </div>
            </q-tab-panel>

            <!-- Delete Info -->
            <q-tab-panel name="deleteinfo">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Deleted On" v-model="form.DeleteDate" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Deleted By" v-model="form.DeleteUserName" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input square dense outlined bg-color="blue-1" readonly label="Entry Type" v-model="form.EntryType" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="yellow-1"
                    readonly
                    type="textarea"
                    :rows="2"
                    autogrow
                    label="Delete Reason"
                    v-model="form.DeleteRemarks"
                    input-class="text-negative"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <!-- Prev/Next tab nav — same structure/classes as
               DMSBBookingView.vue's own tab-panel nav. -->
          <div class="q-pa-xs row justify-between tab-nav-buttons">
            <q-btn icon="chevron_left" class="Navtab" label="" flat :disable="tabIndex === 0" @click="goToPreviousTab" />
            <q-btn label="" icon-right="chevron_right" class="Navtab" flat :disable="tabIndex === tabOrder.length - 1" @click="goToNextTab" />
          </div>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { apiGetDeleteLogById } from "./DMSBookingDeleteLog.vue";

export default {
  name: "DMSBookingDeleteLogView",

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
      tabOrder: ["general", "party", "charges", "deleteinfo"],
      form: {},
    };
  },

  computed: {
    tabIndex() {
      return this.tabOrder.indexOf(this.activeTab);
    },
  },

  created() {
    this.loadLog();
  },

  methods: {
    goToPreviousTab() {
      if (this.tabIndex > 0) this.activeTab = this.tabOrder[this.tabIndex - 1];
    },
    goToNextTab() {
      if (this.tabIndex < this.tabOrder.length - 1) this.activeTab = this.tabOrder[this.tabIndex + 1];
    },

    async loadLog() {
      const id = Number(this.params && this.params.logId);
      this.loading = true;
      try {
        this.form = (await apiGetDeleteLogById(id)) || {};
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
