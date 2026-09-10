import { computed, ref } from "vue";
import { useNvoccContainers } from "src/composables/useNvoccContainers";

export const INDEMNITY_KEY = "cnplus_nvocc_indemnities";
export const DO_KEY = "cnplus_nvocc_delivery_orders";
export const GATE_OUT_KEY = "cnplus_nvocc_gate_out";
export const AUDIT_KEY = "cnplus_nvocc_audit_trail";

const deliveryOrders = ref([]),
  indemnities = ref([]),
  gateOuts = ref([]),
  auditTrail = ref([]);
const read = (key) => {
  try {
    const x = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(x) ? x : [];
  } catch {
    return [];
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const scope = () => ({
  companyId: Number(
    sessionStorage.getItem("CompanyID") || sessionStorage.getItem("OrgID") || 1
  ),
  branchId: Number(sessionStorage.getItem("BranchID") || 1),
});
const scoped = (r) =>
  (!r.companyId || r.companyId === scope().companyId) &&
  (!r.branchId || r.branchId === scope().branchId);
const dateAdd = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

function seed() {
  const { scopedContainers } = useNvoccContainers(),
    sc = scope();
  const sourceContainers = scopedContainers.value.length
    ? scopedContainers.value
    : Array.from({ length: 12 }, (_, i) => ({
        id: `IMP-C${i}`,
        containerNo: `MSCU${7654300 + i}`,
        containerType: i % 3 === 0 ? "20GP" : "40HC",
        sealNo: `SL${9000 + i}`,
        currentStatus: "Discharged",
        currentLocation: "Chennai Terminal",
        condition: "Good",
      }));
  let inds = read(INDEMNITY_KEY);
  if (!inds.some(scoped))
    inds = [
      ...inds,
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `IND-DEMO-${i + 1}`,
        ...sc,
        indemnityNo: `IND-CHN-2026-${String(i + 1).padStart(4, "0")}`,
        receiveDate: `2026-08-${String(8 + i).padStart(2, "0")}`,
        jobNo: `IMP-CHN-2026-${String(101 + i).padStart(4, "0")}`,
        hblNo: `HBL-IMP-260${101 + i}`,
        mblNo: `MBL-IMP-260${101 + i}`,
        consignee: [
          "ABC Imports Pvt Ltd",
          "Meridian Auto Parts",
          "Blue Nile Foods LLC",
          "Eastern Engineering Co",
        ][i % 4],
        notifyParty: "Notify Logistics India",
        indemnityType: [
          "Original BL Pending",
          "Bank Guarantee",
          "Letter of Indemnity",
          "Delivery Against Undertaking",
        ][i % 4],
        reason: "Cargo delivery document clearance",
        securityType: i % 2 ? "Bank Guarantee" : "Undertaking",
        securityAmount: i % 2 ? 25000 + i * 2500 : 0,
        currency: "USD",
        bankReference: i % 2 ? `BG-HDFC-26${800 + i}` : "",
        effectiveDate: `2026-08-${String(8 + i).padStart(2, "0")}`,
        expiryDate: `2026-09-${String(8 + i).padStart(2, "0")}`,
        receivedBy: "Import Documentation User",
        approvedBy: i % 3 ? "Import Manager" : "",
        remarks: "Demo indemnity record",
        status: ["Approved", "Received", "Pending Approval", "Released"][i % 4],
        updatedAt: new Date().toISOString(),
      })),
    ];
  let dos = read(DO_KEY);
  if (!dos.some(scoped))
    dos = [
      ...dos,
      ...Array.from({ length: 10 }, (_, i) => {
        const c = sourceContainers[i % sourceContainers.length],
          arrival = `2026-08-${String(5 + i).padStart(2, "0")}`,
          free = 7 + (i % 3),
          status = [
            "Released",
            "Ready for Release",
            "Pending Payment",
            "Pending Documents",
            "Completed",
          ][i % 5];
        return {
          id: `DO-DEMO-${i + 1}`,
          ...sc,
          doNo: `DO-CHN-IMP-26${String(i + 1).padStart(4, "0")}`,
          doDate: `2026-08-${String(10 + i).padStart(2, "0")}`,
          jobNo: `IMP-CHN-2026-${String(101 + i).padStart(4, "0")}`,
          hblNo: `HBL-IMP-260${101 + i}`,
          mblNo: `MBL-IMP-260${101 + i}`,
          consignee: [
            "ABC Imports Pvt Ltd",
            "Meridian Auto Parts",
            "Blue Nile Foods LLC",
            "Eastern Engineering Co",
          ][i % 4],
          notifyParty: "Notify Logistics India",
          shippingLine: ["Maersk", "MSC", "CMA CGM", "ONE"][i % 4],
          vessel: ["MAERSK HANOI", "MSC MAYA", "CMA CGM TITAN", "ONE HARMONY"][
            i % 4
          ],
          voyage: `${220 + i}W`,
          pol: ["Singapore", "Jebel Ali", "Colombo"][i % 3],
          pod: "Chennai",
          arrivalDate: arrival,
          validUntil: dateAdd(arrival, free + 5),
          status,
          shipper: "Overseas Export Trading LLC",
          packages: 80 + i * 10,
          weight: 12500 + i * 650,
          cbm: 32 + i * 1.4,
          commodity: [
            "Machinery Parts",
            "Food Products",
            "Chemicals",
            "Textiles",
          ][i % 4],
          freightTerms: i % 2 ? "Collect" : "Prepaid",
          containers: [
            {
              id: c.id,
              containerNo: c.containerNo,
              type: c.containerType || c.type,
              seal: c.sealNo || `SL${9000 + i}`,
              packages: 80 + i * 10,
              weight: 12500 + i * 650,
              dischargeDate: arrival,
              freeDays: free,
              freeDaysEnd: dateAdd(arrival, free),
              currentStatus: c.currentStatus || "Discharged",
              gateOutStatus: i % 5 === 4 ? "Gate Out" : "Pending",
            },
          ],
          charges: [
            { id: `DC-${i}`, description: "DO Charge", amount: 75 },
            { id: `DOC-${i}`, description: "Documentation", amount: 45 },
            { id: `HDL-${i}`, description: "Handling", amount: 125 },
          ],
          originalBlReceived: i % 2 === 0,
          surrenderStatus: i % 3 ? "Confirmed" : "Pending",
          indemnityStatus: i % 4 === 0 ? "Approved" : "Not Required",
          invoiceStatus: i % 4 ? "Issued" : "Pending",
          paymentStatus: [
            "Cleared",
            "Cleared",
            "Pending",
            "Cleared",
            "Cleared",
          ][i % 5],
          customsStatus: i % 3 ? "Cleared" : "Pending",
          holdStatus: i % 4 === 3 ? "Active" : "None",
          holdReason: i % 4 === 3 ? "Customs document verification" : "",
          releaseReference:
            status === "Released" || status === "Completed"
              ? `REL-26${900 + i}`
              : "",
          terminal: "Chennai Container Terminal",
          deliveryLocation: "Chennai ICD",
          remarks: "Demo Delivery Order",
          activity: [
            {
              date: `2026-08-${String(10 + i).padStart(2, "0")} 10:30`,
              event: "Delivery Order created",
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }),
    ];
  let gates = read(GATE_OUT_KEY);
  if (!gates.some(scoped))
    gates = [
      ...gates,
      ...Array.from({ length: 12 }, (_, i) => {
        const d = dos.filter(scoped)[i % 10],
          c = d.containers[0];
        return {
          id: `GO-DEMO-${i + 1}`,
          ...sc,
          gateOutNo: `GO-CHN-IMP-26${String(i + 1).padStart(4, "0")}`,
          date: `2026-08-${String(12 + (i % 8)).padStart(2, "0")}`,
          time: `${String(9 + (i % 8)).padStart(2, "0")}:30`,
          deliveryOrder: d.doNo,
          jobNo: d.jobNo,
          blNo: d.hblNo,
          containerNo: c.containerNo,
          containerType: c.type,
          sealNo: c.seal,
          consignee: d.consignee,
          terminal: d.terminal,
          fromLocation: "Chennai Terminal",
          destination: d.deliveryLocation,
          transporter: [
            "ABC Container Transport",
            "South India Logistics",
            "Express Haulage",
          ][i % 3],
          truckNo: `TN-01-AB-${String(4100 + i)}`,
          driver: `Demo Driver ${i + 1}`,
          gatePassNo: `GP-26${700 + i}`,
          releaseReference: d.releaseReference || `REL-26${900 + i}`,
          condition: "Good",
          remarks: "Import delivery gate out",
        status: i < 4 ? "Completed" : "Draft",
          updatedAt: new Date().toISOString(),
        };
      }),
    ];
  write(INDEMNITY_KEY, inds);
  write(DO_KEY, dos);
  write(GATE_OUT_KEY, gates);
}
function load() {
  seed();
  deliveryOrders.value = read(DO_KEY);
  indemnities.value = read(INDEMNITY_KEY);
  gateOuts.value = read(GATE_OUT_KEY);
  auditTrail.value = read(AUDIT_KEY);
}
function save(key, source, item) {
  const all = read(key),
    data = { ...scope(), ...item },
    i = all.findIndex((x) => x.id === data.id && scoped(x));
  i >= 0 ? all.splice(i, 1, data) : all.unshift(data);
  write(key, all);
  source.value = all;
}
function remove(key, source, id) {
  const all = read(key).filter((x) => !(x.id === id && scoped(x)));
  write(key, all);
  source.value = all;
}
function audit(
  module,
  document,
  action,
  previousStatus,
  newStatus,
  remarks = ""
) {
  const row = {
    id: `AUD-${Date.now()}-${Math.random()}`,
    ...scope(),
    dateTime: new Date().toISOString(),
    module,
    document,
    action,
    previousStatus,
    newStatus,
    user: "Demo Import User",
    remarks,
  };
  const all = read(AUDIT_KEY);
  all.unshift(row);
  write(AUDIT_KEY, all);
  auditTrail.value = all;
}
export function useNvoccImportDelivery() {
  load();
  return {
    deliveryOrders: computed(() => deliveryOrders.value.filter(scoped)),
    indemnities: computed(() => indemnities.value.filter(scoped)),
    gateOuts: computed(() => gateOuts.value.filter(scoped)),
    auditTrail: computed(() => auditTrail.value.filter(scoped)),
    saveDeliveryOrder: (x) => save(DO_KEY, deliveryOrders, x),
    saveIndemnity: (x) => save(INDEMNITY_KEY, indemnities, x),
    saveGateOut: (x) => save(GATE_OUT_KEY, gateOuts, x),
    removeDeliveryOrder: (id) => remove(DO_KEY, deliveryOrders, id),
    removeIndemnity: (id) => remove(INDEMNITY_KEY, indemnities, id),
    removeGateOut: (id) => remove(GATE_OUT_KEY, gateOuts, id),
    audit,
    scope,
    dateAdd,
    refresh: load,
  };
}
