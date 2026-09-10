<template>
  <q-select
    square
    dense
    outlined
    :bg-color="bgcolor ? bgcolor : 'blue-1'"
    v-model="localValue"
    :options="Accounts"
    :placeholder="gettlabel(name)"
    use-input
    fill-input
    display-value=""
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
  <ChargesControl
    ref="chargesControl"
    :ShowOld="this.ShowOldPartyDetailsFlag === 'O' ? true : false"
    @selected-party="Updateparty"
  />
</template>

<script>
import { readonly, ref } from "vue";
import axios from "axios";
import ChargesControl from "/src/pages/ChargesGrid.vue";
import CargoNet_API from "/src/IPConfig/config.js";
export default {
  name: "AccountAutoComplete",
  props: {
    label: String,
    Alterlabel: String,
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

    bgcolor: {
      type: String,
      default: "blue-1",
    },
  },
  data() {
    return {
      isFocused: "",
      localValue: this.value,
      typedText: "",
      fieldtype: "",
      ChargesControl: false,
      Masterflag: [],
      ShowOldPartyDetailsFlag: "N",
      Accounts: [],
      filterAccount: [],
    };
  },
  components: { ChargesControl },
  watch: {
    fieldvalue(val) {
      this.localValue = val;
    },
    localValue() {
      this.$emit("selected-value", this.localValue, this.name);
    },
  },
  mounted() {
    this.LoadAccount("", () => {});
    this.GetDynamicConfig();
    this.localValue = this.fieldvalue;
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
    LoadAccount(val, update, abort) {
      if (val.length < 2) {
        val = "All";
      }

      axios
        .get(`${CargoNet_API}/accounts/searchby`, {
          params: {
            searchval: val,
            fieldname: this.name,
            modulecode: this.Modulecode,
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
