<template><q-select
    square
    outlined
    dense
    use-input
    fill-input
    display-value=""
    bg-color="blue-1"
    v-model="selectedValue"
    :options="options"
    option-label="label"
    option-value="value"
    :label="label"
    @update:model-value="$emit('change', $event)"
  /></template>

<script>
export default {
  name: "VoucherTypeSelect",
  props: {
    modelValue: null,
    options: Array,
    label: String,
  },
  emits: ["update:modelValue", "change"],
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
