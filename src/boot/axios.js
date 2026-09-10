import { boot } from "quasar/wrappers";
import axios from "axios";

//This component is used to make HTTP requests along with token authentication - Globally

// axios.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// to avoid sending auth token for Report_API
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");

  // Do NOT attach Authorization for Reports_API
  if (!config.url.includes("FrmReportCR.aspx")) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Explicitly remove the header if somehow preset
    delete config.headers.Authorization;
  }

  return config;
});
