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
      // Main dashboard — DMSDashboard.vue (bookings/trips/freight KPIs +
      // charts, same layout convention as SalesDashboard.vue) replaces the
      // old DashboardPage.vue here; that file is left in place/routable
      // elsewhere rather than deleted, in case anything else still links to it.
      { path: "IndexPage", component: () => import("pages/DMSDashboard.vue") },
      { path: "DMSMenu", component: () => import("pages/DMSMenu.vue") },
      {
        path: "/",
        name: "IndexPage",
        component: () => import("pages/DMSDashboard.vue"),
      },
      {
        path: "UserLogDetails",
        component: () => import("pages/UserLogDetails.vue"),
      },

      { path: "DMSBBookingForm", component: () => import("pages/DMSBBookingForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSBookingForm", component: () => import("pages/DMSBookingForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSTruckBookingForm", component: () => import("pages/DMSTruckBookingForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSTripStockTransferForm", component: () => import("pages/DMSTripStockTransferForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSTripChargeForm", component: () => import("pages/DMSTripChargeForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSTripIncomeExpenseForm", component: () => import("pages/DMSTripIncomeExpenseForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSDoorDeliveryForm", component: () => import("pages/DMSDoorDeliveryForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSDoorDeliveryRateForm", component: () => import("pages/DMSDoorDeliveryRateForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSSaleSIForm", component: () => import("pages/DMSSaleSIForm.vue"), props: route => ({ params: route.query }) },
      { path: "DMSEWayBillPartAForm", component: () => import("pages/DMSEWayBillPartAForm.vue"), props: route => ({ params: route.query }) },
      // Booking module (sidebar menu built in src/data/mockData.js's
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
        props: route => ({ params: route.query }),
      },
      // DMS > Trip submenu (src/data/mockData.js's buildMockChildMenu
      // DMS group), menu item names/order matched 1:1 to the legacy
      // EagleParcel WinForms app's own "Trip" menu — all 8 items now have
      // a real built page (see each .vue file's own header comment for
      // which legacy WinForms screen it mirrors).
      {
        path: "DMSBookingView",
        component: () => import("pages/DMSBookingView.vue"),
        props: route => ({ params: route.query }),
      },
      {
        path: "DMSTruckBookingView",
        component: () => import("pages/DMSTruckBookingView.vue"),
        props: route => ({ params: route.query }),
      },
      {
        path: "DMSBookingOffice",
        component: () => import("pages/DMSBookingOffice.vue"),
      },
      {
        path: "DMSBookingOfficeView",
        component: () => import("pages/DMSBookingOfficeView.vue"),
        props: route => ({ params: route.query }),
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
        props: route => ({ params: route.query }),
      },
      {
        path: "DMSBookingOfficeWiseToCity",
        component: () => import("pages/DMSBookingOfficeWiseToCity.vue"),
      },
      {
        path: "DMSBookingOfficeWiseToCityView",
        component: () => import("pages/DMSBookingOfficeWiseToCityView.vue"),
        props: route => ({ params: route.query }),
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
        props: route => ({ params: route.query }),
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
        props: route => ({ params: route.query }),
      },
      // Other-state freight / parcel handling charge vouchers.
      {
        path: "DMSOtherStateFreightCharge",
        component: () => import("pages/DMSOtherStateFreightCharge.vue"),
      },
      {
        path: "DMSOtherStateFreightChargeView",
        component: () => import("pages/DMSOtherStateFreightChargeView.vue"),
        props: route => ({ params: route.query }),
      },
      {
        path: "DMSParcelHandlingCharge",
        component: () => import("pages/DMSParcelHandlingCharge.vue"),
      },
      {
        path: "DMSParcelHandlingChargeView",
        component: () => import("pages/DMSParcelHandlingChargeView.vue"),
        props: route => ({ params: route.query }),
      },
      // Utility screen — single page, no list/companion pair (see
      // DMSEWayBill.vue's own header comment).
      {
        path: "DMSEWayBill",
        component: () => import("pages/DMSEWayBill.vue"),
      },
      // DMS > Trip / Accounting submenus (src/data/mockData.js's
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
        props: route => ({ params: route.query }),
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
        props: route => ({ params: route.query }),
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
      // DMS > Account menu (src/data/mockData.js's "dms-account-*"
      // group) — voucher entry screens, all rendered through
      // GenericMasterList.vue same as the masters below (see
      // src/data/mastersData.js's accountvoucher/cashpayment/cashreceipt/
      // bankpayment/bankreceipt/contravoucher/journalvoucher/
      // customerwisecity/ledgeraccount entities).
      {
        path: "DMSAccountVoucher",
        component: () => import("pages/DMSAccountVoucher.vue"),
      },
      {
        path: "DMSAccountVoucherRegister",
        component: () => import("pages/DMSAccountVoucherRegister.vue"),
      },
      {
        path: "DMSCashPayment",
        component: () => import("pages/DMSCashPayment.vue"),
      },
      {
        path: "DMSCashReceipt",
        component: () => import("pages/DMSCashReceipt.vue"),
      },
      {
        path: "DMSBankPayment",
        component: () => import("pages/DMSBankPayment.vue"),
      },
      {
        path: "DMSBankReceipt",
        component: () => import("pages/DMSBankReceipt.vue"),
      },
      {
        path: "DMSContraVoucher",
        component: () => import("pages/DMSContraVoucher.vue"),
      },
      {
        path: "DMSJournalVoucher",
        component: () => import("pages/DMSJournalVoucher.vue"),
      },
      {
        path: "DMSAccountLedger",
        component: () => import("pages/DMSAccountLedger.vue"),
      },
      {
        path: "DMSCustomerWiseCity",
        component: () => import("pages/DMSCustomerWiseCity.vue"),
      },
      {
        path: "DMSMasterLedgerAccount",
        component: () => import("pages/DMSMasterLedgerAccount.vue"),
      },
      {
        path: "DMSAccountParcelHandlingCharge",
        component: () => import("pages/DMSAccountParcelHandlingCharge.vue"),
      },

      // DMS > Booking Office / Sale / Master / Report Screens / Reports
      // submenus, item names/order matched 1:1 to the legacy EagleParcel
      // WinForms app's own menus (src/data/mockData.js's
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
        path: "DMSSaleSIPrint",
        component: () => import("pages/DMSSaleSIPrint.vue"),
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
        path: "DMSMasterServiceTaxConfig",
        component: () => import("pages/DMSMasterServiceTaxConfig.vue"),
      },
      {
        path: "DMSMasterTaxApplyOnTax",
        component: () => import("pages/DMSMasterTaxApplyOnTax.vue"),
      },
      {
        path: "DMSMasterTaxSystem",
        component: () => import("pages/DMSMasterTaxSystem.vue"),
      },
      {
        path: "DMSMasterTaxSystemWiseTax",
        component: () => import("pages/DMSMasterTaxSystemWiseTax.vue"),
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
        path: "DMSRSBookingInwardOutwardRegister",
        component: () =>
          import("pages/DMSRSBookingInwardOutwardRegister.vue"),
      },
      {
        path: "DMSRSDailyCollectionRegister",
        component: () => import("pages/DMSRSDailyCollectionRegister.vue"),
      },
      {
        path: "DMSRSBookingMPendingForDeliveryM",
        component: () =>
          import("pages/DMSRSBookingMPendingForDeliveryM.vue"),
      },
      {
        path: "DMSRSBookingMRegister",
        component: () => import("pages/DMSRSBookingMRegister.vue"),
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
        path: "DMSRptDeliveryMRegister",
        component: () => import("pages/DMSRptDeliveryMRegister.vue"),
      },
      {
        path: "DMSRptDoorDeliveryMRegister",
        component: () => import("pages/DMSRptDoorDeliveryMRegister.vue"),
      },
      {
        path: "DMSRptDoorDeliveryDetail",
        component: () => import("pages/DMSRptDoorDeliveryDetail.vue"),
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
        path: "DMSRptOtherStateFreightChargeRegister",
        component: () =>
          import("pages/DMSRptOtherStateFreightChargeRegister.vue"),
      },
      {
        path: "DMSRptOtherStateFreightChargeSummary",
        component: () =>
          import("pages/DMSRptOtherStateFreightChargeSummary.vue"),
      },

      // Security module — matches the legacy EagleParcel WinForms app's own
      // "Security" menu 1:1. User/Menu/Rights/Patch Details are flat
      // masters (GenericMasterList.vue, entities registered in
      // src/data/mastersData.js); the 4 "User Wise ..." screens are a
      // pick-a-user-then-check-items shape (GenericUserWiseAssignment.vue,
      // driven by src/data/securityData.js); User Login Log is a read-only
      // report (GenericReportList.vue, src/data/reportsData.js).
      {
        path: "DMSSecurityUser",
        component: () => import("pages/DMSSecurityUser.vue"),
      },
      {
        path: "DMSSecurityUserWiseMenu",
        component: () => import("pages/DMSSecurityUserWiseMenu.vue"),
      },
      {
        path: "DMSSecurityUserWiseRights",
        component: () => import("pages/DMSSecurityUserWiseRights.vue"),
      },
      {
        path: "DMSSecurityUserWiseBookingOffice",
        component: () => import("pages/DMSSecurityUserWiseBookingOffice.vue"),
      },
      {
        path: "DMSSecurityUserWiseFinYear",
        component: () => import("pages/DMSSecurityUserWiseFinYear.vue"),
      },
      {
        path: "DMSSecurityUserLoginLog",
        component: () => import("pages/DMSSecurityUserLoginLog.vue"),
      },
      {
        path: "DMSSecurityPatchDetails",
        component: () => import("pages/DMSSecurityPatchDetails.vue"),
      },
      {
        path: "DMSSecurityMenu",
        component: () => import("pages/DMSSecurityMenu.vue"),
      },
      {
        path: "DMSSecurityRight",
        component: () => import("pages/DMSSecurityRight.vue"),
      },

      // Eway Bill module — matches the legacy app's own "Eway Bill" menu.
      // Dedicated pages + src/data/ewayBillData.js (localStorage-backed,
      // same pattern as src/data/tripData.js) since Part A/B generation is
      // a real workflow, not a flat master or plain report.
      {
        path: "DMSEWayBillPartBSingle",
        component: () => import("pages/DMSEWayBillPartBSingle.vue"),
      },
      {
        path: "DMSEWayBillPartBConsolidated",
        component: () => import("pages/DMSEWayBillPartBConsolidated.vue"),
      },
      {
        path: "DMSEWayBillPartBLog",
        component: () => import("pages/DMSEWayBillPartBLog.vue"),
      },
      {
        path: "DMSEWayBillPartBPrint",
        component: () => import("pages/DMSEWayBillPartBPrint.vue"),
      },
      {
        path: "DMSEWayBillPartA",
        component: () => import("pages/DMSEWayBillPartA.vue"),
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
        props: route => ({ params: route.query }),
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
        props: route => ({ params: route.query }),
      },
      {
        path: "CashCredit",
        component: () => import("pages/DMSCashCredit.vue"),
      },
      {
        path: "DMSCashCreditView",
        component: () => import("pages/DMSCashCreditView.vue"),
        props: route => ({ params: route.query }),
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
        props: route => ({ params: route.query }),
      },
      {
        path: "BookingDeleteLog",
        component: () => import("pages/DMSBookingDeleteLog.vue"),
      },
      {
        path: "DMSBookingDeleteLogView",
        component: () => import("pages/DMSBookingDeleteLogView.vue"),
        props: route => ({ params: route.query }),
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
