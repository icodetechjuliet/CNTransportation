// Pure UI enrichment for JobQuickEntryForm.vue's "Quick View" compact mode.
//
// Goal: on top of the always-shown mandatory fields, additionally surface
// whichever NON-mandatory fields THIS user has actually filled in most often
// across their own recent jobs FOR THE SAME MODULE (DocID/FormID) — so the
// compact default field set adapts per user, per module, instead of only
// ever being the static mandatory set.
//
// This file does read-only analysis of past jobs (GetJobDetails grid +
// GetShipment-equivalent /shipments/{id} + /shipments/{id}/containers/0).
// It must NEVER throw — every failure just means "no extra fields", and the
// caller's mandatory-only fallback still works untouched. See
// JobQuickEntryForm.vue for how the result is merged into the default
// visible-field computation.

import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

// ---------------------------------------------------------------------------
// UI FieldName -> raw jobData key lookups.
//
// Built by cross-referencing:
//  - JobCNFormDynamicTab.vue's GetShipment() (~line 15311+), which assigns
//    `this.<StateProp> = jobData.<RawKey>` for the single-record
//    /shipments/{id} response.
//  - Its *FormConfig computed properties (GeneralformConfig,
//    PartyformwithorgConfig, CommodityFormConfig, ...), which map
//    `UIStateProp: this.<StateProp>`.
//  - JobViewModeSummary.vue's confirmed label -> state-prop pairs (a prior
//    session's already-verified cross-reference of the same data).
//  - PartyDetailsTabWithOrg.vue / ContainerDetails.vue's own
//    row-hydration code (`this.localForm.X = row.Y` / `jobData.Y`), read
//    directly for the Party-with-org and Container raw shapes since those
//    aren't simple 1:1 GetShipment assignments.
//
// Only fields confidently traced this way are included. Anything not
// traceable (dynamic/UI-only fields like "Document type", "Masterrefsearch",
// "MasterShowallref", "Bookingrefsearch" — confirmed to come from
// independent lookups/defaults, NOT from the job's own raw data; or
// per-row dimension-grid fields like Pieces/Length/Width/Height/Air Volume
// which live only in a child component's local, never-centrally-loaded
// state) is simply left out of the map below — such a field can never win a
// frequency slot, which is safe (falls back to mandatory-only for it).
const GENERAL_FIELD_MAP = {
  MasterExRate: (jd) => jd.ExRate,
  MasterCurrency: (jd) => jd.CurrencyID,
  "Job Type": (jd) => jd.JobTypeID,
  "Terms of Shipment": (jd) => jd.TermsofShipmentID,
  "Shipment Type": (jd) => jd.ShipemtType,
  "Movement Type": (jd) => jd.MovementTypeID,
  Scheme: (jd) => jd.SchemeID,
  // Hazardous defaults to "N" (Non-Hazardous) — only count it "filled" when
  // the user actually flipped it to Hazardous, not the default state.
  Hazardous: (jd) => (jd.Hazardous && jd.Hazardous !== "N" ? "Y" : null),
  "IMO Class": (jd) => jd.IMOClass,
  "EP Copy": (jd) => (jd.EPCopy === "Y" ? "Y" : null),
  "Mates Receipt": (jd) => (jd.MateReceipt === "Y" ? "Y" : null),
  "Shippers Load": (jd) => (jd.IsShipperLoad === "Y" ? "Y" : null),
  "Master BL": (jd) => (jd.MasterHouseBL === "D" ? "D" : null),
  "House BL": (jd) => (jd.MasterHouseBL === "C" ? "C" : null),
  BLType: (jd) => jd.BLTypeID,
  "No. Of Original Bls": (jd) => jd.NoofBL,
  "BL Type Stamp": (jd) => jd.BLTypeStamp,
  "Place of Issue": (jd) => jd.PlaceofIssue,
  "Date of Issue": (jd) => jd.IssueDate,
  "Date of Release": (jd) => jd.DateofRelease,
  Priority: (jd) => jd.Priority,
  "Shipper RefNo": (jd) => jd.RefNo,
  Notes: (jd) => jd.Notes,
  DispatchRequestby: (jd) => jd.Username,
};

// PartyDetailsTabWithOrg.vue (default, ShowOldPartyDetails === false) — every
// one of these traced to `this.shipmentdata.<RawKey>` inside that component's
// own row-hydration methods (this.shipmentdata IS the same raw jobData the
// /shipments/{id} call returns, just passed down as a prop).
const PARTY_WITHORG_FIELD_MAP = {
  Shipper: (jd) => jd.ShipperID,
  Consignee: (jd) => jd.ConsigneeID,
  NotifyParty1: (jd) => jd.NotifyParty1ID,
  DeliveryAgent: (jd) => jd.DeliveryAgentID,
  Forwarder: (jd) => jd.ForwarderID,
  Supplier: (jd) => jd.SupplierID,
  CHA: (jd) => jd.CHAID,
  Warehouse: (jd) => jd.WareHouseID,
  Coloader: (jd) => jd.ColoaderID,
  WarehouseDestination: (jd) => jd.WarehouseDestinationID,
  Transporter: (jd) => jd.TransporterID,
  Transporter1: (jd) => jd.Transporter1ID,
  Transporter2: (jd) => jd.Transporter2ID,
  Transporter3: (jd) => jd.Transporter3ID,
  Transporter4: (jd) => jd.Transporter4ID,
  IATA: (jd) => jd.IATA,
  "Booking Party": (jd) => jd.BookingPartyID,
  Salesman: (jd) => jd.SalesmanID,
  CollectionEmptyCont: (jd) => jd.CollectionofEmptyCont,
  CSexecutive: (jd) => jd.CSexecutive,
  BLissuedto: (jd) => jd.BLIssuedto,
};

// PartyDetailsTab.vue (ShowOldPartyDetails === true) — same underlying raw
// keys as above (GetShipment assigns the same jobData.<X>ID straight onto
// the flat, non-Org state props for this variant), plus a few old-form-only
// fields. "Air Line" and "Others" old-form UOM-less "Others" party couldn't
// be confidently traced to a distinct raw key beyond `jobData.Others` — kept
// only where the trace was solid.
const PARTY_OLD_FIELD_MAP = {
  ...PARTY_WITHORG_FIELD_MAP,
  BillToParty: (jd) => jd.BillToParty,
  "Shipping Line": (jd) => jd.ShippinglineID,
  Others: (jd) => jd.Others,
};

// Commodity header fields — all confirmed as direct jobData.<RawKey>
// assignments in GetShipment()'s "Commodity Details" block.
const COMMODITY_FIELD_MAP = {
  ComChargeType: (jd) => jd.ComChargeType,
  "Commodity Type": (jd) => jd.ComType,
  "Freight Status": (jd) => jd.Freightsts,
  "Freight Payable At": (jd) => jd.Freightpayable,
  ComGrossWt: (jd) => jd.ComGrosswt,
  CommodityGWUOM: (jd) => jd.CommodityGWUOMID,
  ComNetWt: (jd) => jd.ComNetwt,
  "No Of Packages": (jd) => jd.NoofPkg,
  ComPKGUOM: (jd) => jd.CommodityPKGUOMID,
  ComVolume: (jd) => jd.ComVolume,
  ComVolumeUOM: (jd) => jd.CommodityVolumeUOMID,
  "Rate/Charge": (jd) => jd.RateCharge,
  "ComGoodsDescription(short)": (jd) => jd.ComGoodsdesc,
  "Container Details": (jd) => jd.ComContainerDetails,
  "Goods Description": (jd) => jd.GoodsDesc,
  "Marks And Nos": (jd) => jd.MarksNos,
  "Commodity Container Details": (jd) => jd.ContainerDetails,
  "BL Clause / Remarks": (jd) => jd.BLClauseRemarks,
  ComAirChrWt: (jd) => jd.ChargeWt,
  ComAirRate: (jd) => jd.Rate,
  ComFreightAmount: (jd) => jd.FreightAmount,
  ComAirValuationCharge: (jd) => jd.ValuationCharge,
  ComValuationPPCC: (jd) => jd.ValuationChargeType,
  ComTaxCharge: (jd) => jd.Tax,
  ComTaxPPCC: (jd) => jd.TaxType,
  ComroundoffVolWtCheckbox: (jd) => (jd.VolRoundoff === "Y" ? "Y" : null),
  ComroundoffChrWtCheckbox: (jd) => (jd.ChrRoundoff === "Y" ? "Y" : null),
};

// Container fields live on a separate per-job grid endpoint
// (/shipments/{jobId}/containers/0), not on the header /shipments/{id}
// record — mapped from ContainerDetails.vue's own row-hydration code
// (`this.localForm.X = row.Y`), which is the confirmed GET row shape.
const CONTAINER_FIELD_MAP = {
  ContainerNo: (r) => r.ContainerNo,
  ContainerType: (r) => r.ContainerTypeID,
  "LS No(OTL NO)": (r) => r.LSNo,
  "CS No": (r) => r.CSNo,
  "Truck No": (r) => r.TruckNo,
  "Vehicle Type": (r) => r.TruckTypeID,
  "Gross Weight": (r) => r.GrossWT,
  ContainerGWUOM: (r) => r.GrossWTUOMID,
  "Net Weight": (r) => r.NetWeight,
  "No Of Packages": (r) => r.Package,
  ContainerPKGUOM: (r) => r.PackageUOMID,
  Volume: (r) => r.Volume,
  VolumeUOM: (r) => r.VolumeUOMID,
  Transporter: (r) => r.TransporterID,
  "Trip No": (r) => r.TripNo,
  "Freight Currency": (r) => r.CurrencyID,
  "Driver Name": (r) => r.DriverNo,
  "Contact No": (r) => r.ContactNo,
  "Transport Destination": (r) => r.TransportDest,
  "Gate In Date": (r) => r.GateInDate,
  "Movement Date": (r) => r.MovementDate,
  "Rail Out": (r) => r.RailOut,
  "Arrival Date": (r) => r.ArrivalDate,
  "Special Instructions (Remarks)": (r) => r.SpecialInstructions,
  "Container Goods Description": (r) => r.GoodsDescription,
  "Container Marks And Nos": (r) => r.MarksAndNos,
  "Container Empty Pickup Address": (r) => r.PickupAddress,
};

// How many historical jobs to sample (2 pages x 10 rows/page, per
// GetJobDetails' fixed page size).
const MAX_HISTORY_PAGES = 2;
// How many total default fields a compact section should end up with
// (mandatory + frequency top-up), per the task's "3-4 total" target.
const TARGET_SECTION_FIELD_COUNT = 4;

// Session-only in-memory cache. Never persisted (no localStorage/sessionStorage
// writes) — a hard page reload re-computes; a Quick View toggle within the
// same SPA session reuses this. Keyed by `${formId}::${userKey}` so different
// modules (Air Export vs Sea Export, i.e. different DocID/FormID) and
// different users never share results.
const _cache = new Map();

// Returns true when `value` should count as "the user actually filled this
// in" — same blank-check semantics as JobViewModeSummary.vue's formatValue
// (null/undefined/""/whitespace-only is blank; the number/string 0 or "0" is
// also treated as blank since every ID-like raw key here uses 0 to mean
// "unset").
function isFilledValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return value !== 0;
  const s = String(value).trim();
  if (s === "" || s === "0") return false;
  return true;
}

function safeString(v) {
  return (v === null || v === undefined ? "" : String(v)).trim().toLowerCase();
}

// Fetches up to MAX_HISTORY_PAGES pages of this user's own jobs for the given
// module (DocID/FormID), newest first, excluding the current in-progress job.
// Best-effort server-side filter (Searchby: "Createdby") + a mandatory
// client-side re-check against the returned `Createdby` column, since this
// codebase has no other confirmed usage of that search field/column to
// verify the server-side filter is honored — see quickEntryFieldFrequency's
// module comment / the task report for details.
async function fetchUsersRecentJobRows({
  branchId,
  formId,
  username,
  userId,
  currentJobId,
}) {
  const matched = [];
  for (let page = 1; page <= MAX_HISTORY_PAGES; page++) {
    let rows = [];
    try {
      const res = await axios.post(`${CargoNet_API}/shipments/GetJobDetails`, {
        BranchID: branchId,
        DocID: formId,
        Searchby: username ? "Createdby" : "",
        SearchCondition: "",
        SearchVal: username || "",
        PageNo: page,
      });
      rows = (res && res.data && res.data.Data) || [];
    } catch (err) {
      break; // network/API failure — stop paging, use whatever we already have
    }
    if (!rows.length) break;

    const uname = safeString(username);
    const uid = safeString(userId);
    rows.forEach((row) => {
      const createdBy = safeString(row.Createdby);
      const isMine =
        (uname && createdBy === uname) || (uid && createdBy === uid);
      const rowId = row.ID ?? row.id;
      if (isMine && rowId && String(rowId) !== String(currentJobId)) {
        matched.push(rowId);
      }
    });
    if (rows.length < 10) break; // last page
  }
  return matched;
}

async function fetchJobRecord(jobId) {
  try {
    const res = await axios.get(`${CargoNet_API}/shipments/${jobId}`);
    return (res && res.data && res.data[0]) || null;
  } catch (err) {
    return null;
  }
}

async function fetchContainerRows(jobId) {
  try {
    const res = await axios.get(
      `${CargoNet_API}/shipments/${jobId}/containers/0`
    );
    return (res && res.data) || [];
  } catch (err) {
    return [];
  }
}

// Tallies fill-counts for one section's field map against one job record (or
// container-row array, for the Container section), adding 1 per field that
// came back non-blank on this record.
function tallyFields(fieldMap, source, counts) {
  Object.keys(fieldMap).forEach((fieldName) => {
    try {
      const value = fieldMap[fieldName](source);
      if (isFilledValue(value)) {
        counts[fieldName] = (counts[fieldName] || 0) + 1;
      }
    } catch (err) {
      // A malformed/unexpected record shape for this one field — skip it,
      // never let one bad field abort the whole tally.
    }
  });
}

function rankFields(counts) {
  return Object.keys(counts)
    .filter((name) => counts[name] > 0)
    .sort((a, b) => counts[b] - counts[a]);
}

/**
 * Computes, once per session (cached), which non-mandatory fields this user
 * fills in most often for the given module — per section — based on their
 * own last 10-20 saved jobs for that same module (DocID/FormID).
 *
 * Never throws. Any failure (no history, network error, unrecognized
 * response shape) resolves to `{}` — an empty result the caller can safely
 * merge in as a no-op (mandatory-only fields still show).
 *
 * @param {Object} opts
 * @param {string|number} opts.formId - current job's module/DocID (FormID) —
 *   scopes history to the same module (Air Export vs Sea Export, etc).
 * @param {string|number} [opts.branchId] - current BranchID.
 * @param {string|number} [opts.userId] - current user's id (sessionStorage
 *   APIUserID) — used as a secondary match against the Createdby column.
 * @param {string} [opts.username] - current user's login/email
 *   (sessionStorage APIEmail) — primary match against Createdby, and the
 *   Searchby=Createdby server-side filter value.
 * @param {string|number} [opts.currentJobId] - the job currently being
 *   created/edited — excluded from its own history sample.
 * @param {boolean} [opts.showOldPartyDetails] - which Party field map to use.
 * @returns {Promise<Object>} e.g. { General: ["Notes", "Priority"], Party: [...], Container: [...], Commodity: [...] }
 */
export async function getFrequentFieldsForModule({
  formId,
  branchId,
  userId,
  username,
  currentJobId,
  showOldPartyDetails,
} = {}) {
  if (!formId || (!userId && !username)) return {};

  const cacheKey = `${formId}::${username || userId}::${
    showOldPartyDetails ? "old" : "org"
  }`;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  const resultPromise = (async () => {
    try {
      const jobIds = await fetchUsersRecentJobRows({
        branchId,
        formId,
        username,
        userId,
        currentJobId,
      });
      if (!jobIds.length) return {};

      const partyMap = showOldPartyDetails
        ? PARTY_OLD_FIELD_MAP
        : PARTY_WITHORG_FIELD_MAP;

      const counts = {
        General: {},
        Party: {},
        Container: {},
        Commodity: {},
      };

      // Sequential, not Promise.all — this is a background enrichment, not
      // something the page waits on, so there's no benefit worth the extra
      // request burst; keeping it sequential also makes a single slow/failed
      // job harmless to the rest of the loop.
      for (const jobId of jobIds) {
        const jobData = await fetchJobRecord(jobId);
        if (jobData) {
          tallyFields(GENERAL_FIELD_MAP, jobData, counts.General);
          tallyFields(partyMap, jobData, counts.Party);
          tallyFields(COMMODITY_FIELD_MAP, jobData, counts.Commodity);
        }
        const containerRows = await fetchContainerRows(jobId);
        if (containerRows && containerRows.length) {
          // "Filled" for a container field = at least one container row on
          // this job has a non-blank value for it.
          const rowCounts = {};
          containerRows.forEach((row) =>
            tallyFields(CONTAINER_FIELD_MAP, row, rowCounts)
          );
          Object.keys(rowCounts).forEach((f) => {
            counts.Container[f] = (counts.Container[f] || 0) + 1;
          });
        }
      }

      return {
        General: rankFields(counts.General),
        Party: rankFields(counts.Party),
        Container: rankFields(counts.Container),
        Commodity: rankFields(counts.Commodity),
      };
    } catch (err) {
      return {};
    }
  })();

  _cache.set(cacheKey, resultPromise);
  // Replace the cached promise with its resolved value once settled, so
  // later calls in the same session return synchronously-resolvable data
  // without re-awaiting; a failed attempt is still cached (as `{}`) rather
  // than retried on every Quick View toggle within the session.
  resultPromise.then(
    (value) => _cache.set(cacheKey, Promise.resolve(value)),
    () => _cache.set(cacheKey, Promise.resolve({}))
  );
  return resultPromise;
}

/**
 * Merges mandatory fields (always shown, never dropped) with top-frequency
 * non-mandatory fields (from getFrequentFieldsForModule's per-section
 * result) up to `TARGET_SECTION_FIELD_COUNT` total, preserving the
 * mandatory fields' relative order first, then appending frequency
 * additions in rank order.
 *
 * @param {string[]} mandatoryFields
 * @param {string[]} rankedFrequentFields - ranked non-mandatory field names for this section (already excludes mandatory ones is NOT assumed — this function does that exclusion itself).
 * @param {number} [targetCount]
 * @returns {string[]}
 */
export function mergeMandatoryWithFrequent(
  mandatoryFields,
  rankedFrequentFields,
  targetCount = TARGET_SECTION_FIELD_COUNT
) {
  const mandatory = mandatoryFields || [];
  const ranked = rankedFrequentFields || [];
  const slotsLeft = Math.max(0, targetCount - mandatory.length);
  if (!slotsLeft) return [...mandatory];
  const additions = ranked
    .filter((name) => !mandatory.includes(name))
    .slice(0, slotsLeft);
  return [...mandatory, ...additions];
}

// Exposed for tests / debugging only — not part of the intended public API.
export const _internal = {
  GENERAL_FIELD_MAP,
  PARTY_WITHORG_FIELD_MAP,
  PARTY_OLD_FIELD_MAP,
  COMMODITY_FIELD_MAP,
  CONTAINER_FIELD_MAP,
  isFilledValue,
};
