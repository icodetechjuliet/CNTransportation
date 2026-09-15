// Shared Booking calculation helpers — freight, tax-type auto-detection,
// discount, kasar/received and net-amount rules, reworked to match the
// business logic of the legacy EagleParcel WinForms Booking Add/Edit form
// (Booking\BUK_Booking\BUK_BookingAddEdit.cs) instead of the flat
// `Rate * Weight` / manual-tax-toggle logic this page started with.
//
// This is a genuine exception to the DMS Booking-family "copy the
// markup/methods into every page" convention (see the
// dms-booking-page-pattern skill): that rule exists to stop page-shape
// drift, but financial calculation logic is exactly the kind of thing that
// must NOT drift between DMSBooking.vue's dialog, DMSBookingView.vue and
// DMSBookingForm.vue — so it lives here once and all three call it, while
// each page still keeps its own calcFreight()/calcTotal() *method* that
// just delegates into these pure functions.

import { apiGetMasterList } from "src/data/mastersData.js";

// ── Company GST state (for the CGST+SGST vs IGST decision) ────────────────
// The old app compares a party's GSTIN state code against the company's own
// *registered* GST state code (not the from/to city). We read it from the
// Company master (src/data/mastersData.js, entity "company") so it stays in
// sync with whatever a user configures there, with the seed company's GST
// state ("24" = Gujarat) as the fallback for a still-uninitialised store.
const COMPANY_MASTER_STORE_KEY = "cn_master_company";
const DEFAULT_COMPANY_GST_STATE_CODE = "24"; // Gujarat — matches the seed Company row's GSTNo "24AACCE1234C1Z5"

export function getCompanyGstStateCode() {
  try {
    const raw = localStorage.getItem(COMPANY_MASTER_STORE_KEY);
    if (raw) {
      const rows = JSON.parse(raw);
      const gst = rows && rows[0] && rows[0].GSTNo;
      if (gst && gst.length >= 2) return gst.slice(0, 2);
    }
  } catch (e) {
    // Storage unavailable/corrupt — fall back to the seed default below.
  }
  return DEFAULT_COMPANY_GST_STATE_CODE;
}

// Async variant for callers that can await the real master-data API
// (apiGetMasterList) instead of reading localStorage directly — prefer this
// where a synchronous call isn't required.
export async function fetchCompanyGstStateCode() {
  try {
    const rows = await apiGetMasterList("company");
    const gst = rows && rows[0] && rows[0].GSTNo;
    if (gst && gst.length >= 2) return gst.slice(0, 2);
  } catch (e) {
    // fall through to sync/default
  }
  return getCompanyGstStateCode();
}

export function gstStateCode(gstin) {
  if (!gstin) return null;
  const trimmed = String(gstin).trim();
  if (!trimmed || /^(URP|UNREGISTERED)$/i.test(trimmed)) return null;
  const code = trimmed.slice(0, 2);
  return /^\d{2}$/.test(code) ? code : null;
}

// Mirrors CommonFunctions.IsIGST(partyGSTNo, fromStateID) from the old app:
// unregistered/blank GSTIN => within-state (no state code to compare), a
// registered GSTIN whose state code differs from the company's own GST
// state => inter-state (IGST), otherwise within-state (CGST+SGST).
export function isInterState(partyGstNo, companyGstStateCode) {
  const partyCode = gstStateCode(partyGstNo);
  if (!partyCode) return false;
  return partyCode !== companyGstStateCode;
}

// Old app picks which party's GSTIN governs the CGST/SGST-vs-IGST decision
// based on who is being billed (Payment Type): Paid/TBBS => consignor bears
// it, ToPay/TBBR => consignee. Falls back to the consignor's GST No for any
// other payment type.
export function determineTaxType(form, companyGstStateCode = getCompanyGstStateCode()) {
  const paymentType = String(form.PaymentType || "");
  const relevantGst =
    /^(ToPay|TBBR)/i.test(paymentType) ? form.ToGSTNo : form.FromGSTNo;
  return isInterState(relevantGst, companyGstStateCode)
    ? "IGST"
    : "CGST_SGST";
}

// Old app (SetGSTPaybleBy): Paid/TBBS -> Consignor bears tax if they have a
// real (registered) GSTIN, else it falls to the Agent (old app's "GTA");
// ToPay/TBBR -> same but for Consignee. Any other Payment Type is left
// alone (the old app defaults it to NoST, but doesn't fight a value the
// user set deliberately for Cash/other flows this app added).
export function determineServiceTaxPayableBy(form) {
  const paymentType = String(form.PaymentType || "");
  if (/^(Paid|TBBS)/i.test(paymentType)) {
    return gstStateCode(form.FromGSTNo) ? "Consignor" : "Agent";
  }
  if (/^(ToPay|TBBR)/i.test(paymentType)) {
    return gstStateCode(form.ToGSTNo) ? "Consignee" : "Agent";
  }
  return form.STBy || "NoST";
}

// ── Freight amount ─────────────────────────────────────────────────────
// Old app (SetFreightAmount): Truck (variable-rate) carriers freight on
// Weight x Rate, falling back to Quantity x Rate if Weight is blank; other
// carriers (Own/Air — the old app's "Bus" equivalent, fix-rate) freight on
// the larger of Quantity x Rate and Weight x Rate. A per-party
// MinimumFreight (from the rate master in the old app; a plain editable
// field here since this app has no rate-master lookup yet) is enforced as
// a floor either way.
export function calcFreightAmount({ Carrier, Quantity, Weight, Rate, MinimumFreight }) {
  const qty = parseFloat(Quantity) || 0;
  const weight = parseFloat(Weight) || 0;
  const rate = parseFloat(Rate) || 0;
  const minFreight = parseFloat(MinimumFreight) || 0;

  let freight;
  if (String(Carrier).toLowerCase() === "truck") {
    freight = weight > 0 ? weight * rate : qty * rate;
  } else {
    freight = Math.max(qty * rate, weight * rate);
  }

  if (minFreight > 0 && freight < minFreight) freight = minFreight;
  return freight.toFixed(2);
}

// ── Tax ─────────────────────────────────────────────────────────────────
// Freight/door/other charges below this assessable amount are not taxed at
// all (old app: GetMinimumTaxableAmount(date), sourced from a date-effective
// tax-config master this app doesn't have yet). ₹750 mirrors the GST GTA
// single-consignment exemption threshold as a sensible, documented default
// — adjust here if/when a real tax-config master is added.
export const MIN_TAXABLE_ASSESSABLE_AMOUNT = 750;

// Computes CGST/SGST or IGST amounts for the given assessable amount,
// honouring "S.T. By" = NoST (no tax at all) and the minimum-taxable-amount
// threshold, same as the old app's SetTaxPCT().
export function calcTaxAmounts({
  taxType,
  AssessableAmount,
  CGSTRate,
  SGSTRate,
  IGSTRate,
  STBy,
}) {
  const assessable = parseFloat(AssessableAmount) || 0;
  const noTax =
    STBy === "NoST" || assessable < MIN_TAXABLE_ASSESSABLE_AMOUNT;

  if (noTax) {
    return {
      CGSTAmt: "0.00",
      SGSTAmt: "0.00",
      IGSTAmt: "0.00",
      TotalTax: "0.00",
    };
  }

  if (taxType === "CGST_SGST") {
    const cgst = (assessable * (parseFloat(CGSTRate) || 0)) / 100;
    const sgst = (assessable * (parseFloat(SGSTRate) || 0)) / 100;
    return {
      CGSTAmt: cgst.toFixed(2),
      SGSTAmt: sgst.toFixed(2),
      IGSTAmt: "0.00",
      TotalTax: (cgst + sgst).toFixed(2),
    };
  }

  const igst = (assessable * (parseFloat(IGSTRate) || 0)) / 100;
  return {
    CGSTAmt: "0.00",
    SGSTAmt: "0.00",
    IGSTAmt: igst.toFixed(2),
    TotalTax: igst.toFixed(2),
  };
}

// ── Discount ────────────────────────────────────────────────────────────
// Old app (SetDiscountAmount): computed on (Assessable + all tax), i.e.
// *after* tax, not on the assessable amount alone; "%"/"Fixed" (old:
// PCT/Flat) decide whether DiscountLeft is a percentage of that base or a
// flat rupee value. "Select Value" (no type chosen) leaves Discount as a
// plain manually-entered legacy value, matching the old app's behaviour of
// disabling the computed field until a DiscountType is picked.
export function calcDiscountAmount({ DiscountType, DiscountLeft, AssessableAmount, TotalTax, manualDiscount }) {
  const base = (parseFloat(AssessableAmount) || 0) + (parseFloat(TotalTax) || 0);
  const left = parseFloat(DiscountLeft) || 0;

  if (DiscountType === "%") return ((base * left) / 100).toFixed(2);
  if (DiscountType === "Fixed") return left.toFixed(2);
  // "Select Value" (or anything else) — keep whatever was manually typed
  // into the Discount field itself.
  return (parseFloat(manualDiscount) || 0).toFixed(2);
}

// ── Net amount ──────────────────────────────────────────────────────────
// Old app (SetNetAmount): when the Goods Transport Agency ("Agent" in this
// app's "S.T. By" options, old app's "GTA") bears the tax, it's billed as
// part of this consignment's Net Amount; otherwise (Consignor/Consignee pay
// tax separately, or NoST) tax is excluded from Net Amount entirely.
export function calcNetAmount({ AssessableAmount, TotalTax, Discount, STBy }) {
  const assessable = parseFloat(AssessableAmount) || 0;
  const tax = parseFloat(TotalTax) || 0;
  const discount = parseFloat(Discount) || 0;
  const includeTax = STBy === "Agent";
  const total = includeTax ? assessable + tax : assessable;
  return (total - discount).toFixed(2);
}

// ── Kasar / Received ───────────────────────────────────────────────────
// Old app (SetReceivedAmountAndKasar): only meaningful for cash collected
// at the counter (PaymentType = Paid, IsPaymentReceived checked) — Received
// is Net Amount rounded to the nearest rupee, and Kasar is the signed
// rounding difference (so Received = NetAmount - Kasar). For every other
// payment type both are cleared, matching the old app's disable/clear rule.
export function calcKasarAndReceived({ PaymentType, PayReceived, NetAmt }) {
  if (PaymentType !== "Paid" || !PayReceived) {
    return { Kasar: 0, Received: 0 };
  }
  const net = parseFloat(NetAmt) || 0;
  const received = Math.round(net);
  const kasar = net - received;
  return { Kasar: Number(kasar.toFixed(2)), Received: received };
}
