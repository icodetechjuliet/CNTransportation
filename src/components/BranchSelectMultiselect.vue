<template><div class="branch-filter-wrapper" ref="wrapper">
    <q-card class="branch-filter-card">
      <q-expansion-item
        ref="expansionItem"
        icon="fa-solid fa-building"
        class="branch-filter-card-header"
        label="Branch"
        expand-separator
        header-class="text-h6"
        v-model="isExpanded"
      >
        <div class="branch-expansion-content">
          <div class="row q-col-gutter-sm">
            <div
              v-for="branch in branchList"
              :key="branch.value"
              class="col-12"
            >
              <q-item
                clickable
                class="branch-item"
                @click="toggleBranch(branch.value)"
              >
                <q-item-section avatar>
                  <q-checkbox
                    :model-value="isChecked(branch.value)"
                    @update:model-value="toggleBranch(branch.value)"
                  />
                </q-item-section>

                <q-item-section>
                  {{ branch.label }}
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
  </div></template>

<script>
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

export default {
  name: "BranchSelect",

  props: {
    modelValue: Array,
    userid: String,
  },

  emits: ["update:modelValue"],

  data() {
    return {
      opBranch: [],
      isExpanded: false,
    };
  },

  computed: {
    selectedValue: {
      get() {
        return this.modelValue || [];
      },
      set(val) {
        const branches = this.opBranch.filter((item) =>
          val.includes(item.value)
        );
        this.$emit("update:modelValue", val);
        this.$emit("selected-branches", branches);
      },
    },

    branchList() {
      return [{ label: "Select All", value: "ALL" }, ...this.opBranch];
    },
  },

  mounted() {
    this.LoadBranch();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    LoadBranch() {
      axios.get(`${CargoNet_API}/branches/${this.userid}`).then((res) => {
        this.opBranch = res.data.map((b) => ({
          label: b.BranchName,
          value: b.BranchID,
        }));
      });
    },

    isChecked(value) {
      if (value === "ALL") {
        return this.selectedValue.length === this.opBranch.length;
      }
      return this.selectedValue.includes(value);
    },

    toggleBranch(value) {
      let selected = [...this.selectedValue];

      if (value === "ALL") {
        if (selected.length === this.opBranch.length) {
          selected = [];
        } else {
          selected = this.opBranch.map((b) => b.value);
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

    handleClickOutside(event) {
      const wrapper = this.$refs.wrapper;
      if (wrapper && !wrapper.contains(event.target)) {
        this.isExpanded = false;
      }
    },
  },
};
</script>

<style scoped>
.branch-filter-wrapper {
  position: relative;
}

.branch-filter-card {
  position: relative;
  z-index: 100;
}

/* Hide the default expansion content to prevent layout shift */
::v-deep(.branch-filter-card .q-expansion-item__content) {
  padding: 0 !important;
  height: 0 !important;
  overflow: visible !important;
}

/* Allow content to show when expanded */
::v-deep(
    .branch-filter-card.q-expansion-item--expanded .q-expansion-item__content
  ) {
  padding: 0 !important;
  height: auto !important;
}

.branch-expansion-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0 !important;
  padding: 16px !important;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  z-index: 2000;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  visibility: hidden;
}

.q-expansion-item--expanded .branch-expansion-content {
  max-height: 400px;
  opacity: 1;
  visibility: visible;
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.branch-item {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #f7f9fb;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.branch-item:hover {
  background: #e8f0f8;
  border-color: #2a5a8c;
}
</style>
