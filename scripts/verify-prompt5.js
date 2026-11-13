const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.join(__dirname, '..', 'public', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { name: '1280x720', width: 1280, height: 720 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '390x844_mobile', width: 390, height: 844, isMobile: true }
];

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const auditReport = {
    hero: {},
    work: {},
    connect: {},
    contactChooser: {},
    viewports: {}
  };

  // Test across all viewports
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });

    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1200));

    // Scroll to hero (hash #home or scroll down past intro)
    await page.evaluate(() => {
      const hero = document.getElementById('home');
      if (hero) hero.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Capture Hero screenshot
    const heroShotPath = path.join(outDir, `p5_hero_${vp.name}.png`);
    await page.screenshot({ path: heroShotPath });

    // Measure Hero dimensions and check overlaps
    const heroData = await page.evaluate(() => {
      const hero = document.getElementById('home');
      const h1 = hero?.querySelector('h1');
      const serif = h1?.querySelector('em');
      const sub = hero?.querySelector('p[class*="sub"]');
      const ctas = hero?.querySelector('div[class*="ctas"]');
      const portrait = hero?.querySelector('img[class*="portrait"]');
      const arch = hero?.querySelector('div[class*="arch"]');
      const statCards = Array.from(hero?.querySelectorAll('div[class*="statCard"]') || []);
      const scrollCue = hero?.querySelector('div[class*="scrollCue"]');

      const h1Rect = h1?.getBoundingClientRect();
      const subRect = sub?.getBoundingClientRect();
      const ctasRect = ctas?.getBoundingClientRect();
      const portraitRect = portrait?.getBoundingClientRect();
      const archRect = arch?.getBoundingClientRect();
      const scrollCueRect = scrollCue?.getBoundingClientRect();

      const statData = statCards.map(s => {
        const num = s.querySelector('div[class*="statNum"]')?.textContent?.trim();
        const label = s.querySelector('div[class*="statLabel"]')?.textContent?.trim();
        const r = s.getBoundingClientRect();
        return { num, label, top: Math.round(r.top), bottom: Math.round(r.bottom), width: Math.round(r.width), height: Math.round(r.height) };
      });

      const ctasToPortraitGap = (portraitRect && ctasRect) ? Math.round(portraitRect.top - ctasRect.bottom) : null;
      const subToCtasGap = (ctasRect && subRect) ? Math.round(ctasRect.top - subRect.bottom) : null;

      return {
        h1Text: h1?.textContent?.trim().replace(/\s+/g, ' '),
        serifText: serif?.textContent?.trim(),
        subText: sub?.textContent?.trim(),
        portraitWidth: portraitRect ? Math.round(portraitRect.width) : null,
        portraitHeight: portraitRect ? Math.round(portraitRect.height) : null,
        ctasToPortraitGap,
        subToCtasGap,
        stats: statData,
        hasOverlap: ctasToPortraitGap !== null && ctasToPortraitGap < 0,
        scrollCueVisible: scrollCueRect ? scrollCueRect.bottom <= window.innerHeight + 10 : false
      };
    });

    auditReport.hero[vp.name] = heroData;

    // Scroll to Work section and verify card bottom row
    await page.evaluate(() => {
      const work = document.getElementById('work');
      if (work) work.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Filter to Animated to check animated project cards
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button[role="tab"]'));
      const animBtn = btns.find(b => b.textContent.includes('Animated'));
      if (animBtn) animBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const workData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('article[class*="card"]'));
      const firstCard = cards[0];
      const demoLink = firstCard?.querySelector('span[class*="demoLink"]');
      const caseLink = firstCard?.querySelector('span[class*="open"]');
      const footActions = firstCard?.querySelector('div[class*="footActions"]');
      const year = firstCard?.querySelector('span[class*="year"]');
      const title = firstCard?.querySelector('h3');

      const titleRect = title?.getBoundingClientRect();
      const demoRect = demoLink?.getBoundingClientRect();
      const caseRect = caseLink?.getBoundingClientRect();

      return {
        totalCards: cards.length,
        hasDemoLink: !!demoLink,
        demoText: demoLink?.textContent?.trim(),
        caseText: caseLink?.textContent?.trim(),
        categoryText: year?.textContent?.trim(),
        isBesideCaseStudy: (demoRect && caseRect) ? Math.abs(demoRect.top - caseRect.top) < 15 : false,
        demoCaseGap: (demoRect && caseRect) ? Math.round(caseRect.left - demoRect.right) : null,
        titleDemoOverlap: (titleRect && demoRect) ? (demoRect.top < titleRect.bottom && demoRect.bottom > titleRect.top) : false
      };
    });

    auditReport.work[vp.name] = workData;

    const workShotPath = path.join(outDir, `p5_work_${vp.name}.png`);
    await page.screenshot({ path: workShotPath });

    // Scroll to Connect section and verify 4 photos and headline
    await page.evaluate(() => {
      const connect = document.getElementById('connect');
      if (connect) connect.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    const connectData = await page.evaluate(() => {
      const connect = document.getElementById('connect');
      const h2 = connect?.querySelector('h2');
      const serif = h2?.querySelector('em');
      const lede = connect?.querySelector('p[class*="lede"]');
      const photos = Array.from(connect?.querySelectorAll('div[class*="collageCard"]') || []).map(c => {
        const img = c.querySelector('img');
        const wrapper = c.querySelector('div[class*="imageWrapper"]');
        const rect = c.getBoundingClientRect();
        return {
          src: img?.src,
          alt: img?.alt,
          aspectRatioCSS: wrapper?.style?.aspectRatio,
          objectPosition: img?.style?.objectPosition,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          ratioCalc: (rect.width / rect.height).toFixed(3)
        };
      });

      return {
        h2Text: h2?.textContent?.trim().replace(/\s+/g, ' '),
        serifText: serif?.textContent?.trim(),
        ledeText: lede?.textContent?.trim(),
        photos
      };
    });

    auditReport.connect[vp.name] = connectData;

    const connectShotPath = path.join(outDir, `p5_connect_${vp.name}.png`);
    await page.screenshot({ path: connectShotPath });

    await page.close();
  }

  // Interactive Test: Contact Dialog (WhatsApp, Email, Copy Email, Esc/Click-outside)
  console.log('Testing Contact Dialog interaction...');
  const testPage = await browser.newPage();
  await testPage.setViewport({ width: 1440, height: 900 });
  await testPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  await testPage.evaluate(() => {
    const hero = document.getElementById('home');
    if (hero) hero.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click "Let's chat" in Hero
  const dialogTriggerResult = await testPage.evaluate(() => {
    const hero = document.getElementById('home');
    const buttons = Array.from(hero?.querySelectorAll('a, button') || []);
    const chatBtn = buttons.find(b => b.textContent.includes("Let's chat"));
    if (chatBtn) {
      chatBtn.click();
      return true;
    }
    return false;
  });

  await new Promise(r => setTimeout(r, 400));

  const dialogShotPath = path.join(outDir, 'p5_contact_dialog_desktop.png');
  await testPage.screenshot({ path: dialogShotPath });

  const dialogState = await testPage.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    const whatsappLink = dialog?.querySelector('a[href*="wa.me"]');
    const emailLink = dialog?.querySelector('a[href*="mailto"]');
    const copyBtn = dialog?.querySelector('button[aria-label*="email"]');
    const closeBtn = dialog?.querySelector('button[aria-label="Close contact options"]');

    return {
      isOpen: dialog?.classList?.toString()?.includes('dialogVisible'),
      whatsappHref: whatsappLink?.getAttribute('href'),
      whatsappTarget: whatsappLink?.getAttribute('target'),
      whatsappRel: whatsappLink?.getAttribute('rel'),
      emailHref: emailLink?.getAttribute('href'),
      copyBtnExists: !!copyBtn,
      closeBtnExists: !!closeBtn
    };
  });

  // Test Copy Email button
  await testPage.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    const copyBtn = dialog?.querySelector('button[aria-label*="email"]');
    if (copyBtn) copyBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  const copyState = await testPage.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    const copyBtn = dialog?.querySelector('button[aria-label*="email"]');
    return {
      text: copyBtn?.textContent?.trim(),
      isCopiedClass: copyBtn?.className?.includes('copyBtnCopied')
    };
  });

  const dialogCopiedShotPath = path.join(outDir, 'p5_contact_dialog_copied.png');
  await testPage.screenshot({ path: dialogCopiedShotPath });

  // Test closing on Escape
  await testPage.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));

  const closedOnEsc = await testPage.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    return !dialog?.classList?.toString()?.includes('dialogVisible');
  });

  auditReport.contactChooser = {
    dialogTriggerResult,
    dialogState,
    copyState,
    closedOnEsc
  };

  // Test Mobile Contact Sheet
  console.log('Testing Mobile Contact Dialog...');
  await testPage.setViewport({ width: 390, height: 844, isMobile: true });
  await testPage.evaluate(() => {
    const hero = document.getElementById('home');
    const buttons = Array.from(hero?.querySelectorAll('a, button') || []);
    const chatBtn = buttons.find(b => b.textContent.includes("Let's chat"));
    if (chatBtn) chatBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const dialogMobileShotPath = path.join(outDir, 'p5_contact_dialog_mobile.png');
  await testPage.screenshot({ path: dialogMobileShotPath });

  await testPage.close();
  await browser.close();

  fs.writeFileSync(path.join(outDir, 'prompt5_audit_report.json'), JSON.stringify(auditReport, null, 2));
  console.log('Verification finished! Saved prompt5_audit_report.json');
}

runAudit().catch(console.error);

