<template>
  <div>
    <!-- Old app: BUK_EWayBill's "Part A" generation — the base e-way bill
         record raised against a booking, before any vehicle (Part B) is
         attached. List + Add/Edit dialog, same shell as
         GenericMasterList.vue but as its own page since this record's
         fields/actions (Generate Part B elsewhere) don't fit the flat
         master shape that component assumes. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">E Way Bill - Part A</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="description" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredBills.length }}</span>
                <span class="total-stat-label">Total E-Way Bills</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredBills"
            :columns="tableColumns"
            row-key="EWayBillId"
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
                      @keyup.enter="loadBills"
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
                      @click="loadBills"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    dense
                    no-caps
                    icon="add"
                    label="New E-Way Bill"
                    class="bg-dblue-lblue text-white radius-md q-px-sm text-no-wrap q-ml-sm"
                    @click="openAdd"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue q-ml-sm"
                    @click="loadBills"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-PartBStatus="props">
              <q-td :props="props">
                <q-badge
                  :color="props.value === 'Generated' ? 'positive' : 'orange'"
                  :label="props.value"
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
                  @click="openEdit(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDelete(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.EWayBillId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="description" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.EWayBillNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.BookingNo }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      class="mjc-status-badge"
                      :color="
                        props.row.PartBStatus === 'Generated'
                          ? 'positive'
                          : 'orange'
                      "
                    >
                      {{ props.row.PartBStatus }}
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.EWayBillId)
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
                    @click="openEdit(props.row)"
                  />
                  <q-btn
                    dense
                    unelevated
                    icon="fa-solid fa-trash"
                    label="Delete"
                    class="mjc-btn mjc-btn-edit"
                    @click="confirmDelete(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.EWayBillId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Route</span>
                        <span class="mjc-detail-value">
                          {{ props.row.FromCity }} → {{ props.row.ToCity }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignor</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsignorName }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignee</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsigneeName }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Value</span>
                        <span class="mjc-detail-value">
                          {{ props.row.DocValue }}
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
import {
  apiGetEWayBills,
  apiSaveEWayBill,
  apiDeleteEWayBill,
  MOCK_DATA,
} from "src/data/ewayBillData.js";

export default {
  mixins: [entryNavigation],
  entryReload: "loadBills",
  name: "DMSEWayBillPartA",

  data() {
    return {
      filteredBills: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],
      mockData: MOCK_DATA,

      showDialog: false,
      dialogMode: "add",
      form: this.emptyForm(),

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "EWayBillNo",
          label: "E-Way Bill No.",
          field: "EWayBillNo",
          sortable: true,
        },
        {
          name: "BookingNo",
          label: "Booking No.",
          field: "BookingNo",
          sortable: true,
        },
        { name: "FromCity", label: "From City", field: "FromCity" },
        { name: "ToCity", label: "To City", field: "ToCity" },
        { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
        { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
        { name: "DocValue", label: "Value", field: "DocValue", align: "right" },
        {
          name: "PartBStatus",
          label: "Part B",
          field: "PartBStatus",
          align: "center",
        },
      ],
    };
  },

  mounted() {
    this.loadBills();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadBills();
    },

    async loadBills() {
      this.filteredBills = await apiGetEWayBills(this.searchText);
    },

    emptyForm() {
      return {
        EWayBillId: null,
        BookingNo: "",
        BookingDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        FromCity: "",
        ToCity: "",
        ConsignorName: "",
        ConsigneeName: "",
        DocValue: 0,
        HSNCode: "",
        TransportMode: "Road",
      };
    },

    openAdd() {
      this.form = this.emptyForm();
      this.dialogMode = "add";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSEWayBillPartAForm?mode=${this.dialogMode}&id=${
            this.form.EWayBillId || ""
          }`,
          "E-Way Bill Part A"
        );
      }
    },

    openEdit(row) {
      this.form = { ...row };
      this.dialogMode = "edit";
      if (this.entryPage) {
        this.showDialog = true;
      } else {
        this.openEntryPage(
          `/DMSEWayBillPartAForm?mode=${this.dialogMode}&id=${
            this.form.EWayBillId || ""
          }`,
          "E-Way Bill Part A"
        );
      }
    },

    async save() {
      if (!this.form.BookingNo || !this.form.FromCity || !this.form.ToCity) {
        this.$q.notify({
          message: "Booking No., From City and To City are required",
          color: "negative",
          position: "top",
        });
        return;
      }
      const res = await apiSaveEWayBill({ ...this.form });
      if (res.success) {
        if (this.entryPage && res.data) {
          this.form = { ...res.data };
          this.dialogMode = "edit";
        }
        this.$q.notify({
          message: "E-Way Bill saved!",
          color: "positive",
          position: "top",
        });
        this.showDialog = false;
        this.notifyEntrySaved();
        this.loadBills();
      }
    },

    confirmDelete(row) {
      this.$q
        .dialog({
          title: "Delete E-Way Bill",
          message: `Delete E-Way Bill <b>${row.EWayBillNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeleteEWayBill(row.EWayBillId);
          this.$q.notify({
            message: "E-Way Bill deleted",
            color: "negative",
            position: "top",
          });
          this.loadBills();
        });
    },
  },
};
</script>
