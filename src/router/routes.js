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
        component: () =>
          import("pages/DMSBookingOfficeWisePaymentModeView.vue"),
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
        component: () =>
          import("pages/DMSBookingOfficeCommissionAddMultiple.vue"),
      },
      {
        path: "DMSBookingOfficeDailyCollection",
        component: () => import("pages/DMSBookingOfficeDailyCollection.vue"),
      },
      {
        path: "DMSBookingOfficeDailyCollectionView",
        component: () =>
          import("pages/DMSBookingOfficeDailyCollectionView.vue"),
      },
      {
        path: "DMSBookingOfficeWiseDebitCollection",
        component: () =>
          import("pages/DMSBookingOfficeWiseDebitCollection.vue"),
      },
      {
        path: "DMSBookingOfficeWiseDebitCollectionView",
        component: () =>
          import("pages/DMSBookingOfficeWiseDebitCollectionView.vue"),
      },
      {
        path: "DMSBookingOfficeWiseReceivedCollection",
        component: () =>
          import("pages/DMSBookingOfficeWiseReceivedCollection.vue"),
      },
      {
        path: "DMSBookingOfficeWiseReceivedCollectionView",
        component: () =>
          import("pages/DMSBookingOfficeWiseReceivedCollectionView.vue"),
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

      // DMS > Booking Office / Sale / Master / Report Screens / Reports
      // submenus, item names/order matched 1:1 to the legacy EagleParcel
      // WinForms app's own menus (src/IPConfig/mockData.js's
      // buildMockChildMenu DMS group). Every item routes to a real page:
      // simple entity masters (Vehicle, City, State, ...) and read-only
      // report/register screens are both rendered through one shared
      // generic component each (src/components/GenericMasterList.vue /
      // GenericReportList.vue, configured by src/data/mastersData.js /
      // reportsData.js) instead of 59 near-identical bespoke files; SI and
      // Booking Office Commission Add Multiple are real bespoke pages.
      {
        path: "DMSBOCommission",
        component: () => import("pages/DMSBOCommission.vue"),
      },
      {
        path: "DMSBOOtherStateFreightCharge",
        component: () => import("pages/DMSBOOtherStateFreightCharge.vue"),
      },
      {
        path: "DMSBOParcelHandlingCharge",
        component: () => import("pages/DMSBOParcelHandlingCharge.vue"),
      },
      {
        path: "DMSBOWiseDebitCollection",
        component: () => import("pages/DMSBOWiseDebitCollection.vue"),
      },
      {
        path: "DMSBOWiseReceivedCollection",
        component: () => import("pages/DMSBOWiseReceivedCollection.vue"),
      },
      {
        path: "DMSBODailyCollection",
        component: () => import("pages/DMSBODailyCollection.vue"),
      },
      {
        path: "DMSBOCommissionScreen",
        component: () => import("pages/DMSBOCommissionScreen.vue"),
      },
      {
        path: "DMSBOCommissionAddMultiple",
        component: () => import("pages/DMSBOCommissionAddMultiple.vue"),
      },
      { path: "DMSBOMaster", component: () => import("pages/DMSBOMaster.vue") },
      {
        path: "DMSBOWiseCity",
        component: () => import("pages/DMSBOWiseCity.vue"),
      },
      {
        path: "DMSBOWiseToCity",
        component: () => import("pages/DMSBOWiseToCity.vue"),
      },
      {
        path: "DMSBOWisePaymentMode",
        component: () => import("pages/DMSBOWisePaymentMode.vue"),
      },

      { path: "DMSSaleSI", component: () => import("pages/DMSSaleSI.vue") },
      {
        path: "DMSSaleSIPosting",
        component: () => import("pages/DMSSaleSIPosting.vue"),
      },
      {
        path: "DMSSaleSIEmail",
        component: () => import("pages/DMSSaleSIEmail.vue"),
      },

      {
        path: "DMSMasterVehicle",
        component: () => import("pages/DMSMasterVehicle.vue"),
      },
      {
        path: "DMSMasterVehicleType",
        component: () => import("pages/DMSMasterVehicleType.vue"),
      },
      {
        path: "DMSMasterDriver",
        component: () => import("pages/DMSMasterDriver.vue"),
      },
      {
        path: "DMSMasterCarrier",
        component: () => import("pages/DMSMasterCarrier.vue"),
      },
      {
        path: "DMSMasterCity",
        component: () => import("pages/DMSMasterCity.vue"),
      },
      {
        path: "DMSMasterCityWiseDeliveryCity",
        component: () => import("pages/DMSMasterCityWiseDeliveryCity.vue"),
      },
      {
        path: "DMSMasterState",
        component: () => import("pages/DMSMasterState.vue"),
      },
      {
        path: "DMSMasterItem",
        component: () => import("pages/DMSMasterItem.vue"),
      },
      {
        path: "DMSMasterUnit",
        component: () => import("pages/DMSMasterUnit.vue"),
      },
      {
        path: "DMSMasterInvoiceType",
        component: () => import("pages/DMSMasterInvoiceType.vue"),
      },
      {
        path: "DMSMasterPaymentMode",
        component: () => import("pages/DMSMasterPaymentMode.vue"),
      },
      {
        path: "DMSMasterVoucher",
        component: () => import("pages/DMSMasterVoucher.vue"),
      },
      {
        path: "DMSMasterCompany",
        component: () => import("pages/DMSMasterCompany.vue"),
      },
      {
        path: "DMSMasterFinYear",
        component: () => import("pages/DMSMasterFinYear.vue"),
      },
      {
        path: "DMSMasterSeries",
        component: () => import("pages/DMSMasterSeries.vue"),
      },
      {
        path: "DMSMasterTax",
        component: () => import("pages/DMSMasterTax.vue"),
      },

      {
        path: "DMSRSCurrentStock",
        component: () => import("pages/DMSRSCurrentStock.vue"),
      },
      {
        path: "DMSRSBookingRegisterGST",
        component: () => import("pages/DMSRSBookingRegisterGST.vue"),
      },
      {
        path: "DMSRSDailyCollectionSummary",
        component: () => import("pages/DMSRSDailyCollectionSummary.vue"),
      },
      {
        path: "DMSRSTopayCollectionRegister",
        component: () => import("pages/DMSRSTopayCollectionRegister.vue"),
      },
      {
        path: "DMSRSLedgerAccountList",
        component: () => import("pages/DMSRSLedgerAccountList.vue"),
      },
      {
        path: "DMSRSCashCreditLedger",
        component: () => import("pages/DMSRSCashCreditLedger.vue"),
      },
      {
        path: "DMSRSDebitLedger",
        component: () => import("pages/DMSRSDebitLedger.vue"),
      },
      {
        path: "DMSRSEntryEditList",
        component: () => import("pages/DMSRSEntryEditList.vue"),
      },
      {
        path: "DMSRSBookingRegisterScr",
        component: () => import("pages/DMSRSBookingRegisterScr.vue"),
      },
      {
        path: "DMSRSBookingOutwardRegister",
        component: () => import("pages/DMSRSBookingOutwardRegister.vue"),
      },
      {
        path: "DMSRSDebitListPartyWiseScreen",
        component: () => import("pages/DMSRSDebitListPartyWiseScreen.vue"),
      },
      {
        path: "DMSRSDebitListPartyWiseYearly",
        component: () => import("pages/DMSRSDebitListPartyWiseYearly.vue"),
      },
      {
        path: "DMSRSCashCreditDebitListPartyWise",
        component: () => import("pages/DMSRSCashCreditDebitListPartyWise.vue"),
      },
      {
        path: "DMSRSUserWiseCreditLimitSummary",
        component: () => import("pages/DMSRSUserWiseCreditLimitSummary.vue"),
      },
      {
        path: "DMSRSUchakReceivedList",
        component: () => import("pages/DMSRSUchakReceivedList.vue"),
      },
      {
        path: "DMSRSCashBookingWithChqPaymentMode",
        component: () => import("pages/DMSRSCashBookingWithChqPaymentMode.vue"),
      },
      {
        path: "DMSRSCityWisePeriodWiseCollection",
        component: () => import("pages/DMSRSCityWisePeriodWiseCollection.vue"),
      },

      {
        path: "DMSRptCoveringLetter",
        component: () => import("pages/DMSRptCoveringLetter.vue"),
      },
      {
        path: "DMSRptDoorDeliverySummary",
        component: () => import("pages/DMSRptDoorDeliverySummary.vue"),
      },
      {
        path: "DMSRptSIRegisterAccountServiceTax",
        component: () => import("pages/DMSRptSIRegisterAccountServiceTax.vue"),
      },
      {
        path: "DMSRptSIRegisterAccountGST",
        component: () => import("pages/DMSRptSIRegisterAccountGST.vue"),
      },
      {
        path: "DMSRptCashSummaryGST",
        component: () => import("pages/DMSRptCashSummaryGST.vue"),
      },
      {
        path: "DMSRptCashSummaryServiceTax",
        component: () => import("pages/DMSRptCashSummaryServiceTax.vue"),
      },
      {
        path: "DMSRptBookingRegister",
        component: () => import("pages/DMSRptBookingRegister.vue"),
      },
      {
        path: "DMSRptBookingRegisterGST",
        component: () => import("pages/DMSRptBookingRegisterGST.vue"),
      },
      {
        path: "DMSRptSIRegisterAccountGSTR1",
        component: () => import("pages/DMSRptSIRegisterAccountGSTR1.vue"),
      },
      {
        path: "DMSRptSIRegisterAccountGSTB2BB2C",
        component: () => import("pages/DMSRptSIRegisterAccountGSTB2BB2C.vue"),
      },
      {
        path: "DMSRptAccountLedgerWithOppositeAccount",
        component: () =>
          import("pages/DMSRptAccountLedgerWithOppositeAccount.vue"),
      },
      {
        path: "DMSRptCommWiseMismatchBooking",
        component: () => import("pages/DMSRptCommWiseMismatchBooking.vue"),
      },
      {
        path: "DMSRptBookingDeleteLogRegister",
        component: () => import("pages/DMSRptBookingDeleteLogRegister.vue"),
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
