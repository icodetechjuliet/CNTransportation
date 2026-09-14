<template><q-page class="flex flex-center mobile-page">
    <!-- <div v-if="loading">
      <span class="loader"></span>
    </div> -->
    <!-- <chatbot-feature></chatbot-feature> -->
  </q-page></template>

<script>
import { defineComponent } from "vue";
import ChatbotFeature from "/src/pages/ChatbotFeature.vue";

export default defineComponent({
  name: "IndexPage",
  // components: {
  //   ChatbotFeature,
  // },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    // this.showLoading();
    // Simulate loading delay
    setTimeout(() => {
      this.loading = false; // Set loading to false after a delay of 2 seconds
    }, 500);
  },
  methods: {
    async showLoading() {
      this.$q.loading.show({
        spinner: CustomLoader,
        spinnerSize: 140,
        backgroundColor: "black",
        message: this.loadingPercentage,
        messageColor: "white",
      });
      // hiding in 3s
      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = void 0;
      }, 2000);
    },
  },
});
</script>

<style>
.rotate {
  width: 200px;
  height: 200px;
  animation: rotation 4s infinite linear;
}
@media (max-width: 425px) {
  .rotate {
    width: 150px;
    height: 150px;
  }
  .mobile-page {
    min-height: 400px !important;
    text-align: center;
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
