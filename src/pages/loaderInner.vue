<template><div class="qn-loader">
    <div class="qn-loader__logo"></div>
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
/* See loader.vue for why there's no position/width/height here — this
   relies entirely on Quasar's own $q.loading wrapper for full-screen,
   centered positioning instead of duplicating it. */
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

@keyframes qn-loader-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
