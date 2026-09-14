<template><div>
    <q-card flat text-color="grey-7">
      <div class="row q-gutte-y-md q-pt-xs items-start" v-show="showTotals">
        <div class="col-12 col-md-3 q-pa-sm">
          <q-card flat class="full-height bdr-blue-1">
            <!-- Header -->
            <div
              class="bg-blue-white text-black text-weight-medium q-pa-sm text-center"
            >
              Total Receivable Amount
            </div>

            <!-- Table -->
            <q-table
              :rows="CurTotalRecdetails"
              :columns="CurTotalColumns"
              table-class="text-white-8"
              class="q-py-sm"
              table-header-class="text-black bg-blue-2"
              row-key="CurType"
              
              flat
              separator="cell"
              :pagination="false"
              hide-bottom
              no-data-label="No currency data available"
            >
              <!-- Amount formatting -->
              <template v-slot:body-cell-Amount="props">
                <q-td :props="props" class="text-right text-weight-bold">
                  {{ Number(props.row.Amount || 0).toFixed(2) }}
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>

        <div class="col-12 col-md-3 q-pa-sm">
          <q-card flat class="full-height bdr-blue-1">
            <!-- Header -->
            <div
              class="bg-blue-white text-black text-weight-medium q-pa-sm text-center"
            >
              Total Payable Amount
            </div>

            <!-- Table -->
            <q-table
              :rows="CurTotalPaydetails"
              table-class="text-white-8"
              table-header-class="text-black bg-blue-2"
              class="q-py-sm"
              :columns="CurTotalColumns"
              row-key="CurType"
              
              flat
              separator="cell"
              :pagination="false"
              hide-bottom
              no-data-label="No currency data available"
            >
              <!-- Amount formatting -->
              <template v-slot:body-cell-Amount="props">
                <q-td :props="props" class="text-right text-weight-bold">
                  {{ Number(props.row.Amount || 0).toFixed(2) }}
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>
        <div class="col-12 col-md-3 q-pa-sm">
          <q-card flat class="full-height bdr-blue-1">
            <!-- Header -->
            <div
              class="bg-blue-white text-black text-weight-medium q-pa-sm text-center"
            >
              Total Advance Received
            </div>

            <!-- Table -->
            <q-table
              :rows="CurTotalAdrdetails"
              table-class="text-white-8"
              table-header-class="text-black bg-blue-2"
              class="q-py-sm"
              :columns="CurTotalColumns"
              row-key="CurType"
              
              flat
              separator="cell"
              :pagination="false"
              hide-bottom
              no-data-label="No currency data available"
            >
              <!-- Amount formatting -->
              <template v-slot:body-cell-Amount="props">
                <q-td :props="props" class="text-right text-weight-bold">
                  {{ Number(props.row.Amount || 0).toFixed(2) }}
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>
        <div class="col-12 col-md-3 q-pa-sm">
          <q-card flat class="full-height bdr-blue-1">
            <!-- Header -->
            <div
              class="bg-blue-white text-black text-weight-medium q-pa-sm text-center"
            >
              Total Advance Paid
            </div>

            <!-- Table -->
            <q-table
              :rows="CurTotalAdpdetails"
              :columns="CurTotalColumns"
              table-class="text-white-8"
              table-header-class="text-black bg-blue-2"
              class="q-py-sm"
              row-key="CurType"
              
              flat
              separator="cell"
              :pagination="false"
              hide-bottom
              no-data-label="No currency data available"
            >
              <!-- Amount formatting -->
              <template v-slot:body-cell-Amount="props">
                <q-td :props="props" class="text-right text-weight-bold">
                  {{ Number(props.row.Amount || 0).toFixed(2) }}
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>
      </div>
    </q-card>
  </div></template>

<script>
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import { LoaderMixin } from "src/mixins/Loadermixin.js";

export default {
  name: "CurrencyTotal",

  props: {
    showTotals: Boolean,
    CurTotalColumns: Array,
    CurTotalRecdetails: Array,
    CurTotalPaydetails: Array,
    CurTotalAdrdetails: Array,
    CurTotalAdpdetails: Array,
  },
  emits: [],
  mixins: [LoaderMixin],
  data() {
    return {
      CurTotaldetails: [],
    };
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>
