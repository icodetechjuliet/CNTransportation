// src/boot/router-guard.js
// export default ({ router }) => {
//   let isFirstLoad = true;

//   router.beforeEach((to, from, next) => {
//     const allowedDirectPaths = ["/", "/Logout=Y"];
//     const token = sessionStorage.getItem("accessToken"); // To verify token existence to prevent to redirect to login on page at refresh
//     if (isFirstLoad && !token) {
//       isFirstLoad = false;
//       if (!allowedDirectPaths.includes(to.path)) {
//         return next("/"); // redirect straight to login
//       }
//     }

//     next();
//   });
// };

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem("accessToken");
    const publicPaths = ["/", "/Logout=Y", "/AutoWtsAppMsg"];

    // No token → only allow the login/logout entry screens.
    if (!token && !publicPaths.includes(to.path)) {
      return next("/");
    }

    // Already logged in → don't let back navigation (hardware back button on
    // the APK build, browser back, etc.) land back on the login screen.
    const guestOnlyPaths = ["/", "/AutoWtsAppMsg"];
    if (token && guestOnlyPaths.includes(to.path)) {
      return next("/IndexPage");
    }

    // Only check refresh/new-tab when from is empty (initial navigation).
    // `from` is vue-router's START_LOCATION on every fresh page load, which
    // always reports path "/" and no name regardless of which URL was
    // actually reloaded — so this condition is true on every refresh, not
    // just refreshes that started from "/". Gate it on having a token: an
    // unauthenticated reload of the login page must NOT bounce to
    // /IndexPage, because the token check above immediately bounces it
    // right back to "/" — and since nothing ever gets confirmed mid-chain,
    // `from` stays START_LOCATION on every hop, so that back-and-forth
    // repeats forever instead of settling, hanging the page in a
    // perpetual loading state.
    if (token && !from.name && from.path === "/") {
      const navEntries = performance.getEntriesByType("navigation");
      const navType = navEntries.length > 0 ? navEntries[0].type : "navigate";

      // "reload" = F5/Ctrl+R → redirect to dashboard
      // "navigate" = new tab / direct URL entry → allow through
      if (navType === "reload" && to.path !== "/IndexPage") {
        console.log("🔄 Refresh detected → redirecting to Dashboard");
        return next("/IndexPage");
      }
    }

    next();
  });
};
