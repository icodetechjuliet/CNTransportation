import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import CustomLoader from "src/pages/loader.vue";
export const LoadProgressMixin = {
  data() {
    return {};
  },
  computed: {
    PartyprogressValue() {
      const totalFields = 3;
      const filledFields = [
        this.Shipper,
        this.TXTShipperAddress,
        this.Salesman,
      ].filter((value) => value && value !== "").length;
      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },
    GeneralprogressValue() {
      const totalFields = 2;
      const filledFields = [this.TermsofShipment, this.JobType].filter(
        (value) => value && value !== ""
      ).length;
      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },
    RoutingprogressValue() {
      const totalFields = 4;
      const filledFields = [
        this.PlaceofReceipt,
        this.PlaceofDelivery,
        this.PortofLoading,
        this.PortofDischarge,
      ].filter((value) => value && value !== "").length;
      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },
    ContainerprogressValue() {
      if (this.ContainerGrid.length === 0) {
        const totalFields = 2;
        const filledFields = [this.TXTContainerNo, this.containerType].filter(
          (value) => value && value !== ""
        ).length;
        const tabratio = 100 / totalFields;
        const level = filledFields * tabratio + "%";
        return level;
      } else {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      }
    },

    CommodityprogressValue() {
      const totalFields = 5;
      const filledFields = [
        this.ComChargeType,
        this.TXTComGrosswt,
        this.TXTComNetwt1,
        this.TXTComNoofPkg,
        this.TXTComVolume,
      ].filter((value) => value && value !== "").length;
      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },
    ShipmentRoutingprogressValue() {
      if (this.shipmentplandtls.length === 0) {
        const totalFields = 5;
        const filledFields = [
          this.FromPort,
          this.ToPort,
          this.VesselName,
          this.TXTRoutingVoyageNo,
          this.TXTRoutingStatus,
        ].filter((value) => value && value !== "").length;
        const tabratio = 100 / totalFields;
        const level = filledFields * tabratio + "%";
        return level;
      } else {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      }
    },

    ChargeprogressValue() {
      // const totalFields = 1;
      // const filledFields = [this.ChargesGrid.Id].filter(
      //   (value) => value && value !== ""
      // ).length;
      // const tabratio = 100 / totalFields;
      // const level = filledFields * tabratio + "%";
      // return level;

      if (this.ChargesGrid.length > 0) {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      } else {
        const filledFields = 0;
        const level = filledFields + "%";
        return level;
      }
    },
    DoccusprogressValue() {
      const totalFields = this.apiDocumentResponse.length;

      const unfilledFields = this.apiDocumentResponse.filter((record) =>
        Object.values(record).some((value) => value === "")
      );
      if (totalFields.length !== 0) {
        const tabratio = 100 / totalFields;
        const docfilleddata = totalFields - unfilledFields.length;
        const level = docfilleddata * tabratio + "%";
        return level;
      } else {
        return 0;
      }
    },
    EDocsprogressValue() {
      const totalFields = 1;
      const filledFields = [this.getuplodfile.length].filter(
        (value) => value && value !== ""
      ).length;
      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },

    MasterUpdateGeneralprogressValue() {
      const totalFields = 4;
      const filledFields = [
        this.Overseasagent,
        this.Airline,
        this.PlaceofReceipt,
        this.PlaceofDelivery,
      ].filter((value) => value && value !== "").length;
      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },
    MasterPartyprogressValue() {
      const totalFields = 3;
      const filledFields = [
        this.Shipper,
        this.TXTShipperAddress,
        this.Salesman,
      ].filter((value) => value && value !== "").length;
      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },
    MasterHouseprogressValue() {
      if (this.HouseGrid.length === 0) {
        const totalFields = 2;
        const filledFields = [this.TXTHouseNo, this.TXTHouseDate].filter(
          (value) => value && value !== ""
        ).length;
        const tabratio = 100 / totalFields;
        const level = filledFields * tabratio + "%";
        return level;
      } else {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      }
    },

    MasterContainerprogressValue() {
      if (this.ContainerGrid.length === 0) {
        const totalFields = 2;
        const filledFields = [this.TXTContainerNo, this.containerType].filter(
          (value) => value && value !== ""
        ).length;
        const tabratio = 100 / totalFields;
        const level = filledFields * tabratio + "%";
        return level;
      } else {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      }
    },

    MasterRoutingprogressValue() {
      if (this.shipmentplandtls.length === 0) {
        const totalFields = 3;
        const filledFields = [
          this.FromPort,
          this.ToPort,
          this.TXTRoutingStatus,
        ].filter((value) => value && value !== "").length;
        const tabratio = 100 / totalFields;
        const level = filledFields * tabratio + "%";
        return level;
      } else {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      }
    },

    MasterDoccusprogressValue() {
      const totalFields = this.apiDocumentResponse.length;

      const unfilledFields = this.apiDocumentResponse.filter((record) =>
        Object.values(record).some((value) => value === "")
      );
      if (totalFields.length !== 0) {
        const tabratio = 100 / totalFields;
        const docfilleddata = totalFields - unfilledFields.length;
        const level = docfilleddata * tabratio + "%";
        return level;
      } else {
        return 0;
      }
    },
    GeneraltrackColor() {
      const progress = parseFloat(this.GeneralprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 67) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    ConsoleGeneraltrackColor() {
      const progress = parseFloat(this.computedGeneralDetailsProgress);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 67) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    PartytrackColor() {
      const progress = parseFloat(this.PartyprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 67) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    RoutingtrackColor() {
      const progress = parseFloat(this.RoutingprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    ContainertrackColor() {
      const progress = parseFloat(this.ContainerprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },

    CommoditytrackColor() {
      const progress = parseFloat(this.CommodityprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    ShipmentRoutingtrackColor() {
      const progress = parseFloat(this.ShipmentRoutingprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    ChargetrackColor() {
      const progress = parseFloat(this.ChargeprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    DoccustrackColor() {
      const progress = parseFloat(this.DoccusprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },

    EDocstrackColor() {
      const progress = parseFloat(this.EDocsprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    MasterGeneraltrackColor() {
      const progress = parseFloat(this.MasterUpdateGeneralprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    MasterPartytrackColor() {
      const progress = parseFloat(this.MasterPartyprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    MasterContainertrackColor() {
      const progress = parseFloat(this.MasterContainerprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    MasterRoutingtrackColor() {
      const progress = parseFloat(this.MasterRoutingprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },
    MasterDoccustrackColor() {
      const progress = parseFloat(this.MasterDoccusprogressValue);
      if (progress < 34) {
        return "rgb(235 10 10)";
      } else if (progress < 90) {
        return "rgb(255 149 10)";
      } else {
        return "rgb(18 233 120)";
      }
    },

    //Dynamuc Progress Bar for Master Org based on mandatory fields
    MasterOrgprogressValue() {
      const masterFields = this.mandatoryfields.filter(
        (field) => field.description === "MasterAccount"
      );

      const totalFields = masterFields.length;
      if (totalFields === 0) return 0;

      const filledFields = masterFields.filter((field) => {
        const fieldValue = this[`TXT${field.name}`] || this[field.name];
        return fieldValue && fieldValue !== "";
      }).length;

      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },

    MasterOrgtrackColor() {
      const progress = parseFloat(this.MasterOrgprogressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },

    MasterOrgBankprogressValue() {
      const masterFields = this.mandatoryfields.filter(
        (field) => field.description === "MasterAccountBankdetails"
      );

      const totalFields = masterFields.length;
      if (totalFields === 0) return 0;

      const filledFields = masterFields.filter((field) => {
        const fieldValue = this[`TXT${field.name}`] || this[field.name];
        return fieldValue && fieldValue !== "";
      }).length;

      const tabratio = 100 / totalFields;
      const level = filledFields * tabratio + "%";
      return level;
    },
    MasterOrgBanktrackColor() {
      const progress = parseFloat(this.MasterOrgBankprogressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
    MasterOrgContactprogressValue() {
      if (this.ContactGrid.length > 0) {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      } else {
        const filledFields = 0;
        const level = filledFields + "%";
        return level;
      }
    },
    MasterOrgContacttrackColor() {
      const progress = parseFloat(this.MasterOrgContactprogressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
    MasterOrgMultiaddressValue() {
      if (this.MultipleAddressGrid.length > 0) {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      } else {
        const filledFields = 0;
        const level = filledFields + "%";
        return level;
      }
    },
    MasterOrgMultiaddresstrackColor() {
      const progress = parseFloat(this.MasterOrgMultiaddressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
    MasterOrgMultiaddressValue() {
      if (this.MultipleAddressGrid.length > 0) {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      } else {
        const filledFields = 0;
        const level = filledFields + "%";
        return level;
      }
    },
    MasterOrgMultiaddresstrackColor() {
      const progress = parseFloat(this.MasterOrgMultiaddressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
    MasterOrgRolesprogressValue() {
      if (this.RolesGrid.length > 0) {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      } else {
        const filledFields = 0;
        const level = filledFields + "%";
        return level;
      }
    },
    MasterOrgRolestrackColor() {
      const progress = parseFloat(this.MasterOrgRolesprogressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
    MasterOrgDocumentprogressValue() {
      if (this.RolesGrid.length > 0) {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      } else {
        const filledFields = 0;
        const level = filledFields + "%";
        return level;
      }
    },
    MasterOrgDocumenttrackColor() {
      const progress = parseFloat(this.MasterOrgDocumentprogressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
    MasterOrgCreditappprogressValue() {
      if (this.CreditApplicationGrid && this.CreditApplicationGrid.length > 0) {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      } else {
        const filledFields = 0;
        const level = filledFields + "%";
        return level;
      }
    },
    MasterOrgCreditapptrackColor() {
      const progress = parseFloat(this.MasterOrgCreditappprogressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
    MasterOrgGSTINprogressValue() {
      if (this.GSTINAckGrid.length > 0) {
        const filledFields = 100;
        const level = filledFields + "%";
        return level;
      } else {
        const filledFields = 0;
        const level = filledFields + "%";
        return level;
      }
    },
    MasterOrgGSTINtrackColor() {
      const progress = parseFloat(this.MasterOrgGSTINprogressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
    MasterHousetrackColor() {
      const progress = parseFloat(this.MasterHouseprogressValue);
      if (progress !== 0) {
        if (progress < 34) {
          return "rgb(235 10 10)";
        } else if (progress < 90) {
          return "rgb(255 149 10)";
        } else {
          return "rgba(0, 128, 0, 0.8)";
        }
      }
    },
  },
};
