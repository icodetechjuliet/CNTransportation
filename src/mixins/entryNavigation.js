// Entry forms use the same navigation in the tab shell and on direct routes.
export default {
  inject: {
    openTab: { default: null },
    goBackTab: { default: null },
  },
  data() {
    return { entryPage: false };
  },
  mounted() {
    if (!this.entryPage && this.$options.entryReload) {
      this.entryRefreshListener = () => this[this.$options.entryReload]();
      window.addEventListener("entry-saved", this.entryRefreshListener);
    }
  },
  beforeUnmount() {
    if (this.entryRefreshListener) {
      window.removeEventListener("entry-saved", this.entryRefreshListener);
    }
  },
  methods: {
    backToEntryList(path, title) {
      if (this.goBackTab) this.goBackTab();
      else this.openEntryPage(path, title);
    },
    openEntryPage(path, title) {
      if (this.openTab) this.openTab(path, title);
      else this.$router.push(path);
    },
    notifyEntrySaved() {
      window.dispatchEvent(new Event("entry-saved"));
    },
  },
};
