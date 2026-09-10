import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const LoadDateMixin = {
  data() {
    return {};
  },
  watch: {
    // TXTVoucherDate(val) {
    //   if (val != "") {
    //     this.Formatdate(val);
    //   }
    // },
  },
  methods: {
    Formatdate(selecteddate) {
      // const currentDate = new Date(selecteddate);
      // const isAlreadyFormatted = /^\d{2}\/\d{2}\/\d{4}$/.test(selecteddate);
      // if (!isAlreadyFormatted && selecteddate != "") {
      //   if (isNaN(currentDate)) {
      //     this.TXTVoucherDate = selecteddate;
      //   } else {
      //     const isAlreadyFormatted = /^\d{2}\/\d{2}\/\d{4}$/.test(selecteddate);
      //     if (!isAlreadyFormatted) {
      //       const year = currentDate.getFullYear();
      //       const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      //       const day = String(currentDate.getDate()).padStart(2, "0");
      //       const formattedDate = `${day}/${month}/${year}`;
      // this.TXTVoucherDate = this.TXTVoucherDate;
      //     }
      //   }
      // }
    },
    Formatgetdate() {
      // const currentDate = new Date();
      // const year = currentDate.getFullYear();
      // const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      // const day = String(currentDate.getDate()).padStart(2, "0");
      // const formattedDate = `${day}/${month}/${year}`;
      // this.TXTVoucherDate = this.TXTVoucherDate;
    },
  },
};
