// TomTom Maps SDK for Web + Search API key, used by GeolocationSelector.vue
// for the company-location map/address search. This is a client-side map
// key (meant to ship in the browser bundle, like every TomTom JS SDK
// integration) — restrict it to this app's domain(s) in the TomTom
// developer dashboard (my.tomtom.com) rather than treating it as a secret.
export const TOMTOM_API_KEY = "c8eBGJufJ1lTcWBjtjJA7or1gOjrBPoJ";

// Google Maps JavaScript API key (Places Autocomplete + Geocoder), used
// alongside TomTom in GeolocationSelector.vue — TomTom still renders the
// map, but company/shop/business search goes through Google's Places data,
// which has much better India business coverage. Also a client-side key
// (restrict it to this app's domain(s) in Google Cloud Console, under
// "API restrictions" + "HTTP referrers", the same way TOMTOM_API_KEY above
// is meant to be domain-restricted rather than treated as a secret).
// NOTE: this was shared labeled "Demo Key" — if it's a shared/tutorial key
// rather than one generated in your own Google Cloud project with billing
// enabled, it may be rate-limited or revoked without notice. Swap in your
// own key when you have one.
export const GOOGLE_MAPS_API_KEY = "AIzaSyCa0qhGJRQN2y4wzcx7u2iW7Bnp5JVFRZA";
