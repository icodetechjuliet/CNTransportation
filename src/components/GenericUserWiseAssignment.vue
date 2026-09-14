<template>
  <div>
    <!-- "Pick a user, then check which items they're granted" shape — the
         old EagleParcel app's User Wise Menu/Rights/Booking Office/Fin Year
         screens all share this, so one generic component (driven by
         ASSIGNMENT_DEFS in src/data/securityData.js) renders all 4 instead
         of four near-identical bespoke pages, same spirit as
         GenericMasterList.vue/GenericReportList.vue. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9 header-inner">
            <div class="header-title">
              <span class="header_text1">{{ def.title }}</span>
            </div>
            <div class="header-field-group header-field-group-md">
              <q-select
                square
                dense
                outlined
                bg-color="blue-1"
                label="User"
                v-model="selectedUserId"
                :options="userOptions"
                emit-value
                map-options
                @update:model-value="loadAssignment"
              />
            </div>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
            <div class="row q-col-gutter-x-sm justify-end items-center">
              <div class="row items-center no-wrap desktop-actions-group">
                <q-btn
                  dense
                  unelevated
                  no-caps
                  icon="task_alt"
                  label="Save"
                  :disable="!selectedUserId"
                  class="desktop-action-btn bg-green-white bdr-green text-dgreen"
                  @click="save"
                />
              </div>
            </div>
          </div>
        </div>

        <q-card class="notab-container">
          <q-inner-loading :showing="loading" color="primary" />
          <q-card-section v-if="!selectedUserId">
            <div class="text-grey-7">
              Select a user above to view/edit their
              {{ def.itemLabel }} assignments.
            </div>
          </q-card-section>

          <q-card-section v-else>
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2 text-dark">
                {{ def.itemLabel }} Assigned
              </div>
              <q-space />
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                label="Select All"
                @click="assignedItems = [...def.items]"
              />
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                label="Clear"
                @click="assignedItems = []"
              />
            </div>
            <div class="row q-col-gutter-sm items-start">
              <div
                class="col-12 col-sm-6 col-md-3"
                v-for="item in def.items"
                :key="item"
              >
                <q-item
                  tag="label"
                  v-ripple
                  bg-color="blue-1"
                  class="chckbx-style full-width"
                >
                  <q-item-section avatar>
                    <q-checkbox
                      dense
                      v-model="assignedItems"
                      :val="item"
                      color="orange"
                      intermediate-icon="black"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label dense>{{ item }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import {
  getAssignmentDef,
  apiGetUsers,
  apiGetAssignment,
  apiSaveAssignment,
} from "src/data/securityData.js";

export default {
  name: "GenericUserWiseAssignment",

  props: {
    assignKey: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      def: getAssignmentDef(this.assignKey),
      users: [],
      selectedUserId: null,
      assignedItems: [],
      loading: false,
    };
  },

  computed: {
    userOptions() {
      return this.users.map((u) => ({ label: u.UserName, value: u.UserID }));
    },
  },

  async mounted() {
    this.users = await apiGetUsers();
  },

  methods: {
    async loadAssignment() {
      if (!this.selectedUserId) {
        this.assignedItems = [];
        return;
      }
      this.loading = true;
      try {
        this.assignedItems = await apiGetAssignment(
          this.assignKey,
          this.selectedUserId
        );
      } finally {
        this.loading = false;
      }
    },

    async save() {
      if (!this.selectedUserId) return;
      const res = await apiSaveAssignment(
        this.assignKey,
        this.selectedUserId,
        this.assignedItems
      );
      if (res.success) {
        this.$q.notify({
          message: this.def.title + " saved!",
          color: "positive",
          position: "top",
        });
      }
    },
  },
};
</script>
