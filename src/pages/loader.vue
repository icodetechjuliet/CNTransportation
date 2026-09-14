<template><div class="qn-loader">
    <div class="qn-loader__logo"></div>
    <div class="qn-loader__pct">{{ loadingPercentage }}%</div>
  </div></template>

<script>
export default {
  name: "CustomLoader",
  data() {
    return {
      loadingPercentage: 0,
      interval: null,
    };
  },
  mounted() {
    this.startLoading();
  },
  beforeUnmount() {
    if (this.interval) clearInterval(this.interval);
  },
  methods: {
    startLoading() {
      this.interval = setInterval(() => {
        if (this.loadingPercentage === 0) {
          this.loadingPercentage += 5;
        } else if (this.$q.completed === true) {
          this.loadingPercentage = 100;
        } else if (this.loadingPercentage <= 65) {
          this.loadingPercentage += 1;
        } else if (
          this.loadingPercentage >= 65 &&
          this.loadingPercentage <= 90
        ) {
          this.loadingPercentage = Math.round(this.loadingPercentage + 1);
        }
      }, 100);
    },
  },
};
</script>

<style scoped>
/* Deliberately no position/width/height here. This is only ever used as
   $q.loading's spinner, which already wraps it in Quasar's own fixed,
   edge-anchored (top/right/bottom/left: 0, not 100vw/100vh), flex-centered
   overlay (.q-loading.fullscreen.flex.flex-center > .q-loading__box). Giving
   this component its own separate fixed/100vw/100vh box on top of that was
   the previous design and needed its own viewport-size math to exactly agree
   with Quasar's for the content to land centered — small resolution
   differences in the Cordova WebView instead of a plain desktop/mobile
   browser tab kept making the logo drift. Relying only on Quasar's own
   (already fixed-position, already correct) wrapper removes that entirely
   instead of trying to keep two independent calculations in sync. */
.qn-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qn-loader__logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url(../assets/cargonet-logo.png);
  background-size: cover;
  background-repeat: no-repeat;
  animation: qn-loader-spin 1.2s linear infinite;
}

.qn-loader__pct {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #111;
}

@keyframes qn-loader-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
