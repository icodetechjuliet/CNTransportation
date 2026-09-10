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
            <span class="header_text1">Truck Booking</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredBookings.length }}</span>
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
            dense
            :rows="filteredBookings"
            :columns="tableColumns"
            row-key="BookingId"
            :visible-columns="visibleColumns"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-black m-table-style"
            table-header-class="text-black m-table-style"
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
                    label="Raise New Booking"
                    class="add_new_job m_add_newjob bg-dblue-lblue"
                    @click="openAddBooking"
                  />

                  <q-select
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
                    :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
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
              <span class="q-ml-md">Page {{ pagination.page }} of {{ maxPages }}</span>
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
              <q-td :props="props" class="button-container booking-action-td">
                <q-btn
                  icon="fa-solid fa-eye"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style vw"
                  @click="viewBooking(props.row)"
                  ><q-tooltip>View</q-tooltip></q-btn
                >
                <q-btn
                  v-if="canAddEdit"
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editBooking(props.row)"
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <!-- ── Mobile card (grid mode) ── -->
            <template v-slot:item="props">
              <div class="dms-mobile-card">
                <!-- Header row: Booking No + Status -->
                <div class="dms-mc-header">
                  <span class="dms-mc-bno">{{ props.row.BookingNo }}</span>
                  <q-badge
                    :color="props.row.Status === 'Delivered' ? 'positive' : 'orange'"
                    :label="props.row.Status"
                    class="dms-mc-status"
                  />
                </div>

                <!-- Date / Delivery Type / Payment -->
                <div class="dms-mc-meta">
                  <span class="dms-mc-chip">{{ props.row.BookingDate }}</span>
                  <q-badge
                    v-if="props.row.DeliveryType === 'Door Delivery'"
                    color="orange-6"
                    label="Door Delivery"
                    class="dms-mc-chip"
                  />
                  <span v-else class="dms-mc-chip">{{ props.row.DeliveryType }}</span>
                  <q-badge
                    :color="paymentColor(props.row.PaymentType)"
                    :label="props.row.PaymentType"
                    outline
                    class="dms-mc-chip"
                  />
                </div>

                <!-- Route -->
                <div class="dms-mc-route">
                  <q-icon name="place" size="14px" color="primary" />
                  <span class="dms-mc-city">{{ props.row.FromCity }}</span>
                  <q-icon name="arrow_forward" size="13px" color="grey-6" class="q-mx-xs" />
                  <q-icon name="place" size="14px" color="red-6" />
                  <span class="dms-mc-city">{{ props.row.ToCity }}</span>
                </div>

                <!-- Parties -->
                <div class="dms-mc-parties">
                  <div class="dms-mc-party">
                    <span class="dms-mc-plabel">From:</span>
                    <span>{{ maskName(props.row.ConsignorName) }}</span>
                  </div>
                  <div class="dms-mc-party">
                    <span class="dms-mc-plabel">To:</span>
                    <span>{{ maskName(props.row.ConsigneeName) }}</span>
                  </div>
                </div>

                <!-- Footer: carrier + actions -->
                <div class="dms-mc-footer">
                  <span class="dms-mc-carrier">{{ props.row.LoadCarrier }}</span>
                  <div class="button-container">
                    <q-btn
                      icon="fa-solid fa-eye"
                      color="primary"
                      dense
                      outline
                      class="edit-icon-style vw"
                      @click="viewBooking(props.row)"
                    ><q-tooltip>View</q-tooltip></q-btn>
                    <q-btn
                      v-if="canAddEdit"
                      icon="fa-solid fa-pen-to-square"
                      color="primary"
                      dense
                      outline
                      class="edit-icon-style mody"
                      @click="editBooking(props.row)"
                    ><q-tooltip>Edit</q-tooltip></q-btn>
                  </div>
                </div>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <!-- ══════════════════════════════════════
         Booking Add / Edit / View Dialog
    ══════════════════════════════════════ -->
    <q-dialog v-model="showBookingDialog" persistent maximized>
      <q-card style="display: flex; flex-direction: column; height: 100%">
        <!-- Toolbar -->
        <q-toolbar
          style="
            background: linear-gradient(to right, #0178bc 0%, #00bdda 100%);
          "
          class="text-white"
        >
          <q-toolbar-title class="text-body2">
            <span class="q-mr-md">
              Booking Type: <b>{{ form.BookingType }}</b>
            </span>
            <span class="q-mr-md">
              Booked From: <b>{{ form.BookedFrom }}</b>
            </span>
            <span>
              Carrier: <b>{{ form.Carrier }}</b>
            </span>
            <span v-if="form.BookingNo" class="q-ml-lg text-weight-bold">
              {{ form.BookingNo }}
            </span>
          </q-toolbar-title>
          <q-space />
          <template v-if="dialogMode !== 'view'">
            <q-btn
              dense
              flat
              icon="save"
              label="Save"
              class="q-mr-xs"
              @click="saveBooking"
            />
            <q-btn
              dense
              flat
              icon="content_copy"
              label="Save &amp; Copy"
              class="q-mr-xs"
              @click="saveAndCopy"
            />
          </template>
          <q-btn dense flat icon="close" v-close-popup @click="closeDialog" />
        </q-toolbar>

        <!-- Body -->
        <q-card-section class="q-pa-sm col" style="overflow-y: auto">
          <div class="row q-col-gutter-sm">
            <!-- ── LEFT PANEL ── -->
            <div class="col-xs-12 col-md-6">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <!-- Booking Type / Booked From / Carrier / Load -->
                  <div class="row q-col-gutter-xs q-mb-xs items-end">
                    <div class="col-3">
                      <span class="field-label">Booking Type</span>
                      <q-select
                        v-model="form.BookingType"
                        :options="['Outward', 'Inward']"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-4">
                      <span class="field-label">Booked From</span>
                      <q-select
                        v-model="form.BookedFrom"
                        :options="mockData.bookingOffices"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-3">
                      <span class="field-label">Carrier</span>
                      <q-select
                        v-model="form.Carrier"
                        :options="dialogCarrierOptions"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="
                          dialogMode === 'view' || activeMode === 'truck'
                        "
                      />
                    </div>
                    <div class="col-2">
                      <span class="field-label">Load</span>
                      <q-select
                        v-model="form.Load"
                        :options="['own', 'Truck', 'Part']"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Booking No / Date -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-6">
                      <span class="field-label">Booking No.</span>
                      <q-input
                        v-model="form.BookingNo"
                        dense
                        outlined
                        bg-color="yellow-1"
                        readonly
                      />
                    </div>
                    <div class="col-6">
                      <span class="field-label">Date</span>
                      <q-input
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
                                @update:model-value="
                                  $refs.bookingDateProxy.hide()
                                "
                              />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>

                  <!-- From City -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">From City</span>
                      <q-select
                        v-model="form.FromCity"
                        :options="mockData.cities"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        input-debounce="0"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- From Buk. Office -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">From Buk. Office</span>
                      <q-select
                        v-model="form.FromBookingOffice"
                        :options="mockData.bookingOffices"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Consignor A/c -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">Consignor A/c.</span>
                      <q-select
                        v-model="form.ConsignorAccount"
                        :options="mockData.parties"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        input-debounce="0"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Consignor Name / Phone -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-7">
                      <span class="field-label">Consignor Name</span>
                      <q-input
                        v-model="form.ConsignorName"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-5">
                      <span class="field-label">Phone No.</span>
                      <q-input
                        v-model="form.ConsignorPhone"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- From Address -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">From Address</span>
                      <q-input
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
                  </div>

                  <!-- From GST No -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">From GST No.</span>
                      <q-input
                        v-model="form.FromGSTNo"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- E-Way Bill No / Bill No / Value -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-5">
                      <span class="field-label">E-Way Bill No.</span>
                      <q-input
                        v-model="form.EWayBillNo"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-3">
                      <span class="field-label">Bill No.</span>
                      <q-input
                        v-model="form.BillNo"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-4">
                      <span class="field-label">Value</span>
                      <q-input
                        v-model="form.BillValue"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Item / Part No -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-6">
                      <span class="field-label">Item</span>
                      <q-select
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
                    <div class="col-6">
                      <span class="field-label">Part No.</span>
                      <q-input
                        v-model="form.PartNo"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Quantity / Weight / R button -->
                  <div class="row q-col-gutter-xs q-mb-xs items-end">
                    <div class="col-4">
                      <span class="field-label">Quantity</span>
                      <q-input
                        v-model="form.Quantity"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </div>
                    <div class="col-4">
                      <span class="field-label">Weight</span>
                      <q-input
                        v-model="form.Weight"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </div>
                    <div class="col-4" style="padding-bottom: 2px">
                      <q-btn
                        v-if="dialogMode !== 'view'"
                        dense
                        unelevated
                        color="primary"
                        label="R"
                        style="width: 100%"
                        @click="calcFreight"
                      />
                    </div>
                  </div>

                  <!-- Rate / Freight -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-6">
                      <span class="field-label">Rate</span>
                      <q-input
                        v-model="form.Rate"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </div>
                    <div class="col-6">
                      <span class="field-label">Freight</span>
                      <q-input
                        v-model="form.FreightAmount"
                        dense
                        outlined
                        bg-color="yellow-1"
                        type="number"
                        readonly
                      />
                    </div>
                  </div>

                  <!-- Door Del / DD Amt -->
                  <div class="row q-col-gutter-xs q-mb-xs items-center">
                    <div class="col-4">
                      <q-checkbox
                        v-model="form.IsDoorDelivery"
                        label="Door Del."
                        dense
                        :disable="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </div>
                    <div class="col-8">
                      <span class="field-label">D.D. Amt.</span>
                      <q-input
                        v-model="form.DoorDeliveryAmt"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="
                          dialogMode === 'view' || !form.IsDoorDelivery
                        "
                        @update:model-value="calcTotal"
                      />
                    </div>
                  </div>

                  <!-- Door Coll / Collection -->
                  <div class="row q-col-gutter-xs q-mb-xs items-center">
                    <div class="col-4">
                      <q-checkbox
                        v-model="form.IsDoorCollection"
                        label="Door Coll."
                        dense
                        :disable="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </div>
                    <div class="col-8">
                      <span class="field-label">Collection</span>
                      <q-input
                        v-model="form.DoorCollectionAmt"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="
                          dialogMode === 'view' || !form.IsDoorCollection
                        "
                        @update:model-value="calcTotal"
                      />
                    </div>
                  </div>

                  <!-- Other / Other Amt -->
                  <div class="row q-col-gutter-xs q-mb-xs items-center">
                    <div class="col-4">
                      <q-checkbox
                        v-model="form.HasOther"
                        label="Other"
                        dense
                        :disable="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </div>
                    <div class="col-8">
                      <span class="field-label">Other Amt.</span>
                      <q-input
                        v-model="form.OtherAmt"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view' || !form.HasOther"
                        @update:model-value="calcTotal"
                      />
                    </div>
                  </div>

                  <!-- S.T. By -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">S.T. By</span>
                      <q-select
                        v-model="form.STBy"
                        :options="['NoST', 'Consignor', 'Consignee', 'Agent']"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Discount Type / Discount -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-5">
                      <span class="field-label">Discount Type</span>
                      <q-select
                        v-model="form.DiscountType"
                        :options="['Select Value', '%', 'Fixed']"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-7">
                      <span class="field-label">Discount</span>
                      <q-input
                        v-model="form.DiscountLeft"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Kasar / Other Frgt -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-5">
                      <span class="field-label">Kasar</span>
                      <q-input
                        v-model="form.Kasar"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-7">
                      <span class="field-label">Other Frgt.</span>
                      <q-input
                        v-model="form.OtherFreight"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Other Frgt A/c -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">Other Frgt. A/c.</span>
                      <q-select
                        v-model="form.OtherFreightAc"
                        :options="['Select Account', ...mockData.parties]"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Remarks -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">Remarks</span>
                      <q-input
                        v-model="form.Remarks"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Display Remarks -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">Display Remarks</span>
                      <q-input
                        v-model="form.DisplayRemarks"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- ── RIGHT PANEL ── -->
            <div class="col-xs-12 col-md-6">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <!-- Payment Type / Mode -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-7">
                      <span class="field-label">Payment Type</span>
                      <q-select
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
                    <div class="col-5">
                      <span class="field-label">Mode</span>
                      <q-select
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
                  </div>

                  <!-- To City -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">To City</span>
                      <q-select
                        v-model="form.ToCity"
                        :options="mockData.cities"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        input-debounce="0"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Delivery City -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">Delivery City</span>
                      <q-select
                        v-model="form.DeliveryCity"
                        :options="mockData.cities"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        input-debounce="0"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- To Buk. Office -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">To Buk. Office</span>
                      <q-select
                        v-model="form.ToBookingOffice"
                        :options="mockData.bookingOffices"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Consignee A/c -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">Consignee A/c.</span>
                      <q-select
                        v-model="form.ConsigneeAccount"
                        :options="mockData.parties"
                        dense
                        outlined
                        bg-color="blue-1"
                        use-input
                        fill-input
                        input-debounce="0"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Consignee Name / Phone -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-7">
                      <span class="field-label">Consignee Name</span>
                      <q-input
                        v-model="form.ConsigneeName"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-5">
                      <span class="field-label">Phone No.</span>
                      <q-input
                        v-model="form.ConsigneePhone"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- To Address -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">To Address</span>
                      <q-input
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
                  </div>

                  <!-- To GST No -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">To GST No.</span>
                      <q-input
                        v-model="form.ToGSTNo"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Total Amt / Lock Dt -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-6">
                      <span class="field-label">Total Amt.</span>
                      <q-input
                        v-model="form.TotalAmt"
                        dense
                        outlined
                        bg-color="yellow-1"
                        readonly
                        input-class="text-negative text-weight-bold"
                      />
                    </div>
                    <div class="col-3">
                      <span class="field-label">Lock Dt.</span>
                      <q-input
                        v-model="form.LockDate"
                        dense
                        outlined
                        bg-color="grey-2"
                        readonly
                        input-class="text-red text-weight-bold"
                      />
                    </div>
                    <div class="col-3">
                      <span class="field-label">Lock By</span>
                      <q-input
                        v-model="form.LockBy"
                        dense
                        outlined
                        bg-color="grey-2"
                        readonly
                        input-class="text-red"
                      />
                    </div>
                  </div>

                  <!-- Tax Type toggle (edit/add only) -->
                  <div
                    v-if="dialogMode !== 'view' && canAddEdit"
                    class="row items-center q-mb-xs"
                  >
                    <span class="field-label q-mr-sm" style="display: inline"
                      >Tax Type:</span
                    >
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
                    <div class="row q-col-gutter-xs q-mb-xs">
                      <div class="col-4">
                        <span class="field-label">CGST %</span>
                        <q-input
                          v-model="form.CGSTRate"
                          dense
                          outlined
                          bg-color="blue-1"
                          type="number"
                          :readonly="dialogMode === 'view'"
                          @update:model-value="calcTotal"
                        />
                      </div>
                      <div class="col-4">
                        <span class="field-label">CGST Amt.</span>
                        <q-input
                          v-model="form.CGSTAmt"
                          dense
                          outlined
                          bg-color="yellow-1"
                          readonly
                        />
                      </div>
                      <div class="col-4">
                        <span class="field-label">Service Tax</span>
                        <q-input
                          v-model="form.ServiceTax"
                          dense
                          outlined
                          bg-color="blue-1"
                          type="number"
                          :readonly="dialogMode === 'view'"
                        />
                      </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-xs">
                      <div class="col-4">
                        <span class="field-label">SGST %</span>
                        <q-input
                          v-model="form.SGSTRate"
                          dense
                          outlined
                          bg-color="blue-1"
                          type="number"
                          :readonly="dialogMode === 'view'"
                          @update:model-value="calcTotal"
                        />
                      </div>
                      <div class="col-4">
                        <span class="field-label">SGST Amt.</span>
                        <q-input
                          v-model="form.SGSTAmt"
                          dense
                          outlined
                          bg-color="yellow-1"
                          readonly
                        />
                      </div>
                    </div>
                  </template>

                  <!-- IGST fields -->
                  <template v-else>
                    <div class="row q-col-gutter-xs q-mb-xs">
                      <div class="col-4">
                        <span class="field-label">IGST %</span>
                        <q-input
                          v-model="form.IGSTRate"
                          dense
                          outlined
                          bg-color="blue-1"
                          type="number"
                          :readonly="dialogMode === 'view'"
                          @update:model-value="calcTotal"
                        />
                      </div>
                      <div class="col-4">
                        <span class="field-label">IGST Amt.</span>
                        <q-input
                          v-model="form.IGSTAmt"
                          dense
                          outlined
                          bg-color="yellow-1"
                          readonly
                        />
                      </div>
                    </div>
                  </template>

                  <!-- Total Tax / Discount / Net Amt -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-4">
                      <span class="field-label">Total Tax</span>
                      <q-input
                        v-model="form.TotalTax"
                        dense
                        outlined
                        bg-color="yellow-1"
                        readonly
                      />
                    </div>
                    <div class="col-4">
                      <span class="field-label">Discount</span>
                      <q-input
                        v-model="form.Discount"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                        @update:model-value="calcTotal"
                      />
                    </div>
                    <div class="col-4">
                      <span class="field-label">Net Amt.</span>
                      <q-input
                        v-model="form.NetAmt"
                        dense
                        outlined
                        bg-color="yellow-1"
                        readonly
                        input-class="text-negative text-weight-bold"
                      />
                    </div>
                  </div>

                  <!-- Received / Time / Ref -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-5">
                      <span class="field-label">Received</span>
                      <q-input
                        v-model="form.Received"
                        dense
                        outlined
                        bg-color="blue-1"
                        type="number"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-4">
                      <span class="field-label">Time</span>
                      <q-input
                        v-model="form.BookingTime"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-3">
                      <span class="field-label">Ref.</span>
                      <q-input
                        v-model="form.RefUser"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Cash Credit / Pay. Received / Date -->
                  <div class="row q-col-gutter-xs q-mb-xs items-center">
                    <div class="col-4">
                      <q-checkbox
                        v-model="form.CashCredit"
                        label="Cash Credit"
                        dense
                        :disable="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-4">
                      <q-checkbox
                        v-model="form.PayReceived"
                        label="Pay. Received"
                        dense
                        :disable="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-4">
                      <span class="field-label">Date</span>
                      <q-input
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
                  </div>

                  <!-- Reference No / Date -->
                  <div class="row q-col-gutter-xs q-mb-xs">
                    <div class="col-7">
                      <span class="field-label">Reference No.</span>
                      <q-input
                        v-model="form.ReferenceNo"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                    <div class="col-5">
                      <span class="field-label">Date</span>
                      <q-input
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
                  </div>

                  <!-- Invoice No -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">Invoice No.</span>
                      <q-input
                        v-model="form.InvoiceNo"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>

                  <!-- Bank Name -->
                  <div class="row q-mb-xs">
                    <div class="col-12">
                      <span class="field-label">Bank Name</span>
                      <q-input
                        v-model="form.BankName"
                        dense
                        outlined
                        bg-color="blue-1"
                        :readonly="dialogMode === 'view'"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <!-- Footer bar -->
        <q-separator />
        <q-card-section class="q-pa-sm bg-grey-2">
          <div class="column" style="gap:6px">
            <!-- Print info row -->
            <div class="text-caption text-grey-7 row q-gutter-x-md wrap">
              <span>Print Dt.: <b>{{ form.PrintDate }}</b></span>
              <span>Count: <b>{{ form.Count }}</b></span>
              <span>Print By: <b>{{ form.PrintBy }}</b></span>
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
                v-close-popup
                @click="closeDialog"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

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
import html2pdf from "html2pdf.js";
import ictLogoUrl from "src/assets/ICT-logo.png";

// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls
// ─────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    BookingId: 1,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040001",
    BookingDate: "01/04/2026",
    BookingTime: "10:33 AM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Chakan",
    DeliveryCity: "",
    ConsigneeName: "Galaxy xxx Tooling",
    ConsignorName: "Balaji xxx Co.",
    FromCity: "Rajkot-G",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "own",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Chakan",
    ConsignorAccount: "Balaji xxx Co.",
    ConsigneeAccount: "Select Party",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24BUHPS2708D1ZT",
    ToGSTNo: "27ATJPB8586E1ZF",
    EWayBillNo: "601284646429",
    BillNo: "92",
    BillValue: 5520,
    Item: "Box",
    PartNo: "",
    Quantity: 1,
    Weight: null,
    Rate: null,
    FreightAmount: 200,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 50,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Select Payment",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "6.25",
    SGSTRate: 2.5,
    SGSTAmt: "6.25",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "250.00",
    TotalTax: "12.50",
    Discount: 0,
    NetAmt: "262.50",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Chakan-Maharashtra-27",
    FromAddress: "Rajkot-G – Gujarat\nState Code:24",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 12:48 PM",
    PrintBy: "Ketan",
    Count: 2,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 2,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040002",
    BookingDate: "01/04/2026",
    BookingTime: "11:47 AM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Nasik",
    DeliveryCity: "",
    ConsigneeName: "Ring xxx Ltd",
    ConsignorName: "Rajsani xxx Polymers",
    FromCity: "Rajkot-G",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "own",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Nasik",
    ConsignorAccount: "Rajsani xxx Polymers",
    ConsigneeAccount: "Ring xxx Aqua",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24XYZAA1234B1ZT",
    ToGSTNo: "27RING1234B1ZF",
    EWayBillNo: "701284646430",
    BillNo: "93",
    BillValue: 3200,
    Item: "Parcel",
    PartNo: "",
    Quantity: 2,
    Weight: 15,
    Rate: null,
    FreightAmount: 300,
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
    PaymentMode: "Cash",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "7.50",
    SGSTRate: 2.5,
    SGSTAmt: "7.50",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "300.00",
    TotalTax: "15.00",
    Discount: 0,
    NetAmt: "315.00",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Nasik-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 11:00 AM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 3,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040003",
    BookingDate: "01/04/2026",
    BookingTime: "11:52 AM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Hyderabad",
    DeliveryCity: "",
    ConsigneeName: "Bhavya xxx Distributors",
    ConsignorName: "Vansh xxx Llp",
    FromCity: "Rajkot-G",
    PaymentType: "ToPay",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Hyderabad",
    ConsignorAccount: "Vansh xxx Llp",
    ConsigneeAccount: "Bhavya xxx Distributors",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24VAN1234D1ZT",
    ToGSTNo: "36BHV8586E1ZF",
    EWayBillNo: "501234646431",
    BillNo: "94",
    BillValue: 8400,
    Item: "Pallet",
    PartNo: "",
    Quantity: 5,
    Weight: 120,
    Rate: 3.8,
    FreightAmount: 456,
    IsDoorDelivery: true,
    DoorDeliveryAmt: 80,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 50,
    STBy: "Consignor",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "NEFT",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "29.30",
    ServiceTax: 0,
    TotalAmt: "586.00",
    TotalTax: "29.30",
    Discount: 0,
    NetAmt: "615.30",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "REF2021-03",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Hyderabad - Telangana",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "Fragile items",
    DisplayRemarks: "",
    LockDate: "03/04/2026",
    LockBy: "pratik",
    PrintDate: "02/04/2026 12:00 PM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 4,
    BookingType: "Outward",
    DeliveryType: "Door Delivery",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040004",
    BookingDate: "01/04/2026",
    BookingTime: "04:17 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Chakan",
    DeliveryCity: "",
    ConsigneeName: "Sumit xxx Fasteners",
    ConsignorName: "Mona xxx Llp",
    FromCity: "Rajkot-G",
    PaymentType: "TBBR",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Chakan",
    ConsignorAccount: "Mona xxx Llp",
    ConsigneeAccount: "Sumit xxx Fasteners",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24MON1234A1ZT",
    ToGSTNo: "27SUM8586E1ZF",
    EWayBillNo: "401234646432",
    BillNo: "95",
    BillValue: 1200,
    Item: "Box",
    PartNo: "",
    Quantity: 3,
    Weight: 18,
    Rate: 3.5,
    FreightAmount: 63,
    IsDoorDelivery: true,
    DoorDeliveryAmt: 40,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 50,
    STBy: "Consignee",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 430,
    OtherFreightAc: "Shree Ram Tempo Service",
    PaymentMode: "Cash",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "7.65",
    ServiceTax: 0,
    TotalAmt: "153.00",
    TotalTax: "7.65",
    Discount: 0,
    NetAmt: "160.65",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Chakan-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "03/04/2026",
    LockBy: "Ketan",
    PrintDate: "02/04/2026 04:20 PM",
    PrintBy: "Ketan",
    Count: 3,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 5,
    BookingType: "Outward",
    DeliveryType: "Door Delivery",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040005",
    BookingDate: "01/04/2026",
    BookingTime: "05:15 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Vasai",
    DeliveryCity: "",
    ConsigneeName: "Krishna xxx Wire...",
    ConsignorName: "Nepolion xxx Packaging",
    FromCity: "Rajkot-G",
    PaymentType: "Paid",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Vasai",
    ConsignorAccount: "Nepolion xxx Packaging",
    ConsigneeAccount: "Krishna xxx Engineering",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24NEP1234B1ZT",
    ToGSTNo: "27KRS8586E1ZF",
    EWayBillNo: "301234646433",
    BillNo: "96",
    BillValue: 6700,
    Item: "Box",
    PartNo: "",
    Quantity: 4,
    Weight: 45,
    Rate: 4.0,
    FreightAmount: 180,
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
    PaymentMode: "NEFT",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "9.00",
    ServiceTax: 0,
    TotalAmt: "180.00",
    TotalTax: "9.00",
    Discount: 0,
    NetAmt: "189.00",
    Received: 180,
    RefUser: "",
    CashCredit: false,
    PayReceived: true,
    PayReceivedDate: "2026-04-05",
    ReferenceNo: "REF2021-05",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Vasai-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 05:18 PM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 6,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040006",
    BookingDate: "01/04/2026",
    BookingTime: "06:00 PM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Pune",
    DeliveryCity: "",
    ConsigneeName: "Carver xxx Ltd",
    ConsignorName: "Carver xxx Ltd",
    FromCity: "Rajkot-G",
    PaymentType: "Paid",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "own",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Pune",
    ConsignorAccount: "Carver xxx Ltd",
    ConsigneeAccount: "Carver xxx Ltd",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24CAR1234C1ZT",
    ToGSTNo: "27CAR8586E1ZF",
    EWayBillNo: "201234646434",
    BillNo: "97",
    BillValue: 9900,
    Item: "Crate",
    PartNo: "",
    Quantity: 2,
    Weight: 80,
    Rate: null,
    FreightAmount: 550,
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
    PaymentMode: "Cheque",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "13.75",
    SGSTRate: 2.5,
    SGSTAmt: "13.75",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "550.00",
    TotalTax: "27.50",
    Discount: 0,
    NetAmt: "577.50",
    Received: 550,
    RefUser: "",
    CashCredit: false,
    PayReceived: true,
    PayReceivedDate: "2026-04-03",
    ReferenceNo: "CHQ-00123",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "HDFC Bank",
    ToAddress: "Pune-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 06:05 PM",
    PrintBy: "Ketan",
    Count: 2,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 7,
    BookingType: "Outward",
    DeliveryType: "Door Delivery",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040007",
    BookingDate: "01/04/2026",
    BookingTime: "08:15 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Mumbai",
    DeliveryCity: "",
    ConsigneeName: "Mahindra xxx Ltd",
    ConsignorName: "Varun xxx Co",
    FromCity: "Rajkot-G",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Mumbai",
    ConsignorAccount: "Varun xxx Co",
    ConsigneeAccount: "Mahindra xxx Ltd",
    ConsignorPhone: "9876543210",
    ConsigneePhone: "9988776655",
    FromGSTNo: "24AAMFV5464H1ZT",
    ToGSTNo: "27AAFCM0476N1Z2",
    EWayBillNo: "691284754071",
    BillNo: "G1",
    BillValue: 245384,
    Item: "pallate",
    PartNo: "",
    Quantity: 1,
    Weight: 1140,
    Rate: 3.8,
    FreightAmount: 4332,
    IsDoorDelivery: true,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 50,
    STBy: "Consignor",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Select Payment",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "109.55",
    SGSTRate: 2.5,
    SGSTAmt: "109.55",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "4382.00",
    TotalTax: "219.10",
    Discount: 0,
    NetAmt: "4382.00",
    Received: 0,
    RefUser: "deepak",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Chakan – Maharashtra\nState Code:27",
    FromAddress:
      "NH 8B, GONDAL ROAD, SURVEY NO.150, VILLAGE-PADAVALA, TAL-KOTADA SANGANI, Rajkot-",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "08/04/2026",
    LockBy: "pratik",
    PrintDate: "02/04/2026 10:33 AM",
    PrintBy: "pratik",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 8,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040008",
    BookingDate: "01/04/2026",
    BookingTime: "11:24 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Nasik",
    DeliveryCity: "",
    ConsigneeName: "Mahindra xxx Ltd",
    ConsignorName: "Amul xxx Ltd",
    FromCity: "Rajkot-G",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Nasik",
    ConsignorAccount: "Amul xxx Ltd",
    ConsigneeAccount: "Mahindra xxx Ltd",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24AMU1234A1ZT",
    ToGSTNo: "27MAH8586E1ZF",
    EWayBillNo: "891234646435",
    BillNo: "A5",
    BillValue: 18000,
    Item: "Box",
    PartNo: "",
    Quantity: 6,
    Weight: 200,
    Rate: 3.2,
    FreightAmount: 640,
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
    PaymentMode: "Select Payment",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "32.00",
    ServiceTax: 0,
    TotalAmt: "640.00",
    TotalTax: "32.00",
    Discount: 0,
    NetAmt: "672.00",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Nasik-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 11:30 PM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  // ── Inward records ──
  {
    BookingId: 9,
    BookingType: "Inward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040009",
    BookingDate: "01/04/2026",
    BookingTime: "09:15 AM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Rajkot-G",
    DeliveryCity: "",
    ConsigneeName: "Balaji xxx Co.",
    ConsignorName: "Paras xxx Exports",
    FromCity: "Mumbai",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Mumbai",
    Load: "own",
    FromBookingOffice: "Mumbai",
    ToBookingOffice: "Greenland",
    ConsignorAccount: "Paras xxx Exports",
    ConsigneeAccount: "Balaji xxx Co.",
    ConsignorPhone: "9876500001",
    ConsigneePhone: "9876500002",
    FromGSTNo: "27PAR1234A1ZT",
    ToGSTNo: "24BAL8586E1ZF",
    EWayBillNo: "110284646501",
    BillNo: "B11",
    BillValue: 12000,
    Item: "Box",
    PartNo: "",
    Quantity: 3,
    Weight: 60,
    Rate: 4.0,
    FreightAmount: 240,
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
    PaymentMode: "NEFT",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "6.00",
    SGSTRate: 2.5,
    SGSTAmt: "6.00",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "240.00",
    TotalTax: "12.00",
    Discount: 0,
    NetAmt: "252.00",
    Received: 240,
    RefUser: "",
    CashCredit: false,
    PayReceived: true,
    PayReceivedDate: "2026-04-03",
    ReferenceNo: "INW-001",
    ReferenceDate: "",
    InvoiceNo: "INV-B11",
    BankName: "ICICI Bank",
    ToAddress: "Rajkot-G – Gujarat\nState Code:24",
    FromAddress: "Mumbai – Maharashtra\nState Code:27",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 09:20 AM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 10,
    BookingType: "Inward",
    DeliveryType: "Door Delivery",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040010",
    BookingDate: "01/04/2026",
    BookingTime: "12:30 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Rajkot-G",
    DeliveryCity: "Rajkot-G",
    ConsigneeName: "Vansh xxx Llp",
    ConsignorName: "Pioneer xxx Ltd.",
    FromCity: "Pune",
    PaymentType: "ToPay",
    Status: "Delivered",
    BookedFrom: "Pune",
    Load: "Truck",
    FromBookingOffice: "Pune",
    ToBookingOffice: "Greenland",
    ConsignorAccount: "Pioneer xxx Ltd.",
    ConsigneeAccount: "Vansh xxx Llp",
    ConsignorPhone: "9876500003",
    ConsigneePhone: "9876500004",
    FromGSTNo: "27PIO1234B1ZT",
    ToGSTNo: "24VAN8586E1ZF",
    EWayBillNo: "220284646502",
    BillNo: "C22",
    BillValue: 7800,
    Item: "Parcel",
    PartNo: "",
    Quantity: 5,
    Weight: 90,
    Rate: 3.5,
    FreightAmount: 315,
    IsDoorDelivery: true,
    DoorDeliveryAmt: 50,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 30,
    STBy: "Consignee",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Cash",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "19.75",
    ServiceTax: 0,
    TotalAmt: "395.00",
    TotalTax: "19.75",
    Discount: 0,
    NetAmt: "414.75",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "INW-002",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Rajkot-G – Gujarat\nState Code:24",
    FromAddress: "Pune – Maharashtra\nState Code:27",
    Remarks: "Handle with care",
    DisplayRemarks: "",
    LockDate: "04/04/2026",
    LockBy: "Ketan",
    PrintDate: "02/04/2026 12:35 PM",
    PrintBy: "Ketan",
    Count: 2,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 11,
    BookingType: "Inward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040011",
    BookingDate: "01/04/2026",
    BookingTime: "03:45 PM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Rajkot-G",
    DeliveryCity: "",
    ConsigneeName: "Rajsani xxx Polymers",
    ConsignorName: "Mayur xxx Marketing",
    FromCity: "Bangalore",
    PaymentType: "Paid",
    Status: "Delivered",
    BookedFrom: "Bangalore",
    Load: "own",
    FromBookingOffice: "Bangalore",
    ToBookingOffice: "Greenland",
    ConsignorAccount: "Mayur xxx Marketing",
    ConsigneeAccount: "Rajsani xxx Polymers",
    ConsignorPhone: "",
    ConsigneePhone: "9876500005",
    FromGSTNo: "29MAY1234C1ZT",
    ToGSTNo: "24RAJ8586E1ZF",
    EWayBillNo: "330284646503",
    BillNo: "D33",
    BillValue: 18500,
    Item: "Drum",
    PartNo: "",
    Quantity: 8,
    Weight: 280,
    Rate: 3.2,
    FreightAmount: 896,
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
    PaymentMode: "Cheque",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "44.80",
    ServiceTax: 0,
    TotalAmt: "896.00",
    TotalTax: "44.80",
    Discount: 0,
    NetAmt: "940.80",
    Received: 896,
    RefUser: "",
    CashCredit: false,
    PayReceived: true,
    PayReceivedDate: "2026-04-04",
    ReferenceNo: "INW-003",
    ReferenceDate: "",
    InvoiceNo: "INV-D33",
    BankName: "Axis Bank",
    ToAddress: "Rajkot-G – Gujarat\nState Code:24",
    FromAddress: "Bangalore – Karnataka\nState Code:29",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 03:50 PM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
];

const MOCK_DATA = {
  cities: [
    "Rajkot-G – Gujarat",
    "Chakan – Maharashtra",
    "Nasik – Maharashtra",
    "Hyderabad – Telangana",
    "Pune – Maharashtra",
    "Mumbai – Maharashtra",
    "Bangalore – Karnataka",
    "Vasai – Maharashtra",
    "Boriwali – Maharashtra",
  ],
  parties: [
    "Balaji Tools Co.",
    "Galaxy Cutting Tooling",
    "Rajsani Polymers",
    "Ring Plus Aqua Ltd",
    "Vansh Laminate Llp",
    "Bhavya Distributors",
    "Mona Metal Foam Llp",
    "Sumit Precision Fasteners",
    "Nepolion Packaging",
    "Krishna Engineering",
    "Carver Welding Pvt. Ltd",
    "Paras Exports",
    "Paresh Plastic Pvt Ltd",
    "PARAS INDUSTRIES",
    "Varun Casting Co",
    "Mahindra Heavy Engines Ltd",
    "Amul Industries Pvt Ltd",
    "Mahindra & Mahindra Ltd",
    "Shree Ram Tempo Service",
  ],
  bookingOffices: [
    "Greenland",
    "Chakan",
    "Nasik",
    "Hyderabad",
    "Pune",
    "Vasai",
    "Mumbai",
  ],
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function apiGetBookings(fromDate, toDate, direction, search, carrierFilter) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_BOOKINGS];
      if (direction !== "All")
        result = result.filter((b) => b.BookingType === direction);
      if (carrierFilter === "truck")
        result = result.filter(
          (b) => b.LoadCarrier === "Truck" || b.Carrier === "Truck"
        );
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (b) =>
            b.BookingNo.toLowerCase().includes(s) ||
            b.ConsigneeName.toLowerCase().includes(s) ||
            b.ConsignorName.toLowerCase().includes(s) ||
            b.ToCity.toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiGetBookingById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_BOOKINGS.find((b) => b.BookingId === id) || null),
      100
    );
  });
}

function apiSaveBooking(booking) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (booking.BookingId) {
        const idx = MOCK_BOOKINGS.findIndex(
          (b) => b.BookingId === booking.BookingId
        );
        if (idx !== -1) MOCK_BOOKINGS[idx] = { ...booking };
      } else {
        booking.BookingId = MOCK_BOOKINGS.length + 1;
        booking.BookingNo =
          "RKG2104" + String(booking.BookingId).padStart(4, "0");
        booking.Status = "Pending";
        booking.BookingMadeBy = "CargoNet User";
        booking.PrintDate = new Date().toLocaleString();
        booking.PrintBy = "Admin";
        booking.Count = 1;
        MOCK_BOOKINGS.push(booking);
      }
      resolve({ success: true, data: booking });
    }, 250);
  });
}

// ─────────────────────────────────────────────
export default {
  name: "DMSTruckBooking",

  data() {
    // Fixed — this page is only ever the "Truck Booking" list now (see the
    // separate DMSBBooking.vue / DMSBooking.vue pages for those modes).
    const mode = "truck";
    return {
      activeMode: mode,
      bookings: [],
      filteredBookings: [],
      fromDate: this.defaultFromDate(mode),
      toDate: this.defaultToDate(mode),
      direction: "All",
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },

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
    canAddEdit() {
      return this.activeMode !== "bbooking";
    },

    tableColumns() {
      return this.baseColumns;
    },

    dialogCarrierOptions() {
      return this.activeMode === "truck" ? ["Truck"] : ["Own", "Truck", "Air"];
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
    maskName(name) {
      if (!name) return "";
      const words = String(name).trim().split(/\s+/);
      if (words.length <= 1) return words[0];
      if (words.length === 2) return `${words[0]} xxx ${words[1]}`;
      return `${words[0]} xxx ${words[words.length - 1]}`;
    },

    defaultFromDate(mode) {
      return mode === "bbooking" ? "2026-04-01" : "2026-04-01";
    },

    defaultToDate(mode) {
      return mode === "bbooking" ? "2027-03-31" : "2026-04-01";
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
      const carrierFilter = this.activeMode === "truck" ? "truck" : "all";
      const result = await apiGetBookings(
        this.fromDate,
        this.toDate,
        this.direction,
        this.searchText,
        carrierFilter
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
        Carrier: this.activeMode === "truck" ? "Truck" : "Own",
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
      this.showBookingDialog = true;
    },

    async viewBooking(row) {
      const data = await apiGetBookingById(row.BookingId);
      this.form = { ...data };
      this.dialogMode = "view";
      this.showBookingDialog = true;
    },

    async editBooking(row) {
      const data = await apiGetBookingById(row.BookingId);
      this.form = { ...data };
      this.dialogMode = "edit";
      this.showBookingDialog = true;
    },

    async saveBooking() {
      this.calcTotal();
      const res = await apiSaveBooking({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Booking saved!",
          color: "positive",
          position: "top",
        });
        this.showBookingDialog = false;
        await this.loadBookings();
      }
    },

    async saveAndCopy() {
      await this.saveBooking();
      const copy = { ...this.form, BookingId: null, BookingNo: "" };
      this.form = copy;
      this.dialogMode = "add";
      this.showBookingDialog = true;
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
      ${logoDataUrl ? `<img src="${logoDataUrl}" alt="iCode Technologies" />` : ""}
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

<style scoped>
/* JobDetailsGrid.vue's actual per-row/per-cell padding + grid-line borders
   come from rules scoped under ".nvocc-form-page .job-details-grid-table
   .m-table-style" (nvocc-common.css) — this page isn't an NVOCC page, so
   adopting that class would also drag in NVOCC's field/button/color
   overrides. Replicating just the padding/border/row-height values here
   instead, scoped to this page's own table. */
:deep(.m-table-style thead th) {
  border-right: 1px solid #54c7ff !important;
}
:deep(.m-table-style thead th:last-child) {
  border-right: 0 !important;
}
:deep(.m-table-style tbody tr) {
  height: 38px;
}
:deep(.m-table-style tbody td) {
  height: 38px;
  padding: 5px 8px !important;
  border-right: 1px solid #d0efff !important;
  border-bottom: 1px solid #d0efff !important;
}
:deep(.m-table-style tbody td:first-child) {
  padding: 5px 10px !important;
}
:deep(.m-table-style tbody td:last-child) {
  border-right: 0 !important;
}
/* Action column — sized to its icon buttons instead of a fixed width, and
   vertically centered rather than sharing the text cells' padding. */
:deep(.m-table-style tbody td.booking-action-td) {
  width: 1px;
  white-space: nowrap;
  padding: 0 10px !important;
  vertical-align: middle;
}

.field-label {
  display: block;
  font-size: 11px;
  color: #555;
  margin-bottom: 2px;
  font-weight: 500;
}
.button-container {
  white-space: nowrap;
}

/* ── Mobile card (grid mode) ── */
.dms-mobile-card {
  background: #fff;
  border: 1px solid #e0e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  margin: 6px 8px;
  box-shadow: 0 1px 4px rgba(1,120,188,.10);
  width: calc(100% - 16px);
}
.dms-mc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.dms-mc-bno {
  font-size: 13px;
  font-weight: 700;
  color: #0178bc;
  letter-spacing: .3px;
}
.dms-mc-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 6px;
}
.dms-mc-chip {
  font-size: 11px;
  color: #444;
}
.dms-mc-route {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #222;
}
.dms-mc-city { font-size: 12px; }
.dms-mc-parties {
  border-top: 1px dashed #d0dce8;
  padding-top: 5px;
  margin-bottom: 6px;
  font-size: 11px;
  color: #333;
}
.dms-mc-party {
  display: flex;
  gap: 4px;
  margin-bottom: 2px;
}
.dms-mc-plabel {
  font-weight: 600;
  color: #0178bc;
  min-width: 32px;
}
.dms-mc-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eef2f7;
  padding-top: 6px;
}
.dms-mc-carrier {
  font-size: 11px;
  color: #666;
  font-style: italic;
}

</style>
