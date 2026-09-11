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
  cities: ["Rajkot-G", "Chakan", "Nasik", "Hyderabad", "Pune", "Mumbai", "Bangalore", "Vasai", "Vapi"],
  units: ["Nos", "Kg", "Box", "Drum", "Carton"],
  paymentModes: ["Cash", "Cheque", "Online", "Bank Transfer"],
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Hyderabad", "Pune", "Vasai Eagle"],
  taxTypes: ["CGST+SGST", "IGST", "Exempt"],
  commissionTypes: ["Percentage", "Fixed"],
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
      { name: "VehicleType", label: "Vehicle Type", type: "select", options: OPTIONS.vehicleTypes },
      { name: "Capacity", label: "Capacity (Kg)", type: "number" },
      { name: "Owner", label: "Owner", type: "text" },
      { name: "Remarks", label: "Remarks", type: "text" },
    ],
    seed: [
      { VehicleID: 1, VehicleNo: "GJ3BW0003", VehicleType: "Own Vehicle", Capacity: 2000, Owner: "Self", Remarks: "" },
      { VehicleID: 2, VehicleNo: "GJ03BV7545", VehicleType: "Truck", Capacity: 9000, Owner: "New Vishal Roadlines", Remarks: "" },
      { VehicleID: 3, VehicleNo: "GJ03BV6768", VehicleType: "Own Vehicle", Capacity: 1500, Owner: "Self", Remarks: "" },
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
      { VehicleTypeID: 1, TypeName: "Truck", Description: "Large capacity, long haul" },
      { VehicleTypeID: 2, TypeName: "Tempo", Description: "City/short-distance delivery" },
      { VehicleTypeID: 3, TypeName: "Container", Description: "Sealed container carrier" },
      { VehicleTypeID: 4, TypeName: "Own Vehicle", Description: "Company-owned vehicle" },
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
      { DriverID: 1, Name: "Mahendra Singh Jadeja", LicenseNo: "GJ0320210012345", Phone: "9876500001", Address: "Rajkot" },
      { DriverID: 2, Name: "Ramesh Patel", LicenseNo: "GJ0320190054321", Phone: "9876500002", Address: "Chakan" },
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
      { CarrierID: 1, Name: "Eagle Tradelinks Pvt Ltd", ContactPerson: "Ketan Solanki", Phone: "9876511111", Email: "ops@eagletradelinks.example" },
      { CarrierID: 2, Name: "New Vishal Roadlines", ContactPerson: "Vishal Shah", Phone: "9876522222", Email: "info@newvishalroadlines.example" },
    ],
  },

  city: {
    title: "City",
    icon: "location_city",
    idField: "CityID",
    fields: [
      { name: "CityName", label: "City Name", type: "text" },
      { name: "State", label: "State", type: "select", options: OPTIONS.states },
      { name: "PinCode", label: "Pin Code", type: "text" },
    ],
    seed: [
      { CityID: 1, CityName: "Rajkot-G", State: "Gujarat", PinCode: "360001" },
      { CityID: 2, CityName: "Chakan", State: "Maharashtra", PinCode: "410501" },
      { CityID: 3, CityName: "Nasik", State: "Maharashtra", PinCode: "422001" },
      { CityID: 4, CityName: "Hyderabad", State: "Telangana", PinCode: "500001" },
      { CityID: 5, CityName: "Bangalore", State: "Karnataka", PinCode: "560001" },
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
      { InvoiceTypeID: 1, TypeName: "Tax Invoice", Description: "Standard GST tax invoice" },
      { InvoiceTypeID: 2, TypeName: "Bill of Supply", Description: "For exempt/composition supply" },
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
      { PaymentModeID: 3, ModeName: "Online", Description: "UPI / NEFT / RTGS" },
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
      { VoucherID: 1, VoucherType: "Payment Voucher", Prefix: "PV", NextNumber: 101 },
      { VoucherID: 2, VoucherType: "Receipt Voucher", Prefix: "RV", NextNumber: 201 },
      { VoucherID: 3, VoucherType: "Journal Voucher", Prefix: "JV", NextNumber: 51 },
    ],
  },

  company: {
    title: "Company",
    icon: "business",
    idField: "CompanyID",
    fields: [
      { name: "CompanyName", label: "Company Name", type: "text" },
      { name: "Address", label: "Address", type: "text" },
      { name: "GSTNo", label: "GST No.", type: "text" },
      { name: "PAN", label: "PAN", type: "text" },
    ],
    seed: [
      { CompanyID: 1, CompanyName: "CargoNet Transportation Pvt Ltd", Address: "Rajkot, Gujarat", GSTNo: "24AACCE1234C1Z5", PAN: "AACCE1234C" },
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
      { FinYearID: 1, YearName: "2025-26", StartDate: "01-04-2025", EndDate: "31-03-2026", IsCurrent: true },
      { FinYearID: 2, YearName: "2024-25", StartDate: "01-04-2024", EndDate: "31-03-2025", IsCurrent: false },
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
      { SeriesID: 1, SeriesName: "Booking Series", Prefix: "RKG2604", NextNumber: 16 },
      { SeriesID: 2, SeriesName: "Trip Series", Prefix: "TRKG2604", NextNumber: 15 },
    ],
  },

  tax: {
    title: "Tax",
    icon: "percent",
    idField: "TaxID",
    fields: [
      { name: "TaxName", label: "Tax Name", type: "text" },
      { name: "Rate", label: "Rate (%)", type: "number" },
      { name: "Type", label: "Type", type: "select", options: OPTIONS.taxTypes },
    ],
    seed: [
      { TaxID: 1, TaxName: "GST 5%", Rate: 5, Type: "IGST" },
      { TaxID: 2, TaxName: "GST 5% (CGST+SGST)", Rate: 5, Type: "CGST+SGST" },
      { TaxID: 3, TaxName: "Exempt", Rate: 0, Type: "Exempt" },
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
      { BookingOfficeID: 1, OfficeName: "Greenland", City: "Rajkot-G", Address: "Greenland Complex, Rajkot", Phone: "9876500010" },
      { BookingOfficeID: 2, OfficeName: "Chakan", City: "Chakan", Address: "MIDC Chakan", Phone: "9876500011" },
      { BookingOfficeID: 3, OfficeName: "Vasai Eagle", City: "Vasai", Address: "Vasai East", Phone: "9876500012" },
    ],
  },

  bookingofficewisecity: {
    title: "Booking Office Wise City",
    icon: "store",
    idField: "ID",
    fields: [
      { name: "BookingOffice", label: "Booking Office", type: "select", options: OPTIONS.bookingOffices },
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
      { name: "BookingOffice", label: "Booking Office", type: "select", options: OPTIONS.bookingOffices },
      { name: "ToCity", label: "To City", type: "select", options: OPTIONS.cities },
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
      { name: "BookingOffice", label: "Booking Office", type: "select", options: OPTIONS.bookingOffices },
      { name: "PaymentMode", label: "Payment Mode", type: "select", options: OPTIONS.paymentModes },
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
      { name: "BookingOffice", label: "Booking Office", type: "select", options: OPTIONS.bookingOffices },
      { name: "CommissionType", label: "Commission Type", type: "select", options: OPTIONS.commissionTypes },
      { name: "Rate", label: "Rate", type: "number" },
    ],
    seed: [
      { ID: 1, BookingOffice: "Greenland", CommissionType: "Percentage", Rate: 2.5 },
      { ID: 2, BookingOffice: "Chakan", CommissionType: "Percentage", Rate: 3 },
    ],
  },

  otherstatefreightcharge: {
    title: "Other State Freight Charge",
    icon: "payments",
    idField: "ID",
    fields: [
      { name: "FromState", label: "From State", type: "select", options: OPTIONS.states },
      { name: "ToState", label: "To State", type: "select", options: OPTIONS.states },
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
