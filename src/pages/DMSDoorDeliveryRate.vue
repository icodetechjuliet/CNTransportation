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
  apiGetDoorDeliveryRates,
  apiSaveDoorDeliveryRate,
  apiDeleteDoorDeliveryRate,
  MOCK_DATA,
} from "src/data/deliveryData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadRows",
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
        {
          name: "RateName",
          label: "Rate Name",
          field: "RateName",
          sortable: true,
        },
        { name: "VehicleType", label: "Vehicle Type", field: "VehicleType" },
        { name: "City", label: "City", field: "City", sortable: true },
        { name: "RateType", label: "Rate Type", field: "RateType" },
        {
          name: "RateAmount",
          label: "Rate Amount",
          field: "RateAmount",
          align: "right",
          sortable: true,
        },
        {
          name: "EffectiveDate",
          label: "Effective Date",
          field: "EffectiveDate",
          sortable: true,
        },
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
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSDoorDeliveryRateForm?mode=${this.dialogMode}&id=${
            this.form.RateID || ""
          }`,
          "Door Delivery Rate"
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
          `/DMSDoorDeliveryRateForm?mode=${this.dialogMode}&id=${
            this.form.RateID || ""
          }`,
          "Door Delivery Rate"
        );
      }
    },

    async save() {
      const res = await apiSaveDoorDeliveryRate({ ...this.form });
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Rate saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.notifyEntrySaved();
        await this.loadRows();
      }
    },

    async deleteRow(row) {
      const res = await apiDeleteDoorDeliveryRate(row.RateID);
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "Rate deleted.",
          color: "positive",
          position: "top",
        });
        await this.loadRows();
      }
    },
  },
};
</script>
