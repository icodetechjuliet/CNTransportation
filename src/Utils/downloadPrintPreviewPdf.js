import html2pdf from "html2pdf.js";

const safeFilename = (value) =>
  String(value || "document")
    .trim()
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

export async function downloadPrintPreviewPdf(event, filename) {
  const trigger = event?.currentTarget;
  const preview = trigger?.closest(
    ".mbl-print-preview-card, .print-preview-card"
  );
  const sheet = preview?.querySelector(
    ".mbl-report-sheet, .report-sheet, .job-print-sheet"
  );

  if (!sheet) throw new Error("Print preview content was not found");

  if (document.fonts?.ready) await document.fonts.ready;

  return html2pdf()
    .set({
      margin: [8, 8, 8, 8],
      filename: `${safeFilename(filename)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    })
    .from(sheet)
    .save();
}
