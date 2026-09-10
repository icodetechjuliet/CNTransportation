const { defineConfig } = require("cypress");
const xlsx = require("xlsx");
const path = require("path");

module.exports = defineConfig({
  video: true,
  e2e: {
    baseUrl: "http://localhost:8080",
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      on("task", {
        // ── Original single-sheet task ─────────────────────────────────
        readExcel({ filePath }) {
          const workbook = xlsx.readFile(filePath);
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          return xlsx.utils.sheet_to_json(sheet, { defval: "" });
        },

        // ── NEW: reads every sheet → { sheetName: rows[] } ────────────
        readExcelAllSheets({ filePath }) {
          const absPath = path.resolve(filePath);
          const wb = xlsx.readFile(absPath);
          const result = {};
          wb.SheetNames.forEach((name) => {
            result[name] = xlsx.utils.sheet_to_json(wb.Sheets[name], {
              defval: "",
            });
          });
          return result;
        },
      });
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "webpack",
    },
    specPattern: "cypress/component/**/*.cy.{js,ts}",
    supportFile: "cypress/support/component.js",
    setupNodeEvents(on, config) {},
  },
});
