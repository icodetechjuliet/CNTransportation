<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Door Delivery</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="local_shipping" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredRows.length }}</span>
                <span class="total-stat-label">Door Delivery Runs</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Grid — mirrors EagleParcel-API's DEL_DoorDeliveryENT /
               GET-POST-PUT /api/Delivery/door-delivery. ── -->
          <q-table
            square
            :rows="filteredRows"
            :columns="tableColumns"
            row-key="DoorDeliveryID"
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
                  <!-- Plain gradient chip, not the ".add_new_job" class
                       family — see DMSTrip.vue's "Raise New TripSheet"
                       button for why (its CSS-injected ::after text
                       overlaps/garbles a real `label` prop). -->
                  <q-btn
                    unelevated
                    dense
                    no-caps
                    icon="add"
                    label="New Door Delivery"
                    class="bg-dblue-lblue text-white radius-md q-px-sm text-no-wrap"
                    @click="openAdd"
                  />

                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
                    mask="##-##-####"
                    style="width: 130px"
                    class="q-mx-sm"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="fromDate" mask="DD-MM-YYYY" color="black">
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
                    mask="##-##-####"
                    style="width: 130px"
                    class="q-mx-xs"
                  >
                    <template v-slot:append>
                      <q-icon name="event" round color="black">
                        <q-popup-proxy
                          color="black"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="toDate" mask="DD-MM-YYYY" color="black">
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
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="loadRows"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />

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

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="openEdit(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style q-ml-xs"
                  @click="deleteRow(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import entryNavigation from "src/mixins/entryNavigation.js";
import {
  apiGetDoorDeliveries,
  apiSaveDoorDelivery,
  apiDeleteDoorDelivery,
  MOCK_DATA,
} from "src/data/deliveryData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadRows",
  name: "DMSDoorDelivery",

  data() {
    return {
      rows: [],
      fromDate: "01-04-2026",
      toDate: "04-04-2026",
      pagination: { page: 1, rowsPerPage: 15 },
      mockData: MOCK_DATA,

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      baseColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "DoorDeliveryNo",
          label: "Door Delivery No.",
          field: "DoorDeliveryNo",
          sortable: true,
        },
        {
          name: "DoorDeliveryDate",
          label: "Date",
          field: "DoorDeliveryDate",
          sortable: true,
        },
        { name: "DoorDeliveryName", label: "Name", field: "DoorDeliveryName" },
        { name: "Vehicle", label: "Vehicle", field: "Vehicle" },
        {
          name: "TransporterAccount",
          label: "Transporter",
          field: "TransporterAccount",
        },
        {
          name: "ReceivableAmount",
          label: "Receivable",
          field: "ReceivableAmount",
          align: "right",
        },
        {
          name: "VehicleAmount",
          label: "Vehicle Amt.",
          field: "VehicleAmount",
          align: "right",
        },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    filteredRows() {
      const from = this.parseDMDDate(this.fromDate);
      const to = this.parseDMDDate(this.toDate);
      if (!from && !to) return this.rows;
      return this.rows.filter((r) => {
        const rDate = this.parseDMDDate(r.DoorDeliveryDate);
        if (!rDate) return true;
        if (from && rDate < from) return false;
        if (to && rDate > to) return false;
        return true;
      });
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
    parseDMDDate(dateStr) {
      if (!dateStr) return null;
      const [d, m, y] = dateStr.split("-").map(Number);
      if (!d || !m || !y) return null;
      return new Date(y, m - 1, d);
    },

    handlePageChange(page) {
      this.pagination.page = page;
    },

    async loadRows() {
      this.rows = await apiGetDoorDeliveries();
    },

    emptyForm() {
      return {
        DoorDeliveryID: null,
        DoorDeliveryNo: "",
        DoorDeliveryDate: "",
        Vehicle: "",
        TransporterAccount: "",
        DoorDeliveryRate: "",
        DoorDeliveryName: "",
        ReceivableAmount: 0,
        VehicleAmount: 0,
        IsDoorCollection: false,
        RateType: "InvoiceWise",
        Remarks: "",
      };
    },

    openAdd() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSDoorDeliveryForm?mode=${this.dialogMode}&id=${
            this.form.DoorDeliveryID || ""
          }`,
          "Door Delivery"
        );
      }
    },

    openEdit(row) {
      this.form = { ...row };
      this.dialogMode = "edit";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSDoorDeliveryForm?mode=${this.dialogMode}&id=${
            this.form.DoorDeliveryID || ""
          }`,
          "Door Delivery"
        );
      }
    },

    async save() {
      try {
        const res = await apiSaveDoorDelivery({ ...this.form });
        if (res.success) {
          if (this.entryPage && res.data) {
            this.form = { ...res.data };
            this.dialogMode = "edit";
          }
          this.$q.notify({
            message: "Door delivery saved!",
            color: "positive",
            position: "top",
          });
          this.showDialog = false;
          this.notifyEntrySaved();
          await this.loadRows();
        }
      } catch (err) {
        this.$q.notify({
          message: err.message,
          color: "negative",
          position: "top",
        });
      }
    },

    async deleteRow(row) {
      const res = await apiDeleteDoorDelivery(row.DoorDeliveryID);
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Door delivery deleted.",
          color: "positive",
          position: "top",
        });
        await this.loadRows();
      }
    },
  },
};
</script>
