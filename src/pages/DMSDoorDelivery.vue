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
                <span class="total-stat-count">{{ rows.length }}</span>
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
            dense
            :rows="rows"
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
              <span class="q-ml-md">Page {{ pagination.page }} of {{ maxPages }}</span>
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
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style q-ml-xs"
                  @click="deleteRow(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <!-- ══════════════════════════════════════
         Door Delivery Add / Edit Dialog — canonical compact-dialog shape.
    ══════════════════════════════════════ -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 560px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ dialogMode === "add" ? "New Door Delivery" : "Edit Door Delivery" }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <span class="field-label">Door Delivery Date</span>
              <q-input v-model="form.DoorDeliveryDate" dense outlined bg-color="blue-1" placeholder="dd-mm-yyyy">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="ddDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.DoorDeliveryDate" mask="DD-MM-YYYY" minimal style="width: 280px" @update:model-value="$refs.ddDateProxy.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <span class="field-label">Door Delivery Name</span>
              <q-input v-model="form.DoorDeliveryName" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <span class="field-label">Vehicle</span>
              <q-select v-model="form.Vehicle" :options="mockData.vehicles" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <span class="field-label">Transporter Account</span>
              <q-select v-model="form.TransporterAccount" :options="mockData.transporters" dense outlined bg-color="blue-1" use-input fill-input display-value="" input-debounce="0" />
            </div>
            <div class="col-6">
              <span class="field-label">Rate Type</span>
              <q-select v-model="form.RateType" :options="mockData.rateTypes" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <span class="field-label">Door Delivery Rate</span>
              <q-input v-model="form.DoorDeliveryRate" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <span class="field-label">Receivable Amount</span>
              <q-input v-model="form.ReceivableAmount" type="number" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <span class="field-label">Vehicle Amount</span>
              <q-input v-model="form.VehicleAmount" type="number" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <q-item tag="label" v-ripple bg-color="blue-1" class="chckbx-style full-width">
                <q-item-section avatar>
                  <q-checkbox dense v-model="form.IsDoorCollection" />
                </q-item-section>
                <q-item-section>
                  <q-item-label dense>Door Collection</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12">
              <span class="field-label">Remarks</span>
              <q-input v-model="form.Remarks" dense outlined bg-color="blue-1" type="textarea" :rows="2" autogrow />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-gutter-sm q-pt-none q-pb-none q-pr-none">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="primary" class="m-btn-style" label="Save" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  apiGetDoorDeliveries,
  apiSaveDoorDelivery,
  apiDeleteDoorDelivery,
  MOCK_DATA,
} from "src/data/deliveryData.js";

export default {
  name: "DMSDoorDelivery",

  data() {
    return {
      rows: [],
      pagination: { page: 1, rowsPerPage: 15 },
      mockData: MOCK_DATA,

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      baseColumns: [
        { name: "DoorDeliveryNo", label: "Door Delivery No.", field: "DoorDeliveryNo", sortable: true },
        { name: "DoorDeliveryDate", label: "Date", field: "DoorDeliveryDate", sortable: true },
        { name: "DoorDeliveryName", label: "Name", field: "DoorDeliveryName" },
        { name: "Vehicle", label: "Vehicle", field: "Vehicle" },
        { name: "TransporterAccount", label: "Transporter", field: "TransporterAccount" },
        { name: "ReceivableAmount", label: "Receivable", field: "ReceivableAmount", align: "right" },
        { name: "VehicleAmount", label: "Vehicle Amt.", field: "VehicleAmount", align: "right" },
        { name: "action", label: "Action", field: "action" },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
    maxPages() {
      const rows = this.pagination.rowsPerPage || 15;
      return Math.max(1, Math.ceil(this.rows.length / rows));
    },
  },

  mounted() {
    this.loadRows();
  },

  methods: {
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
      this.showDialog = true;
    },

    openEdit(row) {
      this.form = { ...row };
      this.dialogMode = "edit";
      this.showDialog = true;
    },

    async save() {
      try {
        const res = await apiSaveDoorDelivery({ ...this.form });
        if (res.success) {
          this.$q.notify({ message: "Door delivery saved!", color: "positive", position: "top" });
          this.showDialog = false;
          await this.loadRows();
        }
      } catch (err) {
        this.$q.notify({ message: err.message, color: "negative", position: "top" });
      }
    },

    async deleteRow(row) {
      const res = await apiDeleteDoorDelivery(row.DoorDeliveryID);
      if (res.success) {
        this.$q.notify({ message: "Door delivery deleted.", color: "positive", position: "top" });
        await this.loadRows();
      }
    },
  },
};
</script>

<style scoped>
.field-label {
  display: block;
  font-size: 11px;
  color: #555;
  margin-bottom: 2px;
  font-weight: 500;
}
</style>
