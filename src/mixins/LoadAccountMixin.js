// LoadAccountMixin.js
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const LoadAccountMixin = {
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
    LoadAccount() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${CargoNet_API}/accounts`)
          .then((res) => {
            const fetchedData = res.data.map((Account) => ({
              label: Account.name,
              value: Account.id,
              description: Account.description,
            }));
            //Job
            this.filterAccount = fetchedData;
            this.opfilterShipper = fetchedData;
            this.opfilterConsignee = fetchedData;
            this.opfilterNotifyParty1 = fetchedData;
            this.opfilterNotifyParty2 = fetchedData;
            this.opfilterDeliveryAgent = fetchedData;
            this.opfilterForwarder = fetchedData;
            this.opfilterSupplier = fetchedData;
            this.opfilterShippingline = fetchedData;
            this.opfilterCHA = fetchedData;
            this.opfilterColoader = fetchedData;
            this.opfilterWarehouse = fetchedData;
            this.opfilterTransporter = fetchedData;
            this.opfilterTransporter1 = fetchedData;
            this.opfilterTransporter2 = fetchedData;
            this.opfilterTransporter3 = fetchedData;
            this.opfilterTransporter4 = fetchedData;
            this.opfilterOthers = fetchedData;
            this.opfilterIATA = fetchedData;
            this.opfilterWarehouseDestination = fetchedData;
            this.opfilterApplyTo = fetchedData;
            this.opfilterContainerTransporter = fetchedData;
            this.opfilterBookingParty = fetchedData;
            //Voucher
            this.opfilterOtherDetailsShipper = fetchedData;
            //Lead
            this.opfilterCarrier = fetchedData;
            //Quote
            this.opCustomer = fetchedData;
            this.opOceanCarrier = fetchedData;
            this.opfiltermasterAirline = fetchedData;
            this.opfilterNVOCC = fetchedData;
            this.opfilterParty = fetchedData;
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    clearField(val) {
      const formScope = this.localForm ? this.localForm : this;
      if (val === "Shipper") {
        this.TXTShipperAddress = "";
        formScope.TXTShipperAddress = "";
      } else if (val === "Consignee") {
        formScope.TXTConsigneeAddress = "";
        formScope.Consignee = "";
      } else if (val === "NotifyParty1") {
        formScope.TXTNotifyParty1Address = "";
      } else if (val === "NotifyParty2") {
        formScope.TXTNotifyParty2Address = "";
      } else if (val === "DeliveryAgent") {
        formScope.TXTDeliveryAgentAddress = "";
      } else if (val === "BLType") {
        formScope.TXTNoofBL = "";
      } else if (val === "Currency") {
        formScope.TXTExRate = "";
      } else if (val === "V1Currency") {
        formScope.TXTVouExRate = "";
      } else if (val === "V2Currency") {
        formScope.TXTExRate = "";
      } else if (val === "M1Currency") {
        formScope.TXTExRate = "";
      } else if (val === "Customer") {
        formScope.TXTCustomerAddress = "";
      } else if (val === "Agent") {
        formScope.TXTAgentAddress = "";
      } else if (val === "MasterCurrency") {
        formScope.TXTMasterExRate = "";
        // Clear the Shipper Branch and address based on Org
      } else if (val === "ShipperOrg") {
        formScope.TXTShipperAddress = "";
        formScope.ShipperBranch = "";
        formScope.OpFilterShipperBranch = [];
      } else if (val === "ConsigneeOrg") {
        formScope.TXTConsigneeAddress = "";
        formScope.ConsigneeBranch = "";
        formScope.OpFilterConsigneeBranch = [];
      } else if (val === "NotifyParty1Org") {
        formScope.TXTNotifyParty1Address = "";
        formScope.NotifyParty1Branch = "";
        formScope.OpFilterNotifyParty1Branch = [];
      } else if (val === "NotifyParty2Org") {
        formScope.TXTNotifyParty2Address = "";
        formScope.NotifyParty2Branch = "";
        formScope.OpFilterNotifyParty2Branch = [];
      } else if (val === "DeliveryAgentOrg") {
        formScope.TXTDeliveryAgentAddress = "";
        formScope.DeliveryAgentBranch = "";
        formScope.OpFilterDeliveryAgentBranch = [];
      } else if (val === "ForwarderOrg") {
        formScope.ForwarderBranch = "";
        formScope.OpFilterForwarderBranch = [];
      } else if (val === "ShippinglineOrg") {
        formScope.ShippinglineBranch = "";
        formScope.OpFilterShippinglineBranch = [];
      } else if (val === "SupplierOrg") {
        formScope.SupplierBranch = "";
        formScope.OpFilterSupplierBranch = [];
      } else if (val === "CHAOrg") {
        formScope.CHABranch = "";
        formScope.OpFilterCHABranch = [];
      } else if (val === "WarehouseOrg") {
        formScope.WarehouseBranch = "";
        formScope.OpFilterWarehouseBranch = [];
      } else if (val === "ColoaderOrg") {
        formScope.ColoaderBranch = "";
        formScope.OpFilterColoaderBranch = [];
      } else if (val === "WarehouseDestinationOrg") {
        formScope.WarehouseDestinationBranch = "";
        formScope.OpFilterDestinationBranch = [];
      } else if (val === "TransporterOrg") {
        formScope.TransporterBranch = "";
        formScope.OpFilterTransporterBranch = [];
      } else if (val === "Transporter1Org") {
        formScope.Transporter1Branch = "";
        formScope.OpFilterTransporter1Branch = [];
      } else if (val === "Transporter2Org") {
        formScope.Transporter2Branch = "";
        formScope.OpFilterTransporter2Branch = [];
      } else if (val === "Transporter3Org") {
        formScope.Transporter3Branch = "";
        formScope.OpFilterTransporter3Branch = [];
      } else if (val === "Transporter4Org") {
        formScope.Transporter4Branch = "";
        formScope.OpFilterTransporter4Branch = [];
      } else if (val === "OthersOrg") {
        formScope.OthersBranch = "";
        formScope.OpFilterOthersBranch = [];
      } else if (val === "IATAOrg") {
        formScope.IATABranch = "";
        formScope.OpFilterIATABranch = [];
      } else if (val === "BookingPartyOrg") {
        formScope.BookingPartyBranch = "";
        formScope.OpFilterPartyBranch = [];
      } else if (val === "V1Currency") {
        formScope.VoucherCurrency = "";
      } else if (val === "V2Currency") {
        formScope.Currency = "";
      }
    },
    filterAccountFn(val, update, label) {
      if (!this.filterAccount) {
        update(() => {
          const needle = val.toLowerCase();
          const filterFn = (v) =>
            this.Filterfromstart !== "Y"
              ? v.label.toLowerCase().includes(needle)
              : v.label.toLowerCase().startsWith(needle);
          const filteredList = val
            ? this.formConfig.filterAccount
                .filter(filterFn)
                .sort(this.sortByLabel(needle))
            : this.formConfig.filterAccount.slice(0, 10);

          // Map labels to their corresponding data targets
          const labelMap = {
            // Job
            Shipper: "opfilterShipper",
            Consignee: "opfilterConsignee",
            NotifyParty1: "opfilterNotifyParty1",
            NotifyParty2: "opfilterNotifyParty2",
            DeliveryAgent: "opfilterDeliveryAgent",
            Supplier: "opfilterSupplier",
            Shippingline: "opfilterShippingline",
            CHA: "opfilterCHA",
            Coloader: "opfilterColoader",
            Warehouse: "opfilterWarehouse",
            Transporter: "opfilterTransporter",
            Transporter1: "opfilterTransporter1",
            Transporter2: "opfilterTransporter2",
            Transporter3: "opfilterTransporter3",
            Transporter4: "opfilterTransporter4",
            WarehouseDestination: "opfilterWarehouseDestination",
            ApplyTo: "opfilterApplyTo",
            ContainerTransporter: "opfilterContainerTransporter",
            Airline: "opfilterShippingline", //"opfilterAirline",
            BookingParty: "opfilterBookingParty",
            Others: "opfilterOthers",
            IATA: "opfilterIATA",
            NVOCC: "opfilterNVOCC",
            Forwarder: "opfilterForwarder",
            // Voucher
            OtherDetailsShipper: "opfilterOtherDetailsShipper",
            // Lead
            Carrier: "opfilterCarrier",
            // Quote
            Customer: "opCustomer",
            OceanCarrier: "opOceanCarrier",
            Overseasagent: "opfilterDeliveryAgent", // intentional reuse?
            Party: "opfilterParty",
            ExpApplyTo: "opfilterApplyTo", // ✅ ADD THIS
          };

          const targetProp = labelMap[label];
          if (targetProp) {
            this[targetProp] = filteredList;
            this.localForm[targetProp] = filteredList;
            if (label === "Airline") {
              this.opfiltermasterAirline = filteredList;
            }
          }

          if (filteredList.length === 0) {
            this.$q.notify({
              // type: "warning",
              classes: "warning-alert", // swap per type
              actions: [{ icon: "close", round: true, dense: true }],
              message: `No result found for ${label}`,
              timeout: 2000,
            });
          }

          if (
            this.formConfig.isJobEditing ||
            this.formConfig.isVoucherEditing
          ) {
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
            ? this.filterAccount.filter(filterFn).sort(this.sortByLabel(needle))
            : this.filterAccount.slice(0, 10);

          // Map labels to their corresponding data targets
          const labelMap = {
            // Job
            Shipper: "opfilterShipper",
            Consignee: "opfilterConsignee",
            NotifyParty1: "opfilterNotifyParty1",
            NotifyParty2: "opfilterNotifyParty2",
            DeliveryAgent: "opfilterDeliveryAgent",
            Supplier: "opfilterSupplier",
            Shippingline: "opfilterShippingline",
            CHA: "opfilterCHA",
            Coloader: "opfilterColoader",
            Warehouse: "opfilterWarehouse",
            Transporter: "opfilterTransporter",
            Transporter1: "opfilterTransporter1",
            Transporter2: "opfilterTransporter2",
            Transporter3: "opfilterTransporter3",
            Transporter4: "opfilterTransporter4",
            WarehouseDestination: "opfilterWarehouseDestination",
            ApplyTo: "opfilterApplyTo",
            ContainerTransporter: "opfilterContainerTransporter",
            Airline: "opfilterShippingline",
            BookingParty: "opfilterBookingParty",
            Others: "opfilterOthers",
            IATA: "opfilterIATA",
            NVOCC: "opfilterNVOCC",
            Forwarder: "opfilterForwarder",
            // Voucher
            OtherDetailsShipper: "opfilterOtherDetailsShipper",
            // Lead
            Carrier: "opfilterCarrier",
            // Quote
            Customer: "opCustomer",
            OceanCarrier: "opOceanCarrier",
            Overseasagent: "opfilterDeliveryAgent", // intentional reuse?
          };

          const targetProp = labelMap[label];
          if (targetProp) {
            this[targetProp] = filteredList;
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

          if (this.isJobEditing || this.isVoucherEditing) {
            this.ischangeAddress = true;
          }
        });
      }
    },

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
