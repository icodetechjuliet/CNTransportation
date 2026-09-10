// ─── Endpoint Rules ───────────────────────────────────────────────────────────
const endpointRules = {
  "/shipments/rowcharges": [
    { field: "TempID", type: "int", required: true, min: 1 },
    { field: "ChargeName", type: "int", required: false },
    { field: "ApplyTo", type: "int", required: false },
    {
      field: "PPCC",
      type: "string",
      required: false,
      allowedValues: ["PP", "CC", ""],
    },
    {
      field: "Quantity",
      type: "decimal",
      required: false,
      min: 0,
      max: 999999,
    },
    { field: "QuantityUOM", type: "int", required: false, min: 0 },
    {
      field: "UnitPrice",
      type: "decimal",
      required: false,
      min: 0,
      max: 999999999,
    },
    {
      field: "Amount",
      type: "decimal",
      required: false,
      max: 999999999999,
      notInfinite: true,
    },
    { field: "Currency", type: "int", required: false, min: 1 },
    {
      field: "ExRate",
      type: "decimal",
      required: false,
      min: 0,
      max: 999999,
      notNaN: true,
    },
    { field: "PartyType", type: "int", required: false },
    { field: "AddLess", type: "string", required: false },
    { field: "ChargeCompID", type: "int", required: true, min: 1 },
    { field: "ChargeUserID", type: "int", required: true, min: 1 },
    { field: "Description", type: "string", required: false, maxLength: 500 },
    {
      field: "GSTValidation",
      type: "string",
      required: false,
      allowedValues: ["Y", "OS", "NA", "NULL", "RCM", ""],
    },
    { field: "ExpChargeName", type: "int", required: false },
    { field: "ExpApplyTo", type: "int", required: false },
    {
      field: "ExpQuantity",
      type: "decimal",
      required: false,
      min: 0,
      max: 999999,
    },
    {
      field: "ExpUnitPrice",
      type: "decimal",
      required: false,
      min: 0,
      max: 999999999,
    },
    {
      field: "ExpAmount",
      type: "decimal",
      required: false,
      max: 999999999999,
      notInfinite: true,
    },
    { field: "ExpCurrency", type: "int", required: false, min: 1 },
    {
      field: "ExpExRate",
      type: "decimal",
      required: false,
      min: 0,
      max: 999999,
      notNaN: true,
    },
    { field: "ExpPartyType", type: "int", required: false },
  ],

  "/vouchers/charges": [
    { field: "TempID", type: "int", required: true, min: 1 },
    { field: "Ledgerid", type: "int", required: true, min: 1 },
    { field: "Currency", type: "int", required: true, min: 1 },
    {
      field: "ExRate",
      type: "decimal",
      required: true,
      min: 0,
      max: 999999,
      notNaN: true,
    },
    {
      field: "Price",
      type: "decimal",
      required: false,
      min: 0,
      max: 999999999,
    },
    {
      field: "Quantity",
      type: "decimal",
      required: false,
      min: 0,
      max: 999999,
    }, // ✅ overflow guard
    { field: "QuantityUOM", type: "int", required: false, min: 0 },
    {
      field: "Amount",
      type: "decimal",
      required: true,
      max: 999999999999,
      notInfinite: true,
    },
    { field: "Description", type: "string", required: false, maxLength: 500 },
    { field: "CmpId", type: "int", required: true, min: 1 },
    {
      field: "AmountInBase",
      type: "decimal",
      required: true,
      max: 999999999999,
      notNaN: true,
      notInfinite: true,
    },
    { field: "AmountInString", type: "string", required: false, maxLength: 50 },
    { field: "RefNo", type: "int", required: false },
    {
      field: "ChargeUniqueNo",
      type: "string",
      required: false,
      maxLength: 100,
    },
    {
      field: "GSTValidation",
      type: "string",
      required: false,
      allowedValues: ["Y", "OS", "NA", "NULL", "RCM", ""],
    },
  ],
};

// ─── Type Checkers ────────────────────────────────────────────────────────────
const typeCheckers = {
  int: (v) => {
    const n = Number(v);
    return Number.isInteger(n) && String(v).trim() !== "" && !isNaN(n);
  },
  decimal: (v) => {
    const n = parseFloat(v);
    return !isNaN(n) && String(v).trim() !== "";
  },
  string: (v) => typeof v === "string",
  bool: (v) => typeof v === "boolean",
};

// ─── Endpoint Matcher ─────────────────────────────────────────────────────────
// Strips numeric IDs from path:
// "/api/vouchers/1234567/charges" → "/vouchers/charges"
function matchEndpoint(url) {
  let path;
  try {
    path = new URL(url).pathname;
  } catch {
    path = url;
  }
  const normalized = path.replace(/\/\d+/g, "");
  return Object.keys(endpointRules).find((key) => normalized.endsWith(key));
}

// ─── Extra Fields Check ───────────────────────────────────────────────────────
function validateFieldCount(payload, rules) {
  const known = new Set(rules.map((r) => r.field));
  const extra = Object.keys(payload).filter((f) => !known.has(f));
  return extra.length > 0
    ? [{ field: "__extra__", issue: "Unexpected fields sent", fields: extra }]
    : [];
}

// ─── Main Validator ───────────────────────────────────────────────────────────
export function validatePayload(url, payload) {
  const matchedKey = matchEndpoint(url);
  if (!matchedKey) return []; // No rules defined for this endpoint = skip

  const rules = endpointRules[matchedKey];
  const errors = [];

  // ── 1. Extra/unexpected fields ──────────────────────────────
  errors.push(...validateFieldCount(payload, rules));

  for (const rule of rules) {
    const value = payload[rule.field];
    const isEmpty = value === null || value === undefined || value === "";

    // ── 2. Required field missing ───────────────────────────
    if (rule.required && isEmpty) {
      errors.push({
        field: rule.field,
        issue: "Required but missing or empty",
        expected: rule.type,
        got: JSON.stringify(value),
      });
      continue;
    }

    // Skip optional empty fields — nothing more to check
    if (isEmpty) continue;

    // ── 3. Type mismatch ────────────────────────────────────
    const checker = typeCheckers[rule.type];
    if (checker && !checker(value)) {
      errors.push({
        field: rule.field,
        issue: "Type mismatch",
        expected: rule.type,
        got: `${JSON.stringify(value)} (${typeof value})`,
      });
      continue; // No point running further checks on wrong type
    }

    const num = Number(value);

    // ── 4. NaN check ────────────────────────────────────────
    // Catches: parseFloat("abc"), undefined * number, etc.
    if (rule.notNaN && isNaN(num)) {
      errors.push({
        field: rule.field,
        issue: "Value is NaN — likely bad multiplication (string × number)",
        got: JSON.stringify(value),
      });
      continue;
    }

    // ── 5. Infinity / overflow check ─────────────────────────
    // Catches: 999999 * 999999999 = 3.02e+38, 1/0 = Infinity
    if (rule.notInfinite && !isFinite(num)) {
      errors.push({
        field: rule.field,
        issue: "Value is Infinity — quantity or price is unrealistically large",
        got: JSON.stringify(value),
      });
      continue;
    }

    // ── 6. Min value ─────────────────────────────────────────
    if (rule.min !== undefined && num < rule.min) {
      errors.push({
        field: rule.field,
        issue: `Value is below minimum allowed (${rule.min})`,
        expected: `>= ${rule.min}`,
        got: JSON.stringify(value),
      });
    }

    // ── 7. Max value ─────────────────────────────────────────
    // Catches overflow like Quantity: 5551111111111 → Amount: 3.02e+38
    if (rule.max !== undefined && num > rule.max) {
      errors.push({
        field: rule.field,
        issue: `Value exceeds maximum allowed (${rule.max})`,
        expected: `<= ${rule.max}`,
        got: JSON.stringify(value),
      });
    }

    // ── 8. Max string length ──────────────────────────────────
    if (rule.maxLength !== undefined && String(value).length > rule.maxLength) {
      errors.push({
        field: rule.field,
        issue: `String too long (${String(value).length} > ${rule.maxLength})`,
        expected: `maxLength: ${rule.maxLength}`,
        got: `"${String(value).substring(0, 40)}..."`,
      });
    }

    // ── 9. Allowed values ─────────────────────────────────────
    if (rule.allowedValues && !rule.allowedValues.includes(value)) {
      errors.push({
        field: rule.field,
        issue: "Value not in allowed list",
        expected: rule.allowedValues.join(" | "),
        got: JSON.stringify(value),
      });
    }
  }

  return errors;
}
