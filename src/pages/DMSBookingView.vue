<template>
  <div>
    <!-- The global ".hide-overflow" class (cn-style.css) already carries
         "min-height: 0 !important", which overrides QPage's own forced
         min-height — no per-page style-fn override needed. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <!-- ── Header — same two-column shape as DMSBBookingView.vue /
             JobCNFormDynamicTab.vue's job-form header. Unlike BBookingView
             (permanently read-only), Save is live here whenever the record
             isn't just being viewed. ── -->
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">Booking</span>
              <span class="arrow_right_icon">
                <i class="fa fa-chevron-right"></i>
              </span>
              <span class="header_text2">{{ modeLabel }}</span>
            </div>
            <div class="header-field-group">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                readonly
                label="Booking No."
                v-model="form.BookingNo"
              />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                readonly
                label="Date"
                v-model="form.BookingDate"
              />
            </div>
            <div class="header-field-group header-field-group-sm">
              <q-input
                square
                dense
                outlined
                bg-color="blue-1"
                readonly
                label="Carrier"
                v-model="form.Carrier"
              />
            </div>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
            <div class="row q-col-gutter-x-sm justify-end items-center">
              <!-- Save (+ dropdown) — same joined-pill shape as
                   DMSBBookingView.vue's header actions, except Save is live
                   (not disabled) whenever this record is editable. -->
              <div class="row items-center no-wrap desktop-actions-group">
                <q-btn
                  dense
                  unelevated
                  no-caps
                  icon="task_alt"
                  label="Save"
                  :disable="dialogMode === 'view'"
                  class="desktop-action-btn bg-green-white bdr-green text-dgreen desktop-action-save-joined"
                  @click="saveBooking"
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
                      v-if="dialogMode !== 'view'"
                      clickable
                      v-close-popup
                      class="desktop-actions-item"
                      @click="saveAndCopy"
                    >
                      <q-item-section avatar>
                        <div class="action-icon-badge bg-export">
                          <q-icon name="content_copy" color="white" />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Save &amp; Copy</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="dialogMode !== 'view'"
                      clickable
                      v-close-popup
                      class="desktop-actions-item"
                      @click="saveAndPrint(false)"
                    >
                      <q-item-section avatar>
                        <div class="action-icon-badge bg-export">
                          <q-icon name="print" color="white" />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Save &amp; Print</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="dialogMode !== 'view'"
                      clickable
                      v-close-popup
                      class="desktop-actions-item"
                      @click="saveAndPrint(true)"
                    >
                      <q-item-section avatar>
                        <div class="action-icon-badge bg-export">
                          <q-icon name="receipt_long" color="white" />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          Save &amp; Print with Freight
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      class="desktop-actions-item"
                      @click="printBooking(false)"
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

        <!-- ── Tabs — same "General Details / Party Details / Charge
             Details" grouping as DMSBBookingView.vue. ── -->
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
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Booking Type"
                    v-model="form.BookingType"
                    :options="['Outward', 'Inward']"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Booked From"
                    v-model="form.BookedFrom"
                    :options="mockData.bookingOffices"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Carrier"
                    v-model="form.Carrier"
                    :options="['Own', 'Truck', 'Air']"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Load"
                    v-model="form.Load"
                    :options="['own', 'Truck', 'Part']"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square=""
                    label="Booking No."
                    v-model="form.BookingNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square=""
                    label="Date"
                    v-model="form.BookingDate"
                    dense
                    outlined
                    bg-color="blue-1"
                    placeholder="dd/mm/yyyy"
                    :readonly="dialogMode === 'view'"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        v-if="dialogMode !== 'view'"
                      >
                        <q-popup-proxy
                          ref="bookingDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="form.BookingDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.bookingDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Payment Type"
                    v-model="form.PaymentType"
                    :options="[
                      'TBBS (Paid Debit)',
                      'ToPay',
                      'Paid',
                      'TBBR',
                      'Cash',
                    ]"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Mode"
                    v-model="form.PaymentMode"
                    :options="[
                      'Select Payment',
                      'Cash',
                      'Cheque',
                      'NEFT',
                      'UPI',
                    ]"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="From City"
                    v-model="form.FromCity"
                    :options="mockData.cities"
                    dense
                    outlined
                    bg-color="blue-1"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="To City"
                    v-model="form.ToCity"
                    :options="mockData.cities"
                    dense
                    outlined
                    bg-color="blue-1"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Delivery City"
                    v-model="form.DeliveryCity"
                    :options="mockData.cities"
                    dense
                    outlined
                    bg-color="blue-1"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="From Buk. Office"
                    v-model="form.FromBookingOffice"
                    :options="mockData.bookingOffices"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="To Buk. Office"
                    v-model="form.ToBookingOffice"
                    :options="mockData.bookingOffices"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- Party Details -->
            <q-tab-panel name="party">
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Consignor A/c."
                    v-model="form.ConsignorAccount"
                    :options="mockData.parties"
                    dense
                    outlined
                    bg-color="blue-1"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square=""
                    label="Consignor Name"
                    v-model="form.ConsignorName"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square=""
                    label="Phone No."
                    v-model="form.ConsignorPhone"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square=""
                    label="From GST No."
                    v-model="form.FromGSTNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-6">
                  <q-input
                    square=""
                    label="From Address"
                    v-model="form.FromAddress"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="textarea"
                    :rows="2"
                    autogrow
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input
                    square=""
                    label="To Address"
                    v-model="form.ToAddress"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="textarea"
                    :rows="2"
                    autogrow
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square=""
                    label="Consignee A/c."
                    v-model="form.ConsigneeAccount"
                    :options="mockData.parties"
                    dense
                    outlined
                    bg-color="blue-1"
                    use-input
                    fill-input
                    display-value=""
                    input-debounce="0"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square=""
                    label="Consignee Name"
                    v-model="form.ConsigneeName"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square=""
                    label="Phone No."
                    v-model="form.ConsigneePhone"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square=""
                    label="To GST No."
                    v-model="form.ToGSTNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- Charge / Tax Details -->
            <q-tab-panel name="charges">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="E-Way Bill No."
                    v-model="form.EWayBillNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Bill No."
                    v-model="form.BillNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Value"
                    v-model="form.BillValue"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square=""
                    label="Item"
                    v-model="form.Item"
                    :options="[
                      'Box',
                      'Parcel',
                      'Pallet',
                      'Crate',
                      'Drum',
                      'Kp',
                      'pallate',
                    ]"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Part No."
                    v-model="form.PartNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Quantity"
                    v-model="form.Quantity"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                    @update:model-value="calcTotal"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Weight"
                    v-model="form.Weight"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                    @update:model-value="calcFreight"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Rate"
                    v-model="form.Rate"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                    @update:model-value="calcFreight"
                  />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Freight"
                    v-model="form.FreightAmount"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    readonly
                  />
                </div>
                <div
                  class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center"
                >
                  <q-item
                    tag="label"
                    v-ripple
                    bg-color="blue-1"
                    class="chckbx-style full-width"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        dense
                        v-model="form.IsDoorDelivery"
                        val="orange"
                        color="orange"
                        intermediate-icon="black"
                        :disable="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Door Del.</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="D.D. Amt."
                    v-model="form.DoorDeliveryAmt"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view' || !form.IsDoorDelivery"
                    @update:model-value="calcTotal"
                  />
                </div>
                <div
                  class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center"
                >
                  <q-item
                    tag="label"
                    v-ripple
                    bg-color="blue-1"
                    class="chckbx-style full-width"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        dense
                        v-model="form.IsDoorCollection"
                        val="orange"
                        color="orange"
                        intermediate-icon="black"
                        :disable="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Door Coll.</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Collection"
                    v-model="form.DoorCollectionAmt"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view' || !form.IsDoorCollection"
                    @update:model-value="calcTotal"
                  />
                </div>
                <div
                  class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center"
                >
                  <q-item
                    tag="label"
                    v-ripple
                    bg-color="blue-1"
                    class="chckbx-style full-width"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        dense
                        v-model="form.HasOther"
                        val="orange"
                        color="orange"
                        intermediate-icon="black"
                        :disable="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Other</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Other Amt."
                    v-model="form.OtherAmt"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view' || !form.HasOther"
                    @update:model-value="calcTotal"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square=""
                    label="S.T. By"
                    v-model="form.STBy"
                    :options="['NoST', 'Consignor', 'Consignee', 'Agent']"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square=""
                    label="Discount Type"
                    v-model="form.DiscountType"
                    :options="['Select Value', '%', 'Fixed']"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Discount"
                    v-model="form.DiscountLeft"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Kasar"
                    v-model="form.Kasar"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Other Frgt."
                    v-model="form.OtherFreight"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-select
                    square=""
                    label="Other Frgt. A/c."
                    v-model="form.OtherFreightAc"
                    :options="['Select Account', ...mockData.parties]"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Total Amt."
                    v-model="form.TotalAmt"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    input-class="text-negative text-weight-bold"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Lock Dt."
                    v-model="form.LockDate"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    input-class="text-red text-weight-bold"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Lock By"
                    v-model="form.LockBy"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    input-class="text-red"
                  />
                </div>

                <!-- Tax Type toggle (edit/add only) -->
                <div
                  v-if="dialogMode !== 'view'"
                  class="col-12 row items-center q-mb-xs"
                >
                  <span class="field-label q-mr-sm" style="display: inline">
                    Tax Type:
                  </span>
                  <q-btn-toggle
                    v-model="form.taxType"
                    dense
                    unelevated
                    size="xs"
                    toggle-color="primary"
                    color="white"
                    text-color="primary"
                    :options="[
                      { label: 'CGST + SGST', value: 'CGST_SGST' },
                      { label: 'IGST', value: 'IGST' },
                    ]"
                    style="border: 1px solid #ddd; border-radius: 4px"
                    @update:model-value="calcTotal"
                  />
                </div>

                <!-- CGST / SGST fields -->
                <template v-if="form.taxType === 'CGST_SGST'">
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input
                      square=""
                      label="CGST %"
                      v-model="form.CGSTRate"
                      dense
                      outlined
                      bg-color="blue-1"
                      type="number"
                      :readonly="dialogMode === 'view'"
                      @update:model-value="calcTotal"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input
                      square=""
                      label="CGST Amt."
                      v-model="form.CGSTAmt"
                      dense
                      outlined
                      bg-color="blue-1"
                      readonly
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input
                      square=""
                      label="Service Tax"
                      v-model="form.ServiceTax"
                      dense
                      outlined
                      bg-color="blue-1"
                      type="number"
                      :readonly="dialogMode === 'view'"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input
                      square=""
                      label="SGST %"
                      v-model="form.SGSTRate"
                      dense
                      outlined
                      bg-color="blue-1"
                      type="number"
                      :readonly="dialogMode === 'view'"
                      @update:model-value="calcTotal"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input
                      square=""
                      label="SGST Amt."
                      v-model="form.SGSTAmt"
                      dense
                      outlined
                      bg-color="blue-1"
                      readonly
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input
                      square=""
                      label="IGST %"
                      v-model="form.IGSTRate"
                      dense
                      outlined
                      bg-color="blue-1"
                      type="number"
                      :readonly="dialogMode === 'view'"
                      @update:model-value="calcTotal"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    <q-input
                      square=""
                      label="IGST Amt."
                      v-model="form.IGSTAmt"
                      dense
                      outlined
                      bg-color="blue-1"
                      readonly
                    />
                  </div>
                </template>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Total Tax"
                    v-model="form.TotalTax"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Discount"
                    v-model="form.Discount"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                    @update:model-value="calcTotal"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Net Amt."
                    v-model="form.NetAmt"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    input-class="text-negative text-weight-bold"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Received"
                    v-model="form.Received"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Time"
                    v-model="form.BookingTime"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Ref."
                    v-model="form.RefUser"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div
                  class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center"
                >
                  <q-item
                    tag="label"
                    v-ripple
                    bg-color="blue-1"
                    class="chckbx-style full-width"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        dense
                        v-model="form.CashCredit"
                        val="orange"
                        color="orange"
                        intermediate-icon="black"
                        :disable="dialogMode === 'view'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Cash Credit</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div
                  class="col-xs-12 col-sm-6 col-md-3 col-lg-3 flex items-center"
                >
                  <q-item
                    tag="label"
                    v-ripple
                    bg-color="blue-1"
                    class="chckbx-style full-width"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        dense
                        v-model="form.PayReceived"
                        val="orange"
                        color="orange"
                        intermediate-icon="black"
                        :disable="dialogMode === 'view'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label dense>Pay. Received</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Pay. Received Date"
                    v-model="form.PayReceivedDate"
                    dense
                    outlined
                    bg-color="blue-1"
                    placeholder="dd/mm/yyyy"
                    :readonly="dialogMode === 'view' || !form.PayReceived"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        v-if="dialogMode !== 'view' && form.PayReceived"
                      >
                        <q-popup-proxy
                          ref="payDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="form.PayReceivedDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.payDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Reference No."
                    v-model="form.ReferenceNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Reference Date"
                    v-model="form.ReferenceDate"
                    dense
                    outlined
                    bg-color="blue-1"
                    placeholder="dd/mm/yyyy"
                    :readonly="dialogMode === 'view'"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        v-if="dialogMode !== 'view'"
                      >
                        <q-popup-proxy
                          ref="refDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="form.ReferenceDate"
                            mask="DD/MM/YYYY"
                            minimal
                            style="width: 280px"
                            @update:model-value="$refs.refDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Invoice No."
                    v-model="form.InvoiceNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>

                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Bank Name"
                    v-model="form.BankName"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Remarks"
                    v-model="form.Remarks"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <q-input
                    square=""
                    label="Display Remarks"
                    v-model="form.DisplayRemarks"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <!-- Prev/Next tab nav — same structure/classes as
               DMSBBookingView.vue's own tab-panel nav. -->
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

          <!-- Print info row — same as the old dialog's footer caption. -->
          <div
            class="text-caption text-grey-7 row q-gutter-x-md wrap q-px-md q-pb-sm"
          >
            <span>
              Print Dt.:
              <b>{{ form.PrintDate }}</b>
            </span>
            <span>
              Count:
              <b>{{ form.Count }}</b>
            </span>
            <span>
              Print By:
              <b>{{ form.PrintBy }}</b>
            </span>
          </div>
        </q-card>
      </div>
    </q-page>

    <!-- ══════════════════════════════════════
         Print / PDF Preview Dialog
    ══════════════════════════════════════ -->
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
import {
  apiGetBookingById,
  apiSaveBooking,
  MOCK_DATA_BOOKING as MOCK_DATA,
} from "src/data/bookingData.js";
import ictLogoUrl from "src/assets/ICT-logo.png";

export default {
  name: "DMSBookingView",

  // Set by DynamicTab.vue's openTab() from the `?mode=...&bookingId=...`
  // query string it's opened with — see openAddBooking()/viewBooking()/
  // editBooking() in DMSBooking.vue.
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      loading: true,
      dialogMode: this.params.mode || "view",
      activeTab: "general",
      tabOrder: ["general", "party", "charges"],
      form: {},
      mockData: MOCK_DATA,
      showPrintDialog: false,
      printBlobUrl: null,
    };
  },

  computed: {
    tabIndex() {
      return this.tabOrder.indexOf(this.activeTab);
    },
    modeLabel() {
      if (this.dialogMode === "add") return "Add";
      if (this.dialogMode === "edit") return "Edit";
      return "View";
    },
  },

  created() {
    if (this.dialogMode === "add") {
      this.form = this.emptyForm();
      this.loading = false;
    } else {
      this.loadBooking();
    }
  },

  methods: {
    goToPreviousTab() {
      if (this.tabIndex > 0) this.activeTab = this.tabOrder[this.tabIndex - 1];
    },
    goToNextTab() {
      if (this.tabIndex < this.tabOrder.length - 1)
        this.activeTab = this.tabOrder[this.tabIndex + 1];
    },

    async loadBooking() {
      const id = Number(this.params && this.params.bookingId);
      this.loading = true;
      try {
        this.form = (await apiGetBookingById(id)) || this.emptyForm();
      } finally {
        this.loading = false;
      }
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

    async saveBooking() {
      this.calcTotal();
      const res = await apiSaveBooking({ ...this.form });
      if (res.success) {
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({
          message: "Booking saved!",
          color: "positive",
          position: "top",
        });
      }
    },

    async saveAndCopy() {
      await this.saveBooking();
      this.form = { ...this.form, BookingId: null, BookingNo: "" };
      this.dialogMode = "add";
    },

    async saveAndPrint(includeFreight = false) {
      this.calcTotal();
      const res = await apiSaveBooking({ ...this.form });
      if (res.success) {
        this.form = { ...res.data };
        this.dialogMode = "edit";
        this.$q.notify({
          message: "Saved!",
          color: "positive",
          position: "top",
        });
        this.printBooking(includeFreight);
      }
    },

    async printBooking(includeFreight) {
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

    // Identical to DMSBooking.vue's own buildReceiptHtml() — each page in
    // this family keeps its own independent copy (see the
    // dms-booking-page-pattern skill's "copy, don't parametrize" note)
    // rather than sharing one across files.
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
