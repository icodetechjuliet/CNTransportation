// LoadUOMMixin.js
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const LoadUOMMixin = {
  data() {
    return { AllUOM: [] };
  },
  created() {
    this.BranchID = sessionStorage.getItem("BranchID");
  },
  methods: {
    LoadUOM() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${CargoNet_API}/industrydata/uOM`)
          .then((res) => {
            const fetchedData = res.data.map((UOM) => ({
              label: UOM.name,
              value: UOM.id,
            }));
            //Job
            this.filterUOM = fetchedData;
            this.AllUOM = fetchedData;
            this.opfilterContainerGWUOM = fetchedData.slice();
            this.opfilterContainerPKGUOM = fetchedData.slice();
            this.opfilterContainerVolumeUOM = fetchedData.slice();
            this.opfilterCommodityGWUOM = fetchedData.slice();
            this.opfilterCommodityPKGUOM = fetchedData.slice();
            this.opfilterCommodityVolumeUOM = fetchedData.slice();
            this.opfilterQuantityUOM = fetchedData.slice();
            this.opfilterCommodityAirChargeWtUOM = fetchedData.slice();
            this.opfilterCommodityAirVolWtUOM = fetchedData.slice();
            //Vouchers
            this.opfilterQuantityUOM = fetchedData.slice();
            this.opfilterOtherDtlsGrossUOM = fetchedData.slice();
            this.opfilterOtherDtlsPackageUOM = fetchedData.slice();
            this.opfilterOtherDtlsVolumeUOM = fetchedData.slice();
            //Lead
            this.opfilterGWUOM = fetchedData.slice();
            this.opfilterPKGUOM = fetchedData.slice();
            this.opfilterVolumeUOM = fetchedData.slice();
            this.opfilterVolumeWTUOM = fetchedData.slice();
            this.opfilterChargeUOM = fetchedData.slice();
            this.opfilterChargeWTUOM = fetchedData.slice();
            //Master
            this.opfilterHouseGrwtUOM = fetchedData.slice();
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    LoadDefaultUOM() {
      axios
        .get(`${CargoNet_API}/industrydata/defaultuom/` + this.BranchID)
        .then((res) => {
          this.opfilterCommodityGWUOM = res.data.map((DUOM) => ({
            label: DUOM.GrwtUOM,
            value: DUOM.GrwtUOMid,
          }));
          this.opfilterCommodityPKGUOM = res.data.map((DUOM) => ({
            label: DUOM.PackageUOM,
            value: DUOM.PackageUOMid,
          }));
          this.opfilterCommodityVolumeUOM = res.data.map((DUOM) => ({
            label: DUOM.VolumeUOM,
            value: DUOM.VolumeUOMid,
          }));
          this.CommodityGWUOM = this.opfilterCommodityGWUOM.slice();
          if (this.CommodityGWUOM.length > 0) {
            this.CommodityGWUOM = {
              label: this.CommodityGWUOM[0].label,
              value: this.CommodityGWUOM[0].value,
            };
          }

          this.CommodityAirVolWtUOM = this.opfilterCommodityGWUOM.slice();
          if (this.CommodityAirVolWtUOM.length > 0) {
            this.CommodityAirVolWtUOM = {
              label: this.CommodityAirVolWtUOM[0].label,
              value: this.CommodityAirVolWtUOM[0].value,
            };
          }

          this.CommodityAirChargeWtUOM = this.opfilterCommodityGWUOM.slice();
          if (this.CommodityAirChargeWtUOM.length > 0) {
            this.CommodityAirChargeWtUOM = {
              label: this.CommodityAirChargeWtUOM[0].label,
              value: this.CommodityAirChargeWtUOM[0].value,
            };
          }

          this.HouseGrwtUOM = this.opfilterCommodityGWUOM.slice();
          if (this.HouseGrwtUOM.length > 0) {
            this.HouseGrwtUOM = {
              label: this.HouseGrwtUOM[0].label,
              value: this.HouseGrwtUOM[0].value,
            };
          }
          this.ContainerGWUOM = this.opfilterCommodityGWUOM.slice();
          if (this.ContainerGWUOM.length > 0) {
            this.ContainerGWUOM = {
              label: this.ContainerGWUOM[0].label,
              value: this.ContainerGWUOM[0].value,
            };
          }
          this.CommodityPKGUOM = this.opfilterCommodityPKGUOM.slice();
          if (this.CommodityPKGUOM.length > 0) {
            this.CommodityPKGUOM = {
              label: this.CommodityPKGUOM[0].label,
              value: this.CommodityPKGUOM[0].value,
            };
          }
          this.ContainerPKGUOM = this.opfilterCommodityPKGUOM.slice();
          if (this.ContainerPKGUOM.length > 0) {
            this.ContainerPKGUOM = {
              label: this.ContainerPKGUOM[0].label,
              value: this.ContainerPKGUOM[0].value,
            };
          }
          this.PKGUOM = this.opfilterCommodityPKGUOM.slice();
          if (this.PKGUOM.length > 0) {
            this.PKGUOM = {
              label: this.PKGUOM[0].label,
              value: this.PKGUOM[0].value,
            };
          }
          this.PKGHouseUOM = this.opfilterCommodityPKGUOM.slice();
          if (this.PKGHouseUOM.length > 0) {
            this.PKGHouseUOM = {
              label: this.PKGHouseUOM[0].label,
              value: this.PKGHouseUOM[0].value,
            };
          }
          this.CommodityVolumeUOM = this.opfilterCommodityVolumeUOM.slice();
          if (this.CommodityVolumeUOM.length > 0) {
            this.CommodityVolumeUOM = {
              label: this.CommodityVolumeUOM[0].label,
              value: this.CommodityVolumeUOM[0].value,
            };
          }
          this.HouseVolumeUOM = this.opfilterCommodityVolumeUOM.slice();
          if (this.HouseVolumeUOM.length > 0) {
            this.HouseVolumeUOM = {
              label: this.HouseVolumeUOM[0].label,
              value: this.HouseVolumeUOM[0].value,
            };
          }
          this.OtherDtlsGrossUOM = this.opfilterCommodityGWUOM.slice();
          if (this.OtherDtlsGrossUOM.length > 0) {
            this.OtherDtlsGrossUOM = {
              label: this.OtherDtlsGrossUOM[0].label,
              value: this.OtherDtlsGrossUOM[0].value,
            };
          }
          this.OtherDtlsPackageUOM = this.opfilterCommodityPKGUOM.slice();
          if (this.OtherDtlsPackageUOM.length > 0) {
            this.OtherDtlsPackageUOM = {
              label: this.OtherDtlsPackageUOM[0].label,
              value: this.OtherDtlsPackageUOM[0].value,
            };
          }
          this.MasterPKGUOM = this.opfilterCommodityPKGUOM.slice();
          if (this.MasterPKGUOM.length > 0) {
            this.MasterPKGUOM = {
              label: this.MasterPKGUOM[0].label,
              value: this.MasterPKGUOM[0].value,
            };
          }
          this.OtherDtlsVolumeUOM = this.opfilterCommodityVolumeUOM.slice();
          if (this.OtherDtlsVolumeUOM.length > 0) {
            this.OtherDtlsVolumeUOM = {
              label: this.OtherDtlsVolumeUOM[0].label,
              value: this.OtherDtlsVolumeUOM[0].value,
            };
          }
          if (this.localForm) {
            this.localForm.ContainerGWUOM = this.opfilterCommodityGWUOM.slice();
            if (this.localForm.ContainerGWUOM.length > 0) {
              this.localForm.ContainerGWUOM = {
                label: this.localForm.ContainerGWUOM[0].label,
                value: this.localForm.ContainerGWUOM[0].value,
              };
            }

            this.localForm.PKGUOM = this.opfilterCommodityPKGUOM.slice();
            if (this.localForm.PKGUOM.length > 0) {
              this.localForm.PKGUOM = {
                label: this.localForm.PKGUOM[0].label,
                value: this.localForm.PKGUOM[0].value,
              };
            }

            this.localForm.ContainerPKGUOM =
              this.opfilterCommodityPKGUOM.slice();
            if (this.localForm.ContainerPKGUOM.length > 0) {
              this.localForm.ContainerPKGUOM = {
                label: this.localForm.ContainerPKGUOM[0].label,
                value: this.localForm.ContainerPKGUOM[0].value,
              };
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    LoadDefaultLeadUOM() {
      axios
        .get(`${CargoNet_API}/industrydata/defaultuom/` + this.BranchID)
        .then((res) => {
          this.opfilterGWUOM = res.data.map((DUOM) => ({
            label: DUOM.GrwtUOM,
            value: DUOM.GrwtUOMid,
          }));
          this.opfilterPKGUOM = res.data.map((DUOM) => ({
            label: DUOM.PackageUOM,
            value: DUOM.PackageUOMid,
          }));
          this.opfilterVolumeUOM = res.data.map((DUOM) => ({
            label: DUOM.VolumeUOM,
            value: DUOM.VolumeUOMid,
          }));
          this.opfilterVolumeWTUOM = res.data.map((DUOM) => ({
            label: DUOM.GrwtUOM,
            value: DUOM.GrwtUOMid,
          }));
          this.opfilterChargeWTUOM = res.data.map((DUOM) => ({
            label: DUOM.GrwtUOM,
            value: DUOM.GrwtUOMid,
          }));
          this.GrossWtUOM = this.opfilterGWUOM.slice();
          if (this.GrossWtUOM.length > 0) {
            this.GrossWtUOM = {
              label: this.GrossWtUOM[0].label,
              value: this.GrossWtUOM[0].value,
            };
          }
          this.PKGUOM = this.opfilterPKGUOM.slice();
          if (this.PKGUOM.length > 0) {
            this.PKGUOM = {
              label: this.PKGUOM[0].label,
              value: this.PKGUOM[0].value,
            };
          }
          this.VolumeUOM = this.opfilterVolumeUOM.slice();
          if (this.VolumeUOM.length > 0) {
            this.VolumeUOM = {
              label: this.VolumeUOM[0].label,
              value: this.VolumeUOM[0].value,
            };
          }
          this.VolumeWtUOM = this.opfilterVolumeWTUOM.slice();
          if (this.VolumeWtUOM.length > 0) {
            this.VolumeWtUOM = {
              label: this.VolumeWtUOM[0].label,
              value: this.VolumeWtUOM[0].value,
            };
          }
          this.ChargeWtUOM = this.opfilterChargeWTUOM.slice();
          if (this.ChargeWtUOM.length > 0) {
            this.ChargeWtUOM = {
              label: this.ChargeWtUOM[0].label,
              value: this.ChargeWtUOM[0].value,
            };
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // filterUOMFn(val, update) {
    //
    //   update(() => {
    //     if (val === "") {
    //       //Job
    //
    //       this.opfilterContainerGWUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterContainerPKGUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterContainerVolumeUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterCommodityGWUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterCommodityPKGUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterCommodityVolumeUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterQuantityUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterCommodityAirChargeWtUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterCommodityAirVolWtUOM = this.filterUOM.slice(0, 10);
    //       //Vouchers
    //       this.opfilterQuantityUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterOtherDtlsGrossUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterOtherDtlsPackageUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterOtherDtlsVolumeUOM = this.filterUOM.slice(0, 10);
    //       //Lead
    //       this.opfilterGWUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterPKGUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterVolumeUOM = this.filterUOM.slice(0, 10);
    //       this.opfilterHouseGrwtUOM = this.filterUOM.slice(0, 10);
    //     } else {
    //       const needle = val.toLowerCase();
    //       //Job
    //       this.opfilterContainerGWUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterContainerPKGUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterContainerVolumeUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterCommodityGWUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterCommodityPKGUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterCommodityVolumeUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterQuantityUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterCommodityAirChargeWtUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterCommodityAirVolWtUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       //Vouchers
    //       this.opfilterQuantityUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterOtherDtlsGrossUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterOtherDtlsPackageUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterOtherDtlsVolumeUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       //Lead
    //       this.opfilterGWUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterPKGUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterVolumeUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //       this.opfilterHouseGrwtUOM = this.filterUOM.filter(
    //         (v) => v.label.toLowerCase().indexOf(needle) > -1
    //       );
    //     }
    //     update();
    //   });
    // },

    filterUOMFn(val, update) {
      const uomList = this.filterUOM || this.formConfig.filterUOM;
      update(() => {
        const allUOMFields = [
          // Job
          "opfilterContainerGWUOM",
          "opfilterContainerPKGUOM",
          "opfilterContainerVolumeUOM",
          "opfilterCommodityGWUOM",
          "opfilterCommodityPKGUOM",
          "opfilterCommodityVolumeUOM",
          "opfilterQuantityUOM",
          "opfilterCommodityAirChargeWtUOM",
          "opfilterCommodityAirVolWtUOM",
          // Vouchers
          "opfilterOtherDtlsGrossUOM",
          "opfilterOtherDtlsPackageUOM",
          "opfilterOtherDtlsVolumeUOM",
          // Lead
          "opfilterGWUOM",
          "opfilterPKGUOM",
          "opfilterVolumeUOM",
          "opfilterVolumeWTUOM",
          "opfilterChargeWTUOM",
          "opfilterHouseGrwtUOM",
        ];

        // In case of empty value, show first 10 items; otherwise filter by label
        const filteredUOMs =
          val === ""
            ? uomList.slice(0, 10)
            : uomList.filter((v) =>
                v.label.toLowerCase().includes(val.toLowerCase())
              );

        // Directly assign to all fields (skip undefined safely)
        allUOMFields.forEach((field) => {
          try {
            if (this.localForm && this.localForm[field]) {
              this.localForm[field] = filteredUOMs;
              this[field] = filteredUOMs;
            } else {
              this[field] = filteredUOMs;
            }
          } catch (e) {
            // If field doesn't exist, ignore and continue
          }
        });

        update();
      });
    },
  },
};
