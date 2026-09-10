const routes = [
  {
    path: "/",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { path: "", component: () => import("pages/LoginPageResolver.vue") },
    ],
  },
  {
    path: "/AutoWtsAppMsg",
    component: () => import("layouts/BlankLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/Logout=Y",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { path: "", component: () => import("pages/LoginPageResolver.vue") },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout1.vue"),
    children: [
      { path: "IndexPage", component: () => import("pages/DashboardPage.vue") },
      {
        path: "/",
        name: "IndexPage",
        component: () => import("pages/DashboardPage.vue"),
      },
      {
        path: "UserLogDetails",
        component: () => import("pages/UserLogDetails.vue"),
      },

      // Booking module (sidebar menu built in src/IPConfig/mockData.js's
      // buildMockParentMenu/buildMockChildMenu) — BBooking/Booking/Truck
      // Booking are 3 separate pages now (DMSBBooking.vue / DMSBooking.vue /
      // DMSTruckBooking.vue), each fixed to its own mode with no in-page
      // mode-switcher; the rest don't have a built page yet, so they route
      // to the shared "under construction" placeholder until each one is
      // built out.
      {
        path: "DMSBBooking",
        component: () => import("pages/DMSBBooking.vue"),
      },
      {
        path: "DMSBooking",
        component: () => import("pages/DMSBooking.vue"),
      },
      {
        path: "DMSTruckBooking",
        component: () => import("pages/DMSTruckBooking.vue"),
      },
      {
        path: "DMSBBookingView",
        component: () => import("pages/DMSBBookingView.vue"),
      },
      // DMS > Trip / Accounting submenus (src/IPConfig/mockData.js's
      // buildMockChildMenu DMS group) don't have built pages yet, so they
      // route to the shared "under construction" placeholder, same as the
      // rest of the not-yet-built Booking menu above.
      {
        path: "DMSTripPlanning",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "DMSTripSheet",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "DMSTripClosure",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "DMSAccountingInvoice",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "DMSAccountingReceipt",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "DMSAccountingLedger",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingView",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingPOD",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "PendingForBooking",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingWeb",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "CashCredit",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "CashCreditDashBoard",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingOutstandingList",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingListChequePosting",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingEmail",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingListPendingForInvoice",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingLog",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingDeleteLog",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "ReceiptNoRenumbering",
        component: () => import("pages/UnderConstraction.vue"),
      },
      {
        path: "BookingSeriesTransfer",
        component: () => import("pages/UnderConstraction.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
