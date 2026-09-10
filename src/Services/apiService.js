import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import { validatePayload } from "src/Utils/payloadValidator";
import { sendFrontendErrorEmail } from "src/Utils/errorMailer";

// ── Create axios instance with baseURL ────────────────────────
const apiService = axios.create({
  baseURL: CargoNet_API,
});

// ── Error log to backend ──────────────────────────────────────
function sendErrorLog(data) {
  axios
    .post(`${CargoNet_API}/Errorlog/send-frontend-error`, data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    })
    .catch((e) => console.warn("sendErrorLog failed:", e));
}

// ── Request interceptor ───────────────────────────────────────
apiService.interceptors.request.use(
  (config) => {
    // ✅ Attach token — same logic as your boot/axios.js
    const token = sessionStorage.getItem("accessToken");
    if (token && !config.url.includes("FrmReportCR.aspx")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = config.method?.toLowerCase();

    if (["post", "put"].includes(method) && config.data) {
      // ✅ Safe parse — axios sometimes serializes data to string
      const payload =
        typeof config.data === "string" ? JSON.parse(config.data) : config.data;

      const errors = validatePayload(config.url, payload);

      if (errors.length > 0) {
        console.error(
          `[API Validator] ${errors.length} error(s) in ${config.url}`,
          errors
        );

        // ✅ Fire and forget — don't block the throw
        sendFrontendErrorEmail({
          errors,
          payload,
          url: config.url,
          method,
        }).catch((e) => console.warn("sendFrontendErrorEmail failed:", e));

        // ✅ Throw synchronously — works correctly in interceptors
        const err = new Error(
          `Payload validation failed (${errors.length} error(s)). Error report sent.`
        );
        err.isValidationError = true;
        err.errors = errors;
        throw err;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Skip logging if it was a validation error (never reached server)
    if (error.isValidationError) {
      return Promise.reject(error);
    }

    if (error.response) {
      sendErrorLog({
        type: "API_ERROR",
        url: error.config?.url,
        payload: error.config?.data,
        status: error.response.status,
        message: error.response.data,
        time: new Date().toISOString(),
      });
    }

    return Promise.reject(error);
  }
);

export default apiService;
