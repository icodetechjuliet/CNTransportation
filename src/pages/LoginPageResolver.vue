<template><component :is="loginComponent" /></template>

<script setup>
// Router route.component() resolvers are only invoked once — Vue Router
// caches whatever component that resolver returns for the life of the
// app, so picking LoginPage vs LoginPageMl2 inside routes.js only worked
// on a hard refresh (which recreates the router from scratch). Logging
// out from MainLayout2 does an in-SPA `$router.replace(...)`, so the stale
// cached choice kept showing until a manual reload. This wrapper instead
// re-picks the design every time it mounts, reacting to the same
// `layoutMode` ref MainLayout1/2 already use.
import { computed } from "vue";
import { layoutMode } from "src/Utils/layoutMode.js";
import LoginPage from "pages/LoginPage.vue";
import LoginPageMl2 from "pages/LoginPageMl2.vue";

const loginComponent = computed(() =>
  layoutMode.value === "v2" ? LoginPageMl2 : LoginPage
);
</script>
