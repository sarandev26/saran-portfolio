const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.join(__dirname, '..', 'public', 'screenshots');

async function captureExtras() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Case study page
  await page.goto('http://localhost:3000/work/seven-star-luxury-hotel-cafe', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'p5_case_study_text_link.png') });

  // 2. Animated project card close-up
  await page.goto('http://localhost:3000#work', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button[role="tab"]'));
    const animBtn = btns.find(b => b.textContent.includes('Animated'));
    if (animBtn) animBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const cardClip = await page.evaluate(() => {
    const card = document.querySelector('article[class*="card"]');
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
  });

  if (cardClip) {
    await page.screenshot({
      path: path.join(outDir, 'p5_animated_card_closeup.png'),
      clip: { x: Math.max(0, cardClip.x), y: Math.max(0, cardClip.y), width: cardClip.width, height: cardClip.height }
    });
  }

  // 3. Side-by-side Before/After for Connect section
  const connectBeforeBase64 = fs.existsSync(path.join(outDir, 'connect_1440x900.png'))
    ? fs.readFileSync(path.join(outDir, 'connect_1440x900.png')).toString('base64')
    : null;
  const connectAfterBase64 = fs.readFileSync(path.join(outDir, 'p5_connect_1440x900.png')).toString('base64');

  const compHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 28px; background: #0b0f19; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        h1 { font-size: 24px; margin: 0 0 6px; font-weight: 800; }
        p { color: #94a3b8; font-size: 13.5px; margin: 0 0 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: #131b2e; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
        .header { padding: 12px 18px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .badge { padding: 3px 8px; border-radius: 5px; font-size: 11px; font-weight: 800; }
        .b-before { background: #ef4444; color: #fff; }
        .b-after { background: #10b981; color: #fff; }
        img { width: 100%; height: auto; display: block; }
      </style>
    </head>
    <body>
      <h1>Connect Section: 4 New User Photos & Updated Headline</h1>
      <p>Before: "Open to UI/UX roles and product design collaborations." with old gallery mix · After: "Open to roles and projects." with 4 new photos in clockwise order (3:4 ratio)</p>
      <div class="grid">
        <div class="card">
          <div class="header">
            <span class="badge b-before">BEFORE</span>
            <span>Old Collage & Headline</span>
          </div>
          ${connectBeforeBase64 ? `<img src="data:image/png;base64,${connectBeforeBase64}">` : ''}
        </div>
        <div class="card">
          <div class="header">
            <span class="badge b-after">AFTER (FIXED)</span>
            <span>4 New Photos Clockwise (3:4 Ratio)</span>
          </div>
          <img src="data:image/png;base64,${connectAfterBase64}">
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(compHtml, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'p5_connect_before_after.png') });

  // 4. Hero Before/After (Prompt 4 vs Prompt 5: larger portrait, new headline)
  const heroP4Base64 = fs.existsSync(path.join(outDir, 'hero_1440x900.png'))
    ? fs.readFileSync(path.join(outDir, 'hero_1440x900.png')).toString('base64')
    : null;
  const heroP5Base64 = fs.readFileSync(path.join(outDir, 'p5_hero_1440x900.png')).toString('base64');

  const heroCompHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 28px; background: #0b0f19; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        h1 { font-size: 24px; margin: 0 0 6px; font-weight: 800; }
        p { color: #94a3b8; font-size: 13.5px; margin: 0 0 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: #131b2e; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
        .header { padding: 12px 18px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .badge { padding: 3px 8px; border-radius: 5px; font-size: 11px; font-weight: 800; }
        .b-before { background: #64748b; color: #fff; }
        .b-after { background: #10b981; color: #fff; }
        img { width: 100%; height: auto; display: block; }
      </style>
    </head>
    <body>
      <h1>Hero Evolution: Headline, +18% Portrait Height, "2+ Years"</h1>
      <p>Before: "Every great design begins..." · After: "I design products people love to use." with +18% larger portrait, "2+" stat card, and Contact Dialog</p>
      <div class="grid">
        <div class="card">
          <div class="header">
            <span class="badge b-before">PREVIOUS BUILD</span>
            <span>Smaller Portrait & Old Headline</span>
          </div>
          ${heroP4Base64 ? `<img src="data:image/png;base64,${heroP4Base64}">` : ''}
        </div>
        <div class="card">
          <div class="header">
            <span class="badge b-after">AFTER (FIXED)</span>
            <span>+18% Portrait, New Headline, "2+ Years", 0 Overlap</span>
          </div>
          <img src="data:image/png;base64,${heroP5Base64}">
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(heroCompHtml, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'p5_hero_before_after.png') });

  // 5. Work card comparison: Old pill button vs New bottom row text link
  const workCompHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 28px; background: #0b0f19; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        h1 { font-size: 24px; margin: 0 0 6px; font-weight: 800; }
        p { color: #94a3b8; font-size: 13.5px; margin: 0 0 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: #131b2e; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
        .header { padding: 12px 18px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .badge { padding: 3px 8px; border-radius: 5px; font-size: 11px; font-weight: 800; }
        .b-before { background: #ef4444; color: #fff; }
        .b-after { background: #10b981; color: #fff; }
        .content { padding: 20px; background: #f4f4f6; color: #141414; }
        .mock-meta-old { background: #fff; border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.06); }
        .mock-meta-new { background: #fff; border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.06); }
        .pill-btn { background: #ff2e0f; color: #fff; border-radius: 999px; padding: 5px 12px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; float: right; }
        .text-link { color: #ff2e0f; font-size: 12px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; }
        .foot-row { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
      </style>
    </head>
    <body>
      <h1>Work Cards: "View Demo" Restyled from Pill Button to Plain Text Link</h1>
      <p>Before: Pill button collided near heading area · After: Clean plain text link in bottom row beside "Case study →"</p>
      <div class="grid">
        <div class="card">
          <div class="header">
            <span class="badge b-before">BEFORE</span>
            <span>Pill Button In Header Area</span>
          </div>
          <div class="content">
            <div class="mock-meta-old">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:11px; color:#999;">ORIGIN</span>
                <span class="pill-btn">View Demo ↗</span>
              </div>
              <h3 style="margin:4px 0; font-size:16px;">Seven Star Luxury Hotel</h3>
              <p style="font-size:12px; color:#666; margin:6px 0;">3D immersive website design...</p>
              <div class="foot-row">
                <span style="font-size:12px; font-weight:800; color:#ff2e0f;">Animated</span>
                <span style="font-size:12px; font-weight:700;">Case study →</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="header">
            <span class="badge b-after">AFTER (FIXED)</span>
            <span>Plain Text Link in Bottom Row</span>
          </div>
          <div class="content">
            <div class="mock-meta-new">
              <h3 style="margin:4px 0; font-size:16px;">Seven Star Luxury Hotel</h3>
              <p style="font-size:12px; color:#666; margin:6px 0;">3D immersive website design...</p>
              <div class="foot-row">
                <span style="font-size:12px; font-weight:800; color:#ff2e0f;">Animated</span>
                <div style="display:inline-flex; align-items:center; gap:12px;">
                  <span class="text-link">View Demo ↗</span>
                  <span style="font-size:12px; font-weight:700;">Case study →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(workCompHtml, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'p5_work_card_before_after.png') });

  await page.close();
  await browser.close();
  console.log('Saved all comparison screenshots!');
}

captureExtras().catch(console.error);
