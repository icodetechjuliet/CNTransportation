import { ref, watch } from "vue";

// Which map/search provider combo GeolocationSelector.vue uses — a personal
// per-browser preference, same singleton-ref + localStorage pattern as
// src/composables/useGeolocationVisibility.js (no Vuex/Pinia store exists
// in this app). Company/business-name search quality vs. Google API cost
// is a real trade-off (TomTom's search is free but has thinner business
// coverage; Google's is far better but billed beyond its free credit), so
// this is offered as an explicit choice rather than baked into the code.

export const GEOLOCATION_MODE_KEY = "cnplus_geolocation_provider_mode";

export const GEOLOCATION_MODES = {
  FREE: "free", // TomTom map + TomTom search
  STANDARD: "standard", // TomTom map (free) + Google search (paid)
  PREMIUM: "premium", // Google map + Google search (paid)
};

// Single source of truth for the mode picker inside GeolocationSelector.vue
// — keep this copy in sync with what's actually true of each mode below.
export const GEOLOCATION_MODE_META = {
  [GEOLOCATION_MODES.FREE]: {
    short: "Free",
    badge: "Free",
    name: "Free — Standard Maps",
    how: "Map and company/address search both run on Standard Maps.",
    note: "No cost. Business/company-name search coverage can be thinner for smaller local businesses.",
  },
  [GEOLOCATION_MODES.STANDARD]: {
    short: "Standard",
    badge: "Recommended",
    name: "Standard — Google-Powered Search",
    how: "Map stays on Standard Maps (free); search switches to Google Places for better business & street matching.",
    note: "Map is free. Search is billed against Google's monthly free credit, then pay-as-you-go beyond it.",
  },
  [GEOLOCATION_MODES.PREMIUM]: {
    short: "Premium",
    // Not "Highest cost" — that badge is meant to be scanned in under a
    // second, and leading with the price tag reads as a warning rather
    // than a plan name. The cost detail still lives in `note` below.
    badge: "Best Accuracy",
    name: "Premium — Full Google Maps",
    how: "Both the map and search run entirely on Google Maps Platform.",
    note: "Best accuracy and a familiar Google Maps look, but all usage — including simply displaying the map — draws from Google's paid quota. Highest cost of the three.",
  },
};

function readInitial() {
  try {
    const stored = localStorage.getItem(GEOLOCATION_MODE_KEY);
    return Object.values(GEOLOCATION_MODES).includes(stored)
      ? stored
      : GEOLOCATION_MODES.FREE;
  } catch {
    return GEOLOCATION_MODES.FREE;
  }
}

// Named export (not just returned from the hook below) so Options API
// components — this app's convention — can put it straight in data():
//   import { geolocationProviderMode } from "src/composables/useGeolocationProviderMode.js";
//   data() { return { geolocationProviderMode }; }
// Vue auto-unwraps a ref placed on a component's reactive data object, and
// writes (`this.geolocationProviderMode = "premium"`) forward through to
// this same underlying ref — so every component sharing this import stays
// in sync.
export const geolocationProviderMode = ref(readInitial());

watch(geolocationProviderMode, (value) => {
  try {
    localStorage.setItem(GEOLOCATION_MODE_KEY, value);
  } catch {
    /* localStorage unavailable — in-memory state still works for this session */
  }
});

export function useGeolocationProviderMode() {
  return { geolocationProviderMode, GEOLOCATION_MODES, GEOLOCATION_MODE_META };
}
