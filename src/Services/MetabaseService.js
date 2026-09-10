// src/services/MetabaseService.js

import axios from "axios";
import Login_API from "/src/IPConfig/configLogin.js";

const MetabaseService = {
  async getToken(dashboardKey) {
    try {
      const response = await axios.get(`${Login_API}/Metabase/GetToken`, {
        params: { dashboardKey },
      });
      return response.data;
    } catch (error) {
      console.error("Metabase token error:", error);
      return null;
    }
  },

  getTokenFromSession(dashboardKey) {
    const tokens = JSON.parse(sessionStorage.getItem("metabaseTokens") || "{}");
    return tokens[dashboardKey] || null;
  },

  clearTokens() {
    sessionStorage.removeItem("metabaseTokens");
  },
};

export default MetabaseService;
