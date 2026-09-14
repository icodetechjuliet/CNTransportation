<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">SI</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="receipt_long" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ rows.length }}</span>
                <span class="total-stat-label">Sales Invoices</span>
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
            row-key="SIID"
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
                    unelevated
                    dense
                    no-caps
                    icon="add"
                    label="New SI"
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
// Self-contained mock data — same "no live API yet" pattern as
// DMSTripCharge.vue. "SI Posting"/"SI Email" (reportsData.js) are separate,
// read-only report screens over their own illustrative rows rather than
// this list, since neither has a real posting/emailing engine to share yet.
const MOCK_SI = [
  {
    SIID: 1,
    SINo: "SI20260001",
    SIDate: "01-04-2026",
    InvoiceType: "Tax Invoice",
    PartyName: "Rajsani Polymers",
    PartyGST: "24RAJ8586E1ZF",
    GSTRate: 5,
    TaxableValue: 12500,
    GSTAmount: "625.00",
    TotalAmount: "13125.00",
    Remarks: "",
  },
  {
    SIID: 2,
    SINo: "SI20260002",
    SIDate: "02-04-2026",
    InvoiceType: "Tax Invoice",
    PartyName: "Varun Casting Co",
    PartyGST: "24VAR1234F1ZK",
    GSTRate: 18,
    TaxableValue: 8400,
    GSTAmount: "1512.00",
    TotalAmount: "9912.00",
    Remarks: "",
  },
];

function apiGetSIList() {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_SI]), 150));
}

function apiSaveSI(si) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (si.SIID) {
        const idx = MOCK_SI.findIndex((s) => s.SIID === si.SIID);
        if (idx !== -1) MOCK_SI[idx] = { ...si };
      } else {
        si.SIID = MOCK_SI.length
          ? Math.max(...MOCK_SI.map((s) => s.SIID)) + 1
          : 1;
        si.SINo = "SI2026" + String(si.SIID).padStart(4, "0");
        MOCK_SI.push(si);
      }
      resolve({ success: true, data: si });
    }, 200);
  });
}

function apiDeleteSI(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_SI.findIndex((s) => s.SIID === id);
      if (idx !== -1) MOCK_SI.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

export default {
  mixins: [entryNavigation],
  entryReload: "loadRows",
  name: "DMSSaleSI",

  data() {
    return {
      rows: [],
      pagination: { page: 1, rowsPerPage: 15 },

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      baseColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
        { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
        { name: "InvoiceType", label: "Invoice Type", field: "InvoiceType" },
        {
          name: "PartyName",
          label: "Party",
          field: "PartyName",
          sortable: true,
        },
        {
          name: "TaxableValue",
          label: "Taxable Value",
          field: "TaxableValue",
          align: "right",
        },
        {
          name: "GSTAmount",
          label: "GST Amt.",
          field: "GSTAmount",
          align: "right",
        },
        {
          name: "TotalAmount",
          label: "Total Amt.",
          field: "TotalAmount",
          align: "right",
          sortable: true,
        },
      ],
    };
  },

  computed: {
    tableColumns() {
      return this.baseColumns;
    },
  },

  mounted() {
    this.loadRows();
  },

  methods: {
    async loadRows() {
      this.rows = await apiGetSIList();
    },

    emptyForm() {
      return {
        SIID: null,
        SINo: "",
        SIDate: "",
        InvoiceType: "Tax Invoice",
        PartyName: "",
        PartyGST: "",
        GSTRate: 5,
        TaxableValue: 0,
        GSTAmount: "0.00",
        TotalAmount: "0.00",
        Remarks: "",
      };
    },

    calcTotal() {
      const taxable = parseFloat(this.form.TaxableValue) || 0;
      const rate = parseFloat(this.form.GSTRate) || 0;
      const gst = (taxable * rate) / 100;
      this.form.GSTAmount = gst.toFixed(2);
      this.form.TotalAmount = (taxable + gst).toFixed(2);
    },

    openAdd() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSSaleSIForm?mode=${this.dialogMode}&id=${this.form.SIID || ""}`,
          "Sale SI"
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
          `/DMSSaleSIForm?mode=${this.dialogMode}&id=${this.form.SIID || ""}`,
          "Sale SI"
        );
      }
    },

    async save() {
      this.calcTotal();
      const res = await apiSaveSI({ ...this.form });
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "SI saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.notifyEntrySaved();
        await this.loadRows();
      }
    },

    async deleteRow(row) {
      const res = await apiDeleteSI(row.SIID);
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "SI deleted.",
          color: "positive",
          position: "top",
        });
        await this.loadRows();
      }
    },
  },
};
</script>
