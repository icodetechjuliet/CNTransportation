// LoadPortMixin.js
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const LoadPortMixin = {
  data() {
    return {
      filterByCode: "N",
    };
  },
  methods: {
    LoadAllPort() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${CargoNet_API}/industrydata/port`)
          .then((res) => {
            const fetchedData = res.data.map((Port) => ({
              label: Port.name,
              value: Port.id,
            }));
            this.Allports = fetchedData;
            // //Job
            // this.filterPort = fetchedData;
            // this.opfilterPlaceofReceipt = fetchedData.slice();
            // this.opfilterPortofLoading = fetchedData.slice();
            // this.opfilterPortofDischarge = fetchedData.slice();
            // this.opfilterPlaceofDelivery = fetchedData.slice();
            // this.opfilterTransShipment = fetchedData.slice();
            // this.opfilterFromPort = fetchedData.slice();
            // this.opfilterToPort = fetchedData.slice();
            // //Vouchers
            // this.opfilterOtherDtlsPlaceofReceipt = fetchedData.slice();
            // this.opfilterOtherDtlsPortofLoading = fetchedData.slice();
            // this.opfilterOtherDtlsPortofDischarge = fetchedData.slice();
            // this.opfilterOtherDtlsPortofDelivery = fetchedData.slice();
            // //Quote
            // this.opPlaceofReceiptC = fetchedData.slice();
            // this.opPlaceofDeliveryC = fetchedData.slice();
            // this.opPortofLoadingC = fetchedData.slice();
            // this.opPortofDestinationC = fetchedData.slice();
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    async GetPortFilterBy() {
      try {
        const res = await axios.get(
          `${CargoNet_API}/Configuration/CargonetConfig?configName=PortSearchByCode`
        );
        this.filterByCode = res.data;
      } catch (err) {
        console.error("Error fetching filter type:", err);
      }
    },
    async LoadPort(ModuleId) {
      await this.LoadAllPort();
      await this.LoadPorts(ModuleId);
      await this.LoadPlaceOf(ModuleId);
    },
    async LoadPorts(ModuleId) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${CargoNet_API}/industrydata/port/${ModuleId}?portPlaceType=Port`
          )
          .then((res) => {
            const fetchedData = res.data.map((Port) => ({
              label: Port.name,
              value: Port.id,
              code: Port.code,
            }));
            // this.Allports = fetchedData;
            //Job
            this.filterPort = fetchedData;
            this.opfilterPortofLoading = fetchedData.slice();
            this.opfilterPortofDischarge = fetchedData.slice();

            //Vouchers
            this.opfilterOtherDtlsPortofLoading = fetchedData.slice();
            this.opfilterOtherDtlsPortofDischarge = fetchedData.slice();

            //Quote
            this.opPortofLoadingC = fetchedData.slice();
            this.opPortofDestinationC = fetchedData.slice();
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    async LoadPlaceOf(ModuleId) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${CargoNet_API}/industrydata/port/${ModuleId}?portPlaceType=Place`
          )
          .then((res) => {
            const PlaceOf = res.data.map((Port) => ({
              label: Port.name,
              value: Port.id,
              code: Port.code,
            }));
            this.AllPlaceOf = PlaceOf;
            //Job
            this.filterPlaceOf = PlaceOf;
            this.opfilterPlaceofReceipt = PlaceOf.slice();
            this.opfilterPlaceofDelivery = PlaceOf.slice();
            this.opfilterTransShipment = PlaceOf.slice();
            this.opfilterFromPort = PlaceOf.slice();
            this.opfilterToPort = PlaceOf.slice();
            //Vouchers
            this.opfilterOtherDtlsPlaceofReceipt = PlaceOf.slice();
            this.opfilterOtherDtlsPortofDelivery = PlaceOf.slice();
            //Quote
            this.opPlaceofReceiptC = PlaceOf.slice();
            this.opPlaceofDeliveryC = PlaceOf.slice();

            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    async filterroutingPortFn(val, update) {
      await this.GetPortFilterBy();
      update(() => {
        if (val === "") {
          this.localForm.opfilterFromPort = this.formConfig.filterPlaceOf.slice(
            0,
            10
          );
          this.localForm.opfilterToPort = this.formConfig.filterPlaceOf.slice(
            0,
            10
          );
        } else {
          const needle = val.toLowerCase();

          // this.localForm.opfilterFromPort = this.formConfig.filterPlaceOf.filter(
          //   (v) => v.label.toLowerCase().indexOf(needle) > -1
          // );

          // this.localForm.opfilterToPort = this.formConfig.filterPlaceOf.filter(
          //   (v) => v.label.toLowerCase().indexOf(needle) > -1
          // );
          if (this.filterByCode === "Y") {
            this.localForm.opfilterFromPort =
              this.formConfig.filterPlaceOf.filter(
                (v) => v.code.toLowerCase().indexOf(needle) > -1
              );
          } else {
            this.localForm.opfilterFromPort =
              this.formConfig.filterPlaceOf.filter(
                (v) => v.label.toLowerCase().indexOf(needle) > -1
              );
          }
          if (this.filterByCode === "Y") {
            this.localForm.opfilterToPort =
              this.formConfig.filterPlaceOf.filter(
                (v) => v.code.toLowerCase().indexOf(needle) > -1
              );
          } else {
            this.localForm.opfilterToPort =
              this.formConfig.filterPlaceOf.filter(
                (v) => v.label.toLowerCase().indexOf(needle) > -1
              );
          }
        }
        update();
      });
    },
    // filterPortFn(val, update) {
    //   update(() => {
    //     if (val === "") {
    //       // Job
    //       this.localForm.opfilterPlaceofReceipt =
    //         this.formConfig.filterPort.slice(0, 10);
    //       this.opfilterPortofDischarge = this.filterPort.slice(0, 10);
    //       this.opfilterPortofLoading = this.filterPort.slice(0, 10);
    //       this.localForm.opfilterPlaceofDelivery =
    //         this.formConfig.filterPort.slice(0, 10);
    //       this.opfilterTransShipment = this.filterPort.slice(0, 10);
    //       this.opfilterFromPort = this.filterPort.slice(0, 10);
    //       this.opfilterToPort = this.filterPort.slice(0, 10);
    //       //Vouchers
    //       this.opfilterOtherDtlsPlaceofReceipt = this.filterPort.slice(0, 10);
    //       this.opfilterOtherDtlsPortofLoading = this.filterPort.slice(0, 10);
    //       this.opfilterOtherDtlsPortofDischarge = this.filterPort.slice(0, 10);
    //       this.opfilterOtherDtlsPortofDelivery = this.filterPort.slice(0, 10);
    //       //Quote
    //       this.opPlaceofReceiptC = this.filterPort.slice(0, 10);
    //       this.opPlaceofDeliveryC = this.filterPort.slice(0, 10);
    //       this.opPortofLoadingC = this.filterPort.slice(0, 10);
    //       this.opPortofDestinationC = this.filterPort.slice(0, 10);
    //     } else {
    //       const needle = val.toLowerCase();
    //       // Job
    //       this.opfilterPlaceofReceipt = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterPortofDischarge = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterPortofLoading = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.localForm.opfilterPlaceofDelivery =
    //         this.formConfig.filterPort.filter(
    //           (v) => v.label.toLowerCase().indexOf(needle) > -1
    //         );
    //       this.opfilterTransShipment = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterFromPort = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterToPort = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       //Vouchers
    //       this.opfilterOtherDtlsPlaceofReceipt = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterOtherDtlsPortofLoading = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterOtherDtlsPortofDischarge = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterOtherDtlsPortofDelivery = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       //Quote
    //       this.opPlaceofReceiptC = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opPlaceofDeliveryC = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opPortofLoadingC = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opPortofDestinationC = this.filterPort.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //     }
    //     update();
    //   });
    // },

    async filterPortFn(val, update) {
      await this.GetPortFilterBy();
      update(() => {
        const portList = this.filterPort
          ? this.filterPort
          : this.formConfig.filterPort;

        const jobFields = [
          "opfilterPortofDischarge",
          "opfilterPortofLoading",
          "opfilterOrigin",
          "opfilterDestination",
        ];

        const voucherFields = [
          "opfilterOtherDtlsPortofLoading",
          "opfilterOtherDtlsPortofDischarge",
        ];

        const quoteFields = ["opPortofLoadingC", "opPortofDestinationC"];

        if (val === "") {
          // Set first 10 ports
          if (this.localForm) {
            jobFields.forEach((field) => {
              this.localForm[field] = portList.slice(0, 10);
            });
          } else {
            jobFields.forEach((field) => {
              this[field] = portList.slice(0, 10);
            });
          }

          voucherFields.forEach((field) => {
            this[field] = portList.slice(0, 10);
          });

          quoteFields.forEach((field) => {
            this[field] = portList.slice(0, 10);
          });
        } else {
          const needle = val.toLowerCase();
          const filteredPorts = portList.filter((v) => {
            if (this.filterByCode === "Y") {
              return v.code.toLowerCase().includes(needle);
            } else {
              return v.label.toLowerCase().includes(needle);
            }
          });

          if (this.localForm) {
            jobFields.forEach((field) => {
              this.localForm[field] = filteredPorts;
            });
          } else {
            jobFields.forEach((field) => {
              this[field] = filteredPorts;
            });
          }
          voucherFields.forEach((field) => {
            this[field] = filteredPorts;
          });

          quoteFields.forEach((field) => {
            this[field] = filteredPorts;
          });
        }

        update();
      });
    },
    async filterPlaceOfFn(val, update) {
      await this.GetPortFilterBy();

      update(() => {
        const portList = this.filterPlaceOf
          ? this.filterPlaceOf
          : this.formConfig.filterPlaceOf;

        const jobFields = [
          "opfilterPlaceofReceipt",
          "opfilterPlaceofDelivery",
          "opfilterTransShipment",
          "opfilterFromPort",
          "opfilterToPort",
          "opfilterOrigin",
          "opfilterDestination",
        ];

        const voucherFields = [
          "opfilterOtherDtlsPlaceofReceipt",
          "opfilterOtherDtlsPortofDelivery",
        ];

        const quoteFields = ["opPlaceofReceiptC", "opPlaceofDeliveryC"];

        if (val === "") {
          // Set first 10 ports
          if (this.localForm) {
            jobFields.forEach((field) => {
              this.localForm[field] = portList.slice(0, 10);
            });
          } else {
            jobFields.forEach((field) => {
              this[field] = portList.slice(0, 10);
            });
          }

          voucherFields.forEach((field) => {
            this[field] = portList.slice(0, 10);
          });

          quoteFields.forEach((field) => {
            this[field] = portList.slice(0, 10);
          });
        } else {
          const needle = val.toLowerCase();
          const filteredPorts = portList.filter((v) => {
            if (this.filterByCode === "Y") {
              return v.code.toLowerCase().includes(needle);
            } else {
              return v.label.toLowerCase().includes(needle);
            }
          });
          if (this.localForm) {
            jobFields.forEach((field) => {
              this.localForm[field] = filteredPorts;
            });
          } else {
            jobFields.forEach((field) => {
              this[field] = filteredPorts;
            });
          }
          voucherFields.forEach((field) => {
            this[field] = filteredPorts;
          });

          quoteFields.forEach((field) => {
            this[field] = filteredPorts;
          });
        }

        update();
      });
    },
  },
};
