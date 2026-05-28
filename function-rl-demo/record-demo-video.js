const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const demoDir = __dirname;
const captureDir = path.join(demoDir, ".video-capture");
const outputPath = path.join(demoDir, "best-self-digital-twin-demo.webm");
const appUrl = process.env.DEMO_URL || "http://127.0.0.1:4327/index.html";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function cleanCaptureDir() {
  fs.rmSync(captureDir, { recursive: true, force: true });
  fs.mkdirSync(captureDir, { recursive: true });
}

async function injectOverlay(page) {
  await page.addStyleTag({
    content: `
      .demo-video-caption,
      .demo-video-highlight,
      .demo-video-badge {
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        pointer-events: none;
      }

      .demo-video-highlight {
        position: fixed;
        z-index: 99980;
        border: 3px solid #16a697;
        border-radius: 10px;
        box-shadow:
          0 0 0 9999px rgba(23, 32, 29, 0.13),
          0 18px 44px rgba(20, 122, 114, 0.28),
          inset 0 0 0 1px rgba(255, 255, 255, 0.72);
        transition: all 420ms ease;
        animation: demoPulse 1800ms ease-in-out infinite;
      }

      .demo-video-caption {
        position: fixed;
        left: 50%;
        bottom: 24px;
        z-index: 99990;
        width: min(860px, calc(100vw - 48px));
        transform: translateX(-50%);
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 14px;
        align-items: start;
        padding: 16px 18px;
        color: #fff;
        background: rgba(23, 32, 29, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 8px;
        box-shadow: 0 18px 58px rgba(0, 0, 0, 0.28);
      }

      .demo-video-caption b {
        display: grid;
        place-items: center;
        min-width: 48px;
        height: 34px;
        padding: 0 10px;
        border-radius: 8px;
        background: #d8664f;
        color: #fff;
        font-size: 13px;
        letter-spacing: 0;
      }

      .demo-video-caption strong {
        display: block;
        font-size: 20px;
        line-height: 1.18;
        letter-spacing: 0;
      }

      .demo-video-caption span {
        display: block;
        margin-top: 5px;
        color: rgba(255, 255, 255, 0.78);
        font-size: 14px;
        line-height: 1.42;
      }

      .demo-video-badge {
        position: fixed;
        top: 74px;
        left: 24px;
        z-index: 99990;
        padding: 9px 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(216, 223, 218, 0.96);
        color: #17201d;
        font-size: 12px;
        font-weight: 820;
        box-shadow: 0 12px 34px rgba(24, 33, 31, 0.14);
      }

      @keyframes demoPulse {
        0%, 100% { outline: 0 solid rgba(20, 122, 114, 0.42); }
        50% { outline: 8px solid rgba(20, 122, 114, 0.08); }
      }
    `
  });
}

async function showMoment(page, selector, step, headline, detail, duration = 3000) {
  await page.evaluate(({ selector, step, headline, detail }) => {
    document.querySelectorAll(".demo-video-caption, .demo-video-highlight, .demo-video-badge").forEach((node) => node.remove());

    const target = document.querySelector(selector);
    if (target) {
      const rect = target.getBoundingClientRect();
      const pad = 7;
      const highlight = document.createElement("div");
      highlight.className = "demo-video-highlight";
      highlight.style.left = `${Math.max(8, rect.left - pad)}px`;
      highlight.style.top = `${Math.max(8, rect.top - pad)}px`;
      highlight.style.width = `${Math.min(window.innerWidth - 16, rect.width + pad * 2)}px`;
      highlight.style.height = `${Math.min(window.innerHeight - 16, rect.height + pad * 2)}px`;
      document.body.appendChild(highlight);
    }

    const badge = document.createElement("div");
    badge.className = "demo-video-badge";
    badge.textContent = "Best-Self Digital Twin demo";
    document.body.appendChild(badge);

    const caption = document.createElement("div");
    caption.className = "demo-video-caption";
    caption.innerHTML = `<b>${step}</b><div><strong>${headline}</strong><span>${detail}</span></div>`;
    document.body.appendChild(caption);
  }, { selector, step, headline, detail });

  await page.waitForTimeout(duration);
}

async function setLever(page, key, value) {
  await page.evaluate(({ key, value }) => {
    const input = document.querySelector(`input[data-lever="${key}"]`);
    if (!input) return;
    input.value = String(value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, { key, value });
  await page.waitForTimeout(520);
}

async function record() {
  cleanCaptureDir();

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--disable-gpu", "--no-first-run"]
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: captureDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("#futureCount")?.textContent !== "0", null, { timeout: 8000 });
  await injectOverlay(page);

  await showMoment(
    page,
    ".member-panel",
    "1/7",
    "Start with a living member state, not a one-time lab result.",
    "Repeated panels become a compact state vector: trajectories, volatility, risk patterns, and response history."
  );

  await showMoment(
    page,
    ".hero-panel",
    "2/7",
    "Simulate the future space instead of writing generic advice.",
    "Each point is a plausible 180-day path. The frontier exposes best outcome for effort."
  );

  await page.getByRole("button", { name: "Generate 12,000 futures" }).click();
  await showMoment(
    page,
    "#futureCanvas",
    "3/7",
    "Regenerate futures live as the twin learns or the goal changes.",
    "The impressive part is not the chart. It is the counterfactual search over thousands of possible selves.",
    3400
  );

  await page.getByRole("button", { name: "Fast ApoB drop" }).click();
  await page.waitForTimeout(650);
  await showMoment(
    page,
    "#objectiveButtons",
    "4/7",
    "Change the objective and the recommended future changes.",
    "A user can optimize for fast ApoB reduction, metabolic reset, low burden, or a no-medication path."
  );

  await page.getByRole("button", { name: "No-med path" }).click();
  await page.waitForTimeout(650);
  await showMoment(
    page,
    ".right-rail",
    "5/7",
    "The output is a ranked choice set, not a single black-box answer.",
    "That makes it defensible: tradeoffs, burden, confidence, and biomarker deltas are visible before a plan is chosen."
  );

  await setLever(page, "training", 82);
  await setLever(page, "recovery", 76);
  await setLever(page, "nutrition", 70);
  await setLever(page, "adherence", 86);
  await showMoment(
    page,
    "#sliderStack",
    "6/7",
    "Use what-if controls to rehearse intervention bundles.",
    "This is where a member can ask: which version of me is achievable, motivating, and clinically plausible?"
  );

  await page.selectOption("#markerFocus", "insulin");
  await page.waitForTimeout(700);
  await showMoment(
    page,
    "#forecastChart",
    "7/7",
    "Forecast measurable lab movement, then learn from the next retest.",
    "Every follow-up panel becomes supervised feedback: did the predicted future happen, and how should the twin recalibrate?",
    3800
  );

  await showMoment(
    page,
    ".hero-panel",
    "Close",
    "The pitch: choose your best future self.",
    "A chatbot explains your labs. A digital twin lets you compare futures, choose one, and improve the model with every retest.",
    4200
  );

  const video = page.video();
  await context.close();
  await browser.close();

  const recordedPath = await video.path();
  fs.copyFileSync(recordedPath, outputPath);
  fs.rmSync(captureDir, { recursive: true, force: true });
  console.log(outputPath);
}

record().catch((error) => {
  console.error(error);
  process.exit(1);
});
