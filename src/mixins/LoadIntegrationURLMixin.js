import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

// Shared implementation for ${CargoNet_API}/shipments/getintegrationurl/{Name}
// (shipmentsController — "shipments" is the [controller] route token, since
// the action lives on shipmentsController, not a standalone controller).
// Import this directly in Composition API (setup()) components.
export async function getIntegrationURL(name) {
  const res = await axios.get(`${CargoNet_API}/shipments/getintegrationurl/${name}`);
  return res.data?.[0]?.URL;
}

// Same function exposed as a mixin for Options API components
// (add to `mixins: [...]` and call `this.getIntegrationURL(name)`).
export const LoadIntegrationURLMixin = {
  methods: {
    getIntegrationURL,
  },
};
