import { computed, ref } from "vue";

export const CONTAINER_KEY = "cnplus_nvocc_containers";
export const MOVEMENT_KEY = "cnplus_nvocc_container_movements";
export const ACTIVITY_KEY = "cnplus_nvocc_container_activities";

const containers = ref([]);
const movements = ref([]);
const activities = ref([]);
let loaded = false;
const clone = (value) => JSON.parse(JSON.stringify(value));
const uid = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 99999)}`;

export const movementTypes = [
  "Empty Released",
  "Empty Pickup",
  "Gate Out",
  "Arrived at Shipper",
  "Stuffed",
  "Laden Pickup",
  "Gate In",
  "Loaded on Vessel",
  "Vessel Departed",
  "Transshipment Discharge",
  "Transshipment Load",
  "Vessel Arrived",
  "Discharged",
  "Delivery Order",
  "Delivered",
  "Empty Return",
  "Depot In",
  "Repair In",
  "Repair Out",
  "Survey",
  "Damage Report",
];
export const statusMap = {
  "Empty Released": "Allocated",
  "Empty Pickup": "Empty In Transit",
  "Gate Out": "Empty In Transit",
  "Arrived at Shipper": "At Shipper",
  Stuffed: "Laden",
  "Laden Pickup": "Laden In Transit",
  "Gate In": "At Port",
  "Loaded on Vessel": "On Vessel",
  "Vessel Departed": "In Transit",
  "Transshipment Discharge": "At Transshipment Port",
  "Transshipment Load": "On Vessel",
  "Vessel Arrived": "At Port",
  Discharged: "Discharged",
  "Delivery Order": "Delivery Order Issued",
  Delivered: "With Customer",
  "Empty Return": "Empty Returned",
  "Depot In": "At Depot",
  "Repair In": "Under Repair",
  "Repair Out": "Available",
  Survey: "Under Survey",
  "Damage Report": "Damaged",
};
export const ports = [
  "Chennai Port",
  "Chennai Terminal",
  "Nhava Sheva",
  "Mundra Port",
  "Kochi Port",
  "Tuticorin Port",
  "Singapore",
  "Jebel Ali",
  "Colombo",
  "Port Klang",
];
export const depots = [
  "Chennai Empty Depot",
  "Madhavaram Depot",
  "Mundra CFS",
  "Nhava Sheva CFS",
  "Kochi Container Depot",
];
export const customers = [
  "ABC Imports Pvt Ltd",
  "Orbit Marine Exports",
  "Meridian Auto Parts",
  "Alnasr Trading LLC",
  "Coastal Spice Traders",
  "Blue Nile Foods LLC",
  "Zenith Textiles Ltd",
  "Eastern Engineering Co",
];
export const vessels = [
  "MAERSK HANOI",
  "MSC MAYA",
  "CMA CGM TITAN",
  "ONE HARMONY",
  "EVER GIVEN",
];

function seedData() {
  const selectedCompany = Number(
    sessionStorage.getItem("CompanyID") || sessionStorage.getItem("OrgID") || 1
  );
  const selectedBranch = Number(sessionStorage.getItem("BranchID") || 1);
  const states = [
    "Available",
    "Allocated",
    "Empty In Transit",
    "Laden",
    "At Port",
    "On Vessel",
    "In Transit",
    "Discharged",
    "With Customer",
    "Empty Return Pending",
    "Empty Returned",
    "Under Repair",
    "Damaged",
    "At Depot",
  ];
  const types = [
    "20GP",
    "40GP",
    "40HC",
    "45HC",
    "20RF",
    "40RF",
    "Open Top",
    "Flat Rack",
  ];
  const carriers = ["Maersk", "MSC", "CMA CGM", "ONE", "Evergreen"];
  const principalNames = [
    "BlueWave Container Lines",
    "Ocean Crest NVOCC LLC",
    "Meridian Box Lines Pte Ltd",
    "NorthStar Marine GmbH",
    "Coral Seas Shipping",
    "Atlas Container Services",
  ];
  const list = Array.from({ length: 32 }, (_, i) => {
    const companyId = i < 28 ? selectedCompany : selectedCompany + 1;
    const branchId = i < 28 ? selectedBranch : selectedBranch + 1;
    const status = states[i % states.length];
    const type = types[i % types.length];
    const number = `${["MSCU", "TGHU", "CMAU", "OOLU", "MAEU"][i % 5]}${String(
      1234567 + i * 791
    ).slice(0, 7)}`;
    const port = ports[i % ports.length],
      depot = depots[i % depots.length];
    return {
      id: `CTR-${i + 1}`,
      companyId,
      branchId,
      containerNo: number,
      isoCode: type.includes("40") ? "45G1" : "22G1",
      containerType: type,
      size: type.startsWith("20")
        ? "20 FT"
        : type.startsWith("45")
        ? "45 FT"
        : "40 FT",
      ownership: i % 4 === 0 ? "SOC" : "COC",
      carrier: carriers[i % carriers.length],
      principalId: `PR-${(i % principalNames.length) + 1}`,
      principal: principalNames[i % principalNames.length],
      leaseStatus: i % 4 === 0 ? "On Hire" : "Owned",
      gateStatus: status === "Gate Out" ? "Gate Out" : "Gate In",
      bookingNo: `BKG-2608${String(100 + i)}`,
      jobNo: `NVC-2608${String(100 + i)}`,
      customer: customers[i % customers.length],
      vessel: vessels[i % vessels.length],
      voyage: `${320 + i}${i % 2 ? "W" : "E"}`,
      pol: ["Chennai", "Mundra", "Nhava Sheva", "Kochi"][i % 4],
      pod: ["Singapore", "Jebel Ali", "Colombo", "Port Klang"][i % 4],
      currentStatus: status,
      currentLocation:
        status.includes("Depot") || status === "Available" ? depot : port,
      depot,
      port,
      hbl: `HBL-26-${1000 + i}`,
      mbl: `MBL-26-${2000 + i}`,
      sealNo: `SL${60000 + i}`,
      grossWeight: 14500 + i * 310,
      condition:
        status === "Damaged"
          ? "Damaged"
          : status === "Under Repair"
          ? "Under Repair"
          : i % 9 === 0
          ? "Minor Damage"
          : "Good",
      lastMovementDate: `2026-08-${String(1 + (i % 19)).padStart(
        2,
        "0"
      )} ${String(8 + (i % 10)).padStart(2, "0")}:30`,
      freeDaysEnd: `2026-08-${String(20 + (i % 9)).padStart(2, "0")}`,
      detentionDays: i % 6 === 0 ? (i % 8) + 1 : 0,
      locked: i === 7 || i === 19,
      createdAt: "2026-07-01T09:00:00",
      updatedAt: "2026-08-19T12:00:00",
    };
  });
  const acts = [];
  list.forEach((c, i) => {
    ["Empty Released", "Empty Pickup", i % 3 ? "Stuffed" : "Gate In"].forEach(
      (event, n) =>
        acts.push({
          id: `ACT-${i}-${n}`,
          companyId: c.companyId,
          branchId: c.branchId,
          containerId: c.id,
          containerNo: c.containerNo,
          activityType: event,
          event,
          movementDate: `2026-08-${String(10 + n).padStart(2, "0")}`,
          movementTime: `${String(9 + n * 4).padStart(2, "0")}:30`,
          fromLocation: n ? depots[i % depots.length] : "",
          toLocation: n === 2 ? c.currentLocation : depots[i % depots.length],
          location: n === 2 ? c.currentLocation : depots[i % depots.length],
          referenceNo: c.bookingNo,
          createdBy: "Demo User",
          remarks: n === 2 ? "Operation completed" : "System activity",
        })
    );
  });
  return { list, acts };
}

function persist() {
  localStorage.setItem(CONTAINER_KEY, JSON.stringify(containers.value));
  localStorage.setItem(MOVEMENT_KEY, JSON.stringify(movements.value));
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities.value));
}
let loadedScope = "";
function load() {
  const seed = seedData();
  const companyId = Number(
    sessionStorage.getItem("CompanyID") || sessionStorage.getItem("OrgID") || 1
  );
  const branchId = Number(sessionStorage.getItem("BranchID") || 1);
  const currentScope = `${companyId}:${branchId}`;
  if (loaded && loadedScope === currentScope) return;
  const suffix = `-${companyId}-${branchId}`;
  try {
    const stored = JSON.parse(localStorage.getItem(CONTAINER_KEY));
    if (!Array.isArray(stored) || stored.length === 0)
      containers.value = seed.list;
    else if (
      !stored.some((c) => c.companyId === companyId && c.branchId === branchId)
    ) {
      containers.value = [
        ...stored,
        ...seed.list.map((c) => ({ ...c, id: `${c.id}${suffix}` })),
      ];
    } else containers.value = stored;
  } catch {
    containers.value = seed.list;
  }
  try {
    movements.value = JSON.parse(localStorage.getItem(MOVEMENT_KEY)) || [];
  } catch {
    movements.value = [];
  }
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVITY_KEY));
    if (!Array.isArray(stored) || stored.length === 0)
      activities.value = seed.acts;
    else if (
      !stored.some((a) => a.companyId === companyId && a.branchId === branchId)
    ) {
      activities.value = [
        ...stored,
        ...seed.acts.map((a) => ({
          ...a,
          id: `${a.id}${suffix}`,
          containerId: `${a.containerId}${suffix}`,
        })),
      ];
    } else activities.value = stored;
  } catch {
    activities.value = seed.acts;
  }
  loaded = true;
  loadedScope = currentScope;
  persist();
}
export function applyMovement(container, payload) {
  const movement = {
    ...clone(payload),
    id: uid("MOV"),
    containerId: container.id,
    containerNo: container.containerNo,
    companyId: container.companyId,
    branchId: container.branchId,
    createdBy: "Demo User",
  };
  movements.value.unshift(movement);
  activities.value.unshift({
    ...movement,
    id: uid("ACT"),
    activityType: movement.movementType,
    event: movement.movementType,
    location: movement.toLocation || movement.port || movement.depot,
  });
  container.currentStatus =
    statusMap[movement.movementType] || container.currentStatus;
  container.currentLocation =
    movement.toLocation ||
    movement.port ||
    movement.depot ||
    container.currentLocation;
  container.condition = movement.condition || container.condition;
  container.lastMovementDate = `${movement.movementDate} ${movement.movementTime}`;
  container.updatedAt = new Date().toISOString();
  persist();
  return movement;
}
export function useNvoccContainers() {
  load();
  const companyId = computed(() =>
    Number(
      sessionStorage.getItem("CompanyID") ||
        sessionStorage.getItem("OrgID") ||
        1
    )
  );
  const branchId = computed(() =>
    Number(sessionStorage.getItem("BranchID") || 1)
  );
  const scopedContainers = computed(() =>
    containers.value.filter(
      (c) => c.companyId === companyId.value && c.branchId === branchId.value
    )
  );
  const scopedActivities = computed(() =>
    activities.value.filter(
      (a) => a.companyId === companyId.value && a.branchId === branchId.value
    )
  );
  return {
    containers,
    movements,
    activities,
    scopedContainers,
    scopedActivities,
    companyId,
    branchId,
    persist,
    applyMovement,
  };
}
