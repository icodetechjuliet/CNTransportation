<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Door Delivery Invoice</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="receipt_long" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredInvoices.length }}</span>
                <span class="total-stat-label">Invoices</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <!-- ── Invoices already generated ── -->
          <q-table
            square
            :rows="filteredInvoices"
            :columns="invoiceColumns"
            row-key="InvoiceID"
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
                  <q-input
                    square
                    dense
                    outlined
                    bg-color="blue-1"
                    v-model="fromDate"
                    label="From Date"
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
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadAll"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value === 'Paid' ? 'positive' : 'orange'"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-print"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="printInvoice(props.row)"
                >
                  <q-tooltip>Print</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- ── Door deliveries still awaiting an invoice ── -->
          <div class="row items-center q-px-sm q-pt-md q-pb-xs">
            <q-icon
              name="pending_actions"
              size="18px"
              class="q-mr-xs text-primary"
            />
            <span class="text-subtitle2 text-weight-bold">
              Pending Invoice Generation
            </span>
          </div>
          <q-table
            square
            flat
            bordered
            :rows="pendingDoorDeliveries"
            :columns="pendingColumns"
            row-key="DoorDeliveryID"
            :rows-per-page-options="[10, 25, 50]"
            table-class="text-white-8 m-table-style"
            table-header-class="text-black"
          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="receipt_long"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="generateInvoice(props.row)"
                >
                  <q-tooltip>Generate Invoice</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-6 q-pa-md">
                Every door delivery already has an invoice.
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
  apiGetDoorDeliveries,
  apiGetDoorDeliveryInvoices,
  apiGenerateInvoiceFromDoorDelivery,
} from "src/data/deliveryData.js";

export default {
  name: "DMSDoorDeliveryInvoice",

  data() {
    return {
      doorDeliveries: [],
      invoices: [],
      fromDate: "01-04-2026",
      toDate: "04-04-2026",
      pagination: { page: 1, rowsPerPage: 15 },

      invoiceColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "InvoiceNo",
          label: "Invoice No.",
          field: "InvoiceNo",
          sortable: true,
        },
        {
          name: "InvoiceDate",
          label: "Date",
          field: "InvoiceDate",
          sortable: true,
        },
        {
          name: "DoorDeliveryNo",
          label: "Door Delivery No.",
          field: "DoorDeliveryNo",
        },
        { name: "Transporter", label: "Transporter", field: "Transporter" },
        { name: "Vehicle", label: "Vehicle", field: "Vehicle" },
        {
          name: "Amount",
          label: "Amount",
          field: "Amount",
          align: "right",
          sortable: true,
        },
        {
          name: "TDSAmount",
          label: "TDS",
          field: "TDSAmount",
          align: "right",
        },
        {
          name: "NetAmount",
          label: "Net Amount",
          field: "NetAmount",
          align: "right",
        },
        { name: "Status", label: "Status", field: "Status", align: "center" },
      ],

      pendingColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "DoorDeliveryNo",
          label: "Door Delivery No.",
          field: "DoorDeliveryNo",
        },
        { name: "DoorDeliveryDate", label: "Date", field: "DoorDeliveryDate" },
        {
          name: "TransporterAccount",
          label: "Transporter",
          field: "TransporterAccount",
        },
        { name: "Vehicle", label: "Vehicle", field: "Vehicle" },
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
    pendingDoorDeliveries() {
      const invoicedIds = new Set(this.invoices.map((i) => i.DoorDeliveryID));
      return this.doorDeliveries.filter(
        (d) => !invoicedIds.has(d.DoorDeliveryID)
      );
    },
    filteredInvoices() {
      const from = this.parseDMDDate(this.fromDate);
      const to = this.parseDMDDate(this.toDate);
      if (!from && !to) return this.invoices;
      return this.invoices.filter((i) => {
        const iDate = this.parseDMDDate(i.InvoiceDate);
        if (!iDate) return true;
        if (from && iDate < from) return false;
        if (to && iDate > to) return false;
        return true;
      });
    },
  },

  mounted() {
    this.loadAll();
  },

  methods: {
    parseDMDDate(dateStr) {
      if (!dateStr) return null;
      const [d, m, y] = dateStr.split("-").map(Number);
      if (!d || !m || !y) return null;
      return new Date(y, m - 1, d);
    },

    async loadAll() {
      this.doorDeliveries = await apiGetDoorDeliveries();
      this.invoices = await apiGetDoorDeliveryInvoices();
    },

    async generateInvoice(row) {
      try {
        const res = await apiGenerateInvoiceFromDoorDelivery(
          row.DoorDeliveryID
        );
        if (res.success) {
          this.$q.notify({
            message: `Invoice ${res.data.InvoiceNo} generated!`,
            color: "positive",
            position: "top",
          });
          await this.loadAll();
        }
      } catch (err) {
        this.$q.notify({
          message: err.message,
          color: "negative",
          position: "top",
        });
      }
    },

    printInvoice(row) {
      const html = `<!doctype html><html><head><title>${row.InvoiceNo}</title>
        <style>body{font-family:Arial,sans-serif;font-size:12px;padding:16px}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{border:1px solid #ccc;padding:6px 10px;text-align:left}
        h2{margin-bottom:4px}</style></head><body>
        <h2>Door Delivery Invoice — ${row.InvoiceNo}</h2>
        <div>Date: ${row.InvoiceDate} &nbsp; Status: ${row.Status}</div>
        <table><tbody>
          <tr><th>Door Delivery No.</th><td>${row.DoorDeliveryNo}</td></tr>
          <tr><th>Transporter</th><td>${row.Transporter}</td></tr>
          <tr><th>Vehicle</th><td>${row.Vehicle}</td></tr>
          <tr><th>Amount</th><td>${row.Amount}</td></tr>
          <tr><th>TDS</th><td>${row.TDSAmount || 0}</td></tr>
          <tr><th>Net Amount</th><td>${row.NetAmount ?? row.Amount}</td></tr>
        </tbody></table>
        </body></html>`;
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
      }
    },
  },
};
</script>
