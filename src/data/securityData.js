// Security module's mock "backend" — same localStorage-backed pattern as
// src/data/tripData.js, kept in its own plain JS module so every Security
// page (the 4 "User Wise ..." assignment screens, plus the plain masters
// registered in mastersData.js/reportsData.js) reads/writes the same store.
//
// The old EagleParcel WinForms app's Security menu is:
//   User, User Wise Menu, User Wise Rights, User Wise Booking Office,
//   User Wise Fin Year, User Login Log, Patch Details, Menu, Rights
// User/Menu/Rights/Patch Details are flat master tables (registered as
// "secuser"/"secmenu"/"secright"/"secpatch" in src/data/mastersData.js,
// rendered by GenericMasterList.vue) and User Login Log is a read-only log
// ("seclogin" in src/data/reportsData.js, rendered by GenericReportList.vue).
// The 4 "User Wise ..." screens below are a different shape — pick one user,
// then check which items (menus/rights/booking offices/fin years) that user
// is granted — so they get their own generic component,
// src/components/GenericUserWiseAssignment.vue, driven by ASSIGNMENT_DEFS.

const STORAGE_PREFIX = "cn_security_assignment_";

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

// Same user list as the "secuser" master's seed in mastersData.js (kept as
// an independent copy here, per this codebase's own "copy don't
// parametrize" convention across mock data modules — see
// dms-booking-page-pattern skill). Only UserID/UserName matter for the
// assignment screens' own user picker.
const MOCK_USERS = [
  { UserID: 1, UserName: "admin" },
  { UserID: 2, UserName: "ketan.patel" },
  { UserID: 3, UserName: "suresh.rao" },
  { UserID: 4, UserName: "devuser" },
];

// Item lists each assignment type picks from. Menu items mirror the real
// module groups this app's own sidebar renders (see the "DMS" child-menu
// header rows in src/IPConfig/mockData.js); Booking Offices/Fin Years mirror
// the Trip/Booking Office modules' own mock option lists.
const ASSIGNMENT_DEFS = {
  menu: {
    title: "User Wise Menu",
    icon: "menu",
    itemLabel: "Menu",
    items: [
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
  },
  rights: {
    title: "User Wise Rights",
    icon: "verified_user",
    itemLabel: "Right",
    items: ["Add", "Edit", "Delete", "Print", "Export", "Cancel", "Approve"],
  },
  bookingoffice: {
    title: "User Wise Booking Office",
    icon: "store",
    itemLabel: "Booking Office",
    items: ["Greenland", "Chakan", "Nasik", "Hyderabad", "Pune", "Vasai Eagle", "Mumbai", "Rajkot-G", "Bangalore", "Vapi"],
  },
  finyear: {
    title: "User Wise Fin Year",
    icon: "event",
    itemLabel: "Fin Year",
    items: ["2023-24", "2024-25", "2025-26", "2026-27"],
  },
};

function ensureStore(assignKey) {
  const key = STORAGE_PREFIX + assignKey;
  let data = readStorage(key, null);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    data = {}; // { [UserID]: string[] of assigned item names }
    writeStorage(key, data);
  }
  return data;
}

export function getAssignmentDef(assignKey) {
  return ASSIGNMENT_DEFS[assignKey];
}

export function apiGetUsers() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_USERS]), 100);
  });
}

export function apiGetAssignment(assignKey, userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const store = ensureStore(assignKey);
      resolve([...(store[userId] || [])]);
    }, 150);
  });
}

export function apiSaveAssignment(assignKey, userId, items) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = STORAGE_PREFIX + assignKey;
      const store = ensureStore(assignKey);
      store[userId] = [...items];
      writeStorage(key, store);
      resolve({ success: true });
    }, 200);
  });
}
