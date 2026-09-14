// Booking Office module's mock "backend" — same pattern as
// src/data/tripData.js / src/data/deliveryData.js / src/data/bookingData.js
// (its own plain JS module, localStorage-backed so add/edit/delete persist
// like a real DB, instead of a `const MOCK_DATA = {}` baked into each .vue
// file). Covers every "Booking Office" tab (menu code "BO") page whose rows
// previously lived only in component state — DMSBookingOffice.vue,
// DMSBookingOfficeCommission.vue (+ its "Add Multiple" companion),
// DMSBookingOfficeWiseCity.vue, DMSBookingOfficeWiseToCity.vue,
// DMSBookingOfficeWisePaymentMode.vue,
// DMSBookingOfficeWiseDebitCollection.vue,
// DMSBookingOfficeWiseReceivedCollection.vue and
// DMSBookingOfficeDailyCollection.vue. Each is a genuinely separate entity,
// so each keeps its own SEED/persist pair inside this one module (mirrors
// deliveryData.js's bookings/deliveries/doorDeliveries/rates/invoices
// split). Their read-only *View.vue companions now import straight from
// here too, instead of from the list page's .vue file.
//
// (The dms-bo-* group under the DMS > "Booking Office" submenu —
// DMSBOCommission.vue, DMSBOMaster.vue, DMSBOWiseCity.vue, etc. — are
// separate route files that already go through the generic
// src/data/mastersData.js store via GenericMasterList.vue, so they're not
// part of this module.)

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

const OFFICES_KEY = "cn_bo_offices_v1";
const COMMISSIONS_KEY = "cn_bo_commissions_v1";
const WISE_CITIES_KEY = "cn_bo_wise_cities_v1";
const WISE_TO_CITIES_KEY = "cn_bo_wise_to_cities_v1";
const WISE_PAYMENT_MODES_KEY = "cn_bo_wise_payment_modes_v1";
const DEBIT_VOUCHERS_KEY = "cn_bo_debit_vouchers_v1";
const RECEIVED_VOUCHERS_KEY = "cn_bo_received_vouchers_v1";
const DAILY_COLLECTIONS_KEY = "cn_bo_daily_collections_v1";

// ── Booking Office (master) ────────────────────────────────────────────
export const MOCK_DATA_BOOKING_OFFICE = {
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
  cities: ["Rajkot-G", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const SEED_OFFICES = [
  {
    BookingOfficeId: 1,
    BookingOfficeName: "Greenland",
    PrintName: "Greenland Booking Office",
    BookingOfficeCode: "GRL",
    AccountName: "Select Party",
    Address: "Rajkot-G – Gujarat",
    CityName: "Rajkot-G",
    StateName: "Gujarat",
    Pincode: "360001",
    PhoneNo: "0281-1234567",
    MobileNo: "9876543210",
    Email: "greenland@cargonet.com",
    ContactPersonName: "Ketan Patel",
    ContactPersonPhoneNo: "9876543211",
    BookingOfficeType: "Own Branch",
    TDSPCT: 0,
    DefaultCommission: 5,
    Remarks: "",
    IsActive: true,
    IsAgent: false,
    IsDeductTDS: false,
  },
  {
    BookingOfficeId: 2,
    BookingOfficeName: "Chakan",
    PrintName: "Chakan Booking Office",
    BookingOfficeCode: "CHK",
    AccountName: "Select Party",
    Address: "Chakan – Maharashtra",
    CityName: "Chakan",
    StateName: "Maharashtra",
    Pincode: "410501",
    PhoneNo: "02135-123456",
    MobileNo: "9876500000",
    Email: "chakan@cargonet.com",
    ContactPersonName: "Suresh Rao",
    ContactPersonPhoneNo: "9876500001",
    BookingOfficeType: "Agent",
    TDSPCT: 2,
    DefaultCommission: 4,
    Remarks: "",
    IsActive: true,
    IsAgent: true,
    IsDeductTDS: true,
  },
];

let MOCK_OFFICES = readStorage(OFFICES_KEY, null);
if (!Array.isArray(MOCK_OFFICES)) {
  MOCK_OFFICES = SEED_OFFICES.map((o) => ({ ...o }));
  writeStorage(OFFICES_KEY, MOCK_OFFICES);
}

function persistOffices() {
  writeStorage(OFFICES_KEY, MOCK_OFFICES);
}

export function apiGetOffices(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_OFFICES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.BookingOfficeName.toLowerCase().includes(s) ||
            o.BookingOfficeCode.toLowerCase().includes(s) ||
            (o.CityName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveOffice(office) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (office.BookingOfficeId) {
        const idx = MOCK_OFFICES.findIndex((o) => o.BookingOfficeId === office.BookingOfficeId);
        if (idx !== -1) MOCK_OFFICES[idx] = { ...office };
      } else {
        office.BookingOfficeId = MOCK_OFFICES.length
          ? Math.max(...MOCK_OFFICES.map((o) => o.BookingOfficeId)) + 1
          : 1;
        MOCK_OFFICES.push(office);
      }
      persistOffices();
      resolve({ success: true, data: office });
    }, 200);
  });
}

export function apiDeleteOffice(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_OFFICES.findIndex((o) => o.BookingOfficeId === id);
      if (idx !== -1) MOCK_OFFICES.splice(idx, 1);
      persistOffices();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetOfficeById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_OFFICES.find((o) => o.BookingOfficeId === id) || null),
      100
    );
  });
}

// ── Booking Office Commission ──────────────────────────────────────────
export const MOCK_DATA_BOOKING_OFFICE_COMMISSION = {
  bookingOffices: ["Greenland", "Chakan"],
  parties: ["Balaji xxx Co.", "Rajsani xxx Polymers", "Ring xxx Aqua", "Select Party"],
  items: ["Box", "Parcel", "Pallet", "Crate", "Drum"],
};

const SEED_COMMISSIONS = [
  {
    CommissionId: 1,
    BookingOfficeName: "Greenland",
    AccountName: "Balaji xxx Co.",
    ItemName: "Box",
    FromDate: "01/04/2026",
    ToDate: "30/06/2026",
    InwardCommissionRate: 4,
    OutwardCommissionRate: 5,
    Remarks: "",
  },
  {
    CommissionId: 2,
    BookingOfficeName: "Greenland",
    AccountName: "Rajsani xxx Polymers",
    ItemName: "Pallet",
    FromDate: "01/04/2026",
    ToDate: "30/09/2026",
    InwardCommissionRate: 3,
    OutwardCommissionRate: 4,
    Remarks: "",
  },
  {
    CommissionId: 3,
    BookingOfficeName: "Chakan",
    AccountName: "Ring xxx Aqua",
    ItemName: "Crate",
    FromDate: "01/01/2026",
    ToDate: "31/03/2026",
    InwardCommissionRate: 2.5,
    OutwardCommissionRate: 3.5,
    Remarks: "",
  },
];

let MOCK_COMMISSIONS = readStorage(COMMISSIONS_KEY, null);
if (!Array.isArray(MOCK_COMMISSIONS)) {
  MOCK_COMMISSIONS = SEED_COMMISSIONS.map((c) => ({ ...c }));
  writeStorage(COMMISSIONS_KEY, MOCK_COMMISSIONS);
}

function persistCommissions() {
  writeStorage(COMMISSIONS_KEY, MOCK_COMMISSIONS);
}

export function apiGetCommissions(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_COMMISSIONS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.BookingOfficeName.toLowerCase().includes(s) ||
            (o.AccountName || "").toLowerCase().includes(s) ||
            (o.ItemName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveCommission(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (record.CommissionId) {
        const idx = MOCK_COMMISSIONS.findIndex((o) => o.CommissionId === record.CommissionId);
        if (idx !== -1) MOCK_COMMISSIONS[idx] = { ...record };
      } else {
        record.CommissionId = MOCK_COMMISSIONS.length
          ? Math.max(...MOCK_COMMISSIONS.map((o) => o.CommissionId)) + 1
          : 1;
        MOCK_COMMISSIONS.push(record);
      }
      persistCommissions();
      resolve({ success: true, data: record });
    }, 200);
  });
}

export function apiDeleteCommission(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_COMMISSIONS.findIndex((o) => o.CommissionId === id);
      if (idx !== -1) MOCK_COMMISSIONS.splice(idx, 1);
      persistCommissions();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetCommissionById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_COMMISSIONS.find((o) => o.CommissionId === id) || null),
      100
    );
  });
}

// ── Booking Office Wise City ───────────────────────────────────────────
export const MOCK_DATA_WISE_CITY = {
  bookingOffices: ["Greenland", "Chakan"],
  cities: ["Rajkot-G", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const SEED_WISE_CITIES = [
  { WiseCityId: 1, BookingOfficeName: "Greenland", CityName: "Rajkot-G", Remarks: "", IsActive: true },
  { WiseCityId: 2, BookingOfficeName: "Greenland", CityName: "Chakan", Remarks: "", IsActive: true },
  { WiseCityId: 3, BookingOfficeName: "Chakan", CityName: "Nasik", Remarks: "", IsActive: true },
  { WiseCityId: 4, BookingOfficeName: "Chakan", CityName: "Pune", Remarks: "", IsActive: false },
];

let MOCK_WISE_CITIES = readStorage(WISE_CITIES_KEY, null);
if (!Array.isArray(MOCK_WISE_CITIES)) {
  MOCK_WISE_CITIES = SEED_WISE_CITIES.map((c) => ({ ...c }));
  writeStorage(WISE_CITIES_KEY, MOCK_WISE_CITIES);
}

function persistWiseCities() {
  writeStorage(WISE_CITIES_KEY, MOCK_WISE_CITIES);
}

export function apiGetWiseCities(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_WISE_CITIES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) => o.BookingOfficeName.toLowerCase().includes(s) || o.CityName.toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveWiseCity(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (record.WiseCityId) {
        const idx = MOCK_WISE_CITIES.findIndex((o) => o.WiseCityId === record.WiseCityId);
        if (idx !== -1) MOCK_WISE_CITIES[idx] = { ...record };
      } else {
        record.WiseCityId = MOCK_WISE_CITIES.length
          ? Math.max(...MOCK_WISE_CITIES.map((o) => o.WiseCityId)) + 1
          : 1;
        MOCK_WISE_CITIES.push(record);
      }
      persistWiseCities();
      resolve({ success: true, data: record });
    }, 200);
  });
}

export function apiDeleteWiseCity(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_WISE_CITIES.findIndex((o) => o.WiseCityId === id);
      if (idx !== -1) MOCK_WISE_CITIES.splice(idx, 1);
      persistWiseCities();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetWiseCityById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_WISE_CITIES.find((o) => o.WiseCityId === id) || null),
      100
    );
  });
}

// ── Booking Office Wise To City ────────────────────────────────────────
export const MOCK_DATA_WISE_TO_CITY = {
  bookingOffices: ["Greenland", "Chakan"],
  cities: ["Rajkot-G", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const SEED_WISE_TO_CITIES = [
  { WiseToCityId: 1, BookingOfficeName: "Greenland", ToCityName: "Nasik", Remarks: "", IsActive: true },
  { WiseToCityId: 2, BookingOfficeName: "Greenland", ToCityName: "Pune", Remarks: "", IsActive: true },
  { WiseToCityId: 3, BookingOfficeName: "Chakan", ToCityName: "Vasai", Remarks: "", IsActive: true },
  { WiseToCityId: 4, BookingOfficeName: "Chakan", ToCityName: "Mumbai", Remarks: "", IsActive: false },
];

let MOCK_WISE_TO_CITIES = readStorage(WISE_TO_CITIES_KEY, null);
if (!Array.isArray(MOCK_WISE_TO_CITIES)) {
  MOCK_WISE_TO_CITIES = SEED_WISE_TO_CITIES.map((c) => ({ ...c }));
  writeStorage(WISE_TO_CITIES_KEY, MOCK_WISE_TO_CITIES);
}

function persistWiseToCities() {
  writeStorage(WISE_TO_CITIES_KEY, MOCK_WISE_TO_CITIES);
}

export function apiGetWiseToCities(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_WISE_TO_CITIES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) => o.BookingOfficeName.toLowerCase().includes(s) || o.ToCityName.toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveWiseToCity(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (record.WiseToCityId) {
        const idx = MOCK_WISE_TO_CITIES.findIndex((o) => o.WiseToCityId === record.WiseToCityId);
        if (idx !== -1) MOCK_WISE_TO_CITIES[idx] = { ...record };
      } else {
        record.WiseToCityId = MOCK_WISE_TO_CITIES.length
          ? Math.max(...MOCK_WISE_TO_CITIES.map((o) => o.WiseToCityId)) + 1
          : 1;
        MOCK_WISE_TO_CITIES.push(record);
      }
      persistWiseToCities();
      resolve({ success: true, data: record });
    }, 200);
  });
}

export function apiDeleteWiseToCity(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_WISE_TO_CITIES.findIndex((o) => o.WiseToCityId === id);
      if (idx !== -1) MOCK_WISE_TO_CITIES.splice(idx, 1);
      persistWiseToCities();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetWiseToCityById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_WISE_TO_CITIES.find((o) => o.WiseToCityId === id) || null),
      100
    );
  });
}

// ── Booking Office Wise Payment Mode ───────────────────────────────────
export const MOCK_DATA_WISE_PAYMENT_MODE = {
  bookingOffices: ["Greenland", "Chakan"],
  paymentModes: ["Cash", "Cheque", "NEFT", "UPI", "RTGS"],
};

const SEED_WISE_PAYMENT_MODES = [
  { WisePaymentModeId: 1, BookingOfficeName: "Greenland", PaymentModeName: "Cash", IsActive: true },
  { WisePaymentModeId: 2, BookingOfficeName: "Greenland", PaymentModeName: "NEFT", IsActive: true },
  { WisePaymentModeId: 3, BookingOfficeName: "Chakan", PaymentModeName: "UPI", IsActive: true },
  { WisePaymentModeId: 4, BookingOfficeName: "Chakan", PaymentModeName: "Cheque", IsActive: false },
];

let MOCK_WISE_PAYMENT_MODES = readStorage(WISE_PAYMENT_MODES_KEY, null);
if (!Array.isArray(MOCK_WISE_PAYMENT_MODES)) {
  MOCK_WISE_PAYMENT_MODES = SEED_WISE_PAYMENT_MODES.map((c) => ({ ...c }));
  writeStorage(WISE_PAYMENT_MODES_KEY, MOCK_WISE_PAYMENT_MODES);
}

function persistWisePaymentModes() {
  writeStorage(WISE_PAYMENT_MODES_KEY, MOCK_WISE_PAYMENT_MODES);
}

export function apiGetWisePaymentModes(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_WISE_PAYMENT_MODES];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) => o.BookingOfficeName.toLowerCase().includes(s) || o.PaymentModeName.toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveWisePaymentMode(record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (record.WisePaymentModeId) {
        const idx = MOCK_WISE_PAYMENT_MODES.findIndex((o) => o.WisePaymentModeId === record.WisePaymentModeId);
        if (idx !== -1) MOCK_WISE_PAYMENT_MODES[idx] = { ...record };
      } else {
        record.WisePaymentModeId = MOCK_WISE_PAYMENT_MODES.length
          ? Math.max(...MOCK_WISE_PAYMENT_MODES.map((o) => o.WisePaymentModeId)) + 1
          : 1;
        MOCK_WISE_PAYMENT_MODES.push(record);
      }
      persistWisePaymentModes();
      resolve({ success: true, data: record });
    }, 200);
  });
}

export function apiDeleteWisePaymentMode(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_WISE_PAYMENT_MODES.findIndex((o) => o.WisePaymentModeId === id);
      if (idx !== -1) MOCK_WISE_PAYMENT_MODES.splice(idx, 1);
      persistWisePaymentModes();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetWisePaymentModeById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_WISE_PAYMENT_MODES.find((o) => o.WisePaymentModeId === id) || null),
      100
    );
  });
}

// ── Booking Office Wise Debit Collection ───────────────────────────────
export const MOCK_DATA_WISE_DEBIT_COLLECTION = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const SEED_DEBIT_VOUCHERS = [
  { DebitCollectionId: 1, VoucherNo: "DC20260001", VoucherDate: "01/04/2026", BookingOfficeName: "Greenland", TotalAmount: 5000, Remarks: "" },
  { DebitCollectionId: 2, VoucherNo: "DC20260002", VoucherDate: "02/04/2026", BookingOfficeName: "Chakan", TotalAmount: 3200, Remarks: "" },
];

let MOCK_DEBIT_VOUCHERS = readStorage(DEBIT_VOUCHERS_KEY, null);
if (!Array.isArray(MOCK_DEBIT_VOUCHERS)) {
  MOCK_DEBIT_VOUCHERS = SEED_DEBIT_VOUCHERS.map((v) => ({ ...v }));
  writeStorage(DEBIT_VOUCHERS_KEY, MOCK_DEBIT_VOUCHERS);
}

function persistDebitVouchers() {
  writeStorage(DEBIT_VOUCHERS_KEY, MOCK_DEBIT_VOUCHERS);
}

export function apiGetDebitVouchers(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_DEBIT_VOUCHERS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.VoucherNo.toLowerCase().includes(s) ||
            (o.BookingOfficeName || "").toLowerCase().includes(s) ||
            (o.Remarks || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveDebitVoucher(voucher) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (voucher.DebitCollectionId) {
        const idx = MOCK_DEBIT_VOUCHERS.findIndex((o) => o.DebitCollectionId === voucher.DebitCollectionId);
        if (idx !== -1) MOCK_DEBIT_VOUCHERS[idx] = { ...voucher };
      } else {
        voucher.DebitCollectionId = MOCK_DEBIT_VOUCHERS.length
          ? Math.max(...MOCK_DEBIT_VOUCHERS.map((o) => o.DebitCollectionId)) + 1
          : 1;
        voucher.VoucherNo = "DC" + new Date().getFullYear() + String(voucher.DebitCollectionId).padStart(4, "0");
        MOCK_DEBIT_VOUCHERS.push(voucher);
      }
      persistDebitVouchers();
      resolve({ success: true, data: voucher });
    }, 200);
  });
}

export function apiDeleteDebitVoucher(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_DEBIT_VOUCHERS.findIndex((o) => o.DebitCollectionId === id);
      if (idx !== -1) MOCK_DEBIT_VOUCHERS.splice(idx, 1);
      persistDebitVouchers();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetDebitVoucherById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_DEBIT_VOUCHERS.find((o) => o.DebitCollectionId === id) || null),
      100
    );
  });
}

// ── Booking Office Wise Received Collection ────────────────────────────
export const MOCK_DATA_WISE_RECEIVED_COLLECTION = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const SEED_RECEIVED_VOUCHERS = [
  { ReceivedCollectionId: 1, VoucherNo: "RC20260001", VoucherDate: "01/04/2026", BookingOfficeName: "Greenland", TotalAmount: 5000, Remarks: "" },
  { ReceivedCollectionId: 2, VoucherNo: "RC20260002", VoucherDate: "02/04/2026", BookingOfficeName: "Chakan", TotalAmount: 3200, Remarks: "" },
];

let MOCK_RECEIVED_VOUCHERS = readStorage(RECEIVED_VOUCHERS_KEY, null);
if (!Array.isArray(MOCK_RECEIVED_VOUCHERS)) {
  MOCK_RECEIVED_VOUCHERS = SEED_RECEIVED_VOUCHERS.map((v) => ({ ...v }));
  writeStorage(RECEIVED_VOUCHERS_KEY, MOCK_RECEIVED_VOUCHERS);
}

function persistReceivedVouchers() {
  writeStorage(RECEIVED_VOUCHERS_KEY, MOCK_RECEIVED_VOUCHERS);
}

export function apiGetReceivedVouchers(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_RECEIVED_VOUCHERS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            o.VoucherNo.toLowerCase().includes(s) ||
            (o.BookingOfficeName || "").toLowerCase().includes(s) ||
            (o.Remarks || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveReceivedVoucher(voucher) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (voucher.ReceivedCollectionId) {
        const idx = MOCK_RECEIVED_VOUCHERS.findIndex((o) => o.ReceivedCollectionId === voucher.ReceivedCollectionId);
        if (idx !== -1) MOCK_RECEIVED_VOUCHERS[idx] = { ...voucher };
      } else {
        voucher.ReceivedCollectionId = MOCK_RECEIVED_VOUCHERS.length
          ? Math.max(...MOCK_RECEIVED_VOUCHERS.map((o) => o.ReceivedCollectionId)) + 1
          : 1;
        voucher.VoucherNo = "RC" + new Date().getFullYear() + String(voucher.ReceivedCollectionId).padStart(4, "0");
        MOCK_RECEIVED_VOUCHERS.push(voucher);
      }
      persistReceivedVouchers();
      resolve({ success: true, data: voucher });
    }, 200);
  });
}

export function apiDeleteReceivedVoucher(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_RECEIVED_VOUCHERS.findIndex((o) => o.ReceivedCollectionId === id);
      if (idx !== -1) MOCK_RECEIVED_VOUCHERS.splice(idx, 1);
      persistReceivedVouchers();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetReceivedVoucherById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_RECEIVED_VOUCHERS.find((o) => o.ReceivedCollectionId === id) || null),
      100
    );
  });
}

// ── Booking Office Daily Collection ────────────────────────────────────
export const MOCK_DATA_DAILY_COLLECTION = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune", "Vasai", "Mumbai"],
};

const SEED_DAILY_COLLECTIONS = [
  {
    CollectionId: 1,
    CollectionDate: "01/04/2026",
    BookingOfficeName: "Greenland",
    CashBookingAmount: 15000,
    CashBookingKasarAmount: 100,
    CashDeliveryAmount: 8000,
    CashDeliveryKasarAmount: 50,
    BookingCashCreditAmount: 2000,
    DeliveryCashCreditAmount: 1000,
    TotalCashCreditAmount: "3000.00",
    CashCreditReceiptAmount: 500,
    OtherCashReceiptAmount: 200,
    OtherCashPaymentAmount: 300,
    UchakDebitAmount: 100,
    UchakReceivedAmount: 150,
    SubTotalAmount: "23000.00",
    NetTotalAmount: "23450.00",
    Remarks: "",
  },
  {
    CollectionId: 2,
    CollectionDate: "02/04/2026",
    BookingOfficeName: "Chakan",
    CashBookingAmount: 12000,
    CashBookingKasarAmount: 0,
    CashDeliveryAmount: 6000,
    CashDeliveryKasarAmount: 0,
    BookingCashCreditAmount: 1500,
    DeliveryCashCreditAmount: 500,
    TotalCashCreditAmount: "2000.00",
    CashCreditReceiptAmount: 300,
    OtherCashReceiptAmount: 0,
    OtherCashPaymentAmount: 100,
    UchakDebitAmount: 0,
    UchakReceivedAmount: 0,
    SubTotalAmount: "18000.00",
    NetTotalAmount: "18200.00",
    Remarks: "",
  },
];

let MOCK_DAILY_COLLECTIONS = readStorage(DAILY_COLLECTIONS_KEY, null);
if (!Array.isArray(MOCK_DAILY_COLLECTIONS)) {
  MOCK_DAILY_COLLECTIONS = SEED_DAILY_COLLECTIONS.map((c) => ({ ...c }));
  writeStorage(DAILY_COLLECTIONS_KEY, MOCK_DAILY_COLLECTIONS);
}

function persistDailyCollections() {
  writeStorage(DAILY_COLLECTIONS_KEY, MOCK_DAILY_COLLECTIONS);
}

export function apiGetCollections(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_DAILY_COLLECTIONS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (o) =>
            (o.BookingOfficeName || "").toLowerCase().includes(s) ||
            (o.CollectionDate || "").toLowerCase().includes(s) ||
            (o.Remarks || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiSaveCollection(collection) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (collection.CollectionId) {
        const idx = MOCK_DAILY_COLLECTIONS.findIndex((o) => o.CollectionId === collection.CollectionId);
        if (idx !== -1) MOCK_DAILY_COLLECTIONS[idx] = { ...collection };
      } else {
        collection.CollectionId = MOCK_DAILY_COLLECTIONS.length
          ? Math.max(...MOCK_DAILY_COLLECTIONS.map((o) => o.CollectionId)) + 1
          : 1;
        MOCK_DAILY_COLLECTIONS.push(collection);
      }
      persistDailyCollections();
      resolve({ success: true, data: collection });
    }, 200);
  });
}

export function apiDeleteCollection(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_DAILY_COLLECTIONS.findIndex((o) => o.CollectionId === id);
      if (idx !== -1) MOCK_DAILY_COLLECTIONS.splice(idx, 1);
      persistDailyCollections();
      resolve({ success: true });
    }, 150);
  });
}

export function apiGetCollectionById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_DAILY_COLLECTIONS.find((o) => o.CollectionId === id) || null),
      100
    );
  });
}
