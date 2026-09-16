// Generic mock "backend" for every simple master-data entity under DMS >
// Master and the master-like entries under DMS > Booking Office (Vehicle,
// Vehicle Type, Driver, Carrier, City, State, Item, Unit, Invoice Type,
// Payment Mode, Voucher, Company, Fin Year, Series, Tax, Booking Office,
// Booking Office Wise City/To City/Payment Mode, Commission rate, Other
// State Freight Charge, Parcel Handling Charge). Same localStorage-backed
// pattern as src/data/tripData.js and src/data/deliveryData.js, but keyed
// generically by entity name instead of one module per entity — these are
// all shaped the same way (a flat list of rows with simple fields), so one
// generic store + src/components/GenericMasterList.vue renders every one
// of them instead of duplicating near-identical CRUD 23 times.

const STORAGE_PREFIX = "cn_master_";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Private browsing, storage disabled, or corrupt JSON.
  }
  return fallback;
}

function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Storage full/unavailable — in-memory copy still works this session.
  }
}

// ── Shared option lists (also used as the seed values so cross-references
// stay consistent, e.g. a Vehicle's VehicleType matches a real VehicleType
// row). ────────────────────────────────────────────────────────────────
const OPTIONS = {
  vehicleTypes: ["Truck", "Tempo", "Container", "Own Vehicle"],
  states: ["Gujarat", "Maharashtra", "Karnataka", "Telangana"],
  cities: [
    "Rajkot-G",
    "Chakan",
    "Nasik",
    "Hyderabad",
    "Pune",
    "Mumbai",
    "Bangalore",
    "Vasai",
    "Vapi",
  ],
  units: ["Nos", "Kg", "Box", "Drum", "Carton"],
  paymentModes: ["Cash", "Cheque", "Online", "Bank Transfer"],
  bookingOffices: [
    "Greenland",
    "Chakan",
    "Nasik",
    "Hyderabad",
    "Pune",
    "Vasai Eagle",
  ],
  taxTypes: ["CGST+SGST", "IGST", "Exempt"],
  commissionTypes: ["Percentage", "Fixed"],
  userTypes: ["Admin", "Operator", "Viewer"],
  // Matches the "tax" entity's own seed row names above (kept as a plain
  // string list here rather than a live cross-reference, same as this
  // file's other OPTIONS lists).
  taxNames: ["GST 5%", "GST 5% (CGST+SGST)", "Exempt"],
  accountGroups: [
    "Cash",
    "Bank",
    "Sundry Debtor",
    "Sundry Creditor",
    "Income",
    "Expense",
    "Capital",
  ],
  balanceTypes: ["Debit", "Credit"],
  // Matches the "ledgeraccount" entity's own seed row names below (kept as
  // a plain string list here rather than a live cross-reference, same as
  // this file's other OPTIONS lists) — used by the Account/Contra/Journal
  // Voucher entities' Account select fields.
  ledgerAccounts: [
    "Cash Account",
    "Bank Account - HDFC",
    "Bank Account - SBI",
    "Sundry Debtors",
    "Sundry Creditors",
    "Freight Income",
    "Commission Income",
    "Office Expenses",
  ],
  bankAccounts: ["Bank Account - HDFC", "Bank Account - SBI"],
  // Matches this app's own top-level module groups (the "DMS" child-menu
  // header rows in src/data/mockData.js) — what a Menu row's own
  // ParentMenu would realistically be one of.
  menuGroups: [
    "(Top Level)",
    "Booking",
    "Trip",
    "Delivery",
    "Accounting",
    "Booking Office",
    "Sale",
    "Master",
    "Report Screens",
    "Reports",
    "Security",
    "Eway Bill",
  ],
};

// ── Entity definitions — one per master screen. `fields` describes both
// the table columns and the Add/Edit dialog fields (in order); `idField`
// is the primary key column GenericMasterList uses for edit/delete.
const ENTITY_DEFS = {
  vehicle: {
    title: "Vehicle",
    icon: "local_shipping",
    idField: "VehicleID",
    fields: [
      { name: "VehicleNo", label: "Vehicle No.", type: "text" },
      {
        name: "VehicleType",
        label: "Vehicle Type",
        type: "select",
        options: OPTIONS.vehicleTypes,
      },
      { name: "Capacity", label: "Capacity (Kg)", type: "number" },
      { name: "Owner", label: "Owner", type: "text" },
      { name: "Remarks", label: "Remarks", type: "text" },
    ],
    seed: [
      {
        VehicleID: 1,
        VehicleNo: "GJ3BW0003",
        VehicleType: "Own Vehicle",
        Capacity: 2000,
        Owner: "Self",
        Remarks: "",
      },
      {
        VehicleID: 2,
        VehicleNo: "GJ03BV7545",
        VehicleType: "Truck",
        Capacity: 9000,
        Owner: "New Vishal Roadlines",
        Remarks: "",
      },
      {
        VehicleID: 3,
        VehicleNo: "GJ03BV6768",
        VehicleType: "Own Vehicle",
        Capacity: 1500,
        Owner: "Self",
        Remarks: "",
      },
    ],
  },

  vehicletype: {
    title: "Vehicle Type",
    icon: "category",
    idField: "VehicleTypeID",
    fields: [
      { name: "TypeName", label: "Type Name", type: "text" },
      { name: "Description", label: "Description", type: "text" },
    ],
    seed: [
      {
        VehicleTypeID: 1,
        TypeName: "Truck",
        Description: "Large capacity, long haul",
      },
      {
        VehicleTypeID: 2,
        TypeName: "Tempo",
        Description: "City/short-distance delivery",
      },
      {
        VehicleTypeID: 3,
        TypeName: "Container",
        Description: "Sealed container carrier",
      },
      {
        VehicleTypeID: 4,
        TypeName: "Own Vehicle",
        Description: "Company-owned vehicle",
      },
    ],
  },

  driver: {
    title: "Driver",
    icon: "badge",
    idField: "DriverID",
    fields: [
      { name: "Name", label: "Name", type: "text" },
      { name: "LicenseNo", label: "License No.", type: "text" },
      { name: "Phone", label: "Phone", type: "text" },
      { name: "Address", label: "Address", type: "text" },
    ],
    seed: [
      {
        DriverID: 1,
        Name: "Mahendra Singh Jadeja",
        LicenseNo: "GJ0320210012345",
        Phone: "9876500001",
        Address: "Rajkot",
      },
      {
        DriverID: 2,
        Name: "Ramesh Patel",
        LicenseNo: "GJ0320190054321",
        Phone: "9876500002",
        Address: "Chakan",
      },
    ],
  },

  carrier: {
    title: "Carrier",
    icon: "local_shipping",
    idField: "CarrierID",
    fields: [
      { name: "Name", label: "Name", type: "text" },
      { name: "ContactPerson", label: "Contact Person", type: "text" },
      { name: "Phone", label: "Phone", type: "text" },
      { name: "Email", label: "Email", type: "text" },
    ],
    seed: [
      {
        CarrierID: 1,
        Name: "Eagle Tradelinks Pvt Ltd",
        ContactPerson: "Ketan Solanki",
        Phone: "9876511111",
        Email: "ops@eagletradelinks.example",
      },
      {
        CarrierID: 2,
        Name: "New Vishal Roadlines",
        ContactPerson: "Vishal Shah",
        Phone: "9876522222",
        Email: "info@newvishalroadlines.example",
      },
    ],
  },

  city: {
    title: "City",
    icon: "location_city",
    idField: "CityID",
    fields: [
      { name: "CityName", label: "City Name", type: "text" },
      {
        name: "State",
        label: "State",
        type: "select",
        options: OPTIONS.states,
      },
      { name: "PinCode", label: "Pin Code", type: "text" },
    ],
    seed: [
      { CityID: 1, CityName: "Rajkot-G", State: "Gujarat", PinCode: "360001" },
      {
        CityID: 2,
        CityName: "Chakan",
        State: "Maharashtra",
        PinCode: "410501",
      },
      { CityID: 3, CityName: "Nasik", State: "Maharashtra", PinCode: "422001" },
      {
        CityID: 4,
        CityName: "Hyderabad",
        State: "Telangana",
        PinCode: "500001",
      },
      {
        CityID: 5,
        CityName: "Bangalore",
        State: "Karnataka",
        PinCode: "560001",
      },
    ],
  },

  citywisedeliverycity: {
    title: "City Wise Delivery City",
    icon: "alt_route",
    idField: "ID",
    fields: [
      { name: "City", label: "City", type: "select", options: OPTIONS.cities },
      { name: "DeliveryCity", label: "Delivery City", type: "text" },
      { name: "DeliveryCharge", label: "Delivery Charge", type: "number" },
    ],
    seed: [
      { ID: 1, City: "Rajkot-G", DeliveryCity: "Vasai", DeliveryCharge: 150 },
      { ID: 2, City: "Chakan", DeliveryCity: "Vasai", DeliveryCharge: 120 },
    ],
  },

  state: {
    title: "State",
    icon: "map",
    idField: "StateID",
    fields: [
      { name: "StateName", label: "State Name", type: "text" },
      { name: "StateCode", label: "State Code", type: "text" },
    ],
    seed: [
      { StateID: 1, StateName: "Gujarat", StateCode: "24" },
      { StateID: 2, StateName: "Maharashtra", StateCode: "27" },
      { StateID: 3, StateName: "Karnataka", StateCode: "29" },
      { StateID: 4, StateName: "Telangana", StateCode: "36" },
    ],
  },

  item: {
    title: "Item",
    icon: "inventory_2",
    idField: "ItemID",
    fields: [
      { name: "ItemName", label: "Item Name", type: "text" },
      { name: "Unit", label: "Unit", type: "select", options: OPTIONS.units },
      { name: "HSNCode", label: "HSN Code", type: "text" },
    ],
    seed: [
      { ItemID: 1, ItemName: "Drum", Unit: "Drum", HSNCode: "7310" },
      { ItemID: 2, ItemName: "Box", Unit: "Box", HSNCode: "4819" },
      { ItemID: 3, ItemName: "Carton", Unit: "Carton", HSNCode: "4819" },
    ],
  },

  unit: {
    title: "Unit",
    icon: "straighten",
    idField: "UnitID",
    fields: [
      { name: "UnitName", label: "Unit Name", type: "text" },
      { name: "ShortCode", label: "Short Code", type: "text" },
    ],
    seed: [
      { UnitID: 1, UnitName: "Numbers", ShortCode: "Nos" },
      { UnitID: 2, UnitName: "Kilogram", ShortCode: "Kg" },
      { UnitID: 3, UnitName: "Box", ShortCode: "Box" },
      { UnitID: 4, UnitName: "Drum", ShortCode: "Drum" },
      { UnitID: 5, UnitName: "Carton", ShortCode: "Carton" },
    ],
  },

  invoicetype: {
    title: "Invoice Type",
    icon: "description",
    idField: "InvoiceTypeID",
    fields: [
      { name: "TypeName", label: "Type Name", type: "text" },
      { name: "Description", label: "Description", type: "text" },
    ],
    seed: [
      {
        InvoiceTypeID: 1,
        TypeName: "Tax Invoice",
        Description: "Standard GST tax invoice",
      },
      {
        InvoiceTypeID: 2,
        TypeName: "Bill of Supply",
        Description: "For exempt/composition supply",
      },
    ],
  },

  paymentmode: {
    title: "Payment Mode",
    icon: "payments",
    idField: "PaymentModeID",
    fields: [
      { name: "ModeName", label: "Mode Name", type: "text" },
      { name: "Description", label: "Description", type: "text" },
    ],
    seed: [
      { PaymentModeID: 1, ModeName: "Cash", Description: "" },
      { PaymentModeID: 2, ModeName: "Cheque", Description: "" },
      {
        PaymentModeID: 3,
        ModeName: "Online",
        Description: "UPI / NEFT / RTGS",
      },
      { PaymentModeID: 4, ModeName: "Bank Transfer", Description: "" },
    ],
  },

  voucher: {
    title: "Voucher",
    icon: "receipt",
    idField: "VoucherID",
    fields: [
      { name: "VoucherType", label: "Voucher Type", type: "text" },
      { name: "Prefix", label: "Prefix", type: "text" },
      { name: "NextNumber", label: "Next Number", type: "number" },
    ],
    seed: [
      {
        VoucherID: 1,
        VoucherType: "Payment Voucher",
        Prefix: "PV",
        NextNumber: 101,
      },
      {
        VoucherID: 2,
        VoucherType: "Receipt Voucher",
        Prefix: "RV",
        NextNumber: 201,
      },
      {
        VoucherID: 3,
        VoucherType: "Journal Voucher",
        Prefix: "JV",
        NextNumber: 51,
      },
    ],
  },

  company: {
    title: "Company",
    icon: "business",
    idField: "CompanyID",
    // Address/Tel/Email/Web here double as the letterhead shown on every
    // printed document's header (see src/data/companyProfile.js) — editing
    // this row updates every report/receipt/trip-sheet print at once.
    fields: [
      { name: "CompanyName", label: "Company Name", type: "text" },
      { name: "Address", label: "Address", type: "text" },
      { name: "GSTNo", label: "GST No.", type: "text" },
      { name: "PAN", label: "PAN", type: "text" },
      { name: "Tel", label: "Tel", type: "text" },
      { name: "Email", label: "Email", type: "text" },
      { name: "Web", label: "Web", type: "text" },
    ],
    seed: [
      {
        CompanyID: 1,
        CompanyName: "CargoNet Transportation Pvt Ltd",
        Address: "Rajkot, Gujarat",
        GSTNo: "24AACCE1234C1Z5",
        PAN: "AACCE1234C",
        Tel: "+91-281-2345678",
        Email: "info@cargonettransportation.example",
        Web: "www.cargonettransportation.example",
      },
    ],
  },

  finyear: {
    title: "Fin Year",
    icon: "event",
    idField: "FinYearID",
    fields: [
      { name: "YearName", label: "Year Name", type: "text" },
      { name: "StartDate", label: "Start Date", type: "date" },
      { name: "EndDate", label: "End Date", type: "date" },
      { name: "IsCurrent", label: "Current Year", type: "checkbox" },
    ],
    seed: [
      {
        FinYearID: 1,
        YearName: "2025-26",
        StartDate: "01-04-2025",
        EndDate: "31-03-2026",
        IsCurrent: true,
      },
      {
        FinYearID: 2,
        YearName: "2024-25",
        StartDate: "01-04-2024",
        EndDate: "31-03-2025",
        IsCurrent: false,
      },
    ],
  },

  series: {
    title: "Series",
    icon: "format_list_numbered",
    idField: "SeriesID",
    fields: [
      { name: "SeriesName", label: "Series Name", type: "text" },
      { name: "Prefix", label: "Prefix", type: "text" },
      { name: "NextNumber", label: "Next Number", type: "number" },
    ],
    seed: [
      {
        SeriesID: 1,
        SeriesName: "Booking Series",
        Prefix: "RKG2604",
        NextNumber: 16,
      },
      {
        SeriesID: 2,
        SeriesName: "Trip Series",
        Prefix: "TRKG2604",
        NextNumber: 15,
      },
    ],
  },

  tax: {
    title: "Tax",
    icon: "percent",
    idField: "TaxID",
    fields: [
      { name: "TaxName", label: "Tax Name", type: "text" },
      { name: "Rate", label: "Rate (%)", type: "number" },
      {
        name: "Type",
        label: "Type",
        type: "select",
        options: OPTIONS.taxTypes,
      },
    ],
    seed: [
      { TaxID: 1, TaxName: "GST 5%", Rate: 5, Type: "IGST" },
      { TaxID: 2, TaxName: "GST 5% (CGST+SGST)", Rate: 5, Type: "CGST+SGST" },
      { TaxID: 3, TaxName: "Exempt", Rate: 0, Type: "Exempt" },
    ],
  },

  // ── Master > Tax submenu (old app's TAX_ServiceTaxConfig/TAX_TaxSystem/
  // TAX_TaxApplyOnTax/TAX_TaxSystemWiseTax tables) — flat items under the
  // "Master Tax" header alongside the plain "tax" entity above (see the
  // "Master Tax" header + items in src/data/mockData.js's DMS array). ──
  servicetaxconfig: {
    title: "Service Tax Config",
    icon: "settings",
    idField: "ConfigID",
    fields: [
      { name: "ConfigName", label: "Config Name", type: "text" },
      { name: "ServiceTaxRate", label: "Service Tax Rate (%)", type: "number" },
      { name: "EducessRate", label: "Educess Rate (%)", type: "number" },
      { name: "SHEducessRate", label: "SH Educess Rate (%)", type: "number" },
      { name: "EffectiveFrom", label: "Effective From", type: "date" },
      { name: "IsActive", label: "Active", type: "checkbox" },
    ],
    seed: [
      {
        ConfigID: 1,
        ConfigName: "Pre-GST Service Tax",
        ServiceTaxRate: 14,
        EducessRate: 0.5,
        SHEducessRate: 0.5,
        EffectiveFrom: "01-06-2015",
        IsActive: false,
      },
    ],
  },

  taxapplyontax: {
    title: "Tax Apply On Tax",
    icon: "layers",
    idField: "ID",
    fields: [
      {
        name: "BaseTax",
        label: "Base Tax",
        type: "select",
        options: OPTIONS.taxNames,
      },
      {
        name: "ApplyOnTax",
        label: "Apply On Tax",
        type: "select",
        options: OPTIONS.taxNames,
      },
      { name: "Sequence", label: "Sequence", type: "number" },
    ],
    seed: [
      {
        ID: 1,
        BaseTax: "GST 5%",
        ApplyOnTax: "GST 5% (CGST+SGST)",
        Sequence: 1,
      },
    ],
  },

  taxsystem: {
    title: "Tax System",
    icon: "account_tree",
    idField: "TaxSystemID",
    fields: [
      { name: "SystemName", label: "System Name", type: "text" },
      { name: "EffectiveFrom", label: "Effective From", type: "date" },
      { name: "IsActive", label: "Active", type: "checkbox" },
    ],
    seed: [
      {
        TaxSystemID: 1,
        SystemName: "GST",
        EffectiveFrom: "01-07-2017",
        IsActive: true,
      },
      {
        TaxSystemID: 2,
        SystemName: "Service Tax",
        EffectiveFrom: "01-06-2015",
        IsActive: false,
      },
    ],
  },

  taxsystemwisetax: {
    title: "Tax System Wise Tax",
    icon: "rule",
    idField: "ID",
    fields: [
      {
        name: "TaxSystem",
        label: "Tax System",
        type: "select",
        options: ["GST", "Service Tax"],
      },
      {
        name: "TaxName",
        label: "Tax Name",
        type: "select",
        options: OPTIONS.taxNames,
      },
      { name: "IsDefault", label: "Default", type: "checkbox" },
    ],
    seed: [
      { ID: 1, TaxSystem: "GST", TaxName: "GST 5%", IsDefault: true },
      {
        ID: 2,
        TaxSystem: "GST",
        TaxName: "GST 5% (CGST+SGST)",
        IsDefault: false,
      },
    ],
  },

  bookingoffice: {
    title: "Booking Office",
    icon: "store",
    idField: "BookingOfficeID",
    fields: [
      { name: "OfficeName", label: "Office Name", type: "text" },
      { name: "City", label: "City", type: "select", options: OPTIONS.cities },
      { name: "Address", label: "Address", type: "text" },
      { name: "Phone", label: "Phone", type: "text" },
    ],
    seed: [
      {
        BookingOfficeID: 1,
        OfficeName: "Greenland",
        City: "Rajkot-G",
        Address: "Greenland Complex, Rajkot",
        Phone: "9876500010",
      },
      {
        BookingOfficeID: 2,
        OfficeName: "Chakan",
        City: "Chakan",
        Address: "MIDC Chakan",
        Phone: "9876500011",
      },
      {
        BookingOfficeID: 3,
        OfficeName: "Vasai Eagle",
        City: "Vasai",
        Address: "Vasai East",
        Phone: "9876500012",
      },
    ],
  },

  bookingofficewisecity: {
    title: "Booking Office Wise City",
    icon: "store",
    idField: "ID",
    fields: [
      {
        name: "BookingOffice",
        label: "Booking Office",
        type: "select",
        options: OPTIONS.bookingOffices,
      },
      { name: "City", label: "City", type: "select", options: OPTIONS.cities },
    ],
    seed: [
      { ID: 1, BookingOffice: "Greenland", City: "Rajkot-G" },
      { ID: 2, BookingOffice: "Chakan", City: "Chakan" },
    ],
  },

  bookingofficewisetocity: {
    title: "Booking Office Wise To City",
    icon: "store",
    idField: "ID",
    fields: [
      {
        name: "BookingOffice",
        label: "Booking Office",
        type: "select",
        options: OPTIONS.bookingOffices,
      },
      {
        name: "ToCity",
        label: "To City",
        type: "select",
        options: OPTIONS.cities,
      },
    ],
    seed: [
      { ID: 1, BookingOffice: "Greenland", ToCity: "Vasai" },
      { ID: 2, BookingOffice: "Greenland", ToCity: "Nasik" },
    ],
  },

  bookingofficewisepaymentmode: {
    title: "Booking Office Wise Payment Mode",
    icon: "store",
    idField: "ID",
    fields: [
      {
        name: "BookingOffice",
        label: "Booking Office",
        type: "select",
        options: OPTIONS.bookingOffices,
      },
      {
        name: "PaymentMode",
        label: "Payment Mode",
        type: "select",
        options: OPTIONS.paymentModes,
      },
    ],
    seed: [
      { ID: 1, BookingOffice: "Greenland", PaymentMode: "Cash" },
      { ID: 2, BookingOffice: "Greenland", PaymentMode: "Online" },
    ],
  },

  commission: {
    title: "Commission",
    icon: "percent",
    idField: "ID",
    fields: [
      {
        name: "BookingOffice",
        label: "Booking Office",
        type: "select",
        options: OPTIONS.bookingOffices,
      },
      {
        name: "CommissionType",
        label: "Commission Type",
        type: "select",
        options: OPTIONS.commissionTypes,
      },
      { name: "Rate", label: "Rate", type: "number" },
    ],
    seed: [
      {
        ID: 1,
        BookingOffice: "Greenland",
        CommissionType: "Percentage",
        Rate: 2.5,
      },
      { ID: 2, BookingOffice: "Chakan", CommissionType: "Percentage", Rate: 3 },
    ],
  },

  otherstatefreightcharge: {
    title: "Other State Freight Charge",
    icon: "payments",
    idField: "ID",
    fields: [
      {
        name: "FromState",
        label: "From State",
        type: "select",
        options: OPTIONS.states,
      },
      {
        name: "ToState",
        label: "To State",
        type: "select",
        options: OPTIONS.states,
      },
      { name: "ChargeAmount", label: "Charge Amount", type: "number" },
    ],
    seed: [
      { ID: 1, FromState: "Gujarat", ToState: "Maharashtra", ChargeAmount: 50 },
      { ID: 2, FromState: "Gujarat", ToState: "Karnataka", ChargeAmount: 75 },
    ],
  },

  parcelhandlingcharge: {
    title: "Parcel Handling Charge",
    icon: "inventory_2",
    idField: "ID",
    fields: [
      { name: "City", label: "City", type: "select", options: OPTIONS.cities },
      { name: "HandlingCharge", label: "Handling Charge", type: "number" },
    ],
    seed: [
      { ID: 1, City: "Rajkot-G", HandlingCharge: 20 },
      { ID: 2, City: "Vasai", HandlingCharge: 25 },
    ],
  },

  // ── Security (old app's SEC_User/SEC_Menu/SEC_Right/SEC_Patch tables) ──
  // The other 4 Security screens (User Wise Menu/Rights/Booking
  // Office/Fin Year) aren't flat masters — they're a "pick a user, check
  // items" shape — so they're driven by src/data/securityData.js and
  // rendered by GenericUserWiseAssignment.vue instead of this file.
  secuser: {
    title: "User",
    icon: "person",
    idField: "UserID",
    fields: [
      { name: "UserName", label: "User Name", type: "text" },
      { name: "Password", label: "Password", type: "text" },
      { name: "FullName", label: "Full Name", type: "text" },
      { name: "Email", label: "Email", type: "text" },
      { name: "MobileNo", label: "Mobile No.", type: "text" },
      {
        name: "UserType",
        label: "User Type",
        type: "select",
        options: OPTIONS.userTypes,
      },
      { name: "IsActive", label: "Active", type: "checkbox" },
    ],
    seed: [
      {
        UserID: 1,
        UserName: "admin",
        Password: "admin@123",
        FullName: "System Administrator",
        Email: "admin@cargonet.com",
        MobileNo: "9876500000",
        UserType: "Admin",
        IsActive: true,
      },
      {
        UserID: 2,
        UserName: "ketan.patel",
        Password: "ketan@123",
        FullName: "Ketan Patel",
        Email: "ketan.patel@cargonet.com",
        MobileNo: "9876500001",
        UserType: "Operator",
        IsActive: true,
      },
      {
        UserID: 3,
        UserName: "suresh.rao",
        Password: "suresh@123",
        FullName: "Suresh Rao",
        Email: "suresh.rao@cargonet.com",
        MobileNo: "9876500002",
        UserType: "Operator",
        IsActive: true,
      },
      {
        UserID: 4,
        UserName: "devuser",
        Password: "dev@123",
        FullName: "Dev User",
        Email: "devuser@cargonet.com",
        MobileNo: "9876500003",
        UserType: "Viewer",
        IsActive: false,
      },
    ],
  },

  secmenu: {
    title: "Menu",
    icon: "menu",
    idField: "MenuID",
    fields: [
      { name: "MenuName", label: "Menu Name", type: "text" },
      {
        name: "ParentMenu",
        label: "Parent Menu",
        type: "select",
        options: OPTIONS.menuGroups,
      },
      { name: "FormName", label: "Form Name", type: "text" },
      { name: "ShowOrder", label: "Show Order", type: "number" },
      { name: "Shortcut", label: "Shortcut", type: "text" },
    ],
    seed: [
      {
        MenuID: 1,
        MenuName: "Booking",
        ParentMenu: "(Top Level)",
        FormName: "DMSBooking",
        ShowOrder: 1,
        Shortcut: "",
      },
      {
        MenuID: 2,
        MenuName: "Booking Office",
        ParentMenu: "Booking",
        FormName: "DMSBookingOffice",
        ShowOrder: 1,
        Shortcut: "",
      },
      {
        MenuID: 3,
        MenuName: "Trip",
        ParentMenu: "(Top Level)",
        FormName: "DMSTrip",
        ShowOrder: 2,
        Shortcut: "",
      },
      {
        MenuID: 4,
        MenuName: "User",
        ParentMenu: "Security",
        FormName: "DMSSecurityUser",
        ShowOrder: 1,
        Shortcut: "",
      },
    ],
  },

  secright: {
    title: "Rights",
    icon: "verified_user",
    idField: "RightID",
    fields: [
      { name: "RightName", label: "Right Name", type: "text" },
      { name: "Description", label: "Description", type: "text" },
    ],
    seed: [
      { RightID: 1, RightName: "Add", Description: "Create a new record" },
      {
        RightID: 2,
        RightName: "Edit",
        Description: "Modify an existing record",
      },
      { RightID: 3, RightName: "Delete", Description: "Remove a record" },
      { RightID: 4, RightName: "Print", Description: "Print a record/report" },
      { RightID: 5, RightName: "Export", Description: "Export a report" },
      { RightID: 6, RightName: "Cancel", Description: "Cancel/void a record" },
      {
        RightID: 7,
        RightName: "Approve",
        Description: "Approve a pending record",
      },
    ],
  },

  secpatch: {
    title: "Patch Details",
    icon: "system_update",
    idField: "PatchID",
    fields: [
      { name: "PatchNo", label: "Patch No.", type: "text" },
      { name: "PatchDate", label: "Patch Date", type: "date" },
      { name: "Description", label: "Description", type: "text" },
      { name: "AppliedBy", label: "Applied By", type: "text" },
    ],
    seed: [
      {
        PatchID: 1,
        PatchNo: "P-2026-04-001",
        PatchDate: "01-04-2026",
        Description: "Booking Office Commission rate fix",
        AppliedBy: "admin",
      },
      {
        PatchID: 2,
        PatchNo: "P-2026-04-002",
        PatchDate: "05-04-2026",
        Description: "E-Way Bill Part B consolidated support",
        AppliedBy: "admin",
      },
    ],
  },

  // ── Account menu ─────────────────────────────────────────────────────
  // Chart of Accounts — the "Account" select fields below (Account/Contra/
  // Journal Voucher) reference this entity's seed row names via
  // OPTIONS.ledgerAccounts (plain string list, same pattern as taxNames).
  ledgeraccount: {
    title: "Ledger Account",
    icon: "account_balance",
    idField: "LedgerAccountID",
    fields: [
      { name: "AccountName", label: "Account Name", type: "text" },
      {
        name: "AccountGroup",
        label: "Account Group",
        type: "select",
        options: OPTIONS.accountGroups,
      },
      { name: "OpeningBalance", label: "Opening Balance", type: "number" },
      {
        name: "OpeningBalanceType",
        label: "Balance Type",
        type: "select",
        options: OPTIONS.balanceTypes,
      },
    ],
    seed: [
      {
        LedgerAccountID: 1,
        AccountName: "Cash Account",
        AccountGroup: "Cash",
        OpeningBalance: 25000,
        OpeningBalanceType: "Debit",
      },
      {
        LedgerAccountID: 2,
        AccountName: "Bank Account - HDFC",
        AccountGroup: "Bank",
        OpeningBalance: 185000,
        OpeningBalanceType: "Debit",
      },
      {
        LedgerAccountID: 3,
        AccountName: "Bank Account - SBI",
        AccountGroup: "Bank",
        OpeningBalance: 92000,
        OpeningBalanceType: "Debit",
      },
      {
        LedgerAccountID: 4,
        AccountName: "Sundry Debtors",
        AccountGroup: "Sundry Debtor",
        OpeningBalance: 0,
        OpeningBalanceType: "Debit",
      },
      {
        LedgerAccountID: 5,
        AccountName: "Sundry Creditors",
        AccountGroup: "Sundry Creditor",
        OpeningBalance: 0,
        OpeningBalanceType: "Credit",
      },
      {
        LedgerAccountID: 6,
        AccountName: "Freight Income",
        AccountGroup: "Income",
        OpeningBalance: 0,
        OpeningBalanceType: "Credit",
      },
      {
        LedgerAccountID: 7,
        AccountName: "Commission Income",
        AccountGroup: "Income",
        OpeningBalance: 0,
        OpeningBalanceType: "Credit",
      },
      {
        LedgerAccountID: 8,
        AccountName: "Office Expenses",
        AccountGroup: "Expense",
        OpeningBalance: 0,
        OpeningBalanceType: "Debit",
      },
    ],
  },

  customerwisecity: {
    title: "Customer Wise City",
    icon: "location_city",
    idField: "CustomerWiseCityID",
    fields: [
      { name: "CustomerName", label: "Customer Name", type: "text" },
      { name: "City", label: "City", type: "select", options: OPTIONS.cities },
    ],
    seed: [
      {
        CustomerWiseCityID: 1,
        CustomerName: "Rajsani Polymers",
        City: "Rajkot-G",
      },
      {
        CustomerWiseCityID: 2,
        CustomerName: "Varun Casting Co",
        City: "Chakan",
      },
      {
        CustomerWiseCityID: 3,
        CustomerName: "Mahindra Heavy Engines Ltd",
        City: "Vasai",
      },
    ],
  },

  accountvoucher: {
    title: "Account Voucher",
    icon: "receipt_long",
    idField: "AccountVoucherID",
    // EagleParcel LOCRPT/Account/ACC_AccountVoucher/ACC_AccountVoucher_Print
    // — printable single-voucher slip. Opts this entity into
    // GenericMasterList.vue's print-preview dialog (mirrors
    // GenericReportList.vue's print mechanism). Cash/Bank Payment/Receipt,
    // Contra and Journal Voucher below set the same flag — same underlying
    // voucher-slip document, just a different account/party shape.
    printable: true,
    fields: [
      { name: "VoucherNo", label: "Voucher No.", type: "text" },
      { name: "VoucherDate", label: "Voucher Date", type: "date" },
      {
        name: "Account",
        label: "Account",
        type: "select",
        options: OPTIONS.ledgerAccounts,
      },
      { name: "Amount", label: "Amount", type: "number" },
      { name: "Narration", label: "Narration", type: "text" },
    ],
    seed: [
      {
        AccountVoucherID: 1,
        VoucherNo: "AV-101",
        VoucherDate: "01-04-2026",
        Account: "Office Expenses",
        Amount: 1500,
        Narration: "Stationery purchase",
      },
    ],
  },

  cashpayment: {
    title: "Cash Payment",
    icon: "payments",
    idField: "CashPaymentID",
    printable: true,
    fields: [
      { name: "VoucherNo", label: "Voucher No.", type: "text" },
      { name: "VoucherDate", label: "Voucher Date", type: "date" },
      { name: "PaidTo", label: "Paid To", type: "text" },
      { name: "Amount", label: "Amount", type: "number" },
      { name: "Narration", label: "Narration", type: "text" },
    ],
    seed: [
      {
        CashPaymentID: 1,
        VoucherNo: "PV-101",
        VoucherDate: "01-04-2026",
        PaidTo: "Eagle Tradelinks Pvt Ltd",
        Amount: 5000,
        Narration: "Freight advance",
      },
    ],
  },

  cashreceipt: {
    title: "Cash Receipt",
    icon: "point_of_sale",
    idField: "CashReceiptID",
    printable: true,
    fields: [
      { name: "VoucherNo", label: "Voucher No.", type: "text" },
      { name: "VoucherDate", label: "Voucher Date", type: "date" },
      { name: "ReceivedFrom", label: "Received From", type: "text" },
      { name: "Amount", label: "Amount", type: "number" },
      { name: "Narration", label: "Narration", type: "text" },
    ],
    seed: [
      {
        CashReceiptID: 1,
        VoucherNo: "RV-201",
        VoucherDate: "01-04-2026",
        ReceivedFrom: "Rajsani Polymers",
        Amount: 12500,
        Narration: "SI20260001 collection",
      },
    ],
  },

  bankpayment: {
    title: "Bank Payment",
    icon: "account_balance",
    idField: "BankPaymentID",
    printable: true,
    fields: [
      { name: "VoucherNo", label: "Voucher No.", type: "text" },
      { name: "VoucherDate", label: "Voucher Date", type: "date" },
      {
        name: "BankAccount",
        label: "Bank Account",
        type: "select",
        options: OPTIONS.bankAccounts,
      },
      { name: "PaidTo", label: "Paid To", type: "text" },
      { name: "Amount", label: "Amount", type: "number" },
      { name: "Narration", label: "Narration", type: "text" },
    ],
    seed: [
      {
        BankPaymentID: 1,
        VoucherNo: "BP-101",
        VoucherDate: "02-04-2026",
        BankAccount: "Bank Account - HDFC",
        PaidTo: "New Vishal Roadlines",
        Amount: 18500,
        Narration: "Vehicle hire settlement",
      },
    ],
  },

  bankreceipt: {
    title: "Bank Receipt",
    icon: "account_balance",
    idField: "BankReceiptID",
    printable: true,
    fields: [
      { name: "VoucherNo", label: "Voucher No.", type: "text" },
      { name: "VoucherDate", label: "Voucher Date", type: "date" },
      {
        name: "BankAccount",
        label: "Bank Account",
        type: "select",
        options: OPTIONS.bankAccounts,
      },
      { name: "ReceivedFrom", label: "Received From", type: "text" },
      { name: "Amount", label: "Amount", type: "number" },
      { name: "Narration", label: "Narration", type: "text" },
    ],
    seed: [
      {
        BankReceiptID: 1,
        VoucherNo: "BR-201",
        VoucherDate: "02-04-2026",
        BankAccount: "Bank Account - SBI",
        ReceivedFrom: "Varun Casting Co",
        Amount: 8400,
        Narration: "SI20260002 collection",
      },
    ],
  },

  contravoucher: {
    title: "Contra Voucher",
    icon: "swap_horiz",
    idField: "ContraVoucherID",
    printable: true,
    fields: [
      { name: "VoucherNo", label: "Voucher No.", type: "text" },
      { name: "VoucherDate", label: "Voucher Date", type: "date" },
      {
        name: "FromAccount",
        label: "From Account",
        type: "select",
        options: OPTIONS.ledgerAccounts,
      },
      {
        name: "ToAccount",
        label: "To Account",
        type: "select",
        options: OPTIONS.ledgerAccounts,
      },
      { name: "Amount", label: "Amount", type: "number" },
      { name: "Narration", label: "Narration", type: "text" },
    ],
    seed: [
      {
        ContraVoucherID: 1,
        VoucherNo: "CV-101",
        VoucherDate: "03-04-2026",
        FromAccount: "Cash Account",
        ToAccount: "Bank Account - HDFC",
        Amount: 20000,
        Narration: "Cash deposited into bank",
      },
    ],
  },

  journalvoucher: {
    title: "Journal Voucher",
    icon: "edit_note",
    idField: "JournalVoucherID",
    printable: true,
    fields: [
      { name: "VoucherNo", label: "Voucher No.", type: "text" },
      { name: "VoucherDate", label: "Voucher Date", type: "date" },
      {
        name: "DebitAccount",
        label: "Debit Account",
        type: "select",
        options: OPTIONS.ledgerAccounts,
      },
      {
        name: "CreditAccount",
        label: "Credit Account",
        type: "select",
        options: OPTIONS.ledgerAccounts,
      },
      { name: "Amount", label: "Amount", type: "number" },
      { name: "Narration", label: "Narration", type: "text" },
    ],
    seed: [
      {
        JournalVoucherID: 1,
        VoucherNo: "JV-51",
        VoucherDate: "03-04-2026",
        DebitAccount: "Sundry Debtors",
        CreditAccount: "Freight Income",
        Amount: 12500,
        Narration: "SI20260001 booked",
      },
    ],
  },
};

export function getEntityDef(entity) {
  return ENTITY_DEFS[entity];
}

const stores = {};

function ensureStore(entity) {
  if (!stores[entity]) {
    const def = ENTITY_DEFS[entity];
    const key = STORAGE_PREFIX + entity;
    let data = readStorage(key, null);
    if (!Array.isArray(data)) {
      data = def.seed.map((r) => ({ ...r }));
      writeStorage(key, data);
    }
    stores[entity] = data;
  }
  return stores[entity];
}

function persist(entity) {
  writeStorage(STORAGE_PREFIX + entity, stores[entity]);
}

export function apiGetMasterList(entity) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...ensureStore(entity)]), 150);
  });
}

export function apiSaveMasterRow(entity, row) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const def = ENTITY_DEFS[entity];
      const list = ensureStore(entity);
      if (row[def.idField]) {
        const idx = list.findIndex((r) => r[def.idField] === row[def.idField]);
        if (idx !== -1) list[idx] = { ...row };
      } else {
        row[def.idField] = list.length
          ? Math.max(...list.map((r) => r[def.idField])) + 1
          : 1;
        list.push(row);
      }
      persist(entity);
      resolve({ success: true, data: row });
    }, 200);
  });
}

export function apiDeleteMasterRow(entity, id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const def = ENTITY_DEFS[entity];
      const list = ensureStore(entity);
      const idx = list.findIndex((r) => r[def.idField] === id);
      if (idx !== -1) list.splice(idx, 1);
      persist(entity);
      resolve({ success: true });
    }, 150);
  });
}
