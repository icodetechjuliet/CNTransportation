const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

function slugify(s) {
  return s.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "").slice(0, 60);
}

(async () => {
  const browser = await chromium.launch();
  const results = [];

  const TAX_ITEMS = ["Service Tax Config", "Tax", "Tax Apply On Tax", "Tax System", "Tax System Wise Tax"];

  for (const text of TAX_ITEMS) {
    const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push("pageerror: " + err.message));

    const result = { text, status: "unknown", underConstruction: false, errors: [] };
    try {
      await page.goto("http://localhost:8080/");
      await page.evaluate(() => {
        sessionStorage.setItem("APIUserID", "1");
        sessionStorage.setItem("APIEmail", "icodeadmin");
        sessionStorage.setItem("APIUserType", "Admin");
        sessionStorage.setItem("accessToken", "MOCK-TEST-TOKEN");
        sessionStorage.setItem("tokenExpiration", new Date(Date.now() + 8 * 3600 * 1000).toISOString());
        sessionStorage.setItem("BranchID", "1");
      });
      await page.goto("http://localhost:8080/#/IndexPage");
      await page.waitForTimeout(2000);
      const parents = await page.$$(".dashboard-menu");
      await parents[1].click();
      await page.waitForTimeout(1200);

      const exact = new RegExp(`^\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`);
      const link = page.locator("a.dms-flat-link", { hasText: exact }).first();
      await link.click({ timeout: 8000 });
      await page.waitForTimeout(900);

      const bodyText = await page.locator("main.app-content").innerText().catch(() => "");
      result.underConstruction = bodyText.includes("Under Construction");

      const shot = path.join("scratch_screens/pages", `tax_${slugify(text)}.png`);
      await page.locator("main.app-content").screenshot({ path: shot }).catch(async () => {
        await page.screenshot({ path: shot });
      });
      result.screenshot = shot;
      result.status = "opened";
    } catch (e) {
      result.status = "failed";
      result.errors.push(e.message.split("\n")[0]);
      console.log(`"${text}" FAILED: ${e.message.split("\n")[0]}`);
    }
    result.errors.push(...consoleErrors.filter((e) => !e.includes("404") && !e.includes("ERR_CONNECTION_REFUSED")));
    results.push(result);
    console.log(`"${text}": ${result.status}, underConstruction=${result.underConstruction}, errors=${result.errors.length}`);
    await context.close();
  }

  fs.writeFileSync("scratch_screens/tax_results.json", JSON.stringify(results, null, 2));
  console.log("DONE");
  await browser.close();
})();
