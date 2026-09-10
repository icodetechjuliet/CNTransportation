<template>
  <q-select
    square
    outlined
    dense
    bg-color="blue-1"
    v-model="selectedValue"
    :options="options"
    option-label="label"
    option-value="value"
    :label="label"
  />
</template>

<script>
export default {
  name: "BranchSelect",
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
