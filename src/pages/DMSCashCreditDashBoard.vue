<template>
  <div>
    <!-- Old app: BUK_CashButDebit_DashBoard — a monitoring/summary view of
         outstanding cash-credit exposure, distinct from DMSCashCredit.vue
         (that one is the voucher list + Add/Edit companion). This page is
         read-only: stat tiles + a per-reference-user breakdown table. -->
    <q-page padding class="page hide-overflow">
      <div class="folder">
        <div class="row header-style items-center">
          <div class="col-xs-12 header-inner">
            <div class="header-title">
              <span class="header_text1">Cash Credit Dash Board</span>
            </div>
          </div>
        </div>

        <!-- Stat tiles -->
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-card flat bordered class="q-pa-md">
              <div class="text-caption text-grey-7">Total Debit</div>
              <div class="text-h6 text-negative">
                {{ totals.debit.toFixed(2) }}
              </div>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-card flat bordered class="q-pa-md">
              <div class="text-caption text-grey-7">Total Received</div>
              <div class="text-h6 text-positive">
                {{ totals.received.toFixed(2) }}
              </div>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-card flat bordered class="q-pa-md">
              <div class="text-caption text-grey-7">Outstanding (Pending)</div>
              <div class="text-h6 text-orange">
                {{ totals.pending.toFixed(2) }}
              </div>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-card flat bordered class="q-pa-md">
              <div class="text-caption text-grey-7">Cleared Vouchers</div>
              <div class="text-h6 text-primary">
                {{ totals.clearedCount }} / {{ rows.length }}
              </div>
            </q-card>
          </div>
        </div>

        <q-card class="notab-container">
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">
              Reference User Wise Outstanding
            </div>
            <q-table
              square
              flat
              bordered
              :rows="userWiseRows"
              :columns="userWiseColumns"
              row-key="ReferenceUserName"
              :rows-per-page-options="[0]"
              hide-pagination
            />

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 q-mb-sm">
              Recent Cash Credit Vouchers
            </div>
            <q-table
              square
              flat
              bordered
              :rows="rows"
              :columns="voucherColumns"
              row-key="CashCreditId"
              :rows-per-page-options="[0]"
              hide-pagination
            >
              <template v-slot:body-cell-IsClear="props">
                <q-td :props="props">
                  <q-badge
                    :color="props.value ? 'positive' : 'orange'"
                    :label="props.value ? 'Clear' : 'Pending'"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
// ─────────────────────────────────────────────
//  Mock data — replace with real axios calls. Own local copy, same shape
//  as DMSCashCredit.vue's mock vouchers (not imported — this is a
//  read-only rollup view, per the "copy don't parametrize" convention).
// ─────────────────────────────────────────────
const MOCK_VOUCHERS = [
  {
    CashCreditId: 1,
    VoucherNo: "CC001",
    VoucherDate: "01/04/2026",
    PartyAccountName: "Balaji xxx Co.",
    ReferenceUserName: "Ketan Patel",
    DebitAmount: 5000,
    ReceivedAmount: 3000,
    IsClear: false,
  },
  {
    CashCreditId: 2,
    VoucherNo: "CC002",
    VoucherDate: "02/04/2026",
    PartyAccountName: "Rajsani xxx Polymers",
    ReferenceUserName: "Suresh Rao",
    DebitAmount: 2000,
    ReceivedAmount: 2000,
    IsClear: true,
  },
  {
    CashCreditId: 3,
    VoucherNo: "CC003",
    VoucherDate: "03/04/2026",
    PartyAccountName: "Ring xxx Ltd",
    ReferenceUserName: "Ketan Patel",
    DebitAmount: 1500,
    ReceivedAmount: 500,
    IsClear: false,
  },
];

export default {
  name: "DMSCashCreditDashBoard",

  data() {
    return {
      rows: MOCK_VOUCHERS.map((v) => ({
        ...v,
        PendingAmount: v.DebitAmount - v.ReceivedAmount,
      })),
      voucherColumns: [
        { name: "VoucherNo", label: "Voucher No.", field: "VoucherNo" },
        { name: "VoucherDate", label: "Date", field: "VoucherDate" },
        { name: "PartyAccountName", label: "Party", field: "PartyAccountName" },
        {
          name: "ReferenceUserName",
          label: "Reference User",
          field: "ReferenceUserName",
        },
        {
          name: "DebitAmount",
          label: "Debit Amt.",
          field: "DebitAmount",
          align: "right",
        },
        {
          name: "ReceivedAmount",
          label: "Received Amt.",
          field: "ReceivedAmount",
          align: "right",
        },
        {
          name: "PendingAmount",
          label: "Pending Amt.",
          field: "PendingAmount",
          align: "right",
        },
        { name: "IsClear", label: "Status", field: "IsClear", align: "center" },
      ],
      userWiseColumns: [
        {
          name: "ReferenceUserName",
          label: "Reference User",
          field: "ReferenceUserName",
        },
        {
          name: "DebitAmount",
          label: "Total Debit",
          field: "DebitAmount",
          align: "right",
        },
        {
          name: "ReceivedAmount",
          label: "Total Received",
          field: "ReceivedAmount",
          align: "right",
        },
        {
          name: "PendingAmount",
          label: "Pending",
          field: "PendingAmount",
          align: "right",
        },
      ],
    };
  },

  computed: {
    totals() {
      const debit = this.rows.reduce((s, r) => s + r.DebitAmount, 0);
      const received = this.rows.reduce((s, r) => s + r.ReceivedAmount, 0);
      return {
        debit,
        received,
        pending: debit - received,
        clearedCount: this.rows.filter((r) => r.IsClear).length,
      };
    },

    userWiseRows() {
      const map = {};
      this.rows.forEach((r) => {
        if (!map[r.ReferenceUserName]) {
          map[r.ReferenceUserName] = {
            ReferenceUserName: r.ReferenceUserName,
            DebitAmount: 0,
            ReceivedAmount: 0,
          };
        }
        map[r.ReferenceUserName].DebitAmount += r.DebitAmount;
        map[r.ReferenceUserName].ReceivedAmount += r.ReceivedAmount;
      });
      return Object.values(map).map((u) => ({
        ...u,
        PendingAmount: u.DebitAmount - u.ReceivedAmount,
      }));
    },
  },
};
</script>
