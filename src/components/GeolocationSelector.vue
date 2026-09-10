<template>
  <q-dialog
    v-model="visible"
    persistent
    @hide="destroyMap"
  >
    <q-card class="geo-dialog nvocc-dialog-card column no-wrap">
      <q-card-section class="dialog-head row items-center no-wrap">
        <div class="glyph">
          <q-icon name="location_on" size="18px" />
        </div>
        <div class="titles">
          <div class="modal-title">Select company location</div>
          <div class="modal-subtitle">{{ companyName }}</div>
        </div>
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close"
          aria-label="Close"
        />
      </q-card-section>

      <q-card-section v-if="checkingSavedLocation" class="geo-body geo-summary-loading">
        <q-spinner-dots color="primary" size="36px" />
        <div class="q-mt-sm text-grey-7">Checking saved location...</div>
      </q-card-section>

      <q-card-section v-else-if="viewMode === 'summary'" class="geo-body">
        <div class="geo-summary-card">
          <div class="geo-summary-card__status">
            <q-icon name="check_circle" color="positive" size="20px" />
            Location already saved
          </div>
          <div class="geo-summary-card__address">
            {{ selectedAddress || "Address not available" }}
          </div>
          <div class="geo-summary-card__coords">
            <span class="coord-pill">
              <span class="coord-label">Lat</span>
              {{ formatCoordinate(latitude) }}
            </span>
            <span class="coord-pill">
              <span class="coord-label">Lng</span>
              {{ formatCoordinate(longitude) }}
            </span>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-else class="geo-body">
        <div class="geo-mode-section">
          <div class="geo-mode-section__label">
            <q-icon name="travel_explore" size="14px" />
            Search & map mode
          </div>
          <div class="row q-col-gutter-sm">
            <div
              v-for="mode in GEOLOCATION_MODES"
              :key="mode"
              class="col-12 col-sm-4"
            >
              <div
                class="geo-mode-card"
                :class="{
                  'geo-mode-card--selected': geolocationProviderMode === mode,
                }"
                @click="geolocationProviderMode = mode"
              >
                <div class="geo-mode-card__head">
                  <q-radio
                    v-model="geolocationProviderMode"
                    :val="mode"
                    color="primary"
                    dense
                    @click.stop
                  />
                  <div class="geo-mode-card__head-right">
                    <q-badge
                      :color="modeBadgeColor(GEOLOCATION_MODE_META[mode].badge)"
                      outline
                      class="geo-mode-card__badge"
                    >
                      {{ GEOLOCATION_MODE_META[mode].badge }}
                    </q-badge>
                    <q-icon
                      name="info"
                      size="22px"
                      class="geo-mode-card__info"
                      @click.stop
                    >
                      <q-tooltip
                        anchor="top middle"
                        self="bottom middle"
                        max-width="280px"
                        class="geo-mode-card__tooltip"
                      >
                        {{ GEOLOCATION_MODE_META[mode].note }}
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
                <div class="geo-mode-card__name">
                  {{ GEOLOCATION_MODE_META[mode].name }}
                </div>
                <div class="geo-mode-card__how">
                  {{ GEOLOCATION_MODE_META[mode].how }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-separator class="geo-mode-divider" />
        <q-tabs
          v-model="searchMode"
          dense
          no-caps
          class="geo-tabs"
        >
          <q-tab
            name="address"
            icon="travel_explore"
            label="Company / Address"
          />
          <q-tab
            name="coordinates"
            icon="pin_drop"
            label="Latitude & longitude"
          />
        </q-tabs>
        <q-tab-panels v-model="searchMode" animated class="geo-search-panels">
          <q-tab-panel name="address" class="q-pa-none">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm">
                <q-input
                  v-model="addressQuery"
                  square
                  outlined
                  dense
                  bg-color="blue-1"
                  clearable
                  label="Search company name, address, city or postcode"
                  @keyup.enter="searchAddress"
                >
                  <template #prepend><q-icon name="search" /></template>
                </q-input>
              </div>
              <div class="col-12 col-sm-auto geo-search-action">
                <q-btn
                  no-caps
                  color="primary"
                  class="m-btn-style-md full-width"
                  label="Search"
                  :loading="searching"
                  @click="searchAddress"
                />
              </div>
            </div>
            <q-list
              v-if="results.length"
              bordered
              separator
              class="geo-results q-mt-sm"
            >
              <q-item
                v-for="result in results"
                :key="result.id"
                clickable
                @click="selectResult(result)"
              >
                <q-item-section avatar
                  ><q-icon :name="result.icon" color="primary"
                /></q-item-section>
                <q-item-section>
                  <!-- Business/POI results lead with the name, the rest of
                       the address as a caption below (both providers'
                       results are normalized into this label/caption shape
                       in searchAddressTomTom()/searchAddressGoogle()). -->
                  <q-item-label>{{ result.label }}</q-item-label>
                  <q-item-label v-if="result.caption" caption>{{
                    result.caption
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="coordinates" class="q-pa-none">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-5">
                <q-input
                  v-model.number="latitude"
                  square
                  outlined
                  dense
                  bg-color="blue-1"
                  type="number"
                  label="Latitude"
                />
              </div>
              <div class="col-12 col-sm-5">
                <q-input
                  v-model.number="longitude"
                  square
                  outlined
                  dense
                  bg-color="blue-1"
                  type="number"
                  label="Longitude"
                />
              </div>
              <div class="col-12 col-sm-2 geo-search-action">
                <q-btn
                  no-caps
                  class="m-btn-style-md full-width"
                  color="primary"
                  label="Locate"
                  @click="locateCoordinates"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <div class="geo-map-wrap">
          <div ref="mapContainer" class="geo-map"></div>
          <div class="geo-map-help">
            <q-icon name="touch_app" size="14px" class="q-mr-xs" />
            Click the map or drag the pin to select the exact location
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-12 col-sm-8">
            <q-input
              v-model="selectedAddress"
              square
              outlined
              dense
              bg-color="blue-1"
              label="Geo-Located Address"
            />
          </div>
          <div class="col-6 col-sm-2">
            <q-input
              :model-value="formatCoordinate(latitude)"
              square
              outlined
              dense
              bg-color="blue-1"
              readonly
              label="Latitude"
            />
          </div>
          <div class="col-6 col-sm-2">
            <q-input
              :model-value="formatCoordinate(longitude)"
              square
              outlined
              dense
              bg-color="blue-1"
              readonly
              label="Longitude"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions
        v-if="!checkingSavedLocation && viewMode === 'summary'"
        align="right"
        class="dialog-actions"
      >
        <q-btn
          no-caps
          color="primary"
          class="m-btn-style"
          icon="edit"
          label="Edit location"
          @click="editLocation"
        />
      </q-card-actions>
      <q-card-actions
        v-else-if="!checkingSavedLocation"
        align="right"
        class="dialog-actions"
      >
        <q-btn
          no-caps
          color="primary"
          class="m-btn-style"
          icon="save"
          label="Save location"
          :loading="saving"
          :disable="!hasLocation"
          @click="saveLocation"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { markRaw } from "vue";
import axios from "axios";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ttServices from "@tomtom-international/web-sdk-services";
import CargoNet_API from "/src/IPConfig/config.js";
import {
  TOMTOM_API_KEY,
  GOOGLE_MAPS_API_KEY,
} from "/src/IPConfig/configGeolocatorMap.js";
import {
  geolocationProviderMode,
  GEOLOCATION_MODES,
  GEOLOCATION_MODE_META,
} from "src/composables/useGeolocationProviderMode.js";

// Google Maps JS API loader — only used when the current mode calls for
// Google (search in Standard/Premium, map in Premium — see mapProvider()/
// searchProvider() below). Module-level singleton so the script only loads
// once no matter how many times this dialog opens or which mode is active.
let googleMapsLoaderPromise = null;
function loadGoogleMaps() {
  if (window.google?.maps?.places) return Promise.resolve(window.google);
  if (googleMapsLoaderPromise) return googleMapsLoaderPromise;
  googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const callbackName = "__cnGeoSelectorGoogleMapsReady";
    window[callbackName] = () => {
      delete window[callbackName];
      resolve(window.google);
    };
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}` +
      `&libraries=places,maps&loading=async&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => {
      googleMapsLoaderPromise = null;
      reject(new Error("Failed to load Google Maps JS API"));
    };
    document.head.appendChild(script);
  });
  return googleMapsLoaderPromise;
}

export default {
  name: "GeolocationSelector",
  emits: ["location-saved"],
  data() {
    return {
      visible: false,
      accountId: null,
      companyName: "",
      // Which body the dialog shows: "summary" (already-saved location,
      // read-only, with an Edit button) or "editor" (the search/map picker
      // below). Decided once loadSavedLocation() resolves in open() — a
      // company with no saved location yet skips straight to "editor".
      viewMode: "editor",
      checkingSavedLocation: false,
      searchMode: "address",
      addressQuery: "",
      selectedAddress: "",
      latitude: 20.593684,
      longitude: 78.96288,
      results: [],
      searching: false,
      saving: false,
      reverseGeocoding: false,
      map: null,
      marker: null,
      // Google Geocoder instance (used by reverseGeocodeGoogle()) — created
      // lazily on first use, markRaw()'d for the same reason as map/marker
      // below (Vue's reactive Proxy breaks these SDKs' internal
      // non-configurable properties / private-field getters). Places
      // search doesn't need a stored instance — its classes are used
      // statically.
      geocoder: null,
      // Which provider actually built the current map / ran the last
      // search — captured once at open time (see initializeMap()/
      // searchAddress()) rather than re-read live from the mode setting on
      // every call, so a mode change elsewhere in the app can't leave a
      // half-TomTom-half-Google map/marker mid-dialog-session.
      activeMapProvider: null,
      activeSearchProvider: null,
      // Shared per-browser preference — see
      // src/composables/useGeolocationProviderMode.js. Picked right here in
      // the dialog (see the "Search & map mode" row in the template) so
      // it's visible at the point of use rather than tucked away in a
      // separate settings screen.
      geolocationProviderMode,
      GEOLOCATION_MODES,
      GEOLOCATION_MODE_META,
    };
  },
  computed: {
    hasLocation() {
      return (
        this.accountId &&
        Number.isFinite(Number(this.latitude)) &&
        Number.isFinite(Number(this.longitude))
      );
    },
    // Free = TomTom map + TomTom search. Standard = TomTom map (free) +
    // Google search (paid). Premium = Google map + Google search (paid).
    // See GEOLOCATION_MODE_META in the composable for the customer-facing
    // explanation of each.
    mapProvider() {
      return this.geolocationProviderMode === GEOLOCATION_MODES.PREMIUM
        ? "google"
        : "tomtom";
    },
    searchProvider() {
      return this.geolocationProviderMode === GEOLOCATION_MODES.FREE
        ? "tomtom"
        : "google";
    },
  },
  watch: {
    // Rebuild the map live when the mode changes while the dialog is
    // already open — initializeMap() only runs on the dialog's own "show"
    // transition, so without this, switching pills mid-session left
    // whichever map/search provider was active when the dialog first
    // opened in place no matter what got picked afterward.
    geolocationProviderMode() {
      if (!this.visible || this.viewMode !== "editor") return;
      this.destroyMap();
      this.initializeMap();
    },
  },
  beforeUnmount() {
    this.destroyMap();
  },
  methods: {
    // Badge tint for the "Search & map mode" pills — Free is neutral (no
    // cost either way to flag), Recommended reads as positive/green, and
    // Premium gets a distinct purple so it stands out as the deliberate
    // "spend more, get more" pick without reading as a warning.
    modeBadgeColor(badge) {
      if (badge === "Recommended") return "positive";
      if (badge === "Best Accuracy") return "deep-purple";
      return "grey-6";
    },
    async open({ account, address }) {
      if (!account || !account.value) {
        this.$q.notify({
          type: "negative",
          message: "Select a shipper or consignee first.",
        });
        return;
      }
      this.accountId = account.value;
      this.companyName = account.label || "Selected company";
      // Prime the search box with "Company Name, Address" — company name
      // alone if there's no address on file yet — so the very first search
      // (or auto-search, if this dialog ever adds one) has the strongest
      // possible signal to find the right business, not just its street
      // address. The address half is stripped of tax/registration codes
      // first (see stripRegistrationCodes()) — some accounts' saved
      // Company Address has GST/ECC/SSI numbers etc. tacked onto the end,
      // which are noise to a map search, not part of a real address.
      // Selected address stays the untouched original text (see
      // composeSelectedAddress()'s own doc comment) since that's the field
      // that actually gets saved — only the search query is cleaned up.
      this.addressQuery = this.composeSelectedAddress(
        account.label,
        this.stripRegistrationCodes(address)
      );
      this.selectedAddress = address || "";
      this.results = [];
      this.activeSearchProvider = null;
      // Reset to the default pin until any previously saved coordinates for
      // this account load below — otherwise reopening would keep showing
      // whatever was left over from the last company this dialog was used for.
      this.latitude = 20.593684;
      this.longitude = 78.96288;
      // Unknown until loadSavedLocation() resolves below — shown as a brief
      // spinner rather than flashing the map editor open only to swap to the
      // summary a moment later.
      this.viewMode = "editor";
      this.checkingSavedLocation = true;
      this.visible = true;
      const hasSavedLocation = await this.loadSavedLocation();
      this.checkingSavedLocation = false;
      if (hasSavedLocation) {
        // Already has a pin on file — show the read-only summary first;
        // the map editor only opens once the user explicitly asks to edit
        // it (see editLocation()), instead of always dropping straight
        // into the picker.
        this.viewMode = "summary";
      } else {
        this.viewMode = "editor";
        await this.$nextTick();
        this.initializeMap();
      }
    },
    // Switches the "already saved" summary over to the search/map picker,
    // and initializes the map now that its container actually renders
    // (skipped entirely while the summary is showing — see viewMode above).
    async editLocation() {
      this.viewMode = "editor";
      await this.$nextTick();
      this.initializeMap();
    },
    // Resolves true when this account already has a real saved pin — 0,0 is
    // what the backend returns for an unset location, not an actual saved
    // spot near the Gulf of Guinea, so it's treated the same as no location
    // (matches DeliveryGeolocationDialog.vue's isValidLocation() check).
    async loadSavedLocation() {
      const accountId = this.accountId;
      try {
        const { data } = await axios.get(
          `${CargoNet_API}/MasterCompany/geolocation/${accountId}`
        );
        // Dialog may have been reopened for a different account while this
        // request was in flight — ignore a stale response.
        if (accountId !== this.accountId) return false;
        const lat = Number(data?.Latitude);
        const lon = Number(data?.Longitude);
        const hasValidCoords =
          data?.Latitude !== null &&
          data?.Latitude !== "" &&
          data?.Longitude !== null &&
          data?.Longitude !== "" &&
          Number.isFinite(lat) &&
          Number.isFinite(lon) &&
          !(lat === 0 && lon === 0);
        if (hasValidCoords) {
          this.latitude = lat;
          this.longitude = lon;
          this.updateMapLocation(true);
        }
        // The saved address now lives on this same endpoint
        // (GeoLocationAddress) — takes priority over the account's own
        // Company Address (address, from open()'s params) since it's what
        // was actually chosen/saved here last time, not just whatever is
        // on file for the account in general.
        if (data?.GeoLocationAddress) {
          this.selectedAddress = data.GeoLocationAddress;
        }
        return hasValidCoords;
      } catch (error) {
        console.error("Unable to load saved company geolocation", error);
        return false;
      }
    },

    // ---- Search: dispatchers + one implementation per provider ----------

    async searchAddress() {
      if (!this.addressQuery || this.addressQuery.trim().length < 3) return;
      this.searching = true;
      this.activeSearchProvider = this.searchProvider;
      try {
        if (this.activeSearchProvider === "tomtom") {
          await this.searchAddressTomTom();
        } else {
          await this.searchAddressGoogle();
        }
        if (!this.results.length) {
          this.$q.notify({
            type: "warning",
            message: "No matching locations found.",
          });
        }
      } catch (error) {
        console.error("Address search failed", error);
        this.$q.notify({
          type: "negative",
          message: "Address search is unavailable. Enter coordinates instead.",
        });
      } finally {
        this.searching = false;
      }
    },
    async searchAddressTomTom() {
      const response = await ttServices.services.fuzzySearch({
        key: TOMTOM_API_KEY,
        query: this.addressQuery.trim(),
        limit: 6,
      });
      // Business/POI results lead with the business name (what someone
      // searching a company actually typed), address as a caption —
      // otherwise the freeform address would show instead of the name.
      this.results = (response?.results || []).map((r) => ({
        id: r.id,
        label: r.poi?.name || r.address?.freeformAddress || "",
        caption:
          r.poi?.name && r.address?.freeformAddress
            ? r.address.freeformAddress
            : "",
        icon: r.poi ? "storefront" : "place",
        raw: r,
      }));
    },
    async searchAddressGoogle() {
      const google = await loadGoogleMaps();
      // This key only has "Places API (New)" enabled (confirmed via a
      // "PLACES_AUTOCOMPLETE: REQUEST_DENIED" error from the legacy
      // AutocompleteService this used to call) — AutocompleteSuggestion is
      // the New Places API's equivalent, loaded via importLibrary rather
      // than being on google.maps.places directly by default.
      const { AutocompleteSuggestion } = await google.maps.importLibrary(
        "places"
      );
      const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: this.addressQuery.trim(),
        });
      // markRaw() each suggestion — these SDK objects use internal getters
      // (e.g. .placePrediction.placeId) backed by private fields/WeakMaps
      // keyed on the real instance; once Vue wraps one in a reactive
      // Proxy, those getters run with the Proxy as `this` instead of the
      // original object and throw "Cannot read properties of undefined"
      // reading their internal (minified) field name.
      this.results = (suggestions || []).map((suggestion) => {
        const raw = markRaw(suggestion);
        const prediction = raw.placePrediction;
        return {
          id: prediction?.placeId,
          label: prediction?.mainText?.text || prediction?.text?.text || "",
          caption: prediction?.secondaryText?.text || "",
          icon: prediction?.types?.includes("establishment")
            ? "storefront"
            : "place",
          raw,
        };
      });
    },
    async selectResult(result) {
      this.results = [];
      try {
        if (this.activeSearchProvider === "tomtom") {
          this.selectResultTomTom(result);
        } else {
          await this.selectResultGoogle(result);
        }
        this.updateMapLocation(true);
      } catch (error) {
        console.error("Unable to resolve the selected place", error);
        this.$q.notify({
          type: "negative",
          message: "Could not load that location's coordinates.",
        });
      }
    },
    selectResultTomTom(result) {
      const r = result.raw;
      this.latitude = Number(r.position?.lat);
      this.longitude = Number(r.position?.lng);
      this.selectedAddress =
        this.composeSelectedAddress(r.poi?.name, r.address?.freeformAddress) ||
        result.label ||
        "";
    },
    async selectResultGoogle(result) {
      // .placePrediction.toPlace() gives a Place handle, then fetchFields()
      // pulls just what's needed (billed per call, so only fetched for the
      // one result actually picked, not all of them up front).
      const place = result.raw.placePrediction.toPlace();
      await place.fetchFields({
        fields: ["location", "formattedAddress", "displayName"],
      });
      const location = place.location;
      if (!location) throw new Error("No coordinates for this place");
      this.latitude = Number(location.lat().toFixed(6));
      this.longitude = Number(location.lng().toFixed(6));
      this.selectedAddress =
        this.composeSelectedAddress(place.displayName, place.formattedAddress) ||
        result.label ||
        "";
    },
    // Company/place name first, street address second — "Metal Storage
    // Systems Pvt Ltd, 409, 11th Cross, ..." — so picking a business result
    // doesn't lose the name once it lands in the Selected address field
    // (the search results list already showed name-then-address; this
    // keeps that once a result is chosen). Skips the name if the address
    // already starts with it (some providers include it there already),
    // to avoid "Acme Ltd, Acme Ltd, 12 Main St".
    composeSelectedAddress(name, address) {
      if (
        name &&
        address &&
        !address.toLowerCase().startsWith(name.toLowerCase())
      ) {
        return `${name}, ${address}`;
      }
      return address || name || "";
    },
    // Best-effort strip of tax/registration codes that end up appended to
    // some accounts' saved Company Address — e.g. "..., GST No
    // 29AADCM2307E1ZT ECC NO: AADCM2307EXM001 REG NO SSI NO: 29201102110".
    // None of that is a geocodable address; leaving it in only confuses a
    // map search. Only used for the search box (see open()) — the address
    // actually saved/displayed elsewhere is left exactly as stored.
    stripRegistrationCodes(address) {
      if (!address) return "";
      return address
        .replace(
          // The value part requires at least one digit (real codes always
          // have one) — without that, back-to-back labels with no space
          // between a bare label and the next one (e.g. "REG NO SSI NO :
          // 123") would otherwise let this greedily swallow "SSI" as if it
          // were REG's own value, corrupting the next label's own match.
          /\b(GSTIN|GST\s*No\.?|ECC\s*No\.?|REG(?:ISTRATION)?\s*No\.?|SSI\s*No\.?|PAN\s*No\.?|CIN\s*No\.?|TAN\s*No\.?|IEC\s*No\.?)\s*:?\s*(?:[A-Z0-9/-]*\d[A-Z0-9/-]*)?/gi,
          ""
        )
        .replace(/,\s*,+/g, ",") // collapse commas left doubled up
        .replace(/,\s*$/g, "") // trailing comma
        .replace(/\s{2,}/g, " ")
        .trim();
    },
    locateCoordinates() {
      if (!this.validCoordinates()) {
        this.$q.notify({
          type: "negative",
          message:
            "Enter a latitude from -90 to 90 and longitude from -180 to 180.",
        });
        return;
      }
      this.updateMapLocation(true);
      this.reverseGeocode();
    },

    // ---- Map: dispatchers + one implementation per provider -------------

    async initializeMap() {
      await this.$nextTick();
      if (this.map) {
        if (this.activeMapProvider === "tomtom") {
          this.map.resize();
        }
        // Google's Map has no resize()/invalidateSize() to call here — it
        // tracks its container size on its own.
        this.updateMapLocation(true);
        return;
      }
      this.activeMapProvider = this.mapProvider;
      try {
        if (this.activeMapProvider === "google") {
          await this.initializeGoogleMap();
        } else {
          this.initializeTomTomMap();
        }
      } catch (error) {
        console.error("Unable to initialize the map", error);
        this.$q.notify({
          type: "negative",
          message: "Could not load the map. Enter coordinates instead.",
        });
      }
    },
    initializeTomTomMap() {
      // markRaw() is required here — assigning the raw SDK instance to
      // this.map would let Vue 3 wrap it in a reactive Proxy, and this
      // SDK's map object (it's Mapbox GL JS under the hood) has internal
      // non-configurable properties that violate the Proxy invariants
      // Vue's reactivity relies on, throwing
      // "TypeError: 'get' on proxy: property '__ob__' is a read-only and
      // non-configurable data property..." the moment anything touches it.
      this.map = markRaw(
        tt.map({
          key: TOMTOM_API_KEY,
          container: this.$refs.mapContainer,
          center: [Number(this.longitude), Number(this.latitude)],
          zoom: 14,
        })
      );
      this.map.addControl(new tt.NavigationControl());
      // Added synchronously, not gated behind the map's "load" event —
      // Marker overlays are positioned by the map's coordinate transform,
      // which is ready immediately after tt.map() returns. "load" instead
      // tracks style/sprite/tile data finishing, which is unrelated and
      // can be slow (or stall) independent of whether markers can be
      // placed.
      this.addTomTomMarker();
      this.map.on("click", (event) => {
        const { lat, lng } = event.lngLat;
        this.setSelectedCoordinates(lat, lng);
      });
      window.setTimeout(() => this.map?.resize(), 0);
    },
    addTomTomMarker() {
      if (this.marker || !this.map) return;
      const markerEl = document.createElement("div");
      markerEl.className = "geo-map-marker";
      // Inline fallback styling — this element is created via the DOM API
      // (not Vue's template), so it's not guaranteed to pick up the scoped
      // :deep() CSS below in every build/render path; these inline styles
      // keep the pin visible and correctly colored either way.
      Object.assign(markerEl.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        color: "#2452c9",
        cursor: "pointer",
        zIndex: "10",
      });
      markerEl.innerHTML =
        '<span class="material-icons" style="font-size:38px;line-height:1;">location_on</span>';
      // markRaw() — see the comment on this.map above; the marker instance
      // has the same reactivity conflict.
      this.marker = markRaw(
        new tt.Marker({
          element: markerEl,
          draggable: true,
          anchor: "bottom",
        })
          .setLngLat([Number(this.longitude), Number(this.latitude)])
          .addTo(this.map)
      );
      this.marker.on("dragend", () => {
        const { lat, lng } = this.marker.getLngLat();
        this.setSelectedCoordinates(lat, lng, false);
      });
    },
    async initializeGoogleMap() {
      const google = await loadGoogleMaps();
      const { Map } = await google.maps.importLibrary("maps");
      // markRaw() — same reactivity conflict as TomTom's map (see
      // initializeTomTomMap()'s comment); Google's SDK objects have the
      // same class of internal non-configurable properties/getters.
      this.map = markRaw(
        new Map(this.$refs.mapContainer, {
          center: { lat: Number(this.latitude), lng: Number(this.longitude) },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })
      );
      this.addGoogleMarker(google);
      this.map.addListener("click", (event) => {
        this.setSelectedCoordinates(event.latLng.lat(), event.latLng.lng());
      });
    },
    addGoogleMarker(google) {
      if (this.marker || !this.map) return;
      this.marker = markRaw(
        new google.maps.Marker({
          position: { lat: Number(this.latitude), lng: Number(this.longitude) },
          map: this.map,
          draggable: true,
        })
      );
      this.marker.addListener("dragend", () => {
        const position = this.marker.getPosition();
        this.setSelectedCoordinates(position.lat(), position.lng(), false);
      });
    },
    destroyMap() {
      if (this.map && this.activeMapProvider === "tomtom") {
        this.map.remove();
      } else if (this.marker) {
        // google.maps.Map has no .remove() — Google's own guidance is to
        // just drop the reference and let the container's own teardown
        // (this dialog unmounting) reclaim it; the marker does need an
        // explicit map:null to detach it from the (about to be gone) map.
        this.marker.setMap(null);
      }
      this.map = null;
      this.marker = null;
      this.activeMapProvider = null;
    },
    setSelectedCoordinates(latitude, longitude, moveMarker = true) {
      this.latitude = Number(latitude.toFixed(6));
      this.longitude = Number(longitude.toFixed(6));
      if (moveMarker) {
        if (this.activeMapProvider === "google") {
          this.marker?.setPosition({
            lat: this.latitude,
            lng: this.longitude,
          });
        } else {
          // TomTom (like GeoJSON) orders coordinate pairs [lng, lat] — the
          // opposite of the latitude/longitude field order used everywhere
          // else in this component.
          this.marker?.setLngLat([this.longitude, this.latitude]);
        }
      }
      this.reverseGeocode();
    },
    updateMapLocation(centerMap = false) {
      // Centering the map must not depend on the marker existing yet — the
      // map can still be initializing (Google's is async — see
      // initializeGoogleMap()) when a search result is picked, and
      // bailing out entirely without the marker would silently skip the
      // re-center too.
      if (!this.map || !this.validCoordinates()) return;
      if (this.activeMapProvider === "google") {
        const point = { lat: Number(this.latitude), lng: Number(this.longitude) };
        this.marker?.setPosition(point);
        if (centerMap) {
          this.map.setCenter(point);
          if (this.map.getZoom() < 14) this.map.setZoom(14);
        }
      } else {
        const point = [Number(this.longitude), Number(this.latitude)];
        this.marker?.setLngLat(point);
        if (centerMap) {
          this.map.setCenter(point);
          if (this.map.getZoom() < 14) this.map.setZoom(14);
        }
      }
    },

    // ---- Reverse geocode: dispatcher + one implementation per provider --

    async reverseGeocode() {
      if (!this.validCoordinates() || this.reverseGeocoding) return;
      this.reverseGeocoding = true;
      // Match whichever provider the last search in this session used —
      // falls back to the current setting if no search has run yet (e.g.
      // the dialog opened straight on the Latitude & Longitude tab).
      const provider = this.activeSearchProvider || this.searchProvider;
      try {
        if (provider === "tomtom") {
          await this.reverseGeocodeTomTom();
        } else {
          await this.reverseGeocodeGoogle();
        }
      } catch (error) {
        console.error("Unable to resolve selected map location", error);
      } finally {
        this.reverseGeocoding = false;
      }
    },
    async reverseGeocodeTomTom() {
      const response = await ttServices.services.reverseGeocode({
        key: TOMTOM_API_KEY,
        position: {
          lat: Number(this.latitude),
          lng: Number(this.longitude),
        },
      });
      this.applyReverseGeocodeResult(
        response?.addresses?.[0]?.address?.freeformAddress
      );
    },
    async reverseGeocodeGoogle() {
      const google = await loadGoogleMaps();
      if (!this.geocoder) {
        this.geocoder = markRaw(new google.maps.Geocoder());
      }
      const response = await this.geocoder.geocode({
        location: {
          lat: Number(this.latitude),
          lng: Number(this.longitude),
        },
      });
      this.applyReverseGeocodeResult(response?.results?.[0]?.formatted_address);
    },
    applyReverseGeocodeResult(freeformAddress) {
      if (!freeformAddress) return;
      // Every call site is a direct user action on the map (click or drag)
      // — the user is actively choosing this exact spot, so the address
      // shown should always track wherever the pin currently sits, the
      // same way Google Maps updates its address label while you drag.
      this.selectedAddress = freeformAddress;
      this.addressQuery = freeformAddress;
    },
    validCoordinates() {
      const lat = Number(this.latitude);
      const lon = Number(this.longitude);
      return (
        Number.isFinite(lat) &&
        lat >= -90 &&
        lat <= 90 &&
        Number.isFinite(lon) &&
        lon >= -180 &&
        lon <= 180
      );
    },
    formatCoordinate(value) {
      return Number.isFinite(Number(value)) ? Number(value).toFixed(6) : "";
    },
    async saveLocation() {
      if (!this.validCoordinates()) return this.locateCoordinates();
      this.saving = true;
      const location = {
        AccountID: this.accountId,
        Address: this.selectedAddress,
        Latitude: Number(this.latitude),
        Longitude: Number(this.longitude),
      };
      // Latitude/Longitude/Address now all have their own dedicated columns
      // on Master's geolocation API — GeoLocationAddress is what
      // loadSavedLocation() reads back on reopen (see its comment there).
      const requestData = {
        AccountId: location.AccountID,
        AccountName: this.companyName,
        Latitude: String(location.Latitude),
        Longitude: String(location.Longitude),
        GeoLocationAddress: location.Address,
        GeoLocationUserId: Number(sessionStorage.getItem("APIUserID")) || 0,
        GeoLocationUserName: sessionStorage.getItem("APIEmail") || "",
        GeoLocationDateTime: new Date().toISOString(),
      };
      try {
        const { data } = await axios.put(
          `${CargoNet_API}/MasterCompany/geolocation/${this.accountId}`,
          requestData
        );
        if (data?.result === 1 || data?.result === "1") {
          throw new Error(
            data.message || "Could not save the company location."
          );
        }
        this.$emit("location-saved", location);
        this.$q.notify({
          message: "Company location saved successfully.",
          color: "positive",
          position: "center",
          timeout: 2000,
          classes: "positive-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        this.visible = false;
      } catch (error) {
        this.$q.notify({
          message:
            error.response?.data?.message ||
            error.message ||
            "Could not save the company location.",
          color: "positive",
          position: "center",
          classes: "positive-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
/*
  Header restyled to match the "Party locations" dialog
  (DeliveryGeolocationDialog.vue / .design.md) — same header treatment
  (nvocc-dialog-card + dialog-head, light icon glyph, no shadow/border),
  same token names/values. This dialog has no shipper/consignee identity, so
  only the neutral + accent tokens apply.

  Fields and buttons deliberately do NOT get custom styling — fields follow
  cn-ui-ux-design-system's references/fields.md (square outlined dense
  bg-color="blue-1", Quasar's native hover/focus/disabled states), and
  buttons follow references/buttons.md's global `.m-btn-style*` classes from
  cn-style.css (`m-btn-style-md` for the Search/Locate actions,
  `m-btn-style` for the primary Save action) — same as every other form in
  the app.

  Tabs are the one deliberate exception to that skill's default underline
  tabs (references/tabs.md) — restyled to a segmented-pill control per an
  explicit reference design supplied for this dialog (see design notes).
  Scoped to `.geo-tabs` only; every other tab set in the app should still
  follow the skill's default.

  60/30/10 usage:
   60% dominant  -> --surface / --surface-sunken (backgrounds)
   30% structural -> --ink-* / --border* (text, hairlines)
   10% accent    -> --accent (glyph, primary buttons, focus ring)
*/
.geo-dialog {
  --surface: #ffffff;
  --surface-sunken: #f7f8fb;
  --border: #e1e5ee;
  --border-strong: #ccd3e1;
  --ink-900: #161a23;
  --ink-700: #404759;
  --ink-500: #6b7385;
  --ink-400: #98a0b1;
  --accent: #2452c9;
  --accent-soft: #eef2fd;
  --accent-soft-border: #d5e0fa;
  --focus-ring: #2452c9;

  width: 980px;
  max-width: 95vw;
  max-height: 92vh;
  color: var(--ink-900);
  font-family: Poppins, sans-serif;
}

/* Header — chrome (padding/bg) comes from .nvocc-dialog-card .dialog-head
   globally; the box-shadow that rule adds is overridden off below. */
.geo-dialog .dialog-head {
  border: 0;
  box-shadow: none;
}
.geo-dialog .dialog-head .q-btn--round {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-sunken);
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.geo-dialog .dialog-head .q-btn--round:hover {
  border-color: var(--accent-soft-border);
  background: var(--accent-soft);
  color: var(--accent);
}
.geo-dialog .glyph {
  display: flex;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--accent-soft-border);
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
}
.geo-dialog .titles {
  flex: 1;
  min-width: 0;
  margin-left: 4px;
}
.geo-dialog .modal-title {
  color: var(--ink-900);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 20px;
}
.geo-dialog .modal-subtitle {
  overflow: hidden;
  margin-top: 2px;
  color: var(--ink-500);
  font-size: 12px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Body */
.geo-dialog .geo-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 18px 18px;
}

/* "Checking saved location..." spinner shown briefly while open() awaits
   loadSavedLocation() — same shape as DeliveryGeolocationDialog.vue's
   .location-loading. */
.geo-dialog .geo-summary-loading {
  display: flex;
  min-height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Read-only "already saved" summary — shown instead of the map editor when
   loadSavedLocation() finds a real saved pin; Edit location (see the
   footer actions) switches this over to the picker below. */
.geo-dialog .geo-summary-card {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-sunken);
}
.geo-dialog .geo-summary-card__status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  color: var(--ink-900);
  font-size: 13.5px;
  font-weight: 700;
}
.geo-dialog .geo-summary-card__address {
  margin-bottom: 10px;
  color: var(--ink-700);
  font-size: 13.5px;
  line-height: 1.5;
}
.geo-dialog .geo-summary-card__coords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.geo-dialog .geo-summary-card__coords .coord-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink-700);
  font-family: Consolas, Monaco, monospace;
  font-size: 11.5px;
}
.geo-dialog .geo-summary-card__coords .coord-label {
  margin-right: 2px;
  color: var(--ink-400);
  font-family: Poppins, sans-serif;
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
}

/* Search & map mode — full-detail provider cards living inside the dialog
   itself (moved here from a Company Admin settings screen). Each card
   shows its badge, name and how-it-works line directly, cost/usage detail
   in the info-icon tooltip. Wrapped in its own tinted panel + a separator
   below (references/dialogs.md's convention for distinct zones inside a
   dialog) so this reads as a "preferences" area, not just more rows in
   the same workflow as the search/map below it. No existing precedent for
   a 3-way provider picker elsewhere in the app, so this is purpose-built,
   but reuses the same tokens as the rest of this dialog. */
.geo-dialog .geo-mode-section {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-sunken);
}
.geo-dialog .geo-mode-section__label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
  color: var(--ink-500);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.geo-dialog .geo-mode-divider {
  margin: 0 0 16px;
}
.geo-dialog .geo-mode-card {
  height: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease,
    box-shadow 0.15s ease;
}
.geo-dialog .geo-mode-card:hover {
  border-color: var(--accent-soft-border);
  box-shadow: 0 1px 4px rgba(36, 82, 201, 0.1);
}
.geo-dialog .geo-mode-card--selected {
  border-color: var(--accent);
  background: var(--accent-soft);
}
.geo-dialog .geo-mode-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.geo-dialog .geo-mode-card__head-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.geo-dialog .geo-mode-card__badge {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.geo-dialog .geo-mode-card__info {
  display: flex;
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--accent-soft-border);
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  cursor: help;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.geo-dialog .geo-mode-card__info:hover {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}
.geo-dialog .geo-mode-card__name {
  margin-bottom: 4px;
  color: var(--ink-900);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
}
/* Capped to 2 lines with a real ellipsis (not just a hard clip) — the rest
   of the explanation (cost/usage) lives in the info-icon tooltip instead,
   so a card never grows taller than its siblings just because one mode
   needed a longer sentence. */
.geo-dialog .geo-mode-card__how {
  display: -webkit-box;
  overflow: hidden;
  color: var(--ink-700);
  font-size: 11.5px;
  line-height: 1.4;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Segmented tabs — explicit reference design (not the skill's default
   underline tabs, see design notes): equal-width pills inside a rounded
   sunken track, active pill lifts to a white card with a soft shadow. */
.geo-dialog .geo-tabs {
  min-height: 0;
  margin-bottom: 16px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-sunken);
}
.geo-dialog .geo-tabs :deep(.q-tabs__content) {
  gap: 4px;
}
.geo-dialog .geo-tabs :deep(.q-tab) {
  flex: 1 1 0;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 9px;
  color: var(--ink-500);
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.geo-dialog .geo-tabs :deep(.q-tab__indicator) {
  display: none;
}
.geo-dialog .geo-tabs :deep(.q-tabs__arrow) {
  display: none !important;
}
.geo-dialog .geo-tabs :deep(.q-tab--active) {
  background: var(--surface);
  color: var(--accent);
  box-shadow: 0 1px 2px rgba(23, 30, 48, 0.06);
}
.geo-dialog :deep(.geo-search-panels .q-tab-panel) {
  min-height: 0 !important;
  max-height: none !important;
  padding: 0 !important;
  overflow: visible !important;
}
.geo-dialog .geo-search-action {
  display: flex;
  align-items: flex-start;
}
.geo-dialog .geo-results {
  max-height: 176px;
  overflow: auto;
  border-color: var(--border) !important;
  border-radius: 8px;
}
.geo-dialog .geo-results :deep(.q-item) {
  min-height: 38px;
}

.geo-dialog .geo-map-wrap {
  position: relative;
  height: 320px;
  margin-top: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-sunken);
}
.geo-dialog .geo-map {
  width: 100%;
  height: 100%;
  border: 0;
  cursor: crosshair;
}
.geo-dialog .geo-map :deep(.geo-map-marker) {
  color: var(--accent);
  background: transparent;
  border: 0;
  filter: drop-shadow(0 2px 2px #fff);
}
.geo-dialog .geo-map :deep(.geo-map-marker .material-icons) {
  font-size: 38px;
}
.geo-dialog .geo-map-help {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 500;
  padding: 4px 9px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--ink-700);
  font-size: 11.5px;
  pointer-events: none;
}

.geo-dialog :deep(.q-btn:focus-visible) {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
.geo-dialog :deep(.q-btn.disabled),
.geo-dialog :deep(.q-btn[disabled]) {
  opacity: 0.55 !important;
}

@media (max-width: 700px) {
  .geo-dialog {
    width: 95vw;
    max-height: 95vh;
  }
  .geo-dialog .geo-map-wrap {
    height: 220px;
  }
}
</style>

<style>
/* Unscoped — q-tooltip's content is teleported to <body> (Quasar mounts
   it in its own overlay layer, outside .geo-dialog's DOM subtree, so it
   can escape overflow/stacking of the dialog beneath it), so the scoped
   styles above this — including CSS custom properties, which also don't
   inherit across a teleport boundary — can never reach it regardless of
   selector. Hex values below are copied from .geo-dialog's own token set
   (--ink-900/--ink-700/--accent-soft-border) rather than left as Quasar's
   default black/white tooltip, which read as a jarring, generic browser
   tooltip next to this dialog's light blue-tinted look everywhere else. */
.geo-mode-card__tooltip.q-tooltip {
  padding: 10px 12px;
  border: 1px solid #d5e0fa;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(22, 26, 35, 0.16);
  color: #404759;
  font-size: 13.5px;
  font-weight: 400;
  line-height: 1.55;
}
</style>
