<template>
  <q-page padding class="page hide-overflow">
    <div class="folder">
      <div class="row header-style items-center">
        <div class="col-xs-12 col-sm-8 col-md-9 header-inner">
          <div class="header-title">
            <span class="header_text1">BBooking</span>
            <span class="arrow_right_icon">
              <i class="fa fa-chevron-right"></i>
            </span>
            <span class="header_text2">
              {{
                dialogMode === "view"
                  ? "View"
                  : dialogMode === "edit"
                  ? "Edit"
                  : "Add"
              }}
            </span>
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
        </div>
        <div
          class="col-xs-12 col-sm-4 col-md-3 row justify-end items-center desktop-actions-group"
        >
          <template v-if="dialogMode !== 'view'">
            <q-btn
              class="desktop-action-btn bg-green-white bdr-green text-dgreen"
              dense
              unelevated
              no-caps
              icon="task_alt"
              label="Save"
              @click="saveBooking"
              :disable="entryLoading || !!entryError"
            />
            <q-btn
              class="desktop-action-btn bg-green-white bdr-green text-dgreen"
              dense
              unelevated
              no-caps
              icon="content_copy"
              label="Save &amp; Copy"
              @click="saveAndCopy"
              :disable="entryLoading || !!entryError"
            />
          </template>

          <q-btn dense flat round icon="close" @click="closeDialog">
            <q-tooltip>Back to list</q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-card class="tabs-container">
        <q-inner-loading :showing="entryLoading" color="primary" />
        <div v-if="entryError" class="q-pa-md text-negative">
          {{ entryError }}
        </div>
        <template v-else-if="!entryLoading">
          <q-tabs
            v-model="entryTab"
            dense
            class="text-teal custom-tabs"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="details0" label="General Details [1]" accesskey="1" />
            <q-tab name="details1" label="Party Details [2]" accesskey="2" />
            <q-tab name="details2" label="Charge Details [3]" accesskey="3" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="entryTab" animated keep-alive>
            <q-tab-panel name="details0">
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
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
                    square
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
                    square
                    label="Carrier"
                    v-model="form.Carrier"
                    :options="dialogCarrierOptions"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
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
                    square
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
                    square
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
                            @update:model-value="$refs.bookingDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
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
                    square
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
                  <q-input
                    square
                    label="E-Way Bill No."
                    v-model="form.EWayBillNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Bill No."
                    v-model="form.BillNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Value"
                    v-model="form.BillValue"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
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
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Part No."
                    v-model="form.PartNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-xs q-mb-xs items-end">
                <div class="col-xs-12 col-sm-6 col-md-3">
                  <q-input
                    square
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
                <div class="col-xs-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Weight"
                    v-model="form.Weight"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                    @update:model-value="calcTotal"
                  />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3">
                  <q-btn
                    v-if="dialogMode !== 'view'"
                    dense
                    unelevated
                    color="primary"
                    label="R"
                    @click="calcFreight"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
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
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
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
                <div class="col-12 col-sm-6 col-md-3">
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
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
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
                <div class="col-12 col-sm-6 col-md-3">
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
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
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
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
                    label="S.T. By"
                    v-model="form.STBy"
                    :options="['NoST', 'Consignor', 'Consignee', 'Agent']"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input
                    square
                    label="Remarks"
                    v-model="form.Remarks"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input
                    square
                    label="Display Remarks"
                    v-model="form.DisplayRemarks"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
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
                    square
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
                    square
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
              <div
                v-if="dialogMode !== 'view' && canAddEdit"
                class="row items-center q-mb-xs"
              >
                <span class="field-label q-mr-sm">Tax Type:</span>
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
                  @update:model-value="calcTotal"
                />
              </div>
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
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
                <div class="col-12 col-sm-6 col-md-3">
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
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Date"
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
                            @update:model-value="$refs.payDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="details1">
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
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
                    square
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
                    square
                    label="Phone No."
                    v-model="form.ConsignorPhone"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input
                    square
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
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="From GST No."
                    v-model="form.FromGSTNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
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
                    square
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
                    square
                    label="Phone No."
                    v-model="form.ConsigneePhone"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-input
                    square
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
                  <q-input
                    square
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
            <q-tab-panel name="details2">
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Rate"
                    v-model="form.Rate"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                    @update:model-value="calcTotal"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Freight"
                    v-model="form.FreightAmount"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
                    label="Discount Type"
                    v-model="form.DiscountType"
                    :options="['Select Value', '%', 'Fixed']"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Discount"
                    v-model="form.DiscountLeft"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Kasar"
                    v-model="form.Kasar"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Other Frgt."
                    v-model="form.OtherFreight"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
                    label="Other Frgt. A/c."
                    v-model="form.OtherFreightAc"
                    :options="['Select Account', ...mockData.parties]"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-select
                    square
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
                    square
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
                  <q-input
                    square
                    label="Total Amt."
                    v-model="form.TotalAmt"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    input-class="text-negative text-weight-bold"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Lock Dt."
                    v-model="form.LockDate"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    input-class="text-red text-weight-bold"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Lock By"
                    v-model="form.LockBy"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    input-class="text-red"
                  />
                </div>
              </div>
              <template v-if="form.taxType === 'CGST_SGST'">
                <div class="row q-col-gutter-sm items-start">
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      square
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
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      square
                      label="CGST Amt."
                      v-model="form.CGSTAmt"
                      dense
                      outlined
                      bg-color="blue-1"
                      readonly
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      square
                      label="Service Tax"
                      v-model="form.ServiceTax"
                      dense
                      outlined
                      bg-color="blue-1"
                      type="number"
                      :readonly="dialogMode === 'view'"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      square
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
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      square
                      label="SGST Amt."
                      v-model="form.SGSTAmt"
                      dense
                      outlined
                      bg-color="blue-1"
                      readonly
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row q-col-gutter-sm items-start">
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      square
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
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      square
                      label="IGST Amt."
                      v-model="form.IGSTAmt"
                      dense
                      outlined
                      bg-color="blue-1"
                      readonly
                    />
                  </div>
                </div>
              </template>
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Total Tax"
                    v-model="form.TotalTax"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
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
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Net Amt."
                    v-model="form.NetAmt"
                    dense
                    outlined
                    bg-color="blue-1"
                    readonly
                    input-class="text-negative text-weight-bold"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Received"
                    v-model="form.Received"
                    dense
                    outlined
                    bg-color="blue-1"
                    type="number"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Time"
                    v-model="form.BookingTime"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Ref."
                    v-model="form.RefUser"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Reference No."
                    v-model="form.ReferenceNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Date"
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
                            @update:model-value="$refs.refDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Invoice No."
                    v-model="form.InvoiceNo"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-input
                    square
                    label="Bank Name"
                    v-model="form.BankName"
                    dense
                    outlined
                    bg-color="blue-1"
                    :readonly="dialogMode === 'view'"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <q-separator />
          <q-card-section class="q-pa-sm bg-grey-2">
            <div class="column">
              <!-- Print info row -->
              <div class="text-caption text-grey-7 row q-gutter-x-md wrap">
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
              <!-- Action buttons — wrap on mobile -->
              <div class="row q-gutter-xs wrap">
                <template v-if="dialogMode !== 'view'">
                  <q-btn
                    unelevated
                    color="positive"
                    label="Save"
                    size="sm"
                    @click="saveBooking"
                  />
                  <q-btn
                    unelevated
                    color="blue-7"
                    label="Save &amp; Copy"
                    size="sm"
                    @click="saveAndCopy"
                  />
                  <q-btn
                    unelevated
                    color="blue-8"
                    label="Save &amp; Print"
                    size="sm"
                    @click="saveAndPrint(false)"
                  />
                  <q-btn
                    unelevated
                    color="purple-7"
                    label="Save &amp; Print with Freight"
                    size="sm"
                    @click="saveAndPrint(true)"
                  />
                </template>
                <q-btn
                  unelevated
                  color="negative"
                  label="Cancel"
                  size="sm"
                  @click="closeDialog"
                />
              </div>
            </div>
          </q-card-section>
        </template>
      </q-card>
    </div>
  </q-page>
  <q-dialog v-model="showPrintDialog" maximized @before-hide="closePrintDialog">
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
</template>
<script>
import ListPage from "./DMSBBooking.vue";
import { apiGetBookingById } from "src/data/bookingData.js";
export default {
  name: "DMSBBookingForm",
  extends: ListPage,
  props: { params: { type: Object, default: () => ({}) } },
  data() {
    return {
      entryPage: true,
      entryTab: "details0",
      entryLoading: true,
      entryError: "",
    };
  },
  async created() {
    const query = { ...this.$route?.query, ...this.params };
    this.dialogMode = ["add", "edit", "view"].includes(query.mode)
      ? query.mode
      : "add";
    const id = query.id;
    try {
      if (this.dialogMode !== "add") {
        const record = await apiGetBookingById(Number(id));
        if (!record)
          throw new Error(
            "This record could not be found. Return to the list and select it again."
          );
        this.form = { ...record };
      }
    } catch (error) {
      this.entryError = error.message || "Unable to load record.";
    } finally {
      this.entryLoading = false;
    }
  },
  methods: {
    closeDialog() {
      this.backToEntryList("/DMSBBooking", "BBooking");
    },
  },
};
</script>
