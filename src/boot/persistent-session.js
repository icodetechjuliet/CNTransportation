// The packaged Android app runs inside a Cordova WebView that can be torn
// down entirely when the user backs out, the OS reclaims memory, or the
// task is swiped away — which wipes sessionStorage and forces a fresh login
// on every launch. Swiggy/Flipkart-style apps stay logged in until an
// explicit logout, so in the Cordova build we back `sessionStorage` with
// `localStorage` (survives process death). Every existing
// `sessionStorage.getItem/setItem/removeItem` call site keeps working
// unchanged; the web/SPA build's normal per-tab sessionStorage is untouched.
export default () => {
  if (process.env.MODE !== "cordova") return;

  try {
    Object.defineProperty(window, "sessionStorage", {
      value: window.localStorage,
      configurable: true,
    });
  } catch (e) {
    // If the WebView doesn't allow redefining sessionStorage, fall back to
    // its native per-process behavior (login will be requested each launch).
  }
};
