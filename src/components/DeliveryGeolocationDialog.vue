<template><q-dialog v-model="visible">
    <q-card class="delivery-location-dialog nvocc-dialog-card column no-wrap">
      <q-card-section class="dialog-head row items-center no-wrap">
        <div class="glyph">
          <q-icon name="location_on" size="18px" />
        </div>
        <div class="titles">
          <div class="modal-title">Party locations</div>
          <div class="modal-subtitle">
            Add addresses for the shipper and consignee so both can be shared on
            the load.
          </div>
        </div>
        <q-btn icon="close" flat round dense v-close-popup aria-label="Close" />
      </q-card-section>

      <q-card-section class="modal-body">
        <div v-if="loading" class="location-loading">
          <q-spinner-dots color="primary" size="36px" />
          <div class="q-mt-sm text-grey-7">Loading company locations...</div>
        </div>
        <div v-else class="party-grid">
          <div
            v-for="party in parties"
            :key="party.type"
            class="party-card"
            :class="party.type"
          >
            <div class="party-head">
              <div class="role-chip" :class="party.type">
                <q-icon
                  :name="
                    party.type === 'shipper' ? 'local_shipping' : 'inventory_2'
                  "
                  size="18px"
                />
              </div>
              <div class="id-block">
                <span class="role-label">{{ party.label }}</span>
                <span class="role-name">{{ party.location.name }}</span>
              </div>
              <span
                class="status-pill"
                :class="isValidLocation(party.location) ? 'added' : 'pending'"
              >
                <q-icon
                  v-if="isValidLocation(party.location)"
                  name="check"
                  size="11px"
                />
                <span v-else class="dot" />
                {{ isValidLocation(party.location) ? "Added" : "Not added" }}
              </span>
            </div>

            <template v-if="isValidLocation(party.location)">
              <div class="card-body filled">
                <div class="addr-block">
                  <div class="addr-line">
                    {{ party.location.address || "Address not available" }}
                  </div>
                  <div class="coord-pills">
                    <span class="coord-pill">
                      <span class="coord-label">Lat</span>
                      {{ formatCoordinate(party.location.latitude) }}
                    </span>
                    <span class="coord-pill">
                      <span class="coord-label">Lng</span>
                      {{ formatCoordinate(party.location.longitude) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-foot">
                <q-btn-dropdown
                  no-caps
                  unelevated
                  icon="ios_share"
                  label="Share location"
                  class="btn btn-share share-button"
                >
                  <q-list dense class="share-location-menu">
                    <q-item
                      clickable
                      v-close-popup
                      @click="shareWhatsApp(party.location)"
                    >
                      <q-item-section avatar
                        ><q-icon name="chat" color="positive"
                      /></q-item-section>
                      <q-item-section>WhatsApp</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="shareLocation(party.location)"
                    >
                      <q-item-section avatar
                        ><q-icon name="share" color="primary"
                      /></q-item-section>
                      <q-item-section>Other apps</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="copyLocationLink(party.location)"
                    >
                      <q-item-section avatar
                        ><q-icon name="content_copy"
                      /></q-item-section>
                      <q-item-section>Copy link</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="openMaps(party.location)"
                    >
                      <q-item-section avatar
                        ><q-icon name="map" color="negative"
                      /></q-item-section>
                      <q-item-section>Open in Google Maps</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </template>
            <template v-else>
              <div class="card-body">
                <div class="pin-ring">
                  <q-icon name="place" size="24px" />
                </div>
                <div class="empty-copy-block">
                  <div class="empty-title">Location not available</div>
                  <div class="empty-copy">
                    Add an address and coordinates for this party in Master
                    Company
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="!loading" class="modal-foot row items-center">
        <div class="foot-note">
          <q-icon name="info" size="13px" />
          Locations are visible to both parties once shared
        </div>
      </q-card-section>
    </q-card>
  </q-dialog></template>

<script>
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

const emptyLocation = () => ({
  id: null,
  name: "",
  address: "",
  latitude: null,
  longitude: null,
});

export default {
  name: "DeliveryGeolocationDialog",
  data() {
    return {
      visible: false,
      loading: false,
      shipperLocation: emptyLocation(),
      consigneeLocation: emptyLocation(),
    };
  },
  computed: {
    parties() {
      return [
        { type: "shipper", label: "Shipper", location: this.shipperLocation },
        {
          type: "consignee",
          label: "Consignee",
          location: this.consigneeLocation,
        },
      ];
    },
  },
  methods: {
    async open({ shipper, consignee }) {
      this.shipperLocation = {
        ...emptyLocation(),
        id: shipper?.value,
        name: shipper?.label || "Shipper",
      };
      this.consigneeLocation = {
        ...emptyLocation(),
        id: consignee?.value,
        name: consignee?.label || "Consignee",
      };
      if (!this.shipperLocation.id && !this.consigneeLocation.id) {
        this.$q.notify({
          type: "warning",
          message: "Select a shipper or consignee first.",
        });
        return;
      }
      this.visible = true;
      await this.loadLocations();
    },
    async loadLocations() {
      this.loading = true;
      try {
        const [shipperGeo, consigneeGeo] = await Promise.all([
          this.loadCompanyGeolocation(this.shipperLocation.id),
          this.loadCompanyGeolocation(this.consigneeLocation.id),
        ]);
        this.shipperLocation = { ...this.shipperLocation, ...shipperGeo };
        this.consigneeLocation = { ...this.consigneeLocation, ...consigneeGeo };
      } finally {
        this.loading = false;
      }
    },
    // Latitude/Longitude live in Master's own geolocation columns, read
    // straight from the dedicated endpoint. GeoLocationAddress on that
    // same endpoint is deliberately NOT used here — it's specific to what
    // GeolocationSelector.vue's "Selected address" field last saved, not a
    // general-purpose address for this dialog to show. The company's
    // on-file address comes from account-details instead — the same field
    // MasterOrganization.vue's CmpAddress reads (row.Address).
    async loadCompanyGeolocation(accountId) {
      if (!accountId) return {};
      try {
        const [geoRes, detailsRes] = await Promise.all([
          axios.get(`${CargoNet_API}/MasterCompany/geolocation/${accountId}`),
          axios
            .get(`${CargoNet_API}/MasterCompany/account-details/${accountId}`)
            .catch((error) => {
              console.error("Unable to load company address", error);
              return null;
            }),
        ]);
        const latitude = Number(geoRes.data?.Latitude);
        const longitude = Number(geoRes.data?.Longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
          return {};
        return {
          latitude,
          longitude,
          address: detailsRes?.data?.Address || "",
        };
      } catch (error) {
        console.error("Unable to load company geolocation", error);
        return {};
      }
    },
    isValidLocation(location) {
      if (
        location.latitude === null ||
        location.latitude === "" ||
        location.longitude === null ||
        location.longitude === ""
      )
        return false;
      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);
      // 0,0 (Gulf of Guinea) is what an unset lat/lng comes back as from
      // the backend, not a real saved pin — never treat it as "Added".
      if (latitude === 0 && longitude === 0) return false;
      return (
        Number.isFinite(latitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        Number.isFinite(longitude) &&
        longitude >= -180 &&
        longitude <= 180
      );
    },
    formatCoordinate(value) {
      return Number(value).toFixed(6);
    },
    mapsUrl(location) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${location.latitude},${location.longitude}`
      )}`;
    },
    shareText(location) {
      return `${location.name}\n${
        location.address || ""
      }\nLatitude: ${this.formatCoordinate(
        location.latitude
      )}\nLongitude: ${this.formatCoordinate(
        location.longitude
      )}\n${this.mapsUrl(location)}`;
    },
    shareWhatsApp(location) {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(this.shareText(location))}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
    async shareLocation(location) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${location.name} location`,
            text: this.shareText(location),
          });
          return;
        } catch (error) {
          if (error.name === "AbortError") return;
        }
      }
      await this.copyLocationLink(location);
    },
    async copyLocationLink(location) {
      try {
        await navigator.clipboard.writeText(this.mapsUrl(location));
        this.$q.notify({ type: "positive", message: "Location link copied." });
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: "Could not copy the location link.",
        });
      }
    },
    openMaps(location) {
      window.open(this.mapsUrl(location), "_blank", "noopener,noreferrer");
    },
  },
};
</script>

<style>
/*
  Global (non-scoped) CSS, matching how the rest of the app's shared
  stylesheets work (nvocc-common.css, cn-style.css) — every selector below
  is namespaced under the unique .delivery-location-dialog root class
  instead of relying on Vue's scoped-style attribute selectors, so it can't
  leak into other components while still being a normal global stylesheet.

  Header chrome (padding/background/shadow, the close button's 30px round
  sizing) is NOT redeclared here — it comes from nvocc-common.css's
  .nvocc-dialog-card :is(.dialog-head, .card-head) rules via the
  `nvocc-dialog-card` class on the q-card and `dialog-head` class on the
  header q-card-section (see references/dialogs.md). Only the icon glyph and
  title/subtitle typography, which nvocc-common doesn't provide, are custom.

  60/30/10 usage:
   60% dominant  -> --surface / --surface-sunken (backgrounds)
   30% structural -> --ink-* / --border* (text, hairlines)
   10% accent    -> --accent (glyph, focus ring) + --shipper/--consignee for
                    party identity and CTA color
*/
.delivery-location-dialog {
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
  --shipper: #0f8f6f;
  --shipper-soft: #e8f6f1;
  --shipper-border: #c7e9dc;
  --consignee: #b3521c;
  --consignee-soft: #fbeee3;
  --consignee-border: #f0d3b8;
  --success: #1a8f5a;
  --focus-ring: #2452c9;

  width: 760px;
  max-width: 95vw;
  max-height: 92vh;
  color: var(--ink-900);
  font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Header — chrome (padding/bg) comes from .nvocc-dialog-card .dialog-head
   globally; the box-shadow that rule adds is overridden off below, and
   only the icon glyph + text stay custom. */
.delivery-location-dialog .dialog-head {
  border: 0;
  box-shadow: none;
}
.delivery-location-dialog .dialog-head .q-btn--round {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-sunken);
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.delivery-location-dialog .dialog-head .q-btn--round:hover {
  border-color: var(--accent-soft-border);
  background: var(--accent-soft);
  color: var(--accent);
}
.delivery-location-dialog .glyph {
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
.delivery-location-dialog .titles {
  flex: 1;
  min-width: 0;
  margin-left: 4px;
}
.delivery-location-dialog .modal-title {
  color: var(--ink-900);
  font-family: Poppins, Inter, sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 20px;
}
.delivery-location-dialog .modal-subtitle {
  margin-top: 2px;
  color: var(--ink-500);
  font-size: 12px;
  line-height: 1.4;
}

/* Body — padding comes from .nvocc-dialog-card's default
   q-card-section rule (16px 18px); only layout is custom. */
.delivery-location-dialog .modal-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
.delivery-location-dialog .location-loading {
  display: flex;
  min-height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.delivery-location-dialog .party-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Party card */
.delivery-location-dialog .party-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  transition: border-color 0.18s ease;
}
.delivery-location-dialog .party-card.shipper:has(.status-pill.added) {
  border-color: var(--shipper-border);
}
.delivery-location-dialog .party-card.consignee:has(.status-pill.added) {
  border-color: var(--consignee-border);
}

.delivery-location-dialog .party-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-sunken);
}
.delivery-location-dialog .role-chip {
  display: flex;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.delivery-location-dialog .role-chip.shipper {
  border: 1px solid var(--shipper-border);
  background: var(--shipper-soft);
  color: var(--shipper);
}
.delivery-location-dialog .role-chip.consignee {
  border: 1px solid var(--consignee-border);
  background: var(--consignee-soft);
  color: var(--consignee);
}
.delivery-location-dialog .id-block {
  min-width: 0;
  flex: 1;
}
.delivery-location-dialog .role-label {
  display: block;
  margin-bottom: 1px;
  color: var(--ink-500);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.delivery-location-dialog .role-name {
  overflow: hidden;
  color: var(--ink-900);
  font-family: Poppins, Inter, sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.delivery-location-dialog .status-pill {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 600;
  white-space: nowrap;
}
.delivery-location-dialog .status-pill.pending {
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--ink-500);
}
.delivery-location-dialog .status-pill.pending .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ink-400);
}
.delivery-location-dialog .status-pill.added {
  border: 1px solid var(--shipper-border);
  background: var(--shipper-soft);
  color: var(--success);
}

/* Card body */
.delivery-location-dialog .card-body {
  display: flex;
  min-height: 150px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 12px;
  text-align: center;
}
.delivery-location-dialog .card-body.filled {
  align-items: stretch;
  justify-content: flex-start;
  text-align: left;
}
.delivery-location-dialog .pin-ring {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed var(--border-strong);
  border-radius: 50%;
  background: var(--surface-sunken);
  color: var(--ink-400);
}
.delivery-location-dialog .empty-title {
  color: var(--ink-900);
  font-family: Poppins, Inter, sans-serif;
  font-size: 13px;
  font-weight: 700;
}
.delivery-location-dialog .empty-copy {
  max-width: 210px;
  margin-top: 2px;
  color: var(--ink-500);
  font-size: 12px;
  line-height: 1.4;
}

.delivery-location-dialog .addr-block {
  width: 100%;
}
.delivery-location-dialog .addr-line {
  color: var(--ink-900);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
}
.delivery-location-dialog .coord-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.delivery-location-dialog .coord-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface-sunken);
  color: var(--ink-700);
  font-family: Consolas, Monaco, monospace;
  font-size: 11px;
}
.delivery-location-dialog .coord-label {
  color: var(--ink-400);
  font-family: Inter, sans-serif;
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
}

/* Buttons */
.delivery-location-dialog .card-foot {
  display: flex;
  justify-content: center;
  padding: 0 12px 12px;
}
.delivery-location-dialog .btn {
  border-radius: 8px !important;
  font-size: 12.5px;
  font-weight: 600;
}
.delivery-location-dialog .btn-primary.shipper {
  background: var(--shipper) !important;
  color: #fff !important;
}
.delivery-location-dialog .btn-primary.consignee {
  background: var(--consignee) !important;
  color: #fff !important;
}
.delivery-location-dialog .share-button.btn-share {
  width: 100%;
  background: var(--accent) !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(36, 82, 201, 0.28);
  transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
}
.delivery-location-dialog .share-button.btn-share:hover {
  background: #1d44ac !important;
  box-shadow: 0 4px 10px rgba(36, 82, 201, 0.35);
}
.delivery-location-dialog .share-button.btn-share:active {
  transform: translateY(1px);
}
.delivery-location-dialog .share-button.btn-share :deep(.q-icon) {
  color: #fff !important;
}
.delivery-location-dialog .q-btn:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
.delivery-location-dialog .q-btn.disabled,
.delivery-location-dialog .q-btn[disabled] {
  opacity: 0.55 !important;
}
.share-location-menu {
  min-width: 200px;
  padding: 4px 0;
}
.share-location-menu .q-item {
  min-height: 34px;
}
.share-location-menu .q-item__section--avatar {
  min-width: 30px;
}
.share-location-menu .q-item:hover,
.share-location-menu .q-item:focus-visible {
  background: var(--accent-soft);
}

/* Footer note — padding comes from .nvocc-dialog-card's default
   q-card-section rule; only the note row is custom. */
.delivery-location-dialog .foot-note {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-400);
  font-size: 11.5px;
}

/* Responsive — 700px matches CargoNet's dominant mobile breakpoint,
   see references/responsive.md */
@media (max-width: 700px) {
  .delivery-location-dialog {
    width: 95vw;
    max-height: 95vh;
  }
  .delivery-location-dialog .modal-subtitle {
    margin-top: 4px;
    color: var(--ink-500);
    font-size: 11px;
    line-height: 1.4;
  }
  .delivery-location-dialog .party-grid {
    grid-template-columns: 1fr;
  }
}
</style>
