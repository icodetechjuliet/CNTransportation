<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office Wise City</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="location_city" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredWiseCities.length }}
                </span>
                <span class="total-stat-label">Total Records</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredWiseCities"
            :columns="tableColumns"
            row-key="WiseCityId"
            :rows-per-page-options="[15, 25, 50, 100]"
            v-model:pagination="pagination"
            table-class="text-black m-table-style"
            table-header-class="text-black m-table-style"
            card-class="text-black"
            :grid="$q.screen.lt.sm"
          >
            <template v-slot:top>
              <div class="tb-app col">
                <div class="filter-bar-wrapper accent-filter-bar">
                  <div class="search-combo-wrapper">
                    <input
                      v-model="searchText"
                      class="search-combo-input"
                      placeholder="Search Any"
                      @keyup.enter="loadWiseCities"
                    />
                    <q-btn
                      v-if="searchText"
                      flat
                      dense
                      round
                      icon="close"
                      size="xs"
                      class="search-combo-clear-btn"
                      @click="clearSearch"
                    >
                      <q-tooltip>Clear</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      icon="search"
                      class="search-combo-icon-btn"
                      @click="loadWiseCities"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_WiseCity m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddWiseCity"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadWiseCities"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-IsActive="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value ? 'positive' : 'grey'"
                  :label="props.value ? 'Active' : 'Inactive'"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editWiseCity(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteWiseCity(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.WiseCityId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="location_city" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">
                        {{ props.row.BookingOfficeName }}
                      </span>
                      <span class="mjc-job-date">{{ props.row.CityName }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="props.row.IsActive ? 'positive' : 'grey'"
                    >
                      {{ props.row.IsActive ? "Active" : "Inactive" }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.WiseCityId)
                          ? 'expand_less'
                          : 'expand_more'
                      "
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-pen-to-square"
                    label="Edit"
                    class="mjc-btn mjc-btn-edit"
                    @click="editWiseCity(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteWiseCity(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.WiseCityId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Remarks</span>
                        <span class="mjc-detail-value">
                          {{ props.row.Remarks || "—" }}
                        </span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import entryNavigation from "src/mixins/entryNavigation.js";
// Booking Office Wise City data/mock-"backend" now lives in its own
// module, src/data/bookingOfficeData.js (localStorage-backed, so
// add/edit/delete persist like a real DB) — every Booking Office-family
// page imports from there directly instead of from this page.
import {
  apiGetWiseCities,
  apiSaveWiseCity,
  apiDeleteWiseCity,
  apiGetWiseCityById,
  MOCK_DATA_WISE_CITY as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadWiseCities",
  name: "DMSBookingOfficeWiseCity",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      wiseCities: [],
      filteredWiseCities: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      mockData: MOCK_DATA,

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "BookingOfficeName",
          label: "Booking Office",
          field: "BookingOfficeName",
          sortable: true,
        },
        { name: "CityName", label: "City", field: "CityName", sortable: true },
        { name: "Remarks", label: "Remarks", field: "Remarks" },
        {
          name: "IsActive",
          label: "Status",
          field: "IsActive",
          align: "center",
        },
      ],
    };
  },

  mounted() {
    this.loadWiseCities();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadWiseCities();
    },

    async loadWiseCities() {
      this.filteredWiseCities = await apiGetWiseCities(this.searchText);
    },

    emptyForm() {
      return {
        WiseCityId: null,
        BookingOfficeName: "",
        CityName: "",
        Remarks: "",
        IsActive: true,
      };
    },

    openAddWiseCity() {
      this.openEntryPage(
        "/DMSBookingOfficeWiseCityView?mode=add",
        "New Wise City"
      );
    },

    editWiseCity(row) {
      this.openEntryPage(
        `/DMSBookingOfficeWiseCityView?mode=edit&wiseCityId=${row.WiseCityId}`,
        `Wise City ${row.CityName || ""}`.trim()
      );
    },

    async saveWiseCity() {
      if (!this.form.BookingOfficeName || !this.form.CityName) {
        this.$q.notify({
          message: "Booking Office and City are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveWiseCity({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Wise City saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadWiseCities();
      }
    },

    confirmDeleteWiseCity(row) {
      this.$q
        .dialog({
          title: "Delete Wise City",
          message: `Delete mapping for <b>${row.BookingOfficeName}</b> / <b>${row.CityName}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteWiseCity(row.WiseCityId);
          this.$q.notify({
            message: "Wise City deleted",
            color: "negative",
            position: "top",
          });
          this.loadWiseCities();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
