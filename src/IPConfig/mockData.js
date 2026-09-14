// Fake "backend responses" for the parts of the post-login shell
// (MainLayout1's branch selector + sidebar menu, DashboardPage's branch
// filter) that would otherwise come up empty while cargonetlcl has no API
// of its own yet. Gated by the same MOCK_LOGIN_MODE flag as mockLogin.js —
// flip that one flag off once the real APIs exist and every one of these
// call sites falls back to its real axios call, unchanged.
export { MOCK_LOGIN_MODE } from "src/IPConfig/mockLogin.js";

// Shape expected by MainLayout1.vue's fetchData() (`${CargoNet_API}/branches/{userid}`).
export function buildMockBranches() {
  return [
    { BranchID: 1, BranchName: "Head Office (Mock)" },
    { BranchID: 2, BranchName: "Branch 2 (Mock)" },
  ];
}

// Shape expected by DashboardPage.vue's LoadBranchFields() (`${CargoNet_API}/branches/{userid}`,
// mapped from Fields.Branchcode / Fields.BranchID).
export function buildMockBranchFields() {
  return [
    { Branchcode: "HO", BranchID: 1 },
    { Branchcode: "BR2", BranchID: 2 },
  ];
}

// Shape expected by MainLayout1.vue's fetchParentMenu() (`${Login_API}/Login/{userid}/{branchid}`).
export function buildMockParentMenu() {
  return [
    { MenuCode: "DB", MenuName: "Dashboard", ShortCode: "Db" },
    // ShortCode "DMS" already has its icon mapped in MainLayout1.vue's
    // sidebar (dms.png) — reused as-is, no template change needed for this row.
    { MenuCode: "DMS", MenuName: "DMS", ShortCode: "DMS" },
  ];
}

// Shape expected by MainLayout1.vue's fetchChildMenu() (`${Login_API}/Login/{userid}/{branchid}/{menuCode}`).
// Only "DB", "BK" and "DMS" have stub children here — the "Report" + menu code
// (the second, parallel fetch fetchParentMenu always makes per parent)
// intentionally returns none, same as any other unmapped menu code.
export function buildMockChildMenu(menuCode) {
  const menus = {
    DB: [
      {
        id: "mock-dashboard",
        Link: "/IndexPage",
        MenuDesc: "Dashboard",
        Modulecode: "DB",
      },
      {
        id: "mock-userlog",
        Link: "/UserLogDetails",
        MenuDesc: "User Log Details",
        Modulecode: "DB",
      },
    ],
    // Matches the "Booking" tab's dropdown from the reference screenshot.
    // BBooking/Truck Booking/Booking route to the real DMSBooking.vue form
    // (via its formType prop); the rest don't have a built page yet, so
    // they route to the shared "under construction" placeholder.
    BK: [
      {
        id: "bk-bbooking",
        Link: "/DMSBBooking",
        MenuDesc: "BBooking",
        Modulecode: "BK",
      },
      {
        id: "bk-truckbooking",
        Link: "/DMSTruckBooking",
        MenuDesc: "Truck Booking",
        Modulecode: "BK",
      },
      {
        id: "bk-booking",
        Link: "/DMSBooking",
        MenuDesc: "Booking",
        Modulecode: "BK",
      },
      {
        id: "bk-bookingview",
        Link: "/DMSBookingViewReport",
        MenuDesc: "Booking View",
        Modulecode: "BK",
      },
      {
        id: "bk-bookingpod",
        Link: "/DMSBookingPOD",
        MenuDesc: "Booking POD",
        Modulecode: "BK",
      },
      {
        id: "bk-pendingforbooking",
        Link: "/DMSPendingForBooking",
        MenuDesc: "Pending For Booking",
        Modulecode: "BK",
      },
      {
        id: "bk-bookingweb",
        Link: "/DMSBookingWeb",
        MenuDesc: "Booking Web",
        Modulecode: "BK",
      },
      {
        id: "bk-cashcredit",
        Link: "/DMSCashCredit",
        MenuDesc: "Cash Credit",
        Modulecode: "BK",
      },
      {
        id: "bk-cashcreditdashboard",
        Link: "/DMSCashCreditDashBoard",
        MenuDesc: "Cash Credit Dash Board",
        Modulecode: "BK",
      },
      {
        id: "bk-outstandinglist",
        Link: "/DMSBookingOutstandingList",
        MenuDesc: "Outstanding List",
        Modulecode: "BK",
      },
      {
        id: "bk-chequeposting",
        Link: "/DMSBookingChequePosting",
        MenuDesc: "Booking List  - Cheque Posting",
        Modulecode: "BK",
      },
      {
        id: "bk-bookingemail",
        Link: "/DMSBookingEmail",
        MenuDesc: "Booking Email",
        Modulecode: "BK",
      },
      {
        id: "bk-pendingforinvoice",
        Link: "/DMSBookingPendingForInvoice",
        MenuDesc: "Booking List - Pending For Invoice",
        Modulecode: "BK",
      },
      {
        id: "bk-bookinglog",
        Link: "/DMSBookingLog",
        MenuDesc: "Booking Log",
        Modulecode: "BK",
      },
      {
        id: "bk-bookingdeletelog",
        Link: "/DMSBookingDeleteLog",
        MenuDesc: "Booking Delete Log",
        Modulecode: "BK",
      },
      {
        id: "bk-receiptnorenumbering",
        Link: "/DMSReceiptNoRenumbering",
        MenuDesc: "Receipt No Renumbering",
        Modulecode: "BK",
      },
      {
        id: "bk-bookingseriestransfer",
        Link: "/DMSBookingSeriesTransfer",
        MenuDesc: "Booking Series Transfer",
        Modulecode: "BK",
      },
    ],
    // "Booking Office" tab — master/lookup + voucher screens that manage
    // booking offices themselves, as opposed to individual bookings (which
    // stay under "Booking" above). Matches the reference screenshot's own
    // top tab bar, where "Booking Office" is a separate tab from "Booking".
    // Order/grouping matches the reference screenshot of the old app's own
    // "Booking Office" dropdown exactly. "E Way Bill" is NOT in that
    // dropdown (it isn't in the "Booking" one either) — its real menu
    // location is still unconfirmed, so it's left off both for now; the
    // page/route (DMSEWayBill.vue) still exists, just unlinked from any
    // menu until we know where the old app actually puts it.
    BO: [
      {
        id: "bo-commissionvoucher",
        Link: "/DMSCommission",
        MenuDesc: "Commission",
        Modulecode: "BO",
      },
      {
        id: "bo-otherstatefreightcharge",
        Link: "/DMSOtherStateFreightCharge",
        MenuDesc: "Other State Freight Charge",
        Modulecode: "BO",
      },
      {
        id: "bo-parcelhandlingcharge",
        Link: "/DMSParcelHandlingCharge",
        MenuDesc: "Parcel Handling Charge",
        Modulecode: "BO",
      },

      {
        id: "bo-wisedebitcollection",
        Link: "/DMSBookingOfficeWiseDebitCollection",
        MenuDesc: "Booking Office Wise Debit Collection",
        Modulecode: "BO",
      },
      {
        id: "bo-wisereceivedcollection",
        Link: "/DMSBookingOfficeWiseReceivedCollection",
        MenuDesc: "Booking Office Wise Received Collection",
        Modulecode: "BO",
      },
      {
        id: "bo-dailycollection",
        Link: "/DMSBookingOfficeDailyCollection",
        MenuDesc: "Booking Office Daily Collection",
        Modulecode: "BO",
      },

      {
        id: "bo-commission",
        Link: "/DMSBookingOfficeCommission",
        MenuDesc: "Booking Office Commission",
        Modulecode: "BO",
      },
      {
        id: "bo-commissionaddmultiple",
        Link: "/DMSBookingOfficeCommissionAddMultiple",
        MenuDesc: "Booking Office Commission Add Multiple",
        Modulecode: "BO",
      },

      {
        id: "bo-bookingoffice",
        Link: "/DMSBookingOffice",
        MenuDesc: "Booking Office",
        Modulecode: "BO",
      },
      {
        id: "bo-wisecity",
        Link: "/DMSBookingOfficeWiseCity",
        MenuDesc: "Booking Office Wise City",
        Modulecode: "BO",
      },
      {
        id: "bo-wisetocity",
        Link: "/DMSBookingOfficeWiseToCity",
        MenuDesc: "Booking Office Wise To City",
        Modulecode: "BO",
      },
      {
        id: "bo-wisepaymentmode",
        Link: "/DMSBookingOfficeWisePaymentMode",
        MenuDesc: "Booking Office Wise Payment Mode",
        Modulecode: "BO",
      },
    ],
    // DMS is one nesting level deeper than the other parents: each entry
    // here is a submenu group (Booking/Trip/Accounting), not a routable
    // leaf — MainLayout1.vue's child-rendering block tells a group apart
    // from a leaf by the presence of `children`. `icon` is a Material
    // Icon name, passed straight to the group's q-expansion-item.
    DMS: [
      {
        id: "dms-booking-header",
        Link: "#menu-header",
        MenuDesc: "Booking",
        Modulecode: "DMS",
      },
      {
        id: "dms-booking-bbooking",
        Link: "/DMSBBooking",
        MenuDesc: "BBooking",
        Modulecode: "DMS",
      },
      {
        id: "dms-booking-truckbooking",
        Link: "/DMSTruckBooking",
        MenuDesc: "Truck Booking",
        Modulecode: "DMS",
      },
      {
        id: "dms-booking-booking",
        Link: "/DMSBooking",
        MenuDesc: "Booking",
        Modulecode: "DMS",
      },
      {
        id: "dms-booking-bookingview",
        Link: "/DMSBBookingView",
        MenuDesc: "Booking View",
        Modulecode: "DMS",
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Trip" menu. "Trip" routes to the real DMSTrip.vue
      // (list + add/edit, with a "View" action opening DMSTripView.vue in
      // its own tab); every other item here now has a real built page too.
      {
        id: "dms-trip-header",
        Link: "#menu-header",
        MenuDesc: "Trip",
        Modulecode: "DMS",
      },
      {
        id: "dms-trip-trip",
        Link: "/DMSTrip",
        MenuDesc: "Trip",
        Modulecode: "DMS",
      },
      {
        id: "dms-trip-stocktransfer",
        Link: "/DMSTripStockTransfer",
        MenuDesc: "Trip - Stock Transfer",
        Modulecode: "DMS",
      },
      {
        id: "dms-trip-bookinglisttripwise",
        Link: "/DMSBookingListTripWise",
        MenuDesc: "Booking List - Trip Wise",
        Modulecode: "DMS",
      },
      {
        id: "dms-trip-posting",
        Link: "/DMSTripPosting",
        MenuDesc: "Trip Posting",
        Modulecode: "DMS",
      },
      {
        id: "dms-trip-pendingforunload",
        Link: "/DMSTripListPendingForUnload",
        MenuDesc: "Trip List - Pending For Unload",
        Modulecode: "DMS",
      },
      {
        id: "dms-trip-charge",
        Link: "/DMSTripCharge",
        MenuDesc: "Trip Charge",
        Modulecode: "DMS",
      },
      {
        id: "dms-trip-registertransporterwise",
        Link: "/DMSTripRegisterTransporterWise",
        MenuDesc: "Trip Register - Transporter Wise Scr.",
        Modulecode: "DMS",
      },
      {
        id: "dms-trip-incomeexpense",
        Link: "/DMSTripIncomeExpense",
        MenuDesc: "Trip Income Expense",
        Modulecode: "DMS",
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Delivery" menu. "Delivery" and "Door Delivery" route to
      // the real DMSDelivery.vue/DMSDoorDelivery.vue (modeled on the
      // EagleParcel-API's DEL_DeliveryENT/DEL_DoorDeliveryENT); every other
      // item here now has a real built page too.
      {
        id: "dms-delivery-header",
        Link: "#menu-header",
        MenuDesc: "Delivery",
        Modulecode: "DMS",
      },
      {
        id: "dms-delivery-delivery",
        Link: "/DMSDelivery",
        MenuDesc: "Delivery",
        Modulecode: "DMS",
      },
      {
        id: "dms-delivery-doordeliveryregister",
        Link: "/DMSDoorDeliveryRegister",
        MenuDesc: "Door Delivery Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-delivery-doordelivery",
        Link: "/DMSDoorDelivery",
        MenuDesc: "Door Delivery",
        Modulecode: "DMS",
      },
      {
        id: "dms-delivery-doordeliveryinvoice",
        Link: "/DMSDoorDeliveryInvoice",
        MenuDesc: "Door Delivery Invoice",
        Modulecode: "DMS",
      },
      {
        id: "dms-delivery-doordeliveryrate",
        Link: "/DMSDoorDeliveryRate",
        MenuDesc: "Door Delivery Rate",
        Modulecode: "DMS",
      },
      {
        id: "dms-delivery-addmultiple",
        Link: "/DMSDeliveryAddMultiple",
        MenuDesc: "Delivery - Add Multiple",
        Modulecode: "DMS",
      },
      {
        id: "dms-delivery-registerscreen",
        Link: "/DMSDeliveryRegisterScreen",
        MenuDesc: "Delivery Register Screen",
        Modulecode: "DMS",
      },
      {
        id: "dms-delivery-registerscreenpartycopy",
        Link: "/DMSDeliveryRegisterScreenPartyCopy",
        MenuDesc: "Delivery Register Screen (Party Copy)",
        Modulecode: "DMS",
      },

      {
        id: "dms-accounting-header",
        Link: "#menu-header",
        MenuDesc: "Account",
        Modulecode: "DMS",
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Account" menu (Account Voucher/Cash Payment/Cash
      // Receipt/Bank Payment/Bank Receipt/Contra Voucher/Journal Voucher/
      // Parcel Handling Rates/Customer Wise City/Configuration). Every
      // voucher + Customer Wise City is rendered through
      // GenericMasterList.vue (config in src/data/mastersData.js), same as
      // the Booking Office/Sale/Master groups below. "Configuration" is a
      // nested flyout (same shape as the Master group's own "Tax" entry).
      {
        id: "dms-account-voucher",
        Link: "/DMSAccountVoucher",
        MenuDesc: "Account Voucher",
        Modulecode: "DMS",
      },
      // EagleParcel LOCRPT/Account/ACC_AccountVoucher/ACC_AccountVoucher_Register
      // — read-only voucher register (GenericReportList.vue), rendered right
      // after the Account Voucher master it registers.
      {
        id: "dms-account-voucherregister",
        Link: "/DMSAccountVoucherRegister",
        MenuDesc: "Account Voucher Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-cashpayment",
        Link: "/DMSCashPayment",
        MenuDesc: "Cash Payment",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-cashreceipt",
        Link: "/DMSCashReceipt",
        MenuDesc: "Cash Receipt",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-bankpayment",
        Link: "/DMSBankPayment",
        MenuDesc: "Bank Payment",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-bankreceipt",
        Link: "/DMSBankReceipt",
        MenuDesc: "Bank Receipt",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-contravoucher",
        Link: "/DMSContraVoucher",
        MenuDesc: "Contra Voucher",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-journalvoucher",
        Link: "/DMSJournalVoucher",
        MenuDesc: "Journal Voucher",
        Modulecode: "DMS",
      },
      // EagleParcel LOCRPT/Account/ACC_JournalTran/ACC_JournalTran_AccountLedger
      // — running debit/credit/balance ledger for one account
      // (GenericReportList.vue), placed right after the Journal Voucher
      // entries that (along with the other vouchers) feed it.
      {
        id: "dms-account-ledger",
        Link: "/DMSAccountLedger",
        MenuDesc: "Account Ledger",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-parcelhandlingrates",
        Link: "/DMSAccountParcelHandlingCharge",
        MenuDesc: "Parcel Handling Rates",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-customerwisecity",
        Link: "/DMSCustomerWiseCity",
        MenuDesc: "Customer Wise City",
        Modulecode: "DMS",
      },
      {
        id: "dms-account-configuration",
        MenuDesc: "Configuration",
        Modulecode: "DMS",
        icon: "settings",
        children: [
          { id: "dms-account-configuration-ledgeraccount", Link: "/DMSMasterLedgerAccount", MenuDesc: "Ledger / Chart of Accounts", Modulecode: "DMS" },
          { id: "dms-account-configuration-vouchernumbering", Link: "/DMSMasterVoucher", MenuDesc: "Voucher Numbering", Modulecode: "DMS" },
        ],
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Booking Office" menu. Every item now has a real built
      // page.
      {
        id: "dms-bo-header",
        Link: "#menu-header",
        MenuDesc: "Booking Office",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-commission",
        Link: "/DMSBOCommission",
        MenuDesc: "Commission",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-otherstatefreightcharge",
        Link: "/DMSBOOtherStateFreightCharge",
        MenuDesc: "Other State Freight Charge",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-parcelhandlingcharge",
        Link: "/DMSBOParcelHandlingCharge",
        MenuDesc: "Parcel Handling Charge",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-wisedebitcollection",
        Link: "/DMSBOWiseDebitCollection",
        MenuDesc: "Booking Office Wise Debit Collection",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-wisereceivedcollection",
        Link: "/DMSBOWiseReceivedCollection",
        MenuDesc: "Booking Office Wise Received Collection",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-dailycollection",
        Link: "/DMSBODailyCollection",
        MenuDesc: "Booking Office Daily Collection",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-commissionscreen",
        Link: "/DMSBOCommissionScreen",
        MenuDesc: "Booking Office Commission",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-commissionaddmultiple",
        Link: "/DMSBOCommissionAddMultiple",
        MenuDesc: "Booking Office Commission Add Multiple",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-master",
        Link: "/DMSBOMaster",
        MenuDesc: "Booking Office",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-wisecity",
        Link: "/DMSBOWiseCity",
        MenuDesc: "Booking Office Wise City",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-wisetocity",
        Link: "/DMSBOWiseToCity",
        MenuDesc: "Booking Office Wise To City",
        Modulecode: "DMS",
      },
      {
        id: "dms-bo-wisepaymentmode",
        Link: "/DMSBOWisePaymentMode",
        MenuDesc: "Booking Office Wise Payment Mode",
        Modulecode: "DMS",
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Sale" menu.
      {
        id: "dms-sale-header",
        Link: "#menu-header",
        MenuDesc: "Sale",
        Modulecode: "DMS",
      },
      {
        id: "dms-sale-si",
        Link: "/DMSSaleSI",
        MenuDesc: "SI",
        Modulecode: "DMS",
      },
      {
        id: "dms-sale-siposting",
        Link: "/DMSSaleSIPosting",
        MenuDesc: "SI Posting",
        Modulecode: "DMS",
      },
      {
        id: "dms-sale-siemail",
        Link: "/DMSSaleSIEmail",
        MenuDesc: "SI Email",
        Modulecode: "DMS",
      },
      {
        id: "dms-sale-siprint",
        Link: "/DMSSaleSIPrint",
        MenuDesc: "SI Print",
        Modulecode: "DMS",
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Master" menu. "Tax" carried a further flyout submenu in
      // the legacy app (not captured here) — kept as a single leaf for now.
      {
        id: "dms-master-header",
        Link: "#menu-header",
        MenuDesc: "Master",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-vehicle",
        Link: "/DMSMasterVehicle",
        MenuDesc: "Vehicle",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-vehicletype",
        Link: "/DMSMasterVehicleType",
        MenuDesc: "Vehicle Type",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-driver",
        Link: "/DMSMasterDriver",
        MenuDesc: "Driver",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-carrier",
        Link: "/DMSMasterCarrier",
        MenuDesc: "Carrier",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-city",
        Link: "/DMSMasterCity",
        MenuDesc: "City",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-citywisedeliverycity",
        Link: "/DMSMasterCityWiseDeliveryCity",
        MenuDesc: "City Wise Delivery City",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-state",
        Link: "/DMSMasterState",
        MenuDesc: "State",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-item",
        Link: "/DMSMasterItem",
        MenuDesc: "Item",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-unit",
        Link: "/DMSMasterUnit",
        MenuDesc: "Unit",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-invoicetype",
        Link: "/DMSMasterInvoiceType",
        MenuDesc: "Invoice Type",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-paymentmode",
        Link: "/DMSMasterPaymentMode",
        MenuDesc: "Payment Mode",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-voucher",
        Link: "/DMSMasterVoucher",
        MenuDesc: "Voucher",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-company",
        Link: "/DMSMasterCompany",
        MenuDesc: "Company",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-finyear",
        Link: "/DMSMasterFinYear",
        MenuDesc: "Fin Year",
        Modulecode: "DMS",
      },
      {
        id: "dms-master-series",
        Link: "/DMSMasterSeries",
        MenuDesc: "Series",
        Modulecode: "DMS",
      },
      // "Tax" is a flyout group (own nested children), not a plain leaf —
      // matches the legacy app's own Master > Tax submenu exactly. See
      // MainLayout1.vue's "Group row" branch (child.children.length) for
      // how a DMS-array entry with its own `children` renders as an
      // expandable flyout instead of a direct link.
      {
        id: "dms-master-tax",
        MenuDesc: "Tax",
        Modulecode: "DMS",
        icon: "percent",
        children: [
          { id: "dms-master-tax-servicetaxconfig", Link: "/DMSMasterServiceTaxConfig", MenuDesc: "Service Tax Config", Modulecode: "DMS" },
          { id: "dms-master-tax-tax", Link: "/DMSMasterTax", MenuDesc: "Tax", Modulecode: "DMS" },
          { id: "dms-master-tax-taxapplyontax", Link: "/DMSMasterTaxApplyOnTax", MenuDesc: "Tax Apply On Tax", Modulecode: "DMS" },
          { id: "dms-master-tax-taxsystem", Link: "/DMSMasterTaxSystem", MenuDesc: "Tax System", Modulecode: "DMS" },
          { id: "dms-master-tax-taxsystemwisetax", Link: "/DMSMasterTaxSystemWiseTax", MenuDesc: "Tax System Wise Tax", Modulecode: "DMS" },
        ],
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Report Screens" menu.
      {
        id: "dms-rs-header",
        Link: "#menu-header",
        MenuDesc: "Report Screens",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-currentstock",
        Link: "/DMSRSCurrentStock",
        MenuDesc: "Current Stock",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-bookingregistergst",
        Link: "/DMSRSBookingRegisterGST",
        MenuDesc: "Booking Register GST",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-dailycollectionsummary",
        Link: "/DMSRSDailyCollectionSummary",
        MenuDesc: "Daily Collection Summary",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-topaycollectionregister",
        Link: "/DMSRSTopayCollectionRegister",
        MenuDesc: "Topay Collection Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-ledgeraccountlist",
        Link: "/DMSRSLedgerAccountList",
        MenuDesc: "Ledger Account List",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-cashcreditledger",
        Link: "/DMSRSCashCreditLedger",
        MenuDesc: "Cash Credit Ledger",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-debitledger",
        Link: "/DMSRSDebitLedger",
        MenuDesc: "Debit Ledger",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-entryeditlist",
        Link: "/DMSRSEntryEditList",
        MenuDesc: "Entry Edit List",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-bookingregisterscr",
        Link: "/DMSRSBookingRegisterScr",
        MenuDesc: "Booking Register Scr",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-bookingoutwardregister",
        Link: "/DMSRSBookingOutwardRegister",
        MenuDesc: "Booking Outward Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-debitlistpartywisescreen",
        Link: "/DMSRSDebitListPartyWiseScreen",
        MenuDesc: "Debit List - Party Wise Screen",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-debitlistpartywiseyearly",
        Link: "/DMSRSDebitListPartyWiseYearly",
        MenuDesc: "Debit List - Party Wise (Yearly)",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-cashcreditdebitlistpartywise",
        Link: "/DMSRSCashCreditDebitListPartyWise",
        MenuDesc: "Cash Credit Debit List - Party Wise",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-userwisecreditlimitsummary",
        Link: "/DMSRSUserWiseCreditLimitSummary",
        MenuDesc: "User Wise Credit Limit Summary",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-uchakreceivedlist",
        Link: "/DMSRSUchakReceivedList",
        MenuDesc: "Uchak Received List",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-cashbookingwithchqpaymentmode",
        Link: "/DMSRSCashBookingWithChqPaymentMode",
        MenuDesc: "Cash Booking With Chq Payment Mode",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-citywiseperiodwisecollection",
        Link: "/DMSRSCityWisePeriodWiseCollection",
        MenuDesc: "City Wise Period Wise Collection",
        Modulecode: "DMS",
      },
      // Added against the legacy EagleParcel RDLC set under
      // Reports/Booking/BUK_Booking + BUK_BookingM — no equivalent screen
      // existed here yet.
      {
        id: "dms-rs-bookinginwardoutwardregister",
        Link: "/DMSRSBookingInwardOutwardRegister",
        MenuDesc: "Booking Inward Outward Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-dailycollectionregister",
        Link: "/DMSRSDailyCollectionRegister",
        MenuDesc: "Daily Collection Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-bookingmpendingfordeliverym",
        Link: "/DMSRSBookingMPendingForDeliveryM",
        MenuDesc: "Pending List For Delivery (M)",
        Modulecode: "DMS",
      },
      {
        id: "dms-rs-bookingmregister",
        Link: "/DMSRSBookingMRegister",
        MenuDesc: "Booking M Register",
        Modulecode: "DMS",
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Reports" menu.
      {
        id: "dms-rpt-header",
        Link: "#menu-header",
        MenuDesc: "Reports",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-coveringletter",
        Link: "/DMSRptCoveringLetter",
        MenuDesc: "Covering Letter",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-doordeliverysummary",
        Link: "/DMSRptDoorDeliverySummary",
        MenuDesc: "Door Delivery Summary",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-deliverymregister",
        Link: "/DMSRptDeliveryMRegister",
        MenuDesc: "Delivery M Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-doordeliverymregister",
        Link: "/DMSRptDoorDeliveryMRegister",
        MenuDesc: "Door Delivery M Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-doordeliverydetail",
        Link: "/DMSRptDoorDeliveryDetail",
        MenuDesc: "Door Delivery Detail",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-siregisteraccountservicetax",
        Link: "/DMSRptSIRegisterAccountServiceTax",
        MenuDesc: "SI Register - Account - Service Tax",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-siregisteraccountgst",
        Link: "/DMSRptSIRegisterAccountGST",
        MenuDesc: "SI Register - Account - GST",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-cashsummarygst",
        Link: "/DMSRptCashSummaryGST",
        MenuDesc: "Cash Summary - GST",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-cashsummaryservicetax",
        Link: "/DMSRptCashSummaryServiceTax",
        MenuDesc: "Cash Summary - Service Tax",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-bookingregister",
        Link: "/DMSRptBookingRegister",
        MenuDesc: "Booking Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-bookingregistergst",
        Link: "/DMSRptBookingRegisterGST",
        MenuDesc: "Booking Register GST",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-siregisteraccountgstr1",
        Link: "/DMSRptSIRegisterAccountGSTR1",
        MenuDesc: "SI Register - Account - GSTR1",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-siregisteraccountgstb2bb2c",
        Link: "/DMSRptSIRegisterAccountGSTB2BB2C",
        MenuDesc: "SI Register - Account GST - B2B B2C",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-accountledgerwithoppositeaccount",
        Link: "/DMSRptAccountLedgerWithOppositeAccount",
        MenuDesc: "Account Ledger with Opposite Account",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-commwisemismatchbooking",
        Link: "/DMSRptCommWiseMismatchBooking",
        MenuDesc: "Comm. Wise Mismatch Booking",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-bookingdeletelogregister",
        Link: "/DMSRptBookingDeleteLogRegister",
        MenuDesc: "Booking Delete Log Register",
        Modulecode: "DMS",
      },
      // BUK_OtherStateFreightChargePrint(+_FreightDeliveryCharge)/
      // BUK_OtherStateFreightCharge_SummaryPrint.rdlc — no register/print
      // screen existed for the Other State Freight Charge voucher yet
      // (DMSOtherStateFreightCharge.vue / DMSBOOtherStateFreightCharge.vue
      // are entry-only).
      {
        id: "dms-rpt-otherstatefreightchargeregister",
        Link: "/DMSRptOtherStateFreightChargeRegister",
        MenuDesc: "Other State Freight Charge Register",
        Modulecode: "DMS",
      },
      {
        id: "dms-rpt-otherstatefreightchargesummary",
        Link: "/DMSRptOtherStateFreightChargeSummary",
        MenuDesc: "Other State Freight Charge Summary",
        Modulecode: "DMS",
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Security" menu. User/Menu/Rights/Patch Details are flat
      // masters (GenericMasterList.vue); the 4 "User Wise ..." screens pick
      // a user then check items (GenericUserWiseAssignment.vue); User Login
      // Log is a read-only report (GenericReportList.vue).
      {
        id: "dms-security-header",
        Link: "#menu-header",
        MenuDesc: "Security",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-user",
        Link: "/DMSSecurityUser",
        MenuDesc: "User",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-userwisemenu",
        Link: "/DMSSecurityUserWiseMenu",
        MenuDesc: "User Wise Menu",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-userwiserights",
        Link: "/DMSSecurityUserWiseRights",
        MenuDesc: "User Wise Rights",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-userwisebookingoffice",
        Link: "/DMSSecurityUserWiseBookingOffice",
        MenuDesc: "User Wise Booking Office",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-userwisefinyear",
        Link: "/DMSSecurityUserWiseFinYear",
        MenuDesc: "User Wise Fin Year",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-userloginlog",
        Link: "/DMSSecurityUserLoginLog",
        MenuDesc: "User Login Log",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-patchdetails",
        Link: "/DMSSecurityPatchDetails",
        MenuDesc: "Patch Details",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-menu",
        Link: "/DMSSecurityMenu",
        MenuDesc: "Menu",
        Modulecode: "DMS",
      },
      {
        id: "dms-security-right",
        Link: "/DMSSecurityRight",
        MenuDesc: "Rights",
        Modulecode: "DMS",
      },

      // Item names/order matched 1:1 to the legacy EagleParcel WinForms
      // app's own "Eway Bill" menu. Part A creates the base bill; Part B
      // Single/Consolidated attach a vehicle to one or several bills at
      // once; Log and Print both just read whatever's already generated.
      {
        id: "dms-ewaybill-header",
        Link: "#menu-header",
        MenuDesc: "Eway Bill",
        Modulecode: "DMS",
      },
      {
        id: "dms-ewaybill-partbsingle",
        Link: "/DMSEWayBillPartBSingle",
        MenuDesc: "E Way Bill - Part B - Single",
        Modulecode: "DMS",
      },
      {
        id: "dms-ewaybill-partbconsolidated",
        Link: "/DMSEWayBillPartBConsolidated",
        MenuDesc: "E Way Bill - Part B - Consolidated",
        Modulecode: "DMS",
      },
      {
        id: "dms-ewaybill-partblog",
        Link: "/DMSEWayBillPartBLog",
        MenuDesc: "E-Way Bill Part B Log",
        Modulecode: "DMS",
      },
      {
        id: "dms-ewaybill-partbprint",
        Link: "/DMSEWayBillPartBPrint",
        MenuDesc: "E Way Bill - Part B - Print",
        Modulecode: "DMS",
      },
      {
        id: "dms-ewaybill-parta",
        Link: "/DMSEWayBillPartA",
        MenuDesc: "E Way Bill - Part A",
        Modulecode: "DMS",
      },
    ],
  };
  return menus[menuCode] || [];
}

// Shape expected by MainLayout1.vue's LoadCurrentFinancialYear() (`${CargoNet_API}/financialyear/currentfinyear`).
export function buildMockFinancialYears() {
  return [{ CurrentFinYear: "2025-26 (Mock)", ID: 1 }];
}
