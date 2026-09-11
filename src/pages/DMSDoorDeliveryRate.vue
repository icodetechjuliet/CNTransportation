<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Door Delivery Rate</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="price_change" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ rows.length }}</span>
                <span class="total-stat-label">Rates</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            dense
            :rows="rows"
            :columns="tableColumns"
            row-key="RateID"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
            card-class="text-black"
            :grid="$q.screen.lt.sm"
          >
            <template v-slot:top>
              <div class="tb-app col">
                <div class="filter-bar-wrapper accent-filter-bar">
                  <q-btn
                    flat
                    dense
                    no-caps
                    label="New Rate"
                    class="add_new_job m_add_newjob bg-dblue-lblue text-no-wrap"
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
                </div>
              </div>
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
         Rate Add / Edit Dialog — canonical compact-dialog shape.
    ══════════════════════════════════════ -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ dialogMode === "add" ? "New Rate" : "Edit Rate" }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-input v-model="form.RateName" label="Rate Name" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <q-select v-model="form.VehicleType" :options="mockData.vehicleTypes" label="Vehicle Type" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <q-select v-model="form.City" :options="mockData.cities" label="City" dense outlined bg-color="blue-1" use-input fill-input display-value="" input-debounce="0" />
            </div>
            <div class="col-6">
              <q-select v-model="form.RateType" :options="mockData.rateTypes" label="Rate Type" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <q-input v-model="form.RateAmount" type="number" label="Rate Amount" dense outlined bg-color="blue-1" />
            </div>
            <div class="col-6">
              <q-input v-model="form.EffectiveDate" label="Effective Date" placeholder="dd-mm-yyyy" dense outlined bg-color="blue-1">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="effDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.EffectiveDate" mask="DD-MM-YYYY" minimal style="width: 280px" @update:model-value="$refs.effDateProxy.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
  apiGetDoorDeliveryRates,
  apiSaveDoorDeliveryRate,
  apiDeleteDoorDeliveryRate,
  MOCK_DATA,
} from "src/data/deliveryData.js";

export default {
  name: "DMSDoorDeliveryRate",

  data() {
    return {
      rows: [],
      pagination: { page: 1, rowsPerPage: 15 },
      mockData: MOCK_DATA,

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      baseColumns: [
        { name: "RateName", label: "Rate Name", field: "RateName", sortable: true },
        { name: "VehicleType", label: "Vehicle Type", field: "VehicleType" },
        { name: "City", label: "City", field: "City", sortable: true },
        { name: "RateType", label: "Rate Type", field: "RateType" },
        { name: "RateAmount", label: "Rate Amount", field: "RateAmount", align: "right", sortable: true },
        { name: "EffectiveDate", label: "Effective Date", field: "EffectiveDate", sortable: true },
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
    async loadRows() {
      this.rows = await apiGetDoorDeliveryRates();
    },

    emptyForm() {
      return {
        RateID: null,
        RateName: "",
        VehicleType: "Own Vehicle",
        City: "",
        RateType: "InvoiceWise",
        RateAmount: 0,
        EffectiveDate: "",
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
      const res = await apiSaveDoorDeliveryRate({ ...this.form });
      if (res.success) {
        this.$q.notify({ message: "Rate saved!", color: "positive", position: "top" });
        this.showDialog = false;
        await this.loadRows();
      }
    },

    async deleteRow(row) {
      const res = await apiDeleteDoorDeliveryRate(row.RateID);
      if (res.success) {
        this.$q.notify({ message: "Rate deleted.", color: "positive", position: "top" });
        await this.loadRows();
      }
    },
  },
};
</script>
