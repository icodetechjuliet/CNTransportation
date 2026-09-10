import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});

// Global token expiration check
router.beforeEach((to, from, next) => {
  const tokenExpiration = sessionStorage.getItem("tokenExpiration");
  if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
    // Token has expired, perform necessary actions (e.g., show an alert)
    alert("Token has expired. Please log in again.");
    // Additional actions (e.g., clear session storage, redirect to login page)
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("tokenExpiration");
    router.push({ path: "/LoginPage" });
  } else {
    next();
  }
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
