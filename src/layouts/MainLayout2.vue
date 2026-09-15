<template>
  <div
    v-if="loading"
    class="app-boot-loader"
    role="status"
    aria-live="polite"
    aria-label="Loading dashboard"
    @contextmenu.prevent
  >
    <div class="app-boot-loader__content">
      <img
        src="~assets/cargonet-logo.png"
        class="app-boot-loader__logo"
        alt=""
      />
      <span class="app-boot-loader__text">Loading dashboard</span>
    </div>
  </div>

  <div v-if="!loading" @contextmenu.prevent>
    <!-- <span class="anime_bg"></span> -->
    <span :class="getanimecls">
      <q-layout view="lHh LpR fFf">
        <Ml2Header
          :selected-branch="selectedBranch"
          :items="items"
          :usertype="usertype"
          :crmparty="crmparty"
          :show-metabase-login="ShowMetabaseLogin"
          :username="username"
          :user-short="userShort"
          :shortcuts="shortcuts"
          :active-tab-label="activeTabLabel"
          @toggle-drawer="toggleLeftDrawericon"
          @select-branch="onItemClick"
          @open-metabase="openMetabaseLogin"
          @open-menu-search="onOpenMenuSearch"
          @go-to-layout1="goToLayout1"
          @go-home="goHome"
          @logout="handleLogout"
        />

        <!-- <q-fab-action
              Round
              class="color-3"
              @click="changeColor('#8E7D00')"
              label-position="left"
            ></q-fab-action>
            <q-fab-action
              Round
              class="color-4"
              @click="changeColor('#362177')"
              label-position="left"
            ></q-fab-action>
            <q-fab-action
              Round
              class="color-5"
              @click="changeColor('#39ddf3')"
              label-position="left"
            ></q-fab-action> -->

        <!-- </div> -->
        <!-- <q-btn
            color="white"
            text-color="black"
            round
            icon="person"
            class="zoom-on-hover"
          >
            <q-menu>
              <q-list style="width: 160px">
                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon name="person"></q-icon>
                  </q-item-section>
                  <q-item-section>{{ username }}</q-item-section>
                </q-item>

                <q-item clickable @click="handleLogout">
                  <q-item-section avatar>
                    <q-icon name="logout"></q-icon>
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn> -->

        <div align="center" class="LastActivity">
          <p v-if="!$q.screen.lt.sm && isVisible">
            {{ lastActivityMessage || "No activity yet" }}
          </p>
        </div>

        <!--MN <q-drawer
        v-if="parentMenu && parentMenu.length"
          v-model="leftDrawerOpen"
          show-if-above
          :breakpoint="1024"
          bordered
          class="custom-drawer"
        > -->
        <Ml2Sidebar
          ref="ml2Sidebar"
          v-model="leftDrawerOpen"
          :parent-menu="parentMenu"
          :filtered-menu="filteredMenu"
          :filter-text="filterText"
          :loading="loading"
          :searching="searching"
          :show-dialog="showDialog"
          :external-url="externalUrl"
          :collapsed="sidebarCollapsed"
          @toggle-drawer="toggleLeftDrawericon"
          @toggle-collapse="toggleLeftDrawericon"
          @toggle-dropdown="toggleDropdown"
          @link-click="handleLinkClick"
          @filter="filtermenus"
          @clear-search="clearSearch"
          @close-dialog="closeDialog"
          @update:filter-text="filterText = $event"
        />

        <q-page-container>
          <!-- <router-view /> -->
          <div v-show="ShowChat" class="show-chat-container">
            <Chatbot @close="ShowChat = false" />
          </div>
          <div>
            <q-btn
              label="Usability Feedback"
              class="feedbackheader"
              @click="feedbackdialogbox()"
              v-show="!feedbackdialog && $q.screen.gt.xs"
            />

            <q-dialog
              v-model="feedbackdialog"
              position="right"
              class="feedback-dialog"
            >
              <q-card>
                <div class="row feedback-header">
                  <div class="col-10">We Value Your Opinion</div>
                  <div
                    class="col-2 text-right"
                    style="cursor: pointer"
                    @click="clsfeedback"
                  >
                    X
                  </div>
                </div>
                <div class="row feedback-content">
                  <div class="col-12">
                    How satisfied are you with your experience using CargoNet?
                  </div>
                  <div class="col-12">
                    <span
                      class="angry"
                      :class="
                        selectedFeedback === '1' ? 'selected-feedback' : ''
                      "
                      @click="setRating('1')"
                      ><q-tooltip style="font-size: 12px">
                        Deep dissatisfaction or disappointment
                      </q-tooltip></span
                    >
                    <span
                      class="sad"
                      :class="
                        selectedFeedback === '2' ? 'selected-feedback' : ''
                      "
                      @click="setRating('2')"
                      ><q-tooltip style="font-size: 12px">
                        Mild dissatisfaction or unhappiness
                      </q-tooltip></span
                    >
                    <span
                      class="okay"
                      :class="
                        selectedFeedback === '3' ? 'selected-feedback' : ''
                      "
                      @click="setRating('3')"
                      ><q-tooltip style="font-size: 12px">
                        Somewhat satisfied, average experience
                      </q-tooltip></span
                    >
                    <span
                      class="happy"
                      :class="
                        selectedFeedback === '4' ? 'selected-feedback' : ''
                      "
                      @click="setRating('4')"
                      ><q-tooltip style="font-size: 12px">
                        Satisfied with the experience
                      </q-tooltip></span
                    >
                    <span
                      class="very-happy"
                      :class="
                        selectedFeedback === '5'
                          ? 'selected-feedback'
                          : 'very-happy'
                      "
                      @click="setRating('5')"
                      ><q-tooltip style="font-size: 12px">
                        Extremely pleased or impressed
                      </q-tooltip></span
                    >
                  </div>

                  <div class="col-12">
                    Your opinion matters! Share your suggestions or concerns
                    with us
                  </div>
                  <div class="col-12">
                    <q-input
                      square
                      dense
                      v-model="Feedbackcmt"
                      outlined
                      type="textarea"
                      rows="2"
                      label="Leave a comment"
                    ></q-input>
                  </div>
                  <div class="col-12" style="text-align-last: center">
                    <q-btn
                      dense
                      class="feedback-btn"
                      @click="SaveFeedback()"
                      label="Submit"
                      :disable="selectedFeedback === ''"
                    ></q-btn>
                  </div>
                </div>
              </q-card>
            </q-dialog>
          </div>
          <DynamicTabs ref="dynamicTabs"></DynamicTabs>
        </q-page-container>
        <!-- <div
        class="q-pa-md morph-container"
        style="height: 1200px; max-height: 80vh"
      >
        <q-btn
          v-morph:btn:mygroup:300.resize="morphGroupModel"
          class="absolute-bottom-right q-ma-md"
          fab
          color="primary"
          size="lg"
          icon="key"
          @click="nextMorph"
        />

        <q-card
          v-morph:card1:mygroup:500.resize="morphGroupModel"
          class="absolute-bottom-right q-ma-md bg-primary text-white"
          style="
            width: 1200px;
            border-bottom-right-radius: 2em;
            min-height: 80%;
          "
        >
          <q-card-section class="text-h6"> New user </q-card-section>

          <q-card-section class="text-subtitle1">
            Please fill the details for a new user.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Close"
              class="absolute-bottom-right q-ma-md"
              @click="nextMorph"
            />
          </q-card-actions>
        </q-card>
      </div> -->
      </q-layout>
    </span>
  </div>
  <q-dialog v-model="showmetabaseDialog" fullscreen persistent>
    <q-card class="q-card_fullwidth">
      <!-- Close Button -->
      <q-card-actions align="right" style="padding: 4px 8px">
        <q-btn flat round icon="close" color="primary" @click="closeDialog" />
      </q-card-actions>

      <!-- ✅ Simple iframe - no web component -->
      <iframe
        v-if="metabaseEmbedUrl"
        :src="metabaseEmbedUrl"
        style="
          width: 100%;
          height: calc(100vh - 48px);
          border: none;
          display: block;
        "
        frameborder="0"
        allowtransparency="true"
      ></iframe>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
//import EssentialLink from "components/EssentialLink.vue";
import CargoNet_API from "/src/IPConfig/config.js";
import Login_API from "/src/IPConfig/configLogin.js";
import DynamicTabs from "pages/DynamicTab.vue";
import Chatbot from "pages/ChatbotFeature.vue";
import { VoiceRegistry } from "src/mixins/voiceActions.js";
import axios from "axios";
import { useQuasar } from "quasar";
import MetabaseService from "src/Services/MetabaseService.js";
import MetabaseConfig from "/src/IPConfig/Metabaseconfig.js";
import { setLayoutMode } from "src/Utils/layoutMode.js";
import Ml2Header from "layouts/mainlayout2/Ml2Header.vue";
import Ml2Sidebar from "layouts/mainlayout2/Ml2Sidebar.vue";

const nextMorphStep = {
  btn: "card1",
  card1: "btn",
};
export default defineComponent({
  name: "MainLayout2",

  components: {
    DynamicTabs,
    Chatbot,
    Ml2Header,
    Ml2Sidebar,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const sidebarCollapsed = ref(
      localStorage.getItem("ml2SidebarCollapsed") === "1"
    );
    // cn-style.css pins `.q-drawer--left.q-drawer--bordered { width: 290px
    // !important }` for the legacy layout — an !important stylesheet rule
    // beats the plain inline width Quasar's own :width prop generates, so
    // the collapsed rail never actually narrowed. Mirror the state onto
    // <html> so cn-theme-ml2.css can override it with a scoped !important
    // rule of its own.
    document.documentElement.setAttribute(
      "data-sidebar",
      sidebarCollapsed.value ? "collapsed" : "expanded"
    );
    const selectedBranch = ref("");
    selectedBranch.value = "Select Branch";
    const morphGroupModel = ref("btn");

    // within tab
    // const linksList = [
    //   {
    //     title: "Job-Neutral",
    //     caption: "Shipment",
    //     icon: "dashboard",
    //     link: "/JobDetailsGrid?FormID=119",
    //   },
    //   {
    //     title: "Master BL",
    //     caption: "Shipment",
    //     icon: "dashboard",
    //     link: "/JobDetailsGrid?FormID=4&MasterBL=true",
    //   },
    //   {
    //     title: "Purchase Bill",
    //     caption: "Voucher",
    //     icon: "dashboard",
    //     link: "/VoucherDetails?FormID=1004",
    //   },
    // ];

    return {
      // linksList,
      selectedBranch,
      leftDrawerOpen,
      sidebarCollapsed,
      componentOpen: false,
      // One button drives both behaviors: on desktop the sidebar is always
      // visible, so the header's menu icon collapses it to an icon-only
      // rail; on mobile/tablet it's an overlay, so the same icon opens/
      // closes it instead. No separate collapse button needed.
      toggleLeftDrawericon() {
        if ($q.screen.width > 1024) {
          sidebarCollapsed.value = !sidebarCollapsed.value;
          localStorage.setItem(
            "ml2SidebarCollapsed",
            sidebarCollapsed.value ? "1" : "0"
          );
          document.documentElement.setAttribute(
            "data-sidebar",
            sidebarCollapsed.value ? "collapsed" : "expanded"
          );
        } else {
          leftDrawerOpen.value = !leftDrawerOpen.value;
        }
      },
      morphGroupModel,
      nextMorph() {
        morphGroupModel.value = nextMorphStep[morphGroupModel.value];
      },
    };
  },
  data() {
    return {
      //Metabase
      metabaseToken: "", // ✅ JWT token goes here
      currentMenuName: "",
      showmetabaseDialog: false,
      metabaseInstanceUrl: "",
      ShowMetabaseLogin: false,
      //Metabase end
      recognition: null, // ✅ MUST EXIST
      isListening: false,
      activeTabLabel: "",
      loading: true,
      items: [],
      parentMenu: [],
      // childMenu: [],
      selectedColor: "",

      showDialog: false,

      externalUrl: "",
      tabcount: 0,
      Loginid: 0,
      Logstatus: "",
      interval: 0,
      morphOptions: {
        type: "scale",
        duration: 500,
        timingFunction: "ease-in-out",
      },
      showkeydialog: false,
      searchMenu: "",
      selectedMenu: "",
      filterText: "",
      lastActivityMessage: "",
      isVisible: true,
      classChanged: false,
      feedbackdialog: false,
      Feedbackcmt: "",
      selectedFeedback: "",
      shortcuts: [
        { label: "New", key: "N" },
        { label: "Save", key: "S" },
        { label: "Print", key: "P" },
        { label: "Reset", key: "R" },
        { label: "Search", key: "Z" },
      ],
      ShowChat: false,
      opCurrentFinancialYear: [],
      CurrentFinYear: 0,
      crmparty: [],
    };
  },
  mounted() {
    // Simulate loading delay
    setTimeout(() => {
      this.loading = false; // Set loading to false after a delay of 2 seconds
      this.showanime = false;
    }, 2000);
    setTimeout(() => {
      this.classChanged = true;
    }, 4000);
    if (this.$q.screen.width <= 1024) {
      this.leftDrawerOpen = false;
    }
    // Restore saved theme (VS Code theme takes priority over color theme)
    const savedVSTheme = localStorage.getItem("vsTheme");
    if (savedVSTheme === "cn-aurora") {
      this.setAuroraTheme(localStorage.getItem("auroraAccent") || "violet");
    } else if (savedVSTheme) {
      this.setTheme(savedVSTheme);
    } else {
      const storedColor = localStorage.getItem("color");
      if (storedColor) {
        this.color = storedColor;
        this.changeColor(this.color);
      } else {
        // Default color - Arun
        this.color = "#0178bc";
        this.changeColor(this.color);
      }
    }

    let email = sessionStorage.getItem("APIEmail");
    if (email !== "icodeadmin" || email !== "ICTQRAdmin") {
      this.interval = setInterval(this.Getloginstatus, 300000);
    }
    // Add event listeners for user activity
    this.updateLastActivity = this.updateLastActivity.bind(this);
    window.addEventListener("mousemove", this.updateLastActivity);
    window.addEventListener("scroll", this.updateLastActivity);
    window.addEventListener("click", this.updateLastActivity);
    // Ctrl/Cmd+K opens the existing sidebar menu search — no new search feature
    this.handleGlobalKeydown = this.handleGlobalKeydown.bind(this);
    window.addEventListener("keydown", this.handleGlobalKeydown);
    //Below method is used to load the current financial year to show on top bar
    this.LoadCurrentFinancialYear();
    this.loadMetabase();
    this.GetMetabaseLoginConfig();
    this.GetCRMPartyData();
    this.$nextTick(this.refreshActiveTabLabel);
  },
  created() {
    this.username = sessionStorage.getItem("APIEmail");

    this.usertype = sessionStorage.getItem("APIUserType");
    this.fetchData();
  },
  computed: {
    metabaseEmbedUrl() {
      if (!this.metabaseToken || !this.metabaseInstanceUrl) return "";
      return `${this.metabaseInstanceUrl}embed/dashboard/${this.metabaseToken}#theme=light&bordered=false&titled=true`;
    },
    userShort() {
      if (!this.username) return "";
      const matches = this.username.match(/[A-Z]/g);
      return matches
        ? matches.slice(0, 2).join("")
        : this.username.substring(0, 2).toUpperCase();
    },
    filteredMenu() {
      if (!this.filterText) {
        return this.searchMenu; // Return all items if filter text is empty
      }

      if (this.searchMenu) {
        const lowerFilterText = this.filterText.toLowerCase();
        return this.searchMenu.filter((child) =>
          child.MenuDesc.toLowerCase().includes(lowerFilterText)
        );
      } else {
        return "";
      }
    },
    getanimecls() {
      // return "anime";
      return this.classChanged ? "anime-rm" : "anime";
    },
  },
  provide() {
    return {
      handleLinkClick: this.handleLinkClick,
      openDashboardByMenuName: this.openDashboardByMenuName,
    };
  },

  beforeUnmount() {
    // Clean up event listeners when component is destroyed
    window.removeEventListener("mousemove", this.updateLastActivity);
    window.removeEventListener("scroll", this.updateLastActivity);
    window.removeEventListener("click", this.updateLastActivity);
    window.removeEventListener("keydown", this.handleGlobalKeydown);

    // Clear any intervals
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  watch: {
    "$q.screen.width": {
      immediate: true,
      handler(val) {
        this.applyDrawerPadding(val, this.leftDrawerOpen);
      },
    },

    leftDrawerOpen(val) {
      this.applyDrawerPadding(this.$q.screen.width, val);
    },

    sidebarCollapsed() {
      this.applyDrawerPadding(this.$q.screen.width, this.leftDrawerOpen);
    },
  },
  methods: {
    async GetMetabaseLoginConfig() {
      try {
        const configRes = await axios.get(
          `${CargoNet_API}/Configuration/cargonetconfigflag/ShowMetabaseLogin`
        );
        const metabase = configRes.data.find(
          (x) => x.Name === "ShowMetabaseLogin"
        );
        this.ShowMetabaseLogin = metabase?.Flag === "Y";

        // ✅ Only fetch instance URL if flag is Y
        if (this.ShowMetabaseLogin) {
          await this.loadMetabase();
        }
      } catch (error) {
        console.error("Error fetching Metabase config:", error);
      }
    },

    openMetabaseLogin() {
      const url = this.metabaseInstanceUrl;
      window.open(url, "_blank");
    },
    async loadMetabase() {
      // ✅ Use hardcoded or config-based URL — no API call needed here

      this.metabaseInstanceUrl = MetabaseConfig.instanceUrl;

      const script = document.createElement("script");
      script.src = `${this.metabaseInstanceUrl}app/embed.js`;
      script.defer = true;
      document.head.appendChild(script);

      window.defineMetabaseConfig = function (config) {
        window.metabaseConfig = config;
      };

      window.defineMetabaseConfig({
        theme: { preset: "light" },
        isGuest: true,
        instanceUrl: this.metabaseInstanceUrl,
      });
    },
    filtermenus() {
      const userid = sessionStorage.getItem("APIUserID");
      const branchid = sessionStorage.getItem("BranchID");
      axios
        .get(
          `${CargoNet_API}/branches/${userid}/${branchid}/${this.filterText}`
        )
        .then((res) => {
          this.searchMenu = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    applyDrawerPadding(val, isOpen) {
      setTimeout(() => {
        const page = document.querySelector(".q-page-container");
        if (!page) return;

        // Mobile & tablet
        if (val <= 1024) {
          page.style.paddingLeft = "0px";
          return;
        }

        // Drawer closed
        if (!isOpen) {
          page.style.paddingLeft = "0px";
          return;
        }

        // Collapsed to icon-only rail — matches the 68px rail width
        if (this.sidebarCollapsed) {
          page.style.paddingLeft = "68px";
          return;
        }

        // Medium desktop (1200px–1499px) — drawer width + extra gutter
        if (val >= 1200 && val < 1500) {
          this.leftDrawerOpen = true;
          page.style.paddingLeft = "250px";
          return;
        }

        // Medium desktop (1500px–1700px)
        if (val >= 1500 && val < 1700) {
          this.leftDrawerOpen = true;
          page.style.paddingLeft = "260px";
          return;
        }

        // Large desktop (1700px+)
        if (val >= 1700) {
          this.leftDrawerOpen = true;
          page.style.paddingLeft = "302px";
        }
      }, 50); // 👈 key fix
    },

    "$q.screen.width"(val) {
      if (val <= 1024) {
        this.leftDrawerOpen = false;
      } else {
        this.leftDrawerOpen = true;
      }
    },

    startVoiceAssistant() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SR) {
        this.$q.notify({
          message: "Speech recognition not supported",
          // type: "negative",
          position: "center",
          classes: "negative-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        return;
      }

      // stop previous instance cleanly
      if (this.recognition) {
        try {
          this.recognition.onend = null;
          this.recognition.onerror = null;
          this.recognition.stop();
        } catch {}
      }

      this.recognition = new SR();
      this.recognition.lang = "en-IN";
      this.recognition.interimResults = false;
      this.recognition.continuous = false;

      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        console.log("🎤 Heard:", text);

        VoiceRegistry.dispatch(text, this.$route);
      };

      this.recognition.onerror = (e) => {
        console.error("🎙 Voice error", e);
        this.isListening = false;
      };

      // ✅ SAFE auto-restart AFTER completion
      this.recognition.onend = () => {
        console.log("🎙 Mic ended → restarting");
        this.isListening = false;

        setTimeout(() => {
          try {
            this.isListening = true;
            this.recognition.start();
          } catch {}
        }, 400);
      };

      this.isListening = true;
      this.recognition.start();
    },
    feedbackdialogbox() {
      this.feedbackdialog = true;
    },
    clsfeedback() {
      this.feedbackdialog = false;
      this.selectedFeedback = "";
      this.Feedbackcmt = "";
    },
    setRating(value) {
      this.selectedFeedback = value;
    },
    SaveFeedback() {
      const userid = sessionStorage.getItem("APIUserID");
      const branchid = sessionStorage.getItem("BranchID");

      const res = axios
        .post(`${CargoNet_API}/feedback`, {
          Id: userid,
          Branchid: branchid,
          Rating: this.selectedFeedback ? this.selectedFeedback : "No Rating",
          Comments: this.Feedbackcmt ? this.Feedbackcmt : "No Comments",
        })
        .then((res) => {
          this.$q.notify({
            message: "Thanks for taking the time to share your views",
            color: "positive",
            position: "center",
            classes: "positive-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
          });
          this.feedbackdialog = false;
          this.Feedbackcmt = "";
          this.selectedFeedback = 0;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateLastActivity(event) {
      let activityType = "";
      // if (event.type === "mousemove") {
      //   activityType = "Mouse";
      // } else if (event.type === "scroll") {
      //   activityType = "Scroll";
      // } else
      if (event.type === "click") {
        activityType = "Click";
        this.lastActivityMessage = `Click Activity: ${new Date().toLocaleTimeString()}`;
      }
      if (this.$refs.dynamicTabs && this.$refs.dynamicTabs !== null) {
        if (
          this.$refs.dynamicTabs.openTabs &&
          this.$refs.dynamicTabs.openTabs.length >= 7
        ) {
          this.isVisible = false;
        } else {
          this.isVisible = true;
        }
      } else {
        this.isVisible = true;
      }
      this.refreshActiveTabLabel();
    },
    // Static breadcrumb label, best-effort refreshed on user activity —
    // purely presentational, reads from the existing DynamicTabs ref.
    refreshActiveTabLabel() {
      const tabs = this.$refs.dynamicTabs;
      if (!tabs || !tabs.openTabs) return;
      const active = tabs.openTabs.find((t) => t.id === tabs.activeTab);
      this.activeTabLabel = active ? active.tablabel : "";
    },
    // Ctrl/Cmd+K opens the existing sidebar menu search box.
    handleGlobalKeydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        this.onOpenMenuSearch();
      }
    },
    onOpenMenuSearch() {
      this.leftDrawerOpen = true;
      if (this.sidebarCollapsed) {
        this.sidebarCollapsed = false;
        localStorage.setItem("ml2SidebarCollapsed", "0");
        document.documentElement.setAttribute("data-sidebar", "expanded");
      }
      this.$nextTick(() => {
        this.$refs.ml2Sidebar?.focusSearch();
      });
    },
    filterMenuList() {
      if (!this.filterText) {
        return this.searchMenu; // Return all items if filter text is empty
      }
      const lowerFilterText = this.filterText.toLowerCase();
      return this.searchMenu.filter((child) =>
        child.MenuDesc.toLowerCase().includes(lowerFilterText)
      );
    },
    closeDialog() {
      this.showDialog = false;
      this.showmetabaseDialog = false;
      this.metabaseToken = "";
    },
    showDropdown(parent) {
      parent.showDropdown = true;
    },
    reloadPage() {
      // If running in client-side mode, trigger a full page reload
      this.$router.push({ name: "IndexPage" });
      this.componentOpen = false;
    },
    // fetchData() {
    //   this.loading = true;
    //   const userid = sessionStorage.getItem("APIUserID");

    //   fetch(`${CargoNet_API}/branches/` + userid)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       this.items = data;
    //       if (this.items.length > 0) {
    //         if (!sessionStorage.getItem("BranchID")) {
    //           this.selectedBranch = this.items[0].BranchName;
    //           const branchid = this.items[0].BranchID;
    //           sessionStorage.setItem("BranchID", branchid);
    //           this.fetchParentMenu(userid, branchid);
    //         } else {
    //           const SB = this.items.find(
    //             (item) => item.BranchID === sessionStorage.getItem("BranchID")
    //           );
    //           this.selectedBranch = SB.BranchName;
    //           const branchid = SB.BranchID;
    //           sessionStorage.setItem("BranchID", branchid);
    //           this.fetchParentMenu(userid, branchid);
    //         }
    //       }
    //     });
    //   this.loading = false;
    // },
    async fetchData() {
      this.loading = true;
      const userid = sessionStorage.getItem("APIUserID");

      await axios
        .get(`${CargoNet_API}/branches/${userid}`)
        .then((response) => {
          this.items = response.data;

          if (this.items.length > 0) {
            if (!sessionStorage.getItem("BranchID")) {
              this.selectedBranch = this.items[0].BranchName;
              const branchid = this.items[0].BranchID;
              sessionStorage.setItem("BranchID", branchid);
              this.fetchParentMenu(userid, branchid);
            } else {
              const SB = this.items.find(
                (item) => item.BranchID === sessionStorage.getItem("BranchID")
              );
              this.selectedBranch = SB?.BranchName;
              const branchid = SB?.BranchID;
              sessionStorage.setItem("BranchID", branchid);
              this.fetchParentMenu(userid, branchid);
            }
          }

          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
          this.loading = false;
        });
    },
    // toggleDropdown(parent) {
    //   parent.showDropdown = !parent.showDropdown;
    //   if (parent.showDropdown && parent.children.length === 0) {
    //     const userid = sessionStorage.getItem("APIUserID");
    //     const branchid = sessionStorage.getItem("BranchID");
    //     const menuCode = parent.MenuCode;
    //     this.fetchChildMenu(userid, branchid, menuCode);

    //   }
    // },
    async toggleDropdown(parent) {
      const userid = sessionStorage.getItem("APIUserID");
      if (!sessionStorage.getItem("BranchID")) {
        this.selectedBranch = this.items[0].BranchName;
        const branchid = this.items[0].BranchID;
        sessionStorage.setItem("BranchID", branchid);
        this.fetchParentMenu(userid, branchid);
      }
      parent.showDropdown = !parent.showDropdown;
      if (parent.showDropdown && parent.children.length === 0) {
        const userid = sessionStorage.getItem("APIUserID");
        const branchid = sessionStorage.getItem("BranchID");
        const menuCode = parent.MenuCode;

        parent.loading = true;

        try {
          // Fetch both child menus in parallel to reduce wait time
          const [childMenu1, childMenu2] = await Promise.all([
            this.fetchChildMenu(userid, branchid, menuCode),
            this.fetchChildMenu(userid, branchid, "Report" + menuCode),
          ]);

          // Merge the child menus into a single array
          // NVOCC Page Menu Changes
          const mergedChildMenus = [
            ...(childMenu1 || []),
            ...(childMenu2 || []),
          ].map((child) => ({
            ...child,
            ParentMenuName: parent.MenuName,
          }));

          this.searchMenu = mergedChildMenus;
          // Directly update the specific parent object (reactive)
          parent.children = mergedChildMenus;
        } catch (err) {
          console.error("Error loading child menus:", err);
        } finally {
          parent.loading = false;
        }
      }
    },

    toggleLeftDrawer(link) {
      if (!this.selectedBranch) {
        alert("Please select a branch first.");

        return;
      }
      this.leftDrawerOpen = false;
      this.selectedItem = link.title;
      this.$router.push({ path: link.path });
    },

    // handleLinkClick(link) {
    //   if (this.selectedBranch == "Select Branch") {
    //     this.AlertMethod();
    //     return false;
    //   }
    //   this.componentOpen = true;
    // },
    truncateText(text, length) {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    },

    Logout() {
      let UId = sessionStorage.getItem("uniqueid");
      let email = sessionStorage.getItem("APIEmail");
      if (
        this.Loginid.toString() === UId ||
        email === "icodeadmin" ||
        email === "ICTQRAdmin" ||
        email === "demo"
      ) {
      } else {
        this.$router.push({ path: "/" });
      }
    },

    async Getloginstatus() {
      let email = sessionStorage.getItem("APIEmail");
      await axios
        .get(`${Login_API}/Login/${email}/getloginstatus`)
        .then((res) => {
          this.Loginid = res.data[0].Logid;
          this.Logstatus = res.data[0].LogStatus;
        })
        .catch((err) => {
          console.log(err);
        });
      this.Logout();
    },
    goHome() {
      this.$refs.dynamicTabs.openTab("/DMSDashboard", "Home");
    },
    // Looks up a menu entry (e.g. "Customer Analysis") by its label across
    // the already-loaded sidebar menu tree, and opens it the same way a
    // sidebar click would — used by pages like ReportsDashboard that need to
    // jump straight to a specific Metabase dashboard without knowing its
    // underlying dashboard key.
    openDashboardByMenuName(menuName) {
      if (!menuName) return false;
      const target = menuName.trim().toLowerCase();
      for (const parent of this.parentMenu || []) {
        const match = (parent.children || []).find(
          (child) =>
            child.MenuDesc && child.MenuDesc.trim().toLowerCase() === target
        );
        if (match) {
          this.handleLinkClick(match);
          return true;
        }
      }
      return false;
    },
    async handleLinkClick(child) {
      // if (this.$q.screen.lt.md) {
      this.toggleLeftDrawericon();
      // }
      this.Getloginstatus();
      if (this.selectedBranch === "Select Branch") {
        this.AlertMethod();
        return false;
      }
      //Metabase
      // ✅ Metabase dashboard
      if (
        child.Link &&
        !child.Link.startsWith("/") &&
        !child.Link.startsWith("http") &&
        !child.Link.startsWith("#")
      ) {
        // ✅ Save BEFORE opening tab
        sessionStorage.setItem("currentDashboardKey", child.Link);

        // console.log("Saved key:", child.Link);
        // console.log("Check:", sessionStorage.getItem("currentDashboardKey"));

        this.componentOpen = true;
        this.tabcount = this.tabcount + 1;

        const label = child.MenuDesc;
        const newTabComponent = `MetabaseDashboard`;

        this.$refs.dynamicTabs.openTab(newTabComponent, label);
        this.filterText = "";
        return;
      }

      // ✅ External http
      if (child.Link && child.Link.startsWith("http")) {
        this.componentOpen = true;
        this.tabcount = this.tabcount + 1;

        const label = child.MenuDesc;

        // ✅ Save URL so tab component can use it
        sessionStorage.setItem("currentExternalUrl", child.Link);

        const newTabComponent = `ExternalUrl`;
        this.$refs.dynamicTabs.openTab(newTabComponent, label);
        this.filterText = "";
        return;
      }

      // Handle non-external URL child menu click
      this.componentOpen = true;
      // Perform your usual navigation logic here

      this.tabcount = this.tabcount + 1;

      const label =
        // "T" + this.tabcount + " - " +
        child.Modulecode + " - " + child.MenuDesc + " Details";

      const id = Date.now();
      // const url = new URL(child.Link, window.location.origin);
      // url.searchParams.set("id", "1");

      // NVOCC Page Menu Changes
      const owningParent = (this.parentMenu || []).find((parent) =>
        (parent.children || []).some(
          (menu) =>
            menu.Link === child.Link && menu.MenuDesc === child.MenuDesc
        )
      );
      const newTabComponent = {
        path: `${child.Link}`,
        moduleName:
          child.ParentMenuName || owningParent?.MenuName || child.Modulecode,
      }; //child.Link + "&id=" + id;
      this.$refs.dynamicTabs.openTab(newTabComponent, label);
      // if (this.$refs.dynamicTabs.tabs.length < 11) {
      //   if (this.$refs.dynamicTabs.tabs.length < 10) {
      //     this.$refs.dynamicTabs.addNewTab(label, newTabComponent, id, "I");
      //     sessionStorage.setItem("Watchcount", 0);
      //     sessionStorage.setItem("load", 0);
      //   } else {
      //     this.$q.notify({
      //       message: "Tab limit exceeded. You can have a maximum of 10 tabs.",
      //       color: "red",
      //       position: "center",
      //       classes: "text-body24 font-weight-bold q-py-md q-px-lg",
      //       style: "font-size: 240px",
      //     });
      //     return;
      //   }
      // } else {
      //   this.$q.notify({
      //     message: "Tab limit exceeded. You can have a maximum of 10 tabs.",
      //     color: "red",
      //     position: "center",
      //     classes: "text-body24 font-weight-bold q-py-md q-px-lg",
      //     style: "font-size: 240px",
      //   });
      //   this.$refs.dynamicTabs.tabexceed = true;
      //   return;
      // }
      //     style: "font-size: 240px",
      //   });
      //   this.$refs.dynamicTabs.tabexceed = true;
      //   return;
      // }
      //     style: "font-size: 240px",
      //   });
      //   this.$refs.dynamicTabs.tabexceed = true;
      //   return;
      // }
      this.filterText = "";
    },
    // onItemClick(item) {
    //
    //   if (this.componentOpen) {
    //     // this.$q.notify({
    //     //   message:
    //     const newTabComponent = `${child.Link}?id=${id}`; //child.Link + "&id=" + id;
    //     if (this.$refs.dynamicTabs.tabs.length < 11) {
    //       if (this.$refs.dynamicTabs.tabs.length < 10) {
    //         this.$refs.dynamicTabs.addNewTab(label, newTabComponent, id, "I");
    //         sessionStorage.setItem("Watchcount", 0);
    //         sessionStorage.setItem("load", 0);
    //       } else {
    //         this.$q.notify({
    //           message: "Tab limit exceeded. You can have a maximum of 10 tabs.",
    //           color: "red",
    //           position: "center",
    //           classes: "text-body24 font-weight-bold q-py-md q-px-lg",
    //           style: "font-size: 240px",
    //         });
    //         return;
    //       }
    //     } else {
    //       this.$q.notify({
    //         message: "Tab limit exceeded. You can have a maximum of 10 tabs.",
    //         color: "red",
    //         position: "center",
    //         classes: "text-body24 font-weight-bold q-py-md q-px-lg",
    //         style: "font-size: 240px",
    //       });
    //       this.$refs.dynamicTabs.tabexceed = true;
    //       return;
    //     }
    //     this.filterText = "";
    //   }
    // },

    onItemClick(item) {
      if (this.componentOpen) {
        // this.$q.notify({
        //   message:
        //     "Please click the logo in the top left corner to move to the IndexPage before changing the branch.",
        //   color: "negative",
        //   position: "center",
        //   classes: "text-body24 font-weight-bold q-py-md q-px-lg",
        //   style: "font-size: 240px",
        // });
        // return; // Exit the function if the component is open
        if (this.$refs.dynamicTabs.openTabs.length > 1) {
          this.$q.notify({
            message: "Please Close All the Tabs Before Changing the Branch",
            color: "negative",
            position: "center",
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
          });
          return;
        }
      }
      if (!item || !item.BranchID || !item.BranchName) {
        return; // Exit the function if item or its properties are null or undefined
      }

      this.selectedBranch = item.BranchName;

      // Update items array with selected item
      this.items = this.items.map((i) =>
        i.BranchID === item.BranchID
          ? { ...i, selected: true }
          : { ...i, selected: false }
      );
      sessionStorage.setItem("BranchID", item.BranchID);
    },
    AlertMethod() {
      this.$q.notify({
        message: "Please select a branch first.",
        color: "negative",
        position: "center",
        classes: "negative-alert", // swap per type
        actions: [{ icon: "close", round: true, dense: true }],
      });
    },
    Openchat() {
      this.ShowChat = !this.ShowChat;
      sessionStorage.setItem("ShowChat", this.ShowChat);
    },
    handleLogout() {
      // Explicitly clear the full login/session state before redirecting to the
      // logged-out screen. This prevents stale auth data surviving in the
      // Cordova build where sessionStorage is backed by localStorage.
      sessionStorage.clear();

      // data-theme="ml2" (set on <html> when this layout mounted) isn't
      // cleared just by navigating away — it lingers into the post-logout
      // login screen (LoginPageMl2, since layoutMode itself stays "v2" and
      // rightly should). cn-theme-ml2.css's generic [data-theme="ml2"]
      // .q-card rule then leaks onto that page's own .login-box card,
      // fighting its custom gradient/blur styling — the login card renders
      // differently after logout than it does on a fresh "/" visit, where
      // this attribute was never set. Strip it (but NOT layoutMode itself,
      // unlike goToLayout1 — the ml2 login design should still show).
      const root = document.documentElement;
      if (root.getAttribute("data-theme") === "ml2") {
        root.removeAttribute("data-theme");
        root.removeAttribute("data-accent");
        root.removeAttribute("data-menu-color");
        root.removeAttribute("data-header-color");
        root.removeAttribute("data-color-mode");
        root.removeAttribute("data-layout-width");
      }

      this.$router.replace("/Logout=Y");
    },
    async fetchParentMenu(userid, branchid) {
      this.loading = true;
      try {
        const response = await axios.get(
          `${Login_API}/Login/${userid}/${branchid}`
        );
        const parentMenu = response.data;
        // Add a loading flag and empty children for each parent
        this.parentMenu = parentMenu.map((parent) => {
          return {
            ...parent,
            showDropdown: false,
            children: [],
            loading: false,
          };
        });

        // Prefetch child menus in background (parallel for each parent)
        this.parentMenu.forEach(async (p) => {
          p.loading = true;
          try {
            const [child1, child2] = await Promise.all([
              this.fetchChildMenu(userid, branchid, p.MenuCode),
              this.fetchChildMenu(userid, branchid, "Report" + p.MenuCode),
            ]);
            // NVOCC Page Menu Changes
            p.children = [...(child1 || []), ...(child2 || [])].map(
              (child) => ({
                ...child,
                ParentMenuName: p.MenuName,
              })
            );
          } catch (err) {
            console.error(
              "Error prefetching child menus for ",
              p.MenuCode,
              err
            );
          }
          p.loading = false;
        });
      } catch (error) {
        console.error("Error fetching parent menu:", error);
      }
      this.loading = false;
    },

    // async fetchChildMenu(userid, branchid, menuCode) {
    //   try {
    //     const response = await axios.get(
    //       `${Login_API}/Login/${userid}/${branchid}/${menuCode}`
    //     );
    //     const childMenu = response.data;
    //     this.parentMenu = this.parentMenu.map((parent) => {
    //       if (parent.MenuCode === menuCode) {
    //         return {
    //           ...parent,
    //           children: childMenu,
    //         };
    //       } else {
    //         return parent;
    //       }
    //     });
    //   } catch (error) {
    //     console.error("Error fetching child menu:", error);
    //   }
    // },
    async fetchChildMenu(userid, branchid, menuCode) {
      try {
        const response = await axios.get(
          `${Login_API}/Login/${userid}/${branchid}/${menuCode}`
        );
        const childMenu = response.data;
        return childMenu;
      } catch (error) {
        console.error("Error fetching child menu:", error);
        return [];
      }
    },
    //Below method is used to load the current financial year to show on top bar
    LoadCurrentFinancialYear() {
      axios
        .get(`${CargoNet_API}/financialyear/currentfinyear`)
        .then((res) => {
          this.opCurrentFinancialYear = res.data.map((optionFY) => ({
            label: optionFY.CurrentFinYear,
            value: optionFY.ID,
          }));

          if (this.opCurrentFinancialYear.length > 0) {
            this.CurrentFinYear = this.opCurrentFinancialYear[0].label;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async GetCRMPartyData() {
      this.loading = true;
      const userid = sessionStorage.getItem("APIUserID");
      if (this.usertype !== "C") {
        return; // Exit the function if usertype is not 'C'
      }
      await axios
        .get(`${CargoNet_API}/branches/crmparty/${userid}`)
        .then((response) => {
          this.crmparty = response.data[0].PartyName;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
          this.loading = false;
        });
    },

    // Aurora theme switcher — dark theme with selectable accent color
    setAuroraTheme(accent) {
      ["cn-expansion-style", "cn-quasar-style"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
      const oldOverride = document.getElementById("cn-theme-override");
      if (oldOverride) oldOverride.remove();

      document.documentElement.setAttribute("data-theme", "cn-aurora");
      document.documentElement.setAttribute("data-accent", accent);
      localStorage.setItem("vsTheme", "cn-aurora");
      localStorage.setItem("auroraAccent", accent);
      localStorage.removeItem("color");
    },

    // VS Code-inspired theme switcher — full page override
    setTheme(themeName) {
      document.documentElement.removeAttribute("data-accent");
      ["cn-expansion-style", "cn-quasar-style"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
      document.documentElement.setAttribute("data-theme", themeName);
      localStorage.setItem("vsTheme", themeName);
      localStorage.removeItem("color");

      const tokens = {
        // Professional dark — high contrast, easy on the eyes (ERP standard)
        "vs-dark": {
          pageBg: "#1e1e2e",
          pageText: "#e8e8ec",
          cardBg: "#27293d",
          cardBorder: "#3a3d52",
          tableTh: "#2f3147",
          tableThText: "#ffffff",
          tableRowHover: "#33364d",
          inputBg: "#2a2c40",
          inputText: "#f0f0f4",
          inputBorder: "#4a4d63",
          inputLabel: "#b8bcd0",
          accentColor: "#4f9cf9",
          headerBg: "#1a1b2a",
          headerText: "#ffffff",
          headerBtnBg: "#3257a8",
          headerBtnText: "#ffffff",
          drawerBg: "#24263a",
          activeBg: "#3257a8",
          activeText: "#ffffff",
          hoverBg: "#33364d",
          hoverText: "#ffffff",
          contentBg: "#1e1e2e",
          iconBg: "#2f3147",
          linkColor: "#7db8ff",
          menuColor: "#e0e2ee",
          iconFilter: "brightness(0) invert(0.92)",
          tabBg: "#1a1b2a",
          tabText: "#c5c8da",
          tabActiveBg: "#27293d",
          scrollThumb: "#4a4d63",
        },
        // Slate — corporate blue-grey, very readable
        monokai: {
          pageBg: "#1b2735",
          pageText: "#eef2f7",
          cardBg: "#22344a",
          cardBorder: "#34506b",
          tableTh: "#2a4159",
          tableThText: "#ffffff",
          tableRowHover: "#2e4660",
          inputBg: "#243a52",
          inputText: "#f2f6fb",
          inputBorder: "#3d5a78",
          inputLabel: "#b2c4d8",
          accentColor: "#3ba7e0",
          headerBg: "#14202c",
          headerText: "#ffffff",
          headerBtnBg: "#1f6fb2",
          headerBtnText: "#ffffff",
          drawerBg: "#1d2e40",
          activeBg: "#1f6fb2",
          activeText: "#ffffff",
          hoverBg: "#2e4660",
          hoverText: "#ffffff",
          contentBg: "#1b2735",
          iconBg: "#2a4159",
          linkColor: "#6fc3ec",
          menuColor: "#e6edf4",
          iconFilter: "brightness(0) invert(0.92)",
          tabBg: "#14202c",
          tabText: "#bcccdb",
          tabActiveBg: "#22344a",
          scrollThumb: "#3d5a78",
        },
        // Carbon — neutral charcoal, GitHub-dark inspired
        dracula: {
          pageBg: "#1c2128",
          pageText: "#e6edf3",
          cardBg: "#252b33",
          cardBorder: "#3d444d",
          tableTh: "#2d333b",
          tableThText: "#ffffff",
          tableRowHover: "#30363d",
          inputBg: "#2a3038",
          inputText: "#eef2f6",
          inputBorder: "#444c56",
          inputLabel: "#b6c2cd",
          accentColor: "#539bf5",
          headerBg: "#171b21",
          headerText: "#ffffff",
          headerBtnBg: "#316dca",
          headerBtnText: "#ffffff",
          drawerBg: "#22272e",
          activeBg: "#316dca",
          activeText: "#ffffff",
          hoverBg: "#30363d",
          hoverText: "#ffffff",
          contentBg: "#1c2128",
          iconBg: "#2d333b",
          linkColor: "#6cb6ff",
          menuColor: "#e0e6ed",
          iconFilter: "brightness(0) invert(0.9)",
          tabBg: "#171b21",
          tabText: "#bac4cf",
          tabActiveBg: "#252b33",
          scrollThumb: "#444c56",
        },
        // Teal — professional dark teal/green ERP
        "solarized-dark": {
          pageBg: "#102a2e",
          pageText: "#e3eeec",
          cardBg: "#163b40",
          cardBorder: "#2a565c",
          tableTh: "#1c474d",
          tableThText: "#ffffff",
          tableRowHover: "#1f4e54",
          inputBg: "#173c41",
          inputText: "#eef5f4",
          inputBorder: "#2f5e64",
          inputLabel: "#a8c8c6",
          accentColor: "#2bb3a3",
          headerBg: "#0c2225",
          headerText: "#ffffff",
          headerBtnBg: "#1c8a7d",
          headerBtnText: "#ffffff",
          drawerBg: "#123236",
          activeBg: "#1c8a7d",
          activeText: "#ffffff",
          hoverBg: "#1f4e54",
          hoverText: "#ffffff",
          contentBg: "#102a2e",
          iconBg: "#1c474d",
          linkColor: "#4fd1bf",
          menuColor: "#dcebe9",
          iconFilter: "brightness(0) invert(0.9)",
          tabBg: "#0c2225",
          tabText: "#a8c8c6",
          tabActiveBg: "#163b40",
          scrollThumb: "#2f5e64",
        },
        // Nord — soft frost blue, low eye strain
        nord: {
          pageBg: "#2e3440",
          pageText: "#eceff4",
          cardBg: "#3b4252",
          cardBorder: "#4c566a",
          tableTh: "#434c5e",
          tableThText: "#ffffff",
          tableRowHover: "#474f63",
          inputBg: "#3b4252",
          inputText: "#eceff4",
          inputBorder: "#4c566a",
          inputLabel: "#c8d0de",
          accentColor: "#88c0d0",
          headerBg: "#272c36",
          headerText: "#ffffff",
          headerBtnBg: "#5e81ac",
          headerBtnText: "#ffffff",
          drawerBg: "#343b49",
          activeBg: "#5e81ac",
          activeText: "#ffffff",
          hoverBg: "#474f63",
          hoverText: "#ffffff",
          contentBg: "#2e3440",
          iconBg: "#434c5e",
          linkColor: "#8fbcbb",
          menuColor: "#e5e9f0",
          iconFilter: "brightness(0) invert(0.92)",
          tabBg: "#272c36",
          tabText: "#c8d0de",
          tabActiveBg: "#3b4252",
          scrollThumb: "#4c566a",
        },
        // Clean Light — professional white ERP, soft grey accents
        "github-light": {
          pageBg: "#f4f6f9",
          pageText: "#1f2937",
          cardBg: "#ffffff",
          cardBorder: "#d8dee6",
          tableTh: "#eef1f6",
          tableThText: "#0f3a6b",
          tableRowHover: "#eef4fb",
          inputBg: "#ffffff",
          inputText: "#1f2937",
          inputBorder: "#cbd3dd",
          inputLabel: "#4a5568",
          accentColor: "#1565c0",
          headerBg: "#0f3a6b",
          headerText: "#ffffff",
          headerBtnBg: "#1565c0",
          headerBtnText: "#ffffff",
          drawerBg: "#ffffff",
          activeBg: "#e3f0fd",
          activeText: "#0f3a6b",
          hoverBg: "#eef4fb",
          hoverText: "#0f3a6b",
          contentBg: "#f4f6f9",
          iconBg: "#eef1f6",
          linkColor: "#1565c0",
          menuColor: "#1f2937",
          iconFilter: "none",
          tabBg: "#e8edf3",
          tabText: "#4a5568",
          tabActiveBg: "#ffffff",
          scrollThumb: "#c2cad4",
        },
      };
      const t = tokens[themeName] || tokens["vs-dark"];

      let ov = document.getElementById("cn-theme-override");
      if (!ov) {
        ov = document.createElement("style");
        ov.id = "cn-theme-override";
        document.head.appendChild(ov);
      }
      ov.innerHTML = `
        /* ── PAGE BACKGROUND ── */
        body, .q-page, .q-page-container, .q-layout {
          background-color: ${t.pageBg} !important;
          color: ${t.pageText} !important;
        }

        /* ── HEADER ── */
        .q-header, .top-bar, .q-header .q-toolbar {
          background-color: ${t.headerBg} !important;
          box-shadow: none !important;
          color: ${t.headerText} !important;
        }
        /* Header buttons — all variants */
        .q-header .q-btn:not(.q-btn--flat),
        .q-header .q-fab,
        .q-header .q-btn-dropdown,
        .top-bar .q-btn:not(.q-btn--flat),
        .top-bar .q-fab,
        .top-bar .q-btn-dropdown,
        .lifting-btn, .no-hover {
          background-color: ${t.headerBtnBg} !important;
          background-image: none !important;
          color: ${t.headerBtnText} !important;
          border-color: transparent !important;
        }
        .q-header .q-btn .q-icon,
        .q-header .q-fab .q-icon,
        .top-bar .q-btn .q-icon,
        .top-bar .q-fab .q-icon { color: ${t.headerBtnText} !important; }
        .q-header .q-btn-dropdown__arrow { color: ${t.headerBtnText} !important; }
        .user-log, .q-header .q-avatar { background-color: ${t.accentColor} !important; color: #ffffff !important; }

        /* ── ALL BLUE/TEAL BUTTONS (page-wide) ── */
        .q-btn.bg-blue, .q-btn.bg-blue-1, .q-btn.bg-blue-2, .q-btn.bg-blue-3,
        .q-btn.bg-blue-4, .q-btn.bg-blue-5, .q-btn.bg-blue-6, .q-btn.bg-blue-7,
        .q-btn.bg-blue-8, .q-btn.bg-blue-9, .q-btn.bg-blue-10,
        .q-btn.bg-teal, .q-btn.bg-teal-5, .q-btn.bg-teal-6, .q-btn.bg-teal-7,
        .q-btn.bg-cyan, .q-btn.bg-cyan-5, .q-btn.bg-cyan-6,
        .q-btn.bg-indigo, .q-btn.bg-indigo-6, .q-btn.bg-indigo-8,
        .q-btn.bg-primary,
        .q-btn-dropdown.bg-blue-6, .q-btn-dropdown.bg-blue-8, .q-btn-dropdown.bg-primary,
        .q-fab.bg-blue-6, .q-fab.bg-blue-8, .q-fab.bg-teal-6 {
          background-color: ${t.headerBtnBg} !important;
          background-image: none !important;
          color: ${t.headerBtnText} !important;
        }
        /* Search/action round buttons in content area */
        .search_button_icon, .row-border,
        .add_new_button, .add_new_Lead {
          background: ${t.headerBtnBg} !important;
          background-image: none !important;
          border-color: ${t.cardBorder} !important;
          color: ${t.headerBtnText} !important;
        }

        /* ── SIDEBAR / DRAWER ── */
        .custom-drawer, .q-drawer { background-color: ${t.drawerBg} !important; }
        .q-item.dashboard-menu .q-expansion-item.active-menu .q-item {
          background-image: none !important;
          background-color: ${t.activeBg} !important;
          color: ${t.activeText} !important;
        }
        .q-item.dashboard-menu .q-expansion-item .q-item:hover {
          background-image: none !important;
          background-color: ${t.hoverBg} !important;
          color: ${t.hoverText} !important;
        }
        .q-item.dashboard-menu .q-expansion-item__content { background-color: ${t.contentBg} !important; }
        .q-item.dashboard-menu .q-img.modul-icon .absolute-full:before {
          background: ${t.iconBg} !important; background-image: none !important;
        }
        .modul-icon, .fixed-icon { filter: ${t.iconFilter} !important; }
        .menu-name { color: ${t.menuColor} !important; }
        .q-expansion-item__toggle-icon { color: ${t.menuColor} !important; }
        .menu-link, a.menu-link { color: ${t.linkColor} !important; }
        .child-item { background-color: ${t.contentBg} !important; border-color: ${t.cardBorder} !important; }
        .child-item .q-card-section { color: ${t.linkColor} !important; }
        .left_menu_search .q-field__control { background-color: ${t.headerBg} !important; }
        .left_menu_search .q-field__native, .left_menu_search input { color: ${t.menuColor} !important; }
        .left_menu_search .q-field__control:before { border-color: ${t.cardBorder} !important; }
        .dropdown-menu { background-color: ${t.contentBg} !important; border-color: ${t.cardBorder} !important; }
        .menu-link-search { color: ${t.linkColor} !important; }
        .menu-link-search:hover { background-color: ${t.activeBg} !important; }

        /* ── CARDS & PANELS ── */
        .q-card, .q-card--dark {
          background-color: ${t.cardBg} !important;
          color: ${t.pageText} !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
          border-color: ${t.cardBorder} !important;
        }
        .q-card__section, .q-card-section { color: ${t.pageText} !important; }
        .bg-white, .bg-grey-1, .bg-grey-2, .bg-grey-3 { background-color: ${t.cardBg} !important; }

        /* ── DASHBOARD STAT CARDS (SE/AE/SI/AI) ── */
        .card.peach, .card.Seablue, .card.Grass1, .card.PinkRose,
        .card.Magenta, .card.Wine {
          background: ${t.tableTh} !important;
          background-image: none !important;
          border: 1px solid ${t.cardBorder} !important;
        }
        .card { background-color: ${t.cardBg} !important; color: ${t.pageText} !important; }

        /* ── TABLES ── */
        .q-table__container, .q-markup-table { background-color: ${t.cardBg} !important; }
        .q-table { background-color: ${t.pageBg} !important; border-color: ${t.cardBorder} !important; color: ${t.pageText} !important; }
        .q-table thead th, .q-table thead tr {
          background-color: ${t.tableTh} !important;
          color: ${t.tableThText} !important;
          border-color: ${t.cardBorder} !important;
        }
        .q-table tbody td { color: ${t.pageText} !important; border-color: ${t.cardBorder} !important; }
        .q-table tbody tr { background-color: ${t.pageBg} !important; }
        .q-table tbody tr:hover td { background-color: ${t.tableRowHover} !important; }
        .q-table__bottom { background-color: ${t.cardBg} !important; color: ${t.pageText} !important; border-color: ${t.cardBorder} !important; }
        .q-table__top { background-color: ${t.cardBg} !important; color: ${t.pageText} !important; }
        .q-table__control { color: ${t.pageText} !important; }

        /* ── FORM INPUTS ── */
        .q-field__control { background-color: ${t.inputBg} !important; color: ${t.inputText} !important; }
        .q-field__native, .q-field__input, .q-field__prefix, .q-field__suffix { color: ${t.inputText} !important; }
        .q-field__label { color: ${t.inputLabel} !important; }
        .q-field__control:before { border-color: ${t.inputBorder} !important; }
        .q-field__control:after { border-color: ${t.accentColor} !important; }
        .q-field__marginal { color: ${t.inputLabel} !important; }
        .q-field--readonly .q-field__control { background-color: ${t.tableTh} !important; }
        .q-field--disabled .q-field__control { background-color: ${t.tableTh} !important; opacity: 0.6 !important; }
        textarea, input[type="text"], input[type="number"], input[type="email"] {
          background-color: ${t.inputBg} !important;
          color: ${t.inputText} !important;
        }

        /* ── DROPDOWNS / MENUS ── */
        .q-menu { background-color: ${t.cardBg} !important; color: ${t.pageText} !important; box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important; }
        .q-menu .q-item { color: ${t.pageText} !important; }
        .q-menu .q-item:hover, .q-menu .q-item--active { background-color: ${t.tableRowHover} !important; }
        .q-item__label { color: ${t.pageText} !important; }
        .q-item__label--caption { color: ${t.inputLabel} !important; }
        .q-select__dropdown-icon { color: ${t.inputLabel} !important; }

        /* ── BOTTOM TAB BAR (DynamicTabs footer) ── */
        .q-footer.modern-tabs-footer, .modern-tabs-footer {
          background: ${t.tabBg} !important;
          border-top: 1px solid ${t.cardBorder} !important;
        }
        .modern-tab {
          background-color: ${t.tableTh} !important;
          background-image: none !important;
          border: 1px solid ${t.cardBorder} !important;
          color: ${t.pageText} !important;
        }
        .modern-tab:hover {
          background: ${t.hoverBg} !important;
          background-image: none !important;
          border-color: ${t.accentColor} !important;
          color: ${t.activeText} !important;
        }
        .modern-tab.active {
          background: ${t.activeBg} !important;
          background-image: none !important;
          border-color: ${t.accentColor} !important;
          color: ${t.activeText} !important;
        }
        .modern-tab .tab-text,
        .modern-tab:hover .tab-text,
        .modern-tab.active .tab-text { color: ${t.pageText} !important; }
        .modern-tab .tab-close { background-color: ${t.inputLabel} !important; color: ${t.pageBg} !important; }
        .modern-tab:hover .tab-close,
        .modern-tab.active .tab-close { background-color: ${t.accentColor} !important; color: #ffffff !important; }

        /* ── QUASAR TABS (page-level) ── */
        .q-tabs, .custom-tabs, .q-tabs__content { background-color: ${t.tabBg} !important; }
        .q-tab { color: ${t.tabText} !important; }
        .q-tab--active, .custom-tabs .q-tab.q-tab--active {
          background-color: ${t.tabActiveBg} !important;
          color: ${t.accentColor} !important;
          border-top: 2px solid ${t.accentColor} !important;
        }
        .q-tab__indicator { background-color: ${t.accentColor} !important; }
        .q-tab-panel, .q-tab-panels { background-color: ${t.pageBg} !important; color: ${t.pageText} !important; }

        /* ── ALERT / BANNER ── */
        .q-banner { background-color: ${t.tableTh} !important; color: ${t.pageText} !important; }
        .q-banner__content { color: ${t.pageText} !important; }
        .q-notification { background-color: ${t.cardBg} !important; color: ${t.pageText} !important; }

        /* ── TOOLTIPS ── */
        .q-tooltip { background-color: ${t.tableTh} !important; color: ${t.pageText} !important; }

        /* ── DIALOGS & POPUPS ── */
        .q-dialog .q-card, .q-popup-proxy .q-card { background-color: ${t.cardBg} !important; color: ${t.pageText} !important; }
        .q-dialog__inner--minimized { background-color: rgba(0,0,0,0.5) !important; }
        .q-dialog__backdrop { background-color: rgba(0,0,0,0.5) !important; }

        /* ── SEPARATORS ── */
        .q-separator, hr { background-color: ${t.cardBorder} !important; opacity: 1 !important; }

        /* ── BREADCRUMBS & TITLES ── */
        .q-breadcrumbs, .q-breadcrumbs__el { color: ${t.pageText} !important; }
        .q-breadcrumbs__separator { color: ${t.inputLabel} !important; }
        .text-h4, .text-h5, .text-h6, .text-subtitle1, .text-subtitle2, .text-body1, .text-body2 { color: ${t.pageText} !important; }

        /* ── HIGHCHARTS ── */
        .highcharts-background { fill: ${t.cardBg} !important; }
        .highcharts-plot-background { fill: ${t.pageBg} !important; }
        .highcharts-grid-line { stroke: ${t.cardBorder} !important; }
        .highcharts-axis-line, .highcharts-tick { stroke: ${t.cardBorder} !important; }
        .highcharts-title, .highcharts-subtitle { fill: ${t.pageText} !important; color: ${t.pageText} !important; }
        .highcharts-axis-labels text, .highcharts-legend-item text, .highcharts-xaxis-labels text, .highcharts-yaxis-labels text { fill: ${t.inputLabel} !important; color: ${t.inputLabel} !important; }
        .highcharts-legend-item-hidden text { fill: ${t.cardBorder} !important; }
        .highcharts-tooltip-box { fill: ${t.cardBg} !important; stroke: ${t.cardBorder} !important; }
        .highcharts-tooltip text { fill: ${t.pageText} !important; }
        .highcharts-contextbutton .highcharts-button-box { fill: ${t.tableTh} !important; }
        .highcharts-button-symbol { stroke: ${t.pageText} !important; }

        /* ── COMMON UTILITY ── */
        .text-primary { color: ${t.accentColor} !important; }
        .text-grey-8, .text-grey-7, .text-grey-6, .text-grey-5 { color: ${t.inputLabel} !important; }
        .Theme-font-color, .mod-header, .header_text2, .F-head { color: ${t.accentColor} !important; }
        .F-head, .mod-header { background-color: ${t.cardBg} !important; }

        /* ── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${t.pageBg}; }
        ::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${t.hoverBg}; }
      `;
    },

    // Switch back to MainLayout1's own look via the shared layoutMode ref.
    goToLayout1() {
      // The ml2 theme switcher sets these directly on <html> and they
      // don't get cleared just by switching layoutMode away from v2 —
      // strip them so Layout 1 doesn't inherit a stray dark theme.
      const root = document.documentElement;
      if (root.getAttribute("data-theme") === "ml2") {
        root.removeAttribute("data-theme");
        root.removeAttribute("data-accent");
        root.removeAttribute("data-menu-color");
        root.removeAttribute("data-header-color");
        root.removeAttribute("data-color-mode");
        root.removeAttribute("data-layout-width");
      }
      setLayoutMode("v1");
    },

    //Theme color selection — default Blue Ocean, do not change
    changeColor(color) {
      //store selected theme as default
      localStorage.setItem("color", color);
      localStorage.removeItem("vsTheme");
      localStorage.removeItem("auroraAccent");
      // Clear VS Code / Aurora theme
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.removeAttribute("data-accent");
      const oldOverride = document.getElementById("cn-theme-override");
      if (oldOverride) oldOverride.remove();

      let color2 = color === "#0178bc" ? "#00bdda" : "#00DABE";

      // Create gradient background for .child-item:hover
      const gradientColor = `linear-gradient(to left, ${color2}, ${color})`;

      // Create gradient background for q-expansion-item:hover and .active-menu
      const expansionGradientColor = `linear-gradient(to right, ${color2}, ${color})`;
      let expansionStyle = document.getElementById("cn-expansion-style");
      if (!expansionStyle) {
        expansionStyle = document.createElement("style");
        expansionStyle.id = "cn-expansion-style";
        document.head.appendChild(expansionStyle);
      }
      expansionStyle.innerHTML = `q-expansion-item, .q-expansion-item:hover, .active-menu { background: ${expansionGradientColor};}`;

      // Update specific colors based on the provided color
      let updatedColor = color;
      let updatedColor_1 = color;
      let updatedColor_2 = color;
      let updatedColor_3 = "#ccc";
      let updatedColor_4 = "#cdcdcd";
      let updatedColor_5 = "#f5f5f5";
      let updatedColor_6 = color;

      if (color === "#0178bc") {
        updatedColor = "#f0f8fc";
        updatedColor_1 = "#0178bc";
        updatedColor_2 = "#0178bc";
        updatedColor_3 = "#9edfff";
        updatedColor_4 = "#cdcdcd";
        updatedColor_5 = "#d0efff";
        updatedColor_6 = "#2196f3";
      } else if (color === "#2a9d8f") {
        updatedColor = "#EFFFFD";
        updatedColor_1 = "#2a9d8f";
        updatedColor_2 = "#2a9d8f";
      } else if (color === "#8E7D00") {
        updatedColor = "#FFFEF4";
        updatedColor_1 = "#C8B600";
        updatedColor_2 = "#8E7D00";
      } else if (color === "#362177") {
        updatedColor = "#E5E1F3";
        updatedColor_1 = "#2A00AA";
        updatedColor_2 = "#362177";
      } else if (color === "#39ddf3") {
        updatedColor = "#dbfbff";
        updatedColor_1 = "#39ddf3";
        updatedColor_2 = "#000";
      }

      // Update colors using the modified values
      let quasarStyle = document.getElementById("cn-quasar-style");
      if (!quasarStyle) {
        quasarStyle = document.createElement("style");
        quasarStyle.id = "cn-quasar-style";
        document.head.appendChild(quasarStyle);
      }
      quasarStyle.innerHTML = `

      #bg-custom th {background-color: #fff !important;color: #1B6800 !important;;font-weight:bold;font-size:14px;}
      #bg-custom #bg-g th {background-color:#fff !important;font-weight:bold;color: #000 !important}
      #bg-custom #bg-b th {background-color: #e3f2fd !important; color: #000 !important}
      #bg-custom #bg-r th {background-color: #c95a00bd !important;color: #000 !important}
      #bg-custom th:nth-child(5),#bg-custom th:nth-child(6),#bg-custom th:nth-child(7),#bg-custom th:nth-child(8)
      {background-color:#fff !important;color: #C82A00 !important;font-weight:bold}
      #bg-custom th:nth-child(9)
      {background-color:#fff !important;color: #000 !important;font-weight:bold}
      .q-table { border: 1px solid ${updatedColor_3}; }
      .q-table thead, .q-table tr, .q-table th, .q-table td { border-color: ${updatedColor_5}; border-right-width: 1px;}
      .q-table thead, .q-table tr, .q-table th, .q-table td:last-child { border-right-width: 0px;}

      .bg-blue,text-teal,.Branch-color,.active-tab,
      .Ei-btn,.Ei-submitted-info-head,.search_button_icon
      { background: linear-gradient(to bottom, #21aef2, #1977d3) !important; transition: 0.5s; !important;  }
      .custom-tabs .q-tab.q-tab--active,.active_branch,.Formula_info,.Ei-submitted-info-details
      { background-color: ${updatedColor_1} !important; }
      .q-field__control, .q-field__control .text-blue, .text-primary, .blue-1.q-select__dropdown-item--selected,.q-radio__inner--truthy,.active_branch,.Branchheader:hover,
      .Branchheader.q-btn,.F-head,.Applyto,.ReportSummary .text-h6,.OverViewTable-title1,.Theme-font-color,.mod-header{ color: ${updatedColor_2} !important; }
      .active_branch,.Formula_info,.active-tab,.row-border,.search_button_icon {border: solid 1px #219af1 !important; background:linear-gradient(to bottom, #65cdff, #0064c7) !important;}
      .row-border, .search_button_icon { background: linear-gradient(to bottom, #61c2ff, #0269b3) !important; text-shadow: none; border: solid 1px #ccc !important;}
      .OverViewTable-title {border-bottom: solid 2px ${color} !important}
      .add_new_Lead,.add_new_button {color: #fff !important;}
      .text-teal { color: #000 !important; }.top-bar{ background-color: #fff !important;}
      .header_text2,.Theme-color,.DB-Inner-Font th,.Step-inner-head {color: ${updatedColor_1} !important;}
      .Branchheader {background:linear-gradient(to left, white, ${color})}
      .title {background: ${gradientColor};  -webkit-background-clip: text;  -webkit-text-fill-color: transparent;}
      .air-export {border: solid 2px ${color} !important; color: ${color} !important}
      .add_new_button:hover,.OverView,.MS-Header-bg { background: ${gradientColor};}`;
    },
  },
});
</script>

<style scoped>
.q-item.dashboard-menu :deep(.q-img.optimize-img .absolute-full img) {
  width: 39px !important;
  height: 39px !important;
  object-fit: contain !important;
  padding: 6px !important;
}
</style>

<style>
@import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght,YOPQ@100..900,300&display=swap");
@import url("/src/css/cn-style.css");
@import url("/src/css/cn-style.sass");
@import url("/src/css/cn-style_dashboard.css");
@import url("/src/css/cn-theme-ml2.css");
</style>
