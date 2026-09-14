<template><div class="row q-col-gutter-sm">
    <div class="col-4" v-if="ShowCode">
      <q-select bg-color="blue-1"
        square
        dense
        outlined
        :bg-color="bgcolor ? bgcolor : 'blue-1'"
        v-model="localValue"
        :options="Accounts"
        label="Code"
        use-input
        fill-input
        display-value=""
        input-debounce="0"
        option-label="Code"
        class="truncate-text"
        option-value="value"
        :clearable="isFocused === name"
        @focus="isFocused = name"
        @blur="onBlur"
        @filter="LoadAccount"
        @input-value="onInputChange"
        hide-dropdown-icon
        :readonly="readonly"
        :disable="disable"
      ></q-select>
    </div>
    <div :class="getColClass()">
      <q-select bg-color="blue-1"
        square
        dense
        outlined
        :bg-color="bgcolor ? bgcolor : 'blue-1'"
        v-model="localValue"
        :options="Accounts"
        :label="gettlabel()"
        use-input
        fill-input
        display-value=""
        :data-cy="dataCy"
        input-debounce="0"
        option-label="label"
        class="truncate-text"
        option-value="value"
        :clearable="isFocused === name"
        @focus="isFocused = name"
        @blur="onBlur"
        @filter="LoadAccount"
        @input-value="onInputChange"
        hide-dropdown-icon
        :readonly="readonly"
        :disable="disable"
      >
        <template v-slot:append>
          <q-icon name="search" @mousedown.stop="handleIconClick(name)" />
        </template>
        <!-- 👇 Show label + description inline only in dropdown -->
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>
                {{ scope.opt.label }}
                <span class="text-black text-caption">
                  — {{ scope.opt.description }}</span
                >
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div
      class="col-xs-4 col-sm-3 col-md-3 col-lg-3"
      v-if="
        (name === 'IATA' && ShowAirlinecode) ||
        (name === 'Shippingline' && Modulecode !== 'SE' && ShowAirlinecode)
      "
    >
      <q-select bg-color="blue-1"
        square
        dense
        outlined
        :data-cy="dataCy"
        :bg-color="bgcolor ? bgcolor : 'blue-1'"
        v-model="localCode"
        :options="Accounts"
        :label="name === 'IATA' ? 'IATA Code' : gettlabel() + ' Code'"
        use-input
        fill-input
        display-value=""
        input-debounce="0"
        :option-label="
          (opt) => (name === 'IATA' ? opt.IATACode : opt.AirLineCode)
        "
        class="truncate-text"
        option-value="value"
        :clearable="isFocused === name"
        @focus="isFocused = name"
        @blur="onBlur"
        @filter="LoadAccount"
        @input-value="onInputChange"
        hide-dropdown-icon
        readonly
        disable
      ></q-select>
    </div>
  </div><ChargesControl
    ref="chargesControl"
    :ShowOld="this.ShowOldPartyDetailsFlag === 'O' ? true : false"
    @selected-party="Updateparty"
  /></template>

<script>
import { readonly, ref } from "vue";
import axios from "axios";
import ChargesControl from "/src/pages/ChargesGrid.vue";
import CargoNet_API from "/src/IPConfig/config.js";
export default {
  name: "AccountAutoComplete",
  inheritAttrs: false, // add this
  props: {
    label: String,
    Alterlabel: String,
    dataCy: { type: String, default: "" },
    value: [String, Number, Object, null],
    options: {
      type: Array,
      default: () => [],
    },
    name: String, // to identify which field this select belongs to
    filterFn: {
      type: Function,
      required: true,
    },
    onSelectitemDynamic: {
      type: Function,
      required: true,
    },
    optionLabel: {
      type: String,
      default: "label",
    },
    optionValue: {
      type: String,
      default: "value",
    },
    Modulecode: {
      type: String,
      default: "value",
    },
    fieldvalue: [String, Number, Object, null],
    readonly: Boolean,
    disable: Boolean,
    ShowCode: Boolean,

    bgcolor: {
      type: String,
      default: "blue-1",
    },
  },
  data() {
    return {
      isFocused: "",
      localValue: "",
      localCode: "",
      typedText: "",
      fieldtype: "",
      ChargesControl: false,
      Masterflag: [],
      ShowOldPartyDetailsFlag: "N",
      Accounts: [],
      filterAccount: [],
      ShowAirlinecode: false,
    };
  },
  components: { ChargesControl },
  watch: {
    fieldvalue(val) {
      this.localValue = val;
      this.LoadAccount("", () => {});
    },
    localValue() {
      this.$emit("selected-value", this.localValue, this.name);
    },
    Accounts(val) {
      // console.log("accts", val);
    },
  },
  mounted() {
    this.GetShowCodeStatus();
    this.GetDynamicConfig();
    this.localValue = this.fieldvalue;
  },
  methods: {
    getColClass() {
      if (
        ((this.ShowCode && this.ShowAirlinecode) ||
          (this.name === "IATA" && this.ShowAirlinecode) ||
          (this.name === "Shippingline" && this.ShowAirlinecode)) &&
        this.Modulecode !== "SE"
      ) {
        return "col-xs-8 col-sm-9 col-md-9 col-lg-9";
      }
      return "col-xs-12 col-sm-12 col-md-12 col-lg-12";
    },
    gettlabel() {
      const label =
        this.Modulecode === "AI" ||
        this.Modulecode === "AE" ||
        this.Modulecode === "ICA" ||
        this.Modulecode === "ECA"
          ? this.label
          : this.Alterlabel
          ? this.Alterlabel
          : this.label;
      return label;
    },
    onSelectitem(value, type) {
      if (value !== null && value !== undefined) {
        const fullName = value.label;
        const cleanName = fullName.includes("[")
          ? fullName.split(" [")[0]
          : fullName;
        this[type] = { label: cleanName, value: value.value };
      }
    },
    onFocus() {
      this.isFocused = this.name;
      this.typedText = ""; // reset when focusing
    },
    onInputChange(val) {
      // 🆕 store typed text as user types
      if (typeof val === "string") {
        this.typedText = val.trim();
      }
    },
    onBlur() {
      // 👇 Check if field is empty on blur

      if (this.typedText && !this.localValue) {
        this.$q
          .dialog({
            title: "Invalid Data",
            message: `Please select a valid ${this.label} before proceeding.`,
            cancel: false,
            persistent: true,
            ok: {
              label: "OK",
              color: "primary",
            },
            class: "alert-dialog",
          })
          .onOk(() => {
            // 👇 Focus back to same field
            this.$nextTick(() => {
              this.$el.querySelector("input")?.focus();
            });
          });
      }
      this.isFocused = "";
    },
    handleIconClick(type, event) {
      // event.stopPropagation();
      this.fieldtype = type;
      this.openChargesGrid();
    },
    openChargesGrid() {
      this.ChargesControl = true;
      this.$refs.chargesControl.openDialog();
    },
    Updateparty(val) {
      this.localValue = val;
    },
    GetDynamicConfig() {
      axios
        .get(`${CargoNet_API}/Configuration/cargonetconfigflag/0`)
        .then((res) => {
          this.Masterflag = res.data;
          this.ShowOldPartyDetailsFlag = this.Masterflag.filter(
            (row) => row.Name === "EnableOldPartyDetails"
          )[0].Flag;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async LoadAccount(val, update, abort) {
      if (val.length === 0) {
        val = "All";
      }
      const fieldname = this.label === "Air Line" ? "Airline" : this.name;

      await axios
        .get(`${CargoNet_API}/accounts/searchby`, {
          params: {
            searchval: val,
            fieldname: fieldname,
            modulecode: this.Modulecode,
          },
        })
        .then((res) => {
          var fetchedData = res.data.map((Account) => ({
            label: Account.name,
            value: Account.id,
            description: Account.description,
            Code: Account.Accountcode,
            IATACode: Account.IATACode,
            AirLineCode: Account.AirLineCode,
          }));

          if (this.fieldvalue) {
            const fv = this.fieldvalue;
            this.localCode = fetchedData.find(
              (acc) => acc.value === this.fieldvalue.value
            );
          } else {
            this.localCode = null;
          }
          update(() => {
            this.Accounts = fetchedData;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // LoadAccount(val, update, abort) {
    //   if (val.length < 2) {
    //     val = "All";
    //   }
    //   axios
    //     .get(`${CargoNet_API}/accounts/searchby`, {
    //       params: { searchval: val, fieldname: this.name },
    //     })
    //     .then((res) => {
    //       const fetchedData = res.data.map((Account) => ({
    //         label: Account.name,
    //         value: Account.id,
    //         description: Account.description,
    //         Code: Account.Accountcode,
    //         IATACode: Account.IATACode,
    //         AirLineCode: Account.AirLineCode,
    //       }));

    //       update(() => {
    //         this.Accounts = fetchedData;
    //       });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       abort();
    //     });
    // },

    filterAccountFn(val, update, label) {
      update(() => {
        const needle = (val || "").toLowerCase().trim();

        const list = this.filterAccount || [];
        const filteredList = needle
          ? list
              .filter((v) => {
                const text = (v.label || "").toLowerCase();
                return this.Filterfromstart === "Y"
                  ? text.startsWith(needle)
                  : text.includes(needle);
              })
              .sort((a, b) => a.label.localeCompare(b.label))
          : list.slice(0, 10); // default top 10

        this.Accounts = filteredList;
      });
    },

    async GetShowCodeStatus() {
      try {
        const res = await axios.get(
          `${CargoNet_API}/Configuration/CargonetConfig?configName=ShowAirlinecode`
        );
        this.ShowAirlinecode = res.data === "Y" ? true : false;
      } catch (err) {
        console.error("Error fetching filter type:", err);
      }
    },
  },
};
</script>
