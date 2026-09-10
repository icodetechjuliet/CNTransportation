<template>
  <q-header elevated>
    <q-toolbar class="top-bar" :class="{ 'ml2-scrolled': scrolled }">
      <q-btn
        flat
        dense
        round
        color="blue-8"
        text-color="white"
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-drawer')"
        class="bg-lblue menu-icon-btn"
        v-if="!$q.screen.lt.sm"
      />
      <q-list v-if="$q.screen.width <= 600">
        <q-item-label>
          <q-img
            src="~assets/cargonet-logo.png"
            class="mob-menu"
            @click="$emit('toggle-drawer')"
          >
          </q-img>
        </q-item-label>
        <q-separator></q-separator>
      </q-list>

      <!-- Breadcrumb (static presentation, driven by the active tab label) -->
      <div class="ml2-breadcrumb" v-if="!$q.screen.lt.sm && activeTabLabel">
        <q-icon name="home" size="14px" />
        <span>/</span>
        <span class="ml2-breadcrumb-current">{{ activeTabLabel }}</span>
      </div>

      <q-space />
      <h6 class="q-ma-none q-pl-xs"></h6>
      <q-space />

      <div class="branch-select-wrap" v-if="usertype === 'I'">
        <q-btn-dropdown
          class="lifting-btn branch-select-btn"
          color="blue-8"
          text-color="white"
          rounded
          :label="selectedBranch"
        >
          <q-list>
            <q-item
              v-for="item in items"
              :key="item.BranchID"
              clickable
              v-close-popup
              @click="$emit('select-branch', item)"
            >
              <q-item-section>
                <q-item-label>{{ item.BranchName }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-tooltip v-if="selectedBranch">{{ selectedBranch }}</q-tooltip>
      </div>

      <q-btn
        class="lifting-btn no-hover"
        color="blue-8"
        text-color="white"
        rounded
        :label="crmparty"
        disbled
        v-if="usertype === 'C'"
      ></q-btn>

      <q-btn
        v-if="showMetabaseLogin"
        round
        color="blue-6"
        icon="bar_chart"
        class="zoom-on-hover gt-sm q-mr-sm"
        @click="$emit('open-metabase')"
      >
        <q-tooltip>Open Metabase</q-tooltip>
      </q-btn>

      <!-- Ctrl+K: focuses the existing sidebar menu search, no new search feature -->
      <q-btn
        round
        dense
        flat
        color="blue-6"
        icon="search"
        class="ml2-chrome-btn zoom-on-hover gt-sm"
        @click="$emit('open-menu-search')"
      >
        <q-tooltip>Search menu (Ctrl+K)</q-tooltip>
      </q-btn>

      <!-- Static chrome — visual only, no backing data yet -->
      <q-btn
        round
        dense
        flat
        color="blue-6"
        icon="notifications"
        class="ml2-chrome-btn zoom-on-hover gt-sm"
      >
        <span class="ml2-chrome-dot"></span>
        <q-tooltip>Notifications (coming soon)</q-tooltip>
      </q-btn>
      <q-btn
        round
        dense
        flat
        color="blue-6"
        icon="mail"
        class="ml2-chrome-btn zoom-on-hover gt-sm"
      >
        <q-tooltip>Messages (coming soon)</q-tooltip>
      </q-btn>
      <q-btn
        round
        dense
        flat
        color="blue-6"
        icon="task_alt"
        class="ml2-chrome-btn zoom-on-hover gt-sm"
      >
        <q-tooltip>Tasks (coming soon)</q-tooltip>
      </q-btn>

      <q-fab
        v-model="fab2"
        vertical-actions-align="right"
        color="blue-6"
        text-color="white"
        round
        flat
        icon="key"
        active-icon="close"
        direction="down"
        class="ml2-chrome-btn gt-sm shortcuts-fab"
      >
        <q-fab-action class="key-fab key-fab-wide shortcut-fab-action">
          <div class="shortcut-panel">
            <div class="shortcut-panel__header">
              <span class="shortcut-panel__icon"><q-icon name="keyboard" /></span>
              <div>
                <div class="shortcut-panel__title">Keyboard shortcuts</div>
                <div class="shortcut-panel__subtitle">Jump to common actions</div>
              </div>
            </div>
            <q-list class="shortcut-panel__list">
            <q-item
              v-for="(shortcut, index) in shortcuts"
              :key="index"
              class="shortcut-panel__item"
            >
              <span class="shortcut-panel__label">{{ shortcut.label }}</span>
              <span class="shortcut-panel__keys"><kbd>Alt</kbd><span>+</span><kbd>{{ shortcut.key }}</kbd></span>
            </q-item>
            </q-list>
            <div class="shortcut-panel__note">
              <q-icon name="info" />
              <span>Close other tabs before refreshing dashboard data.</span>
            </div>
          </div>
        </q-fab-action>
      </q-fab>

      <q-btn
        round
        dense
        flat
        color="blue-6"
        :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        class="ml2-chrome-btn zoom-on-hover gt-sm"
        @click="toggleFullscreen"
      >
        <q-tooltip>{{ isFullscreen ? "Exit fullscreen" : "Fullscreen" }}</q-tooltip>
      </q-btn>

      <!-- Language switcher -->
      <LanguageSwitcher variant="ml2" />

      <!-- Layout switch -->
      <q-btn
        round
        dense
        flat
        color="deep-orange-6"
        icon="palette"
        class="ml2-chrome-btn zoom-on-hover gt-sm"
        @click="$emit('go-to-layout1')"
      >
        <q-tooltip>Switch to Layout 1</q-tooltip>
      </q-btn>

      <!-- Theme switcher (Layout 2 only) -->
      <q-btn
        round
        dense
        flat
        color="blue-6"
        icon="settings"
        class="ml2-chrome-btn zoom-on-hover gt-sm"
        @click="switcherOpen = true"
      >
        <q-tooltip>Open Theme Switcher panel</q-tooltip>
      </q-btn>
      <ml2-switcher-panel v-model="switcherOpen" />

      <q-btn
        v-if="$q.screen.lt.sm"
        flat
        round
        dense
        icon="home"
        color="white"
        class="bg-lblue q-mr-xs"
        @click="$emit('go-home')"
      >
        <q-tooltip>Home</q-tooltip>
      </q-btn>

      <q-btn round flat class="user-menu-btn" padding="none">
        <q-avatar class="user-log ml2-trigger-avatar" text-color="white">
          <span
            class="user-trigger-text"
            :class="{ 'user-trigger-icon--hidden': userMenuOpen }"
            >{{ userShort }}</span
          >
          <q-icon
            name="close"
            class="user-trigger-close-icon"
            :class="{ 'user-trigger-icon--visible': userMenuOpen }"
          />
        </q-avatar>
        <q-menu
          v-model="userMenuOpen"
          anchor="bottom right"
          self="top right"
          class="user-menu"
        >
          <div class="user-menu-header">
            <q-avatar class="user-log user-menu-avatar" text-color="white">
              {{ userShort }}
            </q-avatar>
            <div class="user-menu-identity">
              <div class="user-menu-name">{{ username }}</div>
              <div class="user-menu-role" v-if="selectedBranch">
                {{ selectedBranch }}
              </div>
            </div>
          </div>
          <q-list class="user-menu-list">
            <q-item
              clickable
              v-close-popup
              class="user-menu-item user-menu-item--logout"
              @click="$emit('logout')"
            >
              <q-item-section avatar>
                <div class="user-menu-item-icon">
                  <q-icon name="logout" />
                </div>
              </q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script>
import Ml2SwitcherPanel from "components/Ml2SwitcherPanel.vue";
import LanguageSwitcher from "components/LanguageSwitcher.vue";

export default {
  name: "Ml2Header",
  components: { Ml2SwitcherPanel, LanguageSwitcher },
  props: {
    selectedBranch: { type: String, default: "" },
    items: { type: Array, default: () => [] },
    usertype: { type: String, default: "" },
    crmparty: { type: [String, Array], default: "" },
    showMetabaseLogin: { type: Boolean, default: false },
    username: { type: String, default: "" },
    userShort: { type: String, default: "" },
    shortcuts: { type: Array, default: () => [] },
    activeTabLabel: { type: String, default: "" },
  },
  emits: [
    "toggle-drawer",
    "select-branch",
    "open-metabase",
    "open-menu-search",
    "go-to-layout1",
    "go-home",
    "logout",
  ],
  data() {
    return {
      fab1: false,
      fab2: false,
      userMenuOpen: false,
      switcherOpen: false,
      scrolled: false,
      isFullscreen: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, true);
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll, true);
    document.removeEventListener("fullscreenchange", this.onFullscreenChange);
  },
  methods: {
    onScroll() {
      const pageContainer = document.querySelector(".q-page-container");
      this.scrolled = !!(pageContainer && pageContainer.scrollTop > 4);
    },
    onFullscreenChange() {
      this.isFullscreen = !!document.fullscreenElement;
    },
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    },
  },
};
</script>

