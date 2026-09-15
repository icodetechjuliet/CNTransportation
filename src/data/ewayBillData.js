// E-Way Bill module's mock "backend" — same localStorage-backed pattern as
// src/data/tripData.js, kept in its own plain JS module so all 5 E-Way Bill
// pages (Part A, Part B Single, Part B Consolidated, Part B Log, Part B
// Print) read/write the same store instead of duplicating state per page.
//
// Matches the old EagleParcel WinForms app's own GST e-way bill flow:
// Part A (BUK_EWayBill) is generated first against a booking — it carries
// the consignor/consignee/value/HSN details the GST portal needs but no
// vehicle yet. Part B (BUK_EWayBill's "Generate Part B" action /
// BUK_EWayBill_Consolidated) is added afterwards once a vehicle is
// assigned — either one bill at a time ("Single") or several bills bound
// for the same vehicle at once ("Consolidated"), producers a
// Consolidated E-Way Bill No. grouping them. The Log and Print screens both
// just read whatever Part A/B state is already stored here.

const STORAGE_KEY = "cn_ewaybill_mock_db_v1";

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

// Dropdown option lists shared by every E-Way Bill page.
export const MOCK_DATA = {
  cities: ["Rajkot-G", "Chakan", "Nasik", "Hyderabad", "Pune", "Mumbai", "Bangalore", "Vasai", "Vapi"],
  states: ["Gujarat", "Maharashtra", "Karnataka", "Telangana"],
  vehicles: ["GJ3BW0003", "GJ03BV7545", "GJ03BV6768", "GJ03BW2345", "GJ03AT2203", "TRUCK"],
  transportModes: ["Road", "Rail", "Air", "Ship"],
};

const SEED_EWAYBILLS = [
  {
    EWayBillId: 1,
    EWayBillNo: "601284646429",
    BookingNo: "RKG21040001",
    BookingDate: "01-04-2026",
    FromCity: "Rajkot-G",
    ToCity: "Chakan",
    ConsignorName: "Balaji xxx Co.",
    ConsigneeName: "Galaxy xxx Tooling",
    DocValue: 5520,
    HSNCode: "8471",
    TransportMode: "Road",
    PartBStatus: "Generated",
    VehicleNo: "GJ3BW0003",
    FromPlace: "Rajkot-G",
    PartBDate: "01-04-2026 11:10 AM",
    IsConsolidated: false,
    ConsolidatedNo: "",
    GeneratedBy: "CargoNet User",
  },
  {
    EWayBillId: 2,
    EWayBillNo: "701284646430",
    BookingNo: "RKG21040002",
    BookingDate: "01-04-2026",
    FromCity: "Rajkot-G",
    ToCity: "Nasik",
    ConsignorName: "Rajsani xxx Polymers",
    ConsigneeName: "Ring xxx Ltd",
    DocValue: 3200,
    HSNCode: "3926",
    TransportMode: "Road",
    PartBStatus: "Not Generated",
    VehicleNo: "",
    FromPlace: "",
    PartBDate: "",
    IsConsolidated: false,
    ConsolidatedNo: "",
    GeneratedBy: "",
  },
  {
    EWayBillId: 3,
    EWayBillNo: "801284646431",
    BookingNo: "RKG21040003",
    BookingDate: "02-04-2026",
    FromCity: "Rajkot-G",
    ToCity: "Chakan",
    ConsignorName: "Balaji xxx Co.",
    ConsigneeName: "Galaxy xxx Tooling",
    DocValue: 1800,
    HSNCode: "8471",
    TransportMode: "Road",
    PartBStatus: "Not Generated",
    VehicleNo: "",
    FromPlace: "",
    PartBDate: "",
    IsConsolidated: false,
    ConsolidatedNo: "",
    GeneratedBy: "",
  },
];

let MOCK_EWAYBILLS = readStorage(STORAGE_KEY, null);
if (!Array.isArray(MOCK_EWAYBILLS) || !MOCK_EWAYBILLS.length) {
  MOCK_EWAYBILLS = SEED_EWAYBILLS.map((e) => ({ ...e }));
  writeStorage(STORAGE_KEY, MOCK_EWAYBILLS);
}

function persist() {
  writeStorage(STORAGE_KEY, MOCK_EWAYBILLS);
}

// ── Part A ──────────────────────────────────────────────────────────────
function parseDMDDate(dateStr) {
  if (!dateStr) return null;
  const [d, m, y] = dateStr.split("-").map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

export function apiGetEWayBills(search, fromDate, toDate) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_EWAYBILLS];
      const from = parseDMDDate(fromDate);
      const to = parseDMDDate(toDate);
      if (from || to) {
        result = result.filter((e) => {
          const eDate = parseDMDDate(e.BookingDate);
          if (!eDate) return true;
          if (from && eDate < from) return false;
          if (to && eDate > to) return false;
          return true;
        });
      }
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (e) =>
            e.EWayBillNo.toLowerCase().includes(s) ||
            e.BookingNo.toLowerCase().includes(s) ||
            e.ConsignorName.toLowerCase().includes(s) ||
            e.ConsigneeName.toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export function apiGetEWayBillById(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_EWAYBILLS.find((e) => e.EWayBillId === id) || null), 100);
  });
}

export function apiSaveEWayBill(bill) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (bill.EWayBillId) {
        const idx = MOCK_EWAYBILLS.findIndex((e) => e.EWayBillId === bill.EWayBillId);
        if (idx !== -1) MOCK_EWAYBILLS[idx] = { ...bill };
      } else {
        bill.EWayBillId = Math.max(0, ...MOCK_EWAYBILLS.map((e) => e.EWayBillId)) + 1;
        bill.EWayBillNo = String(600000000000 + bill.EWayBillId * 111111);
        bill.PartBStatus = "Not Generated";
        bill.VehicleNo = "";
        bill.FromPlace = "";
        bill.PartBDate = "";
        bill.IsConsolidated = false;
        bill.ConsolidatedNo = "";
        bill.GeneratedBy = "";
        MOCK_EWAYBILLS.push(bill);
      }
      persist();
      resolve({ success: true, data: bill });
    }, 250);
  });
}

export function apiDeleteEWayBill(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_EWAYBILLS.findIndex((e) => e.EWayBillId === id);
      if (idx !== -1) MOCK_EWAYBILLS.splice(idx, 1);
      persist();
      resolve({ success: true });
    }, 150);
  });
}

// ── Part B — Single ──────────────────────────────────────────────────────
// Used by DMSEWayBillPartBSingle.vue's "Generate Part B" action on one
// pending (PartBStatus === "Not Generated") Part A record at a time.
export function apiGeneratePartBSingle(id, vehicleNo, fromPlace) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bill = MOCK_EWAYBILLS.find((e) => e.EWayBillId === id);
      if (bill) {
        Object.assign(bill, {
          PartBStatus: "Generated",
          VehicleNo: vehicleNo,
          FromPlace: fromPlace,
          PartBDate: new Date().toLocaleString(),
          IsConsolidated: false,
          ConsolidatedNo: "",
          GeneratedBy: "CargoNet User",
        });
        persist();
      }
      resolve({ success: !!bill, data: bill });
    }, 200);
  });
}

// ── Part B — Consolidated ────────────────────────────────────────────────
// Groups several pending Part A records bound for the same vehicle under
// one Consolidated E-Way Bill No., same as the old app's
// BUK_EWayBill_Consolidated screen.
export function apiGeneratePartBConsolidated(ids, vehicleNo, fromPlace) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const consolidatedNo = "CEWB" + Date.now().toString().slice(-8);
      const updated = [];
      ids.forEach((id) => {
        const bill = MOCK_EWAYBILLS.find((e) => e.EWayBillId === id);
        if (bill) {
          Object.assign(bill, {
            PartBStatus: "Generated",
            VehicleNo: vehicleNo,
            FromPlace: fromPlace,
            PartBDate: new Date().toLocaleString(),
            IsConsolidated: true,
            ConsolidatedNo: consolidatedNo,
            GeneratedBy: "CargoNet User",
          });
          updated.push(bill);
        }
      });
      persist();
      resolve({ success: updated.length > 0, consolidatedNo, data: updated });
    }, 250);
  });
}

// ── Part B — Log ─────────────────────────────────────────────────────────
// Read-only feed of every bill that has had Part B generated — the Log
// screen just filters the same store down to those.
export function apiGetPartBLog(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = MOCK_EWAYBILLS.filter((e) => e.PartBStatus === "Generated");
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (e) =>
            e.EWayBillNo.toLowerCase().includes(s) ||
            e.VehicleNo.toLowerCase().includes(s) ||
            (e.ConsolidatedNo || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}
