import { computed, ref } from "vue";
import { ACTIVITY_KEY, CONTAINER_KEY } from "./useNvoccContainers";

export const KEYS = {
  principals: "cnplus_nvocc_principals",
  agreements: "cnplus_nvocc_principal_agreements",
  purchases: "cnplus_nvocc_container_purchases",
  leases: "cnplus_nvocc_container_leases",
  returns: "cnplus_nvocc_lease_returns",
  gateIn: "cnplus_nvocc_gate_in",
  gateOut: "cnplus_nvocc_gate_out",
  revenue: "cnplus_nvocc_container_revenue",
  expenses: "cnplus_nvocc_container_expenses",
  invoices: "cnplus_nvocc_sales_invoices",
  bills: "cnplus_nvocc_purchase_bills",
  debitNotes: "cnplus_nvocc_debit_notes",
  creditNotes: "cnplus_nvocc_credit_notes",
  openings: "cnplus_nvocc_opening_balances",
  settlements: "cnplus_nvocc_principal_settlements",
};

const db = {};
Object.keys(KEYS).forEach((key) => (db[key] = ref([])));
let loaded = false;
const STORAGE_SCHEMA_VERSION = 3;
export const uid = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 99999)}`;
export const clone = (value) => JSON.parse(JSON.stringify(value));
const selectedCompany = () =>
  Number(
    sessionStorage.getItem("CompanyID") || sessionStorage.getItem("OrgID") || 1
  );
const selectedBranch = () => Number(sessionStorage.getItem("BranchID") || 1);
const base = (i = 0) => ({
  companyId: selectedCompany(),
  branchId: selectedBranch(),
  createdAt: `2026-08-${String(1 + i).padStart(2, "0")}T09:00:00`,
  updatedAt: "2026-08-19T12:00:00",
});

function seed() {
  const principals = [
    [
      "PRN-001",
      "BlueWave Container Lines",
      "BWCL",
      "India",
      "Chennai",
      "USD",
      "Active",
    ],
    [
      "PRN-002",
      "Ocean Crest NVOCC LLC",
      "OCN",
      "UAE",
      "Dubai",
      "USD",
      "Active",
    ],
    [
      "PRN-003",
      "Meridian Box Lines Pte Ltd",
      "MBL",
      "Singapore",
      "Singapore",
      "SGD",
      "Active",
    ],
    [
      "PRN-004",
      "NorthStar Marine GmbH",
      "NSM",
      "Germany",
      "Hamburg",
      "EUR",
      "Active",
    ],
    [
      "PRN-005",
      "Coral Seas Shipping",
      "CSS",
      "India",
      "Mumbai",
      "USD",
      "Active",
    ],
    [
      "PRN-006",
      "Atlas Container Services",
      "ACS",
      "Netherlands",
      "Rotterdam",
      "EUR",
      "Suspended",
    ],
  ].map((p, i) => ({
    id: `PR-${i + 1}`,
    ...base(i),
    principalCode: p[0],
    principalName: p[1],
    shortName: p[2],
    address: `${10 + i}, Port Business District`,
    country: p[3],
    city: p[4],
    contactPerson: [
      "Ravi Menon",
      "Hassan Ali",
      "Lim Wei",
      "Anna Weber",
      "Meera Shah",
      "Jan Visser",
    ][i],
    email: `operations@${p[2].toLowerCase()}.demo`,
    phone: `+91 90000 1000${i}`,
    currency: p[5],
    taxId: `TAX-${26001 + i}`,
    creditDays: 30 + (i % 3) * 15,
    paymentTerms: "Net 30 Days",
    status: p[6],
    remarks: "Demo principal account",
  }));
  const agreements = principals.slice(0, 5).map((p, i) => ({
    id: `AGR-${i + 1}`,
    ...base(i),
    agreementNo: `AGR-2026-${String(i + 1).padStart(3, "0")}`,
    principalId: p.id,
    principal: p.principalName,
    agreementDate: "2026-01-01",
    effectiveFrom: "2026-01-01",
    effectiveTo: i === 4 ? "2026-09-30" : "2026-12-31",
    agreementType: i % 2 ? "Lease & Management" : "Container Management",
    currency: p.currency,
    revenueSharing: 70 + i,
    costSharing: 50,
    managementFee: 2.5 + i,
    freeDays: 7 + i,
    detentionTerms: "As per MRG tariff",
    demurrageTerms: "Port tariff at actual",
    leaseTerms: "Monthly billing, minimum 90 days",
    billingCycle: "Monthly",
    settlementCycle: "Monthly",
    remarks: "Standard principal agreement",
    status: i === 4 ? "Draft" : "Active",
  }));
  const leases = principals.slice(0, 4).map((p, i) => ({
    id: `LSE-${i + 1}`,
    ...base(i),
    leaseNo: `LSE-2026-${String(101 + i)}`,
    leaseDate: "2026-01-15",
    principalId: p.id,
    principal: p.principalName,
    lessor: [
      "Triton International",
      "Textainer",
      "Seaco Global",
      "CAI International",
    ][i],
    leaseType: i % 2 ? "Long Term" : "Master Lease",
    currency: "USD",
    effectiveFrom: "2026-02-01",
    effectiveTo: i === 0 ? "2026-08-25" : "2027-01-31",
    billingCycle: "Monthly",
    deposit: 5000 + i * 1000,
    status: i === 0 ? "Due for Return" : "Active",
    containers: Array.from({ length: 3 }, (_, n) => ({
      id: `LC-${i}-${n}`,
      containerNo: [
        "MSCU1234567",
        "TGHU1235358",
        "CMAU1236149",
        "OOLU1236940",
        "MAEU1237731",
        "MSCU1238522",
        "TGHU1239313",
        "CMAU1240104",
        "OOLU1240895",
        "MAEU1241686",
        "MSCU1242477",
        "TGHU1243268",
      ][i * 3 + n],
      type: n === 2 ? "40HC" : n === 1 ? "40GP" : "20GP",
      size: n ? "40 FT" : "20 FT",
      pickupDepot: "Chennai Empty Depot",
      leaseStart: "2026-02-01",
      freeDays: 7,
      dailyRate: 4.5 + i,
      monthlyRate: 125 + i * 10,
      minimumDays: 90,
      returnDepot: "Chennai Empty Depot",
      status: i === 0 && n === 0 ? "Due for Return" : "On Hire",
    })),
  }));
  const purchases = principals.slice(0, 3).map((p, i) => ({
    id: `PUR-${i + 1}`,
    ...base(i),
    purchaseNo: `CP-2026-${101 + i}`,
    purchaseDate: `2026-0${3 + i}-10`,
    principalId: p.id,
    principal: p.principalName,
    vendor: ["Singamas", "CIMC Containers", "CXIC Group"][i],
    currency: "USD",
    tax: 1800 + i * 200,
    otherCost: 450,
    status: "Posted",
    remarks: "New container acquisition",
    containers: [
      {
        id: `PC-${i}`,
        containerNo: ["CMAU1236149", "OOLU1236940", "MAEU1237731"][i],
        containerType: i === 0 ? "20GP" : "40HC",
        manufactureYear: 2026,
        purchasePrice: 2800 + i * 900,
        depot: "Chennai Empty Depot",
        currentLocation: "Chennai Empty Depot",
        condition: "New",
        ownership: "COC",
      },
    ],
  }));
  const revenueTypes = [
    "Lease Revenue",
    "Container Handling",
    "Detention",
    "Demurrage",
    "Repair Recovery",
    "Gate Charge",
  ];
  const expenseTypes = [
    "Lease Cost",
    "Depot Handling",
    "Lift On",
    "Lift Off",
    "Repair",
    "Transportation",
    "Storage",
  ];
  const revenues = Array.from({ length: 14 }, (_, i) => ({
    id: `REV-${i + 1}`,
    ...base(i % 8),
    entryNo: `CR-2026-${1001 + i}`,
    entryDate: `2026-08-${String(1 + (i % 15)).padStart(2, "0")}`,
    principalId: principals[i % 5].id,
    principal: principals[i % 5].principalName,
    containerNo: leases[i % 4].containers[i % 3].containerNo,
    jobNo: `NVC-2608${100 + i}`,
    bookingNo: `BKG-2608${100 + i}`,
    customer: [
      "ABC Imports Pvt Ltd",
      "Orbit Marine Exports",
      "Meridian Auto Parts",
    ][i % 3],
    chargeCode: `REV${i + 1}`,
    description: revenueTypes[i % revenueTypes.length],
    basis: "Container",
    currency: "USD",
    rate: 250 + i * 23,
    quantity: 1,
    amount: 250 + i * 23,
    invoiceStatus: i % 3 === 0 ? "Invoiced" : "Unbilled",
    status: "Posted",
  }));
  const expenses = Array.from({ length: 13 }, (_, i) => ({
    id: `EXP-${i + 1}`,
    ...base(i % 8),
    entryNo: `CE-2026-${1001 + i}`,
    entryDate: `2026-08-${String(1 + (i % 15)).padStart(2, "0")}`,
    principalId: principals[i % 5].id,
    principal: principals[i % 5].principalName,
    containerNo: leases[i % 4].containers[i % 3].containerNo,
    vendor: ["Triton International", "Chennai Depot Services", "VRL Logistics"][
      i % 3
    ],
    jobNo: `NVC-2608${100 + i}`,
    expenseType: expenseTypes[i % expenseTypes.length],
    currency: "USD",
    rate: 130 + i * 17,
    quantity: 1,
    amount: 130 + i * 17,
    reference: `REF-${8000 + i}`,
    billStatus: i % 3 === 0 ? "Billed" : "Unbilled",
    status: "Posted",
  }));
  const invoices = Array.from({ length: 7 }, (_, i) => ({
    id: `INV-${i + 1}`,
    ...base(i),
    invoiceNo: `CSI-2026-${1001 + i}`,
    invoiceDate: `2026-08-${String(5 + i).padStart(2, "0")}`,
    principalId: principals[i % 5].id,
    principal: principals[i % 5].principalName,
    customer: revenues[i].customer,
    jobNo: revenues[i].jobNo,
    containerNo: revenues[i].containerNo,
    currency: "USD",
    dueDate: "2026-09-15",
    paymentTerms: "Net 30 Days",
    reference: revenues[i].entryNo,
    lines: [
      {
        id: `IL-${i}`,
        charge: revenues[i].description,
        description: "Container service charge",
        containerNo: revenues[i].containerNo,
        rate: revenues[i].amount,
        quantity: 1,
        tax: revenues[i].amount * 0.18,
      },
    ],
    paid: i % 3 === 0 ? revenues[i].amount * 1.18 : i % 3 === 1 ? 100 : 0,
    status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Partially Paid" : "Issued",
  }));
  const bills = Array.from({ length: 6 }, (_, i) => ({
    id: `BILL-${i + 1}`,
    ...base(i),
    billNo: `CPB-2026-${1001 + i}`,
    vendorBillNo: `VB-${7800 + i}`,
    billDate: `2026-08-${String(4 + i).padStart(2, "0")}`,
    principalId: principals[i % 5].id,
    principal: principals[i % 5].principalName,
    vendor: expenses[i].vendor,
    containerNo: expenses[i].containerNo,
    jobNo: expenses[i].jobNo,
    currency: "USD",
    dueDate: "2026-09-15",
    lines: [
      {
        id: `BL-${i}`,
        expense: expenses[i].expenseType,
        description: "Container operating cost",
        containerNo: expenses[i].containerNo,
        rate: expenses[i].amount,
        quantity: 1,
        tax: expenses[i].amount * 0.18,
      },
    ],
    paid: i % 3 === 0 ? expenses[i].amount * 1.18 : 0,
    status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Approved" : "Posted",
  }));
  const debitNotes = Array.from({ length: 3 }, (_, i) => ({
    id: `DN-${i}`,
    ...base(i),
    noteNo: `DN-2026-${101 + i}`,
    date: `2026-08-${10 + i}`,
    principalId: principals[i].id,
    principal: principals[i].principalName,
    party: revenues[i].customer,
    relatedInvoice: invoices[i].invoiceNo,
    containerNo: revenues[i].containerNo,
    currency: "USD",
    reason: "Additional container charge",
    amount: 75 + i * 25,
    tax: 13.5 + i * 4.5,
    remarks: "Approved adjustment",
    status: "Posted",
  }));
  const creditNotes = Array.from({ length: 3 }, (_, i) => ({
    id: `CN-${i}`,
    ...base(i),
    noteNo: `CN-2026-${101 + i}`,
    date: `2026-08-${12 + i}`,
    principalId: principals[i].id,
    principal: principals[i].principalName,
    party: revenues[i].customer,
    relatedInvoice: invoices[i].invoiceNo,
    containerNo: revenues[i].containerNo,
    currency: "USD",
    reason: [
      "Rate Correction",
      "Detention Adjustment",
      "Commercial Adjustment",
    ][i],
    amount: 40 + i * 20,
    tax: 7.2 + i * 3.6,
    remarks: "Commercial credit",
    status: "Posted",
  }));
  const openings = ["PO", "AO", "VO", "CO"].flatMap((flag, fi) =>
    principals.slice(0, 3).map((p, i) => ({
      id: `OP-${flag}-${i}`,
      ...base(i),
      flag,
      party: flag === "PO" ? p.principalName : `${flag} Demo Party ${i + 1}`,
      documentNo: `OB-${flag}-${100 + i}`,
      documentDate: "2026-04-01",
      currency: p.currency,
      debit: (fi + i) % 2 ? 0 : 1200 + i * 300,
      credit: (fi + i) % 2 ? 800 + i * 250 : 0,
      dueDate: "2026-04-30",
      reference: "Opening migration",
      remarks: "Audited opening balance",
      status: "Posted",
    }))
  );
  const settlements = principals.slice(0, 4).map((p, i) => ({
    id: `SET-${i}`,
    ...base(i),
    settlementNo: `SET-2026-${101 + i}`,
    principalId: p.id,
    principal: p.principalName,
    fromDate: "2026-08-01",
    toDate: "2026-08-31",
    currency: p.currency,
    openingBalance: 1000 + i * 400,
    revenue: revenues
      .filter((x) => x.principalId === p.id)
      .reduce((s, x) => s + x.amount, 0),
    costs: expenses
      .filter((x) => x.principalId === p.id)
      .reduce((s, x) => s + x.amount, 0),
    payments: 200 + i * 50,
    receipts: 400 + i * 100,
    adjustments: 0,
    status: i === 0 ? "Approved" : "Draft",
  }));
  const returns = Array.from({ length: 5 }, (_, i) => {
    const l = leases[i % 4],
      c = l.containers[i % 3];
    return {
      id: `LR-${i + 1}`,
      ...base(i),
      returnNo: `LR-2026-${101 + i}`,
      leaseNo: l.leaseNo,
      containerNo: c.containerNo,
      principalId: l.principalId,
      principal: l.principal,
      lessor: l.lessor,
      returnDate: `2026-08-${String(15 + i).padStart(2, "0")}`,
      returnDepot: "Chennai Empty Depot",
      condition: i === 1 ? "Minor Damage" : "Good",
      damage: i === 1 ? "Dent on door panel" : "",
      repairCost: i === 1 ? 150 : 0,
      additionalCharges: 50 + i * 20,
      finalLeaseDays: 180 + i * 10,
      finalLeaseAmount: 900 + i * 150,
      remarks: "Lease return processed",
      status: i === 0 ? "Returned" : i === 4 ? "Closed" : "Requested",
    };
  });
  const gateDepots = [
    "Chennai Empty Depot",
    "Madhavaram Depot",
    "Mundra CFS",
    "Nhava Sheva CFS",
  ];
  const gateTransporters = [
    "ABC Container Transport",
    "South India Logistics",
    "Express Haulage",
    "VRL Logistics",
    "Coral Freight Movers",
  ];
  const gateIn = Array.from({ length: 5 }, (_, i) => ({
    id: `GI-${i + 1}`,
    ...base(i),
    gateNo: `GI-2026-${String(1 + i).padStart(4, "0")}`,
    date: `2026-08-${String(10 + i).padStart(2, "0")}`,
    time: `${String(9 + i).padStart(2, "0")}:30`,
    containerNo: leases[i % 4].containers[i % 3].containerNo,
    principal: principals[i % 5].principalName,
    depot: gateDepots[i % gateDepots.length],
    location: gateDepots[i % gateDepots.length],
    booking: `BKG-2608${100 + i}`,
    job: `NVC-2608${100 + i}`,
    truckNo: `TN-0${1 + i}-AB-4${i}00`,
    transporter: gateTransporters[i],
    condition: i === 1 ? "Minor Damage" : "Good",
    damage: i === 1 ? "Scratch on side panel" : "",
    surveyRequired: i === 1 ? "Yes" : "No",
    reason: [
      "Empty Return",
      "Import Return",
      "Depot Transfer",
      "Repair Return",
      "Lease Return",
    ][i],
    remarks: "Depot gate-in recorded",
    status: "Completed",
  }));
  const gateOut = Array.from({ length: 5 }, (_, i) => ({
    id: `GO-${i + 1}`,
    ...base(i),
    gateNo: `GO-2026-${String(1 + i).padStart(4, "0")}`,
    date: `2026-08-${String(11 + i).padStart(2, "0")}`,
    time: `${String(11 + i).padStart(2, "0")}:15`,
    containerNo: leases[(i + 1) % 4].containers[i % 3].containerNo,
    principal: principals[i % 5].principalName,
    depot: gateDepots[i % gateDepots.length],
    fromLocation: gateDepots[i % gateDepots.length],
    toLocation: [
      "Customer Warehouse",
      "Chennai Container Terminal",
      "Export CFS",
      "Madhavaram Depot",
      "Mundra CFS",
    ][i],
    customer: [
      "ABC Imports Pvt Ltd",
      "Orbit Marine Exports",
      "Meridian Auto Parts",
      "Blue Nile Foods LLC",
      "Eastern Engineering Co",
    ][i],
    booking: `BKG-2608${110 + i}`,
    job: `NVC-2608${110 + i}`,
    truckNo: `TN-0${2 + i}-CD-4${i}20`,
    driver: `Demo Driver ${i + 1}`,
    transporter: gateTransporters[(i + 1) % gateTransporters.length],
    sealNo: `SL${60000 + i}`,
    condition: "Good",
    purpose: [
      "Empty Release",
      "Export Stuffing",
      "Lease Movement",
      "Depot Transfer",
      "Repair",
    ][i],
    remarks: "Depot gate-out recorded",
    status: "Completed",
  }));
  return {
    principals,
    agreements,
    purchases,
    leases,
    returns,
    gateIn,
    gateOut,
    revenue: revenues,
    expenses,
    invoices,
    bills,
    debitNotes,
    creditNotes,
    openings,
    settlements,
  };
}

export function persistPrincipal(key) {
  localStorage.setItem(KEYS[key], JSON.stringify(db[key].value));
}
export function saveEntity(key, record) {
  const data = clone(record);
  data.id ||= uid(key.toUpperCase());
  data.companyId ||= selectedCompany();
  data.branchId ||= selectedBranch();
  data.updatedAt = new Date().toISOString();
  data.createdAt ||= data.updatedAt;
  const index = db[key].value.findIndex((x) => x.id === data.id);
  if (index >= 0) db[key].value.splice(index, 1, data);
  else db[key].value.unshift(data);
  persistPrincipal(key);
  return data;
}
export function deleteEntity(key, id) {
  db[key].value = db[key].value.filter((x) => x.id !== id);
  persistPrincipal(key);
}
let loadedScope = "";
function load() {
  const seeded = seed();
  const companyId = selectedCompany();
  const branchId = selectedBranch();
  const currentScope = `${companyId}:${branchId}`;
  if (loaded && loadedScope === currentScope) return;
  const suffix = `-${companyId}-${branchId}`;
  const schemaKey = `cnplus_nvocc_principal_schema_${currentScope}`;
  const needsMigration =
    Number(localStorage.getItem(schemaKey) || 0) < STORAGE_SCHEMA_VERSION;
  Object.keys(KEYS).forEach((key) => {
    let stored;
    try {
      stored = JSON.parse(localStorage.getItem(KEYS[key]));
    } catch {
      stored = null;
    }
    if (Array.isArray(stored) && needsMigration) {
      stored = stored.map((row, index) => {
        const templates = seeded[key];
        const fallback = templates.length
          ? clone(templates[index % templates.length])
          : {};
        return {
          ...fallback,
          ...row,
          companyId: Number(row.companyId || companyId),
          branchId: Number(row.branchId || branchId),
          createdAt: row.createdAt || fallback.createdAt || new Date().toISOString(),
          updatedAt: row.updatedAt || fallback.updatedAt || new Date().toISOString(),
          ...(key === "leases" || key === "purchases"
            ? {
                containers: Array.isArray(row.containers)
                  ? row.containers
                  : fallback.containers || [],
              }
            : {}),
          ...(key === "invoices" || key === "bills"
            ? {
                lines: Array.isArray(row.lines)
                  ? row.lines
                  : fallback.lines || [],
              }
            : {}),
        };
      });
      const scopedIds = new Set(
        stored
          .filter(
            (row) =>
              row.companyId === companyId && row.branchId === branchId
          )
          .map((row) => row.id)
      );
      stored.push(
        ...clone(seeded[key]).filter((row) => !scopedIds.has(row.id))
      );
    }
    if (!Array.isArray(stored) || stored.length === 0) {
      db[key].value = seeded[key];
    } else if (
      seeded[key].length &&
      !stored.some(
        (row) => row.companyId === companyId && row.branchId === branchId
      )
    ) {
      const scopedSeed = clone(seeded[key]).map((row) => {
        row.id = `${row.id}${suffix}`;
        if (row.principalId) row.principalId = `${row.principalId}${suffix}`;
        if (row.containers) {
          row.containers.forEach((container) => {
            container.id = `${container.id}${suffix}`;
          });
        }
        if (row.lines) {
          row.lines.forEach((line) => {
            line.id = `${line.id}${suffix}`;
          });
        }
        return row;
      });
      db[key].value = [...stored, ...scopedSeed];
    } else {
      db[key].value = stored;
    }
    persistPrincipal(key);
  });
  localStorage.setItem(schemaKey, String(STORAGE_SCHEMA_VERSION));
  ensureContainerPrincipals();
  loaded = true;
  loadedScope = currentScope;
}
function ensureContainerPrincipals() {
  try {
    const list = JSON.parse(localStorage.getItem(CONTAINER_KEY)) || [];
    list.forEach((c, i) => {
      const matchingPrincipals = db.principals.value.filter(
        (principal) =>
          principal.companyId === c.companyId &&
          principal.branchId === c.branchId
      );
      const p = matchingPrincipals[i % matchingPrincipals.length];
      if (!p) return;
      if (
        !c.principalId ||
        !db.principals.value.some((x) => x.id === c.principalId)
      ) {
        c.principalId = p.id;
        c.principal = p.principalName;
      }
      c.leaseStatus ||= c.ownership === "SOC" ? "On Hire" : "Owned";
      c.gateStatus ||= c.currentStatus === "Gate Out" ? "Gate Out" : "Gate In";
    });
    localStorage.setItem(CONTAINER_KEY, JSON.stringify(list));
  } catch {
    /* container module seeds independently */
  }
}
export function recordGate(direction, form, container) {
  const key = direction === "in" ? "gateIn" : "gateOut";
  const saved = saveEntity(key, form);
  const containers = JSON.parse(localStorage.getItem(CONTAINER_KEY)) || [];
  const target = containers.find((c) => c.id === container.id);
  if (target) {
    target.currentStatus = direction === "in" ? "Gate In" : "Gate Out";
    target.gateStatus = target.currentStatus;
    target.currentLocation = form.location || form.toLocation || form.depot;
    target.condition = form.condition;
    target.lastMovementDate = `${form.date} ${form.time}`;
    target.updatedAt = new Date().toISOString();
  }
  localStorage.setItem(CONTAINER_KEY, JSON.stringify(containers));
  const activities = JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || [];
  const activity = {
    ...base(),
    id: uid("ACT"),
    containerId: container.id,
    containerNo: container.containerNo,
    activityType: target.currentStatus,
    event: target.currentStatus,
    movementDate: form.date,
    movementTime: form.time,
    fromLocation: form.fromLocation || container.currentLocation,
    toLocation: target.currentLocation,
    location: target.currentLocation,
    referenceNo: form.booking || form.gateNo,
    createdBy: "Demo User",
    remarks: form.remarks,
    gateTransactionId: saved.id,
  };
  const activityIndex = activities.findIndex(
    (x) => x.gateTransactionId === saved.id
  );
  if (activityIndex >= 0) activities.splice(activityIndex, 1, activity);
  else activities.unshift(activity);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
  return saved;
}
export function useNvoccPrincipal() {
  load();
  const companyId = computed(selectedCompany),
    branchId = computed(selectedBranch);
  const scoped = {};
  Object.keys(KEYS).forEach((key) => {
    scoped[key] = computed(() =>
      db[key].value.filter(
        (x) => x.companyId === companyId.value && x.branchId === branchId.value
      )
    );
  });
  return {
    db,
    scoped,
    companyId,
    branchId,
    saveEntity,
    deleteEntity,
    persistPrincipal,
    recordGate,
  };
}
