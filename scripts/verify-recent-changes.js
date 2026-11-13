const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.join(__dirname, '..', 'public', 'screenshots');

async function testVisual() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Inspect Work Section
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));

  const workData = await page.evaluate(() => {
    const work = document.getElementById('work');
    const h2 = work?.querySelector('h2');
    const lede = work?.querySelector('p[class*="lede"]');
    const cards = Array.from(work?.querySelectorAll('article[class*="card"]') || []);

    const h2R = h2?.getBoundingClientRect();
    const ledeR = lede?.getBoundingClientRect();

    const sampleCards = cards.slice(0, 4).map(c => {
      const title = c.querySelector('h3')?.textContent?.trim();
      const hook = c.querySelector('p[class*="contribution"]')?.textContent?.trim();
      const actionBtn = c.querySelector('a[class*="actionBtn"]')?.textContent?.trim();
      const tags = c.querySelector('p[class*="tags"]');
      const originBadge = c.querySelector('span[class*="originBadge"]');
      const categoryPill = c.querySelector('span[class*="year"]');

      return {
        title,
        hook,
        actionBtn,
        hasTags: !!tags,
        hasOriginBadge: !!originBadge,
        hasCategoryPill: !!categoryPill
      };
    });

    const assetCard = cards.find(c => c.textContent.includes('Asset Management Mobile App'));
    const assetCardData = assetCard ? {
      title: assetCard.querySelector('h3')?.textContent?.trim(),
      hook: assetCard.querySelector('p[class*="contribution"]')?.textContent?.trim(),
      actionBtn: assetCard.querySelector('a[class*="actionBtn"]')?.textContent?.trim(),
      hasTags: !!assetCard.querySelector('p[class*="tags"]'),
      hasOriginBadge: !!assetCard.querySelector('span[class*="originBadge"]'),
      hasCategoryPill: !!assetCard.querySelector('span[class*="year"]')
    } : null;

    return {
      h2Left: Math.round(h2R?.left || 0),
      ledeLeft: Math.round(ledeR?.left || 0),
      isLedeStraightAligned: Math.abs((h2R?.left || 0) - (ledeR?.left || 0)) < 4,
      sampleCards,
      assetCardData
    };
  });
  console.log('Work check:', JSON.stringify(workData, null, 2));
  await page.screenshot({ path: path.join(outDir, 'verify_work_cards.png') });

  // 2. Inspect Certifications
  await page.evaluate(() => {
    const el = document.getElementById('credentials');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));

  // Scroll a bit down inside credentials to activate panel 1.3
  // In deckMode, panel 1.3 is panel index 2 (targetP = 2)
  await page.evaluate(() => {
    const el = document.getElementById('credentials');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + window.innerHeight * 1.5, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const certData = await page.evaluate(() => {
    const cred = document.getElementById('credentials');
    const panels = Array.from(cred?.querySelectorAll('article[class*="panel"]') || []);
    return panels.map(p => {
      const no = p.querySelector('span[class*="no"]')?.textContent?.trim();
      const issuer = p.querySelector('span[class*="issuerName"]')?.textContent?.trim();
      const issuedBy = p.querySelector('dd')?.textContent?.trim();
      const overview = p.querySelector('p[class*="descriptionText"]')?.textContent?.trim();
      const title = p.querySelector('h3[class*="title"]')?.textContent?.trim();
      return { no, issuer, issuedBy, title, overview };
    });
  });
  console.log('Cert check:', JSON.stringify(certData, null, 2));
  await page.screenshot({ path: path.join(outDir, 'verify_certifications.png') });

  // 3. Inspect Connect Section
  await page.evaluate(() => {
    const el = document.getElementById('connect');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));

  const connectData = await page.evaluate(() => {
    const connect = document.getElementById('connect');
    const cards = Array.from(connect?.querySelectorAll('div[class*="collageCard"]') || []);
    const photoSizes = cards.map(c => {
      const r = c.getBoundingClientRect();
      return {
        width: Math.round(r.width),
        height: Math.round(r.height)
      };
    });

    const emailBtn = Array.from(connect?.querySelectorAll('button[class*="social"], a[class*="social"]') || [])
      .find(btn => btn.textContent.includes('Email'));
    const emailSvg = emailBtn?.querySelector('span[class*="glyph"] svg');

    return {
      photoSizes,
      hasEmailSvg: !!emailSvg
    };
  });
  console.log('Connect check:', JSON.stringify(connectData, null, 2));
  await page.screenshot({ path: path.join(outDir, 'verify_connect.png') });

  await page.close();
  await browser.close();
  console.log('Visual test completed successfully!');
}

testVisual().catch(console.error);
