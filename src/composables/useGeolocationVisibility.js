import { ref, watch } from "vue";

// Global on/off switch for the shipper/consignee geolocation feature
// (the "Locations" toolbar button on the job form + the locator icon next
// to the Shipper/Consignee address fields). A single module-level ref, so
// every component that imports this shares the same state — no store
// (Vuex/Pinia) exists in this app, so this follows the same singleton-ref
// + localStorage pattern already used by src/composables/useNvoccShipments.js.

export const GEOLOCATION_ENABLED_KEY = "cnplus_geolocation_enabled";

function readInitial() {
  try {
    const stored = localStorage.getItem(GEOLOCATION_ENABLED_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

// Named export (not just returned from the hook below) so Options API
// components — this app's convention — can put it straight in data():
//   import { geolocationEnabled } from "src/composables/useGeolocationVisibility.js";
//   data() { return { geolocationEnabled }; }
// Vue auto-unwraps a ref placed on a component's reactive data object, and
// writes (`this.geolocationEnabled = false`) forward through to this same
// underlying ref — so every component sharing this import stays in sync.
export const geolocationEnabled = ref(readInitial());

watch(geolocationEnabled, (value) => {
  try {
    localStorage.setItem(GEOLOCATION_ENABLED_KEY, String(value));
  } catch {
    /* localStorage unavailable — in-memory state still works for this session */
  }
});

export function useGeolocationVisibility() {
  return { geolocationEnabled };
}
