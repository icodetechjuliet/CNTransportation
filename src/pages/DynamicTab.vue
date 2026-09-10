<template>
  <div class="scaled-content">
    <main :class="['app-content', { 'with-sidebar': sidebarOpen }]">
      <div>
        <template v-if="openTabs.length">
          <!-- Tab Content -->
          <div>
            <!-- Loader Overlay -->
            <div v-if="isLoading" class="loader-overlay">
              <div class="loader-content">
                <div class="spinner"></div>
                <p class="loader-text">Loading...</p>
              </div>
            </div>
            <!-- Render all tab components but only show the active one -->
            <template v-for="tab in openTabs" :key="tab.id">
              <div v-show="tab.id === activeTab" style="width: 100%">
                <component :is="tab.component" :params="tab.params || {}" />
              </div>
            </template>
          </div>
        </template>
      </div>
    </main>

    <!-- Footer Tabs Bar -->
    <q-footer
      class="modern-tabs-footer"
      v-if="openTabs.length && !$q.screen.lt.sm"
    >
      <ul>
        <li class="tabs-scroll" v-for="tab in openTabs" :key="tab.id">
          <a
            href="#"
            class="modern-tab bg-grey-white bdr-grey tab-text"
            :class="{ active: tab.id === activeTab }"
            @click.prevent="selectTab(tab.id)"
            :title="tab.tablabel"
          >
            <span class="tab-text">{{ tab.tablabel }}</span>
            <q-icon
              v-if="tab.isClosable"
              name="close"
              class="tab-close"
              size="14px"
              @click.stop.prevent="closeTab(tab.id)"
            />
          </a>
        </li>
      </ul>
    </q-footer>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import UnderConstraction from "/src/pages/UnderConstraction.vue";
import axios from "axios";
import Login_API from "/src/IPConfig/configLogin.js";
import { LoaderMixin } from "src/mixins/Loadermixin.js";

export default {
  name: "App",
  data() {
    return {
      sidebarOpen: false,
      openTabs: [],
      activeTab: null,
      tabCounters: { quotes: 0, orders: 0, invoices: 0 },
      nextTabId: 1,
      basePath: null,
      isLoading: false,
      userid: null,
      branchid: null,
      permissions: {},
      formurl: "",
      // Tracks previously visited tabs so the hardware back button (APK)
      // can return to them even on mobile, where openTab() replaces the
      // whole tab stack with a single page.
      historyStack: [],
      suppressHistoryPush: false,
    };
  },
  created() {
    this.userid = sessionStorage.getItem("APIUserID");
    this.branchid = sessionStorage.getItem("BranchID");
    this.usertype = sessionStorage.getItem("APIUserType");
  },
  mixins: [LoaderMixin],
  provide() {
    return {
      openTab: this.openTab,
      restoreAddressBar: this.restoreAddressBar,
      reloadTab: this.reloadTab,
      // Lets a page's own "Back" button pop the in-app tab history stack
      // instead of falling through to $router.back(), which can land on
      // routes (like login) that were never really "visited" as a tab -
      // see handleHardwareBack()'s comment above for the same issue.
      goBackTab: this.goBackTab,
    };
  },
  computed: {
    currentComponent() {
      const active = this.openTabs.find((t) => t.id === this.activeTab);
      if (!active) return null;
      return active.component || null;
    },
  },
  mounted() {
    // Default: open sidebar on large screens, close on small screens
    // Save the initial address bar location so we can restore it after tab operations
    try {
      this.basePath =
        window.location.pathname +
        window.location.search +
        window.location.hash;
    } catch (e) {
      this.basePath = "/";
    }
    // Load the dashboard page by default on mount
    this.openDashboard();
    window.addEventListener("app:backbutton", this.handleHardwareBack);
  },
  beforeUnmount() {
    window.removeEventListener("app:backbutton", this.handleHardwareBack);
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    onNavigate(item) {
      if (!item || !item.id) return;
      this.openTab(item);
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 992) this.sidebarOpen = false;
    },
    // Hardware back button (Android APK). Pops the in-app history stack
    // instead of falling through to the WebView's default back navigation,
    // which can land on routes (like login) that weren't really "visited".
    handleHardwareBack() {
      const activeTabObj = this.openTabs.find((t) => t.id === this.activeTab);
      const onDashboard = !activeTabObj || activeTabObj.type === "dashboard";

      if (onDashboard) {
        this.confirmExitApp();
        return;
      }
      if (!this.goBackTab()) {
        this.openDashboard();
      }
    },
    goBackTab() {
      if (!this.historyStack.length) return false;
      const prev = this.historyStack.pop();
      this.suppressHistoryPush = true;
      if (prev.dashboard) {
        this.openDashboard();
      } else {
        this.openTab(prev.path, prev.tablabel);
      }
      this.$nextTick(() => {
        this.suppressHistoryPush = false;
      });
      return true;
    },
    confirmExitApp() {
      this.$q
        .dialog({
          title: "Exit App",
          message: "Do you want to exit the application?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          if (window.navigator && navigator.app && navigator.app.exitApp) {
            navigator.app.exitApp();
          }
        });
    },
    openTab(item, tablabel) {
      const prevTab = this.openTabs.find((t) => t.id === this.activeTab);
      if (prevTab && !this.suppressHistoryPush) {
        this.historyStack.push(
          prevTab.type === "dashboard"
            ? { dashboard: true }
            : { path: "/" + prevTab.label, tablabel: prevTab.tablabel }
        );
        if (this.historyStack.length > 30) this.historyStack.shift();
      }
      this.showLoading();
      this.restoreAddressBar();
      // Enforce a global cap of 8 dynamic tabs
      if (this.openTabs.length >= 8) {
        this.$q.notify({
          // type: "warning",
          message:
            "Maximum 8 tabs can be open at once. Please close a tab before opening a new one.",
          position: "center",
          timeout: 3000,
          classes: "warning-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        return;
      }

      // Create a guaranteed-unique id for this tab (timestamp + sequence)
      const uid = this.nextTabId++;
      const id = `tab-${Date.now()}-${uid}`;
      let params = {};
      let component = item || null;
      let Prepath = "";
      // NVOCC Page Menu Changes
      const moduleName =
        typeof item === "object"
          ? this.normalizeNvoccModule(item.moduleName)
          : prevTab?.moduleName || "";
      // Support both string paths like '/quotes/...' and objects with a `path` prop
      if (item) {
        const pathStr = typeof item === "string" ? item : item.path || "";
        let [path, queryString] = pathStr.split("?");

        // Case-insensitive path resolution
        try {
          const pagesContext = require.context("src/pages", true, /\.vue$/);
          const pageKeys = pagesContext.keys();
          const requestedPathClean = (path || "")
            .toLowerCase()
            .replace(/^\//, "");

          for (const key of pageKeys) {
            // key is like "./Dashboard.vue" or "./subdir/Page.vue"
            const keyClean = key
              .toLowerCase()
              .replace(/^\.\//, "")
              .replace(/\.vue$/, "");
            if (keyClean === requestedPathClean) {
              // Found a match! Return the actual path (with leading slash, no extension)
              // key is "./Dashboard.vue" -> "/Dashboard"
              path = key.substring(1).replace(/\.vue$/, "");
              break;
            }
          }
        } catch (e) {
          console.warn("Failed to resolve case-insensitive path:", e);
        }

        Prepath = path || "";
        if (queryString) {
          new URLSearchParams(queryString).forEach((value, key) => {
            params[key] = value;
          });
        }

        // On mobile resolution: replace with single page — no tab stack
        if (this.$q.screen.lt.sm) {
          this.openTabs = [];
          this.activeTab = null;
        }

        const type = (Prepath || "").replace(/^\//, "") || "misc";
        this.tabCounters[type] = (this.tabCounters[type] || 0) + 1;
        const index = this.tabCounters[type];
        const label = (Prepath || "").replace("/", "") || `Tab ${uid}`;

        // Create unique tab label by appending counter if multiple tabs with same name exist
        const uniqueTableLabel =
          tablabel && this.openTabs.some((t) => t.tablabel === tablabel)
            ? tablabel || label
            : tablabel || label;

        const path1 = `src/pages${path}.vue`;

        component = defineAsyncComponent({
          loader: async () => {
            const mod = await import("src/pages" + `${path}` + ".vue");
            const comp = (mod && mod.default) || mod;

            // If the component incorrectly exposes `data` as an object (shared across instances),
            // replace it with a function that returns a deep clone so each tab gets an independent state.
            try {
              if (comp && comp.data && typeof comp.data === "object") {
                const orig = comp.data;
                comp.data = function () {
                  try {
                    return JSON.parse(JSON.stringify(orig));
                  } catch (e) {
                    // Fallback: shallow copy
                    return Object.assign({}, orig);
                  }
                };
              }
            } catch (e) {
              // ignore transform errors and return the original component
            }

            return comp;
          },
          errorComponent: UnderConstraction,
          delay: 0,
          timeout: 0,
        });
        this.openTabs.push({
          id,
          uid,
          type,
          label,
          tablabel: uniqueTableLabel,
          component,
          params,
          moduleName,
          isClosable: true,
        });
        this.activeTab = id;
        // NVOCC Page Menu Changes
        this.applyNvoccModuleHeader(moduleName, Prepath);
        // Restore address bar to the saved base path so the URL does not change
        this.restoreAddressBar();
        this.$nextTick(() => {
          setTimeout(() => {
            this.hideloading();
          }, 500);
        });
        return;
      } else if (!component) {
        component = PageNotFound;
      }
      // Fallback push (if item was not a path-like string)
      this.openTabs.push({
        id,
        uid,
        type: "misc",
        label,
        tablabel,
        component,
        params,
        isClosable: true,
      });
      this.activeTab = id;
      try {
        if (this.basePath != null)
          history.replaceState(null, "", this.basePath);
      } catch (e) {}
      this.$nextTick(() => {
        setTimeout(() => {
          this.hideloading();
          this.restoreAddressBar();
        }, 500);
      });
    },
    reloadTab(item, tablabel = null) {
      this.showLoading();
      this.restoreAddressBar();

      if (!item) {
        this.hideloading();
        return;
      }

      let params = {};
      let path = "";
      let component = null;

      // Support both string path and object
      const pathStr = typeof item === "string" ? item : item.path || "";
      let [resolvedPath, queryString] = pathStr.split("?");

      queryString = item.query;

      // Case-insensitive path resolution
      try {
        const pagesContext = require.context("src/pages", true, /\.vue$/);
        const pageKeys = pagesContext.keys();

        const requestedPathClean = (resolvedPath || "")
          .toLowerCase()
          .replace(/^\//, "");

        for (const key of pageKeys) {
          const keyClean = key
            .toLowerCase()
            .replace(/^\.\//, "")
            .replace(/\.vue$/, "");

          if (keyClean === requestedPathClean) {
            resolvedPath = key.substring(1).replace(/\.vue$/, "");
            break;
          }
        }
      } catch (e) {
        console.warn("Failed to resolve case-insensitive path:", e);
      }

      path = resolvedPath || "";

      // Query params
      if (queryString) {
        new URLSearchParams(queryString).forEach((value, key) => {
          params[key] = value;
        });
      }

      // Find existing tab
      const existingTabIndex = this.openTabs.findIndex(
        (t) =>
          t.label === path.replace("/", "") &&
          (!tablabel || t.tablabel === tablabel)
      );

      if (existingTabIndex === -1) {
        // If tab not found, open new tab
        this.openTab(item, tablabel);
        return;
      }

      const existingTab = this.openTabs[existingTabIndex];

      // Create fresh component instance
      component = defineAsyncComponent({
        loader: async () => {
          const mod = await import("src/pages" + `${path}` + ".vue");
          const comp = (mod && mod.default) || mod;

          try {
            if (comp && comp.data && typeof comp.data === "object") {
              const orig = comp.data;

              comp.data = function () {
                try {
                  return JSON.parse(JSON.stringify(orig));
                } catch (e) {
                  return Object.assign({}, orig);
                }
              };
            }
          } catch (e) {}

          return comp;
        },
        errorComponent: UnderConstraction,
        delay: 0,
        timeout: 0,
      });

      // Replace existing tab component to force reload

      this.openTabs.splice(existingTabIndex, 1, {
        ...existingTab,
        component,
        params: { ...params },
      });
      // Activate reloaded tab
      this.activeTab = existingTab.id;

      this.restoreAddressBar();

      this.$nextTick(() => {
        setTimeout(() => {
          this.hideloading();
        }, 500);
      });
    },
    openDashboard() {
      this.showLoading();
      // NVOCC Page Menu Changes
      this.applyNvoccModuleHeader("", "");
      // Load the dashboard page by default (non-closable).
      // An NVOCC-designated login (identified today only by "nvocc"
      // appearing in the username — the login API doesn't return a
      // module/org-type field to branch on) lands on the NVOCC Export
      // Dashboard instead of the generic operations dashboard.
      const isNvoccUser = /nvocc/i.test(
        String(sessionStorage.getItem("APIEmail") || "")
      );
      const dashboardPath =
        this.usertype === "C"
          ? "Dashboard"
          : isNvoccUser
          ? "/NVOCCDashboard"
          : "/DashboardPage";
      const uid = this.nextTabId++;
      const id = `tab-dashboard-${uid}`;
      const label = "Dashboard";
      const tablabel = "Dashboard";
      const params = {};

      if (dashboardPath === "Dashboard") {
        // ✅ Save BEFORE opening tab
        sessionStorage.setItem("currentDashboardKey", dashboardPath);

        // console.log("Saved key:", child.Link);
        // console.log("Check:", sessionStorage.getItem("currentDashboardKey"));

        this.componentOpen = true;
        this.tabcount = this.tabcount + 1;

        const label = "Dashboard";
        const newTabComponent = `MetabaseDashboard`;

        this.openTab(newTabComponent, label);
        this.filterText = "";
        return;
      }

      const component = defineAsyncComponent({
        loader: async () => {
          const mod = await import("src/pages" + dashboardPath + ".vue");
          const comp = (mod && mod.default) || mod;
          try {
            if (comp && comp.data && typeof comp.data === "object") {
              const orig = comp.data;
              comp.data = function () {
                try {
                  return JSON.parse(JSON.stringify(orig));
                } catch (e) {
                  return Object.assign({}, orig);
                }
              };
            }
          } catch (e) {}

          return comp;
        },
        errorComponent: UnderConstraction,
        delay: 0,
        timeout: 0,
      });
      this.openTabs.push({
        id,
        uid,
        type: "dashboard",
        label,
        tablabel,
        component,
        params,
        isClosable: false,
      });
      this.activeTab = id;
      this.restoreAddressBar();
      this.$nextTick(() => {
        setTimeout(() => {
          this.hideloading();
        }, 500);
      });
    },
    closeTab(id) {
      const tab = this.openTabs.find((t) => t.id === id);
      // Prevent closing non-closable tabs (e.g., dashboard)
      if (tab && !tab.isClosable) return;
      const idx = this.openTabs.findIndex((t) => t.id === id);
      if (idx !== -1) {
        this.openTabs.splice(idx, 1);
        if (this.activeTab === id) {
          this.activeTab = this.openTabs.length
            ? this.openTabs[Math.max(0, idx - 1)].id
            : null;
          // NVOCC Page Menu Changes
          const active = this.openTabs.find((t) => t.id === this.activeTab);
          this.applyNvoccModuleHeader(active?.moduleName, active?.label);
        }
        // Restore the address bar after closing a tab
        this.restoreAddressBar();
      }
    },
    selectTab(id) {
      this.showLoading();
      this.activeTab = id;
      // NVOCC Page Menu Changes
      const active = this.openTabs.find((t) => t.id === id);
      this.applyNvoccModuleHeader(active?.moduleName, active?.label);
      // Restore the address bar when switching tabs
      this.restoreAddressBar();
      // Hide loader after tab switch
      this.$nextTick(() => {
        setTimeout(() => {
          this.hideloading();
          this.restoreAddressBar();
        }, 500);
      });
    },
    // NVOCC Page Menu Changes
    normalizeNvoccModule(value) {
      const name = String(value || "").trim();
      const lower = name.toLowerCase();
      if (!lower.includes("nvocc") && !lower.includes("minimum rate")) return "";
      if (lower.includes("import")) return "NVOCC Import";
      if (lower.includes("principal")) return "NVOCC Principal Operations";
      if (lower.includes("minimum rate") || lower.includes("mrg")) {
        return "Minimum Rate Guideline";
      }
      if (lower.includes("export")) return "NVOCC Export";
      return "";
    },
    applyNvoccModuleHeader(moduleName, path = "") {
      if (typeof document === "undefined") return;

      let resolved = this.normalizeNvoccModule(moduleName);
      const routePath = String(path || "").toLowerCase();
      if (!resolved && routePath.includes("nvocc")) {
        resolved = routePath.includes("import")
          ? "NVOCC Import"
          : "NVOCC Export";
      }

      const root = document.documentElement;
      if (!resolved) {
        root.removeAttribute("data-nvocc-module");
        root.removeAttribute("data-nvocc-module-source");
        root.style.removeProperty("--nvocc-module-name");
        return;
      }

      root.setAttribute("data-nvocc-module", resolved);
      root.setAttribute("data-nvocc-module-source", "dynamic-tab");
      root.style.setProperty("--nvocc-module-name", JSON.stringify(resolved));
    },
    restoreAddressBar() {
      try {
        const target = "/indexpage";

        // If already correct, do nothing
        // if (this.$route.path === target) return;

        // Update Vue Router + Address bar safely
        this.$router.replace({ path: target });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style>
/* ── Footer tab bar ── */
.footer-tabs-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(0deg, #f0f3f8 0%, #ffffff 100%);
  border-top: 1px solid rgba(13, 110, 253, 0.12);
  box-shadow: 0 -2px 12px rgba(16, 24, 40, 0.06);
  padding: 6px 12px 6px;
  display: flex;
  align-items: center;
}

.footer-tabs {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  gap: 6px;
  width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.footer-tabs::-webkit-scrollbar {
  height: 4px;
}

.footer-tabs::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.footer-tabs::-webkit-scrollbar-thumb:hover {
  background: #888;
}

.footer-tab-item {
  flex: 0 0 auto;
}

.footer-tab-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px 8px 0 0;
  padding: 6px 12px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #495057;
  background: transparent;
  min-width: 100px;
  max-width: 200px;
  text-decoration: none;
  border: 1px solid transparent;
  border-bottom: none;
  transition: background-color 150ms ease, color 150ms ease,
    transform 120ms ease;
}

.footer-tab-link:hover {
  background-color: rgba(13, 110, 253, 0.06);
  color: #0d6efd;
  transform: translateY(-1px);
}

.footer-tab-link.active {
  background-color: #fff;
  color: #0d6efd;
  border-color: rgba(13, 110, 253, 0.15);
  border-bottom: 2px solid #0d6efd;
}

.footer-tab-label {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
}

/* Push content up so footer doesn't overlap it */
.pb-footer {
  padding-bottom: 60px;
}

/* ── Close button ── */
.btn-close-tab {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  color: #6c757d;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.9;
  transition: background-color 120ms ease, color 120ms ease,
    transform 120ms ease;
  padding: 0;
}

.btn-close-tab:hover {
  background: rgba(220, 53, 69, 0.12);
  color: #dc3545;
  transform: scale(1.1);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .footer-tab-link {
    padding: 5px 8px;
    font-size: 0.8rem;
    min-width: 80px;
  }

  .footer-tab-label {
    max-width: 90px;
  }
}
</style>
