import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import CustomLoader from "src/pages/loader.vue";
import CustomInnerLoader from "src/pages/loaderInner.vue";
export const LoaderMixin = {
  data() {
    return {};
  },
  methods: {
    showLoading() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = void 0;
      }
      this.$q.loading.show({
        spinner: CustomLoader,
        spinnerSize: 140,
        backgroundColor: "black",
        // message: this.loadingPercentage,
        messageColor: "white",
      });
      // hiding in 5s
      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = void 0;
      }, 5000);
    },
    showinnerLoading() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = void 0;
      }
      this.$q.loading.show({
        spinner: CustomInnerLoader,
        spinnerSize: 140,
        backgroundColor: "black",
        // message: this.loadingPercentage,
        messageColor: "white",
      });
      // hiding in 5s
      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = void 0;
      }, 5000);
    },
    hideloading() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = void 0;
      }
      this.$q.loading.hide();
    },
  },
};
