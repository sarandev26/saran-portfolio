const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'screenshots');

async function makeBeforeAfter() {
  const puppeteer = require('puppeteer-core');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1700, height: 950 });

  const beforeBase64 = fs.readFileSync(path.join(outDir, 'hero_overlap_before.jpg')).toString('base64');
  const afterBase64 = fs.readFileSync(path.join(outDir, 'hero_1280x720.png')).toString('base64');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          margin: 0;
          padding: 32px;
          background: #090d16;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        h1 {
          font-size: 26px;
          margin: 0 0 8px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 24px;
        }
        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1600px;
          width: 100%;
        }
        .card {
          background: #111827;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
        }
        .header {
          padding: 14px 20px;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .badge-before {
          background: #ef4444;
          color: #fff;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .badge-after {
          background: #10b981;
          color: #fff;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .desc {
          color: #94a3b8;
          font-size: 12.5px;
          margin-left: auto;
        }
        .img-wrap {
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 720px;
          overflow: hidden;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
      </style>
    </head>
    <body>
      <h1>Hero Rebuild Comparison: Overlap & Side Shadows Fixed</h1>
      <p>Before: User report showing buttons colliding into face/subline with dirty side shadows · After: Normal flow with 85px+ safe gap, clean symmetric background, Image 1 portrait</p>
      <div class="container">
        <div class="card">
          <div class="header">
            <span class="badge-before">BEFORE</span>
            <span>Overlapping Elements & Dirty Side Blobs</span>
            <span class="desc">Buttons collided with portrait; dark glow blobs</span>
          </div>
          <div class="img-wrap">
            <img src="data:image/jpeg;base64,${beforeBase64}">
          </div>
        </div>
        <div class="card">
          <div class="header">
            <span class="badge-after">AFTER (FIXED)</span>
            <span>Normal Flow Layout (1280x720)</span>
            <span class="desc">Eyebrow → Headline → Subline → CTAs → Portrait (85px+ gap)</span>
          </div>
          <div class="img-wrap">
            <img src="data:image/png;base64,${afterBase64}">
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outDir, 'hero_before_after.png') });
  await page.close();
  await browser.close();
  console.log('Saved hero_before_after.png successfully!');
}

makeBeforeAfter().catch(console.error);
