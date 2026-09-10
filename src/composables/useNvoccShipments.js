import { computed, ref } from "vue";

export const SRR_KEY = "cnplus_nvocc_special_rate_requests";
export const BOOKING_KEY = "cnplus_nvocc_bookings";
export const JOB_KEY = "cnplus_nvocc_jobs";
export const HBL_KEY = "cnplus_nvocc_hbl";
export const MBL_KEY = "cnplus_nvocc_master_bl";

const bookings = ref([]),
  jobs = ref([]),
  mbls = ref([]),
  srrs = ref([]);
let loadedScope = "";
const clone = (v) => JSON.parse(JSON.stringify(v));
const read = (key) => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(v) ? v : [];
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
const inScope = (r) =>
  (!r.companyId || r.companyId === scope().companyId) &&
  (!r.branchId || r.branchId === scope().branchId);

function seed() {
  const sc = scope();
  const bookingSeed = [
    {
      id: "BKG1",
      ...sc,
      bookingNo: "BKG-CHN-2026-0101",
      bookingDate: "2026-08-12",
      srrNo: "SRR-CHN-2026-0001",
      customer: "ABC Imports Pvt Ltd",
      shipper: "Oceanic Exports",
      consignee: "ABC Imports LLC",
      notifyParty: "ABC Logistics",
      shipmentType: "FCL",
      trade: "Export",
      origin: "Chennai",
      pol: "Chennai",
      pod: "Jebel Ali",
      destination: "Dubai",
      shippingLine: "Maersk",
      vessel: "MAERSK HANOI",
      voyage: "328E",
      etd: "2026-08-24",
      eta: "2026-09-02",
      commodity: "Textiles",
      packages: 120,
      weight: 18400,
      cbm: 54.6,
      containerType: "40HC",
      quantity: 1,
      currency: "USD",
      rate: 1100,
      freeDays: 10,
      status: "Confirmed",
      jobCreated: true,
      remarks: "Urgent customer shipment",
      equipment: [{ id: "EQ1", type: "40HC", qty: 1, weight: 18400 }],
      charges: [
        {
          id: "CH1",
          description: "Ocean Freight",
          currency: "USD",
          amount: 1100,
        },
      ],
      documents: [{ name: "Customer Request", status: "Received" }],
      activity: [{ date: "2026-08-12 10:00", event: "Booking confirmed" }],
    },
    {
      id: "BKG2",
      ...sc,
      bookingNo: "BKG-MUN-2026-0102",
      bookingDate: "2026-08-14",
      srrNo: "SRR-MUN-2026-0002",
      customer: "Zenith Textiles Ltd",
      shipper: "Zenith Textiles Ltd",
      consignee: "Euro Trade BV",
      notifyParty: "Euro Trade BV",
      shipmentType: "FCL",
      trade: "Export",
      origin: "Ahmedabad",
      pol: "Mundra",
      pod: "Rotterdam",
      destination: "Rotterdam",
      shippingLine: "MSC",
      vessel: "MSC MAYA",
      voyage: "221W",
      etd: "2026-08-28",
      eta: "2026-09-18",
      commodity: "Garments",
      packages: 220,
      weight: 21200,
      cbm: 62,
      containerType: "40HC",
      quantity: 1,
      currency: "USD",
      rate: 1450,
      freeDays: 7,
      status: "Approved",
      jobCreated: false,
      remarks: "",
      equipment: [{ id: "EQ2", type: "40HC", qty: 1, weight: 21200 }],
      charges: [],
      documents: [],
      activity: [],
    },
  ];
  const jobSeed = [
    {
      id: "JOB1",
      ...sc,
      jobNo: "NVC-CHN-2026-0101",
      jobDate: "2026-08-13",
      bookingNo: "BKG-CHN-2026-0101",
      customer: "ABC Imports Pvt Ltd",
      shipmentType: "FCL",
      trade: "Export",
      shipper: "Oceanic Exports",
      consignee: "ABC Imports LLC",
      notifyParty: "ABC Logistics",
      agent: "Gulf Agency",
      shippingLine: "Maersk",
      origin: "Chennai",
      pol: "Chennai",
      pod: "Jebel Ali",
      destination: "Dubai",
      vessel: "MAERSK HANOI",
      voyage: "328E",
      etd: "2026-08-24",
      eta: "2026-09-02",
      commodity: "Textiles",
      packages: 120,
      weight: 18400,
      cbm: 54.6,
      status: "Operational",
      blStatus: "Draft",
      crtStatus: "Open",
      containers: [
        {
          id: "C1",
          containerNo: "MSCU1234567",
          type: "40HC",
          seal: "SL90812",
          packages: 120,
          grossWeight: 18400,
          cbm: 54.6,
          status: "Gate In",
        },
      ],
      documents: {
        si: true,
        vgm: true,
        hbl: true,
        mbl: false,
        manifest: false,
        sob: false,
        release: false,
        surrender: false,
      },
      tracking: [],
      activity: [
        { date: "2026-08-13 11:20", event: "Job created from booking" },
      ],
    },
  ];
  bookingSeed.push(
    { ...clone(bookingSeed[0]), id: "BKG3", bookingNo: "BKG-NSA-2026-0103", bookingDate: "2026-08-16", srrNo: "SRR-NSA-2026-0003", customer: "Meridian Auto Parts", shipper: "Meridian Auto Parts", consignee: "Lion City Motors Pte Ltd", pol: "Nhava Sheva", pod: "Singapore", destination: "Singapore", shippingLine: "ONE", vessel: "ONE HARMONY", voyage: "116E", etd: "2026-08-30", eta: "2026-09-10", commodity: "Automotive Components", packages: 86, weight: 16250, cbm: 42.8, containerType: "40GP", rate: 980, status: "Submitted", jobCreated: false },
    { ...clone(bookingSeed[0]), id: "BKG4", bookingNo: "BKG-COK-2026-0104", bookingDate: "2026-08-18", srrNo: "SRR-COK-2026-0004", customer: "Coastal Spice Traders", shipper: "Coastal Spice Traders", consignee: "Blue Nile Foods LLC", pol: "Kochi", pod: "Colombo", destination: "Colombo", shippingLine: "CMA CGM", vessel: "CMA CGM TITAN", voyage: "042W", etd: "2026-08-26", eta: "2026-08-29", commodity: "Processed Spices", packages: 340, weight: 19800, cbm: 48.2, containerType: "20GP", quantity: 2, rate: 760, status: "Confirmed", jobCreated: true },
    { ...clone(bookingSeed[0]), id: "BKG5", bookingNo: "BKG-TUT-2026-0105", bookingDate: "2026-08-20", srrNo: "SRR-TUT-2026-0005", customer: "Eastern Engineering Co", shipper: "Eastern Engineering Co", consignee: "Gulf Industrial Supplies", pol: "Tuticorin", pod: "Jebel Ali", destination: "Dubai", shippingLine: "Maersk", vessel: "MAERSK SENTOSA", voyage: "331E", etd: "2026-09-02", eta: "2026-09-11", commodity: "Engineering Goods", packages: 64, weight: 22750, cbm: 58.4, containerType: "40HC", rate: 1280, status: "Draft", jobCreated: false }
  );
  jobSeed.push(
    { ...clone(jobSeed[0]), id: "JOB2", jobNo: "NVC-COK-2026-0104", jobDate: "2026-08-19", bookingNo: "BKG-COK-2026-0104", customer: "Coastal Spice Traders", shipper: "Coastal Spice Traders", consignee: "Blue Nile Foods LLC", shippingLine: "CMA CGM", pol: "Kochi", pod: "Colombo", destination: "Colombo", vessel: "CMA CGM TITAN", voyage: "042W", etd: "2026-08-26", eta: "2026-08-29", commodity: "Processed Spices", packages: 340, weight: 19800, cbm: 48.2, status: "Ready to Sail", blStatus: "Approved", crtStatus: "Completed", containers: [{ id: "C2", containerNo: "CMAU7654321", type: "20GP", seal: "SL90813", packages: 170, grossWeight: 9900, cbm: 24.1, status: "Gate In" }, { id: "C3", containerNo: "CMAU7654399", type: "20GP", seal: "SL90814", packages: 170, grossWeight: 9900, cbm: 24.1, status: "Gate In" }] },
    { ...clone(jobSeed[0]), id: "JOB3", jobNo: "NVC-MUN-2026-0102", jobDate: "2026-08-15", bookingNo: "BKG-MUN-2026-0102", customer: "Zenith Textiles Ltd", shipper: "Zenith Textiles Ltd", consignee: "Euro Trade BV", shippingLine: "MSC", pol: "Mundra", pod: "Rotterdam", destination: "Rotterdam", vessel: "MSC MAYA", voyage: "221W", etd: "2026-08-28", eta: "2026-09-18", commodity: "Garments", packages: 220, weight: 21200, cbm: 62, status: "Documentation Pending", blStatus: "Draft", crtStatus: "Open", containers: [{ id: "C4", containerNo: "TGHU8823410", type: "40HC", seal: "SL90815", packages: 220, grossWeight: 21200, cbm: 62, status: "Allocated" }] }
  );
  const mblSeed = [
    {
      id: "MBL1",
      ...sc,
      mblNo: "MBL-CHN-260801",
      blDate: "2026-08-19",
      jobNo: "NVC-CHN-2026-0101",
      bookingNo: "BKG-CHN-2026-0101",
      carrier: "Maersk",
      shippingLine: "Maersk",
      carrierBookingRef: "MAEU-908112",
      vessel: "MAERSK HANOI",
      voyage: "328E",
      freightTerms: "Prepaid",
      blType: "Original",
      status: "Draft",
      shipper: "Oceanic Exports",
      consignee: "ABC Imports LLC",
      notifyParty: "ABC Logistics",
      agent: "Gulf Agency",
      placeOfReceipt: "Chennai",
      pol: "Chennai",
      pod: "Jebel Ali",
      placeOfDelivery: "Dubai",
      finalDestination: "Dubai",
      packages: 120,
      weight: 18400,
      cbm: 54.6,
      commodity: "Textiles",
      containers: clone(jobSeed[0].containers),
      hbls: [
        {
          id: "H1",
          hblNo: "HBL-CHN-260801",
          jobNo: "NVC-CHN-2026-0101",
          shipper: "Oceanic Exports",
          consignee: "ABC Imports LLC",
          containers: "MSCU1234567",
          packages: 120,
          weight: 18400,
          status: "Draft",
        },
      ],
      remarks: "",
      activity: [],
    },
  ];
  const mergeSeed = (key, seedRows) => {
    const current = read(key);
    const exists = (seedRow) => current.some((row) =>
      row.id === seedRow.id && inScope(row)
    );
    write(key, [...current, ...seedRows.filter((row) => !exists(row))]);
  };
  mergeSeed(BOOKING_KEY, bookingSeed);
  mergeSeed(JOB_KEY, jobSeed);
  mergeSeed(MBL_KEY, mblSeed);
}
function load() {
  const currentScope = `${scope().companyId}:${scope().branchId}`;
  if (loadedScope !== currentScope) {
    seed();
    loadedScope = currentScope;
  }
  bookings.value = read(BOOKING_KEY);
  jobs.value = read(JOB_KEY);
  mbls.value = read(MBL_KEY);
  srrs.value = read(SRR_KEY);
}
function saveCollection(key, source, item) {
  const all = read(key),
    data = { ...scope(), ...clone(item) },
    i = all.findIndex((x) => x.id === data.id && inScope(x));
  i >= 0 ? all.splice(i, 1, data) : all.unshift(data);
  write(key, all);
  source.value = all;
}
function removeCollection(key, source, id) {
  const all = read(key).filter((x) => !(x.id === id && inScope(x)));
  write(key, all);
  source.value = all;
}
export function useNvoccShipments() {
  load();
  return {
    bookings: computed(() => bookings.value.filter(inScope)),
    jobs: computed(() => jobs.value.filter(inScope)),
    mbls: computed(() => mbls.value.filter(inScope)),
    approvedSrrs: computed(() =>
      srrs.value.filter((x) => inScope(x) && x.status === "Approved")
    ),
    saveBooking: (x) => saveCollection(BOOKING_KEY, bookings, x),
    saveJob: (x) => saveCollection(JOB_KEY, jobs, x),
    saveMbl: (x) => saveCollection(MBL_KEY, mbls, x),
    removeBooking: (id) => removeCollection(BOOKING_KEY, bookings, id),
    removeJob: (id) => removeCollection(JOB_KEY, jobs, id),
    removeMbl: (id) => removeCollection(MBL_KEY, mbls, id),
    refresh: load,
    scope,
  };
}
