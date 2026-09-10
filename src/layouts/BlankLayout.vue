<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->
    <!-- <q-header elevated>
      <div class="q-pa-xs">
        <div class="q-gutter-y-md column" style="max-width: 100%">
          <q-toolbar class="bg-primary text-white rounded-borders">
            <q-btn round>
              <q-avatar class="q-ml-xs" @click="toggleLeftDrawer">
                <img src="~assets/cargonet-logo.png" />
              </q-avatar>
            </q-btn>

            <h6 class="q-ma-none q-pl-xs">CargoNet</h6>
            <q-space />
          </q-toolbar>
        </div>
      </div>
    </q-header> -->
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, ref } from "vue";

const linksList = [];

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
