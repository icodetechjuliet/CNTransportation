// Booking module's mock "backend" — same pattern as src/data/tripData.js /
// src/data/deliveryData.js (its own plain JS module, localStorage-backed so
// add/edit/delete persist like a real DB, instead of a `const MOCK_DATA = {}`
// baked into each .vue file). Covers every "Booking" tab (menu code "BK")
// page whose rows previously lived only in component state:
//   - DMSBooking.vue / DMSBBooking.vue / DMSTruckBooking.vue — three list
//     pages over the SAME underlying booking records (Booking, its
//     read-only "BBooking" view, and the Truck-only slice), so they share
//     one SEED_BOOKINGS/MOCK_BOOKINGS array + one MOCK_DATA_BOOKING lookup
//     below, same as deliveryData.js shares one MOCK_BOOKINGS across
//     several exports.
//   - DMSBookingWeb.vue / DMSBookingSeriesTransfer.vue /
//     DMSReceiptNoRenumbering.vue / DMSCashCredit.vue / DMSCommission.vue /
//     DMSParcelHandlingCharge.vue / DMSOtherStateFreightCharge.vue — each a
//     genuinely separate entity, so each keeps its own SEED/persist pair
//     inside this one module (mirrors deliveryData.js's
//     bookings/deliveries/doorDeliveries/rates/invoices split).
// Their own Add/Edit/View full-page companions (DMSBookingView.vue,
// DMSBBookingView.vue, DMSTruckBookingView.vue, DMSBookingWebView.vue,
// DMSCashCreditView.vue, DMSCommissionView.vue,
// DMSParcelHandlingChargeView.vue, DMSOtherStateFreightChargeView.vue) now
// import straight from here too, instead of from the list page's .vue file.

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Private browsing, storage disabled, or corrupt JSON — fall back to
    // the seed data below rather than breaking the page.
  }
  return fallback;
}

function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Storage full/unavailable — the in-memory copy still works for the
    // rest of this session, it just won't survive a reload.
  }
}

const BOOKINGS_KEY = "cn_booking_bookings_v1";
const SERIES_TRANSFER_KEY = "cn_booking_series_transfer_v1";
const RECEIPT_RENUMBER_KEY = "cn_booking_receipt_renumber_v1";
const CASH_CREDITS_KEY = "cn_booking_cash_credits_v1";
const BK_COMMISSIONS_KEY = "cn_booking_commissions_v1";
const PARCEL_CHARGES_KEY = "cn_booking_parcel_handling_charges_v1";
const OSF_CHARGES_KEY = "cn_booking_other_state_freight_charges_v1";
const WEB_BOOKINGS_KEY = "cn_booking_web_bookings_v1";

// ── Booking / BBooking / Truck Booking — one shared list of records ───────
// (identical row shape/content across all three pages before this
// migration, so one array now backs all three instead of three
// independently-drifting in-memory copies).
const SEED_BOOKINGS = [
  {
    BookingId: 1,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040001",
    BookingDate: "01/04/2026",
    BookingTime: "10:33 AM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Chakan",
    DeliveryCity: "",
    ConsigneeName: "Galaxy xxx Tooling",
    ConsignorName: "Balaji xxx Co.",
    FromCity: "Rajkot-G",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "own",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Chakan",
    ConsignorAccount: "Balaji xxx Co.",
    ConsigneeAccount: "Select Party",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24BUHPS2708D1ZT",
    ToGSTNo: "27ATJPB8586E1ZF",
    EWayBillNo: "601284646429",
    BillNo: "92",
    BillValue: 5520,
    Item: "Box",
    PartNo: "",
    Quantity: 1,
    Weight: null,
    Rate: null,
    FreightAmount: 200,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 50,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Select Payment",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "6.25",
    SGSTRate: 2.5,
    SGSTAmt: "6.25",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "250.00",
    TotalTax: "12.50",
    Discount: 0,
    NetAmt: "262.50",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Chakan-Maharashtra-27",
    FromAddress: "Rajkot-G – Gujarat\nState Code:24",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 12:48 PM",
    PrintBy: "Ketan",
    Count: 2,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 2,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040002",
    BookingDate: "01/04/2026",
    BookingTime: "11:47 AM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Nasik",
    DeliveryCity: "",
    ConsigneeName: "Ring xxx Ltd",
    ConsignorName: "Rajsani xxx Polymers",
    FromCity: "Rajkot-G",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "own",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Nasik",
    ConsignorAccount: "Rajsani xxx Polymers",
    ConsigneeAccount: "Ring xxx Aqua",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24XYZAA1234B1ZT",
    ToGSTNo: "27RING1234B1ZF",
    EWayBillNo: "701284646430",
    BillNo: "93",
    BillValue: 3200,
    Item: "Parcel",
    PartNo: "",
    Quantity: 2,
    Weight: 15,
    Rate: null,
    FreightAmount: 300,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: false,
    OtherAmt: 0,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Cash",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "7.50",
    SGSTRate: 2.5,
    SGSTAmt: "7.50",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "300.00",
    TotalTax: "15.00",
    Discount: 0,
    NetAmt: "315.00",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Nasik-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 11:00 AM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 3,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040003",
    BookingDate: "01/04/2026",
    BookingTime: "11:52 AM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Hyderabad",
    DeliveryCity: "",
    ConsigneeName: "Bhavya xxx Distributors",
    ConsignorName: "Vansh xxx Llp",
    FromCity: "Rajkot-G",
    PaymentType: "ToPay",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Hyderabad",
    ConsignorAccount: "Vansh xxx Llp",
    ConsigneeAccount: "Bhavya xxx Distributors",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24VAN1234D1ZT",
    ToGSTNo: "36BHV8586E1ZF",
    EWayBillNo: "501234646431",
    BillNo: "94",
    BillValue: 8400,
    Item: "Pallet",
    PartNo: "",
    Quantity: 5,
    Weight: 120,
    Rate: 3.8,
    FreightAmount: 456,
    IsDoorDelivery: true,
    DoorDeliveryAmt: 80,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 50,
    STBy: "Consignor",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "NEFT",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "29.30",
    ServiceTax: 0,
    TotalAmt: "586.00",
    TotalTax: "29.30",
    Discount: 0,
    NetAmt: "615.30",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "REF2021-03",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Hyderabad - Telangana",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "Fragile items",
    DisplayRemarks: "",
    LockDate: "03/04/2026",
    LockBy: "pratik",
    PrintDate: "02/04/2026 12:00 PM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 4,
    BookingType: "Outward",
    DeliveryType: "Door Delivery",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040004",
    BookingDate: "01/04/2026",
    BookingTime: "04:17 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Chakan",
    DeliveryCity: "",
    ConsigneeName: "Sumit xxx Fasteners",
    ConsignorName: "Mona xxx Llp",
    FromCity: "Rajkot-G",
    PaymentType: "TBBR",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Chakan",
    ConsignorAccount: "Mona xxx Llp",
    ConsigneeAccount: "Sumit xxx Fasteners",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24MON1234A1ZT",
    ToGSTNo: "27SUM8586E1ZF",
    EWayBillNo: "401234646432",
    BillNo: "95",
    BillValue: 1200,
    Item: "Box",
    PartNo: "",
    Quantity: 3,
    Weight: 18,
    Rate: 3.5,
    FreightAmount: 63,
    IsDoorDelivery: true,
    DoorDeliveryAmt: 40,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 50,
    STBy: "Consignee",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 430,
    OtherFreightAc: "Shree Ram Tempo Service",
    PaymentMode: "Cash",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "7.65",
    ServiceTax: 0,
    TotalAmt: "153.00",
    TotalTax: "7.65",
    Discount: 0,
    NetAmt: "160.65",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Chakan-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "03/04/2026",
    LockBy: "Ketan",
    PrintDate: "02/04/2026 04:20 PM",
    PrintBy: "Ketan",
    Count: 3,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 5,
    BookingType: "Outward",
    DeliveryType: "Door Delivery",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040005",
    BookingDate: "01/04/2026",
    BookingTime: "05:15 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Vasai",
    DeliveryCity: "",
    ConsigneeName: "Krishna xxx Wire...",
    ConsignorName: "Nepolion xxx Packaging",
    FromCity: "Rajkot-G",
    PaymentType: "Paid",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Vasai",
    ConsignorAccount: "Nepolion xxx Packaging",
    ConsigneeAccount: "Krishna xxx Engineering",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24NEP1234B1ZT",
    ToGSTNo: "27KRS8586E1ZF",
    EWayBillNo: "301234646433",
    BillNo: "96",
    BillValue: 6700,
    Item: "Box",
    PartNo: "",
    Quantity: 4,
    Weight: 45,
    Rate: 4.0,
    FreightAmount: 180,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: false,
    OtherAmt: 0,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "NEFT",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "9.00",
    ServiceTax: 0,
    TotalAmt: "180.00",
    TotalTax: "9.00",
    Discount: 0,
    NetAmt: "189.00",
    Received: 180,
    RefUser: "",
    CashCredit: false,
    PayReceived: true,
    PayReceivedDate: "2026-04-05",
    ReferenceNo: "REF2021-05",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Vasai-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 05:18 PM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 6,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040006",
    BookingDate: "01/04/2026",
    BookingTime: "06:00 PM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Pune",
    DeliveryCity: "",
    ConsigneeName: "Carver xxx Ltd",
    ConsignorName: "Carver xxx Ltd",
    FromCity: "Rajkot-G",
    PaymentType: "Paid",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "own",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Pune",
    ConsignorAccount: "Carver xxx Ltd",
    ConsigneeAccount: "Carver xxx Ltd",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24CAR1234C1ZT",
    ToGSTNo: "27CAR8586E1ZF",
    EWayBillNo: "201234646434",
    BillNo: "97",
    BillValue: 9900,
    Item: "Crate",
    PartNo: "",
    Quantity: 2,
    Weight: 80,
    Rate: null,
    FreightAmount: 550,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: false,
    OtherAmt: 0,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Cheque",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "13.75",
    SGSTRate: 2.5,
    SGSTAmt: "13.75",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "550.00",
    TotalTax: "27.50",
    Discount: 0,
    NetAmt: "577.50",
    Received: 550,
    RefUser: "",
    CashCredit: false,
    PayReceived: true,
    PayReceivedDate: "2026-04-03",
    ReferenceNo: "CHQ-00123",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "HDFC Bank",
    ToAddress: "Pune-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 06:05 PM",
    PrintBy: "Ketan",
    Count: 2,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 7,
    BookingType: "Outward",
    DeliveryType: "Door Delivery",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040007",
    BookingDate: "01/04/2026",
    BookingTime: "08:15 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Mumbai",
    DeliveryCity: "",
    ConsigneeName: "Mahindra xxx Ltd",
    ConsignorName: "Varun xxx Co",
    FromCity: "Rajkot-G",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Mumbai",
    ConsignorAccount: "Varun xxx Co",
    ConsigneeAccount: "Mahindra xxx Ltd",
    ConsignorPhone: "9876543210",
    ConsigneePhone: "9988776655",
    FromGSTNo: "24AAMFV5464H1ZT",
    ToGSTNo: "27AAFCM0476N1Z2",
    EWayBillNo: "691284754071",
    BillNo: "G1",
    BillValue: 245384,
    Item: "pallate",
    PartNo: "",
    Quantity: 1,
    Weight: 1140,
    Rate: 3.8,
    FreightAmount: 4332,
    IsDoorDelivery: true,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 50,
    STBy: "Consignor",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Select Payment",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "109.55",
    SGSTRate: 2.5,
    SGSTAmt: "109.55",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "4382.00",
    TotalTax: "219.10",
    Discount: 0,
    NetAmt: "4382.00",
    Received: 0,
    RefUser: "deepak",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Chakan – Maharashtra\nState Code:27",
    FromAddress:
      "NH 8B, GONDAL ROAD, SURVEY NO.150, VILLAGE-PADAVALA, TAL-KOTADA SANGANI, Rajkot-",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "08/04/2026",
    LockBy: "pratik",
    PrintDate: "02/04/2026 10:33 AM",
    PrintBy: "pratik",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 8,
    BookingType: "Outward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040008",
    BookingDate: "01/04/2026",
    BookingTime: "11:24 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Nasik",
    DeliveryCity: "",
    ConsigneeName: "Mahindra xxx Ltd",
    ConsignorName: "Amul xxx Ltd",
    FromCity: "Rajkot-G",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Greenland",
    Load: "Truck",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Nasik",
    ConsignorAccount: "Amul xxx Ltd",
    ConsigneeAccount: "Mahindra xxx Ltd",
    ConsignorPhone: "",
    ConsigneePhone: "",
    FromGSTNo: "24AMU1234A1ZT",
    ToGSTNo: "27MAH8586E1ZF",
    EWayBillNo: "891234646435",
    BillNo: "A5",
    BillValue: 18000,
    Item: "Box",
    PartNo: "",
    Quantity: 6,
    Weight: 200,
    Rate: 3.2,
    FreightAmount: 640,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: false,
    OtherAmt: 0,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Select Payment",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "32.00",
    ServiceTax: 0,
    TotalAmt: "640.00",
    TotalTax: "32.00",
    Discount: 0,
    NetAmt: "672.00",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Nasik-Maharashtra",
    FromAddress: "Rajkot-G – Gujarat",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 11:30 PM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  // ── Inward records ──
  {
    BookingId: 9,
    BookingType: "Inward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040009",
    BookingDate: "01/04/2026",
    BookingTime: "09:15 AM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Rajkot-G",
    DeliveryCity: "",
    ConsigneeName: "Balaji xxx Co.",
    ConsignorName: "Paras xxx Exports",
    FromCity: "Mumbai",
    PaymentType: "TBBS",
    Status: "Delivered",
    BookedFrom: "Mumbai",
    Load: "own",
    FromBookingOffice: "Mumbai",
    ToBookingOffice: "Greenland",
    ConsignorAccount: "Paras xxx Exports",
    ConsigneeAccount: "Balaji xxx Co.",
    ConsignorPhone: "9876500001",
    ConsigneePhone: "9876500002",
    FromGSTNo: "27PAR1234A1ZT",
    ToGSTNo: "24BAL8586E1ZF",
    EWayBillNo: "110284646501",
    BillNo: "B11",
    BillValue: 12000,
    Item: "Box",
    PartNo: "",
    Quantity: 3,
    Weight: 60,
    Rate: 4.0,
    FreightAmount: 240,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: false,
    OtherAmt: 0,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "NEFT",
    taxType: "CGST_SGST",
    CGSTRate: 2.5,
    CGSTAmt: "6.00",
    SGSTRate: 2.5,
    SGSTAmt: "6.00",
    IGSTRate: 5,
    IGSTAmt: "0",
    ServiceTax: 0,
    TotalAmt: "240.00",
    TotalTax: "12.00",
    Discount: 0,
    NetAmt: "252.00",
    Received: 240,
    RefUser: "",
    CashCredit: false,
    PayReceived: true,
    PayReceivedDate: "2026-04-03",
    ReferenceNo: "INW-001",
    ReferenceDate: "",
    InvoiceNo: "INV-B11",
    BankName: "ICICI Bank",
    ToAddress: "Rajkot-G – Gujarat\nState Code:24",
    FromAddress: "Mumbai – Maharashtra\nState Code:27",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 09:20 AM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 10,
    BookingType: "Inward",
    DeliveryType: "Door Delivery",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040010",
    BookingDate: "01/04/2026",
    BookingTime: "12:30 PM",
    LoadCarrier: "Truck",
    Carrier: "Truck",
    ToCity: "Rajkot-G",
    DeliveryCity: "Rajkot-G",
    ConsigneeName: "Vansh xxx Llp",
    ConsignorName: "Pioneer xxx Ltd.",
    FromCity: "Pune",
    PaymentType: "ToPay",
    Status: "Delivered",
    BookedFrom: "Pune",
    Load: "Truck",
    FromBookingOffice: "Pune",
    ToBookingOffice: "Greenland",
    ConsignorAccount: "Pioneer xxx Ltd.",
    ConsigneeAccount: "Vansh xxx Llp",
    ConsignorPhone: "9876500003",
    ConsigneePhone: "9876500004",
    FromGSTNo: "27PIO1234B1ZT",
    ToGSTNo: "24VAN8586E1ZF",
    EWayBillNo: "220284646502",
    BillNo: "C22",
    BillValue: 7800,
    Item: "Parcel",
    PartNo: "",
    Quantity: 5,
    Weight: 90,
    Rate: 3.5,
    FreightAmount: 315,
    IsDoorDelivery: true,
    DoorDeliveryAmt: 50,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: true,
    OtherAmt: 30,
    STBy: "Consignee",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Cash",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "19.75",
    ServiceTax: 0,
    TotalAmt: "395.00",
    TotalTax: "19.75",
    Discount: 0,
    NetAmt: "414.75",
    Received: 0,
    RefUser: "",
    CashCredit: false,
    PayReceived: false,
    PayReceivedDate: "",
    ReferenceNo: "INW-002",
    ReferenceDate: "",
    InvoiceNo: "",
    BankName: "",
    ToAddress: "Rajkot-G – Gujarat\nState Code:24",
    FromAddress: "Pune – Maharashtra\nState Code:27",
    Remarks: "Handle with care",
    DisplayRemarks: "",
    LockDate: "04/04/2026",
    LockBy: "Ketan",
    PrintDate: "02/04/2026 12:35 PM",
    PrintBy: "Ketan",
    Count: 2,
    BookingDate_raw: "2026-04-01",
  },
  {
    BookingId: 11,
    BookingType: "Inward",
    DeliveryType: "Ware House",
    BookingMadeBy: "CargoNet User",
    BookingNo: "RKG21040011",
    BookingDate: "01/04/2026",
    BookingTime: "03:45 PM",
    LoadCarrier: "own",
    Carrier: "Own",
    ToCity: "Rajkot-G",
    DeliveryCity: "",
    ConsigneeName: "Rajsani xxx Polymers",
    ConsignorName: "Mayur xxx Marketing",
    FromCity: "Bangalore",
    PaymentType: "Paid",
    Status: "Delivered",
    BookedFrom: "Bangalore",
    Load: "own",
    FromBookingOffice: "Bangalore",
    ToBookingOffice: "Greenland",
    ConsignorAccount: "Mayur xxx Marketing",
    ConsigneeAccount: "Rajsani xxx Polymers",
    ConsignorPhone: "",
    ConsigneePhone: "9876500005",
    FromGSTNo: "29MAY1234C1ZT",
    ToGSTNo: "24RAJ8586E1ZF",
    EWayBillNo: "330284646503",
    BillNo: "D33",
    BillValue: 18500,
    Item: "Drum",
    PartNo: "",
    Quantity: 8,
    Weight: 280,
    Rate: 3.2,
    FreightAmount: 896,
    IsDoorDelivery: false,
    DoorDeliveryAmt: 0,
    IsDoorCollection: false,
    DoorCollectionAmt: 0,
    HasOther: false,
    OtherAmt: 0,
    STBy: "NoST",
    DiscountType: "Select Value",
    DiscountLeft: 0,
    Kasar: 0,
    OtherFreight: 0,
    OtherFreightAc: "Select Account",
    PaymentMode: "Cheque",
    taxType: "IGST",
    CGSTRate: 2.5,
    CGSTAmt: "0",
    SGSTRate: 2.5,
    SGSTAmt: "0",
    IGSTRate: 5,
    IGSTAmt: "44.80",
    ServiceTax: 0,
    TotalAmt: "896.00",
    TotalTax: "44.80",
    Discount: 0,
    NetAmt: "940.80",
    Received: 896,
    RefUser: "",
    CashCredit: false,
    PayReceived: true,
    PayReceivedDate: "2026-04-04",
    ReferenceNo: "INW-003",
    ReferenceDate: "",
    InvoiceNo: "INV-D33",
    BankName: "Axis Bank",
    ToAddress: "Rajkot-G – Gujarat\nState Code:24",
    FromAddress: "Bangalore – Karnataka\nState Code:29",
    Remarks: "",
    DisplayRemarks: "",
    LockDate: "",
    LockBy: "",
    PrintDate: "02/04/2026 03:50 PM",
    PrintBy: "Ketan",
    Count: 1,
    BookingDate_raw: "2026-04-01",
  },
];

const MOCK_DATA_BOOKING = {
  cities: [
    "Rajkot-G – Gujarat",
    "Chakan – Maharashtra",
    "Nasik – Maharashtra",
    "Hyderabad – Telangana",
    "Pune – Maharashtra",
    "Mumbai – Maharashtra",
    "Bangalore – Karnataka",
    "Vasai – Maharashtra",
    "Boriwali – Maharashtra",
  ],
  parties: [
    "Balaji Tools Co.",
    "Galaxy Cutting Tooling",
    "Rajsani Polymers",
    "Ring Plus Aqua Ltd",
    "Vansh Laminate Llp",
    "Bhavya Distributors",
    "Mona Metal Foam Llp",
    "Sumit Precision Fasteners",
    "Nepolion Packaging",
    "Krishna Engineering",
    "Carver Welding Pvt. Ltd",
    "Paras Exports",
    "Paresh Plastic Pvt Ltd",
    "PARAS INDUSTRIES",
    "Varun Casting Co",
    "Mahindra Heavy Engines Ltd",
    "Amul Industries Pvt Ltd",
    "Mahindra & Mahindra Ltd",
    "Shree Ram Tempo Service",
  ],
  bookingOffices: [
    "Greenland",
    "Chakan",
    "Nasik",
    "Hyderabad",
    "Pune",
    "Vasai",
    "Mumbai",
  ],
};

let MOCK_BOOKINGS = readStorage(BOOKINGS_KEY, null);
if (!Array.isArray(MOCK_BOOKINGS) || !MOCK_BOOKINGS.length) {
  MOCK_BOOKINGS = SEED_BOOKINGS.map((b) => ({ ...b }));
  writeStorage(BOOKINGS_KEY, MOCK_BOOKINGS);
}

function persistBookings() {
  writeStorage(BOOKINGS_KEY, MOCK_BOOKINGS);
}

export function apiGetBookings(fromDate, toDate, direction, search, carrierFilter) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_BOOKINGS];
      if (direction !== "All")
        result = result.filter((b) => b.BookingType === direction);
      if (carrierFilter === "truck")
        result = result.filter(
          (b) => b.LoadCarrier === "Truck" || b.Carrier === "Truck"
        );
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (b) =>
            b.BookingNo.toLowerCase().includes(s) ||
            b.ConsigneeName.toLowerCase().includes(s) ||
            b.ConsignorName.toLowerCase().includes(s) ||
            b.ToCity.toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiGetBookingById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_BOOKINGS.find((b) => b.BookingId === id) || null),
      100
    );
  });
}

export function apiSaveBooking(booking) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (booking.BookingId) {
        const idx = MOCK_BOOKINGS.findIndex(
          (b) => b.BookingId === booking.BookingId
        );
        if (idx !== -1) MOCK_BOOKINGS[idx] = { ...booking };
      } else {
        booking.BookingId = MOCK_BOOKINGS.length
          ? Math.max(...MOCK_BOOKINGS.map((b) => b.BookingId)) + 1
          : 1;
        booking.BookingNo =
          "RKG2104" + String(booking.BookingId).padStart(4, "0");
        booking.Status = "Pending";
        booking.BookingMadeBy = "CargoNet User";
        booking.PrintDate = new Date().toLocaleString();
        booking.PrintBy = "Admin";
        booking.Count = 1;
        MOCK_BOOKINGS.push(booking);
      }
      persistBookings();
      resolve({ success: true, data: booking });
    }, 250);
  });
}

// Mirrors the old app's BUK_BookingDeleteLog — deleting a booking always
// requires a reason, which is captured here (see confirmDeleteBooking() on
// each list page) instead of just splicing the record out silently.
export function apiDeleteBooking(id, reason) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_BOOKINGS.findIndex((b) => b.BookingId === id);
      if (idx !== -1) MOCK_BOOKINGS.splice(idx, 1);
      persistBookings();
      resolve({ success: true, reason });
    }, 150);
  });
}

export { MOCK_DATA_BOOKING };

// ── Booking Series Transfer — a utility screen (not a list+CRUD entity):
// reassigns a block of a booking number series from one booking office to
// another; only its transfer history log needs persisting. ────────────────
export const MOCK_DATA_SERIES_TRANSFER = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune"],
  series: ["RKG-2026", "CHK-2026", "NSK-2026"],
};

const SEED_SERIES_TRANSFER_HISTORY = [
  { HistoryId: 1, SeriesName: "RKG-2026", FromBookingOffice: "Greenland", ToBookingOffice: "Chakan", FromNo: "2200", ToNo: "2250", DoneOn: "25/03/2026 03:15 PM", DoneBy: "Admin" },
];

let MOCK_SERIES_TRANSFER_HISTORY = readStorage(SERIES_TRANSFER_KEY, null);
if (!Array.isArray(MOCK_SERIES_TRANSFER_HISTORY)) {
  MOCK_SERIES_TRANSFER_HISTORY = SEED_SERIES_TRANSFER_HISTORY.map((h) => ({ ...h }));
  writeStorage(SERIES_TRANSFER_KEY, MOCK_SERIES_TRANSFER_HISTORY);
}

function persistSeriesTransferHistory() {
  writeStorage(SERIES_TRANSFER_KEY, MOCK_SERIES_TRANSFER_HISTORY);
}

export function apiGetSeriesTransferHistory() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_SERIES_TRANSFER_HISTORY]), 150);
  });
}

export function apiAddSeriesTransfer(entry) {
  return new Promise((resolve) => {
    setTimeout(() => {
      entry.HistoryId = MOCK_SERIES_TRANSFER_HISTORY.length
        ? Math.max(...MOCK_SERIES_TRANSFER_HISTORY.map((h) => h.HistoryId)) + 1
        : 1;
      MOCK_SERIES_TRANSFER_HISTORY = [entry, ...MOCK_SERIES_TRANSFER_HISTORY];
      persistSeriesTransferHistory();
      resolve({ success: true, data: entry });
    }, 200);
  });
}

// ── Receipt No Renumbering — same shape as Series Transfer above. ─────────
export const MOCK_DATA_RECEIPT_RENUMBER = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune"],
  series: ["RKG-2026", "CHK-2026", "NSK-2026"],
};

const SEED_RECEIPT_RENUMBER_HISTORY = [
  { HistoryId: 1, BookingOfficeName: "Greenland", SeriesName: "RKG-2026", FromReceiptNo: "1050", ToReceiptNo: "1075", NewStartingNo: "1100", DoneOn: "28/03/2026 09:40 AM", DoneBy: "Admin" },
];

let MOCK_RECEIPT_RENUMBER_HISTORY = readStorage(RECEIPT_RENUMBER_KEY, null);
if (!Array.isArray(MOCK_RECEIPT_RENUMBER_HISTORY)) {
  MOCK_RECEIPT_RENUMBER_HISTORY = SEED_RECEIPT_RENUMBER_HISTORY.map((h) => ({ ...h }));
  writeStorage(RECEIPT_RENUMBER_KEY, MOCK_RECEIPT_RENUMBER_HISTORY);
}

function persistReceiptRenumberHistory() {
  writeStorage(RECEIPT_RENUMBER_KEY, MOCK_RECEIPT_RENUMBER_HISTORY);
}

export function apiGetReceiptRenumberHistory() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_RECEIPT_RENUMBER_HISTORY]), 150);
  });
}

export function apiAddReceiptRenumber(entry) {
  return new Promise((resolve) => {
    setTimeout(() => {
      entry.HistoryId = MOCK_RECEIPT_RENUMBER_HISTORY.length
        ? Math.max(...MOCK_RECEIPT_RENUMBER_HISTORY.map((h) => h.HistoryId)) + 1
        : 1;
      MOCK_RECEIPT_RENUMBER_HISTORY = [entry, ...MOCK_RECEIPT_RENUMBER_HISTORY];
      persistReceiptRenumberHistory();
      resolve({ success: true, data: entry });
    }, 200);
  });
}

// ── Cash Credit ─────────────────────────────────────────────────────────
export const MOCK_DATA_CASH_CREDIT = {
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
  bookingOffices: ["Greenland", "Chakan", "Rajkot-G", "Nasik"],
};

const SEED_CASH_CREDITS = [
  {
    CashCreditId: 1,
    VoucherNo: "CC0001",
    VoucherDate: "02/09/2026",
    PartyAccountName: "Balaji xxx Co.",
    ReferenceUserName: "Ketan Patel",
    BookingNo: "BK-1001",
    BookingOfficeName: "Greenland",
    ReceivedAmount: 3000,
    DebitAmount: 5000,
    PendingAmount: 2000,
    IsClear: false,
    Narration: "",
  },
  {
    CashCreditId: 2,
    VoucherNo: "CC0002",
    VoucherDate: "05/09/2026",
    PartyAccountName: "Rajsani xxx Polymers",
    ReferenceUserName: "Suresh Rao",
    BookingNo: "BK-1002",
    BookingOfficeName: "Chakan",
    ReceivedAmount: 4200,
    DebitAmount: 4200,
    PendingAmount: 0,
    IsClear: true,
    Narration: "",
  },
];

let MOCK_CASH_CREDITS = readStorage(CASH_CREDITS_KEY, null);
if (!Array.isArray(MOCK_CASH_CREDITS)) {
  MOCK_CASH_CREDITS = SEED_CASH_CREDITS.map((c) => ({ ...c }));
  writeStorage(CASH_CREDITS_KEY, MOCK_CASH_CREDITS);
}

function persistCashCredits() {
  writeStorage(CASH_CREDITS_KEY, MOCK_CASH_CREDITS);
}

export function apiGetCredits(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_CASH_CREDITS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.VoucherNo.toLowerCase().includes(s) ||
            (o.PartyAccountName || "").toLowerCase().includes(s) ||
            (o.BookingNo || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveCredit(credit) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credit.CashCreditId) {
        const idx = MOCK_CASH_CREDITS.findIndex((o) => o.CashCreditId === credit.CashCreditId);
        if (idx !== -1) MOCK_CASH_CREDITS[idx] = { ...credit };
      } else {
        credit.CashCreditId = MOCK_CASH_CREDITS.length
          ? Math.max(...MOCK_CASH_CREDITS.map((o) => o.CashCreditId)) + 1
          : 1;
        MOCK_CASH_CREDITS.push(credit);
      }
      persistCashCredits();
      resolve({ success: true, data: credit });
    }, 200);
  });
}

export function apiDeleteCredit(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_CASH_CREDITS.findIndex((o) => o.CashCreditId === id);
      if (idx !== -1) MOCK_CASH_CREDITS.splice(idx, 1);
      persistCashCredits();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetCreditById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_CASH_CREDITS.find((o) => o.CashCreditId === id) || null),
      100
    );
  });
}

// Next-voucher-number preview used by DMSCashCredit.vue/DMSCashCreditView.vue's
// emptyForm() (was `MOCK_CREDITS.length + 1` read directly from the module
// scope before this migration — exposed as a function instead of the raw
// array so callers don't reach into this module's private state).
export function peekNextCashCreditNo() {
  const n = MOCK_CASH_CREDITS.length + 1;
  return "CC" + String(n).padStart(4, "0");
}

// ── Commission (Booking tab) ───────────────────────────────────────────
export const MOCK_DATA_BK_COMMISSION = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const SEED_BK_COMMISSIONS = [
  {
    CommissionId: 1,
    CommissionNo: "CM20260001",
    CommissionDate: "01/04/2026",
    BookingOfficeName: "Greenland",
    CommissionAmount: 5000,
    IsDeductTDS: true,
    TDSPCT: 5,
    TDSAmount: "250.00",
    NetPayable: "4750.00",
    Remarks: "",
  },
  {
    CommissionId: 2,
    CommissionNo: "CM20260002",
    CommissionDate: "02/04/2026",
    BookingOfficeName: "Chakan",
    CommissionAmount: 3200,
    IsDeductTDS: false,
    TDSPCT: 0,
    TDSAmount: "0.00",
    NetPayable: "3200.00",
    Remarks: "",
  },
];

let MOCK_BK_COMMISSIONS = readStorage(BK_COMMISSIONS_KEY, null);
if (!Array.isArray(MOCK_BK_COMMISSIONS)) {
  MOCK_BK_COMMISSIONS = SEED_BK_COMMISSIONS.map((c) => ({ ...c }));
  writeStorage(BK_COMMISSIONS_KEY, MOCK_BK_COMMISSIONS);
}

function persistBkCommissions() {
  writeStorage(BK_COMMISSIONS_KEY, MOCK_BK_COMMISSIONS);
}

export function apiGetCommissions(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_BK_COMMISSIONS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.CommissionNo.toLowerCase().includes(s) ||
            (o.BookingOfficeName || "").toLowerCase().includes(s) ||
            (o.Remarks || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveCommission(commission) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (commission.CommissionId) {
        const idx = MOCK_BK_COMMISSIONS.findIndex((o) => o.CommissionId === commission.CommissionId);
        if (idx !== -1) MOCK_BK_COMMISSIONS[idx] = { ...commission };
      } else {
        commission.CommissionId = MOCK_BK_COMMISSIONS.length
          ? Math.max(...MOCK_BK_COMMISSIONS.map((o) => o.CommissionId)) + 1
          : 1;
        commission.CommissionNo = "CM" + new Date().getFullYear() + String(commission.CommissionId).padStart(4, "0");
        MOCK_BK_COMMISSIONS.push(commission);
      }
      persistBkCommissions();
      resolve({ success: true, data: commission });
    }, 200);
  });
}

export function apiDeleteCommission(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_BK_COMMISSIONS.findIndex((o) => o.CommissionId === id);
      if (idx !== -1) MOCK_BK_COMMISSIONS.splice(idx, 1);
      persistBkCommissions();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetCommissionById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_BK_COMMISSIONS.find((o) => o.CommissionId === id) || null),
      100
    );
  });
}

// ── Parcel Handling Charge ─────────────────────────────────────────────
export const MOCK_DATA_PARCEL_CHARGE = {
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
  bookingOffices: ["Greenland", "Chakan", "Rajkot-G", "Nasik"],
};

const SEED_PARCEL_CHARGES = [
  {
    PHChargeId: 1,
    VoucherNo: "PHC0001",
    VoucherDate: "02/09/2026",
    AccountName: "Balaji xxx Co.",
    BookingOfficeName: "Greenland",
    ReferenceNo: "REF-601",
    ReferenceDate: "01/09/2026",
    PaymentType: "Cash",
    IsBusEntry: true,
    IsTruckEntry: false,
    IsChargePaid: true,
    TotalAmount: 5000,
    IsDeductTDS: false,
    TDSPCT: 0,
    TDSAmount: 0,
    NetAmount: 5000,
    Remarks: "",
  },
  {
    PHChargeId: 2,
    VoucherNo: "PHC0002",
    VoucherDate: "05/09/2026",
    AccountName: "Ring xxx Aqua",
    BookingOfficeName: "Chakan",
    ReferenceNo: "REF-602",
    ReferenceDate: "04/09/2026",
    PaymentType: "NEFT",
    IsBusEntry: false,
    IsTruckEntry: true,
    IsChargePaid: false,
    TotalAmount: 3200,
    IsDeductTDS: true,
    TDSPCT: 2,
    TDSAmount: 64,
    NetAmount: 3136,
    Remarks: "",
  },
];

let MOCK_PARCEL_CHARGES = readStorage(PARCEL_CHARGES_KEY, null);
if (!Array.isArray(MOCK_PARCEL_CHARGES)) {
  MOCK_PARCEL_CHARGES = SEED_PARCEL_CHARGES.map((c) => ({ ...c }));
  writeStorage(PARCEL_CHARGES_KEY, MOCK_PARCEL_CHARGES);
}

function persistParcelCharges() {
  writeStorage(PARCEL_CHARGES_KEY, MOCK_PARCEL_CHARGES);
}

export function apiGetParcelCharges(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_PARCEL_CHARGES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.VoucherNo.toLowerCase().includes(s) ||
            (o.AccountName || "").toLowerCase().includes(s) ||
            (o.BookingOfficeName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveParcelCharge(charge) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (charge.PHChargeId) {
        const idx = MOCK_PARCEL_CHARGES.findIndex((o) => o.PHChargeId === charge.PHChargeId);
        if (idx !== -1) MOCK_PARCEL_CHARGES[idx] = { ...charge };
      } else {
        charge.PHChargeId = MOCK_PARCEL_CHARGES.length
          ? Math.max(...MOCK_PARCEL_CHARGES.map((o) => o.PHChargeId)) + 1
          : 1;
        MOCK_PARCEL_CHARGES.push(charge);
      }
      persistParcelCharges();
      resolve({ success: true, data: charge });
    }, 200);
  });
}

export function apiDeleteParcelCharge(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_PARCEL_CHARGES.findIndex((o) => o.PHChargeId === id);
      if (idx !== -1) MOCK_PARCEL_CHARGES.splice(idx, 1);
      persistParcelCharges();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetParcelChargeById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_PARCEL_CHARGES.find((o) => o.PHChargeId === id) || null),
      100
    );
  });
}

export function peekNextParcelChargeNo() {
  const n = MOCK_PARCEL_CHARGES.length + 1;
  return "PHC" + String(n).padStart(4, "0");
}

// ── Other State Freight Charge ─────────────────────────────────────────
export const MOCK_DATA_OSF_CHARGE = {
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
};

const SEED_OSF_CHARGES = [
  {
    OSFChargeId: 1,
    VoucherNo: "OSF0001",
    VoucherDate: "02/09/2026",
    AccountName: "Balaji xxx Co.",
    ReferenceNo: "REF-501",
    ReferenceDate: "01/09/2026",
    SACCode: "996511",
    PrintTitle: "Other State Freight",
    TotalAmount: 15000,
    IsDeductTDS: true,
    TDSPCT: 2,
    TDSAmount: 300,
    NetAmount: 14700,
    Remarks: "",
  },
  {
    OSFChargeId: 2,
    VoucherNo: "OSF0002",
    VoucherDate: "05/09/2026",
    AccountName: "Rajsani xxx Polymers",
    ReferenceNo: "REF-502",
    ReferenceDate: "04/09/2026",
    SACCode: "996511",
    PrintTitle: "Other State Freight",
    TotalAmount: 9000,
    IsDeductTDS: false,
    TDSPCT: 0,
    TDSAmount: 0,
    NetAmount: 9000,
    Remarks: "",
  },
];

let MOCK_OSF_CHARGES = readStorage(OSF_CHARGES_KEY, null);
if (!Array.isArray(MOCK_OSF_CHARGES)) {
  MOCK_OSF_CHARGES = SEED_OSF_CHARGES.map((c) => ({ ...c }));
  writeStorage(OSF_CHARGES_KEY, MOCK_OSF_CHARGES);
}

function persistOsfCharges() {
  writeStorage(OSF_CHARGES_KEY, MOCK_OSF_CHARGES);
}

export function apiGetOSFCharges(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_OSF_CHARGES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.VoucherNo.toLowerCase().includes(s) ||
            (o.AccountName || "").toLowerCase().includes(s) ||
            (o.ReferenceNo || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveOSFCharge(charge) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (charge.OSFChargeId) {
        const idx = MOCK_OSF_CHARGES.findIndex((o) => o.OSFChargeId === charge.OSFChargeId);
        if (idx !== -1) MOCK_OSF_CHARGES[idx] = { ...charge };
      } else {
        charge.OSFChargeId = MOCK_OSF_CHARGES.length
          ? Math.max(...MOCK_OSF_CHARGES.map((o) => o.OSFChargeId)) + 1
          : 1;
        MOCK_OSF_CHARGES.push(charge);
      }
      persistOsfCharges();
      resolve({ success: true, data: charge });
    }, 200);
  });
}

export function apiDeleteOSFCharge(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_OSF_CHARGES.findIndex((o) => o.OSFChargeId === id);
      if (idx !== -1) MOCK_OSF_CHARGES.splice(idx, 1);
      persistOsfCharges();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetOSFChargeById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_OSF_CHARGES.find((o) => o.OSFChargeId === id) || null),
      100
    );
  });
}

export function peekNextOSFChargeNo() {
  const n = MOCK_OSF_CHARGES.length + 1;
  return "OSF" + String(n).padStart(4, "0");
}

// ── Booking Web ─────────────────────────────────────────────────────────
export const MOCK_DATA_BOOKING_WEB = {
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
  cities: ["Rajkot-G", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const SEED_WEB_BOOKINGS = [
  {
    BookingWebId: 1,
    BookingWebNo: "WEB0001",
    BookingWebDate: "01/09/2026",
    BookingWebTime: "10:30",
    FromCity: "Mumbai",
    ToCity: "Pune",
    ConsignorAccount: "Balaji xxx Co.",
    ConsigneeAccount: "Rajsani xxx Polymers",
    ItemName: "Box",
    BillNo: "BN-1001",
    BillValue: 12500,
    Quantity: 10,
    PaymentType: "ToPay",
    Status: "Pending Conversion",
    Remarks: "",
  },
  {
    BookingWebId: 2,
    BookingWebNo: "WEB0002",
    BookingWebDate: "03/09/2026",
    BookingWebTime: "14:15",
    FromCity: "Chakan",
    ToCity: "Nasik",
    ConsignorAccount: "Ring xxx Aqua",
    ConsigneeAccount: "Select Party",
    ItemName: "Pallet",
    BillNo: "BN-1002",
    BillValue: 8600,
    Quantity: 4,
    PaymentType: "Paid",
    Status: "Converted",
    Remarks: "",
  },
];

let MOCK_WEB_BOOKINGS = readStorage(WEB_BOOKINGS_KEY, null);
if (!Array.isArray(MOCK_WEB_BOOKINGS)) {
  MOCK_WEB_BOOKINGS = SEED_WEB_BOOKINGS.map((b) => ({ ...b }));
  writeStorage(WEB_BOOKINGS_KEY, MOCK_WEB_BOOKINGS);
}

function persistWebBookings() {
  writeStorage(WEB_BOOKINGS_KEY, MOCK_WEB_BOOKINGS);
}

export function apiGetWebBookings(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_WEB_BOOKINGS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.BookingWebNo.toLowerCase().includes(s) ||
            (o.FromCity || "").toLowerCase().includes(s) ||
            (o.ToCity || "").toLowerCase().includes(s) ||
            (o.ConsignorAccount || "").toLowerCase().includes(s) ||
            (o.ConsigneeAccount || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveWebBooking(webBooking) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (webBooking.BookingWebId) {
        const idx = MOCK_WEB_BOOKINGS.findIndex((o) => o.BookingWebId === webBooking.BookingWebId);
        if (idx !== -1) MOCK_WEB_BOOKINGS[idx] = { ...webBooking };
      } else {
        webBooking.BookingWebId = MOCK_WEB_BOOKINGS.length
          ? Math.max(...MOCK_WEB_BOOKINGS.map((o) => o.BookingWebId)) + 1
          : 1;
        MOCK_WEB_BOOKINGS.push(webBooking);
      }
      persistWebBookings();
      resolve({ success: true, data: webBooking });
    }, 200);
  });
}

export function apiDeleteWebBooking(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_WEB_BOOKINGS.findIndex((o) => o.BookingWebId === id);
      if (idx !== -1) MOCK_WEB_BOOKINGS.splice(idx, 1);
      persistWebBookings();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetWebBookingById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_WEB_BOOKINGS.find((o) => o.BookingWebId === id) || null),
      100
    );
  });
}

export function peekNextWebBookingNo() {
  const n = MOCK_WEB_BOOKINGS.length + 1;
  return "WEB" + String(n).padStart(4, "0");
}

// ── Booking POD ─────────────────────────────────────────────────────────
const PODS_KEY = "cn_booking_pods_v1";

export const MOCK_DATA_POD = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune"],
  // Pending bookings a POD batch can pull in — mirrors the shape
  // DMSBooking.vue's bookings use for the fields this sub-table shows.
  pendingBookings: [
    { BookingId: 101, BookingNo: "RKG21040001", BookingDate: "01/04/2026", ConsigneeName: "Galaxy xxx Tooling", ToCity: "Chakan", NetAmt: 262.5 },
    { BookingId: 102, BookingNo: "RKG21040002", BookingDate: "01/04/2026", ConsigneeName: "Ring xxx Ltd", ToCity: "Nasik", NetAmt: 340.0 },
    { BookingId: 103, BookingNo: "RKG21040003", BookingDate: "02/04/2026", ConsigneeName: "Balaji xxx Co.", ToCity: "Pune", NetAmt: 180.0 },
  ],
};

const SEED_PODS = [
  {
    PodId: 1,
    PodNo: "POD2104001",
    PodDate: "03/04/2026",
    BookingOfficeName: "Chakan",
    BookingCount: 2,
    TotalAmount: 602.5,
    Status: "Confirmed",
    Remarks: "",
    BookingIds: [101, 102],
  },
];

let MOCK_PODS = readStorage(PODS_KEY, null);
if (!Array.isArray(MOCK_PODS)) {
  MOCK_PODS = SEED_PODS.map((p) => ({ ...p }));
  writeStorage(PODS_KEY, MOCK_PODS);
}

function persistPods() {
  writeStorage(PODS_KEY, MOCK_PODS);
}

export function apiGetPods(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_PODS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (p) =>
            p.PodNo.toLowerCase().includes(s) ||
            (p.BookingOfficeName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiGetPodById(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PODS.find((p) => p.PodId === id) || null), 100);
  });
}

export function apiSavePod(pod) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (pod.PodId) {
        const idx = MOCK_PODS.findIndex((p) => p.PodId === pod.PodId);
        if (idx !== -1) MOCK_PODS[idx] = { ...pod };
      } else {
        pod.PodId = MOCK_PODS.length
          ? Math.max(...MOCK_PODS.map((p) => p.PodId)) + 1
          : 1;
        pod.PodNo = "POD2104" + String(pod.PodId).padStart(3, "0");
        pod.Status = "Confirmed";
        MOCK_PODS.push(pod);
      }
      persistPods();
      resolve({ success: true, data: pod });
    }, 200);
  });
}

export function apiDeletePod(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_PODS.findIndex((p) => p.PodId === id);
      if (idx !== -1) MOCK_PODS.splice(idx, 1);
      persistPods();
      resolve({ success: true });
    }, 150);
  });
}
