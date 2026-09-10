// src/Services/MobilePreviewService.js
// Shared state so any page can open the globally-rendered <MobilePreview>
// dialog (mounted once in MainLayout1.vue) without importing/registering
// the component itself.

import { reactive } from "vue";

export const mobilePreviewState = reactive({
  visible: false,
});

export function openMobilePreview() {
  mobilePreviewState.visible = true;
}

export function closeMobilePreview() {
  mobilePreviewState.visible = false;
}
