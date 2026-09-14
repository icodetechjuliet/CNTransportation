// Turns an iframe's rendered print-preview document into a real .pdf
// download (html2pdf.js — already a dependency). Distinct from the browser's
// own contentWindow.print() (used by the print-preview dialogs' separate
// "Print" icon): this one produces an actual file instead of opening the
// system print dialog.
//
// html2canvas cannot reliably capture content read through
// iframe.contentDocument — it loses almost the entire stylesheet (verified
// empirically: colors, alignment and even font-weight silently drop while
// browser-native rendering of the same iframe is pixel-perfect). The fix is
// to clone the printable HTML's <style> + <body> into a plain, in-flow
// container appended to THIS document (not the iframe's), so html2canvas
// resolves its own document's stylesheets instead of reaching cross-document.
//
// Separately, html2canvas's auto-detected capture width is unreliable unless
// pinned explicitly — it silently fell back to ~733px (the A4-content-width
// default) regardless of the container's real CSS width, clipping anything
// wider. PRINT_WIDTH_PX must match on both the container's own width and the
// html2canvas width/windowWidth options so the layout pass and the capture
// pass agree on how wide the page is.
import html2pdf from "html2pdf.js";

const PRINT_WIDTH_PX = 780;

const safeFilename = (value) =>
  String(value || "document")
    .trim()
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

export async function downloadIframeAsPdf(iframeEl, filename) {
  const doc = iframeEl?.contentDocument;
  if (!doc?.body) throw new Error("Print preview content was not found");

  if (doc.fonts?.ready) await doc.fonts.ready;

  const styleHtml = Array.from(doc.querySelectorAll("style"))
    .map((s) => s.outerHTML)
    .join("");
  const container = document.createElement("div");
  container.style.cssText = `width:${PRINT_WIDTH_PX}px;background:#fff;`;
  container.innerHTML = styleHtml + doc.body.innerHTML;

  // Keep the source iframe out of layout while capturing — the clone above
  // is appended in normal flow (html2canvas needs it un-positioned to
  // measure height correctly), so this avoids a visible page jump.
  const prevDisplay = iframeEl.style.display;
  iframeEl.style.display = "none";
  document.body.appendChild(container);

  try {
    await html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: `${safeFilename(filename)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: PRINT_WIDTH_PX,
          width: PRINT_WIDTH_PX,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(container)
      .save();
  } finally {
    container.remove();
    iframeEl.style.display = prevDisplay;
  }
}
