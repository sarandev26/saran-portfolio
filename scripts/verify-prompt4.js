const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const viewports = [
  { width: 1280, height: 720, name: '1280x720' },
  { width: 1366, height: 768, name: '1366x768' },
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 390, height: 844, name: '390x844_mobile' },
];

const outDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching Edge for Edit Prompt 4 comprehensive verification...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const fullReport = {
    viewports: {},
    introVerification: {},
    heroOverlapVerification: {},
    sectionEyebrows: {},
    journeyLastChapter: {},
    toolsVerification: {},
    experiencePanelHeight: {},
    connectVerification: {},
  };

  for (const vp of viewports) {
    console.log(`\n======================================================`);
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`======================================================`);

    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.name.includes('mobile') });

    // 1. INTRO ANIMATION: at scroll = 0
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    const introData = await page.evaluate(() => {
      const intro = document.getElementById('intro');
      const canvas = intro?.querySelector('canvas');
      const frame = intro?.querySelector('div[class*="frame"]');
      const hint = intro?.querySelector('p[class*="hint"]');
      const prog = intro?.querySelector('div[class*="progress"]');
      const mask = canvas ? window.getComputedStyle(canvas).maskImage || window.getComputedStyle(canvas).webkitMaskImage : null;
      return {
        hasIntroEl: !!intro,
        hasCanvas: !!canvas,
        canvasW: canvas?.width,
        canvasH: canvas?.height,
        hasMask: !!mask && mask !== 'none',
        maskUrlLength: mask?.length || 0,
        hintText: hint?.textContent?.trim(),
        progText: prog?.textContent?.trim(),
      };
    });

    console.log(`[${vp.name}] Intro Animation:`, introData);
    fullReport.introVerification[vp.name] = introData;
    await page.screenshot({ path: path.join(outDir, `intro_${vp.name}.png`) });

    // 2. HERO: Scroll into view or navigate to #home
    await page.evaluate(() => {
      const hero = document.getElementById('home');
      if (hero) hero.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const heroMetrics = await page.evaluate(() => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const kicker = document.querySelector('p[class*="kicker"]');
      const h1 = document.querySelector('h1[class*="h1"]');
      const sub = document.querySelector('p[class*="sub"]');
      const ctas = document.querySelector('div[class*="ctas"]');
      const portrait = document.querySelector('img[class*="portrait"]');
      const arch = document.querySelector('div[class*="arch"]');
      const statCards = Array.from(document.querySelectorAll('div[class*="statCard"]'));

      const rKicker = kicker?.getBoundingClientRect();
      const rH1 = h1?.getBoundingClientRect();
      const rSub = sub?.getBoundingClientRect();
      const rCtas = ctas?.getBoundingClientRect();
      const rPort = portrait?.getBoundingClientRect();
      const rArch = arch?.getBoundingClientRect();
      const rCards = statCards.map(c => c.getBoundingClientRect());

      // Overlap checks
      const kickerH1Overlap = rKicker && rH1 && rKicker.bottom > rH1.top;
      const h1SubOverlap = rH1 && rSub && rH1.bottom > rSub.top;
      const subCtasOverlap = rSub && rCtas && rSub.bottom > rCtas.top;
      const ctasPortraitOverlap = rCtas && rPort && rCtas.bottom > rPort.top;

      return {
        vh,
        vw,
        kicker: rKicker ? { top: Math.round(rKicker.top), bottom: Math.round(rKicker.bottom) } : null,
        h1: rH1 ? { top: Math.round(rH1.top), bottom: Math.round(rH1.bottom) } : null,
        sub: rSub ? { top: Math.round(rSub.top), bottom: Math.round(rSub.bottom) } : null,
        ctas: rCtas ? { top: Math.round(rCtas.top), bottom: Math.round(rCtas.bottom) } : null,
        portrait: rPort ? {
          top: Math.round(rPort.top),
          bottom: Math.round(rPort.bottom),
          width: Math.round(rPort.width),
          height: Math.round(rPort.height),
          src: portrait?.src,
        } : null,
        arch: rArch ? { top: Math.round(rArch.top), bottom: Math.round(rArch.bottom), height: Math.round(rArch.height) } : null,
        statCardsCount: rCards.length,
        hasOverlap: !!(kickerH1Overlap || h1SubOverlap || subCtasOverlap || ctasPortraitOverlap),
        overlapDetails: {
          kickerH1Overlap,
          h1SubOverlap,
          subCtasOverlap,
          ctasPortraitOverlap,
          ctasToPortraitGap: (rPort && rCtas) ? Math.round(rPort.top - rCtas.bottom) : null,
        }
      };
    });

    console.log(`[${vp.name}] Hero Overlap Test:`, heroMetrics.overlapDetails);
    console.log(`[${vp.name}] Safe gap between buttons and portrait:`, heroMetrics.overlapDetails.ctasToPortraitGap, 'px');
    fullReport.heroOverlapVerification[vp.name] = heroMetrics;
    await page.screenshot({ path: path.join(outDir, `hero_${vp.name}.png`) });

    // 3. ABOUT & SECTION EYEBROWS
    await page.evaluate(() => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outDir, `about_${vp.name}.png`) });

    // 4. JOURNEY
    await page.evaluate(() => {
      const j = document.getElementById('journey');
      if (j) j.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outDir, `journey_${vp.name}.png`) });

    // 5. STACK
    await page.evaluate(() => {
      const s = document.getElementById('stack');
      if (s) s.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outDir, `stack_${vp.name}.png`) });

    // 6. WORK
    await page.evaluate(() => {
      const w = document.getElementById('work');
      if (w) w.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outDir, `work_${vp.name}.png`) });

    // 7. EXPERIENCE: Check panel height and dead space
    await page.evaluate(() => {
      const exp = document.getElementById('experience');
      if (exp) exp.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    const expMetrics = await page.evaluate(() => {
      const board = document.querySelector('article[class*="board"]');
      const r = board?.getBoundingClientRect();
      const style = board ? window.getComputedStyle(board) : null;
      return {
        boardWidth: r ? Math.round(r.width) : null,
        boardHeight: r ? Math.round(r.height) : null,
        cssPanelH: style?.getPropertyValue('--panel-h')?.trim(),
      };
    });
    console.log(`[${vp.name}] Experience Board Height:`, expMetrics);
    fullReport.experiencePanelHeight[vp.name] = expMetrics;
    await page.screenshot({ path: path.join(outDir, `experience_${vp.name}.png`) });

    // 8. CREDENTIALS
    await page.evaluate(() => {
      const cred = document.getElementById('credentials');
      if (cred) cred.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outDir, `credentials_${vp.name}.png`) });

    // 9. CONNECT: Check 4 photos, aspect ratios, top-left replacement
    await page.evaluate(() => {
      const conn = document.getElementById('connect');
      if (conn) conn.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    const connMetrics = await page.evaluate(() => {
      const conn = document.getElementById('connect');
      const cards = Array.from(conn?.querySelectorAll('div[class*="collageCard"]') || []);
      return cards.map(c => {
        const img = c.querySelector('img');
        const wrapper = c.querySelector('div[class*="imageWrapper"]');
        const r = c.getBoundingClientRect();
        return {
          width: Math.round(r.width),
          height: Math.round(r.height),
          aspectRatioCSS: wrapper ? window.getComputedStyle(wrapper).aspectRatio : null,
          ratioCalculated: (r.width / r.height).toFixed(3),
          imgSrc: img?.src,
          objectPosition: img?.style?.objectPosition || window.getComputedStyle(img).objectPosition,
        };
      });
    });
    console.log(`[${vp.name}] Connect Collage Tiles:`, connMetrics);
    fullReport.connectVerification[vp.name] = connMetrics;
    await page.screenshot({ path: path.join(outDir, `connect_${vp.name}.png`) });

    await page.close();
  }

  // GLOBAL CHECKS: Eyebrows, Journey last chapter, 25 Work projects, 16 Tools
  const checkPage = await browser.newPage();
  await checkPage.setViewport({ width: 1440, height: 900 });
  await checkPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  // Eyebrows across all sections:
  const eyebrows = await checkPage.evaluate(() => {
    const list = Array.from(document.querySelectorAll('p[class*="eyebrow"], p[class*="introLabel"]'));
    return list.map(el => ({
      tag: el.tagName,
      className: el.className,
      text: el.textContent?.trim(),
      hasLeadingNumber: /^\d+/.test(el.textContent?.trim() || ''),
    }));
  });
  console.log('\n======================================================');
  console.log('Section Eyebrows verification (must have NO numbers):');
  console.log(eyebrows);
  fullReport.sectionEyebrows = eyebrows;

  // Journey last chapter:
  const journeyContent = await checkPage.evaluate(() => {
    const chapters = Array.from(document.querySelectorAll('article[class*="chapter"]'));
    const last = chapters[chapters.length - 1];
    return {
      count: chapters.length,
      lastHeadline: last?.querySelector('[class*="chHeadline"]')?.textContent?.trim(),
      lastDate: last?.querySelector('[class*="chDate"]')?.textContent?.trim(),
      lastDesc: last?.querySelector('[class*="chDescription"]')?.textContent?.trim(),
    };
  });
  console.log('Journey last chapter:', journeyContent);
  fullReport.journeyLastChapter = journeyContent;

  // Tools in Design Stack:
  const toolsInfo = await checkPage.evaluate(() => {
    const countEl = document.querySelector('p[class*="count"]');
    const cards = Array.from(document.querySelectorAll('ul[class*="orbit"] li[class*="card"]'));
    const names = cards.map(c => c.querySelector('span[class*="name"]')?.textContent?.trim());
    return {
      countText: countEl?.textContent?.trim(),
      totalCards: cards.length,
      names,
    };
  });
  console.log('Tools in Design Stack:', toolsInfo);
  fullReport.toolsVerification = toolsInfo;

  await checkPage.close();
  await browser.close();

  fs.writeFileSync(path.join(outDir, 'full_audit_report.json'), JSON.stringify(fullReport, null, 2));
  console.log('\nFull audit complete! Report saved to public/screenshots/full_audit_report.json');
}

run().catch(err => {
  console.error('Audit run error:', err);
  process.exit(1);
});
