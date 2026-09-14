<template><q-input bg-color="blue-1"
    square
    dense
    outlined
    :bg-color="bgColor"
    :placeholder="placeholder"
    :label="label"
    v-model="localValue"
    type="text"
    @update:model-value="onInput"
    @keypress="restrictKeys"
    @keydown="handleKeyDown"
    @paste.prevent="handlePaste"
    :readonly="readonly"
    :disable="disable"
  >
    <template v-slot:label>
      <span>
        {{ label }}
        <span v-if="mandatoryStar" class="mandatory-star">*</span>
      </span>
    </template>
  </q-input></template>

<script>
export default {
  name: "DecimalInput",
  props: {
    modelValue: [String, Number],
    FieldsDecimal: {
      type: Array,
    },
    readonly: Boolean,
    disable: Boolean,
    placeholder: String,
    label: String,
    fieldName: String,
    mandatoryStar: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: "white",
    },
  },
  data() {
    return {
      localValue: this.modelValue,
    };
  },
  watch: {
    modelValue(val) {
      this.localValue = val;
      this.onInput(val);
    },
  },
  methods: {
    onInputOld(val) {
      if (val === null || val === undefined) {
        this.$emit("update:modelValue", "");
        return;
      }
      val = val.toString().replace(/[^\d.]/g, "");
      const decimal = this.FieldsDecimal.find(
        (f) => f.FieldName === this.fieldName
      );
      // only one decimal
      const parts = val.split(".");
      if (parts.length > 2) {
        val = parts[0] + "." + parts.slice(1).join("");
      }
      const [intPart, decPart] = val.split(".");
      if (decPart && decPart.length > decimal.Decimalvalue) {
        val = intPart + "." + decPart.slice(0, decimal.Decimalvalue);
      }
      this.localValue = val;
      this.$emit("update:modelValue", val);
    },
    onInput(val) {
      if (val === null || val === undefined) {
        this.localValue = "";
        this.$emit("update:modelValue", "");
        return;
      }
      val = val.toString().replace(/[^\d.]/g, "");
      // ✅ Guard: FieldsDecimal or mapping may not exist yet
      const decimal =
        Array.isArray(this.FieldsDecimal) &&
        this.FieldsDecimal.find((f) => f.FieldName === this.fieldName);
      // only one decimal
      const parts = val.split(".");
      if (parts.length > 2) {
        val = parts[0] + "." + parts.slice(1).join("");
      }
      const [intPart, decPart] = val.split(".");
      // ✅ Apply decimal restriction ONLY if config exists
      if (decimal && decPart && decPart.length > decimal.Decimalvalue) {
        val = intPart + "." + decPart.slice(0, decimal.Decimalvalue);
      }
      this.localValue = val;
      this.$emit("update:modelValue", val);
    },
    handleKeyDown(e) {
      const decimal = this.FieldsDecimal.find(
        (f) => f.FieldName === this.fieldName
      );

      if (!decimal) return;

      const value = e.target.value;

      // Allow control keys
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End",
      ];
      if (allowedKeys.includes(e.key)) return;

      // Allow only numbers and decimal
      if (!/[\d.]/.test(e.key)) {
        e.preventDefault();
        return;
      }

      // Only one decimal point
      if (e.key === "." && value.includes(".")) {
        e.preventDefault();
        return;
      }

      // 🚨 BLOCK decimal typing when limit reached
      if (value.includes(".")) {
        const decPart = value.split(".")[1] || "";
        const cursorPos = e.target.selectionStart;

        // If cursor is in decimal portion
        const decimalIndex = value.indexOf(".");
        if (
          cursorPos > decimalIndex &&
          decPart.length >= decimal.Decimalvalue
        ) {
          e.preventDefault(); // ⛔ HARD STOP
        }
      }
    },
    restrictKeys(e) {
      const allowed = /[0-9.]/;
      if (!allowed.test(e.key)) e.preventDefault();

      if (e.key === "." && e.target.value.includes(".")) {
        e.preventDefault();
      }
    },

    handlePaste(e) {
      const text = (e.clipboardData || window.clipboardData).getData("text");
      if (!/^\d*\.?\d*$/.test(text)) e.preventDefault();
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
