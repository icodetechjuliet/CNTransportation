<template><q-btn-dropdown
    :flat="variant === 'ml2'"
    :round="variant === 'ml2'"
    :dense="true"
    :color="variant === 'ml2' ? 'blue-6' : 'blue-6'"
    :text-color="variant === 'ml2' ? undefined : 'white'"
    no-icon-animation
    :class="[
      'zoom-on-hover',
      'gt-sm',
      'language-switcher-btn',
      variant === 'ml2' ? 'ml2-chrome-btn' : 'm-icon-btn-style radius-md',
    ]"
  >
    <template #label>
      <q-icon name="translate" />
      <span class="language-switcher-code">{{ selectedLanguage.code }}</span>
    </template>
    <q-tooltip>Language : {{ selectedLanguage.englishName }}</q-tooltip>

    <q-list class="language-switcher-list">
      <q-item-label header class="language-switcher-group-label"
        >Indian Languages</q-item-label
      >
      <q-item
        v-for="lang in indianLanguages"
        :key="lang.code"
        clickable
        v-close-popup
        :active="lang.code === selectedLanguage.code"
        active-class="language-switcher-active"
        @click="selectLanguage(lang)"
      >
        <q-item-section avatar>
          <q-icon
            :name="
              lang.code === selectedLanguage.code
                ? 'radio_button_checked'
                : 'radio_button_unchecked'
            "
            size="16px"
            :color="lang.code === selectedLanguage.code ? 'primary' : 'grey-5'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ lang.nativeName }}</q-item-label>
          <q-item-label caption>{{ lang.englishName }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator class="q-my-xs" />

      <q-item-label header class="language-switcher-group-label"
        >Global Languages</q-item-label
      >
      <q-item
        v-for="lang in globalLanguages"
        :key="lang.code"
        clickable
        v-close-popup
        :active="lang.code === selectedLanguage.code"
        active-class="language-switcher-active"
        @click="selectLanguage(lang)"
      >
        <q-item-section avatar>
          <q-icon
            :name="
              lang.code === selectedLanguage.code
                ? 'radio_button_checked'
                : 'radio_button_unchecked'
            "
            size="16px"
            :color="lang.code === selectedLanguage.code ? 'primary' : 'grey-5'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ lang.nativeName }}</q-item-label>
          <q-item-label caption>{{ lang.englishName }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown></template>

<script>
// Language switcher — UI control only for now. This app has no i18n
// translation system wired in yet (no vue-i18n, no translation files), so
// selecting a language here only remembers the user's preference
// (localStorage) and updates the button; it does not yet translate any
// page text. Wiring an actual translation layer is a separate, larger
// follow-up.
const STORAGE_KEY = "cn_app_language";

const INDIAN_LANGUAGES = [
  { code: "HI", locale: "hi", nativeName: "हिन्दी", englishName: "Hindi" },
  { code: "TA", locale: "ta", nativeName: "தமிழ்", englishName: "Tamil" },
  { code: "TE", locale: "te", nativeName: "తెలుగు", englishName: "Telugu" },
  { code: "KN", locale: "kn", nativeName: "ಕನ್ನಡ", englishName: "Kannada" },
  {
    code: "ML",
    locale: "ml",
    nativeName: "മലയാളം",
    englishName: "Malayalam",
  },
  { code: "BN", locale: "bn", nativeName: "বাংলা", englishName: "Bengali" },
  { code: "MR", locale: "mr", nativeName: "मराठी", englishName: "Marathi" },
  {
    code: "GU",
    locale: "gu",
    nativeName: "ગુજરાતી",
    englishName: "Gujarati",
  },
  { code: "PA", locale: "pa", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi" },
  { code: "UR", locale: "ur", nativeName: "اردو", englishName: "Urdu" },
];

const GLOBAL_LANGUAGES = [
  { code: "EN", locale: "en", nativeName: "English", englishName: "English" },
  { code: "AR", locale: "ar", nativeName: "العربية", englishName: "Arabic" },
  { code: "FR", locale: "fr", nativeName: "Français", englishName: "French" },
  {
    code: "ES",
    locale: "es",
    nativeName: "Español",
    englishName: "Spanish",
  },
  {
    code: "ZH",
    locale: "zh",
    nativeName: "中文",
    englishName: "Chinese (Mandarin)",
  },
];

export default {
  name: "LanguageSwitcher",

  props: {
    // "layout1" matches MainLayout1's dense/colored icon-button chrome;
    // "ml2" matches MainLayout2's round/flat ml2-chrome-btn chrome.
    variant: {
      type: String,
      default: "layout1",
      validator: (v) => ["layout1", "ml2"].includes(v),
    },
  },

  emits: ["language-changed"],

  data() {
    return {
      indianLanguages: INDIAN_LANGUAGES,
      globalLanguages: GLOBAL_LANGUAGES,
      selectedLanguage: GLOBAL_LANGUAGES[0], // English by default
    };
  },

  created() {
    try {
      const savedCode = localStorage.getItem(STORAGE_KEY);
      const found = [...INDIAN_LANGUAGES, ...GLOBAL_LANGUAGES].find(
        (l) => l.code === savedCode
      );
      if (found) this.selectedLanguage = found;
    } catch (err) {
      // localStorage can be unavailable (private browsing, etc.) — fall
      // back silently to the English default.
    }
  },

  methods: {
    selectLanguage(lang) {
      this.selectedLanguage = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang.code);
      } catch (err) {
        // ignore — preference just won't persist across reloads
      }
      this.$emit("language-changed", lang);
    },
  },
};
</script>

<style scoped>
.language-switcher-btn {
  min-width: auto;
  padding: 0 8px;
  font-size: 13px;
  width: auto;
  font-weight: 600;
  text-transform: none;
}

.language-switcher-btn :deep(.q-btn-dropdown__arrow) {
  margin-left: 2px;
  font-size: 20px;
  font-weight: 400;
}

.language-switcher-code {
  font-size: 11px;
  font-weight: 700;
  margin-left: 4px;
  letter-spacing: 0.3px;
}

.language-switcher-list {
  min-width: 220px;
  max-height: 360px;
  overflow-y: auto;
}

.language-switcher-group-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #78909c;
  text-transform: uppercase;
}

.language-switcher-active {
  background: #eef5fb;
}
</style>
