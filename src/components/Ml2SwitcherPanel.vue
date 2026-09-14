<template><div v-if="modelValue" class="ml2-switcher-backdrop" @click.self="close">
    <div class="ml2-switcher-panel">
      <div class="ml2-switcher-head">
        <span class="ml2-switcher-title">Switcher</span>
        <button class="ml2-switcher-close" @click="close">✕</button>
      </div>

      <div class="ml2-switcher-tabs">
        <button
          class="ml2-switcher-tab"
          :class="{ active: tab === 'colors' }"
          @click="tab = 'colors'"
        >
          Theme Colors
        </button>
        <button
          class="ml2-switcher-tab"
          :class="{ active: tab === 'styles' }"
          @click="tab = 'styles'"
        >
          Theme Styles
        </button>
      </div>

      <div class="ml2-switcher-body">
        <template v-if="tab === 'colors'">
          <div class="ml2-section-label">Background</div>
          <div class="ml2-swatch-row">
            <button
              v-for="c in backgrounds"
              :key="'bg-' + c.name"
              class="ml2-swatch"
              :class="{ active: bgColor === c.name }"
              :style="{ backgroundColor: c.color }"
              :title="c.label"
              @click="selectBgColor(c.name)"
            >
              <q-icon v-if="bgColor === c.name" name="check" size="14px" />
            </button>
          </div>

          <div class="ml2-section-label">Menu Colors</div>
          <div class="ml2-swatch-row">
            <button
              v-for="c in dynamicTints"
              :key="'menu-' + c.name"
              class="ml2-swatch"
              :class="{ active: menuColor === c.name }"
              :style="{ background: c.color }"
              :title="c.label"
              @click="selectMenuColor(c.name)"
            >
              <q-icon v-if="menuColor === c.name" name="check" size="14px" />
            </button>
          </div>
          <div class="ml2-swatch-note">
            Default matches whichever Background is picked above. Accent /
            Accent Gradient follow the Theme Primary color picked below.
          </div>

          <div class="ml2-section-label">Header Colors</div>
          <div class="ml2-swatch-row">
            <button
              v-for="c in dynamicTints"
              :key="'header-' + c.name"
              class="ml2-swatch"
              :class="{ active: headerColor === c.name }"
              :style="{ background: c.color }"
              :title="c.label"
              @click="selectHeaderColor(c.name)"
            >
              <q-icon v-if="headerColor === c.name" name="check" size="14px" />
            </button>
          </div>
          <div class="ml2-swatch-note">
            Default matches whichever Background is picked above. Accent /
            Accent Gradient follow the Theme Primary color picker below.
          </div>

          <div class="ml2-section-label">Theme Primary</div>
          <div class="ml2-swatch-row">
            <button
              v-for="c in accentOptions"
              :key="'accent-' + c.name"
              class="ml2-swatch"
              :class="{ active: accent === c.name }"
              :style="{ backgroundColor: c.color }"
              :title="c.label"
              @click="selectAccent(c.name)"
            >
              <q-icon v-if="accent === c.name" name="check" size="14px" />
            </button>
          </div>
          <div class="ml2-swatch-note">
            Default follows whichever Background is picked above.
          </div>
        </template>

        <template v-else>
          <div class="ml2-section-label">Color Mode:</div>
          <div class="ml2-radio-row">
            <label>
              <input
                type="radio"
                value="dark"
                v-model="colorMode"
                @change="apply"
              />
              Dark
            </label>
            <label>
              <input
                type="radio"
                value="light"
                v-model="colorMode"
                @change="apply"
              />
              Light
            </label>
            <label>
              <input
                type="radio"
                value="auto"
                v-model="colorMode"
                @change="apply"
              />
              Auto
            </label>
          </div>

          <div class="ml2-section-label">Layout Width:</div>
          <div class="ml2-radio-row">
            <label>
              <input
                type="radio"
                value="full"
                v-model="layoutWidth"
                @change="apply"
              />
              Full Width
            </label>
            <label>
              <input
                type="radio"
                value="boxed"
                v-model="layoutWidth"
                @change="apply"
              />
              Boxed
            </label>
          </div>
        </template>
      </div>

      <div class="ml2-switcher-footer">
        <button class="ml2-reset-btn" @click="reset">Reset</button>
      </div>
    </div>
  </div></template>

<script>
const STORAGE_PREFIX = "ml2Theme_";

// First/default entry's color is overridden per-Background by
// accentOptions below (via ACCENT_BY_BG) — the static "#3b82f6" here is
// only the pre-mount placeholder before that computed runs.
const ACCENTS = [
  { name: "slate", label: "Default", color: "#3b82f6" },
  { name: "violet", label: "Indigo", color: "#6c63ff" },
  { name: "emerald", label: "Teal", color: "#17c3b2" },
  { name: "amber", label: "Amber", color: "#ffb648" },
  { name: "rose", label: "Coral", color: "#ff6b6b" },
  { name: "cyan", label: "Cyan", color: "#06b6d4" },
];

// Mirrors cn-theme-ml2.css's [data-bg-color] --ml2-accent-default values,
// so Theme Primary's "Default" swatch preview shows the exact hue that
// will actually be applied for the currently selected Background (it
// renders via var(--ml2-accent-default) at runtime).
const ACCENT_BY_BG = {
  slate: "#3b82f6",
  indigo: "#6c63ff",
  emerald: "#17c3b2",
  rose: "#ff6b6b",
  black: "#06b6d4",
};

/* These hex values are swatch-preview only (cosmetic) — the actual applied
   background stays the subtle dark tone defined in cn-theme-ml2.css's
   [data-bg-color] variants, which are all near-black by design (it's a
   dark theme), so at true color they'd read as indistinguishable dots;
   these previews are brightened so each option is visibly distinct while
   picking it. Same 5 names/order as Menu Colors below, so the two rows
   read as parallel controls instead of two unrelated palettes. */
const BACKGROUNDS = [
  { name: "slate", label: "Slate", color: "#2b3a55" },
  { name: "indigo", label: "Indigo", color: "#4b3fa8" },
  { name: "emerald", label: "Emerald", color: "#159a80" },
  { name: "rose", label: "Rose", color: "#c23a5e" },
  { name: "black", label: "Black", color: "#111114" },
];

// Mirrors cn-theme-ml2.css's [data-bg-color] --ml2-surface values, so the
// "Default" Menu/Header swatch preview shows the exact tone that will
// actually be applied (it renders via var(--ml2-surface) at runtime,
// which already tracks whichever Background is selected).
const SURFACE_BY_BG = {
  slate: "#111a2e",
  indigo: "#16152a",
  emerald: "#12211d",
  rose: "#221419",
  black: "#121319",
};

const VALID_TINTS = ["white", "black", "slate", "accent", "accent-grad"];
function normalizeTint(stored) {
  return VALID_TINTS.includes(stored) ? stored : "slate";
}

export default {
  name: "Ml2SwitcherPanel",
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      tab: "colors",
      backgrounds: BACKGROUNDS,
      // "slate" ("Default", first in ACCENTS) instead of "violet" (purple)
      // as the default — it follows whichever Background is selected
      // instead of clashing with it.
      accent: localStorage.getItem(STORAGE_PREFIX + "accent") || "slate",
      // "indigo"/"emerald"/"rose" are stale values from before Menu/
      // Header Colors became dynamic (white/black/slate/accent/accent-grad) —
      // anyone with one of those saved just falls back to "slate" here.
      menuColor: normalizeTint(
        localStorage.getItem(STORAGE_PREFIX + "menuColor")
      ),
      headerColor: normalizeTint(
        localStorage.getItem(STORAGE_PREFIX + "headerColor")
      ),
      bgColor: localStorage.getItem(STORAGE_PREFIX + "bgColor") || "slate",
      colorMode: localStorage.getItem(STORAGE_PREFIX + "colorMode") || "dark",
      layoutWidth:
        localStorage.getItem(STORAGE_PREFIX + "layoutWidth") || "full",
    };
  },
  computed: {
    // Theme Primary's "Default" swatch preview follows whichever
    // Background is currently selected — not a fixed independent color —
    // so picking a new Background immediately updates what "Default"
    // looks (and, via CSS, actually resolves) like.
    accentOptions() {
      const defaultHex = ACCENT_BY_BG[this.bgColor] || ACCENT_BY_BG.slate;
      return ACCENTS.map((a) =>
        a.name === "slate" ? { ...a, color: defaultHex } : a
      );
    },
    // Menu/Header Colors are derived from whichever Background / Theme
    // Primary is currently selected — Default / Accent / Accent Gradient /
    // White / Black — instead of their own fixed independent palette, so
    // picking a new Background or accent immediately updates what these
    // two rows offer. White/Black sit last since Default (follows
    // Background) and Accent/Accent Gradient (follows Theme Primary) are
    // the options people reach for first.
    dynamicTints() {
      const found = this.accentOptions.find((a) => a.name === this.accent);
      const hex = found ? found.color : "#6c63ff";
      const surfaceHex = SURFACE_BY_BG[this.bgColor] || SURFACE_BY_BG.slate;
      return [
        { name: "slate", label: "Default", color: surfaceHex },
        { name: "accent", label: "Accent", color: hex },
        {
          name: "accent-grad",
          label: "Accent Gradient",
          color: `linear-gradient(135deg, ${hex}, rgba(255, 255, 255, 0.3))`,
        },
        { name: "white", label: "White", color: "#ffffff" },
        { name: "black", label: "Black", color: "#0a0a0c" },
      ];
    },
  },
  mounted() {
    this._systemDarkMedia = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    this._onSystemSchemeChange = () => {
      if (this.colorMode === "auto") this.apply();
    };
    if (this._systemDarkMedia) {
      this._systemDarkMedia.addEventListener(
        "change",
        this._onSystemSchemeChange
      );
    }
    this.apply();
  },
  beforeUnmount() {
    if (this._systemDarkMedia) {
      this._systemDarkMedia.removeEventListener(
        "change",
        this._onSystemSchemeChange
      );
    }
  },
  methods: {
    close() {
      this.$emit("update:modelValue", false);
    },
    selectAccent(name) {
      this.accent = name;
      this.apply();
    },
    selectMenuColor(name) {
      this.menuColor = name;
      this.apply();
    },
    selectHeaderColor(name) {
      this.headerColor = name;
      this.apply();
    },
    selectBgColor(name) {
      this.bgColor = name;
      this.apply();
    },
    // The ml2 theme is always active while MainLayout2 is mounted — it's
    // controlled solely by the Layout 1/2 switch button, not a separate
    // enable toggle here. This panel only adjusts its colors/styles.
    apply() {
      localStorage.setItem(STORAGE_PREFIX + "accent", this.accent);
      localStorage.setItem(STORAGE_PREFIX + "menuColor", this.menuColor);
      localStorage.setItem(STORAGE_PREFIX + "headerColor", this.headerColor);
      localStorage.setItem(STORAGE_PREFIX + "bgColor", this.bgColor);
      localStorage.setItem(STORAGE_PREFIX + "colorMode", this.colorMode);
      localStorage.setItem(STORAGE_PREFIX + "layoutWidth", this.layoutWidth);

      // "auto" isn't a value the CSS understands — resolve it against the
      // OS preference before writing the attribute the stylesheet reads.
      const resolvedColorMode =
        this.colorMode === "auto"
          ? this._systemDarkMedia && !this._systemDarkMedia.matches
            ? "light"
            : "dark"
          : this.colorMode;

      const root = document.documentElement;
      root.setAttribute("data-theme", "ml2");
      root.setAttribute("data-accent", this.accent);
      root.setAttribute("data-menu-color", this.menuColor);
      root.setAttribute("data-header-color", this.headerColor);
      root.setAttribute("data-bg-color", this.bgColor);
      root.setAttribute("data-color-mode", resolvedColorMode);
      root.setAttribute("data-layout-width", this.layoutWidth);
    },
    reset() {
      this.accent = "slate";
      this.menuColor = "slate";
      this.headerColor = "slate";
      this.bgColor = "slate";
      this.colorMode = "dark";
      this.layoutWidth = "full";
      this.apply();
    },
  },
};
</script>

<style src="../css/cn-theme-ml2.css"></style>

<style scoped>
.ml2-switcher-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.45);
}
.ml2-switcher-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background: var(--ml2-surface, #111a2e);
  color: var(--ml2-text, #f2f5fa);
  border-left: 1px solid var(--ml2-border, rgba(255, 255, 255, 0.07));
  box-shadow: var(--ml2-shadow-lg, -8px 0 32px rgba(0, 0, 0, 0.5));
  display: flex;
  flex-direction: column;
  font-family: var(--ml2-font, "Inter", sans-serif);
  animation: ml2SwitcherSlideIn 220ms cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes ml2SwitcherSlideIn {
  from {
    transform: translateX(24px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.ml2-switcher-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--ml2-border, rgba(255, 255, 255, 0.07));
}
.ml2-switcher-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.ml2-switcher-close {
  border: 1px solid var(--ml2-border, rgba(255, 255, 255, 0.07));
  background: var(--ml2-surface-alt, #16213a);
  border-radius: 8px;
  width: 28px;
  height: 28px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  color: var(--ml2-text-dim, #92a0bc);
  transition: border-color 180ms ease, color 180ms ease;
}
.ml2-switcher-close:hover {
  border-color: var(--ml2-accent, #6c63ff);
  color: var(--ml2-text, #f2f5fa);
}
.ml2-switcher-tabs {
  display: flex;
  padding: 10px 20px 0;
  gap: 6px;
}
.ml2-switcher-tab {
  flex: 1;
  border: 1px solid transparent;
  background: transparent;
  padding: 10px 12px;
  border-radius: 10px 10px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ml2-text-dim, #92a0bc);
  cursor: pointer;
  transition: color 180ms ease, background-color 180ms ease;
}
.ml2-switcher-tab:hover {
  color: var(--ml2-text, #f2f5fa);
}
.ml2-switcher-tab.active {
  background: var(--ml2-surface-alt, #16213a);
  border-color: var(--ml2-border, rgba(255, 255, 255, 0.07));
  border-bottom-color: transparent;
  color: var(--ml2-accent, #6c63ff);
}
.ml2-switcher-body {
  padding: 18px 20px 8px;
  overflow-y: auto;
  flex: 1;
  background: var(--ml2-surface-alt, #16213a);
}
.ml2-switcher-toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 16px;
  cursor: pointer;
}
.ml2-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ml2-text-dim, #92a0bc);
  margin: 18px 0 10px;
}
.ml2-section-label:first-child {
  margin-top: 2px;
}
.ml2-swatch-note {
  font-size: 11px;
  color: var(--ml2-text-dim, #92a0bc);
  margin-top: 8px;
  line-height: 1.4;
}
.ml2-swatch-row {
  display: flex;
  gap: 12px;
}
/* Glossy dual-tone sphere look (like Edge's theme-color picker) — a soft
   highlight top-left and a shadow bottom-right layered as background-image
   gradients on top of the swatch's own flat background-color, so no per-
   color light/dark computation is needed. */
.ml2-swatch {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--ml2-border, rgba(255, 255, 255, 0.07));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-image: radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 72% 78%, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0) 55%);
  background-blend-mode: screen, multiply;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 150ms ease, border-color 150ms ease;
}
.ml2-swatch:hover {
  transform: translateY(-2px) scale(1.06);
}
.ml2-swatch.active {
  border-color: var(--ml2-accent, #6c63ff);
  box-shadow: 0 0 0 3px var(--ml2-accent-soft, rgba(108, 99, 255, 0.16));
}
.ml2-radio-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
  flex-wrap: wrap;
}
.ml2-radio-row label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--ml2-border, rgba(255, 255, 255, 0.07));
  background: var(--ml2-surface, #111a2e);
  color: var(--ml2-text-dim, #92a0bc);
  transition: border-color 150ms ease, color 150ms ease;
}
.ml2-radio-row label:has(input:checked) {
  border-color: var(--ml2-accent, #6c63ff);
  color: var(--ml2-text, #f2f5fa);
}
.ml2-switcher-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--ml2-border, rgba(255, 255, 255, 0.07));
  background: var(--ml2-surface, #111a2e);
}
.ml2-reset-btn {
  width: 100%;
  padding: 11px;
  border: 1px solid var(--ml2-border, rgba(255, 255, 255, 0.07));
  border-radius: 10px;
  background: var(--ml2-surface-alt, #16213a);
  color: var(--ml2-coral, #ff6b6b);
  font-weight: 600;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;
}
.ml2-reset-btn:hover {
  border-color: var(--ml2-coral, #ff6b6b);
  background: rgba(255, 107, 107, 0.1);
}
</style>
