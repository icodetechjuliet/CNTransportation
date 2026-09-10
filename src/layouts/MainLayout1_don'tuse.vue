<template>
  <div v-if="loading">
    <span class="loader"></span>
  </div>
  <div v-else>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawericon"
          />

          <q-space />
          <h6 class="q-ma-none q-pl-xs"></h6>
          <q-space />

          <q-btn-dropdown
            class="lifting-btn"
            color="blue-1"
            text-color="black"
            rounded
            :label="selectedBranch"
          >
            <q-list>
              <q-item
                v-for="item in items"
                :key="item.BranchID"
                clickable
                v-close-popup
                @click="onItemClick(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item.BranchName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-input
            dark
            dense
            standout
            v-model="filter"
            input-class="text-left"
            class="q-ml-md"
            placeholder="8001"
          >
            <template v-slot:append>
              <q-icon v-if="text === ''" name="search" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="text = ''"
              />
            </template>
          </q-input>

          <q-space />

          <!-- Theme selection btns-->
          <q-fab
            v-model="fab"
            vertical-actions-align="left"
            color="primary"
            round
            icon="brush"
            direction="left"
            class="zoom-on-hover"
          >
            <q-fab-action
              Round
              class="color-1"
              @click="changeColor('#1976d2')"
              label-position="left"
            ></q-fab-action>
            <q-fab-action
              Round
              class="color-2"
              @click="changeColor('#2a9d8f')"
              label-position="left"
            ></q-fab-action>
            <q-fab-action
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
            ></q-fab-action>
          </q-fab>

          <q-btn
            color="primary"
            text-color="white"
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

                <q-item clickable @click="$router.replace('/Logout=Y')">
                  <q-item-section avatar>
                    <q-icon name="logout"></q-icon>
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        class="custom-drawer"
      >
        <q-list>
          <q-item-label header>
            <div class="row">
              <q-avatar class="cursor-pointer">
                <img src="~assets/cargonet-logo.png" @click="reloadPage" />
              </q-avatar>
              <h6 class="q-ma-none q-pt-sm shining-text text-primary">
                CargoNet
              </h6>
            </div>
          </q-item-label>

          <div id="q-app">
            <div class="q-pa-md" style="padding: 0px">
              <q-list>
                <q-item
                  bordered
                  class="dashboard-menu"
                  v-for="parent in parentMenu"
                  :key="parent.ShortCode"
                  style="margin-left: auto; padding-left: 0px !important"
                >
                  <q-expansion-item
                    expand-separator
                    class="menu-item-content seperator"
                    @click="toggleDropdown(parent)"
                    :justify="true"
                    :class="{ 'active-menu': parent.showDropdown }"
                  >
                    <template v-slot:header>
                      <span class="header-content">
                        <span
                          class="shortcode-bar"
                          :style="{ backgroundColor: parent.ColorCode }"
                        >
                          <!-- {{ parent.ShortCode }} -->

                          <img
                            v-if="parent.ShortCode === 'Ae'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Ae.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Ai'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Ai.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Se'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Se.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Si'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Si.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Sp'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Sp.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Eca'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Eca.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Ecs'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Ecs.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Ics'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Ics.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Ica'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Ica.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Db'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Db.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Ld'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Ld.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Qt'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Qt.png"
                          /><img
                            v-if="parent.ShortCode === 'Cp'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Cp.png"
                          /><img
                            v-if="parent.ShortCode === 'Mt'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Mt.png"
                          /><img
                            v-if="parent.ShortCode === 'Fn'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Fn.png"
                          /><img
                            v-if="parent.ShortCode === 'Ma'"
                            class="custom-icons"
                            src="~assets/Shortcode-icon/Ma.png"
                          />
                        </span>
                        <span class="menu-name">{{ parent.MenuName }}</span>
                      </span>
                    </template>
                    <q-separator
                      style="border: solid 5px #fff; color: #fff"
                    ></q-separator>
                    <q-card>
                      <div
                        class="child-item"
                        :class="{
                          'Submenu-class': child.MenuDesc === 'Report',
                        }"
                        v-for="child in parent.children"
                        :key="child.id"
                      >
                        <q-card-section>
                          <!-- Child Menu Item -->
                          <template
                            v-if="child.Link && child.Link.startsWith('http')"
                          >
                            <button @click="handleLinkClick(child)">
                              {{ child.MenuDesc }}
                            </button>
                          </template>
                          <template v-else>
                            <router-link
                              :to="child.Link"
                              class="menu-link"
                              @click="handleLinkClick(child)"
                            >
                              {{ child.MenuDesc }}
                            </router-link>
                          </template>
                        </q-card-section>
                      </div>
                    </q-card>
                  </q-expansion-item>
                </q-item>
              </q-list>
            </div>
            <q-dialog v-model="showDialog" fullscreen persistent>
              <q-card class="q-card_fullwidth">
                <q-card-actions align="right">
                  <q-btn color="primary" label="Close" @click="closeDialog" />
                </q-card-actions>
                <q-card-section class="iframe-container">
                  <iframe :src="externalUrl" class="fullscreen-iframe"></iframe>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
        </q-list>
      </q-drawer>

      <q-page-container>
        <!-- <router-view /> -->
        <DynamicTabs ref="dynamicTabs"></DynamicTabs>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
//import EssentialLink from "components/EssentialLink.vue";
import { RouterLink } from "vue-router";
import CargoNet_API from "/src/IPConfig/config.js";
import Login_API from "/src/IPConfig/configLogin.js";
import DynamicTabs from "pages/DynamicTab.vue";
import axios from "axios";
export default defineComponent({
  name: "MainLayout1",

  components: {
    RouterLink,
    DynamicTabs,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const selectedBranch = ref("");
    selectedBranch.value = "Select Branch";

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
      componentOpen: false,
      toggleLeftDrawericon() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  data() {
    return {
      loading: true,
      items: [],
      parentMenu: [],
      // childMenu: [],
      selectedColor: "",

      showDialog: false,
      externalUrl: "",
      tabcount: 0,
    };
  },
  mounted() {
    // Simulate loading delay
    setTimeout(() => {
      this.loading = false; // Set loading to false after a delay of 2 seconds
    }, 2000);
    // Retrieve the selected color from localStorage (if available)
    const storedColor = localStorage.getItem("color");
    if (storedColor) {
      this.color = storedColor;
      this.changeColor(this.color);
    }
  },
  created() {
    this.username = sessionStorage.getItem("APIEmail");
    this.fetchData();
  },

  methods: {
    closeDialog() {
      this.showDialog = false;
    },
    showDropdown(parent) {
      parent.showDropdown = true;
    },
    reloadPage() {
      // If running in client-side mode, trigger a full page reload
      this.$router.push({ name: "IndexPage" });
      this.componentOpen = false;
    },
    fetchData() {
      this.loading = true;
      const userid = sessionStorage.getItem("APIUserID");

      fetch(`${CargoNet_API}/branches/` + userid)
        .then((response) => response.json())
        .then((data) => {
          this.items = data;
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
              this.selectedBranch = SB.BranchName;
              const branchid = SB.BranchID;
              sessionStorage.setItem("BranchID", branchid);
              this.fetchParentMenu(userid, branchid);
            }
          }
        });
      this.loading = false;
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
      parent.showDropdown = !parent.showDropdown;
      if (parent.showDropdown && parent.children.length === 0) {
        const userid = sessionStorage.getItem("APIUserID");
        const branchid = sessionStorage.getItem("BranchID");
        const menuCode = parent.MenuCode;

        // Fetch the first child menu
        const childMenu1 = await this.fetchChildMenu(
          userid,
          branchid,
          menuCode
        );

        // Fetch the second child menu
        const childMenu2 = await this.fetchChildMenu(
          userid,
          branchid,
          "Report" + menuCode
        );

        // Merge the child menus into a single array
        const mergedChildMenus = [...childMenu1, ...childMenu2];

        // Update the parent menu with the merged child menus
        this.parentMenu = this.parentMenu.map((p) => {
          if (p.MenuCode === menuCode || p.MenuCode === "Report" + menuCode) {
            return {
              ...p,
              children: mergedChildMenus,
            };
          }
          return p;
        });
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
    handleLinkClick(child) {
      if (this.selectedBranch === "Select Branch") {
        this.AlertMethod();
        return false;
      }

      if (child.Link.startsWith("https")) {
        this.externalUrl = child.Link;
        this.showDialog = true;
      } else {
        // Handle non-external URL child menu click
        this.componentOpen = true;
        // Perform your usual navigation logic here
      }
      this.tabcount = this.tabcount + 1;
      const label = "T" + this.tabcount + "-" + child.MenuDesc;

      const id = Date.now();
      // const url = new URL(child.Link, window.location.origin);
      // url.searchParams.set("id", "1");
      const newTabComponent = `${child.Link}?id=${id}`; //child.Link + "&id=" + id;

      if (this.$refs.dynamicTabs.tabs.length < 8) {
        this.$refs.dynamicTabs.addNewTab(label, newTabComponent, id, "I");
        sessionStorage.setItem("Watchcount", 0);
        sessionStorage.setItem("load", 0);
      } else {
        this.$q.notify({
          message: "Tab limit exceeded. You can have a maximum of 8 tabs.",
          color: "red",
          position: "center",
          classes: "text-body24 font-weight-bold q-py-md q-px-lg",
          style: "font-size: 240px",
        });
        this.$refs.dynamicTabs.tabexceed = true;
      }
    },
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
        if (this.$refs.dynamicTabs.tabs.length > 0) {
          this.$q.notify({
            message: "Please Close All the Tabs Before Changing the Branch",
            color: "negative",
            position: "center",
            classes: "text-body24 font-weight-bold q-py-md q-px-lg",
            style: "font-size: 240px",
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
        classes: "text-body24 font-weight-bold q-py-md q-px-lg",
        style: "font-size: 240px",
      });
    },
    logout() {
      // Clear the localStorage
      localStorage.clear();

      // Redirect the user to the home page or login page
      this.$router.replace("/");
    },
    async fetchParentMenu(userid, branchid) {
      this.loading = true;
      try {
        const response = await axios.get(
          `${Login_API}/Login/${userid}/${branchid}`
        );
        const parentMenu = response.data;
        this.parentMenu = parentMenu.map((parent) => {
          return {
            ...parent,
            showDropdown: false,
            children: [],
          };
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
    //Theme color selection
    changeColor(color) {
      //store selected theme as default
      localStorage.setItem("color", color);

      // Update background color of .q-layout__section--marginal
      document.querySelector(
        ".q-layout__section--marginal"
      ).style.backgroundColor = color;

      // Create gradient background for .child-item:hover
      const gradientColor = `linear-gradient(to right, white, ${color})`;
      const style = document.createElement("style");
      const MainColor = `${color}`;
      style.innerHTML = `.child-item:hover,.Submenu-class { background: ${gradientColor} } .q-layout__section--marginal { background: ${MainColor} }`;
      document.head.appendChild(style);

      // Create gradient background for q-expansion-item:hover and .active-menu
      const expansionGradientColor = `linear-gradient(to right, white, ${color})`;
      const expansionStyle = document.createElement("style");
      expansionStyle.innerHTML = `q-expansion-item, .q-expansion-item:hover, .active-menu { background: ${expansionGradientColor};}`;
      document.head.appendChild(expansionStyle);

      // Update specific colors based on the provided color
      let updatedColor = color;
      let updatedColor_1 = color;
      let updatedColor_2 = color;

      if (color === "#1976d2") {
        updatedColor = "#e3f2fd";
        updatedColor_1 = "#0671DA";
        updatedColor_2 = "#1976d2";
      } else if (color === "#2a9d8f") {
        updatedColor = "#E2FBF8";
        updatedColor_1 = "#089E8C";
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
      const quasarStyle = document.createElement("style");
      quasarStyle.innerHTML = `
      .bg-blue-1,.bg-blue-2{ background-color: ${updatedColor} !important; }
      #bg-custom th {background-color: #fff !important;color: #1B6800 !important;;font-weight:bold;font-size:14px;}
      #bg-custom #bg-g th {background-color:#fff !important;font-weight:bold;color: #000 !important}
      #bg-custom #bg-b th {background-color: #e3f2fd !important; color: #000 !important}
      #bg-custom #bg-r th {background-color: #c95a00bd !important;color: #000 !important}
      #bg-custom th:nth-child(5),#bg-custom th:nth-child(6),#bg-custom th:nth-child(7),#bg-custom th:nth-child(8)
      {background-color:#fff !important;color: #C82A00 !important;font-weight:bold}
      #bg-custom th:nth-child(9)
      {background-color:#fff !important;color: #000 !important;font-weight:bold}
      .bg-blue, .bg-primary, .q-uploader__header,text-teal,.Branch-color,.header_text, .h-seperator,.active-tab,
      .button-container_tab:hover,.Ei-btn,.Ei-submitted-info-head { background-color: ${updatedColor_1} !important; }
      .custom-tabs .q-tab.q-tab--active,.active_branch,.Formula_info,.Ei-submitted-info-details { background-color: ${updatedColor} !important; }
      .q-field__control, .q-field__control .text-blue, .text-primary, .blue-1.q-select__dropdown-item--selected,.q-radio__inner--truthy,.active_branch,.Branchheader:hover,
      .Branchheader.q-btn,.F-head,.Applyto{ color: ${updatedColor_2} !important; }
      .active_branch,.Formula_info,.button-container_tab,.row-border {border: solid 1px ${color} !important}
      .text-teal { color: #000 !important; }
      .Branchheader {background:linear-gradient(to left, white, ${color})}`;
      document.head.appendChild(quasarStyle);
    },
  },
});
</script>
<style lang="scss">
@import "node_modules/quasar/dist/quasar.sass";
</style>
<style>
.page {
  font-family: "Rubik", sans-serif;
  font-size: 16px;
}

.header1 {
  font-family: "Rajdhani", sans-serif;
}

.parentmenu {
  font-family: "Rajdhani", sans-serif;
  font-size: 16px;
  line-height: 1.4;
  color: #333;
  /* Additional properties to adjust font rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header3 {
  font-family: "Rajdhani", sans-serif;
}

.bg-grey-4 {
  font-family: "Rajdhani", sans-serif;
}

.q-pt-sm {
  font-family: "Rubik", sans-serif;
}

.bg-grey-3 {
  font-family: "Rubik", sans-serif;
}

.info {
  font-family: "Rajdhani", sans-serif;
}

.q-layout__shadow::after {
  box-shadow: none;
}

.menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  width: "100px";
}
.no-underline {
  text-decoration: none;
}

/* .loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
} */

.loader {
  border: 0px solid #f3f3f3; /* Light grey */
  border-top: 0px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 3s linear infinite;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(src/assets/cargonet-logo.png);
  background-size: cover;
  background-repeat: no-repeat;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.dashboard-menu {
  font-family: "Rajdhani", sans-serif;
  list-style-type: none;
  padding: 0;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  margin-bottom: 10px; /* Increase the row gap */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add shadow to menu items */
}

.menu-item:not(.active) {
  margin-bottom: 10px; /* Increase the row gap */
}

.menu-item-content {
  display: flex;
  align-items: center;
}

/* .shortcode-bar {
  font-family: "Rajdhani", sans-serif;
  display: inline-block;
  width: 40px;
  height: 30px;
  background-color: #fff;
  color: #fff;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
  font-size: 16px;
  border-radius: 15%;
} */

.menu-name {
  margin-left: 5px;
  font-size: 16px;
  transition: transform 0.3s ease;
}
.menu-name:hover {
  transform: translateY(-5px);
}
.icon {
  margin-left: auto;
}

.child-menu {
  font-family: "Rajdhani", sans-serif;
  position: absolute;
  top: 100%; /* Position the child menu below the parent menu */
  left: 0;
  width: 100%;
  line-height: 40px;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  margin-top: 10px; /* Add margin to prevent overlap */
}

.child-item {
  padding-left: 20px;
  font-weight: normal;
}

.child-item a {
  width: 100%;
  height: 100%;
  display: block;
  text-decoration: none; /* Remove underline from child menu links */
  color: inherit; /* Inherit the color from the parent menu item */
}

.child-item:hover {
  background-image: linear-gradient(to right, #ffffff, #1976d2);
  transition: 0.5s;
}
.q-expansion-item:hover {
  background-image: linear-gradient(to right, #ffffff, #1976d2);
}
.active-menu {
  background-image: linear-gradient(to right, #ffffff, #1976d2);
}
.child-item:hover a {
  text-decoration: none; /* Remove underline on hover */
  color: inherit; /* Inherit the color from the parent menu item */
}

.menu-item.active + .menu-item {
  margin-top: 10px; /* Add margin between active parent menu and next parent menu */
}
.cursor-pointer img {
  animation: rotation 4s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.seperator {
  position: relative;
  display: flex;
  align-items: center;
  transition: background-color 0.5s ease;
  cursor: pointer;
  margin-bottom: 10px; /* Increase the row gap */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add shadow to menu items */
}

.header-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
  min-width: 210px;
}
@media (max-width: 1440px) {
  .header-content {
    min-width: 210px;
  }
}
.scrollable-drawer {
  max-height: 700px; /* Adjust the maximum height as needed */
  overflow-y: auto;
}

.q-expansion-item:hover .shortcode-bar {
  font-weight: 600;
}
.active-menu .shortcode-bar {
  font-weight: 600;
}
.q-expansion-item:hover .q-icon {
  color: #fff;
}
.active-menu .q-icon {
  color: #fff;
}

::-webkit-scrollbar {
  height: 12px;
  width: 10px;
  background: transparent;
  z-index: 12;
  overflow: visible;
}

::-webkit-scrollbar-thumb {
  width: 10px;
  background-color: #c1c1c1;
  border-radius: 10px;
  z-index: 12;
  border: 4px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  transition: background-color 0.32s ease-in-out;
  margin: 4px;
  min-height: 32px;
  min-width: 32px;
}
@media (max-width: 400px) {
  .q-btn {
    font-size: 12px;
  }

  .q-fab__actions--left {
    background-color: rgba(255, 255, 255, 0.2) !important;
    border-radius: 50px;
    height: 35px;
  }
  .q-btn--fab-mini {
    min-height: 25px !important;
    min-width: 25px !important;
  }
}
.q-btn--fab {
  padding: 5px;
  min-height: 3em !important;
  min-width: 3em !important;
  max-height: 3em !important;
  max-width: 3em !important;
  margin-right: 10px;
}
.q-fab__actions--left {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 50px;
  height: 40px;
}
.q-btn--fab-mini {
  min-height: 30px !important;
  min-width: 30px !important;
}

.color-1 {
  background-color: #1976d2 !important;
  margin: 10px !important;
}
.color-2 {
  background-color: #2a9d8f !important;
}
.color-3 {
  background-color: #8e7d00 !important;
}
.color-4 {
  background-color: #362177 !important;
}
.color-5 {
  background-color: #39ddf3 !important;
}
.q-btn.bg-blue-1 {
  background-color: #fff !important;
}
.Submenu-class {
  margin-left: -10px;
  font-weight: bolder;
  font-size: 17px;
  padding: 0px;
  padding-left: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.external-card {
  height: 100%;
  width: 100%;
  max-width: 100vw;
  max-height: 100vh;
  margin: 0;
}

.external-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.iframe-container {
  width: 92vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}
.q-card_fullwidth {
  min-width: 95% !important;
}
.fullscreen-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.q-card-actions {
  padding: 16px;
  background-color: #f5f5f5;
}
.q-page-container:not(:first-child) {
  padding-top: 9% !important;
}
.custom-icons {
  width: 40px;
  height: 35px;
  display: inline-block;
  position: relative;
  animation: none !important;
  margin-top: 7px;
  filter: invert(100%);
}
.shortcode-bar {
  font-family: "Rajdhani", sans-serif;
  display: inline-block;
  width: 45px;
  height: 45px;
  background-color: #fff;
  color: #fff;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
  font-size: 16px;
  border-radius: 10%;
  transition: transform 0.3s ease;
}
.shortcode-bar:hover {
  transform: translateY(-5px);
}
.custom-drawer {
  border-left: 5px solid;
  border-image: linear-gradient(
    to bottom,
    #91b90a 0%,
    #91b90a 25%,
    #0091ef 25%,
    #0091ef 50%,
    #e8c205 50%,
    #e8c205 75%,
    #d10107 75%,
    #d10107 100%
  );
  border-image-slice: 1;
  height: 100vh;
}
.shining-text {
  margin-left: 5px;
  font-size: 2em;
  font-weight: bold;
  position: relative;
}

.shining-text::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(100deg, transparent, #fff, transparent);
  opacity: 0;
  pointer-events: none;
  animation: shining-animation 5s infinite;
}

@keyframes shining-animation {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.child-item {
  transition: transform 0.3s ease;
}

.child-item:hover {
  transform: translateX(10px);
}

.menu-item:hover,
.menu-link:hover {
  transform: translateX(10px);
}
.zoom-on-hover {
  transition: transform 0.3s ease;
}

.zoom-on-hover:hover {
  transform: scale(1.2);
}
.lifting-btn {
  position: relative;
  overflow: hidden;
  transition: color 0.1s ease;

  span {
    transition: transform 0.3s ease;
  }

  &:hover span {
    transform: translateY(-3px);
  }
}
</style>
