// Trip module's mock "backend" — kept in its own plain JS module (not a
// .vue file) so every Trip-family page (DMSTrip.vue, DMSTripView.vue,
// DMSTripStockTransfer.vue, DMSTripPosting.vue,
// DMSTripListPendingForUnload.vue, DMSTripRegisterTransporterWise.vue,
// DMSBookingListTripWise.vue) imports the same store directly instead of
// through another page component.
//
// Backed by localStorage (not just an in-memory array) so add/edit/delete
// actually persist across reloads within this browser, like a real
// database, until a real Trip API exists — flip callers over to
// apiService.js at that point and this file can go away.

const STORAGE_KEY = "cn_trip_mock_db_v1";
const AVAILABLE_BOOKINGS_KEY = "cn_trip_available_bookings_v1";

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

const SEED_TRIPS = [
  {
    TripId: 1,
    TripNo: "TRKG2604007",
    TripDate: "01-04-2026",
    TripStartTime: "04:30 PM",
    TripEndDate: "02-04-2026",
    TripType: "Outward",
    Status: "Unloaded",
    Carrier: "own",
    FromCity: "Rajkot-G",
    ToCity: "Vasai",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Vasai Eagle",
    Transporter: "Eagle Tradelinks Pvt Ltd",
    Vehicle: "GJ3BW0003",
    VehicleNo: "GJ3BW0003",
    AdvanceAmount: 0,
    Weight: 0,
    Driver: "Mahendra Singh Jadeja",
    Remarks: "",
    Quantity: 46,
    IsStockTransferTrip: false,
    Posted: true,
    OtherDetails: { InsuranceNo: "", EwayBillRefNo: "", SpecialInstructions: "" },
    Bookings: [
      { BookingTranId: 1, Load: true, Status: "Delivered", BookingNo: "RKG21032654", Date: "30-03-2026", Carrier: "own", LoadCarrier: "own", Payment: "Paid", ToCity: "Vasai", Consignee: "Biba Apparels Pvt Ltd", FromCity: "Rajkot-G", Consignor: "KUDOS HARDWARE SOL" },
      { BookingTranId: 2, Load: true, Status: "Delivered", BookingNo: "MTD21030687", Date: "30-03-2026", Carrier: "own", LoadCarrier: "Truck", Payment: "TBBR", ToCity: "Vasai", Consignee: "Liberty Valves Pvt Ltd", FromCity: "Metoda", Consignor: "Mechseal Valve Pvt Ltd" },
      { BookingTranId: 3, Load: true, Status: "Delivered", BookingNo: "RKS21031011", Date: "30-03-2026", Carrier: "own", LoadCarrier: "Truck", Payment: "TBBS", ToCity: "Vasai", Consignee: "GAJANAN PRECISION INDUSTRI...", FromCity: "Rajkot-5", Consignor: "Micro Melt Pvt Ltd" },
    ],
  },
  {
    TripId: 2,
    TripNo: "TRKG2604008",
    TripDate: "01-04-2026",
    TripStartTime: "04:30 PM",
    TripEndDate: "02-04-2026",
    TripType: "Outward",
    Status: "Unloaded",
    Carrier: "Truck",
    FromCity: "Rajkot-G",
    ToCity: "Chakan",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Chakan",
    Transporter: "Eagle Tradelinks Pvt Ltd",
    Vehicle: "TRUCK",
    VehicleNo: "TRUCK",
    AdvanceAmount: 0,
    Weight: 0,
    Driver: "",
    Remarks: "",
    Quantity: 39,
    IsStockTransferTrip: false,
    Posted: false,
    OtherDetails: { InsuranceNo: "", EwayBillRefNo: "", SpecialInstructions: "" },
    Bookings: [],
  },
  {
    TripId: 3,
    TripNo: "TRKG2604013",
    TripDate: "01-04-2026",
    TripStartTime: "08:17 PM",
    TripEndDate: "03-04-2026",
    TripType: "Outward",
    Status: "Unloaded",
    Carrier: "Truck",
    FromCity: "Rajkot-G",
    ToCity: "Chakan",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Chakan",
    Transporter: "New Vishal Roadlines",
    Vehicle: "GJ03BV7545",
    VehicleNo: "GJ03BV7545",
    AdvanceAmount: 0,
    Weight: 0,
    Driver: "",
    Remarks: "",
    Quantity: 509,
    IsStockTransferTrip: false,
    Posted: false,
    OtherDetails: { InsuranceNo: "", EwayBillRefNo: "", SpecialInstructions: "" },
    Bookings: [],
  },
  {
    TripId: 4,
    TripNo: "TRKG2604014",
    TripDate: "01-04-2026",
    TripStartTime: "08:30 PM",
    TripEndDate: "",
    TripType: "Outward",
    Status: "Loaded",
    Carrier: "own",
    FromCity: "Rajkot-G",
    ToCity: "Vapi",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Vapi",
    Transporter: "Eagle Tradelinks Pvt Ltd",
    Vehicle: "GJ 03BV 6768",
    VehicleNo: "GJ03BV6768",
    AdvanceAmount: 0,
    Weight: 0,
    Driver: "",
    Remarks: "",
    Quantity: 2,
    IsStockTransferTrip: false,
    Posted: false,
    OtherDetails: { InsuranceNo: "", EwayBillRefNo: "", SpecialInstructions: "" },
    Bookings: [],
  },
  {
    TripId: 5,
    TripNo: "TRKG2604001",
    TripDate: "01-04-2026",
    TripStartTime: "02:00 PM",
    TripEndDate: "02-04-2026",
    TripType: "Outward",
    Status: "Unloaded",
    Carrier: "own",
    FromCity: "Rajkot-G",
    ToCity: "Nasik",
    FromBookingOffice: "Greenland",
    ToBookingOffice: "Nasik",
    Transporter: "Eagle Tradelinks Pvt Ltd",
    Vehicle: "GJ03BW2345",
    VehicleNo: "GJ03BW2345",
    AdvanceAmount: 0,
    Weight: 0,
    Driver: "",
    Remarks: "",
    Quantity: 201,
    IsStockTransferTrip: false,
    Posted: false,
    OtherDetails: { InsuranceNo: "", EwayBillRefNo: "", SpecialInstructions: "" },
    Bookings: [],
  },
];

// Pool of pending bookings not yet attached to a trip — the source list for
// the Modify-mode "Fill Booking" dialog. Consumed (removed) as bookings get
// added to a trip, same as a real "unassigned bookings" query would shrink.
const SEED_AVAILABLE_BOOKINGS = [
  { BookingId: 101, BookingNo: "JAM21031226", Date: "30-03-2026", Carrier: "own", LoadCarrier: "Truck", Payment: "ToPay", FromCity: "Jamnagar", ToCity: "Vasai", Consignee: "Gator Systems Pvt Ltd", Consignor: "Mahavir Metals" },
  { BookingId: 102, BookingNo: "MTD21030692", Date: "31-03-2026", Carrier: "own", LoadCarrier: "Truck", Payment: "ToPay", FromCity: "Metoda", ToCity: "Vasai", Consignee: "Nishaka Pneumatics", Consignor: "Universal Technocast" },
  { BookingId: 103, BookingNo: "RKT21031749", Date: "31-03-2026", Carrier: "own", LoadCarrier: "Truck", Payment: "ToPay", FromCity: "Rajkot", ToCity: "Vasai", Consignee: "Bagadia Industrial Fasteners", Consignor: "Jay Khodiyar Industries" },
  { BookingId: 104, BookingNo: "RKT21040003", Date: "01-04-2026", Carrier: "own", LoadCarrier: "Truck", Payment: "ToPay", FromCity: "Rajkot", ToCity: "Vasai", Consignee: "Royal Enterprises", Consignor: "Sagar Metal Industries" },
];

let MOCK_TRIPS = readStorage(STORAGE_KEY, null);
if (!Array.isArray(MOCK_TRIPS) || !MOCK_TRIPS.length) {
  MOCK_TRIPS = SEED_TRIPS.map((t) => ({ ...t, Bookings: t.Bookings.map((b) => ({ ...b })) }));
  writeStorage(STORAGE_KEY, MOCK_TRIPS);
}

let MOCK_AVAILABLE_BOOKINGS = readStorage(AVAILABLE_BOOKINGS_KEY, null);
if (!Array.isArray(MOCK_AVAILABLE_BOOKINGS)) {
  MOCK_AVAILABLE_BOOKINGS = SEED_AVAILABLE_BOOKINGS.map((b) => ({ ...b }));
  writeStorage(AVAILABLE_BOOKINGS_KEY, MOCK_AVAILABLE_BOOKINGS);
}

function persistTrips() {
  writeStorage(STORAGE_KEY, MOCK_TRIPS);
}

function persistAvailableBookings() {
  writeStorage(AVAILABLE_BOOKINGS_KEY, MOCK_AVAILABLE_BOOKINGS);
}

// Dropdown option lists shared by every Trip-family form/filter.
export const MOCK_DATA = {
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
    "Boriwali",
  ],
  bookingOffices: [
    "Greenland",
    "Chakan",
    "Nasik",
    "Hyderabad",
    "Pune",
    "Vasai Eagle",
    "Mumbai",
    "Rajkot-G",
    "Bangalore",
    "Vapi",
  ],
  transporters: [
    "Eagle Tradelinks Pvt Ltd",
    "New Vishal Roadlines",
    "Vishal Roadlines",
    "Balaji Transport Co.",
    "Speedway Logistics",
  ],
  vehicles: ["GJ3BW0003", "GJ03BV7545", "GJ03BV6768", "GJ03BW2345", "GJ03AT2203", "TRUCK"],
  drivers: ["Mahendra Singh Jadeja", "Ramesh Patel", "Suresh Yadav", "Manoj Kumar"],
};

export function apiGetTrips(tripType, searchBy, searchText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_TRIPS];
      if (tripType && tripType !== "All")
        result = result.filter((t) => t.TripType === tripType);
      if (searchText) {
        const s = searchText.toLowerCase();
        result = result.filter((t) => {
          if (searchBy === "Vehicle No")
            return (t.VehicleNo || "").toLowerCase().includes(s);
          if (searchBy === "Booking No")
            return (t.Bookings || []).some((b) =>
              b.BookingNo.toLowerCase().includes(s)
            );
          if (searchBy === "Trip No") return t.TripNo.toLowerCase().includes(s);
          // No field picker in the toolbar (matches the Booking-family
          // pattern, DMSTrip.vue passes searchBy=null) — search across the
          // common fields at once instead of requiring one to be chosen.
          return (
            t.TripNo.toLowerCase().includes(s) ||
            (t.VehicleNo || "").toLowerCase().includes(s) ||
            (t.FromCity || "").toLowerCase().includes(s) ||
            (t.ToCity || "").toLowerCase().includes(s) ||
            (t.Transporter || "").toLowerCase().includes(s)
          );
        });
      }
      resolve(result);
    }, 150);
  });
}

export function apiGetTripById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_TRIPS.find((t) => t.TripId === id) || null),
      100
    );
  });
}

export function apiSaveTrip(trip) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (trip.TripId) {
        const idx = MOCK_TRIPS.findIndex((t) => t.TripId === trip.TripId);
        if (idx !== -1) MOCK_TRIPS[idx] = { ...trip };
      } else {
        trip.TripId = Math.max(0, ...MOCK_TRIPS.map((t) => t.TripId)) + 1;
        trip.TripNo = "TRKG" + String(2604000 + trip.TripId);
        trip.Status = trip.Status || "Loaded";
        trip.Posted = false;
        MOCK_TRIPS.push(trip);
      }
      persistTrips();
      resolve({ success: true, data: trip });
    }, 250);
  });
}

export function apiDeleteTrip(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_TRIPS.findIndex((t) => t.TripId === id);
      if (idx !== -1) MOCK_TRIPS.splice(idx, 1);
      persistTrips();
      resolve({ success: true });
    }, 150);
  });
}

// Used by DMSTripListPendingForUnload.vue ("Mark Unloaded") and any other
// Trip-family page that only needs to flip a trip's Status.
export function apiUpdateTripStatus(id, status, extra = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trip = MOCK_TRIPS.find((t) => t.TripId === id);
      if (trip) {
        Object.assign(trip, { Status: status, ...extra });
        persistTrips();
      }
      resolve({ success: !!trip, data: trip });
    }, 200);
  });
}

// Used by DMSTrip.vue's own "Update Vehicle / Carrier" quick-action dialog
// to merge a few fields into a trip without touching its Status.
export function apiUpdateTripFields(id, fields) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trip = MOCK_TRIPS.find((t) => t.TripId === id);
      if (trip) {
        Object.assign(trip, fields);
        persistTrips();
      }
      resolve({ success: !!trip, data: trip });
    }, 200);
  });
}

// Used by DMSTripPosting.vue to flip a trip's accounting-posted flag.
export function apiSetTripPosted(id, posted) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trip = MOCK_TRIPS.find((t) => t.TripId === id);
      if (trip) {
        trip.Posted = posted;
        persistTrips();
      }
      resolve({ success: !!trip, data: trip });
    }, 200);
  });
}

// Pending bookings pool for Modify-mode's "Fill Booking" dialog — bookings
// matching the trip's From/To city that aren't yet loaded on any trip.
export function apiGetAvailableBookings(fromCity, toCity) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_AVAILABLE_BOOKINGS];
      if (fromCity)
        result = result.filter((b) =>
          b.FromCity.toLowerCase().includes(fromCity.toLowerCase().split("-")[0])
        );
      if (toCity)
        result = result.filter((b) =>
          b.ToCity.toLowerCase().includes(toCity.toLowerCase().split("-")[0])
        );
      resolve(result);
    }, 150);
  });
}

// Removes bookings from the pending pool once a "Fill Booking" add has
// actually been saved onto a trip, so they stay unassigned-only across
// reloads too (not just for the current session).
export function apiConsumeAvailableBookings(bookingIds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_AVAILABLE_BOOKINGS = MOCK_AVAILABLE_BOOKINGS.filter(
        (b) => !bookingIds.includes(b.BookingId)
      );
      persistAvailableBookings();
      resolve({ success: true });
    }, 100);
  });
}
