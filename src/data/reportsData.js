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
  // BUK_Booking_CurrentStockRegister.rdlc — LR No/Date/City/Consignee/
  // Consignor/Bill No/Item/Qty./Net Amt.
  rscurrentstock: {
    title: "Current Stock",
    icon: "inventory_2",
    columns: [
      { name: "BookingNo", label: "LR No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "CityName", label: "City", field: "CityName" },
      { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
      { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
      { name: "ItemBillNo", label: "Bill No", field: "ItemBillNo" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040013", BookingDate: "01-04-2026", CityName: "Vasai", ConsigneeName: "Mahindra Heavy Engines Ltd", ConsignorName: "Mayur Marketing", ItemBillNo: "BL4021", ItemName: "Carton", Quantity: 3, NetAmount: 940.8 },
      { BookingNo: "RKG21040011", BookingDate: "02-04-2026", CityName: "Chakan", ConsigneeName: "Varun Casting Co", ConsignorName: "Bhavya Distributors", ItemBillNo: "BL4022", ItemName: "Drum", Quantity: 8, NetAmount: 1312.5 },
    ],
  },
  // BUK_Booking_BookingRegister_GST.rdlc — Mode/Party/GSTIN/LR No/Date/
  // Taxable Freight Liability On Party/On GTA/CGST/SGST/IGST/Kasar/Net Amt/
  // Collection Office.
  rsbookingregistergst: {
    title: "Booking Register GST",
    icon: "receipt_long",
    columns: [
      { name: "BookingNo", label: "LR No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "PartyName", label: "Party", field: "PartyName" },
      { name: "PartyGSTNo", label: "GSTIN", field: "PartyGSTNo" },
      { name: "TaxableAmountByParty", label: "Taxable Frt. (Party)", field: "TaxableAmountByParty", align: "right" },
      { name: "TaxableAmount", label: "Taxable Frt. (GTA)", field: "TaxableAmount", align: "right" },
      { name: "CGSTAmount", label: "CGST", field: "CGSTAmount", align: "right" },
      { name: "SGSTAmount", label: "SGST", field: "SGSTAmount", align: "right" },
      { name: "IGSTAmount", label: "IGST", field: "IGSTAmount", align: "right" },
      { name: "KasarAmount", label: "Kasar", field: "KasarAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", PartyName: "Rajsani Polymers", PartyGSTNo: "24RAJ8586E1ZF", TaxableAmountByParty: 0, TaxableAmount: 896, CGSTAmount: 0, SGSTAmount: 0, IGSTAmount: 44.8, KasarAmount: 0, NetAmount: 940.8 },
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", PartyName: "Varun Casting Co", PartyGSTNo: "27VCC4521F1Z9", TaxableAmountByParty: 1250, TaxableAmount: 0, CGSTAmount: 31.25, SGSTAmount: 31.25, IGSTAmount: 0, KasarAmount: 0, NetAmount: 1312.5 },
    ],
  },
  // BUK_Booking_DailyCollectionSummary.rdlc — Date/Booking Office, Cash
  // Booking/Cash Delivery Amt., Booking/Delivery Cash Credit, Total Cash
  // Credit, Uchak Received, Other Cash Receipt/Payment, Net Total.
  rsdailycollectionsummary: {
    title: "Daily Collection Summary",
    icon: "summarize",
    columns: [
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName" },
      { name: "CashBookingAmount", label: "Cash Booking Amt.", field: "CashBookingAmount", align: "right" },
      { name: "CashDeliveryAmount", label: "Cash Delivery Amt.", field: "CashDeliveryAmount", align: "right" },
      { name: "TotalCashCredit", label: "Total Cash Credit", field: "TotalCashCredit", align: "right" },
      { name: "UchakReceived", label: "Uchak Received", field: "UchakReceived", align: "right" },
      { name: "OtherCashReceiptAmount", label: "Other Cash Receipt", field: "OtherCashReceiptAmount", align: "right" },
      { name: "OtherCashPaymentAmount", label: "Other Cash Payment", field: "OtherCashPaymentAmount", align: "right" },
      { name: "NetTotal", label: "Net Total", field: "NetTotal", align: "right", sortable: true },
    ],
    rows: [
      { Date: "01-04-2026", BookingOfficeName: "Greenland", CashBookingAmount: 6000, CashDeliveryAmount: 2750, TotalCashCredit: 1500, UchakReceived: 900, OtherCashReceiptAmount: 0, OtherCashPaymentAmount: 0, NetTotal: 11150 },
      { Date: "02-04-2026", BookingOfficeName: "Chakan", CashBookingAmount: 4500, CashDeliveryAmount: 1200, TotalCashCredit: 3000, UchakReceived: 0, OtherCashReceiptAmount: 0, OtherCashPaymentAmount: 0, NetTotal: 8700 },
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
  // BUK_Booking_DebitLedger.rdlc — per-account voucher ledger: Voucher No/
  // Date/Voucher Type, Credit Amount, Debit Amount, Pending Amount.
  rsdebitledger: {
    title: "Debit Ledger",
    icon: "account_balance",
    columns: [
      { name: "PartyName", label: "Party", field: "PartyName", sortable: true },
      { name: "VoucherNo", label: "Voucher No", field: "VoucherNo" },
      { name: "VoucherDate", label: "Date", field: "VoucherDate", sortable: true },
      { name: "VoucherType", label: "Voucher Type", field: "VoucherType" },
      { name: "CreditAmount", label: "Credit Amt.", field: "CreditAmount", align: "right" },
      { name: "DebitAmount", label: "Debit Amt.", field: "DebitAmount", align: "right" },
      { name: "PendingAmount", label: "Pending Amt.", field: "PendingAmount", align: "right", sortable: true },
    ],
    rows: [
      { PartyName: "Mayur Marketing", VoucherNo: "RKG21040011", VoucherDate: "01-04-2026", VoucherType: "Booking", CreditAmount: 0, DebitAmount: 940.8, PendingAmount: 940.8 },
      { PartyName: "Bhavya Distributors", VoucherNo: "RKG21040012", VoucherDate: "01-04-2026", VoucherType: "Booking", CreditAmount: 500, DebitAmount: 1312.5, PendingAmount: 812.5 },
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
  // BUK_Booking_OutwardRegister.rdlc — Booking No/Date/Consignor/Consignee/
  // To City/Payment Type/Qty., plus Paid/ToPay/TBBR/TBBS/FOC/Net Amt.
  // (city-wise summary) and Received Amt. (payment-mode-wise summary).
  rsbookingoutwardregister: {
    title: "Booking Outward Register",
    icon: "north_east",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
      { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
      { name: "ToCityName", label: "To City", field: "ToCityName" },
      { name: "PaymentType", label: "Payment Type", field: "PaymentType" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right" },
      { name: "ReceivedAmount", label: "Received Amt.", field: "ReceivedAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", ConsignorName: "Mayur Marketing", ConsigneeName: "Rajsani Polymers", ToCityName: "Rajkot-G", PaymentType: "ToPay", Quantity: 4, NetAmount: 940.8, ReceivedAmount: 0 },
      { BookingNo: "RKG21040014", BookingDate: "03-04-2026", ConsignorName: "Amul Industries Pvt Ltd", ConsigneeName: "Sumit Precision Fasteners", ToCityName: "Vasai", PaymentType: "Paid", Quantity: 2, NetAmount: 3200, ReceivedAmount: 3200 },
    ],
  },
  // BUK_Booking_PartyWiseDebitList.rdlc — Party/Bus Amt. (BasTotalAmount)/
  // Truck Amt./Net Amt.
  rsdebitlistpartywisescreen: {
    title: "Debit List - Party Wise Screen",
    icon: "person_search",
    columns: [
      { name: "PaymentPartyName", label: "Party", field: "PaymentPartyName", sortable: true },
      { name: "BasTotalAmount", label: "Bus Amt.", field: "BasTotalAmount", align: "right" },
      { name: "TruckTotalAmount", label: "Truck Amt.", field: "TruckTotalAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { PaymentPartyName: "Mayur Marketing", BasTotalAmount: 640.8, TruckTotalAmount: 300, NetAmount: 940.8 },
      { PaymentPartyName: "Bhavya Distributors", BasTotalAmount: 1312.5, TruckTotalAmount: 0, NetAmount: 1312.5 },
    ],
  },
  // BUK_Booking_PartyWiseYearlyDebitList.rdlc — Party/Year, Q1-Q4 (quarterly
  // totals), Total.
  rsdebitlistpartywiseyearly: {
    title: "Debit List - Party Wise (Yearly)",
    icon: "calendar_view_month",
    columns: [
      { name: "AccountName", label: "Party", field: "AccountName", sortable: true },
      { name: "FinYear", label: "Year", field: "FinYear" },
      { name: "Q1", label: "Q1", field: "Q1", align: "right" },
      { name: "Q2", label: "Q2", field: "Q2", align: "right" },
      { name: "Q3", label: "Q3", field: "Q3", align: "right" },
      { name: "Q4", label: "Q4", field: "Q4", align: "right" },
      { name: "YearTotal", label: "Total", field: "YearTotal", align: "right", sortable: true },
    ],
    rows: [
      { AccountName: "Mayur Marketing", FinYear: "2025-26", Q1: 3200, Q2: 4100, Q3: 2600, Q4: 2500, YearTotal: 12400 },
      { AccountName: "Bhavya Distributors", FinYear: "2025-26", Q1: 1800, Q2: 2200, Q3: 2400, Q4: 2500, YearTotal: 8900 },
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
  // BUK_Booking_UchakReceivedList_Print.rdlc — Booking No/Date, To City/To
  // Party/From Party/From City, Payment Type, Net Amt./Rec. Amt.
  rsuchakreceivedlist: {
    title: "Uchak Received List",
    icon: "list_alt",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ToCityName", label: "To City", field: "ToCityName" },
      { name: "ToPartyName", label: "To Party", field: "ToPartyName" },
      { name: "FromPartyName", label: "From Party", field: "FromPartyName" },
      { name: "FromCityName", label: "From City", field: "FromCityName" },
      { name: "PaymentType", label: "Payment Type", field: "PaymentType" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right" },
      { name: "ReceivedAmount", label: "Rec. Amt.", field: "ReceivedAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040014", BookingDate: "03-04-2026", ToCityName: "Vasai", ToPartyName: "Sumit Precision Fasteners", FromPartyName: "Amul Industries Pvt Ltd", FromCityName: "Chakan", PaymentType: "Uchak", NetAmount: 3200, ReceivedAmount: 3200 },
      { BookingNo: "RKG21040018", BookingDate: "07-04-2026", ToCityName: "Bangalore", ToPartyName: "Varun Casting Co", FromPartyName: "Krishna Engineering", FromCityName: "Pune", PaymentType: "Uchak", NetAmount: 1450, ReceivedAmount: 1450 },
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
  // BUK_Booking_BookingInwardOutwardRegister.rdlc — grouped by Inward/
  // Outward (Payment Type Category), then Payment Type: Booking No/Date,
  // Consignor/Consignee, From/To City, Item, Qty./Weight, Freight
  // (Assessable Amt.), Service Tax, Discount, Net Amt. No equivalent
  // screen existed — rsbookingoutwardregister only covers the Outward half.
  rsbookinginwardoutwardregister: {
    title: "Booking Inward Outward Register",
    icon: "swap_vert",
    columns: [
      { name: "PaymentTypeCategory", label: "Inward/Outward", field: "PaymentTypeCategory" },
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "FromCityName", label: "From City", field: "FromCityName" },
      { name: "ToCityName", label: "To City", field: "ToCityName" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "Weight", label: "Kg.", field: "Weight", align: "right" },
      { name: "AssessableAmount", label: "Freight", field: "AssessableAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { PaymentTypeCategory: "Inward", BookingNo: "RKG21040011", BookingDate: "01-04-2026", FromPartyName: "Mayur Marketing", ToPartyName: "Rajsani Polymers", FromCityName: "Bangalore", ToCityName: "Rajkot-G", ItemName: "Carton", Quantity: 4, Weight: 32, AssessableAmount: 896, NetAmount: 940.8 },
      { PaymentTypeCategory: "Outward", BookingNo: "RKG21040014", BookingDate: "03-04-2026", FromPartyName: "Amul Industries Pvt Ltd", ToPartyName: "Sumit Precision Fasteners", FromCityName: "Chakan", ToCityName: "Vasai", ItemName: "Drum", Quantity: 2, Weight: 60, AssessableAmount: 3050, NetAmount: 3200 },
    ],
  },
  // BUK_Booking_DailyCollectionRegister.rdlc — booking-level detail behind
  // rsdailycollectionsummary's date totals: Booking No/Date, Consignor/
  // Consignee, City, Item, Qty., Net Amt. + Other Than Cash Amt.
  rsdailycollectionregister: {
    title: "Daily Collection Register",
    icon: "receipt_long",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "PaymentType", label: "Payment Type", field: "PaymentType" },
      { name: "CityName", label: "City", field: "CityName" },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right" },
      { name: "OtherThanCashNetAmount", label: "Other Than Cash Amt.", field: "OtherThanCashNetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", PaymentType: "Cash", CityName: "Rajkot-G", FromPartyName: "Mayur Marketing", ToPartyName: "Rajsani Polymers", ItemName: "Carton", Quantity: 4, NetAmount: 940.8, OtherThanCashNetAmount: 0 },
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", PaymentType: "Cheque", CityName: "Rajkot-G", FromPartyName: "Bhavya Distributors", ToPartyName: "Varun Casting Co", ItemName: "Box", Quantity: 12, NetAmount: 0, OtherThanCashNetAmount: 1312.5 },
    ],
  },
  // BUK_BookingM_PendingListForDeliveryM.rdlc — the "Booking M" (multi-
  // parcel manifest) equivalent of a pending-for-delivery list: Booking No/
  // Date, Mokalnar (Consignor) / Lenar (Consignee), City, Item, Qty., Door
  // Delivery flag, Net Amt. No "Booking M" screens exist in this app yet.
  rsbookingmpendingfordeliverym: {
    title: "Pending List For Delivery (M)",
    icon: "local_shipping",
    columns: [
      { name: "BookingMNo", label: "Booking No", field: "BookingMNo", sortable: true },
      { name: "BookingMDate", label: "Date", field: "BookingMDate", sortable: true },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "FromCityName", label: "From City", field: "FromCityName" },
      { name: "ToCityName", label: "To City", field: "ToCityName" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "IsDoorDelivery", label: "Door Deli.", field: (r) => (r.IsDoorDelivery ? "Yes" : "No"), align: "center" },
      { name: "NetAmount", label: "Amount", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingMNo: "RKGM21040021", BookingMDate: "05-04-2026", FromPartyName: "Amul Industries Pvt Ltd", ToPartyName: "Sumit Precision Fasteners", FromCityName: "Chakan", ToCityName: "Vasai", ItemName: "Carton", Quantity: 6, IsDoorDelivery: true, NetAmount: 1450 },
      { BookingMNo: "RKGM21040022", BookingMDate: "06-04-2026", FromPartyName: "Bhavya Distributors", ToPartyName: "Varun Casting Co", FromCityName: "Bangalore", ToCityName: "Rajkot-G", ItemName: "Box", Quantity: 10, IsDoorDelivery: false, NetAmount: 980 },
    ],
  },
  // BUK_BookingM_Register.rdlc — the "Booking M" register, grouped by
  // Payment Type: Booking No/Date, Consignee/Consignor, City, Bill No,
  // Item, Qty., Freight, Discount, Net Amt.
  rsbookingmregister: {
    title: "Booking M Register",
    icon: "list_alt",
    columns: [
      { name: "BookingMNo", label: "Booking No", field: "BookingMNo", sortable: true },
      { name: "BookingMDate", label: "Date", field: "BookingMDate", sortable: true },
      { name: "PaymentType", label: "Payment Type", field: "PaymentType" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "ItemBillNo", label: "Bill No", field: "ItemBillNo" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "FreightAmount", label: "Freight", field: "FreightAmount", align: "right" },
      { name: "DiscountAmount", label: "Discount", field: "DiscountAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingMNo: "RKGM21040021", BookingMDate: "05-04-2026", PaymentType: "ToPay", ToPartyName: "Sumit Precision Fasteners", FromPartyName: "Amul Industries Pvt Ltd", ItemBillNo: "BL5011", ItemName: "Carton", Quantity: 6, FreightAmount: 1500, DiscountAmount: 50, NetAmount: 1450 },
      { BookingMNo: "RKGM21040022", BookingMDate: "06-04-2026", PaymentType: "Paid", ToPartyName: "Varun Casting Co", FromPartyName: "Bhavya Distributors", ItemBillNo: "BL5012", ItemName: "Box", Quantity: 10, FreightAmount: 980, DiscountAmount: 0, NetAmount: 980 },
    ],
  },

  // ── Reports ───────────────────────────────────────────────────────────
  rptcoveringletter: {
    title: "Covering Letter",
    icon: "mail",
    actionLabel: "Print",
    actionIcon: "print",
    // EagleParcel LOCRPT/Configuration/CFG_CoveringLetter/CFG_CoveringLetter_Print
    // filter screen: Account + From/To Date drive the grid; Print Month/Date,
    // Outstanding/Date and Header Footer only affect the printed letter itself.
    filters: {
      dateRange: { field: "BookingDate" },
      select: { key: "account", label: "Account", field: "ConsigneeName" },
      extra: ["printMonth", "outstanding", "headerFooter"],
      changeButton: true,
    },
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
      { name: "ToCity", label: "To City", field: "ToCity" },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", ConsigneeName: "Rajsani Polymers", ToCity: "Rajkot-G" },
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", ConsigneeName: "Varun Casting Co", ToCity: "Rajkot-G" },
      { BookingNo: "RKG21040013", BookingDate: "03-04-2026", ConsigneeName: "Mahindra Heavy Engines Ltd", ToCity: "Vasai" },
      { BookingNo: "RKG21040014", BookingDate: "05-04-2026", ConsigneeName: "Rajsani Polymers", ToCity: "Rajkot-G" },
    ],
  },
  rptdoordeliverysummary: {
    title: "Door Delivery Summary",
    icon: "local_shipping",
    actionLabel: "Print",
    actionIcon: "print",
    // EagleParcel LOCRPT/Delivery/DEL_DoorDelivery/DEL_DoorDelivery_Summary
    // filter screen: From/To Date + Vehicle.
    filters: {
      dateRange: { field: "DoorDeliveryDate" },
      select: { key: "vehicle", label: "Vehicle", field: "VehicleNo" },
    },
    // RDLC body columns are actually Date/Particulars(DoorDeliveryName)/
    // Del.Coll.(IsDoorCollection)/Receivable Amt./Vehicle Amt. — Door
    // Delivery No./Transporter/Vehicle No. below are kept too since they
    // identify the row, but DoorDeliveryName/ReceivableAmount/IsDoorCollection
    // were missing entirely, which is the real gap against the RDLC.
    columns: [
      { name: "DoorDeliveryNo", label: "Door Delivery No.", field: "DoorDeliveryNo", sortable: true },
      { name: "DoorDeliveryDate", label: "Date", field: "DoorDeliveryDate", sortable: true },
      { name: "DoorDeliveryName", label: "Particulars", field: "DoorDeliveryName" },
      { name: "IsDoorCollection", label: "Del./Coll.", field: (r) => (r.IsDoorCollection ? "Collection" : "Delivery"), align: "center" },
      { name: "Transporter", label: "Transporter", field: "Transporter" },
      { name: "VehicleNo", label: "Vehicle No.", field: "VehicleNo" },
      { name: "ReceivableAmount", label: "Receivable Amt.", field: "ReceivableAmount", align: "right" },
      { name: "VehicleAmount", label: "Vehicle Amt.", field: "VehicleAmount", align: "right", sortable: true },
    ],
    rows: [
      { DoorDeliveryNo: "DD20260001", DoorDeliveryDate: "03-04-2026", DoorDeliveryName: "Vasai Door Run", IsDoorCollection: false, Transporter: "Eagle Tradelinks Pvt Ltd", VehicleNo: "GJ3BW0003", ReceivableAmount: 3200, VehicleAmount: 350 },
      { DoorDeliveryNo: "DD20260002", DoorDeliveryDate: "04-04-2026", DoorDeliveryName: "Chakan Collection Run", IsDoorCollection: true, Transporter: "Eagle Tradelinks Pvt Ltd", VehicleNo: "GJ03BV7545", ReceivableAmount: 4100, VehicleAmount: 420 },
      { DoorDeliveryNo: "DD20260003", DoorDeliveryDate: "06-04-2026", DoorDeliveryName: "Nasik Door Run", IsDoorCollection: false, Transporter: "Own", VehicleNo: "GJ03BW2345", ReceivableAmount: 1950, VehicleAmount: 275 },
    ],
  },
  // EagleParcel LOCRPT/Delivery/DEL_DeliveryM/DEL_DeliveryM_DeliveryMRegister —
  // register of "Delivery - Add Multiple" (bulk) deliveries, joined with the
  // booking they came from. No dedicated register screen exists yet for
  // this bulk-delivery flow (only DMSDeliveryAddMultiple.vue, the form that
  // creates them), so this is added new rather than an update.
  rptdeliverymregister: {
    title: "Delivery M Register",
    icon: "fact_check",
    actionLabel: "Print",
    actionIcon: "print",
    filters: {
      dateRange: { field: "DeliveryMDate" },
      select: { key: "consignee", label: "Consignee", field: "ToPartyName" },
    },
    columns: [
      { name: "BookingMNo", label: "Booking No.", field: "BookingMNo", sortable: true },
      { name: "DeliveryMDate", label: "Delivery Date", field: "DeliveryMDate", sortable: true },
      { name: "ReceivedDate", label: "Received Date", field: "ReceivedDate" },
      { name: "ReceiverName", label: "Receiver", field: "ReceiverName" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "FromCityName", label: "From City", field: "FromCityName" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "ReceivableAmount", label: "Net Amt.", field: "ReceivableAmount", align: "right" },
      { name: "ReceivedAmount", label: "Received Amt.", field: "ReceivedAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingMNo: "RKGM21040021", DeliveryMDate: "05-04-2026", ReceivedDate: "05-04-2026", ReceiverName: "Suresh Fasteners", ToPartyName: "Sumit Precision Fasteners", FromPartyName: "Amul Industries Pvt Ltd", FromCityName: "Chakan", ItemName: "Carton", Quantity: 6, ReceivableAmount: 1450, ReceivedAmount: 1450 },
      { BookingMNo: "RKGM21040022", DeliveryMDate: "06-04-2026", ReceivedDate: "06-04-2026", ReceiverName: "Rakesh Varun", ToPartyName: "Varun Casting Co", FromPartyName: "Bhavya Distributors", FromCityName: "Bangalore", ItemName: "Box", Quantity: 10, ReceivableAmount: 980, ReceivedAmount: 980 },
      { BookingMNo: "RKGM21040023", DeliveryMDate: "08-04-2026", ReceivedDate: "", ReceiverName: "", ToPartyName: "Mahindra Heavy Engines Ltd", FromPartyName: "Krishna Engineering", FromCityName: "Pune", ItemName: "Drum", Quantity: 4, ReceivableAmount: 720, ReceivedAmount: 0 },
    ],
  },
  // EagleParcel LOCRPT/Delivery/DEL_DeliveryM/DEL_DeliveryM_DoorDeliveryMRegister
  // (+ its "Small" print-size variant, same underlying data) — the Delivery M
  // items grouped/trip-printed under a Door Delivery M Trip; TripNo/
  // TripVehicle below stand in for the RDLC's per-trip group header/footer.
  rptdoordeliverymregister: {
    title: "Door Delivery M Register",
    icon: "local_shipping",
    actionLabel: "Print",
    actionIcon: "print",
    filters: {
      dateRange: { field: "DeliveryMDate" },
      select: { key: "vehicle", label: "Vehicle", field: "TripVehicle" },
    },
    columns: [
      { name: "TripNo", label: "Trip No.", field: "TripNo", sortable: true },
      { name: "TripVehicle", label: "Vehicle", field: "TripVehicle" },
      { name: "BookingMNo", label: "LR No.", field: "BookingMNo", sortable: true },
      { name: "DeliveryMDate", label: "Delivery Date", field: "DeliveryMDate" },
      { name: "ReceivedDate", label: "Received Date", field: "ReceivedDate" },
      { name: "ReceiverName", label: "Receiver", field: "ReceiverName" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "FromCityName", label: "From City", field: "FromCityName" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "ReceivableAmount", label: "Net Amt.", field: "ReceivableAmount", align: "right" },
      { name: "ReceivedAmount", label: "Received Amt.", field: "ReceivedAmount", align: "right" },
    ],
    rows: [
      { TripNo: "DDMT-1001", TripVehicle: "GJ3BW0003", BookingMNo: "RKGM21040021", DeliveryMDate: "05-04-2026", ReceivedDate: "05-04-2026", ReceiverName: "Suresh Fasteners", ToPartyName: "Sumit Precision Fasteners", FromPartyName: "Amul Industries Pvt Ltd", FromCityName: "Chakan", ItemName: "Carton", Quantity: 6, ReceivableAmount: 1450, ReceivedAmount: 1450 },
      { TripNo: "DDMT-1001", TripVehicle: "GJ3BW0003", BookingMNo: "RKGM21040024", DeliveryMDate: "05-04-2026", ReceivedDate: "05-04-2026", ReceiverName: "Suresh Fasteners", ToPartyName: "Sumit Precision Fasteners", FromPartyName: "Paras Exports", FromCityName: "Chakan", ItemName: "Pallet", Quantity: 2, ReceivableAmount: 610, ReceivedAmount: 610 },
      { TripNo: "DDMT-1002", TripVehicle: "GJ03BV7545", BookingMNo: "RKGM21040025", DeliveryMDate: "07-04-2026", ReceivedDate: "", ReceiverName: "", ToPartyName: "Carver Welding Pvt. Ltd", FromPartyName: "Krishna Engineering", FromCityName: "Pune", ItemName: "Drum", Quantity: 5, ReceivableAmount: 890, ReceivedAmount: 0 },
    ],
  },
  // EagleParcel LOCRPT/Delivery/DEL_DoorDelivery/DEL_DoorDelivery_Detail —
  // consignment-level detail within a Door Delivery run (grouped by
  // consignor/consignee), distinct from DEL_DoorDelivery_Register's one-
  // row-per-run summary that DMSDoorDeliveryRegister.vue already covers.
  rptdoordeliverydetail: {
    title: "Door Delivery Detail",
    icon: "list_alt",
    actionLabel: "Print",
    actionIcon: "print",
    filters: {
      dateRange: { field: "BookingDate" },
      select: { key: "consignee", label: "Consignee", field: "ToPartyName" },
    },
    columns: [
      { name: "BookingNo", label: "L.R. No.", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "PaymentType", label: "Pay. Type", field: "PaymentType" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "ItemBillNo", label: "Bill No.", field: "ItemBillNo" },
      { name: "ItemBillValue", label: "Bill Value", field: "ItemBillValue", align: "right" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "Weight", label: "Weight", field: "Weight", align: "right" },
      { name: "ReceivableAmount", label: "Net Amt.", field: "ReceivableAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", FromPartyName: "Bhavya Distributors", ToPartyName: "Varun Casting Co", PaymentType: "ToPay", ItemName: "Box", ItemBillNo: "INV-4821", ItemBillValue: 18500, Quantity: 12, Weight: 96, ReceivableAmount: 1250 },
      { BookingNo: "RKG21040014", BookingDate: "03-04-2026", FromPartyName: "Amul Industries Pvt Ltd", ToPartyName: "Sumit Precision Fasteners", PaymentType: "Paid", ItemName: "Pallet", ItemBillNo: "INV-4830", ItemBillValue: 42000, Quantity: 1, Weight: 620, ReceivableAmount: 3200 },
      { BookingNo: "RKG21040015", BookingDate: "04-04-2026", FromPartyName: "Paras Exports", ToPartyName: "Carver Welding Pvt. Ltd", PaymentType: "Cash", ItemName: "Drum", ItemBillNo: "INV-4837", ItemBillValue: 9600, Quantity: 5, Weight: 175, ReceivableAmount: 875 },
    ],
  },
  rptsiregisteraccountservicetax: {
    title: "SI Register - Account - Service Tax",
    icon: "receipt_long",
    actionLabel: "Print",
    actionIcon: "print",
    // EagleParcel LOCRPT/Sale/SAL_SI/SAL_SIRegister_Account.rdlc: grouped by
    // Party, table columns are Invoice No/Date, Non Taxable Freight, Taxable
    // Freight, S.T. Amt., Edu. Amt., S.H. Edu. Amt., S.B.C. (Clean India
    // Cess), K.K.C. (Krishi Kalyan Cess), Total Tax Amt., Dis. Amt., Total
    // Amt., Kasar Amt., Net Amt. From/To Date + Party filter screen.
    filters: {
      dateRange: { field: "SIDate" },
      select: { key: "party", label: "Party", field: "PartyName" },
    },
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "PartyName", label: "Party", field: "PartyName" },
      { name: "NonTaxableAmount", label: "Non Taxable Freight", field: "NonTaxableAmount", align: "right" },
      { name: "TaxableAmount", label: "Taxable Freight", field: "TaxableAmount", align: "right" },
      { name: "ServiceTaxAmount", label: "S.T. Amt.", field: "ServiceTaxAmount", align: "right" },
      { name: "EducessAmount", label: "Edu. Amt.", field: "EducessAmount", align: "right" },
      { name: "SHEducessAmount", label: "S.H. Edu. Amt.", field: "SHEducessAmount", align: "right" },
      { name: "CleanIndiaCessAmount", label: "S.B.C.", field: "CleanIndiaCessAmount", align: "right" },
      { name: "KrishiKalyanCessAmount", label: "K.K.C.", field: "KrishiKalyanCessAmount", align: "right" },
      { name: "TotalTaxAmount", label: "Total Tax Amt.", field: "TotalTaxAmount", align: "right" },
      { name: "DiscountAmount", label: "Dis. Amt.", field: "DiscountAmount", align: "right" },
      { name: "TotalAmount", label: "Total Amt.", field: "TotalAmount", align: "right" },
      { name: "KasarAmount", label: "Kasar Amt.", field: "KasarAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { SINo: "SI20260001", SIDate: "01-04-2026", PartyName: "Rajsani Polymers", NonTaxableAmount: 0, TaxableAmount: 12500, ServiceTaxAmount: 0, EducessAmount: 0, SHEducessAmount: 0, CleanIndiaCessAmount: 0, KrishiKalyanCessAmount: 0, TotalTaxAmount: 0, DiscountAmount: 0, TotalAmount: 12500, KasarAmount: 0, NetAmount: 12500 },
      { SINo: "SI20260002", SIDate: "02-04-2026", PartyName: "Varun Casting Co", NonTaxableAmount: 0, TaxableAmount: 8400, ServiceTaxAmount: 0, EducessAmount: 0, SHEducessAmount: 0, CleanIndiaCessAmount: 0, KrishiKalyanCessAmount: 0, TotalTaxAmount: 0, DiscountAmount: 0, TotalAmount: 8400, KasarAmount: 0, NetAmount: 8400 },
      { SINo: "SI20260003", SIDate: "05-04-2026", PartyName: "Mahindra Heavy Engines Ltd", NonTaxableAmount: 0, TaxableAmount: 21300, ServiceTaxAmount: 0, EducessAmount: 0, SHEducessAmount: 0, CleanIndiaCessAmount: 0, KrishiKalyanCessAmount: 0, TotalTaxAmount: 0, DiscountAmount: 0, TotalAmount: 21300, KasarAmount: 0, NetAmount: 21300 },
    ],
  },
  rptsiregisteraccountgst: {
    title: "SI Register - Account - GST",
    icon: "receipt_long",
    // EagleParcel LOCRPT/Sale/SAL_SI/SAL_SIRegister_Account_GST.rdlc: grouped
    // by Party, columns are Invoice No/Date, Non Taxable Freight, Taxable
    // Freight Liability On Party, Taxable Freight Liability On GTA, CGST,
    // SGST, IGST, Total Tax Amt., Dis. Amt., Total Amt., Kasar Amt., Net Amt.
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "PartyName", label: "Party", field: "PartyName" },
      { name: "NonTaxableAmount", label: "Non Taxable Freight", field: "NonTaxableAmount", align: "right" },
      { name: "TaxableAmountByParty", label: "Taxable Freight (On Party)", field: "TaxableAmountByParty", align: "right" },
      { name: "TaxableAmountByGTA", label: "Taxable Freight (On GTA)", field: "TaxableAmountByGTA", align: "right" },
      { name: "CGSTAmount", label: "CGST", field: "CGSTAmount", align: "right" },
      { name: "SGSTAmount", label: "SGST", field: "SGSTAmount", align: "right" },
      { name: "IGSTAmount", label: "IGST", field: "IGSTAmount", align: "right" },
      { name: "TotalTaxAmount", label: "Total Tax Amt.", field: "TotalTaxAmount", align: "right" },
      { name: "DiscountAmount", label: "Dis. Amt.", field: "DiscountAmount", align: "right" },
      { name: "TotalAmount", label: "Total Amt.", field: "TotalAmount", align: "right" },
      { name: "KasarAmount", label: "Kasar Amt.", field: "KasarAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { SINo: "SI20260001", SIDate: "01-04-2026", PartyName: "Rajsani Polymers", NonTaxableAmount: 0, TaxableAmountByParty: 0, TaxableAmountByGTA: 12500, CGSTAmount: 312.5, SGSTAmount: 312.5, IGSTAmount: 0, TotalTaxAmount: 625, DiscountAmount: 0, TotalAmount: 13125, KasarAmount: 0, NetAmount: 13125 },
    ],
  },
  // BUK_Booking_CashSummary_GST.rdlc — Date/Booking Office/Payment Mode,
  // Taxable Freight By Party, CGST/SGST/IGST, Discount, Net Amt.
  rptcashsummarygst: {
    title: "Cash Summary - GST",
    icon: "summarize",
    columns: [
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName" },
      { name: "PaymentModeName", label: "Payment Mode", field: "PaymentModeName" },
      { name: "TaxableAmountByParty", label: "Taxable Freight", field: "TaxableAmountByParty", align: "right" },
      { name: "CGSTAmount", label: "CGST", field: "CGSTAmount", align: "right" },
      { name: "SGSTAmount", label: "SGST", field: "SGSTAmount", align: "right" },
      { name: "IGSTAmount", label: "IGST", field: "IGSTAmount", align: "right" },
      { name: "DiscountAmount", label: "Discount", field: "DiscountAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { Date: "01-04-2026", BookingOfficeName: "Greenland", PaymentModeName: "Cash", TaxableAmountByParty: 6000, CGSTAmount: 150, SGSTAmount: 150, IGSTAmount: 0, DiscountAmount: 0, NetAmount: 6300 },
      { Date: "02-04-2026", BookingOfficeName: "Chakan", PaymentModeName: "Online", TaxableAmountByParty: 4400, CGSTAmount: 0, SGSTAmount: 0, IGSTAmount: 220, DiscountAmount: 20, NetAmount: 4600 },
    ],
  },
  // BUK_Booking_CashSummary.rdlc — Date/Booking Office/Payment Mode,
  // Taxable/Non Taxable, S.T./Educess/S.H.Educess/S.B.C./K.K.C., Discount,
  // Net Amt.
  rptcashsummaryservicetax: {
    title: "Cash Summary - Service Tax",
    icon: "summarize",
    columns: [
      { name: "Date", label: "Date", field: "Date", sortable: true },
      { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName" },
      { name: "PaymentModeName", label: "Payment Mode", field: "PaymentModeName" },
      { name: "NonTaxableAmount", label: "Non Taxable", field: "NonTaxableAmount", align: "right" },
      { name: "TaxableAmount", label: "Taxable", field: "TaxableAmount", align: "right" },
      { name: "ServiceTaxAmount", label: "Service Tax", field: "ServiceTaxAmount", align: "right" },
      { name: "TotalTaxAmount", label: "Total Tax", field: "TotalTaxAmount", align: "right" },
      { name: "DiscountAmount", label: "Discount", field: "DiscountAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { Date: "01-04-2026", BookingOfficeName: "Greenland", PaymentModeName: "Cash", NonTaxableAmount: 0, TaxableAmount: 4500, ServiceTaxAmount: 0, TotalTaxAmount: 0, DiscountAmount: 0, NetAmount: 4500 },
      { Date: "02-04-2026", BookingOfficeName: "Vasai Eagle", PaymentModeName: "Cheque", NonTaxableAmount: 0, TaxableAmount: 3900, ServiceTaxAmount: 0, TotalTaxAmount: 0, DiscountAmount: 0, NetAmount: 3900 },
    ],
  },
  // BUK_Booking_BookingRegister.rdlc — grouped by Booking Office: Booking
  // No, Freight (Assessable Amt.), Service Tax, Total Tax, Discount, Kasar,
  // Net Amt., Received Amt.
  rptbookingregister: {
    title: "Booking Register",
    icon: "list_alt",
    columns: [
      { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName", sortable: true },
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "AssessableAmount", label: "Freight", field: "AssessableAmount", align: "right" },
      { name: "TotalTaxAmount", label: "Total Tax", field: "TotalTaxAmount", align: "right" },
      { name: "DiscountAmount", label: "Discount", field: "DiscountAmount", align: "right" },
      { name: "Kasar", label: "Kasar", field: "Kasar", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
      { name: "ReceivedAmount", label: "Received Amt.", field: "ReceivedAmount", align: "right" },
    ],
    rows: [
      { BookingOfficeName: "Greenland", BookingNo: "RKG21040011", BookingDate: "01-04-2026", AssessableAmount: 896, TotalTaxAmount: 44.8, DiscountAmount: 0, Kasar: 0, NetAmount: 940.8, ReceivedAmount: 940.8 },
      { BookingOfficeName: "Chakan", BookingNo: "RKG21040012", BookingDate: "01-04-2026", AssessableAmount: 1250, TotalTaxAmount: 62.5, DiscountAmount: 0, Kasar: 0, NetAmount: 1312.5, ReceivedAmount: 0 },
    ],
  },
  // Same underlying BUK_Booking_BookingRegister_GST.rdlc as rsbookingregistergst
  // above — kept as a distinct Reports-group entry (legacy app lists it under
  // both "Report Screens" and "Reports").
  rptbookingregistergst: {
    title: "Booking Register GST",
    icon: "receipt_long",
    columns: [
      { name: "BookingNo", label: "LR No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "PartyName", label: "Party", field: "PartyName" },
      { name: "PartyGSTNo", label: "GSTIN", field: "PartyGSTNo" },
      { name: "TaxableAmount", label: "Taxable Frt. (GTA)", field: "TaxableAmount", align: "right" },
      { name: "CGSTAmount", label: "CGST", field: "CGSTAmount", align: "right" },
      { name: "SGSTAmount", label: "SGST", field: "SGSTAmount", align: "right" },
      { name: "IGSTAmount", label: "IGST", field: "IGSTAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", PartyName: "Rajsani Polymers", PartyGSTNo: "24RAJ8586E1ZF", TaxableAmount: 896, CGSTAmount: 0, SGSTAmount: 0, IGSTAmount: 44.8, NetAmount: 940.8 },
    ],
  },
  rptsiregisteraccountgstr1: {
    title: "SI Register - Account - GSTR1",
    icon: "receipt_long",
    // EagleParcel LOCRPT/Sale/SAL_SI/SAL_SIRegister_GSTR1.rdlc "Cash Invoice"/
    // regular-invoice detail tables: Invoice No., Type, Date, Name Of Party,
    // GSTIN No., State, HSN, Qty., Basic Value, CGST %/Amt, SGST %/Amt,
    // IGST %/Amt, Net Amt. (plus separate Exemption/Cash Invoice Summary
    // tables, not represented in this flat mock grid).
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "InvoiceType", label: "Type", field: "InvoiceType" },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "PartyName", label: "Name Of Party", field: "PartyName" },
      { name: "GSTIN", label: "GSTIN No.", field: "GSTIN" },
      { name: "StateName", label: "State", field: "StateName" },
      { name: "HSNCode", label: "HSN", field: "HSNCode" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "TaxableValue", label: "Basic Value", field: "TaxableValue", align: "right" },
      { name: "CGSTPct", label: "CGST %", field: "CGSTPct", align: "right" },
      { name: "CGSTAmount", label: "CGST", field: "CGSTAmount", align: "right" },
      { name: "SGSTPct", label: "SGST %", field: "SGSTPct", align: "right" },
      { name: "SGSTAmount", label: "SGST", field: "SGSTAmount", align: "right" },
      { name: "IGSTPct", label: "IGST %", field: "IGSTPct", align: "right" },
      { name: "IGSTAmount", label: "IGST", field: "IGSTAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { SINo: "SI20260001", InvoiceType: "Regular", SIDate: "01-04-2026", PartyName: "Rajsani Polymers", GSTIN: "24RAJ8586E1ZF", StateName: "Gujarat", HSNCode: "9965", Quantity: 3, TaxableValue: 12500, CGSTPct: 2.5, CGSTAmount: 312.5, SGSTPct: 2.5, SGSTAmount: 312.5, IGSTPct: 0, IGSTAmount: 0, NetAmount: 13125 },
    ],
  },
  rptsiregisteraccountgstb2bb2c: {
    title: "SI Register - Account GST - B2B B2C",
    icon: "receipt_long",
    // EagleParcel LOCRPT/Sale/SAL_SI/SAL_SIRegister_Account_GSTB2BB2C.rdlc
    // detail table (grouped by B2B/B2C Category): Sr. No, Date, Invoice No.,
    // Party Name, GSTIN, Place of Supply, Reverse Charge (Y/N), Net Amt.,
    // Taxable Value, CGST, SGST, IGST — plus Category/Place-of-Supply summary
    // tables (not represented in this flat mock grid).
    columns: [
      { name: "SINo", label: "SI No.", field: "SINo", sortable: true },
      { name: "SIDate", label: "Date", field: "SIDate", sortable: true },
      { name: "PartyType", label: "B2B / B2C", field: "PartyType", align: "center" },
      { name: "PartyName", label: "Party Name", field: "PartyName" },
      { name: "GSTIN", label: "GSTIN", field: "GSTIN" },
      { name: "PlaceOfSupply", label: "Place of Supply", field: "PlaceOfSupply" },
      { name: "ReverseCharge", label: "Reverse Charge", field: "ReverseCharge", align: "center" },
      { name: "TaxableValue", label: "Taxable Value", field: "TaxableValue", align: "right" },
      { name: "CGSTAmount", label: "CGST", field: "CGSTAmount", align: "right" },
      { name: "SGSTAmount", label: "SGST", field: "SGSTAmount", align: "right" },
      { name: "IGSTAmount", label: "IGST", field: "IGSTAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { SINo: "SI20260001", SIDate: "01-04-2026", PartyType: "B2B", PartyName: "Rajsani Polymers", GSTIN: "24RAJ8586E1ZF", PlaceOfSupply: "Gujarat", ReverseCharge: "N", TaxableValue: 12500, CGSTAmount: 312.5, SGSTAmount: 312.5, IGSTAmount: 0, NetAmount: 13125 },
      { SINo: "SI20260003", SIDate: "05-04-2026", PartyType: "B2C", PartyName: "Mahindra Heavy Engines Ltd", GSTIN: "", PlaceOfSupply: "Maharashtra", ReverseCharge: "N", TaxableValue: 21300, CGSTAmount: 532.5, SGSTAmount: 532.5, IGSTAmount: 0, NetAmount: 22365 },
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
  // BUK_Commission_MismatchBooking.rdlc — Booking No/Date, Commission Type,
  // Payment Type, From City/Consignor/Consignee/To City, Item (bookings
  // whose commission type doesn't match the expected setup — no expected-
  // vs-actual commission amount columns in the actual RDLC).
  rptcommwisemismatchbooking: {
    title: "Comm. Wise Mismatch Booking",
    icon: "report_problem",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "CommissionType", label: "Commission Type", field: "CommissionType" },
      { name: "PaymentType", label: "Payment Type", field: "PaymentType" },
      { name: "FromCityName", label: "From City", field: "FromCityName" },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "ToCityName", label: "To City", field: "ToCityName" },
      { name: "ItemName", label: "Item", field: "ItemName" },
    ],
    rows: [
      { BookingNo: "RKG21040013", BookingDate: "03-04-2026", CommissionType: "Booking Office", PaymentType: "ToPay", FromCityName: "Bangalore", FromPartyName: "Mahindra Heavy Engines Ltd", ToPartyName: "Sumit Precision Fasteners", ToCityName: "Vasai", ItemName: "Carton" },
    ],
  },
  // BUK_BookingDeleteLog_Register.rdlc — Delete Date/User/Reason, Booking
  // No./Date, To City/Consignee/Consignor/From City, Item/Qty.
  rptbookingdeletelogregister: {
    title: "Booking Delete Log Register",
    icon: "delete_history",
    columns: [
      { name: "BookingNo", label: "Booking No", field: "BookingNo", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ToCityName", label: "To City", field: "ToCityName" },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "ItemName", label: "Item", field: "ItemName" },
      { name: "Quantity", label: "Qty", field: "Quantity", align: "right" },
      { name: "DeleteDate", label: "Deleted On", field: "DeleteDate", sortable: true },
      { name: "DeleteUserName", label: "Deleted By", field: "DeleteUserName" },
      { name: "DeleteRemarks", label: "Reason", field: "DeleteRemarks" },
    ],
    rows: [
      { BookingNo: "RKG21040009", BookingDate: "27-03-2026", ToCityName: "Rajkot-G", ToPartyName: "Rajsani Polymers", FromPartyName: "Mayur Marketing", ItemName: "Carton", Quantity: 2, DeleteDate: "28-03-2026 11:20 AM", DeleteUserName: "Admin", DeleteRemarks: "Duplicate entry" },
    ],
  },
  // BUK_OtherStateFreightChargePrint.rdlc + ...Print_FreightDeliveryCharge.rdlc
  // (booking-wise detail behind the voucher entered on DMSOtherStateFreightCharge.vue
  // / DMSBOOtherStateFreightCharge.vue) — grouped by To City: LR No/Date,
  // Consignee/Consignor, Qty., Freight Amt., Door Del. Amt., CGST/SGST/IGST,
  // Net Amt.
  rptotherstatefreightchargeregister: {
    title: "Other State Freight Charge Register",
    icon: "local_shipping",
    columns: [
      { name: "BookingToCityName", label: "City", field: "BookingToCityName", sortable: true },
      { name: "BookingNo", label: "LR No", field: "BookingNo" },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "ToPartyName", label: "Consignee", field: "ToPartyName" },
      { name: "FromPartyName", label: "Consignor", field: "FromPartyName" },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "OtherStateFreightAmount", label: "Freight Amt.", field: "OtherStateFreightAmount", align: "right" },
      { name: "DoorDeliveryAmount", label: "Door Del. Amt.", field: "DoorDeliveryAmount", align: "right" },
      { name: "CGSTAmount", label: "CGST", field: "CGSTAmount", align: "right" },
      { name: "SGSTAmount", label: "SGST", field: "SGSTAmount", align: "right" },
      { name: "IGSTAmount", label: "IGST", field: "IGSTAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingToCityName: "Vasai", BookingNo: "RKG21040014", BookingDate: "03-04-2026", ToPartyName: "Sumit Precision Fasteners", FromPartyName: "Amul Industries Pvt Ltd", Quantity: 2, OtherStateFreightAmount: 3050, DoorDeliveryAmount: 150, CGSTAmount: 76.25, SGSTAmount: 76.25, IGSTAmount: 0, NetAmount: 3352.5 },
      { BookingToCityName: "Rajkot-G", BookingNo: "RKG21040011", BookingDate: "01-04-2026", ToPartyName: "Rajsani Polymers", FromPartyName: "Mayur Marketing", Quantity: 4, OtherStateFreightAmount: 896, DoorDeliveryAmount: 0, CGSTAmount: 0, SGSTAmount: 0, IGSTAmount: 44.8, NetAmount: 940.8 },
    ],
  },
  // BUK_OtherStateFreightCharge_SummaryPrint.rdlc — City/Date wise totals
  // only (no consignor/consignee/GST break-up): City, Date, Qty., Freight
  // Amt., TDS Amt., Net Amt.
  rptotherstatefreightchargesummary: {
    title: "Other State Freight Charge Summary",
    icon: "summarize",
    columns: [
      { name: "BookingToCityName", label: "City", field: "BookingToCityName", sortable: true },
      { name: "BookingDate", label: "Date", field: "BookingDate", sortable: true },
      { name: "Quantity", label: "Qty.", field: "Quantity", align: "right" },
      { name: "OtherStateFreightAmount", label: "Freight Amt.", field: "OtherStateFreightAmount", align: "right" },
      { name: "TDSAmount", label: "TDS Amt.", field: "TDSAmount", align: "right" },
      { name: "NetAmount", label: "Net Amt.", field: "NetAmount", align: "right", sortable: true },
    ],
    rows: [
      { BookingToCityName: "Vasai", BookingDate: "03-04-2026", Quantity: 2, OtherStateFreightAmount: 3050, TDSAmount: 30.5, NetAmount: 3019.5 },
      { BookingToCityName: "Rajkot-G", BookingDate: "01-04-2026", Quantity: 4, OtherStateFreightAmount: 896, TDSAmount: 8.96, NetAmount: 887.04 },
    ],
  },

  // ── Account ──────────────────────────────────────────────────────────
  // EagleParcel LOCRPT/Account/ACC_AccountVoucher/ACC_AccountVoucher_Register
  // — voucher register grid: Voucher/Vou.No/Date/Ref.No/Narration/Account
  // columns plus Credit/Debit Amt with a Grand Total row (dropped here,
  // same as this file's other totals-less mock grids). Filter screen:
  // From/To Date + Account, same shape as rptcoveringletter's.
  accountvoucherregister: {
    title: "Account Voucher Register",
    icon: "receipt_long",
    filters: {
      dateRange: { field: "VoucherDate" },
      select: { key: "account", label: "Account", field: "AccountName" },
    },
    columns: [
      { name: "VoucherName", label: "Voucher", field: "VoucherName" },
      { name: "VoucherNo", label: "Vou. No", field: "VoucherNo", sortable: true },
      { name: "VoucherDate", label: "Date", field: "VoucherDate", sortable: true },
      { name: "ReferenceNo", label: "Ref. No", field: "ReferenceNo" },
      { name: "Narration", label: "Narration", field: "Narration" },
      { name: "AccountName", label: "Account", field: "AccountName", sortable: true },
      { name: "CreditAmount", label: "Credit Amt.", field: "CreditAmount", align: "right" },
      { name: "DebitAmount", label: "Debit Amt.", field: "DebitAmount", align: "right" },
    ],
    rows: [
      { VoucherName: "Payment Voucher", VoucherNo: "AV-101", VoucherDate: "01-04-2026", ReferenceNo: "REF-2201", Narration: "Stationery purchase", AccountName: "Office Expenses", CreditAmount: 0, DebitAmount: 1500 },
      { VoucherName: "Receipt Voucher", VoucherNo: "AV-102", VoucherDate: "02-04-2026", ReferenceNo: "REF-2202", Narration: "Freight received from Varun Casting Co", AccountName: "Freight Income", CreditAmount: 8400, DebitAmount: 0 },
      { VoucherName: "Payment Voucher", VoucherNo: "AV-103", VoucherDate: "04-04-2026", ReferenceNo: "REF-2203", Narration: "Vehicle fuel expense", AccountName: "Office Expenses", CreditAmount: 0, DebitAmount: 2750 },
      { VoucherName: "Receipt Voucher", VoucherNo: "AV-104", VoucherDate: "05-04-2026", ReferenceNo: "REF-2204", Narration: "Commission received", AccountName: "Commission Income", CreditAmount: 1875, DebitAmount: 0 },
    ],
  },
  // EagleParcel LOCRPT/Account/ACC_JournalTran/ACC_JournalTran_AccountLedger
  // — running ledger for one account: Voucher/Vou No/Date/Narration/
  // Credit/Debit/Current Bal. columns (opening balance + closing balance
  // rows from the RDLC's table footer are represented here as ordinary
  // running-balance rows instead, same simplification as rscashcreditledger
  // above). Filter screen: From/To Date + Account.
  accountledger: {
    title: "Account Ledger",
    icon: "account_balance",
    filters: {
      dateRange: { field: "VoucherDate" },
      select: { key: "account", label: "Account", field: "AccountName" },
    },
    columns: [
      { name: "VoucherName", label: "Voucher", field: "VoucherName" },
      { name: "VoucherNo", label: "Vou No", field: "VoucherNo" },
      { name: "VoucherDate", label: "Date", field: "VoucherDate", sortable: true },
      { name: "Narration", label: "Narration", field: "Narration" },
      { name: "CreditAmount", label: "Credit", field: "CreditAmount", align: "right" },
      { name: "DebitAmount", label: "Debit", field: "DebitAmount", align: "right" },
      { name: "CurrentBalance", label: "Current Bal.", field: "CurrentBalance", align: "right", sortable: true },
    ],
    rows: [
      { AccountName: "Cash Account", VoucherName: "Payment Voucher", VoucherNo: "PV-11", VoucherDate: "01-04-2026", Narration: "Office rent paid", CreditAmount: 0, DebitAmount: 5000, CurrentBalance: 20000 },
      { AccountName: "Cash Account", VoucherName: "Receipt Voucher", VoucherNo: "RV-07", VoucherDate: "03-04-2026", Narration: "Freight collected from Rajsani Polymers", CreditAmount: 12500, DebitAmount: 0, CurrentBalance: 32500 },
      { AccountName: "Bank Account - HDFC", VoucherName: "Contra Voucher", VoucherNo: "CV-101", VoucherDate: "03-04-2026", Narration: "Cash deposited into bank", CreditAmount: 20000, DebitAmount: 0, CurrentBalance: 205000 },
      { AccountName: "Bank Account - HDFC", VoucherName: "Payment Voucher", VoucherNo: "PV-15", VoucherDate: "06-04-2026", Narration: "Vehicle repair payment", CreditAmount: 0, DebitAmount: 3200, CurrentBalance: 201800 },
    ],
  },

  // ── Security ─────────────────────────────────────────────────────────
  seclogin: {
    title: "User Login Log",
    icon: "history",
    columns: [
      { name: "UserName", label: "User Name", field: "UserName", sortable: true },
      { name: "LoginTime", label: "Login Time", field: "LoginTime", sortable: true },
      { name: "LogoutTime", label: "Logout Time", field: "LogoutTime" },
      { name: "IPAddress", label: "IP Address", field: "IPAddress" },
      { name: "Status", label: "Status", field: "Status", align: "center" },
    ],
    rows: [
      { UserName: "admin", LoginTime: "01-04-2026 09:02 AM", LogoutTime: "01-04-2026 06:15 PM", IPAddress: "192.168.12.10", Status: "Success" },
      { UserName: "ketan.patel", LoginTime: "01-04-2026 09:20 AM", LogoutTime: "01-04-2026 05:45 PM", IPAddress: "192.168.12.21", Status: "Success" },
      { UserName: "suresh.rao", LoginTime: "01-04-2026 10:05 AM", LogoutTime: "", IPAddress: "192.168.12.34", Status: "Success" },
      { UserName: "devuser", LoginTime: "31-03-2026 08:55 PM", LogoutTime: "", IPAddress: "192.168.12.55", Status: "Failed" },
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
