// LoadAccountMixin.js
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const LoadAccountwithorgMixin = {
  data() {
    return {
      Masterflag: [],
      Filterfromstart: "",
    };
  },
  mounted() {
    this.GetDynamicConfig();
  },
  methods: {
    GetDynamicConfig() {
      axios
        .get(`${CargoNet_API}/Configuration/cargonetconfigflag/0`)
        .then((res) => {
          this.Masterflag = res.data;
          this.Filterfromstart = this.Masterflag.find(
            (row) => row.Name === "filterFromStart"
          )?.Flag;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async LoadOrganizationDetails() {
      const Orgname = "0";
      await axios
        .get(`${CargoNet_API}/MasterCompany/orgdetails/${Orgname}`)
        .then((res) => {
          this.orggrid = res.data;

          const fetchedData = res.data.map((org) => ({
            label: org.OrgName,
            value: org.ID,
          }));

          this.filterOrg = fetchedData;
          this.OpfilterOrg = fetchedData;
          this.OpfilterConsigneeOrg = fetchedData;
          this.OpfilterNotifyParty1Org = fetchedData;
          this.OpfilterNotifyParty2Org = fetchedData;
          this.OpfilterDeliveryAgentOrg = fetchedData;
          this.OpfilterForwarderOrg = fetchedData;
          this.OpfilterShippinglineOrg = fetchedData;
          this.OpfilterSupplierOrg = fetchedData;
          this.OpfilterCHAOrg = fetchedData;
          this.OpfilterWarehouseOrg = fetchedData;
          this.OpfilterColoaderOrg = fetchedData;
          this.OpfilterWarehouseDestinationOrg = fetchedData;
          this.OpfilterTransporterOrg = fetchedData;
          this.OpfilterTransporter1Org = fetchedData;
          this.OpfilterTransporter2Org = fetchedData;
          this.OpfilterTransporter3Org = fetchedData;
          this.OpfilterTransporter4Org = fetchedData;
          this.OpfilterOthersOrg = fetchedData;
          this.OpfilterIATAOrg = fetchedData;
          this.OpfilterBookingPartyOrg = fetchedData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async LoadOrgEntityDetails(OrgID, type) {
      const Isedit = this.formConfig
        ? this.formConfig.IsOrgEdited
        : this.IsOrgEdited;

      if (OrgID.value !== undefined && OrgID.value !== null) {
        await axios
          .get(`${CargoNet_API}/MasterCompany/accountdetails/${OrgID.value}`)
          .then((res) => {
            if (this.formConfig) {
              this.formConfig.Entitygrid = res.data;
            } else {
              this.Entitygrid = res.data;
            }

            const options = res.data.map((org) => ({
              label: org.City,
              value: org.AccID,
            }));

            const first = res.data[0];

            // Define all branch types
            const branchTypes = {
              ShipperBranch: "OpFilterShipperBranch",
              ConsigneeBranch: "OpFilterConsigneeBranch",
              NotifyParty1Branch: "OpFilterNotifyParty1Branch",
              NotifyParty2Branch: "OpFilterNotifyParty2Branch",
              DeliveryAgentBranch: "OpFilterDeliveryAgentBranch",
              ForwarderBranch: "OpFilterForwarderBranch",
              ShippinglineBranch: "OpFilterShippinglineBranch",
              SupplierBranch: "OpFilterSupplierBranch",
              CHABranch: "OpFilterCHABranch",
              WarehouseBranch: "OpFilterWarehouseBranch",
              ColoaderBranch: "OpFilterColoaderBranch",
              WarehouseDestinationBranch: "OpFilterWarehouseDestinationBranch",
              TransporterBranch: "OpFilterTransporterBranch",
              Transporter1Branch: "OpFilterTransporter1Branch",
              Transporter2Branch: "OpFilterTransporter2Branch",
              Transporter3Branch: "OpFilterTransporter3Branch",
              Transporter4Branch: "OpFilterTransporter4Branch",
              OthersBranch: "OpFilterOthersBranch",
              IATABranch: "OpFilterIATABranch",
              BookingPartyBranch: "OpFilterBookingPartyBranch",
            };

            // Dynamically set options and values
            if (this.formConfig) {
              if (branchTypes[type]) {
                const optionKey = branchTypes[type];
                this.formConfig[optionKey] = options;

                if (Isedit === true) {
                  this.GetShipmentWrapper();
                  this.formConfig.IsOrgEdited = false;
                }
                if (Isedit === false) {
                  this.localForm[type] = {
                    label: first.City,
                    value: first.AccID,
                  };
                }
              }
            } else {
              if (branchTypes[type]) {
                const optionKey = branchTypes[type];
                this[optionKey] = options;

                if (Isedit === true) {
                  this.GetShipmentWrapper();
                  this.IsOrgEdited = false;
                }
                if (Isedit === false) {
                  this[type] = { label: first.City, value: first.AccID };
                }
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    clearField(val) {
      if (val === "ShipperOrg") {
        this.localForm.TXTShipperAddress = "";
        this.localForm.ShipperBranch = ""; // Clear the ShipperEntity
      } else if (val === "ConsigneeOrg") {
        this.localForm.TXTConsigneeAddress = "";
        this.localForm.ConsigneeBranch = "";
        this.localForm.OpFilterConsigneeBranch = [];
      } else if (val === "NotifyParty1Org") {
        this.localForm.TXTNotifyParty1Address = "";
        this.localForm.NotifyParty1Branch = "";
        this.localForm.OpFilterNotifyParty1Branch = [];
      } else if (val === "NotifyParty2Org") {
        this.localForm.TXTNotifyParty2Address = "";
        this.localForm.NotifyParty2Branch = "";
        this.localForm.OpFilterNotifyParty2Branch = [];
      } else if (val === "DeliveryAgentOrg") {
        this.localForm.TXTDeliveryAgentAddress = "";
        this.localForm.DeliveryAgentBranch = "";
        this.localForm.OpFilterDeliveryAgentBranch = [];
      } else if (val === "ForwarderOrg") {
        this.localForm.ForwarderBranch = "";
        this.localForm.OpFilterForwarderBranch = [];
      } else if (val === "ShippinglineOrg") {
        this.localForm.ShippinglineBranch = "";
        this.localForm.OpFilterShippinglineBranch = [];
      } else if (val === "SupplierOrg") {
        this.localForm.SupplierBranch = "";
        this.localForm.OpFilterSupplierBranch = [];
      } else if (val === "CHAOrg") {
        this.localForm.CHABranch = "";
        this.localForm.OpFilterCHABranch = [];
      } else if (val === "WarehouseOrg") {
        this.localForm.WarehouseBranch = "";
        this.localForm.OpFilterWarehouseBranch = [];
      } else if (val === "ColoaderOrg") {
        this.localForm.ColoaderBranch = "";
        this.localForm.OpFilterColoaderBranch = [];
      } else if (val === "WarehouseDestinationOrg") {
        this.localForm.WarehouseDestinationBranch = "";
        this.localForm.OpFilterDestinationBranch = [];
      } else if (val === "TransporterOrg") {
        this.localForm.TransporterBranch = "";
        this.localForm.OpFilterTransporterBranch = [];
      } else if (val === "Transporter1Org") {
        this.localForm.Transporter1Branch = "";
        this.localForm.OpFilterTransporter1Branch = [];
      } else if (val === "Transporter2Org") {
        this.localForm.Transporter2Branch = "";
        this.localForm.OpFilterTransporter2Branch = [];
      } else if (val === "Transporter3Org") {
        this.localForm.Transporter3Branch = "";
        this.localForm.OpFilterTransporter3Branch = [];
      } else if (val === "Transporter4Org") {
        this.localForm.Transporter4Branch = "";
        this.localForm.OpFilterTransporter4Branch = [];
      } else if (val === "OthersOrg") {
        this.localForm.OthersBranch = "";
        this.localForm.OpFilterOthersBranch = [];
      } else if (val === "IATAOrg") {
        this.localForm.IATABranch = "";
        this.localForm.OpFilterIATABranch = [];
      } else if (val === "BookingPartyOrg") {
        this.localForm.BookingPartyBranch = "";
        this.localForm.OpFilterPartyBranch = [];
      } else if (val === "V1Currency") {
        formScope.VoucherCurrency = "";
      } else if (val === "V2Currency") {
        formScope.Currency = "";
      }
    },

    filterOrgFn(val, update, label) {
      if (this.formConfig) {
        update(() => {
          const needle = val.toLowerCase();
          const filterFn = (v) =>
            this.Filterfromstart !== "Y"
              ? v.label.toLowerCase().includes(needle)
              : v.label.toLowerCase().startsWith(needle);
          const filteredList = val
            ? this.formConfig.filterOrg
                .filter(filterFn)
                .sort(this.sortByLabel(needle))
            : this.formConfig.filterOrg.slice(0, 10);
          const labelMap = {
            ShipperOrg: "OpfilterOrg",
            ConsigneeOrg: "OpfilterConsigneeOrg",
            NotifyParty1Org: "OpfilterNotifyParty1Org",
            NotifyParty2Org: "OpfilterNotifyParty2Org",
            DeliveryAgentOrg: "OpfilterDeliveryAgentOrg",
            ForwarderOrg: "OpfilterForwarderOrg",
            ShippinglineOrg: "OpfilterShippinglineOrg",
            SupplierOrg: "OpfilterSupplierOrg",
            CHAOrg: "OpfilterCHAOrg",
            WarehouseOrg: "OpfilterWarehouseOrg",
            ColoaderOrg: "OpfilterColoaderOrg",
            WarehouseDestinationOrg: "OpfilterWarehouseDestinationOrg",
            TransporterOrg: "OpfilterTransporterOrg",
            Transporter1Org: "OpfilterTransporter1Org",
            Transporter2Org: "OpfilterTransporter2Org",
            Transporter3Org: "OpfilterTransporter3Org",
            Transporter4Org: "OpfilterTransporter4Org",
            OthersOrg: "OpfilterOthersOrg",
            IATAOrg: "OpfilterIATAOrg",
            BookingPartyOrg: "OpfilterBookingPartyOrg",
          };
          const targetProp = labelMap[label];
          if (targetProp) {
            this.localForm[targetProp] = filteredList;
            if (label === "Airline") {
              this.opfiltermasterAirline = filteredList;
            }
          }

          if (filteredList.length === 0) {
            this.$q.notify({
              // type: "warning",
              position: "center",
              classes: "warning-alert", // swap per type
              actions: [{ icon: "close", round: true, dense: true }],
              message: `No result found for ${label}`,
              timeout: 2000,
            });
          }

          if (this.formConfig.isJobEditing) {
            this.formConfig.ischangeAddress = true;
          }
        });
      } else {
        update(() => {
          const needle = val.toLowerCase();
          const filterFn = (v) =>
            this.Filterfromstart !== "Y"
              ? v.label.toLowerCase().includes(needle)
              : v.label.toLowerCase().startsWith(needle);
          const filteredList = val
            ? this.filterOrg.filter(filterFn).sort(this.sortByLabel(needle))
            : this.filterOrg.slice(0, 10);
          const labelMap = {
            ShipperOrg: "OpfilterOrg",
            ConsigneeOrg: "OpfilterConsigneeOrg",
            NotifyParty1Org: "OpfilterNotifyParty1Org",
            NotifyParty2Org: "OpfilterNotifyParty2Org",
            DeliveryAgentOrg: "OpfilterDeliveryAgentOrg",
            ForwarderOrg: "OpfilterForwarderOrg",
            ShippinglineOrg: "OpfilterShippinglineOrg",
            SupplierOrg: "OpfilterSupplierOrg",
            CHAOrg: "OpfilterCHAOrg",
            WarehouseOrg: "OpfilterWarehouseOrg",
            ColoaderOrg: "OpfilterColoaderOrg",
            WarehouseDestinationOrg: "OpfilterWarehouseDestinationOrg",
            TransporterOrg: "OpfilterTransporterOrg",
            Transporter1Org: "OpfilterTransporter1Org",
            Transporter2Org: "OpfilterTransporter2Org",
            Transporter3Org: "OpfilterTransporter3Org",
            Transporter4Org: "OpfilterTransporter4Org",
            OthersOrg: "OpfilterOthersOrg",
            IATAOrg: "OpfilterIATAOrg",
            BookingPartyOrg: "OpfilterBookingPartyOrg",
          };
          const targetProp = labelMap[label];
          if (targetProp) {
            this[targetProp] = filteredList;
            if (label === "Airline") {
              this.opfiltermasterAirline = filteredList;
            }
          }

          if (filteredList.length === 0) {
            this.$q.notify({
              // type: "warning",
              position: "center",
              classes: "warning-alert", // swap per type
              actions: [{ icon: "close", round: true, dense: true }],
              message: `No result found for ${label}`,
              timeout: 2000,
            });
          }

          if (this.isJobEditing) {
            this.ischangeAddress = true;
          }
        });
      }
    },

    filterOrgEntityFn(val, update, label) {
      if (this.formConfig) {
        update(() => {
          const needle = val.toLowerCase();
          const filterFn = (v) => v.label.toLowerCase().includes(needle);
          const filteredList = val
            ? this.formConfig.Entitygrid.filter(filterFn).sort(
                this.sortByLabel(needle)
              )
            : this.formConfig.Entitygrid.slice(0, 10);
          const labelMap = {
            ShipperBranch: "Entitygrid",
          };
          const targetProp = labelMap[label];
          if (targetProp) {
            this.formConfig[targetProp] = filteredList;
          }

          if (filteredList.length === 0) {
            this.$q.notify({
              // type: "warning",
              position: "center",
              classes: "warning-alert", // swap per type
              actions: [{ icon: "close", round: true, dense: true }],
              message: `No result found for ${label}`,
              timeout: 2000,
            });
          }

          if (this.formConfig.isJobEditing) {
            this.formConfig.ischangeAddress = true;
          }
        });
      } else {
        update(() => {
          const needle = val.toLowerCase();
          const filterFn = (v) => v.label.toLowerCase().includes(needle);
          const filteredList = val
            ? this.Entitygrid.filter(filterFn).sort(this.sortByLabel(needle))
            : this.Entitygrid.slice(0, 10);
          const labelMap = {
            ShipperBranch: "Entitygrid",
          };
          const targetProp = labelMap[label];
          if (targetProp) {
            this[targetProp] = filteredList;
          }

          if (filteredList.length === 0) {
            this.$q.notify({
              // type: "warning",
              position: "center",
              classes: "warning-alert", // swap per type
              actions: [{ icon: "close", round: true, dense: true }],
              message: `No result found for ${label}`,
              timeout: 2000,
            });
          }

          if (this.isJobEditing) {
            this.ischangeAddress = true;
          }
        });
      }
    },
    // filterAccountFn(val, update, label) {
    //   update(() => {
    //     const needle = val.toLowerCase();
    //     const filterFn = (v) => v.label.toLowerCase().includes(needle);
    //     const filteredList = val
    //       ? this.filterAccount.filter(filterFn).sort(this.sortByLabel(needle))
    //       : this.filterAccount.slice(0, 10);

    //     // Map labels to their corresponding data targets
    //     const labelMap = {
    //       // Job
    //       // Shipper: "opfilterShipper",
    //       Consignee: "opfilterConsignee",
    //       NotifyParty1: "opfilterNotifyParty1",
    //       NotifyParty2: "opfilterNotifyParty2",
    //       DeliveryAgent: "opfilterDeliveryAgent",
    //       Supplier: "opfilterSupplier",
    //       Shippingline: "opfilterShippingline",
    //       CHA: "opfilterCHA",
    //       Coloader: "opfilterColoader",
    //       Warehouse: "opfilterWarehouse",
    //       Transporter: "opfilterTransporter",
    //       Transporter1: "opfilterTransporter1",
    //       Transporter2: "opfilterTransporter2",
    //       Transporter3: "opfilterTransporter3",
    //       Transporter4: "opfilterTransporter4",
    //       WarehouseDestination: "opfilterWarehouseDestination",
    //       ApplyTo: "opfilterApplyTo",
    //       ContainerTransporter: "opfilterContainerTransporter",
    //       Airline: "opfilterAirline",
    //       BookingParty: "opfilterBookingParty",
    //       Others: "opfilterOthers",
    //       IATA: "opfilterIATA",
    //       NVOCC: "opfilterNVOCC",
    //       Forwarder: "opfilterForwarder",
    //       // Voucher
    //       OtherDetailsShipper: "opfilterOtherDetailsShipper",
    //       // Lead
    //       Carrier: "opfilterCarrier",
    //       // Quote
    //       Customer: "opCustomer",
    //       OceanCarrier: "opOceanCarrier",
    //       Overseasagent: "opfilterDeliveryAgent", // intentional reuse?
    //     };

    //     const targetProp = labelMap[label];
    //     if (targetProp) {
    //       this[targetProp] = filteredList;
    //       if (label === "Airline") {
    //         this.opfiltermasterAirline = filteredList;
    //       }
    //     }

    //     if (filteredList.length === 0) {
    //       this.$q.notify({
    //         type: "warning",
    //         position: "center",
    //         message: `No result found for ${label}`,
    //         timeout: 2000,
    //       });
    //     }

    //     if (this.isJobEditing || this.isVoucherEditing) {
    //       this.ischangeAddress = true;
    //     }
    //   });
    // },

    // filterAccountFn(val, update, label) {
    //   update(() => {
    //     if (val === "") {
    //       //Job
    //       if (label === "Shipper") {
    //         this.opfilterShipper = this.filterAccount.slice(0, 10);
    //       } else if (label === "Consignee") {
    //         this.opfilterConsignee = this.filterAccount.slice(0, 10);
    //       } else if (label === "NotifyParty1") {
    //         this.opfilterNotifyParty1 = this.filterAccount.slice(0, 10);
    //       } else if (label === "NotifyParty2") {
    //         this.opfilterNotifyParty2 = this.filterAccount.slice(0, 10);
    //       } else if (label === "DeliveryAgent") {
    //         this.opfilterDeliveryAgent = this.filterAccount.slice(0, 10);
    //       } else if (label === "Supplier") {
    //         this.opfilterSupplier = this.filterAccount.slice(0, 10);
    //       } else if (label === "Shippingline") {
    //         this.opfilterShippingline = this.filterAccount.slice(0, 10);
    //       } else if (label === "CHA") {
    //         this.opfilterCHA = this.filterAccount.slice(0, 10);
    //       } else if (label === "Coloader") {
    //         this.opfilterColoader = this.filterAccount.slice(0, 10);
    //       } else if (label === "Warehouse") {
    //         this.opfilterWarehouse = this.filterAccount.slice(0, 10);
    //       } else if (label === "Transporter") {
    //         this.opfilterTransporter = this.filterAccount.slice(0, 10);
    //       } else if (label === "WarehouseDestination") {
    //         this.opfilterWarehouseDestination = this.filterAccount.slice(0, 10);
    //       } else if (label === "ApplyTo") {
    //         this.opfilterApplyTo = this.filterAccount.slice(0, 10);
    //       } else if (label === "ContainerTransporter") {
    //         this.opfilterContainerTransporter = this.filterAccount.slice(0, 10);
    //       } else if (label === "Airline") {
    //         this.opfilterAirline = this.filterAccount.slice(0, 10);
    //         this.opfiltermasterAirline = this.filterAccount.slice(0, 10);
    //       } else if (label === "BookingParty") {
    //         this.opfilterBookingParty = this.filterAccount.slice(0, 10);
    //       }
    //       //Voucher
    //       else if (label === "OtherDetailsShipper") {
    //         this.opfilterOtherDetailsShipper = this.filterAccount.slice(0, 10);
    //       }
    //       //Lead
    //       else if (label === "Carrier") {
    //         this.opfilterCarrier = this.filterAccount.slice(0, 10);
    //       }
    //       //Quote
    //       else if (label === "Customer") {
    //         this.opCustomer = this.filterAccount.slice(0, 10);
    //       } else if (label === "OceanCarrier") {
    //         this.opOceanCarrier = this.filterAccount.slice(0, 10);
    //       } else if (label === "Overseasagent") {
    //         this.opfilterDeliveryAgent = this.filterAccount.slice(0, 10);
    //       } else if (label === "Transporter1") {
    //         this.opfilterTransporter1 = this.filterAccount.slice(0, 10);
    //       } else if (label === "Transporter2") {
    //         this.opfilterTransporter2 = this.filterAccount.slice(0, 10);
    //       } else if (label === "Transporter3") {
    //         this.opfilterTransporter3 = this.filterAccount.slice(0, 10);
    //       } else if (label === "Transporter4") {
    //         this.opfilterTransporter4 = this.filterAccount.slice(0, 10);
    //       } else if (label === "Others") {
    //         this.opfilterOthers = this.filterAccount.slice(0, 10);
    //       } else if (label === "IATA") {
    //         this.opfilterIATA = this.filterAccount.slice(0, 10);
    //       } else if (label === "Forwarder") {
    //         this.opfilterForwarder = this.filterAccount.slice(0, 10);
    //       } else if (label === "NVOCC") {
    //         this.opfilterNVOCC = this.filterAccount.slice(0, 10);
    //       }
    //     } else {
    //       const needle = val.toLowerCase();
    //       //Job
    //       if (label === "Shipper") {
    //         this.opfilterShipper = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().includes(needle))
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Consignee") {
    //         this.opfilterConsignee = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "NotifyParty1") {
    //         this.opfilterNotifyParty1 = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "NotifyParty2") {
    //         this.opfilterNotifyParty2 = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "DeliveryAgent") {
    //         this.opfilterDeliveryAgent = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Supplier") {
    //         this.opfilterSupplier = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Shippingline") {
    //         this.opfilterShippingline = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "CHA") {
    //         this.opfilterCHA = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Coloader") {
    //         this.opfilterColoader = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Warehouse") {
    //         this.opfilterWarehouse = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Transporter") {
    //         this.opfilterTransporter = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Transporter1") {
    //         this.opfilterTransporter1 = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Transporter2") {
    //         this.opfilterTransporter2 = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Transporter3") {
    //         this.opfilterTransporter3 = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Transporter4") {
    //         this.opfilterTransporter4 = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "Others") {
    //         this.opfilterOthers = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "IATA") {
    //         this.opfilterIATA = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "BookingParty") {
    //         this.opfilterBookingParty = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "WarehouseDestination") {
    //         this.opfilterWarehouseDestination = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       if (label === "ApplyTo") {
    //         this.opfilterApplyTo = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       } else if (label === "ContainerTransporter") {
    //         this.opfilterContainerTransporter = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       } else if (label === "Airline") {
    //         this.opfilterAirline = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       } else if (label === "NVOCC") {
    //         this.opfilterNVOCC = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       //Voucher
    //       else if (label === "OtherDetailsShipper") {
    //         this.opfilterOtherDetailsShipper = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       //Lead
    //       else if (label === "Carrier") {
    //         this.opfilterCarrier = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //       //Quote
    //       else if (label === "Customer") {
    //         this.opCustomer = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       } else if (label === "OceanCarrier") {
    //         this.opOceanCarrier = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       } else if (label === "Overseasagent") {
    //         this.opfilterDeliveryAgent = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       } else if (label === "Forwarder") {
    //         this.opfilterForwarder = this.filterAccount
    //           .filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
    //           .sort(this.sortByLabel(needle));
    //       }
    //     }
    //     update();
    //     if (this.isJobEditing) {
    //       this.ischangeAddress = true;
    //     }
    //     if (this.isVoucherEditing) {
    //       this.ischangeAddress = true;
    //     }
    //   });
    // },
    sortByLabel(needle) {
      return (a, b) => {
        const aStartsWith = a.label.toLowerCase().startsWith(needle);
        const bStartsWith = b.label.toLowerCase().startsWith(needle);

        if (aStartsWith && !bStartsWith) return -1; // a comes first
        if (!aStartsWith && bStartsWith) return 1; // b comes first

        // If both or neither start with the needle, sort alphabetically
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
      };
    },
  },
};
