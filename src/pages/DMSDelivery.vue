<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Delivery</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="inventory_2" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredRows.length }}</span>
                <span class="total-stat-label">Total Bookings</span>
              </div>
            </div>
            <div class="total-stat-tile total-stat-tile--inline q-ml-sm">
              <q-icon name="pending_actions" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ pendingCount }}</span>
                <span class="total-stat-label">Pending</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — one row per booking eligible for delivery (mirrors
               PreDeliveryListDTO from EagleParcel-API's Delivery module).
               "Deliver" captures the delivery on a Pending row; Delivered
               rows get View/Edit/Delete instead. ── -->
          <q-table
            square
            :rows="filteredRows"
            :columns="tableColumns"
            row-key="PreDeliveryID"
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
                  <div class="search-combo-wrapper">
                    <input
                      v-model="searchText"
                      class="search-combo-input"
                      placeholder="Search Any"
                      @keyup.enter="loadRows"
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
                      @click="loadRows"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-select
                    square=""
                    v-model="recordType"
                    :options="['All', 'Pending', 'Delivered']"
                    dense
                    outlined
                    bg-color="blue-1"
                    style="width: 120px"
                    class="q-mx-xs"
                    @update:model-value="loadRows"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadRows"
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

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.DeliveryID ? 'positive' : 'orange'"
                  :label="props.row.DeliveryID ? 'Delivered' : 'Pending'"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-PaymentType="props">
              <q-td :props="props">
                <q-badge
                  outline
                  :color="paymentColor(props.value)"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <template v-if="!props.row.DeliveryID">
                  <q-btn
                    icon="local_shipping"
                    color="primary"
                    dense
                    outline
                    class="edit-icon-style"
                    @click="openDeliver(props.row)"
                  >
                    <q-tooltip>Deliver</q-tooltip>
                  </q-btn>
                </template>
                <template v-else>
                  <q-btn
                    icon="fa-solid fa-eye"
                    color="primary"
                    dense
                    outline
                    class="edit-icon-style vw"
                    @click="viewDelivery(props.row)"
                  >
                    <q-tooltip>View</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="fa-solid fa-pen-to-square"
                    color="primary"
                    dense
                    outline
                    class="edit-icon-style mody"
                    @click="editDelivery(props.row)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="fa-solid fa-trash"
                    color="negative"
                    dense
                    outline
                    class="edit-icon-style q-ml-xs"
                    @click="deleteDelivery(props.row)"
                  >
                    <q-tooltip>Undo Delivery</q-tooltip>
                  </q-btn>
                </template>
              </q-td>
            </template>

            <!-- ── Mobile card (grid mode) ── -->
            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.PreDeliveryID)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="inventory_2" size="14px" />
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
                      :color="props.row.DeliveryID ? 'positive' : 'orange'"
                    >
                      {{ props.row.DeliveryID ? "Delivered" : "Pending" }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.PreDeliveryID)
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
                    v-if="!props.row.DeliveryID"
                    dense
                    unelevated
                    icon="local_shipping"
                    label="Deliver"
                    class="mjc-btn mjc-btn-edit"
                    @click="openDeliver(props.row)"
                  />
                  <template v-else>
                    <q-btn
                      dense
                      unelevated
                      icon="fa-solid fa-eye"
                      label="View"
                      class="mjc-btn mjc-btn-view"
                      @click="viewDelivery(props.row)"
                    />
                    <q-btn
                      dense
                      unelevated
                      icon="fa-solid fa-pen-to-square"
                      label="Edit"
                      class="mjc-btn mjc-btn-edit"
                      @click="editDelivery(props.row)"
                    />
                  </template>
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.PreDeliveryID)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Route</span>
                        <span class="mjc-detail-value">
                          {{ props.row.FromCity }} → {{ props.row.ToCity }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignee</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ToPartyName }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Net Amt.</span>
                        <span class="mjc-detail-value">
                          {{ props.row.NetAmount }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Receiver</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ReceiverName || "—" }}
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
import {
  apiGetPreDeliveryList,
  apiDeleteDelivery,
} from "src/data/deliveryData.js";

export default {
  name: "DMSDelivery",

  // "Deliver"/"View"/"Edit" open the capture form as a page in a new tab
  // (DMSDeliveryView.vue) via the tab shell's injected openTab() — same
  // convention as DMSTrip.vue's viewTrip()/openTab pair.
  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      filteredRows: [],
      recordType: "All",
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      baseColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "Status",
          label: "Status",
          field: "Status",
          align: "center",
          sortable: true,
        },
        {
          name: "BookingNo",
          label: "Booking No",
          field: "BookingNo",
          sortable: true,
        },
        {
          name: "BookingDate",
          label: "Booking Date",
          field: "BookingDate",
          sortable: true,
        },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
        { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
        { name: "ItemName", label: "Item", field: "ItemName" },
        { name: "Qty", label: "Qty", field: "Qty", align: "right" },
        { name: "Weight", label: "Weight", field: "Weight", align: "right" },
        {
          name: "PaymentType",
          label: "Payment",
          field: "PaymentType",
          align: "center",
        },
        {
          name: "NetAmount",
          label: "Net Amt.",
          field: "NetAmount",
          align: "right",
          sortable: true,
        },
        {
          name: "ReceivedAmount",
          label: "Received",
          field: "ReceivedAmount",
          align: "right",
        },
        { name: "EWayBillNo", label: "E-Way Bill No.", field: "EWayBillNo" },
        { name: "ReceiverName", label: "Receiver", field: "ReceiverName" },
        {
          name: "DeliveryDate",
          label: "Delivery Date",
          field: "DeliveryDate",
          sortable: true,
        },
      ],

      visibleColumns: [
        "action",
        "Status",
        "BookingNo",
        "BookingDate",
        "FromCity",
        "ToCity",
        "FromPartyName",
        "ToPartyName",
        "ItemName",
        "Qty",
        "Weight",
        "PaymentType",
        "NetAmount",
        "ReceivedAmount",
        "EWayBillNo",
        "ReceiverName",
        "DeliveryDate",
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    columnOptions() {
      return [{ name: "all", label: "Select All" }, ...this.baseColumns];
    },
    pendingCount() {
      return this.filteredRows.filter((r) => !r.DeliveryID).length;
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.filteredRows.length / rows));
    },
  },

  mounted() {
    this.loadRows();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadRows();
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

    async loadRows() {
      // No field-picker in the toolbar (matches the Booking-family
      // pattern) — searches across the common fields at once, see
      // deliveryData.js's apiGetPreDeliveryList for the multi-field
      // fallback when searchField is omitted.
      this.filteredRows = await apiGetPreDeliveryList(
        this.recordType,
        this.searchText
      );
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

    openDeliver(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSDeliveryView?bookingId=${row.BookingID}&mode=add`,
          `Deliver ${row.BookingNo}`.trim()
        );
      }
    },

    viewDelivery(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSDeliveryView?deliveryId=${row.DeliveryID}&mode=view`,
          `Delivery ${row.BookingNo}`.trim()
        );
      }
    },

    editDelivery(row) {
      if (this.openTab) {
        this.openTab(
          `/DMSDeliveryView?deliveryId=${row.DeliveryID}&mode=edit`,
          `Delivery ${row.BookingNo}`.trim()
        );
      }
    },

    async deleteDelivery(row) {
      const res = await apiDeleteDelivery(row.DeliveryID);
      if (res.success) {
        this.$q.notify({
          message: `Delivery for ${row.BookingNo} undone — booking moved back to Pending.`,
          color: "positive",
          position: "top",
        });
        await this.loadRows();
      }
    },
  },
};
</script>
