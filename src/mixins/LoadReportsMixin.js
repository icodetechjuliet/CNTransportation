import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import Reports_API from "/src/IPConfig/configReports.js";
export const LoadReportsMixin = {
  data() {
    return {
      selectedid: "",
      starttime: 0,
      endtime: 0,
      EIStatus: "",
      EinvoiceApplicableStatus: "",
    };
  },

  methods: {
    exportRPT(row) {
      this.starttime = new Date();
      this.$q.completed = false;
      this.showLoading();
      // this.Inner_loader = true;
      let Id = row.VOBId;
      const RPTtype = "Report";
      const fullURL = window.location.href;
      const hashPart = fullURL.split("=")[1];
      var docid = hashPart;
      docid = (docid || "").split("?")[0]; // "true"
      axios
        .get(
          `${Reports_API}/FrmReportCR.aspx?docid=${docid}&id=${Id}&RPTtype=${RPTtype}&UserId=${this.userid}&Compid=${this.branchid}`,
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });

          const url = window.URL.createObjectURL(blob);

          this.openPdfDialog(url);

          // this.$q.completed = true;
        })
        .catch((error) => {
          console.error(error);

          this.closePdfDialog();
          this.Inner_loader = false;
        });
    },
    exportVPdf() {
      let Unsaved = this.ChargesGrid.filter(
        (charge) => charge.Status !== "Charge saved"
      ).length;

      let Errdec = this.ErrDesc;
      if (Unsaved === 0) {
        this.starttime = new Date();
        this.$q.completed = false;
        this.showLoading();
        let VoucherID = this.$route.query.selectedRow || this.TempID;
        this.selectedid = this.$route.query.selectedRow || this.TempID;
        let VoucherIDLen = this.VCode;
        const RPTtype = "Voucher";
        if (
          (this.VCode < 15 && (Errdec === "" || Errdec === null)) ||
          (this.VCode > 10 && this.issubmitted) ||
          this.EinvoiceApplicable !== "Y"
        ) {
          axios
            .get(
              `${Reports_API}/FrmReportCR.aspx?docid=${this.voutypeid}&id=${VoucherID}&RPTtype=${RPTtype}&UserId=${this.userid}&Compid=${this.branchid}`,
              {
                responseType: "blob",
              }
            )
            .then((response) => {
              // Create a blob object from the response data
              const blob = new Blob([response.data], {
                type: "application/pdf",
              });
              // Create a temporary URL for the blob object
              const url = window.URL.createObjectURL(blob);
              // Open the PDF viewer inside the dialog box
              this.openPdfDialog(url);

              this.$q.completed = true;
            })
            .catch((error) => {
              // Handle the error here
              console.error(error);
              // Close the dialog box in case of an error
              this.closePdfDialog();
            });
        } else if (Errdec !== "" && Errdec !== null) {
          this.$q.notify({
            message: "Voucher partially saved",
            color: "negative",
            position: "center",
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
            timeout: 1000,
          });
          this.$q.loading.hide();
        } else {
          this.$q.notify({
            message: "Save Invoice Before Print",
            color: "negative",
            position: "center",
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
            timeout: 1000,
          });
          this.$q.loading.hide();
        }
      } else {
        this.$q.notify({
          message: "Please save the invoice before printing",
          color: "negative",
          position: "center",
          classes: "negative-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
      }
    },

    // exportVPdfFromJob(row) {
    //   this.showLoading();
    //   let VoucherID = row.ID;
    //   this.selectedid = row.ID;
    //   const RPTtype = "Voucher";
    //   if (VoucherID.length < 15) {
    //     axios
    //       .get(
    //         `${Reports_API}/FrmReportCR.asmx/Reports?docid=${this.voutypeid}&id=${VoucherID}&RPTtype=${RPTtype}&UserId=${this.userid}&Compid=${this.branchid}`,
    //         {
    //           responseType: "blob",
    //         }
    //       )
    //       .then((response) => {
    //         // Create a blob object from the response data
    //         const blob = new Blob([response.data], { type: "application/pdf" });
    //         // Create a temporary URL for the blob object
    //         const url = window.URL.createObjectURL(blob);
    //         // Open the PDF viewer inside the dialog box
    //         this.openPdfDialog(url);
    //       })
    //       .catch((error) => {
    //         // Handle the error here
    //         console.error(error);
    //         // Close the dialog box in case of an error
    //         this.closePdfDialog();
    //       });
    //   } else {
    //     this.$q.notify({
    //       message: "Save Invoice Before Print",
    //       color: "negative",
    //       position: "center",
    //       timeout: 1000,
    //     });
    //   }
    // },
    GetEiErrorDesc(id) {
      let voucherId = id;
      if (voucherId !== undefined || voucherId !== "") {
        axios
          .get(`${CargoNet_API}/vouchers/${voucherId}/errordesc/`)
          .then((res) => {
            this.EIStatus = null;
            if (res.data.length > 0) {
              this.EIStatus = res.data[0].ErrDesc ? res.data[0].ErrDesc : null;
            }
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    async exportPdf(row) {
      const vid = row.ID;
      const response = await axios.get(
        `${CargoNet_API}/vouchers/${vid}/printstatus/${this.voutypeid}/P`
      );
      const result = response.data[0].Result;
      const message = response.data[0].Message;
      if (result === 1) {
        this.$q.notify({
          message: message,
          color: "negative",
          position: "center",
          classes: "negative-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
          timeout: 1000,
        });
      } else {
        // await this.GetEiErrorDesc(row.ID);
        // try {
        //   const response = await axios.get(
        //     `${CargoNet_API}/vouchers/parentvouchertype/${this.voutypeid}`
        //   );
        //   console.log(response.data[0]);
        //   this.EinvoiceApplicableStatus = response.data[0].EinvoiceApplicable;
        // } catch (error) {
        //   console.error(error);
        // }
        this.starttime = new Date();
        this.$q.completed = false;
        this.showLoading();
        let VoucherID = row.ID;
        this.selectedid = row.ID;
        const RPTtype = "Voucher";

        // if (
        //   ((this.EIStatus === null || this.EIStatus === "") &&
        //     this.EinvoiceApplicableStatus === "Y") ||
        //   this.EinvoiceApplicableStatus !== "Y"
        // ) {
        axios
          .get(
            `${Reports_API}/FrmReportCR.aspx?docid=${this.voutypeid}&id=${VoucherID}&RPTtype=${RPTtype}&UserId=${this.userid}&Compid=${this.branchid}`,
            {
              responseType: "blob",
            }
          )
          .then((response) => {
            // Create a blob object from the response data
            const blob = new Blob([response.data], { type: "application/pdf" });
            // Create a temporary URL for the blob object
            const url = window.URL.createObjectURL(blob);
            // Open the PDF viewer inside the dialog box
            this.openPdfDialog(url);
            this.TXTVoucherNo = row.VoucherNo;
          })
          .catch((error) => {
            // Handle the error here
            console.error(error);
            // Close the dialog box in case of an error
            this.closePdfDialog();
          });
        // } else {
        //   this.$q.notify({
        //     message: "Voucher partially saved",
        //     color: "negative",
        //     position: "center",
        //     timeout: 1000,
        //   });
        //   this.$q.loading.hide();
        // }
      }
    },

    exportExcel() {
      this.$q.completed = false;
      this.showLoading();
      let VoucherID = this.$route.query.selectedRow || this.TempID;
      const RPTtype = "Excel"; // Use 'Excel' for Excel export
      axios
        .get(
          `${Reports_API}/FrmReportCR.aspx?docid=${this.voutypeid}&id=${VoucherID}&RPTtype=${RPTtype}&UserId=${this.userid}&Compid=${this.branchid}`,
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          // Create a blob object from the response data
          const blob = new Blob([response.data], {
            type: "application/pdf",
          });

          // Create a temporary URL for the blob object
          const url = window.URL.createObjectURL(blob);

          // Open the dialog box based on the selected option
          this.openDialog(url, "excel");
        })
        .catch((error) => {
          // Handle the error here
          console.error(error);
          // Close the dialog box in case of an error
          this.closeDialog();
        });
    },
    downloadExcel(TXTVoucherNo) {
      let jobId = this.selectedid;
      const RPTtype = "Excel"; // Use 'Excel' for Excel export
      let id = this.FormID ? this.FormID : this.voutypeid;
      axios
        .get(
          `${Reports_API}/FrmReportCR.aspx?docid=${id}&id=${jobId}&RPTtype=${RPTtype}&DType=excel&UserId=${this.userid}&Compid=${this.branchid}`,
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          // Create a blob object from the response data
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          // Create a temporary URL for the blob object
          const url = window.URL.createObjectURL(blob);

          // Open the dialog box based on the selected option
          const filename = TXTVoucherNo + ".xls";

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);

          document.body.appendChild(link);
          link.click();

          // Clean up - remove the temporary link
          document.body.removeChild(link);
        })
        .catch((error) => {
          // Handle the error here
          console.error(error);
          // Close the dialog box in case of an error
          this.closeDialog();
        });
    },

    downloadExcelOnGrid(TXTVoucherNo, jobId, formid) {
      const RPTtype = "Excel"; // Use 'Excel' for Excel export
      let id = formid;
      axios
        .get(
          `${Reports_API}/FrmReportCR.aspx?docid=${id}&id=${jobId}&RPTtype=${RPTtype}&DType=excel&UserId=${this.userid}&Compid=${this.branchid}`,
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          // Create a blob object from the response data
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          // Create a temporary URL for the blob object
          const url = window.URL.createObjectURL(blob);

          // Open the dialog box based on the selected option
          const filename = TXTVoucherNo + ".xls";

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);

          document.body.appendChild(link);
          link.click();

          // Clean up - remove the temporary link
          document.body.removeChild(link);
        })
        .catch((error) => {
          // Handle the error here
          console.error(error);
          // Close the dialog box in case of an error
          this.closeDialog();
        });
    },
    exportannexure() {
      let VoucherID = this.params.selectedRow || this.TempID;
      let showHeader = this.Showannexureheader ? "Yes" : "No";
      axios
        .get(
          `${Reports_API}/FrmReportCR.aspx?VOBID=${VoucherID}&MReportName=VOUCHERCONTAINERANNEXURE&UserId=${this.userid}&Compid=${this.branchid}&ShowHeader=${showHeader}`,
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          // Create a blob object from the response data
          const blob = new Blob([response.data], {
            type: "application/pdf",
          });
          // Create a temporary URL for the blob object
          const url = window.URL.createObjectURL(blob);
          // Open the PDF viewer inside the dialog box
          this.openPdfDialog(url);

          this.$q.completed = true;
        })
        .catch((error) => {
          // Handle the error here
          console.error(error);
          // Close the dialog box in case of an error
          this.closePdfDialog();
        });
    },
    openDialog(url, option) {
      this.showLoading();
      // Close the dialog box if it's already open
      this.closeDialog();

      // Open the dialog box only if the URL is valid
      if (url) {
        // Set the URL and selected option to be displayed in the dialog box
        this.dialogUrl = url;
        this.selectedPrintOption = option;

        // Set the flag indicating that the dialog box is open
        this.isDialogOpen = true;
      }
      this.loading = false;
      this.endtime = new Date();
      const Ttime = this.endtime - this.starttime;
      const TtimeInSeconds = Ttime / 1000;
      console.log("Total time", TtimeInSeconds);

      this.$q.completed = true;
      if (this.$q.completed === true) {
        this.$q.loading.hide();
      }
    },

    openPdfDialog(url) {
      // Close the dialog box if it's already open
      this.closePdfDialog();

      // Open the dialog box only if the URL is valid
      if (url) {
        // Set the PDF URL to be displayed in the dialog box
        this.pdfDialogUrl = url;

        // Set the flag indicating that the dialog box is open
        this.isPdfDialogOpen = true;
      }

      this.loading = false;
      this.endtime = new Date();
      const Ttime = this.endtime - this.starttime;
      const TtimeInSeconds = Ttime / 1000;
      // console.log("Total time", TtimeInSeconds);
      this.$q.loading.hide();
    },
    closePdfDialog() {
      // Close the dialog box
      this.isPdfDialogOpen = false;
      this.pdfDialogUrl = null;
    },
  },
};
