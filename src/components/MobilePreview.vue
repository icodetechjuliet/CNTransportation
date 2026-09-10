<template>
  <!-- ══════════════ MOBILE PHONE PREVIEW ══════════════ -->
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    maximized
    transition-show="fade"
    transition-hide="fade"
  >
    <div class="mmt-preview-bg">
      <!-- Phone + hint stacked vertically -->
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        "
      >
        <!-- Phone frame -->
        <div :class="['mmt-phone-frame', phoneOrientation]">
          <!-- Side buttons -->
          <div class="mmt-side-vol-up"></div>
          <div class="mmt-side-vol-dn"></div>
          <div class="mmt-side-power"></div>

          <!-- Phone body -->
          <div class="mmt-phone-body">
            <!-- Status bar -->
            <div class="mmt-status-bar">
              <span class="mmt-status-time">9:41</span>
              <div class="mmt-status-icons">
                <q-icon name="signal_cellular_alt" size="11px" />
                <q-icon name="wifi" size="11px" />
                <q-icon name="battery_full" size="11px" />
              </div>
            </div>

            <!-- App bar -->
            <div class="mmt-phone-appbar">
              <q-icon
                name="local_shipping"
                size="15px"
                class="q-mr-xs"
                style="color: #fff"
              />
              <span class="mmt-phone-appbar-title">CargoNet Plus</span>
              <q-space />
              <q-icon
                name="refresh"
                size="15px"
                style="color: #fff; cursor: pointer"
                @click="reload"
              />
            </div>

            <!-- Whole live app, rendered at real phone viewport dimensions -->
            <div class="mmt-phone-content">
              <iframe
                v-if="previewSrc"
                :key="previewSrc"
                :src="previewSrc"
                class="mmt-phone-iframe"
                title="App preview"
              ></iframe>
            </div>

            <!-- Home indicator -->
            <div class="mmt-phone-home-ind"></div>
          </div>
        </div>

        <!-- Orientation hint -->
        <!-- <div class="mmt-preview-hint">
          <q-icon
            name="phone_android"
            size="14px"
            class="q-mr-xs"
            style="color: rgba(255, 255, 255, 0.5)"
          />
          <span style="color: rgba(255, 255, 255, 0.5); font-size: 11px">
            {{
              phoneOrientation === "portrait"
                ? "Portrait 390 × 844"
                : "Landscape 844 × 390"
            }}
          </span>
        </div> -->
      </div>
      <!-- end phone+hint wrapper -->

      <!-- ── Right side panel: orientation + close ── -->
      <div class="mmt-side-panel">
        <!-- Portrait button -->
        <!-- <div
          :class="['mmt-ori-btn', phoneOrientation === 'portrait' ? 'mmt-ori-btn-active' : '']"
          @click="phoneOrientation = 'portrait'"
        >
          <q-icon name="stay_current_portrait" size="22px" />
          <span>Portrait</span>
        </div> -->

        <!-- Landscape button -->
        <!-- <div
          :class="['mmt-ori-btn', phoneOrientation === 'landscape' ? 'mmt-ori-btn-active' : '']"
          @click="phoneOrientation = 'landscape'"
        >
          <q-icon name="stay_current_landscape" size="22px" />
          <span>Landscape</span>
        </div> -->

        <div style="flex: 1"></div>

        <!-- Close button -->
        <div class="mmt-close-btn" @click="$emit('update:modelValue', false)">
          <q-icon name="close" size="20px" />
          <span></span>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  name: "MobilePreview",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      phoneOrientation: "portrait",
      previewSrc: "",
    };
  },

  watch: {
    modelValue(isOpen) {
      if (isOpen) {
        // Load the whole live app (current route) fresh into the frame each
        // time the preview is opened, so it reflects real, navigable content
        // rendered at genuine phone viewport dimensions.
        this.previewSrc = window.location.href;
      }
    },
  },

  methods: {
    reload() {
      this.previewSrc = "";
      this.$nextTick(() => {
        this.previewSrc = window.location.href;
      });
    },
  },
};
</script>

<style scoped>
.mmt-preview-bg {
  background: rgba(254, 254, 255, 0.97);
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0;
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
}

/* Hint below phone — use a wrapper */
.mmt-preview-hint {
  display: flex;
  align-items: center;
  margin-top: 6px;
}

/* Right side panel */
.mmt-side-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 10px;
  height: 100%;
  min-height: 300px;
  margin-left: 20px;
  flex-shrink: 0;
}

/* Orientation button */
.mmt-ori-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.55);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  min-width: 80px;
  user-select: none;
}
.mmt-ori-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
}
.mmt-ori-btn-active {
  background: #0178bc !important;
  color: #fff !important;
  border-color: #0178bc !important;
  box-shadow: 0 4px 16px rgba(1, 120, 188, 0.45);
}

/* Close button */
.mmt-close-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 5px;
  border-radius: 50px;
  cursor: pointer;
  color: rgba(255, 60, 60, 1);
  border: 1.5px solid rgba(255, 80, 80, 1);
  background: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  font-weight: 600;
  transition: all 0.2s;
  user-select: none;
}
.mmt-close-btn:hover {
  background: rgba(220, 50, 50, 0.3);
  color: #fff;
  border-color: #f44336;
}

/* ── Phone frame outer shell ── */
.mmt-phone-frame {
  position: relative;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}
.mmt-phone-frame.portrait {
  width: 400px;
  height: 740px;
}
.mmt-phone-frame.landscape {
  width: 740px;
  height: 400px;
}

/* Side buttons (portrait) */
.mmt-side-vol-up {
  position: absolute;
  left: -4px;
  top: 130px;
  width: 4px;
  height: 36px;
  background: #dcdce2;
  border-radius: 3px 0 0 3px;
}
.mmt-side-vol-dn {
  position: absolute;
  left: -4px;
  top: 178px;
  width: 4px;
  height: 36px;
  background: #dcdce2;
  border-radius: 3px 0 0 3px;
}
.mmt-side-power {
  position: absolute;
  right: -4px;
  top: 150px;
  width: 4px;
  height: 48px;
  background: #dcdce2;
  border-radius: 0 3px 3px 0;
}
/* Hide side buttons in landscape (they'd overlap) */
.mmt-phone-frame.landscape .mmt-side-vol-up,
.mmt-phone-frame.landscape .mmt-side-vol-dn,
.mmt-phone-frame.landscape .mmt-side-power {
  display: none;
}

/* Phone body */
.mmt-phone-body {
  width: 100%;
  height: 100%;
  background: #16213e;
  border-radius: 20px;
  border: 2px solid #2e2e50;
  box-shadow: 0 0 0 1px #0d0d20, 0 0 0 3px #2e2e50, 0 0 0 4px #0d0d20,
    0 24px 60px rgba(0, 0, 0, 0.85), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 10px 6px 6px;
  box-sizing: border-box;
}

/* Status bar */
.mmt-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 12px;
  background: #0178bc;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}
.mmt-status-icons {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* App bar */
.mmt-phone-appbar {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #0178bc, #00bdda);
  padding: 6px 10px;
  color: #fff;
}
.mmt-phone-appbar-title {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}

/* Live app viewport */
.mmt-phone-content {
  flex: 1;
  overflow: hidden;
  background: #f0f4f8;
}
.mmt-phone-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #fff;
}

/* Home indicator */
.mmt-phone-home-ind {
  width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin: 4px auto 0;
}
</style>
