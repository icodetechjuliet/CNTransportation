import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const IndustryDatamixin = {
  data() {
    return {};
  },
  computed: {},
  methods: {
    LoadCountry() {
      axios
        .get(`${CargoNet_API}/industrydata/country`)
        .then((res) => {
          this.opCountry = res.data.map((optionCty) => ({
            label: optionCty.name,
            value: optionCty.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterCountryFn(val, update) {
      update(() => {
        if (val === "") {
          this.opCountryFilter = this.opCountry;
        } else {
          const needle = val.toLowerCase();
          this.opCountryFilter = this.opCountry.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
        update();
      });
    },
    LoadIndustryVertical() {
      axios
        .get(`${CargoNet_API}/industrydata/industryvertical`)
        .then((res) => {
          this.opIndustryVertical = res.data.map((optionIN) => ({
            label: optionIN.name,
            value: optionIN.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    LoadAgentNetwork() {
      axios
        .get(`${CargoNet_API}/industrydata/agentnetwork`)
        .then((res) => {
          this.opAgentNetwork = res.data.map((optionnetwork) => ({
            label: optionnetwork.name,
            value: optionnetwork.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    LoadLeadSource() {
      axios
        .get(`${CargoNet_API}/industrydata/leadsource`)
        .then((res) => {
          this.opLeadSource = res.data.map((optionls) => ({
            label: optionls.name,
            value: optionls.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    LoadSalesman() {
      axios
        .get(`${CargoNet_API}/accounts/salesman`)
        .then((res) => {
          this.opSalesMan = res.data.map((Salesman) => ({
            label: Salesman.name,
            value: Salesman.id,
          }));
          this.opfilterSalesman = this.opSalesMan.slice();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterSalesmanFn(val, update) {
      update(() => {
        if (val === "") {
          this.opfilterSalesman = this.opSalesMan;
        } else {
          const needle = val.toLowerCase();
          this.opfilterSalesman = this.opSalesMan.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
        update();
      });
    },
    LoadCurrencyDetails() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${CargoNet_API}/industrydata/currency`)
          .then((res) => {
            this.filterCurrency = res.data.map((currency) => ({
              label: currency.name,
              value: currency.id,
              ExRate: parseFloat(currency.exRate),
            }));

            this.opfilterCurrency = this.filterCurrency.slice();

            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    filterCurrencyFn(val, update) {
      update(() => {
        if (val === "") {
          this.opfilterCurrency = this.filterCurrency.slice(0, 10);
        } else {
          const needle = val.toLowerCase();
          this.opfilterCurrency = this.filterCurrency.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
        update();
      });
    },
    LoadState() {
      axios
        .get(`${CargoNet_API}/industrydata/state`)
        .then((res) => {
          this.opState = res.data.map((optionstate) => ({
            label: optionstate.Name,
            value: optionstate.ID,
            Code: optionstate.Statecode,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterStateFn(val, update) {
      update(() => {
        if (val === "") {
          this.opfilterState = this.opState.slice(0, 10);
        } else {
          const needle = val.toLowerCase();
          this.opfilterState = this.opState.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
        update();
      });
    },
    LoadAccounttype() {
      axios
        .get(`${CargoNet_API}/industrydata/bankaccounttype`)
        .then((res) => {
          this.opfilterAccountType = res.data.map((optionAcctype) => ({
            label: optionAcctype.Name,
            value: optionAcctype.ID,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    LoadContachttypemapping() {
      axios
        .get(`${CargoNet_API}/industrydata/contacttype`)
        .then((res) => {
          this.opfilterContactType = res.data.map((optioncontact) => ({
            label: optioncontact.Type,
            value: optioncontact.ID,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    Loadroletype() {
      axios
        .get(`${CargoNet_API}/industrydata/roletype`)
        .then((res) => {
          this.opfilterRoleType = res.data.map((optionroletype) => ({
            label: optionroletype.Role,
            value: optionroletype.ID,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    LoadUser() {
      axios
        .get(`${CargoNet_API}/industrydata/user`)
        .then((res) => {
          this.filterUser = res.data.map((User) => ({
            label: User.name,
            value: User.id,
          }));
          this.opfilterEmployee = this.filterUser.slice();
          this.opfilterVerifiedBy = this.filterUser.slice();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterUserFn(val, update) {
      update(() => {
        if (val === "") {
          this.opfilterEmployee = this.filterUser;
        } else {
          const needle = val.toLowerCase();
          this.opfilterEmployee = this.filterUserFn.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
        update();
      });
    },
    LoadDocumenttype() {
      axios
        .get(`${CargoNet_API}/industrydata/documenttype`)
        .then((res) => {
          this.opfilterDocumentType = res.data.map((DocType) => ({
            label: DocType.Name,
            value: DocType.Id,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async LoadMultipleAddresstype() {
      await axios
        .get(`${CargoNet_API}/industrydata/multiple-address-type`)
        .then((res) => {
          this.opfilterAddressType = res.data.map((AddressType) => ({
            label: AddressType.Name,
            value: AddressType.Id,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
