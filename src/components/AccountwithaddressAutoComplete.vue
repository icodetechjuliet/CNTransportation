<template><q-select
    dense
    square
    outlined
    bg-color="blue-1"
    v-model="localValue"
    v-bind="$attrs"
    :data-cy="dataCy"
    use-input
    fill-input
    display-value=""
    input-debounce="0"
    :label="gettlabel()"
    :options="Accounts"
    option-label="label"
    option-value="value"
    class="pad-6"
    @focus="isFocused = name"
    @blur="onBlur"
    @filter="LoadAccount"
    virtual-scroll-slice-size="5"
    :clearable="isFocused === name"
    @clear="clearField(name)"
    @input-value="onInputChange"
    hide-dropdown-icon
    :error="error"
    :rules="rules"
  >
    <template v-slot:label>
      <span>
        {{ gettlabel() }}
        <span v-if="mandatoryStar" class="mandatory-star">*</span>
      </span>
    </template>
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
  </q-select><q-input
    square
    dense
    outlined
    bg-color="blue-1"
    v-model="LocalAddress"
    type="textarea"
    rows="2"
    :label="name + ' Address'"
    class="pad-1"
    ><template v-slot:append>
      <q-icon
        name="search"
        class="cursor-pointer"
        title="Search company addresses"
        @click="openMultipleAddressDialog(localValue)"
      /> </template
  ></q-input><MultipleAddress
    ref="multipleAddress"
    :shipper="Shipper"
    @address-selected="
      (selectedAddress, party) => updateMultipleAddress(selectedAddress, party)
    "
  /><ChargesControl
    ref="chargesControl"
    :ShowOld="this.ShowOldPartyDetailsFlag === 'O' ? true : false"
    @selected-party="Updateparty"
  /></template>

<script>
import { ref } from "vue";
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import MultipleAddress from "/src/pages/ShipmentMultipleAddress.vue";
import ChargesControl from "/src/pages/ChargesGrid.vue";
export default {
  name: "AccountwithaddrAutoComplete",
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
      default: "",
    },
    optionValue: {
      type: String,
      default: "",
    },
    Modulecode: {
      type: String,
      default: "",
    },
    Fieldsvisblestatus: {
      type: Array,
      default: () => [],
    },
    fieldvalue: {
      type: [String, Number, Object, null],
      default: null,
    },
    Addressvalue: {
      type: [String, Number, Object, null],
      default: null,
    },
    jobEditing: {
      type: Boolean,
    },
    error: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    mandatoryStar: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MultipleAddress,
    ChargesControl,
  },
  data() {
    return {
      isFocused: "",
      localValue: this.value,
      LocalAddress: "",
      typedText: "",
      ischangeAddress: false,
      ChargesControl: false,
      Masterflag: [],
      ShowOldPartyDetailsFlag: "N",
      Accounts: [],
      filterAccount: [],
    };
  },
  created() {
    this.UserID = sessionStorage.getItem("APIUserID");
  },
  watch: {
    fieldvalue: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.localValue = newVal;
      },
    },
    Addressvalue: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.LocalAddress = newVal;
      },
    },
    localValue() {
      // if (!this.jobEditing) {
      //   this.fetchAddress(this.name);
      // } else if (
      //   this.jobEditing &&
      //   (this.LocalAddress === null || this.LocalAddress === "")
      // ) {
      this.fetchAddress(this.name);
      // }
      this.$emit(
        "selected-value",
        this.localValue !== null ? this.localValue : "",
        this.LocalAddress !== null ? this.LocalAddress : "",
        this.name
      );
    },
    LocalAddress() {
      if (this.ischangeAddress) {
        this.$emit(
          "selected-value",
          this.localValue !== null ? this.localValue : "",
          this.LocalAddress !== null ? this.LocalAddress : "",
          this.name
        );
      }
    },
  },
  mounted() {
    this.LoadAccount("", () => {});
    this.GetDynamicConfig();
  },
  methods: {
    gettlabel() {
      const label =
        this.Modulecode === "AI" ||
        this.Modulecode === "AE" ||
        this.Modulecode === "ICA" ||
        this.Modulecode === "ECA"
          ? this.label
          : this.Alterlabel;
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
    fetchAddress(type) {
      let selectedId;
      selectedId = this.localValue ? this.localValue.value : null;
      if (selectedId !== null && selectedId !== undefined) {
        axios
          .get(`${CargoNet_API}/accounts/address/${selectedId}`)
          .then((response) => {
            const address = response.data[0]?.Address || "";
            this.LocalAddress = address;
            // emit updated address so parent can capture it
            this.$emit(
              "selected-value",
              this.localValue !== null ? this.localValue : "",
              this.LocalAddress !== null ? this.LocalAddress : "",
              this.name
            );
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.LocalAddress = "";
        this.$emit(
          "selected-value",
          this.localValue !== null ? this.localValue : "",
          "",
          this.name
        );
      }
    },
    openMultipleAddressDialog(localValue) {
      if (
        localValue === null ||
        localValue === "" ||
        localValue === undefined
      ) {
        this.$q.notify({
          message: "Select Party",
          color: "red",
          position: "center",
          classes: "positive-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
      } else {
        this.$refs.multipleAddress.openDialog();
        this.$refs.multipleAddress.executeApiCall(localValue);
      }
    },
    updateMultipleAddress(selectedAddress, party) {
      this.ischangeAddress = true;
      this.LocalAddress = selectedAddress;
      setTimeout(() => {
        this.ischangeAddress = false;
      }, 1000);
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
    clearField(name) {
      this.LocalAddress = "";
    },
    LoadAccount(val, update, abort) {
      if (val.length < 2) {
        val = "All";
      }
      axios
        .get(`${CargoNet_API}/accounts/searchbyuserid`, {
          params: {
            searchval: val,
            fieldname: this.name,
            modulecode: this.Modulecode,
            userid: this.UserID,
          },
        })
        .then((res) => {
          const fetchedData = res.data.map((Account) => ({
            label: Account.name,
            value: Account.id,
            description: Account.description,
          }));

          update(() => {
            this.Accounts = fetchedData;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

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
  },
};
</script>

<style scoped>
.mandatory-star {
  color: #f44336;
  font-weight: bold;
  margin-left: 2px;
}
</style>
