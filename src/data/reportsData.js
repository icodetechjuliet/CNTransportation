// Generic mock data for every read-only report/register screen under DMS >
// Booking Office, Sale, Report Screens and Reports. Same spirit as
// src/data/mastersData.js: one config per screen (title/icon/columns/rows)
// instead of a bespoke page + data file for each of the ~36 screens, all
// rendered through src/components/GenericReportList.vue. These are mock
// rows only (no live report engine yet) — enough to show the screen's real
// shape instead of "Under Construction".

export const REPORT_DEFS = {
  // ── Booking Office ───────────────────────────────────────────────────
  bowisedebitcollection: {
    title: "Booking Office Wise Debit Collection",
    icon: "payments",
    columns: [
      { name: "BookingOffice", label: "Booking Office", field: "BookingOffice", sortable: true },
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "DebitParty", label: "Debit Party", field: "DebitParty" },
      { name: "Amount", label: "Amount", field: "Amount", align: "right", sortable: true },
    ],
    rows: [
      { BookingOffice: "Greenland", Date: "01-04-2026", DebitParty: "Mayur Marketing", Amount: 5400 },
      { BookingOffice: "Chakan", Date: "02-04-2026", DebitParty: "Krishna Engineering", Amount: 3200 },
      { BookingOffice: "Vasai Eagle", Date: "03-04-2026", DebitParty: "Amul Industries Pvt Ltd", Amount: 8900 },
    ],
  },
  bowisereceivedcollection: {
    title: "Booking Office Wise Received Collection",
    icon: "payments",
    columns: [
      { name: "BookingOffice", label: "Booking Office", field: "BookingOffice", sortable: true },
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "PaymentMode", label: "Payment Mode", field: "PaymentMode" },
      { name: "Amount", label: "Amount Received", field: "Amount", align: "right", sortable: true },
    ],
    rows: [
      { BookingOffice: "Greenland", Date: "01-04-2026", PaymentMode: "Cash", Amount: 4200 },
      { BookingOffice: "Chakan", Date: "02-04-2026", PaymentMode: "Online", Amount: 2750 },
      { BookingOffice: "Vasai Eagle", Date: "03-04-2026", PaymentMode: "Cheque", Amount: 6100 },
    ],
  },
  bodailycollection: {
    title: "Booking Office Daily Collection",
    icon: "calendar_month",
    columns: [
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "BookingOffice", label: "Booking Office", field: "BookingOffice", sortable: true },
      { name: "Cash", label: "Cash", field: "Cash", align: "right" },
      { name: "Cheque", label: "Cheque", field: "Cheque", align: "right" },
      { name: "Online", label: "Online", field: "Online", align: "right" },
      { name: "Total", label: "Total", field: "Total", align: "right", sortable: true },
    ],
    rows: [
      { Date: "01-04-2026", BookingOffice: "Greenland", Cash: 4200, Cheque: 0, Online: 1500, Total: 5700 },
      { Date: "02-04-2026", BookingOffice: "Chakan", Cash: 1800, Cheque: 2750, Online: 0, Total: 4550 },
      { Date: "03-04-2026", BookingOffice: "Vasai Eagle", Cash: 0, Cheque: 6100, Online: 900, Total: 7000 },
    ],
  },
  bocommissionscreen: {
    title: "Booking Office Commission",
    icon: "percent",
    columns: [
      { name: "BookingOffice", label: "Booking Office", field: "BookingOffice", sortable: true },
      { name: "Period", label: "Period", field: "Period" },
      { name: "BookedAmount", label: "Booked Amount", field: "BookedAmount", align: "right" },
      { name: "CommissionRate", label: "Rate %", field: "CommissionRate", align: "right" },
      { name: "CommissionAmount", label: "Commission Amt.", field: "CommissionAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingOffice: "Greenland", Period: "Apr-2026", BookedAmount: 125000, CommissionRate: 2.5, CommissionAmount: 3125 },
      { BookingOffice: "Chakan", Period: "Apr-2026", BookedAmount: 84000, CommissionRate: 3, CommissionAmount: 2520 },
    ],
  },

  // ── Sale (action lists) ──────────────────────────────────────────────
  sipostinglist: {
    title: "SI Posting",
    icon: "receipt_long",
    actionLabel: "Post",
    actionIcon: "task_alt",
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "PartyName", label: "Party", field: "PartyName" },
      { name: "Amount", label: "Amount", field: "Amount", align: "right", sortable: true },
      { name: "Posted", label: "Posted", field: (r) => (r.Posted ? "Yes" : "No"), align: "center" },
    ],
    rows: [
      { SINo: "SI20260001", SIDate: "01-04-2026", PartyName: "Rajsani Polymers", Amount: 12500, Posted: false },
      { SINo: "SI20260002", SIDate: "02-04-2026", PartyName: "Varun Casting Co", Amount: 8400, Posted: true },
      { SINo: "SI20260003", SIDate: "03-04-2026", PartyName: "Mahindra Heavy Engines Ltd", Amount: 21300, Posted: false },
    ],
  },
  siemaillist: {
    title: "SI Email",
    icon: "email",
    actionLabel: "Send Email",
    actionIcon: "send",
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "PartyName", label: "Party", field: "PartyName" },
      { name: "Email", label: "Email", field: "Email" },
      { name: "EmailSent", label: "Sent", field: (r) => (r.EmailSent ? "Yes" : "No"), align: "center" },
    ],
    rows: [
      { SINo: "SI20260001", SIDate: "01-04-2026", PartyName: "Rajsani Polymers", Email: "accounts@rajsanipolymers.example", EmailSent: false },
      { SINo: "SI20260002", SIDate: "02-04-2026", PartyName: "Varun Casting Co", Email: "billing@varuncasting.example", EmailSent: true },
    ],
  },

  // ── Report Screens ───────────────────────────────────────────────────
  rscurrentstock: {
    title: "Current Stock",
    icon: "inventory_2",
    columns: [
      { name: "BookingOffice", label: "Booking Office", field: "BookingOffice", sortable: true },
      { name: "BookingNo", label: "Booking No", field: "BookingNo" },
      { name: "Item", label: "Item", field: "Item" },
      { name: "Qty", label: "Qty", field: "Qty", align: "right" },
      { name: "DaysInStock", label: "Days In Stock", field: "DaysInStock", align: "right", sortable: true },
    ],
    rows: [
      { BookingOffice: "Vasai Eagle", BookingNo: "RKG21040013", Item: "Carton", Qty: 3, DaysInStock: 4 },
      { BookingOffice: "Chakan", BookingNo: "RKG21040011", Item: "Drum", Qty: 8, DaysInStock: 1 },
    ],
  },
  rsbookingregistergst: {
    title: "Booking Register GST",
    icon: "receipt_long",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "TaxableValue", label: "Taxable Value", field: "TaxableValue", align: "right" },
      { name: "CGST", label: "CGST", field: "CGST", align: "right" },
      { name: "SGST", label: "SGST", field: "SGST", align: "right" },
      { name: "IGST", label: "IGST", field: "IGST", align: "right" },
      { name: "Total", label: "Total", field: "Total", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", TaxableValue: 896, CGST: 0, SGST: 0, IGST: 44.8, Total: 940.8 },
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", TaxableValue: 1250, CGST: 31.25, SGST: 31.25, IGST: 0, Total: 1312.5 },
    ],
  },
  rsdailycollectionsummary: {
    title: "Daily Collection Summary",
    icon: "summarize",
    columns: [
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "Cash", label: "Cash", field: "Cash", align: "right" },
      { name: "Cheque", label: "Cheque", field: "Cheque", align: "right" },
      { name: "Online", label: "Online", field: "Online", align: "right" },
      { name: "Total", label: "Total", field: "Total", align: "right", sortable: true },
    ],
    rows: [
      { Date: "01-04-2026", Cash: 6000, Cheque: 2750, Online: 2400, Total: 11150 },
      { Date: "02-04-2026", Cash: 4500, Cheque: 1200, Online: 3000, Total: 8700 },
    ],
  },
  rstopaycollectionregister: {
    title: "Topay Collection Register",
    icon: "payments",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
      { name: "ToPayAmount", label: "ToPay Amount", field: "ToPayAmount", align: "right" },
      { name: "CollectedAmount", label: "Collected", field: "CollectedAmount", align: "right" },
      { name: "Status", label: "Status", field: "Status", align: "center" },
    ],
    rows: [
      { BookingNo: "RKG21040013", ConsigneeName: "Mahindra Heavy Engines Ltd", ToPayAmount: 610, CollectedAmount: 0, Status: "Pending" },
      { BookingNo: "RKG21040014", ConsigneeName: "Sumit Precision Fasteners", ToPayAmount: 3200, CollectedAmount: 3200, Status: "Collected" },
    ],
  },
  rsledgeraccountlist: {
    title: "Ledger Account List",
    icon: "account_balance",
    columns: [
      { name: "AccountName", label: "Account Name", field: "AccountName", sortable: true },
      { name: "AccountType", label: "Account Type", field: "AccountType" },
      { name: "OpeningBalance", label: "Opening Bal.", field: "OpeningBalance", align: "right" },
      { name: "ClosingBalance", label: "Closing Bal.", field: "ClosingBalance", align: "right", sortable: true },
    ],
    rows: [
      { AccountName: "Rajsani Polymers", AccountType: "Sundry Debtor", OpeningBalance: 0, ClosingBalance: 940.8 },
      { AccountName: "Eagle Tradelinks Pvt Ltd", AccountType: "Transporter", OpeningBalance: 0, ClosingBalance: -350 },
    ],
  },
  rscashcreditledger: {
    title: "Cash Credit Ledger",
    icon: "account_balance_wallet",
    columns: [
      { name: "PartyName", label: "Party", field: "PartyName", sortable: true },
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "Debit", label: "Debit", field: "Debit", align: "right" },
      { name: "Credit", label: "Credit", field: "Credit", align: "right" },
      { name: "Balance", label: "Balance", field: "Balance", align: "right" },
    ],
    rows: [
      { PartyName: "Paras Exports", Date: "04-04-2026", Debit: 875, Credit: 0, Balance: 875 },
      { PartyName: "Paras Exports", Date: "05-04-2026", Debit: 0, Credit: 500, Balance: 375 },
    ],
  },
  rsdebitledger: {
    title: "Debit Ledger",
    icon: "account_balance",
    columns: [
      { name: "PartyName", label: "Party", field: "PartyName", sortable: true },
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "Reference", label: "Reference", field: "Reference" },
      { name: "Amount", label: "Amount", field: "Amount", align: "right", sortable: true },
    ],
    rows: [
      { PartyName: "Mayur Marketing", Date: "01-04-2026", Reference: "RKG21040011", Amount: 940.8 },
      { PartyName: "Bhavya Distributors", Date: "01-04-2026", Reference: "RKG21040012", Amount: 1312.5 },
    ],
  },
  rsentryeditlist: {
    title: "Entry Edit List",
    icon: "edit_note",
    columns: [
      { name: "EntryNo", label: "Entry No.", field: "EntryNo", sortable: true },
      { name: "EntryDate", label: "Date", field: "EntryDate", sortable: true },
      { name: "EditedBy", label: "Edited By", field: "EditedBy" },
      { name: "EditedOn", label: "Edited On", field: "EditedOn", sortable: true },
      { name: "Field", label: "Field Changed", field: "Field" },
    ],
    rows: [
      { EntryNo: "RKG21040011", EntryDate: "01-04-2026", EditedBy: "Ketan Solanki", EditedOn: "01-04-2026 05:10 PM", Field: "PaymentType" },
    ],
  },
  rsbookingregisterscr: {
    title: "Booking Register Scr",
    icon: "list_alt",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "FromCity", label: "From City", field: "FromCity" },
      { name: "ToCity", label: "To City", field: "ToCity" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", FromCity: "Bangalore", ToCity: "Rajkot-G", NetAmount: 940.8 },
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", FromCity: "Bangalore", ToCity: "Rajkot-G", NetAmount: 1312.5 },
    ],
  },
  rsbookingoutwardregister: {
    title: "Booking Outward Register",
    icon: "north_east",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
      { name: "ToCity", label: "To City", field: "ToCity" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right" },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", ConsignorName: "Mayur Marketing", ToCity: "Rajkot-G", NetAmount: 940.8 },
    ],
  },
  rsdebitlistpartywisescreen: {
    title: "Debit List - Party Wise Screen",
    icon: "person_search",
    columns: [
      { name: "PartyName", label: "Party", field: "PartyName", sortable: true },
      { name: "TotalDebit", label: "Total Debit", field: "TotalDebit", align: "right", sortable: true },
      { name: "LastEntryDate", label: "Last Entry Date", field: "LastEntryDate" },
    ],
    rows: [
      { PartyName: "Mayur Marketing", TotalDebit: 940.8, LastEntryDate: "01-04-2026" },
      { PartyName: "Bhavya Distributors", TotalDebit: 1312.5, LastEntryDate: "01-04-2026" },
    ],
  },
  rsdebitlistpartywiseyearly: {
    title: "Debit List - Party Wise (Yearly)",
    icon: "calendar_view_month",
    columns: [
      { name: "PartyName", label: "Party", field: "PartyName", sortable: true },
      { name: "FinYear", label: "Fin Year", field: "FinYear" },
      { name: "TotalDebit", label: "Total Debit", field: "TotalDebit", align: "right", sortable: true },
    ],
    rows: [
      { PartyName: "Mayur Marketing", FinYear: "2025-26", TotalDebit: 12400 },
      { PartyName: "Bhavya Distributors", FinYear: "2025-26", TotalDebit: 8900 },
    ],
  },
  rscashcreditdebitlistpartywise: {
    title: "Cash Credit Debit List - Party Wise",
    icon: "person_search",
    columns: [
      { name: "PartyName", label: "Party", field: "PartyName", sortable: true },
      { name: "CashCreditLimit", label: "CC Limit", field: "CashCreditLimit", align: "right" },
      { name: "OutstandingDebit", label: "Outstanding Debit", field: "OutstandingDebit", align: "right", sortable: true },
    ],
    rows: [
      { PartyName: "Paras Exports", CashCreditLimit: 5000, OutstandingDebit: 875 },
    ],
  },
  rsuserwisecreditlimitsummary: {
    title: "User Wise Credit Limit Summary",
    icon: "credit_score",
    columns: [
      { name: "UserName", label: "User", field: "UserName", sortable: true },
      { name: "CreditLimit", label: "Credit Limit", field: "CreditLimit", align: "right" },
      { name: "Utilized", label: "Utilized", field: "Utilized", align: "right", sortable: true },
    ],
    rows: [
      { UserName: "Ketan Solanki", CreditLimit: 50000, Utilized: 21300 },
      { UserName: "Mahendra Singh Jadeja", CreditLimit: 20000, Utilized: 4550 },
    ],
  },
  rsuchakreceivedlist: {
    title: "Uchak Received List",
    icon: "list_alt",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "ReceivedFrom", label: "Received From", field: "ReceivedFrom" },
      { name: "Amount", label: "Amount", field: "Amount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040014", Date: "03-04-2026", ReceivedFrom: "Suresh Fasteners", Amount: 3200 },
    ],
  },
  rscashbookingwithchqpaymentmode: {
    title: "Cash Booking With Chq Payment Mode",
    icon: "receipt",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ChequeNo", label: "Cheque No.", field: "ChequeNo" },
      { name: "Amount", label: "Amount", field: "Amount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", ChequeNo: "482910", Amount: 1312.5 },
    ],
  },
  rscitywiseperiodwisecollection: {
    title: "City Wise Period Wise Collection",
    icon: "location_city",
    columns: [
      { name: "City", label: "City", field: "City", sortable: true },
      { name: "Period", label: "Period", field: "Period" },
      { name: "Collection", label: "Collection", field: "Collection", align: "right", sortable: true },
    ],
    rows: [
      { City: "Rajkot-G", Period: "Apr-2026", Collection: 24500 },
      { City: "Vasai", Period: "Apr-2026", Collection: 15200 },
    ],
  },

  // ── Reports ───────────────────────────────────────────────────────────
  rptcoveringletter: {
    title: "Covering Letter",
    icon: "mail",
    actionLabel: "Print",
    actionIcon: "print",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
      { name: "ToCity", label: "To City", field: "ToCity" },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", ConsigneeName: "Rajsani Polymers", ToCity: "Rajkot-G" },
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", ConsigneeName: "Varun Casting Co", ToCity: "Rajkot-G" },
    ],
  },
  rptdoordeliverysummary: {
    title: "Door Delivery Summary",
    icon: "local_shipping",
    columns: [
      { name: "DoorDeliveryNo", label: "Door Delivery No.", field: "DoorDeliveryNo", sortable: true },
      { name: "DoorDeliveryDate", label: "Date", field: "DoorDeliveryDate", sortable: true },
      { name: "Transporter", label: "Transporter", field: "Transporter" },
      { name: "VehicleAmount", label: "Vehicle Amt.", field: "VehicleAmount", align: "right", sortable: true },
    ],
    rows: [
      { DoorDeliveryNo: "DD20260001", DoorDeliveryDate: "03-04-2026", Transporter: "Eagle Tradelinks Pvt Ltd", VehicleAmount: 350 },
    ],
  },
  rptsiregisteraccountservicetax: {
    title: "SI Register - Account - Service Tax",
    icon: "receipt_long",
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "PartyName", label: "Party", field: "PartyName" },
      { name: "ServiceTax", label: "Service Tax", field: "ServiceTax", align: "right" },
      { name: "Total", label: "Total", field: "Total", align: "right", sortable: true },
    ],
    rows: [
      { SINo: "SI20260001", SIDate: "01-04-2026", PartyName: "Rajsani Polymers", ServiceTax: 0, Total: 12500 },
    ],
  },
  rptsiregisteraccountgst: {
    title: "SI Register - Account - GST",
    icon: "receipt_long",
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "PartyName", label: "Party", field: "PartyName" },
      { name: "TaxableValue", label: "Taxable Value", field: "TaxableValue", align: "right" },
      { name: "GSTAmount", label: "GST Amt.", field: "GSTAmount", align: "right" },
      { name: "Total", label: "Total", field: "Total", align: "right", sortable: true },
    ],
    rows: [
      { SINo: "SI20260001", SIDate: "01-04-2026", PartyName: "Rajsani Polymers", TaxableValue: 12500, GSTAmount: 625, Total: 13125 },
    ],
  },
  rptcashsummarygst: {
    title: "Cash Summary - GST",
    icon: "summarize",
    columns: [
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "TaxableValue", label: "Taxable Value", field: "TaxableValue", align: "right" },
      { name: "GSTAmount", label: "GST Amt.", field: "GSTAmount", align: "right" },
      { name: "Total", label: "Total", field: "Total", align: "right", sortable: true },
    ],
    rows: [
      { Date: "01-04-2026", TaxableValue: 6000, GSTAmount: 300, Total: 6300 },
    ],
  },
  rptcashsummaryservicetax: {
    title: "Cash Summary - Service Tax",
    icon: "summarize",
    columns: [
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "TaxableValue", label: "Taxable Value", field: "TaxableValue", align: "right" },
      { name: "ServiceTax", label: "Service Tax", field: "ServiceTax", align: "right" },
      { name: "Total", label: "Total", field: "Total", align: "right", sortable: true },
    ],
    rows: [
      { Date: "01-04-2026", TaxableValue: 4500, ServiceTax: 0, Total: 4500 },
    ],
  },
  rptbookingregister: {
    title: "Booking Register",
    icon: "list_alt",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
      { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", ConsignorName: "Mayur Marketing", ConsigneeName: "Rajsani Polymers", NetAmount: 940.8 },
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", ConsignorName: "Bhavya Distributors", ConsigneeName: "Varun Casting Co", NetAmount: 1312.5 },
    ],
  },
  rptbookingregistergst: {
    title: "Booking Register GST",
    icon: "receipt_long",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "TaxableValue", label: "Taxable Value", field: "TaxableValue", align: "right" },
      { name: "GSTAmount", label: "GST Amt.", field: "GSTAmount", align: "right" },
      { name: "Total", label: "Total", field: "Total", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", TaxableValue: 896, GSTAmount: 44.8, Total: 940.8 },
    ],
  },
  rptsiregisteraccountgstr1: {
    title: "SI Register - Account - GSTR1",
    icon: "receipt_long",
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "GSTIN", label: "GSTIN", field: "GSTIN" },
      { name: "TaxableValue", label: "Taxable Value", field: "TaxableValue", align: "right" },
      { name: "GSTAmount", label: "GST Amt.", field: "GSTAmount", align: "right", sortable: true },
    ],
    rows: [
      { SINo: "SI20260001", SIDate: "01-04-2026", GSTIN: "24RAJ8586E1ZF", TaxableValue: 12500, GSTAmount: 625 },
    ],
  },
  rptsiregisteraccountgstb2bb2c: {
    title: "SI Register - Account GST - B2B B2C",
    icon: "receipt_long",
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "PartyType", label: "B2B / B2C", field: "PartyType", align: "center" },
      { name: "TaxableValue", label: "Taxable Value", field: "TaxableValue", align: "right" },
      { name: "GSTAmount", label: "GST Amt.", field: "GSTAmount", align: "right", sortable: true },
    ],
    rows: [
      { SINo: "SI20260001", PartyType: "B2B", TaxableValue: 12500, GSTAmount: 625 },
      { SINo: "SI20260003", PartyType: "B2C", TaxableValue: 21300, GSTAmount: 1065 },
    ],
  },
  rptaccountledgerwithoppositeaccount: {
    title: "Account Ledger with Opposite Account",
    icon: "account_balance",
    columns: [
      { name: "AccountName", label: "Account", field: "AccountName", sortable: true },
      { name: "OppositeAccount", label: "Opposite Account", field: "OppositeAccount" },
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "Amount", label: "Amount", field: "Amount", align: "right", sortable: true },
    ],
    rows: [
      { AccountName: "Rajsani Polymers", OppositeAccount: "Cash", Date: "01-04-2026", Amount: 940.8 },
    ],
  },
  rptcommwisemismatchbooking: {
    title: "Comm. Wise Mismatch Booking",
    icon: "report_problem",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingOffice", label: "Booking Office", field: "BookingOffice" },
      { name: "ExpectedCommission", label: "Expected Comm.", field: "ExpectedCommission", align: "right" },
      { name: "ActualCommission", label: "Actual Comm.", field: "ActualCommission", align: "right" },
    ],
    rows: [
      { BookingNo: "RKG21040013", BookingOffice: "Vasai Eagle", ExpectedCommission: 15.25, ActualCommission: 0 },
    ],
  },
  rptbookingdeletelogregister: {
    title: "Booking Delete Log Register",
    icon: "delete_history",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "DeletedBy", label: "Deleted By", field: "DeletedBy" },
      { name: "DeletedOn", label: "Deleted On", field: "DeletedOn", sortable: true },
      { name: "Reason", label: "Reason", field: "Reason" },
    ],
    rows: [
      { BookingNo: "RKG21040009", DeletedBy: "Admin", DeletedOn: "28-03-2026 11:20 AM", Reason: "Duplicate entry" },
    ],
  },
};

export function getReportDef(reportKey) {
  return REPORT_DEFS[reportKey];
}

export function apiGetReportRows(reportKey) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const def = REPORT_DEFS[reportKey];
      resolve(def ? [...def.rows] : []);
    }, 150);
  });
}
