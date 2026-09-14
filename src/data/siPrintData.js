// Mock data for the SI (Sale Invoice) Print document — the one thing the
// existing "Sale > SI" screens (DMSSaleSI.vue's list/form, and the
// SI Register reports in reportsData.js) don't cover: the actual invoice
// document a party is handed, matching EagleParcel's
// LOCRPT/Sale/SAL_SI/SAL_SIPrint_WithHeader(.rdlc)/_WithoutHeader(.rdlc) and
// their _GST siblings — company + party letterhead block, per-booking line
// items (L.R. No./Date/Client/Destination/Bill No./Qty./Weight/Total Amt.),
// a tax summary (Service Tax or CGST/SGST/IGST depending on the invoice),
// Amount In Words, and Terms & Conditions. No live invoicing engine exists
// yet, so this is self-contained mock data in the same spirit as
// DMSSaleSI.vue's own MOCK_SI (a separate, richer record shape — SI Print
// needs company/party address + per-booking lines that the plain SI list
// doesn't carry).
const MOCK_SI_PRINT = [
  {
    SIID: 1,
    InvoiceNo: "SI20260001",
    InvoiceDate: "01-04-2026",
    InvoiceFromDate: "01-04-2026",
    InvoiceToDate: "30-04-2026",
    PartyName: "Rajsani Polymers",
    PartyAddress: "Plot 14, GIDC Industrial Estate",
    PartyCityName: "Rajkot-G",
    PartyGSTNo: "24RAJ8586E1ZF",
    PartyRole: "Consignee",
    PONo: "PO-4471",
    GSTApplicable: true,
    Remarks: "Freight charges for April 2026 bookings",
    TermsConditions: [
      "Payment due within 30 days of invoice date.",
      "Interest @18% p.a. will be charged on overdue payments.",
      "Subject to Rajkot jurisdiction only.",
    ],
    Items: [
      { BookingNo: "RKG21040011", BookingDate: "01-04-2026", OppositePartyName: "Mayur Marketing", Destination: "Rajkot-G", ItemBillNo: "BL4021", Quantity: 3, Weight: 120, FreightAmount: 850, DoorDeliveryAmount: 0, DoorCollectionAmount: 0, OtherAmount: 46, AssessableAmount: 896, TaxAmount: 44.8, NetAmount: 940.8 },
      { BookingNo: "RKG21040012", BookingDate: "01-04-2026", OppositePartyName: "Bhavya Distributors", Destination: "Rajkot-G", ItemBillNo: "BL4022", Quantity: 5, Weight: 210, FreightAmount: 1180, DoorDeliveryAmount: 70, DoorCollectionAmount: 0, OtherAmount: 0, AssessableAmount: 1250, TaxAmount: 62.5, NetAmount: 1312.5 },
      { BookingNo: "RKG21040018", BookingDate: "18-04-2026", OppositePartyName: "Krishna Engineering", Destination: "Rajkot-G", ItemBillNo: "BL4029", Quantity: 12, Weight: 640, FreightAmount: 9600, DoorDeliveryAmount: 350, DoorCollectionAmount: 0, OtherAmount: 404, AssessableAmount: 10354, TaxAmount: 517.7, NetAmount: 10871.7 },
    ],
    SI_NonTaxableAmount: 0,
    SI_TaxableAmount: 12500,
    SI_CGSTAmount: 312.5,
    SI_SGSTAmount: 312.5,
    SI_IGSTAmount: 0,
    SI_ServiceTaxAmount: 0,
    SI_EducessAmount: 0,
    SI_SHEducessAmount: 0,
    SI_TotalTaxAmount: 625,
    SI_DiscountAmount: 0,
    SI_KasarAmount: 0,
    SI_NetAmount: 12500,
    SI_TotalAmount: 13125,
  },
  {
    SIID: 2,
    InvoiceNo: "SI20260002",
    InvoiceDate: "02-04-2026",
    InvoiceFromDate: "01-04-2026",
    InvoiceToDate: "30-04-2026",
    PartyName: "Varun Casting Co",
    PartyAddress: "Survey No. 62, Chakan MIDC",
    PartyCityName: "Chakan",
    PartyGSTNo: "27VAR1234F1ZK",
    PartyRole: "Consignor",
    PONo: "",
    GSTApplicable: true,
    Remarks: "",
    TermsConditions: [
      "Payment due within 30 days of invoice date.",
      "Interest @18% p.a. will be charged on overdue payments.",
    ],
    Items: [
      { BookingNo: "RKG21040013", BookingDate: "02-04-2026", OppositePartyName: "Mahindra Heavy Engines Ltd", Destination: "Vasai", ItemBillNo: "BL4024", Quantity: 8, Weight: 480, FreightAmount: 7200, DoorDeliveryAmount: 0, DoorCollectionAmount: 200, OtherAmount: 0, AssessableAmount: 7400, TaxAmount: 1332, NetAmount: 8732 },
      { BookingNo: "RKG21040014", BookingDate: "02-04-2026", OppositePartyName: "Sumit Precision Fasteners", Destination: "Vasai", ItemBillNo: "BL4025", Quantity: 2, Weight: 90, FreightAmount: 980, DoorDeliveryAmount: 20, DoorCollectionAmount: 0, OtherAmount: 0, AssessableAmount: 1000, TaxAmount: 180, NetAmount: 1180 },
    ],
    SI_NonTaxableAmount: 0,
    SI_TaxableAmount: 8400,
    SI_CGSTAmount: 0,
    SI_SGSTAmount: 0,
    SI_IGSTAmount: 1512,
    SI_ServiceTaxAmount: 0,
    SI_EducessAmount: 0,
    SI_SHEducessAmount: 0,
    SI_TotalTaxAmount: 1512,
    SI_DiscountAmount: 0,
    SI_KasarAmount: 0,
    SI_NetAmount: 8400,
    SI_TotalAmount: 9912,
  },
  {
    SIID: 3,
    InvoiceNo: "SI20260003",
    InvoiceDate: "05-04-2026",
    InvoiceFromDate: "01-04-2026",
    InvoiceToDate: "30-04-2026",
    PartyName: "Mahindra Heavy Engines Ltd",
    PartyAddress: "Plot 3, MIDC Phase II",
    PartyCityName: "Vasai",
    PartyGSTNo: "",
    PartyRole: "Consignee",
    PONo: "PO-9021",
    GSTApplicable: false,
    Remarks: "Service Tax invoice — pre-GST style booking series",
    TermsConditions: [
      "Payment due within 30 days of invoice date.",
      "Subject to Rajkot jurisdiction only.",
    ],
    Items: [
      { BookingNo: "RKG21040015", BookingDate: "04-04-2026", OppositePartyName: "Paras Exports", Destination: "Vasai", ItemBillNo: "BL4030", Quantity: 5, Weight: 175, FreightAmount: 20300, DoorDeliveryAmount: 0, DoorCollectionAmount: 0, OtherAmount: 1000, AssessableAmount: 21300, TaxAmount: 0, NetAmount: 21300 },
    ],
    SI_NonTaxableAmount: 0,
    SI_TaxableAmount: 21300,
    SI_CGSTAmount: 0,
    SI_SGSTAmount: 0,
    SI_IGSTAmount: 0,
    SI_ServiceTaxAmount: 0,
    SI_EducessAmount: 0,
    SI_SHEducessAmount: 0,
    SI_TotalTaxAmount: 0,
    SI_DiscountAmount: 0,
    SI_KasarAmount: 0,
    SI_NetAmount: 21300,
    SI_TotalAmount: 21300,
  },
];

export function apiGetSIPrintList() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_SI_PRINT]), 150);
  });
}
