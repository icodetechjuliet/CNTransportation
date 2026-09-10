import { ref } from "vue";

// Single source of truth for which layout (MainLayout1 "v1" or MainLayout2
// "v2") is currently shown. Both layouts import this directly instead of
// emitting/listening for events, and instead of each keeping its own copy
// of the flag in localStorage.
const layoutMode = ref(
  localStorage.getItem("mainLayoutVersion") === "v2" ? "v2" : "v1"
);

function setLayoutMode(mode) {
  layoutMode.value = mode === "v2" ? "v2" : "v1";
  localStorage.setItem("mainLayoutVersion", layoutMode.value);
}

export { layoutMode, setLayoutMode };
