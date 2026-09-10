<template>
  <q-select
    square
    outlined
    dense
    bg-color="blue-1"
    v-model="selectedValue"
    :options="options"
    :label="label"
  />
</template>

<script>
export default {
  name: "FinancialYearSelect",
  props: {
    modelValue: null,
    options: Array,
    label: String,
  },
  emits: ["update:modelValue"],
  computed: {
    selectedValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>
