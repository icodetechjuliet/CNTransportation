const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SCREEN_DIR = "scratch_screens/pages";
fs.mkdirSync(SCREEN_DIR, { recursive: true });

function slugify(s) {
  return s.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "").slice(0, 60);
}

async function loginAndExpand(browser) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();
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
  return { context, page };
}

(async () => {
  let browser = await chromium.launch();

  // ── Phase 1: collect the link list once ──
  let session = await loginAndExpand(browser);
  const dmsScope0 = session.page.locator(".dashboard-menu").nth(1);
  const taxGroupHeader0 = session.page.locator(".child-group", { hasText: "Tax" }).first();
  if (await taxGroupHeader0.count()) {
    await taxGroupHeader0.click().catch(() => {});
    await session.page.waitForTimeout(600);
  }
  const linkTexts = (
    await dmsScope0.locator("a.menu-link").evaluateAll((els) => els.map((e) => e.textContent.trim()).filter(Boolean))
  ).filter((t) => !t.includes("Menu Directory"));
  console.log(`Found ${linkTexts.length} menu links to test.`);
  fs.writeFileSync("scratch_screens/link_list.json", JSON.stringify(linkTexts, null, 2));
  await session.context.close();

  // ── Phase 2: test each link in its own fresh context ──
  const results = [];
  for (let i = 0; i < linkTexts.length; i++) {
    const text = linkTexts[i];
    const result = { index: i, text, status: "unknown", underConstruction: false, errors: [], horizontalOverflow: false, blank: false };
    let consoleErrors = [];
    let ctx;

    try {
      if (!browser.isConnected()) {
        console.log(`[${i}] browser died — relaunching`);
        browser = await chromium.launch();
      }
      ctx = await loginAndExpand(browser);
      const { page } = ctx;
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => consoleErrors.push("pageerror: " + err.message));

      const dmsScope = page.locator(".dashboard-menu").nth(1);
      // Expand Tax group only if this item lives inside it.
      const TAX_ITEMS = ["Service Tax Config", "Tax Apply On Tax", "Tax System", "Tax System Wise Tax"];
      if (TAX_ITEMS.includes(text) || text === "Tax") {
        const taxGroupHeader = page.locator(".child-group", { hasText: "Tax" }).first();
        if (await taxGroupHeader.count()) {
          await taxGroupHeader.click().catch(() => {});
          await page.waitForTimeout(500);
        }
      }

      // Exact match, not substring — "Invoice" is itself a substring of
      // "Door Delivery Invoice" (and similarly for other short labels), and
      // Playwright's hasText does substring matching by default, so a plain
      // string here can silently click the wrong menu item.
      const exact = new RegExp(`^\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`);
      const link = dmsScope.locator("a.menu-link", { hasText: exact }).first();
      await link.click({ timeout: 8000 });
      await page.waitForTimeout(900);

      const bodyText = await page.locator("main.app-content").innerText().catch(() => "");
      result.underConstruction = bodyText.includes("Under Construction");

      const overflowInfo = await page.evaluate(() => {
        const main = document.querySelector("main.app-content");
        if (!main) return { overflow: false, blank: true };
        return { overflow: main.scrollWidth > main.clientWidth + 5, blank: main.innerText.trim().length < 3 };
      });
      result.horizontalOverflow = overflowInfo.overflow;
      result.blank = overflowInfo.blank;

      const shot = path.join(SCREEN_DIR, `${String(i).padStart(3, "0")}_${slugify(text)}.png`);
      await page.locator("main.app-content").screenshot({ path: shot }).catch(async () => {
        await page.screenshot({ path: shot });
      });
      result.screenshot = shot;
      result.status = "opened";
    } catch (e) {
      result.status = "click_failed";
      result.errors.push("click error: " + e.message.split("\n")[0]);
      console.log(`[${i}] "${text}" FAILED: ${e.message.split("\n")[0]}`);
    } finally {
      if (ctx) await ctx.context.close().catch(() => {});
    }

    result.errors.push(...consoleErrors.filter((e) => !e.includes("net::ERR_CONNECTION_REFUSED") && !e.includes("404")));
    results.push(result);

    if ((i + 1) % 10 === 0) {
      console.log(`Progress: ${i + 1}/${linkTexts.length}`);
      fs.writeFileSync("scratch_screens/results_partial.json", JSON.stringify(results, null, 2));
    }
  }

  fs.writeFileSync("scratch_screens/results.json", JSON.stringify(results, null, 2));
  console.log("DONE. Results written to scratch_screens/results.json");
  await browser.close();
})();
