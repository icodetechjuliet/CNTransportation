<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Office Wise To City</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="my_location" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredWiseToCities.length }}
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
            :rows="filteredWiseToCities"
            :columns="tableColumns"
            row-key="WiseToCityId"
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
                      @keyup.enter="loadWiseToCities"
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
                      @click="loadWiseToCities"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_WiseToCity m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddWiseToCity"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadWiseToCities"
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
                  @click="editWiseToCity(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeleteWiseToCity(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.WiseToCityId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="my_location" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">
                        {{ props.row.BookingOfficeName }}
                      </span>
                      <span class="mjc-job-date">
                        {{ props.row.ToCityName }}
                      </span>
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
                        expandedMobileCards.includes(props.row.WiseToCityId)
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
                    @click="editWiseToCity(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDeleteWiseToCity(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.WiseToCityId)"
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
// Booking Office Wise To City data/mock-"backend" now lives in its own
// module, src/data/bookingOfficeData.js (localStorage-backed, so
// add/edit/delete persist like a real DB) — every Booking Office-family
// page imports from there directly instead of from this page.
import {
  apiGetWiseToCities,
  apiSaveWiseToCity,
  apiDeleteWiseToCity,
  apiGetWiseToCityById,
  MOCK_DATA_WISE_TO_CITY as MOCK_DATA,
} from "src/data/bookingOfficeData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadWiseToCities",
  name: "DMSBookingOfficeWiseToCity",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      wiseToCities: [],
      filteredWiseToCities: [],
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
        {
          name: "ToCityName",
          label: "To City",
          field: "ToCityName",
          sortable: true,
        },
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
    this.loadWiseToCities();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadWiseToCities();
    },

    async loadWiseToCities() {
      this.filteredWiseToCities = await apiGetWiseToCities(this.searchText);
    },

    emptyForm() {
      return {
        WiseToCityId: null,
        BookingOfficeName: "",
        ToCityName: "",
        Remarks: "",
        IsActive: true,
      };
    },

    openAddWiseToCity() {
      this.openEntryPage(
        "/DMSBookingOfficeWiseToCityView?mode=add",
        "New Wise To City"
      );
    },

    editWiseToCity(row) {
      this.openEntryPage(
        `/DMSBookingOfficeWiseToCityView?mode=edit&wiseToCityId=${row.WiseToCityId}`,
        `Wise To City ${row.ToCityName || ""}`.trim()
      );
    },

    async saveWiseToCity() {
      if (!this.form.BookingOfficeName || !this.form.ToCityName) {
        this.$q.notify({
          message: "Booking Office and To City are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveWiseToCity({ ...this.form });
      if (res.success) {
        this.$q.notify({
          message: "Wise To City saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.loadWiseToCities();
      }
    },

    confirmDeleteWiseToCity(row) {
      this.$q
        .dialog({
          title: "Delete Wise To City",
          message: `Delete mapping for <b>${row.BookingOfficeName}</b> / <b>${row.ToCityName}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteWiseToCity(row.WiseToCityId);
          this.$q.notify({
            message: "Wise To City deleted",
            color: "negative",
            position: "top",
          });
          this.loadWiseToCities();
        });
    },

    closeDialog() {
      this.showDialog = false;
    },
  },
};
</script>
