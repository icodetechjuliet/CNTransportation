<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking POD</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="task_alt" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">{{ filteredPods.length }}</span>
                <span class="total-stat-label">Total PODs</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredPods"
            :columns="tableColumns"
            row-key="PodId"
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
                      @keyup.enter="loadPods"
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
                    <q-btn flat dense icon="search" class="search-combo-icon-btn" @click="loadPods">
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <!-- Same "add_new_*" gradient-chip CSS family the Booking
                       pages use — text comes entirely from ".add_new_Pod"'s
                       ::after rule in cn-style.css, so no `label` prop. -->
                  <q-btn
                    flat
                    dense
                    no-caps
                    class="add_new_Pod m_add_newjob bg-dblue-lblue"
                    accesskey="n"
                    @click="openAddPod"
                  />

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadPods"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-Status="props">
              <q-td :props="props">
                <q-badge :color="props.value === 'Confirmed' ? 'positive' : 'orange'" :label="props.value" />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="fa-solid fa-eye"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style vw"
                  @click="viewPod(props.row)"
                  ><q-tooltip>View</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-pen-to-square"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style mody"
                  @click="editPod(props.row)"
                  ><q-tooltip>Edit</q-tooltip></q-btn
                >
                <q-btn
                  icon="fa-solid fa-trash"
                  color="negative"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="confirmDeletePod(props.row)"
                  ><q-tooltip>Delete</q-tooltip></q-btn
                >
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div class="mjc-header" @click="toggleMobileCard(props.row.PodId)">
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge"><q-icon name="task_alt" size="14px" /></div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.PodNo }}</span>
                      <span class="mjc-job-date">{{ props.row.PodDate }}</span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge class="mjc-status-badge" :color="props.row.Status === 'Confirmed' ? 'positive' : 'orange'">
                      {{ props.row.Status }}
                    </q-badge>
                    <q-icon
                      :name="expandedMobileCards.includes(props.row.PodId) ? 'expand_less' : 'expand_more'"
                      size="20px"
                      color="grey-6"
                    />
                  </div>
                </div>

                <div class="mjc-actions">
                  <q-btn dense unelevated icon="fa-solid fa-eye" label="View" class="mjc-btn mjc-btn-view" @click="viewPod(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-pen-to-square" label="Edit" class="mjc-btn mjc-btn-edit" @click="editPod(props.row)" />
                  <q-btn dense unelevated icon="fa-solid fa-trash" label="Delete" class="mjc-btn mjc-btn-edit" @click="confirmDeletePod(props.row)" />
                </div>

                <transition name="mobile-expand">
                  <div v-if="expandedMobileCards.includes(props.row.PodId)" class="mjc-details">
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Booking Office</span><span class="mjc-detail-value">{{ props.row.BookingOfficeName || "—" }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Bookings</span><span class="mjc-detail-value">{{ props.row.BookingCount }}</span></div>
                      <div class="mjc-detail-row"><span class="mjc-detail-label">Total Amt.</span><span class="mjc-detail-value">{{ props.row.TotalAmount }}</span></div>
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
// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls (see dms-booking-page-pattern
//  skill's "Data layer conventions").
// ─────────────────────────────────────────────
const MOCK_DATA = {
  bookingOffices: ["Greenland", "Chakan", "Nasik", "Pune"],
  // Pending bookings a POD batch can pull in — mirrors the shape
  // DMSBooking.vue's MOCK_BOOKINGS uses for the fields this sub-table shows.
  pendingBookings: [
    { BookingId: 101, BookingNo: "RKG21040001", BookingDate: "01/04/2026", ConsigneeName: "Galaxy xxx Tooling", ToCity: "Chakan", NetAmt: 262.5 },
    { BookingId: 102, BookingNo: "RKG21040002", BookingDate: "01/04/2026", ConsigneeName: "Ring xxx Ltd", ToCity: "Nasik", NetAmt: 340.0 },
    { BookingId: 103, BookingNo: "RKG21040003", BookingDate: "02/04/2026", ConsigneeName: "Balaji xxx Co.", ToCity: "Pune", NetAmt: 180.0 },
  ],
};

const MOCK_PODS = [
  {
    PodId: 1,
    PodNo: "POD2104001",
    PodDate: "03/04/2026",
    BookingOfficeName: "Chakan",
    BookingCount: 2,
    TotalAmount: 602.5,
    Status: "Confirmed",
    Remarks: "",
    BookingIds: [101, 102],
  },
];

function apiGetPods(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_PODS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (p) =>
            p.PodNo.toLowerCase().includes(s) ||
            (p.BookingOfficeName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

function apiGetPodById(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PODS.find((p) => p.PodId === id) || null), 100);
  });
}

function apiSavePod(pod) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (pod.PodId) {
        const idx = MOCK_PODS.findIndex((p) => p.PodId === pod.PodId);
        if (idx !== -1) MOCK_PODS[idx] = { ...pod };
      } else {
        pod.PodId = MOCK_PODS.length + 1;
        pod.PodNo = "POD2104" + String(pod.PodId).padStart(3, "0");
        pod.Status = "Confirmed";
        MOCK_PODS.push(pod);
      }
      resolve({ success: true, data: pod });
    }, 200);
  });
}

function apiDeletePod(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_PODS.findIndex((p) => p.PodId === id);
      if (idx !== -1) MOCK_PODS.splice(idx, 1);
      resolve({ success: true });
    }, 150);
  });
}

// Consumed by DMSBookingPODView.vue — its own Add/Edit/View full-page tab.
export { apiGetPodById, apiSavePod, MOCK_DATA };

export default {
  name: "DMSBookingPOD",

  inject: {
    openTab: { default: null },
  },

  data() {
    return {
      pods: [],
      filteredPods: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        { name: "PodNo", label: "POD No.", field: "PodNo", sortable: true },
        { name: "PodDate", label: "Date", field: "PodDate", sortable: true },
        { name: "BookingOfficeName", label: "Booking Office", field: "BookingOfficeName", sortable: true },
        { name: "BookingCount", label: "Bookings", field: "BookingCount", align: "center" },
        { name: "TotalAmount", label: "Total Amt.", field: "TotalAmount", align: "right" },
        { name: "Status", label: "Status", field: "Status", align: "center" },
      ],
    };
  },

  mounted() {
    this.loadPods();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadPods();
    },

    async loadPods() {
      this.filteredPods = await apiGetPods(this.searchText);
    },

    openAddPod() {
      if (this.openTab) {
        this.openTab("/DMSBookingPODView?mode=add", "New Booking POD");
        return;
      }
      this.$q.notify({ message: "Open this page inside a dynamic tab to add a POD.", color: "info" });
    },

    viewPod(row) {
      if (this.openTab) {
        this.openTab(`/DMSBookingPODView?mode=view&podId=${row.PodId}`, `POD ${row.PodNo || ""}`.trim());
      }
    },

    editPod(row) {
      if (this.openTab) {
        this.openTab(`/DMSBookingPODView?mode=edit&podId=${row.PodId}`, `POD ${row.PodNo || ""}`.trim());
      }
    },

    confirmDeletePod(row) {
      this.$q
        .dialog({
          title: "Delete POD",
          message: `Delete POD <b>${row.PodNo}</b>?`,
          html: true,
          cancel: true,
          persistent: true,
          color: "negative",
        })
        .onOk(async () => {
          await apiDeletePod(row.PodId);
          this.$q.notify({ message: "POD deleted", color: "negative", position: "top" });
          this.loadPods();
        });
    },
  },
};
</script>
