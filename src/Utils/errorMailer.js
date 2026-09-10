// utils/errorMailer.js
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

export async function sendFrontendErrorEmail({ errors, payload, url, method }) {
  console.log("📧 Sending error email for:", url, errors);

  // ✅ Normalize errors — backend expects {Field, Issue, Expected, Got} strings only
  const normalizedErrors = errors.map((e) => {
    if (e.field === "__extra__") {
      return {
        Field: "__extra__",
        Issue: "Unexpected fields sent",
        Expected: "Not in schema",
        Got: Array.isArray(e.fields)
          ? e.fields.join(", ")
          : String(e.fields ?? ""),
      };
    }
    return {
      Field: e.field ?? "",
      Issue: e.issue ?? "",
      Expected: String(e.expected ?? ""), // ✅ force string — backend expects string
      Got: String(e.got ?? ""), // ✅ force string — backend expects string
    };
  });

  // ✅ Flatten payload to Dictionary<string, string> — avoids Json deserialization issues
  const safePayload = {};
  for (const [key, val] of Object.entries(payload ?? {})) {
    if (val === null || val === undefined) safePayload[key] = "null";
    else if (!isFinite(val) && typeof val === "number")
      safePayload[key] = "[Infinity]";
    else if (typeof val === "number" && isNaN(val)) safePayload[key] = "[NaN]";
    else safePayload[key] = String(val); // ✅ everything becomes a string value
  }

  try {
    await axios.post(
      `${CargoNet_API}/Errorlog/send-frontend-error`,
      {
        Url: url, // ✅ PascalCase — matches C# DTO property names
        Method: method,
        PageUrl: window.location.href,
        Timestamp: new Date().toISOString(),
        Errors: normalizedErrors,
        Payload: safePayload,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("📧 Error email sent successfully");
  } catch (e) {
    console.warn(
      "📧 Error email dispatch failed:",
      e.response?.data ?? e.message
    );
  }
}
