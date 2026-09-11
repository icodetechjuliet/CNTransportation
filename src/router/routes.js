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
      // DMS > Trip submenu (src/IPConfig/mockData.js's buildMockChildMenu
      // DMS group), menu item names/order matched 1:1 to the legacy
      // EagleParcel WinForms app's own "Trip" menu — all 8 items now have
      // a real built page (see each .vue file's own header comment for
      // which legacy WinForms screen it mirrors).
      {
        path: "DMSTrip",
        component: () => import("pages/DMSTrip.vue"),
      },
      {
        path: "DMSTripView",
        component: () => import("pages/DMSTripView.vue"),
      },
      {
        path: "DMSTripStockTransfer",
        component: () => import("pages/DMSTripStockTransfer.vue"),
      },
      {
        path: "DMSBookingListTripWise",
        component: () => import("pages/DMSBookingListTripWise.vue"),
      },
      {
        path: "DMSTripPosting",
        component: () => import("pages/DMSTripPosting.vue"),
      },
      {
        path: "DMSTripListPendingForUnload",
        component: () => import("pages/DMSTripListPendingForUnload.vue"),
      },
      {
        path: "DMSTripCharge",
        component: () => import("pages/DMSTripCharge.vue"),
      },
      {
        path: "DMSTripRegisterTransporterWise",
        component: () => import("pages/DMSTripRegisterTransporterWise.vue"),
      },
      {
        path: "DMSTripIncomeExpense",
        component: () => import("pages/DMSTripIncomeExpense.vue"),
      },
      // DMS > Delivery submenu, item names/order matched 1:1 to the legacy
      // EagleParcel WinForms app's own "Delivery" menu — every item now has
      // a real built page (mock-data-backed, see src/data/deliveryData.js;
      // each .vue file's own header comment notes which EagleParcel-API
      // shape it mirrors).
      {
        path: "DMSDelivery",
        component: () => import("pages/DMSDelivery.vue"),
      },
      {
        path: "DMSDeliveryView",
        component: () => import("pages/DMSDeliveryView.vue"),
      },
      {
        path: "DMSDoorDeliveryRegister",
        component: () => import("pages/DMSDoorDeliveryRegister.vue"),
      },
      {
        path: "DMSDoorDelivery",
        component: () => import("pages/DMSDoorDelivery.vue"),
      },
      {
        path: "DMSDoorDeliveryInvoice",
        component: () => import("pages/DMSDoorDeliveryInvoice.vue"),
      },
      {
        path: "DMSDoorDeliveryRate",
        component: () => import("pages/DMSDoorDeliveryRate.vue"),
      },
      {
        path: "DMSDeliveryAddMultiple",
        component: () => import("pages/DMSDeliveryAddMultiple.vue"),
      },
      {
        path: "DMSDeliveryRegisterScreen",
        component: () => import("pages/DMSDeliveryRegisterScreen.vue"),
      },
      {
        path: "DMSDeliveryRegisterScreenPartyCopy",
        component: () => import("pages/DMSDeliveryRegisterScreenPartyCopy.vue"),
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
