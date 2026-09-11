// Delivery module's mock "backend" — same pattern as src/data/tripData.js
// (its own plain JS module, localStorage-backed so add/edit/delete persist
// like a real DB). Field shapes are modeled directly on the real
// EagleParcel-API entities (C:\Cargonet-prototype\EagleParcel-API):
//   - EagleParcel.Common\DTOs\PreDeliveryListDTO.cs   (the list screen's rows —
//     one row per booking awaiting/already given delivery)
//   - EagleParcel.ENT\Delivery\DEL_DeliveryENT.cs      (the Delivery record
//     captured by the Modify form once a booking is actually delivered)
//   - EagleParcel.ENT\Delivery\DEL_DoorDeliveryENT.cs  (the separate Door
//     Delivery sub-module)
// and the same business rules DeliveryService.cs enforces server-side
// (ReceivedAmount can't exceed ReceivableAmount, VehicleAmount can't exceed
// ReceivableAmount) are re-checked here too.

const BOOKINGS_KEY = "cn_delivery_bookings_v1";
const DELIVERIES_KEY = "cn_delivery_records_v1";
const DOOR_DELIVERIES_KEY = "cn_door_delivery_records_v1";
const DOOR_DELIVERY_RATES_KEY = "cn_door_delivery_rates_v1";
const DOOR_DELIVERY_INVOICES_KEY = "cn_door_delivery_invoices_v1";

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

// One row per booking eligible for delivery — mirrors PreDeliveryListDTO.
// DeliveryID null == Pending; once a Delivery record exists, DeliveryID/
// DeliveryDate/ReceiverName are filled in (same "joined" shape the real
// DEL_PreDelivery_SelectForDelivery stored proc returns).
const SEED_BOOKINGS = [
  {
    PreDeliveryID: 1,
    BookingID: 1001,
    BookingNo: "RKG21040011",
    BookingDate: "01-04-2026",
    FromPartyName: "Mayur Marketing",
    ToPartyName: "Rajsani Polymers",
    FromCity: "Bangalore",
    ToCity: "Rajkot-G",
    ItemName: "Drum",
    Qty: 8,
    Weight: 280,
    PaymentType: "Paid",
    NetAmount: 940.8,
    ReceivedAmount: null,
    EWayBillNo: "330284646503",
    IsCashCredit: false,
    DeliveryID: null,
    DeliveryDate: null,
    ReceiverName: null,
  },
  {
    PreDeliveryID: 2,
    BookingID: 1002,
    BookingNo: "RKG21040012",
    BookingDate: "01-04-2026",
    FromPartyName: "Bhavya Distributors",
    ToPartyName: "Varun Casting Co",
    FromCity: "Bangalore",
    ToCity: "Rajkot-G",
    ItemName: "Box",
    Qty: 12,
    Weight: 96,
    PaymentType: "ToPay",
    NetAmount: 1250,
    ReceivedAmount: null,
    EWayBillNo: "330284646510",
    IsCashCredit: false,
    DeliveryID: 5001,
    DeliveryDate: "02-04-2026",
    ReceiverName: "Rakesh Varun",
  },
  {
    PreDeliveryID: 3,
    BookingID: 1003,
    BookingNo: "RKG21040013",
    BookingDate: "02-04-2026",
    FromPartyName: "Krishna Engineering",
    ToPartyName: "Mahindra Heavy Engines Ltd",
    FromCity: "Pune",
    ToCity: "Hyderabad",
    ItemName: "Carton",
    Qty: 3,
    Weight: 40,
    PaymentType: "TBBS",
    NetAmount: 610,
    ReceivedAmount: null,
    EWayBillNo: "330284646522",
    IsCashCredit: false,
    DeliveryID: null,
    DeliveryDate: null,
    ReceiverName: null,
  },
  {
    PreDeliveryID: 4,
    BookingID: 1004,
    BookingNo: "RKG21040014",
    BookingDate: "03-04-2026",
    FromPartyName: "Amul Industries Pvt Ltd",
    ToPartyName: "Sumit Precision Fasteners",
    FromCity: "Chakan",
    ToCity: "Vasai",
    ItemName: "Pallet",
    Qty: 1,
    Weight: 620,
    PaymentType: "Paid",
    NetAmount: 3200,
    ReceivedAmount: 3200,
    EWayBillNo: "330284646535",
    IsCashCredit: false,
    DeliveryID: 5002,
    DeliveryDate: "03-04-2026",
    ReceiverName: "Suresh Fasteners",
  },
  {
    PreDeliveryID: 5,
    BookingID: 1005,
    BookingNo: "RKG21040015",
    BookingDate: "04-04-2026",
    FromPartyName: "Paras Exports",
    ToPartyName: "Carver Welding Pvt. Ltd",
    FromCity: "Rajkot-G",
    ToCity: "Bangalore",
    ItemName: "Drum",
    Qty: 5,
    Weight: 175,
    PaymentType: "Cash",
    NetAmount: 875,
    ReceivedAmount: null,
    EWayBillNo: "330284646548",
    IsCashCredit: true,
    DeliveryID: null,
    DeliveryDate: null,
    ReceiverName: null,
  },
];

const SEED_DELIVERIES = [
  {
    DeliveryID: 5001,
    DeliveryNo: "DEL20260001",
    DeliveryDate: "02-04-2026",
    BookingID: 1002,
    ReceiverName: "Rakesh Varun",
    ReceiverPhoneNo: "9876500012",
    IsItemDelivered: true,
    ReferenceNo: "",
    ReferenceDate: "",
    ReceivableAmount: 1250,
    Kasar: 0,
    ReceivedAmount: 0,
    IsPaymentReceived: false,
    ReceivedDate: "",
    PaymentMode: "",
    BankName: "",
    IsCashCredit: false,
    IsDoorDelivery: false,
    DoorDeliveryVehicle: "",
    DeliveredBy: "Ketan Solanki",
    Narration: "Left at reception, receiver unavailable for payment.",
  },
  {
    DeliveryID: 5002,
    DeliveryNo: "DEL20260002",
    DeliveryDate: "03-04-2026",
    BookingID: 1004,
    ReceiverName: "Suresh Fasteners",
    ReceiverPhoneNo: "9876500014",
    IsItemDelivered: true,
    ReferenceNo: "REF-1004",
    ReferenceDate: "03-04-2026",
    ReceivableAmount: 3200,
    Kasar: 0,
    ReceivedAmount: 3200,
    IsPaymentReceived: true,
    ReceivedDate: "03-04-2026",
    PaymentMode: "Cash",
    BankName: "",
    IsCashCredit: false,
    IsDoorDelivery: true,
    DoorDeliveryVehicle: "GJ3BW0003",
    DeliveredBy: "Mahendra Singh Jadeja",
    Narration: "",
  },
];

const SEED_DOOR_DELIVERIES = [
  {
    DoorDeliveryID: 1,
    DoorDeliveryNo: "DD20260001",
    DoorDeliveryDate: "03-04-2026",
    Vehicle: "GJ3BW0003",
    TransporterAccount: "Eagle Tradelinks Pvt Ltd",
    DoorDeliveryRate: "Standard",
    DoorDeliveryName: "Vasai Door Run",
    ReceivableAmount: 3200,
    VehicleAmount: 350,
    IsDoorCollection: false,
    RateType: "InvoiceWise",
    Remarks: "",
  },
];

// Door Delivery Rate master — a named rate card (per vehicle type/city) that
// "Door Delivery Rate" (menu) manages and "Door Delivery"/"Door Delivery
// Register" would pick from in the real app.
const SEED_DOOR_DELIVERY_RATES = [
  { RateID: 1, RateName: "Standard", VehicleType: "Own Vehicle", City: "Vasai", RateType: "InvoiceWise", RateAmount: 350, EffectiveDate: "01-04-2026" },
  { RateID: 2, RateName: "Truck Zone A", VehicleType: "Truck", City: "Chakan", RateType: "WeightWise", RateAmount: 2.5, EffectiveDate: "01-04-2026" },
  { RateID: 3, RateName: "Truck Zone B", VehicleType: "Truck", City: "Nasik", RateType: "Fixed", RateAmount: 500, EffectiveDate: "01-04-2026" },
];

// Door Delivery Invoice — one invoice per door delivery run, mirrors how
// "Door Delivery Invoice" bills the vehicle amount back to the transporter.
const SEED_DOOR_DELIVERY_INVOICES = [
  {
    InvoiceID: 1,
    InvoiceNo: "DDI20260001",
    InvoiceDate: "04-04-2026",
    DoorDeliveryID: 1,
    DoorDeliveryNo: "DD20260001",
    Transporter: "Eagle Tradelinks Pvt Ltd",
    Vehicle: "GJ3BW0003",
    Amount: 350,
    Status: "Unpaid",
  },
];

let MOCK_BOOKINGS = readStorage(BOOKINGS_KEY, null);
if (!Array.isArray(MOCK_BOOKINGS) || !MOCK_BOOKINGS.length) {
  MOCK_BOOKINGS = SEED_BOOKINGS.map((b) => ({ ...b }));
  writeStorage(BOOKINGS_KEY, MOCK_BOOKINGS);
}

let MOCK_DELIVERIES = readStorage(DELIVERIES_KEY, null);
if (!Array.isArray(MOCK_DELIVERIES)) {
  MOCK_DELIVERIES = SEED_DELIVERIES.map((d) => ({ ...d }));
  writeStorage(DELIVERIES_KEY, MOCK_DELIVERIES);
}

let MOCK_DOOR_DELIVERIES = readStorage(DOOR_DELIVERIES_KEY, null);
if (!Array.isArray(MOCK_DOOR_DELIVERIES)) {
  MOCK_DOOR_DELIVERIES = SEED_DOOR_DELIVERIES.map((d) => ({ ...d }));
  writeStorage(DOOR_DELIVERIES_KEY, MOCK_DOOR_DELIVERIES);
}

let MOCK_DOOR_DELIVERY_RATES = readStorage(DOOR_DELIVERY_RATES_KEY, null);
if (!Array.isArray(MOCK_DOOR_DELIVERY_RATES)) {
  MOCK_DOOR_DELIVERY_RATES = SEED_DOOR_DELIVERY_RATES.map((r) => ({ ...r }));
  writeStorage(DOOR_DELIVERY_RATES_KEY, MOCK_DOOR_DELIVERY_RATES);
}

let MOCK_DOOR_DELIVERY_INVOICES = readStorage(DOOR_DELIVERY_INVOICES_KEY, null);
if (!Array.isArray(MOCK_DOOR_DELIVERY_INVOICES)) {
  MOCK_DOOR_DELIVERY_INVOICES = SEED_DOOR_DELIVERY_INVOICES.map((i) => ({ ...i }));
  writeStorage(DOOR_DELIVERY_INVOICES_KEY, MOCK_DOOR_DELIVERY_INVOICES);
}

function persistBookings() {
  writeStorage(BOOKINGS_KEY, MOCK_BOOKINGS);
}
function persistDeliveries() {
  writeStorage(DELIVERIES_KEY, MOCK_DELIVERIES);
}
function persistDoorDeliveries() {
  writeStorage(DOOR_DELIVERIES_KEY, MOCK_DOOR_DELIVERIES);
}
function persistDoorDeliveryRates() {
  writeStorage(DOOR_DELIVERY_RATES_KEY, MOCK_DOOR_DELIVERY_RATES);
}
function persistDoorDeliveryInvoices() {
  writeStorage(DOOR_DELIVERY_INVOICES_KEY, MOCK_DOOR_DELIVERY_INVOICES);
}

export const MOCK_DATA = {
  paymentModes: ["Cash", "Cheque", "Online", "Bank Transfer"],
  vehicles: ["GJ3BW0003", "GJ03BV7545", "GJ03BV6768", "GJ03BW2345"],
  users: ["Ketan Solanki", "Mahendra Singh Jadeja", "Admin"],
  transporters: ["Eagle Tradelinks Pvt Ltd", "New Vishal Roadlines", "Vishal Roadlines"],
  rateTypes: ["InvoiceWise", "WeightWise", "Fixed"],
  cities: ["Rajkot-G", "Chakan", "Nasik", "Hyderabad", "Pune", "Mumbai", "Bangalore", "Vasai", "Vapi"],
  vehicleTypes: ["Own Vehicle", "Truck"],
};

// ── Pre-Delivery list — mirrors GET /api/Delivery/pre-delivery ────────────
export function apiGetPreDeliveryList(recordType = "All", search = "", searchField = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_BOOKINGS];
      if (recordType === "Pending") result = result.filter((b) => !b.DeliveryID);
      else if (recordType === "Delivered") result = result.filter((b) => !!b.DeliveryID);
      if (search) {
        const s = search.toLowerCase();
        result = result.filter((b) => {
          if (searchField === "Consignee") return (b.ToPartyName || "").toLowerCase().includes(s);
          if (searchField === "ReceiverName") return (b.ReceiverName || "").toLowerCase().includes(s);
          if (searchField === "BookingNo") return b.BookingNo.toLowerCase().includes(s);
          // No field picker in the toolbar (matches the Booking-family
          // pattern, DMSDelivery.vue passes searchField=null) — search
          // across the common fields at once instead of requiring one to
          // be chosen.
          return (
            b.BookingNo.toLowerCase().includes(s) ||
            (b.ToPartyName || "").toLowerCase().includes(s) ||
            (b.FromPartyName || "").toLowerCase().includes(s) ||
            (b.ReceiverName || "").toLowerCase().includes(s)
          );
        });
      }
      resolve(result);
    }, 150);
  });
}

export function apiGetBookingById(bookingId) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_BOOKINGS.find((b) => b.BookingID === bookingId) || null),
      100
    );
  });
}

// ── Delivery CRUD — mirrors GET/POST/PUT/DELETE /api/Delivery/{id} ────────
export function apiGetDeliveryById(id) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(MOCK_DELIVERIES.find((d) => d.DeliveryID === id) || null),
      100
    );
  });
}

// Same business rule DeliveryService.CreateDeliveryAsync enforces:
// ReceivedAmount cannot exceed ReceivableAmount.
export function apiSaveDelivery(delivery) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if ((parseFloat(delivery.ReceivedAmount) || 0) > (parseFloat(delivery.ReceivableAmount) || 0)) {
        reject(new Error("Received Amount cannot exceed Receivable Amount."));
        return;
      }
      if (delivery.DeliveryID) {
        const idx = MOCK_DELIVERIES.findIndex((d) => d.DeliveryID === delivery.DeliveryID);
        if (idx !== -1) MOCK_DELIVERIES[idx] = { ...delivery };
      } else {
        delivery.DeliveryID = Math.max(5000, ...MOCK_DELIVERIES.map((d) => d.DeliveryID)) + 1;
        delivery.DeliveryNo = "DEL2026" + String(delivery.DeliveryID).padStart(4, "0");
        MOCK_DELIVERIES.push(delivery);
      }
      persistDeliveries();

      // Keep the pre-delivery list's "joined" columns (DeliveryID/
      // DeliveryDate/ReceiverName) in sync, the way the real stored proc's
      // join would reflect it automatically.
      const booking = MOCK_BOOKINGS.find((b) => b.BookingID === delivery.BookingID);
      if (booking) {
        booking.DeliveryID = delivery.DeliveryID;
        booking.DeliveryDate = delivery.DeliveryDate;
        booking.ReceiverName = delivery.ReceiverName;
        booking.ReceivedAmount = delivery.ReceivedAmount;
        persistBookings();
      }

      resolve({ success: true, data: delivery });
    }, 250);
  });
}

export function apiDeleteDelivery(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const delivery = MOCK_DELIVERIES.find((d) => d.DeliveryID === id);
      const idx = MOCK_DELIVERIES.findIndex((d) => d.DeliveryID === id);
      if (idx !== -1) MOCK_DELIVERIES.splice(idx, 1);
      persistDeliveries();

      // Moves the booking back to "Pending" — same as the real
      // DeleteDeliveryAsync un-linking it from the pre-delivery list.
      if (delivery) {
        const booking = MOCK_BOOKINGS.find((b) => b.BookingID === delivery.BookingID);
        if (booking) {
          booking.DeliveryID = null;
          booking.DeliveryDate = null;
          booking.ReceiverName = null;
          booking.ReceivedAmount = null;
          persistBookings();
        }
      }
      resolve({ success: true });
    }, 150);
  });
}

// ── Door Delivery ───────────────────────────────────────────────────────
export function apiGetDoorDeliveries() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_DOOR_DELIVERIES]), 150);
  });
}

// Same business rule DeliveryService.CreateDoorDeliveryAsync enforces:
// VehicleAmount cannot exceed ReceivableAmount.
export function apiSaveDoorDelivery(entry) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if ((parseFloat(entry.VehicleAmount) || 0) > (parseFloat(entry.ReceivableAmount) || 0)) {
        reject(new Error("Vehicle Amount cannot exceed Receivable Amount."));
        return;
      }
      if (entry.DoorDeliveryID) {
        const idx = MOCK_DOOR_DELIVERIES.findIndex((d) => d.DoorDeliveryID === entry.DoorDeliveryID);
        if (idx !== -1) MOCK_DOOR_DELIVERIES[idx] = { ...entry };
      } else {
        entry.DoorDeliveryID = MOCK_DOOR_DELIVERIES.length
          ? Math.max(...MOCK_DOOR_DELIVERIES.map((d) => d.DoorDeliveryID)) + 1
          : 1;
        entry.DoorDeliveryNo = "DD2026" + String(entry.DoorDeliveryID).padStart(4, "0");
        MOCK_DOOR_DELIVERIES.push(entry);
      }
      persistDoorDeliveries();
      resolve({ success: true, data: entry });
    }, 200);
  });
}

export function apiDeleteDoorDelivery(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_DOOR_DELIVERIES.findIndex((d) => d.DoorDeliveryID === id);
      if (idx !== -1) MOCK_DOOR_DELIVERIES.splice(idx, 1);
      persistDoorDeliveries();
      resolve({ success: true });
    }, 150);
  });
}

// ── Delivery Register — every captured delivery, joined with its booking
// (Booking No/Consignor/Consignee/route) for "Delivery Register Screen" and
// its "(Party Copy)" print variant. ─────────────────────────────────────
export function apiGetDeliveryRegister(fromDate = "", toDate = "", search = "") {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = MOCK_DELIVERIES.map((d) => {
        const booking = MOCK_BOOKINGS.find((b) => b.BookingID === d.BookingID) || {};
        return {
          ...d,
          BookingNo: booking.BookingNo || "",
          FromPartyName: booking.FromPartyName || "",
          ToPartyName: booking.ToPartyName || "",
          FromCity: booking.FromCity || "",
          ToCity: booking.ToCity || "",
          NetAmount: booking.NetAmount || 0,
        };
      });
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (d) =>
            d.DeliveryNo.toLowerCase().includes(s) ||
            d.BookingNo.toLowerCase().includes(s) ||
            (d.ReceiverName || "").toLowerCase().includes(s) ||
            (d.ToPartyName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

// ── Delivery - Add Multiple — mark several Pending bookings delivered at
// once with one shared set of receiver/payment details. ─────────────────
export function apiBulkDeliver(bookingIds, sharedFields) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const created = [];
      bookingIds.forEach((bookingId) => {
        const booking = MOCK_BOOKINGS.find((b) => b.BookingID === bookingId);
        if (!booking || booking.DeliveryID) return; // already delivered, skip
        const deliveryId = Math.max(5000, ...MOCK_DELIVERIES.map((d) => d.DeliveryID)) + 1;
        const delivery = {
          DeliveryID: deliveryId,
          DeliveryNo: "DEL2026" + String(deliveryId).padStart(4, "0"),
          DeliveryDate: sharedFields.DeliveryDate,
          BookingID: bookingId,
          ReceiverName: sharedFields.ReceiverName,
          ReceiverPhoneNo: "",
          IsItemDelivered: true,
          ReferenceNo: "",
          ReferenceDate: "",
          ReceivableAmount: booking.NetAmount || 0,
          Kasar: 0,
          ReceivedAmount: 0,
          IsPaymentReceived: false,
          ReceivedDate: "",
          PaymentMode: sharedFields.PaymentMode || "",
          BankName: "",
          IsCashCredit: false,
          IsDoorDelivery: false,
          DoorDeliveryVehicle: "",
          DeliveredBy: sharedFields.DeliveredBy || "",
          Narration: sharedFields.Narration || "",
        };
        MOCK_DELIVERIES.push(delivery);
        booking.DeliveryID = deliveryId;
        booking.DeliveryDate = delivery.DeliveryDate;
        booking.ReceiverName = delivery.ReceiverName;
        created.push(delivery);
      });
      persistDeliveries();
      persistBookings();
      resolve({ success: true, count: created.length });
    }, 300);
  });
}

// ── Door Delivery Rate (master) ──────────────────────────────────────────
export function apiGetDoorDeliveryRates() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_DOOR_DELIVERY_RATES]), 150);
  });
}

export function apiSaveDoorDeliveryRate(rate) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (rate.RateID) {
        const idx = MOCK_DOOR_DELIVERY_RATES.findIndex((r) => r.RateID === rate.RateID);
        if (idx !== -1) MOCK_DOOR_DELIVERY_RATES[idx] = { ...rate };
      } else {
        rate.RateID = MOCK_DOOR_DELIVERY_RATES.length
          ? Math.max(...MOCK_DOOR_DELIVERY_RATES.map((r) => r.RateID)) + 1
          : 1;
        MOCK_DOOR_DELIVERY_RATES.push(rate);
      }
      persistDoorDeliveryRates();
      resolve({ success: true, data: rate });
    }, 200);
  });
}

export function apiDeleteDoorDeliveryRate(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_DOOR_DELIVERY_RATES.findIndex((r) => r.RateID === id);
      if (idx !== -1) MOCK_DOOR_DELIVERY_RATES.splice(idx, 1);
      persistDoorDeliveryRates();
      resolve({ success: true });
    }, 150);
  });
}

// ── Door Delivery Invoice ────────────────────────────────────────────────
export function apiGetDoorDeliveryInvoices() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_DOOR_DELIVERY_INVOICES]), 150);
  });
}

// Generates (or re-saves) the invoice for one door delivery run.
export function apiSaveDoorDeliveryInvoice(invoice) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (invoice.InvoiceID) {
        const idx = MOCK_DOOR_DELIVERY_INVOICES.findIndex((i) => i.InvoiceID === invoice.InvoiceID);
        if (idx !== -1) MOCK_DOOR_DELIVERY_INVOICES[idx] = { ...invoice };
      } else {
        invoice.InvoiceID = MOCK_DOOR_DELIVERY_INVOICES.length
          ? Math.max(...MOCK_DOOR_DELIVERY_INVOICES.map((i) => i.InvoiceID)) + 1
          : 1;
        invoice.InvoiceNo = "DDI2026" + String(invoice.InvoiceID).padStart(4, "0");
        MOCK_DOOR_DELIVERY_INVOICES.push(invoice);
      }
      persistDoorDeliveryInvoices();
      resolve({ success: true, data: invoice });
    }, 200);
  });
}

// Creates a new invoice from a door delivery run that doesn't have one yet.
export function apiGenerateInvoiceFromDoorDelivery(doorDeliveryId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dd = MOCK_DOOR_DELIVERIES.find((d) => d.DoorDeliveryID === doorDeliveryId);
      if (!dd) {
        reject(new Error("Door delivery not found."));
        return;
      }
      if (MOCK_DOOR_DELIVERY_INVOICES.some((i) => i.DoorDeliveryID === doorDeliveryId)) {
        reject(new Error("An invoice already exists for this door delivery."));
        return;
      }
      const invoiceId = MOCK_DOOR_DELIVERY_INVOICES.length
        ? Math.max(...MOCK_DOOR_DELIVERY_INVOICES.map((i) => i.InvoiceID)) + 1
        : 1;
      const invoice = {
        InvoiceID: invoiceId,
        InvoiceNo: "DDI2026" + String(invoiceId).padStart(4, "0"),
        InvoiceDate: dd.DoorDeliveryDate,
        DoorDeliveryID: dd.DoorDeliveryID,
        DoorDeliveryNo: dd.DoorDeliveryNo,
        Transporter: dd.TransporterAccount,
        Vehicle: dd.Vehicle,
        Amount: dd.VehicleAmount,
        Status: "Unpaid",
      };
      MOCK_DOOR_DELIVERY_INVOICES.push(invoice);
      persistDoorDeliveryInvoices();
      resolve({ success: true, data: invoice });
    }, 200);
  });
}
