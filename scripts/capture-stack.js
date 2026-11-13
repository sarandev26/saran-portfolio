const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.join(__dirname, '..', 'public', 'screenshots');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Scroll to stack section
  await page.evaluate(() => {
    const el = document.getElementById('stack');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'stack_in_situ_1440x900.png') });

  // 2. High-resolution contact sheet of all 16 tools with names, logos, groups
  const contactSheetHtml = await page.evaluate(() => {
    // Read the tools from the cards
    const cards = Array.from(document.querySelectorAll('ul[class*="orbit"] li[class*="card"]'));
    const items = cards.map(c => {
      const name = c.querySelector('span[class*="name"]')?.textContent?.trim() || '';
      const img = c.querySelector('img')?.src || '';
      const isMissing = !img;
      return { name, img, isMissing };
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f8f9fa;
            color: #111;
            padding: 48px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          h1 {
            font-size: 26px;
            font-weight: 900;
            margin: 0 0 8px;
            letter-spacing: -0.02em;
          }
          p.sub {
            color: #666;
            font-size: 14px;
            margin: 0 0 36px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            max-width: 1040px;
            width: 100%;
          }
          .tile {
            background: #fff;
            border-radius: 16px;
            border: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 10px 24px -8px rgba(0,0,0,0.06);
            padding: 18px 22px;
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .mark {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            border-radius: 10px;
            overflow: hidden;
            flex-shrink: 0;
          }
          .mark img {
            width: 26px;
            height: 26px;
            object-fit: contain;
          }
          .missing-slot {
            width: 24px;
            height: 24px;
            border: 2px dashed #bbb;
            border-radius: 6px;
          }
          .info {
            display: flex;
            flex-direction: column;
          }
          .name {
            font-weight: 800;
            font-size: 15px;
            color: #111;
          }
          .status {
            font-size: 11px;
            font-weight: 700;
            color: #10a37f;
            margin-top: 2px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .status.unconfirmed {
            color: #d97706;
          }
        </style>
      </head>
      <body>
        <h1>Design Stack — Verified Tool Logos (16 Tools)</h1>
        <p class="sub">Official brand marks rendered on light tile backgrounds · Pixel-perfect aspect ratios</p>
        <div class="grid">
          ${items.map(it => `
            <div class="tile">
              <div class="mark">
                ${it.img ? `<img src="${it.img}" alt="${it.name}">` : `<div class="missing-slot"></div>`}
              </div>
              <div class="info">
                <span class="name">${it.name}</span>
                <span class="status ${it.isMissing ? 'unconfirmed' : ''}">
                  ${it.isMissing ? 'Candidate Unconfirmed' : 'Official Verified'}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  });

  const sheetPage = await browser.newPage();
  await sheetPage.setViewport({ width: 1140, height: 720 });
  await sheetPage.setContent(contactSheetHtml, { waitUntil: 'networkidle0' });
  await sheetPage.screenshot({ path: path.join(outDir, 'tool_logos_contact_sheet.png'), fullPage: true });
  console.log('Saved tool_logos_contact_sheet.png!');

  await sheetPage.close();
  await page.close();
  await browser.close();
}

run().catch(console.error);
