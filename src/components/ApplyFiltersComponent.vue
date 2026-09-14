<template><q-card class="q-filter-wrapper">
    <!-- HEADER -->
    <q-card-section class="filter-page-header row items-center justify-between">
      <div class="header-title">
        <q-icon name="filter_alt" size="18px" class="q-mr-sm" />
        Filter Panel
      </div>
      <q-btn dense flat round icon="close" color="white" v-close-popup />
    </q-card-section>

    <!-- CONTENT -->
    <div class="row q-col-gutter-lg items-stretch">
      <!-- CALENDAR -->
      <div class="col-12 col-md-4">
        <q-card class="filter-card full-height-card">
          <q-card-section class="filter-card-header">
            <q-icon name="event" size="18px" class="q-mr-sm" />
            Date Filter
          </q-card-section>

          <q-separator />

          <q-card-section class="calendar-body">
            <!-- PRESET OPTIONS -->
            <div class="preset-list">
              <div
                class="preset-item"
                :class="{ active: selectedPreset === 'week' }"
                @click="selectWeek"
              >
                <q-icon name="view_week" />
                <div class="preset-text">
                  This Week
                  <div class="preset-sub">Sunday – Saturday</div>
                </div>
                <q-icon v-if="selectedPreset === 'week'" name="check_circle" />
              </div>

              <div
                class="preset-item"
                :class="{ active: selectedPreset === 'month' }"
                @click="selectMonth"
              >
                <q-icon name="calendar_month" />
                <div class="preset-text">
                  This Month
                  <div class="preset-sub">Current Month</div>
                </div>
                <q-icon v-if="selectedPreset === 'month'" name="check_circle" />
              </div>

              <div
                class="preset-item"
                :class="{ active: selectedPreset === 'custom' }"
                @click="selectCustom"
              >
                <q-icon name="tune" />
                <div class="preset-text">
                  Custom Range
                  <div class="preset-sub">Manual Selection</div>
                </div>
                <q-icon
                  v-if="selectedPreset === 'custom'"
                  name="check_circle"
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- DATE INPUTS OR CALENDAR -->
            <div class="row justify-center">
              <!-- Show only From/To date inputs for Custom -->
              <div
                v-if="selectedPreset === 'custom'"
                class="row q-col-gutter-sm"
              >
                <div class="col-6">
                  <q-input bg-color="blue-1"
                    outlined
                    dense
                    type="date"
                    label="From Date"
                    v-model="localDateRange.from"
                  />
                </div>
                <div class="col-6">
                  <q-input bg-color="blue-1"
                    outlined
                    dense
                    type="date"
                    label="To Date"
                    v-model="localDateRange.to"
                  />
                </div>
              </div>

              <!-- Show calendar for Week or Month -->
              <div v-else>
                <q-date
                  v-model="localDateRange"
                  range
                  flat
                  minimal
                  color="primary"
                  :disable="disableFutureDates"
                  :options="highlightSelected"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- BRANCHES & MODULES -->
      <div class="col-12 col-md-4">
        <div class="row q-col-gutter-lg">
          <!-- BRANCH -->
          <div class="col-12">
            <q-card class="filter-card">
              <q-card-section class="filter-card-header">
                <q-icon name="apartment" class="q-mr-sm" />
                Branch
              </q-card-section>

              <q-separator />

              <q-card-section class="filter-card-body module-scroll">
                <div
                  v-for="b in branch"
                  :key="b.value"
                  class="option-item"
                  :class="{ active: localBranch[b.label] }"
                  @click="isCurrentBranch(b) ? null : toggleBranch(b)"
                >
                  <div class="option-left">
                    <q-checkbox
                      dense
                      :model-value="localBranch[b.label]"
                      :disable="isCurrentBranch(b)"
                    />
                    <span
                      :class="{
                        'text-grey-7': isCurrentBranch(b),
                        'font-weight-600': isCurrentBranch(b),
                      }"
                    >
                      {{ b.label }}
                      <span
                        v-if="isCurrentBranch(b)"
                        class="text-caption text-grey-6"
                        >(Current)</span
                      >
                    </span>
                  </div>
                  <q-icon v-if="localBranch[b.label]" name="check_circle" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- MODULES -->
          <div class="col-12">
            <q-card class="filter-card">
              <q-card-section class="filter-card-header">
                <q-icon name="layers" class="q-mr-sm" />
                Modules
              </q-card-section>

              <q-separator />

              <q-card-section class="filter-card-body module-scroll">
                <div
                  v-for="m in modules"
                  :key="m.value"
                  class="option-item"
                  :class="{ active: localModules[m.label] }"
                  @click="toggleModule(m)"
                >
                  <div class="option-left">
                    <q-checkbox dense :model-value="localModules[m.label]" />
                    <span>{{ m.label }}</span>
                  </div>
                  <q-icon v-if="localModules[m.label]" name="check_circle" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- USERS -->
      <div class="col-12 col-md-4">
        <q-card class="filter-card">
          <q-card-section class="filter-card-header">
            <q-icon name="person" class="q-mr-sm" />
            Users
          </q-card-section>

          <q-separator />

          <q-card-section class="filter-card-body users-scroll">
            <!-- Select All (disabled if only current user) -->
            <div
              class="option-item select-all"
              @click="toggleSelectAll"
              :class="{ 'cursor-not-allowed': users.length === 1 }"
            >
              <div class="option-left">
                <q-checkbox
                  dense
                  :model-value="isAllSelectedLocal"
                  :disable="users.length === 1"
                />
                <span :class="{ 'text-grey-7': users.length === 1 }"
                  >Select All</span
                >
              </div>
            </div>

            <!-- Users List -->
            <div
              v-for="u in users"
              :key="u.value"
              class="option-item"
              :class="{ active: localUsers[u.label] }"
              @click="isCurrentUser(u) ? null : toggleUser(u)"
            >
              <div class="option-left">
                <q-checkbox
                  dense
                  :model-value="localUsers[u.label]"
                  :disable="isCurrentUser(u)"
                />
                <span
                  :class="{
                    'text-grey-7': isCurrentUser(u),
                    'font-weight-600': isCurrentUser(u),
                  }"
                >
                  {{ u.label }}
                  <span v-if="isCurrentUser(u)" class="text-caption text-grey-6"
                    >(Current)</span
                  >
                </span>
              </div>
              <q-icon v-if="localUsers[u.label]" name="check_circle" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- FOOTER -->
    <q-separator class="q-my-md" />
    <div class="row justify-end q-gutter-sm">
      <q-btn flat label="Cancel" color="grey-7" v-close-popup />
      <q-btn
        unelevated
        label="Apply Filters"
        color="primary"
        @click="applyFilters"
        v-close-popup
      />
    </div>
  </q-card></template>

<script>
import { date } from "quasar";
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

export default {
  props: {
    userid: String,
    username: String,
    dateRange: Object,
    branchFields: Array,
    BranchID: Number,
    userFields: Array,
  },
  data() {
    return {
      localUsers: {},
      localBranch: {},
      localModules: {},
      localDateRange: "",
      selectedPreset: "custom",
      modules: [],
      branch: [],
      users: [],
      isadmin: "",
      isAllSelectedLocal: false,
      selectedBranches: [],
      selectedUsers: [],
      selectedModules: [],
      currentUserValue: null,
      currentBranchValue: null,
    };
  },

  watch: {
    dateRange: {
      handler(newVal) {
        if (newVal) {
          this.localDateRange = { ...newVal };
          this.selectedPreset =
            this.localDateRange.from && this.localDateRange.to
              ? "custom"
              : "month";
        }
      },
      deep: true,
      immediate: true,
    },
    userFields: {
      handler(newVal) {
        this.syncUserFields(newVal);
      },
      deep: true,
      immediate: true,
    },
    branchFields: {
      handler(newVal) {
        this.syncBranchFields(newVal);
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    // Load initial data and sync with props
    this.currentUserValue = parseFloat(this.userid);
    this.currentBranchValue = this.BranchID;

    this.Checkadminusers();
    this.LoadUsers().then(() => {
      this.selectCurrentUserAndBranch();
    });
    this.LoadBranchFields().then(() => {
      this.selectCurrentUserAndBranch();
    });
    this.LoadModules();
    this.LoadFinancialYearDate();
    this.loadFilters();
    this.initializeFromProps();
  },

  methods: {
    syncUserFields(newVal) {
      if (newVal && Array.isArray(newVal) && this.users.length > 0) {
        // Reset all users
        Object.keys(this.localUsers).forEach((key) => {
          this.localUsers[key] = false;
        });
        this.selectedUsers = [];

        // Set selected users
        newVal.forEach((userId) => {
          const user = this.users.find((u) => u.value === userId);
          if (user) {
            this.localUsers[user.label] = true;
            this.selectedUsers.push(userId);
          }
        });
        this.updateSelectAll();
      }
    },

    syncBranchFields(newVal) {
      if (newVal && Array.isArray(newVal) && this.branch.length > 0) {
        // Reset all branches
        Object.keys(this.localBranch).forEach((key) => {
          this.localBranch[key] = false;
        });
        this.selectedBranches = [];

        // Set selected branches
        newVal.forEach((branchId) => {
          const branch = this.branch.find((b) => b.value === branchId);
          if (branch) {
            this.localBranch[branch.label] = true;
            this.selectedBranches.push(branchId);
          }
        });
      }
    },

    initializeLocalUsers() {
      this.users.forEach((u) => {
        this.localUsers[u.label] = this.localUsers[u.label] ?? false;
      });
    },

    initializeFromProps() {
      // Initialize from props
      if (this.dateRange) {
        this.localDateRange = { ...this.dateRange };
        this.selectedPreset =
          this.localDateRange.from && this.localDateRange.to
            ? "custom"
            : "month";
      }

      this.syncUserFields(this.userFields);
      this.syncBranchFields(this.branchFields);
    },

    isCurrentUser(u) {
      return u.value === this.currentUserValue;
    },

    isCurrentBranch(b) {
      return b.value === this.currentBranchValue;
    },

    selectCurrentUserAndBranch() {
      // Find and select current user
      const currentUser = this.users.find(
        (u) => u.value === this.currentUserValue
      );
      if (currentUser) {
        this.localUsers[currentUser.label] = true;
        if (!this.selectedUsers.includes(this.currentUserValue)) {
          this.selectedUsers.push(this.currentUserValue);
        }
      }

      // Find and select current branch
      const currentBranch = this.branch.find(
        (b) => b.value === this.currentBranchValue
      );
      if (currentBranch) {
        this.localBranch[currentBranch.label] = true;
        if (!this.selectedBranches.includes(this.currentBranchValue)) {
          this.selectedBranches.push(this.currentBranchValue);
        }
      }

      this.updateSelectAll();
    },

    // toggleUser(u) {
    //   this.localUsers[u.label] = !this.localUsers[u.label];
    //   this.updateSelectAll();
    // },

    toggleUser(u) {
      this.localUsers[u.label] = !this.localUsers[u.label];

      if (this.localUsers[u.label]) {
        if (!this.selectedUsers.includes(u.value)) {
          this.selectedUsers.push(u.value);
        }
      } else {
        this.selectedUsers = this.selectedUsers.filter((id) => id !== u.value);
      }

      this.updateSelectAll();
    },
    toggleSelectAll() {
      const nonCurrentUsers = this.users.filter((u) => !this.isCurrentUser(u));

      // Check if all non-current users are already selected
      const allOthersSelected =
        nonCurrentUsers.length > 0 &&
        nonCurrentUsers.every((u) => this.localUsers[u.label]);

      // If all others are selected, deselect them; otherwise select them
      const newValue = !allOthersSelected;

      this.selectedUsers = [];

      this.users.forEach((u) => {
        // Always keep current user selected
        if (this.isCurrentUser(u)) {
          this.localUsers[u.label] = true;
          this.selectedUsers.push(u.value);
        } else {
          this.localUsers[u.label] = newValue;
          if (newValue) {
            this.selectedUsers.push(u.value);
          }
        }
      });

      this.updateSelectAll();
    },
    toggleModule(m) {
      this.localModules[m.label] = !this.localModules[m.label];

      if (this.localModules[m.label]) {
        if (!this.selectedModules.includes(m.value)) {
          this.selectedModules.push(m.value);
        }
      } else {
        this.selectedModules = this.selectedModules.filter(
          (id) => id !== m.value
        );
      }
    },
    toggleBranch(b) {
      // toggle checkbox
      this.localBranch[b.label] = !this.localBranch[b.label];

      if (this.localBranch[b.label]) {
        // add BranchID
        if (!this.selectedBranches.includes(b.value)) {
          this.selectedBranches.push(b.value);
        }
      } else {
        // remove BranchID
        this.selectedBranches = this.selectedBranches.filter(
          (id) => id !== b.value
        );
      }
    },
    // toggleModule(m) {
    //   this.localModules[m.label] = !this.localModules[m.label];
    // },

    // toggleSelectAll() {
    //   const newValue = !this.isAllSelectedLocal;
    //   this.isAllSelectedLocal = newValue;
    //   this.users.forEach((u) => {
    //     this.localUsers[u.label] = newValue;
    //   });
    // },

    updateSelectAll() {
      this.isAllSelectedLocal = this.users.length
        ? this.users.every((u) => this.localUsers[u.label])
        : false;
    },

    selectWeek() {
      const today = new Date();
      const start = new Date(today.setDate(today.getDate() - today.getDay()));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      this.localDateRange = {
        from: date.formatDate(start, "YYYY-MM-DD"),
        to: date.formatDate(end, "YYYY-MM-DD"),
      };
      this.selectedPreset = "week";
    },

    selectMonth() {
      const today = new Date();
      this.localDateRange = {
        from: date.formatDate(
          new Date(today.getFullYear(), today.getMonth(), 1),
          "YYYY-MM-DD"
        ),
        to: date.formatDate(
          new Date(today.getFullYear(), today.getMonth() + 1, 0),
          "YYYY-MM-DD"
        ),
      };
      this.selectedPreset = "month";
    },

    selectCustom() {
      this.selectedPreset = "custom";
    },

    highlightSelected(d) {
      if (!this.localDateRange.from) return false;
      const dateObj = new Date(d);
      const from = new Date(this.localDateRange.from);
      const to = new Date(this.localDateRange.to);
      return dateObj >= from && dateObj <= to;
    },

    disableFutureDates(d) {
      return d > new Date();
    },

    applyFilters() {
      // this.$emit("update:dateRange", this.localDateRange, this.selectedPreset);
      this.$emit("apply", {
        users: this.selectedUsers,
        branches: this.selectedBranches,
        modules: this.selectedModules,
        dateRange: this.localDateRange,
        selectedPreset: this.selectedPreset,
      });
      this.saveFilters();
    },

    async LoadModules() {
      const res = await axios.get(
        `${CargoNet_API}/dashboard/usermodules/${this.BranchID}/${this.userid}`
      );

      this.modules = res.data.map((m) => ({
        label: m.Description,
        value: m.ID,
      }));

      // Initialize checkbox state for modules
      this.modules.forEach((m) => {
        if (!(m.label in this.localModules)) {
          this.localModules[m.label] = false;
        }
      });

      this.selectedModules = [];
      this.modules.forEach((m) => {
        if (this.localModules[m.label]) {
          this.selectedModules.push(m.value);
        }
      });
    },
    async Checkadminusers() {
      try {
        const res = await axios.get(
          `${CargoNet_API}/industrydata/isadmin/${this.userid}`
        );
        this.isadmin = res.data[0].Status;
      } catch (err) {
        console.log(err);
      }
    },

    async LoadUsers() {
      const res = await axios.get(`${CargoNet_API}/industrydata/userfromlog`);

      if (this.isadmin === "Y") {
        this.users = res.data.map((u) => ({
          label: u.name,
          value: u.id,
        }));
      } else {
        this.users = [
          {
            label: this.username,
            value: parseFloat(this.userid),
          },
        ];
      }

      // Initialize localUsers for all users
      this.users.forEach((u) => {
        if (!(u.label in this.localUsers)) {
          this.localUsers[u.label] = false;
        }
      });

      // Sync with props if available
      if (this.userFields && Array.isArray(this.userFields)) {
        this.syncUserFields(this.userFields);
      } else {
        this.selectedUsers = [];
      }

      this.updateSelectAll();
    },
    async LoadBranchFields() {
      try {
        const res = await axios.get(`${CargoNet_API}/branches/${this.userid}`);

        this.branch = res.data.map((b) => ({
          label: b.Branchcode,
          value: b.BranchID,
        }));

        // Initialize checkbox state
        this.branch.forEach((b) => {
          if (!(b.label in this.localBranch)) {
            this.localBranch[b.label] = false;
          }
        });

        // Sync with props if available
        if (this.branchFields && Array.isArray(this.branchFields)) {
          this.syncBranchFields(this.branchFields);
        } else {
          this.selectedBranches = [];
        }
      } catch (err) {
        console.log(err);
      }
    },

    saveFilters() {
      const filters = {
        localUsers: this.localUsers,
        localBranch: this.localBranch,
        localModules: this.localModules,
        localDateRange: this.localDateRange,
        selectedPreset: this.selectedPreset,
      };
      localStorage.setItem("applyFiltersState", JSON.stringify(filters));
    },

    loadFilters() {
      const saved = localStorage.getItem("applyFiltersState");
      if (!saved) return;

      const f = JSON.parse(saved);
      this.localUsers = f.localUsers || {};
      this.localBranch = f.localBranch || {};
      this.localModules = f.localModules || {};
      this.localDateRange = f.localDateRange;
      this.selectedPreset = f.selectedPreset || "custom";

      // 🔥 rebuild selected ID arrays
      this.selectedUsers = [];
      this.selectedModules = [];

      Object.keys(this.localUsers).forEach((k) => {
        if (this.localUsers[k]) {
          const u = this.users.find((x) => x.label === k);
          if (u) this.selectedUsers.push(u.value);
        }
      });

      Object.keys(this.localModules).forEach((k) => {
        if (this.localModules[k]) {
          const m = this.modules.find((x) => x.label === k);
          if (m) this.selectedModules.push(m.value);
        }
      });

      this.updateSelectAll();
    },
    LoadFinancialYearDate() {
      axios
        .get(`${CargoNet_API}/financialyear/finyrdate`)
        .then((res) => {
          const item = res.data[0];
          this.localDateRange = {
            from: item.Startdate,
            to: item.Enddate || new Date(),
          };
        })
        .catch(console.log);
    },
  },
};
</script>

<style scoped>
.cursor-not-allowed {
  cursor: not-allowed;
}

.text-grey-7 {
  color: #757575;
  opacity: 0.6;
}

.text-grey-6 {
  color: #9e9e9e;
}

.font-weight-600 {
  font-weight: 600;
}

.text-caption {
  font-size: 0.75rem;
  line-height: 1.25rem;
}

.option-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
