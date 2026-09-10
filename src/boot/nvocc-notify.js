import { boot } from "quasar/wrappers";

const alertClassFor = (options) => {
  const severity = String(options.type || options.color || "").toLowerCase();

  if (severity === "positive") return "positive-alert";
  if (severity === "negative") return "negative-alert";
  if (["warning", "orange", "amber"].includes(severity)) {
    return "warning-alert";
  }

  return "";
};

const mrgPaths = new Set([
  "/minimumrateguideline",
  "/nvoccregion",
  "/nvoccsubcompany",
  "/nvoccagent",
  "/nvoccpaparties",
  "/nvoccagentrelation",
  "/nvoccagentvolumerelation",
  "/nvoccslotrates",
  "/nvoccdemurragetemplate",
  "/nvoccdemurragestoragedays",
  "/nvoccspecialdetention",
  "/nvoccstamps",
]);

const principalPaths = new Set([
  "/nvocccontainerpurchase",
  "/nvocccontainerlease",
  "/nvocccontainerrevenue",
  "/nvocccontainerexpense",
  "/nvocccontainersalesinvoice",
  "/nvocccontainerpurchasebill",
  "/nvocccontainerinventoryupload",
  "/nvoccgateout",
  "/nvoccgatein",
  "/nvoccleasereturn",
  "/nvocccreditnote",
  "/nvoccdebitnote",
  "/nvoccopening",
  "/nvoccprincipalsettlement",
  "/nvoccprincipalstatement",
  "/nvocccontainerledger",
  "/nvocccontainerprofitability",
  "/nvoccleaseoutstanding",
  "/nvoccprincipalmaster",
  "/nvoccprincipalagreement",
  "/nvoccprincipaldashboard",
  "/nvoccflow",
  "/nvoccreportcontsalesinvoice",
  "/nvoccreportpurchasebill",
  "/nvoccreportstockcontainer",
  "/nvoccreportcontainerpnl",
  "/nvoccreportvesselpnl",
]);

const moduleForRoute = (route) => {
  const path = String(route.path || "").toLowerCase();
  const mode = String(route.query?.mode || "").toLowerCase();
  if (!path.includes("nvocc") && !mrgPaths.has(path)) return "";

  if (mrgPaths.has(path) || path.includes("nvoccmrg")) {
    return "Minimum Rate Guideline";
  }
  if (principalPaths.has(path) || path.includes("nvoccprincipal")) {
    return "NVOCC Principal Operations";
  }
  if (
    mode === "import" ||
    /nvocc(import|prealert|pnrupload|blinward|igm|dischargelist|arrivalreport|receiveindemnity|deliveryorder)/.test(
      path.replace(/^\//, "")
    ) ||
    /report(cargoarrival|deliveryorder|emptycontainer|survey|detentionprocess)/.test(
      path
    )
  ) {
    return "NVOCC Import";
  }

  return "NVOCC Export";
};

export default boot(({ app, router }) => {
  const $q = app.config.globalProperties.$q;
  if ($q?.notify && !$q.__nvoccNotifyInstalled) {
    const originalNotify = $q.notify.bind($q);

    $q.notify = (input) => {
      const routePath = router.currentRoute.value?.path || "";
      const hasNvoccPage =
        typeof document !== "undefined" &&
        Boolean(
          document.querySelector(
            ".nvocc-form-page, .nvocc-principal-page, .nvocc-flow-page"
          )
        );
      const isNvoccRoute =
        routePath.toLowerCase().includes("nvocc") || hasNvoccPage;
      if (!isNvoccRoute) return originalNotify(input);

      const options =
        typeof input === "string" ? { message: input } : { ...input };
      const alertClass = alertClassFor(options);
      const classes = [options.classes, alertClass].filter(Boolean).join(" ");

      return originalNotify({
        ...options,
        position: "center",
        timeout: options.timeout === 0 ? 0 : 2000,
        ...(classes ? { classes } : {}),
        actions: options.actions || [
          { icon: "close", round: true, dense: true },
        ],
      });
    };

    $q.__nvoccNotifyInstalled = true;
  }

  const applyModuleHeader = (route) => {
    if (typeof document === "undefined") return;
    const moduleName = moduleForRoute(route);
    const root = document.documentElement;

    // Dynamic tabs do not always change the router URL. Their explicit menu
    // context is therefore more accurate than path inference for shared pages.
    if (root.getAttribute("data-nvocc-module-source") === "dynamic-tab") return;

    if (!moduleName) {
      root.removeAttribute("data-nvocc-module");
      root.style.removeProperty("--nvocc-module-name");
      return;
    }

    root.setAttribute("data-nvocc-module", moduleName);
    root.style.setProperty(
      "--nvocc-module-name",
      JSON.stringify(moduleName)
    );
  };

  applyModuleHeader(router.currentRoute.value);
  router.afterEach((to) => applyModuleHeader(to));
});
