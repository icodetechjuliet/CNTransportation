// // src/IPConfig/dmsConfig.js
// // EagleParcel DMS .NET Web API base URL.
// // DMS endpoints live on their own backend (separate from the main CargoNet API).
// // Update this URL when the DMS API moves to its target host.
// import axios from "axios";

// const DMS_API = "https://localhost:5001/api";

// // const DMS_API = "https://b1.gocargonet.com/Arem2627_CNAPI20260424/api";

// // Temporary static token for the DMS API (separate auth realm from the main app's
// // sessionStorage "accessToken"). Swap this for the shared session token once DMS
// // login is unified with the main CargoNet auth flow.
// const DMS_API_TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiVXNlck5hbWUiOiJpY29kZWFkbWluIiwiSXNBZG1pbiI6IlRydWUiLCJCb29raW5nT2ZmaWNlSURzIjoiOTAwMDEsOTAwMDIiLCJqdGkiOiI2N2Q4NWRiYS1iMmIzLTQyMDMtYjBkMC05YmJkMzIwZWMwZWIiLCJleHAiOjE3ODM2MDUxNzMsImlzcyI6IkVhZ2xlUGFyY2VsLkFQSSIsImF1ZCI6IkNhcmdvTmV0VnVlIn0.dSaLBAYfRBpZSX5VFUJca0fQLWybmb9dWtBKTMaDrRo";

// export const dmsApi = axios.create({ baseURL: DMS_API });

// dmsApi.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${DMS_API_TOKEN}`;
//   return config;
// });

// function decodeJwtPayload(token) {
//   try {
//     const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
//     const json = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
//         .join("")
//     );
//     return JSON.parse(json);
//   } catch {
//     return {};
//   }
// }

// const dmsTokenClaims = decodeJwtPayload(DMS_API_TOKEN);

// // Derived from the temporary static DMS_API_TOKEN above — until DMS login is
// // unified with the main CargoNet auth flow, this is the only source we have
// // for "which booking office / user is creating this record". Re-derive from
// // the real session token once that unification happens.
// export const dmsCurrentUser = {
//   userID: Number(dmsTokenClaims.sub) || null,
//   userName: dmsTokenClaims.UserName || null,
//   bookingOfficeIDs: (dmsTokenClaims.BookingOfficeIDs || "")
//     .split(",")
//     .map((s) => Number(s.trim()))
//     .filter(Boolean),
// };

// export default DMS_API;

// src/IPConfig/dmsConfig.js
// EagleParcel DMS .NET Web API base URL.
// DMS endpoints live on their own backend (separate from the main CargoNet API).
// Read from window.APP_CONFIG (see public/env-config.js + src/index.template.html)
// so this can be changed per-deployment via docker-compose.yml env vars,
// with no rebuild required. No hardcoded fallback -- env-config.js is the
// only source of truth.
import axios from "axios";

const DMS_API =
  (typeof window !== "undefined" &&
    window.APP_CONFIG &&
    window.APP_CONFIG.DMS_API_URL) ||
  "";

// Temporary static token for the DMS API (separate auth realm from the main app's
// sessionStorage "accessToken"). Swap this for the shared session token once DMS
// login is unified with the main CargoNet auth flow.
const DMS_API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiVXNlck5hbWUiOiJpY29kZWFkbWluIiwiSXNBZG1pbiI6IlRydWUiLCJCb29raW5nT2ZmaWNlSURzIjoiOTAwMDEsOTAwMDIiLCJqdGkiOiI2N2Q4NWRiYS1iMmIzLTQyMDMtYjBkMC05YmJkMzIwZWMwZWIiLCJleHAiOjE3ODM2MDUxNzMsImlzcyI6IkVhZ2xlUGFyY2VsLkFQSSIsImF1ZCI6IkNhcmdvTmV0VnVlIn0.dSaLBAYfRBpZSX5VFUJca0fQLWybmb9dWtBKTMaDrRo";

export const dmsApi = axios.create({ baseURL: DMS_API });

dmsApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${DMS_API_TOKEN}`;
  return config;
});

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

const dmsTokenClaims = decodeJwtPayload(DMS_API_TOKEN);

// Derived from the temporary static DMS_API_TOKEN above — until DMS login is
// unified with the main CargoNet auth flow, this is the only source we have
// for "which booking office / user is creating this record". Re-derive from
// the real session token once that unification happens.
export const dmsCurrentUser = {
  userID: Number(dmsTokenClaims.sub) || null,
  userName: dmsTokenClaims.UserName || null,
  bookingOfficeIDs: (dmsTokenClaims.BookingOfficeIDs || "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter(Boolean),
};

export default DMS_API;
