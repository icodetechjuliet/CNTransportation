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

  <div v-if="!loading && layoutMode !== 'v2'" @contextmenu.prevent>
    <!-- <span class="anime_bg"></span> -->
    <span :class="getanimecls">
      <q-layout view="hHh Lpr fFf">
        <q-header elevated>
          <q-toolbar class="top-bar">
            <q-btn
              flat
              dense
              color="blue-8"
              text-color="white"
              icon="menu"
              aria-label="Menu"
              @click="toggleLeftDrawericon"
              class="bg-lblue menu-icon-btn radius-md"
              v-if="!$q.screen.lt.sm"
            />
            <q-list v-if="!$q.screen.lt.sm">
              <q-item-label header class="item-label">
                <div class="row fixed">
                  <!-- <q-img
                    src="~assets/cargonet-logo.gif"
                    class="top-bar-logo"
                    @click="toggleLeftDrawericon"
                  >
                  </q-img> -->
                  <q-img
                    src="~assets/logo-2.png"
                    @click="toggleLeftDrawericon"
                  ></q-img>
                </div>
              </q-item-label>
            </q-list>

            <q-list v-if="$q.screen.width <= 600">
              <q-item-label>
                <q-img
                  src="~assets/cargonet-logo.png"
                  class="mob-menu"
                  @click="toggleLeftDrawericon"
                >
                </q-img>
              </q-item-label>
              <q-separator></q-separator>
            </q-list>

            <q-space />
            <h6 class="q-ma-none q-pl-xs"></h6>
            <q-space />
            <!-- <div align="center">
            <p
              style="margin-bottom: -1px; font-size: 12px"
              v-if="!$q.screen.lt.sm"
            >
              {{ lastActivityMessage || "No activity yet" }}
            </p> -->
            <q-btn-dropdown
              class="lifting-btn"
              color="blue-8"
              text-color="white"
              :label="selectedBranch"
              v-if="usertype === 'I'"
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
            <!-- Below btn added to display Financial year -->
            <q-btn
              class="lifting-btn no-hover"
              color="blue-8"
              text-color="white"
              :label="CurrentFinYear"
              disbled
              v-if="usertype === 'I'"
            ></q-btn>

            <q-btn
              class="lifting-btn no-hover"
              color="blue-8"
              text-color="white"
              :label="crmparty"
              disbled
              v-if="usertype === 'C'"
            ></q-btn>
            <q-btn
              v-if="ShowMetabaseLogin"
              color="blue-6"
              icon="bar_chart"
              class="zoom-on-hover gt-sm q-mr-sm"
              @click="openMetabaseLogin"
            >
              <q-tooltip>Open Metabase</q-tooltip>
            </q-btn>

            <!-- <q-fab
              v-model="chat"
              vertical-actions-align="left"
              color="blue-6"
              text-color="white"
              :icon="'fa-regular fa-comment-dots'"
              direction="down"
              class="zoom-on-hover gt-sm"
              @click="Openchat"
              v-if="usertype === 'I'"
            ></q-fab> -->

            <!-- <q-btn
              dense
              round
              color="red"
              icon="mic"
              @click="startVoiceAssistant"
            >
              <q-tooltip>Speak command</q-tooltip>
            </q-btn> -->

            <!-- Language switcher -->
            <LanguageSwitcher variant="layout1" />

            <!-- Layout switch -->
            <q-btn
              dense
              color="blue-6"
              text-color="white"
              icon="palette"
              class="zoom-on-hover m-icon-btn-style radius-md gt-sm"
              @click="goToLayout2"
            >
              <q-tooltip>Switch to Layout 2</q-tooltip>
            </q-btn>

            <!-- <q-btn
              color="blue-6"
              text-color="white"
              icon="phone_android"
              class="mobile-preview-btn m-icon-btn-style radius-md"
              @click="mobilePreviewState.visible = true"
            >
              <q-tooltip>Mobile Preview</q-tooltip>
            </q-btn> -->
            <q-fab
              v-model="fab2"
              vertical-actions-align="right"
              color="blue-6"
              text-color="white"
              icon="key"
              direction="down"
              class="gt-sm shortcuts-fab"
            >
              <q-fab-action class="key-fab key-fab-wide shortcut-fab-action">
                <div class="shortcut-panel">
                  <div class="shortcut-panel__header">
                    <span class="shortcut-panel__icon"
                      ><q-icon name="keyboard"
                    /></span>
                    <div>
                      <div class="shortcut-panel__title">
                        Keyboard shortcuts
                      </div>
                      <div class="shortcut-panel__subtitle">
                        Jump to common actions
                      </div>
                    </div>
                  </div>
                  <q-list class="shortcut-panel__list">
                    <q-item
                      v-for="(shortcut, index) in shortcuts"
                      :key="index"
                      class="shortcut-panel__item"
                    >
                      <span class="shortcut-panel__label">{{
                        shortcut.label
                      }}</span>
                      <span class="shortcut-panel__keys"
                        ><kbd>Alt</kbd><span>+</span
                        ><kbd>{{ shortcut.key }}</kbd></span
                      >
                    </q-item>
                  </q-list>
                  <div class="shortcut-panel__note">
                    <q-icon name="info" />
                    <span
                      >Close other tabs before refreshing dashboard data.</span
                    >
                  </div>
                </div>
              </q-fab-action>
            </q-fab>
            <q-btn
              v-if="$q.screen.lt.sm"
              flat
              dense
              icon="home"
              color="white"
              class="home-icon-style bg-lblue q-mr-xs radius-md"
              @click="goHome"
            >
              <q-tooltip>Home</q-tooltip>
            </q-btn>

            <q-fab
              v-model="fab1"
              vertical-actions-align="right"
              color="blue-6"
              text-color="white"
              icon="person"
              direction="down"
            >
              <template v-slot:icon>
                <q-avatar class="user-log" text-color="white">
                  {{ userShort }}
                </q-avatar>
              </template>
              <q-fab-action Round class="user-fab" label-position="right"
                ><q-list style="width: 160px">
                  <q-item clickable>
                    <q-item-section avatar>
                      <q-icon class="fab-icon" name="person"></q-icon>
                    </q-item-section>
                    <q-item-section>{{ username }}</q-item-section>
                  </q-item>

                  <q-item clickable @click="handleLogout">
                    <q-item-section avatar>
                      <q-icon class="fab-icon" name="logout"></q-icon>
                    </q-item-section>
                    <q-item-section>Logout</q-item-section>
                  </q-item>
                </q-list>
              </q-fab-action>
            </q-fab>
          </q-toolbar>
        </q-header>

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
        <q-drawer
          v-model="leftDrawerOpen"
          show-if-above
          :breakpoint="1024"
          bordered
          class="custom-drawer"
        >
          <!-- Close button for mobile only -->
          <div v-if="$q.screen.width <= 1024">
            <q-btn
              flat
              dense
              round
              icon="close"
              color="blue-8"
              @click="toggleLeftDrawericon"
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
          <!-- <q-input
          standout
          dense
          outlined
          v-model="searchMenu"
          bg-color="white"
          placeholder="8001 (m)"
          class="q-ml-sm left_menu_search"
          accesskey="m"
        >
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon
              v-else
              name="search"
              class="cursor-pointer"
              @click="SearchMenu()"
            />
          </template>
        </q-input> -->

          <div class="search-filter-wrapper q-px-md q-pt-md">
            <div class="search-box-container bg-blue-1">
              <input
                v-model="filterText"
                placeholder="Search"
                class="search-box-input"
                accesskey="m"
                @update:model-value="filtermenus()"
              />

              <q-btn
                v-if="SearchVal"
                flat
                dense
                round
                icon="close"
                size="xs"
                class="search-box-clear-btn"
                @click="clearSearch"
              >
                <q-tooltip>Clear</q-tooltip>
              </q-btn>

              <q-btn
                flat
                dense
                round
                icon="search"
                :loading="searching"
                class="search-box-icon-btn"
                @click="filtermenus"
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
                :key="child.id"
                class="menu-link-search"
                style="padding: 16px 16px"
              >
                <router-link
                  :to="child.Link"
                  class="menu-link-search"
                  @click="handleLinkClick(child)"
                >
                  {{ child.Modulecode }} - {{ child.MenuDesc }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- <select
          @change="handleSelectChange"
          v-model="selectedMenu"
          class="q-ml-sm left_menu_search"
        >
          <option value="" disabled>Select a menu item</option>
          <option
            v-for="child in searchMenu"
            :key="child.id"
            :value="child.Link"
          >
            {{ child.MenuDesc }}
          </option>
        </select> -->
          <q-list>
            <div id="q-app">
              <div
                v-if="filterText.length && displayParentMenu.length === 0"
                class="q-pa-md text-center text-grey"
                style="font-size: 12.5px"
              >
                No menu items match "{{ filterText }}"
              </div>
              <div class="q-py-sm q-px-md sidebar-menu-list">
                <q-list>
                  <q-item
                    bordered
                    class="dashboard-menu"
                    v-for="parent in displayParentMenu"
                    :key="parent.ShortCode"
                    style="margin-left: auto; padding-left: 0px !important"
                  >
                    <q-expansion-item
                      expand-separator
                      class="menu-item-content seperator"
                      @click="toggleDropdown(parent)"
                      :justify="true"
                      :model-value="isExpanded(parent)"
                      :class="{ 'active-menu': parent.showDropdown }"
                    >
                      <template v-slot:header>
                        <span class="header-content menu-style">
                          <span class="shortcode-bar">
                            <!-- :style="{ backgroundColor: parent.ColorCode }"
                             {{ parent.ShortCode }} -->
                            <q-img
                              v-if="parent.ShortCode === 'Ld'"
                              src="../assets/Shortcode-icon/lead.png"
                              name="flight_takeoff"
                              class="modul-icon fixed-icon"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              v-if="parent.ShortCode === 'Qt'"
                              src="../assets/Shortcode-icon/quote-2.png"
                              name="flight_takeoff"
                              class="modul-icon fixed-icon"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              v-if="parent.ShortCode === 'NQT'"
                              src="../assets/Shortcode-icon/netural-quote.png"
                              class="modul-icon fixed-icon"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              v-if="parent.ShortCode === 'Gcf'"
                              src="../assets/Shortcode-icon/gate-activity.png"
                              class="modul-icon fixed-icon"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              v-if="parent.ShortCode === 'Hlp'"
                              src="../assets/Shortcode-icon/help.png"
                              class="modul-icon fixed-icon"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <!-- <q-icon
                              v-if="parent.ShortCode === 'Ae'"
                              size="28px"
                              name="flight_takeoff"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-icon>
                            <q-icon
                              v-if="parent.ShortCode === 'Ai'"
                              size="28px"
                              name="flight_land"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-icon>
                            <q-icon
                              v-if="parent.ShortCode === 'Se'"
                              size="28px"
                              name="directions_boat"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-icon>
                            <q-icon
                              v-if="parent.ShortCode === 'Si'"
                              size="28px"
                              name="directions_boat"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-icon> -->
                            <q-img
                              v-if="parent.ShortCode === 'Ae'"
                              src="../assets/Shortcode-icon/plane-2.png"
                              name="flight_takeoff"
                              class="modul-icon fixed-icon"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Ai'"
                              src="~assets/Shortcode-icon/ai-plane.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Se'"
                              src="~assets/Shortcode-icon/se-ship.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Si'"
                              src="~assets/Shortcode-icon/si-ship.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Eca'"
                              src="~assets/Shortcode-icon/custom-air-export.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Ecs'"
                              src="~assets/Shortcode-icon/custom-sea-export.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Ica'"
                              src="~assets/Shortcode-icon/custom-air-import.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Ics'"
                              src="~assets/Shortcode-icon/si-ship.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Db'"
                              src="~assets/Shortcode-icon/dashboard.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'DL'"
                              src="~assets/Shortcode-icon/dashboard-logs.png"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <!-- <q-icon
                              v-if="parent.ShortCode === 'Ma'"
                              size="28px"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-icon> -->
                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Ma'"
                              src="~assets/Shortcode-icon/master.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Mt'"
                              src="~assets/Shortcode-icon/maintanence.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Fn'"
                              src="~assets/Shortcode-icon/finance.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'OP'"
                              src="~assets/Shortcode-icon/master.svg"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'AI'"
                              src="~assets/Shortcode-icon/ai-logo.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Rt'"
                              src="~assets/Shortcode-icon/truck.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'Wh'"
                              src="~assets/Shortcode-icon/warehouse.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>
                            <q-img
                              class="modul-icon fixed-icon"
                              v-if="parent.ShortCode === 'DMS'"
                              src="~assets/Shortcode-icon/dms.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon optimize-img"
                              v-if="parent.ShortCode === 'MMT'"
                              src="~assets/Shortcode-icon/mmt.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon optimize-img"
                              v-if="parent.ShortCode === 'Exp'"
                              src="~assets/Shortcode-icon/nvocc-export.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon optimize-img"
                              v-if="parent.ShortCode === 'Po'"
                              src="~assets/Shortcode-icon/npo.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon optimize-img"
                              v-if="parent.ShortCode === 'Imp'"
                              src="~assets/Shortcode-icon/nvocc-import.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <q-img
                              class="modul-icon fixed-icon optimize-img"
                              v-if="parent.ShortCode === 'Mrg'"
                              src="~assets/Shortcode-icon/mrg.png"
                              name="supervisor_account"
                              :class="{ 'active-menu': parent.showDropdown }"
                            ></q-img>

                            <!-- <img
                            v-if="parent.ShortCode === 'Ae'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Ae.png"
                          /> -->
                            <!-- <img
                            v-if="parent.ShortCode === 'Ai'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Ai.png"
                          /> -->
                            <!-- <img
                            v-if="parent.ShortCode === 'Se'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Se.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Si'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Si.png"
                          /> -->
                            <img
                              v-if="parent.ShortCode === 'Sp'"
                              class="custom-icon fixed-icon"
                              src="~assets/Shortcode-icon/Sp.png"
                            />
                            <!-- <img
                            v-if="parent.ShortCode === 'Eca'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Eca.png"
                          /> -->
                            <!-- <img
                            v-if="parent.ShortCode === 'Ecs'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Ecs.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Ics'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Ics.png"
                          />
                          <img
                            v-if="parent.ShortCode === 'Ica'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Ica.png"
                          /> -->
                            <!-- <img
                            v-if="parent.ShortCode === 'Db'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Db.png"
                          /> -->

                            <img
                              v-if="parent.ShortCode === 'Cp'"
                              class="custom-icon fixed-icon"
                              src="~assets/Shortcode-icon/Cp.png"
                            />

                            <!-- <img
                            v-if="parent.ShortCode === 'Mt'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Mt.png"
                          /> -->
                            <!-- <img
                            v-if="parent.ShortCode === 'Fn'"
                            class="custom-icon"
                            src="~assets/Shortcode-icon/Fn.png"
                          /> -->
                          </span>
                          <span class="menu-name"
                            >{{ parent.MenuName }}
                            <q-spinner-dots
                              size="18"
                              v-if="parent.loading"
                              class="q-ml-sm"
                              color="primary"
                          /></span>
                        </span>
                      </template>

                      <q-card>
                        <div
                          class="child-item"
                          :class="{
                            'Submenu-class': child.MenuDesc === 'Report',
                            'no-click':
                              child.Link === '#menu-header' ||
                              child.MenuDesc === 'Report',
                          }"
                          v-for="child in parent.children"
                          :key="child.id"
                        >
                          <q-card-section style="padding: 7px 12px">
                            <div
                              v-if="
                                child.Link === '#menu-header' ||
                                child.MenuDesc === 'Report'
                              "
                              class="menu-section-header"
                            >
                              {{ child.MenuDesc }}
                            </div>
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
                                class="menu-link tooltip-wrapper"
                                @click="handleLinkClick(child, parent.MenuName)"
                              >
                                {{ child.MenuDesc }}
                                <q-tooltip class="custom-tooltip">
                                  {{ child.MenuDesc }}
                                </q-tooltip>
                              </a>
                            </template>

                            <!-- ✅ External http link -->
                            <template
                              v-else-if="
                                child.Link && child.Link.startsWith('http')
                              "
                            >
                              <a
                                class="menu-link tooltip-wrapper"
                                @click="handleLinkClick(child, parent.MenuName)"
                              >
                                {{ child.MenuDesc }}
                                <q-tooltip class="custom-tooltip">
                                  {{ child.MenuDesc }}
                                </q-tooltip>
                              </a>
                            </template>
                            <template v-else>
                              <router-link
                                :to="child.Link"
                                class="menu-link tooltip-wrapper"
                                @click="handleLinkClick(child, parent.MenuName)"
                              >
                                {{ child.MenuDesc }}
                                <q-tooltip class="custom-tooltip">{{
                                  child.MenuDesc
                                }}</q-tooltip>
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
                    <iframe
                      :src="externalUrl"
                      class="fullscreen-iframe"
                    ></iframe>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
          </q-list>
        </q-drawer>

        <q-page-container>
          <!-- <router-view /> -->
          <div v-show="ShowChat" class="show-chat-container">
            <Chatbot />
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
  <MainLayout2 v-if="!loading && layoutMode === 'v2'" />
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

  <MobilePreview
    :model-value="mobilePreviewState.visible"
    @update:model-value="mobilePreviewState.visible = $event"
  />
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from "vue";
//import EssentialLink from "components/EssentialLink.vue";
import { RouterLink } from "vue-router";
import CargoNet_API from "/src/IPConfig/config.js";
import Login_API from "/src/IPConfig/configLogin.js";
import DynamicTabs from "pages/DynamicTab.vue";
import Chatbot from "pages/ChatbotFeature.vue";
import { VoiceRegistry } from "src/mixins/voiceActions.js";
import axios from "axios";
import { useQuasar } from "quasar";
import MetabaseService from "src/Services/MetabaseService.js";
import MetabaseConfig from "/src/IPConfig/Metabaseconfig.js";
import MobilePreview from "components/MobilePreview.vue";
import { mobilePreviewState } from "src/Services/MobilePreviewService.js";
import { layoutMode, setLayoutMode } from "src/Utils/layoutMode.js";
import LanguageSwitcher from "components/LanguageSwitcher.vue";
import {
  MOCK_LOGIN_MODE,
  buildMockBranches,
  buildMockParentMenu,
  buildMockChildMenu,
  buildMockFinancialYears,
} from "src/IPConfig/mockData.js";

// Lazy-loaded: MainLayout2's own global <style> block must not be bundled
// (and its CSS injected) until the user actually switches to it — a static
// import here would leak MainLayout2's CSS into the default v1 view too.
const MainLayout2 = defineAsyncComponent(() =>
  import("layouts/MainLayout2.vue")
);

const nextMorphStep = {
  btn: "card1",
  card1: "btn",
};
export default defineComponent({
  name: "MainLayout1",

  components: {
    RouterLink,
    DynamicTabs,
    Chatbot,
    MobilePreview,
    MainLayout2,
    LanguageSwitcher,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
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
      layoutMode,
      componentOpen: false,
      toggleLeftDrawericon() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      morphGroupModel,
      nextMorph() {
        morphGroupModel.value = nextMorphStep[morphGroupModel.value];
      },
      mobilePreviewState,
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
      fab: false,
      fab1: false,
      fab2: false,
      chat: false,
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
    // MainLayout2's ml2 theme sets these directly on <html> and they aren't
    // cleared just by switching away from it — strip them here so Layout 1
    // never inherits a stray dark theme from a previous Layout 2 visit.
    const root = document.documentElement;
    if (root.getAttribute("data-theme") === "ml2") {
      root.removeAttribute("data-theme");
      root.removeAttribute("data-accent");
      root.removeAttribute("data-menu-color");
      root.removeAttribute("data-header-color");
      root.removeAttribute("data-color-mode");
      root.removeAttribute("data-layout-width");
    }
    // Restore saved theme (VS Code theme takes priority over color theme)
    const savedVSTheme = localStorage.getItem("vsTheme");
    if (savedVSTheme) {
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
    //Below method is used to load the current financial year to show on top bar
    this.LoadCurrentFinancialYear();
    this.loadMetabase();
    this.GetMetabaseLoginConfig();
    this.GetCRMPartyData();
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
          // Only the matching child menus show up under an expanded
          // parent — non-matching siblings stay hidden during a search.
          return { ...parent, children: matchingChildren };
        })
        .filter(Boolean);
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
  },
  methods: {
    async GetMetabaseLoginConfig() {
      if (MOCK_LOGIN_MODE) {
        // No Metabase config API yet — treat it as disabled rather than
        // failing the request, same effect as the real flag coming back "N".
        this.ShowMetabaseLogin = false;
        return;
      }
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

        // Medium desktop (1200px–1499px)
        if (val >= 1200 && val < 1500) {
          this.leftDrawerOpen = true;
          page.style.paddingLeft = "240px";
          return;
        }

        // Medium desktop (1500px–1700px)
        if (val >= 1500 && val < 1700) {
          this.leftDrawerOpen = true;
          page.style.paddingLeft = "250px";
          return;
        }

        // Large desktop (1700px+)
        if (val >= 1700) {
          this.leftDrawerOpen = true;
          page.style.paddingLeft = "290px";
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

      const branchesRequest = MOCK_LOGIN_MODE
        ? Promise.resolve({ data: buildMockBranches() })
        : axios.get(`${CargoNet_API}/branches/${userid}`);

      await branchesRequest
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
    // While searching, force every matching parent open so its matching
    // child menus are visible without an extra click; otherwise fall back
    // to the normal manually-toggled state.
    isExpanded(parent) {
      if (this.filterText) return true;
      return parent.showDropdown;
    },
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
        // Same fix as logoutUser(): this forced logout (another device signed
        // into the same account) must also clear sessionStorage, otherwise a
        // refresh right after would still carry a "valid" accessToken and
        // router-guard.js would bounce the user straight back into /IndexPage.
        sessionStorage.clear();
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
      this.$refs.dynamicTabs.openTab("/DashboardPage", "Home");
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
    async handleLinkClick(child, parentMenuName = "") {
      if (
        !child ||
        child.Link === "#menu-header" ||
        child.MenuDesc === "Report"
      )
        return false;
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
          (menu) => menu.Link === child.Link && menu.MenuDesc === child.MenuDesc
        )
      );
      const newTabComponent = {
        path: `${child.Link}`,
        moduleName:
          parentMenuName ||
          child.ParentMenuName ||
          owningParent?.MenuName ||
          child.Modulecode,
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
      // Explicitly clear the session/identity keys set at login. Previously
      // "Logout" only navigated to the login screen without clearing
      // anything, which relied on sessionStorage dying on its own (tab/app
      // close) to actually end the session. Now that the Cordova build backs
      // sessionStorage with localStorage (so login survives app restarts),
      // that accidental behavior no longer happens, so Logout must clear the
      // session itself instead of relying on it.
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("tokenExpiration");
      sessionStorage.removeItem("APIUserID");
      sessionStorage.removeItem("APIEmail");
      sessionStorage.removeItem("APIUserType");
      this.$router.replace("/Logout=Y");
    },
    async fetchParentMenu(userid, branchid) {
      this.loading = true;
      try {
        const response = MOCK_LOGIN_MODE
          ? { data: buildMockParentMenu() }
          : await axios.get(`${Login_API}/Login/${userid}/${branchid}`);
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
      if (MOCK_LOGIN_MODE) {
        return buildMockChildMenu(menuCode);
      }
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
      const request = MOCK_LOGIN_MODE
        ? Promise.resolve({ data: buildMockFinancialYears() })
        : axios.get(`${CargoNet_API}/financialyear/currentfinyear`);
      request
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

    // VS Code-inspired theme switcher — full page override
    setTheme(themeName) {
      ["cn-expansion-style", "cn-quasar-style"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
      document.documentElement.setAttribute("data-theme", themeName);
      localStorage.setItem("vsTheme", themeName);
      localStorage.removeItem("color");

      const tokens = {
        // Clean Light — professional white ERP, soft grey accents
        // (Only light theme here — dark themes live in Layout 2 / ml2.)
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
      const t = tokens[themeName] || tokens["github-light"];

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

    // Switch to the MainLayout2 look. Rendered as a sibling component
    // toggled by the shared layoutMode ref — no route change involved.
    goToLayout2() {
      setLayoutMode("v2");
    },

    //Theme color selection — default Blue Ocean, do not change
    changeColor(color) {
      //store selected theme as default
      localStorage.setItem("color", color);
      localStorage.removeItem("vsTheme");
      // Clear VS Code theme
      document.documentElement.removeAttribute("data-theme");
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
.q-layout :deep(.q-header) {
  border-bottom: 1px solid #c7e8f7;
  box-shadow: 0 2px 6px rgba(5, 127, 197, 0.1) !important;
}

.q-item.dashboard-menu :deep(.q-img.optimize-img .absolute-full img) {
  width: 39px !important;
  height: 39px !important;
  object-fit: contain !important;
  padding: 6px !important;
}

/* Keep long module names inside the expansion header. The custom header
   previously claimed 100% width before Quasar reserved its side section,
   which placed "Minimum Rate Guideline" underneath the toggle arrow. */

.q-item.dashboard-menu
  :deep(.q-expansion-item__container > .q-item .q-item__section--main) {
  min-width: 0;
}
.q-item.dashboard-menu .header-content {
  width: 100%;
  min-width: 0 !important;
  overflow: hidden;
}
.q-item.dashboard-menu .menu-name {
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  letter-spacing: 0;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.6px;
}
.q-item.dashboard-menu
  :deep(.q-expansion-item__container > .q-item .q-item__section--side) {
  min-width: 20px;
  flex: 0 0 20px;
  padding-left: 0;
}

@media (min-width: 1500px) and (max-width: 1499px) {
  .q-item.dashboard-menu .menu-name {
    min-width: 0;
    overflow: hidden;
    font-size: 12px;
  }

  .q-item.dashboard-menu .q-img.optimize-img .absolute-full img {
    width: 33px !important;
    height: 33px !important;
    object-fit: contain !important;
    /* padding: 6px !important; */
  }
}

/* Compact and consistently aligned navigation for common laptop widths. */
@media (min-width: 1200px) and (max-width: 1499px) {
  .sidebar-menu-list {
    padding: 4px 10px !important;
  }

  .q-item.dashboard-menu {
    min-height: 0;
    margin: 0 !important;
    padding: 0 !important;
  }

  .q-item.dashboard-menu :deep(.q-expansion-item) {
    width: 100%;
    margin: 0 !important;
    padding: 0 !important;
  }

  .q-item.dashboard-menu :deep(.q-expansion-item__container > .q-item) {
    min-height: 42px;
    column-gap: 8px;
    margin: 0 !important;
    padding: 5px 6px !important;
    border-radius: 6px;
  }

  .q-item.dashboard-menu .header-content {
    display: flex;
    width: 100%;
    min-width: 0 !important;
    align-items: center;
  }

  .q-item.dashboard-menu .shortcode-bar {
    width: 30px !important;
    height: 30px !important;
    flex: 0 0 30px;
    margin: 0 8px 0 0 !important;
  }

  .q-item.dashboard-menu :deep(.q-img.modul-icon),
  .q-item.dashboard-menu :deep(.q-img.modul-icon .absolute-full img) {
    width: 30px !important;
    height: 30px !important;
  }

  .q-item.dashboard-menu :deep(.q-img.modul-icon .absolute-full img) {
    padding: 5px !important;
  }

  .q-item.dashboard-menu .menu-name {
    flex: 1 1 auto;
    font-size: 12px;
    line-height: 18px;
  }

  .q-item.dashboard-menu
    :deep(.q-expansion-item__container > .q-item .q-item__section--side) {
    min-width: 18px;
    flex: 0 0 18px;
    align-items: center;
    padding: 0 !important;
  }

  .q-item.dashboard-menu :deep(.q-item__section--side > .q-icon) {
    position: static !important;
    right: auto !important;
    margin: 0 !important;
    font-size: 18px;
  }

  .q-item.dashboard-menu :deep(.q-expansion-item.seperator) {
    margin: 0 !important;
    padding: 0 !important;
  }
}

.menu-section-header {
  color: #0178bc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
  padding: 7px 2px 3px;
  text-transform: none;
}
/* .Submenu-class (the "Report" row) paints a solid blue gradient behind
   this same label — the plain #0178bc text above was nearly invisible
   against it. Keep the blue text everywhere else this class is reused,
   but switch to white specifically when it's sitting on that overlay. */
.Submenu-class .menu-section-header {
  color: #ffffff;
}
</style>

<style lang="scss">
@import "node_modules/quasar/dist/quasar.sass";
</style>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght,YOPQ@100..900,300&display=swap");
@import url("/src/css/cn-style.css");
@import url("/src/css/cn-style.sass");
@import url("/src/css/cn-style_dashboard.css");
@import url("/src/css/cn-themes.css");
</style>
