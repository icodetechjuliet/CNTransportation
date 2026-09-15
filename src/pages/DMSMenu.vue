<template>
  <q-page class="dms-directory" :lang="language">
    <header class="directory-hero">
      <div>
        <div class="eyebrow">
          <q-icon name="apps" size="18px" /> CARGONET / DMS
        </div>
        <h1>{{ t("DMS menu directory", "DMS मेनू निर्देशिका") }}</h1>
        <p>
          {{
            t(
              "Every workspace. One place to start.",
              "हर कार्यक्षेत्र। शुरुआत एक ही जगह से।"
            )
          }}
        </p>
        <div class="hero-stats">
          <span>{{ total }} {{ t("menus", "मेनू") }}</span
          ><span>English + हिन्दी</span>
        </div>
      </div>
      <q-btn-toggle
        v-model="language"
        class="language-toggle"
        no-caps
        unelevated
        toggle-color="white"
        toggle-text-color="primary"
        :options="[
          { label: 'English', value: 'en' },
          { label: 'हिन्दी', value: 'hi' },
        ]"
        :aria-label="t('Display language', 'प्रदर्शन भाषा')"
      />
    </header>

    <div class="directory-tools">
      <q-input
        v-model="search"
        outlined
        clearable
        :placeholder="
          t(
            'Search any menu in English or Hindi…',
            'अंग्रेज़ी या हिन्दी में कोई मेनू खोजें…'
          )
        "
        :aria-label="t('Search menus', 'मेनू खोजें')"
        class="menu-search"
        bg-color="white"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <span aria-live="polite"
        >{{ visibleCount }} {{ t("menus available", "मेनू उपलब्ध") }}</span
      >
    </div>
    <div class="directory-body">
      <main class="menu-content">
        <section
          v-for="group in visibleGroups"
          :key="group.id"
          class="menu-section"
          :style="sectionStyle(group.id)"
        >
          <div class="section-heading">
            <div class="section-icon">
              <q-icon :name="group.icon" size="22px" />
            </div>
            <div>
              <h2>{{ label(group.name) }}</h2>
              <p :lang="language === 'en' ? 'hi' : 'en'">
                {{ secondary(group.name) }}
              </p>
            </div>
            <span class="count-badge">{{ group.items.length }}</span>
          </div>
          <div class="menu-grid">
            <router-link
              v-for="item in group.items"
              :key="item.id"
              :to="item.Link"
              @click.prevent="openMenu(item)"
              class="menu-link"
            >
              <div class="menu-link-icon">
                <q-icon :name="group.icon" size="17px" />
              </div>
              <div class="menu-link-body">
                <small v-if="item.subgroup" class="subgroup">{{
                  label(item.subgroup)
                }}</small
                ><strong>{{ label(item.MenuDesc) }}</strong
                ><span :lang="language === 'en' ? 'hi' : 'en'">{{
                  secondary(item.MenuDesc)
                }}</span>
              </div>
              <q-icon name="arrow_forward" size="16px" class="go-icon" />
            </router-link>
          </div>
        </section>
        <div v-if="!visibleGroups.length" class="empty-state">
          <q-icon name="search_off" size="48px" />
          <h2>{{ t("No menus found", "कोई मेनू नहीं मिला") }}</h2>
          <p>
            {{
              t(
                "Try another keyword.",
                "दूसरा शब्द खोजें।"
              )
            }}
          </p>
          <q-btn
            outline
            color="primary"
            no-caps
            :label="t('Reset search', 'खोज रीसेट करें')"
            @click="search = ''"
          />
        </div>
      </main>
    </div>
  </q-page>
</template>

<script>
import { buildMockChildMenu } from "src/IPConfig/mockData";
import hindi from "src/data/dmsMenuHindi";

const icons = [
  "inventory_2",
  "local_shipping",
  "where_to_vote",
  "account_balance_wallet",
  "store",
  "receipt_long",
  "settings",
  "query_stats",
  "description",
  "admin_panel_settings",
  "qr_code_2",
];
// Preserve the sidebar's headings, order, links, and nested tax submenu.
const groups = [];
for (const item of buildMockChildMenu("DMS")) {
  if (item.Link === "#menu-header") {
    groups.push({
      id: item.id,
      name: item.MenuDesc,
      icon: icons[groups.length] || "folder",
      items: [],
    });
  } else if (groups.length) {
    const flatten = (entry, subgroup = "") => {
      if (entry.children?.length)
        entry.children.forEach((child) => flatten(child, entry.MenuDesc));
      else if (entry.Link?.startsWith("/"))
        groups[groups.length - 1].items.push({ ...entry, subgroup });
    };
    flatten(item);
  }
}

// Muted accents identify categories consistently, including during search.
const palette = [
  { from: "#1765c9", to: "#2f9fdb", bg: "#eaf3fd", border: "#bcd8f7" },
  { from: "#188a5c", to: "#38b28a", bg: "#e9f7f1", border: "#b7e6d2" },
  { from: "#c65a1f", to: "#e0863f", bg: "#fdefe7", border: "#f4cdb6" },
  { from: "#7238c9", to: "#a165e8", bg: "#f2eefb", border: "#d9cbf3" },
  { from: "#c4266f", to: "#e2569a", bg: "#fdeef3", border: "#f4c4d6" },
  { from: "#0e7ea3", to: "#2fb0d6", bg: "#eaf6fb", border: "#bce3f0" },
  { from: "#a9781a", to: "#d0a53f", bg: "#fbf4e3", border: "#f0dba0" },
  { from: "#4c7a2e", to: "#78a854", bg: "#eff5ec", border: "#c8dcc2" },
  { from: "#5b4bb8", to: "#8676dd", bg: "#f0eef8", border: "#cfc7ea" },
  { from: "#c5342f", to: "#e2635e", bg: "#fdecec", border: "#f3c4c4" },
  { from: "#2b6e88", to: "#4f9bb6", bg: "#eaf3f6", border: "#bfd9e3" },
];

export default {
  name: "DMSMenu",
  inject: { openTab: { default: null } },
  data: () => ({ language: "en", search: "", groups }),
  computed: {
    total() {
      return this.groups.reduce((sum, group) => sum + group.items.length, 0);
    },
    visibleGroups() {
      const query = (this.search || "").trim().toLocaleLowerCase();
      return this.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            [
              item.MenuDesc,
              hindi[item.MenuDesc],
              group.name,
              hindi[group.name],
              item.subgroup,
              hindi[item.subgroup],
            ]
              .filter(Boolean)
              .join(" ")
              .toLocaleLowerCase()
              .includes(query)
          ),
        }))
        .filter((group) => group.items.length);
    },
    visibleCount() {
      return this.visibleGroups.reduce(
        (sum, group) => sum + group.items.length,
        0
      );
    },
  },
  methods: {
    openMenu(item) {
      if (this.openTab) {
        this.openTab({ path: item.Link, moduleName: 'DMS' }, `DMS - ${this.label(item.MenuDesc)}`);
      } else {
        this.$router.push(item.Link);
      }
    },
    t(en, hi) {
      return this.language === "hi" ? hi : en;
    },
    label(name) {
      return this.language === "hi" ? hindi[name] || name : name;
    },
    secondary(name) {
      return this.language === "hi" ? name : hindi[name] || name;
    },
    accent(index) {
      return palette[index % palette.length];
    },
    sectionStyle(id) {
      const c = this.accent(this.groups.findIndex(group => group.id === id));
      return {
        "--accent-from": c.from,
        "--accent-to": c.to,
        "--accent-bg": c.bg,
        "--accent-border": c.border,
      };
    },

  },
};
</script>

<style scoped>
.dms-directory {
  background: #f5f7fb;
  padding: 20px 24px 40px;
  color: #23354d;
  letter-spacing: normal;
}
.directory-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 24px 28px;
  border-radius: 12px;
  color: #172b4d;
  border: 1px solid #dce6f2;
  background: linear-gradient(110deg, #ffffff 30%, #edf4ff);
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
  letter-spacing: 2px;
  color: #46709c;
  font-weight: 600;
}
h1 {
  font-size: 26px;
  line-height: 1.4;
  font-weight: 700;
  margin: 10px 0 6px;
  letter-spacing: -0.5px;
}
.directory-hero p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}
.hero-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
  font-size: 12px;
  color: #536780;
}
.hero-stats span {
  padding: 4px 10px;
  border: 1px solid #dfe7f0;
  border-radius: 6px;
  background: #ffffff;
}
.language-toggle {
  background: #e6edf7;
  color: #536780;
  padding: 4px;
  border: 1px solid #d8e2ef;
  border-radius: 9px;
  flex-shrink: 0;
}
.directory-tools {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  padding: 10px 14px;
  background: white;
  border: 1px solid #e1e7ef;
  border-radius: 10px;
  color: #64748b;
  font-size: 13px;
}
.menu-search {
  width: min(620px, 75%);
}
.menu-search :deep(.q-field__control) {
  min-height: 44px;
  height: 44px;
  border-radius: 7px;
}
.menu-search :deep(.q-field__marginal) {
  height: 44px;
}
.directory-body {
  display: block;
}
.menu-section {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-top: 3px solid var(--accent-from);
  border-radius: 14px;
  margin-bottom: 18px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(20, 40, 70, 0.025);
}
.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--accent-bg);
  border-bottom: 1px solid var(--accent-border);
  color: #243650;
}
.section-icon {
  background: var(--accent-bg);
  color: var(--accent-from);
  border: 1px solid var(--accent-border);
  padding: 8px;
  border-radius: 9px;
  display: flex;
}
.section-heading h2 {
  color: #243650;
  font-size: 16px;
  font-weight: 650;
  line-height: 1.4;
  margin: 0;
}
.section-heading p {
  margin: 3px 0 0;
  font-size: 12px;
  color: #718096;
}
.count-badge {
  margin-left: auto;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  padding: 3px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 12px;
  color: var(--accent-from);
}
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 14px;
  gap: 12px;
}
.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #30445f;
  border: 1px solid var(--accent-border);
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  min-height: 72px;
  box-shadow: none;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
}
.menu-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  flex-shrink: 0;
  background: var(--accent-bg);
  color: var(--accent-from);
}
.menu-link-body {
  flex: 1;
  min-width: 0;
}
.menu-link strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: normal;
  overflow-wrap: anywhere;
}
.menu-link span {
  display: block;
  color: #68788d;
  font-size: 12px;
  margin-top: 3px;
  line-height: 1.6;
}
.go-icon {
  color: #8297b0;
  flex-shrink: 0;
}
.menu-link:hover {
  border-color: var(--accent-from, #1765a9);
  background: var(--accent-bg);
  box-shadow: 0 4px 12px rgba(20, 40, 70, 0.06);
  transform: translateY(-1px);
}
.menu-link:hover .go-icon {
  color: var(--accent-from, #1765a9);
}
.menu-link:focus-visible {
  outline: 2px solid var(--accent-from);
  outline-offset: -2px;
}
.subgroup {
  display: block;
  font-size: 10px;
  color: #27758c;
  margin-bottom: 3px;
}
.empty-state {
  text-align: center;
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
  color: #68788d;
}
.empty-state h2 {
  font-size: 20px;
  line-height: 1.5;
}
@media (prefers-reduced-motion: reduce) {
  .menu-link { transition: none; }
  .menu-link:hover { transform: none; }
}
@media (min-width: 1500px) {
  .menu-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 1150px) {
  .menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 750px) {
  .dms-directory {
    padding: 14px;
  }
  .directory-hero {
    padding: 20px;
    flex-direction: column;
  }
  h1 {
    font-size: 25px;
  }
  .directory-tools {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .menu-search {
    width: 100%;
  }
}
@media (max-width: 450px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
}
</style>
