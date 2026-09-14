<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    show-if-above
    :breakpoint="1024"
    bordered
    :width="isCollapsed ? 68 : 300"
    class="custom-drawer"
    :class="{ 'ml2-sidebar--collapsed': isCollapsed }"
  >
    <!-- Brand lockup — lives at the top of the sidebar itself; only the
         round logo icon stays visible once collapsed to the icon rail. -->
    <div class="ml2-sidebar-brand" @click="$emit('toggle-drawer')">
      <span class="ml2-sidebar-brand__logo">
        <img src="~assets/logo-round.png" alt="CargoNet" />
      </span>
      <div class="ml2-sidebar-brand__text" v-if="!isCollapsed">
        <span class="ml2-sidebar-brand__name">CargoNet</span>
        <span class="ml2-sidebar-brand__tagline"
          >Web Centric Logistics Software</span
        >
      </div>
    </div>

    <!-- Close button for mobile only -->
    <div v-if="$q.screen.width <= 1024">
      <q-btn
        flat
        dense
        round
        icon="bi-x"
        color="blue-8"
        @click="$emit('toggle-drawer')"
        class="full-width menu-close-btn"
      />
    </div>

    <!-- Show a centered spinner if parent menu is still loading -->
    <div
      v-if="(!parentMenu || parentMenu.length === 0) && loading"
      class="drawer-loading q-pa-md"
    >
      <q-spinner-dots color="primary" size="32" />
    </div>

    <div v-if="!isCollapsed" class="search-filter-wrapper q-px-md q-pt-md">
      <div class="search-box-container bg-blue-1">
        <input
          ref="searchInput"
          :value="filterText"
          @input="onFilterInput($event.target.value)"
          placeholder="Search"
          class="search-box-input"
          accesskey="m"
        />

        <q-btn
          v-if="filterText.length"
          flat
          dense
          round
          icon="bi-x"
          size="xs"
          class="search-box-clear-btn"
          @click="$emit('clear-search')"
        >
          <q-tooltip>Clear</q-tooltip>
        </q-btn>

        <q-btn
          flat
          dense
          round
          icon="bi-search"
          :loading="searching"
          class="search-box-icon-btn"
          @click="$emit('filter')"
        >
          <template v-slot:loading>
            <q-spinner color="blue" size="xs" />
          </template>
          <q-tooltip>Search</q-tooltip>
        </q-btn>
      </div>

      <div
        v-if="filteredMenu.length && filterText.length"
        class="dropdown-menu"
      >
        <div
          v-for="child in filteredMenu"
          :key="childKey(child)"
          class="menu-link-search"
          style="padding: 16px 16px"
        >
          <router-link
            :to="child.Link"
            class="menu-link-search"
            @click="onChildClick(child)"
          >
            {{ child.Modulecode }} - {{ child.MenuDesc }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Favorites / Recently opened — real, localStorage-backed lists.
         The whole card only appears once it has at least one item —
         nothing shows before that. -->
    <div
      v-if="!isCollapsed && favorites.length"
      class="ml2-sidebar-card ml2-sidebar-card--favorites"
    >
      <div
        class="ml2-sidebar-card__header"
        @click="favoritesExpanded = !favoritesExpanded"
      >
        <span class="ml2-sidebar-card__icon">
          <q-icon name="bi-star-fill" size="14px" />
        </span>
        <span class="ml2-sidebar-card__title">Favorites</span>
        <span class="ml2-sidebar-card__count">{{ favorites.length }}</span>
        <q-icon
          name="bi-chevron-up"
          class="ml2-sidebar-card__chevron"
          :class="{ 'ml2-sidebar-card__chevron--closed': !favoritesExpanded }"
        />
      </div>
      <div v-show="favoritesExpanded" class="ml2-sidebar-card__body">
        <div
          v-for="(item, index) in visibleFavorites"
          :key="'fav-' + item.id"
          class="ml2-sidebar-row"
        >
          <span class="ml2-sidebar-row-icon" :style="rowAccentStyle(index)">
            <q-icon name="bi-bookmark-fill" size="14px" />
          </span>
          <a class="ml2-sidebar-row-text" @click="$emit('link-click', item)">
            {{ item.MenuDesc }}
          </a>
          <q-icon
            name="bi-star-fill"
            class="ml2-sidebar-star ml2-sidebar-star--active"
            @click.stop="toggleFavorite(item)"
          >
            <q-tooltip>Remove from favorites</q-tooltip>
          </q-icon>
        </div>
        <a
          v-if="favorites.length > 5"
          class="ml2-sidebar-card__footer"
          @click="showAllFavorites = !showAllFavorites"
        >
          {{
            showAllFavorites
              ? "Show less"
              : `View all favorites (${favorites.length})`
          }}
          <q-icon name="bi-chevron-right" size="14px" />
        </a>
      </div>
    </div>

    <div
      v-if="!isCollapsed && recents.length"
      class="ml2-sidebar-card ml2-sidebar-card--recents"
    >
      <div
        class="ml2-sidebar-card__header"
        @click="recentsExpanded = !recentsExpanded"
      >
        <span class="ml2-sidebar-card__icon">
          <q-icon name="bi-clock-history" size="14px" />
        </span>
        <span class="ml2-sidebar-card__title">Recently Opened</span>
        <span class="ml2-sidebar-card__count">{{ recents.length }}</span>
        <q-icon
          name="bi-chevron-up"
          class="ml2-sidebar-card__chevron"
          :class="{ 'ml2-sidebar-card__chevron--closed': !recentsExpanded }"
        />
      </div>
      <div v-show="recentsExpanded" class="ml2-sidebar-card__body">
        <div
          v-for="(item, index) in visibleRecents"
          :key="'recent-' + item.id"
          class="ml2-sidebar-row"
        >
          <span class="ml2-sidebar-row-icon" :style="rowAccentStyle(index)">
            <q-icon name="bi-clock" size="14px" />
          </span>
          <a class="ml2-sidebar-row-text" @click="$emit('link-click', item)">
            {{ item.MenuDesc }}
          </a>
          <span class="ml2-sidebar-row-time">{{ timeAgo(item.openedAt) }}</span>
        </div>
        <a
          v-if="recents.length > 5"
          class="ml2-sidebar-card__footer"
          @click="showAllRecents = !showAllRecents"
        >
          {{
            showAllRecents
              ? "Show less"
              : `View all history (${recents.length})`
          }}
          <q-icon name="bi-chevron-right" size="14px" />
        </a>
      </div>
    </div>

    <div>
      <div class="q-py-sm q-px-md" style="position: relative">
        <div
          v-if="filterText.length && displayParentMenu.length === 0"
          class="ml2-nav-no-results"
        >
          No menu items match "{{ filterText }}"
        </div>
        <div class="ml2-nav">
          <div
            v-for="parent in displayParentMenu"
            :key="parent.ShortCode"
            class="ml2-nav-item"
            :class="{ 'ml2-nav-item--active': parent.showDropdown }"
          >
            <div class="ml2-nav-header" @click="onHeaderClick(parent)">
              <q-tooltip
                v-if="isCollapsed"
                anchor="center right"
                self="center left"
                :offset="[10, 0]"
                >{{ parent.MenuName }}</q-tooltip
              >
              <span class="ml2-nav-icon">
                <span
                  class="ml2-module-badge"
                  :style="moduleIconStyle(parent.ShortCode)"
                >
                  <q-icon :name="moduleIcon(parent.ShortCode)" size="20px" />
                </span>
              </span>
              <span class="ml2-nav-label"
                >{{ parent.MenuName }}
                <q-spinner-dots
                  size="18"
                  v-if="parent.loading"
                  class="q-ml-sm"
                  color="primary"
              /></span>
              <q-icon
                name="bi-chevron-down"
                class="ml2-nav-chevron"
                :class="{ 'ml2-nav-chevron--open': parent.showDropdown }"
              />
            </div>

            <div v-show="parent.showDropdown" class="ml2-nav-children">
              <div v-if="parent.ShortCode === 'DMS'" class="ml2-nav-child">
                <router-link
                  to="/DMSMenu"
                  class="ml2-nav-child-link tooltip-wrapper"
                  active-class=""
                  exact-active-class=""
                  :class="{ 'ml2-nav-child-link--active': isChildRouteActive({ Link: '/DMSMenu' }) }"
                  @click.prevent="onChildClick({ Link: '/DMSMenu', MenuDesc: 'Menu Directory', Modulecode: 'DMS' }, parent.MenuName)"
                >
                  DMS Menu Directory
                  <q-tooltip class="custom-tooltip">DMS Menu Directory</q-tooltip>
                </router-link>
              </div>
              <div
                class="ml2-nav-child"
                :class="{
                  'ml2-nav-child--heading': child.MenuDesc === 'Report',
                }"
                v-for="child in parent.children"
                :key="childKey(child)"
              >
                <!-- "Report" is a group heading for the SL Report* items
                     below it, not a real menu entry — render it as a
                     plain, non-clickable, highlighted label instead of a
                     link. -->
                <template v-if="child.MenuDesc === 'Report'">
                  <span class="ml2-nav-child-heading">Reports</span>
                </template>

                <!-- NVOCC Page Menu Changes -->
                <!-- Child Menu Item -->
                <template
                  v-else-if="
                    child.Link &&
                    !child.Link.startsWith('/') &&
                    !child.Link.startsWith('http') &&
                    !child.Link.startsWith('#')
                  "
                >
                  <a
                    class="ml2-nav-child-link tooltip-wrapper"
                    @click="onChildClick(child, parent.MenuName)"
                  >
                    {{ truncateText(child.MenuDesc, 20) }}
                    <q-tooltip class="custom-tooltip">
                      {{ child.MenuDesc }}
                    </q-tooltip>
                  </a>
                </template>

                <!-- External http link -->
                <template
                  v-else-if="child.Link && child.Link.startsWith('http')"
                >
                  <a
                    class="ml2-nav-child-link tooltip-wrapper"
                    @click="onChildClick(child, parent.MenuName)"
                  >
                    {{ truncateText(child.MenuDesc, 20) }}
                    <q-tooltip class="custom-tooltip">
                      {{ child.MenuDesc }}
                    </q-tooltip>
                  </a>
                </template>
                <template v-else>
                  <router-link
                    :to="child.Link"
                    class="ml2-nav-child-link tooltip-wrapper"
                    active-class=""
                    exact-active-class=""
                    :class="{
                      'ml2-nav-child-link--active': isChildRouteActive(child),
                    }"
                    @click="onChildClick(child, parent.MenuName)"
                  >
                    {{ truncateText(child.MenuDesc, 20) }}
                    <q-tooltip class="custom-tooltip">{{
                      child.MenuDesc
                    }}</q-tooltip>
                  </router-link>
                </template>
                <q-icon
                  v-if="child.MenuDesc !== 'Report'"
                  :name="isFavorite(child) ? 'bi-star-fill' : 'bi-star'"
                  class="ml2-nav-star"
                  :class="{ 'ml2-nav-star--active': isFavorite(child) }"
                  @click.stop="toggleFavorite(child)"
                >
                  <q-tooltip>{{
                    isFavorite(child)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }}</q-tooltip>
                </q-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-dialog
        :model-value="showDialog"
        @update:model-value="!$event && $emit('close-dialog')"
        fullscreen
        persistent
      >
        <q-card class="q-card_fullwidth">
          <q-card-actions align="right">
            <q-btn
              color="primary"
              label="Close"
              @click="$emit('close-dialog')"
            />
          </q-card-actions>
          <q-card-section class="iframe-container">
            <iframe :src="externalUrl" class="fullscreen-iframe"></iframe>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-drawer>
</template>

<script>
// Bootstrap Icons replacing the old per-module PNG assets — free (MIT, no
// attribution required), already bundled locally via @quasar/extras
// (enabled as "bootstrap-icons" in quasar.config.js) — no CDN dependency.
// Each is paired with a color from the ml2 palette so every module reads
// as visually distinct — same idea as the Favorites/Recently Opened badges.
// Sea/Air modules specifically use the default Material Icons set instead
// (plain ligature names, no prefix — already enabled as "material-icons"
// in quasar.config.js) per request.
const MODULE_ICONS = {
  Ld: {
    icon: "bi-person-plus",
    color: "var(--ml2-accent)",
    bg: "var(--ml2-accent-soft)",
  },
  Qt: {
    icon: "bi-receipt",
    color: "var(--ml2-teal)",
    bg: "rgba(23, 195, 178, 0.16)",
  },
  NQT: {
    icon: "bi-people",
    color: "var(--ml2-amber)",
    bg: "rgba(255, 182, 72, 0.16)",
  },
  Gcf: {
    icon: "bi-door-open",
    color: "var(--ml2-coral)",
    bg: "rgba(255, 107, 107, 0.16)",
  },
  Hlp: {
    icon: "bi-question-circle",
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.16)",
  },
  Ae: {
    icon: "flight",
    color: "var(--ml2-accent)",
    bg: "var(--ml2-accent-soft)",
  },
  Ai: {
    icon: "flight",
    color: "var(--ml2-teal)",
    bg: "rgba(23, 195, 178, 0.16)",
  },
  Se: {
    icon: "directions_boat",
    color: "var(--ml2-amber)",
    bg: "rgba(255, 182, 72, 0.16)",
  },
  Si: {
    icon: "directions_boat_filled",
    color: "var(--ml2-coral)",
    bg: "rgba(255, 107, 107, 0.16)",
  },
  Eca: { icon: "flight", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.16)" },
  Ecs: {
    icon: "directions_boat",
    color: "var(--ml2-accent)",
    bg: "var(--ml2-accent-soft)",
  },
  Ica: {
    icon: "flight",
    color: "var(--ml2-teal)",
    bg: "rgba(23, 195, 178, 0.16)",
  },
  Ics: {
    icon: "directions_boat_filled",
    color: "var(--ml2-amber)",
    bg: "rgba(255, 182, 72, 0.16)",
  },
  Db: {
    icon: "bi-speedometer2",
    color: "var(--ml2-coral)",
    bg: "rgba(255, 107, 107, 0.16)",
  },
  DL: {
    icon: "bi-clock-history",
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.16)",
  },
  Ma: {
    icon: "bi-sliders",
    color: "var(--ml2-accent)",
    bg: "var(--ml2-accent-soft)",
  },
  Mt: {
    icon: "bi-wrench",
    color: "var(--ml2-teal)",
    bg: "rgba(23, 195, 178, 0.16)",
  },
  Fn: {
    icon: "bi-cash-stack",
    color: "var(--ml2-amber)",
    bg: "rgba(255, 182, 72, 0.16)",
  },
  OP: {
    icon: "bi-gear",
    color: "var(--ml2-coral)",
    bg: "rgba(255, 107, 107, 0.16)",
  },
  AI: { icon: "bi-robot", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.16)" },
  Rt: {
    icon: "bi-signpost-2",
    color: "var(--ml2-accent)",
    bg: "var(--ml2-accent-soft)",
  },
  Wh: {
    icon: "bi-building",
    color: "var(--ml2-teal)",
    bg: "rgba(23, 195, 178, 0.16)",
  },
  DMS: {
    icon: "bi-folder2-open",
    color: "var(--ml2-amber)",
    bg: "rgba(255, 182, 72, 0.16)",
  },
  MMT: {
    icon: "bi-globe",
    color: "var(--ml2-coral)",
    bg: "rgba(255, 107, 107, 0.16)",
  },
  Sp: { icon: "bi-star", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.16)" },
  Cp: {
    icon: "bi-box-seam",
    color: "var(--ml2-accent)",
    bg: "var(--ml2-accent-soft)",
  },
};

export default {
  name: "Ml2Sidebar",
  props: {
    modelValue: { type: Boolean, default: false },
    parentMenu: { type: Array, default: () => [] },
    filteredMenu: { type: Array, default: () => [] },
    filterText: { type: String, default: "" },
    loading: { type: Boolean, default: false },
    searching: { type: Boolean, default: false },
    showDialog: { type: Boolean, default: false },
    externalUrl: { type: String, default: "" },
    collapsed: { type: Boolean, default: false },
  },
  emits: [
    "update:modelValue",
    "toggle-drawer",
    "toggle-collapse",
    "toggle-dropdown",
    "link-click",
    "filter",
    "clear-search",
    "close-dialog",
    "update:filterText",
  ],
  data() {
    return {
      favorites: this.loadList("ml2_favorites"),
      recents: this.loadList("ml2_recents"),
      favoritesExpanded: true,
      recentsExpanded: true,
      showAllFavorites: false,
      showAllRecents: false,
      rowAccents: [
        { color: "var(--ml2-accent)", bg: "var(--ml2-accent-soft)" },
        { color: "var(--ml2-teal)", bg: "rgba(23, 195, 178, 0.16)" },
        { color: "var(--ml2-amber)", bg: "rgba(255, 182, 72, 0.16)" },
        { color: "var(--ml2-coral)", bg: "rgba(255, 107, 107, 0.16)" },
      ],
    };
  },
  computed: {
    // Collapsing to an icon-only rail only makes sense on desktop — the
    // drawer is an overlay on mobile/tablet, so always show it in full there
    // regardless of the persisted collapsed preference.
    isCollapsed() {
      return this.collapsed && this.$q.screen.width > 1024;
    },
    visibleFavorites() {
      return this.showAllFavorites
        ? this.favorites
        : this.favorites.slice(0, 5);
    },
    visibleRecents() {
      return this.showAllRecents ? this.recents : this.recents.slice(0, 5);
    },
    // Client-side text search across the already-loaded menu tree (parent
    // names + their prefetched children) — doesn't depend on the separate
    // server-side filtermenus() call, so it works even when that endpoint
    // returns nothing for the current branch/user.
    displayParentMenu() {
      if (!this.filterText) return this.parentMenu;
      const q = this.filterText.toLowerCase();
      return this.parentMenu
        .map((parent) => {
          const nameMatch =
            parent.MenuName && parent.MenuName.toLowerCase().includes(q);
          const matchingChildren = (parent.children || []).filter(
            (child) =>
              child.MenuDesc && child.MenuDesc.toLowerCase().includes(q)
          );
          if (!nameMatch && matchingChildren.length === 0) return null;
          return {
            ...parent,
            showDropdown: true,
            children: nameMatch ? parent.children : matchingChildren,
          };
        })
        .filter(Boolean);
    },
  },
  created() {
    // One-time migration: favorites/recents saved before the childKey fix
    // all have a missing/undefined "id" (JSON.stringify drops undefined
    // properties), which used to make every menu item register as
    // favorited/opened together. Backfill a real id from the fields that
    // were already being stored, so old picks aren't silently dropped.
    this.favorites = this.migrateList(this.favorites, "ml2_favorites");
    this.recents = this.migrateList(this.recents, "ml2_recents");
  },
  methods: {
    migrateList(list, storageKey) {
      let changed = false;
      const migrated = list.map((item) => {
        if (item.id) return item;
        changed = true;
        return { ...item, id: this.childKey(item) };
      });
      if (changed) this.saveList(storageKey, migrated);
      return migrated;
    },
    onHeaderClick(parent) {
      // While collapsed, a click expands the rail back to full instead of
      // trying to open a submenu with nowhere to render it.
      if (this.isCollapsed) {
        this.$emit("toggle-collapse");
        return;
      }
      this.$emit("toggle-dropdown", parent);
    },
    truncateText(text, length) {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
    onFilterInput(value) {
      this.$emit("update:filterText", value);
      this.$emit("filter");
    },
    moduleIcon(shortCode) {
      return (MODULE_ICONS[shortCode] || { icon: "bi-grid" }).icon;
    },
    moduleIconStyle(shortCode) {
      const entry = MODULE_ICONS[shortCode] || {
        color: "var(--ml2-text-dim)",
        bg: "var(--ml2-surface-alt)",
      };
      return { color: entry.color, backgroundColor: entry.bg };
    },
    loadList(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },
    saveList(key, list) {
      try {
        localStorage.setItem(key, JSON.stringify(list));
      } catch (e) {
        // ignore storage errors (e.g. private browsing quota)
      }
    },
    // The menu API doesn't return a unique "id" field on child items, so
    // every child.id was undefined — isFavorite/toggleFavorite/onChildClick
    // all compared `undefined === undefined`, which matched EVERY item at
    // once as soon as one was favorited/opened. Build a stable key instead
    // from fields that are actually unique per menu entry.
    childKey(child) {
      if (!child) return "";
      return `${child.Modulecode || ""}-${child.Link || child.MenuDesc || ""}`;
    },
    isFavorite(child) {
      const key = this.childKey(child);
      return this.favorites.some((f) => f.id === key);
    },
    // Vue Router's automatic router-link-active/exact-active classes only
    // compare the resolved path + params, not the query string. Several
    // menu children here route to the SAME path with only a different
    // query (e.g. a shared form component keyed by ?FormID=/?type=), so the
    // built-in class was lighting up every one of them at once whenever any
    // one was the active route. Compare the full path (including query)
    // instead, so only the one true match gets highlighted.
    isChildRouteActive(child) {
      if (!child.Link) return false;
      const resolved = this.$router.resolve(child.Link);
      return resolved.fullPath === this.$route.fullPath;
    },
    toggleFavorite(child) {
      const key = this.childKey(child);
      const idx = this.favorites.findIndex((f) => f.id === key);
      if (idx !== -1) {
        this.favorites.splice(idx, 1);
      } else {
        this.favorites.unshift({
          id: key,
          MenuDesc: child.MenuDesc,
          Modulecode: child.Modulecode,
          // NVOCC Page Menu Changes
          ParentMenuName: child.ParentMenuName,
          Link: child.Link,
        });
      }
      this.saveList("ml2_favorites", this.favorites);
    },
    // NVOCC Page Menu Changes
    onChildClick(child, parentMenuName = "") {
      const contextualChild = {
        ...child,
        ParentMenuName: parentMenuName || child.ParentMenuName,
      };
      const key = this.childKey(child);
      const idx = this.recents.findIndex((r) => r.id === key);
      if (idx !== -1) this.recents.splice(idx, 1);
      this.recents.unshift({
        id: key,
        MenuDesc: child.MenuDesc,
        Modulecode: child.Modulecode,
        // NVOCC Page Menu Changes
        ParentMenuName: child.ParentMenuName,
        Link: child.Link,
        openedAt: Date.now(),
      });
      if (this.recents.length > 20) this.recents.length = 20;
      this.saveList("ml2_recents", this.recents);
      this.$emit("link-click", contextualChild);
    },
    rowAccentStyle(index) {
      const accent = this.rowAccents[index % this.rowAccents.length];
      return { color: accent.color, backgroundColor: accent.bg };
    },
    timeAgo(timestamp) {
      if (!timestamp) return "";
      const diffMs = Date.now() - timestamp;
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "Just now";
      if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;
      const opened = new Date(timestamp);
      const now = new Date();
      const isSameDay =
        opened.getDate() === now.getDate() &&
        opened.getMonth() === now.getMonth() &&
        opened.getFullYear() === now.getFullYear();
      if (isSameDay) {
        return `Today, ${opened.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}`;
      }
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday =
        opened.getDate() === yesterday.getDate() &&
        opened.getMonth() === yesterday.getMonth() &&
        opened.getFullYear() === yesterday.getFullYear();
      if (isYesterday) return "Yesterday";
      const diffDays = Math.floor(diffMs / 86400000);
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    },
    focusSearch() {
      this.$refs.searchInput?.focus();
    },
  },
};
</script>

<style scoped>
.ml2-sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  cursor: pointer;
}
.ml2-sidebar-brand__logo {
  display: inline-flex;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}
/* Plain <img>, deliberately not reusing .fixed-icon/.shortcode-bar — those
   carry legacy cn-style.css sizing rules that fight anything not built for
   the original wide expanded row (see the header logo's earlier history). */
.ml2-sidebar-brand__logo img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  animation: ml2SidebarLogoSpin 3.5s linear infinite;
}
@keyframes ml2SidebarLogoSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.ml2-sidebar-brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  white-space: nowrap;
  gap: 5px;
  min-width: 0;
}
.ml2-sidebar-brand__name {
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.01em;
}
.ml2-sidebar-brand__tagline {
  font-size: 8px;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.08em;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
