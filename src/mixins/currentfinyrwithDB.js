import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

// Shared implementation for ${CargoNet_API}/financialyear/currentfinyear
// Same as the CurrentFinYear loading pattern used across the app, but also
// keeps DBName from the response (CNSP_GetCurrentFinancialYear_20260812).
export const currentfinyrwithDB = {
  data() {
    return {
      opCurrentFinancialYear: [],
      CurrentFinYear: 0,
      CurrentFinYearDBName: "",
    };
  },
  methods: {
    LoadCurrentFinancialYearWithDB() {
      axios
        .get(`${CargoNet_API}/financialyear/currentfinyear`)
        .then((res) => {
          this.opCurrentFinancialYear = res.data.map((optionFY) => ({
            label: optionFY.CurrentFinYear,
            value: optionFY.ID,
            dbName: optionFY.DBName,
          }));

          if (this.opCurrentFinancialYear.length > 0) {
            this.CurrentFinYear = this.opCurrentFinancialYear[0].value;
            this.CurrentFinYearDBName = this.opCurrentFinancialYear[0].dbName;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
