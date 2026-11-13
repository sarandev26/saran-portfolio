const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const viewports = [
  { width: 1280, height: 720, name: '1280x720' },
  { width: 1366, height: 768, name: '1366x768' },
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1536, height: 864, name: '1536x864' },
  { width: 1920, height: 1080, name: '1920x1080' },
];

const outDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching Edge for visual verification across 5 viewports...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const report = {};

  for (const vp of viewports) {
    console.log(`\n========================================`);
    console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    // Load home page with domcontentloaded
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    // 1. HERO METRICS (at first load, scroll = 0)
    const hero = await page.evaluate(() => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const eyebrow = document.querySelector('p[class*="kicker"]');
      const greeting = document.querySelector('p[class*="greeting"]');
      const h1 = document.querySelector('h1[class*="h1"]');
      const sub = document.querySelector('p[class*="sub"]');
      const ctas = document.querySelector('div[class*="ctas"]');
      const portrait = document.querySelector('img[class*="portrait"]');
      const arch = document.querySelector('div[class*="arch"]');
      const cards = Array.from(document.querySelectorAll('div[class*="statCard"]'));

      const rEye = eyebrow?.getBoundingClientRect();
      const rGreet = greeting?.getBoundingClientRect();
      const rH1 = h1?.getBoundingClientRect();
      const rSub = sub?.getBoundingClientRect();
      const rCtas = ctas?.getBoundingClientRect();
      const rPort = portrait?.getBoundingClientRect();
      const rArch = arch?.getBoundingClientRect();
      const rCards = cards.map(c => c.getBoundingClientRect());

      return {
        vh,
        vw,
        scrollY: window.scrollY,
        eyebrow: rEye ? { top: Math.round(rEye.top), bottom: Math.round(rEye.bottom) } : null,
        greeting: rGreet ? { top: Math.round(rGreet.top), bottom: Math.round(rGreet.bottom) } : null,
        headline: rH1 ? { top: Math.round(rH1.top), bottom: Math.round(rH1.bottom) } : null,
        subline: rSub ? { top: Math.round(rSub.top), bottom: Math.round(rSub.bottom) } : null,
        buttons: rCtas ? { top: Math.round(rCtas.top), bottom: Math.round(rCtas.bottom) } : null,
        portraitArch: rPort ? { top: Math.round(rPort.top), bottom: Math.round(rPort.bottom), height: Math.round(rPort.height) } : null,
        statCards: rCards.map(c => ({ top: Math.round(c.top), bottom: Math.round(c.bottom), left: Math.round(c.left), right: Math.round(c.right) })),
        allInsideViewport: (
          rEye && rEye.top >= 0 &&
          rGreet && rGreet.top >= 0 &&
          rH1 && rH1.top >= 0 &&
          rSub && rSub.top >= 0 &&
          rCtas && rCtas.bottom <= vh &&
          rPort && rPort.bottom <= vh &&
          rCards.every(c => c.top >= 0 && c.bottom <= vh)
        )
      };
    });

    console.log(`[${vp.name}] Hero all inside viewport without scrolling:`, hero.allInsideViewport);
    console.log(`[${vp.name}] Hero buttons bottom: ${hero.buttons?.bottom}px / ${hero.vh}px`);
    console.log(`[${vp.name}] Hero portrait bottom: ${hero.portraitArch?.bottom}px / ${hero.vh}px (height: ${hero.portraitArch?.height}px)`);
    console.log(`[${vp.name}] Hero stat cards:`, hero.statCards.map(c => `[top: ${c.top}, bottom: ${c.bottom}]`).join(', '));
    await page.screenshot({ path: path.join(outDir, `hero_${vp.name}.png`) });

    // 2. ABOUT: Scroll to #about and measure philosophy cards
    await page.evaluate(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const about = await page.evaluate(() => {
      const vh = window.innerHeight;
      const sec = document.getElementById('about');
      const cards = Array.from(sec?.querySelectorAll('div[class*="philoItem"]') || []);
      const rCards = cards.map(c => c.getBoundingClientRect());
      return {
        cardCount: cards.length,
        cards: rCards.map(c => ({ top: Math.round(c.top), bottom: Math.round(c.bottom) })),
        allVisible: rCards.length === 3 && rCards.every(c => c.top >= 0 && c.bottom <= vh)
      };
    });
    console.log(`[${vp.name}] About 3 philosophy cards all visible:`, about.allVisible, about.cards);
    await page.screenshot({ path: path.join(outDir, `about_${vp.name}.png`) });

    // 3. JOURNEY: Scroll to #journey and check layout
    await page.evaluate(() => {
      const el = document.getElementById('journey');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));
    const journey = await page.evaluate(() => {
      const sec = document.getElementById('journey');
      const headline = sec?.querySelector('p[class*="chHeadline"]')?.textContent?.trim();
      const date = sec?.querySelector('span[class*="chDate"]')?.textContent?.trim();
      const company = sec?.querySelector('span[class*="chCompany"]')?.textContent?.trim();
      const desc = sec?.querySelector('p[class*="chDescription"]')?.textContent?.trim();
      return { headline, date, company, desc };
    });
    console.log(`[${vp.name}] Journey first chapter:`, JSON.stringify(journey));
    await page.screenshot({ path: path.join(outDir, `journey_${vp.name}.png`) });

    // 4. WORK: Scroll to #work and test filter transition
    await page.evaluate(() => {
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, `work_all_${vp.name}.png`) });

    // Click Animated (5)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button[class*="filterBtn"]'));
      const animBtn = btns.find(b => b.textContent.includes('Animated'));
      if (animBtn) animBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const workAnim = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[class*="track"] article[class*="card"]'));
      const activeBtn = document.querySelector('button[class*="filterBtnActive"]')?.textContent?.trim();
      return {
        activeFilter: activeBtn,
        cardCount: cards.length,
      };
    });
    console.log(`[${vp.name}] Work filter transition:`, JSON.stringify(workAnim));
    await page.screenshot({ path: path.join(outDir, `work_animated_${vp.name}.png`) });

    // 5. CREDENTIALS: Check eyebrow alignment and issuer logos
    await page.evaluate(() => {
      const el = document.getElementById('credentials');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const credentials = await page.evaluate(() => {
      const sec = document.getElementById('credentials');
      const eyebrow = sec?.querySelector('p[class*="eyebrow"]');
      const r = eyebrow?.getBoundingClientRect();
      const panels = Array.from(sec?.querySelectorAll('article[class*="panel"]') || []);
      const verifiedBadge = sec?.querySelector('[class*="verified"], [class*="badge"]');
      return {
        eyebrowLeft: r ? Math.round(r.left) : null,
        eyebrowTop: r ? Math.round(r.top) : null,
        isClipped: r ? r.left < 20 : true,
        panelCount: panels.length,
        hasVerifiedBadge: !!verifiedBadge
      };
    });
    console.log(`[${vp.name}] Credentials eyebrow:`, JSON.stringify(credentials));
    await page.screenshot({ path: path.join(outDir, `credentials_${vp.name}.png`) });

    // 6. CONNECT: Check dual marquee photos and text
    await page.evaluate(() => {
      const el = document.getElementById('connect');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));
    const connect = await page.evaluate(() => {
      const sec = document.getElementById('connect');
      const photos = Array.from(sec?.querySelectorAll('img') || []);
      const h2 = sec?.querySelector('h2')?.textContent?.trim();
      return {
        h2Text: h2,
        photoCount: photos.length,
      };
    });
    console.log(`[${vp.name}] Connect section:`, JSON.stringify(connect));
    await page.screenshot({ path: path.join(outDir, `connect_${vp.name}.png`) });

    report[vp.name] = { hero, about, journey, workAnim, credentials, connect };
    await page.close();
  }

  await browser.close();
  console.log('\n========================================');
  console.log('ALL VIEWPORT TESTS COMPLETE!');
  console.log('========================================');
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
