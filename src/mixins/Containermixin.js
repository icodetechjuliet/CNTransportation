import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const Containermixin = {
  data() {
    return {};
  },
  computed: {},
  methods: {
    async AddContainer() {
      const filteredFields = this.Fieldsvisblestatus.filter(
        (field) =>
          field.Description &&
          field.Description.replace(/\s+/g, "") === this.selectedTab
      );
      for (const field of filteredFields) {
        if (field.IsMandatory === "Y") {
          const fieldName = field.FieldName;
          const value = this[fieldName];

          if (value === null || value === "") {
            const alertMessage = `${fieldName} is mandatory`;

            this.$q.notify({
              message: alertMessage,
              color: "negative",
              position: "center",
              classes: "negative-alert", // swap per type
              actions: [{ icon: "close", round: true, dense: true }],
            });

            this.issaved = false;
            this.loading = false;
            this.voiceAssistantEnabled && this.speak(alertMessage);

            // Optional: handle tab navigation if you have that info in Fieldsvisblestatus
            if (field.Description) {
              this.selectedTab = field.Description.replace(/\s+/g, "");
            }

            // Focus the field if ref exists
            this.$nextTick(() => {
              try {
                if (this.$refs[fieldName]) {
                  this.$refs[fieldName].focus();
                }
              } catch (err) {
                console.warn(`Could not focus field: ${fieldName}`);
              }
            });

            return; // stop save process on first failed validation
          }
        }
      }

      if (!this.TXTContainerNo) {
        this.$q.notify({
          message: "Container No is mandatory",
          color: "negative",
          position: "center",
          classes: "negative-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        return;
      } else if (this.ContainerGrid.length > 0) {
        const exists = this.ContainerGrid.some(
          (item) => item.ContainerNo === this.TXTContainerNo
        );
        if (exists && !this.editMode) {
          this.$q.notify({
            message: "Duplicate Container No Not Allowed",
            color: "negative",
            position: "center",
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
          });
          return;
        }
      }
      const containerNumber = this.TXTContainerNo.trim();
      if (!this.validateContainerNumber(containerNumber)) {
        return;
      }
      if (this.editMode) {
        let jobId = this.$route.query.selectedRow || this.TempID;
        axios
          .put(`${CargoNet_API}/shipments/${jobId}/containers/${this.id}`, {
            ContainerNo: this.TXTContainerNo,
            ContainerType: this.containerType ? this.containerType.value : 0,
            LSNo: this.TXTLSNo,
            CSNo: this.TXTCSNo,
            TruckNo: this.TXTTruckNo,
            TruckType:
              this.TruckType && this.TruckType.value
                ? parseInt(this.TruckType.value)
                : 0,
            GrossWT: this.TXTGrwt ? this.TXTGrwt : 0,
            GrossWTUOM: this.ContainerGWUOM ? this.ContainerGWUOM.value : 0,
            Package: this.TXTPKGS ? this.TXTPKGS : 0,
            PackageUOM: this.ContainerPKGUOM ? this.ContainerPKGUOM.value : 0,
            NetWeight: this.TXTNetWt ? this.TXTNetWt : 0,
            Volume: this.TXTVolume ? this.TXTVolume : 0,
            VolumeUOM: this.ContainerVolumeUOM
              ? this.ContainerVolumeUOM.value
              : 0,
            ContTransporter: this.ContainerTransporter
              ? this.ContainerTransporter.value
              : 0,
            TripNo: this.TXTTripNo,
            DriverNo: this.TXTDriverName,
            ContactNo: this.TXTContactNo,
            TransportDest: this.TXTDestination,
            GateInDate: this.GateinDate ? this.GateinDate : "",
            MovementDate: this.MovementDate ? this.MovementDate : "",
            RailOut: this.RailOut ? this.RailOut : "",
            ArrivalDate: this.ArrivalDate ? this.ArrivalDate : "",
            containersupress: this.isContSuppress === true ? "Y" : "N",
            SpecialInstructions: this.TXTContainerNotes
              ? this.TXTContainerNotes
              : "",
            CurrencyID: this.FreightCurrency ? this.FreightCurrency.value : 0,
            GoodsDescription: this.TXTContainerGoodsDesc
              ? this.TXTContainerGoodsDesc
              : "",
            MarksAndNos: this.TXTContainerMarksNos
              ? this.TXTContainerMarksNos
              : "",
            PickupAddress: this.TXTContainerEmptyPickupAddress
              ? this.TXTContainerEmptyPickupAddress
              : "",
            ReturnAddress: this.TXTFullReturnDeliveryAddress
              ? this.TXTFullReturnDeliveryAddress
              : "",
          })
          .then((res) => {
            this.editMode = false;
            this.selectedContainer = null;
            this.GetContainerDtlsGrid();
            this.resetcontainertab();
            this.insertuserlog("tCND", "U", this.id);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (!this.TXTContainerNo) {
          // alert("Container No is mandatory");
          this.$q.notify({
            message: "Container No is mandatory",
            color: "negative",
            position: "center",
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
          });
          return;
        }
        let jobId = this.$route.query.selectedRow || this.TempID;
        const res = await axios
          .post(`${CargoNet_API}/shipments/${jobId}/containers`, {
            TempID: jobId,
            ContainerNo: this.TXTContainerNo,
            ContainerType: this.containerType ? this.containerType.value : 0,
            LSNo: this.TXTLSNo,
            CSNo: this.TXTCSNo,
            ContainerUserID: this.UserID,
            ContCompID: this.BranchID,
            TruckNo: this.TXTTruckNo,
            TruckType: this.TruckType ? this.TruckType.value : 0,
            GrossWT: this.TXTGrwt ? this.TXTGrwt : 0,
            GrossWTUOM: this.ContainerGWUOM ? this.ContainerGWUOM.value : 0,
            Package: this.TXTPKGS ? this.TXTPKGS : 0,
            PackageUOM: this.ContainerPKGUOM ? this.ContainerPKGUOM.value : 0,
            NetWeight: this.TXTNetWt ? this.TXTNetWt : 0,
            Volume: this.TXTVolume ? this.TXTVolume : 0,
            VolumeUOM: this.ContainerVolumeUOM
              ? this.ContainerVolumeUOM.value
              : 0,
            ContTransporter: this.ContainerTransporter
              ? this.ContainerTransporter.value
              : 0,
            TripNo: this.TXTTripNo,
            DriverNo: this.TXTDriverName,
            ContactNo: this.TXTContactNo,
            TransportDest: this.TXTDestination,
            GateInDate: this.GateinDate ? this.GateinDate : "",
            MovementDate: this.MovementDate ? this.MovementDate : "",
            RailOut: this.RailOut ? this.RailOut : "",
            ArrivalDate: this.ArrivalDate ? this.ArrivalDate : "",
            containersupress: this.isContSuppress === true ? "Y" : "N",

            SpecialInstructions: this.TXTContainerNotes
              ? this.TXTContainerNotes
              : "",
            CurrencyID: this.FreightCurrency ? this.FreightCurrency.value : 0,
            GoodsDescription: this.TXTContainerGoodsDesc
              ? this.TXTContainerGoodsDesc
              : "",
            MarksAndNos: this.TXTContainerMarksNos
              ? this.TXTContainerMarksNos
              : "",
            PickupAddress: this.TXTContainerEmptyPickupAddress
              ? this.TXTContainerEmptyPickupAddress
              : "",
            ReturnAddress: this.TXTFullReturnDeliveryAddress
              ? this.TXTFullReturnDeliveryAddress
              : "",
          })
          .then((res) => {
            this.GetContainerDtlsGrid();
            this.resetcontainertab();
            const CID = res.data[0];
            this.insertuserlog("tCND", "I", CID.cId);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.editMode;
    },
    deletecontainer(row) {
      let jobid = this.$route.query.selectedRow || this.TempID;

      axios
        .delete(`${CargoNet_API}/shipments/${jobid}/containers/${row.id}`)
        .then((response) => {
          this.GetContainerDtlsGrid();
          this.insertuserlog("tCND", "D", row.id);
        })
        .catch((error) => {
          // Handle the error
          console.error(error);
        });
    },

    resetcontainertab() {
      this.editMode = false;
      this.TXTContainerNo = "";
      this.containerType = "";
      this.TXTLSNo = "";
      this.TXTCSNo = "";
      this.TXTTruckNo = "";
      this.TruckType = "";
      this.TXTGrwt = "";
      this.ContainerGWUOM = "";
      this.TXTPKGS = "";
      this.ContainerPKGUOM = "";
      this.TXTNetWt = "";
      this.TXTVolume = "";
      this.ContainerVolumeUOM = "";
      this.ContainerTransporter = "";
      this.TXTTripNo = "";
      this.TXTDriverName = "";
      this.TXTContactNo = "";
      this.TXTDestination = "";
      this.GateinDate = "";
      this.MovementDate = "";
      this.RailOut = "";
      this.ArrivalDate = "";
      this.isContSuppress = false;
      this.FreightCurrency = "";
      this.TXTContainerNotes = "";
      this.TXTContainerGoodsDesc = "";
      this.TXTContainerMarksNos = "";
      this.TXTContainerEmptyPickupAddress = "";
      this.TXTFullReturnDeliveryAddress = "";
      this.LoadDefaultUOM();
    },

    GetContainerDtlsGrid() {
      let jobId = this.$route.query.selectedRow || this.TempID;
      if (!jobId) {
        return;
      }

      axios
        .get(`${CargoNet_API}/shipments/${jobId}/containers/0`)

        .then((res) => {
          this.ContainerGrid = res.data;
          this.filtercontainerno = res.data.map((OptionContno) => ({
            label: OptionContno.ContainerNo,
            value: OptionContno.id,
          }));
          this.opfilterContainerNo = this.filtercontainerno.slice();
          this.TXTComGrosswt = this.ContainerGrid.totalGrossWT;
          this.TXTComNetwt1 = this.ContainerGrid.totalNetWT;
          this.TXTComNoofPkg = this.ContainerGrid.totalPackages;
          this.TXTComVolume = this.ContainerGrid.totalVolume;
          this.containersuppressed = this.ContainerGrid.Containersupress;
          this.TXTContainerNotes = this.ContainerGrid.Notes;
          // this.generateMarksNos();
        })
        .catch((err) => {
          console.log(err);
        });

      //Local Storage
      // const updatedContainerData = JSON.parse(
      //   localStorage.getItem("tempContainerData")
      // );
      // this.ContainerGrid = updatedContainerData
      //   ? Object.values(updatedContainerData)
      //   : [];
    },

    filtercontainernofn(val, update) {
      update(() => {
        if (val === "") {
          this.filtercontainerno = this.filtercontainerno;
          this.opfilterContainerNo = this.filtercontainerno.slice();
        } else {
          const needle = val.toLowerCase();
          this.opfilterContainerNo = this.filtercontainerno.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
          this.opfilterContainerNo = this.filtercontainerno.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
        update();
      });
    },
  },
};
