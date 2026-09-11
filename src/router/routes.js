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
      {
        path: "DMSBookingView",
        component: () => import("pages/DMSBookingView.vue"),
      },
      {
        path: "DMSTruckBookingView",
        component: () => import("pages/DMSTruckBookingView.vue"),
      },
      {
        path: "DMSBookingOffice",
        component: () => import("pages/DMSBookingOffice.vue"),
      },
      {
        path: "DMSBookingOfficeView",
        component: () => import("pages/DMSBookingOfficeView.vue"),
      },
      // Booking Office master/lookup sub-pages (see the
      // dms-booking-page-pattern skill — same list + full-page Add/Edit
      // companion shape as DMSBookingOffice.vue).
      {
        path: "DMSBookingOfficeWiseCity",
        component: () => import("pages/DMSBookingOfficeWiseCity.vue"),
      },
      {
        path: "DMSBookingOfficeWiseCityView",
        component: () => import("pages/DMSBookingOfficeWiseCityView.vue"),
      },
      {
        path: "DMSBookingOfficeWiseToCity",
        component: () => import("pages/DMSBookingOfficeWiseToCity.vue"),
      },
      {
        path: "DMSBookingOfficeWiseToCityView",
        component: () => import("pages/DMSBookingOfficeWiseToCityView.vue"),
      },
      {
        path: "DMSBookingOfficeWisePaymentMode",
        component: () => import("pages/DMSBookingOfficeWisePaymentMode.vue"),
      },
      {
        path: "DMSBookingOfficeWisePaymentModeView",
        component: () => import("pages/DMSBookingOfficeWisePaymentModeView.vue"),
      },
      {
        path: "DMSBookingOfficeCommission",
        component: () => import("pages/DMSBookingOfficeCommission.vue"),
      },
      {
        path: "DMSBookingOfficeCommissionView",
        component: () => import("pages/DMSBookingOfficeCommissionView.vue"),
      },
      {
        path: "DMSBookingOfficeCommissionAddMultiple",
        component: () => import("pages/DMSBookingOfficeCommissionAddMultiple.vue"),
      },
      {
        path: "DMSBookingOfficeDailyCollection",
        component: () => import("pages/DMSBookingOfficeDailyCollection.vue"),
      },
      {
        path: "DMSBookingOfficeDailyCollectionView",
        component: () => import("pages/DMSBookingOfficeDailyCollectionView.vue"),
      },
      {
        path: "DMSBookingOfficeWiseDebitCollection",
        component: () => import("pages/DMSBookingOfficeWiseDebitCollection.vue"),
      },
      {
        path: "DMSBookingOfficeWiseDebitCollectionView",
        component: () => import("pages/DMSBookingOfficeWiseDebitCollectionView.vue"),
      },
      {
        path: "DMSBookingOfficeWiseReceivedCollection",
        component: () => import("pages/DMSBookingOfficeWiseReceivedCollection.vue"),
      },
      {
        path: "DMSBookingOfficeWiseReceivedCollectionView",
        component: () => import("pages/DMSBookingOfficeWiseReceivedCollectionView.vue"),
      },
      // Commission payout voucher.
      {
        path: "DMSCommission",
        component: () => import("pages/DMSCommission.vue"),
      },
      {
        path: "DMSCommissionView",
        component: () => import("pages/DMSCommissionView.vue"),
      },
      // Other-state freight / parcel handling charge vouchers.
      {
        path: "DMSOtherStateFreightCharge",
        component: () => import("pages/DMSOtherStateFreightCharge.vue"),
      },
      {
        path: "DMSOtherStateFreightChargeView",
        component: () => import("pages/DMSOtherStateFreightChargeView.vue"),
      },
      {
        path: "DMSParcelHandlingCharge",
        component: () => import("pages/DMSParcelHandlingCharge.vue"),
      },
      {
        path: "DMSParcelHandlingChargeView",
        component: () => import("pages/DMSParcelHandlingChargeView.vue"),
      },
      // Utility screen — single page, no list/companion pair (see
      // DMSEWayBill.vue's own header comment).
      {
        path: "DMSEWayBill",
        component: () => import("pages/DMSEWayBill.vue"),
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
        component: () => import("pages/DMSBookingViewReport.vue"),
      },
      {
        path: "BookingPOD",
        component: () => import("pages/DMSBookingPOD.vue"),
      },
      {
        path: "DMSBookingPODView",
        component: () => import("pages/DMSBookingPODView.vue"),
      },
      {
        path: "PendingForBooking",
        component: () => import("pages/DMSPendingForBooking.vue"),
      },
      {
        path: "BookingWeb",
        component: () => import("pages/DMSBookingWeb.vue"),
      },
      {
        path: "DMSBookingWebView",
        component: () => import("pages/DMSBookingWebView.vue"),
      },
      {
        path: "CashCredit",
        component: () => import("pages/DMSCashCredit.vue"),
      },
      {
        path: "DMSCashCreditView",
        component: () => import("pages/DMSCashCreditView.vue"),
      },
      {
        path: "CashCreditDashBoard",
        component: () => import("pages/DMSCashCreditDashBoard.vue"),
      },
      {
        path: "BookingOutstandingList",
        component: () => import("pages/DMSBookingOutstandingList.vue"),
      },
      {
        path: "BookingListChequePosting",
        component: () => import("pages/DMSBookingChequePosting.vue"),
      },
      {
        path: "BookingEmail",
        component: () => import("pages/DMSBookingEmail.vue"),
      },
      {
        path: "BookingListPendingForInvoice",
        component: () => import("pages/DMSBookingPendingForInvoice.vue"),
      },
      {
        path: "BookingLog",
        component: () => import("pages/DMSBookingLog.vue"),
      },
      {
        path: "DMSBookingLogView",
        component: () => import("pages/DMSBookingLogView.vue"),
      },
      {
        path: "BookingDeleteLog",
        component: () => import("pages/DMSBookingDeleteLog.vue"),
      },
      {
        path: "DMSBookingDeleteLogView",
        component: () => import("pages/DMSBookingDeleteLogView.vue"),
      },
      {
        path: "ReceiptNoRenumbering",
        component: () => import("pages/DMSReceiptNoRenumbering.vue"),
      },
      {
        path: "BookingSeriesTransfer",
        component: () => import("pages/DMSBookingSeriesTransfer.vue"),
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
