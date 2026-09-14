<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">SI Print</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="request_quote" size="16px" />
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
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="loadRows"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>

            <template v-slot:body-cell-GSTApplicable="props">
              <q-td :props="props">
                <q-badge :color="props.row.GSTApplicable ? 'blue' : 'orange'">
                  {{ props.row.GSTApplicable ? "GST" : "Service Tax" }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="print"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style prt"
                  @click="printRow(props.row)"
                >
                  <q-tooltip>Print</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>

    <!-- ── SI Print preview — same windowed blob+iframe dialog shape as
         DMSTrip.vue's Trip Sheet Print Preview / GenericReportList.vue's
         report print dialog (download/print/close icons, auto-height
         iframe). A "Header" toggle swaps the With Header/Without Header
         variant (SAL_SIPrint_WithHeader.rdlc vs _WithoutHeader.rdlc) —
         GST vs Service Tax is decided automatically from the row's own
         GSTApplicable flag (SAL_SIPrint_WithHeader_GST.rdlc /
         _WithoutHeader_GST.rdlc), so one page covers all 4 RDLC variants. ── -->
    <q-dialog v-model="showPrintDialog" @before-hide="closePrintDialog">
      <q-card
        style="
          display: flex;
          flex-direction: column;
          width: 1200px;
          max-width: 95vw;
          max-height: 92vh;
          overflow: hidden;
        "
      >
        <q-toolbar class="bg-primary text-white">
          <q-icon name="request_quote" size="22px" class="q-mr-sm" />
          <q-toolbar-title>SI Print Preview</q-toolbar-title>
          <q-badge v-if="printRecordNo" class="q-mr-sm print-preview-badge">
            {{ printRecordNo }}
          </q-badge>
          <q-checkbox
            v-model="showHeader"
            dense
            dark
            label="Header"
            class="q-mr-md"
            @update:model-value="renderPrintHtml"
          />
          <q-btn flat round icon="download" @click="downloadPDF">
            <q-tooltip>Download</q-tooltip>
          </q-btn>
          <q-btn flat round icon="print" @click="printFrame">
            <q-tooltip>Print</q-tooltip>
          </q-btn>
          <q-btn flat round icon="close" @click="closePrintDialog">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-toolbar>
        <div style="overflow-y: auto; flex: 1 1 auto">
          <iframe
            ref="reportFrame"
            :src="printBlobUrl"
            style="border: none; width: 100%; display: block"
            @load="onPrintFrameLoad"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { apiGetSIPrintList } from "src/data/siPrintData.js";
import {
  getCompanyProfile,
  getCompanyLogoDataUrl,
  buildPrintHeaderHtml,
  PRINT_HEADER_CSS,
} from "src/data/companyProfile.js";
import { apiGetMasterList } from "src/data/mastersData.js";
import { downloadIframeAsPdf } from "src/Utils/downloadIframePdf.js";

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

// Indian numbering (Crore/Lakh/Thousand) — used for the RDLC's "Amount In
// Words" textbox, which has no live equivalent anywhere else in this app.
function twoDigitsToWords(n) {
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${TENS[tens]}${ones ? " " + ONES[ones] : ""}`;
}
function threeDigitsToWords(n) {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  return `${hundred ? ONES[hundred] + " Hundred" : ""}${
    hundred && rest ? " " : ""
  }${rest ? twoDigitsToWords(rest) : ""}`;
}
function numberToWords(value) {
  let n = Math.round(Number(value) || 0);
  if (n === 0) return "Zero";
  const parts = [];
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const hundred = n;
  if (crore) parts.push(`${threeDigitsToWords(crore)} Crore`);
  if (lakh) parts.push(`${threeDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigitsToWords(thousand)} Thousand`);
  if (hundred) parts.push(threeDigitsToWords(hundred));
  return parts.join(" ");
}
function amountInWords(value) {
  return `Rupees ${numberToWords(value)} Only`;
}

export default {
  name: "DMSSaleSIPrint",

  data() {
    return {
      rows: [],
      pagination: { page: 1, rowsPerPage: 15 },

      baseColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "InvoiceNo", label: "SI No.", field: "InvoiceNo", sortable: true },
        { name: "InvoiceDate", label: "Date", field: "InvoiceDate", sortable: true },
        { name: "PartyName", label: "Party", field: "PartyName", sortable: true },
        { name: "GSTApplicable", label: "Type", field: "GSTApplicable", align: "center" },
        { name: "SI_TotalAmount", label: "Total Amt.", field: "SI_TotalAmount", align: "right", sortable: true },
      ],

      showPrintDialog: false,
      showHeader: true,
      printBlobUrl: null,
      printRecordNo: "",
      printRow_: null,
      logoDataUrl: "",
      company: {},
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
      this.rows = await apiGetSIPrintList();
    },

    async printRow(row) {
      this.printRecordNo = row.InvoiceNo;
      this.printRow_ = row;
      this.showHeader = true;
      const [logoDataUrl, company, companyRows] = await Promise.all([
        getCompanyLogoDataUrl(),
        getCompanyProfile(),
        apiGetMasterList("company"),
      ]);
      this.logoDataUrl = logoDataUrl;
      this.company = { ...company, ...(companyRows?.[0] || {}) };
      this.renderPrintHtml();
      this.showPrintDialog = true;
    },

    renderPrintHtml() {
      if (!this.printRow_) return;
      const html = this.buildSIPrintHtml(
        this.printRow_,
        this.logoDataUrl,
        this.company,
        this.showHeader
      );
      const blob = new Blob([html], { type: "text/html" });
      if (this.printBlobUrl) URL.revokeObjectURL(this.printBlobUrl);
      this.printBlobUrl = URL.createObjectURL(blob);
    },

    downloadPDF() {
      downloadIframeAsPdf(this.$refs.reportFrame, `SIPrint-${this.printRecordNo}`);
    },

    printFrame() {
      if (!this.$refs.reportFrame) return;
      this.$refs.reportFrame.contentWindow.focus();
      this.$refs.reportFrame.contentWindow.print();
    },

    onPrintFrameLoad() {
      const frame = this.$refs.reportFrame;
      if (!frame || !frame.contentDocument) return;
      const height = frame.contentDocument.documentElement.scrollHeight;
      frame.style.height = `${height}px`;
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

    // Matches EagleParcel LOCRPT/Sale/SAL_SI/SAL_SIPrint_WithHeader(_GST)/
    // _WithoutHeader(_GST).rdlc: company+party letterhead block (only when
    // `withHeader`), per-booking line items table, a tax summary that
    // switches between Service Tax (pre-GST) and CGST/SGST/IGST breakdown
    // per the row's own GSTApplicable flag, Amount In Words, and Terms &
    // Conditions — one template covering all 4 RDLC variants.
    buildSIPrintHtml(row, logoDataUrl = "", company = {}, withHeader = true) {
      const fmt2 = (n) =>
        Number(n || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      const items = row.Items || [];
      const itemsHtml = items
        .map(
          (it) => `<tr>
        <td>${it.BookingNo || ""}</td>
        <td>${it.BookingDate || ""}</td>
        <td>${it.OppositePartyName || ""}</td>
        <td>${it.Destination || ""}</td>
        <td>${it.ItemBillNo || ""}</td>
        <td class="num">${it.Quantity ?? ""}</td>
        <td class="num">${fmt2(it.Weight)}</td>
        <td class="num">${fmt2(it.NetAmount)}</td>
      </tr>`
        )
        .join("");
      const itemTotals = items.reduce(
        (acc, it) => {
          acc.qty += Number(it.Quantity || 0);
          acc.weight += Number(it.Weight || 0);
          acc.net += Number(it.NetAmount || 0);
          return acc;
        },
        { qty: 0, weight: 0, net: 0 }
      );

      const taxRowsHtml = row.GSTApplicable
        ? `<tr><td class="lbl">CGST</td><td class="num">${fmt2(row.SI_CGSTAmount)}</td></tr>
           <tr><td class="lbl">SGST</td><td class="num">${fmt2(row.SI_SGSTAmount)}</td></tr>
           <tr><td class="lbl">IGST</td><td class="num">${fmt2(row.SI_IGSTAmount)}</td></tr>`
        : `<tr><td class="lbl">Service Tax</td><td class="num">${fmt2(row.SI_ServiceTaxAmount)}</td></tr>
           <tr><td class="lbl">Education Cess</td><td class="num">${fmt2(row.SI_EducessAmount)}</td></tr>
           <tr><td class="lbl">S&amp;H Education Cess</td><td class="num">${fmt2(row.SI_SHEducessAmount)}</td></tr>`;
      // Matches the RDLC's "GST Payable By : <Party>" line, shown only when
      // this invoice's tax total is non-zero and GST (not Service Tax)
      // applies.
      const gstPayableByHtml =
        row.GSTApplicable && Number(row.SI_TotalTaxAmount) !== 0
          ? `<div class="words">GST Payable By: ${row.PartyName}</div>`
          : "";

      const termsHtml = (row.TermsConditions || [])
        .map((t) => `<li>${t}</li>`)
        .join("");

      const headerHtml = withHeader
        ? buildPrintHeaderHtml(logoDataUrl, company)
        : "";
      const companyGstLine =
        withHeader && (company.GSTNo || company.PAN)
          ? `<div class="hdr-contact">${
              company.GSTNo ? "GSTIN: " + company.GSTNo : ""
            }${company.GSTNo && company.PAN ? " &nbsp;|&nbsp; " : ""}${
              company.PAN ? "PAN: " + company.PAN : ""
            }</div>`
          : "";

      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>SI Print — ${row.InvoiceNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:9pt;color:#000;padding:10px 14px;background:#fff}
  ${PRINT_HEADER_CSS}
  .title{font-size:12pt;font-weight:bold;text-align:center;border-top:2px solid #0178bc;border-bottom:1px solid #0178bc;padding:4px 0;margin-bottom:8px}
  table.kv{width:100%;border-collapse:collapse;margin-bottom:8px}
  table.kv td{padding:2px 4px;vertical-align:top}
  td.lbl{font-weight:700;width:16%}
  table.items{width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:8px}
  table.items th,table.items td{border:1px solid #000;padding:4px 6px;text-align:left;font-size:8.5pt}
  table.items th{background:#f2f9ff}
  table.items td.num,table.items th.num{text-align:right}
  table.items tr.totals td{font-weight:700}
  table.tax{width:40%;margin-left:auto;border-collapse:collapse;margin-bottom:8px}
  table.tax td{padding:3px 6px;font-size:8.5pt}
  table.tax td.lbl{font-weight:600;width:60%}
  table.tax td.num{text-align:right}
  table.tax tr.grand td{font-weight:700;border-top:1px solid #000}
  .words{font-size:8.5pt;font-style:italic;margin-bottom:8px}
  .terms{font-size:8pt;margin-top:8px}
  .terms ol{margin-left:16px}
  @page{size:A4;margin:10mm}
  @media print{ body{padding:0;margin:0} }
</style>
</head>
<body>
${headerHtml}
${companyGstLine}

<div class="title">Sale Invoice</div>

<table class="kv">
  <tr>
    <td class="lbl">Invoice No.</td><td>${row.InvoiceNo}</td>
    <td class="lbl">Invoice Date</td><td>${row.InvoiceDate}</td>
  </tr>
  <tr>
    <td class="lbl">Period</td><td>${row.InvoiceFromDate} to ${row.InvoiceToDate}</td>
    <td class="lbl">P.O. No.</td><td>${row.PONo || "-"}</td>
  </tr>
  <tr>
    <td class="lbl">Party</td><td>${row.PartyName}</td>
    <td class="lbl">${row.PartyRole || "Party"} GSTIN</td><td>${row.PartyGSTNo || "-"}</td>
  </tr>
  <tr>
    <td class="lbl">Address</td><td colspan="3">${row.PartyAddress || ""}, ${row.PartyCityName || ""}</td>
  </tr>
</table>

<table class="items">
  <tr>
    <th>L.R. No.</th>
    <th>Date</th>
    <th>Client</th>
    <th>Destination</th>
    <th>Bill No.</th>
    <th class="num">Qty.</th>
    <th class="num">Weight</th>
    <th class="num">Total Amt.</th>
  </tr>
  ${itemsHtml}
  <tr class="totals">
    <td colspan="5">Total</td>
    <td class="num">${itemTotals.qty}</td>
    <td class="num">${fmt2(itemTotals.weight)}</td>
    <td class="num">${fmt2(itemTotals.net)}</td>
  </tr>
</table>

<table class="tax">
  <tr><td class="lbl">Taxable Amount</td><td class="num">${fmt2(row.SI_TaxableAmount)}</td></tr>
  <tr><td class="lbl">Non Taxable Amount</td><td class="num">${fmt2(row.SI_NonTaxableAmount)}</td></tr>
  ${taxRowsHtml}
  <tr><td class="lbl">Total Tax Amount</td><td class="num">${fmt2(row.SI_TotalTaxAmount)}</td></tr>
  <tr><td class="lbl">Discount</td><td class="num">${fmt2(row.SI_DiscountAmount)}</td></tr>
  <tr><td class="lbl">Kasar</td><td class="num">${fmt2(row.SI_KasarAmount)}</td></tr>
  <tr class="grand"><td class="lbl">Net Amount</td><td class="num">${fmt2(row.SI_NetAmount)}</td></tr>
  <tr class="grand"><td class="lbl">Total Amount</td><td class="num">${fmt2(row.SI_TotalAmount)}</td></tr>
</table>

<div class="words">Amount In Words: ${amountInWords(row.SI_TotalAmount)}</div>
${gstPayableByHtml}
${row.Remarks ? `<div class="words">Remarks: ${row.Remarks}</div>` : ""}

${
  termsHtml
    ? `<div class="terms"><strong>Terms &amp; Conditions</strong><ol>${termsHtml}</ol></div>`
    : ""
}
</body>
</html>`;
    },
  },
};
</script>

<style scoped>
.print-preview-badge {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: #fff;
  font-weight: 500;
}
</style>
