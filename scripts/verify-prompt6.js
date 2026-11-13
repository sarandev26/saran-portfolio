const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.join(__dirname, '..', 'public', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { name: '360x800', width: 360, height: 800, isMobile: true },
  { name: '390x844', width: 390, height: 844, isMobile: true },
  { name: '430x932', width: 430, height: 932, isMobile: true },
  { name: '768x1024', width: 768, height: 1024, isTablet: true },
  { name: '820x1180', width: 820, height: 1180, isTablet: true },
  { name: '1024x768', width: 1024, height: 768, isTablet: true },
  { name: '1280x720', width: 1280, height: 720 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const auditReport = {
    viewports: {},
    intro: {},
    hero: {},
    stackCaptionCheck: {},
    connect: {},
    leadproLogo: {},
    contactDialog: {}
  };

  // 1. Audit across all 10 viewports
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });

    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));

    // Intro check (at scroll 0)
    const introData = await page.evaluate(() => {
      const intro = document.getElementById('intro');
      const progressTotal = intro?.querySelector('div[class*="progress"] span:last-child');
      const stageNow = intro?.querySelector('span[class*="stageNow"]');
      return {
        hasIntro: !!intro,
        totalSteps: progressTotal?.textContent?.trim(),
        currentStep: stageNow?.textContent?.trim()
      };
    });
    auditReport.intro[vp.name] = introData;

    // Scroll to hero
    await page.evaluate(() => {
      const hero = document.getElementById('home');
      if (hero) hero.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture Hero screenshot
    const heroShot = path.join(outDir, `p6_hero_${vp.name}.png`);
    await page.screenshot({ path: heroShot });

    // Hero element measurements & overlap check
    const heroData = await page.evaluate(() => {
      const hero = document.getElementById('home');
      const kicker = hero?.querySelector('p[class*="kicker"]');
      const h1 = hero?.querySelector('h1');
      const serif = h1?.querySelector('em');
      const sub = hero?.querySelector('p[class*="sub"]');
      const ctas = hero?.querySelector('div[class*="ctas"]');
      const portrait = hero?.querySelector('img[class*="portrait"]');
      const arch = hero?.querySelector('div[class*="arch"]');
      const statCards = Array.from(hero?.querySelectorAll('div[class*="statCard"]') || []);
      const scrollCue = hero?.querySelector('div[class*="scrollCue"]');

      const h1R = h1?.getBoundingClientRect();
      const subR = sub?.getBoundingClientRect();
      const ctasR = ctas?.getBoundingClientRect();
      const portraitR = portrait?.getBoundingClientRect();
      const archR = arch?.getBoundingClientRect();

      const stats = statCards.map(s => {
        const num = s.querySelector('div[class*="statNum"]')?.textContent?.trim();
        const label = s.querySelector('div[class*="statLabel"]')?.textContent?.trim();
        const r = s.getBoundingClientRect();
        return {
          num,
          label,
          rect: { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) },
          // Check if portrait covers this card
          isCoveredByPortrait: portraitR ? (
            r.top < portraitR.bottom && r.bottom > portraitR.top &&
            r.left < portraitR.right && r.right > portraitR.left
          ) : false
        };
      });

      // Gap between CTAs and the top of portrait
      const ctasToPortraitGap = (portraitR && ctasR) ? Math.round(portraitR.top - ctasR.bottom) : null;

      return {
        kickerText: kicker?.textContent?.trim(),
        h1Text: h1?.textContent?.trim().replace(/\s+/g, ' '),
        serifText: serif?.textContent?.trim(),
        subText: sub?.textContent?.trim(),
        portraitDimensions: portraitR ? { width: Math.round(portraitR.width), height: Math.round(portraitR.height) } : null,
        ctasToPortraitGap,
        stats,
        hasKickerVibeCoder: kicker?.textContent?.toLowerCase().includes('vibe coder'),
        hasHeadlineOverlap: (h1R && subR) ? subR.top < h1R.bottom : false,
        hasSubCtasOverlap: (subR && ctasR) ? ctasR.top < subR.bottom : false
      };
    });
    auditReport.hero[vp.name] = heroData;

    // Check Design Stack for tool caption
    await page.evaluate(() => {
      const stack = document.getElementById('stack');
      if (stack) stack.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));

    const stackCaptionCheck = await page.evaluate(() => {
      const stack = document.getElementById('stack');
      const text = stack?.textContent || '';
      return {
        hasForbiddenCaption: text.includes('Tools I design, prototype and build with')
      };
    });
    auditReport.stackCaptionCheck[vp.name] = stackCaptionCheck;

    // Check Credentials for LeadPro logo
    await page.evaluate(() => {
      const cred = document.getElementById('credentials');
      if (cred) cred.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));

    const leadproData = await page.evaluate(() => {
      const cred = document.getElementById('credentials');
      const img = cred?.querySelector('img[src*="leadpro-infotech"]');
      const r = img?.getBoundingClientRect();
      return {
        found: !!img,
        src: img?.getAttribute('src'),
        width: r ? Math.round(r.width) : 0,
        height: r ? Math.round(r.height) : 0,
        aspect: (r && r.height > 0) ? (r.width / r.height).toFixed(2) : null
      };
    });
    auditReport.leadproLogo[vp.name] = leadproData;

    // Check Connect section
    await page.evaluate(() => {
      const connect = document.getElementById('connect');
      if (connect) connect.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));

    const connectShot = path.join(outDir, `p6_connect_${vp.name}.png`);
    await page.screenshot({ path: connectShot });

    const connectData = await page.evaluate(() => {
      const connect = document.getElementById('connect');
      const head = connect?.querySelector('div[class*="head"]');
      const h2 = head?.querySelector('h2');
      const cards = Array.from(connect?.querySelectorAll('div[class*="collageCard"]') || []);
      const headR = head?.getBoundingClientRect();

      const cardData = cards.map(c => {
        const img = c.querySelector('img');
        const r = c.getBoundingClientRect();
        return {
          src: img?.getAttribute('src'),
          alt: img?.getAttribute('alt'),
          rect: { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
          ratio: r.height > 0 ? (r.width / r.height).toFixed(3) : null,
          isUnderHeadline: headR ? r.top >= headR.bottom - 10 : false
        };
      });

      return {
        h2Text: h2?.textContent?.trim().replace(/\s+/g, ' '),
        cardsCount: cards.length,
        allCardsUnderHeadline: cardData.every(c => c.isUnderHeadline),
        cardData
      };
    });
    auditReport.connect[vp.name] = connectData;

    await page.close();
  }

  // 2. Interactive Test: Centered Contact Dialog & Scroll Lock
  console.log('Testing Centered Contact Dialog...');
  const testPage = await browser.newPage();
  await testPage.setViewport({ width: 1440, height: 900 });
  await testPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  await testPage.evaluate(() => {
    const hero = document.getElementById('home');
    if (hero) hero.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  // Trigger modal
  await testPage.evaluate(() => {
    const hero = document.getElementById('home');
    const buttons = Array.from(hero?.querySelectorAll('button, a') || []);
    const chatBtn = buttons.find(b => b.textContent.includes("Let's chat"));
    if (chatBtn) chatBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Measure modal center alignment and scroll lock
  const dialogCheck = await testPage.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    const r = dialog?.getBoundingClientRect();
    const bodyOverflow = document.body.style.overflow;
    const isHorizCentered = r ? Math.abs((r.left + r.width / 2) - window.innerWidth / 2) < 5 : false;
    const isVertCentered = r ? Math.abs((r.top + r.height / 2) - window.innerHeight / 2) < 5 : false;

    const whatsappImg = dialog?.querySelector('svg[class*="whatsappIcon"]');
    const gmailImg = dialog?.querySelector('svg[class*="gmailIcon"]');

    return {
      bodyOverflow,
      isScrollLocked: bodyOverflow === 'hidden',
      dialogRect: { top: Math.round(r?.top || 0), left: Math.round(r?.left || 0), width: Math.round(r?.width || 0), height: Math.round(r?.height || 0) },
      isHorizCentered,
      isVertCentered,
      hasWhatsappLogo: !!whatsappImg,
      hasGmailLogo: !!gmailImg
    };
  });
  auditReport.contactDialog.desktop = dialogCheck;

  await testPage.screenshot({ path: path.join(outDir, 'p6_contact_dialog_centered_desktop.png') });

  // Mobile centered dialog check
  await testPage.setViewport({ width: 390, height: 844, isMobile: true });
  await new Promise(r => setTimeout(r, 300));

  const mobileDialogCheck = await testPage.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    const r = dialog?.getBoundingClientRect();
    const isHorizCentered = r ? Math.abs((r.left + r.width / 2) - window.innerWidth / 2) < 5 : false;
    const isVertCentered = r ? Math.abs((r.top + r.height / 2) - window.innerHeight / 2) < 5 : false;
    return {
      dialogRect: { top: Math.round(r?.top || 0), left: Math.round(r?.left || 0), width: Math.round(r?.width || 0), height: Math.round(r?.height || 0) },
      isHorizCentered,
      isVertCentered
    };
  });
  auditReport.contactDialog.mobile = mobileDialogCheck;

  await testPage.screenshot({ path: path.join(outDir, 'p6_contact_dialog_centered_mobile.png') });

  // 3. Test Scroll Transition & Flicker Frame-by-Frame
  console.log('Testing Scene 2 to Scene 3 stacked cover transition...');
  await testPage.setViewport({ width: 1440, height: 900 });
  await testPage.goto('http://localhost:3000#home', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  const transitionFrames = [];
  for (let step = 0; step <= 10; step++) {
    // scroll incrementally
    await testPage.evaluate((s) => {
      window.scrollBy(0, 75);
    }, step);
    await new Promise(r => setTimeout(r, 100));

    const frameInfo = await testPage.evaluate(() => {
      const hero = document.getElementById('home');
      const about = document.getElementById('about');
      const heroHold = hero?.closest('div[class*="hold"]');
      const aboutHold = about?.closest('div[class*="hold"]');
      const heroR = heroHold?.getBoundingClientRect();
      const aboutR = aboutHold?.getBoundingClientRect();

      return {
        scrollY: Math.round(window.scrollY),
        heroTop: Math.round(heroR?.top || 0),
        heroOpacity: heroHold ? window.getComputedStyle(heroHold).opacity : '1',
        aboutTop: Math.round(aboutR?.top || 0),
        aboutOpacity: aboutHold ? window.getComputedStyle(aboutHold).opacity : '1',
        aboutZIndex: aboutHold ? window.getComputedStyle(aboutHold).zIndex : '0',
        heroZIndex: heroHold ? window.getComputedStyle(heroHold).zIndex : '0'
      };
    });
    transitionFrames.push(frameInfo);
  }
  auditReport.transitionCheck = transitionFrames;

  // Capture transition mid-scroll screenshot
  await testPage.screenshot({ path: path.join(outDir, 'p6_transition_cover.png') });

  // 4. Capture Leadpro logo close-up in Credentials
  await testPage.evaluate(() => {
    const cred = document.getElementById('credentials');
    if (cred) cred.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  await testPage.screenshot({ path: path.join(outDir, 'p6_credentials_leadpro_logo.png') });

  await testPage.close();
  await browser.close();

  fs.writeFileSync(path.join(outDir, 'prompt6_audit_report.json'), JSON.stringify(auditReport, null, 2));
  console.log('Saved prompt6_audit_report.json successfully!');
}

runAudit().catch(console.error);

