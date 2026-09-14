<template>
  <div>
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row items-center no-wrap q-px-sm">
            <span class="header_text1">Booking Email</span>
            <div class="total-stat-tile total-stat-tile--inline">
              <q-icon name="mail" size="16px" />
              <div class="total-stat-text">
                <span class="total-stat-count">
                  {{ filteredBookings.length }}
                </span>
                <span class="total-stat-label">Total Bookings</span>
              </div>
            </div>
          </div>
          <div class="q-py-xs q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>

          <q-table
            square
            :rows="filteredBookings"
            :columns="tableColumns"
            row-key="BookingId"
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
                      @keyup.enter="loadBookings"
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
                      @click="loadBookings"
                    >
                      <q-tooltip>Search</q-tooltip>
                    </q-btn>
                  </div>

                  <q-btn
                    unelevated
                    icon="refresh"
                    class="m-icon-btn-style radius-md bg-blue-300 bdr-blue-2 font-Mblue"
                    @click="loadBookings"
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>

                  <q-space />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-LastSentOn="props">
              <q-td :props="props">
                <q-badge v-if="!props.value" color="grey" label="Not Sent" />
                <span v-else>{{ props.value }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="button-container">
                <q-btn
                  icon="mail"
                  color="primary"
                  dense
                  outline
                  class="edit-icon-style"
                  @click="openSendDialog(props.row)"
                >
                  <q-tooltip>Send Email</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:item="props">
              <div class="mobile-job-card">
                <div
                  class="mjc-header"
                  @click="toggleMobileCard(props.row.BookingId)"
                >
                  <div class="mjc-header-left">
                    <div class="mjc-job-badge">
                      <q-icon name="mail" size="14px" />
                    </div>
                    <div class="mjc-header-info">
                      <span class="mjc-job-no">{{ props.row.BookingNo }}</span>
                      <span class="mjc-job-date">
                        {{ props.row.BookingDate }}
                      </span>
                    </div>
                  </div>
                  <div class="mjc-header-right">
                    <q-badge
                      v-if="!props.row.LastSentOn"
                      class="mjc-status-badge"
                      color="grey"
                    >
                      Not Sent
                    </q-badge>
                    <q-badge v-else class="mjc-status-badge" color="positive">
                      Sent
                    </q-badge>
                    <q-icon
                      :name="
                        expandedMobileCards.includes(props.row.BookingId)
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
                    icon="mail"
                    label="Send Email"
                    class="mjc-btn mjc-btn-edit"
                    @click="openSendDialog(props.row)"
                  />
                </div>

                <transition name="mobile-expand">
                  <div
                    v-if="expandedMobileCards.includes(props.row.BookingId)"
                    class="mjc-details"
                  >
                    <q-separator class="mjc-divider" />
                    <div class="mjc-details-grid">
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignor</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsignorName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignee</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsigneeName || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignor Email</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsignorEmail || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Consignee Email</span>
                        <span class="mjc-detail-value">
                          {{ props.row.ConsigneeEmail || "—" }}
                        </span>
                      </div>
                      <div class="mjc-detail-row">
                        <span class="mjc-detail-label">Last Sent To</span>
                        <span class="mjc-detail-value">
                          {{ props.row.LastSentTo || "—" }}
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

    <!-- ══════════════════════════════════════
         Send Email Dialog — compact, non-maximized.
    ══════════════════════════════════════ -->
    <q-dialog v-model="showSendDialog" persistent>
      <q-card style="min-width: 360px">
        <q-card-section class="text-subtitle1">
          Send Booking Email — {{ sendForm.BookingNo }}
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm items-start">
            <div class="col-12 col-sm-6 col-md-3">
              <q-item
                tag="label"
                v-ripple
                bg-color="blue-1"
                class="chckbx-style full-width"
              >
                <q-item-section avatar>
                  <q-checkbox
                    dense
                    v-model="sendForm.toConsignor"
                    val="orange"
                    color="orange"
                    intermediate-icon="black"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label dense>
                    Consignor ({{ sendForm.ConsignorEmail || "—" }})
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <q-item
                tag="label"
                v-ripple
                bg-color="blue-1"
                class="chckbx-style full-width"
              >
                <q-item-section avatar>
                  <q-checkbox
                    dense
                    v-model="sendForm.toConsignee"
                    val="orange"
                    color="orange"
                    intermediate-icon="black"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label dense>
                    Consignee ({{ sendForm.ConsigneeEmail || "—" }})
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated color="primary" label="Send" @click="sendEmail" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls. This page mirrors the old
//  app's booking receipt email dispatch worklist: bookings whose LR/receipt
//  needs (re-)emailing to the consignor/consignee, with a log of when it
//  was last sent. Local mock data only.
// ─────────────────────────────────────────────
const MOCK_EMAIL_BOOKINGS = [
  {
    BookingId: 1,
    BookingNo: "RKG21040001",
    BookingDate: "01/04/2026",
    ConsignorName: "Balaji xxx Co.",
    ConsigneeName: "Galaxy xxx Tooling",
    ConsignorEmail: "balaji@example.com",
    ConsigneeEmail: "galaxy@example.com",
    LastSentOn: "",
    LastSentTo: "",
  },
  {
    BookingId: 2,
    BookingNo: "RKG21040002",
    BookingDate: "01/04/2026",
    ConsignorName: "Rajsani xxx Polymers",
    ConsigneeName: "Ring xxx Ltd",
    ConsignorEmail: "rajsani@example.com",
    ConsigneeEmail: "ring@example.com",
    LastSentOn: "02/04/2026 09:15 AM",
    LastSentTo: "rajsani@example.com",
  },
  {
    BookingId: 3,
    BookingNo: "RKG21040003",
    BookingDate: "01/04/2026",
    ConsignorName: "Vansh xxx Llp",
    ConsigneeName: "Bhavya xxx Distributors",
    ConsignorEmail: "vansh@example.com",
    ConsigneeEmail: "bhavya@example.com",
    LastSentOn: "",
    LastSentTo: "",
  },
];

function apiGetEmailBookings(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...MOCK_EMAIL_BOOKINGS];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (b) =>
            b.BookingNo.toLowerCase().includes(s) ||
            (b.ConsignorName || "").toLowerCase().includes(s) ||
            (b.ConsigneeName || "").toLowerCase().includes(s)
        );
      }
      resolve(result);
    }, 150);
  });
}

export default {
  name: "DMSBookingEmail",

  data() {
    return {
      bookings: [],
      filteredBookings: [],
      searchText: "",
      pagination: { page: 1, rowsPerPage: 15 },
      expandedMobileCards: [],

      showSendDialog: false,
      sendForm: {
        BookingId: null,
        BookingNo: "",
        ConsignorEmail: "",
        ConsigneeEmail: "",
        toConsignor: true,
        toConsignee: false,
      },

      tableColumns: [
        { name: "action", label: "Action", field: "action" },
        {
          name: "BookingNo",
          label: "Booking No.",
          field: "BookingNo",
          sortable: true,
        },
        {
          name: "BookingDate",
          label: "Date",
          field: "BookingDate",
          sortable: true,
        },
        { name: "ConsignorName", label: "Consignor", field: "ConsignorName" },
        { name: "ConsigneeName", label: "Consignee", field: "ConsigneeName" },
        { name: "LastSentOn", label: "Last Sent On", field: "LastSentOn" },
      ],
    };
  },

  mounted() {
    this.loadBookings();
  },

  methods: {
    toggleMobileCard(id) {
      const index = this.expandedMobileCards.indexOf(id);
      if (index === -1) this.expandedMobileCards.push(id);
      else this.expandedMobileCards.splice(index, 1);
    },

    clearSearch() {
      this.searchText = "";
      this.loadBookings();
    },

    async loadBookings() {
      this.filteredBookings = await apiGetEmailBookings(this.searchText);
    },

    openSendDialog(row) {
      this.sendForm = {
        BookingId: row.BookingId,
        BookingNo: row.BookingNo,
        ConsignorEmail: row.ConsignorEmail,
        ConsigneeEmail: row.ConsigneeEmail,
        toConsignor: true,
        toConsignee: false,
      };
      this.showSendDialog = true;
    },

    sendEmail() {
      const recipients = [];
      if (this.sendForm.toConsignor && this.sendForm.ConsignorEmail)
        recipients.push(this.sendForm.ConsignorEmail);
      if (this.sendForm.toConsignee && this.sendForm.ConsigneeEmail)
        recipients.push(this.sendForm.ConsigneeEmail);

      if (!recipients.length) {
        this.$q.notify({
          message: "Select at least one recipient",
          color: "negative",
          position: "top",
        });
        return;
      }

      const row = MOCK_EMAIL_BOOKINGS.find(
        (b) => b.BookingId === this.sendForm.BookingId
      );
      if (row) {
        row.LastSentOn = new Date().toLocaleString();
        row.LastSentTo = recipients.join(", ");
      }
      this.$q.notify({
        message: "Email sent (mock)",
        color: "positive",
        position: "top",
      });
      this.showSendDialog = false;
      this.loadBookings();
    },
  },
};
</script>
