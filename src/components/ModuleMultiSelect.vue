<template><q-card class="branch-filter-card">
    <q-expansion-item
      icon="layers"
      class="branch-filter-card-header"
      label="Modules"
      expand-separator
      header-class="text-h6"
    >
      <div class="q-pa-md">
        <div class="row q-col-gutter-sm">
          <div v-for="module in moduleList" :key="module.value" class="col-12">
            <q-item
              clickable
              class="module-item"
              @click="toggleModule(module.value)"
            >
              <q-item-section avatar>
                <q-checkbox :model-value="isChecked(module.value)" />
              </q-item-section>

              <q-item-section>
                {{ module.label }}
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </q-card></template>

<script>
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

export default {
  name: "moduleSelect",

  props: {
    modelValue: Array,
    userid: String,
    branchId: String,
  },

  emits: ["update:modelValue"],

  data() {
    return {
      modules: [],
    };
  },

  computed: {
    selectedValue: {
      get() {
        return this.modelValue || [];
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },

    moduleList() {
      return [{ label: "Select All", value: "ALL" }, ...this.modules];
    },
  },

  mounted() {
    this.LoadModule();
  },

  methods: {
    LoadModule() {
      axios
        .get(
          `${CargoNet_API}/dashboard/usermodules/${this.branchId}/${this.userid}`
        )
        .then((res) => {
          this.modules = res.data.map((m) => ({
            label: m.Description,
            value: m.ID,
          }));
        });
    },

    isChecked(value) {
      if (value === "ALL") {
        return this.selectedValue.length === this.modules.length;
      }
      return this.selectedValue.includes(value);
    },

    toggleModule(value) {
      let selected = [...this.selectedValue];

      if (value === "ALL") {
        if (selected.length === this.modules.length) {
          selected = [];
        } else {
          selected = this.modules.map((b) => b.value);
        }
      } else {
        const index = selected.indexOf(value);

        if (index > -1) {
          selected.splice(index, 1);
        } else {
          selected.push(value);
        }
      }

      this.selectedValue = selected;
    },
  },
};
</script>

<style scoped>
.module-item {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #f7f9fb;
  padding: 8px;
}
</style>
