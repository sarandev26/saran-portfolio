const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const viewports = [
  { width: 1280, height: 720, name: '1280x720' },
  { width: 1366, height: 768, name: '1366x768' },
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1920, height: 1080, name: '1920x1080' },
];

const outDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Performance Recording during smooth scroll
  console.log('Running Performance Recording (FPS & Long Frames)...');
  const perfData = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let lastTime = performance.now();
      let longFrames = 0;
      const startTime = performance.now();
      let running = true;

      function onFrame(time) {
        if (!running) return;
        const delta = time - lastTime;
        lastTime = time;
        frameCount++;
        if (delta > 50) { // frame took > 50ms (dropped below 20fps or frozen)
          longFrames++;
        }
        requestAnimationFrame(onFrame);
      }
      requestAnimationFrame(onFrame);

      // Scroll smoothly down the whole document
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      let currentY = 0;
      const step = 25;
      const interval = setInterval(() => {
        currentY += step;
        window.scrollTo(0, currentY);
        if (currentY >= maxScroll) {
          clearInterval(interval);
          running = false;
          const totalDuration = (performance.now() - startTime) / 1000;
          const avgFps = Math.round(frameCount / totalDuration);
          resolve({ avgFps, longFrames, totalFrames: frameCount, durationSec: totalDuration.toFixed(1) });
        }
      }, 16);
    });
  });
  console.log('Performance result:', perfData);

  // 2. Capture Tool Logos Contact Sheet
  console.log('Capturing Tool Logos Contact Sheet...');
  await page.evaluate(() => {
    const stack = document.getElementById('stack') || document.querySelector('[class*="stack"]');
    if (stack) stack.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const stackEl = await page.$('section[class*="stack"], div[class*="stack"], #stack');
  if (stackEl) {
    await stackEl.screenshot({ path: path.join(outDir, 'tool_logos_contact_sheet.png') });
    console.log('Saved tool_logos_contact_sheet.png');
  } else {
    console.log('Stack element not found, taking viewport screenshot');
    await page.screenshot({ path: path.join(outDir, 'tool_logos_contact_sheet.png') });
  }

  // 3. Multi-viewport verification
  for (const vp of viewports) {
    console.log(`\nVerifying Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const vpPage = await browser.newPage();
    await vpPage.setViewport({ width: vp.width, height: vp.height });
    await vpPage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // Measure hero visibility at vp
    const heroMetrics = await vpPage.evaluate(() => {
      const vh = window.innerHeight;
      const h1 = document.querySelector('h1[class*="h1"]');
      const sub = document.querySelector('p[class*="sub"]');
      const ctas = document.querySelector('div[class*="ctas"]');
      const portrait = document.querySelector('img[class*="portrait"]');
      const cards = Array.from(document.querySelectorAll('div[class*="statCard"]'));

      return {
        vh,
        h1FontSize: h1 ? window.getComputedStyle(h1).fontSize : null,
        subFontSize: sub ? window.getComputedStyle(sub).fontSize : null,
        ctasBottom: ctas ? Math.round(ctas.getBoundingClientRect().bottom) : null,
        portraitBottom: portrait ? Math.round(portrait.getBoundingClientRect().bottom) : null,
        cardsBottoms: cards.map(c => Math.round(c.getBoundingClientRect().bottom)),
        isHeroContained: portrait && ctas ? (ctas.getBoundingClientRect().bottom <= vh && portrait.getBoundingClientRect().bottom <= vh) : null
      };
    });
    console.log(`[${vp.name}] Hero metrics:`, heroMetrics);

    // Capture hero
    await vpPage.screenshot({ path: path.join(outDir, `hero_${vp.name}.png`) });

    // Capture Experience section
    await vpPage.evaluate(() => {
      const exp = document.getElementById('experience');
      if (exp) exp.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 800));
    await vpPage.screenshot({ path: path.join(outDir, `experience_${vp.name}.png`) });

    // Capture Credentials section
    await vpPage.evaluate(() => {
      const cred = document.getElementById('credentials');
      if (cred) cred.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 800));
    await vpPage.screenshot({ path: path.join(outDir, `credentials_${vp.name}.png`) });

    // Capture Connect section
    await vpPage.evaluate(() => {
      const conn = document.getElementById('connect');
      if (conn) conn.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 800));
    await vpPage.screenshot({ path: path.join(outDir, `connect_${vp.name}.png`) });

    await vpPage.close();
  }

  await browser.close();
  console.log('All verifications and screenshots completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
