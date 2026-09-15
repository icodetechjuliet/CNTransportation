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
          ><span>{{ groups.length }} {{ t("categories", "श्रेणियाँ") }}</span
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
      <aside class="category-panel">
        <h2>{{ t("CATEGORIES", "श्रेणियाँ") }}</h2>
        <button :class="{ selected: !category }" @click="category = ''">
          <q-icon name="grid_view" /><span>{{
            t("All menus", "सभी मेनू")
          }}</span
          ><small>{{ total }}</small>
        </button>
        <button
          v-for="group in groups"
          :key="group.id"
          :class="{ selected: category === group.id }"
          :aria-pressed="category === group.id"
          @click="category = group.id"
        >
          <q-icon :name="group.icon" /><span
            >{{ label(group.name)
            }}<small
              class="secondary-label"
              :lang="language === 'en' ? 'hi' : 'en'"
              >{{ secondary(group.name) }}</small
            ></span
          ><small>{{ group.items.length }}</small>
        </button>
      </aside>
      <main class="menu-content">
        <section
          v-for="group in visibleGroups"
          :key="group.id"
          class="menu-section"
        >
          <div class="section-heading">
            <div class="section-icon">
              <q-icon :name="group.icon" size="23px" />
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
              <div>
                <small v-if="item.subgroup" class="subgroup">{{
                  label(item.subgroup)
                }}</small
                ><strong>{{ label(item.MenuDesc) }}</strong
                ><span :lang="language === 'en' ? 'hi' : 'en'">{{
                  secondary(item.MenuDesc)
                }}</span>
              </div>
              <q-icon name="arrow_forward" size="18px" />
            </router-link>
          </div>
        </section>
        <div v-if="!visibleGroups.length" class="empty-state">
          <q-icon name="search_off" size="48px" />
          <h2>{{ t("No menus found", "कोई मेनू नहीं मिला") }}</h2>
          <p>
            {{
              t(
                "Try another keyword or choose a different category.",
                "दूसरा शब्द खोजें या कोई अन्य श्रेणी चुनें।"
              )
            }}
          </p>
          <q-btn
            outline
            color="primary"
            no-caps
            :label="t('Reset filters', 'फ़िल्टर रीसेट करें')"
            @click="
              search = '';
              category = '';
            "
          />
        </div>
      </main>
    </div>
  </q-page>
</template>

<script>
import { buildMockChildMenu } from "src/data/mockData";
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

export default {
  name: "DMSMenu",
  inject: { openTab: { default: null } },
  data: () => ({ language: "en", search: "", category: "", groups }),
  computed: {
    total() {
      return this.groups.reduce((sum, group) => sum + group.items.length, 0);
    },
    visibleGroups() {
      const query = (this.search || "").trim().toLocaleLowerCase();
      return this.groups
        .filter((group) => !this.category || group.id === this.category)
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
  },
};
</script>

<style scoped>
.dms-directory {
  background: #f4f7fb;
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
  color: white;
  background: radial-gradient(ellipse at top right, #287d91 0, transparent 58%),
    linear-gradient(120deg, #132e50, #185377);
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
  letter-spacing: 2px;
  color: #c4e4ef;
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
  color: #d4e7f1;
  margin: 0;
  font-size: 14px;
}
.hero-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
  font-size: 12px;
  color: #e4f1f9;
}
.hero-stats span {
  padding: 4px 10px;
  border: 1px solid #ffffff24;
  border-radius: 6px;
  background: #ffffff0a;
}
.language-toggle {
  background: #ffffff20;
  padding: 4px;
  border: 1px solid #ffffff35;
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
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}
.category-panel {
  background: white;
  border: 1px solid #e1e7ef;
  padding: 16px 10px;
  border-radius: 12px;
}
.category-panel h2 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.4px;
  margin: 0 12px 14px;
  line-height: 1.5;
  color: #718096;
}
.category-panel button {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  background: transparent;
  border: 0;
  text-align: left;
  padding: 9px 12px;
  color: #526176;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  margin-bottom: 3px;
}
.category-panel button > span {
  flex: 1;
}
.category-panel .q-icon {
  font-size: 19px;
}
.category-panel button.selected {
  background: #eaf3fc;
  color: #1765a9;
  font-weight: 600;
}
.category-panel button:hover {
  background: #f0f5fa;
}
.secondary-label {
  display: block;
  font-size: 11px;
  font-weight: 400;
  margin-top: 2px;
}
.menu-section {
  background: white;
  border: 1px solid #e1e7ef;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}
.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(100deg, #e6f0fc 0%, #f1f7fd 100%);
  border-bottom: 1px solid #d5e4f4;
  border-left: 4px solid #2877b8;
}
.section-icon {
  background: #fff;
  color: #216ba6;
  border: 1px solid #d0e2f3;
  box-shadow: 0 2px 4px #174d7b08;
  padding: 8px;
  border-radius: 8px;
}
.section-heading h2 {
  color: #173e65;
  font-size: 16px;
  font-weight: 650;
  line-height: 1.4;
  margin: 0;
}
.section-heading p {
  margin: 3px 0 0;
  font-size: 12px;
  color: #506c89;
}
.count-badge {
  margin-left: auto;
  background: #fff;
  border: 1px solid #cbddf0;
  padding: 3px 10px;
  border-radius: 20px;
  color: #245d91;
  font-weight: 600;
  font-size: 12px;
}
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 12px;
  gap: 10px;
}
.menu-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #30445f;
  border: 1px solid #e8edf3;
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  min-height: 72px;
  transition: background 0.15s, border-color 0.15s;
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
.menu-link > .q-icon {
  color: #8297b0;
  flex-shrink: 0;
}
.menu-link:hover {
  background: #f1f7fd;
  border-color: #d5e5f4;
  color: #1765a9;
}
.menu-link:focus-visible,
.category-panel button:focus-visible {
  outline: 2px solid #287db9;
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
@media (min-width: 1700px) {
  .menu-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 1150px) {
  .menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .directory-body {
    grid-template-columns: 210px minmax(0, 1fr);
    gap: 16px;
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
  .directory-body {
    grid-template-columns: 1fr;
  }
  .category-panel {
    display: flex;
    gap: 6px;
    overflow-x: auto;
  }
  .category-panel h2 {
    display: none;
  }
  .category-panel button {
    width: auto;
    flex-shrink: 0;
    margin: 0;
  }
  .secondary-label {
    display: none;
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
